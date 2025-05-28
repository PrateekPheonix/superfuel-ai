import { Link, useLoaderData } from "react-router";
import { Button } from "~/components/ui/button";
import { CodeSnippetService } from "~/services/CodeSnippetService";

export async function loader() {
  const snippets = await CodeSnippetService.getAll();
  return { snippets };
}

export default function Snippets() {
  const { snippets } = useLoaderData<typeof loader>();
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Snippets</h1>
          <div className="flex gap-4">
            <Button variant="default" asChild>
              <Link to="/snippets/new">New Snippet</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/">Home</Link>
            </Button>
          </div>
        </div>
      </div>
      {snippets.length === 0 && (
        <div className="mt-8 space-y-6">
          <p className="text-gray-600">No snippets found</p>
        </div>
      )}
      {snippets.length > 0 && (
        <div className="mt-8 space-y-6 max-w-2xl mx-auto bg-gray-100 p-8 rounded-lg shadow-md border border-gray-200">
          <ul className="space-y-4">
            {snippets.map((snippet, index) => (
              <li
                key={snippet.id}
                className="border border-gray-200 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow flex"
              >
                <Button variant="ghost" asChild className="w-full h-full p-4">
                  <Link
                    className="text-gray-900 text-l"
                    to={`/snippets/${snippet.id}`}
                  >
                    {snippet.name}
                  </Link>
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
