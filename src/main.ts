import app from "./routes.tsx";

Deno.serve(app.fetch);
