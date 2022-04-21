# Firma Station for Mobile
<div style={{display: flex}}>
<img height="400" src="https://user-images.githubusercontent.com/93243647/150078237-194c5fd9-ae78-4d3b-bf7c-9b7539758099.png">
<img height="400" src="https://user-images.githubusercontent.com/93243647/150078250-e5220add-2af0-4a28-a6cb-fe52c98fa414.png">
<img height="400" src="https://user-images.githubusercontent.com/93243647/150078252-cc64d88f-f33e-47c2-b933-7f48af9b6bc4.png">
<div>
 
How to build and run firma-station-mobile
=========================================
### 1. install

1. Create a project with git clone.
2. Create a new project and copy the following files from a project created as a clone.
  * src
  * react-native.config.js
  * tsconfig.json
  * babel.config.js
3. Connect the fonts through the following code:
<pre>
  <code>
  react-native link  
  </code>
</pre>

4. Install the following modules.
<pre>
  <code>
  yarn add react-native-gesture-handler react-navigation react-native-safe-area-context react-native-screens @react-native-community/masked-view @react-navigation/native @react-navigation/stack @react-native-clipboard/clipboard react-native-status-bar-height react-native-iphone-x-helper react-native-toast-message asyncstorage-down moment @react-navigation/bottom-tabs crypto-js@3.3.0 react-native-keychain @apollo/client@3.4.16 @apollo/react-hooks@4.0.0 graphql@15.7.1 apollo-boost@0.4.9 react-native-biometrics react-native-device-info react-native-camera react-native-qrcode-scanner react-native-permissions react-native-svg react-native-qrcode-svg react-native-reanimated @react-native-async-storage/async-storage
  </code>
</pre>
<pre>
  <code>
  npm i react-native-splash-screen --save
  npm install redux-thunk redux react-redux
  npm install --save-dev redux-tools
  npm install @types/react-redux -D
  npm install redux-persist
  npm i jail-monkey
  npm install --save @react-native-community/netinfo
  npm install react-native-vector-icons
  npm install -dev @types/react-native-vector-icons
  npm install -dev babel-plugin-module-resolver
  npm install --save react-native-draggable-flatlist
  npm install --save react-native-webview
  npm i --save-dev @types/crypto-js
  </code>
</pre>

5. Add the following codes.

<pre>
  <code>
  // android/src/build.gradle
  apply from: "../../node_modules/react-native-vector-icons/fonts.gradle"
  ...
  ...
  android {
    defaultConfig {
      ...
      missingDimensionStrategy 'react-native-camera', 'general'
      missingDimensionStrategy 'react-native-camera', 'mlkit'
    }
  }


  // ios/Podfile
  // below the target.
  ...
  target 'firma_station_mobile' do
  ...
  permissions_path = '../node_modules/react-native-permissions/ios'
  pod 'Permission-Camera', :path => "#{permissions_path}/Camera"
  pod 'RNVectorIcons', :path => '../node_modules/react-native-vector-icons'
  ...
  ...
  
  </code>
</pre>
      // ios/PROJECT_NAME/Info.plist
      // between UIAppFons array

      <string>AntDesign.ttf</string>
      <string>Entypo.ttf</string>
      <string>EvilIcons.ttf</string>
      <string>Feather.ttf</string>
      <string>FontAwesome.ttf</string>
      <string>FontAwesome5_Brands.ttf</string>
      <string>FontAwesome5_Regular.ttf</string>
      <string>FontAwesome5_Solid.ttf</string>
      <string>Foundation.ttf</string>
      <string>Ionicons.ttf</string>
      <string>MaterialIcons.ttf</string>
      <string>MaterialCommunityIcons.ttf</string>
      <string>SimpleLineIcons.ttf</string>
      <string>Octicons.ttf</string>
      <string>Zocial.ttf</string>
    
6. Proceed in the following order.
<pre>
  <code>
  npm i @firmachain/firma-js
  npm i --save react-native-crypto
  npm i --save react-native-randombytes

  cd ios
  pod install
  cd ..

  npm i --save-dev tradle/rn-nodeify
  ./node_modules/.bin/rn-nodeify --hack --install
  </code>
</pre>

7. Imports shim.js to index.js.

### 2. Run
<pre>
  <code>
  npx react-native run-android
  npx react-native run-ios
  </code>
</pre>
