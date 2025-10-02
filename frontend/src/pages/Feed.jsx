import React, { useEffect, useState } from "react";
import { fetchProblems } from "../api";
import ProblemCard from "../components/ProblemCard";

export default function Feed() {
  const [problems, setProblems] = useState([]);

  useEffect(() => {
    const load = async () => {
      const { data } = await fetchProblems();
      setProblems(data);
    };
    load();
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Community Feed</h2>

      <div className="space-y-6">
        {problems.map((p) => (
          <ProblemCard key={p._id} problem={p} />
        ))}
        {problems.length === 0 && (
          <p className="text-gray-500 text-center">No problems posted yet.</p>
        )}
      </div>
    </div>
  );
}
