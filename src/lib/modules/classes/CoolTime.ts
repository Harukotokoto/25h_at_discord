import { cool_time_model } from '../../models/cooltime';

class CoolTime {
  private uuid: string;

  constructor(uuid: string) {
    this.uuid = uuid;
  }

  async getCooltime(name: string): Promise<Date | null> {
    const doc = await cool_time_model.findOne({ UUID: this.uuid }).exec();
    if (doc) {
      const coolTime = doc.CoolTimes.find((ct) => ct.name === name);
      return coolTime ? coolTime.timestamp : null;
    }
    return null;
  }

  async setCooltime(UUID: string, name: string): Promise<boolean> {
    const doc = await cool_time_model.findOne({ UUID }).exec();
    const timestamp = new Date();

    if (doc) {
      const index = doc.CoolTimes.findIndex((ct) => ct.name === name);
      if (index !== -1) {
        doc.CoolTimes[index].timestamp = timestamp;
      } else {
        doc.CoolTimes.push({ name, timestamp });
      }
      await doc.save();
    } else {
      const newDoc = new cool_time_model({
        UUID,
        CoolTimes: [{ name, timestamp }],
      });
      await newDoc.save();
    }

    return true;
  }
}

export { CoolTime };
