import app from "../src/index";
import { port } from "../src/config/app";

app.listen(port, () => {
  console.log(`Router listening on port ${port}`);
});

export default app;
