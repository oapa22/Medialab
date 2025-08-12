import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from '../../../shared/interfaces/user.interface';
import { Project } from '../../../shared/interfaces/project.interface';
import { CounterDocService } from '../../../shared/services/counter-doc.service';
import { QueryDocumentSnapshot, QuerySnapshot } from '@angular/fire/compat/firestore';
import { FirestoreService } from '../../../medialab/services/firebase.service';

@Component({
  selector: 'shared-pagination',
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css',
  standalone: false
})
export class PaginationComponent implements OnInit {
  @Output() public userEmitter: EventEmitter<User[]> = new EventEmitter();
  @Output() public projectEmitter: EventEmitter<Project[]> = new EventEmitter();
  @Input() public path!: 'user' | 'project';
  @Input() public numberDocsShow: number = 6;

  public docs!: (User | Project)[];
  public docsQuery!: QuerySnapshot<(User | Project)[]>;

  public usersQuery!: QuerySnapshot<User>;
  public projectsQuery!: QuerySnapshot<Project>;

  public currentIndex: number = 1;
  public totalPages: number = 0;
  public windowSize: number = 3;
  public windowArray: number[] = [];
  public totalDocs: number = 0;
  public lastNumberDocs: number = 0;

  public firstVisible?: QueryDocumentSnapshot<User | Project>;

  constructor(
    private serviceFireStore: FirestoreService,
    private counterService: CounterDocService
  ) { }

  public ngOnInit(): void {
    this.getFirstDocument(this.path);
    this.initialPagination(this.path);
  }

  public async getFirstDocument(path: 'user' | 'project'): Promise<void> {
    if (path == 'user') {
      this.usersQuery = await this.serviceFireStore.getFirstQuerySnapshot<User>(this.path, this.numberDocsShow);
      const usersDocs: User[] = this.usersQuery.docs.map(doc => doc.data() as User);
      this.userEmitter.emit(usersDocs);
    } else if (path == 'project') {
      this.projectsQuery = await this.serviceFireStore.getFirstQuerySnapshot<Project>(this.path, this.numberDocsShow);
      const projectsDocs: Project[] = this.projectsQuery.docs.map(doc => doc.data() as Project);
      this.projectEmitter.emit(projectsDocs);
    }
  }

  public async getLastDocuments(path: 'user' | 'project'): Promise<void> {
    if (path == 'user') {
      this.usersQuery = await this.serviceFireStore.getLastQuerySnapShot<User>(this.path, this.lastNumberDocs);
      const usersDocs: User[] = this.usersQuery.docs.map(doc => doc.data() as User);
      this.userEmitter.emit(usersDocs);
    } else if (path == 'project') {
      this.projectsQuery = await this.serviceFireStore.getLastQuerySnapShot<Project>(this.path, this.lastNumberDocs);
      const projectsDocs: Project[] = this.projectsQuery.docs.map(doc => doc.data() as Project);
      this.projectEmitter.emit(projectsDocs);
    }
  }

  public async nextDocuments(iterations: number): Promise<void> {
    if (this.path == 'user') {
      for (let index = 0; index < iterations; index++) {
        this.usersQuery = await this.serviceFireStore.loadNextSnapshotAsync<User>(this.path, this.usersQuery.docs[this.numberDocsShow - 1], this.numberDocsShow);
      }
      const usersDocs: User[] = this.usersQuery.docs.map(doc => doc.data() as User);
      this.userEmitter.emit(usersDocs);
    } else if (this.path == 'project') {
      for (let index = 0; index < iterations; index++) {
        this.projectsQuery = await this.serviceFireStore.loadNextSnapshotAsync<Project>(this.path, this.projectsQuery.docs[this.numberDocsShow - 1], this.numberDocsShow);
      }
      const projectsDocs: Project[] = this.projectsQuery.docs.map(doc => doc.data() as Project);
      this.projectEmitter.emit(projectsDocs);
    }
  }

