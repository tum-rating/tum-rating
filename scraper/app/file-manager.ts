import fs from 'fs';
import path from 'path';

const dataDir = path.join(__dirname, 'data');

export const createFile = (filename: string, content: string) => {
  const filePath = path.join(dataDir, filename);
  fs.writeFileSync(filePath, content, 'utf8');
};

export const readFile = (filename: string): string => {
  const filePath = path.join(dataDir, filename);
  return fs.readFileSync(filePath, 'utf8');
};

export const updateFile = (filename: string, content: string) => {
  const filePath = path.join(dataDir, filename);
  fs.writeFileSync(filePath, content, 'utf8');
};

export const deleteFile = (filename: string) => {
  const filePath = path.join(dataDir, filename);
  fs.unlinkSync(filePath);
};

export const listFiles = (): string[] => {
  return fs.readdirSync(dataDir);
};