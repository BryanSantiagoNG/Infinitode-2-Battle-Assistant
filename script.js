/**
 * ═══════════════════════════════════════════════════════════════════
 * INFINITODE 2 — BATTLE ASSISTANT
 * script.js — Datos extraídos de la wiki oficial:
 *   https://infinitode-2.fandom.com/wiki/Infinitode_2_Wiki
 * ═══════════════════════════════════════════════════════════════════
 */

'use strict';

/* ─────────────────────────────────────────────────────────────────
   TABLA DE EFECTIVIDAD (Damage Dealt = Tower Damage × Effectiveness)
   Fuente: https://infinitode-2.fandom.com/wiki/Towers
   0 = inmune, 10 = 10%, 25 = 25%, 50 = 50%, 75 = 75%,
   100 = 100%, 150 = 150%
   Columnas: Regular, Fast, Strong, Heli, Jet, Armored, Healer,
             Toxic, Icy, Fighter, Light, Boss
   ───────────────────────────────────────────────────────────────── */
const EFFECTIVENESS = {
  //         Reg  Fast Str  Heli Jet  Arm  Heal Tox  Icy  Fgt  Lgt  Boss
  basic:    [150, 100,  50,   0,   0,  25,  25, 150,  50,  25, 100, 100],
  sniper:   [100,  25, 150,   0,   0, 100, 100,  50,  25, 150,  25, 100],
  cannon:   [100, 150,  25,   0,   0,  50, 100, 100, 150,  50,  50, 100],
  freezing: [100, 100, 100, 100,   0,  50, 100, 100,  50, 100, 100, 100], // slow, no dmg
  antiair:  [  0,   0,   0, 150, 100,   0,   0,   0,   0,   0,   0, 100], // only air
  splash:   [ 10, 100,  50,  50,  50,  25,  50, 150, 150, 150, 100, 100],
  blast:    [100,  50,  25,   0,   0, 150,  50,  25,  25,  50,  25, 100],
  multishot:[100, 150,   0, 100,  50,  25,  25, 100, 100,  50, 150, 100],
  minigun:  [100,  50,  50, 100,  50, 150, 150,  50,  25,   0,  25, 100],
  venom:    [150, 150, 100,   0,   0, 150, 100,   0,  50,  50, 100, 100],
  tesla:    [100,  25, 150,  50, 150,   0, 100, 100,  25,   0,  50, 100],
  missile:  [ 50,   0, 150, 150,  50,  50, 100,  50, 150,  50, 150, 100],
  flamethrower:[75,100, 50,   0,   0,  25,   0, 150, 150, 150, 100, 100],
  laser:    [100, 100, 100, 100, 150, 100, 150,  50,   0, 100,  25, 100],
  gauss:    [100,  25, 100,   0,   0, 150,  50,  50, 100, 150, 100,  50],
  crusher:  [150, 100,  50,   0,   0,  50, 100, 150,  50,  50, 150, 100]
};

// Índices para EFFECTIVENESS array
const EFF_IDX = {
  regular:0, fast:1, strong:2, heli:3, jet:4, armored:5,
  healer:6, toxic:7, icy:8, fighter:9, light:10, boss:11
};

/* ─────────────────────────────────────────────────────────────────
   BASE DE DATOS: TORRES
   Fuente: https://infinitode-2.fandom.com/wiki/Towers
           y páginas individuales de cada torre en la wiki
   ───────────────────────────────────────────────────────────────── */
