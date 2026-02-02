const fs = require('fs-extra');
const path = require('path');

const createDirectory = async (dirPath) => {
  try {
    await fs.ensureDir(dirPath);
    return true;
  } catch (error) {
    console.error(`Error creating directory ${dirPath}:`, error);
    return false;
  }
};

const createFile = async (filePath, content = '') => {
  try {
    await fs.ensureFile(filePath);
    await fs.writeFile(filePath, content);
    return true;
  } catch (error) {
    console.error(`Error creating file ${filePath}:`, error);
    return false;
  }
};

const copyTemplate = async (src, dest) => {
  try {
    await fs.copy(src, dest);
    return true;
  } catch (error) {
    console.error(`Error copying template:`, error);
    return false;
  }
};

module.exports = {
  createDirectory,
  createFile,
  copyTemplate,
};
