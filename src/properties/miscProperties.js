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
