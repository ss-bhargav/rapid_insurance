// import crypto from 'crypto';
import Cryptr from 'cryptr';
import CryptoJS from 'crypto-js';

export const EncryptTxnObject = (value) => {
  const jsonString = JSON.stringify(value);
  const cryptr = new Cryptr('Lmvit');
  const encrypted = cryptr.encrypt(jsonString);
  return encrypted;
};

export const DecryptTxnObject = (value) => {
  const cryptr = new Cryptr('Lmvit');
  const decryptedString = cryptr.decrypt(value);
  const jsonObject = JSON.parse(decryptedString);
  return jsonObject;
};

export const EncryptObject = (value) => {
  const jsonString = JSON.stringify(value);
  const cryypt = CryptoJS.AES.encrypt(JSON.stringify(jsonString), 'LMVit123').toString();
  return cryypt;
};

export const DecryptObject = (value) => {
  const decrypt = CryptoJS.AES.decrypt(value, 'LMVit123');
  const jsonObject = JSON.parse(decrypt.toString(CryptoJS.enc.Utf8));
  return JSON.parse(jsonObject);
};

export const Encrypt = (value) => {
  const algorithm = 'aes-256-cbc';
  const initVector = crypto.randomBytes(16);
  const Securitykey = crypto.randomBytes(32);
  const cipher = crypto.createCipheriv(algorithm, Securitykey, initVector);
  let encryptedData = cipher.update(value, 'utf-8', 'hex');
  encryptedData += cipher.final('hex');
  return encryptedData;
};

export const Decrypt = (encData) => {
  const algorithm = 'aes-256-cbc';
  const initVector = crypto.randomBytes(16);
  const Securitykey = crypto.randomBytes(32);
  const decipher = crypto.createDecipheriv(algorithm, Securitykey, initVector);
  let decryptedData = decipher.update(encData, 'hex', 'utf-8');
  decryptedData += decipher.final('utf8');
  return decryptedData;
};

// const algorithm = "aes-256-cbc";

// // generate 16 bytes of random data
// const initVector = crypto.randomBytes(16);

// // protected data
// const message = "This is a secret message";

// // secret key generate 32 bytes of random data
// const Securitykey = crypto.randomBytes(32);

// // the cipher function
// const cipher = crypto.createCipheriv(algorithm, Securitykey, initVector);

// // encrypt the message
// // input encoding
// // output encoding
// let encryptedData = cipher.update(message, "utf-8", "hex");

// encryptedData += cipher.final("hex");

// console.log("Encrypted message: " + encryptedData);
