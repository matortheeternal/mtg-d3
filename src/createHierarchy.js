/**
 * Groups items by a property object.
 * @param {Array} items - The items to group
 * @param {Object} property - The property object with getValue function to extract grouping value from each item
 * @returns {Object} Object with keys as group names and values as arrays of items
 */
function groupItemsByProperty(items, property) {
    const grouped = {};

    function addValue(value, item) {
        grouped[value] ||= [];
        grouped[value].push(item);
    }

    items.forEach(item => {
        const value = property.getValue(item);
        if (Array.isArray(value)) {
            value.forEach(v => addValue(v, item));
        } else {
            addValue(value, item);
        }
    });

    return grouped;
}

/**
 * Creates a hierarchy node with name, property, and children.
 * @param {string} name - The node name
 * @param {Object} property - The property this node represents
 * @param {Array} children - The node's children
 * @returns {Object} Hierarchy node object
 */
function createHierarchyNode(name, property, children) {
    return {
        name,
        property: property.key,
        style: property.style?.(name),
        children
    };
}

function createFinalNode(name, property, children) {
    return {
        name,
        property: property.key,
        style: property.style?.(name),
        value: children.length
    };
}

/**
 * Recursively builds hierarchy levels from grouped items.
 * @param {Array} items - The items to build hierarchy from
 * @param {Array<Object>} properties - The property objects for hierarchy levels
 * @param {number} level - The current hierarchy level
 * @returns {Array} Array of hierarchy nodes
 */
function buildHierarchyLevel(items, properties, level = 0) {
    if (level >= properties.length)
        return items;

    const currentProperty = properties[level];
    const grouped = groupItemsByProperty(items, currentProperty);

    return Object.entries(grouped).map(([key, children]) => {
        if (!key)
            return createFinalNode('None', currentProperty, children);
        if (level >= properties.length - 1)
            return createFinalNode(key, currentProperty, children);

        const nodeChildren = buildHierarchyLevel(children, properties, level + 1);
        return createHierarchyNode(key, currentProperty, nodeChildren);
    });
}

/**
 * Transforms a flat array of data into a hierarchical structure for D3.
 * @param {Array} data - The input array of data objects
 * @param {Array<Object>} properties - Ordered list of property objects with name and getValue for hierarchy levels
 * @returns {Object} D3-compatible hierarchy object with name and children properties
 */
export function createHierarchy(data, properties) {
    if (!data || !Array.isArray(data) || data.length === 0)
        return { name: 'root', children: [] }
    if (!properties || !Array.isArray(properties) || properties.length === 0)
        return { name: 'root', children: data }

    return {
        name: 'root',
        children: buildHierarchyLevel(data, properties)
    };
}
