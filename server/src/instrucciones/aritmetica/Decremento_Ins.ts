import { Excepcion } from "../../errores/Excepcion";
import { Environment } from "../../simbolo/Environment";
import { Retorno, Tipo } from "../../abstracto/Retorno";
import { Consola } from "../../consola_singleton/Consola";
import { Instruccion } from "../../abstracto/Instruccion";

export class Decremento_Ins extends Instruccion{
    constructor(
        private nombreVariable: string,
        line: number,
        column: number
    ){
        super(line, column)
    }

    public execute(env: Environment) {
        var consola = Consola.getInstance(); //instancia de la consola por posibles errores
        var variable = env.get_variable(this.nombreVariable)

        if (variable == null || variable == undefined) {
            //no tiene que hacer la elevación y solo dar un error semántico
            const error = new Excepcion("Error semántico", `el decremento de un NULL no es válido`, this.line, this.column);
            consola.set_Error(error);
        }else{
            if(variable?.tipo == Tipo.INT || variable?.tipo == Tipo.DOUBLE){
                env.actualizar_variable(this.nombreVariable, (variable.valor - 1));
            }else{
                //ERROR
                const error = new Excepcion("Error semántico", `el decremento de un char\\string\\boolean\\NULL no es válido`, this.line, this.column);
                consola.set_Error(error);
            }
        }
    }

    public ast(){
        const consola = Consola.getInstance()
        const name_nodo = `instruccion_${this.line}_${this.column}_`;
        consola.set_Ast(`
        ${name_nodo};
        ${name_nodo}[label="\\< Instrucción \\> \\n Decremento"];
        ${name_nodo}_identificador[label="\\< Identificador \\> \\n ${this.nombreVariable}"];
        ${name_nodo}->${name_nodo}_identificador;
        ${name_nodo}_decremento[label="{--}"];
        ${name_nodo}->${name_nodo}_decremento;
        `);
    }
}