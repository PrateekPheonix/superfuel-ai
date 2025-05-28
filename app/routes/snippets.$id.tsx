import { Link, useLoaderData } from "react-router";
import { CodeSnippetService } from "~/services/CodeSnippetService";
import type { Route } from "./+types/snippets.$id";
import { Button } from "~/components/ui/button";

export async function loader({ params }: Route.LoaderArgs) {
  const id = Number(params.id);
  if (isNaN(id)) {
    throw new Error("Invalid snippet ID");
  }

  const snippet = await CodeSnippetService.getById(id);
  if (!snippet) {
    throw new Error("Snippet not found");
  }

  return { snippet };
}

export default function SnippetDetail() {
  const { snippet } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">{snippet.name}</h1>
          <Button variant="outline" asChild>
            <Link to="/snippets">Back to all snippets</Link>
          </Button>{" "}
        </div>
        <div className="mt-8 space-y-6">
          <pre className="bg-gray-800 text-white p-4 rounded-lg overflow-auto text-sm">
            <code className="text-sm">{snippet.code}</code>
          </pre>
          <Button variant="outline">Execute</Button>
          {snippet.output && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Output
              </h2>
              <pre className="bg-gray-100 p-4 rounded-lg overflow-auto">
                <code>{snippet.output}</code>
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
