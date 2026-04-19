import { Component, Inject, Input, OnDestroy, signal } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { KeycloakProfile } from 'keycloak-js';
import { UserProfileService } from '../../../services/user-profile.service';
import { FormControl, Validators } from '@angular/forms';
import { merge, Subject, takeUntil } from 'rxjs';
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Client } from '../../../models/client';

@Component({
  selector: 'app-update-user-profile',
  standalone: false,
  templateUrl: './update-user-profile.component.html',
  styleUrl: './update-user-profile.component.css',
})
export class UpdateUserProfileComponent implements OnDestroy {
  public readonly phoneFormControl = new FormControl("", [
    Validators.required,
    Validators.pattern(/^(?:\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/)
  ]);
  public errorMessage = signal("");  public isLoading = signal(false);
  private destroyDialogFlag: Subject<void> = new Subject<void>();

  constructor(
    private dialogReference: MatDialogRef<UpdateUserProfileComponent, boolean>,
    @Inject(MAT_DIALOG_DATA) public data: Client,
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
    // Prevent multiple clicks while loading
    if (this.isLoading()) {
      return;
    }

    // grab the value from the form control instead of a separate property
    const phoneValue = this.phoneFormControl.value as string || "";
    console.info("Phone number", phoneValue);
    let client: Client = {
      id: this.data.id ?? "",
      contactEmail: this.data.contactEmail ?? "",
      contactPhone: phoneValue,
      name: this.data.name
    };
    
    this.isLoading.set(true);
    this.userProfileSvc.updateShipperAccount(this.data.id ?? "", client)
    .pipe(takeUntil(this.destroyDialogFlag))
    .subscribe({
      next: () => {
        this.isLoading.set(false);
        this.dialogReference.close();
      },
      error: (error) => {
        this.isLoading.set(false);
        console.error('Error updating user profile:', error);
        this.errorMessage.set('Failed to update profile. Please try again.');
      }
    });
  }

  cancelDialog() {
    this.dialogReference.close(true);
  }

  ngOnDestroy(): void {
    this.destroyDialogFlag.next();
    this.destroyDialogFlag.complete();
  }
}
