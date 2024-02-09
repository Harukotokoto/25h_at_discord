import { model, Schema } from 'mongoose';

const messages_model = model('message', new Schema({
  MessageID: {
    type: String,
    required: true,
  },
  ChannelID: {
    type: String,
    required: true,
  },
  SentMessageID: {
    type: [String]
  }
}))

export { messages_model }