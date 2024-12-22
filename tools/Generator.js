// Generar clases para CST
// Este archivo genera las clases necesarias para implementar el patrón visitante, usando JsDoc
// porque no nos dejan usar typescript

import { writeFileSync } from 'node:fs';
import path from 'node:path';
import nodes from './Nodes.js';

const __dirname = import.meta.dirname;
const classesDestination = '../src/visitor/CST.js';
const visitorDestination = '../src/visitor/Visitor.js';

let codeString = `
// Auto-generated

/** @typedef {import('./Node.js').default} Node*/

/** @template T */
export default class Visitor {
    ${Object.keys(nodes)
        .map(
            (node) => `
        /**
         * @abstract
         * @param {Node} node
         * @returns {T}
         */
        visit${node}(node){
            throw new Error('Implement in subclass');
        }`
        )
        .join('\n\t')}
}
`;
writeFileSync(path.join(__dirname, visitorDestination), codeString);
console.log('Generated visitor Interface');

codeString = `
// Auto-generated

/**
 * @template T
 * @typedef {import('./Visitor.js').default<T>} Visitor
 */
/**
 * @typedef {import('./Node.js').default} Node
 */

${Object.entries(nodes)
    .map(([node, args]) => {
        const declaration = `
/**
 * @implements {Node}
 */
export class ${node} {
    /**
     *
    ${Object.entries(args)
        .map(
            ([arg, type]) =>
                ` * @param {${
                    type.startsWith('?') ? type.slice(1) + '=' : type
                }} ${arg}`
        )
        .join('\n\t')}
     */
    constructor(${Object.keys(args).join(', ')}) {
        ${Object.keys(args)
            .map((arg) => `this.${arg} = ${arg};`)
            .join('\n\t\t')}
    }

    /**
     * @template T
     * @param {Visitor<T>} visitor
     * @returns {T}
     */
    accept(visitor) {
        return visitor.visit${node}(this);
    }
}
    `;
        console.log(`Generated ${node} class`);
        return declaration;
    })
    .join('\n')}
`;

writeFileSync(path.join(__dirname, classesDestination), codeString);
console.log('Done!');
