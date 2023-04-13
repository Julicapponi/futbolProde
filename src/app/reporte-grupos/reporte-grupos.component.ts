import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AlertController, MenuController, ToastController} from "@ionic/angular";
import {ActivatedRoute, Router} from "@angular/router";
import {SharingServiceService} from "../services/sharing-service.service";
import {AuthService} from "../services/auth.service";
import {ResultsService} from "../services/results.service";
import {CompetenciaService} from "../services/competencia.service";
import {DatePipe} from "@angular/common";
import {ComparteDatosService} from "../services/comparte-datos.service";

import {GruposService} from "../services/grupos.service";
import {Observable} from "rxjs";
import {Grupo} from "../class/Grupo";
import { ChartData, ChartType} from "chart.js";
import {Chart} from "chart.js/auto";

@Component({
  selector: 'app-reporte-grupos',
  templateUrl: './reporte-grupos.component.html',
  styleUrls: ['./reporte-grupos.component.css']
})
export class ReporteGruposComponent implements OnInit {
  private gruposReport: Grupo[];
  isCargando: boolean;
  mostrarGrilla = true;
  verMasInfo = true;
  textInfo = "Ocultar info";

  constructor(private gruposService: GruposService, private toast: ToastController, private router: Router, private sharingService: SharingServiceService, private route: ActivatedRoute, private menuCtrl: MenuController,
              private authService: AuthService, private resultService: ResultsService,
              private competenciaService: CompetenciaService, public alertController: AlertController,
              public datepipe: DatePipe, private comparteDatosService: ComparteDatosService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.obtenerReporte();
  }

  volver() {
    this.router.navigate(['/inicio-administrador']);
  }
  
  async obtenerReporte(): Promise<void> {
    return await new Promise(async resolve => {
      this.isCargando = true;
      try {
        await this.gruposService.reporteGrupos().subscribe(async respuesta => {
          this.gruposReport = respuesta;
          this.isCargando = false;
          this.visualizarGrafico();
        });
      } catch (e) {
        
      }
    });
  }
  
  visualizarGrafico() {
    new Chart('myChart', {
      type: 'bar',
      data: {
        labels: this.gruposReport.map(grupo => grupo.nameGrupo),
        datasets: [
          {
            label: 'Aciertos Exactos',
            data: this.gruposReport.map(grupo => grupo.aciertos_exactos),
            backgroundColor: 'rgba(75,192,192,0.2)',
            borderColor: 'rgba(75,192,192,1)',
            borderWidth: 1,
            stack: 'Stack 0'
          },
          {
            label: 'Aciertos no Exactos',
            data: this.gruposReport.map(grupo => grupo.aciertos_no_exactos),
            backgroundColor: 'rgba(255, 206, 86, 0.2)',
            borderColor: 'rgba(255, 206, 86, 1)',
            borderWidth: 1,
            stack: 'Stack 1'
          },
          {
            label: 'No Aciertos',
            data: this.gruposReport.map(grupo => grupo.no_aciertos),
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
            stack: 'Stack 2'
          }
        ]
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: 'Desempeño de aciertos de grupos',
            color: 'white' // agregado para cambiar el color del título
          },
          legend: {
            labels: {
              color: 'white' // agregado para cambiar el color de las etiquetas de leyenda
            }
          }
        },
        responsive: true,
        scales: {
          x: {
            stacked: true,
            ticks: {
              color: 'white' // agregado para cambiar el color de las etiquetas del eje x
            }
          },
          y: {
            stacked: true,
            ticks: {
              color: 'white' // agregado para cambiar el color de las etiquetas del eje x
            }
          }
        }
      }
    });
  }

  isMuestraGrilla(muestraGrilla) {
    if(muestraGrilla){
      this.mostrarGrilla = true;
    } else {
      this.mostrarGrilla = false;
    }
  }

  verInfo() {
    if(this.verMasInfo){
      this.verMasInfo = false;
      this.textInfo = "Ver info";
    } else {
      this.verMasInfo = true;
      this.textInfo = "Ocultar Info";
    }
  }
}
