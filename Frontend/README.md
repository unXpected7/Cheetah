# WhatsApp Clone - Frontend

A modern WhatsApp-inspired chat application built with React, TypeScript, Tailwind CSS, and shadcn/ui components. This application provides a responsive chat interface with features like real-time messaging, chat lists, and responsive design for both desktop and mobile devices.

## Features

- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Chat Management**: Personal chats, group chats, and channels support
- **Real-time Messaging**: Send and receive messages with typing indicators
- **Search Functionality**: Search through chats and messages
- **Tab Navigation**: Separate tabs for Chats, Calls, and Status
- **Dark/Light Theme**: Built with Tailwind CSS for styling
- **Accessibility**: Full keyboard navigation and screen reader support
- **Unit Testing**: Comprehensive test suite with Jest and React Testing Library

## Tech Stack

- **React 17**: Core UI framework
- **TypeScript**: Static type checking
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Modern component library
- **Jest**: Unit testing framework
- **React Testing Library**: Testing utilities
- **ESLint**: Code linting
- **Prettier**: Code formatting

## Project Structure

```
src/
├── Components/
│   ├── Main/
│   │   ├── WhatsAppInterface.tsx    # Main application container
│   │   ├── ChatList/
│   │   │   └── ChatList.tsx          # Chat list with search and tabs
│   │   └── ChatGroup/
│   │       └── Chat.tsx              # Individual chat interface
│   └── ui/                          # shadcn/ui components
├── types/
│   └── chat.ts                      # TypeScript type definitions
├── __tests__/
│   ├── components/                   # Component tests
│   ├── mocks/                       # Test data and mocks
│   └── setup.ts                     # Test configuration
├── App.tsx                          # Main application component
├── index.tsx                       # Entry point
└── App.css                          # Global styles
```

## Getting Started

### Prerequisites

- Node.js 14.0 or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Frontend
```

2. Install dependencies:
```bash
npm install
```

### Development

Start the development server:
```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the application in your browser.

The page will reload automatically when you make changes.

## Testing

Run the test suite:
```bash
npm test
```

The tests use Jest with React Testing Library and include:
- Component rendering tests
- User interaction tests
- Error handling tests
- Accessibility tests
- Performance tests

To run tests with coverage:
```bash
npm run test:coverage
```

## Building for Production

Create a production build:
```bash
npm run build
```

The build output will be in the `build/` directory and is ready for deployment.

## Available Scripts

- `npm start` - Start development server
- `npm test` - Run test suite in watch mode
- `npm run build` - Build for production
- `npm run eject` - Eject from Create React App (not recommended)
- `npm run lint` - Run ESLint
- `npm run format` - Run Prettier formatter

## Key Components

### WhatsAppInterface.tsx
Main container component that handles:
- Responsive layout (desktop/mobile)
- Chat selection and view management
- Navigation between different views

### ChatList.tsx
Chat list component featuring:
- Search functionality
- Tab navigation (Chats, Calls, Status)
- Chat item rendering with avatars and unread counts
- Empty states for filtered results

### Chat.tsx
Individual chat interface with:
- Message display with timestamps
- Message input with send functionality
- Typing indicators
- Error handling and retry mechanisms
- Auto-scroll to latest messages

## Type Definitions

The application uses TypeScript with comprehensive type definitions in `src/types/chat.ts`:
- `ChatInfo`: Chat metadata and properties
- `ChatMessage`: Individual message structure
- `ChatType`: Enum for chat types (personal, group, channel)

## Mock Services

For development and testing, the application includes mock API services:
- Mock chat data
- Simulated API responses
- Error scenarios testing

## Styling

The application uses Tailwind CSS with a custom color scheme based on WhatsApp's design:
- Green accent color (#128C7E)
- Clean, modern interface
- Responsive utilities for mobile-first design

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

## License

This project is licensed under the MIT License.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
