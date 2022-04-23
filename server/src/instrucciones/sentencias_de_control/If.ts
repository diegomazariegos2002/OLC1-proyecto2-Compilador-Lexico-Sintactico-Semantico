import { Expresion } from "../../abstracto/Expresion";
import { Excepcion } from "../../errores/Excepcion";
import { Environment } from "../../simbolo/Environment";
import { Tipo } from "../../abstracto/Retorno";
import { Consola } from "../../consola_singleton/Consola";
import { Instruccion } from "../../abstracto/Instruccion";
import { Bloque } from "../Bloque";

export class If extends Instruccion {

    constructor(
        private condition: Expresion,
        private bloque: Bloque,
        private else_ElseIf: Bloque | null,
        line: number,
        column: number
    ) {
        super(line, column)
    }

    public execute(env: Environment) {
        var consola = Consola.getInstance(); //instancia de la consola por posibles errores
        const expresion = this.condition.execute(env)

        if (expresion.type != Tipo.BOOLEAN){
            const error = new Excepcion("Error semántico", `condición no válida en sentencia de control if`, this.line, this.column);
            consola.set_Error(error);
            return;
        }

        if (expresion.value){
            this.bloque.nombreAmbito = env.nombreAmbito+" -> if / else if";
            this.bloque.execute(env)
        }else{
            if(this.else_ElseIf != null){
            this.else_ElseIf.nombreAmbito = env.nombreAmbito+" -> else";
            this.else_ElseIf.execute(env)
            }
        } 

    }

    public ast() {
        const consola = Consola.getInstance()
        const name_node = `instruccion_${this.line}_${this.column}_`
        consola.set_Ast(`
        ${name_node}[label="\\<Instruccion\\>\\nIf / Else if / Else"];
        ${name_node}1[label="\\<Sentencia if\\>"];
        ${name_node}2[label="\\<Sentencia else\\>"];
        ${name_node}->${name_node}1;
        ${name_node}->${name_node}2;
        ${name_node}1->instruccion_${this.bloque.line}_${this.bloque.column}_;`)
        this.bloque.ast()
        if (this.else_ElseIf != null) {
            consola.set_Ast(`${name_node}2->instruccion_${this.else_ElseIf.line}_${this.else_ElseIf.column}_`)
            this.else_ElseIf.ast()
        }
    }
}