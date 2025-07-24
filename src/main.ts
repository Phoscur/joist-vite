import { DOMInjector } from '@joist/di';
import { AppElement } from './app/app.element';
import { LanguageSelectDropdownElement } from './app/language.dropdown.element';
import { ZeitContextElement } from './app/zeit.element';

const app = new DOMInjector();

app.attach(document.body);

customElements.define('app-root', AppElement);
customElements.define('zeit-ctx', ZeitContextElement);
customElements.define('app-i18n-select', LanguageSelectDropdownElement);
