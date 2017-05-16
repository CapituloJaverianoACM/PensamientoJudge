import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule , Routes } from '@angular/router'

import { FlashMessagesModule } from 'angular2-flash-messages'

// Imports for loading & configuring the in-memory web api



import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SignupComponent } from './components/signup/signup.component';
import { ProfileComponent } from './components/profile/profile.component';

import { ValidateService } from './services/validate.service';
import { AuthService } from './services/auth.service';
import { AuthGuard } from './guards/auth.guard';
import { ProblemComponent } from './components/problem/problem.component';
import { TabComponent } from './components/tab/tab.component';
import { TabsComponent } from './components/tabs/tabs.component';
import { DescriptionComponent } from './components/description/description.component';
import { SubmissionsComponent } from './components/submissions/submissions.component';
import { EndPointService } from './services/end-point.service';
import { ProblemService } from './services/problem.service';

const appRoutes: Routes =[
    {path : '' , component : HomeComponent },
    {path : 'login' , component : LoginComponent },
    {path : 'signup' , component : SignupComponent },
    {path : 'profile' , component : ProfileComponent , canActivate: [AuthGuard]},
    {path : 'problem/:name', component : ProblemComponent }
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
    SubmissionsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes),
    FlashMessagesModule
  ],
  providers: [
    ValidateService,
    AuthService,
    AuthGuard,
    EndPointService,
    ProblemService
  ],
  bootstrap: [AppComponent]

})
export class AppModule { }
