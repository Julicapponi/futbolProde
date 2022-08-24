import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {MenuController} from "@ionic/angular";
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-inicio-administrador',
  templateUrl: './inicio-administrador.page.html',
  styleUrls: ['./inicio-administrador.page.scss'],
})
export class InicioAdministradorPage implements OnInit {

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit() {
  }
  listaDeUsers(){
    this.router.navigate(['/list-users']);
  }
  competencias(){
    this.router.navigate(['/altaCompetencia']);
  }
}
