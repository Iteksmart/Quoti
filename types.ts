
export interface QuoteData {
  quote: string;
  author: string;
  elaboration: string;
}

// The original Message type was ambiguous, leading to type errors.
// By defining a discriminated union, we can ensure type safety and allow
// TypeScript to correctly infer the type of `text` based on the `type` property.

type BaseMessage = { id: number };

type IntroMessage = BaseMessage & {
  type: 'intro';
  text: string;
};

type ErrorMessage = BaseMessage & {
  type: 'error';
  text: string;
};

type ThinkingMessage = BaseMessage & {
  type: 'thinking';
  text: string; // The text is '...' but it's still a string
};

type SentMessage = BaseMessage & {
  type: 'sent';
  text: QuoteData;
};

export type Message = IntroMessage | ErrorMessage | ThinkingMessage | SentMessage;
