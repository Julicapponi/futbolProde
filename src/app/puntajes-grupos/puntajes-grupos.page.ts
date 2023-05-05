import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AlertController, MenuController, ModalController, ToastController} from "@ionic/angular";
import {AuthService} from "../services/auth.service";
import {GruposService} from "../services/grupos.service";
import {Competencia} from "../class/Competencia";
import {Subscription} from "rxjs";
import {Enfrentamiento} from "../class/Enfrentamiento";
import {Comp} from "../class/Comp";
import {Partido} from "../class/Partido";
import {SharingServiceService} from "../services/sharing-service.service";
import {ResultsService} from "../services/results.service";
import {CompetenciaService} from "../services/competencia.service";
import {DatePipe} from "@angular/common";
import {ComparteDatosService} from "../services/comparte-datos.service";

import {Puntaje} from "../class/Puntaje";

@Component({
  selector: 'app-puntajes-grupos',
  templateUrl: './puntajes-grupos.page.html',
  styleUrls: ['./puntajes-grupos.page.css'],
})
export class PuntajesGruposPage implements OnInit {
  idGrupo: string;
  nameGrupoSel: string;
  isCargando: boolean;
  idUserGreaGrupo: string;
  clickEventCargaGeneral=true;
  clickEventCargaJornada=false;
  anioCompetencia: string;
  listPuntajesTablaGeneral: Puntaje[];
  nameUserLogueado: string;
  listPuntajesTablaPorFecha: Puntaje[];
  sinPuntajes = false;
  comp: Competencia;
  nameCompetencia: string;
  listPuntajesFechas: Puntaje[];
  fechasCompetencia: string[] = [];
  listPuntajesFiltrados: Puntaje[];
  
  constructor(private toast: ToastController, private router: Router, private sharingService: SharingServiceService, private route: ActivatedRoute, private menuCtrl: MenuController,
              private authService: AuthService, private resultService: ResultsService,
              private competenciaService: CompetenciaService, public alertController: AlertController, public gruposService: GruposService,
              public datepipe: DatePipe, private comparteDatosService: ComparteDatosService, private cdr: ChangeDetectorRef) {

  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.idGrupo = params['idGrupo'];
      this.nameGrupoSel = params['nameGrupo'];
      console.log(this.idGrupo); // aquí puedes ver el valor del parámetro recibido
    });
    this.nameUserLogueado = localStorage.getItem('name');
    this.getPuntajesFechasPorGrupo(this.idGrupo);
    this.getPuntajesGeneralPorGrupo(this.idGrupo);
    this.getCompetenciaDelGrupo(this.idGrupo);
  }


  async getPuntajesFechasPorGrupo(idGrupo): Promise<any> {
    return await new Promise(async resolve => {
      this.isCargando = true;
      await this.gruposService.getPuntajesFechasPorGrupo(idGrupo).subscribe(async respuesta => {
        this.listPuntajesFechas = respuesta;
        console.log(JSON.stringify(this.listPuntajesFechas));
        this.listPuntajesTablaPorFecha = this.listPuntajesFechas; // inicializar la variable con los mismos datos
        this.fechasCompetencia = this.crearArrayFechas(this.listPuntajesFechas);
        if(respuesta.length === 0){
          this.sinPuntajes = true;
        }
        this.isCargando = false;
      });
    });
  }

  async getPuntajesGeneralPorGrupo(idGrupo): Promise<any> {
    return await new Promise(async resolve => {
      this.idUserGreaGrupo = localStorage.getItem('idUser');
      this.isCargando = true;
      await this.gruposService.getPuntajesGeneralPorGrupo(this.idUserGreaGrupo, idGrupo).subscribe(async respuesta => {
        this.listPuntajesTablaGeneral = respuesta;
        if(respuesta.length === 0){
          this.sinPuntajes = true;
        }
        this.isCargando = false;
      });
    });
  }

  async getCompetenciaDelGrupo(idGrupo: string): Promise<any> {
    this.nameCompetencia = "";
    this.anioCompetencia = "";
    return await new Promise(async resolve => {
      this.isCargando = true;
      await this.gruposService.getCompetenciaDelGrupo(idGrupo).subscribe(async respuesta => {
        console.log(respuesta);
        this.nameCompetencia = respuesta[0].name;
        this.anioCompetencia = respuesta[0].anio;
        this.isCargando = false;
      });
    });
  }

  volver() {
    this.router.navigate(['/partidosPage']);
  }

  cargaPuntajesGeneral() {
    this.clickEventCargaGeneral = true;
    this.clickEventCargaJornada = false;
  }

  cargaPuntajesJornada() {
    this.clickEventCargaGeneral = false;
    this.clickEventCargaJornada = true;
  }

  // Metodo para crear el array de fechas disponibles
  crearArrayFechas(data: any[]): string[] {
    // Creamos un Set para almacenar las fechas sin repetición
    const setFechas = new Set<string>();
    // Iteramos por los objetos de la respuesta para obtener las fechas
    for (const obj of data) {
      setFechas.add(obj.fecha);
    }
    // Convertimos el Set en un array y lo ordenamos alfabéticamente
    const arrayFechas = Array.from(setFechas);
    arrayFechas.sort();

    return arrayFechas;
  }

// Metodo para manejar el evento de selección de fecha
  fechaEvent(fecha: string) {
    this.listPuntajesFiltrados = this.listPuntajesFechas.filter(puntaje => puntaje.fecha === fecha);
  }
}
