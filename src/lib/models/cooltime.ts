import { model, Schema } from 'mongoose';

const cooltimes_schema = new Schema({
  name: { type: String, required: true },
  timestamp: { type: Date, required: true },
});

const cool_time_model = model(
  'cool_time',
  new Schema({
    UUID: {
      type: String,
      required: true,
    },
    CoolTimes: {
      type: [cooltimes_schema],
      default: [],
    },
  })
);

export { cool_time_model };
