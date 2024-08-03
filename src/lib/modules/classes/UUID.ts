import { uuid_model } from '../../models/uuid';
import { randomUUID } from 'node:crypto';

class UUID {
  private readonly user_id: string;

  constructor(user_id: string) {
    this.user_id = user_id;
  }

  public async getUUID(): Promise<string> {
    const data = await uuid_model.findOne({ UserID: this.user_id });
    if (data) {
      return data.UUID;
    }

    const newData = new uuid_model({
      UserID: this.user_id,
      UUID: randomUUID(),
    });

    await newData.save();

    return newData.UUID;
  }
}

export { UUID };
