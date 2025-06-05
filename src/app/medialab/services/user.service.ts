import { Injectable } from "@angular/core";
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "@angular/fire/auth";
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
    providedIn: 'root'
})

export class UserService {

    constructor(private auth: AngularFireAuth,
        private auth2: Auth,
        private firestore: AngularFirestore,) {}

    register({email, password}: any) {
        return createUserWithEmailAndPassword(this.auth2, email, password);
    }


    login({email, password}:any){
        return this.auth.signInWithEmailAndPassword(email, password);
        //return signInWithEmailAndPassword(this.auth, email, password);
    }

    logout() {
        this.auth.signOut();
    }

    stateUser() {
        return this.auth.authState;
    }
}






// import { Injectable } from "@angular/core";
// import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "@angular/fire/auth";
// import { AngularFireAuth } from '@angular/fire/compat/auth';

// @Injectable({
//     providedIn: 'root'
// })

// export class UserService {

//     constructor(private auth: AngularFireAuth) {}

//     register({email, password}: any) {
//         // return createUserWithEmailAndPassword(this.auth, email, password);
//     }

//     login({email, password}:any){
//         return this.auth.signInWithEmailAndPassword(email, password);
//         //return signInWithEmailAndPassword(this.auth, email, password);
//     }

//     // logout() {
//     //     return signOut(this.auth.);
//     // }
// }





