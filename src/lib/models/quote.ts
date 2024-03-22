import { model, Schema } from 'mongoose';
import { randomUUID } from 'node:crypto';

const quote_model = model(
  'quotes',
  new Schema({
    user_id: {
      type: String,
      required: true,
    },
    id: {
      type: typeof randomUUID(),
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    quote_url: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      required: true,
    },
  })
);

export { quote_model };
