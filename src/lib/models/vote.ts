import { model, Schema } from 'mongoose';

const vote_model = model(
  'vote',
  new Schema({
    GuildID: {
      type: String,
      required: true,
    },
    MessageID: {
      type: String,
      required: true,
    },
    UpMembers: {
      type: [String],
    },
    DownMembers: {
      type: [String],
    },
    Upvote: {
      type: Number,
    },
    Downvote: {
      type: Number,
    },
    Owner: {
      type: String,
    },
  })
);

export { vote_model };
