import { Component, OnInit } from '@angular/core';
import {NavigationExtras, Router} from "@angular/router";
import { AuthService } from '../services/auth.service';
import { ResultsService } from '../services/results.service';
import {GruposService} from "../services/grupos.service";
import {Comp} from "../class/Comp";
import {AlertController, ModalController, ToastController} from "@ionic/angular";
import {Grupo} from "../class/Grupo";
import {EditUserPage} from "../edit-user/edit-user.page";
import {EditGroupPage} from "../edit-group/edit-group.page";

@Component({
  selector: 'app-partidos',
  templateUrl: './partidos.page.html',
  styleUrls: ['./partidos.page.scss'],
})
export class PartidosPage implements OnInit {
  gruposDelUser: any[];
  idUserGreaGrupo: string;
  isCargando: boolean;
  sinGruposUnido= false;
  idUser: string;
  postulacionesPendientesParaAceptar: any[];
  cantidadNotificaciones: number;
  
  constructor(public alertController: AlertController,private toast: ToastController,  private modalCtrl: ModalController, private router: Router, private authService: AuthService, private gruposService: GruposService, private resultService: ResultsService, private modalCrontroller: ModalController) {
   
  }


    ngOnInit() {
        this.notificationPendienteParaGrupo();
        this.getUserPorGrupo();
    }
    
    ionViewWillEnter() {
        this.notificationPendienteParaGrupo();
        this.getUserPorGrupo();
    }
  
  async getUserPorGrupo(): Promise<any> {
    return await new Promise(async resolve => {
      this.idUserGreaGrupo = localStorage.getItem('idUser');
      this.isCargando = true;
      console.log('usuario creando grupo:',this.idUserGreaGrupo )
      await this.gruposService.getGruposPorUser(this.idUserGreaGrupo).subscribe(async respuesta => {
        this.isCargando = false;
          console.log('GRUPOS QUE PERTENECE EL USUARIO', respuesta);
          this.gruposDelUser = respuesta;
          if(this.gruposDelUser.length === 0){
            this.sinGruposUnido = true;
          }
      });
    });
  }

  async salirDelGrupo(group: Grupo) {
    console.log('saliendo del grupo:', group);
      await this.alertController.create({
          header: 'Seguro quieres salir de este grupo?',
          message: 'Confirmar?',
          buttons: [
              {
                  text: 'Cancelar',
                  role: 'cancel',
                  handler: () => {

                  }
              },
              {
                  text: 'Aceptar',
                  role: 'accept',
                  handler: () => {
                      this.isCargando = true;
                      this.gruposService.salirDelGrupo(group).subscribe(
                          res => {
                              this.isCargando = false;
                              console.log(res);
                              //refresco la lista
                              this.ngOnInit();
                          }),
                          err => {
                              this.showToastMessage('Error al salir del grupo, reintente más tarde', "danger",'thumbs-down', 1500);;
                          };
                  }
              }
          ]
      }).then(alert => {
          alert.present();
      });
  }

    async editarGrupo(grupo: any) {
        const profileModal = await this.modalCtrl.create({
            component: EditGroupPage,
            cssClass: 'modal_popup',
            showBackdrop: true,
            backdropDismiss: false,
            componentProps: {
                grupo: grupo,
            },
        });
        profileModal.onDidDismiss().then(() => {
            this.notificationPendienteParaGrupo();
            this.getUserPorGrupo();
        });
        profileModal.present();
    }
    
  async borrarGrupo(group: Grupo) {
      await this.alertController.create({
          header: 'Eliminar grupo?',
          // subHeader: 'Ocurrió ',
          message: 'Se eliminarán todos los participantes del grupo',
          buttons: [
              {
                  text: 'Aceptar',
                  role: 'accept',
                  handler: () => {
                      console.log('borrando el grupo:', group);
                      this.isCargando = true;
                      this.gruposService.borrarGrupo(group).subscribe(
                          res => {
                              this.isCargando = false;
                              this.showToastMessage('Grupo eliminado, los demás participantes tambien fueron eliminados y ya no visualizaran el grupo', 'success', 'thumbs-up',3000);
                              console.log(res);
                              //refresco la lista
                              this.ngOnInit();
                          }),
                          err => {
                          };
                  }
              },
              {
                  text: 'Cancelar',
                  role: 'cancel',
                  handler: () => {

                  }
              }
          ]
      }).then(alert => {
          alert.present();
      });
      
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
    
  volver() {
    this.router.navigate(['/inicioPage']);
  }

  async crearGrupo() {
    this.router.navigate(['/crear-grupo']);
  }

  buscarGrupo() {
    this.router.navigate(['/buscar-group']);
  }




  notificationPendienteParaGrupo() {
    this.isCargando = true;
    this.idUser = localStorage.getItem('idUser');
    this.gruposService.getPostulacionesPendientesDeAceptar(this.idUser).subscribe(
        res => {
          this.isCargando = false;
          this.postulacionesPendientesParaAceptar = res;
          this.cantidadNotificaciones = this.postulacionesPendientesParaAceptar.length;
        }),
        err => {
        };
  }

  async irNotificacionesMiembrosPorAceptar() {
      this.router.navigate(['/postulaciones']);
      /*
          const profileModal = await this.modalCtrl.create({
              component: PostulacionesPage,
              cssClass: 'modal_popup',
              showBackdrop: true,
              backdropDismiss: false,
              componentProps: {
                  postulaciones: this.postulacionesPendientesParaAceptar
              },
          });
          profileModal.present();
      }
      /*
      const navigationExtras: NavigationExtras ={
          state:{
              postulaciones: this.postulacionesPendientesParaAceptar
          }
      }
      this.router.navigate(['/postulaciones-pendientes'], navigationExtras);
  
  }
       */
  }


    verPuntajes(grupo: any) {
      console.log(grupo.idgrupo);
      let idGrupo = grupo.idgrupo.toString();
      this.router.navigate(['/puntajes-group'], { queryParams: { idGrupo: idGrupo, nameGrupo:grupo.nameGrupo.toString()} });
    }
}
