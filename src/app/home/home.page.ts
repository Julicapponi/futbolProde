import { Component } from '@angular/core';
import {Router} from '@angular/router';
import {MenuController} from "@ionic/angular";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor( private menuCtrl: MenuController, private router: Router) {
    this.menuCtrl.enable(false);
    setTimeout(async () => {
      this.router.navigate(['/logueoPage']);
    }, 1000);
  }

  ngOnInit(){
    setTimeout(async () => {
      this.router.navigate(['/logueoPage']);
    }, 1000);
  }
  
  ionViewDidEnter(){
    this.menuCtrl.enable(false);
    setTimeout(async () => {
      this.router.navigate(['/logueoPage']);
    }, 1000);
  }
}
