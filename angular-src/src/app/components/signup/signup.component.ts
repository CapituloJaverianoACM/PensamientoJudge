import { Component, OnInit } from '@angular/core';

import { ValidateService } from '../../services/validate.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { AuthService } from '../../services/auth.service';
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
  career: string;
  password: string;
  constructor(
    private validateService : ValidateService ,
    private flashMesssagesService : FlashMessagesService,
    private authService : AuthService,
    private router : Router
  ) { }

  ngOnInit() {
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
      this.flashMesssagesService.show("Insert valid email",{
        cssClass : 'alert-danger',
        timeout : 3000
      });
      return false;
    }
    this.authService.signUpUser(user).subscribe(data => {
      if(data.success){
        this.flashMesssagesService.show('Tou are now registered and can log in',{
          cssClass : 'alert-success',
          timeout: 3000
        });
        this.router.navigate(['/profile']);
      }
      else{
        // this.flashMesssagesService.show('Something went wrong',{
        this.flashMesssagesService.show(data.err.message,{
          cssClass: 'alert-danger',
          timeout : 3000
        });
        this.router.navigate(['/signup']);

      }
    });
  }
}
