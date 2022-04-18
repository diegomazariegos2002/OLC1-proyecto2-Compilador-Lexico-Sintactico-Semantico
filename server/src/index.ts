import { Consola } from "./consola_singleton/Consola";
import { Environment } from "./simbolo/Environment";

/* Aquí van los imports de mis librerías*/
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

app.post('/analizar', function(request:any, response:any){
    
    var entrada = request.body.entrada;
    console.log("Estoy analizando");
    console.log(entrada);
    var consola = Consola.getInstance();
    consola.cleanConsola();
    //realizando el analisis de la entrada.
    consola.set_Ast("digraph G { \nnode[shape=box];\nnodeInicio[label=\"<\\ INICIO \\>\"];\n\n");
    const ast = parser.parse(entrada);
    const env = new Environment(null); 

    for(const instruccion of ast){
        try{
            consola.set_Ast(`nodeInicio->node_${instruccion.line}_${instruccion.column}_;\n`)
            instruccion.ast()
            instruccion.execute(env)
        }catch(error){
            console.log("soy un error"+error)
        }
    }

    consola.set_Ast("}"); //para cerrar el dot porque es más práctico hacerlo aquí que en la gramática

    console.log(consola.get_Ast());

    /* Salida de datos */ 
    var salida = 
    {
        entrada: entrada,
        consola: consola.getConsola(),
        errores: consola.get_Errores(),
        ast: consola.get_Ast(),
        resultado: ast
    }
    response.json(salida)
})

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