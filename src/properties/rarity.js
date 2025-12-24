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
    Mythic: { g1: '#b02929', g2: '#ffb347', g3: '#ffb347', g4: '#ff8a00', color: '#000' },
    Special: { g1: '#4a148c', g2: '#9c27b0', g3: '#ba68c8', g4: '#7b1fa2', color: '#fff' }
};

export const Rarity = {
    key: 'Rarity',
    getValue(card) {
        return card.rarity.slice(0, 1).toUpperCase() + card.rarity.slice(1);
    },
    style(value) {
        const s = rarityStyles[value] || rarityStyles.Common;
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
