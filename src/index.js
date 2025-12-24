import { createNestedTreemap } from './visualizations/nestedTreemap.js';
import {
    Rarity,
    SimpleColorIdentity,
    CombinedSubType,
    Type,
    SuperType,
    Power,
    Toughness,
    Keywords,
    CMC, Permanent, CreatureRace, CreatureClass, WordCount, Tags, Illustrator, PipCount
} from './cardProperties.js';
import { createCirclePacking } from './visualizations/circlePacking.js';
import { createZoomableSunburst } from './visualizations/zoomableSunburst.js';

async function loadSets(setSelect) {
    try {
        const response = await fetch('/availableSets.json');
        const sets = await response.json();

        sets.forEach(set => {
            const option = document.createElement('option');
            option.value = set.code;
            option.textContent = `${set.name} (${set.code.toUpperCase()})`;
            setSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading available sets:', error);
    }
}

const chartTypes = {
    'nestedTreemap': {
        label: 'Nested Treemap',
        chartType: createNestedTreemap,
        maxProperties: 2
    },
    'circlePacking': {
        label: 'Circle Packing',
        chartType: createCirclePacking,
        maxProperties: 2
    },
    'zoomableSunburst': {
        label: 'Zoomable Sunburst',
        chartType: createZoomableSunburst,
        maxProperties: 3
    }
};

const availableProperties = [
    SimpleColorIdentity,
    CMC,
    Rarity,
    Type,
    CombinedSubType,
    Permanent,
    Keywords,
    Tags,
    CreatureRace,
    CreatureClass,
    SuperType,
    PipCount,
    Power,
    Toughness,
    WordCount,
    Illustrator,
];

const chartPresets = [{
    label: 'Custom',
    chartType: null,
    properties: null,
    isCustom: true
}, {
    label: 'Color-Type Treemap',
    chartType: createNestedTreemap,
    properties: [SimpleColorIdentity, Type]
}, {
    label: 'Color-Type Circle Packing',
    chartType: createCirclePacking,
    properties: [SimpleColorIdentity, Type]
}, {
    label: 'Color-Type-Subtype Sunburst',
    chartType: createZoomableSunburst,
    properties: [SimpleColorIdentity, Type, CombinedSubType]
}, {
    label: 'Color-Rarity-Type Sunburst',
    chartType: createZoomableSunburst,
    properties: [SimpleColorIdentity, Rarity, Type]
}];

function loadCharts(chartSelect) {
    chartPresets.forEach((chart, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = chart.label;
        chartSelect.appendChild(option);
    });
}

function loadChartTypes(chartTypeSelect) {
    Object.entries(chartTypes).forEach(([key, value]) => {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = value.label;
        chartTypeSelect.appendChild(option);
    });
}

function loadProperties(propertySelect) {
    availableProperties.forEach((property, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = property.key;
        propertySelect.appendChild(option);
    });
}

async function createChart() {
    const setSelect = document.getElementById('setSelect');
    const chartSelect = document.getElementById('chartSelect');
    const selectedSet = setSelect.value;
    const selectedChartIndex = chartSelect.value;
    const chartsDiv = document.getElementById('charts');

    if (!selectedSet || selectedChartIndex === '') {
        chartsDiv.innerHTML = '';
        return;
    }

    const selectedPreset = chartPresets[selectedChartIndex];

    let chartTypeFunc, properties;

    if (selectedPreset.isCustom) {
        const chartTypeSelect = document.getElementById('chartTypeSelect');
        const property1Select = document.getElementById('property1Select');
        const property2Select = document.getElementById('property2Select');
        const property3Select = document.getElementById('property3Select');

        if (!chartTypeSelect.value || !property1Select.value) {
            chartsDiv.innerHTML = '';
            return;
        }

        const selectedChartType = chartTypes[chartTypeSelect.value];
        chartTypeFunc = selectedChartType.chartType;

        properties = [availableProperties[property1Select.value]];
        if (property2Select.value !== '') {
            properties.push(availableProperties[property2Select.value]);
        }
        if (property3Select.value !== '' && selectedChartType.maxProperties >= 3) {
            properties.push(availableProperties[property3Select.value]);
        }
    } else {
        chartTypeFunc = selectedPreset.chartType;
        properties = selectedPreset.properties;
    }

    try {
        const response = await fetch(`/sets/${selectedSet}.json`);
        const data = await response.json();

        chartsDiv.innerHTML = '';
        chartsDiv.appendChild(chartTypeFunc(data, properties));
    } catch (error) {
        console.error(error);
        chartsDiv.innerHTML = `<p>Error loading visualization.</p>`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const setSelect = document.getElementById('setSelect');
    const chartSelect = document.getElementById('chartSelect');
    const chartTypeSelect = document.getElementById('chartTypeSelect');
    const property1Select = document.getElementById('property1Select');
    const property2Select = document.getElementById('property2Select');
    const property3Select = document.getElementById('property3Select');

    loadSets(setSelect);
    loadCharts(chartSelect);
    loadChartTypes(chartTypeSelect);
    loadProperties(property1Select);
    loadProperties(property2Select);
    loadProperties(property3Select);

    setSelect.addEventListener('change', createChart);
    chartSelect.addEventListener('change', createChart);
    chartTypeSelect.addEventListener('change', createChart);
    property1Select.addEventListener('change', createChart);
    property2Select.addEventListener('change', createChart);
    property3Select.addEventListener('change', createChart);
});
