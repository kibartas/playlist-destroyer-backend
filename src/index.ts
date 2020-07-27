import express = require("express");
import initialization from "./initialization";

const app = express();

initialization(app);

const port = app.get("port");

app.listen(port, () => {
  console.log(`Server listening at port ${port}`);
});
