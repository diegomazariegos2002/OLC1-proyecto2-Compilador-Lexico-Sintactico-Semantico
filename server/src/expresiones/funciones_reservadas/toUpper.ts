import { Expresion } from "../../abstracto/Expresion";
import { Excepcion } from "../../errores/Excepcion";
import { Environment } from "../../simbolo/Environment";
import { Retorno, Tipo } from "../../abstracto/Retorno";
import { Consola } from "../../consola_singleton/Consola";

export class toUpper extends Expresion{
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
            //no tiene que hacer la conversión y solo dar un error semántico
            const error = new Excepcion("Error semántico", `No es posible aplicar el método toUpper() a un valor devuelto de tipo NULL`, this.line, this.column);
            consola.set_Error(error);
            retorno = {value: null, type: Tipo.ERROR}
        }else{
            if(nodoExp.type == Tipo.STRING){
                retorno = { value: (nodoExp.value.toString()).toUpperCase(), type: Tipo.STRING}
            }else{
                //no tiene que hacer la conversión y solo dar un error semántico
                const error = new Excepcion("Error semántico", `No es posible aplicar el método toUpper() solo se puede aplicar a cadenas`, this.line, this.column);
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
        ${name_nodo}[label="\\< Expresion \\> \\n toUpper"];
        ${name_nodo}_toUpper[label="{toUpper()}"];
        ${name_nodo}->${name_nodo}_toUpper;
        ${name_nodo}->${this.expresion.ast()}
        `
    }
}