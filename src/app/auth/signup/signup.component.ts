import {Component, OnInit} from '@angular/core';
import {AuthService} from '@app/shared/services';
import {
  FormGroup,
  FormControl,
  Validators,
  ValidationErrors,
  AbstractControl,
} from '@angular/forms';
import {Router} from '@angular/router';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
})
export class SignupComponent implements OnInit {


  userForm = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
  });
  constructor( private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
  }


  signup(): void {
    const firstName = this.userForm.value.firstName;
    const lastName = this.userForm.value.lastName;
    this.authService.signup(firstName, lastName).subscribe(() => {
    });
  }
}
