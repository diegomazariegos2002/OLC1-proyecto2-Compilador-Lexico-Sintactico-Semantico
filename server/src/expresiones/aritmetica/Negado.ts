import { Expresion } from "../../abstracto/Expresion";
import { Excepcion } from "../../errores/Excepcion";
import { Environment } from "../../simbolo/Environment";
import { Retorno, Tipo } from "../../abstracto/Retorno";
import { Consola } from "../../consola_singleton/Consola";

export class Negado extends Expresion{
    constructor(
        private right: Expresion,
        line: number,
        column: number
    ){
        super(line, column)
    }

    public execute(env: Environment): Retorno {
        var consola = Consola.getInstance(); //instancia de la consola por posibles errores
        let retorno: Retorno = {value: null, type: Tipo.ERROR}; // es un error hasta que se diga lo contrario
        const nodoDer = this.right.execute(env);

        if (nodoDer.type == Tipo.ERROR) {
            //no tiene que hacer la elevación y solo dar un error semántico
            const error = new Excepcion("Error semántico", `negado de NULL no es un negado válido`, this.line, this.column);
            consola.set_Error(error);
            retorno = {value: null, type: Tipo.ERROR}
        }else{
            if(nodoDer.type == Tipo.INT){
                retorno = { value: (-1 * nodoDer.value), type: Tipo.INT}
            }else if(nodoDer.type == Tipo.DOUBLE){
                retorno = { value: (-1 * nodoDer.value), type: Tipo.DOUBLE}
            }else{
                //ERROR
                const error = new Excepcion("Error semántico", `negado de char\\string\\boolean\\NULL no es un negado válido`, this.line, this.column);
                consola.set_Error(error);
                retorno = {value: null, type: Tipo.ERROR}
            }
        }
        return retorno;
    }

    public ast(): string {
        throw new Error("Method not implemented.");
    }
}