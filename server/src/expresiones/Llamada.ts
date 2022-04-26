import { Expresion } from "../abstracto/Expresion"
import { Retorno, Tipo } from "../abstracto/Retorno"
import { Consola } from "../consola_singleton/Consola"
import { Excepcion } from "../errores/Excepcion"
import { Environment } from "../simbolo/Environment"

export class Call extends Expresion {

    constructor(
        private nombre: string,
        private expresiones: Array<Expresion>,
        line: number,
        column: number
    ) {
        super(line, column)
    }

    public execute(env: Environment) {
        var consola = Consola.getInstance(); //instancia de la consola por posibles errores
        const funcion_Buscada = env.get_variable(this.nombre)
        var retorno: Retorno = {value: null, type: Tipo.VOID}

        if (funcion_Buscada == null || funcion_Buscada == undefined){
            const error = new Excepcion("Error semántico", `no existe una función con este nombre '${this.nombre}'`, this.line, this.column);
            consola.set_Error(error);
            retorno = {value: null, type: Tipo.ERROR}
            return retorno
        }

        //verificar que el numero de parametros ingresados sea el mismo numero de parametros en la funcion almacenada
        if (this.expresiones.length != funcion_Buscada.valor.parametros.length){
            const error = new Excepcion("Error semántico", `el número de parámetros en la llamada no coincide con los existentes en la función '${this.nombre}'`, this.line, this.column);
            consola.set_Error(error);
            retorno = {value: null, type: Tipo.ERROR}
            return retorno
        }

        //ejecuto cada uno de las expresiones que vienen como parametros y los almaceno los tipos en un array
        let array: number[] = []
        this.expresiones.forEach(x => {
            const expre = x.execute(env)
            array.push(expre.type)
        })

        return retorno;
    }

    public ast() {
        const nombre = `node_${this.line}_${this.column}_`
        return `
        ${nombre};
        ${nombre}[label="\\<Valor\\>\\n\\"\\""];
        `
    }
}