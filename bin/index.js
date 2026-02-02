#!/usr/bin/env node

const { program } = require('commander');
const initCommand = require('../src/commands/init');
const addModuleCommand = require('../src/commands/addModule');
const addScreenCommand = require('../src/commands/addScreen');
const addComponentCommand = require('../src/commands/addComponent');
const addServiceCommand = require('../src/commands/addService');
const addHookCommand = require('../src/commands/addHook');
const listModulesCommand = require('../src/commands/listModules');
const infoCommand = require('../src/commands/info');

program
  .name('create-banshee-expo')
  .description('CLI to generate Expo React Native projects')
  .version('1.0.0');

program
  .argument('[project-name]', 'Name of the project')
  .action((projectName) => {
    if (projectName) {
      initCommand(projectName);
    } else {
      program.help();
    }
  });

program
  .command('add-module <module-name>')
  .description('Generate a new module with screens, controllers, and navigations')
  .action((moduleName) => {
    addModuleCommand(moduleName);
  });

program
  .command('add-screen <screen-name>')
  .description('Generate a new screen in src/screens')
  .action((screenName) => {
    addScreenCommand(screenName);
  });

program
  .command('add-component <component-name>')
  .description('Generate a new component in src/components')
  .action((componentName) => {
    addComponentCommand(componentName);
  });

program
  .command('add-service <service-name>')
  .description('Generate a new service in src/services')
  .action((serviceName) => {
    addServiceCommand(serviceName);
  });

program
  .command('add-hook <hook-name>')
  .description('Generate a new custom hook in src/hooks')
  .action((hookName) => {
    addHookCommand(hookName);
  });

program
  .command('list-modules')
  .description('List all available modules')
  .action(() => {
    listModulesCommand();
  });

program
  .command('info')
  .description('Show project information')
  .action(() => {
    infoCommand();
  });

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.help();
}
