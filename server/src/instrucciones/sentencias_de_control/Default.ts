import { Expresion } from "../../abstracto/Expresion";
import { Excepcion } from "../../errores/Excepcion";
import { Environment } from "../../simbolo/Environment";
import { Retorno, Tipo } from "../../abstracto/Retorno";
import { Consola } from "../../consola_singleton/Consola";
import { Instruccion } from "../../abstracto/Instruccion";
import { Bloque } from "../Bloque";
import { Return } from "../sentencias_de_transicion/Return";
import { If } from "./If";
import { Switch } from "./Switch";

export class Default extends Instruccion {

    /**
     * Estas variables es porque se generan nuevos ambitos con estas funciones y en caso de retornos
     * tiene que devolver algo.
     */
    public return_Encontrado: boolean = false;
    public valor_Return: Retorno = { value: null, type: Tipo.VOID };

    constructor(
        private lista_instrucciones: Instruccion[] | null,
        public existe_Break: boolean,
        line: number,
        column: number
    ) {
        super(line, column)
    }

    public execute(env: Environment) {
        var consola = Consola.getInstance(); //instancia de la consola por posibles errores
        const newEnv = new Environment(env, env.recorridoAmbito + " -> switch default")

        this.lista_instrucciones?.forEach(instruccion => {
            /**Para cuando en el bloque la instrucción a ejecutar sea un return; */
            if (instruccion instanceof Return == true) {
                console.log("se encontro return")
                this.return_Encontrado = true;
                //Se ejecuta la expresión que trae el Return.
                const exec_Return = (<Return>instruccion).expresion?.execute(newEnv);
                if (exec_Return != null && exec_Return != undefined) { //Si el return si venía con una expresión
                    this.valor_Return = exec_Return; //se actualiza el retorno de mi bloque
                }
                return;
            } /**Los siguientes If son para validar los {return} dentro de if's*/
            else if (instruccion instanceof If == true) {
                if ((<If>instruccion).bloque.return_Encontrado == true) {
                    (<If>instruccion).bloque.return_Encontrado = false;

                    this.return_Encontrado = true;
                    this.valor_Return = (<If>instruccion).bloque.valor_Return;
                    (<If>instruccion).bloque.valor_Return = { value: null, type: Tipo.VOID };
                    return;

                } else if ((<If>instruccion).return_Encontrado == true) {
                    if ((<If>instruccion).else_ElseIf != null) {
                        (<If>instruccion).return_Encontrado = false;
                        this.valor_Return = (<If>instruccion).valor_Return;
                        (<If>instruccion).valor_Return = { value: null, type: Tipo.VOID };
                    }

                    this.return_Encontrado = true;
                    return;
                }
            }
            /**Si el {return} proviene de un switch principalmente*/
            else if (instruccion instanceof Switch) {
                if ((instruccion).return_Encontrado == true) {
                    (instruccion).return_Encontrado = false;

                    this.return_Encontrado = true;
                    this.valor_Return = (instruccion).valor_Return;
                    (instruccion).valor_Return = { value: null, type: Tipo.VOID };
                    return;
                }
            }

            /**Si no es ninguna instrucción que genere ámbitos como if, while, for, do_while, etc... */
            else {
                instruccion.execute(newEnv);
            }
        });
    }

    public ast() {
        const consola = Consola.getInstance()
        var name_node = `instruccion_${this.line}_${this.column}_`
        consola.set_Ast(`
        ${name_node}[label="\\<Instrucción\\>\\nDefault"];        
        ${name_node}_AmbitoDefault[label="\\<Nuevo ámbito\\>"];
        ${name_node} -> ${name_node}_AmbitoDefault;
        `)
        name_node = `${name_node}_AmbitoDefault`;
        var cont = 0;
        var inst_line_anterior = 0;
        var inst_col_anterior = 0;
        this.lista_instrucciones?.forEach(instruccion => {
            if (cont == 0) {
                consola.set_Ast(`${name_node}->instruccion_${instruccion.line}_${instruccion.column}_;`)
            } else {
                consola.set_Ast(`instruccion_${inst_line_anterior}_${inst_col_anterior}_->instruccion_${instruccion.line}_${instruccion.column}_;`)
            }
            inst_line_anterior = instruccion.line;
            inst_col_anterior = instruccion.column;
            instruccion.ast()
            cont++;
        })
    }
}