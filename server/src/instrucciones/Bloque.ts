import { Instruccion } from "../abstracto/Instruccion"
import { Consola } from "../consola_singleton/Consola"
import { Environment } from "../simbolo/Environment"

/**
 * Recordar que esta clase Bloque la utilizo para poder trabajar
 * las instrucciones adentro de ciertas estructuras que generan nuevo ambitos
 * por ejemplo los for, if, while, etc... en el caso de los switch no se aplica esto
 * porque estos no usaban la estructura de { Bloque } sino que solo eran case expresion: Instrucciones.
 */
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
        const name_node = `instruccion_${this.line}_${this.column}_`
        consola.set_Ast(`
        ${name_node}[label="\\<Nuevo ámbito\\>"];        
        `)
        var cont = 0;
        var inst_line_anterior = 0;
        var inst_col_anterior = 0;
        this.instrucciones.forEach(instruccion => {
            if (cont == 0) {
                consola.set_Ast(`${name_node}->instruccion_${instruccion.line}_${instruccion.column}_;`)
            }else{
                consola.set_Ast(`instruccion_${inst_line_anterior}_${inst_col_anterior}_->instruccion_${instruccion.line}_${instruccion.column}_;`)
            }
            inst_line_anterior = instruccion.line;
            inst_col_anterior = instruccion.column;
            instruccion.ast()
            cont++;
        })

    }
}