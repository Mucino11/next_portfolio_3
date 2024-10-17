import { Hono } from "hono";

const app = new Hono();

// Sample route
app.get("/api/hello", (c) =>
  c.json({ message: "Hello from Hono with TypeScript!" })
);

// Start the server
app.listen(3001, () => {
  console.log("Hono server running on http://localhost:3001");
});
