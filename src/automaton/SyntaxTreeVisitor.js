import * as CST from '../visitor/CST.js';
import * as Syntax from './SyntaxTree.js';

/**
 * @typedef {import('../visitor/Visitor.js').default<Syntax.Node>} Visitor
 */
/**
 * @implements {Visitor}
 */
export default class SyntaxTreeVisitor {
    /**
     * @param {CST.Producciones} node
     * @this {Visitor}
     */
    visitProducciones(node) {
        return node.expr.accept(this);
    }
    /**
     *
     * @param {CST.Opciones} node
     * @this {Visitor}
     */
    visitOpciones(node) {
        const rules = node.exprs
            .map((expr) => expr.accept(this))
            .filter((syntaxNode) => syntaxNode.wrapee !== null);
        if (rules.length === 0) {
            return new Syntax.Node(null);
        }
        return rules.reduce((subTree, curr) => new Syntax.Or(subTree, curr));
    }
    /**
     *
     * @param {CST.Union} node
     * @this {Visitor}
     */
    visitUnion(node) {
        let concatenation = false;
        let group = 0;

        /**
         * @type {{[group: number]: Syntax.Node[]}}
         */
        const groups = {};
        for (const cstNode of node.exprs) {
            if (
                concatenation &&
                (cstNode.expr instanceof CST.Clase ||
                    cstNode.expr instanceof CST.String)
            ) {
                concatenation = true;
                if (group === 0) {
                    groups[++group] = [];
                }
                groups[group].push(cstNode.accept(this));
            } else {
                concatenation = false;
                if (
                    !(cstNode.expr instanceof CST.Clase) &&
                    !(cstNode.expr instanceof CST.String)
                ) {
                    continue;
                }
                groups[++group] = [cstNode.accept(this)];
            }
        }
        if (Object.keys(groups).length === 0) {
            return new Syntax.Node(null);
        }
        return Object.values(groups)
            .map((group) =>
                group.length > 1
                    ? group.reduce(
                          (subTree, curr) => new Syntax.Concat(subTree, curr)
                      )
                    : group[0]
            )
            .reduce((subTree, curr) => new Syntax.Or(subTree, curr));
    }
    /**
     *
     * @param {CST.Expresion} node
     * @this {Visitor}
     */
    visitExpresion(node) {
        switch (node.qty) {
            case '*':
                return new Syntax.ZeroOrMore(node.expr.accept(this));
            case '+':
                return new Syntax.OneOrMore(node.expr.accept(this));
            case '?':
                return new Syntax.Option(node.expr.accept(this));
            default:
                return node.expr.accept(this);
        }
    }
    /**
     *
     * @param {CST.String} node
     * @this {Visitor}
     */
    visitString(node) {
        return new Syntax.Hoja(node.val);
    }
    /**
     *
     * @param {CST.Clase} node
     * @this {Visitor}
     */
    visitClase(node) {
        return new Syntax.Hoja(
            node.chars
                .map((char) =>
                    typeof char === 'string' ? char : char.accept(this).wrapee
                )
                .join('')
        );
    }
    /**
     *
     * @param {CST.Rango} node
     * @this {Visitor}
     */
    visitRango(node) {
        return new Syntax.Node(`${node.bottom}-${node.top}`);
    }
    /**
     *
     * @param {CST.Identificador} node
     * @this {Visitor}
     */
    visitIdentificador(node) {
        return new Syntax.Node(node);
    }
    /**
     *
     * @param {CST.Punto} node
     * @this {Visitor}
     */
    visitPunto(node) {
        return new Syntax.Node(node);
    }
    /**
     *
     * @param {CST.Fin} node
     * @this {Visitor}
     */
    visitFin(node) {
        return new Syntax.Node(node);
    }
}
