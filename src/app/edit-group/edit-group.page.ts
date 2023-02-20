import { Component, OnInit } from '@angular/core';
import {ModalController} from "@ionic/angular";
import {Router} from "@angular/router";
import {AuthService} from "../services/auth.service";
import {GruposService} from "../services/grupos.service";

@Component({
  selector: 'app-edit-group',
  templateUrl: './edit-group.page.html',
  styleUrls: ['./edit-group.page.css'],
})
export class EditGroupPage implements OnInit {

  constructor(private modalCtrl: ModalController, private router: Router, private authService: AuthService, private gruposService: GruposService) { }

  ngOnInit() {
  }

  volver() {
    this.router.navigate(['/partidosPage']);
  }

  editGroup() {
    
  }
}
