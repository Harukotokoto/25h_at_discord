import { UUID } from './UUID';
import { Economy } from './Economy';
import { gift_model } from '../../models/gift';
import { createRandomID } from '../../utils/createRandomID';

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

      const targetUUID = new UUID(target)

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
}

export { Gift }