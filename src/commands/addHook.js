const path = require('path');
const fs = require('fs-extra');
const logger = require('../utils/logger');
const { createFile } = require('../utils/fileSystem');

const addHook = async (hookName) => {
  const formattedHookName = hookName.startsWith('use') ? hookName : `use${hookName}`;
  const hookPath = path.join(process.cwd(), 'src', 'hooks', `${formattedHookName}.ts`);

  if (fs.existsSync(hookPath)) {
    logger.error(`Hook ${formattedHookName} already exists!`);
    process.exit(1);
  }

  logger.info(`Creating hook: ${formattedHookName}`);

  const hookContent = `import { useState, useEffect } from 'react';

export const ${formattedHookName} = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        setData(null);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
};
`;

  try {
    await createFile(hookPath, hookContent);
    logger.success(`Hook ${formattedHookName} created successfully!`);
    logger.info(`Location: src/hooks/${formattedHookName}.ts`);
  } catch (error) {
    logger.error(`Failed to create hook: ${error.message}`);
    process.exit(1);
  }
};

module.exports = addHook;
