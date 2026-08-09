export const HEROES = [
  {
    id: 'tavi',
    name: 'Tavi',
    title: 'Jungleverkenner',
    ability: 'trailblazer',
    description: 'Snel, wendbaar en fijn om ieder pad mee te leren.',
    speed: 290,
    jump: 650,
    airJumps: 0,
    colors: ['#f49a5c', '#21a77f', '#f5cc4c'],
  },
  {
    id: 'nia',
    name: 'Nia',
    title: 'Bladacrobaat',
    ability: 'double-jump',
    description: 'Maakt eenmaal per sprong een extra luchtsprong.',
    speed: 278,
    jump: 620,
    airJumps: 1,
    colors: ['#8f7ee7', '#45c2b1', '#ffe078'],
  },
  {
    id: 'bo',
    name: 'Bo',
    title: 'Ruinebreker',
    ability: 'ground-pound',
    description: 'Ramt vanuit de lucht omlaag met de actieknop.',
    speed: 255,
    jump: 610,
    airJumps: 0,
    colors: ['#e76155', '#3975a7', '#ffd65c'],
  },
];

export const WORLD_THEMES = [
  {
    name: 'Bamboo Bay',
    material: 'bamboo',
    weather: 'pollen',
    background: 'world-bamboo.png',
    palette: { sky: '#82e2c0', deep: '#07594b', leaf: '#1d9b6d', accent: '#ffd052' },
  },
  {
    name: 'Canopy Climb',
    material: 'leaf',
    weather: 'breeze',
    background: 'world-canopy.png',
    palette: { sky: '#75d8ec', deep: '#145a74', leaf: '#0c9d91', accent: '#ff9c53' },
  },
  {
    name: 'Mango Ruins',
    material: 'ruins',
    weather: 'embers',
    background: 'world-ruins.png',
    palette: { sky: '#ffc879', deep: '#68423d', leaf: '#b8783b', accent: '#f06361' },
  },
  {
    name: 'Monsoon Marsh',
    material: 'marsh',
    weather: 'rain',
    background: 'world-monsoon.png',
    palette: { sky: '#7798cf', deep: '#293a70', leaf: '#25868d', accent: '#e7d85d' },
  },
  {
    name: 'Emerald Temple',
    material: 'temple',
    weather: 'fireflies',
    background: 'world-temple.png',
    palette: { sky: '#b6e69a', deep: '#204f3e', leaf: '#48a15c', accent: '#ef759d' },
  },
];

const GROUND_Y = 460;
const PLAYER_HEIGHT = 46;

