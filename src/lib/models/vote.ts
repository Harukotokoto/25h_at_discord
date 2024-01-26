import { model, Schema } from 'mongoose';

const vote_model = model(
  'vote',
  new Schema({
    GuildID: String,
    MessageID: String,
    UpMembers: [String],
    DownMembers: [String],
    Upvote: Number,
    Downvote: Number,
    Owner: String,
  })
);

export { vote_model };
