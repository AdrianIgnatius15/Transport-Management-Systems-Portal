import { Component, Inject, signal } from '@angular/core';
import { Client } from '../../../models/client';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { KeycloakProfile } from 'keycloak-js';
import { UserProfileService } from '../../../services/user-profile.service';
import { FormControl, Validators } from '@angular/forms';
import { merge } from 'rxjs';
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Component({
  selector: 'app-update-user-profile',
  standalone: false,
  templateUrl: './update-user-profile.component.html',
  styleUrl: './update-user-profile.component.css',
})
export class UpdateUserProfileComponent {
  public readonly emailFormControl = new FormControl("", [Validators.required, Validators.email]);
  public errorMessage = signal("");

  public user: Client = new Client();

  constructor(
    private dialogReference: MatDialogRef<UpdateUserProfileComponent, boolean>,
    @Inject(MAT_DIALOG_DATA) public data: KeycloakProfile,
    private userProfileSvc: UserProfileService
  ) {
    merge(this.emailFormControl.statusChanges, this.emailFormControl.valueChanges)
        .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage());
  }

  ngOnInit(): void {
    console.log("Data passed", this.data);
  }

  updateErrorMessage() {
    if (this.emailFormControl.hasError("required")) {
      this.errorMessage.set("You must enter a value")
    } else if (this.emailFormControl.hasError("email")) {
      this.errorMessage.set("Not a valid email")
    } else {
      this.errorMessage.set("");
    }
  }

  closeDialog() {
    // this.userProfileSvc.upsertUserProfile()
    this.dialogReference.close();
  }

  cancelDialog() {
    this.dialogReference.close(true);
  }
}
