import { model, Schema } from 'mongoose';

const ticket_setup_model = model(
  'ticket_setup',
  new Schema({
    MessageID: {
      type: String,
      required: true,
    },
    Category: {
      type: String,
      required: true,
    },
    TicketID: {
      type: String,
      required: true,
    },
    StaffRoleID: {
      type: String,
      required: true,
    },
  })
);

export { ticket_setup_model };
