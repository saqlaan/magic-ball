import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {UserService} from '@app/shared/services/user/user.service';
import {WebSocketService} from '@app/shared/services';
import {ToastrService} from 'ngx-toastr';

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
    password: new FormControl('', [Validators.minLength(6)]),
  });


  constructor(private router: Router, private userService: UserService, private ws: WebSocketService, private toast: ToastrService) {
  }

  ngOnInit(): void {
  }

  loginUser() {
    this.user.email = this.loginForm.value.email;
    this.user.password = this.loginForm.value.password;

    this.userService.loginUser(this.user).subscribe((User) => {

      const user = {
        'userToken': User.token,
        'userId': User._id
      };
      localStorage.setItem('user', JSON.stringify(user));
      this.toast.success('you are logged in successfully', 'Login', {
        titleClass: 'center',
        messageClass: 'center'
      });
      this.ws.init(User._id);
      this.router.navigate(['hostdashboard']);
    }, error => {
      console.log(error.error)
      this.toast.error(error.error.message, 'Login!', {
        titleClass: 'center',
        messageClass: 'center'
      });
    });
  }

  loginHelp() {
    this.router.navigate(['hostloginhelp']);
  }

}
