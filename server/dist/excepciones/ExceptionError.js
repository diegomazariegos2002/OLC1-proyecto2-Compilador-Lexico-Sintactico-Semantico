"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExceptionError = void 0;
class ExceptionError {
    constructor(tipo, desc, fila, columna) {
        this.tipoError = tipo;
        this.desc = desc;
        this.fila = fila;
        this.columna = columna;
    }
    getDesc() {
        return this.desc;
    }
    getTipoError() {
        return this.tipoError;
    }
    getcolumna() {
        return this.columna;
    }
    getFila() {
        return this.fila;
    }
    returnError() {
        return ('Se obtuvo: ' +
            this.tipoError +
            ' desc:{' +
            this.desc +
            '} en la fila: ' +
            this.fila +
            ' en la columna: ' +
            this.columna +
            '\n');
    }
}
exports.ExceptionError = ExceptionError;
//# sourceMappingURL=ExceptionError.js.map