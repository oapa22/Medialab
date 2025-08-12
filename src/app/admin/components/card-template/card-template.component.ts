import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { filter, switchMap  } from 'rxjs';

import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { FirestoreService } from '../../../medialab/services/firebase.service';
import { Timestamp } from 'firebase/firestore';
import { ResquestLoaderRenderService } from '../../../shared/renders/resquest-loader.service';
import { ConfirmDialogService } from '../../../shared/renders/confirm-dialog.service';
import { User } from '../../../shared/interfaces/user.interface';
import { CounterDocService } from '../../../shared/services/counter-doc.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'admin-card-template',
    templateUrl: './card-template.component.html',
    styleUrl: './card-template.component.css',
    standalone: false
})
export class CardTemplateComponent implements OnInit{
  @Input() public userTemplate:boolean = false;
  @Input() public imageSrc:string = '';
  @Input() public title:string = '';
  @Input() public date:string = '';
  @Input() public summary:string = '';
  @Input() public id:string = '';
  @Input() public paramRoute:'noticia' | 'usuario' | 'reservacion' |'' = '';
  @Input() public path!: 'user'|'project'|'reservations';

  public route:string = '';
  public hasLoaded:boolean = false;
  public isAdmin: boolean = false;

  constructor(
    private router:Router,
    private counterService:CounterDocService,
    private firestore: FirestoreService,
    private dialog:MatDialog,
    private confirmDialog:ConfirmDialogService,
    private requestLoader:ResquestLoaderRenderService,
    private snackBar: MatSnackBar
  ){}

  ngOnInit(): void {
    this.route =  this.paramRoute + '/'+this.id;
    this.firestore.getDocUS<User>('user', this.id).subscribe((user) => {
      if (user) {
        this.isAdmin = user.isAdmin ?? false;
      }
    });
  }

  public navigateToNewElement():void{
    this.router.navigate(['admin/editar-'+this.route]);
  }

  public onLoad():void{
    this.hasLoaded = true;
  }

  // public onDeleteElement():void{
  //   let request:boolean = false;
  //   let title:string = '¿Desea eliminar este '+ this.paramRoute + '?' ;
  //   let description:string = 'Si acepta el proceso será irreversible y se eliminará el '+ this.paramRoute+' de la base de datos.';

  //   this.confirmDialog.openConfirmDialog(title, description).then((confirmed) => {
  //     if(confirmed){
  //       this.firestore.deleteDoc(this.path,this.id)
  //       let title:string = this.paramRoute.toUpperCase() + ' ELIMINADO';
  //       let description:string = 'Espere un momento mientras los datos son removidos de la nube.';
  //       this.requestLoader.initRequestLoader(title,description);

  //       // Decrementar el contador
  //       this.counterService.decrementCounter(this.path).then( (res) => {
  //         window.location.reload();
  //         // console.log('Se ha decrementador el contador de ', this.path);
  //       }).catch((error) => {
  //         console.error('Error al actualizar el mensaje:', error);
  //       });
  //     }
  //   });

  //   // dialogRef.afterClosed()
  //   //   .pipe(
  //   //     // filter((result:boolean) => result),
  //   //     // switchMap(() => this.firestoreService.deleteDoc(paramRoute,id)),
  //   //     // filter((wasDeleted:boolean) => wasDeleted)
  //   //   )
  //   //   .subscribe(() => {
  //   //     console.log('se eejcuto el confirmdialog');
  //   //     // this.router.navigate(['/heroes']);
  //   //   });
  // }

  public onDeleteElement(): void {
    const title: string = '¿Desea eliminar este ' + this.paramRoute + '?';
    const description: string = 'Si acepta el proceso será irreversible y se eliminará el ' + this.paramRoute + ' de la base de datos.';
  
    this.confirmDialog.openConfirmDialog(title, description).then((confirmed) => {
      if (confirmed) {
        this.requestLoader.initRequestLoader(
          `${this.paramRoute.toUpperCase()} ELIMINADO`,
          'Espere un momento mientras los datos son removidos de la nube.'
        );
  
        this.firestore.deleteDoc(this.path, this.id).then(() => {
          this.counterService.decrementCounter(this.path)
            .catch((error) => {
              console.error('Error al actualizar el contador:', error);
            });
            this.requestLoader.closeRequestLoader();
        }).catch((error) => {
          console.error('Error al eliminar el documento:', error);
          this.requestLoader.closeRequestLoader();
        });
      }
    });
  }

  public acceptReservation(): void {
    if (this.paramRoute === 'reservacion' && this.id) {
      const title: string = '¿Desea aceptar esta reservación?';
      const description: string = 'La reservación será marcada como Aceptada y aparecerá en el calendario.';

      this.confirmDialog.openConfirmDialog(title, description).then((confirmed) => {
        if (confirmed) {
          this.requestLoader.initRequestLoader(
            'RESERVACIÓN ACEPTADA',
            'Espere un momento mientras se actualizan los datos.'
          );

          this.firestore.updateDoc('reservations', this.id, { status: 'Aceptada' }).then(() => {
            this.requestLoader.closeRequestLoader();
            this.snackBar.open('Reservación aceptada con éxito', 'Cerrar', { duration: 3000 });
          }).catch((error) => {
            console.error('Error al aceptar la reservación:', error);
            this.requestLoader.closeRequestLoader();
            this.snackBar.open('Error al aceptar la reservación', 'Cerrar', { duration: 3000 });
          });
        }
      });
    }
  }

  public toggleAdmin(event: any): void {
    const isAdmin = event.target.checked; // Capturamos el estado del checkbox.

    // Actualizar en la base de datos
    this.firestore.updateDoc('user', this.id, { isAdmin })
      .then(() => {
        console.log('El usuario ha sido actualizado');
      })
      .catch((error) => {
        console.error('Error al actualizar el usuario:', error);
      });
  }
}
