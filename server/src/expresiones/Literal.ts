import { Expresion } from "../abstracto/Expresion"
import { Retorno, Tipo } from "../abstracto/Retorno"

export class Literal extends Expresion {

    constructor(
        private value: any,
        private tipo: Tipo,
        line: number,
        column: number
    ) {
        super(line, column)
    }

    public execute(): Retorno {
        if (this.tipo == Tipo.INT)
            return { value: Number(this.value), type: Tipo.INT }
        else if (this.tipo == Tipo.DOUBLE)
            return { value: this.value, type: Tipo.DOUBLE }
        else if (this.tipo == Tipo.STRING)
            return { value: this.value, type: Tipo.STRING }
        else if (this.tipo == Tipo.CHAR)
            return { value: this.value, type: Tipo.CHAR }
        else if (this.tipo == Tipo.BOOLEAN) {
            if (this.value.toLowerCase() == "true") { //para comparar sin importar las mayusculas y así.
                return { value: Boolean(true), type: Tipo.BOOLEAN }
            }
            else {
                return { value: Boolean(false), type: Tipo.BOOLEAN }
            }
        }
        else
            return { value: this.value, type: Tipo.ERROR }

    }
    public ast() {

        const nombre = `node_${this.line}_${this.column}_`
        if (this.tipo == Tipo.STRING) return `
        ${nombre};
        ${nombre}[label="\\<Valor\\>\\n\\"${this.value.toString()}\\""];
        `

        else return `
        ${nombre};
        ${nombre}[label="\\<Valor\\>\\n${this.value.toString()}"];
        `

    }
}