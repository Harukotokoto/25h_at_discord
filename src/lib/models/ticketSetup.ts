import { model, Schema } from 'mongoose';

export const ticket_setup = model(
  'ticket-setup',
  new Schema(
    {
      GuildID: String,
      FeedbackChannelID: String,
      TicketChannelID: String,
      StaffRoleID: String,
    },
    {
      strict: false,
    }
  )
);
