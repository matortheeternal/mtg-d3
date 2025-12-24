import { creatureRaces, multiWordRaces } from './creatureRaces.js';
import creatureClasses from './creatureClasses.js';

const typePriority = [
    'Planeswalker', 'Creature', 'Instant', 'Sorcery',
    'Enchantment', 'Land', 'Artifact'
];

const permanentTypes = [
    'land', 'creature', 'artifact', 'enchantment',
    'planeswalker', 'battle', 'summon', 'eaturecray'
];

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

export const Permanent = {
    key: 'Is Permanent',
    getValue(card) {
        return card.types.some(t => permanentTypes.includes(t.toLowerCase()))
            ? 'Permanent'
            : 'Nonpermanet';
    }
};

export const CreatureRace = {
    key: 'Creature Race',
    getValue(card) {
        const combinedSubType = card.subTypes.join(' ');
        const races = multiWordRaces.find(mwr => {
            return combinedSubType.includes(mwr);
        }) || card.subTypes.filter((subtype, index) => {
            return creatureRaces.includes(subtype)
                || (!creatureClasses.includes(subtype)
                    && index < card.subTypes.length - 1);
        });
        return races.length > 0 ? races.join(' ') : null;
    }
};

export const CreatureClass = {
    key: 'Creature Class',
    getValue(card) {
        const classes = card.subTypes.filter((subtype, index) => {
            return creatureClasses.includes(subtype)
                || (!creatureRaces.includes(subtype) && (index > 0));
        });
        return classes.length > 0 ? classes.join(' ') : null;
    }
};
