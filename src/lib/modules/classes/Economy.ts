import { economy_model } from '../../models/economy';

class Economy {
  public readonly uuid: string;
  constructor(uuid: string) {
    this.uuid = uuid;
  }

  public async getWallet(): Promise<Number> {
    const data = await this.getData();
    if (!data) {
      return 0;
    }

    return data.Wallet;
  }

  private async getData() {
    return economy_model.findOne({ UUID: this.uuid });
  }
}
