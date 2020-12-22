import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {UserService} from '@app/shared/services/user/user.service';
import {WebSocketService} from '@app/shared/services';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.css']
})
export class ResetpasswordComponent implements OnInit {

  resetToken!: string;
  resetPasswordForm = new FormGroup({
    newPassword: new FormControl('', Validators.required),
    confirmPassword: new FormControl('', Validators.required)
  });

  constructor(private router: Router, private userService: UserService, private ws: WebSocketService) {
  }

  ngOnInit(): void {
    console.log(localStorage.getItem('resetToken') + 'kop');
  }


  resetPassword() {

    this.resetToken = localStorage.getItem('resetToken');
    console.log(this.resetToken);
    const password = this.resetPasswordForm.value.newPassword;
    this.userService.resetPassword(password, this.resetToken).subscribe((token) => {
      console.log(token.message);
      this.router.navigate(['']);
    });
  }

}
