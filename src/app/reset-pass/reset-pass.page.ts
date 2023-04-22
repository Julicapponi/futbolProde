import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {NAVIGATE_LOGIN} from "../logueo/logueo.page";
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {ToastController} from "@ionic/angular";
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-reset-pass',
  templateUrl: './reset-pass.page.html',
  styleUrls: ['./reset-pass.page.scss'],
})
export class ResetPassPage implements OnInit {
  public userForm: FormGroup;
  errors: any = {};
  constructor( private authService: AuthService, private toast: ToastController, private formBuilder: FormBuilder, private router: Router) { }

  ngOnInit() {
    this.userForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email, this.emailValidator]],

    }, { updateOn: 'change' });
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
  
  resetearPass(){
    if (this.userForm.valid) {
      const emailUser = this.userForm.value;
      this.authService.resetPassword(emailUser).subscribe(
          (res) => {
            console.log(res);
            if(res.message.includes('Hemos enviado')){
              this.showToastMessage(res.message, 'success', 'mail', 6000,"bottom");
              this.userForm.reset();
            } else if(res.message.includes('Tuvimos un error')) {
              this.showToastMessage(res.message, 'danger', 'close', 6000,"bottom");
            }
          },
          (err) => {
            console.log(err);
            this.errors.message = err.error.message;
          }
      );
    } else {
      this.errors.message = 'Por favor complete todos los campos';
      this.showToastMessage(this.errors.message, 'danger', 'thumbs-down', 3000,"bottom");
    }
  }

  async showToastMessage(message:string, color: string, icon: string, duration: number, position) {
    const toast = await this.toast.create({
      message: message,
      duration: duration,
      position: position,
      icon: icon, //https://ionic.io/ionicons
      cssClass: '',
      translucent: true,
      animated: true,
      mode: "md",  // md or ios
      color: color //"danger" ｜ "dark" ｜ "light" ｜ "medium" ｜ "primary" ｜ "secondary" ｜ "success" ｜ "tertiary" ｜ "warning" ｜ string & Record<never, never> ｜ undefined
    });
    await toast.present();
  }

  volver(){
    this.router.navigate([NAVIGATE_LOGIN]);
  }

}
