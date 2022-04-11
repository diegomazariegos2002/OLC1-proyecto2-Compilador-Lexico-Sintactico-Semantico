import { Retorno } from "./Retorno"
import { TablaDeSimbolos } from "../simbolos/TablaDeSimbolos"

export abstract class Expresion {

    constructor(public line: number, public column: number) {
        this.line = line
        this.column = column + 1
    }

    public abstract execute(tablaDeSimbolos: TablaDeSimbolos): Retorno
    public abstract ast(): string
}