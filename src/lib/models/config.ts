import { model, Schema } from 'mongoose';

const publish_model = model(
  'publish',
  new Schema({
    GuildID: {
      type: String,
      required: true,
    },
    ChannelID: {
      type: String,
      required: true,
    },
  })
);

const report_model = model(
  'report',
  new Schema({
    GuildID: {
      type: String,
      required: true,
    },
    ChannelID: {
      type: String,
      required: true,
    },
  })
);

const leveling_model = model(
  'leveling',
  new Schema({
    GuildID: {
      type: String,
      required: true,
    },
  })
);

export { publish_model, report_model, leveling_model };
