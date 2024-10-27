import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Client (React) code
import CryptoJS from 'crypto-js';

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}


export const readFileAsDataURL = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') resolve(reader.result);
    }
    reader.readAsDataURL(file);
  })
}



const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY;
const ENCRYPTION_IV = import.meta.env.VITE_ENCRYPTION_IV;

const key = CryptoJS.enc.Hex.parse(ENCRYPTION_KEY);
const iv = CryptoJS.enc.Hex.parse(ENCRYPTION_IV);

export function encrypt(text) {
  return CryptoJS.AES.encrypt(text, key, { iv: iv }).toString();
}

export function decrypt(encryptedText) {
  const bytes = CryptoJS.AES.decrypt(encryptedText, key, { iv: iv });
  return bytes.toString(CryptoJS.enc.Utf8);
}




