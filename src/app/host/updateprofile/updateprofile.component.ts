import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {UserService} from '@app/shared/services/user/user.service';
import {WebSocketService} from '@app/shared/services';


@Component({
  selector: 'app-updateprofile',
  templateUrl: './updateprofile.component.html',
  styleUrls: ['./updateprofile.component.css']
})
export class UpdateprofileComponent implements OnInit {

  user: any = {};
  updateUserForm = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    country: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    occupation: new FormControl('', [Validators.required]),
  });

  constructor(private router: Router, private userService: UserService, private ws: WebSocketService) {
  }


  ngOnInit(): void {
  }

  updateUser() {

    this.user.firstName = this.updateUserForm.value.firstName;
    this.user.lastName = this.updateUserForm.value.lastName;
    this.user.country = this.updateUserForm.value.country;
    this.user.city = this.updateUserForm.value.city;
    this.user.occupation = this.updateUserForm.value.occupation;
    this.userService.updateUser(this.user).subscribe((message) => {
      localStorage.setItem('message', message.message);
      this.router.navigate(['']);
    });
  }
}
