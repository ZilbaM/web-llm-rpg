import { useState, useEffect } from "react";
import { AutoTokenizer, pipeline } from "@xenova/transformers";

let pipe, tokenizer;
const MODEL = "Xenova/gpt2";


export default function Home() {
  const masterPrompt = `
  You are the "Master Agent" in a text-based RPG system. Your task is to generate and manage a narrative adventure based on user-defined settings. This adventure must be engaging, coherent, and progress logically based on user choices. You will coordinate with other agents (Storytelling, Choices, and Dialogue) to ensure the story remains dynamic and eventually concludes.
  
  The output must follow this format:
  {
    "story": "A description of the current scene or situation.",
    "choices": ["A list of 3-5 meaningful choices the user can make."],
    "dialogue": "Optional dialogue if it is needed for this part of the story."
  }
  
  The adventure must begin based on the user-defined settings and proceed with the following rules:
  1. The setting, characters, and goals must align with the user's input.
  2. Each turn, present a narrative (story), offer choices, and optionally include dialogue.
  3. Ensure the game progresses toward a clear ending without repetitive or endless loops.
  4. Choices must be relevant to the story and allow the user to shape the adventure meaningfully.
  
  Here is the user-defined input:

  `;

  const runInference = async () => {
    if (!pipe) {
      tokenizer = await AutoTokenizer.from_pretrained(MODEL);
      pipe = await pipeline("text-generation", MODEL);
    }
    const input = masterPrompt + prompt; // Combine the master prompt and user input

    // Compute the input length of the prompt to know how many tokens to generate

    const promptTokensLength = await tokenizer.encode(input).length;


    console.log("Running inference")
    const output = await pipe(input, {
      max_length: promptTokensLength + 100,
      min_length: promptTokensLength, // Ensure at least 50 tokens are generated
      do_sample: true,
    });
  
    // If the output is structured, extract the text
    const generatedText = output[0]?.generated_text.slice(input.length) || output; // Adjust based on actual output format
    setOutput(generatedText);
  };
  

  const [prompt, setPrompt] = useState("");
  const [output, setOutput] = useState("");

  return (
    <div>
      <h1>Client-Side Inference</h1>
      <textarea type="text" value={prompt} onChange={(e) => setPrompt(e.target.value)} ></textarea>
      <button onClick={runInference}>Run Inference</button>
      <p>{output}</p>
    </div>
  );
}
