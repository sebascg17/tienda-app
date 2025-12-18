import { Pipe, PipeTransform } from '@angular/core';
import { I18nService } from '../services/i18n.service';

@Pipe({
  name: 'translate',
  standalone: true,
  pure: false
})
export class TranslatePipe implements PipeTransform {
  constructor(private i18nService: I18nService) {}

  transform(key: string, ...args: any[]): string {
    const translation = this.i18nService.translate(key);

    // Si hay argumentos, hacer sustituciones simples (ej: {0}, {1})
    if (args && args.length > 0) {
      let result = translation;
      args.forEach((arg, index) => {
        result = result.replace(`{${index}}`, arg);
      });
      return result;
    }

    return translation;
  }
}
