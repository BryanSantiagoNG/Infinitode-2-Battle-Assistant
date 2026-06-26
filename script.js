'use strict';

const TOWERS = [
  {
    id: 'basic',
    name: 'Básica',
    icon: '🔵',
    type: 'Daño directo',
    cost: 50,
    upgradeCost: 40,
    damage: 8,
    dps: 6,
    speed: 1.2,
    range: 3.5,
    fireRate: 0.8,
    aoe: false,
    projectileSpeed: 'media',
    special: ['Sin especialidad', 'Muy económica', 'Buena apertura'],
    research: ['Daño básico', 'Velocidad básica', 'Alcance básico'],
    synergies: ['freeze', 'poison', 'tesla'],
    bestPhase: ['early', 'mid'],
    endlessRating: 3,
    bossRating: 2,
    antiAir: false,
    slow: false,
    poison: false,
    pros: ['Precio ínfimo', 'Buen DPS inicial', 'Ideal para spam'],
    cons: ['Escala mal en late', 'Sin utilidad especial'],
    priority: 7,
    stats: { dps: 35, cost: 95, range: 40, scaling: 20, utility: 25, versatility: 55 }
  },
  {
    id: 'sniper',
    name: 'Francotirador',
    icon: '🎯',
    type: 'Daño alto / largo alcance',
    cost: 120,
    upgradeCost: 90,
    damage: 80,
    dps: 22,
    speed: 0.3,
    range: 9,
    fireRate: 0.28,
    aoe: false,
    projectileSpeed: 'instantánea',
    special: ['Daño muy alto por disparo', 'Puede apuntar más lejano', 'Excelente vs boss'],
    research: ['Daño crítico', 'Alcance sniper', 'Cadencia sniper'],
    synergies: ['freeze', 'slow', 'minigun'],
    bestPhase: ['mid', 'late'],
    endlessRating: 7,
    bossRating: 9,
    antiAir: true,
    slow: false,
    poison: false,
    pros: ['Daño altísimo por disparo', 'Anti-aéreo nativo', 'Excelente vs bosses'],
    cons: ['DPS bajo', 'Caro para el early', 'Poca cadencia'],
    priority: 7,
    stats: { dps: 42, cost: 50, range: 95, scaling: 65, utility: 60, versatility: 60 }
  },
  {
    id: 'freeze',
    name: 'Congelador',
    icon: '❄️',
    type: 'Control / Slow',
    cost: 130,
    upgradeCost: 100,
    damage: 5,
    dps: 8,
    speed: 0.5,
    range: 3.5,
    fireRate: 0.5,
    aoe: true,
    projectileSpeed: 'lenta',
    special: ['Ralentiza enemigos en AoE', 'Multiplica daño de otras torres', 'Sinergia con veneno'],
    research: ['Duración frío', 'AoE frío', 'Cadencia frío'],
    synergies: ['basic', 'tesla', 'poison', 'laser', 'minigun'],
    bestPhase: ['mid', 'late'],
    endlessRating: 9,
    bossRating: 7,
    antiAir: false,
    slow: true,
    poison: false,
    pros: ['Multiplicador de daño universal', 'Imprescindible late game', 'AoE continuo'],
    cons: ['Daño propio nulo', 'No funciona vs jefes rápidos sin research'],
    priority: 9,
    stats: { dps: 8, cost: 45, range: 40, scaling: 90, utility: 95, versatility: 85 }
  },
  {
    id: 'tesla',
    name: 'Tesla',
    icon: '⚡',
    type: 'Daño AoE / Cadena',
    cost: 200,
    upgradeCost: 150,
    damage: 40,
    dps: 55,
    speed: 1.4,
    range: 4,
    fireRate: 1.4,
    aoe: true,
    projectileSpeed: 'instantánea',
    special: ['Daño en cadena a múltiples enemigos', 'Muy eficaz en grupos', 'Aturde brevemente'],
    research: ['Cadena adicional', 'Daño tesla', 'Radius tesla'],
    synergies: ['freeze', 'slow', 'poison', 'minigun'],
    bestPhase: ['mid', 'late'],
    endlessRating: 8,
    bossRating: 6,
    antiAir: true,
    slow: false,
    poison: false,
    pros: ['DPS masivo vs grupos', 'Cadena de rayo', 'Anti-aéreo'],
    cons: ['Caro', 'Menor DPS vs objetivo único', 'Necesita research'],
    priority: 8,
    stats: { dps: 75, cost: 35, range: 45, scaling: 75, utility: 65, versatility: 80 }
  },
  {
    id: 'laser',
    name: 'Láser',
    icon: '🔴',
    type: 'DPS continuo / Haz',
    cost: 180,
    upgradeCost: 130,
    damage: 30,
    dps: 60,
    speed: 999,
    range: 5,
    fireRate: 999,
    aoe: false,
    projectileSpeed: 'instantánea',
    special: ['Daño continuo en línea', 'DPS real muy alto', 'No requiere velocidad de proyectil'],
    research: ['Potencia láser', 'Rango láser', 'Calor láser'],
    synergies: ['freeze', 'slow', 'basic'],
    bestPhase: ['mid', 'late'],
    endlessRating: 8,
    bossRating: 8,
    antiAir: false,
    slow: false,
    poison: false,
    pros: ['DPS de los más altos', 'Constante sin recargar', 'Excelente vs boss lento'],
    cons: ['Solo golpea en línea recta', 'Caro', 'Poco AoE'],
    priority: 8,
    stats: { dps: 90, cost: 38, range: 60, scaling: 70, utility: 50, versatility: 65 }
  },
  {
    id: 'poison',
    name: 'Veneno',
    icon: '☠️',
    type: 'DoT / Control',
    cost: 110,
    upgradeCost: 85,
    damage: 12,
    dps: 18,
    speed: 0.6,
    range: 3.5,
    fireRate: 0.6,
    aoe: false,
    projectileSpeed: 'media',
    special: ['Daño por tiempo', 'Apila con freeze para mayor efecto', 'Eficiente vs HP alta'],
    research: ['Duración veneno', 'Daño veneno', 'Aceleración veneno'],
    synergies: ['freeze', 'tesla', 'flamethrower'],
    bestPhase: ['mid', 'late'],
    endlessRating: 7,
    bossRating: 7,
    antiAir: false,
    slow: false,
    poison: true,
    pros: ['DPS efectivo en late', 'Multiplica con freeze', 'Sin gap de disparo'],
    cons: ['DPS inicial bajo', 'No sirve en early puro', 'Depende de sinergias'],
    priority: 7,
    stats: { dps: 50, cost: 55, range: 38, scaling: 68, utility: 70, versatility: 60 }
  },
  {
    id: 'minigun',
    name: 'Minigun',
    icon: '🔫',
    type: 'Cadencia ultra alta / DPS',
    cost: 160,
    upgradeCost: 120,
    damage: 10,
    dps: 70,
    speed: 7,
    range: 4,
    fireRate: 7,
    aoe: false,
    projectileSpeed: 'muy rápida',
    special: ['Cadencia altísima', 'Excelente DPS acumulado', 'Buena vs swarm'],
    research: ['Cadencia minigun', 'Daño minigun', 'Perforación'],
    synergies: ['freeze', 'slow', 'tesla'],
    bestPhase: ['mid', 'late'],
    endlessRating: 8,
    bossRating: 6,
    antiAir: true,
    slow: false,
    poison: false,
    pros: ['DPS altísimo acumulado', 'Anti-aéreo efectivo', 'Buena para grupos'],
    cons: ['Daño por bala bajo', 'Mal vs blindados sin research'],
    priority: 8,
    stats: { dps: 85, cost: 40, range: 42, scaling: 65, utility: 55, versatility: 75 }
  },
  {
    id: 'flamethrower',
    name: 'Lanzallamas',
    icon: '🔥',
    type: 'DoT / AoE cercano',
    cost: 140,
    upgradeCost: 100,
    damage: 25,
    dps: 45,
    speed: 999,
    range: 2.5,
    fireRate: 999,
    aoe: true,
    projectileSpeed: 'instantánea',
    special: ['Área de llamas constante', 'Excelente vs swarm', 'Combo con veneno'],
    research: ['Temperatura', 'AoE llamas', 'Daño llamas'],
    synergies: ['poison', 'freeze', 'basic'],
    bestPhase: ['mid', 'late'],
    endlessRating: 7,
    bossRating: 5,
    antiAir: false,
    slow: false,
    poison: false,
    pros: ['AoE constante sin apuntar', 'Combo veneno+fuego', 'DPS efectivo en grupo'],
    cons: ['Alcance muy corto', 'Inutilizable vs voladores', 'Necesita posición correcta'],
    priority: 6,
    stats: { dps: 65, cost: 48, range: 20, scaling: 55, utility: 58, versatility: 52 }
  },
  {
    id: 'mortar',
    name: 'Mortero',
    icon: '💣',
    type: 'AoE de largo alcance',
    cost: 170,
    upgradeCost: 125,
    damage: 90,
    dps: 25,
    speed: 0.28,
    range: 7,
    fireRate: 0.28,
    aoe: true,
    projectileSpeed: 'lenta (proyectil)',
    special: ['Gran radio de explosión', 'Daño en área masivo', 'Cubre zonas lejanas'],
    research: ['Radio mortero', 'Cadencia mortero', 'Daño mortero'],
    synergies: ['freeze', 'basic', 'laser'],
    bestPhase: ['mid', 'late'],
    endlessRating: 6,
    bossRating: 7,
    antiAir: false,
    slow: false,
    poison: false,
    pros: ['Radio de explosión enorme', 'Alcance muy largo', 'Impacta grupos distantes'],
    cons: ['Proyectil lento (miss vs rápidos)', 'DPS bajo por disparo', 'Inútil vs aviones'],
    priority: 6,
    stats: { dps: 38, cost: 38, range: 85, scaling: 55, utility: 55, versatility: 58 }
  },
  {
    id: 'antiair',
    name: 'Antiaérea',
    icon: '✈️',
    type: 'Anti-aéreo especializado',
    cost: 150,
    upgradeCost: 110,
    damage: 60,
    dps: 35,
    speed: 2.5,
    range: 6,
    fireRate: 0.6,
    aoe: false,
    projectileSpeed: 'muy rápida',
    special: ['Solo ataca voladores', 'Daño alto vs aéreos', 'Largo alcance'],
    research: ['Alcance AA', 'Daño AA', 'Cadencia AA'],
    synergies: ['freeze', 'tesla'],
    bestPhase: ['early', 'mid', 'late'],
    endlessRating: 6,
    bossRating: 4,
    antiAir: true,
    slow: false,
    poison: false,
    pros: ['Imprescindible con voladores', 'Rango alto', 'DPS vs aéreos excelente'],
    cons: ['Inútil sin voladores', 'No ataca terrestres', 'Gasto innecesario sin volanderos'],
    priority: 5,
    stats: { dps: 50, cost: 42, range: 72, scaling: 45, utility: 40, versatility: 30 }
  },
  {
    id: 'slow',
    name: 'Ralentizador',
    icon: '🌀',
    type: 'Control / Slow',
    cost: 100,
    upgradeCost: 75,
    damage: 3,
    dps: 5,
    speed: 0.4,
    range: 3,
    fireRate: 0.4,
    aoe: true,
    projectileSpeed: 'lenta',
    special: ['Ralentización constante en área', 'No depende de frío', 'Económico'],
    research: ['Magnitud slow', 'Duración slow', 'AoE slow'],
    synergies: ['basic', 'laser', 'minigun', 'sniper'],
    bestPhase: ['early', 'mid', 'late'],
    endlessRating: 8,
    bossRating: 8,
    antiAir: false,
    slow: true,
    poison: false,
    pros: ['Multiplicador de daño pasivo', 'Muy económico', 'Útil toda la partida'],
    cons: ['Daño propio despreciable', 'Necesita combinarse siempre'],
    priority: 8,
    stats: { dps: 5, cost: 80, range: 35, scaling: 85, utility: 92, versatility: 88 }
  },
  {
    id: 'crusher',
    name: 'Trituradora',
    icon: '⚙️',
    type: 'Daño físico / Blindados',
    cost: 190,
    upgradeCost: 140,
    damage: 120,
    dps: 30,
    speed: 0.25,
    range: 3.5,
    fireRate: 0.25,
    aoe: false,
    projectileSpeed: 'instantánea',
    special: ['Ignora armadura', 'Excelente vs blindados', 'Daño por golpe altísimo'],
    research: ['Penetración trituradora', 'Daño trituradora', 'Cadencia trituradora'],
    synergies: ['freeze', 'slow', 'tesla'],
    bestPhase: ['mid', 'late'],
    endlessRating: 8,
    bossRating: 9,
    antiAir: false,
    slow: false,
    poison: false,
    pros: ['Mejor contra blindados', 'Daño extremo contra boss', 'No reducido por armadura'],
    cons: ['Muy lenta para grupos', 'Cara', 'Ineficiente vs swarm'],
    priority: 7,
    stats: { dps: 40, cost: 32, range: 38, scaling: 80, utility: 62, versatility: 55 }
  },
  {
    id: 'railgun',
    name: 'Railgun',
    icon: '⚡🔴',
    type: 'Penetración en línea',
    cost: 250,
    upgradeCost: 180,
    damage: 200,
    dps: 28,
    speed: 0.14,
    range: 10,
    fireRate: 0.14,
    aoe: false,
    projectileSpeed: 'instantánea',
    special: ['Penetra múltiples enemigos en fila', 'Daño colosal por disparo', 'Largo alcance extremo'],
    research: ['Cadena penetración', 'Daño railgun', 'Alcance railgun'],
    synergies: ['freeze', 'slow'],
    bestPhase: ['late'],
    endlessRating: 7,
    bossRating: 10,
    antiAir: false,
    slow: false,
    poison: false,
    pros: ['Daño por disparo más alto del juego', 'Penetra en línea', 'Perfecto vs boss'],
    cons: ['Cadencia paupérrima', 'Muy caro', 'Solo útil en late'],
    priority: 6,
    stats: { dps: 30, cost: 22, range: 100, scaling: 75, utility: 45, versatility: 40 }
  },
  {
    id: 'support',
    name: 'Soporte',
    icon: '🛡️',
    type: 'Buffer / Multiplicador',
    cost: 160,
    upgradeCost: 120,
    damage: 0,
    dps: 0,
    speed: 0,
    range: 4,
    fireRate: 0,
    aoe: true,
    projectileSpeed: 'n/a',
    special: ['Aumenta daño de torres vecinas', 'Multiplicador de velocidad', 'Aura pasiva'],
    research: ['Aura soporte', 'Radio soporte', 'Intensidad soporte'],
    synergies: ['tesla', 'laser', 'minigun', 'railgun', 'crusher'],
    bestPhase: ['mid', 'late'],
    endlessRating: 9,
    bossRating: 8,
    antiAir: false,
    slow: false,
    poison: false,
    pros: ['Multiplica todo a su alrededor', 'No necesita DPS propio', 'Imprescindible late'],
    cons: ['Cero daño directo', 'Inútil sin torres nearby', 'Cara'],
    priority: 8,
    stats: { dps: 0, cost: 35, range: 50, scaling: 95, utility: 100, versatility: 70 }
  },
  {
    id: 'ricochet',
    name: 'Rebote',
    icon: '🔮',
    type: 'Multi-objetivo / Rebote',
    cost: 140,
    upgradeCost: 105,
    damage: 30,
    dps: 35,
    speed: 1.0,
    range: 4.5,
    fireRate: 1.0,
    aoe: false,
    projectileSpeed: 'rápida',
    special: ['El proyectil rebota entre enemigos', 'Excelente vs grupos compactos', 'Daño acumulativo'],
    research: ['Rebotes adicionales', 'Daño rebote', 'Cadencia rebote'],
    synergies: ['freeze', 'slow', 'minigun'],
    bestPhase: ['mid', 'late'],
    endlessRating: 7,
    bossRating: 3,
    antiAir: true,
    slow: false,
    poison: false,
    pros: ['Multi-hit en grupos densos', 'Anti-aéreo', 'Daño escalable con rebotes'],
    cons: ['Malo vs objetivo único', 'DPS real varía', 'Menos útil en caminos abiertos'],
    priority: 6,
    stats: { dps: 55, cost: 45, range: 52, scaling: 58, utility: 55, versatility: 65 }
  }
];

