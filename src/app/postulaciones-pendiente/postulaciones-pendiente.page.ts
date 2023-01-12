import { Component, OnInit } from '@angular/core';
import {Postulacion} from "../class/Postulacion";
import {ActivatedRoute, Router} from "@angular/router";
import {AlertController} from "@ionic/angular";

@Component({
  selector: 'app-postulaciones-pendiente',
  templateUrl: './postulaciones-pendiente.page.html',
  styleUrls: ['./postulaciones-pendiente.page.css'],
})
export class PostulacionesPendientePage implements OnInit {
  postulaciones: Postulacion[];

  constructor(private router: Router, private activatedRoute: ActivatedRoute, public alertController: AlertController) {
    try {
      this.activatedRoute.queryParams.subscribe(() => {
        if (this.router.getCurrentNavigation().extras.state) {
          this.postulaciones = this.router.getCurrentNavigation().extras.state.postulaciones;
        }
      });
    } catch (e) {
      console.log(e);
    }
  }

  ngOnInit() {}

  volver() {
    this.router.navigate(['/partidosPage']);
  }

  aceptaPostulante(isAcepta: boolean, postulacion: any) {
    if(isAcepta){
      // AGREGAR USUARIO A LA TABLA MIEMBROS_GRUPO
      // ELIMINAR POSTULACION DEL USUARIO Y DE X GRUPO DE LA TABLA POSTULACIONES_GRUPO
    } else {
      // ELIMINAR POSTULACION DEL USUARIO Y DE X GRUPO DE LA TABLA POSTULACIONES_GRUPO
    }
  }
}
