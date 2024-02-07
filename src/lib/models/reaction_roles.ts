import { model, Schema } from 'mongoose';

const reaction_roles_model = model(
  'reaction_role',
  new Schema({
    RRID: {
      type: String,
      required: true,
    },
    MessageID: {
      type: String,
      required: true,
    },
    ChannelID: {
      type: String,
      required: true,
    },
    GuildID: {
      type: String,
      required: true,
    },
    Roles: [
      {
        RoleID: {
          type: String,
          required: true,
        },
        Label: {
          type: String,
          required: true,
        },
      },
    ],
  })
);

export { reaction_roles_model };
