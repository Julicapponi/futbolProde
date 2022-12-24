import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertController, MenuController} from '@ionic/angular';
import { CompetenciaService } from '../services/competencia.service';
import {Comp} from "../class/Comp";
import {Enfrentamiento} from "../class/Enfrentamiento";
import {NAVIGATE_LOGIN} from "../logueo/logueo.page";
import {NAVIGATE_REGISTRO} from "../registro/registro.page";
import {Competencia} from "../class/Competencia";
import {Observable, Subscription} from "rxjs";
import { ComparteDatosService } from '../services/comparte-datos.service';
import { SharingServiceService } from '../services/sharing-service.service';

@Component({
  selector: 'app-inicio-page',
  templateUrl: './inicio-page.page.html',
  styleUrls: ['./inicio-page.page.scss'],
})
export class InicioPagePage implements OnInit {
  partidos: Enfrentamiento[];
  partidosComp: Enfrentamiento;
  competenciasActivas: any;
  idCompetenciaSeleccionada: string;
  anioCompetenciaSeleccionada: string;
  fechasCompetencia: any = [];
  detallePartido: any;
  idCompetencia: string;
  anioCompetencia: string;
  isCargando = true;
  subscriptionCompetencia: Subscription;
  private data$: Observable<Comp>;

  constructor(private route: ActivatedRoute, private sharingService: SharingServiceService,
              private router: Router, private menuCtrl: MenuController, private competenciaService: CompetenciaService, public alertController: AlertController, private comparteDatosService: ComparteDatosService ) {
    this.menuCtrl.enable(true);
  }

  ngOnInit() {
    this.competenciaService.getCompetenciasActivas().subscribe(res => {
          console.log(res);
          this.competenciasActivas = res;
        },
        err => {
          console.log(err);
        }
    );
  }

  //accion desplegar menu
  toggleMenu(){
    this.menuCtrl.toggle();
  }

  irListaUsuarios(){
    this.router.navigate(['/listaUsuarios']);
  }

  irAResultadosFootball(){
    this.router.navigate(['/partidosPage']);
  }

  async altaPronosticos() {
    if(this.idCompetenciaSeleccionada == '' || this.idCompetenciaSeleccionada == undefined) {
      this.dialogFailed('Debe seleccionar alguna competencia');
    } else {
      //ENVIO LA DATA DE PARTIDOS A LIST-ENFRENTAMIENTOS
      /*
      await this.comparteDatosService.disparadorPartidosLiga.emit({
        data: this.partidos
      });
       */
      this.router.navigate(['/listEnfrentamientos']);
    }

  }

  ngMode($event){
    this.idCompetenciaSeleccionada = $event.idcompetition;
    this.anioCompetenciaSeleccionada = $event.anio;
    this.buscarCompetencias(this.idCompetenciaSeleccionada, this.anioCompetenciaSeleccionada);
    console.log('Competencia seleccionada por el usuario:'+this.idCompetenciaSeleccionada + 'con el anio' + this.anioCompetenciaSeleccionada);
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
          this.partidosComp = data;
          this.partidos = data;
          this.sharingService.setearPartidos = this.partidosComp;
          for (const part of this.partidos) {
            /* VER FILTRO DE FECHAS YA QUE SE CAMBIO SE CONSUME DESDE LA BD, NO DE LA API
            const fechaComp = part.league.round.toString();
            if (!this.fechasCompetencia.includes(fechaComp)) {
              this.fechasCompetencia.push(fechaComp);
            }
          
             */
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
  async dialogSucess(message: string) {
    await this.alertController.create({
      header: 'Genial!',
      // subHeader: 'Ocurrió ',
      message: message,
      buttons: [
        {
          text: 'Aceptar',
          role: 'Cancelar',
          handler: () => {
            this.router.navigate([NAVIGATE_REGISTRO], { replaceUrl: true });
          }
        }]
    }).then(alert => {
      alert.present();
    });
  }

    cerrarSesion() {
      localStorage.clear();
      this.router.navigate(['/home']);
    }

  openMenu() {
    this.menuCtrl.enable(true);
  }
}
