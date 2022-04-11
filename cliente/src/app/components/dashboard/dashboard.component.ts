import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private service: UserService) { }

  ngOnInit(): void {
  }

  getData(){
    //Que retorne la información
    //Aquí mando a llamar a la función que tengo en el service
    //y recordar que el service es el conecta con mi servidor NodeJs
    //esto del suscribe es como el fetch en javascript recordar eso también.
    this.service.getData().subscribe(
      //si la petición resulta correcta
      (res)=>{console.log(res)}, 
      //Si sucede un error en la petición
      (err)=> {console.log(err)}
    )
  }
  
  setData(){
      var body = {
        dato:30
      }
      this.service.setData(body).subscribe(
        (res)=> {
          alert("Todo fue realizado con éxito!!!")
        }, 
        (err)=> {
          console.log(err)
        }
      )
  }
}

 