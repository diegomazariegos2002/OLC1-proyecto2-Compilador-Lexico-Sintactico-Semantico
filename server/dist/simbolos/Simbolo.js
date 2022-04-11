"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Symbol = void 0;
class Symbol {
    /**
     * Clase que guarda toda la informacion importante de una variable
     * y despues sera almacenada en su respectiva tabla de simbolos.
     * Porque hay que recordar que en este proyecto se utilizaron ambientes.
     */
    constructor(value, id, type) {
        this.value = value;
        this.id = id;
        this.type = type;
    }
}
exports.Symbol = Symbol;
//# sourceMappingURL=Simbolo.js.map