import { Expresion } from "../../abstracto/Expresion";
import { Excepcion } from "../../errores/Excepcion";
import { Environment } from "../../simbolo/Environment";
import { Retorno, Tipo } from "../../abstracto/Retorno";
import { Consola } from "../../consola_singleton/Consola";

export class Decremento_Exp extends Expresion{
    constructor(
        private expresion: Expresion,
        line: number,
        column: number
    ){
        super(line, column)
    }

    public execute(env: Environment): Retorno {
        var consola = Consola.getInstance(); //instancia de la consola por posibles errores
        let retorno: Retorno = {value: null, type: Tipo.ERROR}; // es un error hasta que se diga lo contrario
        const exp = this.expresion.execute(env);

        if (exp.type == Tipo.ERROR) {
            //no tiene que hacer la elevación y solo dar un error semántico
            const error = new Excepcion("Error semántico", `el decremento de un NULL no es válido`, this.line, this.column);
            consola.set_Error(error);
            retorno = {value: null, type: Tipo.ERROR}
        }else{
            if(exp.type == Tipo.INT || exp.type == Tipo.DOUBLE){
                retorno = { value: (exp.value - 1), type: exp.type}
            }else{
                //ERROR
                const error = new Excepcion("Error semántico", `el decremento de un char\\string\\boolean\\NULL no es válido`, this.line, this.column);
                consola.set_Error(error);
                retorno = {value: null, type: Tipo.ERROR}
            }
        }
        return retorno;
    }

    public ast(): string {
        const name_nodo = `node_${this.expresion.line}_${this.expresion.column}_expresion`;
        return `
        ${name_nodo};
        ${name_nodo}[label="\\< Expresión \\> \\n decremento"];
        ${name_nodo}->${this.expresion.ast()}
        ${name_nodo}_decremento[label="{--}"];
        ${name_nodo}->${name_nodo}_decremento;
        `
    }
}