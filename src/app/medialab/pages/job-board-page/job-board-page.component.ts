import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';  // Importa MatDialog
import { JobBoardModalComponent } from '../../components/job-board-modal/job-board-modal.component';

@Component({
  selector: 'app-job-board-page',
  standalone: false,
  templateUrl: './job-board-page.component.html',
  styleUrls: ['./job-board-page.component.css']
})
export class JobBoardPageComponent implements OnInit, OnDestroy {

  constructor(private dialog: MatDialog) {}  // Inyecta MatDialog

  ngOnDestroy(): void {
  }

  ngOnInit(): void {
  }

  openForm(): void {
    const dialogRef = this.dialog.open(JobBoardModalComponent, {
      width: '600px', 
      data: {} 
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Postulación enviada', result);
      } else {
        console.log('Modal cerrado sin postulación');
      }
    });
  }

}
