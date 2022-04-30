import { Excepcion } from "../../errores/Excepcion";
import { Environment } from "../../simbolo/Environment";
import { Consola } from "../../consola_singleton/Consola";
import { Instruccion } from "../../abstracto/Instruccion";
import { Expresion } from "../../abstracto/Expresion";
import { Retorno } from "../../abstracto/Retorno";

export class Return extends Instruccion {

    constructor(
        public expresion: Expresion | null,
        line: number,
        column: number
    ) {
        super(line, column)
    }

    public execute(env: Environment) {
        var consola = Consola.getInstance(); //instancia de la consola por posibles errores
        const error = new Excepcion("Error semántico", `la instrucción {return} solo tiene sentido adentro de una declaración de función`, this.line, this.column);
        consola.set_Error(error);
    }

    public ast() {
        const consola = Consola.getInstance()
        //Si me ejecuto quiere decir que soy un error porque el break no se tiene que ejecutar solo es una clase bandera.
        const name_node = `instruccion_${this.line}_${this.column}_`
        consola.set_Ast(`
        ${name_node}[label="\\<Instrucción\\>\\nReturn"];        
        `)
    }
}