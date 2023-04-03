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
          contain: content;
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
        textarea {
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
        textarea:focus {
          outline: 1px dotted;
          outline-offset: 1px;
        }
        form {
          display: grid;
          grid-template-rows: 1fr auto;
          height: 100%;
        }
        dialog {
          aspect-ratio: 5 / 3;
          border: 0;
          box-sizing: border-box;
          max-width: 50rem;
          padding: 1rem;
          width: calc(100vw - 3rem);
        }
        dialog::backdrop {
          background: whitesmoke;
        }
      </style>
      <video height="${this.height}" width="${this.width}" part="video" muted playsinline></video>
      <dialog part="dialog">
        <form method="dialog" part="form">
          <textarea spellcheck="false" part="textarea" autofocus></textarea>
          <menu part="menu">
            <li><input type="submit" value="Update"></li>
            <li><button value="Cancel">Back</button></li>
            <li><input type="reset"></li>
          </menu>
        </form>
      </dialog>`
    )

    this.attachShadow({ mode: "open" })
    this.shadowRoot.appendChild(template.cloneNode(true))

    const textarea = this.shadowRoot.querySelector("textarea")
    const form = this.shadowRoot.querySelector("form")

    form.addEventListener("reset", () => {
      const inputevent = new InputEvent("input", { data: this.textContent.trim() })

      textarea.dispatchEvent(inputevent)
    })

    const dialog = this.shadowRoot.querySelector("dialog")

    dialog.addEventListener("close", () => {
      // NOTE: Fires on cancel too.
      if (dialog.returnValue === "Update") {
        this.textContent = textarea.value
      }

      if (document.pictureInPictureElement) {
        document.exitPictureInPicture()
      }
    })

    const video = this.shadowRoot.querySelector("video")

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

    this.addEventListener("open", function onopen() {
      const input = document.createElement("input")
      const reader = new FileReader()

      reader.addEventListener("load", function onload(e) {
        const inputevent = new InputEvent("input", { data: e.target.result })

        textarea.dispatchEvent(inputevent)
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
      const file = new File([textarea.value], `sketch-${Date.now()}.glsl`, { type: "text/plain" })
      const url = URL.createObjectURL(file)
      const link = document.createElement("a")

      link.setAttribute("download", file.name)
      link.setAttribute("href", url)
      link.click()
    })
  }
  #currentTime = document.timeline.currentTime
  #lastTime = null
  #fps = 55
  #frame = null
  static get observedAttributes() {
    return ["height", "width", "src", "fps"]
  }
  get height() {
    return this.getAttribute("height")
  }
  set height(v) {
    this.setAttribute("height", v)
  }
  get width() {
    return this.getAttribute("width")
  }
  set width(v) {
    this.setAttribute("width", v)
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
  get poster() {
    return this.getAttribute("poster")
  }
  set poster(v) {
    this.setAttribute("poster", v)
  }
  async attributeChangedCallback(_, oldValue, newValue) {
    if (oldValue !== null && newValue !== null && newValue !== oldValue) {
      await this.connectedCallback()
    }
  }
  async connectedCallback() {
    // NOTE: Not sure if this makes a difference here.
    if (!this.isConnected) {
      return
    }

    try {
      const textarea = this.shadowRoot.querySelector("textarea")
      const video = this.shadowRoot.querySelector("video")

      const { width, height } = this
      const state = {}
      const { gl, createProgram, createTexture } = glx(width, height)

      Object.assign(video, { width, height })

      const pointer = [0, 0, 0, 0]
      const tracker = ({ offsetX: x, offsetY: y }) => {
        pointer.splice(0, pointer.length, x, y, x - pointer[0], y - pointer[1])
      }

      // Collect images into textures.
      const textureloader = bulkloader(createTexture)
      const textures = await textureloader(
        ...new Set(Array.from(this.children)
          .filter(c => c instanceof ShaderExpressTexture)
          .map(c => c.src))
      )

      // Collect dependencies.
      const moduleloader = bulkloader(textreader)
      const modules = await moduleloader(
        ...new Set(Array.from(this.children)
          .filter(c => c instanceof ShaderExpressModule)
          .map(c => c.src))
      )

      // Update content before attaching the input watcher.
      textarea.oninput = (e) => {
        if (e.inputType === "" && e.data !== null) {
          textarea.value = textarea.textContent = e.data
        }

        const program = createProgram(
          vertexshader(),
          fragmentshader(
            textarea.value,
            ...textures.map((t) => `uniform sampler2D u${t.id};`),
            ...modules,
          )
        )

        gl.useProgram(program)

        // Map textures into uniform locations.
        textures.forEach((t) => {
          const id = `u${t.id}`

          state[id] = gl.getUniformLocation(program, id)
        })

        state.uPointer = gl.getUniformLocation(program, "uPointer")
        state.uResolution = gl.getUniformLocation(program, "uResolution")
        state.uWindow = gl.getUniformLocation(program, "uWindow")
        state.uTime = gl.getUniformLocation(program, "uTime")
        state.aPosition = gl.getAttribLocation(program, "aPosition")

        if (state.aPosition !== -1) {
          gl.enableVertexAttribArray(state.aPosition)
        }
      }

      const edges = Float32Array.of(0, 0, 0, height, width, 0, width, 0, 0, height, width, height)
      const stride = 2 * Float32Array.BYTES_PER_ELEMENT
      const shape = gl.createBuffer()

      gl.bindBuffer(gl.ARRAY_BUFFER, shape)
      gl.bufferData(gl.ARRAY_BUFFER, edges, gl.STATIC_DRAW)
      gl.bindBuffer(gl.ARRAY_BUFFER, null)

      textures.forEach((t, i) => {
        const id = `u${t.id}`

        if (t.id in state) {
          gl.activeTexture(gl.TEXTURE0 + i)
          gl.bindTexture(gl.TEXTURE_2D, t.texture)
          gl.uniform1i(state[id], i)
        }
      })

      const loop = (timestamp) => {
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)
        gl.clearColor(1, 1, 1, 1)
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
        gl.bindBuffer(gl.ARRAY_BUFFER, shape)

        if ("uPointer" in state) {
          gl.uniform4f(state.uPointer, ...pointer)
        }

        if ("uTime" in state) {
          this.#currentTime += timestamp - (this.#lastTime ?? timestamp)
          this.#lastTime = timestamp

          gl.uniform1f(state.uTime, this.#currentTime)
        }

        if ("uResolution" in state) {
          gl.uniform2f(state.uResolution, width, height)
        }

        if ("uWindow" in state) {
          gl.uniform2f(state.uWindow, self.innerWidth, self.innerHeight)
        }

        if ("aPosition" in state) {
          gl.vertexAttribPointer(state.aPosition, 2, gl.FLOAT, gl.TRUE, stride, 0)
          gl.drawArrays(gl.TRIANGLES, 0, edges.length / 2)
        }

        this.#frame = requestAnimationFrame(loop)
      }

      video.controls = this.controls
      video.srcObject = gl.canvas.captureStream(Number(this.fps))
      video.autoplay = this.autoplay

      if (this.poster) {
        video.poster = this.poster
      }

      video.onpause = () => {
        document.removeEventListener("pointermove", tracker)

        this.#frame = this.#lastTime = cancelAnimationFrame(this.#frame)
      }

      // These being on style handlers means they replace any previous ones.
      video.onplay = () => {
        document.addEventListener("pointermove", tracker, { passive: true })

        this.#frame = this.#frame ?? requestAnimationFrame(loop)
      }

      if (this.autoplay) {
        this.#frame = this.#lastTime = cancelAnimationFrame(this.#frame)
        this.#frame = requestAnimationFrame(loop)
      }

      // All set.
      const inputevent = new InputEvent("input", {
        data: this.src ? await textreader(this.src) : this.textContent.trim()
      })

      textarea.dispatchEvent(inputevent)

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
uniform vec2 uWindow;
uniform float uTime;
out vec4 oColor;

${extras.join("\n")}
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

// Helps with string to HTML coversion.
export function ranger(s = "") {
  return document.createRange().createContextualFragment(s)
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
  return function createTexture(src, crossorigin) {
    const texture = gl.createTexture()

    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)

    return new Promise((resolve, reject) => {
      const image = new Image()

      image.onerror = (e) => {
        reject(e)
      }

      image.onload = () => {
        const { width: w, height: h } = image

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, image)

        resolve({ texture, id: src.split(".").shift().toUpperCase() })
      }

      image.src = src

      if (crossorigin !== undefined) {
        image.crossOrigin = crossorigin
      }
    })
  }
}

function shadercompiler(gl) {
  return (type) => {
    return function compileShader(source) {
      const shader = gl.createShader(type)

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
  const shadercreator = shadercompiler(gl)
  const floader = shadercreator(gl.FRAGMENT_SHADER)
  const vloader = shadercreator(gl.VERTEX_SHADER)

  return function createProgram(vshader, fshader) {
    const program = gl.createProgram()
    const f = floader(fshader)
    const v = vloader(vshader)

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
