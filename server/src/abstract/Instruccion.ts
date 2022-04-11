import { TablaDeSimbolos } from "../simbolos/TablaDeSimbolos"

export abstract class Instruccion {

    constructor(public line: number, public column: number) {
        this.line = line
        this.column = column + 1
    }

    public abstract execute(tablaDeSimbolos: TablaDeSimbolos): any
    public abstract ast(): void

}