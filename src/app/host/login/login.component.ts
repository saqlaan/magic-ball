import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {UserService} from '@app/shared/services/user/user.service';
import {WebSocketService} from '@app/shared/services';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user: any = {};
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required,
      Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
    password: new FormControl('', [Validators.required]),
  });


  constructor(private router: Router, private userService: UserService, private ws: WebSocketService) {
  }

  ngOnInit(): void {
  }

  loginUser() {
    this.user.email = this.loginForm.value.email;
    this.user.password = this.loginForm.value.password;

    this.userService.loginUser(this.user).subscribe((Token) => {
      const user = {
        'userToken': Token.token,
        'userId': Token._id
      };
      localStorage.setItem('user', JSON.stringify(user));
      this.router.navigate(['hostdashboard']);
    });
  }

  loginHelp() {
    this.router.navigate(['hostloginhelp']);
  }

}
