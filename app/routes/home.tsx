import { Link } from "react-router";
import { Button } from "../components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex-grow flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-8">
          <h1 className="text-4xl font-bold text-gray-900">
            Welcome To JS Compiler
          </h1>
          <p className="text-sm text-gray-500 max-w-2xl">
            This is a simple JS compiler that allows you to compile your JS code
            to a executable file.
          </p>

          <div className="flex gap-4 justify-center">
            <Button asChild>
              <Link to="/snippets">
                <span>View Snippets</span>
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/snippets/new">
                <span>Create New Snippet</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
      <footer className="text-center text-sm text-gray-500 border-t border-gray-200 py-4">
        <p>
          &copy; {new Date().getFullYear()} JS Compiler. All rights reserved.
          Created by Prateek Niket
        </p>
      </footer>
    </div>
  );
}
