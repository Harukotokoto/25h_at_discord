import { model, Schema } from 'mongoose';

const received_gifts_model = model('received_gifts', new Schema({
  ReceivedGifts: {
    type: [String],
    required: true,
  },
  UUID: {
    type: String,
    required: true,
  }
}));

export { received_gifts_model };