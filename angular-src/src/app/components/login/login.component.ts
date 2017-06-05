import { Component, OnInit } from '@angular/core';

import { ValidateService } from '../../services/validate.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username : string;
  password : string;
  constructor(
    private validateService : ValidateService ,
    private flashMesssagesService : FlashMessagesService,
    private authService : AuthService,
    private router : Router
    ) { }

  ngOnInit() {
  }

  onLoginSubmit(){
    const user = {
      username : this.username,
      password : this.password

    };
    if( !this.validateService.validateLogin(user) )
    {
      this.flashMesssagesService.show("Fill in all fields", {sccClass: 'alert-danger' , timeout : 300});
      return false;
    }
    this.authService.loginUser(user).subscribe(data =>{
      if(data.success){
        this.authService.storeUserData(data.token,data.user);
        this.flashMesssagesService.show('Welcome To The Gym',{
          cssClass: 'alert-success',
          timeout: 1000
        });
        this.router.navigate(['profile']);
      }
      else{
        this.flashMesssagesService.show(data.err.message,{
          cssClass : 'alert-danger',
          timeout : 1000
        });
        this.router.navigate(['login']);
      }
    });
  }
}
