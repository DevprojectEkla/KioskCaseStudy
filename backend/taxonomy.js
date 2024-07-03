const fs = require('fs');
const csv = require('csv-parser');

class TreeNode {
    constructor(label, topic = null) {
        this.label = label;
        this.topic = topic;
        this.children = [];
    }

    addChild(node) {
        this.children.push(node);
    }
}

function parseCSV(filePath) {
    return new Promise((resolve, reject) => {
        const nodes = [];
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (row) => {
                nodes.push({
                    level: parseInt(row.level),
                    topic: row.topic,
                    label: row.label
                });
            })
            .on('end', () => {
                resolve(nodes);
            })
            .on('error', (error) => {
                reject(error);
            });
    });
}

function buildTree(nodes) {
    if (!nodes.length) {
        return null;
    }

    const root = new TreeNode("Topics");
    const stack = [{ node: root, level: -1 }];

    nodes.forEach(node => {
        const newNode = new TreeNode(node.label, node.topic);
        while (stack.length && stack[stack.length - 1].level >= node.level) {
            stack.pop();
        }
        stack[stack.length - 1].node.addChild(newNode);
        stack.push({ node: newNode, level: node.level });
    });

    return root;
}

module.exports = {
    parseCSV,
    buildTree,
};
