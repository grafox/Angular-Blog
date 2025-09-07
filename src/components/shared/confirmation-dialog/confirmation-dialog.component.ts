import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirmation-dialog',
  template: `
    @if (isOpen()) {
      <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center transition-opacity" (click)="onCancel()">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md m-4 transform transition-all" (click)="$event.stopPropagation()">
          <h2 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">{{ title() }}</h2>
          <p class="text-gray-600 dark:text-gray-300 mb-6">{{ message() }}</p>
          <div class="flex justify-end space-x-4">
            <button (click)="onCancel()" type="button" class="px-4 py-2 rounded-md text-sm font-medium bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:ring-offset-gray-800">
              {{ cancelButtonText() }}
            </button>
            <button (click)="onConfirm()" type="button" class="px-4 py-2 rounded-md text-sm font-medium bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:ring-offset-gray-800">
              {{ confirmButtonText() }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmationDialogComponent {
  isOpen = input.required<boolean>();
  title = input<string>('Are you sure?');
  message = input<string>('This action cannot be undone.');
  confirmButtonText = input<string>('Yes');
  cancelButtonText = input<string>('No');

  confirm = output<void>();
  cancel = output<void>();

  onConfirm() {
    this.confirm.emit();
  }

  onCancel() {
    this.cancel.emit();
  }
}
