import { model, Schema } from 'mongoose';

const level = model(
  'level',
  new Schema(
    {
      UserID: {
        type: String,
        required: true,
      },
      GuildID: {
        type: String,
        required: true,
      },
      Experience: {
        type: Number,
        required: true,
      },
      Level: {
        type: Number,
        required: true,
      },
    },
    {
      timestamps: true,
    }
  )
);

export { level };
