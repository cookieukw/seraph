// js/ui/VirtualJoystick.js
class VirtualJoystick {
  constructor(config) {
    const defaults = {
      canvas: null,
      outerRadius: 70,
      innerRadius: 30,
      // MODIFICAÇÃO TEMPORÁRIA: Cores opacas para debug
      outerColor: "rgba(255, 0, 0, 1)", // VERMELHO OPACO para BASE do joystick de movimento
      innerColor: "rgba(0, 255, 0, 1)", // VERDE OPACO para THUMB do joystick de movimento
      onMove: () => {},
      onStart: () => {},
      onEnd: () => {},
      area: "left", // 'left', 'right'
    };

    this.config = { ...defaults, ...config };

    if (!this.config.canvas) {
      console.error("VirtualJoystick: Canvas element is required.");
      return;
    }

    this.ctx = this.config.canvas.getContext("2d");
    this.isActive = false;
    this.touchId = null;

    this.center = { x: 0, y: 0 };
    this.currentPos = { x: 0, y: 0 };
    this.direction = { x: 0, y: 0 };

    this._setupEventListeners();
  }

  _setupEventListeners() {
    const canvas = this.config.canvas;

    canvas.addEventListener("mousedown", this._handleStart.bind(this));
    canvas.addEventListener("mousemove", this._handleMove.bind(this));
    canvas.addEventListener("mouseup", this._handleEnd.bind(this));
    canvas.addEventListener("mouseleave", this._handleEnd.bind(this));

    canvas.addEventListener("touchstart", this._handleTouchStart.bind(this), {
      passive: false,
    });
    canvas.addEventListener("touchmove", this._handleTouchMove.bind(this), {
      passive: false,
    });
    canvas.addEventListener("touchend", this._handleTouchEnd.bind(this));
    canvas.addEventListener("touchcancel", this._handleTouchEnd.bind(this));
  }

  setAreaAndCenter(canvasWidth, canvasHeight) {
    this.touchArea =
      this.config.area === "left"
        ? {
            x: 0,
            y: 0,
            width: canvasWidth / 2,
            height: canvasHeight,
          }
        : {
            x: canvasWidth / 2,
            y: 0,
            width: canvasWidth / 2,
            height: canvasHeight,
          };

    const margin = 90;
    if (this.config.area === "left") {
      this.center = {
        x: margin + this.config.outerRadius,
        y: canvasHeight - margin - this.config.outerRadius,
      };
    } else {
      this.center = {
        x: canvasWidth - margin - this.config.outerRadius,
        y: canvasHeight - margin - this.config.outerRadius,
      };
    }
    this.currentPos = { ...this.center };
  }

  _isWithinArea(x, y) {
    return (
      x >= this.touchArea.x &&
      x < this.touchArea.x + this.touchArea.width &&
      y >= this.touchArea.y &&
      y < this.touchArea.y + this.touchArea.height
    );
  }

  _getCanvasCoords(e) {
    const rect = this.config.canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }

  _activate(pos, id = null) {
    if (!this._isWithinArea(pos.x, pos.y)) return false;

    this.isActive = true;
    this.touchId = id;
    this.currentPos = { ...pos };
    this._updateDirection();
    this.config.onStart();
    return true;
  }

  _handleStart(e) {
    if (this.config.area === "right" && this.config.game?.autoAimActive) {
      return;
    }
    if (this.isActive) return;
    const pos = this._getCanvasCoords(e);
    if (this._isWithinArea(pos.x, pos.y)) {
      this._activate(pos, "mouse");
    }
  }

  _handleTouchStart(e) {
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      const pos = this._getCanvasCoords(touch);

      if (!this.isActive && this._isWithinArea(pos.x, pos.y)) {
        if (this._activate(pos, touch.identifier)) {
          e.preventDefault();
          break;
        }
      }
    }
  }

  _handleMove(e) {
    if (!this.isActive || this.touchId !== "mouse") return;
    this.currentPos = this._getCanvasCoords(e);
    this._updateDirection();
  }

  _handleTouchMove(e) {
    if (!this.isActive) return;

    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (touch.identifier === this.touchId) {
        this.currentPos = this._getCanvasCoords(touch);
        this._updateDirection();
        e.preventDefault();
        break;
      }
    }
  }

  _updateDirection() {
    const dx = this.currentPos.x - this.center.x;
    const dy = this.currentPos.y - this.center.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    const limitedDistance = Math.min(distance, this.config.outerRadius);
    const angle = Math.atan2(dy, dx);

    this.direction = {
      x: Math.cos(angle) * (limitedDistance / this.config.outerRadius),
      y: Math.sin(angle) * (limitedDistance / this.config.outerRadius),
    };

    this.config.onMove(this.direction);
  }

  _handleEnd() {
    if (this.isActive && this.touchId === "mouse") {
      this._reset();
    }
  }

  _handleTouchEnd(e) {
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (touch.identifier === this.touchId) {
        this._reset();
        break;
      }
    }
  }

  _reset() {
    this.isActive = false;
    this.touchId = null;
    this.direction = { x: 0, y: 0 };
    this.currentPos = { ...this.center };
    this.config.onMove(this.direction);
    this.config.onEnd();
  }

  render(context) {
    // Desenhar área externa (BASE) - SEMPRE visível
    context.beginPath();
    context.arc(
      this.center.x,
      this.center.y,
      this.config.outerRadius,
      0,
      Math.PI * 2
    );
    context.fillStyle = this.config.outerColor;
    context.fill();
   // context.strokeStyle = "black";
    //context.lineWidth = 3;
    context.stroke();

    // --- INÍCIO DA CORREÇÃO ---
    // Calcular posição interna (thumb) de forma restrita
    let thumbPos;
    if (this.isActive) {
      const dx = this.currentPos.x - this.center.x;
      const dy = this.currentPos.y - this.center.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > this.config.outerRadius) {
        // Se a distância for maior que o raio, limita a posição do thumb à borda
        const angle = Math.atan2(dy, dx);
        thumbPos = {
          x: this.center.x + Math.cos(angle) * this.config.outerRadius,
          y: this.center.y + Math.sin(angle) * this.config.outerRadius,
        };
      } else {
        // Se estiver dentro, usa a posição atual do toque
        thumbPos = this.currentPos;
      }
    } else {
      // Se inativo, centraliza o thumb
      thumbPos = this.center;
    }
    

    // Desenhar controle interno (THUMB) usando a posição calculada
    context.beginPath();
    context.arc(
      thumbPos.x,
      thumbPos.y,
      this.config.innerRadius,
      0,
      Math.PI * 2
    );
    context.fillStyle = this.config.innerColor;
    context.fill();
   // context.strokeStyle = "black";
  //  context.lineWidth = 3;
  //  context.stroke();
  }
}
