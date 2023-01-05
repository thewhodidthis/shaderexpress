var sxs=(()=>{var A=Object.defineProperty;var D=Object.getOwnPropertyDescriptor;var X=Object.getOwnPropertyNames;var $=Object.prototype.hasOwnProperty;var O=(t,e)=>{for(var i in e)A(t,i,{get:e[i],enumerable:!0})},N=(t,e,i,s)=>{if(e&&typeof e=="object"||typeof e=="function")for(let n of X(e))!$.call(t,n)&&n!==i&&A(t,n,{get:()=>e[n],enumerable:!(s=D(e,n))||s.enumerable});return t};var q=t=>N(A({},"__esModule",{value:!0}),t);var j={};O(j,{ShaderExpress:()=>w,ShaderExpressModule:()=>b,ShaderExpressTexture:()=>E,bulkloader:()=>R,glx:()=>C,programcreator:()=>F,ranger:()=>L,textreader:()=>U,texturecreator:()=>S});var v=class extends HTMLElement{constructor(){super()}get src(){return this.getAttribute("src")}set src(e){this.setAttribute("src",e)}},E=class extends v{},b=class extends v{},w=class extends v{constructor(){super();let e=L(`<style>
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
      <video height="${this.height}" width="${this.width}" fps="${this.#o}" muted playsinline></video>
      <dialog>
        <form method="dialog">
          <pre id="code" contenteditable spellcheck="false"></pre>
          <menu>
            <li><input type="submit" value="Update"></li>
            <li><button value="Cancel">Back</button></li>
            <li><input type="reset"></li>
          </menu>
        </form>
      </dialog>`);this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(e.cloneNode(!0))}#r=document.timeline.currentTime;#o=55;#e=null;#t=null;get width(){return this.getAttribute("width")}set width(e){this.setAttribute("width",e)}get height(){return this.getAttribute("height")}set height(e){this.setAttribute("height",e)}get fps(){return this.getAttribute("fps")}set fps(e){this.setAttribute("fps",e)}get controls(){return this.hasAttribute("controls")}set controls(e){this.setAttribute("controls",e)}get autoplay(){return this.hasAttribute("autoplay")}set autoplay(e){this.setAttribute("autoplay",e)}get watch(){return this.hasAttribute("watch")}set watch(e){this.setAttribute("watch",e)}static get observedAttributes(){return["height","width","src","fps"]}async attributeChangedCallback(e,i,s){i!==null&&s!==null&&s!==i&&await this.connectedCallback()}async connectedCallback(){if(!!this.isConnected)try{let e=this.shadowRoot.querySelector("pre[contenteditable]"),i=this.shadowRoot.querySelector("dialog");i.addEventListener("close",()=>{i.returnValue==="Update"&&(this.textContent=e.textContent),document.pictureInPictureElement&&document.exitPictureInPicture()}),this.shadowRoot.querySelector("form").addEventListener("reset",()=>{e.textContent=this.textContent.trim()});let n=this.shadowRoot.querySelector("video"),{width:d,height:l}=n,o={},{gl:r,createProgram:m,createTexture:x}=C(d,l),f=[0,0,0,0],P=({offsetX:c,offsetY:a})=>{f.splice(0,f.length,c,a,c-f[0],a-f[1])};this.addEventListener("open",function(){let a=document.createElement("input"),h=new FileReader;h.addEventListener("load",function(p){e.textContent=p.target.result}),a.setAttribute("accept",".glsl"),a.setAttribute("type","file"),a.addEventListener("change",function(){let[p]=a?.files;h.readAsText(p)}),a.click()}),this.addEventListener("save",function(){let a=new File([e.textContent],`sketch-${Date.now()}.glsl`,{type:"text/plain"}),h=URL.createObjectURL(a),u=document.createElement("a");u.setAttribute("download",a.name),u.setAttribute("href",h),u.click()}),this.addEventListener("edit",function(){if(document.pictureInPictureEnabled)try{n.requestPictureInPicture()}catch(a){throw a}i.showModal()});let k=await R(U)(...Array.from(this.children).filter(c=>c instanceof b).map(c=>c.src)),g=await R(x)(...Array.from(this.children).filter(c=>c instanceof E).map(c=>c.src));new MutationObserver(function(){let a=m(G(),M(e.textContent,...g.map((h,u)=>`uniform sampler2D uTexture${u};
`),...k));r.useProgram(a),g.forEach((h,u)=>{let p=`uTexture${u}`;o[p]=r.getUniformLocation(a,p)}),o.uPointer=r.getUniformLocation(a,"uPointer"),o.uResolution=r.getUniformLocation(a,"uResolution"),o.uTime=r.getUniformLocation(a,"uTime"),o.aPosition=r.getAttribLocation(a,"aPosition"),o.aPosition!==-1&&r.enableVertexAttribArray(o.aPosition)}).observe(e,{characterData:!0,childList:!0,subtree:!0}),e.textContent=this.src?await filereader(this.src):this.textContent.trim();let _=Float32Array.of(0,0,0,l,d,0,d,0,0,l,d,l),I=2*Float32Array.BYTES_PER_ELEMENT,y=r.createBuffer();r.bindBuffer(r.ARRAY_BUFFER,y),r.bufferData(r.ARRAY_BUFFER,_,r.STATIC_DRAW),r.bindBuffer(r.ARRAY_BUFFER,null);let T=c=>{r.viewport(0,0,r.drawingBufferWidth,r.drawingBufferHeight),r.clearColor(1,1,1,1),r.clear(r.COLOR_BUFFER_BIT|r.DEPTH_BUFFER_BIT),r.bindBuffer(r.ARRAY_BUFFER,y),g.forEach((a,h)=>{let u=`uTexture${h}`;u in o&&(r.activeTexture(r.TEXTURE0+h),r.bindTexture(r.TEXTURE_2D,a),r.uniform1i(o[u],h))}),"uPointer"in o&&r.uniform4f(o.uPointer,...f),"uTime"in o&&(this.#r+=c-(this.#e??c),this.#e=c,r.uniform1f(o.uTime,this.#r)),"uResolution"in o&&r.uniform2f(o.uResolution,d,l),"aPosition"in o&&(r.vertexAttribPointer(o.aPosition,2,r.FLOAT,r.TRUE,I,0),r.drawArrays(r.TRIANGLES,0,_.length/2)),this.#t=requestAnimationFrame(T)};n.controls=this.controls,n.srcObject=r.canvas.captureStream(this.#o),n.autoplay=this.autoplay,n.onplay=()=>{n.addEventListener("pointermove",P,{passive:!0}),this.#t=this.#t??requestAnimationFrame(T)},n.onpause=()=>{n.removeEventListener("pointermove",P),this.#t=this.#e=cancelAnimationFrame(this.#t)},n.autoplay&&(this.#t=requestAnimationFrame(T));let B=new CustomEvent("ready",{detail:{video:n}});this.dispatchEvent(B)}catch({message:e}){let i=new ErrorEvent("error",{message:e});this.dispatchEvent(i)}}};function M(t="void sketch(in vec2 p, out vec4 c) {}",...e){return`#version 300 es
precision highp float;

in vec2 vUv;
uniform vec4 uPointer;
uniform vec2 uResolution;
uniform float uTime;
out vec4 oColor;

${e.join("")}
${t}

void main() {
  sketch(vUv, oColor);
}`}function G(){return`#version 300 es
precision highp float;

in vec2 aPosition;
uniform vec2 uResolution;
out vec2 vUv;

void main() {
  vUv = aPosition / uResolution;
  gl_Position = vec4(((vUv * 2.0) - 1.0) * vec2(1.0, -1.0), 0.0, 1.0);
}`}function R(t){return function(...i){return Promise.all(i.map(async s=>await t(s)))}}function U(t){return fetch(t).then(e=>e.ok&&e.text())}function L(t=""){return document.createRange().createContextualFragment(t)}function C(t,e){let i=document.createElement("canvas"),s=i.getContext("webgl2",{antialias:!0});return Object.assign(i,{width:t,height:e}),{gl:s,createProgram:F(s),createTexture:S(s)}}function S(t){return function(i,s,n=t.createTexture()){return t.bindTexture(t.TEXTURE_2D,n),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.LINEAR),new Promise((d,l)=>{if(i){let o=new Image;o.onerror=r=>{l(r)},o.onload=()=>{let{width:r,height:m}=o;t.texImage2D(t.TEXTURE_2D,0,t.RGBA,r,m,0,t.RGBA,t.UNSIGNED_BYTE,o),d(n)},o.src=i,s!==void 0&&(o.crossOrigin=s)}else d(n)})}}function Y(t){return e=>{let i=t.createShader(e);return function(n){if(t.shaderSource(i,n),t.compileShader(i),!t.getShaderParameter(i,t.COMPILE_STATUS))throw new Error(`sxs: failed to compile shader: ${t.getShaderInfoLog(i)}`);return i}}}function F(t){let e=Y(t),i=e(t.FRAGMENT_SHADER),s=e(t.VERTEX_SHADER);return function(d,l){let o=t.createProgram(),r=i(l),m=s(d);if(t.attachShader(o,r),t.attachShader(o,m),t.linkProgram(o),!t.getProgramParameter(o,t.LINK_STATUS))throw new Error(`sxs: failed to link program: ${t.gl.getProgramInfoLog(o)}`);if(t.deleteShader(r),t.deleteShader(m),t.validateProgram(o),!t.getProgramParameter(o,t.VALIDATE_STATUS))throw new Error(`sxs: failed to validate program: ${t.gl.getProgramInfoLog(o)}`);return o}}return q(j);})();
