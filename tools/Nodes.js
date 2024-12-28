/** @type {{[node: string]: {[arg: string]: string}}} */
const nodes = {
    Producciones: {
        id: 'string',
        expr: 'Opciones',
        alias: '?string',
        start: '?boolean',
    },
    Opciones: { exprs: 'Union[]' },
    Union: { exprs: 'Expresion[]' },
    Expresion: { expr: 'Node', label: '?string', qty: '?string' },
    String: { val: 'string', isCase: '?boolean' },
    Clase: { chars: '(string|Rango)[]', isCase: '?boolean' },
    Rango: { bottom: 'string', top: 'string' },
    Identificador: { id: 'string' },
    Punto: {},
    Fin: {},
};

export default nodes;
