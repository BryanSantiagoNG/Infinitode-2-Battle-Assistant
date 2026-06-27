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
      'Caro (250 monedas)',
      'LRM no funciona en radio de 1 tile alrededor'
    ],
    abilities: [
      'Compact Missiles — dispara 3 misiles simultáneos',
      'Anti-air System — LRM +100% daño; +daño vs Jet',
      'Vertical Launch — LRM activo con enemigos en rango',
      'Ultimate (lv10) — Outweighed Shells: +daño vs HP alta'
    ],
    synergies: ['freezing', 'antiair', 'tesla'],
    researchNotes: 'LRM Aiming Speed stat exclusivo. Anti-air System muy valioso con Heli/Jet.',
    specialNotes: 'LRM dispara al azar fuera de rango. Compact Missiles puede ser más DPS que misil único si todos impactan.'
  },
  {
    id: 'flamethrower',
    name: 'Flamethrower',
    icon: '🔥',
    color: '#FB8C00',
    type: 'Cono de fuego / DoT burn',
    cost: 200,
    attackType: 'cone',
    canHitAir: false,
    isSupport: false,
    isSlow: false,          // Cold Fire ability convierte en slow
    isStun: false,
    isPoison: false,
    isBurn: true,
    needsManualAim: false,
    stats: { dps: 65, cost: 55, range: 30, scaling: 58, utility: 62, versatility: 60 },
    endlessRating: 7,
    bossRating: 5,
    bestPhase: ['mid', 'late'],
    pros: [
      '150% vs Toxic, Icy, Fighter',
      'Burning previene regeneración de Toxic',
      'AoE de cono constante sin apuntado',
      'Cold Fire: convierte en tower slow compatible con Freezing',
      'Varias Flamethrower se potencian juntas'
    ],
    cons: [
      '0% vs Heli, Jet (no puede atacar aéreos)',
      '0% vs Healer (inmune a fuego)',
      '25% vs Armored',
      'Alcance muy corto',
      'Burning anula 33% del slow de Freezing (sin Cold Fire)'
    ],
    abilities: [
      'Plasma Ignition — +40% daño del cono directo',
      'Napalm — +40% duración del burning',
      'Cold Fire — cambia burning por slow (25%), compatible con Freezing',
      'Ultimate (lv10) — Firestorm: cobre toda el área de llamas global'
    ],
    synergies: ['venom', 'freezing', 'splash', 'blast'],
    researchNotes: 'Ignite Duration stat exclusivo. Range aumenta el tamaño del cono. Direct Damage stat nuevo en 1.9.',
    specialNotes: 'Direct damage = 185% del daño base. Si un enemigo muere por burning, la Flamethrower obtiene el kill. Burning stack con Venom.'
  },
  {
    id: 'laser',
    name: 'Laser',
    icon: '🔴',
    color: '#039BE5',
    type: 'Haz continuo / Alta penetración',
    cost: 300,
    attackType: 'beam',
    canHitAir: true,       // 100% vs Heli, 150% vs Jet
    isSupport: false,
    isSlow: false,
    isStun: false,
    isPoison: false,
    isBurn: false,
    needsManualAim: false,
    stats: { dps: 88, cost: 35, range: 100, scaling: 78, utility: 65, versatility: 70 },
    endlessRating: 9,
    bossRating: 8,
    bestPhase: ['mid', 'late'],
    pros: [
      '150% vs Healer y Jet',
      '100% vs Heli: buen anti-aéreo secundario',
      'Haz cruza el mapa entero (alcance 99)',
      'Daño continuo mientras carga',
      'Ionization: Bonus Coins debuff',
      'Battery Capacity: duración del rayo'
    ],
    cons: [
      '0% vs Icy (completamente inmune)',
      '25% vs Light',
      'Requiere carga antes de disparar',
      'El más caro (300 monedas)',
      'Solo golpea al primer enemigo en la línea'
    ],
    abilities: [
      'Battery Upgrade — mayor duración de disparo',
      'Overcharge — +daño al inicio del haz',
      'Ionization — aplica Bonus Coins a enemigos golpeados',
      'Ultimate (lv10) — Photon Burst: daño en área masivo breve'
    ],
    synergies: ['freezing', 'blast', 'crusher'],
    researchNotes: 'Charge Rate y Battery Capacity stats únicos. Freezing + Laser: máximo DPS en objetivo detenido.',
    specialNotes: 'No tiene Attack Speed ni Projectile Speed: usa Charge Rate. Resource Consumption por disparo. Mejor DPS base del juego en objetivo único detenido.'
  },
  {
    id: 'gauss',
    name: 'Gauss',
    icon: '🟠',
    color: '#FF8F00',
    type: 'Disparo manual / Penetración total',
    cost: 300,
    attackType: 'single',
    canHitAir: false,
    isSupport: false,
    isSlow: false,
    isStun: true,          // Overload ability stun
    isPoison: false,
    isBurn: false,
    needsManualAim: true,  // ÚNICO que requiere puntería manual
    stats: { dps: 70, cost: 35, range: 90, scaling: 85, utility: 70, versatility: 50 },
    endlessRating: 8,
    bossRating: 6,         // solo 50% vs Boss
    bestPhase: ['mid', 'late'],
    pros: [
      '150% vs Armored y Fighter',
      '100% vs Icy (única con Multishot al 100%)',
      'Penetra TODOS los enemigos en línea',
      'Consume recursos de miners adyacentes',
      'Stun con Overload ability'
    ],
    cons: [
      '0% vs Heli y Jet (no golpea aéreos)',
      '50% vs Boss (peor que la mayoría)',
      'Requiere puntería MANUAL (jugador apunta)',
      'Muy caro (300 monedas)',
      'Necesita miners cercanos para funcionar',
      'No escala bien en Endless (resource consumption sube)'
    ],
    abilities: [
      'Nanoparticles — daño masivo a enemigos con >15% HP (×1.7)',
      'Superconductors — consume 30% menos recursos, carga +29% más rápido',
      'Overload — stun incluso en enemigos no alcanzados por el proyectil',
      'Self Improvement — consume XP propia para ganar PWR'
    ],
    synergies: ['splash', 'blast', 'freezing'],
    researchNotes: 'Resource Consumption y Charge Rate stats únicos. Research Damage sube también el consumo a partir de lv10 Endless.',
    specialNotes: 'Única torre de apuntado manual. Necesita miners para acumular recursos. Colócala estratégicamente para cubrir la mayor cantidad de camino.'
  },
  {
    id: 'crusher',
    name: 'Crusher',
    icon: '⚙️',
    color: '#6D4C41',
    type: 'Agarre / DPS en detenido',
    cost: 350,
    attackType: 'grab',
    canHitAir: false,
    isSupport: true,       // da bonus XP a otras torres
    isSlow: true,          // detiene al enemigo (grab)
    isStun: false,
    isPoison: false,
    isBurn: false,
    needsManualAim: false,
    stats: { dps: 55, cost: 30, range: 35, scaling: 75, utility: 85, versatility: 60 },
    endlessRating: 8,
    bossRating: 7,
    bestPhase: ['mid', 'late'],
    pros: [
      '150% vs Regular, Toxic, Light',
      'Agarra enemigos fuera del camino (detenidos)',
      'Bonus XP a torres que golpeen al enemigo agarrado',
      'Shared Damage: daño compartido entre agarrados',
      'Excelente sinergia con Splash, Sniper, Minigun'
    ],
    cons: [
      '0% vs Heli y Jet (no puede agarrar aéreos)',
      '50% vs Strong, Fighter; 25% vs Armored',
      'El más caro (350 base, sube con cada Crusher)',
      'Precio escala con número de Crushers (×(1+n^1.6))',
      'Enemigos rápidos pueden escapar del agarre'
    ],
    abilities: [
      'Bonus Experience — aumenta el bono de XP para torres cercanas',
      'Disorientation — hace que el agarrado dañe a otros enemigos',
      'Shared Damage — daño repartido entre todos los agarrados',
      'Ultimate (lv10) — agarra múltiples enemigos simultáneamente'
    ],
    synergies: ['blast', 'freezing', 'splash', 'sniper', 'minigun', 'laser'],
    researchNotes: 'Grab Range y Grab Duration stats exclusivos. Freezing/Blast ayudan a que Crusher atrape enemigos rápidos.',
    specialNotes: 'Precio incremental único: Base × (1 + n^1.6). Constructor puede invocar summoned enemies; Crusher los elimina fácilmente.'
  }
];
const ENEMIES = [
  {
    id: 'regular',
    name: 'Regular',
    icon: '🟢',
    type: 'Normal',
    flying: false,
    special: 'Sin efectos especiales. Base de daño 1 al base.',
    immuneTo: ['splash_dmg'],  // 10% de Splash (casi inmune)
    weakTo: ['basic', 'venom', 'crusher'],
    description: 'El más común. Aparece en todos los niveles excepto 5.2 y 5.6. Suele venir en grupos densos.'
  },
  {
    id: 'fast',
    name: 'Fast',
    icon: '🔺',
    type: 'Rápido',
    flying: false,
    special: '25% más velocidad de movimiento que Regular.',
    immuneTo: ['missile'],
    weakTo: ['cannon', 'multishot', 'venom'],
    description: 'Versión más rápida del Regular. Venom puede lentificarlo con stacks de veneno.'
  },
  {
    id: 'strong',
    name: 'Strong',
    icon: '🔴',
    type: 'Resistente',
    flying: false,
    special: 'Mayor salud. Reduce daño de torres baratas.',
    immuneTo: ['multishot'],
    weakTo: ['sniper', 'tesla', 'missile'],
    description: 'Alto HP. La mayoría de torres early tienen penalización. Sniper y Tesla son las principales counters.'
  },
  {
    id: 'heli',
    name: 'Heli',
    icon: '🚁',
    type: 'Volador',
    flying: true,
    special: 'Vuela. Solo Antiair, Splash, Blast, Multishot, Minigun, Tesla, Missile, Freezing y Laser pueden atacarlo.',
    immuneTo: ['basic', 'sniper', 'cannon', 'venom', 'flamethrower', 'gauss', 'crusher'],
    weakTo: ['antiair', 'missile'],
    description: 'Primer enemigo aéreo. Antiair es la counter principal. Heli y Jet se mueven 40% más lento mientras están ardiendo.'
  },
  {
    id: 'jet',
    name: 'Jet',
    icon: '✈️',
    type: 'Volador rápido',
    flying: true,
    special: 'Más rápido que Heli, menos HP. Inmune a Freezing y similares.',
    immuneTo: ['basic', 'sniper', 'cannon', 'blast', 'venom', 'flamethrower', 'gauss', 'crusher', 'freezing'],
    weakTo: ['tesla', 'laser'],
    description: 'Híbrido Fast+Heli. Inmune a Freezing (no se puede lentificar). Tesla y Laser son las mejores counters.'
  },
  {
    id: 'armored',
    name: 'Armored',
    icon: '🛡️',
    type: 'Blindado / Aura',
    flying: false,
    special: 'Aura que reduce daño de aliados cercanos en 50%. No apilan múltiples auras.',
    immuneTo: ['tesla'],
    weakTo: ['blast', 'minigun', 'venom', 'gauss'],
    description: 'Su aura protege a todos los enemigos cercanos. La prioridad debe ser eliminar Armored primero. Tesla es inútil vs él.'
  },
  {
    id: 'healer',
    name: 'Healer',
    icon: '💚',
    type: 'Curador / Aura',
    flying: false,
    special: 'Aura que restaura 5% HP/s a aliados cercanos. Múltiples auras se suman.',
    immuneTo: ['flamethrower'],
    weakTo: ['sniper', 'laser', 'minigun'],
    description: 'El aura de curación apila con múltiples Healers — extremadamente peligroso en grupos. Concentrar fuego.'
  },
  {
    id: 'toxic',
    name: 'Toxic',
    icon: '🟡',
    type: 'Regeneración',
    flying: false,
    special: 'Regenera 5% HP/s si no recibe daño en los últimos 3 segundos.',
    immuneTo: ['venom'],
    weakTo: ['splash', 'flamethrower', 'gauss'],
    description: 'Resiste torres de largo rango (Sniper, Missile, Laser solo 50%). Flamethrower anula su regeneración con burning.'
  },
  {
    id: 'icy',
    name: 'Icy',
    icon: '🔷',
    type: 'Escudo / Inmune CC',
    flying: false,
    special: 'Escudo = 25% HP máx. Escudo absorbe 100% de balas/fuego; 25% de otros daños. Con escudo: inmune a todo CC.',
    immuneTo: ['laser'],
    weakTo: ['cannon', 'splash', 'missile', 'flamethrower'],
    description: 'El escudo debe destruirse primero. Laser hace 0% daño. Con escudo activo es inmune a Freezing, stun y Snowball.'
  },
  {
    id: 'fighter',
    name: 'Fighter',
    icon: '🟠',
    type: 'División al morir',
    flying: false,
    special: 'Al morir se divide en 3 copias con 50% de HP.',
    immuneTo: ['tesla'],
    weakTo: ['sniper', 'splash', 'flamethrower', 'gauss'],
    description: 'Eliminar un Fighter crea 3 más pequeños — las torres AoE y Sniper/Flamethrower son las mejores opciones.'
  },
  {
    id: 'light',
    name: 'Light',
    icon: '⚪',
    type: 'Resistencia adaptativa',
    flying: false,
    special: 'Al recibir daño, gana 75% resistencia a ese tipo por 6 s. Cada 10 s puede recibir nueva inmunidad.',
    immuneTo: [],           // variable, se adapta
    weakTo: ['multishot', 'missile', 'crusher'],
    description: 'Combinar varios tipos de daño diferentes es la clave. Multishot, Missile y Crusher son los más efectivos.'
  },
  {
    id: 'boss',
    name: 'Boss',
    icon: '💀',
    type: 'Jefe',
    flying: false,
    special: 'Jefes aparecen al final de cada acto (1-5). Cada uno tiene mecánicas únicas.',
    immuneTo: [],
    weakTo: ['sniper', 'minigun', 'laser', 'missile', 'tesla'],
    description: 'Todos los jefes reciben 100% de todas las torres excepto Gauss (50%). Antiair y Crusher no pueden atacar bosses directamente.'
  }
];

