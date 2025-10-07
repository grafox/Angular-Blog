import { Injectable } from '@angular/core';
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getDatabase, Database } from 'firebase/database';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "X",
  authDomain: "X",
  databaseURL: "",
  projectId: "X",
  storageBucket: "X",
  messagingSenderId: "X",
  appId: "X",
  measurementId: "X"
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
