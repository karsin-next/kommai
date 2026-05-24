import axios from 'axios';

const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;

export interface IntentResult {
  intent: 'book_appointment' | 'check_availability' | 'price_inquiry' | 'reschedule' | 'cancel' | 'human_handoff' | 'general_inquiry';
  entities: {
    service?: string;
    date?: string; // YYYY-MM-DD
    time?: string; // HH:mm
    name?: string;
    phone?: string;
  };
  isUrgent: boolean;
  confidence: number;
}

export class IntentService {
  /**
   * Uses Claude Haiku to detect intent and extract entities from a message.
   */
  static async detectIntent(message: string): Promise<IntentResult> {
    if (!CLAUDE_API_KEY) {
      console.warn('Claude API key missing. Using fallback intent.');
      return this.fallbackIntent(message);
    }

    try {
      const response = await axios.post(
        'https://api.anthropic.com/v1/messages',
        {
          model: 'claude-3-haiku-20240307',
          max_tokens: 1024,
          messages: [
            {
              role: 'user',
              content: `Analyze this WhatsApp message from a customer to a massage/wellness center and extract the intent and entities. 
              Today is ${new Date().toISOString().split('T')[0]}.
              
              Message: "${message}"
              
              Respond ONLY with a valid JSON object:
              {
                "intent": "book_appointment" | "check_availability" | "price_inquiry" | "reschedule" | "cancel" | "human_handoff" | "general_inquiry",
                "entities": { "service": string, "date": "YYYY-MM-DD", "time": "HH:mm", "name": string, "phone": string },
                "isUrgent": boolean,
                "confidence": number (0-1)
              }`
            }
          ]
        },
        {
          headers: {
            'x-api-key': CLAUDE_API_KEY,
            'anthropic-version': '2023-06-01',
            'Content-Type': 'application/json'
          }
        }
      );

      const content = response.data.content[0].text;
      return JSON.parse(content);
    } catch (error) {
      console.error('Intent detection failed:', error);
      return this.fallbackIntent(message);
    }
  }

  private static fallbackIntent(message: string): IntentResult {
    const msg = message.toLowerCase();
    if (msg.includes('book') || msg.includes('urut') || msg.includes('massage') || msg.includes('nak')) {
      return { intent: 'book_appointment', entities: {}, isUrgent: false, confidence: 0.5 };
    }
    return { intent: 'general_inquiry', entities: {}, isUrgent: false, confidence: 0.5 };
  }
}