const ENEMIES = [
  { id: 'green_circle',   name: 'Círculo Verde',    icon: '🟢', type: 'normal',   hp: 50,   speed: 1.0, armor: 0,   flying: false, invisible: false, description: 'Enemigo básico, el más común.' },
  { id: 'blue_circle',    name: 'Círculo Azul',     icon: '🔵', type: 'fast',     hp: 40,   speed: 1.8, armor: 0,   flying: false, invisible: false, description: 'Variante rápida del círculo.' },
  { id: 'red_circle',     name: 'Círculo Rojo',     icon: '🔴', type: 'normal',   hp: 120,  speed: 0.9, armor: 0,   flying: false, invisible: false, description: 'Mayor salud que el verde.' },
  { id: 'yellow_circle',  name: 'Círculo Amarillo', icon: '🟡', type: 'swarm',    hp: 20,   speed: 1.2, armor: 0,   flying: false, invisible: false, description: 'Aparece en grupos enormes.' },
  { id: 'black_circle',   name: 'Círculo Negro',    icon: '⚫', type: 'armored',  hp: 200,  speed: 0.7, armor: 50,  flying: false, invisible: false, description: 'Alta armadura, resistente al daño normal.' },
  { id: 'white_circle',   name: 'Círculo Blanco',   icon: '⚪', type: 'fast',     hp: 80,   speed: 2.5, armor: 0,   flying: false, invisible: false, description: 'Extremadamente rápido.' },
  { id: 'green_square',   name: 'Cuadrado Verde',   icon: '🟩', type: 'normal',   hp: 300,  speed: 0.8, armor: 10,  flying: false, invisible: false, description: 'Versión resistente.' },
  { id: 'blue_square',    name: 'Cuadrado Azul',    icon: '🟦', type: 'armored',  hp: 500,  speed: 0.6, armor: 80,  flying: false, invisible: false, description: 'Blindado medio.' },
  { id: 'drone',          name: 'Dron',             icon: '🚁', type: 'flying',   hp: 100,  speed: 1.5, armor: 0,   flying: true,  invisible: false, description: 'Volador básico, ignora obstáculos.' },
  { id: 'jet',            name: 'Jet',              icon: '✈️', type: 'flying',   hp: 200,  speed: 2.2, armor: 0,   flying: true,  invisible: false, description: 'Volador muy rápido.' },
  { id: 'green_triangle', name: 'Triángulo Verde',  icon: '🔺', type: 'fast',     hp: 60,   speed: 2.0, armor: 0,   flying: false, invisible: false, description: 'Rápido y evasivo.' },
  { id: 'purple_circle',  name: 'Círculo Morado',   icon: '🟣', type: 'elite',    hp: 800,  speed: 0.8, armor: 30,  flying: false, invisible: false, description: 'Élite, alta salud y armadura.' },
  { id: 'pentagon',       name: 'Pentágono',        icon: '⬠',  type: 'tank',     hp: 2000, speed: 0.5, armor: 60,  flying: false, invisible: false, description: 'Mini-boss, tanque masivo.' },
  { id: 'hexagon',        name: 'Hexágono',         icon: '⬡',  type: 'tank',     hp: 5000, speed: 0.4, armor: 80,  flying: false, invisible: false, description: 'Jefe menor, requiere mucho DPS.' },
  { id: 'invisible',      name: 'Espectro',         icon: '👻', type: 'invisible', hp: 150, speed: 1.6, armor: 0,   flying: false, invisible: true,  description: 'Invisible. Requiere torres con detección.' },
  { id: 'boss',           name: 'Boss',             icon: '💀', type: 'boss',     hp: 50000,speed: 0.3, armor: 100, flying: false, invisible: false, description: 'Jefe final. Daño altísimo requerido.' }
];

