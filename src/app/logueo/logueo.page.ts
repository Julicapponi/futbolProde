import { Component, OnInit } from '@angular/core';
import {User} from '../class/User';
import {Router} from '@angular/router';
import {AlertController, MenuController} from '@ionic/angular';
import { AuthService } from '../services/auth.service';

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

  constructor(private router: Router, private menuCtrl: MenuController, private authService: AuthService, public alertController: AlertController) {

  }

  ngOnInit() {
    localStorage.clear();
  }

  signIn(){
    this.authService.signIn(this.user).subscribe(
      res => {
        console.log(this.user);
        console.log(res);
        localStorage.setItem('token', res.token);
        localStorage.setItem('userName', this.user.email);
        if(res.user.admin == '1'){
          this.router.navigate(['/inicio-administrador']);
        } else {
          this.router.navigate(['/inicioPage']);
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
