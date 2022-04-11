/* Gramatica  */
/* Código de Javascript analizador léxico */
%{
    var cadena = '';
    var errores = [];
%}
/* Comienzo analizador léxico */
%lex
/* Ajustes del analizador léxico */
%options case-insensitive
%x string

%% 

\"[\"^\"]*\"              return 'cadena'

\s+                                 /* Espacio en blanco (los ignora) */
"//"[^\r\n]*[\r|\n|\r\n]?			// Comentario de una linea (los ignora)
[/][*][^*]*[*]+([^/*][^*]*[*]+)*[/] /* Comentario Multilinea (los ignora) */

//Palabras reservadas
"int"                   return 'int'
"double"                return 'double'
"boolean"               return 'boolean'
"char"                  return 'char'
"string"                return 'string'
"true"                  return 'true'
"false"                 return 'false'
"new"                   return 'new'
"if"                    return 'if'
"else"                  return 'else'
"switch"                return 'switch'
"case"                  return 'case'
"default"               return 'default'
"println"               return 'println'
"print"                 return 'print'
"break"                 return 'break'
"while"                 return 'while'
"for"                   return 'for'
"do"                    return 'do'
"continue"              return 'continue'
"return"                return 'return'
"void"                  return 'void'
"toLower"               return 'toLower'
"toUpper"               return 'toUpper'
"Round"                 return 'round'
"length"                return 'length'
"typeof"                return 'typeOf'
"tostring"              return 'to_String'
"toCharArray"           return 'toCharArray'
"run"                   return 'run'

//Simbolos
"++" /*incremento*/     return 'incremento'      
"--" /*decremento*/     return 'decremento'
"+" /*mas*/             return 'mas'
"-" /*menos*/           return 'menos'
"*" /*multiplicacion*/  return 'multiplicacion'
"/" /*division*/        return 'division'
"^"  /*exponente*/      return 'exponente'
"%" /*Modulo*/          return 'modulo'    
"==" /*igualacion*/     return 'igualacion'
"!=" /*Diferenciacion*/ return 'diferenciacion'
"<" /*menorQue*/        return 'menorQue'
"<=" /*menorIgualQue*/  return 'menorIgualQue'
">" /*mayorQue*/        return 'mayorQue'    
">=" /*mayorIgualQue*/  return 'mayorIgualQue'
"=" /*igual*/           return 'igual'
"?" /*interrogacion*/   return 'interrogacion'
":" /*dosPuntos*/       return 'dosPuntos'
";" /*puntoYcoma*/      return 'puntoYcoma'
"||" /*or*/             return 'or'
"&&" /*and*/            return 'and'
"!" /*NOT*/             return 'not'
"(" /*ParentesisAbre*/  return 'parentesisAbre'
")" /*ParentesisCierra*/return 'parentesisCierra'
"{" /*LlaveAbre*/       return 'llaveAbre'
"}" /*LlaveCierra*/     return 'llaveCierra'
"[" /*CorcheteAbre*/    return 'corcheteAbre'
"]" /*CorcheteCierra*/  return 'corcheteCierra'
","                     return 'coma'

//Extras
([a-zA-Z])[a-zA-Z0-9_]* /*Identificador*/ return 'identificador'
[']\\\\[']|[']\\\"[']|[']\\\'[']|[']\\n[']|[']\\t[']|[']\\r[']|['].?[']	return 'caracter'
[0-9]+("."[0-9]+)+\b	                return 'decimal'
[0-9]+					return 'entero'

<<EOF>>               return 'EOF'
.                     { errores.push({ tipo: "Léxico", error: yytext, linea: yylloc.first_line, columna: yylloc.first_column+1 }); return 'invalido'; }

/lex //fin analizador léxico

/* Comienzo analizador sintáctico */
// Importaciones
%{
        //Importanción de instrucciones
	const { Print } = require('../instrucciones/Print.ts');

        //Importación de expresiones
        const { Literal } = require('../expresiones/Literal.ts');
        const { Identificador } = require('../expresiones/Identificador.ts');

        //Importación de herramientas auxiliares
        const { Consola } = require('../singleton_consola/Consola.ts');
        const { ExceptionError } = require('../excepciones/ExceptionError.ts');
%}

/* Precedencias */
%left 'or'
%left 'and'
%right 'not'
%left 'igualacion' 'diferenciacion' 'menorQue' 'menorIgualQue' 'mayorQue' 'mayorIgualQue'
%left 'mas' 'menos'
%left 'multiplicacion' 'division' 'modulo'
%right 'exponente'
%rigth 'incremento' 'decremento'
%left umenos
%left 'parentesisAbre' 

/* Comienzo gramatica */
%start INICIO

%% /* Producciones */

INICIO: 
        ENTRADAS EOF { return $1; }
;

ENTRADAS: 
        ENTRADAS ENTRADA { $1.push($2); $$ = $1; }
        |  ENTRADA{ $$ = [$1]; }
;

ENTRADA:    
        FUNCION {}
        |   METODO {}
        |   RUN {}
        |   DECLARACION_VAR {}
        |   DECLARACION_VECT {}
        |   INSTRUCCION {$$ = [$1]}
;

FUNCION: 
        identificador parentesisAbre parentesisCierra dosPuntos TIPO parentesisAbre parentesisCierra {}
        |   identificador parentesisAbre parentesisCierra dosPuntos TIPO parentesisAbre INSTRUCCIONES parentesisCierra {}
        |   identificador parentesisAbre LISTAPARAMETROS parentesisCierra dosPuntos TIPO parentesisAbre parentesisCierra {}
        |   identificador parentesisAbre LISTAPARAMETROS parentesisCierra dosPuntos TIPO parentesisAbre INSTRUCCIONES parentesisCierra {}
;

METODO: 
        identificador parentesisAbre parentesisCierra dosPuntos void llaveAbre llaveCierra {}
        |   identificador parentesisAbre LISTAPARAMETROS parentesisCierra dosPuntos void llaveAbre llaveCierra {}
        |   identificador parentesisAbre parentesisCierra dosPuntos void llaveAbre INSTRUCCIONES llaveCierra {}
        |   identificador parentesisAbre LISTAPARAMETROS parentesisCierra dosPuntos void llaveAbre INSTRUCCIONES llaveCierra {}
;

RUN: 
    run identificador parentesisAbre parentesisCierra puntoYcoma {}
    |   run identificador parentesisAbre LISTAPARAMETROS parentesisCierra puntoYcoma {}
;

DECLARACION_VAR: 
            TIPO LISTA_VARIABLES puntoYcoma {}
            |   TIPO LISTA_VARIABLES igual EXPRESION puntoYcoma {}
;

LISTA_VARIABLES: 
                LISTA_VARIABLES coma identificador {}
                |   identificador {}
;

DECLARACION_VECT: 
                TIPO identificador corcheteAbre corcheteCierra igual new TIPO corcheteAbre EXPRESION corcheteCierra puntoYcoma
                |       TIPO identificador corcheteAbre corcheteCierra corcheteAbre corcheteCierra igual new TIPO corcheteAbre EXPRESION corcheteCierra corcheteAbre EXPRESION corcheteCierra puntoYcoma
                |       TIPO identificador corcheteAbre corcheteCierra igual corcheteAbre LISTA_VALORES corcheteCierra puntoYcoma
;

LISTA_VALORES:
                LISTA_VALORES coma VALOR {}
                | VALOR {}
;

INSTRUCCIONES:
        INSTRUCCIONES INSTRUCCION { $1.push($2); $$ = $1; }
        | INSTRUCCION { $$ = [$1];}
;

INSTRUCCION: 
        DECLARACION_VAR {}
        |       DECLARACION_VECT {}
        |       FOR {}
        |       WHILE {}
        |       DO_WHILE {}
        |       IF {}
        |       SWITCH {}
        |       ASIGNACION {}
        |       INCREMENTO {}
        |       DECREMENTO {}
        |       LLAMADA {}
        |       PRINT {$$ = $1;}
        |       PRINTLN {}
;

FOR:;
WHILE:;
DO_WHILE:;
IF:;
SWITCH:;
ASIGNACION: identificador igual EXPRESION puntoYcoma;
INCREMENTO: identificador incremento puntoYcoma {};
DECREMENTO: identificador decremento puntoYcoma {};
LLAMADA:;
PRINT:
        print parentesisAbre EXPRESION parentesisCierra puntoYcoma { $$ = new Print($3, @1.first_line, @1.first_column);} 
        |       print parentesisAbre parentesisCierra puntoYcoma { $$ = new Print(null, @1.first_line, @1.first_column);} 
;
PRINTLN:
        print parentesisAbre EXPRESION parentesisCierra puntoYcoma
        |       print parentesisAbre parentesisCierra puntoYcoma
;

EXPRESION: 
        /*Operaciones aritmeticas*/
        EXPRESION mas EXPRESION {}
        |       EXPRESION menos EXPRESION {}
        |       EXPRESION multiplicacion EXPRESION {}
        |       EXPRESION division EXPRESION {}
        |       EXPRESION exponente EXPRESION {}
        |       EXPRESION modulo EXPRESION {}
        |       menos EXPRESION %prec umenos {}
        |       parentesisAbre EXPRESION parentesisCierra {}
        /*Operaciones condicionales*/
        |       EXPRESION igualacion EXPRESION {}
        |       EXPRESION diferenciacion EXPRESION {}
        |       EXPRESION menorQue EXPRESION {}
        |       EXPRESION mayorQue EXPRESION {}
        |       EXPRESION mayorIgualQue EXPRESION {}
        |       EXPRESION menorIgualQue EXPRESION {}
        |       not EXPRESION {}
        /*LLamada de función que devuelve un valor*/
        |       identificador parentesisAbre LISTA_VALORES parentesisCierra puntoYcoma {}
        /*Casteos*/
        |       parentesisAbre TIPO parentesisCierra EXPRESION {} 
        /*Funciones reservadas del lenguaje*/
        |       toLower parentesisAbre EXPRESION parentesisCierra {}
        |       toUpper parentesisAbre EXPRESION parentesisCierra {}
        |       round parentesisAbre EXPRESION parentesisCierra {}
        |       length parentesisAbre EXPRESION parentesisCierra {}
        |       typeOf parentesisAbre EXPRESION parentesisCierra {}
        |       tostring parentesisAbre EXPRESION parentesisCierra {}
        |       toCharArray parentesisAbre EXPRESION parentesisCierra {}
        /*Valores que pueden estar en las expresiones*/
        |       cadena { $$ = new Literal($1, Type.STRING, @1.first_line, @1.first_column); }
        |       entero { $$ = new Literal($1, Type.INT, @1.first_line, @1.first_column); }
        |       decimal { $$ = new Literal($1, Type.DOUBLE, @1.first_line, @1.first_column); }
        |       caracter { $$ = new Literal($1, Type.CHAR, @1.first_line, @1.first_column); }
        |       true { $$ = new Literal($1, Type.BOOLEAN, @1.first_line, @1.first_column); }
        |       false { $$ = new Literal($1, Type.BOOLEAN, @1.first_line, @1.first_column); }
        |       identificador { $$ = new Identificador($1, @1.first_line, @1.first_column);}
        /*recordar que estos van porque se pueden asignar a una variable esto sin afectar a la variable que se incrementa o decrementa EJEM: int a = 10; int b = a++; */
        |       EXPRESION incremento {}
        |       EXPRESION decremento {}
;

VALOR: EXPRESION {} ;

TIPO: 
    int {}
    |   double {}
    |   boolean {}
    |   char {}
    |   string {}
;
