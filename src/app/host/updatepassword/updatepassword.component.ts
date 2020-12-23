import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {UserService} from '@app/shared/services/user/user.service';
import {WebSocketService} from '@app/shared/services';

@Component({
  selector: 'app-updatepassword',
  templateUrl: './updatepassword.component.html',
  styleUrls: ['./updatepassword.component.css']
})
export class UpdatepasswordComponent implements OnInit {
  user: any = {};
  updatePasswordForm = new FormGroup({
    currentPassword: new FormControl('', [Validators.required]),
    newPassword: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required]),
  });

  constructor(private router: Router, private userService: UserService, private ws: WebSocketService) {
  }

  ngOnInit(): void {
    // this.updatePassword();
  }

  updatePassword() {

    this.user.password = '123456';
    this.userService.updatePassword(this.user).subscribe((message) => {
      localStorage.setItem('message', message.message);
      this.router.navigate(['/hostlogin']);
    });
  }

}
