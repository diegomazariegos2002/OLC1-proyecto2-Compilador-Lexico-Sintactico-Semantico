import { Expresion } from "../../abstracto/Expresion";
import { Excepcion } from "../../errores/Excepcion";
import { Environment } from "../../simbolo/Environment";
import { Retorno, Tipo } from "../../abstracto/Retorno";
import { Consola } from "../../consola_singleton/Consola";
import { Instruccion } from "../../abstracto/Instruccion";
import { Bloque } from "../Bloque";

export class If extends Instruccion {

    public return_Encontrado: boolean = false;
    public valor_Return: Retorno = {value: null, type: Tipo.VOID};

    constructor(
        private condition: Expresion,
        public bloque: Bloque,
        public else_ElseIf: Bloque | null,
        line: number,
        column: number
    ) {
        super(line, column)
    }

    public execute(env: Environment) {
        var consola = Consola.getInstance(); //instancia de la consola por posibles errores
        const expresion = this.condition.execute(env)

        if (expresion.type != Tipo.BOOLEAN) {
            const error = new Excepcion("Error semántico", `condición no válida en sentencia de control if`, this.line, this.column);
            consola.set_Error(error);
            return;
        }

        if (expresion.value) {
            this.bloque.recorridoAmbito = env.recorridoAmbito + " -> if / else if";
            this.bloque.execute(env)
            if (this.bloque.return_Encontrado) { //este if para pasar el retorno de la instrucción return.
                /**Como se generan ámbitos en el if entonces de esta forma pasamos el valor de algún return */
                this.bloque.return_Encontrado = false;
                this.return_Encontrado = true;
                this.valor_Return = this.bloque.valor_Return;
                this.bloque.valor_Return = {value: null, type: Tipo.VOID};
            }
        } else {
            if (this.else_ElseIf != null) {
                this.else_ElseIf.recorridoAmbito = env.recorridoAmbito + " -> else";
                this.else_ElseIf.execute(env)
                if (this.else_ElseIf.return_Encontrado) { //este if para pasar el retorno de la instrucción return.
                    /**Como se generan ámbitos en el if entonces de esta forma pasamos el valor de algún return */
                    this.else_ElseIf!.return_Encontrado = false;
                    this.return_Encontrado = true;
                    this.valor_Return = this.else_ElseIf!.valor_Return;
                    this.else_ElseIf!.valor_Return = {value: null, type: Tipo.VOID};
                }
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