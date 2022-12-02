import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { AuthService } from '../services/auth.service';
import {NAVIGATE_LOGIN} from '../logueo/logueo.page';
import {NAVIGATE_LIST_USER} from '../list-users/list-users.page';
import {AlertController, ModalController, NavParams} from '@ionic/angular';
import {User} from '../class/User';
export const NAVIGATE_EDITAR_USER = 'EditUserPage';
@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.page.html',
  styleUrls: ['./edit-user.page.scss'],
})
export class EditUserPage implements OnInit {
  userEdit: User;
  user: User;

  constructor(private activatedRoute: ActivatedRoute, private modalCtrl: ModalController, private params: NavParams, private router: Router, private authService: AuthService, public alertController: AlertController ) {
    if(params != null && params.get('user') != null) {
      this.userEdit = <User>params.get('user');
    }
  }

  ngOnInit() {
  }





  async volver(){
    await this.modalCtrl.dismiss();

  }

  editarUser(userEdit: User) {
    console.log('usuario a editar:', userEdit)
    this.authService.editUser(userEdit).subscribe(
      res => {
        console.log(res);
        this.dialogSucess('Usuario editado con exito');
      },
      err => {
        console.log(err);
        this.dialogError('No se ha podido Editar este usuario');
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
          handler: () => {
            this.router.navigate([NAVIGATE_LIST_USER], { replaceUrl: true });
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
}
