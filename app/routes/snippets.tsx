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
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Snippets</h1>
          <Button variant="outline" asChild>
            <Link to="/snippets/new">New Snippet</Link>
          </Button>
        </div>
        <div className="mt-8 space-y-6"></div>
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
                    {index + 1}.{" "}
                    <span className="text-gray-800">{snippet.name}</span>
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
