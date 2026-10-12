export const dummyTrails = [
  {
    id: 't-001',
    name: 'Eagle Peak Loop',
    location: 'Yosemite National Park, CA',
    difficulty: 'Intermediate', // Beginner | Intermediate | Expert
    surfaceType: 'Dirt',
    distanceMiles: 4.5,
    elevationGainFt: 1200,
    imageUrl: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800',
    // Array of lat/lng for React Native Maps Polyline
    coordinates: [
      { latitude: 37.741, longitude: -119.587 },
      { latitude: 37.745, longitude: -119.590 },
      // ... Add 3-4 points to draw a basic line later
    ],
    // POIs for Map Markers
    waypoints: [
      { type: 'trailhead', title: 'Start', latitude: 37.741, longitude: -119.587 },
      { type: 'viewpoint', title: 'Summit Look', latitude: 37.745, longitude: -119.590 }
    ]
  },
  {
    id: 't-002',
    name: 'Varna TV Tower DH (Right Trail)',
    location: 'Sotira, Varna, Bulgaria',
    difficulty: 'Expert',
    surfaceType: 'Dirt',
    distanceMiles: 3.9,
    elevationGainFt: 650, // Approximate; the source does not list elevation gain.
    imageUrl: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800',
    // Approximate sample points based on the published route description, not a recorded GPS track.
    coordinates: [
      { latitude: 43.2270, longitude: 27.9400 },
      { latitude: 43.2290, longitude: 27.9390 },
      { latitude: 43.2305, longitude: 27.9405 },
      { latitude: 43.2320, longitude: 27.9430 },
      { latitude: 43.2335, longitude: 27.9470 },
      { latitude: 43.2345, longitude: 27.9515 },
      { latitude: 43.2365, longitude: 27.9550 },
      { latitude: 43.2385, longitude: 27.9590 },
      { latitude: 43.2370, longitude: 27.9565 },
      { latitude: 43.2350, longitude: 27.9525 },
      { latitude: 43.2335, longitude: 27.9485 },
      { latitude: 43.2315, longitude: 27.9445 },
      { latitude: 43.2290, longitude: 27.9415 },
      { latitude: 43.2270, longitude: 27.9400 }
    ],
    waypoints: [
      { type: 'trailhead', title: 'Start - St. Marina Hospital', latitude: 43.2270, longitude: 27.9400 },
      { type: 'junction', title: 'Sotira villa zone climb', latitude: 43.2305, longitude: 27.9405 },
      { type: 'junction', title: 'Forest trail junction', latitude: 43.2345, longitude: 27.9515 },
      { type: 'viewpoint', title: 'Varna TV Tower', latitude: 43.2385, longitude: 27.9590 },
      { type: 'junction', title: 'Right-hand DH descent', latitude: 43.2350, longitude: 27.9525 },
      { type: 'junction', title: 'Return through Sotira', latitude: 43.2290, longitude: 27.9415 }
    ]
  }
];