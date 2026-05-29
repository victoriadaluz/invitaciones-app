import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './auth/components/login/login.component';
import { RegisterComponent } from './auth/components/register/register.component';
import { ForgotPasswordComponent } from './auth/components/forgot-password/forgot-password.component';
import { CreateInvitationComponent } from './invitations/create-invitation/create-invitation.component';
import { ViewInvitationComponent } from './invitations/view-invitation/view-invitation.component';
export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },

    // Rutas de invitaciones
  { path: 'create-invitation', component: CreateInvitationComponent },
  { path: 'invitation/preview', component: ViewInvitationComponent },
  { path: 'invitation/:id', component: ViewInvitationComponent },
  
  // Redirecciones
  { path: '**', redirectTo: '' }
];