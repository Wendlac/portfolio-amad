/*
  Traitement WebGL des visuels de la vitrine.

  Un plan, une texture, un shader : déformation de l'image vers le pointeur,
  léger décalage RVB en périphérie de la zone touchée, grain animé, et fondu
  enchaîné entre deux projets. Rien de plus — l'idée est de donner de la matière
  à une photo, pas de faire une démo de moteur 3D.

  Trois garde-fous, dans l'ordre où ils comptent :

  1. Three.js pèse 733 Ko bruts. Il n'est PAS chargé au démarrage : l'import
     dynamique n'est déclenché que lorsque la vitrine approche de l'écran. Une
     visite qui ne descend jamais jusqu'aux projets ne le télécharge jamais.

  2. Si WebGL manque, si l'import échoue ou si le visiteur a demandé moins
     d'animations, on ne fait rien du tout. Les <img> de la vitrine restent
     affichées — ce sont elles qui portent le contenu, le canvas n'est qu'un
     vernis par-dessus.

  3. Le rendu s'arrête hors écran et onglet masqué.
*/
(function () {
  "use strict";

  var THREE_URL = "/assets/vendor/three.module.min.js";

  var VERTEX = [
    "varying vec2 vUv;",
    "void main() {",
    "  vUv = uv;",
    "  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);",
    "}"
  ].join("\n");

  var FRAGMENT = [
    "precision mediump float;",
    "varying vec2 vUv;",
    "uniform sampler2D uFrom;",
    "uniform sampler2D uTo;",
    "uniform vec2 uFromScale;",   // correction du rapport d'aspect, façon object-fit: cover
    "uniform vec2 uToScale;",
    "uniform float uMix;",        // 0 = uFrom, 1 = uTo
    "uniform vec2 uPointer;",     // position du pointeur en UV
    "uniform float uHover;",      // 0 au repos, 1 au survol
    "uniform float uTime;",

    // Recadrage « cover » : sans ça la texture est étirée au rapport du canvas.
    "vec2 cover(vec2 uv, vec2 scale) {",
    "  return (uv - 0.5) / scale + 0.5;",
    "}",

    // Bruit bon marché — suffisant pour un grain, inutile d'aller chercher
    // un simplex complet pour trois pixels de texture.
    "float hash(vec2 p) {",
    "  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);",
    "}",

    "void main() {",
    "  vec2 uv = vUv;",

    // Creux souple autour du pointeur : l'image est aspirée vers lui.
    "  float d = distance(uv, uPointer);",
    "  float pull = smoothstep(0.45, 0.0, d) * uHover;",
    "  vec2 dir = normalize(uv - uPointer + 0.0001);",
    "  vec2 warped = uv - dir * pull * 0.045;",

    // Décalage RVB proportionnel à la déformation : nul au repos, donc
    // invisible tant qu'on ne survole pas.
    "  float split = pull * 0.006;",

    "  vec2 uvFrom = cover(warped, uFromScale);",
    "  vec2 uvTo = cover(warped, uToScale);",

    "  vec4 from = vec4(",
    "    texture2D(uFrom, uvFrom + vec2(split, 0.0)).r,",
    "    texture2D(uFrom, uvFrom).g,",
    "    texture2D(uFrom, uvFrom - vec2(split, 0.0)).b,",
    "    1.0);",
    "  vec4 to = vec4(",
    "    texture2D(uTo, uvTo + vec2(split, 0.0)).r,",
    "    texture2D(uTo, uvTo).g,",
    "    texture2D(uTo, uvTo - vec2(split, 0.0)).b,",
    "    1.0);",

    // Le fondu balaie l'image de gauche à droite au lieu d'un cross-fade plat :
    // ça se lit comme un mouvement, pas comme une transition de diaporama.
    "  float sweep = smoothstep(uMix - 0.35, uMix + 0.35, 1.0 - uv.x);",
    "  vec4 color = mix(to, from, sweep);",

    "  float grain = (hash(uv * 900.0 + fract(uTime)) - 0.5) * 0.045;",
    "  color.rgb += grain;",

    "  gl_FragColor = color;",
    "}"
  ].join("\n");

  function supportsWebGL() {
    try {
      var probe = document.createElement("canvas");
      return !!(window.WebGLRenderingContext &&
        (probe.getContext("webgl") || probe.getContext("experimental-webgl")));
    } catch (error) {
      return false;
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    var root = document.querySelector("[data-showcase]");
    var media = root && root.querySelector("[data-showcase-media]");
    if (!media) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!supportsWebGL()) return;
    if (!("IntersectionObserver" in window)) return;

    var started = false;

    var watcher = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting || started) return;
      started = true;
      watcher.disconnect();
      boot();
    }, { rootMargin: "400px 0px" });

    watcher.observe(media);

    function boot() {
      import(THREE_URL).then(function (THREE) {
        mount(THREE);
      }).catch(function () {
        /* Silencieux à dessein : l'absence d'effet n'est pas une erreur pour le
           visiteur, les images restent affichées. */
      });
    }

    function mount(THREE) {
      var images = Array.prototype.slice.call(media.querySelectorAll("img"));
      if (images.length === 0) return;

      var renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      media.appendChild(renderer.domElement);

      var scene = new THREE.Scene();
      var camera = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, 0, 1);

      var loader = new THREE.TextureLoader();
      var firstReady = false;
      var textures = images.map(function (img, index) {
        var texture = loader.load(img.currentSrc || img.src, function () {
          /* La bascule vers le canvas attend la première texture décodée :
             plus tôt, on afficherait un cadre vide. */
          if (index === 0 && !firstReady) {
            firstReady = true;
            reveal();
          } else {
            resize();
          }
        });
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.minFilter = THREE.LinearFilter;
        texture.generateMipmaps = false;
        return texture;
      });

      var uniforms = {
        uFrom: { value: textures[0] },
        uTo: { value: textures[0] },
        uFromScale: { value: new THREE.Vector2(1, 1) },
        uToScale: { value: new THREE.Vector2(1, 1) },
        uMix: { value: 1 },
        uPointer: { value: new THREE.Vector2(0.5, 0.5) },
        uHover: { value: 0 },
        uTime: { value: 0 }
      };

      var mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(1, 1),
        new THREE.ShaderMaterial({ uniforms: uniforms, vertexShader: VERTEX, fragmentShader: FRAGMENT })
      );
      scene.add(mesh);

      /* Rapport d'aspect image / cadre, pour reproduire object-fit: cover dans
         le shader. Tant que la texture n'est pas chargée, on garde 1:1. */
      function coverScale(index, out) {
        var texture = textures[index];
        var frame = media.clientWidth / media.clientHeight;
        if (!texture.image || !texture.image.width) {
          out.set(1, 1);
          return;
        }
        var ratio = texture.image.width / texture.image.height;
        if (ratio > frame) out.set(ratio / frame, 1);
        else out.set(1, frame / ratio);
      }

      var fromIndex = 0;
      var toIndex = 0;
      var mixTarget = 1;
      var pointerTarget = { x: 0.5, y: 0.5 };
      var hoverTarget = 0;
      var visible = true;
      var frame = 0;

      function resize() {
        var w = media.clientWidth;
        var h = media.clientHeight;
        if (!w || !h) return;
        renderer.setSize(w, h, false);
        coverScale(fromIndex, uniforms.uFromScale.value);
        coverScale(toIndex, uniforms.uToScale.value);
      }

      /* Passe la main du <img> au canvas. .is-gl ne fait que croiser les deux
         opacités : l'image reste dans le DOM et garde son alt. */
      function reveal() {
        resize();
        media.classList.add("is-gl");
        start();
      }

      media.addEventListener("pointerenter", function () { hoverTarget = 1; });
      media.addEventListener("pointerleave", function () { hoverTarget = 0; });
      media.addEventListener("pointermove", function (event) {
        var rect = media.getBoundingClientRect();
        pointerTarget.x = (event.clientX - rect.left) / rect.width;
        /* L'origine des UV est en bas à gauche, celle de la page en haut. */
        pointerTarget.y = 1 - (event.clientY - rect.top) / rect.height;
      });

      root.addEventListener("showcase:change", function (event) {
        var index = event.detail.index;
        if (index === toIndex) return;
        fromIndex = toIndex;
        toIndex = index;
        uniforms.uFrom.value = textures[fromIndex];
        uniforms.uTo.value = textures[toIndex];
        coverScale(fromIndex, uniforms.uFromScale.value);
        coverScale(toIndex, uniforms.uToScale.value);
        uniforms.uMix.value = 0;
        mixTarget = 1;
      });

      var clock = new THREE.Clock();

      function render() {
        frame = 0;
        if (!visible) return;

        var delta = Math.min(clock.getDelta(), 0.05);
        uniforms.uTime.value += delta;
        uniforms.uMix.value += (mixTarget - uniforms.uMix.value) * Math.min(delta * 3.2, 1);
        uniforms.uHover.value += (hoverTarget - uniforms.uHover.value) * Math.min(delta * 7, 1);
        uniforms.uPointer.value.x += (pointerTarget.x - uniforms.uPointer.value.x) * Math.min(delta * 7, 1);
        uniforms.uPointer.value.y += (pointerTarget.y - uniforms.uPointer.value.y) * Math.min(delta * 7, 1);

        renderer.render(scene, camera);
        frame = window.requestAnimationFrame(render);
      }

      function start() {
        if (frame) return;
        visible = true;
        clock.getDelta();          /* purge le delta accumulé pendant la pause */
        frame = window.requestAnimationFrame(render);
      }

      function stop() {
        visible = false;
        if (frame) window.cancelAnimationFrame(frame);
        frame = 0;
      }

      /* Hors écran, un shader qui tourne à 60 im/s ne sert personne. */
      new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) start();
        else stop();
      }, { threshold: 0.01 }).observe(media);

      document.addEventListener("visibilitychange", function () {
        if (document.hidden) stop();
        else start();
      });

      if ("ResizeObserver" in window) new ResizeObserver(resize).observe(media);
      else window.addEventListener("resize", resize);

    }
  });
})();
