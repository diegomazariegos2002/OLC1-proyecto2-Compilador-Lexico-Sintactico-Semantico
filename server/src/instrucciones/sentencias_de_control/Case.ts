import { Expresion } from "../../abstracto/Expresion";
import { Excepcion } from "../../errores/Excepcion";
import { Environment } from "../../simbolo/Environment";
import { Tipo } from "../../abstracto/Retorno";
import { Consola } from "../../consola_singleton/Consola";
import { Instruccion } from "../../abstracto/Instruccion";
import { Bloque } from "../Bloque";

export class Case extends Instruccion {

    constructor(
        public valor: Expresion,
        private lista_instrucciones: Instruccion[] | null,
        public existe_Break: boolean,
        line: number,
        column: number
    ) {
        super(line, column)
    }

    public execute(env: Environment) {
        var consola = Consola.getInstance(); //instancia de la consola por posibles errores
        const newEnv = new Environment(env, env.nombreAmbito + " -> switch case")

        this.lista_instrucciones?.forEach(element => {
            element.execute(newEnv);
        });
    }

    public ast() {
        
    }
}