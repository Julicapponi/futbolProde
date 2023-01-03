import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AlertController, MenuController, ToastController} from "@ionic/angular";
import {AuthService} from "../services/auth.service";
import {CompetenciaService} from "../services/competencia.service";
import {Competencia} from "../class/Competencia";

@Component({
  selector: 'app-list-competencias',
  templateUrl: './list-competencias.page.html',
  styleUrls: ['./list-competencias.page.scss'],
})
export class ListCompetenciasPage implements OnInit {
    private listCompetitions: Competencia[];
    filterTerm: string;
    isCargando: boolean;
    seActivoCompetencia: boolean;
    isActivateCheckbox: boolean;
    competenciasActivas: Competencia;
    listaCompetenciasActivas=[];
    listAllCompetitions: any;
    isCargandoMasComp: boolean;
  constructor(private toast: ToastController, private activatedRoute: ActivatedRoute, private competenciaService: CompetenciaService,private router: Router, private menuCtrl: MenuController, private authService: AuthService, public alertController: AlertController, private competitionsService: CompetenciaService) { 
    this.listCompetenciaActivas();
    this.listarCompetenciasPorId();
  }

  ngOnInit() {
  }

   async listCompetenciaActivas(){
        return await new Promise(async resolve => {
            this.competenciaService.getCompetenciasActivas().subscribe(res => {
                    console.log(res);
                    for (let comp of res) {
                        console.log(comp);
                        this.listaCompetenciasActivas.push(comp.idcompetition);
                    }
                    resolve (this.listaCompetenciasActivas);
                },
                err => {
                    console.log(err);
                }
            );
        });
    }
    
  listarCompetenciasPorId(){
      this.isCargando = true;
    this.competitionsService.getLigas().subscribe(
        data => {
          this.listAllCompetitions = data.response;
            for (var i = 0; i < this.listAllCompetitions.length; i++) {
                for (var j = 0; j < this.listaCompetenciasActivas.length; j++) {
                    if (this.listAllCompetitions[i].league.id == this.listaCompetenciasActivas[j]) {
                        this.listAllCompetitions[i].league.isActiva = true;
                        continue;
                    }
                }
            }
          this.listCompetitions = this.listAllCompetitions.slice(0,15);
          console.log(this.listaCompetenciasActivas);
          console.log('Lista de competencias', JSON.stringify(this.listCompetitions));
          this.isCargando = false;
        },
        err => {
          console.log(err);
          alert(err.error);
        }
    );
  }
    
  
    volver() {
        this.router.navigate(['/inicio-administrador']);
    }

    isChecked(competencia: Competencia) {
      if(competencia.league.isActiva){
          this.seActivoCompetencia = true;
      } else {
          this.seActivoCompetencia = false;
      }
      /*
        if (event.detail.checked == true) {
            this.seActivoCompetencia = true;
        } else {
            this.seActivoCompetencia = false;
        }
        
       */
        this.activarODesactivarCompetencia(competencia, this.seActivoCompetencia);
    }

    activarODesactivarCompetencia(comp: any, compActiva: boolean) {
            this.competenciaService.editStateCompetition(comp, compActiva).subscribe(
                res => {
                    console.log(res);
                    if(res.message.includes('Competencia desactivada')){
                        this.showToastMessage('Competencia desactivada, los usuarios no podrán visualizar los enfrentamientos. Si desea activarla nuevamente, los enfrentamientos se visualizarán luego de las 00:00', "danger");
                    }
                    if(res.message.includes('Competencia activada')){
                        this.showToastMessage('Competencia activada con éxito, ahora los usuarios podrán visualizarla', "success");
                    }
                    if(res.checkbox){
                        this.isActivateCheckbox = true;
                    } else {
                        this.isActivateCheckbox = false;
                    }
                },
                err => {
                    console.log(err);
                }
            );
    }

    async showToastMessage(message:string, color: string) {
        const toast = await this.toast.create({
            message: message,
            duration: 6000,
            icon: 'checkmark', //https://ionic.io/ionicons
            cssClass: '',
            position: "bottom",
            translucent: true,
            animated: true,
            mode: "md",  // md or ios
            color: color //"danger" ｜ "dark" ｜ "light" ｜ "medium" ｜ "primary" ｜ "secondary" ｜ "success" ｜ "tertiary" ｜ "warning" ｜ string & Record<never, never> ｜ undefined
        });
        await toast.present();
    }

    irListaComp() {
        this.router.navigate(['/list-competencias-admin']);
    }

    verMas() {
      this.isCargandoMasComp = true;
      this.listCompetitions = this.listAllCompetitions;
    }
}
