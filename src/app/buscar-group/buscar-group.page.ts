import { Component, OnInit } from '@angular/core';
import {ToastController} from "@ionic/angular";
import {Router} from "@angular/router";
import {GruposService} from "../services/grupos.service";
import {Grupo} from "../class/Grupo";

@Component({
  selector: 'app-buscar-group',
  templateUrl: './buscar-group.page.html',
  styleUrls: ['./buscar-group.page.css'],
})
export class BuscarGroupPage implements OnInit {
  group: Grupo = {
    idGrupo: null,
    nameGrupo: "", 
    idUserCreador: ""
  };
  resultBusquedaGrupos: Grupo[];
  isCargando: boolean;
  idUserGreaGrupo: string;
  
  constructor(private toast: ToastController, private router: Router, private gruposService: GruposService) {
      
  }

  ngOnInit() {
  }

  volver() {
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      this.router.navigate(['/partidosPage']);
    });
  }

  buscarGrupo(group: Grupo) {
    this.resultBusquedaGrupos = [];
    console.log(group);
    this.isCargando = true;
    this.gruposService.buscarGroup(group.nameGrupo).subscribe(
        res => {
          this.isCargando = false;
          console.log(res);
          this.idUserGreaGrupo = localStorage.getItem('idUser');
          this.resultBusquedaGrupos = res;
        }),
        err => {
        };
  }

  unirseAlGrupo(group: Grupo) {
    console.log('uniendose al grupo:', group);
    this.gruposService.unirseGroup(group).subscribe(
        res => {
          console.log(res);
        }),
        err => {
        };
  }

  
}
