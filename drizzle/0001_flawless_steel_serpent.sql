CREATE TABLE IF NOT EXISTS "codeSnippet" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "codeSnippet_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"code" text NOT NULL,
	"output" text DEFAULT '' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP TABLE "guestBook" CASCADE;