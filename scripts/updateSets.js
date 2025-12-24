import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import ScryfallCard from '@sigil-sifter/magic-scryfall';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CARDS_FILENAME = 'default-cards-20251223100945.json';
const CARDS_PATH = path.join(__dirname, '..', 'data', CARDS_FILENAME);

const cards = JSON.parse(fs.readFileSync(CARDS_PATH, 'utf8'));

const AVAILABLE_SETS_PATH = path.join(__dirname, '..', 'public', 'availableSets.json');
const availableSets = JSON.parse(fs.readFileSync(AVAILABLE_SETS_PATH, 'utf8'));

const tagTests = {
    graveyard: /\bgraveyard\b/i,
    '+1/+1 counter': /\b\+1\/\+1 counters?\b/i,
    artifact: /\bartifact\b/i,
    token: /\btoken\b/i,
    energy: /{E}/i,
    draw: /\bdraw\b/i,
    removal: {
        test(str) {
            return /\b(destry|exile)( another)? (target|each|every|all)\b/i.test(str)
                || /\bloses all abilities\b/i.test(str)
                || /\bdamage to (?:any )?target\b/.test(str)
                || /\bgets -\d\/-\d\b/i.test(str);
        }
    }
};

const knownSuperTypes = [
    'Basic', 'World', 'Legendary', 'Ongoing',
    'Snow', 'Kindred', 'Tribal'
];

function groupTypes(card) {
    const superTypes = [], types = [], subTypes = [];
    card.typeLines.forEach(line => {
        const [prefixTypes, suffixTypes] = line.split(' — ');
        prefixTypes.split(' ').forEach(t => {
            const target = knownSuperTypes.includes(t) ? superTypes : types;
            target.push(t);
        });
        if (suffixTypes?.length)
            subTypes.push(...suffixTypes.split(' '));
    });
    return { superTypes, types, subTypes };
}

availableSets.forEach(set => {
    const SET_CODE = set.code;
    console.log(`Processing set: ${SET_CODE}`);

    const dataToExport = cards.filter(card => {
        return card.set === SET_CODE
            && card.booster;
    }).map(card => {
        return new ScryfallCard(null, card);
    }).map(card => {
        const { superTypes, types, subTypes } = groupTypes(card);

        return {
            id: `${card.set.code}-${card.collectorNumber}`,
            name: card.names.join(' // '),

            // Identity
            colors: card.colors,
            colorIdentity: card.colorIdentity,
            manaValue: card.manaValues[0],
            manaCost: card.manaCosts[0],

            // Types
            superTypes,
            types,
            subTypes,

            // Rarity & stuff
            rarity: card.rarity,

            // Stats (nullable)
            power: card.pts.map(pt => pt.power)[0] || null,
            toughness: card.pts.map(pt => pt.toughness)[0] || null,
            loyalty: card.loyalty,

            // tags
            tags: Object.entries(tagTests).map(([key, value]) => {
                if (card.rulesTexts.some(rt => value.test(rt))) return key;
            }).filter(Boolean),

            // Rules
            rulesTexts: card.rulesTexts,
            keywords: card.keywords,
            produces: card.produces,

            // Misc
            illustrators: card.artists,

            // Provenance
            source: {
                type: 'scryfall',
                originalId: card.card.id,
                setCode: card.set.code
            }
        };
    });

    const OUTPUT_PATH = path.join(__dirname, '..', 'public/sets', SET_CODE + '.json');
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(dataToExport, null, 2));
    console.log(`Exported ${dataToExport.length} cards for set ${SET_CODE}`);
});
