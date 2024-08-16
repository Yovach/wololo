import { zValidator } from "@hono/zod-validator";
import { Context, Hono } from "hono";
import z from "zod";

// @deno-types="npm:@types/fluent-ffmpeg"
import { Form } from "./components/form.tsx";
import { layoutRenderer } from "./middlewares/jsx.tsx";

const app = new Hono();

app.post(
  "/",
  zValidator(
    "form",
    z.object({
      output: z.string(),
    }),
  ),
  async (c: Context) => {
    const x = c.req.valid("form");
    console.log(x);
  },
);

app.get("/", layoutRenderer, (c: Context) => {
  // ffmpeg("./Big_Buck_Bunny_180_10s.webm")
  //   .output("./Big_Buck_Bunny_180_10s.avi").run();
  // // const file = await Deno.readFile("./Big_Buck_Bunny_180_10s.webm");
  return c.render(
    <Form />,
  );
});

export default app;
