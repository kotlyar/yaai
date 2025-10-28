import fs from 'fs';

/* Секретные токены */
export const YANDEX_DIRECT_TOKEN = fs.readFileSync('/run/secrets/YANDEX_DIRECT_TOKEN').toString();
export const OPENAI_API_KEY = fs.readFileSync('/run/secrets/OPENAI_API_KEY').toString();