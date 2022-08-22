uniform float uMixNight;
uniform float uMixNatural;
uniform sampler2D uTextureDay;
uniform sampler2D uTextureNight;
uniform sampler2D uTextureNatural;

varying vec2 vUv;

void main() 
{
    vec4 textureDayColor = texture2D(uTextureDay, vUv);
    vec4 textureNightColor = texture2D(uTextureNight, vUv);
    vec4 textureNaturalColor = texture2D(uTextureNatural, vUv);

    vec4 nightMixColor = mix(textureDayColor, textureNightColor, uMixNight);
    vec4 naturalMixColor = mix(textureDayColor, textureNaturalColor, uMixNatural);
    vec4 totalMixColor = mix(nightMixColor, textureNaturalColor, uMixNatural);

    gl_FragColor = totalMixColor;
}