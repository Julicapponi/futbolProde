import { Component, OnInit } from '@angular/core';
import {User} from '../class/User';
import {Router} from '@angular/router';
import {AlertController, MenuController, ToastController} from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import {NAVIGATE_REGISTRO} from "../registro/registro.page";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import { NavController } from '@ionic/angular';
import { NgControl } from '@angular/forms';
import { Constantes } from '../Constantes';
export const NAVIGATE_LOGIN = 'logueoPage';

@Component({
  selector: 'app-logueo',
  templateUrl: './logueo.page.html',
  styleUrls: ['./logueo.page.scss'],
})


export class LogueoPage implements OnInit {
  _url = Constantes.URL+'users';
  _url_prod = Constantes.URL_PROD+'users';
  loginForm: FormGroup;
  loginError: string;
  usuario: User[];
  isAdmin: string;
  isCargando=false;
  isLogueando: boolean;
  passwordVisible = false;
  audio = new Audio();
  constructor(  private formBuilder: FormBuilder, private http: HttpClient, private toast: ToastController, private router: Router, private menuCtrl: MenuController, private authService: AuthService, public alertController: AlertController) {
    this.menuCtrl.enable(false);
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, this.usernameValidator]],
      password: ['', [Validators.required, this.passwordValidator]],
    });
  }

  ngOnInit() {
    //this.playSound();
    this.isLogueando = true;
    localStorage.clear();
  }

  playSound() {
    this.audio.src = '../../assets/sound/init.mp3';
    this.audio.load();
    this.audio.play();
  }
  
  login() {
    this.isCargando = true;
    this.isLogueando = true;
    this.loginError = null;
    const username = this.loginForm.controls['username'].value;
    const password = this.loginForm.controls['password'].value;

    // Validar que el formulario esté completo
    /*
    if (this.loginForm.invalid) {
      this.markAllFieldsAsTouched();
      return;
    }
*/
    // Enviar la solicitud HTTP POST al servidor Node.js
    this.authService.signIn(username,password).subscribe(
        res => {
        console.log(res);
         
          if(res.message.includes('incorrectos')){
            this.showToastMessage('Email o contraseña incorrecto','danger','thumbs-down',2000);
          } else {
            localStorage.setItem('name', res.user.name);
            localStorage.setItem('idUser', res.user.iduser);
            localStorage.setItem('userName', res.user.email);
            this.isAdmin = res.user.admin;
            if(this.isAdmin == '1'){
              setTimeout(async () => {
                this.isCargando = false;
                this.isLogueando = false;
                this.router.navigate(['/inicio-administrador']);
              }, 1000);

            } else {
              setTimeout(async () => {
                this.isCargando = false;
                this.isLogueando = false;
                this.router.navigate(['/inicioPage']);
              }, 1000);
  
            }
          }
        },
        err => {
          if (err.status === 401) {
            // manejar el error de autorización
            this.isCargando = false;
            this.isLogueando = false;
            this.showToastMessage(err.error.message, 'danger', 'thumbs-down', 2000);
          } else if (err.status === 500){
            setTimeout(async () => {
              this.isCargando = false;
              this.isLogueando = false;
              this.showToastMessage(err.error.message, 'danger', 'thumbs-down', 2000);
            }, 700);
      
          } else if (err.status === 400){
            setTimeout(async () => {
              this.isCargando = false;
              this.isLogueando = false;
              this.showToastMessage(err.error.message, 'danger', 'thumbs-down', 2000);
            }, 700);

          }
        }
    );
  }

  // Marcar todos los campos como "touched" para que se muestren los errores de validación
  markAllFieldsAsTouched() {
    Object.values(this.loginForm.controls).forEach(control => control.markAsTouched());
  }

  onUsernameInput() {
    const usernameControl = this.loginForm.controls['username'];
    usernameControl.markAsTouched();
  }
  
  usernameIsValid() {
    const usernameControl = this.loginForm.controls['username'];
    return usernameControl.touched && usernameControl.valid;
  }
  
  usernameValidator(control) {
    const username = control.value;
    if (username && (username.length < 4 || username.length > 20 || /[^a-zA-Z0-9_]/.test(username))) {
      return { 'invalidUsername': true };
    }
    return null;
  }
  
  // Verificar si el campo de nombre de usuario tiene un error de validación
  usernameHasError(errorType: string) {
    const usernameControl = this.loginForm.controls['username'];
    return usernameControl.touched && usernameControl.hasError(errorType);
  }
  
  get password() {
    return this.loginForm.get('password');
  }

  // Verificar si el campo de contraseña tiene un error de validación
  passwordHasError(errorType: string) {
    const passwordControl = this.loginForm.controls['password'];
    return passwordControl.touched && passwordControl.hasError(errorType);
  }

// Verificar si el campo de contraseña es válido
  passwordIsValid() {
    const passwordControl = this.loginForm.controls['password'];
    return passwordControl.touched && passwordControl.valid;
  }

// Validador de contraseña
  passwordValidator(control) {
    const password = control.value;
    if (password && (!/[A-Z]/.test(password) || !/\d/.test(password) || password.length < 5)) {
      return { 'invalidPassword': true };
    }
    return null;
  }

// Función de controlador de entrada de contraseña
  onPasswordInput() {
    const passwordControl = this.loginForm.controls['password'];
    passwordControl.markAsTouched();
  }
  
  async showToastMessage(message:string, color: string, icon: string, duracion: number) {
    const toast = await this.toast.create({
      message: message,
      duration: duracion,
      icon: icon, //https://ionic.io/ionicons
      cssClass: '',
      position: "bottom",
      translucent: true,
      animated: true,
      mode: "md",  // md or ios
      color: color //"danger" ｜ "dark" ｜ "light" ｜ "medium" ｜ "primary" ｜ "secondary" ｜ "success" ｜ "tertiary" ｜ "warning" ｜ string & Record<never, never> ｜ undefined
    });
    await toast.present();
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
