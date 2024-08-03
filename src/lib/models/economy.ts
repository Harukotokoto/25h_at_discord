import { model, Schema } from 'mongoose';

const economy_model = model(
  'economy',
  new Schema({
    UUID: {
      type: String,
      required: true,
    },
    Wallet: {
      type: Number,
      required: true,
    },
    Bank: {
      type: Number,
      required: true,
    },
  })
);

export { economy_model };
