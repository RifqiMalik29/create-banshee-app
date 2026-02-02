const path = require('path');
const fs = require('fs-extra');
const logger = require('../utils/logger');
const chalk = require('chalk');

const info = async () => {
  const packageJsonPath = path.join(process.cwd(), 'package.json');

  if (!fs.existsSync(packageJsonPath)) {
    logger.error('package.json not found!');
    logger.info('Make sure you are in the project root directory.');
    process.exit(1);
  }

  try {
    const packageJson = await fs.readJSON(packageJsonPath);
    const dependencies = packageJson.dependencies || {};

    console.log(chalk.blue('\n📦 Project Information:\n'));
    console.log(`  ${chalk.bold('Name:')} ${packageJson.name}`);
    console.log(`  ${chalk.bold('Version:')} ${packageJson.version}`);

    const navigation = dependencies['expo-router'] 
      ? 'Expo Router' 
      : dependencies['@react-navigation/native'] 
      ? 'React Navigation' 
      : 'Not configured';
    console.log(`  ${chalk.bold('Navigation:')} ${navigation}`);

    const stateManagement = dependencies['@reduxjs/toolkit']
      ? 'Redux Toolkit'
      : dependencies['zustand']
      ? 'Zustand'
      : 'None';
    console.log(`  ${chalk.bold('State Management:')} ${stateManagement}`);

    const hasTanstack = dependencies['@tanstack/react-query'] ? 'Yes' : 'No';
    console.log(`  ${chalk.bold('TanStack Query:')} ${hasTanstack}`);

    console.log(chalk.blue('\n📚 Installed Libraries:\n'));
    
    const keyLibraries = [
      'expo',
      'react',
      'react-native',
      'expo-router',
      '@react-navigation/native',
      '@reduxjs/toolkit',
      'zustand',
      '@tanstack/react-query',
    ];

    keyLibraries.forEach((lib) => {
      if (dependencies[lib]) {
        console.log(`  ${chalk.green('✓')} ${lib} ${chalk.gray(dependencies[lib])}`);
      }
    });

    console.log('');
  } catch (error) {
    logger.error(`Failed to read project info: ${error.message}`);
    process.exit(1);
  }
};

module.exports = info;
