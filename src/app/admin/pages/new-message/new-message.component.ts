import { Component, OnInit } from '@angular/core';
import { FirestoreService } from './../../../radio/services/firebase.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Message } from './../../../shared/interfaces/message.interface';
import { Timestamp } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { switchMap } from 'rxjs';
import { ResquestLoaderRenderService } from '../../../shared/renders/resquest-loader.service';
import { CounterDocService } from '../../../shared/services/counter-doc.service';

@Component({
    selector: 'admin-new-message',
    templateUrl: './new-message.component.html',
    styleUrls: ['./new-message.component.css'],
    standalone: false
})
export class NewMessageComponent implements OnInit{
  imageSrc: string | ArrayBuffer | null = null;
  audioSrc: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  selectedAudio: File | null = null;

  date = '';
  dateN = '';
  message: Message = {
    id: '',
    name: '',
    date: Timestamp.now(),
    photo_url: '',
    photo_filename: '',
    audio_filename: '',
    audio_url: '',
  }

  public messageForm = new FormGroup({
    name: new FormControl<string>(''),
  });

  public fileImageSelec!:File;
  public fileAudioSelec!:File;
  public fileImageName:string= 'Ninguna imagen seleccionada';
  public fileAudioName:string= 'Ningun audio seleccionado';
  public currentDate:string  = '';
  public currentRoute:string = '';

  constructor(
    private firestore: FirestoreService,
    private activatedRoute:ActivatedRoute,
    private storage: AngularFireStorage,
    private counterService:CounterDocService,
    private router:Router,

    private requestLoader:ResquestLoaderRenderService
  ) {}

  ngOnInit(): void {
    this.formatDate();
    this.currentRoute = this.router.url;
    if(this.router.url.includes('editar-mensaje')){
      this.activatedRoute.params.pipe(
        switchMap(({id}) => this.firestore.getDocMessage<Message>('message',id))
      ).subscribe(message => {
          if (!message) return this.router.navigateByUrl('/');
          this.message = message;
          this.messageForm.reset(message);
          this.fileImageName = message.photo_filename;
          this.fileAudioName = message.audio_filename;
          if (message.photo_url) {
            this.imageSrc = message.photo_url;
          }
          if (message.audio_url) {
            this.audioSrc = message.audio_url;
          }
          this.formatDate();
          return;
      });
    }

    // if(this.currentRoute.includes('editar-mensaje'))
  }

  public onFileSelected(event: Event, file:'image'|'audio'): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      // Obtener el nombre del archivo

