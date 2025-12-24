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
    Uncommon: { g1: '#6c7d8f', g2: '#c0d6e5', g3: '#c0d6e5', g4: '#9ab4c8', color: '#000' },
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
    key: 'Type',
    getValue(card) {
        return typePriority.find((t) => card.types.includes(t));
    }
};

export const SubType = {
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

