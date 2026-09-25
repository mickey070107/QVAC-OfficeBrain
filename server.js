import express from "express";
import { loadModel, completion, unloadModel, LLAMA_3_2_1B_INST_Q4_0 } from "@qvac/sdk";

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json({ limit: "1mb" }));
app.use(express.static("public"));

let modelId = null;
let loadingPromise = null;

async function ensureModel() {
  if (modelId) return modelId;
  if (loadingPromise) return loadingPromise;
  loadingPromise = loadModel({
    modelSrc: LLAMA_3_2_1B_INST_Q4_0,
    onProgress: (p) => {
      if (p?.percentage != null) console.log(`QVAC model loading: ${p.percentage.toFixed(0)}%`);
    }
  }).then((id) => {
    modelId = id;
    console.log("QVAC local model ready.");
    return id;
  }).finally(() => { loadingPromise = null; });
  return loadingPromise;
}

app.get("/api/status", (_req, res) => {
  res.json({ ok: true, modelLoaded: Boolean(modelId), inference: "on-device" });
});

app.post("/api/chat", async (req, res) => {
  try {
    const message = String(req.body?.message || "").trim();
    if (!message) return res.status(400).json({ error: "Enter a message." });

    const id = await ensureModel();
    const result = completion({
      modelId: id,
      history: [
        { role: "system", content: "You are OfficeBrain, a concise private local office assistant. Give practical workplace answers. Use bullets when useful. Do not claim access to files or the internet unless supplied by the user." },
        { role: "user", content: message }
      ],
      stream: true
    });

    let answer = "";
    for await (const token of result.tokenStream) answer += token;

    res.json({
      answer,
      engine: "Tether QVAC",
      model: "Llama 3.2 1B Q4_0",
      privacy: "Local inference — no cloud AI API"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error?.message || "QVAC inference failed." });
  }
});

async function shutdown() {
  try {
    if (modelId) await unloadModel({ modelId });
  } catch (error) {
    console.error("Shutdown error:", error);
  } finally {
    process.exit(0);
  }
}
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

app.listen(PORT, () => {
  console.log(`OfficeBrain running at http://localhost:${PORT}`);
  console.log("QVAC will download/load the model locally on the first AI request.");
});