/* ─────────────────────────────────────────────────────────────────
   SINERGIAS BASADAS EN LA WIKI
   ───────────────────────────────────────────────────────────────── */
const SYNERGY_RULES = [
  {
    towers: ['freezing', 'venom'],
    title: 'Crioveneno (Freezing + Venom)',
    desc: 'Freezing multiplica la duración del veneno de Venom (Poison Prolongation). Además, los enemigos lentos reciben más stacks. Combinación fundamental en mid/late game.'
  },
  {
    towers: ['freezing', 'tesla'],
    title: 'Cadena Congelada (Freezing + Tesla)',
    desc: 'Freezing agrupa enemigos y extiende la duración de la cadena eléctrica de Tesla. DPS neto de Tesla se multiplica significativamente vs grupos densos.'
  },
  {
    towers: ['freezing', 'splash'],
    title: 'Rifled Barrels Combo (Freezing + Splash)',
    desc: 'La habilidad Rifled Barrels de Splash da bonus de daño a enemigos lentos/detenidos. Freezing maximiza este bono de forma permanente.'
  },
  {
    towers: ['freezing', 'laser'],
    title: 'Haz Estático (Freezing + Laser)',
    desc: 'Laser hace daño continuo al primer enemigo en línea. Si ese enemigo está detenido por Freezing, recibe el máximo DPS posible del Laser.'
  },
  {
    towers: ['freezing', 'blast'],
    title: 'Control Total (Freezing + Blast)',
    desc: 'Blast stunnea y empuja; Freezing ralentiza. La combinación puede detener completamente oleadas enteras, dando tiempo de sobra a las torres de DPS.'
  },
  {
    towers: ['venom', 'flamethrower'],
    title: 'Combustión Tóxica (Venom + Flamethrower)',
    desc: 'Burning y Poison apilan simultáneamente. Flamethrower cubre las debilidades de Venom (Toxic, Fighter, Icy). Flamethrower Ultimate da bonus de monedas relacionado con Venom.'
  },
  {
    towers: ['blast', 'splash'],
    title: 'AoE Sin Escapatoria (Blast + Splash)',
    desc: 'Blast stunnea o empuja hacia portales, Splash dispara omnidireccionalmente sobre los aglomerados. Stun activa Rifled Barrels de Splash.'
  },
  {
    towers: ['crusher', 'sniper'],
    title: 'Agarre y Disparo (Crusher + Sniper)',
    desc: 'Crusher mantiene enemigos inmóviles, Sniper aprovecha para hacer daño crítico sin perder tiempo de apuntado. Crusher además da bonus XP a Sniper.'
  },
  {
    towers: ['crusher', 'minigun'],
    title: 'DPS Máximo (Crusher + Minigun)',
    desc: 'Crusher detiene el objetivo permitiendo que Minigun alcance velocidad máxima y aplique todo su DPS. Crusher otorga bonus XP que acelera el level up de Minigun.'
  },
  {
    towers: ['minigun', 'freezing'],
    title: 'Foundation Combo (Minigun + Freezing)',
    desc: 'Con habilidad Foundation activa, Minigun aplica veneno en vez de burning, compatible con Freezing. Sin Foundation, el burning de Minigun anula el slow de Freezing.'
  }
];

