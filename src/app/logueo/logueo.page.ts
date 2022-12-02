import { Component, OnInit } from '@angular/core';
import {User} from '../class/User';
import {Router} from '@angular/router';
import {AlertController, MenuController} from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import {NAVIGATE_REGISTRO} from "../registro/registro.page";

export const NAVIGATE_LOGIN = 'logueoPage';

@Component({
  selector: 'app-logueo',
  templateUrl: './logueo.page.html',
  styleUrls: ['./logueo.page.scss'],
})


export class LogueoPage implements OnInit {
  user = {
    email: '',
    password: ''
  };
  usuario: User[];
  isAdmin: string;

  constructor(private router: Router, private menuCtrl: MenuController, private authService: AuthService, public alertController: AlertController) {

  }

  ngOnInit() {
    localStorage.clear();
  }

  signIn(user){
    this.user = user;
    console.log('usuario a loguear', this.user);
    this.authService.signIn(this.user).subscribe(
      res => {
        if(res.message.includes('incorrectos')){
          
        } else {
          this.dialogSucess(res.message);;
          this.usuario = res.user;
          console.log('usuario logueado:', JSON.stringify(this.usuario));
          localStorage.setItem('userName', this.user.email);
          for (let usuario of this.usuario) {
            console.log(usuario);
            this.isAdmin = usuario.admin;
          }
          if(this.isAdmin == '1'){
            this.router.navigate(['/inicio-administrador']);
          } else {
            this.router.navigate(['/inicioPage']);
          }
        }
        
        
      },
      err => {
        console.log(err);
        this.dialogError(err.error);
      }
    );

    /*
    this.loginUserService.loginUser(this.user).subscribe(data=>{
      console.log(data);
      alert('Login Success');
    },error => alert('Sorry, please enter correct userid and password'));
     */
  }

  async dialogSucess(message: string) {
    await this.alertController.create({
      header: 'Genial!',
      // subHeader: 'Ocurrió ',
      message: message,
    }).then(alert => {
      alert.present();
    });
  }


  inicioSesion(){
    this.router.navigate(['/inicio']);
  }

  registro(){
    this.router.navigate(['/registroPage']);
  }

  resetearPass(){
    this.router.navigate(['/resetPassPage']);
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
            localStorage.clear();
            this.router.navigate([NAVIGATE_LOGIN], { replaceUrl: true });
          }
        }]
    }).then(alert => {
      alert.present();
    });
  }

}
