import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { AuthService } from '../services/auth.service';
import {NAVIGATE_LOGIN} from '../logueo/logueo.page';
import {NAVIGATE_LIST_USER} from '../list-users/list-users.page';
import {AlertController, MenuController, ModalController, NavParams, ToastController} from '@ionic/angular';
import {User} from '../class/User';
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators} from "@angular/forms";
export const NAVIGATE_EDITAR_USER = 'EditUserPage';
@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.page.html',
  styleUrls: ['./edit-user.page.scss'],
})
export class EditUserPage implements OnInit {
  userEdit: User;
  user: User;
  public userForm: FormGroup;
  passwordRepeatVisible = false;
  datos: any[];
  errors: any = {};
  isAdmin = false;
  passwordVisible = false;
  userTemporal: User;
  constructor(private menuCtrl: MenuController, private toast: ToastController, private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute, private modalCtrl: ModalController, private params: NavParams, private router: Router, private authService: AuthService, public alertController: AlertController ) {
    if(params != null && params.get('user') != null) {
      this.userEdit = <User>params.get('user');
      this.userTemporal = this.userEdit;
    }
  }

  ngOnInit() {
    if(localStorage.getItem('isAdmin').includes("1")){
      this.isAdmin = true;
    } 
    if (this.isAdmin) {
    } else {
     this.modalCtrl.dismiss();
    }
    this.userForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      username: ['', [Validators.required, this.usernameValidator]],
      email: ['', [Validators.required, Validators.email, this.emailValidator]],
      password: ['', [Validators.required, this.passwordValidator]],
      confirmPassword: ['', [Validators.required, this.confirmPasswordValidator]]
    }, {updateOn: 'change'});

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

  usernameValidator(control) {
    const username = control.value;
    if (username && (username.length < 4 || username.length > 20 || /[^a-zA-Z0-9_]/.test(username))) {
      return {'invalidUsername': true};
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
      return {email: true};
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
        password && (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/\d/.test(password) || password.length < 8 || password.length > 20)
    ) {
      return {'invalidPassword': true};
    }
    return null;
  }

// Función de controlador de entrada de contraseña
  onPasswordInput() {
    const passwordControl = this.userForm.controls['password'];
    passwordControl.markAsTouched();
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

  async volver(){
    this.menuCtrl.enable(true);
    await this.modalCtrl.dismiss();
  }

  async editarUser(userEdit: User) {
    console.log('usuario a editar:', userEdit)
    this.authService.editUser(userEdit).subscribe(
       res => {
        console.log(res);
        if (this.isAdmin) {
           this.dialogSucess('¡El usuario ha sido editado exitosamente!');
        } else {
            localStorage.setItem('name', userEdit.name);
            localStorage.setItem('userName', userEdit.userName);
           this.showToastMessage('¡Los cambios en tu perfil se han guardado exitosamente!', "primary", 'thumbs-up', 5000);
          ;
        }

      },
       err => {
        console.log(err);
        if (this.isAdmin) {
           this.dialogError("No se ha podido editar el usuario. Por favor, verifica tu conexión a internet o inténtalo nuevamente más tarde.");
        } else {
           this.showToastMessage("No se ha podido editar el usuario. Por favor, verifica tu conexión a internet o inténtalo nuevamente más tarde.", "danger", 'thumbs-down', 5000);
          ;
        }

      }
    );
  }

  async dialogError(message: string) {
    await this.alertController.create({
      header: 'Ups!',
      // subHeader: 'Ocurrió ',
      message,
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
      message,
      buttons: [
        {
          text: 'Aceptar',
          role: 'Cancelar',
          handler: async () => {
              await this.router.navigate([NAVIGATE_LIST_USER], {replaceUrl: true});
          }
        }]
    }).then(alert => {
      alert.present();
    });
  }

  mostrarPass() {
      const tipo = document.getElementById('password');
      const nose = tipo.outerText;
      console.log(nose);
  }

  async showToastMessage(message:string, color: string, icon: string, duracion:number) {
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
}
