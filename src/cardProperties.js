const colorNames = {
    'W': 'White',
    'U': 'Blue',
    'B': 'Black',
    'R': 'Red',
    'G': 'Green'
};

const colorStyles = {
    Colorless: { fill: '#888', color: '#FFF' },
    Multicolor: { fill: '#eac871', color: '#000' },
    White: { fill: '#f5f0ce', color: '#000' },
    Blue: { fill: '#1d90dd', color: '#FFF' },
    Black: { fill: '#150B00', color: '#FFF' },
    Red: { fill: '#D3202A', color: '#FFF' },
    Green: { fill: '#00733E', color: '#FFF' },
};

const rarityStyles = {
    Common: { g1: 'black', g2: 'black', g3: 'black', g4: 'black', color: '#FFF' },
    Uncommon: {
        g1: '#6c7d8f',
        g2: '#c0d6e5',
        g3: '#c0d6e5',
        g4: '#9ab4c8',
        color: '#000'
    },
    Rare: { g1: '#876c13', g2: '#f6e8a3', g3: '#f6e8a3', g4: '#d7bf55', color: '#000' },
    Mythic: { g1: '#b02929', g2: '#ffb347', g3: '#ffb347', g4: '#ff8a00', color: '#000' }
};

const typePriority = [
    'Planeswalker',
    'Creature',
    'Instant',
    'Sorcery',
    'Enchantment',
    'Land',
    'Artifact'
];

export const SimpleColorIdentity = {
    key: 'Color',
    getValue(card) {
        if (!card.colorIdentity.length) return 'Colorless';
        if (card.colorIdentity.length > 1) return 'Multicolor';
        return colorNames[card.colorIdentity[0]];
    },
    style(value) {
        return colorStyles[value];
    }
};

export const Type = {
    key: 'Card Type',
    getValue(card) {
        return typePriority.find((t) => card.types.includes(t));
    }
};

export const SuperType = {
    key: 'SuperType',
    getValue(card) {
        return card.superTypes;
    }
};

export const CombinedSubType = {
    key: 'Subtype',
    getValue(card) {
        return card.subTypes.join(' ');
    }
};

export const Rarity = {
    key: 'Rarity',
    getValue(card) {
        return card.rarity.slice(0, 1).toUpperCase() + card.rarity.slice(1);
    },
    style(value) {
        const s = rarityStyles[value] || rarityStyles.common;
        return {
            fill: `url(#grad-rarity-${value})`,
            color: s.color,
            isGradient: true,
            stops: [
                { offset: '0%', color: s.g1 },
                { offset: '45%', color: s.g2 },
                { offset: '55%', color: s.g3 },
                { offset: '100%', color: s.g4 }
            ]
        };
    }
};

export const CMC = {
    key: 'Converted Mana Cost',
    getValue(card) {
        return parseInt(card.manaValue) > 7 ? '8+' : card.manaValue;
    }
};

const permanentTypes = [
    'land', 'creature', 'artifact', 'enchantment',
    'planeswalker', 'battle', 'summon', 'eaturecray'
];

export const Permanent = {
    key: 'Is Permanent',
    getValue(card) {
        return card.types.some(t => permanentTypes.includes(t.toLowerCase()));
    }
};

