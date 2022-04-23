import { Expresion } from "../../abstracto/Expresion";
import { Excepcion } from "../../errores/Excepcion";
import { Environment } from "../../simbolo/Environment";
import { Retorno, Tipo } from "../../abstracto/Retorno";
import { Consola } from "../../consola_singleton/Consola";
import { Instruccion } from "../../abstracto/Instruccion";
import { Bloque } from "../Bloque";

export class For extends Instruccion {

    constructor(
        private declaracion: Expresion | Instruccion,
        private condition: Expresion,
        private iteracion: Expresion | Instruccion,
        public bloque: Bloque | null,
        line: number,
        column: number
    ) {
        super(line, column)
    }

    public execute(env: Environment) {
        var consola = Consola.getInstance(); //instancia de la consola por posibles errores
        const newEnv = new Environment(env, env.nombreAmbito + " -> Sentencias for")
        var retorno_Decla: Retorno;
        var retorno_Iter: Retorno;

        if (this.declaracion instanceof Expresion) {
            retorno_Decla = this.declaracion.execute(newEnv);
            if (retorno_Decla.type == Tipo.ERROR) {
                const error = new Excepcion("Error semántico", `Error en la primera parte del for declarado, la expresión declarada no es correcta`, this.line, this.column);
                consola.set_Error(error);
                return;
            }
        } else { //de lo contrario es una instrucción por lo que simplemente se tiene que ejecutar
            this.declaracion.execute(newEnv);
        }

        var exec_Condicion = this.condition.execute(newEnv)
        if (exec_Condicion.type != Tipo.BOOLEAN) {
            const error = new Excepcion("Error semántico", `condición no válida en sentencia de condición en ciclo for, únicamente se pueden declarar expresiones que devuelvan un tipo booleano pero lo que se obtuvo fue un tipo ${env.getTipo(exec_Condicion.type)}`, this.line, this.column);
            consola.set_Error(error);
            return;
        }

        while (exec_Condicion.value == true) {
            
            if(this.bloque != null && this.bloque != undefined){
                this.bloque.nombreAmbito = newEnv.nombreAmbito+" -> Cuerpo for";
                this.bloque.execute(newEnv)   
            }
            
            //Ejecutar la iteración
            if (this.iteracion instanceof Expresion) {
                retorno_Iter = this.iteracion.execute(newEnv);
                if (retorno_Iter.type == Tipo.ERROR) {
                    const error = new Excepcion("Error semántico", `Error en la tercera parte del for declarado, la expresión declarada no es correcta`, this.line, this.column);
                    consola.set_Error(error);
                    return;
                }
            } else { //de lo contrario es una instrucción por lo que simplemente se tiene que ejecutar
                this.iteracion.execute(newEnv);
            }

            exec_Condicion = this.condition.execute(newEnv)
        }





    }

    public ast() {

    }
}