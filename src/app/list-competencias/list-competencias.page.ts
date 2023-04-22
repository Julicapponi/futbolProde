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
    isAltaCompetencia: boolean;
    isActivateCheckbox: boolean;
    competenciasActivas: Competencia;
    competenciasDadasDeAlta=[];
    listAllCompetitions: any[];
    isCargandoMasComp: boolean;
    isAgregandoCompetencia = false;
    faltaCargarTodasLasCompetencias=true;
  constructor(private toast: ToastController, private activatedRoute: ActivatedRoute, private competenciaService: CompetenciaService,private router: Router, private menuCtrl: MenuController, private authService: AuthService, public alertController: AlertController, private competitionsService: CompetenciaService) { 
    this.listCompetenciaAltas();
    this.listarCompetenciasPorId();
  }

  ngOnInit() {
  }

   async listCompetenciaAltas(){
        return await new Promise(async resolve => {
            this.competenciaService.getCompetenciasAltas().subscribe(res => {
                    console.log(res);
                    for (let comp of res) {
                        console.log(comp);
                        this.competenciasDadasDeAlta.push(comp.idcompetition);
                    }
                    resolve (this.competenciasDadasDeAlta);
                },
                err => {
                    console.log(err);
                }
            );
        });
    }
    
  async listarCompetenciasPorId(){
    this.isCargando = true;
    await this.competitionsService.getLigas().subscribe(
        data => {
          this.listAllCompetitions = data.response;
            for (var i = 0; i < this.listAllCompetitions.length; i++) {
                for (var j = 0; j < this.competenciasDadasDeAlta.length; j++) {
                    if (this.listAllCompetitions[i].league.id == this.competenciasDadasDeAlta[j]) {
                        this.listAllCompetitions[i].league.isAlta = true;
                        continue;
                    }
                }
            }
          this.validarActual(this.listAllCompetitions);
          this.listCompetitions = this.listAllCompetitions.slice(0,15);
          console.log(this.competenciasDadasDeAlta);
          console.log('Lista de competencias', JSON.stringify(this.listCompetitions));
     
          this.isCargando = false;
        },
        err => {
          console.log(err);
          alert(err.error);
        }
    );
   
  }
    
    validarActual(competencias :Competencia[]){
        //para validar si la habilito o no si es actual o no
        const currentDate = new Date().getUTCFullYear(); // paso 1
        for (let objeto of competencias) {
            if(objeto.league.id === 128){
                console.log('aca');
            }
            const seasons = objeto.seasons.map(season => season.year); // obtenemos una lista de los años de cada season
            const league = objeto.league; // obtenemos la propiedad league del objeto
            if (seasons.includes(currentDate) || seasons.includes(currentDate - 1) || seasons.includes(currentDate + 1)) { // paso 3
                league.anioActualOReciente = true;
            } else {
                league.anioActualOReciente = false;
            }
        }
    }
  
    volver() {
        this.router.navigate(['/inicio-administrador']);
    }

    async isChecked(competencia: Competencia) {
      if(competencia.league.isAlta){
          this.isAltaCompetencia = true;
      } else {
          this.isAltaCompetencia = false;
      }
      await this.altaOBajaCompetencia(competencia, this.isAltaCompetencia);
    }

    async altaOBajaCompetencia(comp: any, isAlta: boolean) {
      this.isAgregandoCompetencia = true;
      // Servicio que va a realizar la petición al backend de
        const res = await this.competenciaService.altaOBajaService(comp, isAlta).subscribe(
                res => {
                    this.isAgregandoCompetencia = false;
                    //Respuesta del servicio
                    console.log(res);
                    if(res.message.includes('Competencia dada de baja.')){
                        this.showToastMessage('Competencia eliminada de su lista.', "danger");
                    }
                    if(res.message.includes('Competencia dada de alta con éxito')){
                        this.showToastMessage('Competencia agregada con éxito a su lista, recordá activarla para que los usuarios la visualicen', "success");
                    }
                    //estados checkbox
                    if(res.checkbox){
                        this.isActivateCheckbox = true;
                    } else {
                        this.isActivateCheckbox = false;
                    }
                    return res;
                },
                err => {
                    // Se muestra error en el caso que la petición falle
                    this.showToastMessage(err.error.message, "danger");
                    this.isAgregandoCompetencia = false;
                    this.isActivateCheckbox = false;
                    comp.league.isAlta = false;
                    return err;
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
        setTimeout(async () => {
            this.isCargandoMasComp = false;
        }, 3000);
      this.faltaCargarTodasLasCompetencias = false;
      this.listCompetitions = this.listAllCompetitions;
    }

    mostrarDesabilitado(competencia:Competencia) {
        if(!competencia.league.anioActualOReciente){
            this.showToastMessage('No puedes habilitar, no hay competencia en la actualidad', "danger");
        }
        return;
    }
}
