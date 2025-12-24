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
        const wordCount = card.rulesTexts.reduce((count, text) => {
            return count + text.split(/\s+/).length;
        }, 0);
        return getRangeString(wordCount);
    }
};
