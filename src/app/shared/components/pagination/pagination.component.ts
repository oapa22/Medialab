import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from '../../../shared/interfaces/user.interface';
import { Message } from '../../../shared/interfaces/message.interface';
import { Podcast } from '../../../shared/interfaces/podcast.interface';
import { Project } from '../../../shared/interfaces/project.interface';
import { CounterDocService } from '../../../shared/services/counter-doc.service';
import { QueryDocumentSnapshot, QuerySnapshot } from '@angular/fire/compat/firestore';
import { FirestoreService } from '../../../radio/services/firebase.service';

@Component({
    selector: 'shared-pagination',
    templateUrl: './pagination.component.html',
    styleUrl: './pagination.component.css',
    standalone: false
})
export class PaginationComponent implements OnInit{
  @Output() public userEmitter:EventEmitter<User[]> = new EventEmitter();
  @Output() public messageEmitter:EventEmitter<Message[]> = new EventEmitter();
  @Output() public podcastEmitter:EventEmitter<Podcast[]> = new EventEmitter();
  @Output() public projectEmitter:EventEmitter<Project[]> = new EventEmitter();
  @Input() public path!: 'user'|'podcast'|'message'|'project';
  @Input() public numberDocsShow:number = 6;

  // Documentos
  // public docs!: QueryDocumentSnapshot<(User| Message | Podcast | Project)[]>;
  public docs!: (User| Message | Podcast | Project)[];
  public docsQuery!: QuerySnapshot<(User| Message | Podcast | Project)[]>;

  public usersQuery!: QuerySnapshot<User>;
  public messagesQuery!: QuerySnapshot<Message>;
  public podcastsQuery!: QuerySnapshot<Podcast>;
  public projectsQuery!: QuerySnapshot<Project>;

  // Propiedades de la paginacion
  public currentIndex: number = 1; //indice 1
  public totalPages: number = 0; //ultimo indece
  public windowSize:number = 3; //limite de ventana
  public windowArray: number[] = []; //ventana para visualizar los indices
  public totalDocs: number = 0;
  public lastNumberDocs: number = 0;

  //QueryDocumentos
  public firstVisible?: QueryDocumentSnapshot<User| Message | Podcast | Project>;

  constructor(private serviceFireStore:FirestoreService, private counterService:CounterDocService) {

  }

  /**
    TODO: HAY UN PROBLEMA CON LA CARGA DE LOS PROYECTOS al iniciar la aplicacion,
    AL PARECER SE EEJCUTA DOS VECES EN OINIT DEBIDO QUE EL SERVICIO DE LA ANTERIOR PAGINA SE ENCUENTRA ABIERTO
    Y COMO NO SE HA CERRADO LA APLICACION INTUYE QUE HAY DOS SERVICIOS.
   **/
  public ngOnInit(): void {
    this.getFirstDocument(this.path);
    this.initialPagination(this.path);
  }

  public async getFirstDocument(path: 'user'|'podcast'|'message'|'project'):Promise<void>{
    if(path == 'user'){
      this.usersQuery = await this.serviceFireStore.getFirstQuerySnapshot<User>(this.path, this.numberDocsShow);
      const usersDocs: User[] = this.usersQuery.docs.map(doc => doc.data() as User);
      this.userEmitter.emit(usersDocs);
    } else if(path == 'podcast'){
      this.podcastsQuery = await this.serviceFireStore.getFirstQuerySnapshot<Podcast>(this.path, this.numberDocsShow);
      const podcastDocs: Podcast[] = this.podcastsQuery.docs.map(doc => doc.data() as Podcast);
      this.podcastEmitter.emit(podcastDocs);
    } else if(path == 'message'){
      this.messagesQuery = await this.serviceFireStore.getFirstQuerySnapshot<Message>(this.path, this.numberDocsShow);
      const messagesDocs: Message[] = this.messagesQuery.docs.map(doc => doc.data() as Message);
      this.messageEmitter.emit(messagesDocs);
    } else if(path == 'project'){
      this.projectsQuery = await this.serviceFireStore.getFirstQuerySnapshot<Project>(this.path, this.numberDocsShow);
      const projectsDocs: Project[] = this.projectsQuery.docs.map(doc => doc.data() as Project);
      this.projectEmitter.emit(projectsDocs);
    }
  }

