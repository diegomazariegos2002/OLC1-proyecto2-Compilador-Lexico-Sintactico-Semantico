import { Expresion } from "../../abstracto/Expresion";
import { Excepcion } from "../../errores/Excepcion";
import { Environment } from "../../simbolo/Environment";
import { Retorno, Tipo } from "../../abstracto/Retorno";
import { Consola } from "../../consola_singleton/Consola";

export class Potencia extends Expresion{
    constructor(
        private left: Expresion,
        private right: Expresion,
        line: number,
        column: number
    ){
        super(line, column)
    }

    public execute(env: Environment): Retorno {
        var consola = Consola.getInstance(); //instancia de la consola por posibles errores
        let retorno: Retorno = {value: null, type: Tipo.ERROR}; // es un error hasta que se diga lo contrario
        const nodoIzq = this.left.execute(env);
        const nodoDer = this.right.execute(env);

        if (nodoIzq.type == Tipo.ERROR || nodoDer.type == Tipo.ERROR) {
            //no tiene que hacer la elevación y solo dar un error semántico
            const error = new Excepcion("Error semántico", `NULL potencia NULL no es una potencia válida`, this.line, this.column);
            consola.set_Error(error);
            retorno = {value: null, type: Tipo.ERROR}
        }else{
            if(nodoIzq.type == nodoDer.type){ //si ambas expresiones son del mismo tipo.
                if (nodoIzq.type == Tipo.INT) {
                    retorno = {value: (Math.pow(nodoIzq.value, nodoDer.value)), type: Tipo.INT}

                } else if (nodoIzq.type == Tipo.DOUBLE) { 
                    retorno = {value: (Math.pow(nodoIzq.value, nodoDer.value)), type: Tipo.DOUBLE}

                } else{
                    //Error
                    const error = new Excepcion("Error semántico", `boolean\\caracter\\cadena\\NULL potenciado por boolean\\caracter\\cadena\\NULL no es una potencia válida`, this.line, this.column);
                    consola.set_Error(error);
                    retorno = {value: null, type: Tipo.ERROR}
                }
            }//Si ambas expresiones no son del mismo tipo
            else if(nodoIzq.type == Tipo.INT){ //si la primera es entero
                if (nodoDer.type == Tipo.DOUBLE) {
                    retorno = {value: (Math.pow(nodoIzq.value, nodoDer.value)), type: Tipo.DOUBLE}

                }else{
                    //ERROR
                    const error = new Excepcion("Error semántico", `int potenciado por boolean\\string\\NULL no es una potencia válida.`, this.line, this.column);
                    consola.set_Error(error);
                    retorno = {value: null, type: Tipo.ERROR}
                }
            }else if(nodoIzq.type == Tipo.DOUBLE){ //Si el primero es un DOUBLE
                if (nodoDer.type == Tipo.INT) { // Si el otro es tipo int
                    retorno = {value: (Math.pow(nodoIzq.value, nodoDer.value)), type: Tipo.DOUBLE}

                }else{
                    //ERROR
                    const error = new Excepcion("Error semántico", `double potenciado por boolean\\string\\NULL no es una potencia válida.`, this.line, this.column);
                    consola.set_Error(error);
                    retorno = {value: null, type: Tipo.ERROR}
                }
            }else{ //Cualquier otro tipo de error
                //ERROR
                const error = new Excepcion("Error semántico", `la potencia de un boolean\\char\\string\\NULL no es una potencia válida.`, this.line, this.column);
                consola.set_Error(error);
                retorno = {value: null, type: Tipo.ERROR}
            }
        }
        return retorno;
    }

    public ast(): string {
        const name_nodo = `node_${this.left.line}_${this.right.column}_expresion`;
        return `
        ${name_nodo};
        ${name_nodo}[label="\\< Expresión \\> \\n Potencia"];
        ${name_nodo}->${this.left.ast()}
        ${name_nodo}_potencia[label="{^}"];
        ${name_nodo}->${name_nodo}_potencia;
        ${name_nodo}->${this.right.ast()}
        `
    }
}