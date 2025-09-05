import { Routes } from '@angular/router';
import { LoginComponent } from './components/pages/login/login.component';
import { RegisterComponent } from './components/pages/register/register.component';
import { DashboardComponent } from './components/pages/dashboard/dashboard.component';
import { MainLayoutComponent } from './components/shared/main-layout/main-layout.component';
import { ProfileComponent } from './components/pages/users/profile/profile.component';
import { NotificationComponent } from './components/pages/notification/notification.component';
import { CalendarComponent } from './components/pages/calendar/calendar.component';
import { ITComponent } from './components/pages/deps/IT/IT.component';
import { RHComponent } from './components/pages/deps/RH/RH.component';
import { HSEEnComponent } from './components/pages/deps/HSEEn/HSEEn.component';
import { QualiteComponent } from './components/pages/deps/Qualite/Qualite.component';
import { MaintenanceComponent } from './components/pages/deps/Maintenance/Maintenance.component';
import { TableauComposerComponent } from './components/composer/tableau-composer/tableau-composer.component';
import { PublicationComposerComponent } from './components/composer/publication-composer/publication-composer.component';
import { MessageComposerComponent } from './components/composer/message-composer/message-composer.component';
import { UsersListComponent } from './components/pages/users/users-list/users-list.component';
import { RoleManagerComponent } from './components/pages/users/role-manager/role-manager.component';

export const routes: Routes = [{
    path: '',
    component: MainLayoutComponent,
    children: [
        { path: 'dashboard', component: DashboardComponent },
        { path: 'profile', component: ProfileComponent },
        {path: 'notification', component: NotificationComponent },
        {path: 'calendar', component: CalendarComponent } ,
        {path: 'departements/IT', component: ITComponent },  
        {path: 'departements/RH', component:RHComponent } ,
        {path: 'departements/HSEEn', component: HSEEnComponent} ,
        {path: 'departements/Qualite', component: QualiteComponent } ,
        {path: 'departements/Maintenance', component:MaintenanceComponent}, 
        {path: 'role-manger', component:RoleManagerComponent } , 
        {path: 'users-list', component:UsersListComponent } ,

      //   {path: '', component: }  


      //composer component will be here
       {path:'pubComposer', component:PublicationComposerComponent },  
       {path:'msgComposer', component:MessageComposerComponent }  ,
      //   {path: '', component: }  

      
      
    ]},
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },





    {path: '', redirectTo: 'login', pathMatch: 'full'},
    { path: '**', redirectTo: '' } // fallback route
];