  public async getLastDocuments(path: 'user'|'podcast'|'message'|'project'):Promise<void>{
    if(path == 'user'){
      this.usersQuery = await this.serviceFireStore.getLastQuerySnapShot<User>(this.path, this.lastNumberDocs);
      const usersDocs: User[] = this.usersQuery.docs.map(doc => doc.data() as User);
      this.userEmitter.emit(usersDocs);
    } else if(path == 'podcast'){
      this.podcastsQuery = await this.serviceFireStore.getLastQuerySnapShot<Podcast>(this.path, this.lastNumberDocs);
      const podcastDocs: Podcast[] = this.podcastsQuery.docs.map(doc => doc.data() as Podcast);
      this.podcastEmitter.emit(podcastDocs);
    } else if(path == 'message'){
      this.messagesQuery = await this.serviceFireStore.getLastQuerySnapShot<Message>(this.path, this.lastNumberDocs);
      const messagesDocs: Message[] = this.messagesQuery.docs.map(doc => doc.data() as Message);
      this.messageEmitter.emit(messagesDocs);
    } else if(path == 'project'){
      this.projectsQuery = await this.serviceFireStore.getLastQuerySnapShot<Project>(this.path, this.lastNumberDocs);
      const projectsDocs: Project[] = this.projectsQuery.docs.map(doc => doc.data() as Project);
      this.projectEmitter.emit(projectsDocs);
    }
  }

  public async nextDocuments(iterations:number):Promise<void>{
    if(this.path == 'user'){
      for (let index = 0; index < iterations; index++) {
        this.usersQuery = await this.serviceFireStore.loadNextSnapshotAsync<User>(this.path,this.usersQuery.docs[this.numberDocsShow-1],this.numberDocsShow);
      }
      const usersDocs: User[] = this.usersQuery.docs.map(doc => doc.data() as User);
      this.userEmitter.emit(usersDocs);
    } else if(this.path == 'podcast'){
      for (let index = 0; index < iterations; index++) {
        this.podcastsQuery = await this.serviceFireStore.loadNextSnapshotAsync<Podcast>(this.path,this.podcastsQuery.docs[this.numberDocsShow-1],this.numberDocsShow);
      }
      const podcastDocs: Podcast[] = this.podcastsQuery.docs.map(doc => doc.data() as Podcast);
      this.podcastEmitter.emit(podcastDocs);
    } else if(this.path == 'message'){
      for (let index = 0; index < iterations; index++) {
        this.messagesQuery = await this.serviceFireStore.loadNextSnapshotAsync<Message>(this.path,this.messagesQuery.docs[this.numberDocsShow-1],this.numberDocsShow);
      }
      const mesaggestDocs: Message[] = this.messagesQuery.docs.map(doc => doc.data() as Message);
      this.messageEmitter.emit(mesaggestDocs);
    } else if(this.path == 'project'){
      for (let index = 0; index < iterations; index++) {
        this.projectsQuery = await this.serviceFireStore.loadNextSnapshotAsync<Project>(this.path,this.projectsQuery.docs[this.numberDocsShow-1],this.numberDocsShow);
      }
      const projectsDocs: Project[] = this.projectsQuery.docs.map(doc => doc.data() as Project);
      this.projectEmitter.emit(projectsDocs);
    }
  }

  public async prevDocuments(iterations:number):Promise<void>{
    if(this.path == 'user'){
      for (let index = 0; index < iterations; index++) {
        this.usersQuery = await this.serviceFireStore.loadPrevSnapshotAsync<User>(this.path,this.usersQuery.docs[0],this.numberDocsShow);
      }
      const usersDocs: User[] = this.usersQuery.docs.map(doc => doc.data() as User);
      this.userEmitter.emit(usersDocs);
    } else if(this.path == 'podcast'){
      for (let index = 0; index < iterations; index++) {
        this.podcastsQuery = await this.serviceFireStore.loadPrevSnapshotAsync<Podcast>(this.path,this.podcastsQuery.docs[0],this.numberDocsShow);
      }
      const podcastDocs: Podcast[] = this.podcastsQuery.docs.map(doc => doc.data() as Podcast);
      this.podcastEmitter.emit(podcastDocs);
    } else if(this.path == 'message'){
      for (let index = 0; index < iterations; index++) {
        this.messagesQuery = await this.serviceFireStore.loadPrevSnapshotAsync<Message>(this.path,this.messagesQuery.docs[0],this.numberDocsShow);
      }
      const mesaggestDocs: Message[] = this.messagesQuery.docs.map(doc => doc.data() as Message);
      this.messageEmitter.emit(mesaggestDocs);
    } else if(this.path == 'project'){
      for (let index = 0; index < iterations; index++) {
        this.projectsQuery = await this.serviceFireStore.loadPrevSnapshotAsync<Project>(this.path,this.projectsQuery.docs[0],this.numberDocsShow);
      }
      const projectsDocs: Project[] = this.projectsQuery.docs.map(doc => doc.data() as Project);
      this.projectEmitter.emit(projectsDocs);
    }
  }

