import { Expresion } from "../../abstracto/Expresion";
import { Excepcion } from "../../errores/Excepcion";
import { Environment } from "../../simbolo/Environment";
import { Retorno, Tipo } from "../../abstracto/Retorno";
import { Consola } from "../../consola_singleton/Consola";
import { Instruccion } from "../../abstracto/Instruccion";
import { Bloque } from "../Bloque";
import { Case } from "./Case";
import { Igualacion } from "../../expresiones/operaciones_relacionales/Igualacion";
import { Default } from "./Default";
import { If } from "./If";

export class Switch extends Instruccion {

    /**
     * Estas variables es porque se generan nuevos ambitos con estas funciones y en caso de retornos
     * tiene que devolver algo.
     */
    public return_Encontrado: boolean = false;
    public valor_Return: Retorno = { value: null, type: Tipo.VOID };

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
        var bandera: boolean = false;
        this.casesIns?.forEach(instruccion => {
            if (new Igualacion(this.expresion, instruccion.valor, instruccion.line, instruccion.column).execute(env).value == true) {
                instruccion.execute(env);

                if ((instruccion).return_Encontrado == true) {
                    (instruccion).return_Encontrado = false;

                    this.return_Encontrado = true;
                    this.valor_Return = (instruccion).valor_Return;
                    (instruccion).valor_Return = { value: null, type: Tipo.VOID };
                    bandera = true;
                    return;
                }

                if (instruccion.existe_Break == true) {
                    bandera = true;
                    return;
                }
            }
        });
        if (bandera == false) {
            this.defaultIns?.execute(env);
            if (this.defaultIns?.return_Encontrado == true) {
                this.defaultIns!.return_Encontrado = false;

                this.return_Encontrado = true;
                this.valor_Return = this.defaultIns?.valor_Return;
                this.defaultIns!.valor_Return = { value: null, type: Tipo.VOID };
                return;
            }
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
        if (this.casesIns != null) {
            this.casesIns.forEach(instruccion => {
                if (cont == 0) {
                    consola.set_Ast(`${name_node}->instruccion_${instruccion.line}_${instruccion.column}_${instruccion.posicion};`)
                } else {
                    consola.set_Ast(`instruccion_${inst_line_anterior}_${inst_col_anterior}_${valorUltimoCase}->instruccion_${instruccion.line}_${instruccion.column}_${instruccion.posicion};`)
                }
                inst_line_anterior = instruccion.line;
                inst_col_anterior = instruccion.column;
                valorUltimoCase = instruccion.posicion;
                instruccion.ast()
                cont++;
            });
        }
        if (this.defaultIns != null) {
            consola.set_Ast(`instruccion_${inst_line_anterior}_${inst_col_anterior}_${valorUltimoCase}->instruccion_${this.defaultIns.line}_${this.defaultIns.column}_`)
            this.defaultIns.ast()
        }
    }
}