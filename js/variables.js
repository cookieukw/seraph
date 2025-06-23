const upgradePool = [
  {
    id: "projectileDamage",
    maxLevel: 5,
    initialValues: { value: 1 },
    levels: [
      {
        title: "Tiro Forte I",
        description: "Aumenta o dano do projétil em 1.",
        apply: (p) => {
          p.upgrades.projectileDamage.value += 1;
        },
      },
      {
        title: "Tiro Forte II",
        description: "Aumenta o dano do projétil em 1.",
        apply: (p) => {
          p.upgrades.projectileDamage.value += 1;
        },
      },
      {
        title: "Tiro Forte III",
        description: "Aumenta o dano do projétil em 2.",
        apply: (p) => {
          p.upgrades.projectileDamage.value += 2;
        },
      },
      {
        title: "Tiro Forte IV",
        description: "Aumenta o dano do projétil em 2.",
        apply: (p) => {
          p.upgrades.projectileDamage.value += 2;
        },
      },
      {
        title: "Tiro Forte V",
        description: "Aumenta o dano do projétil em 3.",
        apply: (p) => {
          p.upgrades.projectileDamage.value += 3;
        },
      },
    ],
  },
  {
    id: "hp_up",
    maxLevel: 5,
    initialValues: {},
    levels: [
      {
        title: "Vitalidade I",
        description: "Aumenta a vida maxima em 20.",
        apply: (p) => {
          p.maxHealth += 20;
          p.heal(20);
        },
      },
      {
        title: "Vitalidade II",
        description: "Aumenta a vida maxima em 25.",
        apply: (p) => {
          p.maxHealth += 25;
          p.heal(25);
        },
      },
      {
        title: "Vitalidade III",
        description: "Aumenta a vida maxima em 30.",
        apply: (p) => {
          p.maxHealth += 30;
          p.heal(30);
        },
      },
      {
        title: "Vitalidade IV",
        description: "Aumenta a vida maxima em 35.",
        apply: (p) => {
          p.maxHealth += 35;
          p.heal(35);
        },
      },
      {
        title: "Vitalidade V",
        description: "Aumenta a vida maxima em 50.",
        apply: (p) => {
          p.maxHealth += 50;
          p.heal(50);
        },
      },
    ],
  },
  {
    id: "armor_up",
    maxLevel: 5,
    initialValues: { value: 0 },
    levels: [
      {
        title: "Armadura I",
        description: "Aumenta a armadura em 2.",
        apply: (p) => {
          p.upgrades.armor_up.value += 2;
        },
      },
      {
        title: "Armadura II",
        description: "Aumenta a armadura em 2.",
        apply: (p) => {
          p.upgrades.armor_up.value += 2;
        },
      },
      {
        title: "Armadura III",
        description: "Aumenta a armadura em 3.",
        apply: (p) => {
          p.upgrades.armor_up.value += 3;
        },
      },
      {
        title: "Armadura IV",
        description: "Aumenta a armadura em 3.",
        apply: (p) => {
          p.upgrades.armor_up.value += 3;
        },
      },
      {
        title: "Armadura V",
        description: "Aumenta a armadura em 5.",
        apply: (p) => {
          p.upgrades.armor_up.value += 5;
        },
      },
    ],
  },
  {
    id: "atk_speed_up",
    maxLevel: 5,
    initialValues: { value: 300, timer: 0 },
    levels: [
      {
        title: "Agilidade I",
        description: "Aumenta a vel. de ataque em 15%.",
        apply: (p) => {
          p.upgrades.atk_speed_up.value *= 0.85;
        },
      },
      {
        title: "Agilidade II",
        description: "Aumenta a vel. de ataque em 15%.",
        apply: (p) => {
          p.upgrades.atk_speed_up.value *= 0.85;
        },
      },
      {
        title: "Agilidade III",
        description: "Aumenta a vel. de ataque em 15%.",
        apply: (p) => {
          p.upgrades.atk_speed_up.value *= 0.85;
        },
      },
      {
        title: "Agilidade IV",
        description: "Aumenta a vel. de ataque em 15%.",
        apply: (p) => {
          p.upgrades.atk_speed_up.value *= 0.85;
        },
      },
      {
        title: "Agilidade V",
        description: "Aumenta a vel. de ataque em 20%.",
        apply: (p) => {
          p.upgrades.atk_speed_up.value *= 0.8;
        },
      },
    ],
  },
  {
    id: "vampirism_up",
    maxLevel: 3,
    initialValues: { value: 0 },
    levels: [
      {
        title: "Vampirismo I",
        description: "Converte 5% do dano em vida.",
        apply: (p) => {
          p.upgrades.vampirism_up.value += 0.05;
        },
      },
      {
        title: "Vampirismo II",
        description: "Converte 5% do dano em vida.",
        apply: (p) => {
          p.upgrades.vampirism_up.value += 0.05;
        },
      },
      {
        title: "Vampirismo III",
        description: "Converte 5% do dano em vida.",
        apply: (p) => {
          p.upgrades.vampirism_up.value += 0.05;
        },
      },
    ],
  },
  {
    id: "hasHomingProjectiles",
    maxLevel: 1,
    initialValues: { value: false },
    levels: [
      {
        title: "Olho do Cacador",
        description: "Projeteis perseguem inimigos.",
        apply: (p) => {
          p.upgrades.hasHomingProjectiles.value = true;
        },
      },
    ],
  },
  {
    id: "corpseExplosion",
    maxLevel: 1,
    initialValues: { damage: 0, radius: 0 },
    levels: [
      {
        title: "Explosao Cadaverica",
        description: "Inimigos explodem ao morrer, causando 3 de dano em area.",
        apply: (p) => {
          p.upgrades.corpseExplosion.damage = 3;
          p.upgrades.corpseExplosion.radius = 50;
        },
      },
    ],
  },
  {
    id: "lightningStrike",
    maxLevel: 5,
    initialValues: {
      damage: 0,
      radius: 40,
      cooldown: 8000,
      timer: 0,
      count: 0,
    },
    levels: [
      {
        title: "Tempestade I",
        description: "1 raio cai a cada 8s causando 3 de dano.",
        apply: (p) => {
          p.upgrades.lightningStrike.count = 1;
          p.upgrades.lightningStrike.damage = 3;
        },
      },
      {
        title: "Tempestade II",
        description: "2 raios caem a cada 8s causando 3 de dano.",
        apply: (p) => {
          p.upgrades.lightningStrike.count = 2;
        },
      },
      {
        title: "Tempestade III",
        description: "2 raios caem a cada 6s causando 4 de dano.",
        apply: (p) => {
          p.upgrades.lightningStrike.cooldown = 6000;
          p.upgrades.lightningStrike.damage = 4;
        },
      },
      {
        title: "Tempestade IV",
        description: "3 raios caem a cada 6s causando 4 de dano.",
        apply: (p) => {
          p.upgrades.lightningStrike.count = 3;
        },
      },
      {
        title: "Tempestade V",
        description: "4 raios caem a cada 5s causando 5 de dano.",
        apply: (p) => {
          p.upgrades.lightningStrike.cooldown = 5000;
          p.upgrades.lightningStrike.count = 4;
          p.upgrades.lightningStrike.damage = 5;
        },
      },
    ],
  },
  {
    id: "ricochet",
    maxLevel: 3,
    initialValues: { value: 0 },
    levels: [
      {
        title: "Ricochete I",
        description: "Tiros quicam 1 vez.",
        apply: (p) => {
          p.upgrades.ricochet.value += 1;
        },
      },
      {
        title: "Ricochete II",
        description: "Tiros quicam 1 vez.",
        apply: (p) => {
          p.upgrades.ricochet.value += 1;
        },
      },
      {
        title: "Ricochete III",
        description: "Tiros quicam 1 vez.",
        apply: (p) => {
          p.upgrades.ricochet.value += 1;
        },
      },
    ],
  },
  {
    id: "pierce",
    maxLevel: 3,
    initialValues: { value: 0 },
    levels: [
      {
        title: "Perfuracao I",
        description: "Tiros perfuram 1 inimigo.",
        apply: (p) => {
          p.upgrades.pierce.value += 1;
        },
      },
      {
        title: "Perfuracao II",
        description: "Tiros perfuram 1 inimigo.",
        apply: (p) => {
          p.upgrades.pierce.value += 1;
        },
      },
      {
        title: "Perfuracao III",
        description: "Tiros perfuram 1 inimigo.",
        apply: (p) => {
          p.upgrades.pierce.value += 1;
        },
      },
    ],
  },
  {
    id: "shrapnel",
    maxLevel: 1,
    initialValues: { value: 0 },
    levels: [
      {
        title: "Estilhacos",
        description: "Tiros soltam 3 mini-projeteis ao colidir.",
        apply: (p) => {
          p.upgrades.shrapnel.value = 3;
        },
      },
    ],
  },
  {
    id: "combustion",
    maxLevel: 1,
    initialValues: { chance: 0 },
    levels: [
      {
        title: "Combustao",
        description: "Tiros tem 15% de chance de queimar inimigos.",
        apply: (p) => {
          p.upgrades.combustion.chance = 0.15;
        },
      },
    ],
  },
  {
    id: "stationary_damage",
    maxLevel: 1,
    initialValues: { level: 0 },
    levels: [
      {
        title: "Postura Firme",
        description: "Dano x2 se estiver parado.",
        apply: (p) => {
          p.upgrades.stationary_damage.level = 1;
        },
      },
    ],
  },
 {
   id: "bloodthirst",
   maxLevel: 5, // MODIFICAÇÃO: Aumenta o número máximo de níveis
   initialValues: { healAmount: 0, killsPerHeal: 0, currentKills: 0 }, // MODIFICAÇÃO: Adiciona valores iniciais para cura, kills por cura e contador de kills
   levels: [
     {
       title: "Sede de Sangue I",
       description: "Cura 5 de HP a cada 10 inimigos derrotados.",
       apply: (p) => {
         p.upgrades.bloodthirst.healAmount = 5; 
         p.upgrades.bloodthirst.killsPerHeal = 10; 
       },
     },
     {
       title: "Sede de Sangue II",
       description: "Cura 7 de HP a cada 10 inimigos derrotados.",
       apply: (p) => {
         p.upgrades.bloodthirst.healAmount = 7;
         p.upgrades.bloodthirst.killsPerHeal = 10;
       },
     },
     {
       title: "Sede de Sangue III",
       description: "Cura 10 de HP a cada 10 inimigos derrotados.",
       apply: (p) => {
         p.upgrades.bloodthirst.healAmount = 10;
         p.upgrades.bloodthirst.killsPerHeal = 10;
       },
     },
     {
       title: "Sede de Sangue IV",
       description: "Cura 10 de HP a cada 8 inimigos derrotados.", 
       apply: (p) => {
         p.upgrades.bloodthirst.healAmount = 10;
         p.upgrades.bloodthirst.killsPerHeal = 8;
       },
     },
     {
       title: "Sede de Sangue V",
       description: "Cura 15 de HP a cada 5 inimigos derrotados.",
       apply: (p) => {
         p.upgrades.bloodthirst.healAmount = 15;
         p.upgrades.bloodthirst.killsPerHeal = 5;
       },
     },
   ],
 },
  {
    id: "temp_armor",
    maxLevel: 1,
    initialValues: { value: 0, timer: 0 },
    levels: [
      {
        title: "Bencao do Sabio",
        description: "Ganha +15 de armadura por 25s ao subir de nivel.",
        apply: (p) => {
          p.upgrades.temp_armor.value = 15;
          p.upgrades.temp_armor.timer = 25000;
        },
      },
    ],
  },
  {
    id: "revive",
    maxLevel: 1,
    initialValues: {},
    levels: [
      {
        title: "Fenix",
        description: "Ressuscita com 25% da vida. (1x por partida)",
        apply: (p) => {},
      },
    ],
  },
  {
    id: "thorns",
    maxLevel: 1,
    initialValues: { damage: 5, radius: 60 },
    levels: [
      {
        title: "Aura de Espinhos",
        description: "Causa dano em area ao ser atingido.",
        apply: (p) => {},
      },
    ],
  },
  {
    id: "frenzy",
    maxLevel: 1,
    initialValues: { speedPerStack: 1 },
    levels: [
      {
        title: "Frenesi",
        description:
          "Cada abate aumenta sua vel. de movimento por 3s. Acumula.",
        apply: (p) => {},
      },
    ],
  },
  {
    id: "infection",
    maxLevel: 1,
    initialValues: { chance: 0.2, damage: 6, radius: 50 },
    levels: [
      {
        title: "Peste Virulenta",
        description: "Inimigos infectados explodem e espalham a infeccao.",
        apply: (p) => {},
      },
    ],
  },
  {
    id: "damage_barrier",
    maxLevel: 1,
    initialValues: { reduction: 0.25 },
    levels: [
      {
        title: "Barreira Protetora",
        description: "Reduz o dano recebido em 25%.",
        apply: (p) => {},
      },
    ],
  },
  {
    id: "lethal_barrier",
    maxLevel: 1,
    initialValues: {},
    levels: [
      {
        title: "Ultimo Suspiro",
        description: "Evita um ataque letal. (1x por vida)",
        apply: (p) => {},
      },
    ],
  },
  {
    id: "shootingOrb",
    maxLevel: 3,
    initialValues: { count: 0 },
    levels: [
      {
        title: "Orbe de Disparo",
        description: "Adiciona um orbe que atira com voce.",
        apply: (p) => {
          p.addOrb("shooter");
        },
      },
      {
        title: "Orbe de Disparo II",
        description: "Adiciona um segundo orbe.",
        apply: (p) => {
          p.addOrb("shooter");
        },
      },
      {
        title: "Orbe de Disparo III",
        description: "Adiciona um terceiro orbe.",
        apply: (p) => {
          p.addOrb("shooter");
        },
      },
    ],
  },
  {
    id: "laserOrb",
    maxLevel: 3,
    initialValues: { count: 0, damage: 5, pierce: 0, chain: 0 },
    levels: [
      {
        title: "Orbe de Raio",
        description: "Adiciona um orbe que ataca com raios.",
        apply: (p) => {
          p.addOrb("laser");
        },
      },
      {
        title: "Raio Encadeado",
        description: "Raios do orbe atingem +2 alvos.",
        apply: (p) => {
          p.upgrades.laserOrb.chain = 2;
        },
      },
      {
        title: "Raio Perfurante",
        description: "Raios do orbe perfuram todos os alvos.",
        apply: (p) => {
          p.upgrades.laserOrb.pierce = 99;
        },
      },
    ],
  },
];

const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
const DEBUG = true; // Modo de depuração, pode ser ativado para testes  

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