const blueprints = [
  {
    name: 'First Footprints', width: 2860,
    route: [[220, 378, 190], [505, 320, 180], [790, 388, 230], [1120, 310, 190], [1425, 360, 220], [1750, 286, 210], [2075, 374, 220], [2395, 300, 220]],
    gaps: [], hazards: [[430, 42, 'spikes'], [960, 58, 'mud'], [1980, 42, 'spikes']], springs: [[690]], medal: [1815, 238], enemyXs: [340, 1210, 2180],
    tip: 'Spring op een kever om extra hoog terug te veren.',
  },
  {
    name: 'Springflower Steps', width: 3040,
    route: [[260, 352, 160], [530, 282, 150], [760, 365, 180], [1030, 330, 150], [1290, 255, 170], [1580, 345, 220], [1900, 292, 170], [2180, 372, 200], [2510, 315, 190]],
    gaps: [[710, 92]], hazards: [[450, 54, 'mud'], [1820, 44, 'spikes']], springs: [[230], [1490]], moving: [[940, 255, 130, 22, 0, 62, 1.2, 0]], medal: [1340, 205], enemyXs: [380, 1670, 2420],
    tip: 'Gele springbloemen lanceren je naar verborgen routes.',
  },
  {
    name: 'Lagoon Leap', width: 3180,
    route: [[210, 390, 170], [470, 342, 160], [720, 276, 150], [1010, 360, 210], [1320, 302, 150], [1590, 240, 170], [1890, 338, 190], [2200, 280, 170], [2490, 370, 200], [2790, 310, 170]],
    gaps: [[640, 106], [1740, 112]], hazards: [[1235, 58, 'mud'], [2705, 44, 'spikes']], springs: [[405]], moving: [[830, 390, 130, 22, 72, 0, 1.1, 0.4]], medal: [1645, 192], enemyXs: [300, 1450, 2340],
    tip: 'De lagune heeft korte gaten en een bewegend bamboevlot.',
  },
  {
    name: 'Moki Rescue', width: 3260,
    route: [[250, 365, 190], [560, 305, 180], [860, 245, 170], [1130, 360, 210], [1450, 300, 170], [1710, 360, 160], [1980, 260, 200], [2310, 330, 180], [2590, 270, 170], [2860, 355, 170]],
    gaps: [[1010, 100], [2200, 110]], hazards: [[470, 46, 'spikes'], [1885, 64, 'mud']], springs: [[780], [2510]], mounts: [[1510, 414]], medal: [2050, 210], enemyXs: [380, 1230, 2700],
    tip: 'Vind Moki: hij kan fladderen en fruit met zijn tong pakken.',
  },
  {
    name: 'Leaf Lift', width: 3000,
    route: [[210, 390, 150], [450, 322, 150], [690, 252, 150], [930, 185, 160], [1190, 270, 170], [1480, 350, 190], [1780, 275, 160], [2040, 205, 170], [2330, 300, 190], [2640, 365, 160]],
    gaps: [[1110, 86]], hazards: [[380, 42, 'thorns'], [1690, 50, 'thorns']], moving: [[1120, 370, 130, 22, 0, 95, 1, 0]], medal: [990, 135], enemyXs: [330, 1550, 2440],
    tip: 'Rijd met het grote blad mee naar de bovenste boomlaag.',
  },
  {
    name: 'Parrot Path', width: 3120,
    route: [[260, 340, 170], [520, 390, 160], [760, 315, 150], [1010, 240, 160], [1290, 320, 170], [1570, 210, 160], [1840, 290, 190], [2140, 365, 170], [2420, 285, 180], [2730, 220, 160]],
    gaps: [[680, 92], [2070, 84]], hazards: [[440, 44, 'thorns'], [2630, 58, 'mud']], moving: [[1130, 380, 120, 22, 92, 0, 1.2, 0.5], [2260, 250, 120, 22, 0, 70, 0.9, 1]], medal: [1625, 160], enemyXs: [360, 1400, 2520],
    tip: 'Twee bladliften openen een snelle hoge route.',
  },
  {
    name: 'Cloud Canopy', width: 3300,
    route: [[220, 370, 180], [510, 300, 150], [760, 220, 150], [1030, 330, 170], [1320, 255, 160], [1580, 175, 160], [1860, 250, 170], [2140, 335, 190], [2460, 260, 170], [2760, 190, 170], [3030, 335, 150]],
    gaps: [[920, 100], [2350, 106]], hazards: [[430, 52, 'thorns'], [1980, 46, 'thorns']], springs: [[700]], moving: [[1670, 360, 130, 22, 100, 0, 1, 0]], medal: [2815, 140], enemyXs: [320, 1250, 2250],
    tip: 'De zonnemedaille zweeft boven de hoogste wolkenbladeren.',
  },
  {
    name: 'Treetop Dash', width: 3440,
    route: [[250, 385, 150], [490, 305, 160], [750, 365, 150], [990, 275, 170], [1270, 190, 170], [1550, 300, 180], [1840, 210, 170], [2130, 330, 180], [2420, 245, 170], [2700, 350, 190], [3010, 270, 180]],
    gaps: [[630, 90], [1740, 105], [2880, 92]], hazards: [[410, 42, 'thorns'], [2320, 50, 'thorns']], springs: [[1190], [2640]], moving: [[820, 210, 120, 22, 0, 76, 1.25, 0], [2870, 195, 130, 22, 88, 0, 1.1, 1]], medal: [1890, 160], enemyXs: [340, 1490, 2570],
    tip: 'Blijf bewegen: dit bladerpad beloont ritme en lef.',
  },
  {
    name: 'Sun Key', width: 3060,
    route: [[230, 380, 180], [520, 315, 170], [800, 250, 160], [1080, 355, 190], [1390, 285, 170], [1670, 215, 160], [1950, 330, 190], [2270, 260, 170], [2550, 350, 180]],
    gaps: [[980, 94]], hazards: [[430, 46, 'spikes'], [1830, 58, 'sand']], keys: [[845, 205, 'sun-gate']], gates: [[2440, 330, 36, 130, 'sun-gate']], medal: [1725, 165], enemyXs: [350, 1510, 2180],
    tip: 'Pak de zonnesleutel voordat je de stenen poort bereikt.',
  },
  {
    name: 'Broken Bridge', width: 3220,
    route: [[210, 370, 170], [480, 300, 160], [740, 365, 150], [990, 285, 160], [1250, 215, 170], [1540, 340, 190], [1840, 270, 170], [2110, 195, 160], [2390, 300, 180], [2680, 230, 170], [2950, 350, 150]],
    gaps: [[610, 110], [1700, 104]], hazards: [[390, 42, 'spikes'], [2500, 52, 'sand']], crumbles: [[890, 395, 110], [1430, 375, 120], [2260, 360, 110]], medal: [2160, 145], enemyXs: [330, 1320, 2580],
    tip: 'Gebarsten stenen verdwijnen als je te lang blijft staan.',
  },
  {
    name: 'Echo Chambers', width: 3360,
    route: [[250, 350, 160], [510, 260, 160], [780, 335, 170], [1060, 245, 160], [1330, 360, 190], [1640, 280, 170], [1910, 205, 160], [2190, 320, 180], [2480, 235, 170], [2760, 345, 190], [3070, 270, 160]],
    gaps: [[930, 96], [2310, 92]], hazards: [[430, 48, 'spikes'], [1810, 44, 'sand']], switches: [[1370, 330, 'echo-gate']], gates: [[2880, 330, 38, 130, 'echo-gate']], crumbles: [[1740, 365, 110]], medal: [1960, 155], enemyXs: [340, 1510, 2610],
    tip: 'Druk de jade schakelaar in om de echopoort te openen.',
  },
  {
    name: 'Idol Run', width: 3500,
    route: [[220, 390, 160], [470, 315, 160], [730, 235, 170], [1010, 345, 180], [1300, 270, 160], [1570, 190, 170], [1850, 305, 190], [2160, 225, 170], [2440, 350, 180], [2730, 280, 160], [3000, 205, 170], [3260, 350, 140]],
    gaps: [[880, 100], [2040, 108], [3130, 90]], hazards: [[390, 42, 'spikes'], [2360, 56, 'sand']], springs: [[680]], crumbles: [[1180, 390, 120], [2880, 370, 110]], keys: [[1625, 145, 'idol-gate']], gates: [[3180, 325, 38, 135, 'idol-gate']], medal: [3055, 155], enemyXs: [320, 1450, 2560],
    tip: 'Combineer springbloemen, brokkelstenen en de afgodssleutel.',
  },
  {
    name: 'Rainy Route', width: 3100,
    route: [[240, 380, 170], [520, 320, 160], [790, 375, 160], [1060, 295, 170], [1350, 225, 160], [1630, 335, 190], [1940, 260, 170], [2220, 360, 180], [2520, 290, 170], [2800, 350, 150]],
    gaps: [[680, 96]], hazards: [[440, 64, 'mud'], [1780, 74, 'water']], moving: [[910, 250, 140, 22, 0, 62, 0.85, 0]], medal: [1400, 175], enemyXs: [350, 1510, 2420],
    tip: 'Natte stammen bewegen langzaam; spring pas op het hoogste punt.',
  },
  {
    name: 'Logjam', width: 3260,
    route: [[210, 350, 180], [500, 390, 150], [750, 300, 170], [1030, 220, 160], [1310, 335, 190], [1620, 255, 160], [1890, 365, 180], [2180, 280, 170], [2470, 205, 170], [2750, 315, 190], [3050, 370, 120]],
    gaps: [[650, 104], [1770, 106]], hazards: [[410, 70, 'water'], [2340, 58, 'mud']], moving: [[1180, 390, 150, 22, 88, 0, 0.9, 0.5], [2590, 350, 140, 22, 0, 76, 1.05, 0]], medal: [2525, 155], enemyXs: [330, 1490, 2660],
    tip: 'De stammen bewegen in tegengesteld ritme door het moeras.',
  },
  {
    name: 'Firefly Mire', width: 3400,
    route: [[250, 370, 160], [510, 285, 170], [790, 355, 160], [1050, 270, 170], [1330, 185, 160], [1610, 300, 180], [1900, 220, 170], [2180, 345, 180], [2470, 265, 160], [2740, 185, 170], [3030, 320, 180]],
    gaps: [[930, 96], [2050, 110], [2910, 90]], hazards: [[430, 62, 'mud'], [1740, 72, 'water']], springs: [[730]], mounts: [[1660, 414]], medal: [2795, 135], enemyXs: [350, 1460, 2580],
    tip: 'Moki vindt met zijn tong de vrucht tussen de vuurvliegjes.',
  },
  {
    name: 'Storm Sprint', width: 3560,
    route: [[220, 390, 150], [460, 310, 160], [720, 230, 160], [990, 350, 180], [1280, 260, 170], [1560, 180, 160], [1840, 290, 180], [2130, 205, 170], [2410, 340, 190], [2720, 250, 170], [3000, 170, 170], [3280, 330, 160]],
    gaps: [[610, 100], [1730, 100], [2590, 108]], hazards: [[390, 66, 'water'], [2290, 54, 'mud']], springs: [[1220], [2940]], moving: [[810, 210, 130, 22, 0, 85, 1.25, 0], [2760, 365, 130, 22, 94, 0, 1.15, 0.8]], crumbles: [[1970, 375, 110]], medal: [3055, 120], enemyXs: [340, 1440, 2450],
    tip: 'De stormroute mixt liften, brokkelstammen en verre sprongen.',
  },
  {
    name: 'Temple Gate', width: 3180,
    route: [[250, 380, 170], [520, 305, 160], [790, 230, 170], [1070, 350, 180], [1360, 275, 170], [1640, 200, 160], [1910, 325, 190], [2220, 245, 170], [2500, 350, 180], [2790, 270, 170]],
    gaps: [[940, 96]], hazards: [[430, 44, 'spikes'], [1780, 58, 'energy']], keys: [[845, 185, 'temple-gate']], gates: [[2640, 325, 40, 135, 'temple-gate']], medal: [1695, 150], enemyXs: [350, 1510, 2380],
    tip: 'De tempelsleutel opent de eerste smaragdgroene poort.',
  },
  {
    name: 'Emerald Steps', width: 3340,
    route: [[210, 365, 160], [460, 280, 170], [740, 355, 160], [1010, 265, 170], [1290, 180, 160], [1570, 295, 180], [1860, 215, 170], [2140, 340, 180], [2430, 255, 170], [2710, 175, 160], [2980, 315, 180]],
    gaps: [[620, 94], [2020, 104]], hazards: [[390, 46, 'energy'], [2310, 52, 'spikes']], moving: [[1120, 360, 130, 22, 0, 92, 1, 0]], crumbles: [[1740, 365, 110], [2850, 380, 110]], medal: [2765, 125], enemyXs: [330, 1450, 2560],
    tip: 'De smaragdtrappen wisselen vaste en breekbare stenen af.',
  },
  {
    name: 'Sunstone Trial', width: 3500,
    route: [[240, 390, 150], [480, 310, 160], [740, 225, 170], [1020, 345, 180], [1310, 260, 160], [1580, 175, 170], [1860, 300, 180], [2150, 210, 170], [2430, 335, 190], [2740, 245, 170], [3020, 165, 170], [3280, 340, 140]],
    gaps: [[890, 100], [2020, 106], [3150, 88]], hazards: [[400, 44, 'spikes'], [2300, 58, 'energy']], switches: [[1360, 230, 'trial-gate']], keys: [[1635, 130, 'sunstone-gate']], gates: [[2580, 325, 38, 135, 'trial-gate'], [3200, 325, 38, 135, 'sunstone-gate']], springs: [[680]], medal: [3075, 115], enemyXs: [330, 1480, 2840],
    tip: 'Activeer de schakelaar en neem daarna de zonsteen mee.',
  },
  {
    name: 'Heart of the Wild', width: 3720,
    route: [[220, 380, 160], [470, 295, 170], [750, 365, 160], [1010, 275, 170], [1290, 190, 170], [1570, 320, 190], [1880, 230, 170], [2160, 350, 180], [2450, 260, 170], [2730, 175, 170], [3010, 305, 190], [3320, 220, 170], [3540, 350, 110]],
    gaps: [[620, 94], [1760, 106], [2890, 100]], hazards: [[390, 46, 'energy'], [2330, 54, 'spikes']], springs: [[690], [3260]], moving: [[1110, 365, 130, 22, 0, 82, 1.1, 0], [2800, 345, 130, 22, 88, 0, 1.2, 0.8]], crumbles: [[2040, 380, 110]], mounts: [[2500, 414]], medal: [3375, 170], enemyXs: [340, 1460], boss: [3420, 400],
    tip: 'Versla de tempelwachter met alles wat je onderweg leerde.',
  },
];

