import { UUID } from './UUID';
import { Economy } from './Economy';
import { gift_model } from '../../models/gift';
import { createRandomID } from '../../utils/createRandomID';
import { client } from '../../../index';
import economy from '../../../commands/economy/economy';

class Gift {
  private readonly uuid: string;

  constructor(uuid: string) {
    this.uuid = uuid;
  }

  public async create(
    amount: number,
    method: string,
    target?: string
  ): Promise<{
    success: boolean;
    message: string;
  }> {
    const economy = new Economy(this.uuid);

    const bank = await economy.getBank();

    if (bank < amount * 1.1) {
      return {
        success: false,
        message:
          "'口座残高を上回る金額を指定することはできません。\\nギフトを作成するには10%の手数料を支払う必要があります'",
      };
    }

    if (method === 'code') {
      const code = createRandomID(8);
      const gift = new gift_model({
        CreatedBy: this.uuid,
        Amount: amount,
        Code: code,
      });

      await gift.save();

      await economy.removeFromBank(amount * 1.1);

      return {
        success: true,
        message: `${amount}コインのギフトを作成しました\nコード: ${code}`,
      };
    }

    if (method === 'direct') {
      if (!target) {
        return {
          success: false,
          message: '有効なユーザーを指定してください',
        };
      }

      await economy.removeFromBank(amount * 1.1);

      const targetUUID = new UUID(target);

      const targetEconomy = new Economy(await targetUUID.getUUID());
      await targetEconomy.addToBank(amount);

      return {
        success: true,
        message: 'ギフトを送信しました',
      };
    }

    return {
      success: false,
      message: '無効なメソッドです',
    };
  }

  public async use(code: string) {
    const gift = await Gift.getGift(code);
    if (!gift) {
      return {
        success: false,
        message: '無効なギフトです',
      };
    }

    const amount = gift.Amount;
    const user_id = await UUID.getUser(gift.CreatedBy);
    if (!user_id) {
      return {
        success: false,
        message: '送り主が無効です',
      };
    }

    const user = client.users.cache.get(user_id);
    if (!user) {
      return {
        success: false,
        message: '送り主が無効です',
      };
    }

    const economy = new Economy(this.uuid);
    await economy.addToBank(amount);

    return {
      success: true,
      message: `${user.displayName}(${user.tag})から${amount}コインのギフトを受け取りました\n\n口座残高: ${await economy.getBank()}コイン`,
    };
  }

  private static async getGift(code: string) {
    return gift_model.findOne({ Code: code });
  }
}

export { Gift };
