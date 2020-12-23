import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {UserService} from '@app/shared/services/user/user.service';
import {WebSocketService} from '@app/shared/services';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private router: Router, private userService: UserService, private ws: WebSocketService) {
  }

  ngOnInit(): void {
  }

  updateProfile() {
    this.router.navigate(['hostupdateprofile']);
  }

  addGame() {
    this.router.navigate(['gamesettings']);
  }
}
