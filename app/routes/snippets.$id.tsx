import { Link, useLoaderData } from "react-router";
import { CodeSnippetService } from "~/services/CodeSnippetService";
import type { Route } from "./+types/snippets.$id";
import { Button } from "~/components/ui/button";
import { useState } from "react";

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
  const [output, setOutput] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [warn, setWarn] = useState<string | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  const executeSnippet = async () => {
    try {
      setIsExecuting(true);
      setError(null);
      setWarn(null);
      await fetch("/api/snippets/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: snippet.code }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            setError(data.error);
            setOutput(null);
            setWarn(null);
          } else if (data.warn) {
            setWarn(data.warn);
            setOutput(null);
            setError(null);
          } else {
            setOutput(data.output);
            setError(null);
            setWarn(null);
          }
        });
    } catch (err) {
      console.error("Failed to execute code:", err);
      setError("Failed to execute code");
      setOutput(null);
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">{snippet.name}</h1>
          <Button variant="outline" asChild>
            <Link to="/snippets">Back to all snippets</Link>
          </Button>
        </div>
        <div className="mt-8 space-y-6">
          <pre className="bg-gray-800 text-white p-4 rounded-lg overflow-auto text-sm">
            <code className="text-sm">{snippet.code}</code>
          </pre>
          <Button
            variant="outline"
            onClick={executeSnippet}
            disabled={isExecuting}
          >
            {isExecuting ? "Executing..." : "Execute"}
          </Button>
          {error && <div className="text-red-500">{error}</div>}
          {warn && <div className="text-yellow-500">{warn}</div>}
          {output && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Output
              </h2>
              <pre className="bg-gray-100 p-4 rounded-lg overflow-auto">
                <code>{output}</code>
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
