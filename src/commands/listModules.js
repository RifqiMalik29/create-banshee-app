const path = require('path');
const fs = require('fs-extra');
const logger = require('../utils/logger');
const chalk = require('chalk');

const listModules = async () => {
  const modulesPath = path.join(process.cwd(), 'src', 'modules');

  if (!fs.existsSync(modulesPath)) {
    logger.error('src/modules directory not found!');
    logger.info('Make sure you are in the project root directory.');
    process.exit(1);
  }

  try {
    const modules = fs.readdirSync(modulesPath).filter((file) => {
      const filePath = path.join(modulesPath, file);
      return fs.statSync(filePath).isDirectory();
    });

    if (modules.length === 0) {
      logger.info('No modules found.');
      logger.info('Create one with: npx banshee add-module <module-name>');
      return;
    }

    console.log(chalk.blue('\nAvailable Modules:\n'));
    modules.forEach((module, index) => {
      console.log(`  ${index + 1}. ${chalk.green(module)}`);
      
      const modulePath = path.join(modulesPath, module);
      const subFolders = fs.readdirSync(modulePath).filter((file) => {
        const filePath = path.join(modulePath, file);
        return fs.statSync(filePath).isDirectory();
      });
      
      if (subFolders.length > 0) {
        console.log(`     ${chalk.gray('└─')} ${subFolders.join(', ')}`);
      }
    });
    console.log('');
  } catch (error) {
    logger.error(`Failed to list modules: ${error.message}`);
    process.exit(1);
  }
};

module.exports = listModules;
