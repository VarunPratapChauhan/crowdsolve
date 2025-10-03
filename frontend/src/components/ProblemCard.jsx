import React, { useEffect, useState } from "react";
import {
  getSolutions,
  createSolution,
  upvoteSolution,
  commentSolution,
} from "../api";

export default function ProblemCard({ problem }) {
  const [solutions, setSolutions] = useState([]);
  const [solutionText, setSolutionText] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const isProblemAuthor = user ? problem.author._id === user.id : false;

  const fetchSolutions = async () => {
    const { data } = await getSolutions(problem._id);
    setSolutions(data);
  };

  useEffect(() => {
    fetchSolutions();
  }, [problem._id]);

  const handleAddSolution = async (e) => {
    e.preventDefault();
    if (!solutionText.trim()) return;

    await createSolution({ problemId: problem._id, text: solutionText });
    setSolutionText("");
    fetchSolutions();
  };

  const handleUpvote = async (id) => {
    await upvoteSolution(id);
    fetchSolutions();
  };

  const handleComment = async (id, commentText) => {
    if (!commentText.trim()) return;
    await commentSolution(id, commentText);
    fetchSolutions();
  };

  return (
    <div className="max-w-xl mx-auto my-4 bg-white shadow-md rounded-lg border border-gray-200 p-4">
      {/* Problem Info */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-800">{problem.title}</h2>
        <p className="text-gray-700 mt-1">{problem.description}</p>
        <p className="text-gray-500 mt-1 text-sm">Location: {problem.location}</p>
        {problem.image && (
          <img
            src={`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/uploads/${problem.image}`}
            alt={problem.title}
            className="mt-3 rounded-md w-full object-cover max-h-80"
          />
        )}
        <p className="text-gray-600 mt-2 text-sm">
          Posted by: <span className="font-medium">{problem.author.name}</span> ({problem.author.email})
        </p>
      </div>

      {/* Add Solution Form */}
      {user && !isProblemAuthor && (
        <form onSubmit={handleAddSolution} className="mb-4">
          <textarea
            value={solutionText}
            onChange={(e) => setSolutionText(e.target.value)}
            placeholder="Suggest a solution..."
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            Add Solution
          </button>
        </form>
      )}

      {!user && (
        <p className="text-gray-400 italic text-sm mb-4">
          Login to suggest solutions or upvote.
        </p>
      )}

      {/* Solutions */}
      {solutions.map((s) => {
        const isSolutionAuthor = user ? s.author._id === user.id : false;

        return (
          <div
            key={s._id}
            className="mb-4 bg-gray-50 p-3 rounded-md border border-gray-200"
          >
            <div className="flex justify-between items-center mb-2">
              <p className="text-gray-800">{s.text}</p>
              {user && !isSolutionAuthor && (
                <button
                  onClick={() => handleUpvote(s._id)}
                  className="mt-1 px-2 py-1 text-blue-500 text-sm rounded-md bg-blue-500 text-white"
                >
                  Upvotes ({s.upvotes.length})
                </button>
              )}
            </div>
            <p className="text-gray-500 text-sm mb-2">By: {s.author.name}</p>

            {/* Comments */}
            <div className="pl-4 border-l border-gray-300">
              <h5 className="text-gray-600 text-sm mb-1">Comments</h5>
              {s.comments.map((c) => (
                <p key={c._id} className="text-gray-700 text-sm mb-1">
                  {c.text} - <span className="font-medium">{c.author.name}</span>
                </p>
              ))}

              {user && (
                <input
                  type="text"
                  placeholder="Add comment..."
                  onKeyDown={async (e) => {
                    if (e.key === "Enter") {
                      await handleComment(s._id, e.target.value);
                      e.target.value = "";
                    }
                  }}
                  className="w-full p-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
