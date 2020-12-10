import {Component, OnInit} from '@angular/core';
import {WebSocketService} from '@app/shared/services/webSocket/web-socket.service';
import { Router } from '@angular/router';
import {GameService} from '@app/shared/services';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private router: Router, private gameService: GameService, private ws: WebSocketService) {  }

  ngOnInit() {
  }

  setMeUpAs(host: string) {
    if (host === 'host') {
        this.router.navigate(['/gamedashboard']);
    } else{
    this.router.navigate(['/player']);
    }
  }
}