const SYNERGY_RULES = [
  {
    towers: ['freeze', 'poison'],
    title: 'Crionecrósis (Congelador + Veneno)',
    desc: 'Los enemigos congelados reciben el DoT del veneno por más tiempo. +40% DPS efectivo del veneno.'
  },
  {
    towers: ['freeze', 'tesla'],
    title: 'Tormenta Ártica (Congelador + Tesla)',
    desc: 'Los enemigos ralentizados no pueden evadir las cadenas del Tesla. DPS neto x1.6 en grupos.'
  },
  {
    towers: ['freeze', 'laser'],
    title: 'Congelación Sostenida (Congelador + Láser)',
    desc: 'El láser aplica todo su DPS continuo sin que el objetivo se mueva. Máximo aprovechamiento del haz.'
  },
  {
    towers: ['support', 'tesla'],
    title: 'Amplificación Eléctrica (Soporte + Tesla)',
    desc: 'La aura de soporte amplifica el daño de la cadena del Tesla. Multiplicador de efecto secundario.'
  },
  {
    towers: ['support', 'laser'],
    title: 'Haz Potenciado (Soporte + Láser)',
    desc: 'El Soporte en rango del Láser aumenta su DPS en un % significativo. Ideal en late game.'
  },
  {
    towers: ['poison', 'flamethrower'],
    title: 'Combustión Tóxica (Veneno + Lanzallamas)',
    desc: 'El fuego acelera el efecto del veneno. Combo devastador en rutas cortas.'
  },
  {
    towers: ['slow', 'minigun'],
    title: 'Tormenta de Balas (Ralentizador + Minigun)',
    desc: 'Los enemigos lentos reciben más impactos de la Minigun por el mismo recorrido. DPS efectivo x2.'
  },
  {
    towers: ['freeze', 'crusher'],
    title: 'Golpe de Hielo (Congelador + Trituradora)',
    desc: 'Los blindados congelados reciben el daño máximo de la Trituradora sin escapar entre golpes.'
  }
];

