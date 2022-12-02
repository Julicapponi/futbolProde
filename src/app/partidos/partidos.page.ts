import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import { AuthService } from '../services/auth.service';
import { ResultsService } from '../services/results.service';

@Component({
  selector: 'app-partidos',
  templateUrl: './partidos.page.html',
  styleUrls: ['./partidos.page.scss'],
})
export class PartidosPage implements OnInit {
  isCargandoTorneo = true;
  constructor(private router: Router, private authService: AuthService, private resultService: ResultsService) { }

  ngOnInit() {
  }

  volver() {
    this.router.navigate(['/inicioPage']);
  }

  crearGrupo() {
    
  }
}
