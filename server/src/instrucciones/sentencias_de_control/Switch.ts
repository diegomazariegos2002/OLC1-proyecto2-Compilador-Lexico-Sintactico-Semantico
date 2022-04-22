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

    }
}