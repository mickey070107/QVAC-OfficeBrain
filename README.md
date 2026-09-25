# OfficeBrain — Local AI Office Assistant

OfficeBrain is a small workplace assistant that runs AI inference locally using **Tether's QVAC SDK**. Enter a workplace prompt and the app sends it to a QVAC-loaded Llama model on the same machine.

## QVAC functions
- `loadModel()`
- `completion()`
- `unloadModel()`

Model: `LLAMA_3_2_1B_INST_Q4_0`

## Requirements
- Node.js **22.17+**
- npm
- A machine with enough resources for the selected local model

## Install
```bash
git clone https://github.com/YOUR_USERNAME/qvac-officebrain.git
cd qvac-officebrain
npm install
```

## Run
```bash
npm start
```
Open `http://localhost:3000`.

On the first request, QVAC downloads/caches and loads the model locally. Later requests reuse it.

## Privacy
This app does not call OpenAI, Gemini, Claude, or another cloud AI API. The browser sends the prompt to the local Node process, which calls QVAC for local inference.

## License
MIT

## Links
- QVAC SDK: https://www.npmjs.com/package/@qvac/sdk
- Docs: https://docs.qvac.tether.io/
- Source: https://github.com/tetherto/qvac

Built as an independent open-source project using the QVAC SDK.
## Features
- Local AI inference
- QVAC-powered Llama model
- No cloud AI API
