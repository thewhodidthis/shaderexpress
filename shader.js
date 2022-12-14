const sketch = "void sketch(in vec2 p, out vec4 c) { c = vec4(0.0, 0.0, 0.0, 1.0); }"

export const fragment = (s = sketch) => `#version 300 es
precision highp float;

out vec4 oColor;
in vec2 vTextureCoord;
uniform vec4 uCursor;
uniform vec2 uResolution;
uniform float uTime;

${s}

void main() {
  sketch(vTextureCoord, oColor);
}`

export const vertex = () => `#version 300 es
precision highp float;

out vec2 vTextureCoord;
in vec2 aPosition;
uniform vec2 uResolution;

void main() {
  vTextureCoord = aPosition / uResolution;
  gl_Position = vec4(((vTextureCoord * 2.0) - 1.0) * vec2(1.0, -1.0), 0.0, 1.0);
}`
