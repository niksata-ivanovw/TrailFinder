// Coordinates are illustrative sample routes, not recorded GPS tracks.
export const dummyTrails = [
  {
    id: 't-002',
    name: 'Varna TV Tower DH (Right Trail)',
    location: 'Sotira, Varna, Bulgaria',
    difficulty: 'Expert',
    surfaceType: 'Dirt',
    distanceMiles: 3.9,
    elevationGainFt: 650,
    imageUrl: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800',
    coordinates: [
      { latitude: 43.2270, longitude: 27.9400 },
      { latitude: 43.2280, longitude: 27.9392 },
      { latitude: 43.2290, longitude: 27.9390 },
      { latitude: 43.2305, longitude: 27.9405 },
      { latitude: 43.2315, longitude: 27.9420 },
      { latitude: 43.2320, longitude: 27.9430 },
      { latitude: 43.2330, longitude: 27.9450 },
      { latitude: 43.2335, longitude: 27.9470 },
      { latitude: 43.2340, longitude: 27.9490 },
      { latitude: 43.2345, longitude: 27.9515 },
      { latitude: 43.2355, longitude: 27.9530 },
      { latitude: 43.2365, longitude: 27.9550 },
      { latitude: 43.2375, longitude: 27.9570 },
      { latitude: 43.2385, longitude: 27.9590 },
      { latitude: 43.2375, longitude: 27.9575 },
      { latitude: 43.2365, longitude: 27.9555 },
      { latitude: 43.2350, longitude: 27.9525 },
      { latitude: 43.2340, longitude: 27.9510 },
      { latitude: 43.2335, longitude: 27.9485 },
      { latitude: 43.2320, longitude: 27.9460 },
      { latitude: 43.2315, longitude: 27.9440 },
      { latitude: 43.2300, longitude: 27.9425 },
      { latitude: 43.2290, longitude: 27.9415 },
      { latitude: 43.2270, longitude: 27.9400 }
    ],
    waypoints: [
      { type: 'trailhead', title: 'Start - St. Marina Hospital', latitude: 43.2270, longitude: 27.9400 },
      { type: 'junction', title: 'Sotira villa zone climb', latitude: 43.2305, longitude: 27.9405 },
      { type: 'junction', title: 'Forest edge', latitude: 43.2320, longitude: 27.9430 },
      { type: 'junction', title: 'Plateau trail junction', latitude: 43.2345, longitude: 27.9515 },
      { type: 'viewpoint', title: 'Varna TV Tower', latitude: 43.2385, longitude: 27.9590 },
      { type: 'junction', title: 'Right-hand DH descent', latitude: 43.2350, longitude: 27.9525 },
      { type: 'viewpoint', title: 'Forest ravine crossing', latitude: 43.2335, longitude: 27.9485 },
      { type: 'junction', title: 'Lower trail exit', latitude: 43.2300, longitude: 27.9425 },
      { type: 'trailhead', title: 'Return to St. Marina Hospital', latitude: 43.2270, longitude: 27.9400 }
    ]
  },
  {
    id: 't-003',
    name: 'Sea Garden Coast Loop',
    location: 'Sea Garden, Varna, Bulgaria',
    difficulty: 'Beginner',
    surfaceType: 'Paved and gravel',
    distanceMiles: 3.2,
    elevationGainFt: 120,
    imageUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800',
    coordinates: [
      { latitude: 43.2050, longitude: 27.9215 },
      { latitude: 43.2080, longitude: 27.9230 },
      { latitude: 43.2115, longitude: 27.9250 },
      { latitude: 43.2150, longitude: 27.9270 },
      { latitude: 43.2185, longitude: 27.9290 },
      { latitude: 43.2200, longitude: 27.9320 },
      { latitude: 43.2170, longitude: 27.9335 },
      { latitude: 43.2135, longitude: 27.9310 },
      { latitude: 43.2100, longitude: 27.9280 },
      { latitude: 43.2070, longitude: 27.9250 },
      { latitude: 43.2050, longitude: 27.9215 }
    ],
    waypoints: [
      { type: 'trailhead', title: 'Sea Garden south entrance', latitude: 43.2050, longitude: 27.9215 },
      { type: 'viewpoint', title: 'Seaside promenade', latitude: 43.2115, longitude: 27.9250 },
      { type: 'viewpoint', title: 'Open-air theatre area', latitude: 43.2185, longitude: 27.9290 },
      { type: 'junction', title: 'Northern garden turn', latitude: 43.2200, longitude: 27.9320 },
      { type: 'trailhead', title: 'Return to south entrance', latitude: 43.2050, longitude: 27.9215 }
    ]
  },
  {
    id: 't-004',
    name: 'Galata Forest Ridge',
    location: 'Galata, Varna, Bulgaria',
    difficulty: 'Intermediate',
    surfaceType: 'Dirt and forest paths',
    distanceMiles: 5.4,
    elevationGainFt: 520,
    imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800',
    coordinates: [
      { latitude: 43.1710, longitude: 27.9340 },
      { latitude: 43.1725, longitude: 27.9370 },
      { latitude: 43.1745, longitude: 27.9390 },
      { latitude: 43.1760, longitude: 27.9425 },
      { latitude: 43.1780, longitude: 27.9460 },
      { latitude: 43.1800, longitude: 27.9480 },
      { latitude: 43.1810, longitude: 27.9440 },
      { latitude: 43.1790, longitude: 27.9410 },
      { latitude: 43.1770, longitude: 27.9370 },
      { latitude: 43.1750, longitude: 27.9345 },
      { latitude: 43.1710, longitude: 27.9340 }
    ],
    waypoints: [
      { type: 'trailhead', title: 'Galata forest entrance', latitude: 43.1710, longitude: 27.9340 },
      { type: 'junction', title: 'Lower woodland fork', latitude: 43.1745, longitude: 27.9390 },
      { type: 'viewpoint', title: 'Ridge clearing', latitude: 43.1780, longitude: 27.9460 },
      { type: 'junction', title: 'Upper ridge turn', latitude: 43.1810, longitude: 27.9440 },
      { type: 'viewpoint', title: 'Forest overlook', latitude: 43.1770, longitude: 27.9370 },
      { type: 'trailhead', title: 'Return to Galata entrance', latitude: 43.1710, longitude: 27.9340 }
    ]
  },
  {
    id: 't-005',
    name: 'Golden Sands Forest Circuit',
    location: 'Golden Sands Nature Park, Varna, Bulgaria',
    difficulty: 'Intermediate',
    surfaceType: 'Forest dirt',
    distanceMiles: 6.1,
    elevationGainFt: 780,
    imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
    coordinates: [
      { latitude: 43.2810, longitude: 28.0430 },
      { latitude: 43.2830, longitude: 28.0460 },
      { latitude: 43.2860, longitude: 28.0470 },
      { latitude: 43.2880, longitude: 28.0430 },
      { latitude: 43.2890, longitude: 28.0380 },
      { latitude: 43.2860, longitude: 28.0340 },
      { latitude: 43.2820, longitude: 28.0330 },
      { latitude: 43.2790, longitude: 28.0360 },
      { latitude: 43.2780, longitude: 28.0400 },
      { latitude: 43.2810, longitude: 28.0430 }
    ],
    waypoints: [
      { type: 'trailhead', title: 'Nature park south entrance', latitude: 43.2810, longitude: 28.0430 },
      { type: 'junction', title: 'Beech forest fork', latitude: 43.2860, longitude: 28.0470 },
      { type: 'viewpoint', title: 'Upper forest ridge', latitude: 43.2890, longitude: 28.0380 },
      { type: 'junction', title: 'Western descent junction', latitude: 43.2820, longitude: 28.0330 },
      { type: 'viewpoint', title: 'Shaded ravine', latitude: 43.2780, longitude: 28.0400 },
      { type: 'trailhead', title: 'Return to park entrance', latitude: 43.2810, longitude: 28.0430 }
    ]
  },
  {
    id: 't-006',
    name: 'Aladzha Monastery Woodland Ride',
    location: 'Aladzha Monastery, Varna, Bulgaria',
    difficulty: 'Beginner',
    surfaceType: 'Packed dirt and gravel',
    distanceMiles: 2.8,
    elevationGainFt: 260,
    imageUrl: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=800',
    coordinates: [
      { latitude: 43.2770, longitude: 28.0060 },
      { latitude: 43.2790, longitude: 28.0080 },
      { latitude: 43.2810, longitude: 28.0100 },
      { latitude: 43.2820, longitude: 28.0130 },
      { latitude: 43.2790, longitude: 28.0150 },
      { latitude: 43.2760, longitude: 28.0130 },
      { latitude: 43.2750, longitude: 28.0090 },
      { latitude: 43.2770, longitude: 28.0060 }
    ],
    waypoints: [
      { type: 'trailhead', title: 'Monastery visitor area', latitude: 43.2770, longitude: 28.0060 },
      { type: 'viewpoint', title: 'Rock monastery approach', latitude: 43.2810, longitude: 28.0100 },
      { type: 'junction', title: 'Pine woodland fork', latitude: 43.2820, longitude: 28.0130 },
      { type: 'viewpoint', title: 'Forest picnic clearing', latitude: 43.2760, longitude: 28.0130 },
      { type: 'trailhead', title: 'Return to visitor area', latitude: 43.2770, longitude: 28.0060 }
    ]
  },
  {
    id: 't-007',
    name: 'Euxinograd Coastal Path',
    location: 'Euxinograd, Varna, Bulgaria',
    difficulty: 'Beginner',
    surfaceType: 'Coastal gravel and paved path',
    distanceMiles: 4.6,
    elevationGainFt: 180,
    imageUrl: 'https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=800',
    coordinates: [
      { latitude: 43.2270, longitude: 28.0050 },
      { latitude: 43.2290, longitude: 28.0080 },
      { latitude: 43.2310, longitude: 28.0110 },
      { latitude: 43.2330, longitude: 28.0140 },
      { latitude: 43.2340, longitude: 28.0180 },
      { latitude: 43.2310, longitude: 28.0200 },
      { latitude: 43.2280, longitude: 28.0170 },
      { latitude: 43.2260, longitude: 28.0130 },
      { latitude: 43.2250, longitude: 28.0090 },
      { latitude: 43.2270, longitude: 28.0050 }
    ],
    waypoints: [
      { type: 'trailhead', title: 'Euxinograd route start', latitude: 43.2270, longitude: 28.0050 },
      { type: 'viewpoint', title: 'Coastal path overlook', latitude: 43.2310, longitude: 28.0110 },
      { type: 'junction', title: 'Northern path turn', latitude: 43.2340, longitude: 28.0180 },
      { type: 'viewpoint', title: 'Sea-facing rest point', latitude: 43.2280, longitude: 28.0170 },
      { type: 'trailhead', title: 'Return to Euxinograd start', latitude: 43.2270, longitude: 28.0050 }
    ]
  },
  {
    id: 't-008',
    name: 'Asparuhovo Park and Ridge',
    location: 'Asparuhovo, Varna, Bulgaria',
    difficulty: 'Intermediate',
    surfaceType: 'Dirt and gravel',
    distanceMiles: 5.0,
    elevationGainFt: 430,
    imageUrl: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800',
    coordinates: [
      { latitude: 43.1780, longitude: 27.8980 },
      { latitude: 43.1800, longitude: 27.9010 },
      { latitude: 43.1820, longitude: 27.9050 },
      { latitude: 43.1850, longitude: 27.9070 },
      { latitude: 43.1870, longitude: 27.9030 },
      { latitude: 43.1850, longitude: 27.8990 },
      { latitude: 43.1820, longitude: 27.8960 },
      { latitude: 43.1790, longitude: 27.8950 },
      { latitude: 43.1780, longitude: 27.8980 }
    ],
    waypoints: [
      { type: 'trailhead', title: 'Asparuhovo park entrance', latitude: 43.1780, longitude: 27.8980 },
      { type: 'junction', title: 'Park woodland fork', latitude: 43.1820, longitude: 27.9050 },
      { type: 'viewpoint', title: 'Ridge lookout', latitude: 43.1870, longitude: 27.9030 },
      { type: 'junction', title: 'Lower forest return', latitude: 43.1820, longitude: 27.8960 },
      { type: 'trailhead', title: 'Return to park entrance', latitude: 43.1780, longitude: 27.8980 }
    ]
  },
  {
    id: 't-009',
    name: 'Franga Plateau Cross-Country Loop',
    location: 'Franga Plateau, Varna, Bulgaria',
    difficulty: 'Expert',
    surfaceType: 'Dirt and rocky track',
    distanceMiles: 9.2,
    elevationGainFt: 1150,
    imageUrl: 'https://images.unsplash.com/photo-1511497584788-876760111969?w=800',
    coordinates: [
      { latitude: 43.2630, longitude: 27.9250 },
      { latitude: 43.2660, longitude: 27.9280 },
      { latitude: 43.2700, longitude: 27.9300 },
      { latitude: 43.2730, longitude: 27.9350 },
      { latitude: 43.2720, longitude: 27.9410 },
      { latitude: 43.2680, longitude: 27.9440 },
      { latitude: 43.2640, longitude: 27.9410 },
      { latitude: 43.2610, longitude: 27.9360 },
      { latitude: 43.2590, longitude: 27.9310 },
      { latitude: 43.2630, longitude: 27.9250 }
    ],
    waypoints: [
      { type: 'trailhead', title: 'Plateau access trailhead', latitude: 43.2630, longitude: 27.9250 },
      { type: 'junction', title: 'Northbound gravel fork', latitude: 43.2700, longitude: 27.9300 },
      { type: 'viewpoint', title: 'Open plateau high point', latitude: 43.2730, longitude: 27.9350 },
      { type: 'junction', title: 'Eastern descent turn', latitude: 43.2680, longitude: 27.9440 },
      { type: 'viewpoint', title: 'Southern woodland edge', latitude: 43.2610, longitude: 27.9360 },
      { type: 'trailhead', title: 'Return to plateau access', latitude: 43.2630, longitude: 27.9250 }
    ]
  },
  {
    id: 't-010',
    name: 'Pasha Dere Dune-to-Forest Ride',
    location: 'Pasha Dere, Varna, Bulgaria',
    difficulty: 'Expert',
    surfaceType: 'Sand and forest dirt',
    distanceMiles: 7.4,
    elevationGainFt: 890,
    imageUrl: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=800',
    coordinates: [
      { latitude: 43.1430, longitude: 27.9770 },
      { latitude: 43.1450, longitude: 27.9800 },
      { latitude: 43.1480, longitude: 27.9830 },
      { latitude: 43.1510, longitude: 27.9860 },
      { latitude: 43.1530, longitude: 27.9820 },
      { latitude: 43.1510, longitude: 27.9770 },
      { latitude: 43.1480, longitude: 27.9740 },
      { latitude: 43.1450, longitude: 27.9730 },
      { latitude: 43.1430, longitude: 27.9770 }
    ],
    waypoints: [
      { type: 'trailhead', title: 'Pasha Dere beach approach', latitude: 43.1430, longitude: 27.9770 },
      { type: 'junction', title: 'Coastal forest entrance', latitude: 43.1480, longitude: 27.9830 },
      { type: 'viewpoint', title: 'Upper dune ridge', latitude: 43.1530, longitude: 27.9820 },
      { type: 'junction', title: 'Forest switchback', latitude: 43.1480, longitude: 27.9740 },
      { type: 'viewpoint', title: 'Beachside rest point', latitude: 43.1450, longitude: 27.9730 },
      { type: 'trailhead', title: 'Return to beach approach', latitude: 43.1430, longitude: 27.9770 }
    ]
  },
  {
    id: 't-011',
    name: 'Sotira Woodland Skills Loop',
    location: 'Sotira, Varna, Bulgaria',
    difficulty: 'Intermediate',
    surfaceType: 'Dirt and woodland singletrack',
    distanceMiles: 3.5,
    elevationGainFt: 390,
    imageUrl: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=800',
    coordinates: [
      { latitude: 43.2290, longitude: 27.9390 },
      { latitude: 43.2310, longitude: 27.9410 },
      { latitude: 43.2330, longitude: 27.9430 },
      { latitude: 43.2350, longitude: 27.9440 },
      { latitude: 43.2360, longitude: 27.9410 },
      { latitude: 43.2340, longitude: 27.9380 },
      { latitude: 43.2320, longitude: 27.9360 },
      { latitude: 43.2300, longitude: 27.9365 },
      { latitude: 43.2290, longitude: 27.9390 }
    ],
    waypoints: [
      { type: 'trailhead', title: 'Sotira woodland start', latitude: 43.2290, longitude: 27.9390 },
      { type: 'junction', title: 'Lower skills-track fork', latitude: 43.2330, longitude: 27.9430 },
      { type: 'viewpoint', title: 'Upper woodland clearing', latitude: 43.2360, longitude: 27.9410 },
      { type: 'junction', title: 'Western singletrack turn', latitude: 43.2320, longitude: 27.9360 },
      { type: 'trailhead', title: 'Return to Sotira start', latitude: 43.2290, longitude: 27.9390 }
    ]
  }
];
