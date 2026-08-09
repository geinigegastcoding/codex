const WORLD_WIDTH = 960;
const WORLD_HEIGHT = 540;
const BACKGROUND_FILES = [
  'world-bamboo.png',
  'world-canopy.png',
  'world-ruins.png',
  'world-monsoon.png',
  'world-temple.png',
];
const backgrounds = BACKGROUND_FILES.map((file) => {
  const image = new Image();
  image.src = new URL('../assets/' + file, import.meta.url).href;
  return image;
});

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

function roundedRect(context, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  context.beginPath();
  context.moveTo(x + r, y);
  context.arcTo(x + width, y, x + width, y + height, r);
  context.arcTo(x + width, y + height, x, y + height, r);
  context.arcTo(x, y + height, x, y, r);
  context.arcTo(x, y, x + width, y, r);
  context.closePath();
}

function leaf(context, x, y, width, height, color, angle = 0) {
  context.save();
  context.translate(x, y);
  context.rotate(angle);
  context.fillStyle = color;
  context.beginPath();
  context.moveTo(0, 0);
  context.bezierCurveTo(width * 0.34, -height * 0.68, width * 0.78, -height * 0.66, width, 0);
  context.bezierCurveTo(width * 0.72, height * 0.7, width * 0.28, height * 0.68, 0, 0);
  context.fill();
  context.strokeStyle = 'rgba(255,255,255,.18)';
  context.lineWidth = 1.5;
  context.beginPath();
  context.moveTo(3, 0);
  context.lineTo(width - 5, 0);
  context.stroke();
  context.restore();
}

function drawImageCover(context, image, cameraX, levelWidth) {
  if (!image?.complete || image.naturalWidth === 0) return;
  const scale = Math.max(WORLD_WIDTH / image.naturalWidth, WORLD_HEIGHT / image.naturalHeight);
  const width = image.naturalWidth * scale;
  const height = image.naturalHeight * scale;
  const travel = Math.max(0, width - WORLD_WIDTH);
  const progress = clamp(cameraX / Math.max(1, levelWidth - WORLD_WIDTH), 0, 1);
  const x = -travel * (0.2 + progress * 0.6);
  const y = (WORLD_HEIGHT - height) * 0.48;
  context.drawImage(image, x, y, width, height);
}

function drawBackground(context, cameraX, level, state) {
  const sky = context.createLinearGradient(0, 0, 0, WORLD_HEIGHT);
  sky.addColorStop(0, level.theme.sky);
  sky.addColorStop(1, level.theme.deep);
  context.fillStyle = sky;
  context.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
  drawImageCover(context, backgrounds[level.worldIndex], cameraX, level.width);

  const tint = context.createLinearGradient(0, 0, 0, WORLD_HEIGHT);
  tint.addColorStop(0, 'rgba(255,255,255,.05)');
  tint.addColorStop(0.7, 'rgba(9,53,48,.08)');
  tint.addColorStop(1, 'rgba(4,35,32,.28)');
  context.fillStyle = tint;
  context.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

  if (state.reduceMotion) return;
  if (level.weather === 'rain') {
    context.strokeStyle = 'rgba(190,225,255,.32)';
    context.lineWidth = 1.2;
    for (let index = 0; index < 70; index += 1) {
      const x = (index * 83 + state.elapsed * 260) % (WORLD_WIDTH + 80) - 40;
      const y = (index * 47 + state.elapsed * 420) % (WORLD_HEIGHT + 60) - 40;
      context.beginPath();
      context.moveTo(x, y);
      context.lineTo(x - 8, y + 20);
      context.stroke();
    }
  } else {
    for (let index = 0; index < 12; index += 1) {
      const x = 55 + index * 81 + Math.sin(state.elapsed * 0.6 + index) * 18;
      const y = 90 + (index % 5) * 62 + Math.cos(state.elapsed * 0.8 + index) * 9;
      context.globalAlpha = 0.28 + (index % 3) * 0.11;
      context.fillStyle = level.weather === 'fireflies' ? '#fff29a' : level.theme.accent;
      context.beginPath();
      context.arc(x, y, level.weather === 'fireflies' ? 3 : 2, 0, Math.PI * 2);
      context.fill();
    }
    context.globalAlpha = 1;
  }
}

