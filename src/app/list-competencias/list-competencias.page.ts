import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AlertController, MenuController} from "@ionic/angular";
import {AuthService} from "../services/auth.service";
import {CompetenciaService} from "../services/competencia.service";
import {Competencia} from "../class/Competencia";

@Component({
  selector: 'app-list-competencias',
  templateUrl: './list-competencias.page.html',
  styleUrls: ['./list-competencias.page.scss'],
})
export class ListCompetenciasPage implements OnInit {
    private listCompetitions: Competencia[];
    filterTerm: string;
    isCargando: boolean;
    seActivoCompetencia: boolean;
    isActivateCheckbox: boolean;
    competenciasActivas: Competencia;
    listaCompetenciasActivas: any;
  constructor(private activatedRoute: ActivatedRoute, private competenciaService: CompetenciaService,private router: Router, private menuCtrl: MenuController, private authService: AuthService, public alertController: AlertController, private competitionsService: CompetenciaService) { 
    this.listCompetenciaActivas();
    this.listarCompetenciasPorId();
  }

  ngOnInit() {
  }

    listCompetenciaActivas(){
        this.competenciaService.getCompetenciasActivas().subscribe(res => {
                console.log(res);
                for (let comp of res){
                    console.log(comp);
                    this.listaCompetenciasActivas.push(comp.idCompetition);
                }
            },
            err => {
                console.log(err);
            }
        );
    }
    
  listarCompetenciasPorId(){
      this.isCargando = true;
    this.competitionsService.getLigas().subscribe(
        data => {
          this.listCompetitions = data.response;
          console.log(this.listaCompetenciasActivas);
        
          console.log('Lista de competencias', JSON.stringify(this.listCompetitions));
          this.isCargando = false;
        },
        err => {
          console.log(err);
          alert(err.error);
        }
    );
  }
    
  
    volver() {
        this.router.navigate(['/inicio-administrador']);
    }

    isChecked(competencia: Competencia, event: any) {
        if (event.detail.checked == true) {
            this.seActivoCompetencia = true;
        } else {
            this.seActivoCompetencia = false;
        }
        this.activarCompetencia(competencia, this.seActivoCompetencia);
    }

    activarCompetencia(comp: any, compActiva: boolean) {
            this.competenciaService.editStateCompetition(comp, compActiva).subscribe(
                res => {
                    console.log(res);
                    if(res.checkbox){
                        this.isActivateCheckbox = true;
                    } else {
                        this.isActivateCheckbox = false;
                    }
                },
                err => {
                    console.log(err);
                }
            );
    }

    irListaComp() {
        this.router.navigate(['/list-competencias-admin']);
    }
}
