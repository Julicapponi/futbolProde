import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {NAVIGATE_LOGIN} from "../logueo/logueo.page";

@Component({
  selector: 'app-reset-pass',
  templateUrl: './reset-pass.page.html',
  styleUrls: ['./reset-pass.page.scss'],
})
export class ResetPassPage implements OnInit {

  user = {
    email: ''
  };
  constructor(private router: Router) { }

  ngOnInit() {}

  resetearPass(){
  }

  volver(){
    this.router.navigate([NAVIGATE_LOGIN]);
  }

}
