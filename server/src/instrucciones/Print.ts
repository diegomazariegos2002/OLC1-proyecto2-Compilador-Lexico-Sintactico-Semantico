import { Environment } from "../simbolo/Environment";
import { Instruccion } from "../abstracto/Instruccion";
import { Retorno, Tipo } from "../abstracto/Retorno";
import { Consola } from "../consola_singleton/Consola";
import { Expresion } from "../abstracto/Expresion";

/**
 * Clase Print que se encarga de realizar la instrucción de Print(Retorno);
 * Siempre que Expresión sea de Retorno entero, doble, booleano, cadena y carácter.
 */

export class Print extends Instruccion {

    constructor(
        public value: Expresion,
        line: number,
        column: number
    ) {
        super(line, column);
    }

    public execute(Environment: Environment) {

        const consola = Consola.getInstance()
        const Retorno = this.value?.execute(Environment);
        if (Retorno != null) {
            if (Retorno.type != Tipo.ERROR) consola.setConsola(Retorno.value);
        }
    }

    public ast() {
        const consola = Consola.getInstance()
        const nombreNodo = `instruccion_${this.line}_${this.column}_`;
        consola.set_Ast(`${nombreNodo}[label="\\<Instruccion\\>\\nprint"];\n`)
        if (this.value!= null){consola.set_Ast(`    ${nombreNodo}->${this.value.ast()}\n`)}
    }
}