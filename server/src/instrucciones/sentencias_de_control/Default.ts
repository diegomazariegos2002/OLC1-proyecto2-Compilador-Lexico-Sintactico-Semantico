import { Expresion } from "../../abstracto/Expresion";
import { Excepcion } from "../../errores/Excepcion";
import { Environment } from "../../simbolo/Environment";
import { Tipo } from "../../abstracto/Retorno";
import { Consola } from "../../consola_singleton/Consola";
import { Instruccion } from "../../abstracto/Instruccion";
import { Bloque } from "../Bloque";

export class Default extends Instruccion {

    constructor(
        private lista_instrucciones: Instruccion[] | null,
        public existe_Break: boolean,
        line: number,
        column: number
    ) {
        super(line, column)
    }

    public execute(env: Environment) {
        var consola = Consola.getInstance(); //instancia de la consola por posibles errores
        const newEnv = new Environment(env, env.nombreAmbito + " -> switch default")

        this.lista_instrucciones?.forEach(element => {
            element.execute(newEnv);
        });
    }

    public ast() {
        const consola = Consola.getInstance()
        var name_node = `instruccion_${this.line}_${this.column}_`
        consola.set_Ast(`
        ${name_node}[label="\\<Instrucción\\>\\nDefault"];        
        ${name_node}_AmbitoDefault[label="\\<Nuevo ámbito\\>"];
        ${name_node} -> ${name_node}_AmbitoDefault;
        `)
        name_node = `${name_node}_AmbitoDefault`;
        var cont = 0;
        var inst_line_anterior = 0;
        var inst_col_anterior = 0;
        this.lista_instrucciones?.forEach(instruccion => {
            if (cont == 0) {
                consola.set_Ast(`${name_node}->instruccion_${instruccion.line}_${instruccion.column}_;`)
            }else{
                consola.set_Ast(`instruccion_${inst_line_anterior}_${inst_col_anterior}_->instruccion_${instruccion.line}_${instruccion.column}_;`)
            }
            inst_line_anterior = instruccion.line;
            inst_col_anterior = instruccion.column;
            instruccion.ast()
            cont++;
        })       
    }
}