import { Expresion } from "../abstracto/Expresion";
import { Excepcion } from "../errores/Excepcion";
import { Environment } from "../simbolo/Environment";
import { Retorno, Tipo } from "../abstracto/Retorno";
import { Consola } from "../consola_singleton/Consola";

export class Casteo extends Expresion{
    constructor(
        private casteo: Tipo,
        private expresion: Expresion,
        line: number,
        column: number
    ){
        super(line, column)
    }

    public execute(env: Environment): Retorno {
        var consola = Consola.getInstance(); //instancia de la consola por posibles errores
        let retorno: Retorno = {value: null, type: Tipo.ERROR}; // es un error hasta que se diga lo contrario
        const exp = this.expresion.execute(env);

        if ( this.casteo == Tipo.ERROR || exp.type == Tipo.ERROR) {
            //no tiene que hacer la operación lógica y solo dar un error semántico
            const error = new Excepcion("Error semántico", `el casteo (NULL) NULL no es un casteo válido`, this.line, this.column);
            consola.set_Error(error);
            retorno = {value: null, type: Tipo.ERROR}
        }else{
            if(this.casteo == exp.type){ //si ambas expresiones son del mismo tipo se devuelve lo mismo.
                retorno = {value: exp.value, type: exp.type}
            //Si ambas expresiones no son del mismo tipo lleva otras validaciones
            }else{ 
                // Int a double
                if(this.casteo == Tipo.DOUBLE && exp.type == Tipo.INT){
                    retorno = {value: exp.value, type: this.casteo}
                }

                //Double a int
                else if(this.casteo == Tipo.INT && exp.type == Tipo.DOUBLE){
                    retorno = {value: Math.round(exp.value), type: this.casteo}
                }

                //int a String
                else if(this.casteo == Tipo.STRING && exp.type == Tipo.INT){
                    retorno = {value: exp.value.toString(), type: this.casteo}
                }

                //Int a Char
                else if(this.casteo == Tipo.CHAR && exp.type == Tipo.INT){
                    retorno = {value: String.fromCharCode(exp.value.toString()), type: this.casteo}
                }

                //Double a String
                else if(this.casteo == Tipo.STRING && exp.type == Tipo.DOUBLE){
                    retorno = {value: exp.value.toString(), type: this.casteo}
                } 

                //Char a int
                else if(this.casteo == Tipo.INT && exp.type == Tipo.CHAR){
                    retorno = {value: exp.value.charCodeAt(0), type: this.casteo}
                }

                //Char a double
                else if(this.casteo == Tipo.DOUBLE && exp.type == Tipo.CHAR){
                    retorno = {value: exp.value.charCodeAt(0), type: this.casteo}
                }

                else{
                    //ERROR
                    const error = new Excepcion("Error semántico", `el casteo de Tipo ${exp.type} a ${this.casteo} no es válido`, this.line, this.column);
                    consola.set_Error(error);
                    retorno = {value: null, type: Tipo.ERROR}
                }
            }
        }
        return retorno;
    }

    public ast(): string {
        const name_nodo = `node_${this.expresion.line}_${this.expresion.column}_exp`;
        return `
        ${name_nodo};
        ${name_nodo}[label="\\< Expresión \\> \\n Casteo"];
        ${name_nodo}_Casteo[label="{Tipo ${this.casteo}}"];
        ${name_nodo}->${name_nodo}_Casteo;
        ${name_nodo}->${this.expresion.ast()}
        `
    }
}