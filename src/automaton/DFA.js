import { Producciones } from '../visitor/CST.js';
import { Or, Concat, ZeroOrMore, OneOrMore, Hoja, Node } from './SyntaxTree.js';
import SyntaxTreeVisitor from './SyntaxTreeVisitor.js';

/** @typedef {{[state: number]: string}} Transition */

/** @type {number} */
let currentPosition;
/** @type {{[position: number]: Set<number>}} */
let nextPosition;
/** @type {{[position: number]: string}} */
let positions;
/** @type {{marked: boolean; positions: Set<number>}[]} */
let DStates;
/** @type {{[state: number]: Transition}}*/
const transitionTable = {};

/**
 *
 * @param {Producciones[]} CST
 */
export default async function generateTransitionTable(CST) {
    const visitor = new SyntaxTreeVisitor();
    const syntaxTree = CST.map((subTree) => subTree.accept(visitor)).filter(
        (subTree) => subTree.wrapee !== null
    );
    if (syntaxTree.length === 0) {
        return transitionTable;
    }
    const augmentedSyntaxTree = new Concat(
        syntaxTree.reduce((tree, subTree) => new Or(tree, subTree)),
        new Hoja('#', true)
    );
    console.log(augmentedSyntaxTree);
    currentPosition = 0;
    positions = {};
    nextPosition = {};
    annotateTree(augmentedSyntaxTree);

    DStates = [
        {
            marked: false,
            positions: new Set(augmentedSyntaxTree.first),
        },
    ];
    while (DStates.filter((state) => !state.marked).length) {
        const stateIndex = DStates.findIndex((S) => !S.marked);
        DStates[stateIndex].marked = true;
        for (const sym of Object.values(positions)) {
            /** @type {Set<number>} */
            const newState = DStates[stateIndex].positions
                .values()
                .reduce(
                    (U, position) =>
                        sym === positions[position]
                            ? U.union(nextPosition[position])
                            : U,
                    new Set()
                );
            const transitionIndex = DStates.findIndex(
                (state) => state.positions.difference(newState).size === 0
            );
            if (transitionIndex < 0) {
                DStates.push({
                    marked: false,
                    positions: newState,
                });
                Dtran(stateIndex, sym, DStates.length - 1);
            } else {
                Dtran(stateIndex, sym, transitionIndex);
            }
        }
    }
    console.log(DStates);
    return transitionTable;
}

/**
 *
 * @param {Node|undefined} tree
 */
function annotateTree(tree) {
    if (!tree) return;
    if (tree instanceof Hoja) {
        if (!tree.end) positions[currentPosition] = tree.val;
        tree.pos = currentPosition++;
        tree.calcFirst();
        tree.calcLast();
        tree.calcNullable();
        return;
    }
    annotateTree(tree.c1);
    annotateTree(tree.c2);
    tree.calcFirst();
    tree.calcLast();
    tree.calcNullable();
    if (tree instanceof Concat) {
        const next = new Set(tree.c2.first);
        for (const position of tree.c1.last) {
            if (position in nextPosition) {
                const current = nextPosition[position];
                nextPosition[position] = current.union(next);
            } else {
                nextPosition[position] = next;
            }
        }
    } else if (tree instanceof ZeroOrMore || tree instanceof OneOrMore) {
        const next = new Set(tree.c1.first);
        for (const position of tree.c1.last) {
            if (position in nextPosition) {
                const current = nextPosition[position];
                nextPosition[position] = current.union(next);
            } else {
                nextPosition[position] = next;
            }
        }
    }
}

/**
 *
 * @param {number} origin
 * @param {string} symbol
 * @param {number} destination
 */
function Dtran(origin, symbol, destination) {
    if (origin in transitionTable) {
        transitionTable[origin][destination] = symbol;
        return;
    }
    transitionTable[origin] = {
        [destination]: symbol,
    };
}
