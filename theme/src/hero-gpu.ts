/// <reference types="@webgpu/types" />

/* A translucent line field rendered by a fragment shader over the CSS atmosphere. */
const shader = /* wgsl */ `
struct Params { size: vec2f, time: f32, _pad: f32, pointer: vec2f, _pad2: vec2f };
@group(0) @binding(0) var<uniform> p: Params;
@vertex fn vertex(@builtin(vertex_index) i: u32) -> @builtin(position) vec4f {
  let vertices = array<vec2f, 3>(vec2f(-1.0, -1.0), vec2f(3.0, -1.0), vec2f(-1.0, 3.0));
  return vec4f(vertices[i], 0.0, 1.0);
}
fn wave(u: f32, t: f32, phase: f32) -> f32 {
  let edge = sin(3.14159265 * u);
  // Individual paths approach, briefly interweave, then open outward again.
  let meeting = exp(-pow((u - 0.48) * 3.5, 2.0));
  let spread = 0.72 - meeting * 0.37 + u * 0.19;
  let commonCurrent = 0.13 * sin(u * 4.1 - 0.7 + phase * 0.23);
  let weave = sin(t * 8.0 + u * 5.2 + phase * (0.46 + t * 0.18)) * meeting * 0.14;
  let individual = sin(u * (5.0 + t * 2.4) + t * 9.0 - phase * 0.36) * edge * 0.045;
  return (t - 0.5) * spread + commonCurrent + weave + individual;
}
@fragment fn fragment(@builtin(position) position: vec4f) -> @location(0) vec4f {
  let aspect = p.size.x / p.size.y;
  let compact = aspect < 0.85;
  let center = vec2f(aspect * select(0.74, 0.70, compact), select(0.5, 0.72, compact));
  let scale = min(aspect * select(0.5, 0.88, compact), 0.73);
  let pos = position.xy / p.size.y;
  let u = (pos.x - center.x) / (scale * 2.15) + 0.5;
  if (u <= 0.0 || u >= 1.0) { return vec4f(0.0); }
  let phase = p.time * 0.075;
  let fade = pow(max(sin(3.14159265 * u), 0.0), 0.6);
  let pixel = 1.0 / p.size.y;
  var light = 0.0;
  var warm = 0.0;
  var glints = 0.0;
  let bands = select(36, 24, compact);
  for (var i: i32 = 0; i < 36; i = i + 1) {
    if (i >= bands) { break; }
    let raw = f32(i) / f32(bands - 1);
    let t = raw + 0.012 * sin(raw * 12.566);
    let baseY = center.y + scale * wave(u, t, phase);
    let pointerPos = (p.pointer + vec2f(0.5)) * p.size / p.size.y;
    let offset = (vec2f(pos.x, baseY) - pointerPos) / scale;
    let influence = exp(-dot(offset, offset) * 17.0) * p._pad;
    let displacement = influence * (0.025 + 0.02 * sin(t * 9.0 + phase))
      * tanh(offset.y * 8.0);
    let d = abs(pos.y - (baseY + scale * displacement));
    let width = select(1.35, 2.0, i % 9 == 0);
    let line = 1.0 - smoothstep(pixel * 0.35, pixel * width, d);
    let depth = 0.74 + 0.26 * sin(t * 6.283 + u * 2.0 + phase * 0.38);
    let strength = (0.10 + f32(i % 6) * 0.013) * fade * depth;
    light += line * strength;
    light += exp(-d / (pixel * 4.0)) * strength * 0.16;
    warm += line * strength * smoothstep(0.45, 0.95, t) * 0.3;
    if (i % 5 == 0) {
      let travel = fract(0.17 + f32(i) * 0.137 + phase * (0.16 + f32(i % 3) * 0.025));
      let pulseX = center.x + (travel - 0.5) * scale * 2.15;
      let pulseBaseY = center.y + scale * wave(travel, t, phase);
      let pulseOffset = (vec2f(pulseX, pulseBaseY) - pointerPos) / scale;
      let pulseInfluence = exp(-dot(pulseOffset, pulseOffset) * 17.0) * p._pad;
      let pulseY = pulseBaseY + scale * pulseInfluence * (0.025 + 0.02 * sin(t * 9.0 + phase)) * tanh(pulseOffset.y * 8.0);
      let pulsePos = vec2f(pulseX, pulseY);
      let radius = length(pos - pulsePos) / (pixel * 6.0);
      let tail = exp(-abs(u - travel) * 38.0) * exp(-d / (pixel * 2.5));
      glints += (exp(-radius * radius) * 0.55 + tail * 0.2) * sin(3.14159265 * travel);
    }
  }
  for (var j: i32 = 0; j < 8; j = j + 1) {
    let t = f32(j) / 7.0;
    let arc = sin(u * 3.14159265 + phase * 0.32 + t * 2.1) * 0.24;
    let crossing = center.y + scale * ((t - 0.5) * 0.86 - arc);
    let distance = abs(pos.y - crossing);
    light += (1.0 - smoothstep(pixel * 0.4, pixel * 1.5, distance)) * 0.035 * fade;
  }
  // A few independent, asymmetrical paths sit behind the main flowing surface.
  for (var k: i32 = 0; k < 4; k = k + 1) {
    let layer = f32(k);
    let curve = (u - 0.48) * (u - 0.48) * (0.95 + layer * 0.14)
      + sin(u * 4.2 + layer * 0.7 + phase * 0.25) * 0.07;
    let path = center.y + scale * (curve - 0.29 + layer * 0.18);
    let distance = abs(pos.y - path);
    let trace = 1.0 - smoothstep(pixel * 0.3, pixel * 1.25, distance);
    let edgeFade = pow(max(sin(3.14159265 * u), 0.0), 1.3);
    light += trace * edgeFade * 0.032;
  }
  let halo = exp(-length((pos - center) / (scale * 0.67)) * 2.1) * 0.065;
  let alpha = clamp(light + glints + halo, 0.0, 0.72);
  let color = mix(vec3f(0.64, 0.70, 0.86), vec3f(0.89, 0.76, 0.67), clamp(warm * 2.0, 0.0, 0.3));
  return vec4f(color * alpha, alpha);
}`;

