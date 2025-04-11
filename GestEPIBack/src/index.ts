//********** Imports **********//
import app from "./app";

//********** App **********//
const port = process.env.PORT || 5501;
app.listen(port, () => {
  console.log(`Listening: http://localhost:${port}`);
  /* eslint-enable no-console */
});