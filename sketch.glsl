// http://www.pouet.net/prod.php?which=57245
// If you intend to reuse this shader, please add credits to 'Danilo Guanabara'

#define t uTime
#define r uResolution.xy

void sketch(in vec2 vTextureCoord, out vec4 oColor) {
  vec3 c;
  float l, z = t;

  for (int i = 0; i < 3; i++) {
    vec2 uv, p = vTextureCoord.xy;

    uv = p;
    p -= 0.5;
    p.x *= r.x / r.y;
    z += 0.07;
    l = length(p);
    uv += p / l * (sin(z) + 1.0) * abs(sin(l * 9.0 - z - z));
    c[i] = 0.01 / length(mod(uv, 1.0) - 0.5);
  }

  oColor = vec4(c / l, t);
}
