/**
 * Servicio para la gestión de traducciones mediante ngx-translate.
 */
import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

@Injectable({ providedIn: 'root' })
export class TranslationService {
  private readonly LANG_KEY = 'selectedLanguage';
  private readonly defaultLang = 'es';

  constructor(private translate: TranslateService) {
    const savedLang = this.getStoredLanguage();
    translate.addLangs(['es', 'en', 'pt']);
    translate.setDefaultLang(this.defaultLang);
    translate.use(savedLang);
  }

  /** Cambia el idioma actual */
  changeLanguage(lang: string) {
    this.storeLanguage(lang);
    this.translate.use(lang);
  }

  /** Devuelve el idioma actual */
  getCurrentLang(): string {
    return this.translate.currentLang;
  }

  /** Obtiene el idioma guardado en localStorage */
  getStoredLanguage(): string {
    return localStorage.getItem(this.LANG_KEY) || this.defaultLang;
  }

  /** Guarda el idioma en localStorage */
  storeLanguage(lang: string): void {
    localStorage.setItem(this.LANG_KEY, lang);
  }
}
