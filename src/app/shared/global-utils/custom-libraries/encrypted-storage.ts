import { SystemConfig } from "../../../core/config/system.config";
import CryptoJS from 'crypto-js';

enum ErrorCode {
    DecryptionFailed = "ERR: Failed to Decrypt"
}

export class EncryptedStorage {
    private encryptionKey: string;
    constructor() {
        this.encryptionKey = SystemConfig.encryptionKey;
    }

    private failedToDecrypt(): void {
        // reset all local stoages incase of any incorrect storage manipulation.
        this.clearAll();
    }

    public setItem(key: string, data: any) {
        const stringData = JSON.stringify(data);
        localStorage.setItem(key, this.encrypt(stringData));
    }

    public getItem(key: string): any | null {
        const storage = this.decrypt(localStorage.getItem(key));
        if(storage) {
            if(storage == ErrorCode.DecryptionFailed) {
                this.failedToDecrypt();
                return null;
            }
            return JSON.parse(storage);
        }
        return null;
    }

    public updateItem(key: string, cb: (data: any) => any) {
        const storage = this.decrypt(localStorage.getItem(key));
        if(storage) {
            if(storage == ErrorCode.DecryptionFailed) {
                this.failedToDecrypt();
                return null;
            }
            else {
                const newStorage = cb(JSON.parse(storage));
                this.setItem(key, newStorage);
                return newStorage;
            }
        }
        return null;
    }

    public removeItem(key: string) {
        localStorage.removeItem(key);
    }

    public clearAll() {
        localStorage.clear();
    }

    private encrypt(value: string) {
        let encrypted = CryptoJS.AES.encrypt(value, this.encryptionKey);
        return encrypted.toString();
    }

    private decrypt(value: string | null) {
        if(value) {
            let decrypted = CryptoJS.AES.decrypt(value, this.encryptionKey);
            const response = decrypted.toString(CryptoJS.enc.Utf8);
            if(response) {
                return response;
            } else {
                return ErrorCode.DecryptionFailed
            }
        } else {
            return null;
        }
    }
}