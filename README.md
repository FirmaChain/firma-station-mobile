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
2. Replace the 'package.json' file with the 'origin-package.json' file.
3. Install modules.
<pre>
  <code>
    npm install
  </code>
</pre>

4. Proceed in the following order.
<pre>
  <code>
  cd ios
  pod install
  cd ..

  npm i --save-dev tradle/rn-nodeify
  ./node_modules/.bin/rn-nodeify --hack --install
  </code>
</pre>

5. Add the following code to the shim.js file
<pre>
  <code>
    ...
    if (typeof BigInt === 'undefined') global.BigInt = require('big-integer');
  </code>
</pre>

6. Imports shim.js to index.js.

### 2. Run
<pre>
  <code>
  npm run ios
  npm run android
  </code>
</pre>
