import { Component, OnInit, VERSION } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { NameInfoService } from './services/name-info.service';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  nameMessage: string;
  userInfoForm: FormGroup;

  constructor(
    private nameInfoService: NameInfoService,
    private formBuilder: FormBuilder
  ) {
    this.setLuckyNumber('');
  }

  ngOnInit(): void {
    this.userInfoForm = this.formBuilder.group({
      name: ['', [Validators.required, atLeastTwoWordsValidator]],
      emailId: ['', [Validators.required, Validators.email]],
      reEnteredEmailId: [
        '',
        [Validators.required, Validators.email, matchEmailValidator]
      ],
      password: ['', [Validators.required, Validators.pattern('.{8,}')]]
    });

    // dynamically call when name chnages with debounce of 500ms
    this.userInfoForm.get('name').valueChanges.pipe(
      debounceTime(500), distinctUntilChanged()).subscribe(name => {
      this.setLuckyNumber(name);
    });

    this.userInfoForm.get('emailId').valueChanges.subscribe(nemailame => {
      this.onBaseEmailIdChnage();
    });
  }

  // set lucky number
  setLuckyNumber(name: string): void {
    this.nameInfoService.getNameInfo(name).subscribe(a => {
      this.nameMessage = a;
    });
  }

  onBaseEmailIdChnage(): void {
    this.userInfoForm.controls['reEnteredEmailId'].updateValueAndValidity();
  }

  onSubmit(): void {}
}
/**
 * @param {AbstractControl} control
 * @returns {ValidationErrors | null}
 */

//Match email validator
export const matchEmailValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  if (!control.parent || !control) {
    return null;
  }

  const emailId = control.parent.get('emailId');
  const reEnteredEmailId = control.parent.get('reEnteredEmailId');

  if (!emailId || !reEnteredEmailId) {
    return null;
  }

  if (reEnteredEmailId.value === '') {
    return null;
  }

  if (emailId.value === reEnteredEmailId.value) {
    return null;
  }

  return { emailNotMatching: true };
};

//At least two words validator
export const atLeastTwoWordsValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  if (!control.parent || !control) {
    return null;
  }

  const name = control.parent.get('name');

  if (!name) {
    return null;
  }

  if (name.value === '') {
    return null;
  }

  if (name.value.trim().split(' ').length >= 2) {
    return null;
  }

  return { validFullname: true };
};
