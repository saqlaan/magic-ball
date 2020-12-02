import { Component, OnInit } from '@angular/core';
import { AuthService } from '@app/shared/services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  constructor( private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
  }
  game(): void{
    this.authService.game().subscribe((game) => {
      this.router.navigate(['']);
    });
  }

}
