import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AlertController, MenuController} from '@ionic/angular';
import {AuthService} from '../services/auth.service';
import {CompetenciaService} from '../services/competencia.service';
import {User} from "../class/User";
import {Competencia} from '../class/Competencia';
import {Comp} from '../class/Comp';
@Component({
  selector: 'app-alta-competencia',
  templateUrl: './alta-competencia.page.html',
  styleUrls: ['./alta-competencia.page.scss'],
})
export class AltaCompetenciaPage implements OnInit {
  competencia: Competencia[];
  comp: Comp[];
  constructor(private router: Router, private menuCtrl: MenuController, private authService: AuthService,
              private competenciaService: CompetenciaService, public alertController: AlertController) {
    
  }

  ngOnInit() {
    this.listaCompetenciasDisponibles();
  }

  listaCompetenciasDisponibles() {
    this.competenciaService.getCompetencias().subscribe(
      res => {
        console.log(res);
        this.competencia = res;
      },
      err => {
        console.log('error',err);
      }
    );
  }
/*
  buscarCompetencia() {
    console.log('busqueda de competencia');
    this.competenciaService.getCompetencias().subscribe(
      res => {
        console.log(res);
        this.competencia = res.response;
      },
      err => {
        console.log(err);
      }
    );
  }
*/
  
  changeCheckout(e, comp: Competencia) {
    if (e.target.checked) {
      if (e.target.checked) {
        comp.activa = true;
        console.log('COMPETENCIA ACTIVA VISIBLE PARA LOS USUARIOS');
      }
      comp.activa = true;
    } else {
      comp.activa = false;
    }
  }

  activarCompetencia(comp: Competencia) {
    const activaComp = comp.activa;
    this.competenciaService.editStateCompetition(comp, activaComp).subscribe(
      res => {
        console.log(res);
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