  public initialPagination(path: 'user'|'podcast'|'message'|'project'):void{

    this.counterService.getCounderDocs().subscribe(counterDocsRes => {
      if(path == 'user'){
        this.totalDocs = counterDocsRes.user;
      } else if(path == 'podcast'){
        this.totalDocs = counterDocsRes.podcast;
      } else if(path == 'message'){
        this.totalDocs = counterDocsRes.message;
      } else if(path == 'project'){
        this.totalDocs = counterDocsRes.project;
      }
      console.log("totalDocs: ",this.totalDocs);
      console.log("numberDocsShow: ",this.numberDocsShow);

      this.totalPages = Math.ceil(this.totalDocs/this.numberDocsShow);

      console.log("totalPages: ",this.totalPages);

      if(this.totalPages >= 6){
        for (let index = 1; index <= this.windowSize; index++) {
          this.windowArray.push(index+1);
        }
        this.lastNumberDocs = this.totalDocs % this.numberDocsShow;
        console.log( "lastNumberDocs: ", this.lastNumberDocs);
      } else {
        for (let index = 0; index < this.totalPages; index++) {
          this.windowArray.push(index+1);
        }
      }
    });
  }

  /**
   * Actualizacion de la ventana
   * El primer if se emplea para cambiar el indice actual del usuario, si el indice no se encuentra en el
   * intervalo de especificado no va a actualizar.
   */
  public updateWindowArray(action:'next'|'prev'){
    if(this.totalPages >= 6){
      if(action == 'next'){
        for (let index = 0; index < this.windowSize; index++) {
          this.windowArray[index] += 1;
        }
      }else{
        for (let index = 0; index < this.windowSize; index++) {
          this.windowArray[index] -= 1;
        }
      }
    }
  }

  //Funcion para cambiar el indice actual por el elegido
  public goToPage(destIndex: number) {

    if((this.currentIndex + 1) == destIndex){ //Determina si avanza el indice una posicion
      this.nextPage();
    } else if((this.currentIndex - 1) == destIndex) { //Determina si retrocedio el indice una posicion
      this.prevPage();
    } else {
      let result:number = 0;
      if(destIndex > this.currentIndex){ //AVANZA mas de una posicion
        result = destIndex - this.currentIndex;
        this.nextDocuments(result);
        if(destIndex == this.windowArray[this.windowSize - 1]) { // Determina si el indice actual es igual al limite de la ventan desde el final (4 == windowArray[2])
          this.updateWindowArray('next');
        }
      } else if(destIndex < this.currentIndex){ //RETROCEDE mas de una posicion
        result = this.currentIndex - destIndex;
        this.prevDocuments(result);
        if(destIndex == this.windowArray[0]){ //Determina si el indice actual es igual al limite de la ventan desde el inicio
          this.updateWindowArray('prev');
        }
      }
      this.currentIndex = destIndex;
    }
  }

  //Aumenta el indice, pero el if simplemente accede cuando el total de paginas es mayor o igual a 6 y actualiza la ventana
  public nextPage():void {
    if(this.currentIndex <= this.totalPages){
      this.currentIndex += 1;
      this.nextDocuments(1);

      if((this.currentIndex > this.windowSize) && this.currentIndex < (this.totalPages - 1)){
        this.updateWindowArray('next');
      }
    }
  }

  //Disminuye el indice, pero el if simplemente accede cuando el total de paginas es mayor o igual a 6 y actualiza la ventana
  public prevPage():void {
    if(this.currentIndex >= 1){
      this.currentIndex -= 1;
      this.prevDocuments(1);

      if((this.currentIndex > (this.windowSize - 1)) && this.currentIndex < (this.totalPages - 2)){
        this.updateWindowArray('prev');
      }
    }

  }

  public setFirstwindowArray():void{
    this.currentIndex = 1;
    let aux:number = 1;
    if(this.totalPages >= 6){
      for (let index = 0; index < this.windowSize; index++) {
        aux += 1;
        this.windowArray[index] = aux;
      }
    }
    this.getFirstDocument(this.path);
  }

  public setLastwindowArray():void{
    this.currentIndex = this.totalPages;
    let aux:number = -this.windowSize;
    if(this.totalPages >= 6){
      for (let index = 0; index < this.windowSize; index++) {
        this.windowArray[index] = this.totalPages + aux ;
        aux += 1;
      }
    }
    this.getLastDocuments(this.path);
  }


}
