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

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {


  userForm = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    country: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    occupation: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    type: new FormControl('', [Validators.required]),
  });

  constructor(private router: Router, private userService: UserService, private ws: WebSocketService) {

  }

  ngOnInit(): void {
  }

  addUser(): void {
    let firstName;
    let lastName;
    let email;
    let country;
    let city;
    let occupation;
    let password;
    let type;

    firstName = this.userForm.value.firstName;
    lastName = this.userForm.value.lastName;
    email = this.userForm.value.email;
    country = this.userForm.value.country;
    city = this.userForm.value.city;
    occupation = this.userForm.value.occupation;
    password = this.userForm.value.password;
    type = this.userForm.value.type;
    this.userService.addUser({firstName, lastName, email, country, city, occupation, password, type}).subscribe((user) => {
      console.log(user.message);
      this.router.navigate(['']);
    });
  }
}
