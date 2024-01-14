import { Injectable, Logger, Res } from '@nestjs/common';
import { ChatGptApiService } from 'src/modules/openai/chat-gpt-api/chat-gpt-api.service';
import { TextToSpeechService } from 'src/modules/openai/text-to-speech/text-to-speech.service';
import { ChatWithSpeakerInputDTO } from './model/speaker.dto';
import { TextToSpeechInputDto } from 'src/modules/openai/text-to-speech/models/text-to-speech-input.dto';

import * as fs from 'fs';
import * as path from 'path';

import * as ffmpeg from 'fluent-ffmpeg';
import { OpenAIApi, Configuration } from 'openai';
import { AxiosResponse } from 'axios';

const DEFAULT_MALE_VOICE = 'onyx';
const DEFAULT_FEMALE_VOICE = 'shimmer';

@Injectable()
export class SpeakerService {
  private readonly logger: Logger = new Logger(SpeakerService.name);
  // private readonly isRecording: boolean = false;
  private readonly openAiApi: OpenAIApi;

  constructor(
    private readonly chatService: ChatGptApiService,
    private readonly textToSpeechService: TextToSpeechService,
  ) {
    const configuration = new Configuration({
      organization: process.env.ORGANIZATION_ID,
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.openAiApi = new OpenAIApi(configuration);
  }
  // TODO: use postgres
  getSPeakerVoice(voice: string): string {
    return voice;
  }

  async getSpeakerResponse(
    uuid: string,
    userName: string,
    data: ChatWithSpeakerInputDTO,
    isRecording = false,
  ) {
    const gptResponse =
      await this.chatService.getAiModelResponseFromUserSession(
        uuid,
        userName,
        data,
      );

    const textToSpeechInput: TextToSpeechInputDto = {
      model: 'tts-1',
      voice: this.getSPeakerVoice(data.voice),
      input: gptResponse.aiMessage,
    };

    const audioStream = await this.textToSpeechService.textToSpeech(
      textToSpeechInput,
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
