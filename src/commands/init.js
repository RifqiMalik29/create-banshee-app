const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs-extra");
const ora = require("ora");
const { execSync } = require("child_process");
const logger = require("../utils/logger");
const { createDirectory, createFile } = require("../utils/fileSystem");

const init = async (projectName) => {
  logger.info(`Creating a new Expo app: ${projectName}`);

  const answers = await inquirer.prompt([
    {
      type: "list",
      name: "navigation",
      message: "Choose navigation library:",
      choices: ["Expo Router", "React Navigation"],
    },
    {
      type: "list",
      name: "stateManagement",
      message: "Choose state management library:",
      choices: ["Redux Toolkit", "Zustand", "None"],
    },
    {
      type: "confirm",
      name: "tanstack",
      message: "Add TanStack Query?",
      default: true,
    },
  ]);

  const projectPath = path.join(process.cwd(), projectName);

  if (fs.existsSync(projectPath)) {
    logger.error(`Directory ${projectName} already exists!`);
    process.exit(1);
  }

  const spinner = ora("Creating project structure...").start();

  try {
    await createDirectory(projectPath);

    await createProjectStructure(projectPath);

    await createPackageJson(projectPath, projectName, answers);

    await createTsConfig(projectPath);

    await createAppJson(projectPath, projectName);

    await createGitignore(projectPath);

    await createESLintConfig(projectPath);

    await createPrettierConfig(projectPath);

    await createAppLayout(projectPath, answers.navigation);

    await createIndexFiles(projectPath);

    await createApiInterceptor(projectPath, answers);

    if (answers.tanstack) {
      await createQueryClient(projectPath);
    }

    if (answers.stateManagement === "Redux Toolkit") {
      await createReduxStore(projectPath);
    } else if (answers.stateManagement === "Zustand") {
      await createZustandStore(projectPath);
    }

    spinner.succeed("Project structure created!");

    const installSpinner = ora("Installing dependencies...").start();

    process.chdir(projectPath);
    execSync("npm install", { stdio: "inherit" });

    installSpinner.succeed("Dependencies installed!");

    logger.success(`\n✨ Project ${projectName} created successfully!\n`);
    logger.info("To get started:");
    console.log(`  cd ${projectName}`);
    console.log(`  npx expo start\n`);
  } catch (error) {
    spinner.fail("Failed to create project");
    logger.error(error.message);
    process.exit(1);
  }
};

const createProjectStructure = async (projectPath) => {
  const directories = [
    "app",
    "src/components",
    "src/screens",
    "src/modules",
    "src/utils",
    "src/services",
    "src/constants",
    "src/types",
    "src/hooks",
    "src/assets",
    "src/store",
  ];

  for (const dir of directories) {
    await createDirectory(path.join(projectPath, dir));
  }

  await createFile(path.join(projectPath, "src/modules/.gitkeep"));
  await createFile(path.join(projectPath, "src/assets/.gitkeep"));
};

const createPackageJson = async (projectPath, projectName, answers) => {
  const dependencies = {
    expo: "~52.0.0",
    react: "18.3.1",
    "react-native": "0.76.9",
    "expo-status-bar": "~2.0.0",
    "expo-asset": "~11.0.1",
    "expo-font": "~13.0.1",
    "expo-splash-screen": "~0.29.16",
    "react-native-web": "0.19.13",
    axios: "^1.6.5",
    "react-native-toast-message": "^2.2.0",
    "@react-native-async-storage/async-storage": "1.23.1",
  };

  const devDependencies = {
    "@babel/core": "^7.25.2",
    "@types/react": "~18.3.12",
    typescript: "^5.3.3",
    eslint: "^8.57.0",
    "eslint-config-expo": "^7.1.2",
    "eslint-config-prettier": "^9.1.0",
    "eslint-plugin-prettier": "^5.1.3",
    prettier: "^3.2.4",
  };

  if (answers.navigation === "Expo Router") {
    dependencies["expo-router"] = "~4.0.0";
    dependencies["expo-linking"] = "~7.0.0";
    dependencies["expo-constants"] = "~17.0.0";
    dependencies["react-native-safe-area-context"] = "4.12.0";
    dependencies["react-native-screens"] = "~4.4.0";
  } else {
    dependencies["@react-navigation/native"] = "^6.1.9";
    dependencies["@react-navigation/native-stack"] = "^6.9.17";
    dependencies["react-native-safe-area-context"] = "4.12.0";
    dependencies["react-native-screens"] = "~4.4.0";
  }

  if (answers.stateManagement === "Redux Toolkit") {
    dependencies["@reduxjs/toolkit"] = "^2.0.1";
    dependencies["react-redux"] = "^9.0.4";
  } else if (answers.stateManagement === "Zustand") {
    dependencies["zustand"] = "^4.4.7";
  }

  if (answers.tanstack) {
    dependencies["@tanstack/react-query"] = "^5.17.19";
  }

  const packageJson = {
    name: projectName,
    version: "1.0.0",
    main: "expo-router/entry",
    scripts: {
      start: "expo start",
      android: "expo start --android",
      ios: "expo start --ios",
      web: "expo start --web",
      lint: "eslint .",
      "lint:fix": "eslint . --fix",
      format: 'prettier --write "**/*.{js,jsx,ts,tsx,json,md}"',
      "format:check": 'prettier --check "**/*.{js,jsx,ts,tsx,json,md}"',
    },

    dependencies,
    devDependencies,
    private: true,
  };

  await createFile(
    path.join(projectPath, "package.json"),
    JSON.stringify(packageJson, null, 2),
  );
};

