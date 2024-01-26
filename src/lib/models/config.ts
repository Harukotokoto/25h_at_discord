import { model, Schema } from 'mongoose';

const config_model = model('config', new Schema({
  GuildID: {
    type: String,
    required: true,
    unique: true,
  },
  Report: {
    status: {
      type: Boolean,
    },
    LogChannel: {
      type: String,
    },
    default: {
      status: false,
      LogChannel: undefined,
    },
    unique: true,
  },
}));

export { config_model }