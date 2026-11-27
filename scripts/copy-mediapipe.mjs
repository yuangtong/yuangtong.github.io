// Copies MediaPipe's vision wasm from node_modules into public/, so the camera
// piece serves it from this site at the installed version (not committed).
import { cpSync, mkdirSync } from 'node:fs';
const from = 'node_modules/@mediapipe/tasks-vision/wasm', to = 'public/lab/camara/wasm';
mkdirSync(to, { recursive: true });
for (const f of ['vision_wasm_internal.js', 'vision_wasm_internal.wasm']) cpSync(`${from}/${f}`, `${to}/${f}`);
