import {Component, OnInit} from '@angular/core';
import {WebSocketService} from '@app/shared/services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private router: Router, private ws: WebSocketService) {

  }

  ngOnInit() {
  }



  setMeUpAs(host: string) {
    if (host === 'host') {
    this.router.navigate(['/host']);
    } else{
    this.router.navigate(['/player']);
    }
  }
}
