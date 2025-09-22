# TrendForge 🚀

**AI-Powered LinkedIn Content Generator**

Create viral LinkedIn content with AI-powered precision. Generate engaging posts, discover trending topics, and grow your professional presence in minutes, not hours.

![TrendForge](./assets/logo.png)

## ✨ Features

- **AI-Powered Ideas** - Generate viral LinkedIn post ideas using advanced AI that understands current trends and engagement patterns
- **Viral Optimization** - Every post is scored and optimized for maximum engagement with proven viral content strategies
- **Instant Generation** - Create professional LinkedIn posts in seconds with streamlined AI workflow and smart templates
- **Audience Targeting** - Content tailored for specific professional audiences to maximize relevance and impact
- **Content Management** - Save, organize, and manage all your generated posts and ideas in one place
- **Trending Analysis** - Discover trending topics and factors that drive engagement on LinkedIn

## 🎯 How It Works

1. **Input Your Topic** - Tell us what you want to post about or ask for trending topic suggestions
2. **AI Analysis** - Our AI researches trends, analyzes engagement patterns, and crafts viral content
3. **Get Your Post** - Receive optimized LinkedIn posts with hashtags, scoring, and engagement tips

## 🛠️ Tech Stack

### Frontend

- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[React 19](https://react.dev/)** - Latest React with concurrent features
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Motion](https://motion.dev/)** - Smooth animations and transitions
- **[Lucide React](https://lucide.dev/)** - Beautiful icons
- **[date-fns](https://date-fns.org/)** - Modern date utility library

### Backend & AI

- **[OpenAI Agents SDK](https://openai.github.io/openai-agents-js/)** - AI-powered content generation
- **[OpenAI API](https://openai.com/)** - GPT models for content creation
- **[Firebase](https://firebase.google.com/)** - Authentication & Firestore database
- **[Zod](https://zod.dev/)** - Schema validation

### Development Tools

- **[Cursor](https://cursor.com/)** - AI-powered development environment
- **[Vercel](https://vercel.com/)** - Deployment and hosting

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Firebase account
- OpenAI API key

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/dannynow6/trend-forge.git
   cd trend-forge
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Add your API keys:

   ```env
   OPENAI_API_KEY=your_openai_api_key
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   # ... other Firebase config
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Usage

1. **Sign in** with Google authentication
2. **Create post ideas** by describing your topic or requesting trending suggestions
3. **Generate posts** based on your saved ideas or new topics
4. **Review and customize** the AI-generated content
5. **Save and manage** your content library
6. **Copy and share** optimized posts to LinkedIn

## 🌟 Key Statistics

- **10k+** Posts Generated
- **95%** User Satisfaction
- **24/7** AI Availability
- **3.5s** Average Generation Time

## 📂 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/agent/         # AI agent API routes
│   ├── about/             # About page
│   ├── my-ideas/          # Saved ideas management
│   ├── my-posts/          # Saved posts management
│   └── ...
├── components/            # React components
│   ├── auth/             # Authentication components
│   ├── home/             # Homepage components
│   ├── ui/               # Reusable UI components
│   └── ...
├── context/              # React Context providers
├── lib/                  # Utility libraries
│   ├── firebase/         # Firebase configuration
│   └── openai/          # OpenAI integration
└── ...
```

## 🔐 Environment Variables

Required environment variables for the application:

```env
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## 🚀 Deployment

The application is optimized for deployment on [Vercel](https://vercel.com/):

1. **Connect your repository** to Vercel
2. **Configure environment variables** in Vercel dashboard
3. **Deploy** - Vercel will automatically build and deploy your application

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Developer

**Daniel Garro** - Full-stack developer passionate about creating innovative AI-powered solutions for modern professionals and businesses.

- **GitHub**: [dannynow6](https://github.com/dannynow6)
- **Portfolio**: [daniel-garro-dev.web.app](https://daniel-garro-dev.web.app/)
- **Website**: [dgdesignanddev.com](https://dgdesignanddev.com/)

## 📞 Support

For questions, issues, or feature requests:

- Contact via [website](https://dgdesignanddev.com/)
- Email: apps_dg@proton.me

---

**Built with ❤️ using Next.js, OpenAI, and modern web technologies**
