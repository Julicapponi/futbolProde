import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {GruposService} from "../services/grupos.service";
import {AlertController, ModalController, ToastController} from "@ionic/angular";
import {Grupo} from "../class/Grupo";
import {Router} from "@angular/router";
import {Enfrentamiento} from "../class/Enfrentamiento";
import {Observable, Subscription} from "rxjs";
import {Comp} from "../class/Comp";
import {CompetenciaService} from "../services/competencia.service";

@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.page.html',
  styleUrls: ['./create-group.page.css'],
})
export class CreateGroupPage implements OnInit {
  group: Grupo = {
    idGrupo: null,
    nameGrupo: "",
    idUserCreador: "",
    idCompetencia: ""
  };

  isCargando: boolean;
  filterTerm: string;
  enfrentamientos: Enfrentamiento[];
  partidos: Enfrentamiento[];
  partidosComp: Enfrentamiento ;
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
  seleccionoUnaComp=false;
  fecha: string;
  todosLosPartidos: any;
  partidosAVisualizar: Enfrentamiento[];
  fechaAVisualizarPorActualidad: any;
  prueba: Enfrentamiento[];
  isOpen = false;
  isMuestraInformacion=true;

  constructor(private cdr: ChangeDetectorRef, public alertController: AlertController, private competenciaService: CompetenciaService, private toast: ToastController, private router: Router, private gruposService: GruposService, private modalCrontroller: ModalController) {
    this.competenciasActiv();
  }

  ngOnInit(): void {
  }
  
  async volver() {
    //await this.modalCrontroller.dismiss();
      this.router.navigate(['/partidosPage']);
  }

  ngMode($event){
    this.competenciaSeleccionada = $event.name;
    this.idCompetenciaSeleccionada = $event.idcompetition;
    this.anioCompetenciaSeleccionada = $event.anio;
    this.seleccionoUnaComp = true;
    this.isMuestraInformacion = false;
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

  async createGrupo(grupo) {
    this.group = grupo
    if(this.idCompetenciaSeleccionada==undefined || this.idCompetenciaSeleccionada ==null && this.group.nameGrupo.length < 3){
      this.showToastMessage('Seleccione una competencia y un nombre más largo', "danger");
      return;
    }
    if(this.idCompetenciaSeleccionada==undefined || !this.idCompetenciaSeleccionada ==null){
      this.showToastMessage('Seleccione una competencia por favor', "danger");
      return;
    }
    if(this.group.nameGrupo.length < 3){
      this.showToastMessage('Nombre de grupo corto, ingrese mas caracteres', "danger");
      return;
    }

    this.group.idCompetencia = this.idCompetenciaSeleccionada;
    console.log(this.group);
    
    await this.alertController.create({
      header: 'Creación de grupo',
      // subHeader: 'Ocurrió ',
      message: 'Confirmar?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {

          }
        },
        {
          text: 'Aceptar',
          role: 'accept',
          handler: () => {
            this.gruposService.createGroup(this.group).subscribe(
                res => {
                  this.isCargando= true;
                  
                  setTimeout(async () => {
                    this.isCargando= false;
                    
                    this.showToastMessage('Grupo creado con exito!!', "success");
                  }, 1500);
                  console.log(res);
                  this.group = {
                    idGrupo: null,
                    nameGrupo: "",
                    idUserCreador: "",
                    idCompetencia: ""
                  };
                }),
                err => {
                  this.showToastMessage('Error al crear grupo, reintente más tarde', "danger");;
                };
          }
        }
      ]
    }).then(alert => {
      alert.present();
    });
  }

  async showToastMessage(message:string, color: string) {
    const toast = await this.toast.create({
      message: message,
      duration: 4000,
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
}