/* ─────────────────────────────────────────────────────────────────
   PESOS CONFIGURABLES
   ───────────────────────────────────────────────────────────────── */
const WEIGHT_DEFINITIONS = [
  { id: 'wDps',      label: 'DPS / Daño por segundo',       default: 5 },
  { id: 'wCost',     label: 'Bajo costo',                   default: 5 },
  { id: 'wRange',    label: 'Alcance / Rango',              default: 4 },
  { id: 'wControl',  label: 'Control de masas (slow/stun)', default: 5 },
  { id: 'wBoss',     label: 'Daño vs Boss / objetivo único',default: 4 },
  { id: 'wEndless',  label: 'Rendimiento en Endless',       default: 4 },
  { id: 'wEase',     label: 'Facilidad de uso',             default: 3 }
];

/* ─────────────────────────────────────────────────────────────────
   ESTADO GLOBAL
   ───────────────────────────────────────────────────────────────── */
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

/** Efectividad media de una torre contra la selección de enemigos */
function avgEffectiveness(tower, enemySelections) {
  let totalWeight = 0, totalEff = 0;
  ENEMIES.forEach(enemy => {
    const sel = enemySelections[enemy.id];
    if (!sel || !sel.selected) return;
    const qty = parseQty(sel.qty);
    const effArr = EFFECTIVENESS[tower.id];
    if (!effArr) return;
    const idx = EFF_IDX[enemy.id];
    if (idx === undefined) return;
    totalEff    += effArr[idx] * qty;
    totalWeight += qty;
  });
  if (totalWeight === 0) return 100; // sin selección: neutral
  return totalEff / totalWeight;
}

function parseQty(qtyStr) {
  if (qtyStr === '10+') return 12;
  return parseInt(qtyStr) || 1;
}

/* ─────────────────────────────────────────────────────────────────
   MOTOR DE PUNTUACIÓN
   Basado en efectividades reales de la wiki + condiciones de partida
   ───────────────────────────────────────────────────────────────── */
