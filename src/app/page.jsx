"use client";
import React from "react";

import { useHandleStreamResponse } from "../utilities/runtime-helpers";

function MainComponent() {
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const [model, setModel] = React.useState("claude");
  const [postData, setPostData] = React.useState({
    keywords: "",
    content: "",
  });
  const [streamingContent, setStreamingContent] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [copySuccess, setCopySuccess] = React.useState(false);
  const [wordCount, setWordCount] = React.useState("medium");
  const [customWordCount, setCustomWordCount] = React.useState("");
  const [tone, setTone] = React.useState("professional");

  const handleStreamResponse = useHandleStreamResponse({
    onChunk: setStreamingContent,
    onFinish: (message) => {
      setPostData((prev) => ({ ...prev, content: message }));
      setIsLoading(false);
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPostData((prev) => ({ ...prev, keywords: value }));
  };

  const generateContent = async () => {
    if (!postData.keywords) return;
    setIsLoading(true);
    setStreamingContent("");

    const wordCountRanges = {
      short: "150-300",
      medium: "300-500",
      long: "500-750",
    };

    const prompt = `Generate a blog post about ${postData.keywords}. The blog post should be informative and engaging, with a clear structure including an introduction, main points, and a conclusion. Use a ${tone} tone. Aim for ${wordCountRanges[wordCount]} words.`;

    const endpoint =
      model === "claude"
        ? "/integrations/anthropic-claude-sonnet-3-5/"
        : "/integrations/chat-gpt/conversationgpt4";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: prompt }],
          stream: true,
        }),
      });
      handleStreamResponse(response);
    } catch (error) {
      console.error("Error generating content:", error);
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen font-inter transition-all duration-300 ${
        isDarkMode
          ? "bg-gradient-to-br from-[#0F0B1E] to-[#1A1424] text-white"
          : "bg-gradient-to-br from-white to-purple-100 text-[#1A1424]"
      }`}
    >
      <head>
        <title>ContentCraft</title>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>✨</text></svg>"
        />
      </head>
      <div className="fixed top-4 right-4 md:top-6 md:right-6 z-50">
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300 ${
            isDarkMode
              ? "bg-[#2D2D2D] text-[#9D5CFF] hover:bg-[#3D3D3D] shadow-lg shadow-purple-900/20"
              : "bg-white text-[#7C3AED] hover:bg-purple-50 shadow-lg"
          }`}
        >
          <i className={`fas ${isDarkMode ? "fa-sun" : "fa-moon"} text-lg`}></i>
        </button>
      </div>
      <main className="w-full max-w-2xl mx-auto px-4 py-16">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1
            className={`text-4xl xs:text-5xl sm:text-6xl md:text-7xl font-bold mb-6 ${
              isDarkMode
                ? "bg-gradient-to-r from-white via-purple-200 to-purple-400"
                : "bg-gradient-to-r from-[#1A1424] via-purple-800 to-purple-900"
            } bg-clip-text text-transparent tracking-tight leading-tight`}
          >
            ContentCraft
          </h1>
          <p
            className={`text-lg sm:text-xl font-light leading-relaxed mx-auto max-w-2xl mb-12 ${
              isDarkMode ? "text-purple-200" : "text-purple-900"
            }`}
          >
            Transform your ideas into engaging content with AI
          </p>

          <div
            className={`inline-flex p-1 rounded-full mb-8 ${
              isDarkMode ? "bg-[#1A1424]" : "bg-white/90"
            } shadow-lg`}
          >
            <button
              onClick={() => setModel("claude")}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                model === "claude"
                  ? isDarkMode
                    ? "bg-[#2D2D2D] text-[#9D5CFF]"
                    : "bg-purple-100 text-[#7C3AED]"
                  : "hover:text-[#7C3AED]"
              }`}
            >
              Claude
            </button>
            <button
              onClick={() => setModel("gpt4")}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                model === "gpt4"
                  ? isDarkMode
                    ? "bg-[#2D2D2D] text-[#9D5CFF]"
                    : "bg-purple-100 text-[#7C3AED]"
                  : "hover:text-[#7C3AED]"
              }`}
            >
              GPT-4
            </button>
          </div>

          <div className="max-w-2xl mx-auto space-y-6">
            <div
              className={`p-4 rounded-xl ${
                isDarkMode ? "bg-[#1A1424]/50" : "bg-white/90"
              } shadow-lg`}
            >
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="flex-1">
                  <label
                    className={`block text-sm mb-2 ${
                      isDarkMode ? "text-purple-200" : "text-purple-900"
                    }`}
                  >
                    Word Count
                  </label>
                  <div className="space-y-2">
                    <select
                      value={wordCount}
                      onChange={(e) => setWordCount(e.target.value)}
                      className={`w-full p-2 rounded-lg ${
                        isDarkMode
                          ? "bg-[#2D2D2D] text-purple-200 border-purple-800/30"
                          : "bg-white text-purple-900 border-purple-200"
                      } border outline-none`}
                    >
                      <option value="short">Short (150-300 words)</option>
                      <option value="medium">Medium (300-500 words)</option>
                      <option value="long">Long (500-750 words)</option>
                    </select>
                  </div>
                </div>
                <div className="flex-1">
                  <label
                    className={`block text-sm mb-2 ${
                      isDarkMode ? "text-purple-200" : "text-purple-900"
                    }`}
                  >
                    Tone
                  </label>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className={`w-full p-2 rounded-lg ${
                      isDarkMode
                        ? "bg-[#2D2D2D] text-purple-200 border-purple-800/30"
                        : "bg-white text-purple-900 border-purple-200"
                    } border outline-none`}
                  >
                    <option value="professional">Professional</option>
                    <option value="casual">Casual</option>
                    <option value="friendly">Friendly</option>
                    <option value="formal">Formal</option>
                  </select>
                </div>
              </div>
            </div>

            <textarea
              name="keywords"
              value={postData.keywords}
              onChange={handleChange}
              placeholder="What would you like to write about?"
              rows="4"
              className={`w-full px-8 py-6 text-lg rounded-2xl transition-all duration-300 resize-none mb-4 ${
                isDarkMode
                  ? "bg-[#0F0B1E]/50 text-white placeholder-purple-300/50 border-2 border-purple-800/30 focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED] focus:ring-opacity-50"
                  : "bg-white text-purple-900 placeholder-purple-400 border-2 border-purple-200 focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED] focus:ring-opacity-50"
              } outline-none shadow-lg`}
            />
            <div className="flex gap-4">
              <div className="flex-1">
                <button
                  onClick={generateContent}
                  disabled={isLoading}
                  className={`w-full px-8 py-4 text-lg rounded-xl text-white font-medium shadow-lg transition-all duration-300 ${
                    isDarkMode
                      ? "bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-50 disabled:hover:bg-[#7C3AED] shadow-purple-900/20"
                      : "bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-50 disabled:hover:bg-[#7C3AED]"
                  }`}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <i className="fas fa-circle-notch fa-spin"></i>
                      Generating...
                    </span>
                  ) : (
                    "Generate"
                  )}
                </button>
              </div>
              {isLoading && (
                <button
                  onClick={() => setIsLoading(false)}
                  className={`px-8 py-4 text-lg rounded-xl font-medium shadow-lg transition-all duration-300 ${
                    isDarkMode
                      ? "bg-[#2D2D2D] text-purple-200 hover:bg-[#3D3D3D]"
                      : "bg-white text-purple-900 hover:bg-purple-50"
                  }`}
                >
                  Stop
                </button>
              )}
            </div>
          </div>
        </div>
        {(postData.content || isLoading) && (
          <div
            className={`mt-8 max-w-2xl mx-auto p-8 rounded-2xl relative ${
              isDarkMode
                ? "bg-[#1A1424]/50 backdrop-blur-sm border border-purple-900/30"
                : "bg-white/80 backdrop-blur-sm border border-purple-200"
            } shadow-lg`}
          >
            {!isLoading && postData.content && (
              <button
                onClick={() => {
                  navigator.clipboard.writeText(postData.content);
                  setCopySuccess(true);
                  setTimeout(() => setCopySuccess(false), 2000);
                }}
                className={`absolute top-4 right-4 px-4 py-2 text-sm rounded-full transition-all duration-300 hover:scale-105 ${
                  isDarkMode
                    ? "text-purple-200 hover:bg-[#1A1424]"
                    : "text-purple-700 hover:bg-purple-50"
                }`}
              >
                <span
                  className={copySuccess ? "animate-success" : "animate-fadeIn"}
                >
                  {copySuccess ? "✔️" : "Copy Content"}
                </span>
              </button>
            )}
            <h2
              className={`text-2xl font-light mb-6 ${
                isDarkMode ? "text-white" : "text-purple-900"
              }`}
            >
              Blog Post: {postData.keywords}
            </h2>
            <p
              className={`text-base mb-8 whitespace-pre-wrap leading-relaxed ${
                isDarkMode ? "text-purple-100" : "text-purple-900"
              }`}
            >
              {streamingContent || postData.content}
            </p>
          </div>
        )}
      </main>
      <style jsx global>{`
        @keyframes fadeIn {
          from { 
            opacity: 0; 
            transform: translateY(-10px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        @keyframes success {
          0% { 
            transform: scale(0.8); 
            opacity: 0; 
          }
          50% { 
            transform: scale(1.2); 
            opacity: 1; 
          }
          100% { 
            transform: scale(1); 
            opacity: 1; 
          }
        }
      `}</style>
    </div>
  );
}

export default MainComponent;