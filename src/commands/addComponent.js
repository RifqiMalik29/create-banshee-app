const path = require('path');
const fs = require('fs-extra');
const logger = require('../utils/logger');
const { createFile } = require('../utils/fileSystem');

const addComponent = async (componentName) => {
  const componentPath = path.join(process.cwd(), 'src', 'components', `${componentName}.tsx`);

  if (fs.existsSync(componentPath)) {
    logger.error(`Component ${componentName} already exists!`);
    process.exit(1);
  }

  logger.info(`Creating component: ${componentName}`);

  const componentContent = `import { View, Text, StyleSheet } from 'react-native';

interface ${componentName}Props {
  title?: string;
}

export default function ${componentName}({ title }: ${componentName}Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{title || '${componentName}'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  text: {
    fontSize: 16,
  },
});
`;

  try {
    await createFile(componentPath, componentContent);
    logger.success(`Component ${componentName} created successfully!`);
    logger.info(`Location: src/components/${componentName}.tsx`);
  } catch (error) {
    logger.error(`Failed to create component: ${error.message}`);
    process.exit(1);
  }
};

module.exports = addComponent;
