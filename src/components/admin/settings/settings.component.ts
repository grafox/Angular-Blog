import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BlogService } from '../../../services/blog.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent implements OnInit {
  private fb: FormBuilder = inject(FormBuilder);
  private blogService = inject(BlogService);

  settingsForm!: FormGroup;

  ngOnInit(): void {
    const currentSettings = this.blogService.getSiteSettings()();
    this.settingsForm = this.fb.group({
      blogName: [currentSettings.blogName, Validators.required],
      title: [currentSettings.title, Validators.required],
      subtitle: [currentSettings.subtitle, Validators.required],
      heroImageUrl: [currentSettings.heroImageUrl, Validators.required],
    });
  }

  onSubmit() {
    if (this.settingsForm.invalid) {
      this.settingsForm.markAllAsTouched();
      return;
    }
    this.blogService.updateSiteSettings(this.settingsForm.value);
    alert('Settings saved successfully!');
    this.settingsForm.markAsPristine();
  }
}