uniform sampler2D uTexture;
uniform float uVisibility;

varying vec2 vUv;

void main()
{
    // Pattern
    float strength = distance(vUv, vec2(0.5, 0.5));
    strength = step(uVisibility, strength);

    // Video Texture Color
    vec4 textureColor = texture2D(uTexture, vUv);

    // color
    vec4 color = vec4(vec3(1.0), 1.0);

    // Mix
    vec4 mixedColor = mix(textureColor, color, strength);

    gl_FragColor = vec4(mixedColor.rgb, 1.0);
}