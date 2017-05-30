import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  loggedIn = false;

  constructor(
    private flashMesssagesService : FlashMessagesService,
    private authService : AuthService,
    private router : Router
  ) {
    this.loggedIn = this.authService.isLoggedIn();
  }

  ngOnInit() {
    // console.log(this.loggedIn);
    // console.log(this.authService.isLoggedIn());
    this.loggedIn = this.authService.isLoggedIn();
  }

  onLogoutClick() {
    this.authService.logout();
    this.flashMesssagesService.show("You are logged out", {
      cssClass:'alert-success',
      timeout: 3000
    });
    this.router.navigate(['/']);
    this.loggedIn = this.authService.isLoggedIn();
    return false;
  }

}
