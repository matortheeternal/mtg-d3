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
