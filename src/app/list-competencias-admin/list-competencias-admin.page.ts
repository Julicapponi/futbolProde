import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {CompetenciaService} from "../services/competencia.service";
import {AlertController, MenuController, ToastController} from "@ionic/angular";
import {AuthService} from "../services/auth.service";
import {Competencia} from "../class/Competencia";
import {NAVIGATE_LOGIN} from "../logueo/logueo.page";

@Component({
  selector: 'app-list-competencias-admin',
  templateUrl: './list-competencias-admin.page.html',
  styleUrls: ['./list-competencias-admin.page.scss'],
})
export class ListCompetenciasAdminPage implements OnInit {
  competenciasAltas: Competencia[];
  isCargando: boolean;
  filterTerm: string;
  cambiaNomComp=false;
  toastButtons: { text: string }[];
  
  constructor(private toast: ToastController, private activatedRoute: ActivatedRoute, private competenciaService: CompetenciaService,private router: Router, private menuCtrl: MenuController, private authService: AuthService, public alertController: AlertController, private competitionsService: CompetenciaService) {
    this.listaCompetenciasDadasDeAlta();
      
  }

  ngOnInit() {
  }

    listaCompetenciasDadasDeAlta(){
    this.isCargando = true;
    this.competenciaService.getCompetenciasAltas().subscribe(res => {
          console.log(res);
          this.competenciasAltas = res;
          if(this.competenciasAltas.length===0){
              setTimeout(async () => {
                  this.isCargando = false;
                  this.showToastMessage('Aun no tienes competencias dadas de alta, dirigite a la sección "COMPETENCIAS DEL MUNDO"', 'danger', 'thumbs-down', 3000,"bottom");
              }, 2000);

          } else {
              this.isCargando = false;
              this.competenciasAltas.slice(0,20)
          }
        },
        err => {
          console.log(err);
        }
    );
  }
  volver() {
    this.router.navigate(['/inicio-administrador']);
  }

    async estadoCompetencia(comp: Competencia) {
        let header = '';
        let message = '';
        let esActivarToggle: boolean;
        let valorAnterior = comp.activa; // Guardamos el valor anterior de activa

        if(comp.activa){
            header = 'Desactivar competencia?';
            message = 'Se eliminarán los pronosticos realizados por el usuario y ya no visualizarán la competencia.';
            esActivarToggle = false;
        } else {
            header = 'Activar competencia?';
            message = 'Se sincronizarán los enfrentamientos de la competencia y los usuarios ya la podrán visualizar.';
            esActivarToggle = true;
        }

        await this.alertController.create({
            header: header,
            message: message,
            buttons: [
                {
                    text: 'Aceptar',
                    role: 'accept',
                    handler: () => {
                        this.estadoComp(comp,esActivarToggle);
                       
                    }
                },
                {
                    text: 'Cancelar',
                    role: 'cancel',
                    handler: () => {
                        comp.activa = valorAnterior; // Restablecemos el valor anterior de activa
                        setTimeout(async () => {
                            this.listaCompetenciasDadasDeAlta();
                        }, 1000);
                      
                    }
                }
            ]
        }).then(alert => {
            alert.present();
        });
        
    }

    private estadoComp(comp: Competencia, esActivarToggle) {
        this.isCargando = true;
        if(esActivarToggle){
            this.competenciaService.habilitarCompetencia(comp.idcompetition).subscribe(res => {
                    setTimeout(async () => {
                        this.listaCompetenciasDadasDeAlta();
                    }, 1000);
                    console.log(res);
                    this.showToastMessage('Competencia activada, los usuarios podrán pronosticar!!', 'success', 'thumbs-up', 1000,"bottom");
                    this.isCargando = false;
                },
                err => {
                    this.showToastMessage(err, 'danger', 'thumbs-down', 500,"bottom");
                    console.log(err);
                }
            );
        } else {
            this.competenciaService.deshabilitarCompetencia(comp.idcompetition).subscribe(res => {
                    console.log(res);
                    this.showToastMessage('Competencia desactivada, los usuarios no podrán visualizarla y sus pronosticos han sido eliminados', 'success', 'thumbs-down', 1000,"bottom");
                    this.isCargando = false;
                },
                err => {
                    this.showToastMessage(err, 'danger', 'thumbs-down', 500,"bottom");
                    console.log(err);
                }
            );
        }
     
    }
    
    async dialogError(message: string) {
        await this.alertController.create({
            header: 'Ups!',
            // subHeader: 'Ocurrió ',
            message: message,
            buttons: [
                {
                    text: 'Aceptar',
                    role: 'Cancelar',
                    handler: () => {
                        this.router.navigate([NAVIGATE_LOGIN], { replaceUrl: true });
                    }
                }]
        }).then(alert => {
            alert.present();
        });
    }

  
    
    async showToastMessage(message:string, color: string, icon: string, duration: number, position) {
        const toast = await this.toast.create({
            message: message,
            duration: duration,
            position: position,
            icon: icon, //https://ionic.io/ionicons
            cssClass: '',
            translucent: true,
            animated: true,
            mode: "md",  // md or ios
            color: color //"danger" ｜ "dark" ｜ "light" ｜ "medium" ｜ "primary" ｜ "secondary" ｜ "success" ｜ "tertiary" ｜ "warning" ｜ string & Record<never, never> ｜ undefined
        });
        await toast.present();
    }

    editComp(compEditada: Competencia) {
        console.log(compEditada);
        this.competenciaService.editCompetition(compEditada).subscribe(res => {
                compEditada.yaEdito = true;
                this.isCargando = false;
                compEditada.cambioNombre = false;
                this.showToastMessage('Nombre de la competencia cambiado con exito, ahora los usuarios podrán visualizarlo', 'success', 'thumbs-up',2000,"bottom");
            },
            err => {
                console.log(err);
            }
        );
    }

    cambioNombre(competencia: Competencia) {
      competencia.cambioNombre = true;
    }

    irCompetenciasDelMundo() {
        this.router.navigate(['/list-competencias']);
    }

    async deleteCompetition(comp:Competencia) {
        this.isCargando = true;
        const idComp = comp.idcompetition
        await this.alertController.create({
            header: 'Eliminar competencia',
            message: "¿Borrar competencia de su lista? Si su competencia está activa se recomienda verificar la finalización de la misma. Los usuarios ya no podrán visualizarla.",
            buttons: [
                {
                    text: 'Aceptar',
                    role: 'accept',
                    handler: async () => {
                        await this.competenciaService.eliminarCompetencia(idComp).subscribe(
                            res => {
                                //Respuesta del servicio
                                this.isCargando = false;
                                this.showToastMessage('Competencia eliminada de su lista con exito', 'success', 'thumbs-up', 2000,"bottom");
                                this.listaCompetenciasDadasDeAlta();
                                return res;
                            },
                            err => {
                                // Se muestra error en el caso que la petición falle
                                this.showToastMessage(err.error.message, 'danger', 'thumbs-down', 2000,"bottom");
                                return err;
                            }
                        );
                    }
                },
                {
                    text: 'Cancelar',
                    role: 'cancel',
                    handler: () => {
                        return;
                    }
                }
            ]
        }).then(alert => {
            alert.present();
        });
        
     
    }


    irAltaCompetencias() {
        this.router.navigate(['/list-competencias']);
    }
}
