import { Component, OnInit } from '@angular/core';
import { FirestoreService } from './../../../radio/services/firebase.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Project } from './../../../shared/interfaces/project.interface';
import { Timestamp } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { finalize, Subscription, switchMap } from 'rxjs';
import { ResquestLoaderRenderService } from '../../../shared/renders/resquest-loader.service';
import { CounterDocService } from '../../../shared/services/counter-doc.service';

@Component({
    selector: 'admin-new-project',
    templateUrl: './new-project.component.html',
    styleUrls: ['./new-project.component.css'],
    standalone: false
})
export class NewProjectComponent implements OnInit{
  imageSrc: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  summaryError: boolean = false;

  date = '';
  dateN = '';
  project: Project = {
    id: '',
    title: '',
    date: Timestamp.now(),
    keywords: '',
    summary: '',
    photo_url: '',
    photo_filename: '',
    content: '',
    likes: 0,
  }

  // Formulario para obtener los valores
  public projectForm = new FormGroup({
    title: new FormControl<string>(''),
    keywords: new FormControl<string>(''),
    summary: new FormControl<string>(''),
    content: new FormControl<string>('')
  });

  public currentDate:string = '';
  public currentRoute:string = '';
  public fileSelec!:File;
  public fileName:string= 'Ninguna imagen seleccionada';

  constructor(
    private firestore: FirestoreService,
    private counterService:CounterDocService,
    private storage: AngularFireStorage,
    private activatedRoute:ActivatedRoute,
    private router:Router,

    private requestLoader:ResquestLoaderRenderService
  ){}

  ngOnInit(): void {
    this.formatDate();
    this.currentRoute = this.router.url;
    if(this.router.url.includes('editar-noticia')){
      this.activatedRoute.params.pipe(
        switchMap(({id}) => this.firestore.getDocProject<Project>('project',id))
      ).subscribe(project => {
          if (!project) return this.router.navigateByUrl('/');
          this.project = project;
          this.projectForm.reset(project);
          this.fileName = project.photo_filename;
          if (project.photo_url) {
            this.imageSrc = project.photo_url;
          }
          this.formatDate();
          return;
      });
    }
    this.formatDate();
  }


  // Fucion para obtener imagen local del computador.
  public onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      // Obtener el nombre del archivo
      this.fileSelec = input.files[0];
      this.fileName = input.files[0].name;
    }
  }

  public createProjectTest():void{
    let downloadUriSub:Subscription;
    let storageUri: string = '';

    downloadUriSub = this.firestore.downloadUrl$.subscribe((res) => {
      console.log('SUBSCRIBED to download url');
      storageUri = res;
    },
    (err)=>{
      console.log('Error in subscription: ' + err);
    });

    console.log("sadasdsad: "+storageUri);

    // this.firestore.getImageURLFirebase(this.fileSelec, this.fileName).subscribe(urlImage => {
    //   this.project.photo_url = urlImage;
    //   console.log("Esta es la url dentro del metodo: " + urlImage);
    // });

    // console.log("Esta es la url fuera del metodo: "+this.project.photo_url);




    // const path = 'project';
    // const id = this.firestore.createId();

    // this.project = this.projectForm.value as Project;
    // this.project.id = id;
    // this.firestore.getImageURLFirebase(this.fileSelec, this.fileName).subscribe(urlImage => this.project.photo_url = urlImage);
    // this.project.photo_filename = this.fileName
    // this.project.date = this.currentDate;
    // this.project.content = '<div> asdasdasdsa </div>';

    // this.firestore.createDoc(this.project, path, id).then(res => {
    //   console.log('respuesta ->', res);
    // }).catch(error => console.log('Error creating document', error));
  }


  public updateProject():void{
    let title:string = 'CREANDO PROYECTO';
    let description:string = 'Espere un momento mientras los datos se suben a la nube.';

    this.requestLoader.initRequestLoader(title,description);
  }




  selectImage(event: any): void {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = e => this.imageSrc = reader.result;
      reader.readAsDataURL(this.selectedFile);
    }
  }

  createProject() {
    if (!this.currentProjectFormValue.summary) {
      this.summaryError = true;
      return;
    }
    this.project.summary = this.currentProjectFormValue.summary.trim();
    const wordCount = this.project.summary.split(/\s+/).filter(word => word.length > 0).length;  

    console.log('Texto:', this.project.summary);
    console.log('Número de palabras:', wordCount);

    if (wordCount < 15 || wordCount > 20) {
      console.log('no entrar')
      this.summaryError = true;
      console.log(this.project.summary)
      console.log(wordCount)
      return;
    } else {
      console.log('entrar')
      this.summaryError = false;
    }
    if (this.currentRoute.includes('nuevo')) {
      let title:string = 'CREANDO NOTICIA';
      let description:string = 'Espere un momento mientras los datos se suben a la nube.';
      this.requestLoader.initRequestLoader(title,description);
    } else {
      let title:string = 'ACTUALIZANDO NOTICIA';
      let description:string = 'Espere un momento mientras los datos se actualizan a la nube.';
      this.requestLoader.initRequestLoader(title,description);
    }
    if (this.selectedFile) {
      const filePath = `images_project/${this.selectedFile.name}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, this.selectedFile);
      task.snapshotChanges().toPromise().then(() => {
        fileRef.getDownloadURL().toPromise().then(url => {
          this.project.photo_url = url;
          this.project.photo_filename = this.selectedFile?.name || '';
          this.createProjectF();
        }).catch(error => console.log('Error getting download URL', error));
      }).catch(error => console.log('Error uploading file', error));
    } else {
      this.createProjectF();
    }
  }

  createProjectF() {
    const path = 'project';
    this.project.title = this.currentProjectFormValue.title;
    this.project.keywords = this.currentProjectFormValue.keywords;
    this.project.summary = this.currentProjectFormValue.summary;
    this.project.content = this.currentProjectFormValue.content;

    if (this.currentRoute.includes('nuevo')){
      const id = this.firestore.createId();

      this.project.id = id;
      this.project.date = Timestamp.now();

      this.firestore.createDoc(this.project, path, id).then(res => {
        console.log('respuesta ->', res);
        
        this.counterService.incrementCounter('project').then( (res) => {
          // console.log('Se incremento el contador project');
          this.requestLoader.closeRequestLoader();
        }).catch((error) => {
          console.error('Error al actualizar la noticia:', error);
          this.requestLoader.closeRequestLoader();
        });
      }).catch(error => console.log('Error creating document', error));
    } else {

      if (this.project.id) {
        const id = this.project.id;
        this.firestore.updateDoc(path, id, this.project).then((res) => {
          console.log('res->',res)
          this.requestLoader.closeRequestLoader();
        }).catch((error) => {
          console.error('Error al actualizar la noticia:', error);
          this.requestLoader.closeRequestLoader();
        });
      }
    }
  }

  formatDate() {
    const date = this.project.date.toDate();

    const meses = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];

    const dia = date.getDate();
    const mes = meses[date.getMonth()];
    const anio = date.getFullYear();

    this.date = `${dia} de ${mes} de ${anio}`;
    this.dateN = `${dia} de ${mes} de ${anio}`;
  }

  public get currentProjectFormValue(): Project {
    const project = this.projectForm.value as Project;
    project.date = this.project.date;  // Mantener la fecha original
    return project;
  }
}
