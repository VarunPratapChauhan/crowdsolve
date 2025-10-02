const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");
const Problem = require("../models/Problem");

router.post("/", auth, upload.single("image"), async (req, res) => {
  try {
    const { title, description, location } = req.body; // include title
    const author = req.user.id; // from auth middleware
    const image = req.file ? req.file.filename : null;

    const problem = new Problem({
      title,
      description,
      location,
      author: req.user.id, // <-- match schema
      image,
    });

    await problem.save();
    res.json(problem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const problems = await Problem.find()
      .populate("author", "name email")
      .sort({ createdAt: -1 });
    res.json(problems);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id)
      .populate("postedBy", "name email");
    if (!problem) return res.status(404).json({ message: "Not found" });
    res.json(problem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
