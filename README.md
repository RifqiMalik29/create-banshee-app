````markdown
# create-banshee-expo

🚀 CLI tool to generate Expo React Native projects with custom structure and modular architecture.

## ✨ Features

- ✅ **Expo + TypeScript** - Modern development setup
- ✅ **Custom Folder Structure** - Organized and scalable
- ✅ **Navigation Options** - Choose between Expo Router or React Navigation
- ✅ **State Management** - Redux Toolkit or Zustand support
- ✅ **TanStack Query** - Optional data fetching library
- ✅ **Module Generator** - Create complete feature modules
- ✅ **Code Generators** - Generate screens, components, services, and hooks
- ✅ **React Native Web** - Web support out of the box

## 📦 Installation

### Local Development (Not Published to npm)

```bash
# Clone or navigate to the CLI directory
cd create-banshee-expo

# Install dependencies
npm install

# Link globally for local testing
npm link

# Now you can use it anywhere
npx create-banshee-expo MyApp
```
````

## 🚀 Quick Start

### 1. Create New Project

```bash
npx create-banshee-expo MyAwesomeApp
```

You'll be prompted to choose:

- Navigation: Expo Router or React Navigation
- State Management: Redux Toolkit, Zustand, or None
- TanStack Query: Yes or No

### 2. Navigate to Your Project

```bash
cd MyAwesomeApp
```

### 3. Start Development Server

```bash
npx expo start
```

## 📁 Project Structure

```
MyAwesomeApp/
├── app/                      # App navigation and layouts
│   ├── _layout.tsx          # Root layout
│   └── index.tsx            # Home screen (Expo Router)
├── src/
│   ├── components/          # Reusable components
│   │   └── index.ts
│   ├── screens/             # Standalone screens
│   │   └── index.ts
│   ├── modules/             # Feature modules
│   │   └── .gitkeep
│   ├── utils/               # Utility functions
│   │   └── index.ts
│   ├── services/            # API services
│   │   └── index.ts
│   ├── constants/           # App constants
│   │   └── index.ts
│   ├── types/               # TypeScript types
│   │   └── index.ts
│   ├── hooks/               # Custom hooks
│   │   └── index.ts
│   └── assets/              # Images, fonts, etc.
│       └── .gitkeep
├── package.json
├── tsconfig.json
├── app.json
└── .gitignore
```

## 🎯 Available Commands

### Initialize New Project

```bash
npx create-banshee-expo <project-name>
```

### Add Module

```bash
npx banshee add-module <module-name>
```

Generates a complete feature module with:

- screens/ - Module screens
- controllers/ - Business logic
- navigations/ - Module navigation
- index.ts - Module exports

**Example:**

```bash
npx banshee add-module auth
```

**Result:**

```
src/modules/auth/
├── screens/
│   └── index.ts
├── controllers/
│   └── index.ts
├── navigations/
│   └── index.ts
└── index.ts
```

### More Commands

- 📱 `npx banshee add-screen <ScreenName>` - Generate screen with StyleSheet
- 🧩 `npx banshee add-component <ComponentName>` - Generate component with props
- 🔌 `npx banshee add-service <ServiceName>` - Generate API service with CRUD
- 🪝 `npx banshee add-hook <hookName>` - Generate custom hook
- 📋 `npx banshee list-modules` - List all modules
- ℹ️ `npx banshee info` - Show project information

## 🛠️ TypeScript Path Aliases

The generated project includes pre-configured path aliases:

```typescript
import Button from "@components/Button";
import LoginScreen from "@screens/LoginScreen";
import { authModule } from "@modules/auth";
import { api } from "@services/api";
import { formatDate } from "@utils/formatDate";
import { COLORS } from "@constants/colors";
import { User } from "@types/user";
import { useFetch } from "@hooks/useFetch";
```

## 📖 Usage Examples

### Complete Workflow Example

```bash
# 1. Create new project
npx create-banshee-expo ShoppingApp

# 2. Navigate to project
cd ShoppingApp

# 3. Create authentication module
npx banshee add-module auth

# 4. Add screens
npx banshee add-screen HomeScreen
npx banshee add-screen ProductDetailScreen

# 5. Add reusable components
npx banshee add-component ProductCard
npx banshee add-component LoadingSpinner

# 6. Add API services
npx banshee add-service ProductService
npx banshee add-service AuthService

# 7. Add custom hooks
npx banshee add-hook useProducts
npx banshee add-hook useAuth

# 8. Check project structure
npx banshee list-modules
npx banshee info

# 9. Start development
npx expo start
```

## 🔧 Troubleshooting

### Command not found

```bash
banshee: command not found
```

**Solution:**

```bash
# Re-link the package
cd create-banshee-expo
npm link

# Or use with npx
npx banshee <command>
```

---

### Module already exists

```
Error: Module auth already exists!
```

**Solution:**

```bash
rm -rf src/modules/auth
# or
npx banshee add-module authentication
```

---

### Not in project directory

```
Error: package.json not found!
```

**Solution:**
Make sure you're in the project root directory:

```bash
cd MyAwesomeApp
npx banshee info
```