const WEIGHT_DEFINITIONS = [
  { id: 'wDps',      label: 'DPS / Daño por segundo',    default: 5 },
  { id: 'wCost',     label: 'Bajo costo',                default: 5 },
  { id: 'wRange',    label: 'Alcance / Rango',           default: 4 },
  { id: 'wControl',  label: 'Control de masas',          default: 5 },
  { id: 'wBoss',     label: 'Daño a Boss/objetivos únicos', default: 4 },
  { id: 'wEndless',  label: 'Rendimiento en Endless',   default: 4 },
  { id: 'wEase',     label: 'Facilidad de uso',          default: 3 }
];

const AppState = {
  mode: 'normal',
  phase: 'early',
  boss: 'no',
  flying: 'no',
  mapName: '',
  startMoney: 500,
  researchLevel: 30,
  weights: {},
  enemySelections: {},  
  lastResults: null,
  favorites: [],
  history: [],
  currentStatTab: 'dps'
};

function showToast(msg, duration = 2500) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), duration);
}

function fmt(n) {
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
  return String(n);
}

function clamp(val, min, max) { return Math.min(max, Math.max(min, val)); }

function scoreClass(score) {
  if (score >= 72) return 'high';
  if (score >= 48) return 'mid';
  return 'low';
}

function lsGet(key, fallback) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
  catch { return fallback; }
}

