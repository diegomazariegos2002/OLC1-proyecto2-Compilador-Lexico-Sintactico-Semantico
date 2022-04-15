import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'; //Se añadio esto
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { FormsModule } from '@angular/forms';
@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,      // Se añadio para poder recibir y enviar información a los textAreas.
    HttpClientModule // Se añadio esto, sino lo añadimos nos va a tirar error cuando hagamos peticiones.
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
