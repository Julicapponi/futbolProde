import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {MenuController} from "@ionic/angular";

@Component({
  selector: 'app-terminos',
  templateUrl: './terminos.component.html',
  styleUrls: ['./terminos.component.css'],
})
export class TerminosComponent implements OnInit {

  constructor(private menuCtrl: MenuController, private router: Router) { }

  ngOnInit() {

  }

  volver() {
    this.menuCtrl.enable(false);
    this.router.navigate(['/inicioPage']);
  }
}