function lsSet(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

function scoreTower(tower, state) {
  let score = 0;

  const w         = state.weights;
  const phase     = state.phase;
  const mode      = state.mode;
  const research  = state.researchLevel;
  const hasBoss   = state.boss === 'yes';
  const hasFlying = state.flying === 'yes';
  const money     = state.startMoney;
  const enemies   = state.enemySelections;

  let totalEnemyQty   = 0;
  let flyingQty       = 0;
  let armoredQty      = 0;
  let swarmQty        = 0;
  let fastQty         = 0;
  let eliteQty        = 0;
  let invisibleQty    = 0;

  ENEMIES.forEach(enemy => {
    const sel = enemies[enemy.id];
    if (!sel || !sel.selected) return;
    const qty = parseInt(sel.qty) || 1;
    totalEnemyQty += qty;
    if (enemy.flying)              flyingQty    += qty;
    if (enemy.armor > 40)          armoredQty   += qty;
    if (enemy.type === 'swarm')    swarmQty     += qty * 1.5;
    if (enemy.speed >= 1.5)        fastQty      += qty;
    if (enemy.type === 'elite' ||
        enemy.type === 'tank')     eliteQty     += qty;
    if (enemy.invisible)           invisibleQty += qty;
  });

  const dpsNorm = clamp(tower.stats.dps / 100, 0, 1);
  score += dpsNorm * 20 * (w.wDps / 5);

  const affordability = clamp(1 - (tower.cost / money), 0, 1);
  score += affordability * 12 * (w.wCost / 5);

  const rangeNorm = clamp(tower.stats.range / 100, 0, 1);
  score += rangeNorm * 8 * (w.wRange / 5);

  if (tower.bestPhase.includes(phase)) {
    score += 15;
  } else if (phase === 'late' && tower.bestPhase.includes('mid')) {
    score += 6;
  }

  if (mode === 'endless') {
    score += (tower.endlessRating / 10) * 15 * (w.wEndless / 5);
  }

  if (hasBoss) {
    score += (tower.bossRating / 10) * 14 * (w.wBoss / 5);
  }

  if (hasFlying || flyingQty > 0) {
    if (tower.antiAir) score += 12 + flyingQty * 2;
    else               score -= 5;
  } else {
    if (tower.id === 'antiair') score -= 25; 
  }

  if (armoredQty > 0) {
    if (tower.id === 'crusher') score += 10 + armoredQty * 3;
    if (tower.id === 'railgun') score += 8 + armoredQty * 2;
    if (tower.id === 'laser')   score += 5 + armoredQty * 1.5;
  }

  if (swarmQty > 3) {
    if (tower.aoe)           score += swarmQty * 2;
    if (tower.id === 'tesla')         score += 8;
    if (tower.id === 'flamethrower')  score += 6;
    if (tower.id === 'ricochet')      score += 5;
  }

  if (fastQty > 2) {
    if (tower.slow)             score += 10;
    if (tower.id === 'freeze')  score += 8;
    if (tower.id === 'slow')    score += 8;
    if (tower.fireRate > 1.5)   score += 5;
    if (tower.id === 'mortar')  score -= 5; 
  }

  if (invisibleQty > 0) {
    if (['tesla','laser','flamethrower'].includes(tower.id)) score += 6;
  }

  const researchBonus = (research / 100) * 10;
  score += researchBonus;

  if (tower.slow || tower.id === 'freeze') {
    score += 10 * (w.wControl / 5);
  }

  const utilNorm = clamp(tower.stats.utility / 100, 0, 1);
  score += utilNorm * 8;

  const versatNorm = clamp(tower.stats.versatility / 100, 0, 1);
  score += versatNorm * 6 * (w.wEase / 5);

  if (phase === 'late' || mode === 'endless') {
    const scalNorm = clamp(tower.stats.scaling / 100, 0, 1);
    score += scalNorm * 10;
  }

  if (eliteQty > 0) {
    score += (tower.bossRating / 10) * eliteQty * 2;
  }

  return Math.round(clamp(score, 0, 100));
}

function buildReasons(tower, state, score) {
  const reasons = [];
  const phase = state.phase;
  const mode  = state.mode;

  if (tower.bestPhase.includes(phase))
    reasons.push(`Ideal para la fase ${phase.toUpperCase()}.`);
  if (mode === 'endless' && tower.endlessRating >= 8)
    reasons.push(`Escala excelente en modo Endless (${tower.endlessRating}/10).`);
  if (state.boss === 'yes' && tower.bossRating >= 7)
    reasons.push(`Alto daño vs Boss (${tower.bossRating}/10).`);
  if (tower.antiAir && state.flying === 'yes')
    reasons.push('Anti-aéreo activo con voladores presentes.');
  if (tower.aoe)
    reasons.push('AoE efectivo contra grupos de enemigos.');
  if (tower.slow || tower.id === 'freeze')
    reasons.push('Control de masas pasivo que multiplica el DPS aliado.');
  if (tower.stats.utility >= 80)
    reasons.push('Alta utilidad general en cualquier composición.');
  if (tower.cost <= 110 && state.startMoney < 300)
    reasons.push('Económico para un arranque con poco dinero.');
  if (score >= 80)
    reasons.push('Puntuación de élite para estas condiciones.');

  return reasons.slice(0, 4);
}

function buildWarnings(state, rankedTowers) {
  const warnings = [];

  if (state.flying === 'no') {
    warnings.push({ icon: '⚠️', text: 'No hay voladores activos. Evita construir la Antiaérea: es completamente inútil sin objetivos aéreos.' });
  }

  const hasControl = rankedTowers.slice(0, 5).some(t => t.slow || t.id === 'freeze' || t.id === 'slow');
  if (!hasControl && state.phase !== 'early') {
    warnings.push({ icon: '⚠️', text: 'Ninguna de las 5 torres top tiene control de masas. Considera añadir un Congelador o Ralentizador.' });
  }

  if (state.boss === 'yes') {
    const hasBossDmg = rankedTowers.slice(0, 6).some(t => ['railgun','crusher','sniper','laser'].includes(t.id));
    if (!hasBossDmg) {
      warnings.push({ icon: '💀', text: 'Hay Boss pero ninguna torre top está optimizada para objetivo único. Añade Railgun, Trituradora o Francotirador.' });
    }
  }

  if (state.mode === 'endless' && state.phase === 'late') {
    const hasSupport = rankedTowers.slice(0, 8).some(t => t.id === 'support');
    if (!hasSupport) {
      warnings.push({ icon: '♾️', text: 'Modo Endless sin torre de Soporte en el top. El Soporte se vuelve obligatorio en late Endless.' });
    }
  }

  if (state.startMoney < 200) {
    const tooExpensive = rankedTowers[0].cost > 150;
    if (tooExpensive) {
      warnings.push({ icon: '💰', text: `Dinero inicial bajo ($${state.startMoney}). La torre #1 recomendada cuesta $${rankedTowers[0].cost}. Considera empezar con torres Básicas.` });
    }
  }

  const fastEnemies = ENEMIES.filter(e => e.speed >= 1.5 && state.enemySelections[e.id]?.selected);
  if (fastEnemies.length >= 3) {
    warnings.push({ icon: '💨', text: 'Muchos enemigos rápidos detectados. Prioriza Congelador o Ralentizador para que otras torres puedan impactarlos.' });
  }

  return warnings;
}

function buildOpeningPlan(rankedTowers, state) {
  const budget = state.startMoney;
  const plan   = [];
  let spent    = 0;
  const picked = [];

  if (budget < 200) {
    plan.push({ num: 1, text: `<strong>Torre Básica ×2</strong> — Con presupuesto ajustado ($${budget}), inicia con 2 Básicas ($${50*2}) para no quedar sin defensa.` });
    spent += 100;
    picked.push('basic');
  }

  let slot = picked.length + 1;
  for (const tower of rankedTowers.slice(0, 10)) {
    if (picked.includes(tower.id)) continue;
    if (spent + tower.cost > budget * 0.8) continue;
    if (slot > 4) break;
    plan.push({ num: slot, text: `<strong>${tower.name}</strong> — ${tower.pros[0]}. Ideal para abrir en ${state.phase}.` });
    spent += tower.cost;
    slot++;
    picked.push(tower.id);
  }

  if (plan.length === 0) {
    plan.push({ num: 1, text: 'Guarda el dinero inicial y espera la primera oleada para ver con qué te enfrentas.' });
  }

  return plan;
}

function buildMidPlan(rankedTowers, state) {
  const plan = [];
  const top3 = rankedTowers.slice(0, 3);

  plan.push({ num: 1, text: `Mejora las torres que ya tienes: prioriza <strong>${top3[0]?.name}</strong> al nivel 3 antes de construir nuevas.` });
  plan.push({ num: 2, text: 'Vende las torres Básicas que hayas colocado en early si ya tienes suficiente DPS de otras fuentes.' });

  const controlTower = rankedTowers.find(t => t.slow || t.id === 'freeze');
  if (controlTower) {
    plan.push({ num: 3, text: `Añade <strong>${controlTower.name}</strong> si no lo tienes: el control de masas multiplica el daño de toda tu defensa.` });
  }

  if (state.phase !== 'late') {
    plan.push({ num: 4, text: 'Reserva al menos 30% de tu oro para reaccionar a oleadas inesperadas sin quedarte sin recursos.' });
  }

  return plan;
}

function buildLatePlan(rankedTowers, state) {
  const plan = [];
  const top5 = rankedTowers.slice(0, 5).map(t => t.name).join(', ');

  plan.push({ num: 1, text: `<strong>Composición final sugerida:</strong> ${top5}.` });
  plan.push({ num: 2, text: state.mode === 'endless'
    ? 'En Endless, coloca al menos 1 torre de Soporte adyacente a tus torres de mayor DPS (Tesla, Láser, Minigun).'
    : 'Maximiza el nivel de mejora de las 2-3 torres principales antes de construir más.' });

  if (state.boss === 'yes') {
    const bossTower = rankedTowers.find(t => t.bossRating >= 8);
    if (bossTower) plan.push({ num: 3, text: `Contra el Boss, enfoca el fuego en <strong>${bossTower.name}</strong>. Rating anti-boss: ${bossTower.bossRating}/10.` });
  }

  plan.push({ num: 4, text: 'Optimiza el placement: torres de control (Congelador/Ralentizador) antes de los embudos de ruta, DPS detrás.' });

  return plan;
}

function detectSynergies(rankedTowers) {
  const top8Ids = rankedTowers.slice(0, 8).map(t => t.id);
  return SYNERGY_RULES.filter(rule =>
    rule.towers.every(id => top8Ids.includes(id))
  );
}

function analyzeGame() {
  AppState.mapName      = document.getElementById('mapName').value;
  AppState.startMoney   = parseInt(document.getElementById('startMoney').value) || 500;
  AppState.researchLevel = parseInt(document.getElementById('researchLevel').value);

  const scored = TOWERS.map(tower => ({
    ...tower,
    score:   scoreTower(tower, AppState),
    reasons: []
  }));

  scored.sort((a, b) => b.score - a.score);
  scored.forEach(t => { t.reasons = buildReasons(t, AppState, t.score); });

  AppState.lastResults = scored;

  saveToHistory();

  navigateTo('results');
  renderResults(scored);
}

function renderResults(scored) {
  const warningsEl = document.getElementById('warningsBlock');
  warningsEl.innerHTML = '';
  const warnings = buildWarnings(AppState, scored);
  warnings.forEach(w => {
    const div = document.createElement('div');
    div.className = 'warning-item';
    div.innerHTML = `<span class="warning-icon">${w.icon}</span><span class="warning-text">${w.text}</span>`;
    warningsEl.appendChild(div);
  });

  const grid = document.getElementById('resultsGrid');
  grid.innerHTML = '';
  scored.slice(0, 10).forEach((tower, idx) => {
    grid.appendChild(buildTowerCard(tower, idx + 1));
  });

  renderPlan('openingContent', buildOpeningPlan(scored, AppState));
  renderPlan('midContent',     buildMidPlan(scored, AppState));
  renderPlan('lateContent',    buildLatePlan(scored, AppState));

  const synergies   = detectSynergies(scored);
  const synEl       = document.getElementById('synergiesContent');
  synEl.innerHTML   = '';
  if (synergies.length === 0) {
    synEl.innerHTML = '<p style="color:var(--text-2);font-size:.88rem;">No hay sinergias destacadas en el top 8 actual.</p>';
  } else {
    synergies.forEach(s => {
      const div = document.createElement('div');
      div.className = 'synergy-item';
      div.innerHTML = `<div class="synergy-title">🔗 ${s.title}</div><div class="synergy-desc">${s.desc}</div>`;
      synEl.appendChild(div);
    });
  }

  document.querySelectorAll('#resultsGrid .tower-card').forEach((el, i) => {
    el.style.animationDelay = `${i * 0.06}s`;
  });
}

function renderPlan(containerId, steps) {
  const el = document.getElementById(containerId);
  el.innerHTML = '';
  steps.forEach(step => {
    const div = document.createElement('div');
    div.className = 'plan-step';
    div.innerHTML = `<div class="plan-step-num">${step.num}</div><div class="plan-step-text">${step.text}</div>`;
    el.appendChild(div);
  });
}

function buildTowerCard(tower, rank) {
  const card = document.createElement('div');
  card.className = 'tower-card';
  const isFav = AppState.favorites.includes(tower.id);
  const sc = tower.score;

  card.innerHTML = `
    <div class="tc-header">
      <div class="tc-icon">${tower.icon}</div>
      <div class="tc-meta">
        <div class="tc-rank">#${rank} — ${tower.type}</div>
        <div class="tc-name">${tower.name}</div>
      </div>
      <button class="tc-fav ${isFav ? 'active' : ''}" data-id="${tower.id}" title="Favorito">★</button>
    </div>

    <div class="tc-score-block">
      <div class="tc-score-header">
        <span>Puntuación</span>
        <span class="tc-score-num">${sc}/100</span>
      </div>
      <div class="score-bar">
        <div class="score-fill ${scoreClass(sc)}" style="width:${sc}%"></div>
      </div>
    </div>

    <div class="tc-stats">
      <div class="tc-stat">
        <div class="tc-stat-label">Costo</div>
        <div class="tc-stat-val">$${tower.cost}</div>
      </div>
      <div class="tc-stat">
        <div class="tc-stat-label">DPS</div>
        <div class="tc-stat-val">${tower.dps}</div>
      </div>
      <div class="tc-stat">
        <div class="tc-stat-label">Rango</div>
        <div class="tc-stat-val">${tower.range}</div>
      </div>
      <div class="tc-stat">
        <div class="tc-stat-label">Anti-aéreo</div>
        <div class="tc-stat-val">${tower.antiAir ? '✅' : '—'}</div>
      </div>
    </div>

    <div class="tc-reasons">
      ${tower.reasons.map(r => `
        <div class="tc-reason">
          <div class="tc-reason-dot"></div>
          <span>${r}</span>
        </div>`).join('')}
    </div>
  `;

  card.querySelector('.tc-fav').addEventListener('click', (e) => {
    e.stopPropagation();
    toggleFavorite(tower.id);
    e.currentTarget.classList.toggle('active', AppState.favorites.includes(tower.id));
  });

  return card;
}

function populateCompareSelects() {
  const selA = document.getElementById('towerA');
  const selB = document.getElementById('towerB');
  [selA, selB].forEach(sel => {
    sel.innerHTML = '';
    TOWERS.forEach(t => {
      const opt = document.createElement('option');
      opt.value = t.id;
      opt.textContent = `${t.icon} ${t.name}`;
      sel.appendChild(opt);
    });
  });
  if (TOWERS.length > 1) selB.value = TOWERS[1].id;
}

function renderCompare() {
  const idA = document.getElementById('towerA').value;
  const idB = document.getElementById('towerB').value;
  const tA  = TOWERS.find(t => t.id === idA);
  const tB  = TOWERS.find(t => t.id === idB);
  if (!tA || !tB) return;

  const container = document.getElementById('compareResult');
  const FIELDS = [
    { key: 'dps',          label: 'DPS' },
    { key: 'cost',         label: 'Costo',      invert: true },
    { key: 'range',        label: 'Alcance' },
    { key: 'scaling',      label: 'Escalado' },
    { key: 'utility',      label: 'Utilidad' },
    { key: 'versatility',  label: 'Versatilidad' }
  ];

  function buildCol(tower, opponent) {
    const div = document.createElement('div');
    div.className = 'compare-col';
    div.innerHTML = `
      <div class="compare-col-header">
        <div style="font-size:2rem">${tower.icon}</div>
        <div class="compare-col-name">${tower.name}</div>
        <div style="font-size:.78rem;color:var(--text-2);margin-top:.3rem">${tower.type}</div>
        <div style="font-size:.82rem;color:var(--blue-light);margin-top:.25rem">$${tower.cost} | DPS ${tower.dps} | Rango ${tower.range}</div>
      </div>
      ${FIELDS.map(f => {
        const valA = tower.stats[f.key];
        const valB = opponent.stats[f.key];
        const pct  = Math.round((valA / 100) * 100);
        const winner = f.invert ? valA <= valB : valA >= valB;
        return `
          <div class="compare-stat-row">
            <span class="compare-stat-label">${f.label}</span>
            <div class="compare-bar-wrap">
              <div class="compare-bar-fill" style="width:${pct}%;background:${winner ? 'linear-gradient(90deg,var(--green),#86efac)' : 'linear-gradient(90deg,var(--blue),var(--purple))'}"></div>
            </div>
            <span class="compare-stat-val" style="color:${winner ? 'var(--green)' : 'var(--text-1)'}">${valA}</span>
          </div>`;
      }).join('')}
      <div style="margin-top:.75rem;font-size:.78rem;color:var(--text-2)">
        <strong style="color:var(--text-1)">Pros:</strong> ${tower.pros.join(' · ')}
      </div>
      <div style="margin-top:.4rem;font-size:.78rem;color:var(--text-2)">
        <strong style="color:var(--text-1)">Cons:</strong> ${tower.cons.join(' · ')}
      </div>
    `;
    return div;
  }

  container.innerHTML = '';
  container.appendChild(buildCol(tA, tB));
  container.appendChild(buildCol(tB, tA));
}

function renderStats(statKey) {
  const chart = document.getElementById('statChart');
  chart.innerHTML = '';

  const sorted = [...TOWERS].sort((a, b) => {
    const vA = statKey === 'cost' ? (100 - a.stats.cost) : a.stats[statKey];
    const vB = statKey === 'cost' ? (100 - b.stats.cost) : b.stats[statKey];
    return vB - vA;
  });

  sorted.forEach(tower => {
    const rawVal = tower.stats[statKey];
    const displayVal = statKey === 'cost' ? `$${tower.cost}` : rawVal;
    const barPct     = statKey === 'cost' ? (100 - rawVal) : rawVal;

    const row = document.createElement('div');
    row.className = 'stat-row';
    row.innerHTML = `
      <span class="stat-row-name">${tower.icon} ${tower.name}</span>
      <div class="stat-row-bar">
        <div class="stat-row-fill" style="width:${barPct}%">${displayVal}</div>
      </div>`;
    chart.appendChild(row);
  });

  requestAnimationFrame(() => {
    chart.querySelectorAll('.stat-row-fill').forEach(el => {
      el.style.transition = 'width .7s cubic-bezier(.4,0,.2,1)';
    });
  });
}

function toggleFavorite(towerId) {
  const idx = AppState.favorites.indexOf(towerId);
  if (idx === -1) {
    AppState.favorites.push(towerId);
    showToast('★ Añadido a favoritos');
  } else {
    AppState.favorites.splice(idx, 1);
    showToast('Eliminado de favoritos');
  }
  lsSet('i2_favorites', AppState.favorites);
  renderFavorites();
}

function renderFavorites() {
  const grid   = document.getElementById('favoritesGrid');
  const empty  = document.getElementById('favoritesEmpty');
  grid.innerHTML = '';

  const favTowers = TOWERS.filter(t => AppState.favorites.includes(t.id));
  empty.style.display = favTowers.length === 0 ? 'block' : 'none';

  favTowers.forEach(t => {
    const scored = AppState.lastResults?.find(r => r.id === t.id) || { ...t, score: 50, reasons: t.pros };
    grid.appendChild(buildTowerCard(scored, '★'));
  });
}

function saveToHistory() {
  const entry = {
    date:  new Date().toLocaleDateString('es-MX', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
    mode:  AppState.mode,
    phase: AppState.phase,
    boss:  AppState.boss,
    map:   AppState.mapName || 'Sin nombre',
    top3:  AppState.lastResults?.slice(0, 3).map(t => t.name).join(', ') || ''
  };
  AppState.history.unshift(entry);
  if (AppState.history.length > 20) AppState.history.pop();
  lsSet('i2_history', AppState.history);
  renderHistory();
}

function renderHistory() {
  const list  = document.getElementById('historyList');
  const empty = document.getElementById('historyEmpty');
  list.innerHTML = '';

  if (AppState.history.length === 0) {
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';

  AppState.history.forEach(entry => {
    const item = document.createElement('div');
    item.className = 'history-item';
    item.innerHTML = `
      <span class="history-date">${entry.date}</span>
      <span class="history-info">
        <strong>${entry.map}</strong> — Fase <strong>${entry.phase}</strong> | Boss: ${entry.boss === 'yes' ? 'Sí' : 'No'}
        <br><small>Top 3: ${entry.top3}</small>
      </span>
      <span class="history-tag ${entry.mode === 'endless' ? 'tag-endless' : 'tag-normal'}">${entry.mode}</span>
    `;
    list.appendChild(item);
  });
}

function initSearch() {
  const input = document.getElementById('towerSearch');
  const results = document.getElementById('searchResults');

  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    results.innerHTML = '';
    if (!q) return;

    const matches = TOWERS.filter(t =>
      t.name.toLowerCase().includes(q) ||
      t.type.toLowerCase().includes(q)
    );

    if (matches.length === 0) {
      results.innerHTML = '<p style="color:var(--text-2);font-size:.85rem;padding:.5rem">Sin resultados.</p>';
      return;
    }

    matches.forEach(t => {
      const scored = AppState.lastResults?.find(r => r.id === t.id) || { ...t, score: '—' };
      const item = document.createElement('div');
      item.className = 'search-result-item';
      item.innerHTML = `
        <span style="font-size:1.6rem">${t.icon}</span>
        <div style="flex:1">
          <strong>${t.name}</strong>
          <span style="font-size:.75rem;color:var(--text-2);margin-left:.5rem">${t.type}</span>
          <br><small style="color:var(--text-2)">$${t.cost} · DPS ${t.dps} · Rango ${t.range}</small>
        </div>
        <span style="font-size:.85rem;font-weight:700;color:var(--blue-light)">${scored.score}/100</span>
      `;
      results.appendChild(item);
    });
  });
}

function exportJson() {
  if (!AppState.lastResults) { showToast('Primero analiza una partida.'); return; }
  const data = {
    fecha: new Date().toISOString(),
    configuracion: {
      modo: AppState.mode, fase: AppState.phase,
      boss: AppState.boss, voladores: AppState.flying,
      mapa: AppState.mapName, dinero: AppState.startMoney,
      research: AppState.researchLevel
    },
    top10: AppState.lastResults.slice(0, 10).map(t => ({
      nombre: t.name, puntuacion: t.score, motivos: t.reasons
    }))
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const a    = document.createElement('a');
  a.href     = URL.createObjectURL(blob);
  a.download = `infinitode2-analysis-${Date.now()}.json`;
  a.click();
  showToast('📥 JSON exportado');
}

function exportPdf() {
  window.print();
}

function initEnemyGrid() {
  const grid = document.getElementById('enemyGrid');
  grid.innerHTML = '';

  ENEMIES.forEach(enemy => {
    AppState.enemySelections[enemy.id] = { selected: false, qty: '1' };

    const card = document.createElement('div');
    card.className = 'enemy-card';
    card.dataset.id = enemy.id;

    card.innerHTML = `
      <div class="enemy-header">
        <div class="enemy-icon">${enemy.icon}</div>
        <div class="enemy-info">
          <div class="enemy-name">${enemy.name}</div>
          <div class="enemy-type">${enemy.type}${enemy.flying ? ' · Volador' : ''}${enemy.armor > 0 ? ` · Armadura ${enemy.armor}` : ''}</div>
        </div>
      </div>
      <div class="enemy-checkbox-wrap">
        <input type="checkbox" class="enemy-checkbox" id="chk_${enemy.id}" />
        <label for="chk_${enemy.id}">Aparece</label>
      </div>
      <div class="enemy-qty">
        <span class="qty-label">Cantidad:</span>
        <select class="qty-select" id="qty_${enemy.id}">
          ${['1','2','3','4','5','6','7','8','9','10+'].map(v =>
            `<option value="${v}">${v}</option>`
          ).join('')}
        </select>
      </div>
    `;

    const chk = card.querySelector('.enemy-checkbox');
    chk.addEventListener('change', () => {
      AppState.enemySelections[enemy.id].selected = chk.checked;
      card.classList.toggle('selected', chk.checked);
    });

    const qty = card.querySelector('.qty-select');
    qty.addEventListener('change', () => {
      AppState.enemySelections[enemy.id].qty = qty.value;
    });

    card.addEventListener('click', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'LABEL' || e.target.tagName === 'OPTION') return;
      chk.checked = !chk.checked;
      chk.dispatchEvent(new Event('change'));
    });

    grid.appendChild(card);
  });
}

