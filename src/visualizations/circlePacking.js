import * as d3 from 'd3';
import { createHierarchy } from '../createHierarchy.js';
import { addGradients } from '../addGradient.js';

/**
 * Creates a circle packing visualization.
 * @param {Array} data - The flat array of data objects
 * @param {Array<Object>} properties - Ordered list of property objects for hierarchy levels
 * @param {number} width - Width of the visualization
 * @param {number} height - Height of the visualization
 */
export function createCirclePacking(data, properties, width = 1200, height = 1000) {
    const hierarchyData = createHierarchy(data, properties);

    const root = d3.hierarchy(hierarchyData)
        .sum(d => d.value || 0)
        .sort((a, b) => b.value - a.value);

    const packLayout = d3.pack()
        .size([width, height])
        .padding(3);

    packLayout(root);

    const svg = d3.create('svg')
        .attr('viewBox', `0 0 ${width} ${height}`)
        .attr('width', '100%')
        .attr('height', '100%');

    addGradients(svg, root);

    const nodes = svg.selectAll('g')
        .data(root.descendants())
        .join('g')
        .attr('transform', d => `translate(${d.x},${d.y})`);

    nodes.append('circle')
        .attr('r', d => d.r)
        .attr('fill', d => d.data.style?.fill || 'rgba(255, 255, 255, 0.5)')
        .attr('stroke', '#fff')
        .attr('stroke-width', 1)
        .style('opacity', d => d.children ? 0.7 : 0.9);

    nodes.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '0.3em')
        .style('font-size', d => Math.min(d.r / 3, 16) + 'px')
        .style('fill', d => d.data.style?.color || '#000')
        .style('pointer-events', 'none')
        .style('user-select', 'none')
        .each(function(d) {
            if (d.children || d.r <= 25) return;
            const text = d3.select(this);
            text.append('tspan')
                .attr('x', 0)
                .attr('dy', '-0.2em')
                .text(d.data.name);
            text.append('tspan')
                .attr('x', 0)
                .attr('dy', '1.2em')
                .style('font-weight', 'bold')
                .text(`(${d.value})`);
        });

    nodes.append('title')
        .text(d => `${d.data.property ? d.data.property + ': ' : ''}${d.data.name}\nCount: ${d.value || 0}`);

    return svg.node();
}
