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
    apply: (p, levelIndex) => {
      const newStats = upgradePool.find((up) => up.id === "atk_speed_up")
        .levels[levelIndex].stats;
      Object.assign(p.upgrades.atk_speed_up, newStats);
    },
    levels: [
      {
        title: "Agilidade I",
        description: "Aumenta a vel. de ataque em 15%.",
        stats: { value: 300 * 0.85 },
      },
      {
        title: "Agilidade II",
        description: "Aumenta a vel. de ataque em 15%.",
        stats: { value: 300 * 0.85 * 0.85 },
      },
      {
        title: "Agilidade III",
        description: "Aumenta a vel. de ataque em 15%.",
        stats: { value: 300 * 0.85 * 0.85 * 0.85 },
      },
      {
        title: "Agilidade IV",
        description: "Aumenta a vel. de ataque em 15%.",
        stats: { value: 300 * 0.85 * 0.85 * 0.85 * 0.85 },
      },
      {
        title: "Agilidade V",
        description: "Aumenta a vel. de ataque em 20%.",
        stats: { value: 300 * 0.85 * 0.85 * 0.85 * 0.85 * 0.8 },
      },
    ],
  },

  {
    id: "vampirism_up",
    maxLevel: 3,
    initialValues: { value: 0 },
    apply: (p) => {
      p.upgrades.vampirism_up.value += 0.05;
    },
    levels: [
      { title: "Vampirismo I", description: "Converte 5% do dano em vida." },
      {
        title: "Vampirismo II",
        description: "Aumenta a conversão de vida para 10%.",
      },
      {
        title: "Vampirismo III",
        description: "Aumenta a conversão de vida para 15%.",
      },
    ],
  },

  {
    id: "hasHomingProjectiles",
    maxLevel: 1,
    initialValues: { value: false },
    levels: [
      {
        title: "Olho do Caçador",
        description: "Projéteis perseguem inimigos.",
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
        title: "Explosão Cadavérica",
        description: "Inimigos explodem ao morrer, causando 3 de dano em área.",
        apply: (p) => {
          p.upgrades.corpseExplosion.damage = 3;
          p.upgrades.corpseExplosion.radius = 50;
        },
      },
    ],
  },

  {
    id: "lightningStrike",
    maxLevel: 10,
    initialValues: { timer: 0 },
    apply: (p, levelIndex) => {
      const upgradeData = upgradePool.find((up) => up.id === "lightningStrike");
      const newStats = upgradeData.levels[levelIndex].stats;
      Object.assign(p.upgrades.lightningStrike, newStats);
    },
    levels: (() => {
      const romanNumerals = [
        "I",
        "II",
        "III",
        "IV",
        "V",
        "VI",
        "VII",
        "VIII",
        "IX",
        "X",
      ];
      return Array.from({ length: 10 }, (_, i) => {
        const count = 1 + i * 3;
        const damage = 3 + i * 2;
        const cooldown = 8000 - i * 300;
        return {
          title: `Tempestade ${romanNumerals[i]}`,
          description: `${count} raio(s) caem a cada ${
            cooldown / 1000
          }s causando ${damage} de dano.`,
          stats: {
            count: count,
            damage: damage,
            cooldown: cooldown,
            radius: 40,
          },
        };
      });
    })(),
  },

  {
    id: "ricochet",
    maxLevel: 3,
    initialValues: { value: 0 },
    apply: (p) => {
      p.upgrades.ricochet.value += 1;
    },
    levels: [
      { title: "Ricochete I", description: "Tiros quicam 1 vez." },
      { title: "Ricochete II", description: "Tiros quicam 2 vezes." },
      { title: "Ricochete III", description: "Tiros quicam 3 vezes." },
    ],
  },

  {
    id: "pierce",
    maxLevel: 3,
    initialValues: { value: 0 },
    apply: (p) => {
      p.upgrades.pierce.value += 1;
    },
    levels: [
      { title: "Perfuração I", description: "Tiros perfuram 1 inimigo." },
      { title: "Perfuração II", description: "Tiros perfuram 2 inimigos." },
      { title: "Perfuração III", description: "Tiros perfuram 3 inimigos." },
    ],
  },

  {
    id: "shrapnel",
    maxLevel: 1,
    initialValues: { value: 0 },
    levels: [
      {
        title: "Estilhaços",
        description: "Tiros soltam 3 mini-projéteis ao colidir.",
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
        title: "Combustão",
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
    maxLevel: 5,
    initialValues: { currentKills: 0 },
    apply: (p, levelIndex) => {
      const newStats = upgradePool.find((up) => up.id === "bloodthirst").levels[
        levelIndex
      ].stats;
      Object.assign(p.upgrades.bloodthirst, newStats);
    },
    levels: [
      {
        title: "Sede de Sangue I",
        description: "Cura 5 de HP a cada 10 inimigos derrotados.",
        stats: { healAmount: 5, killsPerHeal: 10 },
      },
      {
        title: "Sede de Sangue II",
        description: "Cura 7 de HP a cada 10 inimigos derrotados.",
        stats: { healAmount: 7, killsPerHeal: 10 },
      },
      {
        title: "Sede de Sangue III",
        description: "Cura 10 de HP a cada 10 inimigos derrotados.",
        stats: { healAmount: 10, killsPerHeal: 10 },
      },
      {
        title: "Sede de Sangue IV",
        description: "Cura 10 de HP a cada 8 inimigos derrotados.",
        stats: { healAmount: 10, killsPerHeal: 8 },
      },
      {
        title: "Sede de Sangue V",
        description: "Cura 15 de HP a cada 5 inimigos derrotados.",
        stats: { healAmount: 15, killsPerHeal: 5 },
      },
    ],
  },

  {
    id: "temp_armor",
    maxLevel: 1,
    initialValues: { value: 0, timer: 0 },
    levels: [
      {
        title: "Bênção do Sábio",
        description: "Ganha +15 de armadura por 25s ao subir de nível.",
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
    initialValues: {
      /* ... */
    },
    levels: [
      {
        title: "Fênix",
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
        description: "Causa dano em área ao ser atingido.",
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
    apply: (p) => {
      p.addOrb("shooter");
    },
    levels: [
      {
        title: "Orbe de Disparo I",
        description: "Adiciona um orbe que atira com você.",
      },
      { title: "Orbe de Disparo II", description: "Adiciona um segundo orbe." },
      {
        title: "Orbe de Disparo III",
        description: "Adiciona um terceiro orbe.",
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
  {
    id: "xp_boost",
    maxLevel: 3,
    initialValues: { multiplier: 1.0 }, // Começa com 1.0 (100% do XP, sem bônus)
    
    // Padrão "Ação Repetida": a cada nível, adiciona 0.2 (20%) ao multiplicador.
    apply: (p) => {
      p.upgrades.xp_boost.multiplier += 0.2;
    },
    
    levels: [
      {
        title: "Sabedoria do Mago I",
        description: "Ganha 20% a mais de XP ao derrotar inimigos."
      },
      {
        title: "Sabedoria do Mago II",
        description: "Bônus de XP aumentado para 40%."
      },
      {
        title: "Sabedoria do Mago III",
        description: "Bônus de XP aumentado para 60%."
      },
    ]
  },
];

const isMobile =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  ); //isMobileUserAgent();
const DEBUG = false;

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
