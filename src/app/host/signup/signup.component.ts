import {Component, OnInit} from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ValidationErrors,
  AbstractControl,
} from '@angular/forms';
import {UserService} from '@app/shared/services/user/user.service';
import {WebSocketService} from '@app/shared/services/webSocket/web-socket.service';
import {Router} from '@angular/router';
import {GameService} from '@app/shared/services';

import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  user: any = {};

  userForm = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required,
      Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
    country: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    occupation: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.minLength(6)]),
    confirmPassword: new FormControl('', [Validators.required, this.passwordMatcher.bind(this)])
  });

  constructor(private router: Router, private userService: UserService, private ws: WebSocketService, private toast: ToastrService) {

  }

  ngOnInit(): void {
  }

  addUser(): void {

    this.user.firstName = this.userForm.value.firstName;
    this.user.lastName = this.userForm.value.lastName;
    this.user.email = this.userForm.value.email;
    this.user.country = this.userForm.value.country;
    this.user.city = this.userForm.value.city;
    this.user.occupation = this.userForm.value.occupation;
    this.user.password = this.userForm.value.password;
    this.user.type = 'host';
    this.userService.addUser(this.user).subscribe((message) => {
      if (message.message == 'you are registered') {
        this.toast.success('you are registered successfully', 'Sign Up', {
          titleClass: 'center',
          messageClass: 'center'
        });
        this.router.navigate(['']);

      } else {
        this.toast.error(message.message, 'Sign Up Error!', {
          titleClass: 'center',
          messageClass: 'center'
        });
        this.router.navigate(['hostsignup']);
        this.userForm.reset();
      }
    });
  }
  private passwordMatcher(control: FormControl): { [p: string]: boolean } | null {
    if (
      this.userForm &&
      (control.value !== this.userForm.controls.password.value)
    ) {
      return { passwordNotMatch: true };
    }
    return null;
  }

}
