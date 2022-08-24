import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ActivatedRoute, NavigationExtras, Router} from '@angular/router';
import {AlertController, MenuController} from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import {User} from '../class/User';
import {faCoffee} from '@fortawesome/free-solid-svg-icons';
import {NAVIGATE_LOGIN} from '../logueo/logueo.page';
import {NAVIGATE_EDITAR_USER} from '../edit-user/edit-user.page';
export const NAVIGATE_LIST_USER = 'logueoPage';
@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.page.html',
  styleUrls: ['./list-users.page.scss'],
})
export class ListUsersPage implements OnInit {
  @Output() disparadorId: EventEmitter<any> = new EventEmitter();

  id = '';
  faCoffee = faCoffee;
  listUsers: User[];
  constructor(private activatedRoute: ActivatedRoute, private router: Router, private menuCtrl: MenuController, private authService: AuthService, public alertController: AlertController) {
    this.listarUsuarios();
  }

  ngOnInit() {
  }

  volver(){
    this.router.navigate(['/inicio-administrador']);
  }

  listarUsuarios(){
    this.authService.getUsers().subscribe(
      res => {
        console.log(res);
        this.listUsers = res;
        console.log('Lista de usuarios', this.listUsers);
      },
      err => {
        console.log(err);
        alert(err.error);
      }
    );
  }

  editarUser(user: User){
    const idUser = user._id;
    localStorage.setItem('userIdEdit', idUser.toString());
    this.router.navigate([NAVIGATE_EDITAR_USER]);
  }

  borrarUser(user: User){
    const idUser = user._id;
    idUser.toString();
    console.log('Usuario a eliminar con id: ' +idUser);
    this.authService.deleteUser(idUser).subscribe(
      res => {
        console.log(res);
        this.listarUsuarios();
        this.dialogSucess('Eliminado con éxito!!' );

      },
      err => {
        console.log(err);
        this.dialogError('No se ha podido eliminar este usuario');
      }

    );
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
            this.router.navigate([NAVIGATE_LIST_USER], { replaceUrl: true });
          }
        }]
    }).then(alert => {
      alert.present();
    });
  }


}
