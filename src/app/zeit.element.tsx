import { injectable, inject } from '@joist/di';
import { Zeitgeber } from './signals/zeitgeber';

/**
 * Time/Tick Context: Zeitgeber start
 */
@injectable()
export class ZeitContextElement extends HTMLElement {
  static observedAttributes = [];
  #zeit = inject(Zeitgeber);

  connectedCallback() {

    const time = Number(this.attributes.getNamedItem('time')?.value) || Date.now();
    const tick = Number(this.attributes.getNamedItem('tick')?.value) || 0;

    this.#zeit().start(time, tick);
    console.log('Zeit Ctx connected, start!', time, tick);
  }

  disconnectedCallback() {
    console.log('Zeit Ctx disconnected, stop!');
    this.#zeit().stop();
  }
}
