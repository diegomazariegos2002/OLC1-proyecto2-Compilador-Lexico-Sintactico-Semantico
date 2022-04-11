"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Print = void 0;
const Instruccion_1 = require("../abstract/Instruccion");
const Retorno_1 = require("../abstract/Retorno");
const Consola_1 = require("../singleton_consola/Consola");
/**
 * Clase Print que se encarga de realizar la instrucción de Print(Expresion);
 * Siempre que Expresión sea de tipo entero, doble, booleano, cadena y carácter.
 */
class Print extends Instruccion_1.Instruccion {
    constructor(value, line, column) {
        super(line, column);
        this.value = value;
    }
    execute(tablaDeSimbolos) {
        const s = Consola_1.Consola.getInstance();
        const expresion = this.value?.execute(tablaDeSimbolos);
        if (expresion != null) {
            if (expresion.type != Retorno_1.Type.error)
                s.add_consola(expresion.value);
        }
    }
    ast() {
        const s = Consola_1.Consola.getInstance();
        const nombreNodo = `node_${this.line}_${this.column}_`;
        s.add_ast(`
        ${nombreNodo}[label="\\<Instruccion\\>\\nconsole"];`);
        if (this.value != null) {
            s.add_ast(`${nombreNodo}->${this.value.ast()}`);
        }
    }
}
exports.Print = Print;
//# sourceMappingURL=Print.js.map