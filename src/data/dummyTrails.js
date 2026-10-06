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
  }
];