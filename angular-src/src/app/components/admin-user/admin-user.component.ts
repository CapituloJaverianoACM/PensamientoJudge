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

}
