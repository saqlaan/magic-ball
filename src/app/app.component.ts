import {Component, OnInit} from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

import { merge, Observable } from 'rxjs';

import { User } from './shared/interfaces';
import { AuthService } from './shared/services';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {


   ws = '';
  newTaskForm = new FormGroup({
    text: new FormControl(''),
    message: new FormControl(''),

  });
  // user$: Observable<User | null> = merge(
  //   // Init on startup
  //   this.authService.me(),
  //   // Update after login/register/logout
  //   this.authService.getUser()
  // );

  constructor(
    private domSanitizer: DomSanitizer,
    private matIconRegistry: MatIconRegistry,
    private authService: AuthService,
  ) {
    this.registerSvgIcons();
  }




  registerSvgIcons() {
    [
      'close',
      'add',
      'add-blue',
      'airplane-front-view',
      'air-station',
      'balloon',
      'boat',
      'cargo-ship',
      'car',
      'catamaran',
      'clone',
      'convertible',
      'delete',
      'drone',
      'fighter-plane',
      'fire-truck',
      'horseback-riding',
      'motorcycle',
      'railcar',
      'railroad-train',
      'rocket-boot',
      'sailing-boat',
      'segway',
      'shuttle',
      'space-shuttle',
      'steam-engine',
      'suv',
      'tour-bus',
      'tow-truck',
      'transportation',
      'trolleybus',
      'water-transportation',
    ].forEach(icon => {
      this.matIconRegistry.addSvgIcon(
        icon,
        this.domSanitizer.bypassSecurityTrustResourceUrl(`assets/icons/${icon}.svg`)
      );
    });
  }
  // showMessage(message) {
  //   this.newTaskForm.value.message += `\n\n${message}`;
  //   this.newTaskForm.value.text ;
  // }
  // showMessage(message: string) {
  //   this.newTaskForm.value.text = '';
  // }
  //
  // click(): void {
  //   this.newTaskForm.value.message += this.newTaskForm.value.text);
  //   alert(this.newTaskForm.value.text );
  // }
}

