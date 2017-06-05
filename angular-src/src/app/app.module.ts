import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule , Routes } from '@angular/router'

import { FlashMessagesModule } from 'angular2-flash-messages'
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { PaginationModule } from 'ngx-bootstrap';
import { ModalModule } from 'ngx-bootstrap';
import { BsDropdownModule } from 'ngx-bootstrap';
import { PopoverModule } from 'ngx-popover';
import { PasswordStrengthBarModule } from 'ng2-password-strength-bar';
// Imports for loading & configuring the in-memory web api

import { FileSelectDirective, FileDropDirective } from 'ng2-file-upload';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SignupComponent } from './components/signup/signup.component';
import { ProfileComponent } from './components/profile/profile.component';

import { ValidateService } from './services/validate.service';
import { AuthService } from './services/auth.service';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { ProblemComponent } from './components/problem/problem.component';
import { TabComponent } from './components/tab/tab.component';
import { TabsComponent } from './components/tabs/tabs.component';
import { DescriptionComponent } from './components/description/description.component';
import { SubmissionsComponent } from './components/submissions/submissions.component';
import { EndPointService } from './services/end-point.service';
import { ProblemService } from './services/problem.service';
import { UsersService } from './services/users.service';
import { FooterComponent } from './components/footer/footer.component';
import { ProblemsListComponent } from './components/problems-list/problems-list.component';
import { ProblemPanelComponent } from './components/problem-panel/problem-panel.component';
import { MathjaxDirective } from './directives/mathjax.directive';
import { AdminComponent } from './components/admin/admin.component';
import { AdminProblemComponent } from './components/admin-problem/admin-problem.component';
import { AdminProblemEditComponent } from './components/admin-problem-edit/admin-problem-edit.component';
import { AdminUserComponent } from './components/admin-user/admin-user.component';
import { ImageViewDirective } from './directives/image-view.directive';

const appRoutes: Routes =[
    {path : '' , component : HomeComponent },
    {path : 'login' , component : LoginComponent },
    {path : 'signup' , component : SignupComponent },
    {path : 'profile' , component : ProfileComponent , canActivate: [AuthGuard]},
    {path : 'admin' , component : AdminComponent , canActivate: [AuthGuard, AdminGuard] ,
      children : [
        { path : '', component: AdminProblemComponent},
        { path : 'problems', component: AdminProblemComponent},
        { path : 'problems/:problemName', component: AdminProblemEditComponent},
        { path : 'users', component: AdminUserComponent},

      ]
    },
    {path : 'submissions', component : SubmissionsComponent , data : {type:1} },
    {path : 'submissions/user/:username', component : SubmissionsComponent ,  data : {type:2} },
    {path : 'submissions/problem/:problemName', component : SubmissionsComponent ,  data : {type:3} },
    {path : 'problems/:name', component : ProblemComponent , canActivate: [AuthGuard] ,
      children : [
        {
          path : '' , component : DescriptionComponent
        },
        {
          path : 'submissions' , component : SubmissionsComponent , data : { type:0}
        }
      ]
    },
    {path : 'problems', component : ProblemsListComponent , canActivate: [AuthGuard] }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    NavbarComponent,
    SignupComponent,
    ProfileComponent,
    ProblemComponent,
    TabComponent,
    TabsComponent,
    DescriptionComponent,
    SubmissionsComponent,
    FooterComponent,
    ProblemsListComponent,
    ProblemPanelComponent,
    MathjaxDirective,
    AdminComponent,
    AdminProblemComponent,
    AdminProblemEditComponent,
    AdminUserComponent,
    FileSelectDirective,
    ImageViewDirective
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes),
    FlashMessagesModule,
    Ng2SmartTableModule,
    PaginationModule.forRoot(),
    ModalModule.forRoot(),
    BsDropdownModule.forRoot(),
    PopoverModule,
    PasswordStrengthBarModule
  ],
  providers: [
    ValidateService,
    AuthService,
    AuthGuard,
    AdminGuard,
    EndPointService,
    ProblemService,
    UsersService
  ],
  bootstrap: [AppComponent]

})
export class AppModule { }
