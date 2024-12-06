import CryptoJS from "crypto-js";
import { generateCustomUuid } from "custom-uuid";

export class PasswordGen{
    static generateRawPassword(): string{
        let p1 = generateCustomUuid('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 9);
        let p2 = generateCustomUuid('0123456789', 2);
        let p3 = generateCustomUuid('!@$#&%?<>', 1);

        return p1+p2+p3;
    }

    static generateMD5Password(raw_password: string): string{
        return CryptoJS.MD5(raw_password).toString();
    }

    static blindPassword(){
        return 'xxxxxxxxxxxx';
    }
}