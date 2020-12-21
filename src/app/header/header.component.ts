import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';



@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  // @Input() user: User | null = null;

  constructor(private router: Router) {}

  logout(): void {
    this.router.navigateByUrl('/auth/login');
  }
}
