import {Component, OnInit, ViewChild} from '@angular/core';
import {ListaRutas} from "../class/lista_menu";
import {AlertController, IonMenu, MenuController, ModalController} from "@ionic/angular";
import {Router} from "@angular/router";
import {InAppBrowser} from "@ionic-native/in-app-browser/ngx";
import {User} from "../class/User";
import {AuthService} from "../services/auth.service";
import {NAVIGATE_LOGIN} from "../logueo/logueo.page";
import {NAVIGATE_LIST_USER} from "../list-users/list-users.page";
import {EditUserPage} from "../edit-user/edit-user.page";
import {ComparteDatosService} from "../services/comparte-datos.service";
export const NAVIGATE_HOME = 'list-users';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent implements OnInit {
  @ViewChild('menu', { static: true }) menu: IonMenu;
  user: string;
  name: string;
  idUser:string;
  userObject: User;
  public lista_rutas: ListaRutas[] = [
    {name:'Inicio', ruta:'/home', icon:'home-outline'},
    //{name:'Cambiar contraseña?', ruta:'/home', icon:'key-outline', method: 'cambiarContrasenia'},
    {name:'Como jugar?', ruta:'/terminos', icon:'information-circle-outline'},
   // {name:'Compartir app', ruta:'/home', icon:'share-social-outline'},
    { name: 'Contacto', ruta: '/home', icon: 'logo-whatsapp', method: 'redirigirAWhatsApp' },
  ]

  constructor( private inAppBrowser: InAppBrowser, private menuCtrl: MenuController,  private comparteDatosService: ComparteDatosService, private modalCtrl: ModalController, private router: Router, public alertController: AlertController, private authService: AuthService) {
    this.user = localStorage.getItem('userName');
    this.name = localStorage.getItem('name');
    this.menuCtrl.enable(true);
  }
  
  ngAfterViewInit() {
    this.menu.ionWillOpen.subscribe(() => {
      this.user = localStorage.getItem('userName');
      this.name = localStorage.getItem('name');
      this.idUser = localStorage.getItem('idUser');
     
      console.log('El menú se está abriendo');
    });

    this.menu.ionDidOpen.subscribe(() => {
      console.log('El menú se ha abierto');
    });
  }
  
  ngOnInit() {
    this.comparteDatosService.getUser().subscribe(user => {
      this.userObject = user;
    });
  }

  executeMethod(ruta: ListaRutas) {
    if (ruta.method && typeof this[ruta.method] === 'function') {
      this[ruta.method]();
    } else {
      this.closeMenu();
    }
  }
  
  closeMenu() {
    this.menuCtrl.enable(false);
  }

  cerrarSesion() {
    localStorage.clear();
    this.router.navigate(['/home']);
  }

  irEditarPerfil() {
    this.router.navigate(['/home']);
  }

  async borrarUser() {
    this.closeMenu();
    const idUser = this.idUser;
    await this.alertController.create({
      header: 'Eliminar cuenta',
      // subHeader: 'Ocurrió ',
      message: 'Estás seguro de eliminar su cuenta?',
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

                },
                err => {
                  console.log(err);
              
                  this.dialogError('Ocurrio un error, no se pudo eliminar tu usuario');
                }
            );
          }
        }
      ]
    }).then(alert => {
      this.menuCtrl.enable(true);
      alert.present();
    });
  }

  cambiarContrasenia() {
    this.router.navigate(['/home']);
  }

  redirigirAWhatsApp() {
    const phoneNumber = '3471594286';
    const text = 'Hola, soy el usuario: '+this.user+'. Necesito ayuda en: ';
    const url = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(text)}`;
    this.inAppBrowser.create(url, '_system');
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
          role: 'accept',
          handler: () => {
            this.cerrarSesion();
            
          }
        }]
    }).then(alert => {
      alert.present();
    });
  }

  async editarUser(){
    this.closeMenu();
    const profileModal = await this.modalCtrl.create({
      component: EditUserPage,
      cssClass: 'modal_popup',
      showBackdrop: true,
      backdropDismiss: false,
      componentProps: {
        user: this.userObject,
      },
    });
    profileModal.present();
  }
  
}
