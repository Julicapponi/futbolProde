import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertController, MenuController, ToastController} from '@ionic/angular';
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
import {User} from "../class/User";
import {Enfrentamiento} from "../class/Enfrentamiento";

@Component({
  selector: 'app-list-enfrentamientos',
  templateUrl: './list-enfrentamientos.page.html',
  styleUrls: ['./list-enfrentamientos.page.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class ListEnfrentamientosPage implements OnInit, OnDestroy {
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
  idCompetenciaSeleccionada: string;
  private isCargandoFiltro = false;
  constructor(private toast: ToastController, private router: Router, private sharingService: SharingServiceService, private route: ActivatedRoute, private menuCtrl: MenuController,
              private authService: AuthService, private resultService: ResultsService,
              private competenciaService: CompetenciaService, public alertController: AlertController,
              public datepipe: DatePipe, private comparteDatosService: ComparteDatosService, private cdr: ChangeDetectorRef) {
    this.isCargandoPartidos = true;
    this.fechaHoy = new Date();
    this.messageLoaderStatus = 'Cargando datos de los partidos, aguarde por favor... ';
    this.obtenerPartidosYConcatenar();

    //ingreso timeout ya que tarda en realizar la funcion de obtenerPartidosYConcatenar 
    setTimeout(async () => {
      this.obtenerFechaDefault(this.partidosConcatenados);
      this.filtrarPartidosPorFecha(this.fechaAVisualizarPorActualidad, true);
    }, 4000);
  }
  
  // obtiene los enfrentamientos de la BD, que vienen desde inicio
  async obtenerPartidosYConcatenar() : Promise<any> {
    const promise = new Promise(async resolve => {
    //this.partidosBD partidos que vienen de la bd, todos los de la competencia.
    this.sharingService.obtenerPartidos.subscribe((data: Enfrentamiento[]) => {
     this.partidosBD = data;
    });

      let idCompetencia = localStorage.getItem('idCompetenciaSeleccionada');
      let idUser = localStorage.getItem('idUser');
      this.partidosOrdenados = [];
      
      //OBTENGO UNICAMENTE LOS ENFRENTAMIENTOS QUE HAYAN SIDO PRONOSTICADOS POR EL USUARIO EN LA BD
      this.competenciaService.getEnfrentamientosPronosticados(idCompetencia, idUser).subscribe(
          data => {
            this.partidosPronosticados = data;
            for (var i = 0; i < data.length; i++) {
              for (var j = 0; j < this.partidosBD.length; j++) {
                if (data[i].idEnfrentamiento == this.partidosBD[j].idEnfrentamiento) {
                  //borro el enfrentamiento si está pronosticado, luego voy a sumar este mismo pero con los resultados pronosticados.
                  this.partidosBD.splice(j, 1);
                  j--;
                  continue;
                }
              }
            }
            
            this.partidosConcatenados = data.concat(this.partidosBD);
            resolve (this.partidosConcatenados)
          });
      
    })
    promise.then((res) => {
      console.log('I get called:', res === 123); // Devuelve: true
    });
    promise.catch((err) => {
      console.log(err);
    });
  }
  
/*
  async obtenerPartidosPronosticados(partidosBD: Enfrentamiento[]) : Promise<any> {
    const promise = new Promise(async resolve => {
      let idCompetencia = localStorage.getItem('idCompetenciaSeleccionada');
      let idUser = localStorage.getItem('idUser');
      this.partidosOrdenados = [];
      //OBTENGO UNICAMENTE LOS ENFRENTAMIENTOS QUE HAYAN SIDO PRONOSTICADOS POR EL USUARIO EN LA BD

      this.competenciaService.getEnfrentamientosPronosticados(idCompetencia, idUser).subscribe(
          data => {
            this.partidosPronosticados = data;
            for (var i = 0; i < data.length; i++) {
              for (var j = 0; j < this.partidos.length; j++) {
                if (data[i].idEnfrentamiento == this.partidos[j].idEnfrentamiento) {
                  //borro el enfrentamiento si está pronosticado, luego voy a sumar este mismo pero con los resultados pronosticados.
                  this.partidos.splice(j, 1);
                  j--;
                  continue;
                }
              }
            }
            //CONCATENEO LOS PARTIDOS PRONOSTICADOS CON LOS PARTIDOS TRAIDOS DE LA API
            this.partidos = data.concat(this.partidos);
            resolve (this.partidos)
          });
    })
    promise.then((res) => {
      console.log('I get called:', res === 123); // Devuelve: true
    });
    promise.catch((err) => {
      console.log(err);
    });
  }
*/
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
      if(upcomingRound!=undefined || upcomingRound.round != undefined || upcomingRound.round != null) {
        this.fechaAVisualizarPorActualidad = upcomingRound.round;
        console.log(upcomingRound.round);
      }
    }
    return this.fechaAVisualizarPorActualidad
  }


  filtrarPartidosPorFecha(fecha: string, isVienePrimeraCarga:boolean) {
    this.isCargandoFiltro = true;
    if(!isVienePrimeraCarga){
      this.isCargandoPartidos = true;
    }
    this.listPartidosVisualizadosId =[];
    this.isCargandoCambioFecha = true;
    console.log('Seleccionaste esta fecha:', fecha);
    this.fecha = fecha.trim();
    this.partidos = [];
    this.isCargandoFiltro = false;
    let part = this.partidosConcatenados.filter(partido => partido.round ===this.fecha);
    

    
    //REALIZA CALCULOS DE ESTADO DE PARTIDO (EN CURSO, FINALIZADO, POR JUGAR)
    //estadoFecha = 1 por jugar
    //estadoFecha = 2 en curso
    //estadoFecha = 3 finalizado
    for (let i = 0; i <  part.length; i++) {
      if(part[i].nameVisit.includes('Independiente')){
        console.log();
      }
      console.log(part[i]);
      let fechaPartido = new Date(part[i].fechaEnfrentamiento);
      part[i].fechaEnfrentamiento = new Date(part[i].fechaEnfrentamiento);
      // Calcular la diferencia en milisegundos
      const diferencia = this.fechaHoy.getTime() - fechaPartido.getTime();
      
      // Convertir la diferencia a minutos
      const minutosDiff = Math.floor(diferencia / 1000 / 60);
      // Convertir de min a hs
      const horasDiff = minutosDiff / 60;
      
      //1 por jugar
      //2 en curso
      //3 finalizado
      if(horasDiff >= 0 && horasDiff <= 2.3){
        part[i].estadoFecha = 2;
      } else if(horasDiff<0){
        part[i].estadoFecha = 1;
      } else {
        part[i].estadoFecha = 3;
      }
      if(part[i].idEnfrentamiento===971446){
        console.log();
      }
      //30 minutos antes del arranco del partido para poder pronosticar
      if(horasDiff<-0.5){
        part[i].puedePronosticar = true;
      } else{
        part[i].puedePronosticar = false;
      }
      
     // this.listPartidosVisualizadosId.push(part[i].idEnfrentamiento);
    }
    
    //CONCATENA CON LA API LOS PARTIDOS A PRESENTAR EN PANTALLA
    this.obtenerPartidosApiYConcatena(part);
  }

  convertirFecha (fechaString) {
    var fechaSp = fechaString.split("-");
    var anio = new Date().getFullYear();
    if (fechaSp.length == 3) {
      anio = fechaSp[2];
    }
    var mes = fechaSp[1] - 1;
    var dia = fechaSp[0];

    return new Date(anio, mes, dia);
  }

  ngOnDestroy(): void {
  }

  ngOnInit() {

  }

  volver() {
    this.list.pronosticos = [];
    this.router.navigate(['/inicioPage']);
  }

  async guardarPronosticosHechos(part: Enfrentamiento, isSuma: boolean, isLocal: boolean) {
    this.restarsumar_ocupado = true;
    console.log(part);
    if (part.golesLocalPronosticado != null || part.golesLocalPronosticado != undefined || part.golesVisitPronosticado != null || part.golesVisitPronosticado != undefined) {
      //EDICION DE PRONOSTICO EXISTENTE
      if (isLocal) {
        if (isSuma) {
          if (part.golesLocalPronosticado != null || part.golesLocalPronosticado != undefined) {
            part.golesLocalPronosticado = part.golesLocalPronosticado + 1;
          }
        } else {
          if (part.golesLocalPronosticado > 0) {
            if (part.golesLocalPronosticado != null || part.golesLocalPronosticado != undefined) {
              part.golesLocalPronosticado = part.golesLocalPronosticado - 1;
            }
          }
        }
      } else if (!isLocal) {
        if (isSuma) {
          if (part.golesVisitPronosticado != null || part.golesVisitPronosticado != undefined) {
            part.golesVisitPronosticado = part.golesVisitPronosticado + 1;
          }
        } else {
          if (part.golesVisitPronosticado > 0) {
            if (part.golesVisitPronosticado != null || part.golesVisitPronosticado != undefined) {
              part.golesVisitPronosticado = part.golesVisitPronosticado - 1;
            }
          }
        }
      }
    } else {
      //PRONOSTICO NUEVO
      part.golesLocalPronosticado = 0;
      part.golesVisitPronosticado = 0;
    }
    part.idCompetencia = this.idCompetenciaSeleccionada;
     
    await this.competenciaService.guardarPronosticos(part).subscribe(
        data => {
          if (data.cargoPronostico) {
            this.showToastMessage('Pronostico cargado', 'success', 'thumbs-up');
          } else {
            this.showToastMessage('No se pudo cargar el pronostico, cierre sesión y aguarde unos minutos', 'danger', 'thumbs-down');
          }
          this.restarsumar_ocupado = false;
        });

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
  
  
  async calcularResultado(part:Enfrentamiento, isSuma: boolean, isLocal: boolean) {
    this.index = 0;
    //part.idLocal, part.idVisit, part.idEnfrentamiento
    if(this.list.pronosticos.length > 0 ) {
      for(let [i, pronostico] of this.list.pronosticos.entries()){
        this.index++;
        if(pronostico.idPartido == part.idEnfrentamiento){
          this.realizoCalculo = true;
          if (isLocal) {
            if (isSuma) {
              this.list.pronosticos[i].golLocal = this.list.pronosticos[i].golLocal +1;
              break;
            } else {
              if (this.list.pronosticos[i].golLocal > 0) {
                this.list.pronosticos[i].golLocal = this.list.pronosticos[i].golLocal - 1;
                break;
              }
            }
          } else if (!isLocal) {
            if (isSuma) {
              this.list.pronosticos[i].golVisitante = this.list.pronosticos[i].golVisitante +1;
              break;
            } else {
              if (this.list.pronosticos[i].golVisitante > 0) {
                this.list.pronosticos[i].golVisitante = this.list.pronosticos[i].golVisitante - 1;
                break;
              }
            }
          }
        } else {
          // AGREGA UN NUEVO PRONOSTICO EN EL CASO QUE NO HAYA ENCONTRADO ALGUN PRONOSTICO DE ESTE PARTIDO EN LA LISTA
          if(this.list.pronosticos.length === this.index){
            
          } else{
            continue;
          }
        } 
      }
      
    } else {
      // UNICAMENTE PARA EL CASO DEL PRIMER PRONOSTICO A DAR DE ALTA
        if(part.idEnfrentamiento != undefined){
          var pronostico_idPartido = part.idEnfrentamiento;
          var pronostico_idUser = localStorage.getItem('idUser');
          var pronostico_idEquipoVisitante = part.idVisit;
          var pronostico_idEquipoLocal = part.idLocal;
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
          "userName": pronostico_idUser,
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
   
  }

  async fechaEvent($event: any) {
    console.log($event);
    const fecha = $event.toString();
    this.filtrarPartidosPorFecha(fecha,false);
  }

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

  private obtenerPartidosApiYConcatena(partidos: Enfrentamiento[]) {
    let idCompetenciaSeleccionada = localStorage.getItem('idCompetenciaSeleccionada');
    this.idCompetenciaSeleccionada = localStorage.getItem('idCompetenciaSeleccionada');
    let idUser = localStorage.getItem('idUser');
    let anioCompetenciaSeleccionada = localStorage.getItem('anioCompetenciaSeleccionada');
    this.subscriptionCompetencia = this.competenciaService.getEnfrentamientosApi(idCompetenciaSeleccionada, anioCompetenciaSeleccionada).subscribe(
        data => {
          let partidosApi = data;
          console.log(data.response);
          console.log(partidos);
          let partidosApiFecha = partidosApi.response.filter(item => {
            return item.league.round.includes(this.fecha);
          });
          console.log(partidosApiFecha);
          for (let i = 0; i < partidos.length; i++) {
            for (let j = 0; j < partidosApiFecha.length; j++) {
              if(partidos[i].idEnfrentamiento === partidosApiFecha[j].fixture.id){
                if(partidos[i].idEnfrentamiento===971446){
                  console.log();
                }
                partidos[i].elapsed = partidosApiFecha[j].fixture.status.elapsed;
                partidos[i].long = partidosApiFecha[j].fixture.status.long;
                partidos[i].estadoPartido = partidosApiFecha[j].fixture.status.short;
                partidos[i].golLocal = partidosApiFecha[j].goals.home;
                partidos[i].golVisit = partidosApiFecha[j].goals.away;
              }
              if(partidos[i].nameLocal.includes("Argentinos JRS") && partidos[i].nameVisit.includes("Arsenal Sarandi")){
                console.log(partidos[i]);
              }
              //PRONOSTICA EMPATE O GANA Y EL RESULTADO ES IDENTICO
              if(partidos[i].golesLocalPronosticado === undefined || partidos[i].golesLocalPronosticado === null || partidos[i].golesVisitPronosticado === undefined || partidos[i].golesVisitPronosticado === null){
                partidos[i].puntosSumados = 0;
                continue;
              }
              if(partidos[i].golesLocalPronosticado === partidos[i].golLocal && partidos[i].golesVisitPronosticado === partidos[i].golVisit){
                partidos[i].puntosSumados = 3;
                //PRONOSTICA GANA LOCAL Y EL RESULTADO GANA PERO NO ES IDENTICO
              } else if(partidos[i].golesLocalPronosticado > partidos[i].golesVisitPronosticado && partidos[i].golLocal > partidos[i].golVisit){
                if(partidos[i].idEnfrentamiento === 988709){
                  console.log();
                }
                partidos[i].puntosSumados = 1;
                //PRONOSTICA GANA VISITANTE Y EL RESULTADO GANA PERO NO ES IDENTICO
              } else if(partidos[i].golesVisitPronosticado > partidos[i].golesLocalPronosticado &&  partidos[i].golVisit > partidos[i].golLocal) {
                if(partidos[i].idEnfrentamiento === 988709){
                  console.log();
                }
                partidos[i].puntosSumados = 1;
                //PRONOSTICA EMPATE, SALE EMPATE PERO DISTINTO
              } else if(partidos[i].golesLocalPronosticado !== partidos[i].golLocal && partidos[i].golesVisitPronosticado !== partidos[i].golVisit && partidos[i].golLocal === partidos[i].golVisit && partidos[i].golesLocalPronosticado === partidos[i].golesVisitPronosticado){
                if(partidos[i].nameVisit.includes('Velez')){
                  console.log();
                }
                partidos[i].puntosSumados = 1;
              } else {
                partidos[i].puntosSumados = 0;
              }
            }
          }
          partidos.sort((a, b) => a.fechaEnfrentamiento.getTime() - b.fechaEnfrentamiento.getTime());
          this.partidosAVisualizar = partidos
          console.log(JSON.stringify(this.partidosAVisualizar));
          this.isCargandoPartidos = false;
          console.log(this.partidosAVisualizar);
        },err => {
          console.log(err);
        });
  }
  
 
}

