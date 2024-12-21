import { Producciones } from '../visitor/CST.js';
import { Or, Concat, Hoja } from './SyntaxTree.js';
import SyntaxTreeVisitor from './SyntaxTreeVisitor.js';

/**
 *
 * @param {Producciones[]} CST
 */
export default function generateSyntaxTree(CST) {
    const visitor = new SyntaxTreeVisitor();
    const syntaxTree = CST.map((subTree) => subTree.accept(visitor)).reduce(
        (tree, subTree) => new Or(tree, subTree)
    );
    return new Concat(syntaxTree, new Hoja('#'));

    1;
}
