import { Injectable, signal, effect } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  currentTheme = signal<'light' | 'dark'>('dark'); // Default to dark

  constructor() {
    // Load theme from localStorage on initialization
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      this.currentTheme.set(savedTheme);
    }

    // Effect to apply theme class to the document's html element
    effect(() => {
      const theme = this.currentTheme();
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('theme', theme);
    });
  }

  toggleTheme() {
    this.currentTheme.update(theme => (theme === 'light' ? 'dark' : 'light'));
  }
}