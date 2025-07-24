import { raw } from 'hono/html';
import { inject, injectable } from '@joist/di';
import { defaultLang, I18n, Language, useTranslations } from './i18n';
import { languageSelectToJSX } from './language.dropdown.element';

export const appToJSX = (
  t: I18n,
  title: string,
  tick: number,
  time = Date.now(),
  language: Language = defaultLang,
) => (
  <>
    <debug-ctx>
      <zeit-ctx time={time} tick={tick}>
        <div class="wrapper">
          <div class="flex flex-row-reverse">
            <ph-tick></ph-tick>
            <app-clock></app-clock>
            <app-i18n-select class="grid">{languageSelectToJSX(t, language)}</app-i18n-select>
          </div>
          <div class="container mx-auto py-8">
            <div class="text-center mb-6">
              <h1 class="text-2xl font-bold">{t('nav.home')}</h1>
            </div>
          </div>

          More content...
        </div>
      </zeit-ctx>
    </debug-ctx>
  </>
);

export class TranslationProvider {
  #lang: Language = defaultLang;
  translate: I18n = useTranslations(this.#lang);
  set(lang: Language): boolean {
    if (lang === this.#lang) {
      return false;
    }
    this.#lang = lang;
    this.translate = useTranslations(this.#lang);
    return true;
  }
}
@injectable()
export class AppElement extends HTMLElement {
  static observedAttributes = ['lang'];
  #i18n = inject(TranslationProvider);

  connectedCallback() {
    console.log('AppElement connected!');
  }

  attributeChangedCallback(name = 'lang', oldValue: string, newValue: string) {
    if (name !== 'lang' || !newValue) {
      return;
    }

    const i18n = this.#i18n();
    const updated = i18n.set(newValue as Language);
    if (!updated || !oldValue) {
      console.log('App I18n:', newValue, '[no update]');
      return;
    }
    console.log('App I18n:', newValue, '[updated], previously', oldValue);
    const title = 'CS Phlame';
    const zeit = { time: 234, tick: 999 };
    this.innerHTML = raw(
      appToJSX(i18n.translate, title, zeit.tick, zeit.time, newValue as Language),
    );
    console.log('App Update:', title, zeit.tick, newValue);
  }
}
