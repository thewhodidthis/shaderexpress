import { ShaderExpress } from "./main.js"

const s = document.querySelector("s-express")

s?.addEventListener("error", function onerror(e) {
  console.log("error", e?.message)
})

self.customElements?.define("s-express", ShaderExpress)
