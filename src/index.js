import { createNestedTreemap } from './visualizations/nestedTreemap.js';
import { createCirclePacking } from './visualizations/circlePacking.js';
import { createZoomableIcicle } from './visualizations/zoomableIcicle.js';
import { createZoomableSunburst } from './visualizations/zoomableSunburst.js';
import properties from './properties/index.js';

const availableProperties = Object.values(properties);
const { SimpleColorIdentity, Rarity, Type, CombinedSubType } = properties;

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
    },
    'zoomableIcicle': {
        label: 'Zoomable Icicle',
        chartType: createZoomableIcicle,
        maxProperties: 3
    }
};

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
    label: 'Color-Rarity Circle Packing',
    chartType: createCirclePacking,
    properties: [SimpleColorIdentity, Rarity]
}, {
    label: 'Color-Type-Subtype Sunburst',
    chartType: createZoomableSunburst,
    properties: [SimpleColorIdentity, Type, CombinedSubType]
}, {
    label: 'Rarity-Color-Type Icicle',
    chartType: createZoomableIcicle,
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

function getSelectedProperties(selectedChartType) {
    return ['property1Select', 'property2Select', 'property3Select']
        .map((str, index) => {
            const select = document.getElementById(str);
            const useProperty = (select.value !== '')
                && (index !== 2 || selectedChartType.maxProperties >= 3);
            return useProperty
                ? availableProperties[select.value]
                : null;
        }).filter(Boolean);
}

function resolveSelectedChart(selectedPreset) {
    if (!selectedPreset?.isCustom) return { ...selectedPreset };

    const chartTypeSelect = document.getElementById('chartTypeSelect');
    if (!chartTypeSelect.value) return [];

    const selectedChartType = chartTypes[chartTypeSelect.value];
    const properties = getSelectedProperties(selectedChartType);
    if (!properties.length) return [];

    return {
        chartTypeFunc: selectedChartType.chartType,
        properties
    };
}

async function createChart() {
    const setSelect = document.getElementById('setSelect');
    const chartSelect = document.getElementById('chartSelect');
    const chartsDiv = document.getElementById('charts');

    const selectedPreset = chartPresets[chartSelect.value];
    const { chartTypeFunc, properties } = resolveSelectedChart(selectedPreset);
    if (!chartTypeFunc || !setSelect.value) return;

    try {
        const response = await fetch(`/sets/${setSelect.value}.json`);
        const data = await response.json();

        chartsDiv.innerHTML = '';
        const setName = setSelect.options[setSelect.selectedIndex].textContent;
        chartsDiv.appendChild(chartTypeFunc(data, properties, setName));
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
