import { Schema, model } from "mongoose";

const admin_model = model('admin', new Schema({
  UserID: {type: String, required: true},
}))

export { admin_model }