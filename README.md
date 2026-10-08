### TrailFinder
A mobile application for discovering, saving, and exploring hiking trails and outdoor routes. Built with React Native and Expo.

#### Vision & Roadmap
TrailFinder is designed to help outdoor enthusiasts discover scenic nature trails, review difficulty ratings, and track hiking itineraries.

##### Key Roadmap Milestones
*   [x] **Authentication Flow:** Implemented complete Login and Register screens using Firebase. Resolved screen navigation loops and established session persistence.
*   [x] **Navigation Setup:** Established the core routing structure, splitting unauthenticated users into the Auth Stack and logged-in users into the Main Page.
*   [x] **Mock Prototyping:** Integrated dummy data alongside basic navigation to lay out the app's foundation.
*   [-] **Trail Discovery:** Search and browse trails by geographical location, elevation gain, and distance.
*   [-] **Interactive Maps:** Route preview with GPS coordinate plotting and waypoint markers.
*   [-] **Difficulty Ratings:** Categorize routes by physical demand (Beginner, Intermediate, Expert) and surface types.
*   [-] **Bookmarks & Offline Mode:** Save favorite trails locally for navigation in low-connectivity areas.

#### Tech Stack
*   **Framework:** [Expo](https://expo.dev/) / React Native
*   **Language:** JavaScript (ES6+ / JSX)
*   **Backend & Auth:** Firebase JS SDK (Authentication & Firestore)

#### Getting Started
##### Prerequisites
*   [Node.js](https://nodejs.org/) (v18+)
*   [Expo Go](https://expo.dev/go) app on your mobile device

##### Installation & Run
1. Clone the repository:
```bash
git clone https://github.com/niksata-ivanovw/TrailFinder.git
cd TrailFinder
```

2. Install dependencies (this will automatically pull everything listed in your `package.json` and `package-lock.json`):
```bash
npm install
```

3. Start the development server:
```bash
npx expo start
```

4. Open the app by scanning the QR code in your terminal with Expo Go.