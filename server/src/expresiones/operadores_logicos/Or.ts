import { Expresion } from "../../abstracto/Expresion";
import { Excepcion } from "../../errores/Excepcion";
import { Environment } from "../../simbolo/Environment";
import { Retorno, Tipo } from "../../abstracto/Retorno";
import { Consola } from "../../consola_singleton/Consola";

export class Or extends Expresion{
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
            //no tiene que hacer la operación lógica y solo dar un error semántico
            const error = new Excepcion("Error semántico", `NULL || NULL no es una operación lógica válida.`, this.line, this.column);
            consola.set_Error(error);
            retorno = {value: null, type: Tipo.ERROR}
        }else{
            if(nodoIzq.type == nodoDer.type){ //si ambas expresiones son del mismo tipo.
                if (nodoIzq.type == Tipo.BOOLEAN) {
                    if (nodoIzq.value == true || nodoDer.value == true) {
                        retorno = {value: true, type: Tipo.BOOLEAN}
                    } else {
                        retorno = {value: false, type: Tipo.BOOLEAN}    
                    }
                }else{
                    //Error
                    const error = new Excepcion("Error semántico", `{||} declaración de una operación lógica no válida`, this.line, this.column);
                    consola.set_Error(error);
                    retorno = {value: null, type: Tipo.ERROR}
                }
            //Si ambas expresiones no son del mismo tipo
            }else{ //Cualquier otro tipo de error
                //ERROR
                const error = new Excepcion("Error semántico", `{||} declaración de una operación lógica no válida`, this.line, this.column);
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
        ${name_nodo}[label="\\< Expresión \\> \\n operación lógica"];
        ${name_nodo}->${this.left.ast()}
        ${name_nodo}_Or[label="{||}"];
        ${name_nodo}->${name_nodo}_Or;
        ${name_nodo}->${this.right.ast()}
        `
    }
}