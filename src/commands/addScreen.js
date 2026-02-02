const path = require('path');
const fs = require('fs-extra');
const logger = require('../utils/logger');
const { createFile } = require('../utils/fileSystem');

const addScreen = async (screenName) => {
  const screenPath = path.join(process.cwd(), 'src', 'screens', `${screenName}.tsx`);

  if (fs.existsSync(screenPath)) {
    logger.error(`Screen ${screenName} already exists!`);
    process.exit(1);
  }

  logger.info(`Creating screen: ${screenName}`);

  const screenContent = `import { View, Text, StyleSheet } from 'react-native';

export default function ${screenName}() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>${screenName}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    fontWeight: '600',
  },
});
`;

  try {
    await createFile(screenPath, screenContent);
    logger.success(`Screen ${screenName} created successfully!`);
    logger.info(`Location: src/screens/${screenName}.tsx`);
  } catch (error) {
    logger.error(`Failed to create screen: ${error.message}`);
    process.exit(1);
  }
};

module.exports = addScreen;
