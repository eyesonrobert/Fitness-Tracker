import { NgModule } from '@angular/core';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';

import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { SharedModule } from '../shared/shared.module';
import { AuthRoutingMoudle } from './auth-routing.module';

@NgModule({
    declarations: [SignupComponent, LoginComponent],
    imports: [SharedModule, AngularFirestoreModule, AngularFireAuthModule, AuthRoutingMoudle],
    exports: []
})

export class AuthModule { }
