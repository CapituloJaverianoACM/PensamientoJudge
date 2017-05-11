import  { Component } from '@angular/core';

import { Login } from './login';

@Component({
  selector: 'login-form',
  templateUrl: './login.component.html'
})
export class LoginComponent{

  model = new Login('test','***');

  submitted = false;
  un = '';
  pas = '';
  onSubmit() { this.submitted = true ;}
  get diagnostic(){ return JSON.stringify(this.model ) ;}
  login(_username:string,_password:string){
    

  }
}
