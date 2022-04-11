"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get = exports.Type = void 0;
/*CLASE DONDE DECLARO LOS TIPOS DE VARIABLES QUE HAY EN MI LENGUAJE*/
var Type;
(function (Type) {
    /*0*/ Type[Type["INT"] = 0] = "INT";
    /*1*/ Type[Type["DOUBLE"] = 1] = "DOUBLE";
    /*2*/ Type[Type["CHAR"] = 2] = "CHAR";
    /*3*/ Type[Type["STRING"] = 3] = "STRING";
    /*4*/ Type[Type["BOOLEAN"] = 4] = "BOOLEAN";
    /*5*/ Type[Type["VOID"] = 5] = "VOID";
    /*6*/ Type[Type["error"] = 6] = "error";
})(Type = exports.Type || (exports.Type = {}));
/**
 *
 * @param objeto Objeto tipo Type
 * @returns String con el nombre del tipo
 */
function get(objeto) {
    switch (objeto) {
        case 0:
            return "number";
        case 1:
            return "string";
        case 2:
            return "boolean";
        default:
            return "";
    }
}
exports.get = get;
//# sourceMappingURL=Retorno.js.map