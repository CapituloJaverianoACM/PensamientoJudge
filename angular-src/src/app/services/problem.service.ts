import { Injectable } from '@angular/core';
import { Http , Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/Rx' ;
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
    this.authService.loadToken();
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    headers.append('x-access-token',this.authService.authToken);
    let ep = this.endPoint.prepEndPoint('problemAPI/');
    return this.http.get(ep,{headers:headers})
      .map( res => res.json() );
  }
  getProblem( name ){
    this.authService.loadToken();
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    headers.append('x-access-token',this.authService.authToken);
    let ep = this.endPoint.prepEndPoint('problemAPI/'+name);
    return this.http.get(ep,{headers:headers})
      .map( res => res.json() );
  }
  getProblemByCorte( corte ) {
    this.authService.loadToken();
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    headers.append('x-access-token',this.authService.authToken);
    let ep = this.endPoint.prepEndPoint('problemAPI/corte/'+corte);
    return this.http.get(ep,{headers:headers})
      .map( res => res.json() );
  }
  submitSubmission( submission ){
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
    let ep = this.endPoint.prepEndPoint('submissionAPI/userProblem/'+problemName );
    return this.http.get(ep,{headers:headers})
      .map( res => res.json() );
  }
  getAllSubmissionsMyUser(){
    this.authService.loadToken();
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    headers.append('x-access-token',this.authService.authToken);
    let ep = this.endPoint.prepEndPoint('submissionAPI/user/'+this.authService.user.username );
    return this.http.get(ep,{headers:headers})
    .map( res => res.json() );
  }
  getAllSubmissionsUser(username){
    this.authService.loadToken();
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    headers.append('x-access-token',this.authService.authToken);
    let ep = this.endPoint.prepEndPoint('submissionAPI/user/'+username );
    return this.http.get(ep,{headers:headers})
      .map( res => res.json() );
  }
  getAllSubmissionsProblem(problemName){
    this.authService.loadToken();
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    headers.append('x-access-token',this.authService.authToken);
    let ep = this.endPoint.prepEndPoint('submissionAPI/problem/'+problemName );
    return this.http.get(ep,{headers:headers})
      .map( res => res.json() );
  }
  getAllSubmissions(){
    this.authService.loadToken();
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    headers.append('x-access-token',this.authService.authToken);
    let ep = this.endPoint.prepEndPoint('submissionAPI/');
    return this.http.get(ep,{headers:headers})
      .map( res => res.json() );
  }
  getCode( id ){
    this.authService.loadToken();
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    headers.append('x-access-token',this.authService.authToken);
    let ep = this.endPoint.prepEndPoint('submissionAPI/code/'+id);
    return this.http.get(ep,{headers:headers})
    .map( res => res.json() );
  }

  updateProblem(problem) {
    this.authService.loadToken();
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    headers.append('x-access-token',this.authService.authToken);
    let ep = this.endPoint.prepEndPoint('problemAPI/'+problem.name);
    return this.http.put(ep, JSON.stringify(problem),{headers: headers})
      .map(res => res.json());
  }
  deleteProblem( problem ){
    this.authService.loadToken();
      let headers = new Headers();
      headers.append('Content-Type','application/json');
      headers.append('x-access-token',this.authService.authToken);
      let ep = this.endPoint.prepEndPoint('submissionAPI/idProblem/' + problem._id);
       this.http.delete(ep,{headers:headers})
        .map( res => res.json() ).subscribe(data=>{});

       ep = this.endPoint.prepEndPoint('problemAPI/'+problem.name);

      return this.http.delete(ep,{headers:headers})
        .map( res => res.json() );
  }

  createProblem(problem) {
    this.authService.loadToken();
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    headers.append('x-access-token',this.authService.authToken);
    let ep = this.endPoint.prepEndPoint('problemAPI/');
    console.log("Ok Til Helo");
    // console.log(JSON.stringify(problem));
    return this.http.post(ep, problem,{headers: headers})
      .map(res => res.json());
  }
  getTetsCasesInput( problem ){
    this.authService.loadToken();
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    headers.append('x-access-token',this.authService.authToken);
    let ep = this.endPoint.prepEndPoint('problemAPI/testCases/input/'+problem._id);
    return this.http.get(ep,{headers: headers})
    .map(res => res.json());
  }
  deleteTestCasesInput(problem,nameItemDelete){
    this.authService.loadToken();
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    headers.append('x-access-token',this.authService.authToken);
    let ep = this.endPoint.prepEndPoint('problemAPI/testCases/input/'+problem._id+'/'+nameItemDelete);
    return this.http.delete(ep,{headers: headers})
      .map(res => res.json());

  }
  getTetsCasesOutput( problem ){
    this.authService.loadToken();
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    headers.append('x-access-token',this.authService.authToken);
    let ep = this.endPoint.prepEndPoint('problemAPI/testCases/output/'+problem._id);
    return this.http.get(ep,{headers: headers})
    .map(res => res.json());
  }
  deleteTestCasesOutput(problem,nameItemDelete){
    this.authService.loadToken();
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    headers.append('x-access-token',this.authService.authToken);
    let ep = this.endPoint.prepEndPoint('problemAPI/testCases/output/'+problem._id+'/'+nameItemDelete);
    return this.http.delete(ep,{headers: headers})
      .map(res => res.json());

  }

  dowloadFile( problem , nameFile , type ) {
    this.authService.loadToken();
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    headers.append('x-access-token',this.authService.authToken);
    let ep = this.endPoint.prepEndPoint('problemAPI/testCases/'+type+'/'+problem._id+'/'+nameFile);
    return this.http.get(ep,{headers: headers});
  }

  getProblemSuccessRate(problemId) {
    this.authService.loadToken();
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    headers.append('x-access-token',this.authService.authToken);
    let ep = this.endPoint.prepEndPoint('submissionAPI/successRate/'+problemId);
    return this.http.get(ep,{headers: headers})
    .map(res => res.json());
  }
  getCodeProblemUser( problem )
  {
    this.authService.loadToken();
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    headers.append('x-access-token',this.authService.authToken);
    let ep = this.endPoint.prepEndPoint('problemAPI/getCode/'+problem._id);
    return this.http.get(ep,{headers: headers})
      .map(res => res.json());

  }
  createCodeProblemUser( problem , code )
  {
    this.authService.loadToken();
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    headers.append('x-access-token',this.authService.authToken);
    let ep = this.endPoint.prepEndPoint('problemAPI/getCode/'+problem._id);
    return this.http.post(ep,code,{headers: headers})
      .map(res => res.json());

  }
}