function scoreTower(tower, state) {
  let score = 0;
  const w         = state.weights;
  const phase     = state.phase;
  const mode      = state.mode;
  const research  = state.researchLevel;
  const hasBoss   = state.boss === 'yes';
  const hasFlying = state.flying === 'yes';
  const money     = state.startMoney;
  const sel       = state.enemySelections;

  /* ── Análisis de enemigos seleccionados ── */
  let flyingQty    = 0, armoredQty = 0, fightQty = 0;
  let toxicQty     = 0, icyQty     = 0, healerQty = 0;
  let fastQty      = 0, strongQty  = 0, lightQty  = 0;
  let totalQty     = 0;

  ENEMIES.forEach(enemy => {
    const s = sel[enemy.id];
    if (!s || !s.selected) return;
    const qty = parseQty(s.qty);
    totalQty += qty;
    if (enemy.flying)             flyingQty  += qty;
    if (enemy.id === 'armored')   armoredQty += qty;
    if (enemy.id === 'fighter')   fightQty   += qty;
    if (enemy.id === 'toxic')     toxicQty   += qty;
    if (enemy.id === 'icy')       icyQty     += qty;
    if (enemy.id === 'healer')    healerQty  += qty;
    if (enemy.id === 'fast')      fastQty    += qty;
    if (enemy.id === 'strong')    strongQty  += qty;
    if (enemy.id === 'light')     lightQty   += qty;
  });

  /* 1. Efectividad media contra enemigos seleccionados (peso alto) */
  const avgEff = avgEffectiveness(tower, sel);
  score += clamp((avgEff / 150) * 30, 0, 30) * (w.wDps / 5);

  /* 2. DPS relativo */
  score += (tower.stats.dps / 100) * 18 * (w.wDps / 5);

  /* 3. Costo vs presupuesto */
  const affordable = clamp(1 - (tower.cost / (money + 1)), 0, 1);
  score += affordable * 12 * (w.wCost / 5);

  /* 4. Rango */
  score += (tower.stats.range / 100) * 7 * (w.wRange / 5);

  /* 5. Fase */
  if (tower.bestPhase.includes(phase)) score += 15;
  else if (phase === 'late' && tower.bestPhase.includes('mid')) score += 6;

  /* 6. Endless */
  if (mode === 'endless') score += (tower.endlessRating / 10) * 14 * (w.wEndless / 5);

  /* 7. Boss */
  if (hasBoss) score += (tower.bossRating / 10) * 12 * (w.wBoss / 5);

  /* 8. Aéreos */
  if (hasFlying || flyingQty > 0) {
    if (tower.canHitAir) score += 10 + flyingQty * 1.5;
    else                 score -= 8;
  } else {
    if (tower.id === 'antiair') score -= 30; // totalmente inútil sin aéreos
  }

  /* 9. Control de masas */
  if (tower.isSlow || tower.isStun) score += 12 * (w.wControl / 5);
  if (tower.id === 'freezing')       score += 8  * (w.wControl / 5);
  if (tower.id === 'blast')          score += 6  * (w.wControl / 5);

  /* 10. Aéreos específicos */
  if (flyingQty > 0 && tower.id === 'antiair') score += flyingQty * 3;
  if (flyingQty > 0 && tower.id === 'tesla')   score += flyingQty * 2; // 150% vs Jet
  if (flyingQty > 0 && tower.id === 'laser')   score += flyingQty * 2;
  if (flyingQty > 0 && tower.id === 'missile') score += flyingQty * 2;

  /* 11. Armored específico */
  if (armoredQty > 0) {
    const effVsArmored = EFFECTIVENESS[tower.id]?.[EFF_IDX.armored] ?? 100;
    score += (effVsArmored / 150) * armoredQty * 2.5;
    if (tower.id === 'tesla') score -= armoredQty * 2; // 0% vs Armored
  }

  /* 12. Fighter */
  if (fightQty > 0) {
    if (tower.attackType === 'aoe') score += fightQty * 2;
    if (tower.id === 'tesla')       score -= fightQty * 2; // 0% vs Fighter
    if (tower.id === 'minigun')     score -= fightQty * 2; // 0% vs Fighter
  }

  /* 13. Toxic */
  if (toxicQty > 0) {
    if (tower.id === 'venom')        score -= toxicQty * 3; // 0%, inútil
    if (tower.id === 'flamethrower') score += toxicQty * 2; // 150% + cancela regen
    if (tower.id === 'splash')       score += toxicQty * 2; // 150%
  }

  /* 14. Icy */
  if (icyQty > 0) {
    if (tower.id === 'laser')        score -= icyQty * 3; // 0%
    if (tower.id === 'cannon')       score += icyQty * 2; // 150%
    if (tower.id === 'missile')      score += icyQty * 2; // 150%
    if (tower.id === 'flamethrower') score += icyQty * 2; // 150%
  }

  /* 15. Healer */
  if (healerQty > 0) {
    if (tower.id === 'minigun')  score += healerQty * 2; // 150%
    if (tower.id === 'laser')    score += healerQty * 2; // 150%
    if (tower.id === 'flamethrower') score -= healerQty * 2; // 0%
  }

  /* 16. Fast */
  if (fastQty > 2) {
    if (tower.isSlow || tower.isPoison) score += fastQty * 1.5;
    if (tower.id === 'missile')         score -= fastQty * 2; // 0%
    if (tower.id === 'venom')           score += fastQty * 2; // slow por poison
  }

  /* 17. Research level */
  score += (research / 100) * 8;

  /* 18. Utilidad general */
  score += (tower.stats.utility / 100) * 7;

  /* 19. Facilidad de uso */
  if (!tower.needsManualAim) score += 3 * (w.wEase / 5);
  else score -= 5; // Gauss: penalización por puntería manual

  /* 20. Escalado late/Endless */
  if (phase === 'late' || mode === 'endless') {
    score += (tower.stats.scaling / 100) * 8;
  }

  return Math.round(clamp(score, 0, 100));
}

/* ─────────────────────────────────────────────────────────────────
   RAZONES DE PUNTUACIÓN
   ───────────────────────────────────────────────────────────────── */
