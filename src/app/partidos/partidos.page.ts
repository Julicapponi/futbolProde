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

  constructor(private router: Router, private authService: AuthService, private resultService: ResultsService) { }

  ngOnInit() {
  }

  getMatchs(){
    this.resultService.getMatchs().subscribe(
      res => {
        console.log(res);
      },
      err => console.log(err)
    );
  }

}
