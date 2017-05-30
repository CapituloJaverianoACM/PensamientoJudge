import { Injectable } from '@angular/core';
import {Http, Headers} from "@angular/http";
import 'rxjs/add/operator/map';
import {tokenNotExpired} from 'angular2-jwt';
import {EndPointService} from './end-point.service';

@Injectable()
export class AuthService {
  authToken : any;
  user : any;
  private loggedInStatus = false;

  constructor(
    private http : Http,
    private endPoint : EndPointService
  ) { this.loggedInStatus = !!localStorage.getItem('id_token');}

  signUpUser( user ){
    let headers = new Headers();
    headers.append('Contet-Type','appication/json');
    let ep = this.endPoint.prepEndPoint('usersAPI/signup');
    return this.http.post(ep,user,{headers:headers})
      .map(res => res.json() );
  }
  loginUser( user ){
    let headers = new Headers();
    headers.append('Contet-Type','appication/json');
    let ep = this.endPoint.prepEndPoint('usersAPI/login');
    return this.http.post(ep,user,{headers:headers})
      .map(res => res.json() ) ;
  }
  getProfile(){
    let headers = new Headers();
    this.loadToken();
    headers.append('x-access-token',this.authToken);
    headers.append('Contet-Type','application/json');
    let ep = this.endPoint.prepEndPoint('usersAPI/profile');
    return this.http.get(ep,{headers:headers})
      .map( res => res.json() );
  }
  storeUserData(token,user){
    localStorage.setItem('id_token',token);
    localStorage.setItem('user',JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }
  loadToken(){
    const token = localStorage.getItem('id_token');
    this.authToken = token;
  }
  loadUser(){
    this.user = JSON.parse(localStorage.getItem('user'));
  }
  loggedIn(){
    return tokenNotExpired('id_token');
  }
  logout(){
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }

  isLoggedIn() {
    return !!localStorage.getItem('id_token');
  }

  isLoggedInAsAdmin() {
    this.loadUser();
    return this.user && this.user.is_admin;
  }

  isUser( _username ){
    if( !this.user )
      return false;
    return this.user.username == _username;
  }
}
