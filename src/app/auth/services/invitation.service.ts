// src/app/invitations/services/invitation.service.ts
import {
  EnvironmentInjector,
  Injectable,
  runInInjectionContext,
} from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  getDoc,
  updateDoc,
  query,
  where,
  getDocs,
  setDoc,
} from '@angular/fire/firestore/lite';
import {
  Storage,
  ref,
  uploadBytes,
  getDownloadURL,
} from '@angular/fire/storage';
import { Auth } from '@angular/fire/auth';
import { Invitation } from '../../invitations/interfaces/invitation.interface';

@Injectable({ providedIn: 'root' })
export class InvitationService {
  private readonly firebaseTimeoutMs = 20000;

  constructor(
    private firestore: Firestore,
    private storage: Storage,
    private auth: Auth,
    private environmentInjector: EnvironmentInjector,
  ) {}

  // Subir imagen a Storage y obtener URL
  uploadImage(file: File, invitationId: string): Promise<string> {
    console.log('uploadImage: start', invitationId);
    const imageRef = this.runInFirebaseContext(() =>
      ref(this.storage, `invitations/${invitationId}/background.jpg`),
    );
    
    return this.withFirebaseTimeout(
      this.runInFirebaseContext(() => uploadBytes(imageRef, file)),
      'La subida de la imagen',
    )
      .then(() => {
        console.log('uploadImage: upload complete');
        return this.withFirebaseTimeout(
          this.runInFirebaseContext(() => getDownloadURL(imageRef)),
          'La obtención de la URL de la imagen',
        );
      })
      .then(url => {
        console.log('uploadImage: success', url);
        return url;
      })
      .catch(err => {
        console.error('uploadImage: error', err);
        throw err;
      });
  }

  // Crear invitación (primero sin imagen)
  createInvitation(
    data: Omit<
      Invitation,
      'id' | 'createdAt' | 'hostId' | 'backgroundImageUrl'
    >,
  ): Promise<string> {
    console.log('createInvitation: start');
    const user = this.auth.currentUser;
    if (!user) return Promise.reject(new Error('Usuario no autenticado'));

    const docId = this.generateId();
    console.log('createInvitation: docId generated', docId);

    const newInvitation: Omit<Invitation, 'id'> = {
      ...data,
      hostId: user.uid,
      backgroundImageUrl: '',
      createdAt: new Date(),
    };

    const docRef = this.runInFirebaseContext(() =>
      doc(this.firestore, 'invitations', docId),
    );
    console.log('createInvitation: docRef created', docRef);
    console.log('createInvitation: calling setDoc...');

    return this.withFirebaseTimeout(
      this.runInFirebaseContext(() => setDoc(docRef, newInvitation)),
      'La creación de la invitación',
    )
      .then(() => {
        console.log('createInvitation: setDoc complete');
        console.log('createInvitation: success', docId);
        return docId;
      })
      .catch(err => {
        console.error('createInvitation: error caught:', err);
        throw err;
      });
  }

  private generateId(): string {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }

  // Actualizar URL de imagen después de subir
  updateImageUrl(invitationId: string, imageUrl: string): Promise<void> {
    console.log('updateImageUrl: start', invitationId);
    const docRef = this.runInFirebaseContext(() =>
      doc(this.firestore, 'invitations', invitationId),
    );
    return this.withFirebaseTimeout(
      this.runInFirebaseContext(() =>
        updateDoc(docRef, { backgroundImageUrl: imageUrl }),
      ),
      'La actualización de la imagen',
    )
      .then(() => {
        console.log('updateImageUrl: success');
      })
      .catch(err => {
        console.error('updateImageUrl: error', err);
        throw err;
      });
  }

  // Obtener invitación por ID (para vista pública)
  getInvitationById(id: string): Promise<Invitation | null> {
    console.log('getInvitationById: start', id);
    const docRef = this.runInFirebaseContext(() =>
      doc(this.firestore, 'invitations', id),
    );
    return this.withFirebaseTimeout(
      this.runInFirebaseContext(() => getDoc(docRef)),
      'La carga de la invitación',
    )
      .then(docSnap => {
        if (docSnap.exists()) {
          console.log('getInvitationById: found');
          return { id: docSnap.id, ...docSnap.data() } as Invitation;
        }
        console.log('getInvitationById: not found');
        return null;
      })
      .catch(err => {
        console.error('getInvitationById: error', err);
        throw err;
      });
  }

  // Obtener invitaciones
  getUserInvitations(): Promise<Invitation[]> {
    console.log('getUserInvitations: start');
    const user = this.auth.currentUser;
    if (!user) return Promise.resolve([]);
    
    const q = this.runInFirebaseContext(() =>
      query(
        collection(this.firestore, 'invitations'),
        where('hostId', '==', user.uid),
      ),
    );
    return this.withFirebaseTimeout(
      this.runInFirebaseContext(() => getDocs(q)),
      'La carga de invitaciones',
    )
      .then(querySnapshot => {
        const results = querySnapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() }) as Invitation,
        );
        console.log('getUserInvitations: success', results.length);
        return results;
      })
      .catch(err => {
        console.error('getUserInvitations: error', err);
        throw err;
      });
  }

  private runInFirebaseContext<T>(operation: () => T): T {
    return runInInjectionContext(this.environmentInjector, operation);
  }

  private async withFirebaseTimeout<T>(
    operation: Promise<T>,
    action: string,
  ): Promise<T> {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    const timeout = new Promise<never>((_, reject) => {
      timeoutId = setTimeout(() => {
        reject(
          new Error(
            `${action} no respondió después de ${this.firebaseTimeoutMs / 1000} segundos. Revisá que Cloud Firestore esté creado, que las reglas permitan escribir al usuario autenticado y que el navegador tenga conexión con Firebase.`,
          ),
        );
      }, this.firebaseTimeoutMs);
    });

    try {
      return await Promise.race([operation, timeout]);
    } finally {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    }
  }
}
