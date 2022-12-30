import { Component } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(private router: Router) {
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
    setTimeout(async () => {
      this.router.navigate(['/logueoPage']);
    }, 1000);
  }
}
