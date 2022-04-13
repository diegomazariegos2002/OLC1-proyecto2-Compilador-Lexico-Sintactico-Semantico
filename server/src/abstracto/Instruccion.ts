import { Environment } from "../simbolo/Environment"

export abstract class Instruccion {

    constructor(public line: number, public column: number) {
        this.line = line
        this.column = column + 1
    }

    public abstract execute(Environment: Environment): any
    public abstract ast(): void

}