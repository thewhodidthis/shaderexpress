var sxs=(()=>{var A=Object.defineProperty;var B=Object.getOwnPropertyDescriptor;var D=Object.getOwnPropertyNames;var X=Object.prototype.hasOwnProperty;var O=(t,r)=>{for(var i in r)A(t,i,{get:r[i],enumerable:!0})},$=(t,r,i,a)=>{if(r&&typeof r=="object"||typeof r=="function")for(let c of D(r))!X.call(t,c)&&c!==i&&A(t,c,{get:()=>r[c],enumerable:!(a=B(r,c))||a.enumerable});return t};var q=t=>$(A({},"__esModule",{value:!0}),t);var M={};O(M,{ShaderExpress:()=>T,ShaderExpressModule:()=>v,ShaderExpressTexture:()=>p,bulkloader:()=>b,glx:()=>_,programcreator:()=>S,ranger:()=>U,textreader:()=>x,texturecreator:()=>L});var f=class extends HTMLElement{constructor(){super()}get src(){return this.getAttribute("src")}set src(r){this.setAttribute("src",r)}},p=class extends f{},v=class extends f{},T=class extends f{constructor(){super();let r=U(`<style>
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
      <video height="${this.height}" width="${this.width}" muted playsinline></video>
      <dialog>
        <form method="dialog">
          <textarea spellcheck="false"></textarea>
          <menu>
            <li><input type="submit" value="Update"></li>
            <li><button value="Cancel">Back</button></li>
            <li><input type="reset"></li>
          </menu>
        </form>
      </dialog>`);this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(r.cloneNode(!0));let i=this.shadowRoot.querySelector("textarea");this.shadowRoot.querySelector("form").addEventListener("reset",()=>{let e=new InputEvent("input",{data:this.textContent.trim()});i.dispatchEvent(e)});let c=this.shadowRoot.querySelector("video"),o=this.shadowRoot.querySelector("dialog");o.addEventListener("close",()=>{o.returnValue==="Update"&&(this.textContent=i.value),document.pictureInPictureElement&&document.exitPictureInPicture()}),this.addEventListener("edit",async function(){if(document.pictureInPictureEnabled)try{await c.requestPictureInPicture()}catch(n){throw n}o.showModal()}),this.addEventListener("open",function(){let n=document.createElement("input"),d=new FileReader;d.addEventListener("load",function(l){let E=new InputEvent("input",{data:l.target.result});i.dispatchEvent(E)}),n.setAttribute("accept",".glsl"),n.setAttribute("type","file"),n.addEventListener("change",function(){let[l]=n?.files;d.readAsText(l)}),n.click()}),this.addEventListener("save",function(){let n=new File([i.value],`sketch-${Date.now()}.glsl`,{type:"text/plain"}),d=URL.createObjectURL(n),u=document.createElement("a");u.setAttribute("download",n.name),u.setAttribute("href",d),u.click()})}#r=document.timeline.currentTime;#e=null;#i=55;#t=null;static get observedAttributes(){return["height","width","src","fps"]}get height(){return this.getAttribute("height")}set height(r){this.setAttribute("height",r)}get width(){return this.getAttribute("width")}set width(r){this.setAttribute("width",r)}get fps(){return this.getAttribute("fps")}set fps(r){this.setAttribute("fps",r)}get controls(){return this.hasAttribute("controls")}set controls(r){this.setAttribute("controls",r)}get autoplay(){return this.hasAttribute("autoplay")}set autoplay(r){this.setAttribute("autoplay",r)}get poster(){return this.getAttribute("poster")}set poster(r){this.setAttribute("poster",r)}async attributeChangedCallback(r,i,a){i!==null&&a!==null&&a!==i&&await this.connectedCallback()}async connectedCallback(){if(!!this.isConnected)try{let r=this.shadowRoot.querySelector("textarea"),i=this.shadowRoot.querySelector("video"),{width:a,height:c}=this,o={},{gl:e,createProgram:n,createTexture:d}=_(a,c);Object.assign(i,{width:a,height:c});let u=[0,0,0,0],l=({offsetX:s,offsetY:h})=>{u.splice(0,u.length,s,h,s-u[0],h-u[1])},g=await b(d)(...new Set(Array.from(this.children).filter(s=>s instanceof p).map(s=>s.src))),F=await b(x)(...new Set(Array.from(this.children).filter(s=>s instanceof v).map(s=>s.src)));r.oninput=s=>{s.inputType===""&&s.data!==null&&(r.value=r.textContent=s.data);let h=n(W(),N(r.value,...g.map(m=>`uniform sampler2D u${m.id};`),...F));e.useProgram(h),g.forEach(m=>{let y=`u${m.id}`;o[y]=e.getUniformLocation(h,y)}),o.uPointer=e.getUniformLocation(h,"uPointer"),o.uResolution=e.getUniformLocation(h,"uResolution"),o.uWindow=e.getUniformLocation(h,"uWindow"),o.uTime=e.getUniformLocation(h,"uTime"),o.aPosition=e.getAttribLocation(h,"aPosition"),o.aPosition!==-1&&e.enableVertexAttribArray(o.aPosition)};let R=Float32Array.of(0,0,0,c,a,0,a,0,0,c,a,c),k=2*Float32Array.BYTES_PER_ELEMENT,P=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,P),e.bufferData(e.ARRAY_BUFFER,R,e.STATIC_DRAW),e.bindBuffer(e.ARRAY_BUFFER,null),g.forEach((s,h)=>{let m=`u${s.id}`;s.id in o&&(e.activeTexture(e.TEXTURE0+h),e.bindTexture(e.TEXTURE_2D,s.texture),e.uniform1i(o[m],h))});let w=s=>{e.viewport(0,0,e.drawingBufferWidth,e.drawingBufferHeight),e.clearColor(1,1,1,1),e.clear(e.COLOR_BUFFER_BIT|e.DEPTH_BUFFER_BIT),e.bindBuffer(e.ARRAY_BUFFER,P),"uPointer"in o&&e.uniform4f(o.uPointer,...u),"uTime"in o&&(this.#r+=s-(this.#e??s),this.#e=s,e.uniform1f(o.uTime,this.#r)),"uResolution"in o&&e.uniform2f(o.uResolution,a,c),"uWindow"in o&&e.uniform2f(o.uWindow,self.innerWidth,self.innerHeight),"aPosition"in o&&(e.vertexAttribPointer(o.aPosition,2,e.FLOAT,e.TRUE,k,0),e.drawArrays(e.TRIANGLES,0,R.length/2)),this.#t=requestAnimationFrame(w)};i.controls=this.controls,i.srcObject=e.canvas.captureStream(Number(this.fps)),i.autoplay=this.autoplay,this.poster&&(i.poster=this.poster),i.onpause=()=>{document.removeEventListener("pointermove",l),this.#t=this.#e=cancelAnimationFrame(this.#t)},i.onplay=()=>{document.addEventListener("pointermove",l,{passive:!0}),this.#t=this.#t??requestAnimationFrame(w)},this.autoplay&&(this.#t=this.#e=cancelAnimationFrame(this.#t),this.#t=requestAnimationFrame(w));let C=new InputEvent("input",{data:this.src?await x(this.src):this.textContent.trim()});r.dispatchEvent(C);let I=new CustomEvent("ready",{detail:{video:i}});this.dispatchEvent(I)}catch({message:r}){let i=new ErrorEvent("error",{message:r});this.dispatchEvent(i)}}};function N(t="void sketch(in vec2 p, out vec4 c) {}",...r){return`#version 300 es
precision highp float;

in vec2 vUv;
uniform vec4 uPointer;
uniform vec2 uResolution;
uniform vec2 uWindow;
uniform float uTime;
out vec4 oColor;

${r.join(`
`)}
${t}

void main() {
  sketch(vUv, oColor);
}`}function W(){return`#version 300 es
precision highp float;

in vec2 aPosition;
uniform vec2 uResolution;
out vec2 vUv;

void main() {
  vUv = aPosition / uResolution;
  gl_Position = vec4(((vUv * 2.0) - 1.0) * vec2(1.0, -1.0), 0.0, 1.0);
}`}function U(t=""){return document.createRange().createContextualFragment(t)}function b(t){return function(...i){return Promise.all(i.map(async a=>await t(a)))}}function x(t){return fetch(t).then(r=>r.ok&&r.text())}function _(t,r){let i=document.createElement("canvas"),a=i.getContext("webgl2",{antialias:!0});return Object.assign(i,{width:t,height:r}),{gl:a,createProgram:S(a),createTexture:L(a)}}function L(t){return function(i,a){let c=t.createTexture();return t.bindTexture(t.TEXTURE_2D,c),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.LINEAR),new Promise((o,e)=>{let n=new Image;n.onerror=d=>{e(d)},n.onload=()=>{let{width:d,height:u}=n;t.texImage2D(t.TEXTURE_2D,0,t.RGBA,d,u,0,t.RGBA,t.UNSIGNED_BYTE,n),o({texture:c,id:i.split(".").shift().toUpperCase()})},n.src=i,a!==void 0&&(n.crossOrigin=a)})}}function G(t){return r=>{let i=t.createShader(r);return function(c){if(t.shaderSource(i,c),t.compileShader(i),!t.getShaderParameter(i,t.COMPILE_STATUS))throw new Error(`sxs: failed to compile shader: ${t.getShaderInfoLog(i)}`);return i}}}function S(t){let r=G(t),i=r(t.FRAGMENT_SHADER),a=r(t.VERTEX_SHADER);return function(o,e){let n=t.createProgram(),d=i(e),u=a(o);if(t.attachShader(n,d),t.attachShader(n,u),t.linkProgram(n),!t.getProgramParameter(n,t.LINK_STATUS))throw new Error(`sxs: failed to link program: ${t.gl.getProgramInfoLog(n)}`);if(t.deleteShader(d),t.deleteShader(u),t.validateProgram(n),!t.getProgramParameter(n,t.VALIDATE_STATUS))throw new Error(`sxs: failed to validate program: ${t.gl.getProgramInfoLog(n)}`);return n}}return q(M);})();