  public async prevDocuments(iterations: number): Promise<void> {
    if (this.path == 'user') {
      for (let index = 0; index < iterations; index++) {
        this.usersQuery = await this.serviceFireStore.loadPrevSnapshotAsync<User>(this.path, this.usersQuery.docs[0], this.numberDocsShow);
      }
      const usersDocs: User[] = this.usersQuery.docs.map(doc => doc.data() as User);
      this.userEmitter.emit(usersDocs);
    } else if (this.path == 'project') {
      for (let index = 0; index < iterations; index++) {
        this.projectsQuery = await this.serviceFireStore.loadPrevSnapshotAsync<Project>(this.path, this.projectsQuery.docs[0], this.numberDocsShow);
      }
      const projectsDocs: Project[] = this.projectsQuery.docs.map(doc => doc.data() as Project);
      this.projectEmitter.emit(projectsDocs);
    }
  }

  public initialPagination(path: 'user' | 'project'): void {
    this.counterService.getCounderDocs().subscribe(counterDocsRes => {
      if (path == 'user') {
        this.totalDocs = counterDocsRes.user;
      } else if (path == 'project') {
        this.totalDocs = counterDocsRes.project;
      }

      this.windowArray = [];
      this.totalPages = Math.ceil(this.totalDocs / this.numberDocsShow);

      if (this.totalPages >= 6) {
        for (let index = 1; index <= this.windowSize; index++) {
          this.windowArray.push(index + 1);
        }
        this.lastNumberDocs = this.totalDocs % this.numberDocsShow;
      } else {
        for (let index = 0; index < this.totalPages; index++) {
          this.windowArray.push(index + 1);
        }
      }
    });
  }

  public updateWindowArray(action: 'next' | 'prev') {
    if (this.totalPages >= 6) {
      if (action == 'next') {
        for (let index = 0; index < this.windowSize; index++) {
          this.windowArray[index] += 1;
        }
      } else {
        for (let index = 0; index < this.windowSize; index++) {
          this.windowArray[index] -= 1;
        }
      }
    }
  }

  public goToPage(destIndex: number) {
    if ((this.currentIndex + 1) == destIndex) {
      this.nextPage();
    } else if ((this.currentIndex - 1) == destIndex) {
      this.prevPage();
    } else {
      let result: number = 0;
      if (destIndex > this.currentIndex) {
        result = destIndex - this.currentIndex;
        this.nextDocuments(result);
        if (destIndex == this.windowArray[this.windowSize - 1]) {
          this.updateWindowArray('next');
        }
      } else if (destIndex < this.currentIndex) {
        result = this.currentIndex - destIndex;
        this.prevDocuments(result);
        if (destIndex == this.windowArray[0]) {
          this.updateWindowArray('prev');
        }
      }
      this.currentIndex = destIndex;
    }
  }

  public nextPage(): void {
    if (this.currentIndex <= this.totalPages) {
      this.currentIndex += 1;
      this.nextDocuments(1);

      if ((this.currentIndex > this.windowSize) && this.currentIndex < (this.totalPages - 1)) {
        this.updateWindowArray('next');
      }
    }
  }

  public prevPage(): void {
    if (this.currentIndex >= 1) {
      this.currentIndex -= 1;
      this.prevDocuments(1);

      if ((this.currentIndex > (this.windowSize - 1)) && this.currentIndex < (this.totalPages - 2)) {
        this.updateWindowArray('prev');
      }
    }
  }

  public setFirstwindowArray(): void {
    this.currentIndex = 1;
    let aux: number = 1;
    if (this.totalPages >= 6) {
      for (let index = 0; index < this.windowSize; index++) {
        aux += 1;
        this.windowArray[index] = aux;
      }
    }
    this.getFirstDocument(this.path);
  }

  public setLastwindowArray(): void {
    this.currentIndex = this.totalPages;
    let aux: number = -this.windowSize;
    if (this.totalPages >= 6) {
      for (let index = 0; index < this.windowSize; index++) {
        this.windowArray[index] = this.totalPages + aux;
        aux += 1;
      }
    }
    this.getLastDocuments(this.path);
  }
}
