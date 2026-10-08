'use client';
import { useEffect, useRef, useState } from 'react';

/**
 * Real vaxtda raymarching ilə çəkilən "maye metal" obyekt (WebGL, xarici kitabxana yoxdur).
 * – Studiya işığı (softbox) əks olunmaları, Fresnel, qızılı/soyuq kənar işıq
 * – Siçana doğru çəkilən damcı, yumşaq birləşən metaballs
 * – Ekrandan çıxanda və tab gizlənəndə dayanır; reduced-motion-da tək kadr
 * – WebGL yoxdursa CSS fallback
 */
const VERT = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;
const FRAG = `
precision highp float;
uniform vec2 uRes; uniform float uTime; uniform vec2 uMouse; uniform vec2 uOffset; uniform float uScale;
float smin(float a,float b,float k){float h=clamp(.5+.5*(b-a)/k,0.,1.);return mix(b,a,h)-k*h*(1.-h);}
mat2 rot(float a){float c=cos(a),s=sin(a);return mat2(c,-s,s,c);}
float map(vec3 p){
  float t=uTime*.32;
  p.xz*=rot(t*.35); p.xy*=rot(sin(t*.5)*.15);
  float d=length(p)-1.0;
  d+=.055*sin(3.1*p.x+t*2.1)*sin(2.7*p.y+t*1.6)*sin(3.3*p.z+t*1.2);
  d+=.02*sin(9.*p.y+t*3.)*sin(8.*p.x-t*2.);
  vec3 c1=vec3(sin(t*1.1)*1.38,cos(t*.93)*.6,sin(t*.71)*.55);
  vec3 c2=vec3(cos(t*.8+2.)*1.25,sin(t*1.27)*.78,cos(t)*.62);
  vec3 c3=vec3(sin(t*.6+4.)*.5,cos(t*.7+1.)*1.25,sin(t*.9)*.4);
  d=smin(d,length(p-c1)-.42,.6);
  d=smin(d,length(p-c2)-.30,.5);
  d=smin(d,length(p-c3)-.24,.45);
  vec3 m=vec3(uMouse.x*1.5,uMouse.y*1.0,.6);
  d=smin(d,length(p-m)-.2,.7);
  return d;
}
vec3 nrm(vec3 p){vec2 e=vec2(.0012,0.);return normalize(vec3(map(p+e.xyy)-map(p-e.xyy),map(p+e.yxy)-map(p-e.yxy),map(p+e.yyx)-map(p-e.yyx)));}
vec3 env(vec3 r){
  float y=r.y;
  vec3 c=mix(vec3(.012,.012,.016),vec3(.075,.07,.065),smoothstep(-.7,.9,y));
  c+=vec3(1.,.95,.86)*smoothstep(.62,.97,y)*smoothstep(.95,.2,abs(r.x))*1.6;          // üst softbox
  c+=vec3(1.,.72,.36)*smoothstep(.72,.99,r.x)*smoothstep(.75,0.,abs(y-.05))*2.0;       // qızılı yan işıq
  c+=vec3(.62,.58,1.)*smoothstep(.78,.99,-r.x)*smoothstep(.8,0.,abs(y+.15))*.55;         // soyuq kənar
  c+=vec3(.95,.88,.78)*exp(-abs(y+.08)*36.)*.2;                                         // horizont
  c+=vec3(1.,.8,.55)*smoothstep(.85,1.,-r.z)*.25;
  return c;
}
void main(){
  vec2 uv=(gl_FragCoord.xy-.5*uRes)/uRes.y;
  uv=(uv-uOffset)/uScale;
  vec3 ro=vec3(0.,0.,4.3), rd=normalize(vec3(uv,-1.65));
  float t=0., d=1., md=10.; vec3 p; bool hit=false;
  for(int i=0;i<80;i++){p=ro+rd*t;d=map(p);md=min(md,d);if(d<.0012){hit=true;break;}t+=d*.92;if(t>9.)break;}
  vec3 col=vec3(0.); float a=0.;
  if(hit){
    vec3 n=nrm(p); vec3 r=reflect(rd,n);
    float fr=pow(1.-max(dot(n,-rd),0.),2.6);
    col=env(r)*mix(.6,1.15,fr);
    col*=vec3(1.,.95,.87);
    col+=vec3(1.,.78,.45)*pow(max(dot(r,normalize(vec3(.6,.4,.7))),0.),40.)*1.4;
    col+=vec3(1.,.82,.55)*fr*.12;
    a=1.;
  } else {
    float g=exp(-md*5.5)*.38;
    col=vec3(.91,.72,.42)*g; a=g;
  }
  col=col/(1.+col*.85); col=pow(col,vec3(.4545));
  gl_FragColor=vec4(col,a);
}`;

