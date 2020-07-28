import express, { Application } from 'express';
import initialization from './initialization';

const app: Application = express();

initialization(app);

const port = app.get('port');

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening at port ${port}`);
});
