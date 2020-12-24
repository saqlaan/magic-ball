import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {UserService} from '@app/shared/services/user/user.service';
import {WebSocketService} from '@app/shared/services';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-loginhelp',
  templateUrl: './loginhelp.component.html',
  styleUrls: ['./loginhelp.component.css']
})
export class LoginhelpComponent implements OnInit {
  loginHelpForm = new FormGroup({
    email: new FormControl('', [Validators.required,
      Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
  });

  constructor(private router: Router, private userService: UserService, private ws: WebSocketService) {
  }

  ngOnInit(): void {
  }

  forgotPassword() {
    this.userService.forgotPassword(this.loginHelpForm.value.email).subscribe((token) => {
      if (token) {
        console.log(token.resetToken);
        localStorage.setItem('resetToken', token.resetToken);
        this.router.navigate(['/successmessage']);
      } else {
        
      }
    });
  }

  login() {
    this.router.navigate(['/loginhelp']);
  }
}
