import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { UsersService } from '../../services/users.service';
import { Router } from '@angular/router';
import { FileUploader } from 'ng2-file-upload';
import { EndPointService } from '../../services/end-point.service';



@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  private user : any;
  private isEditEnable: boolean;
  public uploader: FileUploader;


  public hasBaseDropZoneOver:boolean = false;
  public hasAnotherDropZoneOver:boolean = false;


  constructor(
    private authService : AuthService,
    private usersService : UsersService,
    private router:Router,
    private endPoint: EndPointService
  ) {
  }

  ngOnInit() {
    this.isEditEnable = false;
    this.authService.getProfile().subscribe(profile => {
      this.user = profile.user;
      this.uploader  = new FileUploader({url: this.endPoint.prepEndPoint('usersAPI/byEmail/' + this.user.email)});
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
  // test(){
  //     console.log(this.uploader);
  // }
}
