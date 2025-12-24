export function addGradients(svg, root) {
    const defs = svg.append('defs');
    root.descendants().forEach(d => {
        if (!d.data.style?.isGradient) return;
        const match = d.data.style.fill.match(/url\((#.+?)\)/);
        if (!match || !defs.select(match[1]).empty()) return;
        const grad = defs.append('linearGradient')
            .attr('id', match[1].slice(1))
            .attr('x1', '0%').attr('y1', '0%')
            .attr('x2', '100%').attr('y2', '100%');

        d.data.style.stops.forEach(s => {
            grad.append('stop')
                .attr('offset', s.offset)
                .attr('stop-color', s.color);
        });
    });
}
