import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-job-board-modal',
  templateUrl: './job-board-modal.component.html',
  styleUrls: ['./job-board-modal.component.css'],
  standalone: false,
})
export class JobBoardModalComponent {

  applicationForm: FormGroup;
  cvFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<JobBoardModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.applicationForm = this.fb.group({
      fullName: ['', [Validators.required]],
      idNumber: ['', [Validators.required]],
      birthDate: ['', [Validators.required]],
      city: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      educationLevel: ['', [Validators.required]],
      career: ['', [Validators.required]],
      institution: ['', [Validators.required]],
      graduationYear: ['', [Validators.required]],
      hasWorkExperience: ['', [Validators.required]],
      lastCompany: [''],
      workedInField: ['', [Validators.required]],
      professionalSkills: ['', [Validators.required]],
      cvFile: [null, [Validators.required]] // <-- ahora es parte del formulario
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      this.applicationForm.get('cvFile')?.setValue(file);
    } else {
      this.applicationForm.get('cvFile')?.setValue(null);
      alert('Por favor, seleccione un archivo PDF válido.');
    }
    this.applicationForm.get('cvFile')?.markAsTouched();
    this.applicationForm.get('cvFile')?.updateValueAndValidity();
  }

  onSubmit(): void {
    if (this.applicationForm.valid) {
      this.dialogRef.close(this.applicationForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
