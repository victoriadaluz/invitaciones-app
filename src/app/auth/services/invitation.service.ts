// src/app/invitations/services/invitation.service.ts
import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  getDocs,
} from '@angular/fire/firestore';
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
  private firestore = inject(Firestore);
  private storage = inject(Storage);
  private auth = inject(Auth);

  // Subir imagen a Storage y obtener URL
  async uploadImage(file: File, invitationId: string): Promise<string> {
    const imageRef = ref(
      this.storage,
      `invitations/${invitationId}/background.jpg`,
    );
    await uploadBytes(imageRef, file);
    return await getDownloadURL(imageRef);
  }

  // Crear invitación (primero sin imagen)
  async createInvitation(
    data: Omit<
      Invitation,
      'id' | 'createdAt' | 'hostId' | 'backgroundImageUrl'
    >,
  ): Promise<string> {
    const user = this.auth.currentUser;
    if (!user) throw new Error('Usuario no autenticado');

    const newInvitation: Omit<Invitation, 'id'> = {
      ...data,
      hostId: user.uid,
      backgroundImageUrl: '', // temporal, se actualizará después
      createdAt: new Date(),
    };

    const docRef = await addDoc(
      collection(this.firestore, 'invitations'),
      newInvitation,
    );
    return docRef.id;
  }

  // Actualizar URL de imagen después de subir
  async updateImageUrl(invitationId: string, imageUrl: string): Promise<void> {
    const docRef = doc(this.firestore, 'invitations', invitationId);
    await updateDoc(docRef, { backgroundImageUrl: imageUrl });
  }

  // Obtener invitación por ID (para vista pública)
  async getInvitationById(id: string): Promise<Invitation | null> {
    const docRef = doc(this.firestore, 'invitations', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Invitation;
    }
    return null;
  }

  // Obtener invitaciones del usuario
  async getUserInvitations(): Promise<Invitation[]> {
    const user = this.auth.currentUser;
    if (!user) return [];
    const q = query(
      collection(this.firestore, 'invitations'),
      where('hostId', '==', user.uid),
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() }) as Invitation,
    );
  }
}
