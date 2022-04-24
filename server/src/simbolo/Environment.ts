import { Simbolo } from "./Simbolo";
import { Tipo } from "../abstracto/Retorno"; 
import { Consola } from "../consola_singleton/Consola";

export class Environment{
    /**Mapa de variables */
    public variables: Map<String, Simbolo>

    /**
     * Cuando uno crea una tabla de simbolos puede ser la primera y por lo tanto no tendría 
     * una tabla de simbolos anterior pero si no fuese así quiere decir que existe un ambiente
     * anterior para esta tabla de simbolos por lo que se crea su respectiva variable "anterior".
     * @param anterior 
     */
    constructor(public anterior: Environment | null, public recorridoAmbito: string) {
        this.variables = new Map();
    }

    /**
     * Metodo para guardar una VARIABLE en la tabla de simbolos
     * @param id nombre de la variable
     * @param valor valor de la variable
     * @param tipo tipo de dato de la variable
     * @param ambito ambito en el cual fue declarada la variable
     * @param editable para validar si la variable es editable o no como en el caso de métodos y funciones que no son editables
     * @returns boolan si se efectuo el almacenamiento de la variable
     */
    public guardar_variable(nombre: string, valor: any, tipo: Tipo, ambito:string, editable: boolean, linea: number, columna: number): boolean {

        //revisar que el nombre de la nueva variable se encuentre disponible
        if (this.revisarRepetido(nombre)) return false

        //agrega la variable al MAP 
        var simbolo: Simbolo = new Simbolo(valor, nombre, tipo, ambito, this.getTipo(tipo), editable, linea, columna);
        this.variables.set(nombre, simbolo)
        var consola = Consola.getInstance();
        consola.set_Simbolo(simbolo);
        return true
    }

    /**
     * Metodo para actualizar una VARIABLE almacenada en la tabla de simbolos con un nombre 
     * @param nombre Nombre de la variable que se quiere actualizar
     * @param valor Valor con el que se actualizara
     */
    public actualizar_variable(nombre: string, valor: any) {

        let env: Environment | null = this;

        while (env != null) {
            if (env.variables.has(nombre)) {
                for (let entry of Array.from(env.variables.entries())) {
                    if (entry[0] == nombre) {
                        entry[1].valor = valor;
                        return
                    }
                }
            }
            env = env.anterior;
        }
    }

    /**
     * Metodo para retornar una VARIABLE como [Simbolo]  
     * @param nombre buscar el nombre de la variable en todos los entornos 
     * @returns Un objeto [Simbolo] que tiene la informacion de la variable
     */
    public get_variable(nombre: string): Simbolo | undefined | null {
        let tablaActual: Environment | null = this;
        while (tablaActual != null) {
            if (tablaActual.variables.has(nombre)) return tablaActual.variables.get(nombre);
            tablaActual = tablaActual.anterior;
        }
        return null;
    }

    /**
     * Validación semántica
     * @param nombre nombre de la variable que se quiere declarar
     * @returns si encontro el nombre en la tabla de simbolos retorna un true
     */
    public revisarRepetido(nombre: string): boolean {
        //revisar en las variables almacenadas
        var environmentActual: Environment | null = this.anterior;

        for (let entry of Array.from(this.variables.entries())) {
            if (entry[0] == nombre) return true;
        }

        while(environmentActual != null){ //verificar si no existe la variable en el resto de ámbitos atrás.

            for (let entry of Array.from(environmentActual.variables.entries())) {
                if (entry[0] == nombre) return true;
            }

            environmentActual = environmentActual.anterior;
        }

        //no encontro el nombre , osea que esta disponible para usar
        return false
    }

    public getTipo(tipo: Tipo): string{
        switch(tipo){
            case Tipo.INT:
                return "int";
            case Tipo.DOUBLE:
                return "double";
            case Tipo.CHAR:
                return "char";
            case Tipo.STRING:
                return "string";
            case Tipo.BOOLEAN:
                return "boolean";
            case Tipo.VOID:
                return "void";
            case Tipo.VECTOR:
                return "vector";
            default:
                return "error";
        }
    }
}