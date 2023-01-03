import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {CompetenciaService} from "../services/competencia.service";
import {AlertController, MenuController, ToastController} from "@ionic/angular";
import {AuthService} from "../services/auth.service";
import {Competencia} from "../class/Competencia";

@Component({
  selector: 'app-list-competencias-admin',
  templateUrl: './list-competencias-admin.page.html',
  styleUrls: ['./list-competencias-admin.page.scss'],
})
export class ListCompetenciasAdminPage implements OnInit {
  competenciasActivas: Competencia[];
  isCargando: boolean;
  filterTerm: string;
  
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

    desactivarComp(Comp:Competencia) {
      this.isCargando = true;
      this.competenciaService.deshabilitarCompetencia(Comp.idcompetition).subscribe(res => {
            console.log(res);
            this.listaCompetenciasActivas();
            this.showToastMessage('Competencia desactivada, los usuarios no podrán visualizarla', 'success', 'thumbs-up');
            this.isCargando = false;
          },
          err => {
            this.showToastMessage(err, 'danger', 'thumbs-down');
            console.log(err);
          }
      );
    }


    async showToastMessage(message:string, color: string, icon: string) {
        const toast = await this.toast.create({
            message: message,
            duration: 500,
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