const TOWERS = [
  {
    id: 'basic',
    name: 'Basic',
    icon: '🔵',
    color: '#00897B',
    type: 'Disparo único',
    cost: 27,
    attackType: 'single',    // single | aoe | cone | beam | grab | special
    canHitAir: false,
    isSupport: false,
    isSlow: false,
    isStun: false,
    isPoison: false,
    isBurn: false,
    needsManualAim: false,
    // Atributos relativos (0-100) para comparativas y gráficos
    stats: { dps: 30, cost: 96, range: 40, scaling: 35, utility: 30, versatility: 50 },
    endlessRating: 4,
    bossRating: 6,
    bestPhase: ['early', 'mid'],
    pros: [
      'Precio ínfimo (27 monedas)',
      '150% daño vs Regular',
      'Buen ratio daño/costo en early',
      'Ultimate clona torres adyacentes'
    ],
    cons: [
      'No golpea aéreos (Heli, Jet)',
      'Solo 25% vs Armored y Fighter',
      'Escala mal en late/Endless sin research'
    ],
    abilities: [
      'Ricochet — el proyectil rebota a otro enemigo cercano',
      'Splash bullets — proyectiles explotan al impactar',
      'Valuable experience — reembolso al vender + comparte PWR',
      'Ultimate (lv10) — clona torre cercana en plataforma vacía'
    ],
    synergies: ['blast', 'crusher', 'freezing'],
    researchNotes: 'Research de Damage y Attack Speed muy impactante. Projectile speed tiene tope de 16.',
    specialNotes: 'Tras parche 1.9.0: +500% daño base, +16% atk speed. Ultimate puede clonar Crushers baratos.'
  },
  {
    id: 'sniper',
    name: 'Sniper',
    icon: '🎯',
    color: '#43A047',
    type: 'Alto daño / largo alcance',
    cost: 200,
    attackType: 'single',
    canHitAir: false,
    isSupport: false,
    isSlow: false,
    isStun: false,
    isPoison: false,
    isBurn: false,
    needsManualAim: false,
    stats: { dps: 45, cost: 55, range: 95, scaling: 60, utility: 45, versatility: 55 },
    endlessRating: 6,
    bossRating: 8,
    bestPhase: ['mid', 'late'],
    pros: [
      'Mayor rango del juego',
      '150% vs Strong y Fighter',
      'Golpe crítico + multiplicador crit',
      'Killshot: elimina enemigo con <24% HP',
      '+45% daño a distancia máxima'
    ],
    cons: [
      'No golpea Heli, Jet ni aéreos',
      'Solo 25% vs Fast, Icy, Light',
      'Necesita tiempo de apuntado (1 s)',
      'Ineficiente vs grupos densos'
    ],
    abilities: [
      'Penetrating Bullets — bala perfora 2 enemigos (2do recibe 65%)',
      'Killshot — mata al instante enemigos con <24% HP',
      'Heavy Weapons — +range, +daño a distancia máxima',
      'Ultimate (lv10) — explosión de bala crítica en radio 2 tiles'
    ],
    synergies: ['freezing', 'blast', 'crusher', 'minigun'],
    researchNotes: 'Crit chance + Crit multiplier únicos muy poderosos. Power platform > Range platform en late.',
    specialNotes: 'Hitscan (sin velocidad de proyectil). Potencia con Crit 100% + research máximo es devastadora vs Boss.'
  },
  {
    id: 'cannon',
    name: 'Cannon',
    icon: '💥',
    color: '#E53935',
    type: 'AoE / Explosivo',
    cost: 100,
    attackType: 'aoe',
    canHitAir: false,
    isSupport: false,
    isSlow: false,
    isStun: false,
    isPoison: false,
    isBurn: false,
    needsManualAim: false,
    stats: { dps: 55, cost: 70, range: 35, scaling: 50, utility: 55, versatility: 65 },
    endlessRating: 6,
    bossRating: 7,
    bestPhase: ['early', 'mid'],
    pros: [
      '150% vs Fast',
      'AoE nativo (explosión)',
      'Mental Pressure: +daño a enemigos con HP baja',
      'Buen precio para su poder'
    ],
    cons: [
      'No golpea aéreos',
      '25% vs Strong; 0% vs Multishot (Strong inmune)',
      'Rango corto por defecto',
      'Decae en late game'
    ],
    abilities: [
      'Long Barrel — aumenta rango significativamente',
      'Shrapnel — fragmentos alcanzan enemigos fuera del radio',
      'Mental Pressure — +daño cuando el enemigo tiene HP baja',
      'Ultimate (lv10) — coloca minas en el camino'
    ],
    synergies: ['freezing', 'blast', 'multishot'],
    researchNotes: 'Explosion range research muy valioso. Long Barrel habilidad obligatoria.',
    specialNotes: 'Los shrapnel hacen daño completo a Light (inmune a explosiones normales). Minas del Ultimate empujan hacia atrás.'
  },
  {
    id: 'freezing',
    name: 'Freezing',
    icon: '❄️',
    color: '#1E88E5',
    type: 'Control / Lentificador',
    cost: 80,
    attackType: 'special',   // aura de ralentización
    canHitAir: true,         // enlentece a Heli (pero no Jet)
    isSupport: true,
    isSlow: true,
    isStun: false,
    isPoison: false,
    isBurn: false,
    needsManualAim: false,
    stats: { dps: 5, cost: 82, range: 38, scaling: 92, utility: 98, versatility: 90 },
    endlessRating: 10,
    bossRating: 7,
    bestPhase: ['early', 'mid', 'late'],
    pros: [
      'Ralentiza hasta 65% (máx stacks)',
      'Prolonga veneno de Venom',
      'Alarga cadenas de Tesla',
      'Agrupa enemigos para AoE',
      'Barata y esencial toda la partida',
      'Inmune a Jet: ojo (no ralentiza Jets)'
    ],
    cons: [
      'No hace daño directo',
      'Jet es inmune a su ralentización',
      'Icy con escudo es inmune a CC',
      'Minigun + Flamethrower anulan su slow'
    ],
    abilities: [
      'Counter-attack — +daño a enemigos lentos (sinergia Splash)',
      'Snowball — detención completa individual',
      'Poison Prolongation — extiende duración de veneno',
      'Ultimate (lv10) — Blizzard: detiene todos en el mapa brevemente'
    ],
    synergies: ['venom', 'tesla', 'splash', 'blast', 'sniper', 'laser'],
    researchNotes: 'Slow Rate y Freezing Speed son los más importantes. Poison Prolongation con Venom = sinergia clave.',
    specialNotes: 'Varias Freezing se apilan en velocidad de efecto pero el máximo de ralentización es 65%. XP por ralentizar enemigos.'
  },
  {
    id: 'antiair',
    name: 'Antiair',
    icon: '✈️',
    color: '#00ACC1',
    type: 'Anti-aéreo especializado',
    cost: 100,
    attackType: 'single',
    canHitAir: true,
    isSupport: false,
    isSlow: false,
    isStun: false,
    isPoison: false,
    isBurn: true,          // aplica burning
    needsManualAim: false,
    stats: { dps: 40, cost: 70, range: 65, scaling: 40, utility: 35, versatility: 25 },
    endlessRating: 5,
    bossRating: 6,
    bestPhase: ['early', 'mid', 'late'],
    pros: [
      '150% vs Heli, 100% vs Jet',
      'Aplica burning (fuego)',
      'Buen rango para aéreos',
      'Habilidad de explosión al derribar',
      'Único torre exclusivamente anti-aérea'
    ],
    cons: [
      '0% contra TODOS los enemigos terrestres',
      'Completamente inútil sin Heli/Jet',
      'No escala en Endless si no hay aéreos'
    ],
    abilities: [
      'Fire rate — aumenta cadencia de ataque',
      'Explosion on kill — explota al derribar, daño masivo cercano',
      'Targeting — sistema de puntería mejorado',
      'Ultimate (lv10) — cambia modo: ataca terrestres también'
    ],
    synergies: ['freezing', 'tesla', 'missile'],
    researchNotes: 'Sin research dedicado Endless. Útil solo con voladores presentes.',
    specialNotes: 'El burning que aplica reduce el efecto de Freezing en 33%. Heli y Jet se mueven 40% más lento mientras arden.'
  },
  {
    id: 'splash',
    name: 'Splash',
    icon: '💫',
    color: '#F4511E',
    type: 'Multi-proyectil omnidireccional',
    cost: 120,
    attackType: 'aoe',
    canHitAir: true,       // única torre que golpea tierra Y aire igual
    isSupport: false,
    isSlow: false,
    isStun: false,
    isPoison: false,
    isBurn: false,
    needsManualAim: false,
    stats: { dps: 50, cost: 62, range: 45, scaling: 55, utility: 60, versatility: 75 },
    endlessRating: 7,
    bossRating: 7,
    bestPhase: ['mid', 'late'],
    pros: [
      'Única torre que golpea tierra y aire con misma efectividad',
      '150% vs Toxic, Icy, Fighter',
      'No necesita apuntar (dispara en todas direcciones)',
      'Buena con Freezing (Rifled Barrels)',
      'Excelente vs Boss con Magnet ability'
    ],
    cons: [
      'Solo 10% vs Regular (muy malo)',
      '25% vs Armored',
      'Fast y Jet pueden pasar sin ser golpeados (velocidad)',
      'Proyectiles no buscan objetivos'
    ],
    abilities: [
      'Penetrating Bullets — proyectiles penetran más enemigos',
      'Fast Mechanism — más velocidad de ataque',
      'Rifled Barrels — +daño a enemigos lentos/detenidos',
      'Ultimate (lv10) — reacción en cadena: probabilidad de generar más proyectiles'
    ],
    synergies: ['freezing', 'blast', 'crusher', 'gauss'],
    researchNotes: 'Projectile speed también aumenta Damage (único con Multishot). Colocar cerca de portales o usar con Freezing.',
    specialNotes: 'No tiene Rotation Speed — dispara instantáneamente en 360°. Los proyectiles del Ultimate pueden encadenarse 3 veces.'
  },
  {
    id: 'blast',
    name: 'Blast',
    icon: '💢',
    color: '#546E7A',
    type: 'AoE / Stun / Empuje',
    cost: 150,
    attackType: 'aoe',
    canHitAir: false,
    isSupport: true,
    isSlow: false,
    isStun: true,
    isPoison: false,
    isBurn: false,
    needsManualAim: false,
    stats: { dps: 30, cost: 48, range: 48, scaling: 65, utility: 80, versatility: 60 },
    endlessRating: 8,
    bossRating: 6,
    bestPhase: ['mid', 'late'],
    pros: [
      '150% vs Armored',
      'Stun (detención completa) hasta 75% probabilidad',
      'Empuje hacia portales (más tiempo de DPS)',
      'Quake garantizado cada ciertos ataques',
      'Excelente sinergia con Freezing y Splash'
    ],
    cons: [
      'No golpea aéreos',
      '25% vs Strong, Toxic, Icy, Light',
      'Quake deshabilita torres en radio 1 tile',
      'Stun pierde efecto tras 4 stuns en mismo enemigo'
    ],
    abilities: [
      'Sonic Wave — aumenta alcance del stun',
      'Stopping Force — empuja enemigos hacia el inicio del mapa',
      'Fast Bullets — mayor velocidad de cadencia',
      'Ultimate (lv10) — onda expansiva masiva que empuja a todos'
    ],
    synergies: ['freezing', 'splash', 'sniper', 'minigun', 'crusher'],
    researchNotes: 'Attack speed, Range o Power tiles son ideales. Stun Chance y Stun Duration como research propio.',
    specialNotes: 'La mecánica Quake (nueva en 1.9) garantiza un stun total cada carga llena. El Throwback solo puede aplicarse 3 veces por enemigo.'
  },
  {
    id: 'multishot',
    name: 'Multishot',
    icon: '🔱',
    color: '#FDD835',
    type: 'Multi-proyectil en arco',
    cost: 150,
    attackType: 'aoe',
    canHitAir: true,       // proyectiles no buscan pero pueden impactar aire
    isSupport: false,
    isSlow: false,
    isStun: false,
    isPoison: false,
    isBurn: false,
    needsManualAim: false,
    stats: { dps: 60, cost: 48, range: 58, scaling: 55, utility: 55, versatility: 72 },
    endlessRating: 6,
    bossRating: 5,
    bestPhase: ['early', 'mid'],
    pros: [
      '150% vs Fast, Light',
      '100% vs Heli, Icy',
      'Arco de 5+ proyectiles por disparo',
      'Bonus coins debuff (farm de monedas)',
      'Buen rango para AoE'
    ],
    cons: [
      '0% vs Strong (completamente inútil)',
      '25% vs Armored',
      'No busca objetivos (proyectiles rectos)',
      'Decae en late Endless'
    ],
    abilities: [
      'Counter-attack — disparo trasero con +daño',
      'Buckshot — aplica Bonus Coins a enemigos impactados',
      'Shooting Angle — ángulo del arco aumenta o disminuye',
      'Ultimate (lv10) — 5to habilidad especial de rebote trasero extremo'
    ],
    synergies: ['freezing', 'blast', 'cannon'],
    researchNotes: 'Projectile count y Shooting angle son stats únicos. Projectile speed también +Damage.',
    specialNotes: 'Ideal cerca de portales (enemigos en fila). Antes del 1.9 podía atacar aire con ability. Ahora solo Buckshot/Laser dan Bonus Coins.'
  },
  {
    id: 'minigun',
    name: 'Minigun',
    icon: '🟣',
    color: '#8E24AA',
    type: 'DPS ultra cadencia / único objetivo',
    cost: 200,
    attackType: 'single',
    canHitAir: true,       // puede golpear Heli/Jet (50% efectividad)
    isSupport: false,
    isSlow: false,
    isStun: false,
    isPoison: false,
    isBurn: true,          // Hot Bullets aplica burning (sin Foundation)
    needsManualAim: false,
    stats: { dps: 85, cost: 55, range: 42, scaling: 70, utility: 50, versatility: 65 },
    endlessRating: 8,
    bossRating: 9,
    bestPhase: ['mid', 'late'],
    pros: [
      'Mayor DPS de objetivo único del juego',
      '150% vs Armored y Healer',
      '100% vs Heli, Healer, Armored',
      'Escala enormemente con XP levels',
      'Foundation + Freezing: combo poison sin perder slow',
      'Microgun del Ultimate en caminos'
    ],
    cons: [
      '0% vs Fighter',
      '50% vs Fast, Strong, Heli; 25% vs Icy, Light',
      'Recarga de 6 segundos al agotar munición',
      'Velocidad de rotación baja (difícil vs Fast sin research)',
      'Hot Bullets sin Foundation cancela el slow del Freezing'
    ],
    abilities: [
      'Foundation — reemplaza Hot Bullets por Poison (compatible con Freezing)',
      'Heavy Bullets — más daño por bala',
      'Fast Reload — recarga más rápida del magazine',
      'Ultimate (lv10) — Microguns en plataformas/caminos cercanos'
    ],
    synergies: ['freezing', 'blast', 'crusher', 'sniper'],
    researchNotes: 'Acceleration y Magazine Size stats únicos. Rotation Speed crítico para seguir enemigos rápidos.',
    specialNotes: 'Hitscan. La aceleración sube cada segundo disparando. Los Microguns no tienen magazine y disparan indefinidamente.'
  },
  {
    id: 'venom',
    name: 'Venom',
    icon: '☠️',
    color: '#7CB342',
    type: 'DoT / Veneno',
    cost: 100,
    attackType: 'single',
    canHitAir: false,
    isSupport: false,
    isSlow: true,          // poison stack ralentiza Fast 3% por stack
    isStun: false,
    isPoison: true,
    isBurn: false,
    needsManualAim: false,
    stats: { dps: 55, cost: 70, range: 40, scaling: 65, utility: 65, versatility: 58 },
    endlessRating: 7,
    bossRating: 6,
    bestPhase: ['early', 'mid', 'late'],
    pros: [
      '150% vs Regular, Fast, Armored',
      'DoT stack (múltiples Venom apilan)',
      'Lentifica Fast 3% por cada stack de veneno',
      'Sinergia potente con Freezing (prolonga veneno)',
      'Prioriza enemigos sin veneno automáticamente'
    ],
    cons: [
      '0% vs Heli, Jet (no los puede atacar)',
      '0% vs Toxic (inmune a veneno)',
      '50% vs Fighter, Icy',
      'Proyectiles muy lentos: miss vs Fast sin Freezing',
      'DPS reducido si enemigo llega a la base antes'
    ],
    abilities: [
      'Potent Poison — apila hasta 3 venenos en mismo enemigo',
      'Smoke Bomb — AoE de veneno en zona',
      'Extra Damage — +daño directo al impacto',
      'Ultimate (lv10) — Acid Rain: veneno global en todos los enemigos'
    ],
    synergies: ['freezing', 'tesla', 'flamethrower', 'blast'],
    researchNotes: 'Poison Duration y Poison Damage como research exclusivo. Con Freezing: duración multiplicada.',
    specialNotes: 'Cada stack adicional aplica 75% del DPS del anterior. Immune a Toxic. Flamethrower cubre las debilidades de Venom.'
  },
  {
    id: 'tesla',
    name: 'Tesla',
    icon: '⚡',
    color: '#3949AB',
    type: 'Cadena eléctrica / AoE',
    cost: 250,
    attackType: 'aoe',
    canHitAir: true,       // 50% vs Heli, 150% vs Jet
    isSupport: false,
    isSlow: false,
    isStun: false,
    isPoison: false,
    isBurn: false,
    needsManualAim: false,
    stats: { dps: 75, cost: 40, range: 52, scaling: 80, utility: 70, versatility: 82 },
    endlessRating: 9,
    bossRating: 7,
    bestPhase: ['mid', 'late'],
    pros: [
      '150% vs Strong y Jet',
      'Cadena a 1.5 tiles de alcance entre enemigos',
      'Lightning Balls si no hay enemigos cercanos',
      'Freezing prolonga las cadenas',
      '50% vs Heli, anti-aéreo secundario'
    ],
    cons: [
      '0% vs Armored y Fighter',
      '25% vs Fast',
      'Daño reducido por cada salto de cadena',
      'Caro (250 monedas)',
      'Inútil si enemigos están muy separados'
    ],
    abilities: [
      'Chain Lightning — aumenta saltos de cadena',
      'Overload — área de stun sin cadena',
      'Lightning Balls — bolas hacia portales si no hay objetivo cerca',
      'Ultimate (lv10) — descarga masiva en toda el área'
    ],
    synergies: ['freezing', 'venom', 'blast'],
    researchNotes: 'Chain damage % y chain jumps son stats únicos. Freezing agrupa enemigos para cadenas más largas.',
    specialNotes: 'El % de daño por salto es stat único de XP. Freezing extiende la duración de la cadena activa. Jet es la debilidad clave.'
  },
  {
    id: 'missile',
    name: 'Missile',
    icon: '🚀',
    color: '#BB1753',
    type: 'Misiles de largo alcance / LRM',
    cost: 250,
    attackType: 'aoe',
    canHitAir: true,       // 150% vs Heli
    isSupport: false,
    isSlow: false,
    isStun: false,
    isPoison: false,
    isBurn: false,
    needsManualAim: false,
    stats: { dps: 50, cost: 40, range: 85, scaling: 65, utility: 60, versatility: 65 },
    endlessRating: 7,
    bossRating: 8,
    bestPhase: ['mid', 'late'],
    pros: [
      '150% vs Strong y Heli',
      'LRM: ataca objetivos fuera de rango',
      'Proyectiles buscan nuevo enemigo si el objetivo muere',
      '+daño a enemigos con HP alta (ability)',
      'AoE en explosión'
    ],
    cons: [
      '0% vs Fast (completamente inmune)',
      '50% vs Armored, Toxic, Icy, Fighter',
      'Baja cadencia de ataque',
    