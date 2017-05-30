import { Injectable } from '@angular/core';
import { Http , Headers } from '@angular/http';
import {EndPointService} from './end-point.service';
import { AuthService } from './auth.service';

@Injectable()
export class UsersService {

  constructor(
    private http : Http,
    private endPoint :  EndPointService,
    private authService : AuthService
  ) { }

  getAllUsers() {
    let headers = new Headers();
    headers.append('Contet-Type','application/json');
    let ep = this.endPoint.prepEndPoint('usersAPI/');
    return this.http.get(ep,{headers:headers})
      .map( res => res.json() );
  }

  getUserByEmail( email ) {
    let headers = new Headers();
    headers.append('Contet-Type','application/json');
    let ep = this.endPoint.prepEndPoint('usersAPI/' + email);
    return this.http.get(ep,{headers:headers})
      .map( res => res.json() );
  }

  editUser(newUser) {
    this.authService.loadToken();
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    headers.append('x-access-token',this.authService.authToken);
    let ep = this.endPoint.prepEndPoint('usersAPI/byEmail/' + newUser.email);
    return this.http.put(ep, JSON.stringify(newUser),{headers:headers})
      .map( res => res.json() );
  }

}