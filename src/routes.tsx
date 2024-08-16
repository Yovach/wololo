import type { FC } from "hono/jsx";
import { Context, Hono } from "hono";

// @deno-types="npm:@types/fluent-ffmpeg"
import ffmpeg from "npm:fluent-ffmpeg";

const app = new Hono();

const Layout: FC = (props) => {
  return (
    <html>
      <body>{props.children}</body>
    </html>
  );
};

const Top: FC<{ messages: string[] }> = (props: {
  messages: string[];
}) => {
  return (
    <Layout>
      <h1>Hello Hono!</h1>
      <ul>
        {props.messages.map((message) => {
          return <li>{message}!!</li>;
        })}
      </ul>
    </Layout>
  );
};

app.get("/", (c: Context) => {
  const messages = ["Good Morning", "Good Evening", "Good Night"];
  return c.html(<Top messages={messages} />);
});

app.get("/test", async (c: Context) => {
  ffmpeg("./Big_Buck_Bunny_180_10s.webm")
    .output("./Big_Buck_Bunny_180_10s.avi").run();
  // const file = await Deno.readFile("./Big_Buck_Bunny_180_10s.webm");
  const messages = ["Good Morning", "Good Evening", "Good Night"];
  return c.html(<Top messages={messages} />);
});

export default app;