const createTsConfig = async (projectPath) => {
  const tsConfig = {
    extends: "expo/tsconfig.base",
    compilerOptions: {
      strict: true,
      baseUrl: ".",
      paths: {
        "@/*": ["src/*"],
        "@components/*": ["src/components/*"],
        "@screens/*": ["src/screens/*"],
        "@modules/*": ["src/modules/*"],
        "@utils/*": ["src/utils/*"],
        "@services/*": ["src/services/*"],
        "@constants/*": ["src/constants/*"],
        "@types/*": ["src/types/*"],
        "@hooks/*": ["src/hooks/*"],
        "@assets/*": ["src/assets/*"],
        "@store/*": ["src/store/*"],
      },
    },
  };

  await createFile(
    path.join(projectPath, "tsconfig.json"),
    JSON.stringify(tsConfig, null, 2),
  );
};

const createAppJson = async (projectPath, projectName) => {
  const appJson = {
    expo: {
      name: projectName,
      slug: projectName,
      version: "1.0.0",
      orientation: "portrait",
      icon: "./src/assets/icon.png",
      userInterfaceStyle: "light",
      splash: {
        image: "./src/assets/splash.png",
        resizeMode: "contain",
        backgroundColor: "#ffffff",
      },
      ios: {
        supportsTablet: true,
      },
      android: {
        adaptiveIcon: {
          foregroundImage: "./src/assets/adaptive-icon.png",
          backgroundColor: "#ffffff",
        },
      },
      web: {
        favicon: "./src/assets/favicon.png",
      },
    },
  };

  await createFile(
    path.join(projectPath, "app.json"),
    JSON.stringify(appJson, null, 2),
  );
};

const createGitignore = async (projectPath) => {
  const gitignore = `
node_modules/
.expo/
dist/
npm-debug.*
*.jks
*.p8
*.p12
*.key
*.mobileprovision
*.orig.*
web-build/
.DS_Store
*.pem
.watchmanconfig
.watchman-cookie-*
`;

  await createFile(path.join(projectPath, ".gitignore"), gitignore.trim());
};

const createAppLayout = async (projectPath, navigation) => {
  let layoutContent = "";

  if (navigation === "Expo Router") {
    layoutContent = `import { Stack } from 'expo-router';
import Toast from 'react-native-toast-message';

export default function RootLayout() {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ title: 'Home' }} />
      </Stack>
      <Toast />
    </>
  );
}
`;
  } else {
    layoutContent = `import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';

const Stack = createNativeStackNavigator();

export default function RootLayout() {
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={() => null} />
        </Stack.Navigator>
      </NavigationContainer>
      <Toast />
    </>
  );
}
`;
  }

  await createFile(path.join(projectPath, "app/_layout.tsx"), layoutContent);

  if (navigation === "Expo Router") {
    const indexContent = `import { View, Text, StyleSheet } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to Banshee Expo App!</Text>
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
    fontSize: 20,
    fontWeight: 'bold',
  },
});
`;
    await createFile(path.join(projectPath, "app/index.tsx"), indexContent);
  }
};

const createIndexFiles = async (projectPath) => {
  const folders = [
    "src/components",
    "src/screens",
    "src/utils",
    "src/services",
    "src/constants",
    "src/types",
    "src/hooks",
  ];

  for (const folder of folders) {
    await createFile(path.join(projectPath, folder, "index.ts"), "");
  }
};

