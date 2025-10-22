import { useRef, useEffect } from "react";
import { useControls } from "leva";
import { Ball } from "./main.jsx";
import "./App.css";

function ParabolicBalls() {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const ballsRef = useRef([]);
  const params = useControls({
    ballCount: { value: 8, min: 2, max: 30, step: 1 },
    speed: { value: 2, min: 0.1, max: 10, step: 0.1 },
    orbitSize: { value: 3, min: 0.5, max: 8, step: 0.2 },
    ballSize: { value: 5, min: 1, max: 20, step: 1 },
    colorful: true,
  });

  const initBalls = (canvasWidth, canvasHeight) => {
    const balls = [];
    for (let i = 0; i < params.ballCount; i++) {
      const color = params.colorful
        ? `hsl(${(i * 360) / params.ballCount + Math.random() * 60}, 70%, 60%)`
        : "white";
      balls.push(
        new Ball(params.ballSize, color, canvasWidth, canvasHeight)
      );
    }
    return balls;
  };

  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "rgb(26, 26, 46)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ballsRef.current.forEach((ball) => {
      ball.update(params);
      ball.draw(ctx);
    });

    animationRef.current = requestAnimationFrame(animate);
  };

  const handleCanvasClick = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const color = params.colorful
      ? `hsl(${Math.random() * 360}, 70%, 60%)`
      : "white";
    
    const newBall = new Ball(params.ballSize, color, canvas.width, canvas.height);
    ballsRef.current.push(newBall);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    ballsRef.current = initBalls(canvas.width, canvas.height);
  }, [params.ballCount]);

  useEffect(() => {
    ballsRef.current.forEach((ball) => {
      ball.radius = params.ballSize;
    });
  }, [params.ballSize]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = 800;
    canvas.height = 600;

    ballsRef.current = initBalls(canvas.width, canvas.height);

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="parabolic-balls-container">
      <canvas 
        ref={canvasRef} 
        className="parabolic-canvas"
        onClick={handleCanvasClick}
        style={{ cursor: 'pointer' }}
      />
    </div>
  );
}

function App() {
  return (
    <div className="app">
      <ParabolicBalls />
    </div>
  );
}

export default App;
