import axios from 'axios';

export class Quote {
  private text;
  private avatarURL;
  private username;
  private display_name;
  private color;
  private watermark;

  public constructor() {
    this.text = '';
    this.avatarURL = '';
    this.username = '';
    this.display_name = '';
    this.color = true;
    this.watermark = '';
  }

  public setText = (text: string) => {
    this.text = text;
    return this;
  };

  public setAvatarURL = (url: string) => {
    this.avatarURL = url;
    return this;
  };

  public setUsername = (username: string) => {
    this.username = username;
    return this;
  };

  public setDisplayName = (display_name: string) => {
    this.display_name = display_name;
    return this;
  };

  public setColor = (color: boolean = true) => {
    this.color = color;
    return this;
  };

  public setWatermark = (watermark: string) => {
    this.watermark = watermark;
    return this;
  };

  public build = async () => {
    const { text, avatarURL, username, display_name, color, watermark } = this;

    if (!text) throw new Error('テキストが指定されていません');
    if (!avatarURL) throw new Error('アバターが指定されていません');
    if (!username) throw new Error('ユーザー名が指定されていません');
    if (!display_name) throw new Error('表示名が指定されていません');
    if (!color) throw new Error('カラーモードが指定されていません');
    if (!watermark) throw new Error('ウォーターマークが指定されていません');

    const response = await axios.post(`${process.env.VOIDS_API}/fakequote`, {
      text: text,
      avatar: avatarURL,
      username: username,
      display_name: display_name,
      color: color,
      watermark: watermark,
    });

    const imageBuffer = await axios.get(response.data.url, {
      responseType: 'arraybuffer',
    });

    return {
      binary: Buffer.from(imageBuffer.data, 'binary'),
      url: response.data.url,
    };
  };
}
