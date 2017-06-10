import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { ProblemService } from '../services/problem.service';
import { Router,ActivatedRoute } from '@angular/router';


@Injectable()
export class ProblemGuard implements CanActivate {
  constructor(
    private problemService:ProblemService,
    private router:Router,
    private route : ActivatedRoute,

  ){ }
  canActivate( route: ActivatedRouteSnapshot ){
    var name;
    name = route.params['name'];
    if (this.problemService.isProblem( name ) )
    {
      return true;
    }
    else {
      this.router.navigate(['/404']);
      return false;
    }
  }
}
