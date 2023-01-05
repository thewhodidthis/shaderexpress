export class ShaderExpressModule extends HTMLElement {
  constructor() {
    super()
  }
  get src() {
    return this.getAttribute("src")
  }
  set src(v) {
    this.setAttribute("src", v)
  }
}

export class ShaderExpress extends HTMLElement {
  constructor() {
    super()

    const template = ranger(
      `<style>
        :host {
          display: block;
        }
        :host([hidden]) {
          display: none;
        }
        li {
          display: inline-block;
        }
        menu {
          list-style: none;
          margin: 0;
          padding: 0;
        }
        video {
          height: 100%;
          object-fit: fill;
          vertical-align: middle;
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
          outline: 1px dotted;
          outline-offset: 1px;
        }
        form {
          display: grid;
          grid-template-rows: 1fr auto;
          height: 100%;
        }
        dialog {
          aspect-ratio: 4 / 3;
          border: 0;
          box-sizing: border-box;
          max-width: 45rem;
          padding: 1rem;
          width: calc(100vw - 3rem);
        }
        dialog::backdrop {
          background: whitesmoke;
        }
      </style>
      <video height="${this.height}" width="${this.width}" fps="${this.#fps}" muted playsinline></video>
      <dialog>
        <form method="dialog">
          <pre id="code" contenteditable spellcheck="false"></pre>
          <menu>
            <li><input type="submit" value="Update"></li>
            <li><button value="Cancel">Back</button></li>
            <li><input type="reset"></li>
          </menu>
        </form>
      </dialog>`
    )

    this.attachShadow({ mode: "open" })
    this.shadowRoot.appendChild(template.cloneNode(true))
  }
  #currentTime = document.timeline.currentTime
  #fps = 55
  #lastTick = null
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
  get fps() {
    return this.getAttribute("fps")
  }
  set fps(v) {
    this.setAttribute("fps", v)
  }
  get src() {
    return this.getAttribute("src")
  }
  set src(v) {
    this.setAttribute("src", v)
  }
  get controls() {
    return this.hasAttribute("controls")
  }
  set controls(v) {
    this.setAttribute("controls", v)
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
    return ["height", "width", "src", "fps"]
  }
  async attributeChangedCallback(_, oldValue, newValue) {
    if (oldValue !== null && newValue !== null && newValue !== oldValue) {
      await this.connectedCallback()
    }
  }
  async connectedCallback() {
    // Allow nesting, but exclude child elements of the same type making sure tag has context.
    if (this.localName === this.parentNode?.localName || !this.isConnected) {
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

        if (document.pictureInPictureElement) {
          document.exitPictureInPicture()
        }
      })

      const form = this.shadowRoot.querySelector("form")

      form?.addEventListener("reset", () => {
        editor.textContent = this.textContent.trim()
      })

      const video = this.shadowRoot.querySelector("video")
      const { width: w, height: h } = video
      const state = {}
      const { gl, programcreator } = glx(w, h)

      const pointer = [0, 0, 0, 0]
      const tracker = ({ offsetX: x, offsetY: y }) => {
        pointer.splice(0, pointer.length, x, y, x - pointer[0], y - pointer[1])
      }