function initWeightsGrid() {
  const grid = document.getElementById('weightsGrid');
  grid.innerHTML = '';

  WEIGHT_DEFINITIONS.forEach(wd => {
    AppState.weights[wd.id] = wd.default;

    const item = document.createElement('div');
    item.className = 'weight-item';
    item.innerHTML = `
      <div class="weight-label">
        <span>${wd.label}</span>
        <span class="weight-val" id="wv_${wd.id}">${wd.default}</span>
      </div>
      <input type="range" min="1" max="10" value="${wd.default}" class="slider" id="ws_${wd.id}" />
    `;

    const slider = item.querySelector('input');
    const valEl  = item.querySelector('.weight-val');
    slider.addEventListener('input', () => {
      const v = parseInt(slider.value);
      AppState.weights[wd.id] = v;
      valEl.textContent = v;
    });

    grid.appendChild(item);
  });
}

function initToggleGroups() {
  document.querySelectorAll('.toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const group = btn.dataset.group;
      const value = btn.dataset.value;

      document.querySelectorAll(`.toggle-btn[data-group="${group}"]`).forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      if (group === 'mode')   AppState.mode  = value;
      if (group === 'phase')  AppState.phase = value;
      if (group === 'boss')   AppState.boss  = value;
      if (group === 'flying') AppState.flying = value;
    });
  });
}

