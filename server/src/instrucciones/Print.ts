import { TablaDeSimbolos } from "../simbolos/TablaDeSimbolos";
import { Instruccion } from "../abstract/Instruccion";
import { Expresion } from "../abstract/Expresion";
import { Type } from "../abstract/Retorno"; 
import { Consola } from "../singleton_consola/Consola";

/**
 * Clase Print que se encarga de realizar la instrucción de Print(Expresion);
 * Siempre que Expresión sea de tipo entero, doble, booleano, cadena y carácter.
 */

export class Print extends Instruccion {

    constructor(
        public value: Expresion,
        line: number,
        column: number
    ) {
        super(line, column);
    }

    public execute(tablaDeSimbolos: TablaDeSimbolos) {

        const s = Consola.getInstance()
        const expresion = this.value?.execute(tablaDeSimbolos);
        if (expresion != null) {
            if (expresion.type != Type.error) s.add_consola(expresion.value)
        }
    }

    public ast() {
        const s = Consola.getInstance()
        const nombreNodo = `node_${this.line}_${this.column}_`
        s.add_ast(`
        ${nombreNodo}[label="\\<Instruccion\\>\\nconsole"];`)
        if (this.value!= null){s.add_ast(`${nombreNodo}->${this.value.ast()}`)}
    }
}