const createApiInterceptor = async (projectPath, answers) => {
  const apiContent = `import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.example.com';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    if (__DEV__) {
      console.log('📤 Request:', config.method?.toUpperCase(), config.url);
    }

    const token = await AsyncStorage.getItem('authToken');
    if (token && config.headers) {
      config.headers.Authorization = \`Bearer \${token}\`;
    }

    return config;
  },
  (error: AxiosError) => {
    if (__DEV__) {
      console.error('❌ Request Error:', error);
    }
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    if (__DEV__) {
      console.log('📥 Response:', response.status, response.config.url);
    }
    return response;
  },
  async (error: AxiosError) => {
    if (__DEV__) {
      console.error('❌ Response Error:', error.response?.status, error.config?.url);
    }

    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 401:
          await AsyncStorage.removeItem('authToken');
          Toast.show({
            type: 'error',
            text1: 'Session Expired',
            text2: 'Please login again',
          });
          break;

        case 403:
          Toast.show({
            type: 'error',
            text1: 'Access Denied',
            text2: 'You do not have permission to access this resource',
          });
          break;

        case 404:
          Toast.show({
            type: 'error',
            text1: 'Not Found',
            text2: 'The requested resource was not found',
          });
          break;

        case 500:
        case 502:
        case 503:
          Toast.show({
            type: 'error',
            text1: 'Server Error',
            text2: 'Something went wrong. Please try again later',
          });
          break;

        default:
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: (data as any)?.message || 'An unexpected error occurred',
          });
      }
    } else if (error.request) {
      Toast.show({
        type: 'error',
        text1: 'Network Error',
        text2: 'Please check your internet connection',
      });
    } else {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message || 'An unexpected error occurred',
      });
    }

    return Promise.reject(error);
  }
);

export default api;
`;

  await createFile(path.join(projectPath, "src/services/api.ts"), apiContent);
};

const createQueryClient = async (projectPath) => {
  const queryClientContent = `import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
    },
  },
});
`;

  await createFile(
    path.join(projectPath, "src/config/queryClient.ts"),
    queryClientContent,
  );

  const configDir = path.join(projectPath, "src/config");
  await createDirectory(configDir);
  await createFile(
    path.join(projectPath, "src/config/queryClient.ts"),
    queryClientContent,
  );
};

const createReduxStore = async (projectPath) => {
  const authSliceContent = `import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  user: any | null;
}

const initialState: AuthState = {
  token: null,
  isAuthenticated: false,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ token: string; user: any }>) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      AsyncStorage.setItem('authToken', action.payload.token);
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      AsyncStorage.removeItem('authToken');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
`;

  const storeContent = `import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
`;

  const hooksContent = `import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
`;

  await createFile(
    path.join(projectPath, "src/store/authSlice.ts"),
    authSliceContent,
  );
  await createFile(path.join(projectPath, "src/store/store.ts"), storeContent);
  await createFile(path.join(projectPath, "src/store/hooks.ts"), hooksContent);
  await createFile(
    path.join(projectPath, "src/store/index.ts"),
    `export * from './store';\nexport * from './hooks';\nexport * from './authSlice';`,
  );
};

const createZustandStore = async (projectPath) => {
  const authStoreContent = `import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  user: any | null;
  setCredentials: (token: string, user: any) => Promise<void>;
  logout: () => Promise<void>;
  loadToken: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  isAuthenticated: false,
  user: null,

  setCredentials: async (token: string, user: any) => {
    await AsyncStorage.setItem('authToken', token);
    set({ token, user, isAuthenticated: true });
  },

  logout: async () => {
    await AsyncStorage.removeItem('authToken');
    set({ token: null, user: null, isAuthenticated: false });
  },

  loadToken: async () => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      set({ token, isAuthenticated: true });
    }
  },
}));
`;

  await createFile(
    path.join(projectPath, "src/store/authStore.ts"),
    authStoreContent,
  );
  await createFile(
    path.join(projectPath, "src/store/index.ts"),
    `export * from './authStore';`,
  );
};

const createESLintConfig = async (projectPath) => {
  const eslintConfig = `module.exports = {
  extends: ['expo', 'prettier'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-explicit-any': 'warn',
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
  },
};
`;

  await createFile(path.join(projectPath, ".eslintrc.js"), eslintConfig);
};

const createPrettierConfig = async (projectPath) => {
  const prettierConfig = {
    semi: true,
    trailingComma: "es5",
    singleQuote: true,
    printWidth: 100,
    tabWidth: 2,
    useTabs: false,
    arrowParens: "always",
    endOfLine: "lf",
  };

  await createFile(
    path.join(projectPath, ".prettierrc"),
    JSON.stringify(prettierConfig, null, 2),
  );

  const prettierIgnore = `
node_modules/
.expo/
dist/
build/
coverage/
*.log
.DS_Store
android/
ios/
web-build/
`;

  await createFile(
    path.join(projectPath, ".prettierignore"),
    prettierIgnore.trim(),
  );
};

module.exports = init;