export default function LiquidOrb({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const gl = canvas.getContext('webgl', { premultipliedAlpha: false, antialias: false, alpha: true, powerPreference: 'high-performance' });
    if (!gl) { setFailed(true); return; }
    const sh = (type: number, src: string) => { const s = gl.createShader(type)!; gl.shaderSource(s, src); gl.compileShader(s); return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null; };
    const vs = sh(gl.VERTEX_SHADER, VERT), fs = sh(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) { setFailed(true); return; }
    const prog = gl.createProgram()!; gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { setFailed(true); return; }
    gl.useProgram(prog);
    const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    const u = (n: string) => gl.getUniformLocation(prog, n);
    const uRes = u('uRes'), uTime = u('uTime'), uMouse = u('uMouse'), uOffset = u('uOffset'), uScale = u('uScale');

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    let raf = 0, visible = true, t0 = performance.now(), last = 0;

    const resize = () => {
      const mobile = window.innerWidth < 768;
      const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.25 : 1.6) * (mobile ? .85 : 1);
      const w = canvas.clientWidth, h = canvas.clientHeight;
      canvas.width = Math.max(1, Math.round(w * dpr)); canvas.height = Math.max(1, Math.round(h * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      const aspect = w / Math.max(h, 1);
      // Masaüstündə obyekt sağda, mobildə yuxarı-mərkəzdə
      if (mobile) { gl.uniform2f(uOffset, .04, .2); gl.uniform1f(uScale, .6); }
      else { gl.uniform2f(uOffset, Math.min(.36 * aspect, .56), -.04); gl.uniform1f(uScale, aspect > 1.9 ? .68 : .72); }
    };
    const frame = (now: number) => {
      raf = 0;
      if (!visible || document.hidden) return;
      // ~60fps limit, siçan hərəkətini yumşaltmaq
      mouse.x += (mouse.tx - mouse.x) * .06; mouse.y += (mouse.ty - mouse.y) * .06;
      gl.uniform1f(uTime, reduced ? 12 : (now - t0) / 1000);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      last = now;
      if (!reduced) raf = requestAnimationFrame(frame);
    };
    const start = () => { if (!raf) raf = requestAnimationFrame(frame); };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      const r = canvas.getBoundingClientRect();
      mouse.tx = ((e.clientX - r.left) / r.width - .5) * 2;
      mouse.ty = -((e.clientY - r.top) / r.height - .5) * 2;
    };
    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; if (visible) start(); }, { threshold: 0 });
    io.observe(canvas);
    const ro = new ResizeObserver(() => { resize(); if (reduced) start(); });
    ro.observe(canvas);
    const onVis = () => { if (!document.hidden) start(); };
    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('visibilitychange', onVis);
    resize(); start(); void last;
    return () => {
      cancelAnimationFrame(raf); io.disconnect(); ro.disconnect();
      window.removeEventListener('pointermove', onMove); document.removeEventListener('visibilitychange', onVis);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, []);

  return (
    <div aria-hidden className={`pointer-events-none ${className}`}>
      {failed
        ? <div className="absolute right-[8%] top-1/2 h-[min(60vw,560px)] w-[min(60vw,560px)] -translate-y-1/2 orb-fallback max-md:left-1/2 max-md:right-auto max-md:top-[30%] max-md:-translate-x-1/2" />
        : <canvas ref={ref} className="h-full w-full" />}
    </div>
  );
}
