import { Expresion } from "../abstract/Expresion"
import { TablaDeSimbolos } from "../simbolos/TablaDeSimbolos"
import { Retorno, Type } from "../abstract/Retorno"
import { ExceptionError } from "../excepciones/ExceptionError"


export class Identificador extends Expresion {

    constructor(
        private id: string,
        line: number,
        column: number
    ) {
        super(line, column)
    }

    public execute(tablaDeSimbolos: TablaDeSimbolos): Retorno {

        //traer la variable
        const value = tablaDeSimbolos.get_variable(this.id)

        if (value == null) {
            //verificar si es un array
            throw new ExceptionError("Semantico", `Variable '${this.id}' no encontrada `, this.line, this.column)
        }

        return { value: value.value, type: value.type };
    }

    public ast() {
        const name_nodo = `node_${this.line}_${this.column}_`
        return `
        ${name_nodo};
        ${name_nodo}[label="{${this.id}}"];
        `
    }
}