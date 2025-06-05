import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Project } from '../../../shared/interfaces/project.interface';

@Component({
    selector: 'medialab-confirm-dialog',
    templateUrl: './confirm-dialog.component.html',
    styleUrl: './confirm-dialog.component.css',
    standalone: false
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Project
  ){}

  public closeDialog() {
    this.dialogRef.close(false);
  }

  public deleteHero() {
    this.dialogRef.close(true);
  }
}
