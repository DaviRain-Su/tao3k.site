import { useEffect, useRef } from "react";

/** A decorative WebGPU field; it does not represent live telemetry. */
export function EvidenceField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = canvas?.parentElement?.parentElement;
    if (!canvas || !stage) return;
    let disposed = false;
    let stop: (() => void) | null = null;

    void import("./hero-gpu")
      .then(({ createHeroGpu }) =>
        createHeroGpu(
          canvas,
          stage,
          () => {
            if (!disposed) canvas.parentElement?.setAttribute("data-renderer", "webgpu");
          },
          () => {
            if (!disposed) canvas.parentElement?.setAttribute("data-renderer", "unavailable");
          },
        ),
      )
      .then((cleanup) => {
        if (disposed) cleanup?.();
        else {
          stop = cleanup;
          if (!cleanup) canvas.parentElement?.setAttribute("data-renderer", "unavailable");
        }
      })
      .catch(() => {
        if (!disposed) canvas.parentElement?.setAttribute("data-renderer", "unavailable");
      });

    return () => {
      disposed = true;
      stop?.();
    };
  }, []);

  return (
    <div className="tao3k-evidence-field" data-renderer="pending" aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
}
