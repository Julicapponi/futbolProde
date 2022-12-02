import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {CompetenciaService} from "../services/competencia.service";
import {AlertController, MenuController} from "@ionic/angular";
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-list-competencias-admin',
  templateUrl: './list-competencias-admin.page.html',
  styleUrls: ['./list-competencias-admin.page.scss'],
})
export class ListCompetenciasAdminPage implements OnInit {
  competenciasActivas: any;
  isCargando: boolean;
  filterTerm: string;
  
  constructor(private activatedRoute: ActivatedRoute, private competenciaService: CompetenciaService,private router: Router, private menuCtrl: MenuController, private authService: AuthService, public alertController: AlertController, private competitionsService: CompetenciaService) {
    this.listaCompetenciasActivas();
  }

  ngOnInit() {
  }
  
  listaCompetenciasActivas(){
    this.isCargando = true;
    this.competenciaService.getCompetenciasActivas().subscribe(res => {
          console.log(res);
          this.competenciasActivas = res;
          this.isCargando = false;
        },
        err => {
          console.log(err);
        }
    );
  }
  volver() {
    this.router.navigate(['/inicio-administrador']);
  }
}
