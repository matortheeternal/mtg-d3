import * as d3 from 'd3';
import { createHierarchy } from '../createHierarchy.js';
import { addGradients } from '../addGradient.js';

export function createNestedTreemap(data, levels, width = 1200, height = 800) {
    const hierarchy = createHierarchy(data, levels);

    // Create a treemap layout
    const treemap = d3.treemap()
        .size([width, height])
        .paddingOuter(3)
        .paddingTop(19)
        .paddingInner(1)
        .round(true);

    // Create a root hierarchy and sum values
    const root = d3.hierarchy(hierarchy)
        .sum(d => d.value)
        .sort((a, b) => b.value - a.value);

    // Apply treemap layout
    treemap(root);

    // Create SVG container
    const svg = d3.create('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('viewBox', [0, 0, width, height])
        .style('font', '10px sans-serif');

    addGradients(svg, root);

    // 1. Draw Parent Groups FIRST (Background)
    const parents = svg.selectAll('g.parent')
        .data(root.descendants().filter(d => d.depth === 1))
        .join('g')
        .attr('class', 'parent')
        .attr('transform', d => `translate(${d.x0},${d.y0})`);

    parents.append('rect')
        .attr('width', d => d.x1 - d.x0)
        .attr('height', d => d.y1 - d.y0)
        .attr('fill', d => d.data.style?.fill || '#222')
        .attr('stroke', d => d.data.style?.fill || '#ccc');

    parents.append('text')
        .attr('x', 3)
        .attr('y', 13)
        .text(d => `${d.data.name} (${d.value})`)
        .attr('fill', d => d.data.style?.color || '#fff')
        .attr('font-weight', 'bold')
        .style('font-size', '12px');

    // Create cells for each leaf node
    const leaf = svg.selectAll('g.leaf')
        .data(root.leaves())
        .join('g')
        .attr('class', 'leaf')
        .attr('transform', d => `translate(${d.x0},${d.y0})`);

    // Add rectangles
    leaf.append('rect')
        .attr('fill', d => d.data.style?.fill ||  'rgba(255, 255, 255, 0.5)')
        .attr('fill-opacity', 0.8)
        .attr('width', d => d.x1 - d.x0)
        .attr('height', d => d.y1 - d.y0)
        .attr('stroke', '#fff');

    // Add text labels for leaf nodes
    leaf.append('foreignObject')
        .attr('width', d => Math.max(0, d.x1 - d.x0))
        .attr('height', d => Math.max(0, d.y1 - d.y0))
        .append('xhtml:div')
        .attr('class', 'label-container')
        .style('width', '100%')
        .style('height', '100%')
        .style('display', 'flex')
        .style('text-align', 'center')
        .style('align-items', 'center')
        .style('justify-content', 'center')
        .style('box-sizing', 'border-box')
        .style('pointer-events', 'none')
        .style('font-size', '14px')
        .html(d => {
            return (
                `<div class="label-content">
                    ${d.data.name}<br/><strong>(${d.value})</strong>
                </div>`
            );
        })
        .each(function(d) {
            const container = this;
            const content = container.querySelector('.label-content');
            setTimeout(() => {
                const p = 4;
                const boxWidth = (d.x1 - d.x0) - p;
                const boxHeight = (d.y1 - d.y0) - p;
                const contentWidth = content.offsetWidth;
                const contentHeight = content.offsetHeight;

                if (contentWidth > 0 && contentHeight > 0) {
                    const scaleW = boxWidth / contentWidth;
                    const scaleH = boxHeight / contentHeight;
                    content.style.scale = Math.min(1, scaleW, scaleH);
                }
            }, 0)
        });

    return svg.node();
}
