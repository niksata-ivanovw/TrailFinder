# TrailFinder

TrailFinder is an Expo and React Native app for browsing outdoor routes around Varna, Bulgaria. Trail cards and maps load from Cloud Firestore; route accuracy depends on the data you add. Saved-trail functionality is not yet implemented.

## Current features

- Firebase email-and-password registration and sign-in.
- Persistent Firebase Auth sessions using React Native AsyncStorage.
- Startup routing that restores the auth state, then shows the login screen or opens the app.
- Map, Discover, Saved, and Profile tabs.
- A map showing routes that intersect the current viewport, with clickable trail routes and markers that open trail details.
- Firestore-backed Discover trail cards with name search, difficulty filters, loading/error states, and pull-to-refresh.
- Firestore-backed trail detail maps with route lines and waypoint markers.
- Profile details, shortcuts to Saved and Discover, and sign-out confirmation.
- Shared color, spacing, and typography tokens in `src/theme/`; styles are kept in `src/styles/`.

### Prototype limitations

- Firestore trail coordinates and waypoint positions must be verified before use for navigation. `src/data/dummyTrails.js` is retained only as illustrative sample data and is no longer read by app screens.
- Elevation gains are estimates.
- The Saved tab is a placeholder; bookmarking and offline maps are not implemented.
- Featured trail images are remote Unsplash URLs and require an internet connection.

## Tech stack

- Expo SDK 57 and React Native
- Expo Router
- `react-native-maps`
- Expo Location
- Firebase JavaScript SDK (Authentication and Cloud Firestore)
- React Native AsyncStorage for Firebase Auth persistence

## Prerequisites

- Node.js version supported by the installed Expo SDK
- npm
- For Android emulator development: Android Studio, Android SDK, and a running emulator
- A Firebase project with Email/Password sign-in enabled
- Cloud Firestore enabled in that Firebase project, with read access configured for the signed-in app users
- For native Android Google Maps: a Google Cloud project with Maps SDK for Android enabled and billing configured

## 📋 Master Project Roadmap & TODO List

### Phase 1: Cloud Backend & Firestore CRUD Integration
- [x] **Firestore Configuration**
  - [x] Initialize Cloud Firestore alongside Firebase Auth in your Firebase setup.
- [x] **Explore Screen (GET)**
  - [x] Replace hardcoded dummy trail data with dynamic Firestore queries.
  - [x] Add explicit **Loading** (`ActivityIndicator`) and **Error** UI fallback states.
  - [x] Attach `RefreshControl` for **Pull-to-Refresh** functionality.
- [x] **Trail Details Screen (GET Details)**
  - [x] Read the trail document ID from the `/trail/[id]` route and load trail details dynamically.
- [ ] Better UI for the trails on the map
  - [ ] Dont show the red pinpoint
  - [ ] Better styling of the track
- [ ] Fix Dummy tracks' coordinates so they are realistic
- [ ] **Log Hike Modal & Operations (POST, PUT/PATCH, DELETE)**
  - [ ] Build/connect the modal screen for creating new hike logs (**POST**).
  - [ ] Add ability for users to update notes/ratings on existing logs (**PUT/PATCH**).
  - [ ] Implement deletion functionality to remove entries from history (**DELETE**).


---

### Phase 2: Inputs Beyond Text & Advanced Form UX
- [ ] **Update Log Hike Form Controls**
  - [ ] **Slider**: Add difficulty rating input (1–5 scale).
  - [ ] **DateTimePicker**: Add hike date selection component.
  - [ ] **Switch**: Add "Dog-Friendly" toggle.
- [ ] **Form Protection & Layout UX**
  - [ ] Ensure form components are properly wrapped in `KeyboardAvoidingView` to maintain input visibility.
  - [ ] Enforce password strength / multi-rule validation on Registration.

---

### Phase 3: Native Device Capabilities
- [ ] **Choose & Implement Native Functionality**:
  - [ ] **Option A (Sensors)**: Integrate `expo-pedometer` for real-time step tracking during hikes.
  - [ ] **Option B (Camera)**: Integrate `expo-image-picker` allowing users to capture and attach trail photos to logs.
  - [ ] **Option C (Location/Maps)**: Integrate `expo-location` or MapView for trailhead discovery and route plotting.

---

### Phase 4: Bookmarks & Profile
- [ ] **Offline Caching & Bookmarks**
  - [ ] Implement local storage bookmarking for favorite trails using `@react-native-async-storage/async-storage` or `expo-sqlite`.
- [ ] **Profile Screen**
  - [ ] Display user activity stats, saved trails list, and functional Logout button.

---

### Phase 5: Release Build & Project Finalization
- [ ] **EAS Build**
  - [ ] Build the Android package (`.apk`) using EAS (`eas build -p android --profile preview`).
- [ ] **Documentation & Requirements Verification**
  - [ ] Confirm at least 5 commits exist across 3 separate days in Git history.
  - [ ] Complete `README.md` with setup instructions, functional guide, and the prominent link to the downloadable `.apk`.

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

## Firestore trail documents

Create a `trails` collection in Cloud Firestore. Each document ID is used as the trail's route ID. Trail documents should include the fields used by the cards and maps:

```json
{
  "name": "Example Trail",
  "location": "Varna, Bulgaria",
  "description": "A scenic route through the coastal park.",
  "difficulty": "Beginner",
  "surfaceType": "Dirt",
  "distanceMiles": 3.2,
  "elevationGainFt": 120,
  "imageUrl": "https://example.com/trail.jpg",
  "coordinates": [
    { "latitude": 43.205, "longitude": 27.9215 }
  ],
  "waypoints": [
    {
      "type": "trailhead",
      "title": "Trail entrance",
      "latitude": 43.205,
      "longitude": 27.9215
    }
  ]
}
```

The Map tab fetches trails from the `trails` collection and filters their route coordinates against the currently visible map region. Tap a route line to open its detail screen, or tap a trail marker and then its callout. The optional `description` field is shown with the trail location and surface type on the detail screen. Firestore reads are implemented in `src/data/trails.js`. Configure Firestore Security Rules to allow the intended reads; do not leave the database in test mode for production.

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
  data/trails.js              Firestore trail queries
  data/dummyTrails.js         Illustrative sample data (unused by app screens)
  screens/                   Login and registration screens
  styles/                    Screen and component StyleSheet modules
  theme/                     Shared colors, spacing, and typography
  utils/                     Small reusable utilities
firebaseConfig.js            Firebase initialization and auth persistence
```

## Trail data

The prototype trails are defined in [`src/data/dummyTrails.js`](./src/data/dummyTrails.js). Each entry includes coordinates for the map polyline and waypoint coordinates for markers. Replace these samples with verified route data before using the app for real-world navigation.