const creatureRaces = [
    'Alien', 'Ape', 'Azra', 'Centaur', 'Cyclops', 'Dauthi', 'Dryad', 'Dwarf', 'Elf',
    'Faerie', 'Giant', 'Gnome', 'Goblin', 'Gorgon', 'Hag', 'Halfling', 'Human', 'Kithkin',
    'Kobold', 'Kor', 'Merfolk', 'Metathran', 'Minotaur', 'Moonfolk', 'Noggle', 'Ogre',
    'Orc', 'Ouphe', 'Satyr', 'Siren', 'Slith', 'Soltari', 'Surrakar', 'Thalakos', 'Troll',
    'Vedalken', 'Werewolf', 'Yeti', 'Ainok', 'Amphin', 'Aven', 'Bearfolk', 'Cactusfolk',
    'Chordatans', 'Khenra', 'Kappa', 'Kitsune', 'Leonin', 'Loxodon', 'Nantuko', 'Kraul',
    'Naga', 'Nezumi', 'Orochi', 'Rakshasa', 'Raccoonfolk', 'Rhox', 'Saurids', 'Viashino',
    'Wolfir', 'Aetherborn', 'Angel', 'Archon', 'Avatar', 'Bringer', 'Demigod', 'Djinn',
    'Efreet', 'God', 'Inkling', 'Lamia', 'Nymph', 'Reflection', 'Shade', 'Shapeshifter',
    'Skeleton', 'Sliver', 'Specter', 'Spirit', 'Thrull', 'Vampire', 'Wraith', 'Zombie',
    'Beeble', 'Carrier', 'Demon', 'Devil', 'Dragon', 'Drone', 'Eldrazi', 'Elemental',
    'Eye', 'Glimmer', 'Gremlin', 'Harpy', 'Homarid', 'Homunculus', 'Horror', 'Illusion',
    'Imp', 'Incarnation', 'Kirin', 'Lammasu', 'Nephilim', 'Nightmare', 'Nightstalker',
    'Phyrexian', 'Spawn', 'Sphinx', 'Spirit', 'Thallid', 'Treefolk', 'Zubera',
    'Cephallid', 'Thallid', 'Sporoloth', 'Chimera', 'Mutant', 'Orgg', 'Volver', 'Weird',
    'Antelope', 'Ape', 'Armadillo', 'Aurochs', 'Badger', 'Bat', 'Bear', 'Beaver', 'Bird',
    'Boar', 'Camel', 'Capybara', 'Caribou', 'Cat', 'Coyote', 'Crab', 'Crocodile',
    'Dinosaur', 'Dog', 'Elephant', 'Elk', 'Ferret', 'Fish', 'Fox', 'Frog', 'Goat',
    'Hippo', 'Horse', 'Hyena', 'Insect', 'Jackal', 'Jellyfish', 'Leech', 'Lizard',
    'Llama', 'Mite', 'Mole', 'Mongoose', 'Monkey', 'Mouse', 'Nautilus', 'Octopus', 'Ox',
    'Oyster', 'Otter', 'Pangolin', 'Porcupine', 'Possum', 'Rabbit', 'Rat', 'Rhino',
    'Sable', 'Salamander', 'Scorpion', 'Shark', 'Sheep', 'Skunk', 'Sloth', 'Slug',
    'Snail', 'Snake', 'Spider', 'Sponge', 'Squid', 'Squirrel', 'Starfish', 'Trilobite',
    'Turtle', 'Weasel', 'Whale', 'Wolf', 'Wolverine', 'Wombat', 'Worm',
    'Atog', 'Basilisk', 'Beast', 'Brushwagg', 'Camarid', 'Cockatrice', 'Dragon', 'Drake',
    'Gargoyle', 'Griffin', 'Hellion', 'Hippogriff', 'Hydra', 'Kavu', 'Kraken',
    'Leviathan', 'Lhurgoyf', 'Licid', 'Manticore', 'Mutant', 'Pegasus', 'Pest',
    'Phelddagrif', 'Phoenix', 'Serpent', 'Slith', 'Sliver', 'Spike', 'Unicorn',
    'Varmint', 'Wurm', 'Fungi', 'Plant', 'Saproling', 'Splinter', 'Germ', 'Ooze',
    'Assembly-Worker', 'Blinkmoth', 'Chimera', 'Construct', 'Dreadnought', 'Gnome',
    'Golem', 'Juggernaut', 'Masticore', 'Myr', 'Pentavite', 'Pest', 'Prism', 'Robot',
    'Sculpture', 'Servo', 'Scarecrow', 'Tetravite', 'Thopter', 'Toy', 'Triskelavite',
    'Egg', 'Orb', 'Sand', 'Wall', 'Gith', 'Gnoll', 'Halfling', 'Tiefling', 'Beholder',
    'Hamster', 'Walrus', 'Astartes', 'Cyberman', 'Necron', 'Primarch', 'Synth',
    'Adipose', 'Ents', 'Hobbit', 'Judoon', 'Kaleds', 'Lupari', 'Menoptera', 'Silent',
    'Sontarans', 'Sycorax', 'Thijarians', 'Zyongs', 'C\'Tan', 'Maiar', 'Dalek', 'Tyranid',
    'Atraxi', 'Boekind',
];

