import { Expresion } from "../../abstracto/Expresion";
import { Excepcion } from "../../errores/Excepcion";
import { Environment } from "../../simbolo/Environment";
import { Retorno, Tipo } from "../../abstracto/Retorno";
import { Consola } from "../../consola_singleton/Consola";

export class Mayor_Que extends Expresion{
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
            //no tiene que hacer la operación relacional y solo dar un error semántico
            const error = new Excepcion("Error semántico", `NULL comparado con NULL no es una operación relacional válida.`, this.line, this.column);
            consola.set_Error(error);
            retorno = {value: null, type: Tipo.ERROR}
        }else{
            if(nodoIzq.type == nodoDer.type){ //si ambas expresiones son del mismo tipo.
                if (nodoIzq.type == Tipo.INT || nodoIzq.type == Tipo.DOUBLE) {
                    if (nodoIzq.value > nodoDer.value) {
                        retorno = {value: true, type: Tipo.BOOLEAN}
                    } else {
                        retorno = {value: false, type: Tipo.BOOLEAN}    
                    }
                }else if (nodoIzq.type == Tipo.CHAR) {
                    if (nodoIzq.value.charCodeAt(0) > nodoDer.value.charCodeAt(0)) {
                        retorno = {value: true, type: Tipo.BOOLEAN}
                    } else {
                        retorno = {value: false, type: Tipo.BOOLEAN}    
                    }
                }else{
                    //Error
                    const error = new Excepcion("Error semántico", `no es una operación relacional válida.`, this.line, this.column);
                    consola.set_Error(error);
                    retorno = {value: null, type: Tipo.ERROR}
                }
            }//Si ambas expresiones no son del mismo tipo
            else if(nodoIzq.type == Tipo.INT){ //si la primera es entero
                if (nodoDer.type == Tipo.DOUBLE) {
                    if (nodoIzq.value > nodoDer.value) {
                        retorno = {value: true, type: Tipo.BOOLEAN}
                    } else {
                        retorno = {value: false, type: Tipo.BOOLEAN}    
                    }

                } else if(nodoDer.type == Tipo.CHAR) {
                    if (nodoIzq.value > nodoDer.value.charCodeAt(0)) {
                        retorno = {value: true, type: Tipo.BOOLEAN}
                    } else {
                        retorno = {value: false, type: Tipo.BOOLEAN}    
                    }

                }else{
                    //ERROR
                    const error = new Excepcion("Error semántico", `int comparado con boolean\\string\\NULL no es una operación relacional válida.`, this.line, this.column);
                    consola.set_Error(error);
                    retorno = {value: null, type: Tipo.ERROR}
                }
            }else if(nodoIzq.type == Tipo.DOUBLE){ //Si el primero es un DOUBLE
                if (nodoDer.type == Tipo.INT) { // Si el otro es tipo int
                    if (nodoIzq.value > nodoDer.value) {
                        retorno = {value: true, type: Tipo.BOOLEAN}
                    } else {
                        retorno = {value: false, type: Tipo.BOOLEAN}    
                    }

                } else if(nodoDer.type > Tipo.CHAR) { // Si el otro es tipo boolean
                    if (nodoIzq.value == nodoDer.value.charCodeAt(0)) {
                        retorno = {value: true, type: Tipo.BOOLEAN}
                    } else {
                        retorno = {value: false, type: Tipo.BOOLEAN}    
                    }

                }else{
                    //ERROR
                    const error = new Excepcion("Error semántico", `double comparado con boolean\\string\\NULL no es una operación relacional válida.`, this.line, this.column);
                    consola.set_Error(error);
                    retorno = {value: null, type: Tipo.ERROR}
                }
                
            }else if(nodoIzq.type == Tipo.CHAR){ //Si el primero es Boolean
                if (nodoDer.type == Tipo.INT) {
                    if (nodoIzq.value.charCodeAt(0) > nodoDer.value) {
                        retorno = {value: true, type: Tipo.BOOLEAN}
                    } else {
                        retorno = {value: false, type: Tipo.BOOLEAN}    
                    }

                } else if (nodoDer.type == Tipo.DOUBLE) {
                    if (nodoIzq.value.charCodeAt(0) > nodoDer.value) {
                        retorno = {value: true, type: Tipo.BOOLEAN}
                    } else {
                        retorno = {value: false, type: Tipo.BOOLEAN}    
                    }

                }else {
                    //ERROR
                    const error = new Excepcion("Error semántico", `char comparado con boolean\\string\\NULL no es una operación relacional válida.`, this.line, this.column);
                    consola.set_Error(error);
                    retorno = {value: null, type: Tipo.ERROR}
                }
            }else{ //Cualquier otro tipo de error
                //ERROR
                const error = new Excepcion("Error semántico", `la operación relacional de un boolean\\string\\NULL no es una operación relacional válida.`, this.line, this.column);
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
        ${name_nodo}[label="\\> Expresión \\> \\n Operación relacional"];
        ${name_nodo}->${this.left.ast()}
        ${name_nodo}_MayorQue[label="{>}"];
        ${name_nodo}->${name_nodo}_MayorQue;
        ${name_nodo}->${this.right.ast()}
        `
    }
}