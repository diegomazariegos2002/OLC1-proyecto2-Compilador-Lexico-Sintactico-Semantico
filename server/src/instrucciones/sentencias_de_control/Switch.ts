import { Expresion } from "../../abstracto/Expresion";
import { Excepcion } from "../../errores/Excepcion";
import { Environment } from "../../simbolo/Environment";
import { Tipo } from "../../abstracto/Retorno";
import { Consola } from "../../consola_singleton/Consola";
import { Instruccion } from "../../abstracto/Instruccion";
import { Bloque } from "../Bloque";
import { Case } from "./Case";
import { Igualacion } from "../../expresiones/operaciones_relacionales/Igualacion";
import { Default } from "./Default";

export class Switch extends Instruccion {

    constructor(
        private expresion: Expresion,
        private casesIns: Case[] | null,
        private defaultIns: Default | null,
        line: number,
        column: number
    ) {
        super(line, column)
    }

    public execute(env: Environment) {
        var consola = Consola.getInstance(); //instancia de la consola por posibles errores
        var bandera:boolean = false;
        this.casesIns?.forEach(element => {
            if (new Igualacion(this.expresion, element.valor, element.line, element.column).execute(env).value == true) {
                element.execute(env);
                if(element.existe_Break == true){
                    bandera = true;
                    return;
                }
            }    
        });
        if(bandera == false){
            this.defaultIns?.execute(env);
        }
    }

    public ast() {
        const consola = Consola.getInstance()
        const name_node = `instruccion_${this.line}_${this.column}_`
        consola.set_Ast(`
        ${name_node}[label="\\<Instruccion\\>\\nSwitch"];`)
        var cont = 0;
        var inst_line_anterior = 0;
        var inst_col_anterior = 0;
        var valorUltimoCase = 0;
        if(this.casesIns != null){
            this.casesIns.forEach(element => {
                if (cont == 0) {
                    consola.set_Ast(`${name_node}->instruccion_${element.line}_${element.column}_${element.posicion};`)
                }else{
                    consola.set_Ast(`instruccion_${inst_line_anterior}_${inst_col_anterior}_${valorUltimoCase}->instruccion_${element.line}_${element.column}_${element.posicion};`)
                }
                inst_line_anterior = element.line;
                inst_col_anterior = element.column;
                valorUltimoCase = element.posicion;
                element.ast()
                cont++;
            });
        }
        if (this.defaultIns != null) {
            consola.set_Ast(`instruccion_${inst_line_anterior}_${inst_col_anterior}_${valorUltimoCase}->instruccion_${this.defaultIns.line}_${this.defaultIns.column}_`)
            this.defaultIns.ast()
        }
    }
}