      this.addEventListener("open", function onopen() {
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

      this.addEventListener("save", function onedit() {
        const file = new File([editor.textContent], `sketch-${Date.now()}.glsl`, { type: "text/plain" })
        const url = URL.createObjectURL(file)
        const link = document.createElement("a")

        link.setAttribute("download", file.name)
        link.setAttribute("href", url)
        link.click()
      })

      this.addEventListener("edit", function onedit() {
        if (document.pictureInPictureEnabled) {
          try {
            video.requestPictureInPicture()
          } catch (e) {
            throw e
          }
        }

        dialog?.showModal()
      })

      // Collect dependencies.
      const extra = await moduleloader(
        ...Array.from(this.children)
          .filter(c => c instanceof ShaderExpressModule)
          .map(c => c.src)
      )

      const observer = new MutationObserver(function onmutate() {
        const program = programcreator(vertexshader(), fragmentshader(editor.textContent, ...extra))

        gl.useProgram(program)

        state.uPointer = gl.getUniformLocation(program, "uPointer")
        state.uResolution = gl.getUniformLocation(program, "uResolution")
        state.uTime = gl.getUniformLocation(program, "uTime")
        state.aPosition = gl.getAttribLocation(program, "aPosition")

        if (state.aPosition !== -1) {
          gl.enableVertexAttribArray(state.aPosition)
        }
      })

      // Input event no good.
      observer.observe(editor, { characterData: true, childList: true, subtree: true })

      // Trigger program compilation.
      editor.textContent = this.src ? await filereader(this.src) : this.textContent.trim()

      const edges = Float32Array.of(0, 0, 0, h, w, 0, w, 0, 0, h, w, h)
      const stride = 2 * Float32Array.BYTES_PER_ELEMENT

      const shape = gl.createBuffer()

      gl.bindBuffer(gl.ARRAY_BUFFER, shape)
      gl.bufferData(gl.ARRAY_BUFFER, edges, gl.STATIC_DRAW)
      gl.bindBuffer(gl.ARRAY_BUFFER, null)

      const loop = (timestamp) => {
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)
        gl.clearColor(1, 1, 1, 1)
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
        gl.bindBuffer(gl.ARRAY_BUFFER, shape)

        if ("uPointer" in state) {
          gl.uniform4f(state.uPointer, ...pointer)
        }

        if ("uTime" in state) {
          this.#currentTime += timestamp - (this.#lastTick ?? timestamp)
          this.#lastTick = timestamp

          gl.uniform1f(state.uTime, this.#currentTime)
        }

        if ("uResolution" in state) {
          gl.uniform2f(state.uResolution, w, h)
        }

        if ("aPosition" in state) {
          gl.vertexAttribPointer(state.aPosition, 2, gl.FLOAT, gl.TRUE, stride, 0)
          gl.drawArrays(gl.TRIANGLES, 0, edges.length / 2)
        }

        this.#frame = requestAnimationFrame(loop)
      }

      video.controls = this.controls
      video.srcObject = gl.canvas.captureStream(this.#fps)
      video.autoplay = this.autoplay

      video.onpause = () => {
        video.removeEventListener("pointermove", tracker)

        this.#frame = this.#lastTick = cancelAnimationFrame(this.#frame)
      }

      video.onplay = () => {
        video.addEventListener("pointermove", tracker, { passive: true })

        this.#frame = requestAnimationFrame(loop)
      }

      if (video.autoplay) {
        await video.play()
      }

      // All set.
      const ready = new CustomEvent("ready", { detail: { video } })

      this.dispatchEvent(ready)
    } catch ({ message }) {
      const error = new ErrorEvent("error", { message })

      this.dispatchEvent(error)
    }
  }
}

function fragmentshader(s = "void sketch(in vec2 p, out vec4 c) {}", ...extra) {
  return `#version 300 es
precision highp float;

in vec2 vUv;
uniform vec4 uPointer;
uniform vec2 uResolution;
uniform float uTime;
out vec4 oColor;

${extra.join("")}
${s}

void main() {
  sketch(vUv, oColor);
}`
}

function vertexshader() {
  return `#version 300 es
precision highp float;

in vec2 aPosition;
uniform vec2 uResolution;
out vec2 vUv;

void main() {
  vUv = aPosition / uResolution;
  gl_Position = vec4(((vUv * 2.0) - 1.0) * vec2(1.0, -1.0), 0.0, 1.0);
}`
}

// Helps bring in external GLSL dependencies.
export function moduleloader(...includes) {
  return Promise.all(includes.map(async m => await filereader(m)))
}

// Helps with string to HTML coversion.
export function ranger(s = "") {
  return document.createRange().createContextualFragment(s)
}

// Helps read in files as text, useful when loading shaders.
export function filereader(path = "") {
  return fetch(path).then(r => r.ok && r.text())
}

function shadercompiler(gl) {
  return (type) => {
    const shader = gl.createShader(type)

    return (source) => {
      gl.shaderSource(shader, source)
      gl.compileShader(shader)

      const compileStatus = gl.getShaderParameter(shader, gl.COMPILE_STATUS)

      if (!compileStatus) {
        throw new Error(`sxs: failed to compile shader: ${gl.getShaderInfoLog(shader)}`)
      }

      return shader
    }
  }
}

export function programcreator(gl) {
  const shaderloader = shadercompiler(gl)

  return (vs, fs) => {
    const floader = shaderloader(gl.FRAGMENT_SHADER)
    const vloader = shaderloader(gl.VERTEX_SHADER)
    const f = floader(fs)
    const v = vloader(vs)
    const program = gl.createProgram()

    gl.attachShader(program, f)
    gl.attachShader(program, v)

    gl.linkProgram(program)

    const linkStatus = gl.getProgramParameter(program, gl.LINK_STATUS)

    if (!linkStatus) {
      throw new Error(`sxs: failed to link program: ${gl.gl.getProgramInfoLog(program)}`)
    }

    gl.deleteShader(f)
    gl.deleteShader(v)

    gl.validateProgram(program)

    const validateStatus = gl.getProgramParameter(program, gl.VALIDATE_STATUS)

    if (!validateStatus) {
      throw new Error(`sxs: failed to validate program: ${gl.gl.getProgramInfoLog(program)}`)
    }

    return program
  }
}

function glx(width, height) {
  const canvas = document.createElement("canvas")
  const gl = canvas.getContext("webgl2", { antialias: true })

  Object.assign(canvas, { width, height })

  return { gl, shadercompiler: shadercompiler(gl), programcreator: programcreator(gl) }
}
