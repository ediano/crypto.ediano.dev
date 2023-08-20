import * as crypto from 'crypto';
import bcrypt from 'bcrypt';

export const STRING_ENCRYPTION_SECRET_KEY_V3 = process.env.STRING_ENCRYPTION_SECRET_KEY_V3 || '';

const algorithm = 'aes-256-cbc';
const splitCode = '<>';

type Encrypt = {
  value: string;
  password: string;
};

type Decrypt = {
  value: string;
  password: string;
};

export class CryptoV3 {
  private readonly key = Buffer.from(STRING_ENCRYPTION_SECRET_KEY_V3.split('-').join(''));
  private readonly randomBytes = 16;

  private getBufferHex(value: string) {
    return Buffer.from(value, 'hex');
  }

  private passwordHash(password: string) {
    const passwordHash = bcrypt.hashSync(password, 12);
    return passwordHash;
  }

  private passwordCompare(password: string, passwordHash: string) {
    const isAValidPassword = bcrypt.compareSync(password, passwordHash);
    return isAValidPassword;
  }

  private formatEncryptedString(iv: string, passwordHash: string, result: string) {
    const data = [iv, splitCode, passwordHash, splitCode, result];
    return data.join('');
  }

  async encrypt({ value, password }: Encrypt) {
    if (value.length < 1) {
      throw new Error('Data for encryption must have at least 1 character!');
    }

    if (password.length < 8) {
      throw new Error('Your password must be at least 8 characters long!');
    }

    const iv = Buffer.from(crypto.randomBytes(this.randomBytes));

    const cipher = crypto.createCipheriv(algorithm, this.key, iv);
    const encrypted = cipher.update(value.trim());
    const result = Buffer.concat([encrypted, cipher.final()]);

    const passwordHash = this.passwordHash(password);

    const data = this.formatEncryptedString(iv.toString('hex'), passwordHash, result.toString('hex'));
    return data;
  }

  async decrypt({ value, password }: Decrypt) {
    if (value.length < 1 || password.length < 8) {
      throw new Error('The credentials provided are not valid!');
    }

    const [iv, passwordHash, encrypted] = value.split(splitCode);

    if (!this.passwordCompare(password, passwordHash)) {
      throw new Error('The credentials provided are not valid!');
    }

    try {
      const ivBuffer = this.getBufferHex(iv);
      const encryptedBuffer = this.getBufferHex(encrypted);

      const decipher = crypto.createDecipheriv(algorithm, this.key, ivBuffer);
      const decrypted = decipher.update(encryptedBuffer);

      const result = Buffer.concat([decrypted, decipher.final()]);
      return result.toString();
    } catch (err) {
      throw new Error('The credentials provided are not valid!');
    }
  }
}
