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
  resultBusquedaGrupos: any[];
  isCargando: boolean;
  idUserGreaGrupo: string;
  idUser: string;
  postulacionesEnGrupos: any[];
  
  constructor(private toast: ToastController, private router: Router, private gruposService: GruposService) {
      this.getPostulacionDelUsuario();
  }

  ngOnInit() {
  }

  volver() {
      this.router.navigate(['/partidosPage']);
  }
  
  async getPostulacionDelUsuario(){
      return await new Promise(async resolve => {
          this.isCargando = true;
          this.idUser = localStorage.getItem('idUser');
          this.gruposService.getPostulaciones(this.idUser).subscribe(
              res => {
                  this.isCargando = false;
                  console.log(res);
                  this.postulacionesEnGrupos = res;
              }),
              err => {
              };
      });
      
  }
  
  async buscarGrupo(group: Grupo) {
    this.resultBusquedaGrupos = [];
    console.log(group);
    this.isCargando = true;
    this.gruposService.buscarGroup(group.nameGrupo).subscribe(
        async res => {
            this.isCargando = false;
            console.log(res);
            this.idUserGreaGrupo = localStorage.getItem('idUser');
            this.resultBusquedaGrupos = res;
            if (this.resultBusquedaGrupos.length === 0) {
                this.showToastMessage('No se encontraron resultados para la búsqueda del grupo', 'danger', 'thumbs-down', 3000);
                return;
            }
            for (let i = 0; i < this.resultBusquedaGrupos.length; i++) {
                for (let j = 0; j < this.postulacionesEnGrupos.length; j++) {
                    console.log(this.postulacionesEnGrupos[j]);
                    console.log(this.resultBusquedaGrupos[i]);
                    if(this.postulacionesEnGrupos[j].group_id === this.resultBusquedaGrupos[i].idgrupo){
                        this.resultBusquedaGrupos[i].yaPostulado = true;
                        break;
                    } else {
                        this.resultBusquedaGrupos[i].yaPostulado = false;
                    }
                }
            }
        }),
        err => {
        };
  }

    postularseAGrupo(group: Grupo) {
    console.log('Postulandose al grupo:', group);
    this.gruposService.postularAlGroup(group).subscribe(
        res => {
          console.log(res);
          this.showToastMessage(res.message,'success','thumbs-up', 3000)
            this.volver();
        }),
        err => {
            this.showToastMessage(err.message,'danger','thumbs-down', 3000)
        };
  }

    async showToastMessage(message:string, color: string, icon: string, duracion: number) {
        const toast = await this.toast.create({
            message: message,
            duration: duracion,
            icon: icon, //https://ionic.io/ionicons
            cssClass: '',
            position: "bottom",
            translucent: true,
            animated: true,
            mode: "md",  // md or ios
            color: color //"danger" ｜ "dark" ｜ "light" ｜ "medium" ｜ "primary" ｜ "secondary" ｜ "success" ｜ "tertiary" ｜ "warning" ｜ string & Record<never, never> ｜ undefined
        });
        await toast.present();
    }

  
}
