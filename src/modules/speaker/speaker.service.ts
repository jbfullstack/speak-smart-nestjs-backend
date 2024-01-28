import {
  Injectable,
  InternalServerErrorException,
  Logger,
  Res,
} from '@nestjs/common';
import { ChatGptApiService } from 'src/modules/openai/chat-gpt-api/chat-gpt-api.service';
import { TextToSpeechService } from 'src/modules/openai/text-to-speech/text-to-speech.service';
import {
  TextChatWithSpeakerInputDTO,
  CreateSpeakerSessionInputDTO,
  VerbalChatWithSpeakerInputDTO,
} from './model/speaker.dto';
import { TextToSpeechInputDto } from 'src/modules/openai/text-to-speech/models/text-to-speech-input.dto';

import * as fs from 'fs';
import * as path from 'path';

import * as ffmpeg from 'fluent-ffmpeg';
import { OpenAIApi, Configuration } from 'openai';
import { AxiosResponse } from 'axios';
import { ChatSecurityService } from '../chat/chat-security/chat-security.service';
import { ChatPersonality } from './struct/chat-personality';

@Injectable()
export class SpeakerService {
  private readonly logger: Logger = new Logger(SpeakerService.name);
  private readonly openAiApi: OpenAIApi;

  constructor(
    private readonly chatService: ChatGptApiService,
    private readonly textToSpeechService: TextToSpeechService,
    private readonly chatSecurity: ChatSecurityService,
  ) {
    const configuration = new Configuration({
      organization: process.env.ORGANIZATION_ID,
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.openAiApi = new OpenAIApi(configuration);
  }

  private loadPromptFile(): string {
    let filePath = path.join(
      process.cwd(),
      'src',
      'modules',
      'speaker',
      'prompt',
      'speaker.prompt',
    );

    try {
      return fs.readFileSync(filePath, 'utf8');
    } catch (error) {
      throw new InternalServerErrorException(
        `ChatSecurityService can't load security prompt: ${error}`,
      );
    }
  }

  getSystemMessageWithPersonality(userName: string, personality: string) {
    let prompt = this.loadPromptFile();
    const chatPersonality = ChatPersonality.getInstance();
    return `${prompt}. ${chatPersonality.getPersonalityDescription(
      personality,
    )}.My username is '${userName}'. Call me '${userName}' when you need to address me or if I ask you my name.`;
  }

  buildSessionData(data: CreateSpeakerSessionInputDTO) {
    const sessionData = {
      ...data,
      systemMessage: this.getSystemMessageWithPersonality(
        data.userName,
        data.personality,
      ),
    };

    return sessionData;
  }

  async getAiResponse(
    uuid: string,
    userName: string,
    data: TextChatWithSpeakerInputDTO,
  ): Promise<string> {
    const gptResponse =
      await this.chatService.getAiModelResponseFromUserSession(
        uuid,
        userName,
        data,
      );

    const isAiMessageAcceptable = await this.chatSecurity.controleMessage(
      gptResponse.aiMessage,
    );
    return isAiMessageAcceptable
      ? gptResponse.aiMessage
      : 'we are sorry, an inacceptable message was generated.';
  }

  async getWrittenSpeakerResponse(
    uuid: string,
    userName: string,
    data: TextChatWithSpeakerInputDTO,
  ): Promise<string> {
    return this.getAiResponse(uuid, userName, data);
  }

  async getSpokenpeakerResponse(
    uuid: string,
    userName: string,
    data: VerbalChatWithSpeakerInputDTO,
    isRecording: boolean = false,
  ) {
    const textToGenerate = await this.getAiResponse(uuid, userName, data);

    const audioStream = await this.textToSpeechService.textToSpeech(
      textToGenerate,
      data.voice,
    );

    if (isRecording) {
      this.storeAudioFile(audioStream);
    }
    return audioStream.data;
  }

  async storeAudioFile(audioStream: AxiosResponse<any, any>) {
    // Define the path where you want to save the MP3 file
    const savePath = path.join(__dirname, 'audio.mp3'); // You can customize the file name and path

    // Create a writable stream to save the MP3 file
    const fileStream = fs.createWriteStream(savePath);

    // Promise to track when saving to file is complete
    const fileSaving = new Promise<void>((resolve, reject) => {
      fileStream.on('finish', () => resolve());
      fileStream.on('error', reject);
    });

    // Pipe the response data to the file stream
    audioStream.data.pipe(fileStream);

    await fileSaving;
    this.logger.log(`MP3 audio saved to ${savePath}`);
  }

  async speechToText(audioStream): Promise<string> {
    const {
      data: { text },
    } = await this.openAiApi.createTranscription(audioStream.data, 'whisper-1');
    return text;
  }
}
