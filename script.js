class TextAnimator {
  constructor(output, input, button) {
    this.output = output;
    this.input = input;
    this.button = button;
    this.state = "idle";
    this.timers = [];
    this.delay = 50;

    button.addEventListener("click", () => this.toggle());
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && !button.disabled) this.toggle();
    });
  }

  toggle() {
    if (this.state === "idle") this.animate();
    else if (this.state === "visible") this.deanimate();
  }

  schedule(callback, delay) {
    this.timers.push(setTimeout(callback, delay));
  }

  clearTimers() {
    this.timers.forEach(clearTimeout);
    this.timers = [];
  }

  animate() {
    if (!this.input.value) return;

    this.clearTimers();
    const characters = Array.from(this.input.value);
    const duration = characters.length * this.delay;
    const spans = characters.map((character) => {
      const span = document.createElement("span");
      span.textContent = character === " " ? "\u00a0" : character;
      return span;
    });

    this.output.replaceChildren(...spans);
    this.input.value = "";
    this.state = "animating";
    this.button.textContent = "De-Animate";
    this.button.disabled = true;

    spans.forEach((span, index) => {
      const start = (index + 1) * this.delay;
      this.schedule(() => span.classList.add("fade"), start);
      this.schedule(() => {
        span.style.color = `#${Math.floor(Math.random() * 0x1000000)
          .toString(16)
          .padStart(6, "0")}`;
      }, start + duration);
      this.schedule(() => { span.style.color = "white"; }, start + 2 * (duration + this.delay));
    });

    this.schedule(() => {
      this.state = "visible";
      this.button.disabled = false;
    }, duration);
  }

  deanimate() {
    this.clearTimers();
    const spans = Array.from(this.output.children);
    const duration = spans.length * this.delay;
    this.state = "deanimating";
    this.button.textContent = "Animate!";
    this.button.disabled = true;

    spans.reverse().forEach((span, index) => {
      const start = (index + 1) * this.delay;
      this.schedule(() => { span.style.color = "black"; }, start);
      this.schedule(() => span.classList.remove("fade"), start + duration);
    });

    this.schedule(() => {
      this.state = "idle";
      this.button.disabled = false;
      this.clearTimers();
    }, 2 * duration);
  }
}

new TextAnimator(
  document.querySelector(".fancy"),
  document.querySelector(".submit-input"),
  document.querySelector(".submit-btn")
);
