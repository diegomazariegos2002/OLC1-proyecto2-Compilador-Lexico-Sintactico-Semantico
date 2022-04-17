import { Instruccion } from "../abstracto/Instruccion"
import { Environment } from "../simbolo/Environment"
import { Excepcion } from "../errores/Excepcion"
import { Consola } from "../consola_singleton/Consola"
import { Expresion } from "../abstracto/Expresion"


export class Asignacion extends Instruccion {

    constructor(
        public nombre: string,
        public value: Expresion,
        line: number,
        column: number
    ) {
        super(line, column)
    }

    public execute(env: Environment) {
        var consola = Consola.getInstance(); //instancia de la consola por posibles errores
        const expresion = this.value.execute(env)
        var todoCorrecto: boolean = true;

        var variable = env.get_variable(this.nombre)
        //validar que todo este bien antes de actualizar la variable
        if (variable == null || variable == undefined){
            const error = new Excepcion("Error semántico", `No existe una variable con este nombre '${this.nombre}'`, this.line, this.column);
            consola.set_Error(error);
            todoCorrecto = false;
        } 
        if (!variable?.editable){
            const error = new Excepcion("Error semántico", `Asignacion incorrecta, la variable con nombre '${this.nombre}' no puede ser modificable.`, this.line, this.column);
            consola.set_Error(error);
            todoCorrecto = false;
        } 
        if (variable?.tipo != expresion.type) {
            const error = new Excepcion("Error semántico", `Asignacion incorrecta, la variable con nombre '${this.nombre}' es de tipo [${variable?.tipo}] y se le esta tratando de asignar un tipo [${expresion.type}]`, this.line, this.column);
            consola.set_Error(error);
            todoCorrecto = false;
        }

        if (todoCorrecto == true) {
            env.actualizar_variable(this.nombre, expresion.value)    
        }
        
    }

    public ast() {

        const consola = Consola.getInstance()
        const nombre_nodo =`node_${this.line}_${this.column}_`
        consola.set_Ast(`
        ${nombre_nodo}[label="\\<Instruccion\\>\\nAsignacion"];
        ${nombre_nodo}1[label="\\<Nombre\\>\\n${this.nombre}"];
        ${nombre_nodo}->${nombre_nodo}1;
        ${nombre_nodo}->${this.value.ast()}
        `)

    }
}