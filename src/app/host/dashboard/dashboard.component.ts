import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {UserService} from '@app/shared/services/user/user.service';
import {WebSocketService} from '@app/shared/services';
import {ToastrService} from 'ngx-toastr';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  name: any;
  userName: any;
  user: any;

  constructor(private router: Router, private userService: UserService, private ws: WebSocketService, private toast: ToastrService) {
  }

  ngOnInit(): void {
    this.user = JSON.parse(<string>localStorage.getItem('user'));
    this.userService.getProfile(this.user.userId).subscribe((data) => {
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
    this.userService.logout(this.user.userId).subscribe((message) => {
      this.toast.success(message.message, 'logOut', {
        titleClass: 'center',
        messageClass: 'center'
      });
      localStorage.removeItem('user');
      this.router.navigate([''], {});
    });
  }
}
