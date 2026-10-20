# TrailFinder

TrailFinder is an Expo and React Native app for discovering, saving, and tracking outdoor routes around Varna, Bulgaria. Trail cards and maps load from Cloud Firestore; route accuracy depends on the data you add.

## Current features

- Firebase email-and-password registration and sign-in.
- Persistent Firebase Auth sessions using React Native AsyncStorage.
- Startup routing that restores the auth state, then shows the login screen or opens the app.
- Map, My Hikes, Discover, Saved, and Profile tabs.
- A Firestore-backed map with colored route lines, a reusable filter modal, a viewport trail count, and a route detail sheet with start/end markers.
- Shared filters on Map, Discover, Saved, and My Hikes for difficulty, distance, elevation gain, and location. Discover and Map also filter by saved status.
- Discover trail cards with name search, bookmark toggles, loading/error states, and pull-to-refresh.
- User-specific Firestore bookmarks, available from trail cards, map details, trail details, and the Saved tab. Saved includes search, filters, a saved-trail count, and pull-to-refresh.
- A My Hikes history where users can log the same trail multiple times with optional notes and a 1–5 star rating, edit each entry, remove individual entries, sort by date added, and filter by trail attributes.
- Firestore-backed trail detail maps with validated route lines and waypoint markers, plus the user location when permission is granted.
- Profile details, shortcuts to Saved and Discover, and sign-out with confirmation.
- Shared color, spacing, and typography tokens in `src/theme/`; styles are kept in `src/styles/`.

### Prototype limitations

- Firestore trail coordinates and waypoint positions must be verified before use for navigation. `src/data/dummyTrails.js` is retained only as illustrative sample data, and app screens do not read it.
- Elevation gains can be estimates; route difficulty, surface, access rights, connectivity, and current passability are not independently verified.
- Saved trails and hike history require a signed-in user and working Firestore access. Offline maps are not implemented.
- Featured trail images are remote Unsplash URLs and require an internet connection.
- OpenStreetMap-derived route data requires attribution and is subject to the ODbL. Verify that attribution is visible wherever this route data is shown.

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
- [x] Better UI for the trails on the map
  - [x] Dont show the red pinpoint
  - [x] Better styling of the track
- [x] Fix Dummy tracks' coordinates so they are realistic
- [x] Add map difficulty filtering without remounting the map
- [x] **Log Hike Operations (POST, PUT/PATCH, DELETE)**
  - [x] Allow users to log a trail multiple times as separate hike records.
  - [x] Allow users to remove individual entries from their history (**DELETE**).
  - [x] Build a dedicated modal screen for creating new hike logs (**POST**).
  - [x] Add ability for users to update notes/ratings on existing logs (**PUT/PATCH**).

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
- [x] **Cloud Bookmarks**
  - [x] Save favorite trails in each signed-in user's Firestore favorites collection.
  - [x] Add bookmark toggles to Discover cards, Map trail details, and the full trail page.
  - [x] Build Saved with search, filters, and pull-to-refresh.
- [ ] **Offline Caching**
  - [ ] Cache saved trails locally for offline access.
- [ ] **Profile Screen**
  - [x] Display account details, links to Saved and Discover, and sign-out confirmation.
  - [ ] Display user activity stats.

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
  "elevationGainFt": null,
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

`elevationGainFt` can be `null` when elevation has not been verified. Map, Discover, Saved, and My Hikes share filters for difficulty, distance, elevation gain, and location; Discover and Map can additionally filter by saved status. Map routes are hidden when they do not match the selected filters. Its badge counts matching trails that intersect the current viewport; selecting filters does not automatically move the camera. Tapping a visible route line opens a detail sheet. The optional `description` field is shown with the trail location and surface type on the detail screen. Firestore trail reads are implemented in `src/data/trails.js`.

User-specific data is stored under `users/{userId}` in Cloud Firestore:

- `favorites/{trailId}` stores a bookmark and the trail summary needed to render Saved cards.
- `hikes/{hikeId}` stores one completed-hike entry, including optional `notes` and a 1–5 `rating`. Repeated hikes on the same trail use separate documents, each with its own `completedAt` timestamp. New hike entries are created from the trail detail screen; existing entries can be edited in My Hikes.

Configure Firestore Security Rules to restrict user data to its owner and allow the intended trail reads; do not leave the database in test mode for production.

### One-time replacement with mapped Varna routes

`src/data/varnaMappedTrails.js` contains five route polylines taken from OpenStreetMap hiking relations around Golden Sands/Aladzha and Vinitsa–Kichevo. Run the one-time replacement helper from a temporary, deliberate action (for example, an admin-only button handler):

```js
import { replaceTrailsWithMappedVarnaRoutes } from '@/data/replaceTrails';

const result = await replaceTrailsWithMappedVarnaRoutes('REPLACE ALL TRAILS');
console.log(result); // { replacedCount: 5, deletedCount: ... }
```

This replaces the entire `trails` collection: documents not in the new set are deleted, and the five route documents are created or overwritten. The helper requires the exact confirmation string, needs Firestore read/write/delete permissions, and commits atomically; it refuses to run if the replacement exceeds Firestore's 500-write batch limit. Do not call it automatically on screen render or from a production user action. Remove the temporary trigger after a successful run.

The route relations are from OpenStreetMap and their adapted geometry is subject to the [Open Database License (ODbL)](https://www.openstreetmap.org/copyright). The current map screen does not display explicit OpenStreetMap attribution; add visible attribution before distributing the app with these routes. Route distances are approximations; difficulty labels are provisional and based only on distance, not an official grade. Elevation is unset, and route surface, connectivity, access rights, and current passability have not been verified. Check the source relation and local conditions before relying on these routes.

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
  tabs/                      Map, My Hikes, Discover, Saved, and Profile
  trail/[id].js              Trail detail map
src/
  components/                Shared UI, trail cards, and query-state components
  data/trails.js              Firestore trail queries
  data/favorites.js           Per-user Firestore bookmarks
  data/hikes.js               Per-user completed-hike history
  components/TrailFilterModal.js
                              Shared difficulty, distance, elevation, location, and saved filters
  data/dummyTrails.js         Illustrative sample data (unused by app screens)
  data/varnaMappedTrails.js   OpenStreetMap-derived Varna route dataset
  data/replaceTrails.js       Guarded one-time Firestore replacement helper
  screens/                   Login and registration screens
  styles/                    Screen and component StyleSheet modules
  theme/                     Shared colors, spacing, and typography
  utils/                     Small reusable utilities
firebaseConfig.js            Firebase initialization and auth persistence
```

## Trail data

The prototype trails are defined in [`src/data/dummyTrails.js`](./src/data/dummyTrails.js). Each entry includes coordinates for the map polyline and waypoint coordinates for markers. Replace these samples with verified route data before using the app for real-world navigation.
