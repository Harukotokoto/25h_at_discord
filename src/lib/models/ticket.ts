import { model, Schema } from 'mongoose';

export const ticket = model(
  'ticket',
  new Schema({
    GuildID: String,
    TicketMemberID: String,
    TicketChannelID: String,
    ParentTicketChannelID: String,
    Rating: Number,
    Feedback: String,
    Closed: Boolean,
    MembersAdded: Array,
  })
);
