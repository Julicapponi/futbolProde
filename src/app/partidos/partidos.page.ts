import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import { AuthService } from '../services/auth.service';
import { ResultsService } from '../services/results.service';
import {GruposService} from "../services/grupos.service";
import {Comp} from "../class/Comp";
import {ModalController} from "@ionic/angular";
import {Grupo} from "../class/Grupo";

@Component({
  selector: 'app-partidos',
  templateUrl: './partidos.page.html',
  styleUrls: ['./partidos.page.scss'],
})
export class PartidosPage implements OnInit {
  gruposDelUser: any[];
  idUserGreaGrupo: string;
  isCargando: boolean;
  
  constructor(private router: Router, private authService: AuthService, private gruposService: GruposService, private resultService: ResultsService, private modalCrontroller: ModalController) {
   
  }
  
  
  
  ngOnInit() {
    this.getUserPorGrupo();
  }
  
  async getUserPorGrupo(): Promise<any> {
    return await new Promise(async resolve => {
      this.idUserGreaGrupo = localStorage.getItem('idUser');
      console.log('usuario creando grupo:',this.idUserGreaGrupo )
      await this.gruposService.getGruposPorUser(this.idUserGreaGrupo).subscribe(async respuesta => {
        this.isCargando = false;
        console.log('GRUPOS QUE PERTENECE EL USUARIO', respuesta);
        this.gruposDelUser = respuesta;
      });
    });
  }

  salirDelGrupo(group: Grupo) {
    console.log('saliendo del grupo:', group);
    this.isCargando = true;
    this.gruposService.salirDelGrupo(group).subscribe(
        res => {
          this.isCargando = false;
          console.log(res);
          //refresco la lista
          this.ngOnInit();
        }),
        err => {
        };
  }

  borrarGrupo(group: Grupo) {
    console.log('uniendose al grupo:', group);
    this.isCargando = true;
    this.gruposService.borrarGrupo(group).subscribe(
        res => {
          this.isCargando = false;
          console.log(res);
          //refresco la lista
          this.ngOnInit();
        }),
        err => {
        };
  }
  
  volver() {
    this.router.navigate(['/inicioPage']);
  }

  async crearGrupo() {
    this.router.navigate(['/crear-grupo']);
  }

  buscarGrupo() {
    this.router.navigate(['/buscar-group']);
  }

  
}
