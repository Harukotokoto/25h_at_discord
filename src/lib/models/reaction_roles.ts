import { model, Schema } from 'mongoose';

const reaction_roles_model = model(
  'reaction_role',
  new Schema({
    RRID: {
      type: String,
      required: true,
    },
    MessageID: String,
    GuildID: String,
    Roles: [
      {
        RoleID: String,
        Label: String,
      },
    ],
  })
);

export { reaction_roles_model };
