import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, NavigationExtras} from '@angular/router';
import { AuthService } from '../services/auth.service';
import {AlertController, ToastController } from '@ionic/angular';
import {NAVIGATE_LOGIN} from '../logueo/logueo.page';
import {NAVIGATE_LIST_USER} from '../list-users/list-users.page';
import {User} from "../class/User";
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators} from "@angular/forms";

export const NAVIGATE_REGISTRO = 'RegistroPage';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})


export class RegistroPage implements OnInit {
  datos: any[];
  public userForm: FormGroup;
  errors: any = {};
  isAdmin = false;
  passwordVisible = false;
  passwordRepeatVisible = false;
  constructor(private formBuilder: FormBuilder, private router: Router, private activatedRoute: ActivatedRoute, private authService: AuthService, public alertController: AlertController) {
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
    this.userForm = this.formBuilder.group({
      name: ['', [Validators.required, this.nameValidator]],
      username: ['', [Validators.required, this.usernameValidator]],
      email: ['', [Validators.required, Validators.email, this.emailValidator]],
      password: ['', [Validators.required, this.passwordValidator]],
      confirmPassword: ['', [Validators.required, this.confirmPasswordValidator]]
    }, { updateOn: 'change' });

    // Añadir validador personalizado a confirmPassword
    this.userForm.get('password').valueChanges.subscribe(() => {
      this.userForm.get('confirmPassword').updateValueAndValidity();
    });
  }

  // NAME VALIDACIONES
  onNameInput() {
    const control = this.userForm.get('name');
    control.markAsTouched();
  }
  nameIsValid() {
    const control = this.userForm.get('name');
    return control.touched && !control.errors;
  }
  nameIsInvalid() {
    const control = this.userForm.get('name');
    return control.touched && control.invalid;
  }
  nameHasError(type: string) {
    const control = this.userForm.get('name');
    return control.touched && control.hasError(type);
  }


  //USERNAME VALIDACIONES
  onUsernameInput() {
    const usernameControl = this.userForm.controls['username'];
    usernameControl.markAsTouched();
  }
  usernameIsValid() {
    const usernameControl = this.userForm.controls['username'];
    return usernameControl.touched && usernameControl.valid;
  }
  
  nameValidator(control) {
    const name = control.value;
    if (name && (name.length < 4 || name.length > 20 || /[^a-zA-Z0-9_]/.test(name))) {
      return { 'invalidName': true };
    }
    return null;
  }
    
  usernameValidator(control) {
    const username = control.value;
    if (username && (username.length < 4 || username.length > 20 || /[^a-zA-Z0-9_]/.test(username))) {
      return { 'invalidUsername': true };
    }
    return null;
  }
  
  usernameHasError(errorType: string) {
    const usernameControl = this.userForm.controls['username'];
    return usernameControl.touched && usernameControl.hasError(errorType);
  }

  
  //EMAIL VALIDACIONES
  emailHasError(type: string) {
    const control = this.userForm.get('email');
    return control.touched && control.hasError(type);
  }
  emailIsValid() {
    const control = this.userForm.get('email');
    return control.touched && !control.errors;
  }
  onEmailInput() {
    const control = this.userForm.get('email');
    control.markAsTouched();
  }

  emailValidator(control: AbstractControl): ValidationErrors | null {
    // Declaración de la expresión regular para validar email
     const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (control.value && !emailRegex.test(control.value)) {
      return { email: true };
    }
    return null;
  }

  //PASSWORD VALIDACIONES
  get password() {
    return this.userForm.get('password');
  }
  // Verificar si el campo de contraseña tiene un error de validación
  passwordHasError(errorType: string) {
    const passwordControl = this.userForm.controls['password'];
    return passwordControl.touched && passwordControl.hasError(errorType);
  }
// Verificar si el campo de contraseña es válido
  passwordIsValid() {
    const passwordControl = this.userForm.controls['password'];
    return passwordControl.touched && passwordControl.valid;
  }
// Validador de contraseña
  passwordValidator(control) {
    const password = control.value;
    if (
        password && (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/\d/.test(password) || password.length < 8)
    ) {
      return { 'invalidPassword': true };
    }
    return null;
  }
// Función de controlador de entrada de contraseña
  onPasswordInput() {
    const passwordControl = this.userForm.controls['password'];
    passwordControl.markAsTouched();
  }
  
  signUp() {
    if (this.userForm.valid) {
      const user = this.userForm.value;
      user.admin = 0;
      this.authService.signUp(user).subscribe(
          (res) => {
            console.log(res);
            this.dialogSucess('Registrado con éxito!!');
            this.userForm.reset();
          },
          (err) => {
            console.log(err);
            this.dialogError(err.error.message);
            this.errors.message = err.error.message;
          }
      );
    } else {
      this.errors.message = 'Por favor complete todos los campos';
      this.dialogError(this.errors.message);
    }
  }
  
  //VALIDACION CONFIRMAR REPETIR CONTRASEÑA
  onConfirmPasswordInput() {
    this.userForm.get('confirmPassword').setValidators([Validators.required, this.confirmPasswordValidator(this.userForm.get('password').value)]);
    this.userForm.get('confirmPassword').updateValueAndValidity();
  }

  confirmPasswordHasError(error: string) {
    const control = this.userForm.get('confirmPassword');
    return control.touched && control.hasError(error);
  }

  confirmPasswordIsValid() {
    const control = this.userForm.get('confirmPassword');
    return control.touched && control.valid;
  }

  confirmPasswordValidator(password: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const confirmPassword = control.root.get('confirmPassword');
      if (confirmPassword && control.value !== confirmPassword.value) {
        const confirmPassword = control.value;
        const passwordMatch = confirmPassword === password;
        return passwordMatch ? null : {passwordMismatch: true};
      }
      const password2 = control.root.get('password');
      if (password2 && control.value !== password2.value) {
        return { 'passwordMismatch': true };
      }
    };
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
        }]
    }).then(alert => {
      alert.present();
    });
  }

    cambioNombre() {
        
    }
}
