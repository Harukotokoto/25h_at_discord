import { model, Schema } from 'mongoose';

const config_model = model('config', new Schema({
  GuildID: String,
  Report: {
    status: Boolean,
    LogChannel: String,
  },
}));

export { config_model };