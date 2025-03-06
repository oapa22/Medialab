import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { User } from '../../../shared/interfaces/user.interface';
import { FirestoreService } from '../../services/firebase.service';
import { AuthServiceService } from '../../../auth/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import emailjs, { type EmailJSResponseStatus } from '@emailjs/browser';
import { ResquestLoaderRenderService } from '../../../shared/renders/resquest-loader.service';
import { Timestamp } from '@angular/fire/firestore';


@Component({
    selector: 'radio-contact-page',
    templateUrl: './contact-page.component.html',
    styleUrls: ['./contact-page.component.css'],
    standalone: false
})
export class ContactPageComponent implements OnInit{
  docId!: string;
  user: User = {
    uid: '',
    id: '',
    names: '',
    email: '',
    password: '',
    isAdmin: false,
    likedProjects: [],
    date: Timestamp.now(),
  }
  form: FormGroup = this.fb.group({
    from_name: '',
    from_correo: '',
    subject: '',
    message: '',
  })

  constructor(
    private fb: FormBuilder,
    private auth: AuthServiceService,
    private firestoreService:FirestoreService,
    private requestLoader: ResquestLoaderRenderService,
    private router:Router,){}

  public ngOnInit(): void {
    this.auth.stateUser().subscribe(res => {
      if (res) {
        this.docId = res.uid;
        this.getUser()
      }
    });
  }

  async sendEmail(){
    // Verifica si el usuario está autenticado
    if (!this.docId) {
      this.router.navigate(['/radio-utpl/autenticacion']);
      return;
    }

    let title: string = 'ENVIANDO MENSAJE';
    let description: string = 'Espere un momento mientras se envía el mensaje.';
    this.requestLoader.initRequestLoader(title, description);

    emailjs.init('v9Jc6E1WTzypPNxUz');
    let response = await emailjs.send("service_f8azjfc","template_3cvwgrg",{
      from_name: this.user.names,
      from_correo: this.user.email,
      subject: this.form.value.subject,
      message: this.form.value.message,
    });
    this.form.reset;
  }

  getUser(){
    const path = 'user'
    this.firestoreService.getDocProject<User>(path, this.docId).subscribe( res => {
      this.user = {
        uid: res!.uid,
        id: res!.id,
        names: res!.names,
        email: res!.email,
        password: '',
        isAdmin: res!.isAdmin,
        likedProjects: res!.likedProjects,
        date: res!.date
      };
    });
  }
}
