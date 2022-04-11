"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//Importando la consola
const Consola_js_1 = require("./singleton_consola/Consola.js");
//Importando las clases necesarias del lenguaje
const TablaDeSimbolos_js_1 = require("./simbolos/TablaDeSimbolos.js");
/* Aquí van los imports de mis librerías*/
/* Librerías para servidor */
var express = require('express');
const res = require('express/lib/response');
var morgan = require('morgan');
var cors = require('cors');
var app = express();
var corsOptions = { origin: true, optionsSuccessStatus: 200 };
app.use(morgan('dev'));
app.use(express.json());
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
//Importando la gramatica generada
const parser = require('./analizadores/gramatica.js');
var puerto = 8080;
var incremental = 0;
/* ======================== PETICIONES DEL PROYECTO ========================*/
app.post('/analizar', function (request, response) {
    var texto = request.body.dato.toString;
    var consola = Consola_js_1.Consola.getInstance();
    texto += 0;
    const ast = parser.parse(texto.toString);
    const tablaInicial = new TablaDeSimbolos_js_1.TablaDeSimbolos(null);
    //recorrer las instrucciones y ejecutarlas
    for (const instruccion of ast) {
        try {
            instruccion.execute(tablaInicial);
        }
        catch (error) {
            consola.add_error(error);
        }
    }
    var Salida = {
        Consola: consola.get_consola(),
        Reporte: ast.toString()
    };
    response.json(Salida);
});
/* ======================== PETICIONES DE PRUEBA ========================*/
app.listen(puerto, function () {
    console.log('app escuchando en el puerto 8080');
});
app.get('/', function (request, response) {
    response.json({ Mensaje: 'Hola mundoooos!!!' });
});
app.get('/retornoTexto', function (request, response) {
    response.send('Este mensaje es un texto');
});
app.get('/getIncremental', function (request, response) {
    response.send({ Mensaje: 'Este mensaje es un incremental ' + incremental });
});
app.post('/setIncremental', function (request, response) {
    incremental = request.body.dato;
    response.json({ msg: "Operación con éxito!!!" });
});
//# sourceMappingURL=index.js.map