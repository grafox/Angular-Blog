import { Injectable } from '@angular/core';
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getDatabase, Database } from 'firebase/database';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD4zP6yqrrptAtzsiGbC1Vo3P0Q6hiiiRg",
  authDomain: "angular-cms-blog-6f976.firebaseapp.com",
  databaseURL: "https://angular-cms-blog-6f976-default-rtdb.firebaseio.com",
  projectId: "angular-cms-blog-6f976",
  storageBucket: "angular-cms-blog-6f976.firebasestorage.app",
  messagingSenderId: "346357465757",
  appId: "1:346357465757:web:930675385bb8443ba28a74",
  measurementId: "G-1C9DJTTK9Q"
};

@Injectable({ providedIn: 'root' })
export class FirebaseService {
  private app: FirebaseApp;
  db: Database;

  constructor() {
    this.app = initializeApp(firebaseConfig);
    this.db = getDatabase(this.app);
  }
}
