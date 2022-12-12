import { Component, OnInit } from '@angular/core';
import {GruposService} from "../services/grupos.service";
import {ModalController, ToastController} from "@ionic/angular";
import {Grupo} from "../class/Grupo";
import {Router} from "@angular/router";

@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.page.html',
  styleUrls: ['./create-group.page.css'],
})
export class CreateGroupPage implements OnInit {
  group: Grupo = {
    idGrupo: null,
    nameGrupo: "",
    idUserCreador: ""
  };
  
  constructor(private toast: ToastController, private router: Router, private gruposService: GruposService, private modalCrontroller: ModalController) {
  
  }

  ngOnInit(): void {
  }

  async volver() {
    //await this.modalCrontroller.dismiss();
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      this.router.navigate(['/partidosPage']);
    });
  }

  async createGrupo(grupo) {
    this.group = grupo
    console.log(this.group);
    this.gruposService.createGroup(this.group).subscribe(
        res => {
          this.showToastMessage('Grupo creado con exito!!', "success");
          console.log(res);
        }),
        err => {
          this.showToastMessage('Error al crear grupo, reintente más tarde', "danger");;
        };
  }

  async showToastMessage(message:string, color: string) {
    const toast = await this.toast.create({
      message: message,
      duration: 4000,
      icon: 'checkmark', //https://ionic.io/ionicons
      cssClass: '',
      position: "bottom",
      translucent: true,
      animated: true,
      mode: "md",  // md or ios
      color: color //"danger" ｜ "dark" ｜ "light" ｜ "medium" ｜ "primary" ｜ "secondary" ｜ "success" ｜ "tertiary" ｜ "warning" ｜ string & Record<never, never> ｜ undefined
    });
    await toast.present();
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      this.router.navigate(['/partidosPage']);
    });
  }
}
