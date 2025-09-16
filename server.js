import { buildApp } from "./src/app.js";

const app = buildApp();
const PORT = process.env.PORT ?? 3333;

app.listen({ port: PORT, host: '0.0.0.0' })
    .then(() => console.log(`Server rodando em http://localhost:${PORT}`))
    .catch((err) => {
        app.log.error(err);
        process.exit(1);
    });