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
import {PronosticosService} from "../services/pronosticos.service";
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

  myDate = Date.now();

  compFixture: any;
  fecha: string;
  partidoTerminado = false;
  partidoEnCurso = false;
  subscriptionCompetencia: Subscription;
  partidos: Enfrentamiento[];
  partidosPronosticados: Enfrentamiento[];
  fechasCompetencia: any = [];
  fechaComp = '';
  fechaCompara = '';
  partidosFiltrado: Comp[];
  partidosOrdenados: Enfrentamiento[];
  list = {
    'pronosticos': []
  };
  pronostico: Partido = {
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
  index: number;
  partidosFiltrados: Enfrentamiento[];

  jsonPronosticos: any;

  realizoCalculo = false;
  restarsumar_ocupado=false;
  fechaAVisualizarPorActualidad: any;
  partidosAVisualizar: Enfrentamiento[];
  partidosBD: Enfrentamiento[];
  partidosConcatenados: any;
  fechaHoy: Date;
  puedePronosticar: boolean;
  messageLoaderStatus: string;
  listPartidosVisualizadosId =[];
  isCargandoCambioFecha: boolean;
  isVienePrimeraCarga: boolean;
  listPuntajesTablaGeneral: Puntaje[];
  nameUserLogueado: string;
  listPuntajesTablaPorFecha: Puntaje[];
  constructor(private toast: ToastController, private router: Router, private sharingService: SharingServiceService, private route: ActivatedRoute, private menuCtrl: MenuController,
              private authService: AuthService, private resultService: ResultsService,
              private competenciaService: CompetenciaService, public alertController: AlertController, public gruposService: GruposService,
              public datepipe: DatePipe, private comparteDatosService: ComparteDatosService, private cdr: ChangeDetectorRef, private pronosticosService: PronosticosService) {

  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.idGrupo = params['idGrupo'];
      this.nameGrupoSel = params['nameGrupo'];
      console.log(this.idGrupo); // aquí puedes ver el valor del parámetro recibido
    });
    this.nameUserLogueado = localStorage.getItem('name');
    this.getPuntajesGeneralPorGrupo(this.idGrupo);
  }
  

  async getPuntajesGeneralPorGrupo(idGrupo): Promise<any> {
    return await new Promise(async resolve => {
      this.idUserGreaGrupo = localStorage.getItem('idUser');
      this.isCargando = true;
      await this.gruposService.getPuntajesGeneralPorGrupo(this.idUserGreaGrupo, idGrupo).subscribe(async respuesta => {
        this.listPuntajesTablaGeneral = respuesta;
        this.isCargando = false;
      });
    });
  }

  async getPuntajesPorFechaPorGrupo(idGrupo, fecha): Promise<any> {
    return await new Promise(async resolve => {
      this.idUserGreaGrupo = localStorage.getItem('idUser');
      this.isCargando = true;
      await this.gruposService.getPuntajesPorFechaPorGrupo(idGrupo, this.fechaAVisualizarPorActualidad).subscribe(async respuesta => {
        this.listPuntajesTablaPorFecha = respuesta;
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

  obtenerFiltroFechas(partidos) {
    var rounds = partidos.map(function (partido) {
      return partido.round;
    });
    var sorted = rounds.sort();

    this.fechasCompetencia = sorted.filter(function (value, index) {
      return value !== sorted[index + 1];
    });
  }
  
  compareStrings(a, b) {
    const regex = /(\d+)/g;
    let aMatches: any;
    let bMatches: any;
    if(a===null || b===null){
      // Si uno de los strings no contiene números, tratarlo como 0
      aMatches = [0];
      bMatches = [0];
    } else{

      aMatches = a.match(regex);
      bMatches = b.match(regex);
    }
    if(aMatches===null || bMatches === null){
      aMatches = [0];
      bMatches = [0];
    }

    // Convertir strings a números y llenar con ceros a la izquierda para que tengan la misma longitud
    aMatches = aMatches.map((match) => parseInt(match)).map((num) => num.toString().padStart(2, "0"));
    bMatches = bMatches.map((match) => parseInt(match)).map((num) => num.toString().padStart(2, "0"));

    // Comparar los números
    for (let i = 0; i < Math.min(aMatches.length, bMatches.length); i++) {
      if (aMatches[i] !== bMatches[i]) {
        return aMatches[i] - bMatches[i];
      }
    }

    // Si los números son iguales, comparar los strings completos
    return a.localeCompare(b);
  }
  
  obtenerFechaDefault(partidos) {
    let splitHoy = [];
    let mesActual:string;
    let diaActual:string;
    let dateHoy = new Date();

    //año
    const anioActual = dateHoy.getFullYear();

    //mes
    mesActual = (dateHoy.getMonth() + 1).toString();
    if(mesActual.toString().length == 1){
      mesActual = String(mesActual).padStart(2,'0').toString();
    }

    //dia
    diaActual = dateHoy.getDate().toString();
    if(diaActual.toString().length == 1){
      diaActual = String(diaActual).padStart(2,'0').toString();
    }
    const fechaActual = anioActual+'-'+mesActual+'-'+diaActual+'T00:00:00+00:00';
    //this.fechaHoy = new Date(fechaActual);

    var json = partidos.map(function (partido) {
      return {round: partido.round, fechaEnfrentamiento: partido.fechaEnfrentamiento};
    });

    const result = {};

    for (const obj of json) {
      if (result[obj.round] === undefined) {
        result[obj.round] = {
          round: obj.round,
          minFechaEnfrentamiento: obj.fechaEnfrentamiento,
          maxFechaEnfrentamiento: obj.fechaEnfrentamiento,
        };
      } else {
        if (obj.fechaEnfrentamiento < result[obj.round].minFechaEnfrentamiento) {
          result[obj.round].minFechaEnfrentamiento = obj.fechaEnfrentamiento;
        }
        if (obj.fechaEnfrentamiento > result[obj.round].maxFechaEnfrentamiento) {
          result[obj.round].maxFechaEnfrentamiento = obj.fechaEnfrentamiento;
        }
      }
    }

    //OBTIENE LAS DISTINTAS FECHAS PARA EL SELECTOR

    for (const res in result) {
      this.fechasCompetencia.push(res);
    }
    this.fechasCompetencia.sort(this.compareStrings);


    let resultArray = [];
    resultArray = Object.values(result);
    //ordeno por round
    resultArray = resultArray.sort((a, b) => {
      const aParts = a.round.split(" ");
      const bParts = b.round.split(" ");

      const aPhaseNum = parseInt(aParts[aParts.length - 1]);
      const bPhaseNum = parseInt(bParts[bParts.length - 1]);

      if (aParts[0] !== bParts[0]) {
        return aParts[0].localeCompare(bParts[0]);
      }

      return aPhaseNum - bPhaseNum;
    });

    const currentDate = new Date();

    // Filtra los elementos del arreglo que contienen la fecha actual entre su minimo y maximo, es decir, entre el 1er partido y el ultimo de la fecha
    const currentRounds = resultArray.filter(item => {
      if(item.round.includes('1st Phase - 4')){
        console.log('');
      }
      const minDate = new Date(item.minFechaEnfrentamiento);
      const maxDate = new Date(item.maxFechaEnfrentamiento);
      return minDate <= currentDate && currentDate <= maxDate;
    });

    // Si hay algún round/fecha actual, devuelve el primer elemento
    if (currentRounds.length > 0) {
      const currentRound = currentRounds[0];
      console.log(currentRound.round);
      this.fechaAVisualizarPorActualidad = currentRound.round;
    } else {
      // Si no hay ningún round actual, encuentra el round más cercano a la fecha actual
      const upcomingRound = resultArray.find(item => {
        const minDate = new Date(item.minFechaEnfrentamiento);
        return minDate > currentDate;
      });
      this.fechaAVisualizarPorActualidad = upcomingRound.round;
      console.log(upcomingRound.round);
    }
    return this.fechaAVisualizarPorActualidad
  }
  

  
  
  async fechaEvent($event: any) {
    console.log($event);
    const fecha = $event.toString();
  }

  filtrarPuntajesPorFecha(fecha: string, isVienePrimeraCarga:boolean) {
    if(!isVienePrimeraCarga){
      this.isCargandoPartidos = true;
    }
    this.listPartidosVisualizadosId =[];
    this.isCargandoCambioFecha = true;
    console.log('Seleccionaste esta fecha:', fecha);
    this.fecha = fecha.trim();
    this.getPuntajesPorFechaPorGrupo(this.idGrupo, this.fecha);
  }
}
