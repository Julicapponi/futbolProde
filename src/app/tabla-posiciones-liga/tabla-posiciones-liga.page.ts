import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {AlertController, MenuController, ToastController} from "@ionic/angular";
import {ActivatedRoute, Router} from "@angular/router";
import {SharingServiceService} from "../services/sharing-service.service";
import {AuthService} from "../services/auth.service";
import {ResultsService} from "../services/results.service";
import {CompetenciaService} from "../services/competencia.service";
import {DatePipe} from "@angular/common";
import {ComparteDatosService} from "../services/comparte-datos.service";
import {TablaPosiciones} from "../class/TablaPosiciones";

@Component({
  selector: 'app-tabla-posiciones-liga',
  templateUrl: './tabla-posiciones-liga.page.html',
  styleUrls: ['./tabla-posiciones-liga.page.css'],
})
export class TablaPosicionesLigaPage implements OnInit {
  tablaPosicionesSegundaFase: TablaPosiciones;
  tablaPosiciones: TablaPosiciones[];
  isCargando: boolean;


  constructor(private toast: ToastController, private router: Router, private sharingService: SharingServiceService, private route: ActivatedRoute, private menuCtrl: MenuController,
              private authService: AuthService, private resultService: ResultsService,
              private competenciaService: CompetenciaService, public alertController: AlertController,
              public datepipe: DatePipe, private comparteDatosService: ComparteDatosService, private cdr: ChangeDetectorRef) { 
    this.obtenerPuntajes();
  }

  ngOnInit() {
    
  }
  
  
    obtenerPuntajes(){
      this.isCargando = true;
      this.sharingService.obtenerTablaPosiciones.subscribe((data: TablaPosiciones) => {
        setTimeout(async () => {
          this.tablaPosiciones = data[1];
          this.isCargando = false;
        }, 2000);

        console.log('tabla posiciones:', JSON.stringify(this.tablaPosiciones));
      });
    }
    
    volver() {
      this.router.navigate(['/inicioPage']);
    }
}