function drawWorldDecoration(context, level, cameraX) {
  context.save();
  context.translate(-cameraX * 0.28, 0);
  for (let index = -1; index < 20; index += 1) {
    const x = index * 205 + 70;
    if (level.material === 'ruins' || level.material === 'temple') {
      context.fillStyle = level.material === 'temple' ? 'rgba(20,77,58,.34)' : 'rgba(105,65,42,.3)';
      context.fillRect(x, 365 - (index % 3) * 24, 26, 96 + (index % 3) * 24);
      context.fillRect(x - 10, 356 - (index % 3) * 24, 46, 12);
    } else {
      const height = 86 + (index % 4) * 25;
      context.fillStyle = 'rgba(7,75,58,.24)';
      context.fillRect(x, 450 - height, 12, height);
      leaf(context, x + 5, 445 - height, 68, 28, level.theme.leaf, -0.45);
      leaf(context, x + 7, 416 - height, 58, 25, level.theme.deep, 0.4);
    }
  }
  context.restore();
}

function platformColors(platform, theme, material) {
  if (platform.kind === 'moving') return { body: '#176f60', top: '#7fdc83', detail: '#d8ef8d' };
  if (platform.kind === 'crumble') return { body: '#7e6547', top: '#e7bd65', detail: '#533f36' };
  if (material === 'ruins') return { body: '#75503b', top: '#e3a34f', detail: '#46382f' };
  if (material === 'marsh') return { body: '#254f4f', top: '#7cac5a', detail: '#142f38' };
  if (material === 'temple') return { body: '#155d50', top: '#dfc65c', detail: '#f08ba1' };
  if (material === 'leaf') return { body: '#0f6c61', top: '#7eda74', detail: '#e5f0a3' };
  return { body: theme.deep, top: theme.accent, detail: 'rgba(255,255,255,.24)' };
}

function drawPlatform(context, platform, level) {
  const colors = platformColors(platform, level.theme, level.material);
  roundedRect(context, platform.x, platform.y, platform.width, platform.height, platform.kind === 'ground' ? 4 : 9);
  context.fillStyle = colors.body;
  context.fill();
  roundedRect(context, platform.x, platform.y, platform.width, Math.min(13, platform.height), 7);
  context.fillStyle = colors.top;
  context.fill();
  context.fillStyle = colors.detail;
  if (platform.kind === 'crumble') {
    const cracks = Math.max(2, Math.floor(platform.width / 52));
    context.strokeStyle = colors.detail;
    context.lineWidth = 2;
    for (let index = 0; index < cracks; index += 1) {
      const x = platform.x + 24 + index * 52;
      context.beginPath();
      context.moveTo(x, platform.y + 5);
      context.lineTo(x + 6, platform.y + 12);
      context.lineTo(x + 1, platform.y + 21);
      context.stroke();
    }
  } else if (platform.kind !== 'ground') {
    context.fillRect(platform.x + 12, platform.y + 4, Math.max(12, platform.width * 0.22), 3);
  }
  if (platform.timer > 0) {
    context.globalAlpha = 0.35 + Math.sin(platform.timer * 35) * 0.22;
    context.fillStyle = '#fff3a5';
    context.fillRect(platform.x, platform.y, platform.width, platform.height);
    context.globalAlpha = 1;
  }
}

