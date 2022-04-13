import { Instruccion } from "../abstracto/Instruccion"
import { Environment } from "../simbolo/Environment"
import { Expresion } from "../abstracto/Expresion"
import { Excepcion } from "../errores/Excepcion"
import { Retorno, Tipo } from "../abstracto/Retorno"
import { Consola } from "../consola_singleton/Consola"

export class Declaracion_Var extends Instruccion {
    constructor(
        public lista_nombres: [],
        public value: Expresion | null, //Pueden existir declaracions sin una valor de asignación.
        public tipo: Tipo,
        line: number,
        column: number
    ) {
        super(line, column)
    }

    /*
    *======================================= MÉTODOS DE CLASE ======================================= 
    */
   /**
    * Método para trabajar los valores por defecto según el tipo que le entre.
    * @param tipo 
    * @returns retorna el valor por defecto según el tipo.
    */
    public defaultValue(tipo:Tipo): any {
        switch (tipo) {
            case Tipo.INT:
                return 0;
            case Tipo.DOUBLE:
                return 0.0;
            case Tipo.BOOLEAN:
                return true;
            case Tipo.CHAR:
                return '\u0000';
            case Tipo.STRING:
                return "";
            default:
                return null;
        }
    }

    /*
    *  ======================================= MÉTODOS DE INSTRUCCION =======================================
    */

    public execute(environment: Environment) {
        const consola = Consola.getInstance()
        if (this.value != null) { //para el caso en el que exista una declaración con valor
            /**Paso 1) Verificar el retorno de la expresión */
            const retorno_Exp = this.value.execute(environment);
            
            if(retorno_Exp.type != this.tipo){ //si se cumple esto es un error semántico.
                const error = new Excepcion("Error semántico", "declaración inválidad, no se puede declarar  un tipo "+this.tipo+" con un valor "+retorno_Exp.type, this.line, this.column);
                consola.set_Error(error);
                return;
            }

            //Si ambos tipos son iguales entonces...
            //Para cada variable en la lista de nombres la va a guardar en su respectivo ambiente o tabla de simbolos.
            for (let index = 0; index < this.lista_nombres.length; index++) {
                const nombreVarActual = this.lista_nombres[index];
                const todoBien = environment.guardar_variable(nombreVarActual, retorno_Exp.value, this.tipo, true);
                if(todoBien == false){
                    const error = new Excepcion("Error semántico", "declaración inválidad, la variable "+nombreVarActual+" declarada ya existe", this.line, this.column);
                    consola.set_Error(error);
                }
            }
        }else{ //si la declaración viene sin una valor de asignación entonces solo se ponen los default.
            /**Paso 1) Crear las variables con su valor por defecto según su tipo */
            for (let index = 0; index < this.lista_nombres.length; index++) {
                const nombreVarActual = this.lista_nombres[index];
                const todoBien = environment.guardar_variable(nombreVarActual, this.defaultValue(this.tipo), this.tipo, true);
                if(todoBien == false){
                    const error = new Excepcion("Error semántico", "declaración inválidad, la variable "+nombreVarActual+" declarada ya existe", this.line, this.column);
                    consola.set_Error(error);
                }
            }
        }

    }
    public ast(): void {
        const consola = Consola.getInstance();
    }
}