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
  constructor(private activatedRoute: ActivatedRoute, private router: Router, private menuCtrl: MenuController, private authService: AuthService, public alertController: AlertController, private competitionsService: CompetenciaService) { 
    this.listarCompetenciasPorId();
  }

  ngOnInit() {
  }

  listarCompetenciasPorId(){
      this.isCargando = true;
    this.competitionsService.getLigas().subscribe(
        data => {
          this.listCompetitions = data.response;
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
}
