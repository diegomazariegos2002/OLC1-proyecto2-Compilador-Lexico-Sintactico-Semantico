import { Expresion } from "../../abstracto/Expresion";
import { Excepcion } from "../../errores/Excepcion";
import { Environment } from "../../simbolo/Environment";
import { Retorno, Tipo } from "../../abstracto/Retorno";
import { Consola } from "../../consola_singleton/Consola";

export class Suma extends Expresion{
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
            //no tiene que hacer la suma y solo dar un error semántico
            const error = new Excepcion("Error semántico", `NULL más NULL no es una suma válida.`, this.line, this.column);
            consola.set_Error(error);
            retorno = {value: null, type: Tipo.ERROR}
        }else{
            if(nodoIzq.type == nodoDer.type){ //si ambas expresiones son del mismo tipo.
                if (nodoIzq.type == Tipo.BOOLEAN) {
                    //Error
                    const error = new Excepcion("Error semántico", `boolean más boolean no es una suma válida.`, this.line, this.column);
                    consola.set_Error(error);
                    retorno = {value: null, type: Tipo.ERROR}
                } else if(nodoIzq.type == Tipo.CHAR) {
                    //se envía STRING y ya no cadena
                    retorno = {value: (nodoIzq.value.toString() + nodoDer.value.toString()), type: Tipo.STRING}
                }else{ 
                    //en el resto de casos se envía el mismo Tipo de ambas expresiones.
                    retorno = {value: (nodoIzq.value + nodoDer.value), type: nodoIzq.type}
                }
            }//Si ambas expresiones no son del mismo tipo
            else if(nodoIzq.type == Tipo.INT || nodoDer.type == Tipo.INT){ //si alguna de las dos es entero
                if (nodoIzq.type == Tipo.DOUBLE || nodoDer.type == Tipo.DOUBLE){ //si la otra es double
                    retorno = {value: (nodoIzq.value + nodoDer.value), type: Tipo.DOUBLE}; 

                }else if(nodoIzq.type == Tipo.BOOLEAN || nodoDer.type == Tipo.BOOLEAN){ // si la otra es boolean
                    if (nodoIzq.value == true || nodoDer.value == true) { // si el booleano es true
                        if (nodoIzq.type == Tipo.BOOLEAN) {
                            retorno = { value: (1 + nodoDer.value), type: Tipo.INT}
                        } else {
                            retorno = { value: (nodoIzq.value + 1), type: Tipo.INT}    
                        }
                        
                    } else { // si el booleano es false
                        if (nodoIzq.type == Tipo.BOOLEAN) {
                            retorno = { value: (nodoDer.value -1 ), type: Tipo.INT}
                        } else {
                            retorno = { value: (nodoIzq.value - 1), type: Tipo.INT}    
                        }
                    }

                }else if(nodoIzq.type == Tipo.CHAR || nodoDer.type == Tipo.CHAR){ // Si la otra es caracter
                    if (nodoIzq.type == Tipo.CHAR) { //si el izquierdo es el char.
                        retorno = { value: (nodoIzq.value.charCodeAt(0) + nodoDer.value), type: Tipo.INT}
                    } else {
                        retorno = { value: (nodoIzq.value + nodoDer.value.charCodeAt(0)), type: Tipo.INT}
                    }

                }else if(nodoIzq.type == Tipo.STRING || nodoDer.type == Tipo.STRING){ // Si la otra es String
                    retorno = { value: (nodoIzq.value.toString() + nodoDer.value.toString()), type: Tipo.STRING}
                }
            }else if(nodoIzq.type == Tipo.DOUBLE || nodoDer.type == Tipo.DOUBLE){ //si alguna de las dos es double y no hay enteros
                if (nodoIzq.type == Tipo.BOOLEAN || nodoDer.type == Tipo.BOOLEAN){ //si la otra es Boolean
                    if (nodoIzq.value == true || nodoDer.value == true) { // si el booleano es true
                        if (nodoIzq.type == Tipo.BOOLEAN) { //si el izquierda es el boolean
                            retorno = { value: (1.0 + nodoDer.value), type: Tipo.DOUBLE}
                        } else { // si el derecho es el boolean
                            retorno = { value: (nodoIzq.value + 1.0), type: Tipo.DOUBLE}    
                        }
                        
                    } else { // si el booleano es false
                        if (nodoIzq.type == Tipo.BOOLEAN) { // si el izquierdo es el boolean
                            retorno = { value: (nodoDer.value -1.0), type: Tipo.DOUBLE}
                        } else {
                            retorno = { value: (nodoIzq.value - 1.0), type: Tipo.DOUBLE}    
                        }
                    }

                }else if(nodoIzq.type == Tipo.CHAR || nodoDer.type == Tipo.CHAR){ // si la otra es boolean
                    if (nodoIzq.type == Tipo.CHAR) { //si el izquierdo es el char.
                        retorno = { value: (nodoIzq.value.charCodeAt(0) + nodoDer.value), type: Tipo.DOUBLE}
                    } else {
                        retorno = { value: (nodoIzq.value + nodoDer.value.charCodeAt(0)), type: Tipo.DOUBLE}
                    }
                }else if(nodoIzq.type == Tipo.STRING || nodoDer.type == Tipo.STRING){ // Si la otra es String
                    retorno = { value: (nodoIzq.value.toString() + nodoDer.value.toString()), type: Tipo.STRING}
                }
            }else if(nodoIzq.type == Tipo.BOOLEAN || nodoDer.type == Tipo.BOOLEAN){ //si alguna de las dos es double y no hay enteros ni doubles
                if (nodoIzq.type == Tipo.CHAR || nodoDer.type == Tipo.CHAR) {
                    //ERROR NO SE PUEDEN SUMAR CHARS Y BOOLEANS  
                    const error = new Excepcion("Error semántico", `boolean más char no es una suma válida.`, this.line, this.column);
                    consola.set_Error(error);
                    retorno = {value: null, type: Tipo.ERROR} 
                } else { //Este por ende solo puede ser un String
                    retorno = { value: (nodoIzq.value.toString() + nodoDer.value.toString()), type: Tipo.STRING}
                }
            }else if(nodoIzq.type == Tipo.CHAR || nodoDer.type == Tipo.CHAR){
                retorno = { value: (nodoIzq.value.toString() + nodoDer.value.toString()), type: Tipo.STRING}
            }else{ //Cualquier otro tipo de error
                retorno = { value: null, type: Tipo.ERROR}
            }
        }
        return retorno;
    }
    public ast(): string {
        const name_nodo = `node_${this.left.line}_${this.right.column}_expresion`;
        return `
        ${name_nodo};
        ${name_nodo}[label="\\< Expresión \\> \\n Suma"];
        ${name_nodo}->${this.left.ast()}
        ${name_nodo}_suma[label="{+}"];
        ${name_nodo}->${name_nodo}_suma;
        ${name_nodo}->${this.right.ast()}
        `
    }
}
