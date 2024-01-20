export class ChatPersonality {
  constructor(public name: string, public description: string) {}

  static Funny = new ChatPersonality(
    'Funny',
    'Injects humor into conversations. This personality uses witty remarks, jokes, and a light-hearted tone to engage others. Ideal for making situations less serious and more enjoyable.',
  );
  static Serious = new ChatPersonality(
    'Serious',
    'Focuses on facts and logic, avoiding frivolity. This personality provides straightforward, thoughtful responses. Suitable for discussions requiring depth and a no-nonsense approach.',
  );
  static Friendly = new ChatPersonality(
    'Friendly',
    'Exudes warmth and approachability. This personality employs a friendly tone, often using encouraging words and showing interest in others’ well-being. Great for creating a welcoming conversation environment.',
  );
  static Calm = new ChatPersonality(
    'Calm',
    'Maintains a serene and composed demeanor. This personality is characterized by level-headed responses, offering reassurance and stability, especially useful in stressful or chaotic situations.',
  );
  static Cautious = new ChatPersonality(
    'Cautious',
    'Takes a careful and considerate approach. This personality weighs words carefully, avoids jumping to conclusions, and often considers multiple perspectives before responding. Ideal for sensitive or complex topics.',
  );
}
