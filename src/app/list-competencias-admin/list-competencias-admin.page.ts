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
  competenciasActivas: Competencia[];
  isCargando: boolean;
  filterTerm: string;
  cambiaNomComp=false;
  
  constructor(private toast: ToastController, private activatedRoute: ActivatedRoute, private competenciaService: CompetenciaService,private router: Router, private menuCtrl: MenuController, private authService: AuthService, public alertController: AlertController, private competitionsService: CompetenciaService) {
    this.listaCompetenciasActivas();
  }

  ngOnInit() {
  }
  
  listaCompetenciasActivas(){
    this.isCargando = true;
    this.competenciaService.getCompetenciasActivas().subscribe(res => {
          console.log(res);
          this.competenciasActivas = res;
          this.competenciasActivas.slice(0,20)
          this.isCargando = false;
        },
        err => {
          console.log(err);
        }
    );
  }
  volver() {
    this.router.navigate(['/inicio-administrador']);
  }

    async desactivarComp(Comp: Competencia) {
        
        await this.alertController.create({
            header: 'Desactivar competencia?',
            // subHeader: 'Ocurrió ',
            message: 'Se eliminarán los pronosticos realizados por el usuario y ya no visualizarán la competencia.',
            buttons: [
                {
                    text: 'Aceptar',
                    role: 'accept',
                    handler: () => {
                        this.isCargando = true;
                        this.competenciaService.deshabilitarCompetencia(Comp.idcompetition).subscribe(res => {
                                console.log(res);
                                this.listaCompetenciasActivas();
                                this.showToastMessage('Competencia desactivada, los usuarios no podrán visualizarla y sus pronosticos han sido eliminados', 'success', 'thumbs-up',1000);
                                this.isCargando = false;
                            },
                            err => {
                                this.showToastMessage(err, 'danger', 'thumbs-down',500);
                                console.log(err);
                            }
                        );
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

    async showToastMessage(message:string, color: string, icon: string, duration: number) {
        const toast = await this.toast.create({
            message: message,
            duration: duration,
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

    editComp(compEditada: Competencia) {
        console.log(compEditada);
        this.competenciaService.editCompetition(compEditada).subscribe(res => {
                compEditada.yaEdito = true;
                this.isCargando = false;
                compEditada.cambioNombre = false;
                this.showToastMessage('Nombre de la competencia cambiado con exito, ahora los usuarios podrán visualizarlo', 'success', 'thumbs-up',2000);
            },
            err => {
                console.log(err);
            }
        );
    }

    cambioNombre(competencia: Competencia) {
      competencia.cambioNombre = true;
    }
}