export async function createHeroGpu(
  canvas: HTMLCanvasElement,
  stage: HTMLElement,
  onReady: () => void,
  onFailure: () => void,
): Promise<(() => void) | null> {
  if (!navigator.gpu) return null;
  let device: GPUDevice | undefined;
  try {
    const adapter = await navigator.gpu.requestAdapter({ powerPreference: "high-performance" });
    if (!adapter) return null;
    device = await adapter.requestDevice();
    const context = canvas.getContext("webgpu");
    if (!context) {
      device.destroy();
      return null;
    }
    const format = navigator.gpu.getPreferredCanvasFormat();
    context.configure({ device, format, alphaMode: "premultiplied" });
    const module = device.createShaderModule({ code: shader });
    const pipeline = await device.createRenderPipelineAsync({
      layout: "auto",
      vertex: { module, entryPoint: "vertex" },
      fragment: { module, entryPoint: "fragment", targets: [{ format }] },
      primitive: { topology: "triangle-list" },
    });
    const uniform = device.createBuffer({
      size: 32,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    const bindGroup = device.createBindGroup({
      layout: pipeline.getBindGroupLayout(0),
      entries: [{ binding: 0, resource: { buffer: uniform } }],
    });
    const gpu = device;
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const target = { x: 0, y: 0 };
    const pointer = { x: 0, y: 0, active: 0 };
    let pointerTarget = 0;
    let frame = 0;
    let elapsed = 0;
    let last = 0;
    let visible = true;
    let destroyed = false;
    let ready = false;
    const render = () => {
      if (destroyed) return;
      pointer.x += (target.x - pointer.x) * 0.035;
      pointer.y += (target.y - pointer.y) * 0.035;
      pointer.active += (pointerTarget - pointer.active) * 0.035;
      gpu.queue.writeBuffer(
        uniform,
        0,
        new Float32Array([
          canvas.width,
          canvas.height,
          elapsed / 1000,
          pointer.active,
          pointer.x,
          pointer.y,
          0,
          0,
        ]),
      );
      const encoder = gpu.createCommandEncoder();
      const pass = encoder.beginRenderPass({
        colorAttachments: [
          {
            view: context.getCurrentTexture().createView(),
            clearValue: { r: 0, g: 0, b: 0, a: 0 },
            loadOp: "clear",
            storeOp: "store",
          },
        ],
      });
      pass.setPipeline(pipeline);
      pass.setBindGroup(0, bindGroup);
      pass.draw(3);
      pass.end();
      gpu.queue.submit([encoder.finish()]);
      if (!ready) {
        ready = true;
        onReady();
      }
    };
    const tick = (now: number) => {
      if (last) elapsed += Math.min(now - last, 40);
      last = now;
      render();
      frame = visible && !motion.matches && !document.hidden ? requestAnimationFrame(tick) : 0;
    };
    const start = () => {
      last = 0;
      if (!frame && visible && !motion.matches && !document.hidden)
        frame = requestAnimationFrame(tick);
      else if (motion.matches && visible) render();
    };
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.min(devicePixelRatio || 1, 1.5);
      const limit = gpu.limits.maxTextureDimension2D;
      canvas.width = Math.min(limit, Math.max(1, Math.round(rect.width * ratio)));
      canvas.height = Math.min(limit, Math.max(1, Math.round(rect.height * ratio)));
      render();
    };
    const move = (event: PointerEvent) => {
      const rect = stage.getBoundingClientRect();
      pointerTarget = 1;
      target.x = Math.max(-0.5, Math.min(0.5, (event.clientX - rect.left) / rect.width - 0.5));
      target.y = Math.max(-0.5, Math.min(0.5, (event.clientY - rect.top) / rect.height - 0.5));
    };
    const leave = () => {
      pointerTarget = 0;
      target.x = 0;
      target.y = 0;
    };
    const observer = new ResizeObserver(resize);
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      start();
    });
    observer.observe(canvas);
    intersection.observe(canvas);
    stage.addEventListener("pointermove", move);
    stage.addEventListener("pointerleave", leave);
    motion.addEventListener("change", start);
    document.addEventListener("visibilitychange", start);
    const cleanup = () => {
      destroyed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      intersection.disconnect();
      stage.removeEventListener("pointermove", move);
      stage.removeEventListener("pointerleave", leave);
      motion.removeEventListener("change", start);
      document.removeEventListener("visibilitychange", start);
      uniform.destroy();
      context.unconfigure();
      gpu.destroy();
    };
    void gpu.lost.then(() => {
      if (!destroyed) {
        cleanup();
        onFailure();
      }
    });
    resize();
    start();
    return cleanup;
  } catch {
    device?.destroy();
    return null;
  }
}
