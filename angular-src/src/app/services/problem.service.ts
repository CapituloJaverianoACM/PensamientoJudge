import { Injectable } from '@angular/core';
import { Http , Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import {EndPointService} from './end-point.service';


@Injectable()
export class ProblemService {

  constructor(
    private http : Http,
    private endPoint :  EndPointService
  ) { }

  getProblem( name ){
    let headers = new Headers();
    headers.append('Contet-Type','application/json');
    let ep = this.endPoint.prepEndPoint('problemAPI/'+name);
    return this.http.get(ep,{headers:headers})
      .map( res => res.json() );
  }
  submitSubmission( submission ){
    console.log(submission);
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    let ep = this.endPoint.prepEndPoint('submissionAPI/submit');
    return this.http.post(ep,submission,{headers:headers})
      .map( res => res.json() );
  }
}
