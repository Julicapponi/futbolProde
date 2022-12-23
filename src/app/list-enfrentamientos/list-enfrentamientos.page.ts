import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertController, MenuController} from '@ionic/angular';
import {AuthService} from '../services/auth.service';
import {CompetenciaService} from '../services/competencia.service';
import {DatePipe} from '@angular/common';
import {Competencia} from '../class/Competencia';
import {Subscription} from 'rxjs';
import {Comp} from '../class/Comp';
import {ResultsService} from '../services/results.service';
import {ComparteDatosService} from '../services/comparte-datos.service';
import {SharingServiceService} from '../services/sharing-service.service';
import {Partido} from "../class/Partido";
import { PronosticosService } from '../services/pronosticos.service';
import {User} from "../class/User";
import {Enfrentamiento} from "../class/Enfrentamiento";

@Component({
  selector: 'app-list-enfrentamientos',
  templateUrl: './list-enfrentamientos.page.html',
  styleUrls: ['./list-enfrentamientos.page.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class ListEnfrentamientosPage implements OnInit, OnDestroy{
  detallePartido: any;
  idCompetencia: string;
  anioCompetencia: string;
  golesLocal = 0;
  golesVisitante = 0;
  idEquipoLocal = 0;
  idPartido = 0;
  idEquipoVisitante = 0;
  competencia: Competencia[];
  isCargandoPartidos = true;
  isCargando = true;
  myDate = Date.now();
  fechaHoy: string;
  compFixture: any;
  fecha: string;
  partidoTerminado = false;
  partidoEnCurso = false;
  subscriptionCompetencia: Subscription;
  partidos: Enfrentamiento[];
  fechasCompetencia: any = [];
  fechaComp= '';
  fechaCompara= '';
  partidosFiltrado: Comp[];
  partidosPronosticados = Array<Partido>();
  list = {
    'pronosticos' :[]
  };
  pronostico : Partido = {
    idPartido: null,
    userName: null,
    userId: null,
    idEquipoLocal: null,
    nombreEquipoLocal: null,
    idEquipoVisitante: 0,
    nombreEquipoVisitante: null,
    ganaLocal: null,
    ganaVisitante: null,
    golLocal: 0,
    golVisitante: 0,
  };
  
  i: number;
  partidosFiltrados: Comp[];

  jsonPronosticos: any;
  
  realizoCalculo = false;
  constructor(private router: Router, private sharingService: SharingServiceService, private route: ActivatedRoute, private menuCtrl: MenuController,
              private authService: AuthService, private resultService: ResultsService,
              private competenciaService: CompetenciaService, public alertController: AlertController,
              public datepipe: DatePipe, private comparteDatosService: ComparteDatosService, private cdr: ChangeDetectorRef, private pronosticosService: PronosticosService) {
    //this.execute();
    this.obtenerPartidos();
  }

  obtenerPartidos(){
    this.isCargandoPartidos = true;
    setTimeout(async () => {
      
    }, 6000);
    this.sharingService.obtenerPartidos.subscribe((data: Enfrentamiento[]) => {
      this.partidos = data;
      this.isCargandoPartidos = false;
    });
  }


  filtrarPartidosPorFecha( fecha: string) {
    console.log('Seleccionaste esta fecha:', fecha);
    /*
   if(fecha.includes('Quarter-finals')) {
     this.partidosFiltrados = this.partidos.filter(partido => partido.league.round.includes('Quarter'));
     this.partidos = [];
     this.partidos = this.partidosFiltrados;
     this.cdr.detectChanges();
     console.log(this.partidos);
   } else if(fecha.includes('Semi-finals')) {
      this.partidos = this.partidos.filter(partido => partido.league.round.includes('Semi-finals'));
      console.log(this.partidos);
    } else {
     console.log('No se consiguió obtener los partidos');
   }
   
     */
   // VER PORQUE NO REFREZCA PANTALLA AL FILTRAR POR FECHA
   this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
  }

  ngOnInit() {

  }

  volver() {
    this.list.pronosticos = [];
    this.router.navigate(['/inicioPage']);
  }

  async calcularResultado(idEquipoLocal: number, idEquipoVisitante: number, idPartido: number, isSuma: boolean, isLocal: boolean) {
    this.i = 0;
    
   
    if(this.list.pronosticos.length > 0 ) {
      for(let [i, pronostico] of this.list.pronosticos.entries()){
        console.log(i);
        if(pronostico.idPartido == idPartido){
          this.realizoCalculo = true;
          if (isLocal) {
            if (isSuma) {
              this.list.pronosticos[i].golLocal = this.list.pronosticos[i].golLocal +1;
            } else {
              if (this.list.pronosticos[i].golLocal > 0) {
                this.list.pronosticos[i].golLocal = this.list.pronosticos[i].golLocal - 1;
              }
            }
          } else if (!isLocal) {
            if (isSuma) {
              this.list.pronosticos[i].golVisitante = this.list.pronosticos[i].golVisitante +1;
            } else {
              if (this.list.pronosticos[i].golVisitante > 0) {
                this.list.pronosticos[i].golVisitante = this.list.pronosticos[i].golVisitante - 1;
              }
            }
          }
        } else {
          continue;
        }
      }
    } else {
      if(!this.realizoCalculo) {
        if(idPartido != undefined){
          var pronostico_idPartido = idPartido;
          var pronostico_userName = localStorage.getItem('userName');
          var pronostico_idEquipoVisitante = idEquipoVisitante;
          var pronostico_idEquipoLocal = idEquipoLocal;
        }
        if (isLocal) {
          if (isSuma) {
            this.golesLocal = this.golesLocal + 1;
          } else {
            if (this.golesLocal > 0) {
              this.golesLocal = this.golesLocal - 1;
            }
          }
        } else if (!isLocal) {
          if (isSuma) {
            this.golesVisitante = this.golesVisitante + 1;
          } else {
            if (this.golesVisitante > 0) {
              this.golesVisitante = this.golesVisitante - 1;
            }
          }
        }

        this.list.pronosticos.push({
          "idPartido": pronostico_idPartido,
          "userName": pronostico_userName,
          //"userId": ,
          //"ganaLocal": ,
          //"ganaVisitante": ,
          "golLocal": this.golesLocal,
          "golVisitante": this.golesVisitante,
          "idEquipoLocal": pronostico_idEquipoLocal,
          "idEquipoVisitante": pronostico_idEquipoVisitante,
          //"nombreEquipoLocal": ,
          //"nombreEquipoVisitante": ,

        });
        console.log(this.list.pronosticos);
      }
    }
    if(!this.realizoCalculo) {
      if(idPartido != undefined){
        var pronostico_idPartido = idPartido;
        var pronostico_userName = localStorage.getItem('userName');
        var pronostico_idEquipoVisitante = idEquipoVisitante;
        var pronostico_idEquipoLocal = idEquipoLocal;
      }
      if (isLocal) {
        if (isSuma) {
          this.golesLocal = this.golesLocal + 1;
        } else {
          if (this.golesLocal > 0) {
            this.golesLocal = this.golesLocal - 1;
          }
        }
      } else if (!isLocal) {
        if (isSuma) {
          this.golesVisitante = this.golesVisitante + 1;
        } else {
          if (this.golesVisitante > 0) {
            this.golesVisitante = this.golesVisitante - 1;
          }
        }
      }

      this.list.pronosticos.push({
        "idPartido": pronostico_idPartido,
        "userName": pronostico_userName,
        //"userId": ,
        //"ganaLocal": ,
        //"ganaVisitante": ,
        "golLocal": this.golesLocal,
        "golVisitante": this.golesVisitante,
        "idEquipoLocal": pronostico_idEquipoLocal,
        "idEquipoVisitante": pronostico_idEquipoVisitante,
        //"nombreEquipoLocal": ,
        //"nombreEquipoVisitante": ,

      });
      console.log(this.list.pronosticos);
    }
    console.log(JSON.stringify(this.list.pronosticos));

    /*
    if (this.idPartido !== 0 && this.idPartido !== idPartido && this.idEquipoLocal !== idEquipo || this.idEquipoVisitante !== idEquipo) {
      console.log('se cambio de partido');
      console.log('construir json idequipo, golesPronosticados');
      this.golesLocal = 0;
      this.golesVisitante = 0;
      this.i = this.i + 1;
    }
    this.idPartido = idPartido;
    if (isLocal) {
      this.idEquipoLocal = idEquipo;
      if (isSuma) {
        this.golesLocal = this.golesLocal + 1;
      } else {
        if (this.golesLocal > 0) {
          this.golesLocal = this.golesLocal - 1;
        }
      }
      this.pronostico[this.i].idEquipoLocal = this.idEquipoLocal;
      this.pronostico[this.i].golLocal = this.golesLocal;
    } else if (!isLocal) {
      this.idEquipoVisitante = idEquipo;
      if (isSuma) {
        this.golesVisitante = this.golesVisitante + 1;
      } else {
        if (this.golesVisitante > 0) {
          this.golesVisitante = this.golesVisitante - 1;
        }
      }
      this.pronostico[this.i].idEquipoVisitante = this.idEquipoVisitante;
      this.pronostico[this.i].golVisitante = this.golesVisitante;
    }
     */
    

  }

  guardarPronosticos() {
    this.jsonPronosticos.push(this.list.pronosticos);
    var jsonPrueba = JSON.stringify(this.list)
    var obj = JSON.parse(jsonPrueba);
    console.log(JSON.stringify(this.jsonPronosticos));
  }
  
  execute(){
    const params = [];
    for (let i = 0; i < 100; i++) {
      const pronostico = new Partido();
      pronostico.idPartido = 1;
      pronostico.userName = 'Partido: ' + (i+1).toString();
      pronostico.userId = 3;
      pronostico.idEquipoLocal = 4;
      pronostico.nombreEquipoLocal = 'Partido: ' + (i+1).toString();
      pronostico.idEquipoVisitante = 5;
      pronostico.nombreEquipoVisitante = 'Partido: ' + (i+1).toString();
      pronostico.ganaLocal = false;
      pronostico.ganaVisitante = true;
      pronostico.golLocal = 5;
      pronostico.golVisitante = 5;
      params.push(pronostico);
    }
    /*
    this.pronosticosService.sync(params).then(() => {
    this.pronosticosService.get().then((data: Partido[]) => {
      console.log('Datos que se han insertado en tabla:', data);
      this.partidosPronosticados = data;
    }).catch(e => console.log(e));
    }).catch(e => console.log(e));
     */
  }

  async fechaEvent($event: any) {
    console.log($event);
    const fecha = $event.toString();
    if(fecha.includes('2nd Round')){
      this.fechaCompara = fecha;
      this.fechaComp = 'Fecha 2';
    }
    this.filtrarPartidosPorFecha(fecha);
  }

  /*
  guardarPronostico(idPartido: number, idEquipoLocal: number, idEquipoVisitante: number, ganoLocal: boolean, ganoVisitante: boolean, golesLocal: number, golesVisitante: number) {
    
    console.log('GUARDADO DE PRONOSTICO');
    console.log('Id Partido:', idPartido);
    console.log('idEquipoLocal:', idEquipoLocal);
    console.log('idEquipoVisitante:', idEquipoVisitante);
    console.log('gana Local:', ganoLocal);
    console.log('gana Visitante:', ganoVisitante);
    console.log('golesLocal:', golesLocal);
    console.log('golesVisitante:', golesVisitante);

    this.resultService.altaResultado(idPartido).subscribe(
      res => {

        this.dialogSucess('Resultados guardados con exito');
      },
      err => {
        console.log(err);
        this.dialogError('No se pudo guardar, reintentalo');
      }
    );
  }
  
   */

  async dialogError(message: string) {
    await this.alertController.create({
      header: 'Ups!',
      // subHeader: 'Ocurrió ',
      message,
      buttons: [
        {
          text: 'Aceptar',
          role: 'Cancelar',
          handler: () => {
          }
        }]
    }).then(alert => {
      alert.present();
    });
  }

  async dialogSucess(message: string) {
    await this.alertController.create({
      header: 'Genial!',
      // subHeader: 'Ocurrió ',
      message,
      buttons: [
        {
          text: 'Aceptar',
          role: 'Cancelar',
          handler: () => {
          }
        }]
    }).then(alert => {
      alert.present();
    });
  }



}

