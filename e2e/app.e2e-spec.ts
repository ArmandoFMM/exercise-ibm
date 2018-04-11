import { ExercisesPage } from './app.po';

describe('exercises App', () => {
  let page: ExercisesPage;

  beforeEach(() => {
    page = new ExercisesPage();
  });

  it('should display welcome message', done => {
    page.navigateTo();
    page.getParagraphText()
      .then(msg => expect(msg).toEqual('Welcome to app!!'))
      .then(done, done.fail);
  });
});
