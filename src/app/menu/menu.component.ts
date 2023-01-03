import { Component, OnInit } from '@angular/core';
import {ListaRutas} from "../class/lista_menu";
import {MenuController} from "@ionic/angular";
import {Router} from "@angular/router";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent implements OnInit {
  user: string;
  name: string;
  
  public lista_rutas: ListaRutas[] = [
    {name:'Inicio', ruta:'/home', icon:'home-outline'},
    {name:'Como jugar?', ruta:'/home', icon:'information-circle-outline'},
    {name:'Compartir app', ruta:'/home', icon:'share-social-outline'},
    {name:'Configuración', ruta:'/home', icon:'construct-outline'},
    {name:'Contacto', ruta:'/home', icon:'logo-whatsapp'},
  ]
  constructor( private menuCtrl: MenuController, private router: Router) {
    this.user = localStorage.getItem('userName');
    this.name = localStorage.getItem('name');
  }

  ngOnInit() {}

  closeMenu() {
    this.menuCtrl.close('main-content');
  }

  cerrarSesion() {
    localStorage.clear();
    this.router.navigate(['/home']);
  }
}