function buildReasons(tower, state, score) {
  const reasons = [];
  const sel = state.enemySelections;

  // Efectividad vs enemigos
  const avgEff = avgEffectiveness(tower, sel);
  if (avgEff >= 130) reasons.push(`Alta efectividad media (${Math.round(avgEff)}%) contra los enemigos seleccionados.`);
  else if (avgEff >= 100) reasons.push(`Efectividad adecuada (${Math.round(avgEff)}%) contra la composición enemiga.`);
  else if (avgEff <= 50)  reasons.push(`⚠ Baja efectividad promedio (${Math.round(avgEff)}%) vs enemigos elegidos.`);

  // Fase
  if (tower.bestPhase.includes(state.phase)) reasons.push(`Óptima para fase ${state.phase.toUpperCase()}.`);

  // Endless
  if (state.mode === 'endless' && tower.endlessRating >= 8) reasons.push(`Excelente en Endless (rating ${tower.endlessRating}/10).`);

  // Boss
  if (state.boss === 'yes' && tower.bossRating >= 8) reasons.push(`Gran daño vs Boss (${tower.bossRating}/10).`);

  // Voladores
  if ((state.flying === 'yes') && tower.canHitAir) reasons.push('Puede atacar aéreos (Heli/Jet presentes).');
  if ((state.flying === 'yes') && !tower.canHitAir) reasons.push('⚠ No puede atacar Heli ni Jet.');

  // Control
  if (tower.isSlow || tower.id === 'freezing') reasons.push('Slow que multiplica el DPS de todas las torres aliadas.');
  if (tower.isStun) reasons.push('Stun (detiene enemigos), potencia torres single-target.');

  // Económica
  if (tower.cost <= 100 && state.startMoney < 300) reasons.push(`Económica ($${tower.cost}) para presupuesto ajustado.`);

  // Manual
  if (tower.needsManualAim) reasons.push('Requiere puntería manual del jugador.');

  return reasons.slice(0, 4);
}
function buildWarnings(state, ranked) {
  const warnings = [];
  const sel = state.enemySelections;

  // Antiair inútil si no hay voladores
  if (state.flying === 'no') {
    const noFlyers = !ENEMIES.some(e => e.flying && sel[e.id]?.selected);
    if (noFlyers) warnings.push({ icon: '⚠️', text: 'No hay voladores seleccionados. Antiair hace 0% de daño a enemigos terrestres — no la construyas.' });
  }

  // Sin control de masas
  const top5 = ranked.slice(0, 5);
  const hasControl = top5.some(t => t.isSlow || t.isStun || t.id === 'freezing');
  if (!hasControl && state.phase !== 'early') {
    warnings.push({ icon: '❄️', text: 'Ninguna de las 5 torres top tiene control de masas. Considera añadir Freezing o Blast para multiplicar el DPS de tus otras torres.' });
  }

  // Boss sin counter single-target
  if (state.boss === 'yes') {
    const hasBossDmg = ranked.slice(0, 6).some(t => ['sniper','minigun','laser','missile'].includes(t.id));
    if (!hasBossDmg) warnings.push({ icon: '💀', text: 'Boss detectado pero ninguna torre top está optimizada para objetivo único. Añade Sniper, Minigun o Laser.' });
  }

  // Endless sin buen escalado
  if (state.mode === 'endless' && state.phase === 'late') {
    const hasScale = ranked.slice(0, 8).some(t => t.stats.scaling >= 75);
    if (!hasScale) warnings.push({ icon: '♾️', text: 'Endless late-game sin torres de alto escalado. Tesla, Laser y Minigun son esenciales para sobrevivir oleadas infinitas.' });
  }

  // Armored sin counter
  const hasArmored = ENEMIES.find(e => e.id === 'armored' && sel[e.id]?.selected);
  if (hasArmored) {
    const hasArmorCounter = ranked.slice(0,6).some(t =>
      EFFECTIVENESS[t.id]?.[EFF_IDX.armored] >= 100
    );
    if (!hasArmorCounter) warnings.push({ icon: '🛡️', text: 'Hay Armored pero ninguna torre top hace 100%+ de daño vs él. Blast (150%), Minigun (150%), Venom (150%) o Gauss (150%) son las counters.' });
  }

  // Icy sin counter (Laser hace 0%)
  const hasIcy = ENEMIES.find(e => e.id === 'icy' && sel[e.id]?.selected);
  if (hasIcy && ranked.slice(0,3).some(t => t.id === 'laser')) {
    warnings.push({ icon: '🔷', text: 'Hay enemigos Icy y Laser está entre tus top 3, pero Laser hace 0% vs Icy. Complementa con Cannon (150%) o Flamethrower (150%).' });
  }

  // Gauss sin miners
  if (ranked.slice(0,5).some(t => t.id === 'gauss')) {
    warnings.push({ icon: '🟠', text: 'Gauss está en el top 5. Recuerda que necesita recursos de miners adyacentes para disparar y requiere puntería manual.' });
  }

  // Strong sin counter
  const hasStrong = ENEMIES.find(e => e.id === 'strong' && sel[e.id]?.selected);
  if (hasStrong && state.phase === 'early') {
    warnings.push({ icon: '🔴', text: 'Strong en early game: la mayoría de torres tienen solo 25-50% vs él. Sniper o Tesla son las mejores opciones tempranas.' });
  }

  // Poco presupuesto
  if (state.startMoney < 200 && ranked[0]?.cost > 150) {
    warnings.push({ icon: '💰', text: `Presupuesto muy ajustado ($${state.startMoney}). La torre recomendada #1 cuesta $${ranked[0].cost}. Empieza con Basic ($27) o Venom ($100).` });
  }

  return warnings;
}

/* ─────────────────────────────────────────────────────────────────
   PLANES DE PARTIDA
   ───────────────────────────────────────────────────────────────── */
function buildOpeningPlan(ranked, state) {
  const plan = [];
  const budget = state.startMoney;
  let spent = 0;
  const picked = [];

  // Si hay voladores desde el inicio
  if (state.flying === 'yes') {
    plan.push({ num: 1, text: 'Hay voladores — construye <strong>Antiair</strong> ($100) desde la primera oleada.' });
    spent += 100; picked.push('antiair');
  }

  let slot = picked.length + 1;
  for (const t of ranked) {
    if (picked.includes(t.id)) continue;
    if (spent + t.cost > budget * 0.85) continue;
    if (slot > 4) break;
    plan.push({ num: slot, text: `<strong>${t.name}</strong> ($${t.cost}) — ${t.pros[0]}.` });
    spent += t.cost;
    slot++;
    picked.push(t.id);
  }

  if (!picked.includes('freezing') && state.phase !== 'early' && budget >= 80) {
    plan.push({ num: slot, text: '<strong>Freezing</strong> ($80) — aunque no esté en el top, siempre es una buena inversión de soporte para cualquier composición.' });
  }

  if (plan.length === 0) {
    plan.push({ num: 1, text: 'Con el presupuesto actual solo puedes construir <strong>Basic</strong> ($27). Empieza con 2-3 Basics y acumula monedas de las oleadas iniciales.' });
  }
  return plan;
}

function buildMidPlan(ranked, state) {
  const plan = [];
  const top1 = ranked[0];
  plan.push({ num: 1, text: `Mejora <strong>${top1?.name}</strong> al nivel de mejora máximo antes de construir nuevas torres. El upgrade escala mucho el daño.` });

  const hasFreezing = ranked.slice(0, 8).some(t => t.id === 'freezing');
  if (!hasFreezing) {
    plan.push({ num: 2, text: 'Añade al menos 1 <strong>Freezing</strong> ($80) si aún no tienes control de masas — es la sinergia más impactante del juego.' });
  } else {
    plan.push({ num: 2, text: 'Asegúrate de que <strong>Freezing</strong> esté colocado ANTES del embudo de ruta principal para que ralentice antes que las otras torres disparen.' });
  }

  plan.push({ num: 3, text: 'Vende torres <strong>Basic</strong> que hayas colocado en early si ya tienes DPS de torretas más potentes. Recuperas 50% del costo.' });
  plan.push({ num: 4, text: 'Mantén al menos 20-30% de reserva de monedas para responder a oleadas inesperadas sin quedarte sin recursos.' });
  return plan;
}

