var sxs=(()=>{var w=Object.defineProperty;var I=Object.getOwnPropertyDescriptor;var B=Object.getOwnPropertyNames;var D=Object.prototype.hasOwnProperty;var X=(t,e)=>{for(var r in e)w(t,r,{get:e[r],enumerable:!0})},O=(t,e,r,a)=>{if(e&&typeof e=="object"||typeof e=="function")for(let c of B(e))!D.call(t,c)&&c!==r&&w(t,c,{get:()=>e[c],enumerable:!(a=I(e,c))||a.enumerable});return t};var $=t=>O(w({},"__esModule",{value:!0}),t);var G={};X(G,{ShaderExpress:()=>b,ShaderExpressModule:()=>v,ShaderExpressTexture:()=>p,bulkloader:()=>A,glx:()=>y,programcreator:()=>_,ranger:()=>P,textreader:()=>T,texturecreator:()=>U});var m=class extends HTMLElement{constructor(){super()}get src(){return this.getAttribute("src")}set src(e){this.setAttribute("src",e)}},p=class extends m{},v=class extends m{},b=class extends m{constructor(){super();let e=P(`<style>
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
      <video height="${this.height}" width="${this.width}" muted playsinline></video>
      <dialog>
        <form method="dialog">
          <pre id="code" contenteditable spellcheck="false"></pre>
          <menu>
            <li><input type="submit" value="Update"></li>
            <li><button value="Cancel">Back</button></li>
            <li><input type="reset"></li>
          </menu>
        </form>
      </dialog>`);this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(e.cloneNode(!0));let r=this.shadowRoot.querySelector("pre[contenteditable]");this.shadowRoot.querySelector("form").addEventListener("reset",()=>{r.textContent=this.textContent.trim()});let c=this.shadowRoot.querySelector("video"),i=this.shadowRoot.querySelector("dialog");i.addEventListener("close",()=>{i.returnValue==="Update"&&(this.textContent=r.textContent),document.pictureInPictureElement&&document.exitPictureInPicture()}),this.addEventListener("edit",async function(){if(document.pictureInPictureEnabled)try{await c.requestPictureInPicture()}catch(n){throw n}i.showModal()}),this.addEventListener("open",function(){let n=document.createElement("input"),d=new FileReader;d.addEventListener("load",function(l){r.textContent=l.target.result}),n.setAttribute("accept",".glsl"),n.setAttribute("type","file"),n.addEventListener("change",function(){let[l]=n?.files;d.readAsText(l)}),n.click()}),this.addEventListener("save",function(){let n=new File([r.textContent],`sketch-${Date.now()}.glsl`,{type:"text/plain"}),d=URL.createObjectURL(n),u=document.createElement("a");u.setAttribute("download",n.name),u.setAttribute("href",d),u.click()})}#o=document.timeline.currentTime;#e=null;#r=55;#t=null;static get observedAttributes(){return["height","width","src","fps"]}get height(){return this.getAttribute("height")}set height(e){this.setAttribute("height",e)}get width(){return this.getAttribute("width")}set width(e){this.setAttribute("width",e)}get fps(){return this.getAttribute("fps")}set fps(e){this.setAttribute("fps",e)}get controls(){return this.hasAttribute("controls")}set controls(e){this.setAttribute("controls",e)}get autoplay(){return this.hasAttribute("autoplay")}set autoplay(e){this.setAttribute("autoplay",e)}get poster(){return this.getAttribute("poster")}set poster(e){this.setAttribute("poster",e)}async attributeChangedCallback(e,r,a){r!==null&&a!==null&&a!==r&&await this.connectedCallback()}async connectedCallback(){if(!!this.isConnected)try{let e=this.shadowRoot.querySelector("pre[contenteditable]"),r=this.shadowRoot.querySelector("video"),{width:a,height:c}=this,i={},{gl:o,createProgram:n,createTexture:d}=y(a,c);Object.assign(r,{width:a,height:c});let u=[0,0,0,0],l=({offsetX:s,offsetY:h})=>{u.splice(0,u.length,s,h,s-u[0],h-u[1])},E=await A(d)(...new Set(Array.from(this.children).filter(s=>s instanceof p).map(s=>s.src))),S=await A(T)(...new Set(Array.from(this.children).filter(s=>s instanceof v).map(s=>s.src)));e.textContent=this.src?await T(this.src):this.textContent.trim(),e.oninput=()=>{let s=n(N(),q(e.textContent,...E.map(h=>`uniform sampler2D u${h.id};`),...S));o.useProgram(s),E.forEach(h=>{let f=`u${h.id}`;i[f]=o.getUniformLocation(s,f)}),i.uPointer=o.getUniformLocation(s,"uPointer"),i.uResolution=o.getUniformLocation(s,"uResolution"),i.uWindow=o.getUniformLocation(s,"uWindow"),i.uTime=o.getUniformLocation(s,"uTime"),i.aPosition=o.getAttribLocation(s,"aPosition"),i.aPosition!==-1&&o.enableVertexAttribArray(i.aPosition)};let R=Float32Array.of(0,0,0,c,a,0,a,0,0,c,a,c),C=2*Float32Array.BYTES_PER_ELEMENT,x=o.createBuffer();o.bindBuffer(o.ARRAY_BUFFER,x),o.bufferData(o.ARRAY_BUFFER,R,o.STATIC_DRAW),o.bindBuffer(o.ARRAY_BUFFER,null),E.forEach((s,h)=>{let f=`u${s.id}`;s.id in i&&(o.activeTexture(o.TEXTURE0+h),o.bindTexture(o.TEXTURE_2D,s.texture),o.uniform1i(i[f],h))});let g=s=>{o.viewport(0,0,o.drawingBufferWidth,o.drawingBufferHeight),o.clearColor(1,1,1,1),o.clear(o.COLOR_BUFFER_BIT|o.DEPTH_BUFFER_BIT),o.bindBuffer(o.ARRAY_BUFFER,x),"uPointer"in i&&o.uniform4f(i.uPointer,...u),"uTime"in i&&(this.#o+=s-(this.#e??s),this.#e=s,o.uniform1f(i.uTime,this.#o)),"uResolution"in i&&o.uniform2f(i.uResolution,a,c),"uWindow"in i&&o.uniform2f(i.uWindow,self.innerWidth,self.innerHeight),"aPosition"in i&&(o.vertexAttribPointer(i.aPosition,2,o.FLOAT,o.TRUE,C,0),o.drawArrays(o.TRIANGLES,0,R.length/2)),this.#t=requestAnimationFrame(g)};r.controls=this.controls,r.srcObject=o.canvas.captureStream(Number(this.fps)),r.autoplay=this.autoplay,this.poster&&(r.poster=this.poster),r.onpause=()=>{document.removeEventListener("pointermove",l),this.#t=this.#e=cancelAnimationFrame(this.#t)},r.onplay=()=>{document.addEventListener("pointermove",l,{passive:!0}),this.#t=this.#t??requestAnimationFrame(g)},this.autoplay&&(this.#t=this.#e=cancelAnimationFrame(this.#t),this.#t=requestAnimationFrame(g));let F=new InputEvent("input");e.dispatchEvent(F);let k=new CustomEvent("ready",{detail:{video:r}});this.dispatchEvent(k)}catch({message:e}){let r=new ErrorEvent("error",{message:e});this.dispatchEvent(r)}}};function q(t="void sketch(in vec2 p, out vec4 c) {}",...e){return`#version 300 es
precision highp float;

in vec2 vUv;
uniform vec4 uPointer;
uniform vec2 uResolution;
uniform vec2 uWindow;
uniform float uTime;
out vec4 oColor;

${e.join(`
`)}
${t}

void main() {
  sketch(vUv, oColor);
}`}function N(){return`#version 300 es
precision highp float;

in vec2 aPosition;
uniform vec2 uResolution;
out vec2 vUv;

void main() {
  vUv = aPosition / uResolution;
  gl_Position = vec4(((vUv * 2.0) - 1.0) * vec2(1.0, -1.0), 0.0, 1.0);
}`}function P(t=""){return document.createRange().createContextualFragment(t)}function A(t){return function(...r){return Promise.all(r.map(async a=>await t(a)))}}function T(t){return fetch(t).then(e=>e.ok&&e.text())}function y(t,e){let r=document.createElement("canvas"),a=r.getContext("webgl2",{antialias:!0});return Object.assign(r,{width:t,height:e}),{gl:a,createProgram:_(a),createTexture:U(a)}}function U(t){return function(r,a){let c=t.createTexture();return t.bindTexture(t.TEXTURE_2D,c),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.LINEAR),new Promise((i,o)=>{let n=new Image;n.onerror=d=>{o(d)},n.onload=()=>{let{width:d,height:u}=n;t.texImage2D(t.TEXTURE_2D,0,t.RGBA,d,u,0,t.RGBA,t.UNSIGNED_BYTE,n),i({texture:c,id:r.split(".").shift().toUpperCase()})},n.src=r,a!==void 0&&(n.crossOrigin=a)})}}function W(t){return e=>{let r=t.createShader(e);return function(c){if(t.shaderSource(r,c),t.compileShader(r),!t.getShaderParameter(r,t.COMPILE_STATUS))throw new Error(`sxs: failed to compile shader: ${t.getShaderInfoLog(r)}`);return r}}}function _(t){let e=W(t),r=e(t.FRAGMENT_SHADER),a=e(t.VERTEX_SHADER);return function(i,o){let n=t.createProgram(),d=r(o),u=a(i);if(t.attachShader(n,d),t.attachShader(n,u),t.linkProgram(n),!t.getProgramParameter(n,t.LINK_STATUS))throw new Error(`sxs: failed to link program: ${t.gl.getProgramInfoLog(n)}`);if(t.deleteShader(d),t.deleteShader(u),t.validateProgram(n),!t.getProgramParameter(n,t.VALIDATE_STATUS))throw new Error(`sxs: failed to validate program: ${t.gl.getProgramInfoLog(n)}`);return n}}return $(G);})();
