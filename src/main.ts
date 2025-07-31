import { DOMInjector } from '@joist/di';
import { AppElement } from './app/app.element';
import { LanguageSelectDropdownElement } from './app/language.dropdown.element';
import { ZeitContextElement } from './app/zeit.element';
import { ConsoleDebug, Debug, DebugCtx } from './app/debug.element';

const app = new DOMInjector({ providers: [[Debug, { use: ConsoleDebug }]]});

app.attach(document.body);

customElements.define('debug-ctx', DebugCtx);
customElements.define('app-root', AppElement);
customElements.define('zeit-ctx', ZeitContextElement);
customElements.define('app-i18n-select', LanguageSelectDropdownElement);
