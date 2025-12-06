import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

// 1. Importaciones de Firebase
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { Observable } from 'rxjs';

// Inicializa Firebase con la configuración del entorno
const app = initializeApp(environment.firebase);
const auth = getAuth(app);

@Injectable({
  providedIn: 'root'
})
export class FirebaseAuthService {

  private apiUrl = environment.apiUrl + 'Usuarios/google-login';

  constructor(private http: HttpClient) { }

  /**
   * 2. Inicia el proceso de autenticación con Google.
   * Si es exitoso, envía el token a tu Backend de .NET.
   */
  async signInWithGoogle(): Promise<Observable<any>> {
    const provider = new GoogleAuthProvider();

    try {
      // Abre la ventana de Google Pop-up
      const result = await signInWithPopup(auth, provider);

      // 3. Obtiene el ID Token del usuario de Google
      const idToken = await result.user.getIdToken();
      console.log('ID Token de Firebase obtenido:', idToken);

      // 4. Envía el token a tu API de .NET Core
      return this.http.post(this.apiUrl, { idToken: idToken });

    } catch (error) {
      console.error('Error al iniciar sesión con Google:', error);
      throw error;
    }
  }

  /**
   * 3. Inicia el proceso de autenticación con Facebook.
   */
  async signInWithFacebook(): Promise<void> {
    const { FacebookAuthProvider, signInWithRedirect } = await import('firebase/auth');
    const provider = new FacebookAuthProvider();

    try {
      // Usamos Redirect para evitar problemas de Cross-Origin-Opener-Policy
      await signInWithRedirect(auth, provider);
      // El resultado se manejará en el componente donde se llame a getRedirectResult
    } catch (error) {
      console.error('Error al iniciar sesión con Facebook:', error);
      throw error;
    }
  }

  /**
   * 4. Inicia el proceso de autenticación con Microsoft.
   */
  async signInWithMicrosoft(): Promise<void> {
    const { OAuthProvider, signInWithRedirect } = await import('firebase/auth');
    const provider = new OAuthProvider('microsoft.com');

    try {
      await signInWithRedirect(auth, provider);
    } catch (error) {
      console.error('Error al iniciar sesión con Microsoft:', error);
      throw error;
    }
  }

  // Manejar el resultado del redireccionamiento (llamar al iniciar la app/componente)
  async handleRedirectResult(): Promise<Observable<any> | null> {
    const { getRedirectResult } = await import('firebase/auth');
    const result = await getRedirectResult(auth);

    if (result) {
      const idToken = await result.user.getIdToken();
      console.log('ID Token obtenido tras redirect:', idToken);
      return this.http.post(this.apiUrl, { idToken: idToken });
    }
    return null;
  }

}