function buildLatePlan(ranked, state) {
  const plan = [];
  const top5names = ranked.slice(0, 5).map(t => t.name).join(', ');
  plan.push({ num: 1, text: `<strong>Composición final sugerida:</strong> ${top5names}.` });

  if (state.mode === 'endless') {
    plan.push({ num: 2, text: 'En Endless, el escalado de daño de los enemigos es exponencial. Prioriza torres con alto Endless Rating: <strong>Freezing (10/10), Tesla (9/10), Laser (9/10)</strong>.' });
    plan.push({ num: 3, text: 'Research <strong>Max XP Level</strong> hasta 100 (Endless) es la inversión más importante. Towers a lv100 tienen stats astronómicos.' });
  } else {
    plan.push({ num: 2, text: 'Maximiza el nivel de upgrade de las 2-3 torres principales. Upgrade Level 10 (con research) multiplica el daño enormemente.' });
  }

  if (state.boss === 'yes') {
    const bossTower = ranked.find(t => t.bossRating >= 8);
    if (bossTower) plan.push({ num: 3, text: `Para el Boss: concentra <strong>${bossTower.name}</strong> (${bossTower.bossRating}/10 anti-boss). Todos los bosses reciben 100% salvo Gauss (50%).` });
  }

  plan.push({ num: 4, text: 'Placement óptimo: torres de control (Freezing/Blast) antes del embudo, DPS (Tesla/Laser/Minigun) en el centro, Splash/Missile al final del camino.' });
  return plan;
}

/* ─────────────────────────────────────────────────────────────────
   SINERGIAS DETECTADAS
   ───────────────────────────────────────────────────────────────── */
function detectSynergies(ranked) {
  const top8 = new Set(ranked.slice(0, 8).map(t => t.id));
  return SYNERGY_RULES.filter(r => r.towers.every(id => top8.has(id)));
}

/* ─────────────────────────────────────────────────────────────────
   ANÁLISIS PRINCIPAL
   ───────────────────────────────────────────────────────────────── */
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

/* ─────────────────────────────────────────────────────────────────
   RENDERIZADO
   ───────────────────────────────────────────────────────────────── */
function renderResults(scored) {
  // Advertencias
  const wEl = document.getElementById('warningsBlock');
  wEl.innerHTML = '';
  buildWarnings(AppState, scored).forEach(w => {
    const d = document.createElement('div');
    d.className = 'warning-item';
    d.innerHTML = `<span class="warning-icon">${w.icon}</span><span class="warning-text">${w.text}</span>`;
    wEl.appendChild(d);
  });

  // Top 10
  const grid = document.getElementById('resultsGrid');
  grid.innerHTML = '';
  scored.slice(0, 10).forEach((t, i) => {
    const card = buildTowerCard(t, i + 1);
    card.style.animationDelay = `${i * 0.06}s`;
    grid.appendChild(card);
  });

  // Planes
  renderPlan('openingContent', buildOpeningPlan(scored, AppState));
  renderPlan('midContent',     buildMidPlan(scored, AppState));
  renderPlan('lateContent',    buildLatePlan(scored, AppState));

  // Sinergias
  const synEl = document.getElementById('synergiesContent');
  synEl.innerHTML = '';
  const syns = detectSynergies(scored);
  if (syns.length === 0) {
    synEl.innerHTML = '<p style="color:var(--text-2);font-size:.88rem;">No hay sinergias completas en el top 8 actual. Selecciona más torres o ajusta las prioridades.</p>';
  } else {
    syns.forEach(s => {
      const d = document.createElement('div');
      d.className = 'synergy-item';
      d.innerHTML = `<div class="synergy-title">🔗 ${s.title}</div><div class="synergy-desc">${s.desc}</div>`;
      synEl.appendChild(d);
    });
  }
}

function renderPlan(id, steps) {
  const el = document.getElementById(id);
  el.innerHTML = '';
  steps.forEach(s => {
    const d = document.createElement('div');
    d.className = 'plan-step';
    d.innerHTML = `<div class="plan-step-num">${s.num}</div><div class="plan-step-text">${s.text}</div>`;
    el.appendChild(d);
  });
}

