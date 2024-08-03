import { economy_model } from '../../models/economy';

class Economy {
  private readonly uuid: string;

  constructor(uuid: string) {
    this.uuid = uuid;

    return this;
  }

  public async getWallet(): Promise<number> {
    const data = await this.getData();
    if (!data) {
      return 0;
    }

    return data.Wallet;
  }

  public async getBank(): Promise<number> {
    const data = await this.getData();
    if (!data) {
      return 0;
    }

    return data.Bank;
  }

  public async addWallet(balance: number): Promise<boolean> {
    const data = await this.getData();
    if (!data) {
      const newData = new economy_model({
        UUID: this.uuid,
        Wallet: 0,
        Bank: 0,
      });

      newData.Wallet += balance;

      await newData.save();

      return true;
    }

    data.Wallet += balance;
    await data.save();

    return true;
  }

  public async addBank(balance: number): Promise<boolean> {
    const data = await this.getData();
    if (!data) {
      const newData = new economy_model({
        UUID: this.uuid,
        Wallet: 0,
        Bank: 0,
      });

      newData.Bank += balance;

      await newData.save();

      return true;
    }

    data.Bank += balance;
    await data.save();

    return true;
  }

  public async removeWallet(balance: number): Promise<boolean> {
    const data = await this.getData();
    if (!data) {
      return false;
    }

    data.Wallet -= balance;

    await data.save();
    return true;
  }

  public async deposit(balance: number): Promise<boolean> {
    const data = await this.getData();
    if (!data) {
      const newData = new economy_model({
        UUID: this.uuid,
        Wallet: 0,
        Bank: 0,
      });

      return false;
    }

    if (data.Wallet < balance) {
      return false;
    }

    data.Wallet -= balance;
    data.Bank += balance;

    await data.save();

    return true;
  }

  public async withdraw(balance: number): Promise<boolean> {
    const data = await this.getData();
    if (!data) {
      const newData = new economy_model({
        UUID: this.uuid,
        Wallet: 0,
        Bank: 0,
      });

      return false;
    }

    if (data.Bank < balance) {
      return false;
    }

    data.Bank -= balance;
    data.Wallet += balance;

    await data.save();

    return true;
  }

  private async getData() {
    return economy_model.findOne({ UUID: this.uuid });
  }
}

export { Economy };
