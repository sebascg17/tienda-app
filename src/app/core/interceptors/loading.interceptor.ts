import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoadingService } from '../services/loading.service';
import { finalize } from 'rxjs/operators';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);

  // Mostrar loading al iniciar petición
  loadingService.show();

  return next(req).pipe(
    // Ocultar loading al finalizar (éxito o error)
    finalize(() => loadingService.hide())
  );
};
