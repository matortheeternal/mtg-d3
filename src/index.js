import { createNestedTreemap } from './visualizations/nestedTreemap.js';
import { Rarity, SimpleColorIdentity, SubType, Type } from './cardProperties.js';
import { createCirclePacking } from './visualizations/circlePacking.js';
import { createZoomableSunburst } from './visualizations/zoomableSunburst.js';

document.addEventListener('DOMContentLoaded', () => {
    const setSelect = document.getElementById('setSelect');
    const chartsDiv = document.getElementById('charts');

    setSelect.addEventListener('change', async (event) => {
        const selectedSet = event.target.value;

        if (!selectedSet) {
            chartsDiv.innerHTML = '';
            return;
        }

        try {
            const response = await fetch(`/sets/${selectedSet}.json`);
            const data = await response.json();

            chartsDiv.innerHTML = '';
            const treeMap = createNestedTreemap(data, [
                SimpleColorIdentity,
                Type
            ]);
            chartsDiv.appendChild(treeMap);
            const circlePacking = createCirclePacking(data, [
                SimpleColorIdentity,
                Type
            ]);
            chartsDiv.appendChild(circlePacking);
            const sunburst = createZoomableSunburst(data, [
                SimpleColorIdentity,
                Type,
                SubType
            ]);
            chartsDiv.appendChild(sunburst);
            const sunburst2 = createZoomableSunburst(data, [
                Rarity,
                Type,
                SimpleColorIdentity
            ]);
            chartsDiv.appendChild(sunburst2);
        } catch (error) {
            console.error('Error loading set data:', error);
            chartsDiv.innerHTML = `<p>Error loading visualization:<br>${error}</p>`;
        }
    });
});
