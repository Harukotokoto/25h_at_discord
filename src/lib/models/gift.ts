import { model, Schema } from 'mongoose';

const gift_model = model(
  'gift',
  new Schema({
    CreatedBy: {
      type: String,
      required: true,
    },
    Amount: {
      type: Number,
      required: true,
    },
    Code: {
      type: String,
      required: true,
    },
    Special: {
      type: Boolean,
      required: true,
    }
  })
);

export { gift_model };
