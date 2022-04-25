import { Instruccion } from "../abstracto/Instruccion"
import { Consola } from "../consola_singleton/Consola"
import { Environment } from "../simbolo/Environment"
import { If } from "./sentencias_de_control/If";
import { Break } from "./sentencias_de_transicion/Break";
import { Continue } from "./sentencias_de_transicion/Continue";

/**
 * Recordar que esta clase Bloque la utilizo para poder trabajar
 * las instrucciones adentro de ciertas estructuras que generan nuevo ambitos
 * por ejemplo los for, if, while, etc... en el caso de los switch no se aplica esto
 * porque estos no usaban la estructura de { Bloque } sino que solo eran case expresion: Instrucciones.
 */
export class Bloque extends Instruccion {
    public recorridoAmbito: string = "";
    public break_Encontrado: boolean = false;
    public continue_Encontrado: boolean = false;
    public return_Encontrado: boolean = false;

    constructor(
        private instrucciones: Array<Instruccion>,
        line: number,
        column: number
    ) {
        super(line, column)
    }

    public execute(env: Environment) {

        const newEnv = new Environment(env, this.recorridoAmbito)

        //Ejecutar las instrucciones del bloque.
        for (const instruccion of this.instrucciones) {
            if(instruccion instanceof Break == true){
                console.log("se encontro break")
                this.break_Encontrado = true;
                break;
            }

            if(instruccion instanceof Continue == true){
                console.log("se encontro continue")
                this.continue_Encontrado = true;
                break;
            }

            instruccion.execute(newEnv);

            /**Los siguientes If son para validar los break dentro de if's*/
            if(instruccion instanceof If == true){
                if((<If>instruccion).bloque.break_Encontrado == true || (<If>instruccion).else_ElseIf?.break_Encontrado == true){
                    (<If>instruccion).bloque.break_Encontrado = false;
                    if((<If>instruccion).else_ElseIf != null){
                        (<If>instruccion).else_ElseIf!.break_Encontrado = false;
                    }
                    this.break_Encontrado = true;
                    break;
                } 
            }
            /**Los siguientes If son para validar los continue dentro de if's*/
            if(instruccion instanceof If == true){
                if((<If>instruccion).bloque.continue_Encontrado == true || (<If>instruccion).else_ElseIf?.continue_Encontrado == true){
                    (<If>instruccion).bloque.continue_Encontrado = false;
                    if((<If>instruccion).else_ElseIf != null){
                        (<If>instruccion).else_ElseIf!.continue_Encontrado = false;
                    }
                    this.continue_Encontrado = true;
                    break;
                } 
            }
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