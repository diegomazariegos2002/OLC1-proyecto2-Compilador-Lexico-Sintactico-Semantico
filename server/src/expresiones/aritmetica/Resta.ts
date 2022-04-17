import { Expresion } from "../../abstracto/Expresion";
import { Instruccion } from "../../abstracto/Instruccion";
import { Excepcion } from "../../errores/Excepcion";
import { Environment } from "../../simbolo/Environment";
import { Retorno, Tipo } from "../../abstracto/Retorno";
import { Consola } from "../../consola_singleton/Consola";

export class Resta extends Expresion{
    constructor(
        private left: Expresion,
        private right: Expresion,
        line: number,
        column: number
    ){
        super(line, column)
    }

    public execute(env: Environment): Retorno {
        var consola = Consola.getInstance(); //instancia de la consola por posibles errores
        let retorno: Retorno = {value: null, type: Tipo.ERROR}; // es un error hasta que se diga lo contrario
        const nodoIzq = this.left.execute(env);
        const nodoDer = this.right.execute(env);
        
    }

    public ast(): string {
        throw new Error("Method not implemented.");
    }
}