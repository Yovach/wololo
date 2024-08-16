import { jsxRenderer } from "hono/jsx-renderer";

export const layoutRenderer = jsxRenderer(({ children }) => {
  return (
    <html>
      <body>
        <header>
          <h1>wololo</h1>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
});
