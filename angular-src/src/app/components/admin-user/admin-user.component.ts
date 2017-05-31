import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-admin-user',
  templateUrl: './admin-user.component.html',
  styleUrls: ['./admin-user.component.css']
})
export class AdminUserComponent implements OnInit {
  userArr : any;

  constructor(
    private usersService : UsersService
  ) { }

  ngOnInit() {
    this.usersService.getAllUsers().subscribe( data => {
      this.userArr = data;

    });
  }
  changeRole( role , user){
    user.is_admin = role;
    this.usersService.setUserRole(user).subscribe( data =>{
      // console.log(data);
    });
  }

  deleteUser( user )
  {
    this.usersService.deleteUser(user).subscribe( data =>{
      // console.log(data);
      this.userArr.splice( this.userArr.indexOf(user) , 1 );
    });
  }
}