function buildTowerCard(tower, rank) {
  const card = document.createElement('div');
  card.className = 'tower-card';
  const isFav = AppState.favorites.includes(tower.id);
  const sc    = tower.score;

  // Efectividades reales vs enemigos seleccionados
  const effRows = ENEMIES.filter(e => AppState.enemySelections[e.id]?.selected)
    .slice(0, 4)
    .map(e => {
      const eff = EFFECTIVENESS[tower.id]?.[EFF_IDX[e.id]] ?? 100;
      const color = eff >= 150 ? 'var(--green)' : eff === 0 ? 'var(--red)' : eff <= 50 ? 'var(--yellow)' : 'var(--text-1)';
      return `<span style="color:${color};font-size:.72rem">${e.icon}${eff}%</span>`;
    }).join(' ');

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
      <div class="score-bar"><div class="score-fill ${scoreClass(sc)}" style="width:${sc}%"></div></div>
    </div>
    <div class="tc-stats">
      <div class="tc-stat"><div class="tc-stat-label">Costo</div><div class="tc-stat-val">$${tower.cost}</div></div>
      <div class="tc-stat"><div class="tc-stat-label">Boss</div><div class="tc-stat-val">${tower.bossRating}/10</div></div>
      <div class="tc-stat"><div class="tc-stat-label">Endless</div><div class="tc-stat-val">${tower.endlessRating}/10</div></div>
      <div class="tc-stat"><div class="tc-stat-label">Aéreos</div><div class="tc-stat-val">${tower.canHitAir ? '✅' : '—'}</div></div>
    </div>
    ${effRows ? `<div style="display:flex;gap:.4rem;flex-wrap:wrap;margin-bottom:.6rem">${effRows}</div>` : ''}
    <div class="tc-reasons">
      ${tower.reasons.map(r => `<div class="tc-reason"><div class="tc-reason-dot"></div><span>${r}</span></div>`).join('')}
    </div>
  `;

  card.querySelector('.tc-fav').addEventListener('click', e => {
    e.stopPropagation();
    toggleFavorite(tower.id);
    e.currentTarget.classList.toggle('active', AppState.favorites.includes(tower.id));
  });

  return card;
}
function populateCompareSelects() {
  ['towerA','towerB'].forEach((selId, idx) => {
    const sel = document.getElementById(selId);
    sel.innerHTML = '';
    TOWERS.forEach(t => {
      const opt = document.createElement('option');
      opt.value = t.id; opt.textContent = `${t.icon} ${t.name}`;
      sel.appendChild(opt);
    });
    sel.value = TOWERS[idx]?.id || TOWERS[0].id;
  });
}

function renderCompare() {
  const tA = TOWERS.find(t => t.id === document.getElementById('towerA').value);
  const tB = TOWERS.find(t => t.id === document.getElementById('towerB').value);
  if (!tA || !tB) return;

  const FIELDS = [
    { key:'dps', label:'DPS' }, { key:'cost', label:'Costo', invert:true },
    { key:'range', label:'Alcance' }, { key:'scaling', label:'Escalado' },
    { key:'utility', label:'Utilidad' }, { key:'versatility', label:'Versatilidad' }
  ];

  // Tabla de efectividad vs todos los enemigos
  function effTable(tower) {
    return ENEMIES.map(e => {
      const eff = EFFECTIVENESS[tower.id]?.[EFF_IDX[e.id]] ?? 100;
      const color = eff >= 150 ? '#22c55e' : eff === 0 ? '#ef4444' : eff <= 50 ? '#eab308' : '#b8b8d0';
      return `<div style="display:flex;align-items:center;gap:.3rem;font-size:.72rem">
        <span>${e.icon}</span><span style="flex:1;color:var(--text-2)">${e.name}</span>
        <span style="font-weight:700;color:${color}">${eff}%</span>
      </div>`;
    }).join('');
  }

  function buildCol(tower, opp) {
    const div = document.createElement('div');
    div.className = 'compare-col';
    div.innerHTML = `
      <div class="compare-col-header">
        <div style="font-size:2rem">${tower.icon}</div>
        <div class="compare-col-name">${tower.name}</div>
        <div style="font-size:.75rem;color:var(--text-2)">${tower.type}</div>
        <div style="font-size:.8rem;color:var(--blue-light);margin-top:.2rem">$${tower.cost} · Endless ${tower.endlessRating}/10 · Boss ${tower.bossRating}/10</div>
      </div>
      ${FIELDS.map(f => {
        const vA = tower.stats[f.key], vB = opp.stats[f.key];
        const win = f.invert ? vA <= vB : vA >= vB;
        return `<div class="compare-stat-row">
          <span class="compare-stat-label">${f.label}</span>
          <div class="compare-bar-wrap"><div class="compare-bar-fill" style="width:${vA}%;background:${win?'linear-gradient(90deg,var(--green),#86efac)':'linear-gradient(90deg,var(--blue),var(--purple))'}"></div></div>
          <span class="compare-stat-val" style="color:${win?'var(--green)':'var(--text-1)'}">${vA}</span>
        </div>`;
      }).join('')}
      <div style="margin-top:.75rem">
        <div style="font-size:.72rem;font-weight:700;color:var(--text-2);text-transform:uppercase;letter-spacing:.06em;margin-bottom:.4rem">Efectividad vs enemigos</div>
        ${effTable(tower)}
      </div>
      <div style="margin-top:.75rem;font-size:.78rem;color:var(--text-2)"><strong style="color:var(--green)">✓</strong> ${tower.pros.slice(0,3).join('<br><strong style="color:var(--green)">✓</strong> ')}</div>
      <div style="margin-top:.5rem;font-size:.78rem;color:var(--text-2)"><strong style="color:var(--red)">✗</strong> ${tower.cons.slice(0,3).join('<br><strong style="color:var(--red)">✗</strong> ')}</div>
    `;
    return div;
  }

  const cont = document.getElementById('compareResult');
  cont.innerHTML = '';
  cont.appendChild(buildCol(tA, tB));
  cont.appendChild(buildCol(tB, tA));
}

/* ─────────────────────────────────────────────────────────────────
   ESTADÍSTICAS
   ───────────────────────────────────────────────────────────────── */
function renderStats(statKey) {
  const chart  = document.getElementById('statChart');
  chart.innerHTML = '';
  const sorted = [...TOWERS].sort((a, b) => {
    const vA = statKey === 'cost' ? (100 - a.stats.cost) : a.stats[statKey];
    const vB = statKey === 'cost' ? (100 - b.stats.cost) : b.stats[statKey];
    return vB - vA;
  });
  sorted.forEach(t => {
    const raw = t.stats[statKey];
    const pct  = statKey === 'cost' ? (100 - raw) : raw;
    const disp = statKey === 'cost' ? `$${t.cost}` : raw;
    const row  = document.createElement('div');
    row.className = 'stat-row';
    row.innerHTML = `
      <span class="stat-row-name">${t.icon} ${t.name}</span>
      <div class="stat-row-bar"><div class="stat-row-fill" style="width:${pct}%">${disp}</div></div>`;
    chart.appendChild(row);
  });
}

/* ─────────────────────────────────────────────────────────────────
   FAVORITOS
   ───────────────────────────────────────────────────────────────── */
function toggleFavorite(id) {
  const idx = AppState.favorites.indexOf(id);
  if (idx === -1) { AppState.favorites.push(id); showToast('★ Añadido a favoritos'); }
  else            { AppState.favorites.splice(idx,1); showToast('Eliminado de favoritos'); }
  lsSet('i2_favorites', AppState.favorites);
  renderFavorites();
}

function renderFavorites() {
  const grid  = document.getElementById('favoritesGrid');
  const empty = document.getElementById('favoritesEmpty');
  grid.innerHTML = '';
  const favs  = TOWERS.filter(t => AppState.favorites.includes(t.id));
  empty.style.display = favs.length === 0 ? 'block' : 'none';
  favs.forEach(t => {
    const scored = AppState.lastResults?.find(r => r.id === t.id) || { ...t, score: 50, reasons: t.pros };
    grid.appendChild(buildTowerCard(scored, '★'));
  });
}

/* ─────────────────────────────────────────────────────────────────
   HISTORIAL
   ───────────────────────────────────────────────────────────────── */
function saveToHistory() {
  const entry = {
    date:  new Date().toLocaleDateString('es-MX', { month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' }),
    mode:  AppState.mode, phase: AppState.phase, boss: AppState.boss,
    map:   AppState.mapName || 'Sin nombre',
    top3:  AppState.lastResults?.slice(0,3).map(t => t.name).join(', ') || ''
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
  if (AppState.history.length === 0) { empty.style.display = 'block'; return; }
  empty.style.display = 'none';
  AppState.history.forEach(e => {
    const item = document.createElement('div');
    item.className = 'history-item';
    item.innerHTML = `
      <span class="history-date">${e.date}</span>
      <span class="history-info"><strong>${e.map}</strong> — Fase <strong>${e.phase}</strong> | Boss: ${e.boss === 'yes'?'Sí':'No'}<br><small>Top 3: ${e.top3}</small></span>
      <span class="history-tag ${e.mode === 'endless'?'tag-endless':'tag-normal'}">${e.mode}</span>`;
    list.appendChild(item);
  });
}

/* ─────────────────────────────────────────────────────────────────
   BUSCADOR
   ───────────────────────────────────────────────────────────────── */
function initSearch() {
  const input   = document.getElementById('towerSearch');
  const results = document.getElementById('searchResults');

  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    results.innerHTML = '';
    if (!q) return;
    const matches = TOWERS.filter(t =>
      t.name.toLowerCase().includes(q) || t.type.toLowerCase().includes(q)
    );
    if (matches.length === 0) {
      results.innerHTML = '<p style="color:var(--text-2);font-size:.85rem;padding:.5rem">Sin resultados.</p>';
      return;
    }
    matches.forEach(t => {
      const scored = AppState.lastResults?.find(r => r.id === t.id) || { ...t, score: '—' };
      const item   = document.createElement('div');
      item.className = 'search-result-item';
      item.innerHTML = `
        <span style="font-size:1.6rem">${t.icon}</span>
        <div style="flex:1">
          <strong>${t.name}</strong><span style="font-size:.75rem;color:var(--text-2);margin-left:.5rem">${t.type}</span>
          <br><small style="color:var(--text-2)">$${t.cost} · Boss ${t.bossRating}/10 · Endless ${t.endlessRating}/10 · Aéreos: ${t.canHitAir?'✅':'—'}</small>
        </div>
        <span style="font-size:.85rem;font-weight:700;color:var(--blue-light)">${scored.score}/100</span>`;
      results.appendChild(item);
    });
  });
}

/* ─────────────────────────────────────────────────────────────────
   EXPORTAR
   ───────────────────────────────────────────────────────────────── */
function exportJson() {
  if (!AppState.lastResults) { showToast('Primero analiza una partida.'); return; }
  const data = {
    fecha: new Date().toISOString(),
    configuracion: {
      modo: AppState.mode, fase: AppState.phase, boss: AppState.boss,
      voladores: AppState.flying, mapa: AppState.mapName,
      dinero: AppState.startMoney, research: AppState.researchLevel
    },
    top10: AppState.lastResults.slice(0,10).map(t => ({
      nombre: t.name, puntuacion: t.score, motivos: t.reasons,
      costo: t.cost, bossRating: t.bossRating, endlessRating: t.endlessRating
    }))
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type:'application/json' });
  const a    = document.createElement('a');
  a.href     = URL.createObjectURL(blob);
  a.download = `i2-analysis-${Date.now()}.json`;
  a.click();
  showToast('📥 JSON exportado');
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
          <div class="enemy-type">${enemy.type}${enemy.flying?' · ✈️ Volador':''}</div>
        </div>
      </div>
      <div style="font-size:.72rem;color:var(--text-2);margin-bottom:.4rem;line-height:1.4">${enemy.description}</div>
      <div class="enemy-checkbox-wrap">
        <input type="checkbox" class="enemy-checkbox" id="chk_${enemy.id}" />
        <label for="chk_${enemy.id}">Aparece</label>
      </div>
      <div class="enemy-qty">
        <span class="qty-label">Cantidad:</span>
        <select class="qty-select" id="qty_${enemy.id}">
          ${['1','2','3','4','5','6','7','8','9','10+'].map(v => `<option value="${v}">${v}</option>`).join('')}
        </select>
      </div>`;

    const chk = card.querySelector('.enemy-checkbox');
    chk.addEventListener('change', () => {
      AppState.enemySelections[enemy.id].selected = chk.checked;
      card.classList.toggle('selected', chk.checked);
    });
    card.querySelector('.qty-select').addEventListener('change', e => {
      AppState.enemySelections[enemy.id].qty = e.target.value;
    });
    card.addEventListener('click', e => {
      if (['INPUT','SELECT','LABEL','OPTION'].includes(e.target.tagName)) return;
      chk.checked = !chk.checked; chk.dispatchEvent(new Event('change'));
    });
    grid.appendChild(card);
  });
}

