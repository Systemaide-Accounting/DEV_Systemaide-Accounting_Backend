import CryptoJS from "crypto-js";
import dotenv from "dotenv";

dotenv.config();

const secretKey = process.env.CRYPTO_SECRET;

// Encrypt TIN
export const encryptTIN = (tin) => {
  return CryptoJS.AES.encrypt(tin, secretKey).toString();
};

// Decrypt TIN
export const decryptTIN = (cipherText) => {
  const bytes = CryptoJS.AES.decrypt(cipherText, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
};
