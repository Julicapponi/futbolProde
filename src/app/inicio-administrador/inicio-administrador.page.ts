import { Component, OnInit } from '@angular/core';
import {NavigationExtras, Router} from "@angular/router";
import {MenuController} from "@ionic/angular";
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-inicio-administrador',
  templateUrl: './inicio-administrador.page.html',
  styleUrls: ['./inicio-administrador.page.scss'],
})
export class InicioAdministradorPage implements OnInit {

  constructor(private menuCtrl: MenuController, private router: Router, private authService: AuthService) {
    this.menuCtrl.enable(true);
  }

  ngOnInit() {
  }

  //accion desplegar menu
  toggleMenu(){
    this.menuCtrl.toggle();
  }
  
  listaDeUsers(){
    this.router.navigate(['/list-users']);
  }

    listaDeCompetencias() {
    this.router.navigate(['/list-competencias']);
    }

  miListaDeCompetencias() {
    this.router.navigate(['/list-competencias-admin']);
  }

  irRegistro() {
    const navigationExtras: NavigationExtras ={
      state:{
        isAdmin: true
      }
    }
    this.router.navigate(['/registroPage'], navigationExtras);
  }


  irEditEnfrentamientos() {
    this.router.navigate(['/modificar-enfrentamientos']);
  }

  cerrarSesion() {
    localStorage.clear();
    this.router.navigate(['/home']);
  }

    irReporteGrupos() {
      this.router.navigate(['/reporte-grupos']);
    }
}