/* ─────────────────────────────────────────────────────────────────
   INIT: PESOS
   ───────────────────────────────────────────────────────────────── */
function initWeightsGrid() {
  const grid = document.getElementById('weightsGrid');
  grid.innerHTML = '';
  WEIGHT_DEFINITIONS.forEach(wd => {
    AppState.weights[wd.id] = wd.default;
    const item = document.createElement('div');
    item.className = 'weight-item';
    item.innerHTML = `
      <div class="weight-label"><span>${wd.label}</span><span class="weight-val" id="wv_${wd.id}">${wd.default}</span></div>
      <input type="range" min="1" max="10" value="${wd.default}" class="slider" id="ws_${wd.id}" />`;
    const slider = item.querySelector('input');
    const valEl  = item.querySelector('.weight-val');
    slider.addEventListener('input', () => {
      AppState.weights[wd.id] = parseInt(slider.value);
      valEl.textContent = slider.value;
    });
    grid.appendChild(item);
  });
}

/* ─────────────────────────────────────────────────────────────────
   NAVEGACIÓN
   ───────────────────────────────────────────────────────────────── */
function navigateTo(sectionId) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(`section-${sectionId}`)?.classList.add('active');
  document.querySelector(`.nav-btn[data-section="${sectionId}"]`)?.classList.add('active');
  document.querySelector('.top-nav')?.classList.remove('open');
  if (sectionId === 'stats')     renderStats(AppState.currentStatTab);
  if (sectionId === 'favorites') renderFavorites();
  if (sectionId === 'history')   renderHistory();
  if (sectionId === 'compare')   populateCompareSelects();
}

/* ─────────────────────────────────────────────────────────────────
   MAIN INIT
   ───────────────────────────────────────────────────────────────── */
function init() {
  AppState.favorites = lsGet('i2_favorites', []);
  AppState.history   = lsGet('i2_history', []);

  initEnemyGrid();
  initWeightsGrid();
  populateCompareSelects();
  initSearch();

  // Toggle groups
  document.querySelectorAll('.toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const g = btn.dataset.group, v = btn.dataset.value;
      document.querySelectorAll(`.toggle-btn[data-group="${g}"]`).forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      if (g === 'mode')   AppState.mode   = v;
      if (g === 'phase')  AppState.phase  = v;
      if (g === 'boss')   AppState.boss   = v;
      if (g === 'flying') AppState.flying = v;
    });
  });

  // Research slider
  const rs = document.getElementById('researchLevel');
  const rv = document.getElementById('researchValue');
  rs.addEventListener('input', () => { rv.textContent = `${rs.value}%`; AppState.researchLevel = parseInt(rs.value); });

  // Botones
  document.getElementById('analyzeBtn').addEventListener('click', analyzeGame);
  document.getElementById('compareBtn').addEventListener('click', renderCompare);
  document.getElementById('exportJson').addEventListener('click', exportJson);
  document.getElementById('exportPdf').addEventListener('click', () => window.print());
  document.getElementById('clearHistory').addEventListener('click', () => {
    AppState.history = []; lsSet('i2_history', []); renderHistory(); showToast('Historial borrado');
  });

  // Nav
  document.querySelectorAll('.nav-btn').forEach(b => b.addEventListener('click', () => navigateTo(b.dataset.section)));
  document.getElementById('menuToggle').addEventListener('click', () => document.querySelector('.top-nav').classList.toggle('open'));

  // Stat tabs
  document.querySelectorAll('.stat-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.stat-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      AppState.currentStatTab = tab.dataset.stat;
      renderStats(AppState.currentStatTab);
    });
  });

  navigateTo('setup');
  console.log('🎮 Infinitode 2 Battle Assistant — datos de wiki oficial cargados.');
  console.log(`📊 ${TOWERS.length} torres · ${ENEMIES.length} enemigos (+ boss) · ${SYNERGY_RULES.length} sinergias`);
}

document.addEventListener('DOMContentLoaded', init);