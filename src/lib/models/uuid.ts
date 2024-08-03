import { model, Schema } from 'mongoose';

const uuid_model = model(
  'uuid',
  new Schema({
    UserID: {
      type: String,
      required: true,
    },
    UUID: {
      type: String,
      required: true,
    },
  })
);

export { uuid_model };
