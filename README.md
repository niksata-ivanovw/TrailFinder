# TrailFinder

TrailFinder is an Expo and React Native app for browsing outdoor routes around Varna, Bulgaria. It is currently a prototype: trail data and map tracks are illustrative, and saved-trail functionality is not yet implemented.

## Current features

- Firebase email-and-password registration and sign-in.
- Persistent Firebase Auth sessions using React Native AsyncStorage.
- Startup routing that restores the auth state, then shows the login screen or opens the app.
- Map, Discover, Saved, and Profile tabs.
- A featured map with a route line and waypoint markers.
- Discover trail cards with name search and difficulty filters.
- Trail detail maps with route lines and waypoint markers.
- Profile details, shortcuts to Saved and Discover, and sign-out confirmation.
- Ten dummy trails around Varna, with varied sample routes, waypoints, difficulty, and distances.
- Shared color, spacing, and typography tokens in `src/theme/`; styles are kept in `src/styles/`.

### Prototype limitations

- All trail coordinates and waypoint positions are sample data, not GPS tracks for navigation.
- Elevation gains are estimates.
- The Saved tab is a placeholder; bookmarking and offline maps are not implemented.
- Featured trail images are remote Unsplash URLs and require an internet connection.

## Tech stack

- Expo SDK 57 and React Native
- Expo Router
- `react-native-maps`
- Expo Location
- Firebase JavaScript SDK (Authentication)
- React Native AsyncStorage for Firebase Auth persistence

## Prerequisites

- Node.js version supported by the installed Expo SDK
- npm
- For Android emulator development: Android Studio, Android SDK, and a running emulator
- A Firebase project with Email/Password sign-in enabled
- For native Android Google Maps: a Google Cloud project with Maps SDK for Android enabled and billing configured

## Setup

1. Install the JavaScript dependencies:

   ```sh
   npm install
   ```

2. Create a local environment file from the example:

   ```sh
   cp .env.example .env
   ```

3. Fill in the Firebase web app configuration values in `.env`:

   ```dotenv
   EXPO_PUBLIC_FIREBASE_API_KEY=
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
   EXPO_PUBLIC_FIREBASE_APP_ID=
   ```

   These values are read in [`firebaseConfig.js`](./firebaseConfig.js). The local `.env` file is git-ignored; do not commit it.

4. Configure Google Maps for Android in `app.json` under `expo.android.config.googleMaps.apiKey`. Enable **Maps SDK for Android** in Google Cloud, enable billing, and restrict the key to the app's Android package (`com.niksata.trailfinder`) and the SHA-1 certificate fingerprint for the build you install. Restrict the key to the APIs it needs and do not commit an unrestricted key.

## Run on Android

Start an Android emulator, then build, install, and launch the development app:

```sh
npm run android
```

For subsequent JavaScript development sessions, start the Expo development server:

```sh
npm start
```

If you change native configuration, such as the Android Maps API key, rebuild and reinstall the app with `npm run android`; restarting Metro alone does not update the native binary.

## Other platform scripts

```sh
npm run ios
npm run web
```

These scripts require the corresponding platform development environment. Native map behavior and configuration can differ by platform.

## Project structure

```text
app/                         Expo Router routes and layouts
  index.js                   Auth-state check and login entry route
  register.js                Registration route
  tabs/                      Map, Discover, Saved, and Profile
  trail/[id].js              Trail detail map
src/
  components/                Shared UI components
  data/dummyTrails.js        Illustrative Varna trail data
  screens/                   Login and registration screens
  styles/                    Screen and component StyleSheet modules
  theme/                     Shared colors, spacing, and typography
  utils/                     Small reusable utilities
firebaseConfig.js            Firebase initialization and auth persistence
```

## Trail data

The prototype trails are defined in [`src/data/dummyTrails.js`](./src/data/dummyTrails.js). Each entry includes coordinates for the map polyline and waypoint coordinates for markers. Replace these samples with verified route data before using the app for real-world navigation.
