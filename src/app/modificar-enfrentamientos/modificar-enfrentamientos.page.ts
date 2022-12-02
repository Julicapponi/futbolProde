import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {CompetenciaService} from "../services/competencia.service";
import {AlertController, MenuController} from "@ionic/angular";
import {AuthService} from "../services/auth.service";
import {Enfrentamiento} from "../class/Enfrentamiento";
import {Comp} from "../class/Comp";
import {Observable, Subscription} from "rxjs";
import {SharingServiceService} from "../services/sharing-service.service";

@Component({
  selector: 'app-modificar-enfrentamientos',
  templateUrl: './modificar-enfrentamientos.page.html',
  styleUrls: ['./modificar-enfrentamientos.page.scss'],
})
export class ModificarEnfrentamientosPage implements OnInit {
  isCargando: boolean;
  filterTerm: string;
  enfrentamientos: Enfrentamiento[];
    partidos: Comp[];
    partidosComp: Comp ;
    competenciasActivas: any;
    idCompetenciaSeleccionada: string;
    anioCompetenciaSeleccionada: string;
    fechasCompetencia: any = [];
    detallePartido: any;
    idCompetencia: string;
    anioCompetencia: string;
    subscriptionCompetencia: Subscription;
    private data$: Observable<Comp>;
    compActivas: string;
    competenciaSeleccionada: any;
  
  constructor(private activatedRoute: ActivatedRoute, private competenciaService: CompetenciaService, private sharingService: SharingServiceService, private router: Router, private menuCtrl: MenuController, private authService: AuthService, public alertController: AlertController, private competitionsService: CompetenciaService) {
      this.competenciasActiv();
      this.listEnfrentamientosBD();
     
  }

  ngOnInit() {
      
  }


  listEnfrentamientosBD(){
    this.competenciaService.getEnfrentamientosBD().subscribe(res => {
        console.log(res);
        this.enfrentamientos = res;
        err => {
            console.log(err);
        }
    });
  }
  
  
    volver() {
      this.router.navigate(['/inicio-administrador']);
    }

    ngMode($event){
        this.competenciaSeleccionada = $event.name;
        this.idCompetenciaSeleccionada = $event.idcompetition;
        this.anioCompetenciaSeleccionada = $event.anio;
        console.log('Competencia seleccionada: '+this.idCompetenciaSeleccionada + ' con el anio: ' + this.anioCompetenciaSeleccionada);
        
    }
    
    competenciasActiv(){
        this.competenciaService.getCompetenciasActivas().subscribe(res => {
                console.log(res);
                this.competenciasActivas = res;
            },
            err => {
                console.log(err);
            }
        );
    }
    
    buscarCompetencias(idCompetenciaSeleccionada: string, anioCompetenciaSeleccionada: string) {
        this.fechasCompetencia = [];
        this.isCargando = true;
        if (idCompetenciaSeleccionada == '' || idCompetenciaSeleccionada == undefined) {
            this.dialogFailed('Debe seleccionar alguna competencia');
        } else {
            console.log('Se muestra competencia con este id: ', idCompetenciaSeleccionada);
            this.subscriptionCompetencia = this.competenciaService.getEnfrentamientos(idCompetenciaSeleccionada, anioCompetenciaSeleccionada).subscribe(
                data => {
                    console.log('PARTIDOS EN LA PAGINA PRINCIPAL: ');
                    console.log(JSON.stringify(data));
                    this.partidosComp = data.response;
                    this.partidos = data.response;
                    this.sharingService.setearPartidos = this.partidosComp;
                    for (const part of this.partidos) {
                        const fechaComp = part.league.round.toString();
                        if (!this.fechasCompetencia.includes(fechaComp)) {
                            this.fechasCompetencia.push(fechaComp);
                        }
                    }
                    console.log(this.fechasCompetencia);
                    this.isCargando = false;
                },
                err => {
                    console.log(err);
                }
            );
        }
    }

    
    async dialogFailed(message: string) {
        await this.alertController.create({
            header: 'Ups!',
            message: message,
            buttons: [
                {
                    text: 'Aceptar'
                }]
        }).then(alert => {
            alert.present();
        });
    }
}
