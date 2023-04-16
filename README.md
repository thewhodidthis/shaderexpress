## about

A [Shadertoy](https://www.shadertoy.com) inspired, bring your own buttons, GLSL live coding HTML custom element to help practice color and texture based drawing. Instead of presenting code and results side by side as is often the case, [`HTMLCanvasElement.captureStream`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/captureStream) output is fed to a `<video>` element. That means picture-in-picture, fullscreen mode, and FPS throttling are readily available out of the box. Also, the `<textarea>` editor is wrapped in a `<dialog>` with its automatic `Escape` key binding and modal `::backdrop` overlay. Other niceties include:
- Referencing external code without having to rely on build tools like [glslify](https://github.com/glslify/glslify).
- Customizable CSS in places of interest via `part` attributes.
- Shader compilation boilerplate that can be used independently in library only mode.
- Saving and importing own sketches.

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

Need disable controls for iOS pointermove events to work in fullscreen mode. Also, picture-in-picture is known to be [unavailable programmatically on Firefox](https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement/requestPictureInPicture#browser_compatibility) at the moment.

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
<script>
  // Turn it on.
  self.customElements?.define("s-express", sexpress.ShaderExpress)
</script>
```

## see also

- [@thewhodidthis/glx](https://github.com/thewhodidthis/glx/)
- [@thewhodidthis/rtx](https://github.com/thewhodidthis/rtx/)
