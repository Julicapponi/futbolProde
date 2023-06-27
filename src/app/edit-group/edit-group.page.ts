import { Component, OnInit } from '@angular/core';
import {AlertController, ModalController, NavParams, ToastController} from "@ionic/angular";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../services/auth.service";
import {GruposService} from "../services/grupos.service";
import {User} from "../class/User";
import {Grupo} from "../class/Grupo";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NAVIGATE_LOGIN} from "../logueo/logueo.page";
import {NAVIGATE_LIST_USER} from "../list-users/list-users.page";

@Component({
  selector: 'app-edit-group',
  templateUrl: './edit-group.page.html',
  styleUrls: ['./edit-group.page.css'],
})
export class EditGroupPage implements OnInit {
  grupoEdit: Grupo;
  public groupForm: FormGroup;

  constructor(private toast: ToastController, private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute, private modalCtrl: ModalController, private params: NavParams, private router: Router, private groupService: GruposService, public alertController: AlertController) {
    if(params != null && params.get('grupo') != null) {
      this.grupoEdit = <Grupo>params.get('grupo');
    }
  }

  ngOnInit() {
    this.groupForm = this.formBuilder.group({
      nameGroup: ['', [Validators.required, Validators.minLength(3)]],
    }, { updateOn: 'change' });

    if (this.grupoEdit) {
      this.groupForm.patchValue({
        nameGroup: this.grupoEdit.nameGrupo
      });
    }
  }

  // nameGroup VALIDACIONES
  onNameInput() {
    const control = this.groupForm.get('nameGroup');
    control.markAsTouched();
  }
  nameIsValid() {
    const control = this.groupForm.get('nameGroup');
    return control.touched && !control.errors;
  }
  nameIsInvalid() {
    const control = this.groupForm.get('nameGroup');
    return control.touched && control.invalid;
  }
  nameHasError(type: string) {
    const control = this.groupForm.get('nameGroup');
    return control.touched && control.hasError(type);
  }

  async volver() {
    await this.modalCtrl.dismiss();
  }

  editGroup() {
    if (this.groupForm.valid) {
      const nameEdit = this.groupForm.value.nameGroup;
      console.log('Grupo a editar:', nameEdit)
      this.groupService.editGroup(nameEdit,this.grupoEdit).subscribe(
          res => {
            console.log(res);
            this.showToastMessage('Nombre de grupo editado con exito', 'primary', 'thumbs-up', 5000);
          },
          err => {
            console.log(err);
            this.showToastMessage('No se ha podido confirmar la edicion de este grupo', 'danger', 'thumbs-down', 5000);
          }
      );
    }
  }

  async dialogError(message: string) {
    await this.alertController.create({
      header: 'Ups!',
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
  
  async dialogSucess(message: string) {
    await this.alertController.create({
      header: 'Genial!',
      message,
      buttons: [
        {
          text: 'Aceptar',
          role: 'Cancelar',
          handler: () => {
            this.router.navigate([NAVIGATE_LIST_USER], { replaceUrl: true });
          }
        }]
    }).then(alert => {
      alert.present();
    });
  }
}
