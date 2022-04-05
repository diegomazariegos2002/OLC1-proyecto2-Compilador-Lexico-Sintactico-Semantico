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

var puerto = 8080;
var incremental = 0;

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