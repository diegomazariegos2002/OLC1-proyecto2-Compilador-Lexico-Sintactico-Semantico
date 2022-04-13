import { Retorno } from "./Retorno"
import { Environment } from "../simbolo/Environment"

export abstract class Expresion {

    constructor(public line: number, public column: number) {
        this.line = line
        this.column = column + 1
    }

    public abstract execute(Environment: Environment): Retorno
    public abstract ast(): string
}