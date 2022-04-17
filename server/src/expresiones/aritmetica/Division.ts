import { Expresion } from "../../abstracto/Expresion";
import { Instruccion } from "../../abstracto/Instruccion";
import { Excepcion } from "../../errores/Excepcion";
import { Environment } from "../../simbolo/Environment";
import { Retorno, Tipo } from "../../abstracto/Retorno";
import { Consola } from "../../consola_singleton/Consola";

export class Division extends Expresion{
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
            //no tiene que hacer la multiplicación y solo dar un error semántico
            const error = new Excepcion("Error semántico", `NULL dividido por NULL no es una división válida.`, this.line, this.column);
            consola.set_Error(error);
            retorno = {value: null, type: Tipo.ERROR}
        }else{
            if(nodoIzq.type == nodoDer.type){ //si ambas expresiones son del mismo tipo.
                if (nodoIzq.type == Tipo.INT) {
                    retorno = {value: nodoIzq.value / nodoDer.value, type: Tipo.DOUBLE}

                } else if (nodoIzq.type == Tipo.DOUBLE) { 
                    retorno = {value: nodoIzq.value / nodoDer.value, type: Tipo.DOUBLE}

                } else{
                    //Error
                    const error = new Excepcion("Error semántico", `boolean\\caracter\\cadena\\NULL dividido por boolean\\caracter\\cadena\\NULL no es una división válida.`, this.line, this.column);
                    consola.set_Error(error);
                    retorno = {value: null, type: Tipo.ERROR}
                }
            }//Si ambas expresiones no son del mismo tipo
            else if(nodoIzq.type == Tipo.INT){ //si la primera es entero
                if (nodoDer.type == Tipo.DOUBLE) {
                    retorno = {value: (nodoIzq.value / nodoDer.value), type: Tipo.DOUBLE}

                } else if(nodoDer.type == Tipo.CHAR) {
                    retorno = {value: (nodoIzq.value / nodoDer.value.charCodeAt(0)), type: Tipo.DOUBLE}

                }else{
                    //ERROR
                    const error = new Excepcion("Error semántico", `int dividido por boolean\\string\\NULL no es una división válida.`, this.line, this.column);
                    consola.set_Error(error);
                    retorno = {value: null, type: Tipo.ERROR}
                }
            }else if(nodoIzq.type == Tipo.DOUBLE){ //Si el primero es un DOUBLE
                if (nodoDer.type == Tipo.INT) { // Si el otro es tipo int
                    retorno = {value: (nodoIzq.value / nodoDer.value), type: Tipo.DOUBLE}

                } else if(nodoDer.type == Tipo.CHAR) { // Si el otro es tipo boolean
                    retorno = {value: (nodoIzq.value / nodoDer.value.charCodeAt(0)), type: Tipo.DOUBLE}

                }else{
                    //ERROR
                    const error = new Excepcion("Error semántico", `double dividido por boolean\\string\\NULL no es una división válida.`, this.line, this.column);
                    consola.set_Error(error);
                    retorno = {value: null, type: Tipo.ERROR}
                }
                
            }else if(nodoIzq.type == Tipo.CHAR){ //Si el primero es Boolean
                if (nodoDer.type == Tipo.INT) {
                    retorno = { value: (nodoIzq.value.charCodeAt(0) - nodoDer.value), type: Tipo.DOUBLE}

                } else if (nodoDer.type == Tipo.DOUBLE) {
                    retorno = { value: (nodoIzq.value.charCodeAt(0) - nodoDer.value), type: Tipo.DOUBLE}

                }else {
                    //ERROR
                    const error = new Excepcion("Error semántico", `char dividido por boolean\\string\\NULL no es una división válida.`, this.line, this.column);
                    consola.set_Error(error);
                    retorno = {value: null, type: Tipo.ERROR}
                }
            }else{ //Cualquier otro tipo de error
                //ERROR
                const error = new Excepcion("Error semántico", `la división de un boolean\\string\\NULL no es una división válida.`, this.line, this.column);
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