## about

[Shadertoy](https://www.shadertoy.com) inspired, bring your own buttons, GLSL live sketching HTML custom element. I made this so I can practice with color and texture based drawing in particular.

## setup

Load via script tag:

```html
<!-- Just an IIFE namespaced `sexpress` -->
<script src="sexpress.js"></script>
```

Source from an import map:

```json
{
  "imports": {
    "sxs": "https://thewhodidthis.github.io/shaderexpress/main.js"
  }
}
```

Download from GitHub directly, using _npm_ for example:

```sh
# Add to package.json
npm install thewhodidthis/shaderexpress
```

## usage

Need disable controls for iOS pointermove events to work in full screen mode.

```html
<!-- Mark it up. -->
<s-express height="360" width="640" fps="55" autoplay controls>
void sketch(in vec2 p, out vec4 oColor) {
  vec3 c = vec3(p * uResolution * 0.01, uTime * 0.001 * 0.25);
  oColor = vec4(c, 1.0);
}
</s-express>
<!-- Include the HTML custom element definitions and helper functions. -->
<script src="https://thewhodidthis.github.io/shaderexpress/sexpress.js"></script>
<!-- Turn it on. -->
<script>
  const { ShaderExpress, ShaderExpressTexture, ShaderExpressModule } = sexpress

  self.customElements?.define("s-express-module", ShaderExpressModule)
  self.customElements?.define("s-express-texture", ShaderExpressTexture)
  self.customElements?.define("s-express", ShaderExpress)
</script>
```

## see also

- [@thewhodidthis/glx](https://github.com/thewhodidthis/glx/)