function drawCoin(context, coin, elapsed) {
  const bob = Math.sin(elapsed * 5 + coin.x * 0.02) * 5;
  const x = coin.x + coin.size / 2;
  const y = coin.y + coin.size / 2 + bob;
  context.save();
  context.translate(x, y);
  context.rotate(-0.12);
  context.fillStyle = '#f4a53f';
  context.strokeStyle = '#fff0a0';
  context.lineWidth = 2;
  context.beginPath();
  context.ellipse(0, 2, coin.size * 0.46, coin.size * 0.58, 0, 0, Math.PI * 2);
  context.fill();
  context.stroke();
  leaf(context, -1, -coin.size * 0.52, coin.size * 0.62, coin.size * 0.25, '#58a650', -0.15);
  context.fillStyle = 'rgba(255,255,255,.66)';
  context.beginPath();
  context.arc(-3, -1, 2, 0, Math.PI * 2);
  context.fill();
  context.restore();
}

function drawHazard(context, hazard, elapsed) {
  if (['mud', 'water', 'sand'].includes(hazard.kind)) {
    const colors = { mud: '#654748', water: '#42aab7', sand: '#d08b42' };
    context.fillStyle = colors[hazard.kind];
    context.beginPath();
    context.ellipse(hazard.x + hazard.width / 2, hazard.y + hazard.height - 2, hazard.width / 2, hazard.height / 2, 0, 0, Math.PI * 2);
    context.fill();
    context.strokeStyle = 'rgba(255,255,255,.34)';
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(hazard.x + 8, hazard.y + 12 + Math.sin(elapsed * 4) * 2);
    context.lineTo(hazard.x + hazard.width - 8, hazard.y + 12);
    context.stroke();
    return;
  }
  const energy = hazard.kind === 'energy';
  context.fillStyle = energy ? '#ef719e' : hazard.kind === 'thorns' ? '#79ad4d' : '#efe5bf';
  context.strokeStyle = energy ? '#ffd0e1' : '#b64a59';
  context.lineWidth = 2;
  context.beginPath();
  const spikes = Math.max(3, Math.round(hazard.width / 12));
  for (let index = 0; index < spikes; index += 1) {
    const startX = hazard.x + index * (hazard.width / spikes);
    context.moveTo(startX, hazard.y + hazard.height);
    context.lineTo(startX + hazard.width / spikes / 2, hazard.y + (energy ? Math.sin(elapsed * 8 + index) * 4 : 0));
    context.lineTo(startX + hazard.width / spikes, hazard.y + hazard.height);
  }
  context.fill();
  context.stroke();
}

