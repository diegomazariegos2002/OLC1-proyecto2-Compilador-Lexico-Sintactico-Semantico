import { Expresion } from "../../abstracto/Expresion";
import { Excepcion } from "../../errores/Excepcion";
import { Environment } from "../../simbolo/Environment";
import { Retorno, Tipo } from "../../abstracto/Retorno";
import { Consola } from "../../consola_singleton/Consola";

export class ToString extends Expresion{
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
        const nodoExp = this.expresion.execute(env);

        if (nodoExp.type == Tipo.ERROR) {
            //no tiene que hacer la elevación y solo dar un error semántico
            const error = new Excepcion("Error semántico", `No es posible aplicar el método ToString() a un valor devuelto de tipo NULL`, this.line, this.column);
            consola.set_Error(error);
            retorno = {value: null, type: Tipo.ERROR}
        }else{
            if(nodoExp.type == Tipo.INT){
                retorno = { value: (nodoExp.value.toString()), type: Tipo.STRING}
            }else if(nodoExp.type == Tipo.DOUBLE){
                retorno = { value: (nodoExp.value.toString()), type: Tipo.STRING}
            }else{
                //ERROR
                const error = new Excepcion("Error semántico", `No es posible aplicar el método ToString() a un valor devuelto de tipo char\\string\\boolean\\NULL`, this.line, this.column);
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
        ${name_nodo}[label="\\< Expresión \\> \\n toString"];
        ${name_nodo}_toString[label="{toString()}"];
        ${name_nodo}->${name_nodo}_toString;
        ${name_nodo}->${this.expresion.ast()}
        `
    }
}