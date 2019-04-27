import { ActionModule } from './action.module';

describe('ActionModule', () => {
  let actionModule: ActionModule;

  beforeEach(() => {
    actionModule = new ActionModule();
  });

  it('should create an instance', () => {
    expect(actionModule).toBeTruthy();
  });
});
