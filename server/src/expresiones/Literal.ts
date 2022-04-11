import { Expresion } from "../abstract/Expresion"
import { Retorno, Type } from "../abstract/Retorno"

export class Literal extends Expresion {

    constructor(
        private value: any,
        private type: Type,
        line: number,
        column: number
    ) {
        super(line, column)
    }

    public execute(): Retorno {
        if (this.type == Type.INT)
            return { value: Number(this.value), type: Type.INT }
        else if (this.type == Type.DOUBLE)
            return { value: this.value, type: Type.DOUBLE }
        else if (this.type == Type.STRING)
            return { value: this.value, type: Type.STRING }
        else if (this.type == Type.CHAR)
            return { value: this.value, type: Type.CHAR }
        else if (this.type == Type.BOOLEAN) {
            if (this.value.toLowerCase() == "true") { //para comparar sin importar las mayusculas y así.
                return { value: Boolean(true), type: Type.BOOLEAN }
            }
            else {
                return { value: Boolean(false), type: Type.BOOLEAN }
            }
        }
        else
            return { value: this.value, type: Type.error }

    }
    public ast() {

        const nombre = `node_${this.line}_${this.column}_`
        if (this.type == Type.STRING) return `
        ${nombre};
        ${nombre}[label="\\"${this.value.toString()}\\""];`

        else return `
        ${nombre};
        ${nombre}[label="${this.value.toString()}"];`

    }
}