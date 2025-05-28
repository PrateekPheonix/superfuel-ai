import { createRequestHandler } from "@react-router/express";
import { drizzle } from "drizzle-orm/postgres-js";
import bodyParser from "body-parser";
import express from "express";
import postgres from "postgres";
import "react-router";
import { VM, VMScript } from "vm2";

import { DatabaseContext } from "~/database/context";
import * as schema from "~/database/schema";
import { error } from "console";

declare module "react-router" {
  interface AppLoadContext {
    VALUE_FROM_EXPRESS: string;
  }
}

export const app = express();

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required");

const client = postgres(process.env.DATABASE_URL);
const db = drizzle(client, { schema });
app.use((_, __, next) => DatabaseContext.run(db, next));

app.use(express.json());
app.use(bodyParser.json());

app.post("/api/snippets/execute", async (req, res) => {
  const { code } = req.body;
  let result = "";
  let err = "";
  let warnLogs = "";
  let infoLogs = "";

  try {
    const vmSandbox = new VM({
      timeout: 1000,
      sandbox: {
        console: {
          log: (...args: any[]) => {
            result += args.map((arg) => String(arg)).join(" ") + "\n";
          },
          error: (...args: any[]) => {
            err += args.map((arg) => String(arg)).join(" ") + "\n";
          },
          warn: (...args: any[]) => {
            warnLogs += args.map((arg) => String(arg)).join(" ") + "\n";
          },
          info: (...args: any[]) => {
            infoLogs += args.map((arg) => String(arg)).join(" ") + "\n";
          },
        },
        setTimeout: (callback: () => void, timeout: number) => {
          setTimeout(callback, timeout);
        },
        setInterval: (callback: () => void, interval: number) => {
          setInterval(callback, interval);
        },
        clearTimeout: (timeout: NodeJS.Timeout) => {
          clearTimeout(timeout);
        },
        clearInterval: (interval: NodeJS.Timeout) => {
          clearInterval(interval);
        },
        Date,
        Buffer,
        Array,
        Object,
        String,
        Number,
        Boolean,
        Function,
        Error,
        EvalError,
        RangeError,
        ReferenceError,
        SyntaxError,
        TypeError,
        URIError,
        fetch,
        Headers,
        Request,
        Response,
        URL,
        URLSearchParams,
      },
    });
    const script = new VMScript(code);
    await vmSandbox.run(script);
  } catch (error) {
    console.error(error);
    err = `Error: ${error instanceof Error ? error.message : String(error)}`;
  }
  console.log({ output: result }, "result");
  res.setHeader("Content-Type", "application/json");
  res.send(JSON.stringify({ output: result, error: err, warn: warnLogs }));
});

app.use(
  createRequestHandler({
    build: () => import("virtual:react-router/server-build"),
    getLoadContext() {
      return {
        VALUE_FROM_EXPRESS: "Hello from Express",
      };
    },
  })
);
