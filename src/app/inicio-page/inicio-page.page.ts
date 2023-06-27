import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertController, MenuController, ToastController} from '@ionic/angular';
import { CompetenciaService } from '../services/competencia.service';
import {Comp} from "../class/Comp";
import {Enfrentamiento} from "../class/Enfrentamiento";
import {NAVIGATE_LOGIN} from "../logueo/logueo.page";
import {NAVIGATE_REGISTRO} from "../registro/registro.page";
import {Competencia} from "../class/Competencia";
import {Observable, Subscription} from "rxjs";
import { ComparteDatosService } from '../services/comparte-datos.service';
import { SharingServiceService } from '../services/sharing-service.service';
import {Grupo} from "../class/Grupo";
import {ImageSlider} from "../class/ImageSlider";
import {GruposService} from "../services/grupos.service";
import {User} from "../class/User";

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
  isCargando = false;
  subscriptionCompetencia: Subscription;
  private data$: Observable<Comp>;
  ocultaSlider = false;
  slideOptsOne = {
    initialSlide: 0,
    slidesPerView: 1,
    autoplay:true
  };

  images: ImageSlider[];
  idUser: string;
  postulacionesPendientesParaAceptar: Object[];
  cantidadNotificaciones: number;
  user: User;

  constructor(private toast: ToastController, private gruposService: GruposService, private route: ActivatedRoute, private sharingService: SharingServiceService,
              private router: Router, private menuCtrl: MenuController, private competenciaService: CompetenciaService, public alertController: AlertController, private comparteDatosService: ComparteDatosService ) {
    this.menuCtrl.enable(true);
    this.notificationPendienteParaGrupo();
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params.user) {
        this.user = JSON.parse(params.user);
      }
    });
    
    this.menuCtrl.enable(true);
    this.notificationPendienteParaGrupo();
    this.images = [];
    let ob = { title: 'Enzo Fernandez al Chelsea, transferencia record', url: 'https://cloudfront-us-east-1.images.arcpublishing.com/infobae/57KCIDG42ZHB5CXCULFZ4SOZXE.jpg' };
    let ob1 = { title: 'Enzo Fernandez al Chelsea, transferencia record', url: 'https://cloudfront-us-east-1.images.arcpublishing.com/infobae/57KCIDG42ZHB5CXCULFZ4SOZXE.jpg' }
    
    this.images.push(ob);
    this.images.push(ob1);
    this.images.push(ob);
    this.competenciaService.getCompetenciasActivas().subscribe(res => {
          console.log(res);
          this.competenciasActivas = res;
        },
        err => {
          console.log(err);
        }
    );
  }
  
  ionViewDidEnter(){
    this.menuCtrl.enable(true);
    this.notificationPendienteParaGrupo();
  }
      

  notificationPendienteParaGrupo() {
    this.idUser = localStorage.getItem('idUser');
    this.gruposService.getPostulacionesPendientesDeAceptar(this.idUser).subscribe(
        res => {
          this.isCargando = false;
          this.postulacionesPendientesParaAceptar = res;
          this.cantidadNotificaciones = this.postulacionesPendientesParaAceptar.length;
        }),
        err => {
        };
  }

  //accion desplegar menu
  toggleMenu(){
    this.comparteDatosService.setUser(this.user);
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
    if(this.competenciasActivas.length==0){
      this.showToastMessage('No hay competencias activas en este momento. Debes esperar hasta que se activen competencias.', 'primary', 'thumbs-down', 5000);
    }
    this.idCompetenciaSeleccionada = $event.idcompetition;
    localStorage.setItem('idCompetenciaSeleccionada', this.idCompetenciaSeleccionada);
    this.anioCompetenciaSeleccionada = $event.anio;
    this.buscarCompetencias(this.idCompetenciaSeleccionada, this.anioCompetenciaSeleccionada);
    console.log('Competencia seleccionada por el usuario:'+this.idCompetenciaSeleccionada + 'con el anio' + this.anioCompetenciaSeleccionada);
  }

  buscarCompetencias(idCompetenciaSeleccionada: string, anioCompetenciaSeleccionada: string) {
    localStorage.setItem('anioCompetenciaSeleccionada', anioCompetenciaSeleccionada);
    this.fechasCompetencia = [];
    this.isCargando = true;
    if (idCompetenciaSeleccionada == '' || idCompetenciaSeleccionada == undefined) {
      this.dialogFailed('Debe seleccionar alguna competencia');
    } else {
      console.log('Se muestra competencia con este id: ', idCompetenciaSeleccionada);
      this.subscriptionCompetencia = this.competenciaService.getEnfrentamientos(idCompetenciaSeleccionada, anioCompetenciaSeleccionada).subscribe(
        data => {
          console.log('PARTIDOS OBTENIDOS DE LA API: ');
          console.log(JSON.stringify(data));
          console.log('CANTIDAD DE ENFRENTAMIENTOS:', data.length);
          this.partidosComp = data;
          this.partidos = data;
          this.sharingService.setearPartidos = this.partidosComp;
          this.isCargando = false;
        },
        err => {
          console.log(err);
        }
      );

      this.competenciaService.getTablaDePosicionesPorCompetencia(idCompetenciaSeleccionada, this.anioCompetenciaSeleccionada).subscribe(
          data => {
            this.sharingService.setearTablaPosiciones = data;
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

  ocultarSlider(oculta:boolean) {
    if(oculta){
      this.ocultaSlider = true;
    } else {
      this.ocultaSlider = false;
    }
 
  }

    tablaDePosiciones() {
      if(this.idCompetenciaSeleccionada == '' || this.idCompetenciaSeleccionada == undefined) {
        this.dialogFailed('Debe seleccionar alguna competencia');
      } else {
        //ENVIO LA DATA DE PARTIDOS A LIST-ENFRENTAMIENTOS
        /*
        await this.comparteDatosService.disparadorPartidosLiga.emit({
          data: this.partidos
        });
         */
        this.router.navigate(['/tabla-posiciones']);
      }
    }

  async showToastMessage(message:string, color: string, icon: string, duracion:number) {
    const toast = await this.toast.create({
      message: message,
      duration: duracion,
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
