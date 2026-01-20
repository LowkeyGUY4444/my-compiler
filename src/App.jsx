import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import axios from 'axios';

function App() {
  const [code, setCode] = useState("// Write your code here\nconsole.log('Hello World!');");
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [loading, setLoading] = useState(false);

  // Mapping for Piston API language names and versions
  const languageMap = {
    javascript: { name: "javascript", version: "18.15.0" },
    python: { name: "python", version: "3.10.0" },
    cpp: { name: "cpp", version: "10.2.0" }
  };

  const runCode = async () => {
    setLoading(true);
    setOutput("Compiling and Running...");

    const selectedLang = languageMap[language];

    // Piston API Request Body
    const requestData = {
      language: selectedLang.name,
      version: selectedLang.version,
      files: [
        {
          content: code
        }
      ]
    };

    try {
      // Piston Public API Endpoint
      const response = await axios.post('https://emkc.org/api/v2/piston/execute', requestData);

      // Piston returns combined stdout and stderr in 'output'
      const result = response.data.run.output || "No output returned.";
      setOutput(result);
    } catch (err) {
      setOutput("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", backgroundColor: "#121212", color: "white", minHeight: "100vh" }}>
      <h1>My Online Compiler</h1>

      {/* Language Selector */}
      <div style={{ marginBottom: "10px" }}>
        <label>Select Language: </label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          style={{ padding: "5px", marginLeft: "10px" }}
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="cpp">C++</option>
        </select>
      </div>

      {/* 1. Code Editor */}
      <div style={{ border: "1px solid #444", borderRadius: "5px", overflow: "hidden" }}>
        <Editor
          height="50vh"
          theme="vs-dark"
          language={language}
          value={code}
          onChange={(value) => setCode(value)}
        />
      </div>

      {/* 2. Run Button */}
      <button
        onClick={runCode}
        disabled={loading}
        style={{
          marginTop: "15px",
          padding: "10px 30px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: loading ? "not-allowed" : "pointer"
        }}
      >
        {loading ? "Running..." : "Run Code"}
      </button>

      {/* 3. Output Window */}
      <div style={{
        marginTop: "20px",
        background: "#1e1e1e",
        color: "#00ff00",
        padding: "15px",
        borderRadius: "5px",
        fontFamily: "monospace",
        whiteSpace: "pre-wrap",
        border: "1px solid #333"
      }}>
        <strong>Output:</strong>
        <hr style={{ borderColor: "#333" }} />
        {output}
      </div>
    </div>
  );
}

export default App;