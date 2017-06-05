import { Component, OnInit } from '@angular/core';

import { ValidateService } from '../../services/validate.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { AuthService } from '../../services/auth.service';
import { UsersService } from '../../services/users.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password: string;

  private isEmailValid: boolean;
  private isUserTaken: boolean;
  private isEmailTaken: boolean;

  public barLabel: string = "Password strength:";
  private carreers =
  [
    "Ingenieria de Sistemas",
    "Ingenieria Civil",
    "Ingenieria Electrónica",
    "Ingenieria Industrial",
    "Matemáticas",
    "Otra"
  ];
  private selection = this.carreers[0];
  career = this.carreers[0];

  constructor(
    private validateService : ValidateService ,
    private flashMesssagesService : FlashMessagesService,
    private authService : AuthService,
    private router : Router,
    private UsersService: UsersService
  ) { }

  ngOnInit() {
    this.isUserTaken = false;
    this.isEmailValid = true;
    this.isEmailTaken = false;
  }
  onSignUpSubmit()
  {
    const user = {
      first_name : this.first_name,
      last_name : this.last_name,
      username : this.username,
      email : this.email,
      career : this.career,
      password : this.password
    }
    if( !this.validateService.validateEmail(user.email) ){
      this.isEmailValid = false;
      return false;
    }
    this.UsersService.getUserByEmail(this.email).subscribe(data => {
      if(data) {
        this.isEmailTaken = true;
        return false;
      } else {
        this.isEmailTaken  = false;
      }
      this.authService.signUpUser(user).subscribe(data => {
        if(data.success) {
          this.authService.loginUser(user).subscribe(query =>{
            this.authService.storeUserData(query.token,query.user);
            this.router.navigate(['/profile']);
          });
        } else {
          this.isUserTaken = true;
          this.router.navigate(['/signup']);
        }
      });
    });
  }


}
