# Firma Station for Mobile

<div style={{display: flex}}>
<img height="400" src="https://user-images.githubusercontent.com/93243647/
150078237-194c5fd9-ae78-4d3b-bf7c-9b7539758099.png">
<img height="400" src="https://user-images.githubusercontent.com/93243647/
150078250-e5220add-2af0-4a28-a6cb-fe52c98fa414.png">
<img height="400" src="https://user-images.githubusercontent.com/93243647/
150078252-cc64d88f-f33e-47c2-b933-7f48af9b6bc4.png">
<div>
<br/>

## Project Overview

    Firma Station Mobile is a non-custodial wallet app for Cosmos-based blockchains.
     It allows users to manage tokens, stake, participate in governance, handle NFTs, and interact with DApps securely on mobile devices.

---

## Tech Stack

- **Frontend:** React Native, TypeScript, Redux
- **Styling:** React Native StyleSheet
- **Build Tools:** Metro, Xcode, Android Studio
- **Lint/Format:** ESLint, Prettier
- **Other:** Apollo Client, React Navigation

---

## Directory Structure

```
.
├── android/                # Android native project
├── ios/                    # iOS native project
├── src/
│   ├── api/                # API integrations
│   ├── apollo/             # GraphQL setup
│   ├── components/         # Reusable UI components
│   ├── constants/          # Static resources and constants
│   ├── context/            # React contexts
│   ├── hooks/              # Custom hooks
│   ├── navigators/         # Navigation setup
│   ├── organisms/          # Complex UI blocks
│   ├── redux/              # State management
│   ├── screens/            # App screens
│   ├── util/               # Utility functions
│   └── assets/             # Fonts, images, etc.
├── index.js                # Entry point
├── package.json
└── ...
```

---

## Getting Started

### Prerequisites

- Node.js: v18.20.6
- Yarn berry (recommended)
- OpenJDK: v17
- Xcode (for iOS)
- Android Studio (for Android)

### Installation

```bash
git clone <repo-url>
cd firma-station-mobile
nvm use
yarn install
```

### iOS Setup

```bash
cd ios
pod install
cd ..
```

### Running the Development Server

```bash
yarn run ios      # for iOS
yarn run android  # for Android
```

---

## Available Scripts

| Script             | Description               |
| ------------------ | ------------------------- |
| `yarn run ios`     | Run app on iOS simulator  |
| `yarn run android` | Run app on Android device |
| `yarn lint`        | Run ESLint                |
| `yarn format`      | Format code with Prettier |

---

## Environment Variables

- Copy `.config.sample.ts` to `.config.ts` and set required values.

---

## Note

- When build fails with updated deps, try `yarn install --immutable`
