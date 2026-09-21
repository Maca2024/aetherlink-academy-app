import {Schema} from 'effect';
import {ChatMessageId, ChatThreadId, ParticipantId, RoomId} from './ids.ts';

export const ChatThread = Schema.Struct({
  id: ChatThreadId,
  roomId: RoomId,
  title: Schema.optional(Schema.String),
  createdAt: Schema.String,
});
export type ChatThread = Schema.Schema.Type<typeof ChatThread>;

export const ChatAuthorRole = Schema.Literals(['facilitator', 'participant']);

export const ChatMessage = Schema.Struct({
  id: ChatMessageId,
  threadId: ChatThreadId,
  authorId: ParticipantId,
  authorRole: ChatAuthorRole,
  body: Schema.String,
  createdAt: Schema.String,
});
export type ChatMessage = Schema.Schema.Type<typeof ChatMessage>;

export const decodeChatThread = (input: unknown): ChatThread => Schema.decodeUnknownSync(ChatThread)(input);
export const decodeChatMessage = (input: unknown): ChatMessage => Schema.decodeUnknownSync(ChatMessage)(input);
