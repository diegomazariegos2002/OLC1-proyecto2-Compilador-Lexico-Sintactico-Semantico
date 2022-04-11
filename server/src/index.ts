//Importando la consola
import { Consola } from "./singleton_consola/Consola.js";
//Importando las clases necesarias del lenguaje
import { TablaDeSimbolos } from "./simbolos/TablaDeSimbolos.js";

/* Aquí van los imports de mis librerías*/
/* Librerías para servidor */
var express = require('express');
const res = require('express/lib/response');
var morgan = require('morgan');
var cors = require('cors');
var app = express();
var corsOptions = {origin: true, optionsSuccessStatus: 200};

app.use(morgan('dev'));
app.use(express.json());
app.use(cors(corsOptions));
app.use(express.urlencoded({extended: true}));

//Importando la gramatica generada
const parser = require('./analizadores/gramatica.js');

var puerto = 8080;
var incremental = 0;

/* ======================== PETICIONES DEL PROYECTO ========================*/

app.post('/analizar', function(request:any, response:any){
    var texto = request.body.dato.toString;
    var consola = Consola.getInstance();
    const ast = parser.parse(texto.toString);
    const tablaInicial = new TablaDeSimbolos(null);

    //recorrer las instrucciones y ejecutarlas
    for (const instruccion of ast) {
        try {
            instruccion.execute(tablaInicial);
        } catch (error) {
            consola.add_error(error)
        }
    }

    var Salida = 
    {
        Consola: consola.get_consola(),
        Reporte: ast.toString()
    }

    response.json(Salida);
})

/* ======================== PETICIONES DE PRUEBA ========================*/ 
app.listen(puerto, function(){
    console.log('app escuchando en el puerto 8080')
})

app.get('/', function(request:any, response:any){
    response.json({Mensaje:'Hola mundoooos!!!'})
})

app.get('/retornoTexto', function(request:any, response:any){
    response.send('Este mensaje es un texto')
})

app.get('/getIncremental', function(request:any, response:any){
    response.send({Mensaje:'Este mensaje es un incremental '+incremental})
})

app.post('/setIncremental', function(request:any, response:any){
    incremental = request.body.dato;
    response.json({msg: "Operación con éxito!!!"})
})



