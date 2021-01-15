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
  name: any;
  userName: any;

  constructor(private router: Router, private userService: UserService, private ws: WebSocketService) {
  }

  ngOnInit(): void {
    const user = JSON.parse(<string>localStorage.getItem('user'));
    this.userService.getProfile(user.userId).subscribe((data) => {
      this.name = data.firstName;
      this.userName = data.lastName;
    });
  }

  updateProfile() {
    this.router.navigate(['hostupdateprofile']);
  }

  addGame() {
    this.router.navigate(['gamesettings']);
  }

  logout() {
    localStorage.removeItem('user');
    this.router.navigate([''], {});
  }
}
