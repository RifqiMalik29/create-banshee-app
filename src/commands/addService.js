const path = require('path');
const fs = require('fs-extra');
const logger = require('../utils/logger');
const { createFile } = require('../utils/fileSystem');

const addService = async (serviceName) => {
  const servicePath = path.join(process.cwd(), 'src', 'services', `${serviceName}.ts`);

  if (fs.existsSync(servicePath)) {
    logger.error(`Service ${serviceName} already exists!`);
    process.exit(1);
  }

  logger.info(`Creating service: ${serviceName}`);

  const serviceContent = `const API_URL = 'https://api.example.com';

export const ${serviceName} = {
  getAll: async () => {
    try {
      const response = await fetch(\`\${API_URL}/${serviceName.toLowerCase()}\`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  },

  getById: async (id: string | number) => {
    try {
      const response = await fetch(\`\${API_URL}/${serviceName.toLowerCase()}/\${id}\`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  },

  create: async (payload: any) => {
    try {
      const response = await fetch(\`\${API_URL}/${serviceName.toLowerCase()}\`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating data:', error);
      throw error;
    }
  },

  update: async (id: string | number, payload: any) => {
    try {
      const response = await fetch(\`\${API_URL}/${serviceName.toLowerCase()}/\${id}\`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating data:', error);
      throw error;
    }
  },

  delete: async (id: string | number) => {
    try {
      const response = await fetch(\`\${API_URL}/${serviceName.toLowerCase()}/\${id}\`, {
        method: 'DELETE',
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error deleting data:', error);
      throw error;
    }
  },
};
`;

  try {
    await createFile(servicePath, serviceContent);
    logger.success(`Service ${serviceName} created successfully!`);
    logger.info(`Location: src/services/${serviceName}.ts`);
  } catch (error) {
    logger.error(`Failed to create service: ${error.message}`);
    process.exit(1);
  }
};

module.exports = addService;
