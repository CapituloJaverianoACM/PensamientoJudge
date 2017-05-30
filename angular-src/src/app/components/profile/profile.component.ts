import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { UsersService } from '../../services/users.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  private user : any;

  private isEditEnable: boolean;

  constructor(
    private authService : AuthService,
    private usersService : UsersService,
    private router:Router
  ) { }

  ngOnInit() {
    this.isEditEnable = false;
    this.authService.getProfile().subscribe(profile => {
      this.user = profile.user;
    }, err => {
      console.log(err);
      return false;
    });
  }
  onClickLogOut(){
    this.authService.logout();
    this.router.navigate(['/']);
  }
  onClickSubmissions(){
    this.router.navigate(['/submissions/user/'+this.user.username]);
  }

  editProfileOnClick() {
    this.isEditEnable = true;
  }
  doneEditOnClick() {
    this.isEditEnable = false;
    this.usersService.editUser(this.user).subscribe(data => {
      // console.log(data);
    });
    this.authService.getProfile().subscribe(profile => {
      this.user = profile.user;
    }, err => {
      console.log(err);
      return false;
    });

  }
}
