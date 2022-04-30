import { Expresion } from "../abstracto/Expresion";
import { Excepcion } from "../errores/Excepcion";
import { Environment } from "../simbolo/Environment";
import { Retorno, Tipo } from "../abstracto/Retorno";
import { Consola } from "../consola_singleton/Consola";
import { Instruccion } from "../abstracto/Instruccion";
import { Bloque } from "./Bloque";
import { Declaracion_Var } from "./Declaracion_Var";

export class InsFuncion extends Instruccion {

    public ambienteFuncion: Environment= new Environment(null,""); //solo para declarar nomás.
    public recorridoFuncion: string = "";
    constructor(
        public name: string,
        public bloque: Bloque,
        public parametros: Array<Declaracion_Var>,
        public tipo: Tipo,
        line: number,
        column: number
    ) {
        super(line, column)
    }

    public execute(env: Environment) {
        const consola = Consola.getInstance()
        let c = env.revisarRepetido(this.name)
        this.recorridoFuncion = env.recorridoAmbito;
        this.ambienteFuncion = new Environment(env, "global -> "+this.name);

        if (c){
            const error = new Excepcion("Error semántico", "declaración de función inválida, ya se ha declarado antes el nombre "+this.name, this.line, this.column);
            consola.set_Error(error);
            return;
        } 

        //Se ejecuta el guardado de cada parametro en el ambiente de la función
        this.parametros.forEach(element => {
            element.execute(this.ambienteFuncion)
        });
        

        //todo esta listo para guardar la función en la tabla de simbolos
        env.guardar_variable(this.name, this, this.tipo, env.recorridoAmbito, false, this.line, this.column);
    }

    public ast() {
        const consola = Consola.getInstance()
        const name_node = `instruccion_${this.line}_${this.column}_`
        consola.set_Ast(`
        ${name_node}[label="\\<Instruccion\\>\\nDeclaración de función"];
        ${name_node}1[label="\\<Bloque Función\\>"];
        ${name_node}->${name_node}1;
        ${name_node}1->instruccion_${this.bloque.line}_${this.bloque.column}_;`)
        this.bloque.ast()
    }
}