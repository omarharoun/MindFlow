# 🧠 MindFlow

**Your Personal Learning & Knowledge Management Platform**

MindFlow is a modern, cross-platform application built with React Native and Expo that helps you organize your learning journey, manage knowledge, and track your progress in an intuitive and beautiful interface.

![MindFlow App](https://img.shields.io/badge/Platform-Web%20%7C%20iOS%20%7C%20Android-blue)
![React Native](https://img.shields.io/badge/React%20Native-0.72+-green)
![Expo](https://img.shields.io/badge/Expo-49+-orange)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)

## ✨ Features

### 🏠 **Smart Dashboard**
- **Quick Actions Bar** - Instant access to common tasks
- **Progress Tracking** - Visual progress indicators and statistics
- **Real-time Updates** - Live data synchronization
- **Weather & Time Widget** - Current time and weather information

### 📚 **Learning Management**
- **Knowledge Mapping** - Visual knowledge graph with interconnected nodes
- **Interactive Learning** - Create and take quizzes
- **Progress Analytics** - Track learning milestones and achievements
- **Content Organization** - Categorize and tag learning materials

### 📝 **Note Taking**
- **Rich Text Notes** - Create detailed notes with formatting
- **Document Upload** - Support for PDFs and other documents
- **Smart Search** - Find notes quickly with advanced filtering
- **Tags & Categories** - Organize notes with custom tags

### 🔍 **Discovery & Exploration**
- **Fact of the Day** - Daily interesting facts and trivia
- **Historical Events** - Learn about events that happened today
- **AI Fact Generator** - Generate custom facts and knowledge
- **Fact vs Fiction Game** - Test your knowledge with interactive games

### 👤 **Personal Profile**
- **Achievement System** - Unlock badges and track accomplishments
- **Learning Goals** - Set and monitor personal objectives
- **Theme Customization** - Dark/Light mode toggle
- **Settings Management** - Customize your learning experience

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- Yarn package manager
- Expo CLI (optional, for development)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/mindflow.git
   cd mindflow
   ```

2. **Install dependencies**
   ```bash
   yarn install
   ```

3. **Start the development server**
   ```bash
   yarn web        # For web development
   yarn ios        # For iOS development
   yarn android    # For Android development
   ```

4. **Open in your browser**
   Navigate to `http://localhost:8081` to view the application.

## 🛠️ Development

### Project Structure
```
mindflow/
├── app/                    # Expo Router app directory
│   ├── (tabs)/            # Tab-based navigation
│   │   ├── index.tsx      # Home screen
│   │   ├── learn.tsx      # Learning interface
│   │   ├── notes.tsx      # Note management
│   │   ├── discover.tsx   # Discovery features
│   │   └── profile.tsx    # User profile
│   ├── _layout.tsx        # Root layout
│   └── index.tsx          # App entry point
├── src/
│   ├── components/        # Reusable UI components
│   ├── services/          # Business logic and APIs
│   ├── store/            # State management (Zustand)
│   ├── types/            # TypeScript type definitions
│   └── utils/            # Utility functions
├── assets/               # Static assets
└── package.json          # Dependencies and scripts
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `yarn web` | Start web development server |
| `yarn ios` | Start iOS development server |
| `yarn android` | Start Android development server |
| `yarn type-check` | Run TypeScript type checking |
| `yarn lint` | Run ESLint for code quality |
| `yarn build` | Build the application for production |

### Tech Stack

- **Frontend Framework**: React Native with Expo
- **Navigation**: Expo Router
- **State Management**: Zustand
- **Styling**: React Native StyleSheet with Linear Gradients
- **Icons**: Lucide React Native
- **Fonts**: Inter & Poppins (Google Fonts)
- **Type Safety**: TypeScript
- **Package Manager**: Yarn

## 🎨 UI/UX Features

### Design System
- **Dark Theme**: Modern dark interface with gradient backgrounds
- **Responsive Design**: Works seamlessly across devices
- **Smooth Animations**: Fluid transitions and interactions
- **Accessibility**: Built with accessibility in mind

### Navigation
- **Tab-based Navigation**: Intuitive bottom tab navigation
- **Gesture Support**: Swipe gestures for enhanced interaction
- **Deep Linking**: Support for direct navigation to specific screens

## 📱 Platform Support

- ✅ **Web** - Full functionality with responsive design
- ✅ **iOS** - Native iOS app with platform-specific features
- ✅ **Android** - Native Android app with Material Design

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:
```env
EXPO_PUBLIC_API_URL=your_api_url_here
EXPO_PUBLIC_OPENAI_API_KEY=your_openai_key_here
```

### Customization
- **Themes**: Modify colors in the theme configuration
- **Fonts**: Update font families in the layout configuration
- **Features**: Enable/disable features through the settings

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


---

**Made with ❤️ **
