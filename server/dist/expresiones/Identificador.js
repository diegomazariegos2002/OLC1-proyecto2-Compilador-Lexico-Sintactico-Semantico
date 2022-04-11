"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Identificador = void 0;
const Expresion_1 = require("../abstract/Expresion");
const ExceptionError_1 = require("../excepciones/ExceptionError");
class Identificador extends Expresion_1.Expresion {
    constructor(id, line, column) {
        super(line, column);
        this.id = id;
    }
    execute(tablaDeSimbolos) {
        //traer la variable
        const value = tablaDeSimbolos.get_variable(this.id);
        if (value == null) {
            //verificar si es un array
            throw new ExceptionError_1.ExceptionError("Semantico", `Variable '${this.id}' no encontrada `, this.line, this.column);
        }
        return { value: value.value, type: value.type };
    }
    ast() {
        const name_nodo = `node_${this.line}_${this.column}_`;
        return `
        ${name_nodo};
        ${name_nodo}[label="{${this.id}}"];
        `;
    }
}
exports.Identificador = Identificador;
//# sourceMappingURL=Identificador.js.map