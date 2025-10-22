import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

export class Ball {
  constructor(
    radius = 8,
    color = "white",
    canvasWidth,
    canvasHeight
  ) {
    this.radius = radius;
    this.color = color;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.trail = [];
    this.maxTrailLength = 20;
    this.trailDelay = 60;
    this.frameCount = 0;
    this.centerX = canvasWidth / 2;
    this.centerY = canvasHeight / 2;
    this.centralSphereRadius = Math.min(canvasWidth, canvasHeight) * 0.08;
    const maxRadius = Math.min(canvasWidth, canvasHeight) * 0.4;
    this.baseOrbitRadius = Math.random() * maxRadius * 0.7 + maxRadius * 0.3;
    this.eccentricity = Math.random() * 0.6;
    this.angle = Math.random() * Math.PI * 2;
    this.baseAngularSpeed = (Math.random() * 0.015 + 0.005) * (Math.random() > 0.5 ? 1 : -1);
    this.tiltX = (Math.random() - 0.5) * 1.2; 
    this.tiltY = (Math.random() - 0.5) * 0.8;
    this.tiltZ = (Math.random() - 0.5) * 0.6;
    this.updatePosition();
  }

  updatePosition() {
    const currentRadius = this.baseOrbitRadius * (1 - this.eccentricity * Math.cos(this.angle));
    
    const baseX = currentRadius * Math.cos(this.angle);
    const baseY = currentRadius * Math.sin(this.angle);
    
    const tiltedX = baseX * (1 + this.tiltZ * 0.3) + baseY * this.tiltX;
    const tiltedY = baseY * (1 + this.tiltY) + baseX * this.tiltZ * 0.2;
    
    this.x = this.centerX + tiltedX;
    this.y = this.centerY + tiltedY;
    
    const actualDistance = Math.sqrt(tiltedX * tiltedX + tiltedY * tiltedY);
    this.distanceFromCenter = actualDistance / this.baseOrbitRadius;
  }

  update(params) {
    if (this.trail.length === 0 || 
        Math.abs(this.x - this.trail[this.trail.length - 1].x) > 1 || 
        Math.abs(this.y - this.trail[this.trail.length - 1].y) > 1) {
      this.trail.push({ x: this.x, y: this.y });
      if (this.trail.length > this.maxTrailLength) {
        this.trail.shift();
      }
    }

    const speedMultiplier = 2.0 - this.distanceFromCenter; 
    const currentAngularSpeed = this.baseAngularSpeed * speedMultiplier * params.speed;
    
    this.angle += currentAngularSpeed;
    
    if (this.angle > Math.PI * 2) {
      this.angle -= Math.PI * 2;
    } else if (this.angle < 0) {
      this.angle += Math.PI * 2;
    }
    
    this.centerX = this.canvasWidth / 2;
    this.centerY = this.canvasHeight / 2;
    
    const maxRadius = Math.min(this.canvasWidth, this.canvasHeight) * 0.4;
    this.baseOrbitRadius = maxRadius * (0.2 + params.orbitSize * 0.1);
    
    this.updatePosition();
    
    this.radius = params.ballSize;
  }
  updateCanvasSize(width, height) {
    this.canvasWidth = width;
    this.canvasHeight = height;
  }
  draw(ctx) {
    if (this.trail.length > 1) {
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.3;
      ctx.beginPath();
      ctx.moveTo(this.trail[0].x, this.trail[0].y);
      for (let i = 1; i < this.trail.length; i++) {
        ctx.lineTo(this.trail[i].x, this.trail[i].y);
      }
      ctx.stroke();
    }

    ctx.globalAlpha = 0.9;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  static drawCentralSphere(ctx, centerX, centerY, radius) {
    ctx.globalAlpha = 0.8;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    const gradient = ctx.createRadialGradient(
      centerX - radius * 0.3, centerY - radius * 0.3, 0,
      centerX, centerY, radius
    );
    gradient.addColorStop(0, '#ffffff');
    gradient.addColorStop(0.3, '#cccccc');
    gradient.addColorStop(1, '#666666');
    
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.strokeStyle = '#444444';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.globalAlpha = 1;
  }
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
