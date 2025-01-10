import { Injectable, OnInit } from '@angular/core';
import { AngularFirestore, QueryDocumentSnapshot, QuerySnapshot } from "@angular/fire/compat/firestore";
import { AngularFireStorage } from "@angular/fire/compat/storage";
import { getCountFromServer } from '@angular/fire/firestore';

import { BehaviorSubject, finalize, firstValueFrom, map, Observable, switchMap, tap } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class FirestoreService {
   public downloadUrl$: BehaviorSubject<string> = new BehaviorSubject<string>('');

    constructor(private firestore: AngularFirestore, private storage: AngularFireStorage,) {
    }

    //crear el id que se usara en los documentos
    createId(){
        return this.firestore.createId();
    }

    //obtener cualquier coleccion de firebase
    getCollection<tipo>(path: string){
        const collection = this.firestore.collection<tipo>(path);
        return collection.valueChanges();
    }

    //crear un documento
    createDoc(data: any, path: string, id: string){
        const collection = this.firestore.collection(path);
        return collection.doc(id).set(data);
    }

    //obtener documento que se encuentra dentro de cualquier coleccion
    getDoc<tipo>(path: string, id: string){
        return this.firestore.collection(path).doc<tipo>(id).valueChanges().subscribe( (res) => {
          res
        });

    }

    getDocUS<T>(collection: string, docId: string): Observable<T | undefined> {
      return this.firestore.collection(collection).doc<T>(docId).valueChanges();
    }




    // ======================================================================================================
    //obtener documento de un proyecto que se encuentra dentro de cualquier coleccion
    public getDocPodcast<tipo>(path:string, id:string){
      return this.firestore.collection(path).doc<tipo>(id).valueChanges();
    }
    public getDocProject<tipo>(path: string, id: string){
      return this.firestore.collection(path).doc<tipo>(id).valueChanges();
    }
    public getDocMessage<tipo>(path:string, id:string){
      return this.firestore.collection(path).doc<tipo>(id).valueChanges();
    }

    public getLatestDocuments<tipo>(path: string, orderByField:string ,limit:number) {
      return this.firestore.collection<tipo>(path, ref => ref.orderBy(orderByField,'desc').limit(limit)).valueChanges();
    }

    // Funcion para subir la imagen a firebase y obtener la url.
    public getImageURLFirebase(fileSelec:File,fileName:string):Observable<string> {

      // Obtener el archivo seleccionado
      const filePath = `images_project/${fileName}`;  // Definir la ruta donde se almacenará la imagen
      const fileRef = this.storage.ref(filePath);  // Crear una referencia al archivo
      const uploadTask = this.storage.upload(filePath,fileSelec);  // Subir el archivo a Firebase Storage

      // Escuchar el proceso de carga
      return uploadTask.snapshotChanges().pipe(
        finalize(() =>  {}),
        switchMap(() => fileRef.getDownloadURL())
      );

      // let stringsg:string = '';
      // const filePath = `images_project/${fileName}`;

      // const ref = this.storage.ref('images_project/patio-alquile - frame at 0m7s.jpg');

      // return  ref.getDownloadURL().subscribe(url =>);
    }

    public uploadFile(fileSelec:File,fileName:string):Observable<number | undefined> {

      const filePath = `images_project/${fileName}`;
      const fileRef = this.storage.ref(filePath);
      const uploadTask = this.storage.upload(filePath, fileSelec);

      uploadTask.snapshotChanges().pipe(
          finalize(() => {
            fileRef.getDownloadURL().pipe(map(res =>{
              this.downloadUrl$.next(res);
            })).subscribe();
          })
       )
      .subscribe();
      return uploadTask.percentageChanges();
    }

    //no es necesario el []
    public getFirstDocument<tipo>(path:string, numberShow:number):Observable<tipo[]> {
      return this.firestore.collection<tipo>(path, ref =>
        ref.orderBy('date').limit(numberShow)).valueChanges(); //TODO:cambiar el 'createdAt' por id o algo
    }

    // Método para obtener la siguiente página
    public loadNextSnapshot<tipo>(path:string, lastVisible:QueryDocumentSnapshot<tipo>,numbersDocShow:number):Observable<QuerySnapshot<tipo>>{
      return this.firestore.collection<tipo>(path, ref =>
        ref.orderBy('date').startAfter(lastVisible).limit(numbersDocShow)).get();
    }

    public async loadNextSnapshotAsync<tipo>(
      path: string,
      lastVisible: QueryDocumentSnapshot<tipo>,
      numbersDocShow: number
    ): Promise<QuerySnapshot<tipo>> {
      // Convertimos el Observable a una Promise para usarlo con async/await
      const observable: Observable<QuerySnapshot<tipo>> = this.firestore.collection<tipo>(path, ref =>
        ref.orderBy('date','desc').startAfter(lastVisible).limit(numbersDocShow)
      ).get();

      return firstValueFrom(observable); // Devuelve una Promise
    }

    public async loadPrevSnapshotAsync<tipo>(
      path: string,
      lastVisible: QueryDocumentSnapshot<tipo>,
      numbersDocShow: number
    ): Promise<QuerySnapshot<tipo>> {
      // Convertimos el Observable a una Promise para usarlo con async/await
      const observable: Observable<QuerySnapshot<tipo>> = this.firestore.collection<tipo>(path, ref =>
        ref.orderBy('date','desc').endBefore(lastVisible).limitToLast(numbersDocShow)
      ).get();

      return firstValueFrom(observable); // Devuelve una Promise
    }

    public loadPrevSnapshot<tipo>(path:string, firstVisible:QueryDocumentSnapshot<tipo>,numbersDocShow:number):Observable<QuerySnapshot<tipo>>{
      return this.firestore.collection<tipo>(path, ref =>
        ref.orderBy('date').endBefore(firstVisible).limitToLast(numbersDocShow)).get();
    }

    public getFirstSnapshot<tipo>(path:string, numbersDocShow:number):Observable<QuerySnapshot<tipo>>{
      return this.firestore.collection<tipo>(path, ref =>
        ref.orderBy('date','desc').limit(numbersDocShow)).get();
    }

    public getLastSnapshot<tipo>(path:string, numbersDocShow:number):Observable<QuerySnapshot<tipo>>{
      return this.firestore.collection<tipo>(path, ref =>
        ref.orderBy('date','desc').limitToLast(numbersDocShow)).get();
    }
    // ======================================================================================================





    //obtener array de documentos con X campo y X limite
    //desc: mayor[0] a menor[0+1}]
    getOrderedArray<tipo>(path: string, field: string, limit: number): Observable<tipo[]> {
        return this.firestore.collection<tipo>(path, ref => ref.orderBy(field, 'desc').limit(limit)).valueChanges();
    }

    //actualizar documento
    updateDoc(path: string, id: string, data: any) {
        return this.firestore.collection(path).doc(id).update(data)
    }

    //eliminar documento
    deleteDoc(path: string, id: string) {
        return this.firestore.collection(path).doc(id).delete();
    }

    deleteStorage(path: string, name: string) {
      this.storage.ref(path).child(name).delete();
    }
}
