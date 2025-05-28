import { db, type NewCodeSnippet } from "../../database";
import { codeSnippets } from "../../database/schema";
import { desc, eq } from "drizzle-orm";

export class CodeSnippetService {
  static async create(snippet: NewCodeSnippet) {
    const newCodeSnippet = await db
      .insert(codeSnippets)
      .values(snippet)
      .returning();
    return newCodeSnippet[0];
  }

  static async getAll() {
    const snippets = await db
      .select()
      .from(codeSnippets)
      .orderBy(desc(codeSnippets.createdAt));
    return snippets;
  }

  static async getById(id: number) {
    const snippet = await db
      .select()
      .from(codeSnippets)
      .where(eq(codeSnippets.id, id));
    return snippet[0];
  }

  static async update(id: number, snippet: Partial<NewCodeSnippet>) {
    const updatedSnippet = await db
      .update(codeSnippets)
      .set({ ...snippet, updatedAt: new Date() })
      .where(eq(codeSnippets.id, id))
      .returning();

    return updatedSnippet[0];
  }

  static async delete(id: number) {
    return await db
      .delete(codeSnippets)
      .where(eq(codeSnippets.id, id))
      .returning();
  }

  static async updateOutput(id: number, output: string) {
    return await db
      .update(codeSnippets)
      .set({ output })
      .where(eq(codeSnippets.id, id))
      .returning();
  }
}
