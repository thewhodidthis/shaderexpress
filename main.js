import glx from "@thewhodidthis/glx"
import * as shader from "./shader.js"

export class ShaderExpressModule extends HTMLElement {}
export class ShaderExpress extends HTMLElement {
  constructor() {
    super()

    const template = ranger(
      `<style>
        :host {
          display: grid;
          place-items: center;
        }
        :host([hidden]) {
          display: none;
        }
        :host > menu {
          grid-area: 1 / 1;
          margin: 1rem 1rem 0 auto;
          place-self: start;
        }
        menu {
          isolation: isolate;
          list-style: none;
          margin: 0;
          padding: 0;
        }
        li {
          display: inline-block;
        }
        canvas {
          height: 100%;
          grid-area: 1 / 1;
          object-fit: fill;
          width: 100%;
        }
        pre {
          background: transparent;
          border: 0;
          box-sizing: border-box;
          font: small/normal monospace;
          margin: 0 0 0.75rem;
          overflow: auto;
          padding: 0.5rem;
          resize: none;
          white-space: pre-wrap;
          width: 100%;
        }
        pre:focus {
          outline: 1px dashed;
          outline-offset: 1px;
        }
        form {
          display: grid;
          grid-template-rows: 1fr auto;
          height: 100%;
        }
        dialog {
          aspect-ratio: 16 / 9;
          background: rgba(255, 255, 255, 0.75);
          border: 1px dotted;
          box-sizing: border-box;
          max-width: 50rem;
          padding: 1rem;
          width: 100%;
        }
      </style>
      <canvas height="${this.height}" width="${this.width}"></canvas>
      <dialog>
        <form method="dialog">
          <pre id="code" contenteditable spellcheck="false">${this.textContent.trim()}</pre>
          <menu>
            <li><input type="submit" value="Update"></li>
            <li><button value="Cancel">Back</button></li>
            <li><input type="reset"></li>
          </menu>
        </form>
      </dialog>
      <menu>
        <li><button class="save">Save</button></li>
        <li><button class="open">Import</button></li>
        <li><button class="play">Play</button></li>
        <li><button class="edit">Edit</button></li>
      </menu>`
    )

    this.attachShadow({ mode: "open" })
    this.shadowRoot.appendChild(template.cloneNode(true))
  }
  #frame = null
  get width() {
    return this.getAttribute("width")
  }
  set width(v) {
    this.setAttribute("width", v)
  }
  get height() {
    return this.getAttribute("height")
  }
  set height(v) {
    this.setAttribute("height", v)
  }
  get src() {
    return this.getAttribute("src")
  }
  set src(v) {
    this.setAttribute("src", v)
  }
  get autoplay() {
    return this.hasAttribute("autoplay")
  }
  set autoplay(v) {
    this.setAttribute("autoplay", v)
  }
  get watch() {
    return this.hasAttribute("watch")
  }
  set watch(v) {
    this.setAttribute("watch", v)
  }
  static get observedAttributes() {
    return ["width", "height", "src"]
  }
  async attributeChangedCallback(_, oldValue, newValue) {
    if (oldValue !== null && newValue !== null && newValue !== oldValue) {
      await this.connectedCallback()
    }
  }
  async connectedCallback() {
    if (!this.isConnected) {
      return
    }

    try {
      const dialog = this.shadowRoot.querySelector("dialog")
      const editor = this.shadowRoot.querySelector("pre[contenteditable]")

      dialog?.addEventListener("close", () => {
        // NOTE: Fires on cancel too.
        if (dialog.returnValue === "Update") {
          this.textContent = editor.textContent
        }
      })

      const form = this.shadowRoot.querySelector("form")

      form?.addEventListener("reset", () => {
        editor.textContent = this.textContent.trim()
      })

      const edit = this.shadowRoot.querySelector("button.edit")

      edit?.addEventListener("click", function onedit() {
        dialog?.showModal()
      })

      const save = this.shadowRoot.querySelector("button.save")

      save?.addEventListener("click", function onsave() {
        const file = new File([editor.textContent], `sketch-${Date.now()}.glsl`, { type: "text/plain" })
        const url = URL.createObjectURL(file)
        const link = document.createElement("a")

        link.setAttribute("download", file.name)
        link.setAttribute("href", url)
        link.click()
      })

      const open = this.shadowRoot.querySelector("button.open")

      open?.addEventListener("click", () => {
        const input = document.createElement("input")
        const reader = new FileReader()

        reader.addEventListener("load", function onload(e) {
          editor.textContent = e.target.result
        })

        input.setAttribute("accept", ".glsl")
        input.setAttribute("type", "file")
        input.addEventListener("change", function onchange() {
          const [f] = input?.files

          reader.readAsText(f)
        })

        input.click()
      })

      const canvas = this.shadowRoot.querySelector("canvas")
      const { gl, createProgram, createVbo } = glx(canvas)
      const state = {}
      const { width: w, height: h } = canvas
      const pointer = [0, 0, 0, 0]

      const tracker = (e) => {
        // NOTE: This won't work on mobile yet.
        pointer.splice(0, pointer.length, e.offsetX, e.offsetY, e.movementX, e.movementY)
      }

      const observer = new MutationObserver(async function onmutate() {
        const program = await createProgram(shader.vertex(), shader.fragment(editor.textContent))

        gl.useProgram(program)

        state.uPointer = gl.getUniformLocation(program, "uPointer")
        state.uResolution = gl.getUniformLocation(program, "uResolution")
        state.uTime = gl.getUniformLocation(program, "uTime")
        state.aPosition = gl.getAttribLocation(program, "aPosition")

        if (state.aPosition !== -1) {
          gl.enableVertexAttribArray(state.aPosition)
        }
      })

      observer.observe(editor, { characterData: true, childList: true, subtree: true })

      const edges = new Float32Array([0, 0, 0, h, w, 0, w, 0, 0, h, w, h])
      const shape = createVbo(edges)

      const loop = (elapsed) => {
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)

        gl.clearColor(1, 1, 1, 1)
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

        gl.bindBuffer(gl.ARRAY_BUFFER, shape)

        if ("uResolution" in state) {
          gl.uniform2f(state.uResolution, w, h)
        }

        if ("uPointer" in state) {
          gl.uniform4f(state.uPointer, ...pointer)
        }

        if ("uTime" in state) {
          gl.uniform1f(state.uTime, elapsed * 0.001)
        }

        if ("aPosition" in state) {
          gl.vertexAttribPointer(state.aPosition, 2, gl.FLOAT, gl.TRUE, 2 * Float32Array.BYTES_PER_ELEMENT, 0)
          gl.drawArrays(gl.TRIANGLES, 0, edges.length / 2)
        }

        this.#frame = requestAnimationFrame(loop)
      }

      const play = this.shadowRoot.querySelector("button.play")

      play?.addEventListener("click", () => {
        if (this.#frame) {
          canvas.removeEventListener("pointermove", tracker)
          play.replaceChildren("Play")

          this.#frame = cancelAnimationFrame(this.#frame)
        } else {
          canvas.addEventListener("pointermove", tracker, { passive: true })
          play.replaceChildren("Stop")

          this.#frame = requestAnimationFrame(loop)
        }
      })

      if (this.src) {
        const response = await fetch(this.src)

        if (response.ok) {
          editor.textContent = await response.text()
        }
      }

      if (this.autoplay) {
        play?.click()
      }

      const ready = new Event("ready")

      this.dispatchEvent(ready)
    } catch ({ message }) {
      const error = new ErrorEvent("error", { message })

      this.dispatchEvent(error)
    }
  }
}

// Helps bring in external GLSL dependencies.
export async function loader(...includes) {
  return await import(module)
}

// Helps with string to HTML coversion.
export function ranger(s = "") {
  return document.createRange().createContextualFragment(s)
}
