import { Component, Inject, signal } from '@angular/core';
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
  public readonly phoneFormControl = new FormControl("", [
    Validators.required,
    Validators.pattern(/^(?:\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/)
  ]);
  public errorMessage = signal("");


  constructor(
    private dialogReference: MatDialogRef<UpdateUserProfileComponent, boolean>,
    @Inject(MAT_DIALOG_DATA) public data: KeycloakProfile,
    private userProfileSvc: UserProfileService
  ) {
    merge(this.phoneFormControl.statusChanges, this.phoneFormControl.valueChanges)
        .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage());
  }

  ngOnInit(): void {
    console.log("Data passed", this.data);
  }

  updateErrorMessage() {
    if (this.phoneFormControl.hasError("required")) {
      this.errorMessage.set("You must enter a value")
    } else if (this.phoneFormControl.hasError("phone")) {
      this.errorMessage.set("Not a valid phone!")
    } else {
      this.errorMessage.set("");
    }
  }

  closeDialog() {
    // grab the value from the form control instead of a separate property
    const phoneValue = this.phoneFormControl.value as string || "";
    console.info("Phone number", phoneValue);
    this.userProfileSvc.upsertUserProfile({
      contactEmail: this.data.email ?? "",
      contactPhone: phoneValue,
      name: this.data.firstName + " " + this.data.lastName
    }).subscribe();
    this.dialogReference.close();
  }

  cancelDialog() {
    this.dialogReference.close(true);
  }
}
