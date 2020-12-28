import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {UserService} from '@app/shared/services/user/user.service';
import {WebSocketService} from '@app/shared/services';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-updatepassword',
  templateUrl: './updatepassword.component.html',
  styleUrls: ['./updatepassword.component.css']
})
export class UpdatepasswordComponent implements OnInit {
  user: any = {};
  updatePasswordForm = new FormGroup({
    currentPassword: new FormControl('', [Validators.minLength(6)]),
    newPassword: new FormControl('', [Validators.minLength(6)]),
    confirmPassword: new FormControl('', [Validators.required, this.passwordMatcher.bind(this)]),
  });

  constructor(private router: Router, private userService: UserService, private ws: WebSocketService, private toast: ToastrService) {
  }

  ngOnInit(): void {

  }

  updatePassword() {

    this.user.newPassword = this.updatePasswordForm.value.newPassword;
    this.user.oldPassword = this.updatePasswordForm.value.currentPassword;
    this.userService.updatePassword(this.user).subscribe((message) => {
      this.updatePasswordForm.reset();
        this.toast.success(message.message, 'Toastr fun!',  {
          titleClass: "center",
          messageClass: "center"
        });
      localStorage.setItem('message', message.message);
      this.router.navigate(['/updatepassword']);
    });
  }

  private passwordMatcher(control: FormControl): { [p: string]: boolean } | null {
    if (
      this.updatePasswordForm &&
      (control.value !== this.updatePasswordForm.controls.newPassword.value)
    ) {
      return {passwordNotMatch: true};
    }
    return null;
  }

  logout() {
    localStorage.removeItem('user');
    this.router.navigate([''], {});
  }

}
