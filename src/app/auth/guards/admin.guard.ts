import { CanMatchFn, GuardResult, MaybeAsync, Router } from '@angular/router';
import { AuthServiceService } from '../services/auth.service';
import { inject } from '@angular/core';
import { map, of, switchMap } from 'rxjs';
import { FirestoreService } from '../../radio/services/firebase.service';
import { User } from '../../shared/interfaces/user.interface';

export const adminGuard: CanMatchFn = (route, segments): MaybeAsync<GuardResult> => {
  const router = inject(Router);
  const firestore = inject(FirestoreService);

  return inject(AuthServiceService).stateUser().pipe(
    switchMap(user => {
      if (!user) {
        return of(router.createUrlTree(['radio-utpl/inicio']));
      }
      return firestore.getDocProject<User>('user', user.uid).pipe(
        map(res => res?.isAdmin ? true : router.createUrlTree(['radio-utpl/inicio']))
      );
    })
  );
};

