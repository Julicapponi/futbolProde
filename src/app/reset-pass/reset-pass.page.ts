import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

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
    this.router.navigate(['/login']);
  }

}
