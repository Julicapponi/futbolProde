import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {CompetenciaService} from "../services/competencia.service";
import {AlertController, MenuController, ToastController} from "@ionic/angular";
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
  
  constructor(private toast: ToastController, private activatedRoute: ActivatedRoute, private competenciaService: CompetenciaService, private sharingService: SharingServiceService, private router: Router, private menuCtrl: MenuController, private authService: AuthService, public alertController: AlertController, private competitionsService: CompetenciaService) {
      this.competenciasActiv();
  }

  ngOnInit() {
      
  }


    listEnfrentamientosBD(idCompetenciaSeleccionada: string, anioCompetenciaSeleccionada: string){
      this.isCargando = true;
    this.competenciaService.getEnfrentamientos(idCompetenciaSeleccionada, anioCompetenciaSeleccionada).subscribe(async res => {
        console.log(res);
        //timeout por los logos de equipos, tardan en cargar/impactar en la pagina
        this.isCargando = false;
        this.enfrentamientos = res;
        //this.enfrentamientos = res.slice(0, 20);
        await this.obtenerFechaDefault(this.enfrentamientos);
        await this.filtrarPartidosPorFecha(this.fechaAVisualizarPorActualidad);
        if (this.enfrentamientos.length == 0) {
            setTimeout(async () => {
                if (this.enfrentamientos.length == 0) {
                    this.showToastMessage('Puede que no se visualicen enfrentamientos ya que la competencia fue activa el día de hoy, espere a las 00:00 hs. cuando se sincronicen los enfrentamientos', 'danger', 'thumbs-down');
                }
            }, 2000);
        }


        err => {
            console.log(err);
        }
    });
  }


    filtrarPartidosPorFecha(fecha: string) {
        console.log('Seleccionaste esta fecha:', fecha);
        this.fecha = fecha.trim();
        this.partidos = [];
        this.partidosAVisualizar = [];
        this.partidosAVisualizar = this.enfrentamientos.filter(partido => partido.round ===this.fecha);
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
    
    async showToastMessage(message:string, color: string, icon: string) {
        const toast = await this.toast.create({
            message: message,
            duration: 5500,
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
  
    volver() {
      this.router.navigate(['/inicio-administrador']);
    }

    ngMode($event){
        this.competenciaSeleccionada = $event.name;
        this.idCompetenciaSeleccionada = $event.idcompetition;
        this.anioCompetenciaSeleccionada = $event.anio;
        this.seleccionoUnaComp = true;
        console.log('Competencia seleccionada: '+this.idCompetenciaSeleccionada + ' con el anio: ' + this.anioCompetenciaSeleccionada);
        this.listEnfrentamientosBD(this.idCompetenciaSeleccionada, this.anioCompetenciaSeleccionada);
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
                    /*
                    for (const part of this.partidos) {
                        const fechaComp = part.league.round.toString();
                        if (!this.fechasCompetencia.includes(fechaComp)) {
                            this.fechasCompetencia.push(fechaComp);
                        }
                    }
                    
                     */
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

    async fechaEvent($event: any) {
        console.log($event);
        const fecha = $event.toString();
        this.filtrarPartidosPorFecha(fecha);
    }
}
