import * as crypto from 'crypto';

export const STRING_ENCRYPTION_SECRET_KEY = process.env.STRING_ENCRYPTION_SECRET_KEY || '';

const cryptoConfig = {
  algorithm: 'aes-256-cbc',
  splitCode: '.',
};

type Encrypt = {
  value: string;
  randomBytes?: number;
  key?: string;
};

type Decrypt = {
  value: string;
  key?: string;
};

export class CryptoV2 {
  private readonly key = Buffer.from(STRING_ENCRYPTION_SECRET_KEY.split('-').join(''));
  private readonly randomBytes = 16;

  private getBufferHex(value: string) {
    return Buffer.from(value, 'hex');
  }

  private newKey(key: string) {
    return Buffer.from(key);
  }

  encrypt({ value, key }: Encrypt) {
    const newKey = !!key ? this.newKey(key) : this.key;

    const iv = Buffer.from(crypto.randomBytes(this.randomBytes));

    const cipher = crypto.createCipheriv(cryptoConfig.algorithm, newKey, iv);
    const encrypted = cipher.update(value.trim());

    const result = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + cryptoConfig.splitCode + result.toString('hex');
  }

  decrypt({ value, key }: Decrypt) {
    const newKey = !!key ? this.newKey(key) : this.key;

    const [iv, encrypted] = value.split(cryptoConfig.splitCode);
    const ivBuffer = this.getBufferHex(iv);
    const encryptedBuffer = this.getBufferHex(encrypted);

    const decipher = crypto.createDecipheriv(cryptoConfig.algorithm, newKey, ivBuffer);
    const decrypted = decipher.update(encryptedBuffer);

    const result = Buffer.concat([decrypted, decipher.final()]);
    return result.toString();
  }
}
