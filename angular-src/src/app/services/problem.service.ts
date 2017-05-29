import { Injectable } from '@angular/core';
import { Http , Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import {EndPointService} from './end-point.service';
import { AuthService } from './auth.service';


@Injectable()
export class ProblemService {

  constructor(
    private http : Http,
    private endPoint :  EndPointService,
    private authService : AuthService
  ) { }

  getAllProblems(){
    let headers = new Headers();
    headers.append('Contet-Type','application/json');
    let ep = this.endPoint.prepEndPoint('problemAPI/');
    return this.http.get(ep,{headers:headers})
      .map( res => res.json() );
  }
  getProblem( name ){
    let headers = new Headers();
    headers.append('Contet-Type','application/json');
    let ep = this.endPoint.prepEndPoint('problemAPI/'+name);
    return this.http.get(ep,{headers:headers})
      .map( res => res.json() );
  }
  getProblemByCorte( corte ) {
    let headers = new Headers();
    headers.append('Contet-Type','application/json');
    let ep = this.endPoint.prepEndPoint('problemAPI/corte/'+corte);
    return this.http.get(ep,{headers:headers})
      .map( res => res.json() );
  }
  submitSubmission( submission ){
    console.log(submission);
    this.authService.loadToken();
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    headers.append('x-access-token',this.authService.authToken);
    let ep = this.endPoint.prepEndPoint('submissionAPI/submit');
    return this.http.post(ep,submission,{headers:headers})
      .map( res => res.json() );
  }
  getSubmissionsUser( problemName ){
    this.authService.loadToken();
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    headers.append('x-access-token',this.authService.authToken);
    let ep = this.endPoint.prepEndPoint('submissionAPI/'+problemName );
    return this.http.get(ep,{headers:headers})
      .map( res => res.json() );
  }
}
