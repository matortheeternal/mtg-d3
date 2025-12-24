import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import setsMetadata from '../data/sets.json' with { type: 'json' };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SETS_DIR = path.join(__dirname, '..', 'public', 'sets');
const OUTPUT_FILE = path.join(__dirname, '..', 'public', 'availableSets.json');

/**
 * Reads all JSON files from the sets directory and returns their codes and names.
 * @returns {Array<{code: string, name: string}>} Array of set objects with code and name
 */
function getSetNames() {
    const files = fs.readdirSync(SETS_DIR);

    const setCodes = files
        .filter(file => path.extname(file).toLowerCase() === '.json')
        .map(file => path.basename(file, '.json'))
        .sort();

    return setCodes.map(code => {
        const setMetadata = setsMetadata.find(set => set.code === code);
        return {
            code,
            name: setMetadata?.name || code
        };
    });
}

/**
 * Writes the available sets to a JSON file.
 * @param {Array<{code: string, name: string}>} sets - Array of set objects
 */
function writeAvailableSets(sets) {
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(sets, null, 2), 'utf8');
    console.log(`Successfully wrote ${sets.length} sets to ${OUTPUT_FILE}`);
}

// Main execution
try {
    const setNames = getSetNames();
    writeAvailableSets(setNames);
} catch (error) {
    console.error('Error generating set manifest:', error);
    process.exit(1);
}
