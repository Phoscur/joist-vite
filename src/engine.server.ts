import { injectable, inject, Injector } from '@joist/di';

@injectable()
export class EngineService {

  get zeit() {
    return {
      time: 123,
      tick: 987
    }
  }

  async start() {
    return Promise.resolve();
  }
}

export async function startup(): Promise<Injector> {
  const injector = new Injector();
  const engine = injector.inject(EngineService);
  await engine.start();
  console.log('STARTUP');
  return injector;
}
