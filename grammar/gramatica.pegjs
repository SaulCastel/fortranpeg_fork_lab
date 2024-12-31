{{
    
    // let identificadores = []

    // import { identificadores } from '../index.js'

    import { ids, usos} from '../index.js'
    import { ErrorReglas } from './error.js';
    import { errores } from '../index.js'

    import * as n from '../visitor/CST.js';
}}

gramatica
  = _ code:globalCode? prods:regla+ _ {
    let duplicados = ids.filter((item, index) => ids.indexOf(item) !== index);
    if (duplicados.length > 0) {
        errores.push(new ErrorReglas("Regla duplicada: " + duplicados[0]));
    }

    // Validar que todos los usos están en ids
    let noEncontrados = usos.filter(item => !ids.includes(item));
    if (noEncontrados.length > 0) {
        errores.push(new ErrorReglas("Regla no encontrada: " + noEncontrados[0]));
    }
    prods[0].start = true;
    return new n.Grammar(prods, code);
  }

globalCode
  = "{" _ before:$(. !"contains")+ _ "contains" _ after:$[^}]* "}" {
    return after ? {before, after} : {before}
  }

regla
  = _ id:identificador _ alias:(literales)? _ "=" _ expr:opciones (_";")? {
    ids.push(id);
    return new n.Regla(id, expr, alias);
  }

opciones
  = expr:union rest:(_ "/" _ @union)* {
    return new n.Opciones([expr, ...rest]);
  }

union
  = expr:parsingExpression rest:(_ @parsingExpression !(_ literales? _ "=") )* action:predicate? {
    const exprs = [expr, ...rest];
    const labels = exprs.filter(expr => expr.label);
    if (labels.length > 0) {
      action.arguments = labels.reduce((args, expr) => {
        args[expr.label] = expr.expr instanceof n.Identificador ? expr.expr.id : '';
      }, {});
    }
    return new n.Union(exprs, action);
  }

parsingExpression
  = pluck
  / '!' assertion:(match/predicate) {
    return new n.NegAssertion(assertion);
  }
  / '&' assertion:(match/predicate) {
    return new n.Assertion(assertion);
  }
  / "!." {
    return new n.Fin();
  }

pluck
  = pluck:"@"? _ expr:label {
    return new n.Pluck(expr, pluck);
  }

label
  = label:(@identificador _ ":")? _ expr:annotated {
    return new n.Label(expr, label);
  }

annotated
  = text:"$"? _ expr:match _ qty:([?+*]/conteo)? {
    return new n.Annotated(expr, qty, text)
  }

match
  = id:identificador {
    usos.push(id)
    return new n.Identificador(id);
  }
  / val:$literales isCase:"i"? {
    return new n.String(val.replace(/['"]/g, ''), isCase);
  }
  / "(" _ @opciones _ ")"
  / chars:clase isCase:"i"? {
    return new n.Clase(chars, isCase);
  }
  / "." {
    return new n.Punto();
  }

conteo
  = "|" _ (numero / id:identificador) _ "|"
  / "|" _ (numero / id:identificador)? _ ".." _ (numero / id2:identificador)? _ "|"
  / "|" _ (numero / id:identificador)? _ "," _ opciones _ "|"
  / "|" _ (numero / id:identificador)? _ ".." _ (numero / id2:identificador)? _ "," _ opciones _ "|"

predicate
  = "{" _ returnType:predicateReturnType code:$[^}]* "}" {
    return new n.Predicate(returnType, code)
  }

predicateReturnType
  = t:$[^: ]+ _ "::" _ "res" {
    return t;
  }

clase
  = "[" @contenidoClase+ "]"

contenidoClase
  = bottom:$caracter "-" top:$caracter {
    return new n.Rango(bottom, top);
  }
  / $caracter

caracter
  = [^\[\]\\]
  / "\\" .

literales
  = '"' @stringDobleComilla* '"'
  / "'" @stringSimpleComilla* "'"

stringDobleComilla = !('"' / "\\" / finLinea) .
                    / "\\" escape
                    / continuacionLinea

stringSimpleComilla = !("'" / "\\" / finLinea) .
                    / "\\" escape
                    / continuacionLinea

continuacionLinea = "\\" secuenciaFinLinea

finLinea = [\n\r\u2028\u2029]

escape = "'"
        / '"'
        / "\\"
        / "b"
        / "f"
        / "n"
        / "r"
        / "t"
        / "v"
        / "u"

secuenciaFinLinea = "\r\n" / "\n" / "\r" / "\u2028" / "\u2029"

// literales = 
//     "\"" [^"]* "\""
//     / "'" [^']* "'"
    
numero = [0-9]+

identificador = [_a-z]i[_a-z0-9]i* { return text() }

_ = (Comentarios /[ \t\n\r])*

Comentarios = 
    "//" [^\n]* 
    / "/*" (!"*/" .)* "*/"
