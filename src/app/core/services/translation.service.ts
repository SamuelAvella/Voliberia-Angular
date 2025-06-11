import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private readonly LANG_KEY = 'selectedLanguage';
  private readonly defaultLang = 'es';

  constructor(private translate: TranslateService) {
    const savedLang = this.getStoredLanguage();

    translate.addLangs(['es', 'en', 'pt']);
    translate.setDefaultLang(this.defaultLang);
    translate.use(savedLang);
  }

  changeLanguage(lang: string) {
    this.storeLanguage(lang);
    this.translate.use(lang);
  }

  getCurrentLang(): string {
    return this.translate.currentLang;
  }

  getStoredLanguage(): string {
    return localStorage.getItem(this.LANG_KEY) || this.defaultLang;
  }

  storeLanguage(lang: string): void {
    localStorage.setItem(this.LANG_KEY, lang);
  }
}
