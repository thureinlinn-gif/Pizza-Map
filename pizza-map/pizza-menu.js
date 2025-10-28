const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let radius = canvas.height / 2;
ctx.translate(radius, radius);
radius = radius * 0.75;

let hoveredSlice = null;
const sliceCount = 5;
const angle = Math.PI * 2 / sliceCount;

const linkData = {
  1: { text: "Menu", url: "/landing.html" },
  2: { text: "Home", url: "/index.html" },
  3: { text: "Contact", url: "/pages/contact.html" },
  4: { text: "About", url: "/pages/about.html" },
  5: { text: "Reviews", url: "/pages/testimonial.html" },
};


// Predefine toppings per slice
const toppingsPerSlice = Array.from({ length: sliceCount }, (_, i) => {
  const centerAngle = angle * (i + 0.5);
  return [
    { x: Math.cos(centerAngle) * radius * 0.9, y: Math.sin(centerAngle) * radius * 0.2, type: 'pepperoni' },
    { x: Math.cos(centerAngle + 0.3) * radius * 0.4, y: Math.sin(centerAngle + 0.3) * radius * 0.4, type: 'basil' },
    { x: Math.cos(centerAngle - 0.3) * radius * 0.9, y: Math.sin(centerAngle - 0.9) * radius * 0.4, type: 'pepperoni' },
    { x: Math.cos(centerAngle - 0.3) * radius * 0.4, y: Math.sin(centerAngle - 0.3) * radius * 1, type: 'pepperoni' },
  ];
});

canvas.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const dx = x - canvas.width / 2;
  const dy = y - canvas.height / 2;
  const dist = Math.sqrt(dx * dx + dy * dy);

  if (dist > radius) {
    hoveredSlice = null;
    canvas.style.cursor = 'default';
    return;
  }

  let a = Math.atan2(dy, dx);
  if (a < 0) a += 2 * Math.PI;
  hoveredSlice = Math.floor(a / angle) + 1;
  canvas.style.cursor = linkData[hoveredSlice] ? 'pointer' : 'default';
});

canvas.addEventListener("click", () => {
  if (linkData[hoveredSlice]) {
    window.location.href = linkData[hoveredSlice].url;
  }
});

function draw() {
  ctx.clearRect(-canvas.width, -canvas.height, canvas.width * 2, canvas.height * 2);
  drawPizzaBase(ctx, radius);

  for (let i = 0; i < sliceCount; i++) {
    drawToppings(ctx, i);
  }

  // Draw faint text for all slices
  for (let i = 0; i < sliceCount; i++) {
    const midAngle = (i + 0.5) * angle;
    const textX = Math.cos(midAngle) * radius * 0.8;
    const textY = Math.sin(midAngle) * radius * 0.8;

    ctx.fillStyle = "rgba(80, 80, 80, 1)"; // Faint text (low opacity)
    ctx.font = "bold 20px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(linkData[i + 1].text, textX, textY); // Draw faint text
  }

  // Only highlight text for the hovered slice
  if (hoveredSlice && linkData[hoveredSlice]) {
    drawHoverSlice(ctx, hoveredSlice);
    const midAngle = (hoveredSlice - 0.5) * angle;
    const textX = Math.cos(midAngle) * radius * 0.8;
    const textY = Math.sin(midAngle) * radius * 0.8;

    ctx.fillStyle = "black"; // Highlight text when hovered
    ctx.font = "bold 30px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(linkData[hoveredSlice].text, textX, textY);
  }

  requestAnimationFrame(draw);
}

function drawWedge(x, y, rad, startAngle, endAngle, fillStyle) {
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.arc(x, y, rad, startAngle, endAngle);
  ctx.closePath();
  ctx.fillStyle = fillStyle;
  ctx.fill();
}

function drawPizzaBase(ctx, radius) {
  // Crust
  ctx.beginPath();
  ctx.arc(0, 0, radius + 10, 0, 2 * Math.PI);
  ctx.fillStyle = "#c68642";
  ctx.fill();

  // Cheese
  const gradient = ctx.createRadialGradient(0, 0, radius * 0.3, 0, 0, radius);
  gradient.addColorStop(0, "#fdd835");
  gradient.addColorStop(1, "#f4a261");

  for (let i = 0; i < sliceCount; i++) {
    const start = i * angle;
    const end = (i + 1) * angle;
    drawWedge(0, 0, radius, start, end, gradient);
  }
}

function drawHoverSlice(ctx, sliceIndex) {
  const start = (sliceIndex - 1) * angle;
  const end = sliceIndex * angle;
  const growFactor = 1.15;

  ctx.save();
  ctx.scale(growFactor, growFactor);

  // --- Cheese base ---
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.arc(0, 0, radius, start, end);
  ctx.closePath();

  const cheeseGradient = ctx.createRadialGradient(0, 0, radius * 0.3, 0, 0, radius);
  cheeseGradient.addColorStop(0, "#fdd835");
  cheeseGradient.addColorStop(1, "#f4a261");

  ctx.fillStyle = cheeseGradient;
  ctx.shadowColor = "rgba(255, 165, 0, 0.6)";
  ctx.shadowBlur = 20;
  ctx.fill();

  // --- Crust edge ---
  const crustRadius = radius * 1.03;
  ctx.beginPath();
  ctx.arc(0, 0, crustRadius, start, end);
  ctx.lineWidth = radius * 0.06;
  ctx.strokeStyle = "#c68642"; // crust color
  ctx.stroke();
  ctx.restore();
}

function drawToppings(ctx, sliceIndex) {
  const toppings = toppingsPerSlice[sliceIndex];
  for (const topping of toppings) {
    ctx.beginPath();
    ctx.arc(topping.x, topping.y-12, topping.type === 'pepperoni' ? 12 : 4, 0, 2 * Math.PI);
    ctx.fillStyle = topping.type === 'pepperoni' ? "#b71c1c" : "#388e3c";
    ctx.fill();
  }
}

requestAnimationFrame(draw);