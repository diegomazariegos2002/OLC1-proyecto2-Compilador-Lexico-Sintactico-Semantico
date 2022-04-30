import { Expresion } from "../abstracto/Expresion"
import { Retorno, Tipo } from "../abstracto/Retorno"
import { Consola } from "../consola_singleton/Consola"
import { Excepcion } from "../errores/Excepcion"
import { Declaracion_Var } from "../instrucciones/Declaracion_Var"
import { InsFuncion } from "../instrucciones/InsFuncion"
import { Environment } from "../simbolo/Environment"
import { Asignacion } from "../instrucciones/Asignacion"

export class Llamada extends Expresion {

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
        const funcion_Buscada = <InsFuncion>(env.get_variable(this.nombre)?.valor)
        var retorno: Retorno = { value: null, type: Tipo.VOID }

        if (funcion_Buscada == null || funcion_Buscada == undefined) {
            const error = new Excepcion("Error semántico", `no existe una función con este nombre '${this.nombre}'`, this.line, this.column);
            consola.set_Error(error);
            retorno = { value: null, type: Tipo.ERROR }
            return retorno
        }

        //verificar que el numero de parametros ingresados sea el mismo numero de parametros en la funcion almacenada
        if (this.expresiones.length != funcion_Buscada.parametros.length) {
            const error = new Excepcion("Error semántico", `el número de parámetros en la llamada no coincide con los existentes en la función '${this.nombre}'`, this.line, this.column);
            consola.set_Error(error);
            retorno = { value: null, type: Tipo.ERROR }
            return retorno
        }

        //ejecuto cada uno de las expresiones que vienen como parametros y actualizo los valores
        //de mis parametros si alguno no llegase a coincidir entonces salta un error y ya no se ejecuta 
        //la instrucción de llamada.
        var cont = 0;
        this.expresiones.forEach(element => {
            var parametro: Declaracion_Var = funcion_Buscada.parametros[cont];
            var nombreParametro: string = "";
            parametro.lista_nombres.forEach(elementPara => {
                nombreParametro = elementPara;
            });
            const actualizacion_Parametro: Asignacion = new Asignacion(nombreParametro, element, 0, 0);
            actualizacion_Parametro.execute(funcion_Buscada.ambienteFuncion);
            cont++;
        });

        //le mando el recorrido del ambito al bloque de la función llamada.
        funcion_Buscada.bloque!.recorridoAmbito = funcion_Buscada.ambienteFuncion.recorridoAmbito;
        //se añaden al ambito de la función las funciones encontradas en el ambito global y anteriores.
        //Esto para poder realizar la recursividad y todas esas cosas.
        env.obtenerTodasLasFunciones().forEach(element => {
            funcion_Buscada.ambienteFuncion.guardar_variable(element.name, element, element.tipo, element.recorridoFuncion, false, element.line, element.column);
        });

        funcion_Buscada.bloque?.execute(funcion_Buscada.ambienteFuncion);
        retorno = funcion_Buscada.bloque?.valor_Return;

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