      if (file == 'image'){
        this.fileImageSelec = input.files[0];
        this.fileImageName = input.files[0].name;
      } else {
        this.fileAudioSelec = input.files[0];
        this.fileAudioName = input.files[0].name;
      }

    }
  }

  // updateMessage():void{
  //   let title:string = 'ACTUALIZANDO MENSAJE';
  //   let description:string = 'Espere un momento mientras los datos se suben a la nube.';

  //   this.requestLoader.initRequestLoader(title,description);

  //   this.message.name = this.currentMessageFormValue.name;

  //   if (this.message.id) {
  //     const path = 'message';
  //     const id = this.message.id;
  //     this.firestore.updateDoc(path, id, this.message).then((res) => {
  //       console.log('res->',res)
  //     }).catch((error) => {
  //       console.error('Error al actualizar el mensaje:', error);
  //     });
  //   }
  // }


  selectImage(event: any): void {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = e => this.imageSrc = reader.result;
      reader.readAsDataURL(this.selectedFile);
    }
  }

  // selectImage(event: any): void {
  //   const input = event.target as HTMLInputElement;
  //   if (input.files && input.files.length > 0) {
  //     this.selectedFile = input.files[0];
  //     this.message.photo_filename = input.files[0].name;
  //     const reader = new FileReader();
  //     reader.onload = e => this.imageSrc = reader.result;
  //     reader.readAsDataURL(this.selectedFile);
  //   }
  // }

  selectAudio(event: any): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedAudio = input.files[0];
      this.message.audio_filename = input.files[0].name;
      const reader = new FileReader();
      reader.onload = e => this.audioSrc = reader.result;
      reader.readAsDataURL(this.selectedAudio);
    }
  }

  createMessage() {
    if(this.currentRoute.includes('nuevo')){
      let title: string = 'CREANDO MENSAJE';
      let description: string = 'Espere un momento mientras los datos se suben en la nube.';
      this.requestLoader.initRequestLoader(title, description);

      if (this.selectedFile && this.selectedAudio) {
        const filePath = `images_message/${this.selectedFile.name}`;
        const fileRef = this.storage.ref(filePath);
        const task = this.storage.upload(filePath, this.selectedFile);

        task.snapshotChanges().toPromise().then(() => {
          fileRef.getDownloadURL().toPromise().then(url => {
            this.message.photo_url = url;
            this.message.photo_filename = this.selectedFile?.name || '';
            this.createAudio();
          }).catch(error => console.log('Error getting download URL', error));
        }).catch(error => console.log('Error uploading file', error));
      }
    } else {
      let title:string = 'ACTUALIZANDO MENSAJE';
      let description:string = 'Espere un momento mientras los datos se actualizan a la nube.';
      this.requestLoader.initRequestLoader(title,description);

      if (this.selectedFile || this.selectedAudio) {
        if (this.selectedFile) {
          const filePath = `images_message/${this.selectedFile.name}`;
          const fileRef = this.storage.ref(filePath);
          const task = this.storage.upload(filePath, this.selectedFile);

          task.snapshotChanges().toPromise().then(() => {
            fileRef.getDownloadURL().toPromise().then(url => {
              this.message.photo_url = url;
              this.message.photo_filename = this.selectedFile?.name || '';
              if (this.selectedAudio) {
                this.createAudio();
              } else {
                this.createMessageF();
              }
            }).catch(error => console.log('Error getting download URL', error));
          }).catch(error => console.log('Error uploading file', error));
        } else if (this.selectedAudio) {
          this.createAudio();
        }
      } else {
        this.createMessageF();
      }
    }
  }

  createAudio() {
    if (this.selectedAudio) {
      const audioPath = `audio_message/${this.selectedAudio.name}`;
      const audioRef = this.storage.ref(audioPath);
      const audioTask = this.storage.upload(audioPath, this.selectedAudio);

      audioTask.snapshotChanges().toPromise().then(() => {
        audioRef.getDownloadURL().toPromise().then(url => {
          this.message.audio_url = url;
          this.message.audio_filename = this.selectedAudio?.name || '';
          this.createMessageF();
        }).catch(error => console.log('Error getting audio download URL', error));
      }).catch(error => console.log('Error uploading audio', error));
    }
  }

  createMessageF() {
    const path = 'message'
    if(this.currentRoute.includes('nuevo')){
      const id = this.firestore.createId();

      this.message.name = this.currentMessageFormValue.name;

      this.message.id = id;
      this.message.date = Timestamp.now();

      this.firestore.createDoc(this.message, path, id).then(res => {
        console.log('respuesta ->', res);

        this.counterService.incrementCounter('message').then( (res) => {
          // this.router.navigate(['radio-utpl/admin/lista-podcasts']);
          // console.log('Se ha incrementado el contador de messages');
        }).catch((error) => {
          console.error('Error al actualizar el mensaje:', error);
        });
      }).catch(error => console.log('Error creating document', error));
    } else {
      this.message.name = this.currentMessageFormValue.name;

      if (this.message.id) {
        const id = this.message.id;
        this.firestore.updateDoc(path, id, this.message).then((res) => {
          console.log('res->',res)
        }).catch((error) => {
          console.error('Error al actualizar el mensaje:', error);
        });
      }
    }
  }

  formatDate() {
    const date = this.message.date.toDate();

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

  public get currentMessageFormValue(): Message {
    const message = this.messageForm.value as Message;
    message.date = this.message.date;  // Mantener la fecha original
    return message;
  }
}
