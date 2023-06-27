import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {GruposService} from "../services/grupos.service";
import {AlertController, ModalController, NavParams, ToastController} from "@ionic/angular";
import {Postulacion} from "../class/Postulacion";

@Component({
  selector: 'app-postulaciones',
  templateUrl: './postulaciones.page.html',
  styleUrls: ['./postulaciones.page.css'],
})
export class PostulacionesPage implements OnInit {
  isCargando: boolean;
  idUser: string;
  postulacionesPendientesParaAceptar: any[];
  postulaciones: Postulacion[];
  
  constructor(private toast: ToastController, private router: Router, private modalCtrl: ModalController, private gruposService: GruposService, private activatedRoute: ActivatedRoute, public alertController: AlertController) {
        this.notificationPendienteParaGrupo();
      /*
      if(params != null && params.get('postulaciones') != null ){
      this.postulaciones = params.get('postulaciones');
    }
    
       */
  }

    ngOnInit() {

    }
    
    async volver() {
        this.router.navigate(['/partidosPage']);
    }

  async notificationPendienteParaGrupo(): Promise<any> {
      return await new Promise(async resolve => {
          this.isCargando = true;
          this.idUser = localStorage.getItem('idUser');
          await this.gruposService.getPostulacionesPendientesDeAceptar(this.idUser).subscribe(
              res => {
                  this.isCargando = false;
                  this.postulacionesPendientesParaAceptar = res;
                  resolve(res);
              }),
              err => {
              };
      });
  }
    async postulacionGrupo(isAcepta, idUser, idGrupo): Promise<any> {
      //ACEPTA postulacion del usuario
        if (isAcepta) {
            return await new Promise(async resolve => {
                this.isCargando = true;
                await this.gruposService.addPostulante(idUser, idGrupo).subscribe(
                    res => {
                        setTimeout(async () => {
                            this.showToastMessage('Has ACEPTADO con exito la postulacion del usuario a tu grupo', 'primary', 'thumbs-up', 5000);
                        }, 5000);
                        this.isCargando = false;
                        console.log(res);
                        this.router.navigate(['/partidosPage']);
                    }),
                    err => {
                    };
            });
        } else {
            //RECHAZA postulacion del usuario
            return await new Promise(async resolve => {
                this.isCargando = true;
                await this.gruposService.rechazoPostulante(idUser, idGrupo).subscribe(
                    res => {
                        setTimeout(async () => {
                                this.showToastMessage('Has RECHAZADO con exito la postulacion del usuario a tu grupo', 'primary', 'thumbs-up', 5000);
                        }, 5000);
                        this.isCargando = false;
                        console.log(res);
                        this.router.navigate(['/partidosPage']);
                    }),
                    err => {
                    };
            });
        }
    }
    async agregarPostulanteAlGrupo(idUser, idGrupo): Promise<any> {
        // AGREGAR USUARIO A LA TABLA MIEMBROS_GRUPO
        return await new Promise(async resolve => {
            this.isCargando = true;
            await this.gruposService.agregarPostulanteAlGrupo(idUser, idGrupo).subscribe(
                res => {
                    this.isCargando = false;
                    console.log(res);

                }),
                err => {
                };
        });
    }
    
    async deletePostulacionDelUser(idUser, idGrupo): Promise<any> {
        // ELIMINAR POSTULACION DEL USUARIO Y DE X GRUPO DE LA TABLA POSTULACIONES_GRUPO
        return await new Promise(async resolve => {
            this.isCargando = true;
            await this.gruposService.borrarPostulacion(idUser, idGrupo).subscribe(
                res => {
                    this.isCargando = false;
                    console.log(res);
                }),
                err => {
                };
        });
    }
    
  aceptaPostulante(isAcepta: boolean, datos: Postulacion) {
        this.postulacionGrupo(isAcepta, datos.user_id, datos.idgrupo)
        /*
        this.agregarPostulanteAlGrupo(datos.user_id, datos.idgrupo);
        this.deletePostulacionDelUser(datos.user_id, datos.idgrupo);
         
        this.notificationPendienteParaGrupo();
        
         */
  }

    async showToastMessage(message:string, color: string, icon: string, duracion:number) {
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
