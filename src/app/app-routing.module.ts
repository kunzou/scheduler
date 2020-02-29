import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { CalendarComponent } from './calendar/calendar.component';
import { AdminComponent } from './admin/admin.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { EditScheduleComponent } from './edit-schedule/edit-schedule.component';
import { CallbackComponent } from './callback/callback.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  { path: '', redirectTo: '/welcome', pathMatch: 'full' },
  { path: 'calendar', component: CalendarComponent },  
  { path: 'admin', component: AdminComponent },  
  { path: 'welcome', component: WelcomeComponent },  
  { path: 'callback', component: CallbackComponent },  
  { path: 'profile', component: ProfileComponent },  
  { path: 'edit/:id', component: EditScheduleComponent },  
];

@NgModule({
  imports: [
    NgbModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
