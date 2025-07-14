import { useState, useEffect } from "react";
import "prismjs/themes/prism-tomorrow.css";
import Editor from "react-simple-code-editor";
import prism from "prismjs";
import "highlight.js/styles/github-dark.css";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import axios from "axios";
import "./App.css";

function App() {
  const [code, setCode] = useState(`function sum() {\n  return 1 + 1;\n}`);
  const [review, setReview] = useState("");
  const [copySuccess, setCopySuccess] = useState("");

  useEffect(() => {
    prism.highlightAll();
  }, [code]);

  async function reviewCode() {
    try {
      const response = await axios.post("http://localhost:3000/ai/get-review", {
        code,
      });
      setReview(response.data);
    } catch (err) {
      setReview("⚠️ Error fetching review.");
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(review);
      setCopySuccess("Copied!");
      setTimeout(() => setCopySuccess(""), 2000);
    } catch (err) {
      setCopySuccess("Failed to copy");
    }
  };

  return (
    <main>
      <header>
        <h1 className="typing-header">
          <span className="type-text">AI Code Review Tool</span>
          <span className="cursor">|</span>
        </h1>
        <p className="subtext">
          Paste your code in any language and let AI provide smart, structured
          feedback to improve readability, performance, and best practices.
        </p>
      </header>

      <div className="container">
        {/* Left side - Code Editor */}
        <div className="card">
          <div className="editor-wrapper">
            <Editor
              value={code}
              onValueChange={setCode}
              highlight={(code) =>
                prism.highlight(code, prism.languages.javascript, "javascript")
              }
              padding={16}
              style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 14,
                minHeight: "100%",
                outline: "none",
              }}
            />
          </div>
          <button onClick={reviewCode} className="review-button">
            Review
          </button>
        </div>

        {/* Right side - AI Review Output */}
        <div className="card">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "0.5rem",
            }}
          >
            <h3 style={{ color: "#9aedfe", fontSize: "1rem" }}>
              AI Review Output
            </h3>
            <button onClick={copyToClipboard} className="copy-button">
              📋 Copy Review
            </button>
          </div>
          <div className="output">
            <Markdown rehypePlugins={[rehypeHighlight]}>{review}</Markdown>
          </div>
          {copySuccess && (
            <p style={{ color: "#00ff99", marginTop: "0.5rem" }}>
              {copySuccess}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}

export default App;
