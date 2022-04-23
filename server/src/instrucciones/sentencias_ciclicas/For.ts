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
        const consola = Consola.getInstance()
        const name_node = `instruccion_${this.line}_${this.column}_`
        consola.set_Ast(`
        ${name_node}[label="\\<Instruccion\\>\\nFor"];
        ${name_node}Ambito[label="\\<Nuevo ámbito\\>\\n"];
        ${name_node}->${name_node}Ambito;
        ${name_node}1[label="\\<Declaración For\\>"];
        ${name_node}2[label="\\<Condición For\\>"];
        ${name_node}3[label="\\<Iteración For\\>"];
        ${name_node}4[label="\\<Cuerpo For\\>"];
        ${name_node}Ambito->${name_node}1;
        ${name_node}Ambito->${name_node}2;
        ${name_node}Ambito->${name_node}3;
        ${name_node}Ambito->${name_node}4;
        `)
        
        //Unión a la parte declaración
        if(this.declaracion instanceof Expresion){
            consola.set_Ast(`${name_node}1->${this.declaracion.ast()}`);
        }else{
            consola.set_Ast(`${name_node}1->instruccion_${this.declaracion.line}_${this.declaracion.column}_;`);
            this.declaracion.ast();
        }

        //Unión a la parte condicional
        consola.set_Ast(`
        ${name_node}2->${this.condition.ast()}
        `)

        //Unión a la parte iterativa
        if(this.iteracion instanceof Expresion){
            consola.set_Ast(`${name_node}3->${this.iteracion.ast()}
            `);
        }else{
            consola.set_Ast(`${name_node}3->instruccion_${this.iteracion.line}_${this.iteracion.column}_;
            `);
            this.iteracion.ast()
        }

        //Conectando el cuerpo de for.
        consola.set_Ast(`
        ${name_node}4->instruccion_${this.bloque?.line}_${this.bloque?.column}_;
        `)
        this.bloque?.ast()
    }
}