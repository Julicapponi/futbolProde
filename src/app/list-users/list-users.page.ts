import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ActivatedRoute, NavigationExtras, Router} from '@angular/router';
import {AlertController, MenuController, ModalController} from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import {User} from '../class/User';
import {NAVIGATE_LOGIN} from '../logueo/logueo.page';
import {EditUserPage, NAVIGATE_EDITAR_USER} from '../edit-user/edit-user.page';
export const NAVIGATE_LIST_USER = 'list-users';
@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.page.html',
  styleUrls: ['./list-users.page.scss'],
})
export class ListUsersPage implements OnInit {
  @Output() disparadorId: EventEmitter<any> = new EventEmitter();

  id = '';
  listUsers: User[];
  isCargando: boolean;
  filterTerm: string;
  constructor(private activatedRoute: ActivatedRoute, private modalCtrl: ModalController, private router: Router, private menuCtrl: MenuController, private authService: AuthService, public alertController: AlertController) {
    this.listarUsuarios();
  }

  ngOnInit() {
  }

  volver(){
    this.router.navigate(['/inicio-administrador']);
  }

  async listarUsuarios(): Promise<void> {
    this.isCargando = true;
    return await new Promise(async resolve => {
      try{
      this.authService.getUsers().subscribe(async res => {
          this.isCargando = false;
          console.log(res);
          this.listUsers = res;
          console.log('Lista de usuarios', this.listUsers);
          });
        } catch (e) {
        }
    });
  }

  async editarUser(user: User){
    const profileModal = await this.modalCtrl.create({
      component: EditUserPage,
      cssClass: 'modal_popup',
      showBackdrop: true,
      backdropDismiss: false,
      componentProps: {
        user: user,
      },
    });
    profileModal.present();
  }

  async borrarUser(user: User) {
    console.log(user.iduser);
    const idUser = user.iduser;
    await this.alertController.create({
      header: 'Eliminar usuario',
      // subHeader: 'Ocurrió ',
      message: 'Estás seguro de eliminar el usuario?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {

          }
        },
        {
          text: 'Aceptar',
          role: 'accept',
          handler: () => {
            console.log('Usuario a eliminar con ID: ' + idUser);
            this.authService.deleteUser(idUser).subscribe(
                res => {
                  console.log(res);
                  this.dialogSucess('Eliminado con éxito!!');
                  this.listarUsuarios();

                },
                err => {
                  console.log(err);
                  this.dialogError('No se ha podido eliminar este usuario');
                }
            );
          }
        }
      ]
    }).then(alert => {
      alert.present();
    });
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
          role: 'accept',
          handler: () => {
            this.router.navigate([NAVIGATE_LIST_USER], { replaceUrl: true });
          }
        }]
    }).then(alert => {
      alert.present();
    });
  }


}
