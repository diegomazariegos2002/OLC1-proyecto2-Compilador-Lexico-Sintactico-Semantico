"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TablaDeSimbolos = void 0;
const Simbolo_1 = require("./Simbolo");
class TablaDeSimbolos {
    /**
     * Cuando uno crea una tabla de simbolos puede ser la primera y por lo tanto no tendría
     * una tabla de simbolos anterior pero si no fuese así quiere decir que existe un ambiente
     * anterior para esta tabla de simbolos por lo que se crea su respectiva variable "anterior".
     * @param anterior
     */
    constructor(anterior) {
        this.anterior = anterior;
        this.variables = new Map();
    }
    /**
     * Metodo para guardar una VARIABLE en la tabla de simbolos
     * @param id nombre de la variable
     * @param valor valor de la variable
     * @param type tipo de dato de la variable
     * @param condicion si es editable
     * @returns boolan si se efectuo el almacenamiento de la variable
     */
    guardar_variable(nombre, valor, type) {
        //revisar que el nombre de la nueva variable se encuentre disponible
        if (this.revisarRepetido(nombre))
            return false;
        //agrega la variable al MAP 
        this.variables.set(nombre, new Simbolo_1.Symbol(valor, nombre, type));
        return true;
    }
    /**
     * Metodo para actualizar una VARIABLE almacenada en la tabla de simbolos con un nombre
     * @param nombre Nombre de la variable que se quiere actualizar
     * @param valor Valor con el que se actualizara
     */
    actualizar_variable(nombre, valor) {
        let env = this;
        while (env != null) {
            if (env.variables.has(nombre)) {
                for (let entry of Array.from(env.variables.entries())) {
                    if (entry[0] == nombre) {
                        entry[1].value = valor;
                        return;
                    }
                }
            }
            env = env.anterior;
        }
    }
    /**
     * Metodo para retornar una VARIABLE como [Symbol]
     * @param nombre buscar el nombre de la variable en todos los entornos
     * @returns Un objeto [Symbol] que tiene la informacion de la variable
     */
    get_variable(nombre) {
        let tablaActual = this;
        while (tablaActual != null) {
            if (tablaActual.variables.has(nombre))
                return tablaActual.variables.get(nombre);
            tablaActual = tablaActual.anterior;
        }
        return null;
    }
    /**
     * Validación semántica
     * @param nombre nombre de la variable que se quiere declarar
     * @returns si encontro el nombre en la tabla de simbolos retorna un true
     */
    revisarRepetido(nombre) {
        //revisar en las variables almacenadas
        for (let entry of Array.from(this.variables.entries())) {
            if (entry[0] == nombre)
                return true;
        }
        //no encontro el nombre , osea que esta disponible para usar
        return false;
    }
}
exports.TablaDeSimbolos = TablaDeSimbolos;
//# sourceMappingURL=TablaDeSimbolos.js.map