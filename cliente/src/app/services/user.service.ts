import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  URL = "http://localhost:8080";
  constructor(private http:HttpClient) { } //recordar que este http yo se lo agregue para poder hacer peticiones

  /**Funciones del proyecto */
  compilar(json: any){
    return this.http.post(`${this.URL}/analizar`, json)
  }
  
  /*Esto va segun lo tengamos en nuestro servidor */
  getData(){
    return this.http.get(`${this.URL}/getIncremental`)
  } 

  setData(json: any){
    return this.http.post(`${this.URL}/setIncremental`, json)
  }

}
