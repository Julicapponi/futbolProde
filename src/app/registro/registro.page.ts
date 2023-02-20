import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, NavigationExtras} from '@angular/router';
import { AuthService } from '../services/auth.service';
import {AlertController, ToastController } from '@ionic/angular';
import {NAVIGATE_LOGIN} from '../logueo/logueo.page';
import {NAVIGATE_LIST_USER} from '../list-users/list-users.page';
import {User} from "../class/User";

export const NAVIGATE_REGISTRO = 'RegistroPage';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})


export class RegistroPage implements OnInit {
  datos: any[];
  user: User = {
    iduser: null,
    name: "",
    userName: "",
    email: "",
    password: "",
    admin: "0"
  };
  isAdmin: boolean;

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private authService: AuthService, public alertController: AlertController) {
    try {
      this.activatedRoute.queryParams.subscribe(() => {
        if (this.router.getCurrentNavigation().extras.state) {
          this.isAdmin = this.router.getCurrentNavigation().extras.state.isAdmin; // TIENDA_SELE;
        }
      });
    } catch (e) {
    }
    
  }

  ngOnInit() {
  }

  signUp(user: User){
    this.user = user;
    console.log(this.user);
    this.authService.signUp(this.user).subscribe(
      res => {
        //guardamos el token
        console.log(this.user);
        console.log(res);
       // localStorage.setItem('token', res.token);
        this.dialogSucess('Registrado con éxito!!' );
      },
      err => {
        console.log(err);
        this.dialogError('Usted no ha sido registrado, revise los datos');
      }
    );
  }

  volver(){
    if(this.isAdmin){
      this.router.navigate(['/inicio-administrador'], { replaceUrl: true });
    } else {
      this.router.navigate([NAVIGATE_LOGIN], { replaceUrl: true });
    }

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

    cambioNombre() {
        
    }
}
