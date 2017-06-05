import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { UsersService } from '../../services/users.service';
import { Router } from '@angular/router';
import { FileUploader } from 'ng2-file-upload';
import { EndPointService } from '../../services/end-point.service';
import { ImageViewDirective } from '../../directives/image-view.directive';



@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  private user : any;
  private isEditEnable: boolean;
  public uploader: FileUploader;
  private profilePicture: string;
  public hasBaseDropZoneOver:boolean = false;
  public hasAnotherDropZoneOver:boolean = false;

  private carreers =
  [
    "Ingenieria de Sistemas",
    "Ingenieria Civil",
    "Ingenieria Electrónica",
    "Ingenieria Industrial",
    "Matemáticas",
    "Otra"
  ];

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
    this.profilePicture = this.usersService.getProfilePicture((this.user.img && this.user.img.split('/')[1])  || 'dummy.jpg');
    }, err => {
      console.log(err);
      return false;
    });
  }

  editProfileOnClick() {
    this.isEditEnable = true;
  }
  doneEditOnClick() {
    this.isEditEnable = false;
    this.usersService.editUser(this.user).subscribe(data => {
    });
    this.authService.getProfile().subscribe(profile => {
      this.user = profile.user;
    }, err => {
      console.log(err);
      return false;
    });
  }

  selectImageOnClick() {
    this.uploader.queue.pop();
    this.profilePicture = this.usersService.getProfilePicture((this.user.img && this.user.img.split('/')[1]) || 'dummy.jpg');
  }

  cancelOnClick() {
    this.uploader.queue.pop();
    this.profilePicture = this.usersService.getProfilePicture((this.user.img && this.user.img.split('/')[1])  || 'dummy.jpg');
  }

  uploadOnClick() {
    this.profilePicture = this.usersService.getProfilePicture((this.user.img && this.user.img.split('/')[1])  || 'dummy.jpg');
  }
}
