import {
  Form,
  useNavigation,
  redirect,
  useActionData,
  Link,
} from "react-router";
import { Button } from "~/components/ui/button";
import { CodeSnippetService } from "~/services/CodeSnippetService";
import type { Route } from "./+types/snippets.new";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const name = formData.get("title");
  const code = formData.get("code");

  if (typeof name !== "string" || typeof code !== "string") {
    return { error: "Invalid form data" };
  }

  if (!name.trim() || !code.trim()) {
    return { error: "Title and code are required" };
  }

  const snippet = await CodeSnippetService.create({ name, code });
  return redirect(`/snippets/${snippet.id}`);
}

export default function NewSnippet() {
  const navigation = useNavigation();
  const actionData = useActionData<typeof action>();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Create New Snippet
          </h1>
          <Button variant="outline" asChild>
            <Link to="/snippets">Back to all snippets</Link>
          </Button>
        </div>
        <Form method="post" className="mt-8 space-y-6">
          {actionData?.error && (
            <div className="text-red-600">{actionData.error}</div>
          )}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="Enter title"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label
              htmlFor="code"
              className="block text-sm font-medium text-gray-700"
            >
              Code
            </label>
            <textarea
              id="code"
              name="code"
              placeholder="Enter code"
              rows={10}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button disabled={isSubmitting} type="submit">
              {isSubmitting ? "Creating..." : "Create Snippet"}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
