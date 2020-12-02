import {Component, OnInit} from '@angular/core';
import {WebSocketService} from '@app/shared/services';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private ws: WebSocketService) {

  }

  ngOnInit() {
  }

  clickMe() {
  }

  setMeUpAs(host: string) {
    this.ws.init(host);
  }
}
