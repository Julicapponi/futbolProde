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
import {User} from "../class/User";
import {EditUserPage} from "../edit-user/edit-user.page";
import {ListEnfrentamientosPage} from "../list-enfrentamientos/list-enfrentamientos.page";

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
  usuariosDelGrupo: User[];
  fechaSeleccionada: string;
  idcompetition: number;
  
  constructor(private modalCtrl: ModalController, private toast: ToastController, private router: Router, private sharingService: SharingServiceService, private route: ActivatedRoute, private menuCtrl: MenuController,
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
    this.nameUserLogueado = localStorage.getItem('name')
    this.getPuntajesFechasPorGrupo(this.idGrupo);
    this.getPuntajesGeneralPorGrupo(this.idGrupo);
    this.getCompetenciaDelGrupo(this.idGrupo);
  }


  async usuariosPorGrupo(idGrupo: string) {
    return await new Promise(async resolve => {
      this.isCargando = true;
      await this.gruposService.getUsersPorGroup(idGrupo).subscribe(async respuesta => {
        this.usuariosDelGrupo = respuesta;
        this.isCargando = false;
      });
    });
  }
  
  async getPuntajesFechasPorGrupo(idGrupo): Promise<any> {
    return await new Promise(async resolve => {
      this.isCargando = true;
      await this.gruposService.getPuntajesFechasPorGrupo(idGrupo).subscribe(async respuesta => {
        this.listPuntajesFechas = respuesta;
        console.log(JSON.stringify(this.listPuntajesFechas));
        this.listPuntajesTablaPorFecha = this.listPuntajesFechas; // inicializar la variable con los mismos datos
        this.fechasCompetencia = this.crearArrayFechas(this.listPuntajesFechas);
        this.isCargando = false;
      });
    });
  }

  async getPuntajesGeneralPorGrupo(idGrupo): Promise<any> {
    return await new Promise(async resolve => {
      this.idUserGreaGrupo = localStorage.getItem('idUser');
      this.isCargando = true;
      await this.gruposService.getPuntajesGeneralPorGrupo(this.idUserGreaGrupo, idGrupo).subscribe(async respuesta => {
        if(respuesta.length>0){
          this.listPuntajesTablaGeneral = respuesta;
  
        } else {
          this.usuariosPorGrupo(this.idGrupo);
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
        this.idcompetition = respuesta[0].idcompetition
        this.isCargando = false;
      });
    });
  }

  volver() {
    this.router.navigate(['/partidosPage']);
  }

  cargaPuntajesGeneral() {
    this.fechaSeleccionada = null;
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
    this.fechaSeleccionada = fecha;
    this.listPuntajesFiltrados = this.listPuntajesFechas.filter(puntaje => puntaje.fecha === fecha);
  }


  async verPronosticosUsuario(idUser: string) {
    if(this.fechaSeleccionada!=undefined || this.fechaSeleccionada!=null){
      const profileModal = await this.modalCtrl.create({
        component: ListEnfrentamientosPage,
        cssClass: 'modal_popup',
        showBackdrop: true,
        backdropDismiss: false,
        componentProps: {
          vieneDePuntajesPorUsuario: true,
          id_usuario: idUser,
          fechaSeleccionada: this.fechaSeleccionada,
          idcompetition_grupo_seleccionado: this.idcompetition
        },
      });
      profileModal.present();
    }


  }
}
