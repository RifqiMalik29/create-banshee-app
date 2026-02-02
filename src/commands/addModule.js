const path = require('path');
const fs = require('fs-extra');
const logger = require('../utils/logger');
const { createDirectory, createFile } = require('../utils/fileSystem');

const addModule = async (moduleName) => {
  const modulePath = path.join(process.cwd(), 'src', 'modules', moduleName);

  if (fs.existsSync(modulePath)) {
    logger.error(`Module ${moduleName} already exists!`);
    process.exit(1);
  }

  logger.info(`Creating module: ${moduleName}`);

  try {
    await createDirectory(modulePath);

    const folders = ['screens', 'controllers', 'navigations'];

    for (const folder of folders) {
      const folderPath = path.join(modulePath, folder);
      await createDirectory(folderPath);
      await createFile(path.join(folderPath, 'index.ts'), '');
    }

    await createFile(path.join(modulePath, 'index.ts'), '');

    logger.success(`Module ${moduleName} created successfully!`);
    logger.info(`Location: src/modules/${moduleName}`);

  } catch (error) {
    logger.error(`Failed to create module: ${error.message}`);
    process.exit(1);
  }
};

module.exports = addModule;
