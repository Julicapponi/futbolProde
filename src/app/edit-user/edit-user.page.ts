import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { AuthService } from '../services/auth.service';
import {NAVIGATE_LOGIN} from '../logueo/logueo.page';
import {NAVIGATE_LIST_USER} from '../list-users/list-users.page';
import {AlertController} from '@ionic/angular';
import {User} from '../class/User';
export const NAVIGATE_EDITAR_USER = 'EditUserPage';
@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.page.html',
  styleUrls: ['./edit-user.page.scss'],
})
export class EditUserPage implements OnInit {
  userEdit: User;

  id = '';

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private authService: AuthService, public alertController: AlertController ) {
     const idUser = localStorage.getItem('userIdEdit');
     this.userEdit = new User();
     this.authService.getUserId(idUser).subscribe(
     res => {
        this.userEdit = res;
        console.log('USUARIO QUE SE VA A EDITAR:', res);
      },
     err => {
        console.log(err);
        alert(err.error);
      }
     );
  }

  ngOnInit() {
  }





  volver(){
    this.router.navigate(['/list-users']);
  }

  editarUser(userEdit: User) {
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
