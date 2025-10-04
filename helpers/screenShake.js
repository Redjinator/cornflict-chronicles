export class ScreenShake {
  constructor(container) {
    this.container = container;
    this.originalX = container.x || 0;
    this.originalY = container.y || 0;
    this.shaking = false;
    this.shakeDuration = 0;
    this.shakeIntensity = 0;
    this.elapsed = 0;
  }

  shake(duration = 300, intensity = 10) {
    this.shaking = true;
    this.shakeDuration = duration;
    this.shakeIntensity = intensity;
    this.elapsed = 0;
  }

  update(deltaTime) {
    if (!this.shaking) {
      return;
    }

    this.elapsed += deltaTime * 16.67; // Convert to ms (assuming 60fps)

    if (this.elapsed >= this.shakeDuration) {
      // Reset to original position
      this.container.x = this.originalX;
      this.container.y = this.originalY;
      this.shaking = false;
      return;
    }

    // Calculate shake offset with decay
    const progress = this.elapsed / this.shakeDuration;
    const decay = 1 - progress;
    const currentIntensity = this.shakeIntensity * decay;

    // Apply random offset
    this.container.x = this.originalX + (Math.random() - 0.5) * currentIntensity * 2;
    this.container.y = this.originalY + (Math.random() - 0.5) * currentIntensity * 2;
  }

  reset() {
    this.container.x = this.originalX;
    this.container.y = this.originalY;
    this.shaking = false;
  }
}