function navigateTo(sectionId) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

  const sectionEl = document.getElementById(`section-${sectionId}`);
  const navBtn    = document.querySelector(`.nav-btn[data-section="${sectionId}"]`);

  if (sectionEl) sectionEl.classList.add('active');
  if (navBtn)    navBtn.classList.add('active');

  document.querySelector('.top-nav')?.classList.remove('open');

  if (sectionId === 'stats')     renderStats(AppState.currentStatTab);
  if (sectionId === 'favorites') renderFavorites();
  if (sectionId === 'history')   renderHistory();
  if (sectionId === 'compare')   populateCompareSelects();
}

function init() {
  AppState.favorites = lsGet('i2_favorites', []);
  AppState.history   = lsGet('i2_history', []);

  initEnemyGrid();
  initWeightsGrid();
  initToggleGroups();
  populateCompareSelects();
  initSearch();

  const resSlider = document.getElementById('researchLevel');
  const resVal    = document.getElementById('researchValue');
  resSlider.addEventListener('input', () => {
    resVal.textContent = `${resSlider.value}%`;
    AppState.researchLevel = parseInt(resSlider.value);
  });

  document.getElementById('analyzeBtn').addEventListener('click', analyzeGame);

  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => navigateTo(btn.dataset.section));
  });

  document.getElementById('menuToggle').addEventListener('click', () => {
    document.querySelector('.top-nav').classList.toggle('open');
  });

  document.getElementById('compareBtn').addEventListener('click', renderCompare);

  document.querySelectorAll('.stat-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.stat-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      AppState.currentStatTab = tab.dataset.stat;
      renderStats(AppState.currentStatTab);
    });
  });

  document.getElementById('exportJson').addEventListener('click', exportJson);
  document.getElementById('exportPdf').addEventListener('click', exportPdf);

  document.getElementById('clearHistory').addEventListener('click', () => {
    AppState.history = [];
    lsSet('i2_history', []);
    renderHistory();
    showToast('Historial borrado');
  });

  navigateTo('setup');

  console.log('🎮 Infinitode 2 Battle Assistant iniciado.');
  console.log(`📊 ${TOWERS.length} torres · ${ENEMIES.length} enemigos · ${SYNERGY_RULES.length} sinergias cargadas.`);
}

document.addEventListener('DOMContentLoaded', init);