import { Expresion } from "../abstracto/Expresion"
import { Environment } from "../simbolo/Environment"
import { Retorno, Tipo } from "../abstracto/Retorno"
import { Excepcion } from "../errores/Excepcion"
import { Consola } from "../consola_singleton/Consola"

export class Identificador extends Expresion {

    constructor(
        private id: string,
        line: number,
        column: number
    ) {
        super(line, column)
    }

    public execute(Environment: Environment): Retorno {

        //traer la variable
        const value = Environment.get_variable(this.id)

        if (value == null) { //verificar si existe la variable en la tabla de simbolos
            //si no existe entonces es un error semantico
            var consola = Consola.getInstance();
            const error = new Excepcion("Error semántico", "no existe una variable con ese nombre", this.line, this.column);
            consola.set_Error(error);
            return {value: null, type: Tipo.ERROR}
        }

        return { value: value.valor, type: value.tipo };
    }

    public ast() {
        const name_nodo = `node_${this.line}_${this.column}_`
        return `
        ${name_nodo};
        ${name_nodo}[label="\\<Identificador\\>\\n{${this.id}}"];
        `
    }
}