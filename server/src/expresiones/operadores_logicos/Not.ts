import { Expresion } from "../../abstracto/Expresion";
import { Excepcion } from "../../errores/Excepcion";
import { Environment } from "../../simbolo/Environment";
import { Retorno, Tipo } from "../../abstracto/Retorno";
import { Consola } from "../../consola_singleton/Consola";

export class Not extends Expresion{
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
            //no tiene que hacer la operación lógica y solo dar un error semántico
            const error = new Excepcion("Error semántico", `!NULL no es una operación lógica válida.`, this.line, this.column);
            consola.set_Error(error);
            retorno = {value: null, type: Tipo.ERROR}
        }else{
            if(nodoDer.type == nodoDer.type){ //si ambas expresiones son del mismo tipo.
                if (nodoDer.type == Tipo.BOOLEAN) {
                    if (nodoDer.value == true) {
                        retorno = {value: false, type: Tipo.BOOLEAN}
                    } else {
                        retorno = {value: true, type: Tipo.BOOLEAN}    
                    }
                }else{
                    //Error
                    const error = new Excepcion("Error semántico", `{!} declaración de una operación lógica no válida`, this.line, this.column);
                    consola.set_Error(error);
                    retorno = {value: null, type: Tipo.ERROR}
                }
            //Si ambas expresiones no son del mismo tipo
            }else{ //Cualquier otro tipo de error
                //ERROR
                const error = new Excepcion("Error semántico", `{!} declaración de una operación lógica no válida`, this.line, this.column);
                consola.set_Error(error);
                retorno = {value: null, type: Tipo.ERROR}
            }
        }
        return retorno;
    }

    public ast(): string {
        const name_nodo = `node_${this.right.line}_${this.right.column}_expresion`;
        return `
        ${name_nodo};
        ${name_nodo}[label="\\< Expresión \\> \\n operación lógica"];
        ${name_nodo}_Not[label="{!}"];
        ${name_nodo}->${name_nodo}_Not;
        ${name_nodo}->${this.right.ast()}
        `
    }
}