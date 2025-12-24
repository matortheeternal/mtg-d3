import * as d3 from 'd3';
import { createHierarchy } from '../createHierarchy.js';

export function createZoomableSunburst(data, levels, width = 1200, height = 1200) {
    const hierarchyData = createHierarchy(data, levels);
    const radius = width / 6;

    // Create the color scale.
    const color = d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow, hierarchyData.children.length + 1));

    // Compute the layout.
    const hierarchy = d3.hierarchy(hierarchyData)
        .sum(d => d.value)
        .sort((a, b) => b.value - a.value);
    const root = d3.partition()
        .size([2 * Math.PI, hierarchy.height + 1])
        (hierarchy);
    root.each(d => d.current = d);

    // Create the arc generator.
    const arc = d3.arc()
        .startAngle(d => d.x0)
        .endAngle(d => d.x1)
        .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005))
        .padRadius(radius * 1.5)
        .innerRadius(d => d.y0 * radius)
        .outerRadius(d => Math.max(d.y0 * radius, d.y1 * radius - 1))

    // Create the SVG container.
    const svg = d3.create("svg")
        .attr("viewBox", [-width / 2, -height / 2, width, width])
        .style("font", "10px sans-serif");

    // Append the arcs.
    const path = svg.append("g")
        .selectAll("path")
        .data(root.descendants().slice(1))
        .join("path")
        .attr("fill", d => {
            while (d.depth > 1) d = d.parent;
            return d.data.style?.fill || color(d.data.name);
        })
        .attr("fill-opacity", d => {
            if (d.data?.name === 'None') return 0;
            return arcVisible(d.current) ? (d.children ? 1 : 0.6) : 0
        })
        .attr("pointer-events", d => {
            if (d.data?.name === 'None') return 0;
            return arcVisible(d.current) ? "auto" : "none"
        })
        .attr("d", d => arc(d.current));

    // Make them clickable if they have children.
    path.filter(d => d.children)
        .style("cursor", "pointer")
        .on("click", clicked);

    const format = d3.format(",d");
    path.append("title")
        .text(d => {
            const ancestors = d.ancestors().slice(0, -1);
            const ancestorNames = ancestors.map(d => d.data.name).reverse();
            return `${ancestorNames.join("/")}\n${format(d.value)}`;
        });

    const label = svg.append("g")
        .attr("pointer-events", "none")
        .attr("text-anchor", "middle")
        .style("user-select", "none")
        .selectAll("text")
        .data(root.descendants().slice(1))
        .join("text")
        .attr('font-size', '14px')
        .attr("dy", "0.35em")
        .attr("fill", d => {
            while (d.depth > 1) d = d.parent;
            return d.data.style?.color || '#000';
        })
        .attr("fill-opacity", d => {
            if (d.data?.name === 'None') return 0;
            return +labelVisible(d.current);
        })
        .attr("transform", d => labelTransform(d.current))
        .text(d => `${d.data.name} (${Math.round(d.value / d.parent.value * 100)}%)`);

    const parent = svg.append("circle")
        .datum(root)
        .attr("r", radius)
        .attr("fill", "none")
        .attr("pointer-events", "all")
        .on("click", clicked);

    // Handle zoom on click.
    function clicked(event, p) {
        parent.datum(p.parent || root);

        root.each(d => d.target = {
            x0: Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
            x1: Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
            y0: Math.max(0, d.y0 - p.depth),
            y1: Math.max(0, d.y1 - p.depth)
        });

        const t = svg.transition().duration(event.altKey ? 7500 : 750);

        path.transition(t)
            .tween("data", d => {
                const i = d3.interpolate(d.current, d.target);
                return t => d.current = i(t);
            })
            .filter(function(d) {
                return +this.getAttribute("fill-opacity") || arcVisible(d.target);
            })
            .attr("fill-opacity", d => {
                if (d.data?.name === 'None') return 0;
                return arcVisible(d.target) ? (d.children ? 1 : 0.6) : 0
            })
            .attr("pointer-events", d => {
                return d.data.Name !== 'None' || arcVisible(d.target)
                    ? "auto"
                    : "none";
            })
            .attrTween("d", d => () => arc(d.current));

        label.filter(function(d) {
            return +this.getAttribute("fill-opacity") || labelVisible(d.target);
        }).transition(t)
            .attr("fill-opacity", d => {
                if (d.data?.name === 'None') return 0;
                return +labelVisible(d.target);
            })
            .attrTween("transform", d => () => labelTransform(d.current));
    }

    function arcVisible(d) {
        return d.y1 <= 3 && d.y0 >= 1 && d.x1 > d.x0;
    }

    function labelVisible(d) {
        return d.y1 <= 3 && d.y0 >= 1 && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.03;
    }

    function labelTransform(d) {
        const x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
        const y = (d.y0 + d.y1) / 2 * radius;
        return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
    }

    return svg.node();
}