function groundPlatforms(width, gaps) {
  const platforms = [];
  let cursor = 0;
  [...gaps].sort((a, b) => a[0] - b[0]).forEach(([x, gapWidth], index) => {
    if (x > cursor) {
      platforms.push({ id: 'ground-' + index, x: cursor, y: GROUND_Y, width: x - cursor, height: 80, kind: 'ground' });
    }
    cursor = x + gapWidth;
  });
  if (cursor < width) {
    platforms.push({ id: 'ground-last', x: cursor, y: GROUND_Y, width: width - cursor, height: 80, kind: 'ground' });
  }
  return platforms;
}

const isInGap = (x, gaps) => gaps.some(([gapX, width]) => x >= gapX && x <= gapX + width);

function safeGroundX(preferred, gaps) {
  let x = preferred;
  while (isInGap(x, gaps)) {
    x += 120;
  }
  return x;
}

function buildLevel(blueprint, index) {
  const worldIndex = Math.floor(index / 4);
  const theme = WORLD_THEMES[worldIndex];
  const platforms = [
    ...groundPlatforms(blueprint.width, blueprint.gaps),
    ...blueprint.route.map(([x, y, width], routeIndex) => ({
      id: 'route-' + routeIndex,
      x,
      y,
      width,
      height: 26,
      kind: theme.material,
    })),
  ];
  const coins = blueprint.route.map(([x, y, width], coinIndex) => ({
    id: 'fruit-high-' + coinIndex,
    x: x + width / 2 - 9,
    y: y - 38 - (coinIndex % 2) * 12,
    size: 18,
  }));
  for (let x = 130, coinIndex = 0; x < blueprint.width - 160; x += 360, coinIndex += 1) {
    if (!isInGap(x, blueprint.gaps)) {
      coins.push({ id: 'fruit-low-' + coinIndex, x, y: GROUND_Y - 36, size: 18 });
    }
  }
  const enemyKind = ['beetle', 'hornet', 'maskling', 'newt', 'guardian'][worldIndex];
  const enemies = blueprint.enemyXs.map((x, enemyIndex) => ({
    id: 'enemy-' + enemyIndex,
    x,
    y: GROUND_Y - 34,
    width: 34,
    height: 34,
    minX: x - 70,
    maxX: x + 100,
    speed: 48 + worldIndex * 5 + enemyIndex * 4,
    direction: enemyIndex % 2 ? -1 : 1,
    kind: enemyKind,
    health: 1,
  }));
  if (blueprint.boss) {
    enemies.push({
      id: 'temple-guardian',
      x: blueprint.boss[0],
      y: blueprint.boss[1],
      width: 64,
      height: 60,
      minX: blueprint.boss[0] - 120,
      maxX: blueprint.boss[0] + 100,
      speed: 58,
      direction: -1,
      kind: 'boss',
      health: 3,
    });
  }
  const checkpointX = safeGroundX(Math.floor(blueprint.width * 0.5), blueprint.gaps);
  return {
    id: index + 1,
    world: theme.name,
    worldIndex,
    name: blueprint.name,
    theme: theme.palette,
    material: theme.material,
    weather: theme.weather,
    background: theme.background,
    width: blueprint.width,
    height: 540,
    spawn: { x: 70, y: GROUND_Y - PLAYER_HEIGHT },
    platforms,
    coins,
    enemies,
    hazards: blueprint.hazards.map(([x, width, kind], hazardIndex) => ({
      id: 'hazard-' + hazardIndex, x, y: GROUND_Y - 28, width, height: 28, kind,
    })),
    movingPlatforms: (blueprint.moving || []).map(([baseX, baseY, width, height, rangeX, rangeY, speed, phase], movingIndex) => ({
      id: 'moving-' + movingIndex, x: baseX, y: baseY, baseX, baseY, width, height, rangeX, rangeY, speed, phase, kind: 'moving', oneWay: true,
    })),
    springs: (blueprint.springs || []).map(([x], springIndex) => ({
      id: 'spring-' + springIndex, x, y: GROUND_Y - 20, width: 42, height: 20,
    })),
    crumbles: (blueprint.crumbles || []).map(([x, y, width], crumbleIndex) => ({
      id: 'crumble-' + crumbleIndex, x, y, width, height: 24, timer: 0, active: true, kind: 'crumble', oneWay: true,
    })),
    keys: (blueprint.keys || []).map(([x, y, gateId], keyIndex) => ({
      id: 'key-' + keyIndex, x, y, width: 26, height: 26, gateId,
    })),
    gates: (blueprint.gates || []).map(([x, y, width, height, id]) => ({ id, x, y, width, height, open: false, kind: 'gate' })),
    switches: (blueprint.switches || []).map(([x, y, gateId], switchIndex) => ({
      id: 'switch-' + switchIndex, x, y, width: 42, height: 18, gateId, active: false,
    })),
    medals: [{ id: 'sun-medal', x: blueprint.medal[0], y: blueprint.medal[1], width: 26, height: 26 }],
    mounts: (blueprint.mounts || []).map(([x, y], mountIndex) => ({
      id: 'moki-' + mountIndex, x, y, width: 52, height: 46, kind: 'moki',
    })),
    checkpoint: { id: 'checkpoint', x: checkpointX, y: GROUND_Y - PLAYER_HEIGHT, width: 28, height: PLAYER_HEIGHT },
    finish: { id: 'finish', x: blueprint.width - 145, y: GROUND_Y - 110, width: 92, height: 110 },
    tip: blueprint.tip,
  };
}

export const LEVELS = blueprints.map(buildLevel);
