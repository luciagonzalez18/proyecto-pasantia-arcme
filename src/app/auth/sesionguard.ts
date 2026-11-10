
// Importamos las herramientas necesarias de Angular.
import { CanActivateFn, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';

// Importamos herramientas para controlar la respuesta.
import { map, catchError, of } from 'rxjs';

// Creamos el Guard que controla el acceso a las páginas.
export const sesionGuard: CanActivateFn = () => {

  // Obtenemos HttpClient para comunicarnos con PHP.
  const http = inject(HttpClient);

  // Obtenemos Router para poder redirigir al usuario.
  const router = inject(Router);

  // Consultamos a PHP si existe una sesión activa.
  return http.get<{sesion: boolean}>(
    '/apiArcme/public/index.php/verificar-sesion'
  ).pipe(

    // Comprobamos la respuesta que devuelve PHP.
    map(respuesta => {

      // Si existe una sesión, permitimos entrar.
      if (respuesta.sesion) {
        return true;
      }

      // Si no existe una sesión, redirigimos al login.
      return router.createUrlTree(['/inicioSesion']);
    }),

    // Si ocurre un error, también redirigimos al login.
    catchError(() => of(router.createUrlTree(['/inicioSesion'])))

  );

};
