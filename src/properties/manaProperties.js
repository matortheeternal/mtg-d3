export const CMC = {
    key: 'Converted Mana Cost',
    getValue(card) {
        return parseInt(card.manaValue) > 7 ? '8+' : card.manaValue;
    }
};

export const PipCount = {
    key: 'Pip Count',
    getValue(card) {
        const matches = card.manaCost.match(/{[^\d}]+}/gi);
        return matches?.length || 0;
    }
};
