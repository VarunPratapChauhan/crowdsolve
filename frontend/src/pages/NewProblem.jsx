import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProblem } from "../api";

export default function NewProblem() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const [form, setForm] = useState({ title: "", description: "", location: "" });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // If not logged in, show a message
  if (!user) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
        <h2 className="text-xl font-semibold mb-4">You must be logged in to post a problem</h2>
        <button
          onClick={() => navigate("/login")}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Go to Login
        </button>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("location", form.location);
    if (image) formData.append("image", image);

    try {
      await createProblem(formData);
      alert("Problem posted!");
      setForm({ title: "", description: "", location: "" });
      setImage(null);
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Failed to post problem");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Post a New Problem
        </h2>

        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
          className="w-full mb-4 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input
          type="text"
          placeholder="Location"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
          required
          className="w-full mb-4 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <textarea
          placeholder="Describe your problem"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
          className="w-full mb-4 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
          className="mb-4"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors font-semibold"
        >
          {loading ? "Posting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
