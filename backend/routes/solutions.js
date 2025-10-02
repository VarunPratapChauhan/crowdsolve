const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Solution = require("../models/Solution");
const Problem = require("../models/Problem");

router.post("/", auth, async (req, res) => {
  try {
    const { problemId, text } = req.body;

    const problem = await Problem.findById(problemId);
    if (!problem) return res.status(404).json({ message: "Problem not found" });

    if (problem.author.toString() === req.user.id) {
      return res.status(403).json({ message: "Author cannot add solution to their own problem" });
    }

    const solution = new Solution({
      problem: problemId,
      author: req.user.id,
      text,
    });

    await solution.save();
    res.json(solution);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:problemId", async (req, res) => {
  try {
    const solutions = await Solution.find({ problem: req.params.problemId })
      .populate("author", "name email")
      .populate("comments.author", "name email");
    res.json(solutions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/:id/upvote", auth, async (req, res) => {
  const solution = await Solution.findById(req.params.id);
  if (!solution) return res.status(404).json({ message: "Solution not found" });

  if (solution.author.toString() === req.user.id) {
    return res.status(403).json({ message: "Cannot upvote your own solution" });
  }

  const index = solution.upvotes.indexOf(req.user.id);
  if (index === -1) {
    solution.upvotes.push(req.user.id);
  } else {
    solution.upvotes.splice(index, 1);
  }

  await solution.save();
  res.json({ upvotes: solution.upvotes.length });
});


router.post("/:id/comment", auth, async (req, res) => {
  try {
    const solution = await Solution.findById(req.params.id);
    if (!solution) return res.status(404).json({ message: "Solution not found" });

    solution.comments.push({
      author: req.user.id,
      text: req.body.text,
    });

    await solution.save();
    await solution.populate("comments.author", "name email");

    res.json(solution.comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
