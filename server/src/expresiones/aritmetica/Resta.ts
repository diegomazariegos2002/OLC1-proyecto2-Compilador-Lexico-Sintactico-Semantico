import { Expresion } from "../../abstracto/Expresion";
import { Instruccion } from "../../abstracto/Instruccion";
import { Excepcion } from "../../errores/Excepcion";
import { Environment } from "../../simbolo/Environment";
import { Retorno, Tipo } from "../../abstracto/Retorno";
import { Consola } from "../../consola_singleton/Consola";

export class Resta extends Expresion{
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
            //no tiene que hacer la resta y solo dar un error semántico
            const error = new Excepcion("Error semántico", `NULL menos NULL no es una suma válida.`, this.line, this.column);
            consola.set_Error(error);
            retorno = {value: null, type: Tipo.ERROR}
        }else{
            if(nodoIzq.type == nodoDer.type){ //si ambas expresiones son del mismo tipo.
                if (nodoIzq.type == Tipo.INT) {
                    retorno = {value: nodoIzq.value - nodoDer.value, type: Tipo.INT}
                } else if (nodoIzq.type == Tipo.DOUBLE) { 
                    retorno = {value: nodoIzq.value - nodoDer.value, type: Tipo.DOUBLE}
                } else{
                    //Error
                    const error = new Excepcion("Error semántico", `boolean\\caracter\\cadena\\NULL menos boolean\\caracter\\cadena\\NULL no es una resta válida.`, this.line, this.column);
                    consola.set_Error(error);
                    retorno = {value: null, type: Tipo.ERROR}
                }
            }//Si ambas expresiones no son del mismo tipo
            else if(nodoIzq.type == Tipo.INT){ //si la primera es entero
                if (nodoDer.type == Tipo.DOUBLE) {
                    retorno = {value: (nodoIzq.value - nodoDer.value), type: Tipo.DOUBLE}

                } else if(nodoDer.type == Tipo.BOOLEAN) {
                    if (nodoDer.value == true) {
                        retorno = {value: (nodoIzq.value - 1), type: Tipo.INT}
                    } else {
                        retorno = {value: (nodoIzq.value + 1), type: Tipo.INT}
                    }

                } else if(nodoDer.type == Tipo.CHAR){
                    retorno = {value: (nodoIzq.value - nodoDer.value.charCodeAt(0)), type: Tipo.INT}

                }else{
                    //ERROR
                    const error = new Excepcion("Error semántico", `int menos string no es una resta válida.`, this.line, this.column);
                    consola.set_Error(error);
                    retorno = {value: null, type: Tipo.ERROR}
                }
            }else if(nodoIzq.type == Tipo.DOUBLE){ //Si el primero es un DOUBLE
                if (nodoDer.type == Tipo.INT) { // Si el otro es tipo int
                    retorno = {value: (nodoIzq.value - nodoDer.value), type: Tipo.INT}

                } else if(nodoDer.type == Tipo.BOOLEAN) { // Si el otro es tipo boolean
                    if (nodoDer.value == true) {
                        retorno = {value: (nodoIzq.value - 1), type: Tipo.DOUBLE}

                    } else {
                        retorno = {value: (nodoIzq.value + 1), type: Tipo.DOUBLE}

                    }

                } else if(nodoDer.type == Tipo.CHAR){ // Si el otro es tipo char
                    retorno = {value: (nodoIzq.value - nodoDer.value.charCodeAt(0)), type: Tipo.DOUBLE}

                }else{
                    //ERROR
                    const error = new Excepcion("Error semántico", `double menos string no es una resta válida.`, this.line, this.column);
                    consola.set_Error(error);
                    retorno = {value: null, type: Tipo.ERROR}
                }
                
            }else if(nodoIzq.type == Tipo.BOOLEAN){ //Si el primero es Boolean
                var uno;
                if (nodoIzq.value == true) {
                    uno = 1;
                } else {
                    uno = -1;
                }
                if (nodoDer.type == Tipo.INT) {
                    retorno = { value: (uno - nodoDer.value), type: Tipo.INT}

                } else if (nodoDer.type == Tipo.DOUBLE) {
                    retorno = { value: (uno - nodoDer.value), type: Tipo.DOUBLE}

                }else {
                    //ERROR
                    //ERROR
                    const error = new Excepcion("Error semántico", `boolean menos caracter\\cadena\\null no es una resta válida.`, this.line, this.column);
                    consola.set_Error(error);
                    retorno = {value: null, type: Tipo.ERROR}
                }
            }else if(nodoIzq.type == Tipo.CHAR){
                if (nodoDer.type == Tipo.INT) {
                    retorno = { value: (nodoIzq.value.charCodeAt(0) - nodoDer.value), type: Tipo.INT}
                } else if(nodoDer.type == Tipo.DOUBLE) {
                    retorno = { value: (nodoIzq.value.charCodeAt(0) - nodoDer.value), type: Tipo.DOUBLE}
                } else{
                    //ERROR
                    const error = new Excepcion("Error semántico", `char menos boolean\\cadena\\null no es una resta válida.`, this.line, this.column);
                    consola.set_Error(error);
                    retorno = {value: null, type: Tipo.ERROR}
                }
            }else{ //Cualquier otro tipo de error
                //ERROR
                const error = new Excepcion("Error semántico", `la resta de una cadena no es una resta válida.`, this.line, this.column);
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