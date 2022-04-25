import { Expresion } from "../../abstracto/Expresion";
import { Excepcion } from "../../errores/Excepcion";
import { Environment } from "../../simbolo/Environment";
import { Retorno, Tipo } from "../../abstracto/Retorno";
import { Consola } from "../../consola_singleton/Consola";
import { Instruccion } from "../../abstracto/Instruccion";
import { Bloque } from "../Bloque";

export class While extends Instruccion {

    constructor(
        private condition: Expresion,
        public bloque: Bloque,
        line: number,
        column: number
    ) {
        super(line, column)
    }

    public execute(env: Environment) {
        var consola = Consola.getInstance(); //instancia de la consola por posibles errores

        var exec_Condicion = this.condition.execute(env)
        if (exec_Condicion.type != Tipo.BOOLEAN) {
            const error = new Excepcion("Error semántico", `condición no válida en sentencia de condición en ciclo for, únicamente se pueden declarar expresiones que devuelvan un tipo booleano pero lo que se obtuvo fue un tipo ${env.getTipo(exec_Condicion.type)}`, this.line, this.column);
            consola.set_Error(error);
            return;
        }

        while (exec_Condicion.value == true && this.bloque?.break_Encontrado == false) {
            
            if(this.bloque != null && this.bloque != undefined){
                this.bloque.recorridoAmbito = env.recorridoAmbito+" -> Cuerpo while";
                this.bloque.execute(env)   
            }

            exec_Condicion = this.condition.execute(env)
        }

        if(this.bloque != null || this.bloque != undefined) this.bloque.break_Encontrado = false;
    }

    public ast() {
        const consola = Consola.getInstance()
        const name_node = `instruccion_${this.line}_${this.column}_`
        consola.set_Ast(`
        ${name_node}[label="\\<Instruccion\\>\\nWhile"];
        ${name_node}Ambito[label="\\<Nuevo ámbito\\>\\n"];
        ${name_node}->${name_node}Ambito;
        ${name_node}1[label="\\<Condición While\\>"];
        ${name_node}2[label="\\<Cuerpo While\\>"];
        ${name_node}Ambito->${name_node}1;
        ${name_node}Ambito->${name_node}2;
        `)

        //Unión a la parte condicional
        consola.set_Ast(`
        ${name_node}1->${this.condition.ast()}
        `)

        //Conectando el cuerpo de for.
        consola.set_Ast(`
        ${name_node}2->instruccion_${this.bloque?.line}_${this.bloque?.column}_;
        `)
        this.bloque?.ast()
    }
}