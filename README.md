# Firma Station for Mobile

<div style={{display: flex}}>
<img height="400" src="https://user-images.githubusercontent.com/93243647/150078237-194c5fd9-ae78-4d3b-bf7c-9b7539758099.png">
<img height="400" src="https://user-images.githubusercontent.com/93243647/150078250-e5220add-2af0-4a28-a6cb-fe52c98fa414.png">
<img height="400" src="https://user-images.githubusercontent.com/93243647/150078252-cc64d88f-f33e-47c2-b933-7f48af9b6bc4.png">
<div>

### 1. Requirements

-   Node.JS: v18.20.6
-   OpenJDK: 11.0.24

### 2. install

> **Do not remove .lock files for no reason.**

1. Create a project with git clone.

2. Install modules.

```bash
nvm use
npm install
```

4. Install pod modules for iOS

```bash
cd ios
pod install
cd ..
```

5. Test iOS build with XCode

-   Open project with xcode and test build.
-   Some error could occur but most of those are not critical and easy to fix.

### 3. Run

```bash
npm run ios
npm run android
```
