(()=>{function C(...t){let e=U(...t);return{context:e,createFramebuffer:k(e),createIbo:P(e),createProgram:L(e),createVbo:T(e),getUniformLocations:_(e)}}function F(t){return e=>o=>{let n=t.createShader(e);if(t.shaderSource(n,o),t.compileShader(n),!t.getShaderParameter(n,t.COMPILE_STATUS))throw new Error(`glx.shaderCompiler: failed: ${t.getShaderInfoLog(n)}`);return n}}function L(t){let e=F(t),o=e(t.VERTEX_SHADER),n=e(t.FRAGMENT_SHADER);return(u,d)=>{let c=t.createProgram(),l=o(u),r=n(d);if(t.attachShader(c,l),t.attachShader(c,r),t.linkProgram(c),!t.getProgramParameter(c,t.LINK_STATUS))throw new Error(`glx.createProgram: failed: ${t.getProgramInfoLog(c)}`);if(t.deleteShader(r),t.deleteShader(l),t.validateProgram(c),!t.getProgramParameter(c,t.VALIDATE_STATUS))throw new Error(`glx.createProgram: failed: ${t.getProgramInfoLog(c)}`);return c}}function T(t){return(e,o=t.STATIC_DRAW)=>{let n=t.createBuffer();return t.bindBuffer(t.ARRAY_BUFFER,n),t.bufferData(t.ARRAY_BUFFER,e,o),t.bindBuffer(t.ARRAY_BUFFER,null),n}}function P(t){return(e,o=t.STATIC_DRAW)=>{let n=t.createBuffer();return t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,n),t.bufferData(t.ELEMENT_ARRAY_BUFFER,e,o),t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,null),n}}function k(t){return()=>{let e=t.createFramebuffer();return t.bindFramebuffer(t.FRAMEBUFFER,e),e}}function _(t){return(e,o)=>{let n={};for(let u of o)n[u]=t.getUniformLocation(e,u);return n}}function U(t,e){let{types:o,attributes:n}={types:["webgl2","webgl","experimental-webgl"],attributes:{antialias:!0},...e};for(let u of o)try{let d=t?.getContext(u,n);if(!d)throw new Error("glx: failed to create WebGL context");return d}catch(d){throw d}}var B="void sketch(in vec2 p, out vec4 c) { c = vec4(0.0, 0.0, 0.0, 1.0); }",I=(t=B)=>`#version 300 es
precision highp float;

out vec4 oColor;
in vec2 vTextureCoord;
uniform vec4 uCursor;
uniform vec2 uResolution;
uniform float uTime;

${t}

void main() {
  sketch(vTextureCoord, oColor);
}`,q=()=>`#version 300 es
precision highp float;

out vec2 vTextureCoord;
in vec2 aPosition;
uniform vec2 uResolution;

void main() {
  vTextureCoord = aPosition / uResolution;
  gl_Position = vec4(((vTextureCoord * 2.0) - 1.0) * vec2(1.0, -1.0), 0.0, 1.0);
}`,v=class extends HTMLElement{constructor(){super();let e=D(`<style>
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
      </menu>`);this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(e.cloneNode(!0))}#t=null;get width(){return this.getAttribute("width")}set width(e){this.setAttribute("width",e)}get height(){return this.getAttribute("height")}set height(e){this.setAttribute("height",e)}get src(){return this.getAttribute("src")}set src(e){this.setAttribute("src",e)}get autoplay(){return this.hasAttribute("autoplay")}set autoplay(e){this.setAttribute("autoplay",e)}get watch(){return this.hasAttribute("watch")}set watch(e){this.setAttribute("watch",e)}static get observedAttributes(){return["width","height","src"]}async attributeChangedCallback(e,o,n){o!==null&&n!==null&&n!==o&&await this.connectedCallback()}async connectedCallback(){if(!!this.isConnected)try{let e=this.shadowRoot.querySelector("dialog"),o=this.shadowRoot.querySelector("pre[contenteditable]");e?.addEventListener("close",()=>{e.returnValue==="Update"&&(this.textContent=o.textContent)}),this.shadowRoot.querySelector("form")?.addEventListener("reset",()=>{o.textContent=this.textContent.trim()}),this.shadowRoot.querySelector("button.edit")?.addEventListener("click",function(){e?.showModal()}),this.shadowRoot.querySelector("button.save")?.addEventListener("click",function(){let s=new File([o.textContent],`sketch-${Date.now()}.glsl`,{type:"text/plain"}),g=URL.createObjectURL(s),h=document.createElement("a");h.setAttribute("download",s.name),h.setAttribute("href",g),h.click()}),this.shadowRoot.querySelector("button.open")?.addEventListener("click",()=>{let i=document.createElement("input"),s=new FileReader;s.addEventListener("load",function(h){o.textContent=h.target.result}),i.setAttribute("accept",".glsl"),i.setAttribute("type","file"),i.addEventListener("change",function(){let[h]=i?.files;s.readAsText(h)}),i.click()});let l=this.shadowRoot.querySelector("canvas"),{context:r,createProgram:w,createVbo:E}=C(l),a={},{width:f,height:m}=l,p=[0,0,0,0],A=i=>{p.splice(0,p.length,i.offsetX,i.offsetY,i.movementX,i.movementY)};new MutationObserver(async function(){let s=await w(q(),I(o.textContent));r.useProgram(s),a.uCursor=r.getUniformLocation(s,"uCursor"),a.uResolution=r.getUniformLocation(s,"uResolution"),a.uTime=r.getUniformLocation(s,"uTime"),a.aPosition=r.getAttribLocation(s,"aPosition"),a.aPosition!==-1&&r.enableVertexAttribArray(a.aPosition)}).observe(o,{characterData:!0,childList:!0,subtree:!0});let R=new Float32Array([0,0,0,m,f,0,f,0,0,m,f,m]),x=E(R),y=i=>{r.viewport(0,0,r.drawingBufferWidth,r.drawingBufferHeight),r.clearColor(1,1,1,1),r.clear(r.COLOR_BUFFER_BIT|r.DEPTH_BUFFER_BIT),r.bindBuffer(r.ARRAY_BUFFER,x),"uTime"in a&&r.uniform1f(a.uTime,i*.001),"uResolution"in a&&r.uniform2f(a.uResolution,f,m),"uCursor"in a&&r.uniform4f(a.uCursor,...p),"aPosition"in a&&(r.vertexAttribPointer(a.aPosition,2,r.FLOAT,r.TRUE,2*Float32Array.BYTES_PER_ELEMENT,0),r.drawArrays(r.TRIANGLES,0,R.length/2)),this.#t=requestAnimationFrame(y)},b=this.shadowRoot.querySelector("button.play");if(b?.addEventListener("click",()=>{this.#t?(l.removeEventListener("pointermove",A),b.replaceChildren("Play"),this.#t=cancelAnimationFrame(this.#t)):(l.addEventListener("pointermove",A,{passive:!0}),b.replaceChildren("Stop"),this.#t=requestAnimationFrame(y))}),this.src){let i=await fetch(this.src);i.ok&&(o.textContent=await i.text())}this.autoplay&&b?.click();let S=new Event("ready");this.dispatchEvent(S)}catch({message:e}){let o=new ErrorEvent("error",{message:e});this.dispatchEvent(o)}}};function D(t=""){return document.createRange().createContextualFragment(t)}var M=document.querySelector("s-express");M?.addEventListener("error",function(e){console.log("error",e?.message)});self.customElements?.define("s-express",v);})();
