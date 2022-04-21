import { Instruccion } from "../abstracto/Instruccion"
import { Consola } from "../consola_singleton/Consola"
import { Environment } from "../simbolo/Environment"

export class Bloque extends Instruccion {
    public nombreAmbito: string = "";

    constructor(
        private instrucciones: Array<Instruccion>,
        line: number,
        column: number
    ) {
        super(line, column)
    }

    public execute(env: Environment) {

        const newEnv = new Environment(env, this.nombreAmbito)

        //Ejecutar las instrucciones del bloque.
        for (const instrucciones of this.instrucciones) {
                const instruccion = instrucciones.execute(newEnv);
        }

    }
    
    public ast() {

        const consola = Consola.getInstance()
        const name_node = `Bloque_${this.line}_${this.column}_`
        consola.set_Ast(`
        ${name_node}[label="Bloque de instrucciones"];        
        `)
        this.instrucciones.forEach(x => {
            consola.set_Ast(`${name_node}->instruccion_${x.line}_${x.column}_;`)
            x.ast()
        })

    }
}