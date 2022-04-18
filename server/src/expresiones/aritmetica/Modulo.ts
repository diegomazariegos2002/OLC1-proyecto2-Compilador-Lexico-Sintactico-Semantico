import { Expresion } from "../../abstracto/Expresion";
import { Excepcion } from "../../errores/Excepcion";
import { Environment } from "../../simbolo/Environment";
import { Retorno, Tipo } from "../../abstracto/Retorno";
import { Consola } from "../../consola_singleton/Consola";

export class Modulo extends Expresion{
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
            const error = new Excepcion("Error semántico", `NULL potencia NULL no es un modulo válido`, this.line, this.column);
            consola.set_Error(error);
            retorno = {value: null, type: Tipo.ERROR}
        }else{
            if(nodoIzq.type == nodoDer.type){ //si ambas expresiones son del mismo tipo.
                if (nodoIzq.type == Tipo.INT) {
                    retorno = {value: (nodoIzq.value % nodoDer.value), type: Tipo.DOUBLE}

                } else if (nodoIzq.type == Tipo.DOUBLE) { 
                    retorno = {value: (nodoIzq.value % nodoDer.value), type: Tipo.DOUBLE}

                } else{
                    //Error
                    const error = new Excepcion("Error semántico", `boolean\\caracter\\cadena\\NULL modulo boolean\\caracter\\cadena\\NULL no es un modulo válido`, this.line, this.column);
                    consola.set_Error(error);
                    retorno = {value: null, type: Tipo.ERROR}
                }
            }//Si ambas expresiones no son del mismo tipo
            else if(nodoIzq.type == Tipo.INT){ //si la primera es entero
                if (nodoDer.type == Tipo.DOUBLE) {
                    retorno = {value: (nodoIzq.value % nodoDer.value), type: Tipo.DOUBLE}

                }else{
                    //ERROR
                    const error = new Excepcion("Error semántico", `int modulo boolean\\string\\NULL no es un modulo válido.`, this.line, this.column);
                    consola.set_Error(error);
                    retorno = {value: null, type: Tipo.ERROR}
                }
            }else if(nodoIzq.type == Tipo.DOUBLE){ //Si el primero es un DOUBLE
                if (nodoDer.type == Tipo.INT) { // Si el otro es tipo int
                    retorno = {value: (nodoIzq.value % nodoDer.value), type: Tipo.DOUBLE}

                }else{
                    //ERROR
                    const error = new Excepcion("Error semántico", `double modulo boolean\\string\\NULL no es un modulo válido.`, this.line, this.column);
                    consola.set_Error(error);
                    retorno = {value: null, type: Tipo.ERROR}
                }
            }else{ //Cualquier otro tipo de error
                //ERROR
                const error = new Excepcion("Error semántico", `El modulo de un boolean\\char\\string\\NULL no es un modulo válido.`, this.line, this.column);
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