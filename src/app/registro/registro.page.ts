import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { AuthService } from '../services/auth.service';
import {AlertController, ToastController } from '@ionic/angular';
import {NAVIGATE_LOGIN} from '../logueo/logueo.page';
import {NAVIGATE_LIST_USER} from '../list-users/list-users.page';

export const NAVIGATE_REGISTRO = 'RegistroPage';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})


export class RegistroPage implements OnInit {
  datos: any[];

  user = {
    name: '',
    userName: '',
    email: '',
    password: '',
    admin: '0' // USUARIO NORMAL: 0 , USUARIO ADMINISTRADOR: 1
  };

  constructor(private router: Router, private authService: AuthService, public alertController: AlertController) { }

  ngOnInit() {
  }

  signUp(){
    this.authService.signUp(this.user).subscribe(
      res => {
        //guardamos el token
        console.log(this.user);
        console.log(res);
        localStorage.setItem('token', res.token);
        this.dialogSucess('Registrado con éxito!!' );
      },
      err => {
        console.log(err);
        this.dialogError('Usted no ha sido registrado, revise los datos');
      }
    );
  }

  volver(){
    this.router.navigate(['/logueoPage']);
  }

  async dialogError(message: string) {
    await this.alertController.create({
      header: 'Ups!',
      // subHeader: 'Ocurrió ',
      message: message,
      buttons: [
        {
          text: 'Aceptar',
          role: 'Cancelar',
          handler: () => {
              this.router.navigate([NAVIGATE_LOGIN], { replaceUrl: true });
          }
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

}
