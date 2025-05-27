import { HttpInterceptorFn } from '@angular/common/http';
import CryptoJS from 'crypto-js';
import { SystemConfig } from '../../../core/config/system.config';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const encryptedToken = SystemConfig.gitAccessToken;
  let decrypted = CryptoJS.AES.decrypt(encryptedToken, SystemConfig.encryptionKey);
  const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);
  const githubAccessToken = JSON.parse(decryptedString);
  const interceptedReq = req.clone({setHeaders: {Authorization: `token ${githubAccessToken}`}});
  return next(interceptedReq);
};
