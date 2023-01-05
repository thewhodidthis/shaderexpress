class Dummy extends HTMLElement {
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

export class ShaderExpressTexture extends Dummy {}
export class ShaderExpressModule extends Dummy {}
export class ShaderExpress extends Dummy {
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
          aspect-ratio: 3 / 2;
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
  #lastTime = null
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
    if (!this.isConnected) {
      return
    }

    try {
      const editor = this.shadowRoot.querySelector("pre[contenteditable]")
      const dialog = this.shadowRoot.querySelector("dialog")

      dialog.addEventListener("close", () => {
        // NOTE: Fires on cancel too.
        if (dialog.returnValue === "Update") {
          this.textContent = editor.textContent
        }

        if (document.pictureInPictureElement) {
          document.exitPictureInPicture()
        }
      })

      const form = this.shadowRoot.querySelector("form")

      form.addEventListener("reset", () => {
        editor.textContent = this.textContent.trim()
      })

      const video = this.shadowRoot.querySelector("video")
      const { width: w, height: h } = video
      const state = {}
      const { gl, createProgram, createTexture } = glx(w, h)

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

      this.addEventListener("edit", async function onedit() {
        if (document.pictureInPictureEnabled) {
          try {
            await video.requestPictureInPicture()
          } catch (e) {
            throw e
          }
        }

        dialog.showModal()
      })

      // Collect dependencies.
      const moduleloader = bulkloader(textreader)
      const modules = await moduleloader(
        ...Array.from(this.children)
          .filter(c => c instanceof ShaderExpressModule)
          .map(c => c.src)
      )

      // Collect images into textures.
      const textureloader = bulkloader(createTexture)
      const textures = await textureloader(
        ...Array.from(this.children)
          .filter(c => c instanceof ShaderExpressTexture)
          .map(c => c.src)
      )

      const observer = new MutationObserver(function onmutate() {
        const program = createProgram(
          vertexshader(),
          fragmentshader(
            editor.textContent,
            ...textures.map((_, id) => `uniform sampler2D uTexture${id};\n`),
            ...modules,
          )
        )

        gl.useProgram(program)

        // Map textures into uniform locations.
        textures.forEach((_, i) => {
          const id = `uTexture${i}`

          state[id] = gl.getUniformLocation(program, id)
        })

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

        textures.forEach((texture, i) => {
          const id = `uTexture${i}`

          if (id in state) {
            gl.activeTexture(gl.TEXTURE0 + i)
            gl.bindTexture(gl.TEXTURE_2D, texture)
            gl.uniform1i(state[id], i)
          }
        })

        if ("uPointer" in state) {
          gl.uniform4f(state.uPointer, ...pointer)
        }

        if ("uTime" in state) {
          this.#currentTime += timestamp - (this.#lastTime ?? timestamp)
          this.#lastTime = timestamp

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

      video.onplay = () => {
        document.addEventListener("pointermove", tracker, { passive: true })

        this.#frame = this.#frame ?? requestAnimationFrame(loop)
      }

      video.onpause = () => {
        document.removeEventListener("pointermove", tracker)

        this.#frame = this.#lastTime = cancelAnimationFrame(this.#frame)
      }

      if (video.autoplay) {
        this.#frame = requestAnimationFrame(loop)
      }

      // All set.
      const readyevent = new CustomEvent("ready", { detail: { video } })

      this.dispatchEvent(readyevent)
    } catch ({ message }) {
      const errorevent = new ErrorEvent("error", { message })

      this.dispatchEvent(errorevent)
    }
  }
}

function fragmentshader(s = "void sketch(in vec2 p, out vec4 c) {}", ...extras) {
  return `#version 300 es
precision highp float;

in vec2 vUv;
uniform vec4 uPointer;
uniform vec2 uResolution;
uniform float uTime;
out vec4 oColor;

${extras.join("")}
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

// Helps load promisified things in bulk.
export function bulkloader(loader) {
  return function load(...list) {
    return Promise.all(list.map(async item => await loader(item)))
  }
}

// Helps read in files as text.
export function textreader(path) {
  return fetch(path).then(r => r.ok && r.text())
}

// Helps with string to HTML coversion.
export function ranger(s = "") {
  return document.createRange().createContextualFragment(s)
}

// Provides helpers for program and texture creation tied
// to an in-memory WebGL2 context.
export function glx(width, height) {
  const canvas = document.createElement("canvas")
  const gl = canvas.getContext("webgl2", { antialias: true })

  Object.assign(canvas, { width, height })

  return { gl, createProgram: programcreator(gl), createTexture: texturecreator(gl) }
}

// Helps load images into textures.
export function texturecreator(gl) {
  return function createTexture(src, crossorigin, texture = gl.createTexture()) {
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)

    return new Promise((resolve, reject) => {
      if (src) {
        const image = new Image()

        image.onerror = (e) => {
          reject(e)
        }

        image.onload = () => {
          const { width: w, height: h } = image

          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, image)

          resolve(texture)
        }

        image.src = src

        if (crossorigin !== undefined) {
          image.crossOrigin = crossorigin
        }
      } else {
        resolve(texture)
      }
    })
  }
}

function shadercompiler(gl) {
  return (type) => {
    const shader = gl.createShader(type)

    return function compileShader(source) {
      gl.shaderSource(shader, source)
      gl.compileShader(shader)

      const compilestatus = gl.getShaderParameter(shader, gl.COMPILE_STATUS)

      if (!compilestatus) {
        throw new Error(`sxs: failed to compile shader: ${gl.getShaderInfoLog(shader)}`)
      }

      return shader
    }
  }
}

export function programcreator(gl) {
  const shaderloader = shadercompiler(gl)
  const floader = shaderloader(gl.FRAGMENT_SHADER)
  const vloader = shaderloader(gl.VERTEX_SHADER)

  return function createProgram(vs, fs) {
    const program = gl.createProgram()
    const f = floader(fs)
    const v = vloader(vs)

    gl.attachShader(program, f)
    gl.attachShader(program, v)

    gl.linkProgram(program)

    const linkstatus = gl.getProgramParameter(program, gl.LINK_STATUS)

    if (!linkstatus) {
      throw new Error(`sxs: failed to link program: ${gl.gl.getProgramInfoLog(program)}`)
    }

    gl.deleteShader(f)
    gl.deleteShader(v)

    gl.validateProgram(program)

    const validatestatus = gl.getProgramParameter(program, gl.VALIDATE_STATUS)

    if (!validatestatus) {
      throw new Error(`sxs: failed to validate program: ${gl.gl.getProgramInfoLog(program)}`)
    }

    return program
  }
}
