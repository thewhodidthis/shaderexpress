var sxs=(()=>{var g=Object.defineProperty;var F=Object.getOwnPropertyDescriptor;var U=Object.getOwnPropertyNames;var _=Object.prototype.hasOwnProperty;var B=(e,t)=>{for(var r in t)g(e,r,{get:t[r],enumerable:!0})},I=(e,t,r,s)=>{if(t&&typeof t=="object"||typeof t=="function")for(let i of U(t))!_.call(e,i)&&i!==r&&g(e,i,{get:()=>t[i],enumerable:!(s=F(t,i))||s.enumerable});return e};var $=e=>I(g({},"__esModule",{value:!0}),e);var q={};B(q,{ShaderExpress:()=>v,ShaderExpressModule:()=>f,filereader:()=>b,moduleloader:()=>P,programcreator:()=>T,ranger:()=>x});var f=class extends HTMLElement{constructor(){super()}get src(){return this.getAttribute("src")}set src(t){this.setAttribute("src",t)}},v=class extends HTMLElement{constructor(){super();let t=x(`<style>
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
      </dialog>`);this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(t.cloneNode(!0))}#r=document.timeline.currentTime;#o=55;#e=null;#t=null;get width(){return this.getAttribute("width")}set width(t){this.setAttribute("width",t)}get height(){return this.getAttribute("height")}set height(t){this.setAttribute("height",t)}get fps(){return this.getAttribute("fps")}set fps(t){this.setAttribute("fps",t)}get src(){return this.getAttribute("src")}set src(t){this.setAttribute("src",t)}get controls(){return this.hasAttribute("controls")}set controls(t){this.setAttribute("controls",t)}get autoplay(){return this.hasAttribute("autoplay")}set autoplay(t){this.setAttribute("autoplay",t)}get watch(){return this.hasAttribute("watch")}set watch(t){this.setAttribute("watch",t)}static get observedAttributes(){return["height","width","src","fps"]}async attributeChangedCallback(t,r,s){r!==null&&s!==null&&s!==r&&await this.connectedCallback()}async connectedCallback(){if(!(this.localName===this.parentNode?.localName||!this.isConnected))try{let t=this.shadowRoot.querySelector("dialog"),r=this.shadowRoot.querySelector("pre[contenteditable]");t?.addEventListener("close",()=>{t.returnValue==="Update"&&(this.textContent=r.textContent),document.pictureInPictureElement&&document.exitPictureInPicture()}),this.shadowRoot.querySelector("form")?.addEventListener("reset",()=>{r.textContent=this.textContent.trim()});let i=this.shadowRoot.querySelector("video"),{width:u,height:l}=i,a={},{gl:o,programcreator:w}=O(u,l),d=[0,0,0,0],A=({offsetX:c,offsetY:n})=>{d.splice(0,d.length,c,n,c-d[0],n-d[1])};this.addEventListener("open",function(){let n=document.createElement("input"),m=new FileReader;m.addEventListener("load",function(p){r.textContent=p.target.result}),n.setAttribute("accept",".glsl"),n.setAttribute("type","file"),n.addEventListener("change",function(){let[p]=n?.files;m.readAsText(p)}),n.click()}),this.addEventListener("save",function(){let n=new File([r.textContent],`sketch-${Date.now()}.glsl`,{type:"text/plain"}),m=URL.createObjectURL(n),h=document.createElement("a");h.setAttribute("download",n.name),h.setAttribute("href",m),h.click()}),this.addEventListener("edit",function(){if(document.pictureInPictureEnabled)try{i.requestPictureInPicture()}catch(n){throw n}t?.showModal()});let L=await P(...Array.from(this.children).filter(c=>c instanceof f).map(c=>c.src));new MutationObserver(function(){let n=w(N(),D(r.textContent,...L));o.useProgram(n),a.uPointer=o.getUniformLocation(n,"uPointer"),a.uResolution=o.getUniformLocation(n,"uResolution"),a.uTime=o.getUniformLocation(n,"uTime"),a.aPosition=o.getAttribLocation(n,"aPosition"),a.aPosition!==-1&&o.enableVertexAttribArray(a.aPosition)}).observe(r,{characterData:!0,childList:!0,subtree:!0}),r.textContent=this.src?await b(this.src):this.textContent.trim();let E=Float32Array.of(0,0,0,l,u,0,u,0,0,l,u,l),C=2*Float32Array.BYTES_PER_ELEMENT,R=o.createBuffer();o.bindBuffer(o.ARRAY_BUFFER,R),o.bufferData(o.ARRAY_BUFFER,E,o.STATIC_DRAW),o.bindBuffer(o.ARRAY_BUFFER,null);let y=c=>{o.viewport(0,0,o.drawingBufferWidth,o.drawingBufferHeight),o.clearColor(1,1,1,1),o.clear(o.COLOR_BUFFER_BIT|o.DEPTH_BUFFER_BIT),o.bindBuffer(o.ARRAY_BUFFER,R),"uPointer"in a&&o.uniform4f(a.uPointer,...d),"uTime"in a&&(this.#r+=c-(this.#e??c),this.#e=c,o.uniform1f(a.uTime,this.#r)),"uResolution"in a&&o.uniform2f(a.uResolution,u,l),"aPosition"in a&&(o.vertexAttribPointer(a.aPosition,2,o.FLOAT,o.TRUE,C,0),o.drawArrays(o.TRIANGLES,0,E.length/2)),this.#t=requestAnimationFrame(y)};i.controls=this.controls,i.srcObject=o.canvas.captureStream(this.#o),i.autoplay=this.autoplay,i.onpause=()=>{i.removeEventListener("pointermove",A),this.#t=this.#e=cancelAnimationFrame(this.#t)},i.onplay=()=>{i.addEventListener("pointermove",A,{passive:!0}),this.#t=requestAnimationFrame(y)},i.autoplay&&await i.play();let k=new CustomEvent("ready",{detail:{video:i}});this.dispatchEvent(k)}catch({message:t}){let r=new ErrorEvent("error",{message:t});this.dispatchEvent(r)}}};function D(e="void sketch(in vec2 p, out vec4 c) {}",...t){return`#version 300 es
precision highp float;

in vec2 vUv;
uniform vec4 uPointer;
uniform vec2 uResolution;
uniform float uTime;
out vec4 oColor;

${t.join("")}
${e}

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
}`}function P(...e){return Promise.all(e.map(async t=>await b(t)))}function x(e=""){return document.createRange().createContextualFragment(e)}function b(e=""){return fetch(e).then(t=>t.ok&&t.text())}function S(e){return t=>{let r=e.createShader(t);return s=>{if(e.shaderSource(r,s),e.compileShader(r),!e.getShaderParameter(r,e.COMPILE_STATUS))throw new Error(`sxs: failed to compile shader: ${e.getShaderInfoLog(r)}`);return r}}}function T(e){let t=S(e),r=e.createProgram(),s=t(e.FRAGMENT_SHADER),i=t(e.VERTEX_SHADER);return(u,l)=>{let a=s(l),o=i(u);if(e.attachShader(r,a),e.attachShader(r,o),e.linkProgram(r),!e.getProgramParameter(r,e.LINK_STATUS))throw new Error(`sxs: failed to link program: ${e.gl.getProgramInfoLog(r)}`);if(e.deleteShader(a),e.deleteShader(o),e.validateProgram(r),!e.getProgramParameter(r,e.VALIDATE_STATUS))throw new Error(`sxs: failed to validate program: ${e.gl.getProgramInfoLog(r)}`);return r}}function O(e,t){let r=document.createElement("canvas"),s=r.getContext("webgl2",{antialias:!0});return Object.assign(r,{width:e,height:t}),{gl:s,shadercompiler:S(s),programcreator:T(s)}}return $(q);})();
