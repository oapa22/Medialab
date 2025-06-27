import { Injectable, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';
import { catchError, map, Observable, of } from 'rxjs';
import { CounterDocs } from '../interfaces/counter-docs.interface';

@Injectable({
  providedIn: 'root'
})
export class CounterDocService implements OnInit{
  private collectionName:string = 'counters';
  private documentDname:string = 'countersDoc';

  constructor(private firestore: AngularFirestore) { }

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  public async incrementCounter(field: 'message' | 'podcast'|'project'|'user'|'reservations', incrementBy: number = 1):Promise<boolean>{
    let increment:boolean = false;
    const docRef  = this.firestore.collection(this.collectionName).doc(this.documentDname);

    try {
      return await this.firestore.firestore.runTransaction(async (transaction) => {
        const docSnapshot = await transaction.get(docRef.ref);

        if (docSnapshot.exists) {
            transaction.update(docRef.ref, {
              [field]: firebase.firestore.FieldValue.increment(incrementBy)
            });
            console.log(`Se ha incrementado el campo ${field}.`);
            increment = true;
            return increment;
        } else {
          console.log(`El documento no existe.`);
          return increment;
        }
      });
    } catch (error) {
      console.error("Error al realizar la transacción:", error);
      return increment;
    }
  }

  public async decrementCounter(field: 'message' | 'podcast'|'project'|'user'|'reservations', incrementBy: number = 1):Promise<boolean>{
    let decrement:boolean = false;
    const docRef  = this.firestore.collection(this.collectionName).doc(this.documentDname);

    return this.firestore.firestore.runTransaction(async (transaction) => {
      const docSnapshot = await transaction.get(docRef.ref);

      if (docSnapshot.exists) {
        const currentValue = docSnapshot.get(field);

        if (currentValue > 0) {
          // Si el valor es mayor que cero, aplica el decremento
          transaction.update(docRef.ref, {
            [field]: firebase.firestore.FieldValue.increment(-incrementBy)
          });
          console.log(`Se ha decrementado el campo ${field}.`);
          decrement = true;
          return decrement;
        } else {
          console.log(`El valor del campo ${field} es cero o menor, no se realizará decremento.`);
          return decrement;
        }
      } else {
        console.log(`El documento no existe.`);
        return decrement;
      }
    }).catch((error) => {
      console.error("Error al realizar la transacción:", error);
      return decrement;
    });

  }

  public getCounderDocs():Observable<CounterDocs>{
    return this.firestore.collection(this.collectionName).doc<CounterDocs>(this.documentDname)
    .valueChanges()
    .pipe(
      map(counterDocs => {
        if (!counterDocs) {
          throw new Error("El documento no existe.");
        }
        return counterDocs;
      })
    );
  }
}