function drawEnemy(context, enemy, elapsed) {
  const bounce = Math.sin(elapsed * 7 + enemy.x * 0.03) * 2;
  const palettes = {
    beetle: ['#db5473', '#843d68'],
    hornet: ['#efb64d', '#704870'],
    maskling: ['#e07f50', '#6d493b'],
    newt: ['#45a8aa', '#285b76'],
    guardian: ['#6b9b63', '#2f5549'],
    boss: ['#5c8461', '#183f38'],
  };
  const colors = palettes[enemy.kind] || palettes.beetle;
  context.save();
  context.translate(enemy.x, enemy.y + bounce);
  if (enemy.kind === 'hornet') {
    context.fillStyle = 'rgba(245,247,209,.72)';
    context.beginPath();
    context.ellipse(3, 10, 11, 7, -0.5, 0, Math.PI * 2);
    context.ellipse(enemy.width - 3, 10, 11, 7, 0.5, 0, Math.PI * 2);
    context.fill();
  }
  roundedRect(context, 0, 3, enemy.width, enemy.height - 3, enemy.kind === 'boss' ? 17 : 11);
  context.fillStyle = colors[0];
  context.fill();
  context.fillStyle = colors[1];
  if (enemy.kind === 'maskling' || enemy.kind === 'guardian' || enemy.kind === 'boss') {
    roundedRect(context, 5, 5, enemy.width - 10, enemy.height * 0.55, 8);
    context.fill();
  } else {
    context.fillRect(5, enemy.height - 2, 8, 5);
    context.fillRect(enemy.width - 13, enemy.height - 2, 8, 5);
  }
  context.fillStyle = '#fff5c8';
  const eyeY = enemy.kind === 'boss' ? 20 : 14;
  context.beginPath();
  context.arc(enemy.width * 0.34, eyeY, enemy.kind === 'boss' ? 6 : 5, 0, Math.PI * 2);
  context.arc(enemy.width * 0.68, eyeY, enemy.kind === 'boss' ? 6 : 5, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = '#21344c';
  context.beginPath();
  context.arc(enemy.width * 0.35, eyeY, 2, 0, Math.PI * 2);
  context.arc(enemy.width * 0.69, eyeY, 2, 0, Math.PI * 2);
  context.fill();
  context.restore();
}

function heroColors(heroId) {
  if (heroId === 'nia') return { body: '#8f7ee7', gear: '#45c2b1', accent: '#ffe078' };
  if (heroId === 'bo') return { body: '#e76155', gear: '#3975a7', accent: '#ffd65c' };
  return { body: '#f49a5c', gear: '#21a77f', accent: '#f5cc4c' };
}

function drawHeroBody(context, player, elapsed, scale = 1, yOffset = 0) {
  const colors = heroColors(player.heroId);
  const walking = player.onGround ? Math.sin(elapsed * 15) * 1.6 : 0;
  context.save();
  context.translate(0, yOffset + walking);
  context.scale(scale, scale);
  context.fillStyle = colors.body;
  roundedRect(context, -15, -9, 30, 35, player.heroId === 'bo' ? 9 : 13);
  context.fill();
  context.fillStyle = colors.gear;
  if (player.heroId === 'bo') {
    roundedRect(context, -16, -4, 32, 19, 5);
    context.fill();
  } else {
    roundedRect(context, -16, -19, 32, 18, 11);
    context.fill();
    leaf(context, -6, -23, player.heroId === 'nia' ? 29 : 23, 11, colors.accent, player.heroId === 'nia' ? 0.22 : -0.42);
  }
  context.fillStyle = '#fff3c7';
  context.beginPath();
  context.arc(-6, -3, 4.5, 0, Math.PI * 2);
  context.arc(7, -3, 4.5, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = '#21344c';
  context.beginPath();
  context.arc(-5, -2, 1.8, 0, Math.PI * 2);
  context.arc(8, -2, 1.8, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = colors.accent;
  roundedRect(context, 11, 3, 9, 15, 4);
  context.fill();
  context.restore();
}

function drawPlayer(context, player, elapsed, tongue) {
  const facing = player.facing < 0 ? -1 : 1;
  context.save();
  if ((player.invulnerable || 0) > 0) {
    context.globalAlpha = 0.62 + Math.sin(elapsed * 20) * 0.28;
  }
  context.translate(player.x + player.width / 2, player.y + player.height / 2);
  context.scale(facing, 1);
  if (player.mounted) {
    context.fillStyle = '#8fcf4f';
    roundedRect(context, -24, -5, 47, 30, 14);
    context.fill();
    context.fillStyle = '#bfe76a';
    context.beginPath();
    context.ellipse(20, 2, 16, 13, -0.1, 0, Math.PI * 2);
    context.fill();
    leaf(context, 7, -12, 24, 11, '#257b62', -0.2);
    context.fillStyle = '#fff4c6';
    context.beginPath();
    context.arc(25, -1, 4, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = '#223a48';
    context.beginPath();
    context.arc(26, 0, 1.8, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = '#487944';
    context.fillRect(-19, 20, 8, 8);
    context.fillRect(10, 20, 8, 8);
    drawHeroBody(context, player, elapsed, 0.7, -12);
    if (tongue > 0) {
      context.strokeStyle = '#ef7896';
      context.lineWidth = 6;
      context.lineCap = 'round';
      context.beginPath();
      context.moveTo(29, 7);
      context.lineTo(118, 3 + Math.sin(elapsed * 30) * 3);
      context.stroke();
      context.fillStyle = '#ff9cac';
      context.beginPath();
      context.arc(119, 3, 7, 0, Math.PI * 2);
      context.fill();
    }
  } else {
    if (player.groundPound) {
      context.rotate(0.08 * Math.sin(elapsed * 30));
    }
    drawHeroBody(context, player, elapsed);
  }
  context.restore();
}

function drawSpring(context, spring, elapsed) {
  const squash = Math.sin(elapsed * 4 + spring.x) * 1.5;
  context.fillStyle = '#4a985d';
  context.fillRect(spring.x + spring.width / 2 - 3, spring.y + 7, 6, spring.height + 6);
  context.fillStyle = '#f5ca4c';
  for (let index = 0; index < 6; index += 1) {
    const angle = index * Math.PI / 3;
    context.beginPath();
    context.ellipse(
      spring.x + spring.width / 2 + Math.cos(angle) * 12,
      spring.y + 6 + Math.sin(angle) * (8 + squash),
      8,
      5,
      angle,
      0,
      Math.PI * 2,
    );
    context.fill();
  }
  context.fillStyle = '#f16f79';
  context.beginPath();
  context.arc(spring.x + spring.width / 2, spring.y + 6, 7, 0, Math.PI * 2);
  context.fill();
}

function drawKey(context, key, elapsed) {
  const bob = Math.sin(elapsed * 4 + key.x) * 4;
  context.save();
  context.translate(key.x + 13, key.y + 13 + bob);
  context.strokeStyle = '#ffe26e';
  context.lineWidth = 5;
  context.beginPath();
  context.arc(-4, -3, 7, 0, Math.PI * 2);
  context.moveTo(2, 2);
  context.lineTo(12, 12);
  context.lineTo(7, 12);
  context.moveTo(9, 9);
  context.lineTo(13, 5);
  context.stroke();
  context.restore();
}

function drawGate(context, gate) {
  if (gate.open) return;
  context.fillStyle = 'rgba(18,74,60,.88)';
  roundedRect(context, gate.x, gate.y, gate.width, gate.height, 8);
  context.fill();
  context.strokeStyle = '#e7c85e';
  context.lineWidth = 3;
  for (let y = gate.y + 12; y < gate.y + gate.height; y += 24) {
    context.beginPath();
    context.moveTo(gate.x + 5, y);
    context.lineTo(gate.x + gate.width - 5, y);
    context.stroke();
  }
}

function drawSwitch(context, item) {
  context.fillStyle = item.active ? '#75e1bd' : '#f08aa0';
  roundedRect(context, item.x, item.y + (item.active ? 8 : 0), item.width, item.height - (item.active ? 8 : 0), 5);
  context.fill();
  context.fillStyle = 'rgba(255,255,255,.5)';
  context.fillRect(item.x + 7, item.y + 4 + (item.active ? 8 : 0), item.width - 14, 3);
}

function drawMedal(context, medal, elapsed) {
  if (!medal) return;
  const x = medal.x + medal.width / 2;
  const y = medal.y + medal.height / 2 + Math.sin(elapsed * 4) * 5;
  context.save();
  context.translate(x, y);
  context.rotate(elapsed * 0.5);
  context.fillStyle = 'rgba(255,226,94,.24)';
  for (let index = 0; index < 8; index += 1) {
    context.rotate(Math.PI / 4);
    context.fillRect(14, -2, 9, 4);
  }
  context.fillStyle = '#ffd857';
  context.strokeStyle = '#fff3a8';
  context.lineWidth = 3;
  context.beginPath();
  context.arc(0, 0, 11, 0, Math.PI * 2);
  context.fill();
  context.stroke();
  context.restore();
}

function drawMokiPickup(context, mount, elapsed) {
  context.save();
  context.translate(mount.x + mount.width / 2, mount.y + mount.height / 2 + Math.sin(elapsed * 4) * 2);
  context.fillStyle = '#8fcf4f';
  roundedRect(context, -23, -8, 42, 28, 13);
  context.fill();
  context.fillStyle = '#c4ea73';
  context.beginPath();
  context.ellipse(19, -5, 13, 11, 0, 0, Math.PI * 2);
  context.fill();
  leaf(context, 5, -16, 20, 9, '#24775e', -0.3);
  context.fillStyle = '#223a48';
  context.beginPath();
  context.arc(22, -7, 2, 0, Math.PI * 2);
  context.fill();
  context.restore();
}

function drawCheckpoint(context, checkpoint, active, elapsed) {
  context.strokeStyle = active ? '#f5cc4c' : 'rgba(255,255,255,.55)';
  context.lineWidth = 5;
  context.beginPath();
  context.moveTo(checkpoint.x + 8, checkpoint.y + checkpoint.height);
  context.lineTo(checkpoint.x + 8, checkpoint.y - 20);
  context.stroke();
  context.fillStyle = active ? '#f5cc4c' : '#d6e5c0';
  context.beginPath();
  context.moveTo(checkpoint.x + 10, checkpoint.y - 20);
  context.lineTo(checkpoint.x + 43, checkpoint.y - 8);
  context.lineTo(checkpoint.x + 10, checkpoint.y + 4);
  context.closePath();
  context.fill();
  if (active) {
    context.globalAlpha = 0.18 + Math.sin(elapsed * 5) * 0.07;
    context.beginPath();
    context.arc(checkpoint.x + 10, checkpoint.y + 16, 34, 0, Math.PI * 2);
    context.fill();
    context.globalAlpha = 1;
  }
}

function drawFinish(context, finish, elapsed) {
  context.strokeStyle = '#f8f1c8';
  context.lineWidth = 7;
  context.beginPath();
  context.moveTo(finish.x + 12, finish.y + finish.height);
  context.lineTo(finish.x + 12, finish.y);
  context.stroke();
  context.fillStyle = '#f16f79';
  context.beginPath();
  context.moveTo(finish.x + 14, finish.y + 4);
  context.lineTo(finish.x + 62, finish.y + 18 + Math.sin(elapsed * 4) * 3);
  context.lineTo(finish.x + 14, finish.y + 34);
  context.closePath();
  context.fill();
  context.fillStyle = '#f5cc4c';
  context.beginPath();
  context.arc(finish.x + 12, finish.y, 10, 0, Math.PI * 2);
  context.fill();
}

function drawParticles(context, particles, delta) {
  for (const particle of particles) {
    particle.life -= delta;
    particle.x += particle.vx * delta;
    particle.y += particle.vy * delta;
    particle.vy += 240 * delta;
    context.globalAlpha = clamp(particle.life * 2.5, 0, 1);
    context.fillStyle = particle.color;
    context.beginPath();
    context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    context.fill();
  }
  context.globalAlpha = 1;
  return particles.filter((particle) => particle.life > 0);
}

function strokeHitbox(context, item, color, label = '') {
  if (!item) return;
  const width = item.width || item.size;
  const height = item.height || item.size;
  context.strokeStyle = color;
  context.lineWidth = 2;
  context.strokeRect(item.x, item.y, width, height);
  if (label) {
    context.fillStyle = color;
    context.font = '10px monospace';
    context.fillText(label, item.x + 2, item.y - 4);
  }
}

function drawDebug(context, state) {
  [...state.level.platforms, ...state.movingPlatforms, ...state.crumbles.filter((item) => item.active), ...state.gates.filter((item) => !item.open)]
    .forEach((item) => strokeHitbox(context, item, '#55f0c1', item.id));
  state.level.hazards.forEach((item) => strokeHitbox(context, item, '#ff4e82', item.kind));
  state.enemies.forEach((item) => strokeHitbox(context, item, '#ffb84c', item.kind));
  [...state.springs, ...state.keys, ...state.switches, ...state.mounts].forEach((item) => strokeHitbox(context, item, '#67b7ff'));
  strokeHitbox(context, state.medal, '#fff25d', 'medal');
  strokeHitbox(context, state.level.finish, '#ef78ff', 'finish');
  strokeHitbox(context, state.player, '#ffffff', 'player');
}

function drawBossHud(context, enemies) {
  const boss = enemies.find((enemy) => enemy.kind === 'boss');
  if (!boss) return;
  const width = 220;
  const x = (WORLD_WIDTH - width) / 2;
  context.fillStyle = 'rgba(10,42,37,.75)';
  roundedRect(context, x, 68, width, 20, 10);
  context.fill();
  context.fillStyle = '#ef759d';
  roundedRect(context, x + 4, 72, (width - 8) * clamp(boss.health / 3, 0, 1), 12, 6);
  context.fill();
  context.fillStyle = '#fff9e9';
  context.font = '800 10px sans-serif';
  context.textAlign = 'center';
  context.fillText('TEMPELWACHTER', WORLD_WIDTH / 2, 62);
  context.textAlign = 'start';
}

export function createRenderer(canvas) {
  const context = canvas.getContext('2d');
  const particles = [];
  let scaleX = 1;
  let scaleY = 1;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const width = rect.width || WORLD_WIDTH;
    const height = rect.height || WORLD_HEIGHT;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    scaleX = (width / WORLD_WIDTH) * dpr;
    scaleY = (height / WORLD_HEIGHT) * dpr;
    context.setTransform(scaleX, 0, 0, scaleY, 0, 0);
  }

  function burst(x, y, color = '#f5cc4c', count = 10) {
    for (let index = 0; index < count; index += 1) {
      const angle = (Math.PI * 2 * index) / count;
      particles.push({
        x,
        y,
        vx: Math.cos(angle) * (50 + index * 2),
        vy: Math.sin(angle) * (50 + index * 2) - 40,
        life: 0.7 + (index % 3) * 0.12,
        color,
        size: 3 + (index % 3),
      });
    }
  }

  function render(state) {
    if (!state?.level || !state.player) return;
    context.setTransform(scaleX, 0, 0, scaleY, 0, 0);
    context.clearRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    const maxCamera = Math.max(0, state.level.width - WORLD_WIDTH);
    const cameraX = clamp(state.player.x - 300, 0, maxCamera);
    drawBackground(context, cameraX, state.level, state);
    drawWorldDecoration(context, state.level, cameraX);

    context.save();
    context.translate(-cameraX, 0);
    state.level.platforms.forEach((platform) => drawPlatform(context, platform, state.level));
    state.movingPlatforms.forEach((platform) => drawPlatform(context, platform, state.level));
    state.crumbles.filter((platform) => platform.active).forEach((platform) => drawPlatform(context, platform, state.level));
    state.level.hazards.forEach((hazard) => drawHazard(context, hazard, state.elapsed));
    state.springs.forEach((spring) => drawSpring(context, spring, state.elapsed));
    state.keys.forEach((key) => drawKey(context, key, state.elapsed));
    state.gates.forEach((gate) => drawGate(context, gate));
    state.switches.forEach((item) => drawSwitch(context, item));
    state.coins.forEach((coin) => drawCoin(context, coin, state.elapsed));
    drawMedal(context, state.medal, state.elapsed);
    state.mounts.forEach((mount) => drawMokiPickup(context, mount, state.elapsed));
    state.enemies.forEach((enemy) => drawEnemy(context, enemy, state.elapsed));
    drawCheckpoint(context, state.level.checkpoint, state.checkpointTouched, state.elapsed);
    drawFinish(context, state.level.finish, state.elapsed);
    drawPlayer(context, state.player, state.elapsed, state.tongue);
    const activeParticles = drawParticles(context, particles, state.delta);
    particles.length = 0;
    particles.push(...activeParticles);
    if (state.debugHitboxes) drawDebug(context, state);
    context.restore();

    drawBossHud(context, state.enemies);
    if (state.paused || state.result) {
      context.fillStyle = 'rgba(5,31,29,.3)';
      context.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    }
    if (state.flash > 0) {
      context.fillStyle = 'rgba(255,78,105,' + Math.min(0.28, state.flash) + ')';
      context.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    }
  }

  resize();
  return { render, resize, burst };
}
