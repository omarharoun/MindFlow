# MindFlow - Unified Learning & Productivity Platform

> **Where Knowledge Flows** - A React Native app that combines productivity management, knowledge organization, and social learning into one seamless experience.

## 🎯 Vision

MindFlow transforms how people learn, create, and share knowledge in a social, gamified environment. It combines the best aspects of:

- **IHSAN-Dashboard**: Productivity and task management
- **MindWeb**: Knowledge organization and AI-powered learning
- **TikTik**: Social content creation and discovery

## 🚀 Key Features

### 📊 Productivity Hub
- **Quick Actions Dashboard**: Notes, tasks, calendar, document scanning
- **Learning Progress Tracking**: Course progress, focus time, productivity insights
- **Smart Notifications**: Contextual reminders and progress updates
- **Recent Items**: Quick access to recently created content

### 🧠 Knowledge Web
- **Interactive Knowledge Nodes**: Create and organize knowledge with rich content
- **Visual Knowledge Maps**: See relationships between concepts
- **AI-Powered Content**: Generate and enhance content using AI
- **Quiz & Testing System**: Create and take quizzes based on knowledge
- **Gamification**: XP, levels, achievements, and progress tracking

### 📱 Social Learning Feed
- **Vertical Video Feed**: Educational content, tutorials, knowledge sharing
- **Social Interactions**: Like, comment, share, and follow creators
- **Content Creation**: Record educational videos, tutorials, explanations
- **Discover Page**: Find new topics, creators, and learning paths
- **Collaborative Learning**: Study groups, shared knowledge spaces

## 🏗️ Architecture

### Tech Stack
- **Frontend**: React Native with Expo
- **State Management**: Zustand with persistence
- **Navigation**: React Navigation
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **Icons**: Lucide React Native
- **Backend**: PocketBase + Supabase
- **AI**: OpenAI API integration

### Project Structure
```
MindFlow/
├── src/
│   ├── components/          # Reusable UI components
│   ├── screens/            # Main app screens
│   ├── store/              # Zustand state management
│   ├── types/              # TypeScript type definitions
│   ├── services/           # API and external services
│   ├── hooks/              # Custom React hooks
│   └── utils/              # Utility functions
├── assets/                 # Images, fonts, etc.
├── app.json               # Expo configuration
└── package.json           # Dependencies
```

## 🎨 Design System

### Color Palette
- **Primary**: Deep blue (#1E3A8A) - Knowledge and trust
- **Secondary**: Emerald green (#059669) - Growth and learning
- **Accent**: Purple (#7C3AED) - Creativity and innovation
- **Background**: Dark theme (#0F172A) - Focus and readability
- **Surface**: Slate gray (#334155) - Content areas

### Typography
- **Headings**: Inter Bold
- **Body**: Inter Regular
- **Code**: JetBrains Mono

## 📱 App Navigation

### Main Tabs
1. **Home** - Personalized dashboard with quick actions
2. **Learn** - Knowledge web and learning content
3. **Create** - Content creation tools
4. **Discover** - Social feed and content exploration
5. **Profile** - User profile, achievements, and settings

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- Expo CLI
- iOS Simulator or Android Emulator (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd MindFlow
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on device/simulator**
   ```bash
   # iOS
   npm run ios
   
   # Android
   npm run android
   
   # Web
   npm run web
   ```

### Environment Setup

1. **Create environment file**
   ```bash
   cp .env.example .env
   ```

2. **Configure API keys**
   ```env
   OPENAI_API_KEY=your_openai_api_key
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

## 🎯 Core Components

### HomeDashboard
The main dashboard that combines productivity features with learning insights:
- Quick action tiles for common tasks
- Learning progress overview
- Recent knowledge nodes and content
- Productivity insights and focus time tracking

### SocialFeed
TikTok-style vertical feed for educational content:
- Swipeable video/content feed
- Social interactions (like, comment, share)
- Content type badges (video, quiz, note)
- Creator profiles and following system

### KnowledgeWeb
Interactive knowledge management system:
- 3D knowledge node visualization
- AI-powered content generation
- Quiz creation from knowledge nodes
- Visual relationship mapping

## 🔧 Development

### Code Style
- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Conventional commits for version control

### Testing
```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Building
```bash
# Build for production
npm run build

# Build for specific platform
npm run build:ios
npm run build:android
```

## 📊 Data Models

### User
```typescript
interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  level: number;
  experience: number;
  achievements: Achievement[];
  following: string[];
  followers: string[];
  preferences: UserPreferences;
}
```

### Knowledge Node
```typescript
interface KnowledgeNode {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  color: string;
  position: { x: number; y: number; z: number };
  connections: string[];
  creator: string;
  media: Media[];
}
```

### Content
```typescript
interface Content {
  id: string;
  type: 'video' | 'note' | 'quiz' | 'knowledge';
  title: string;
  description: string;
  media: Media[];
  creator: string;
  likes: number;
  comments: Comment[];
  shares: number;
  tags: string[];
  relatedNodes: string[];
}
```

## 🎮 Gamification System

### Experience Points (XP)
- **Content Creation**: 10-50 XP
- **Learning Activities**: 5-25 XP
- **Social Interactions**: 2-10 XP
- **Achievements**: 100-500 XP

### Levels
- Level 1: 0 XP
- Level 2: 1,000 XP
- Level 3: 2,000 XP
- And so on...

### Achievements
- **First Steps**: Create your first knowledge node
- **Social Butterfly**: Follow 10 creators
- **Quiz Master**: Complete 50 quizzes
- **Content Creator**: Share 25 pieces of content
- **Knowledge Seeker**: Create 100 knowledge nodes

## 🔮 Future Roadmap

### Phase 2 (Q2 2024)
- [ ] AR Knowledge Visualization
- [ ] Voice-to-Knowledge input
- [ ] Collaborative Knowledge Spaces
- [ ] Advanced Analytics Dashboard

### Phase 3 (Q3 2024)
- [ ] AI Tutor integration
- [ ] Virtual Study Groups
- [ ] Knowledge Marketplace
- [ ] Platform Integrations

### Phase 4 (Q4 2024)
- [ ] Advanced AI features
- [ ] Mobile AR capabilities
- [ ] Enterprise features
- [ ] API for third-party integrations

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **IHSAN-Dashboard**: For productivity and dashboard inspiration
- **MindWeb**: For knowledge management concepts
- **TikTik**: For social feed and content creation patterns
- **OpenAI**: For AI integration capabilities
- **React Native Community**: For the amazing ecosystem

## 📞 Support

- **Documentation**: [docs.mindflow.app](https://docs.mindflow.app)
- **Issues**: [GitHub Issues](https://github.com/mindflow/issues)
- **Discord**: [Join our community](https://discord.gg/mindflow)
- **Email**: support@mindflow.app

---

**Start your learning journey with MindFlow today! 🚀**