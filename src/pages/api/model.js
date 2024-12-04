import { pipeline } from "@xenova/transformers";

let pipe;

export default async function handler(req, res) {
  try {
    if (!pipe) {
      pipe = await pipeline("text-generation", "Xenova/llama2.c-stories15M");
    }

    const output = await pipe("Hello, world!");
    console.log(output[0]);

    res.status(200).json(output[0]);
  } catch (error) {
    console.error("Error loading model:", error);
    res.status(500).json({ error: error.message });
  }
}