const multiWordRaces = ['Sea Devils', 'Ice Warriors', 'Time Lord', 'Weeping Angels']

const creatureClasses = ['Advisor', 'Ally', 'Archer', 'Army', 'Artificer', 'Assassin',
    'Barbarian', 'Bard', 'Berserker', 'Child', 'Citizen', 'Cleric', 'Clown', 'Coward',
    'Deserter', 'Detective', 'Doctor', 'Drone', 'Druid', 'Egg†', 'Elder', 'Employee',
    'Flagbearer', 'Gamer', 'Guest', 'Hero', 'Inquisitor', 'Knight', 'Mercenary', 'Minion',
    'Monger', 'Monk', 'Mystic', 'Ninja', 'Noble', 'Nomad', 'Peasant', 'Performer',
    'Pilot', 'Pirate', 'Praetor', 'Processor', 'Ranger', 'Rebel', 'Rigger', 'Rogue',
    'Samurai', 'Scion†', 'Scientist', 'Scout', 'Serf', 'Shaman', 'Soldier', 'Spawn',
    'Spellshaper', 'Survivor', 'Tentacle†', 'Warlock', 'Warrior', 'Wizard', 'Attendee',
    'Bureaucrat', 'Designer', 'Elves', 'Fighter', 'Grandchild', 'Hatificer', 'Head',
    'Lady of Proper Etiquette', 'Lord', 'Mime', 'Paratrooper', 'Reveler', 'Spy',
    'Townsfolk', 'Villain', 'Waiter', 'Wrestler', 'Armored', 'Artist', 'Athlete', 'Boxer',
    'Champion', 'Chef', 'Judge', 'Alchemist', 'Bodyguard', 'Bureaucrat', 'El-Hajjâj',
    'Enchantress', 'Flying Men', 'Guardian', 'Hero', 'Legend', 'Lord', 'Mage', 'Rag Man',
    'Sage', 'Smith', 'Stangg Twin', 'Tactician', 'Townsfolk', 'Witch'];

export const CreatureRace = {
    key: 'Creature Race',
    getValue(card) {
        const combinedSubType = card.subTypes.join(' ');
        return multiWordRaces.find(mwr => {
            return combinedSubType.includes(mwr);
        }) || card.subTypes.filter(subtype => {
            return creatureRaces.includes(subtype)
                || (!creatureClasses.includes(subtype)
                    && index < card.subTypes.length - 1);
        }).join(' ');
    }
};

export const CreatureClass = {
    key: 'Creature Class',
    getValue(card) {
        return card.subTypes.filter(subtype => {
            return creatureClasses.includes(subtype)
                || (!creatureRaces.includes(subtype) && (index > 0));
        }).join(' ');
    }
};

export const Power = {
    key: 'Power',
    getValue(card) {
        return card.power;
    }
};

export const Toughness = {
    key: 'Toughness',
    getValue(card) {
        return card.toughness;
    }
};

function getRangeString(value) {
    if (value <= 0) return '0';

    const size = 5;
    const lower = Math.floor((value - 1) / size) * size + 1;
    const upper = lower + (size - 1);

    return `${lower}-${upper}`;
}

export const WordCount = {
    key: 'Word Count',
    getValue(card) {
        const wordCount = card.rulesTexts().reduce((count, text) => {
            return count + text.length;
        }, 0);
        return getRangeString(wordCount);
    }
};

export const Keywords = {
    key: 'Keywords',
    getValue(card) {
        return card.keywords;
    }
};

export const Tags = {
    key: 'Tags',
    getValue(card) {
        return card.tags;
    }
};

export const Illustrator = {
    key: 'Illustrator',
    getValue(card) {
        return card.illustrators;
    }
};

export const PipCount = {
    key: 'Pip Count',
    getValue(card) {
        const matches = card.manaCost.match(/{[^\d}]+}/gi);
        return matches?.length || 0;
    }
};
