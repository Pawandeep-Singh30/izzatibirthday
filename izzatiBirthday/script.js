// ============================================
// Get elements
// ============================================
var surpriseWrap = document.getElementById("surpriseWrap");
var surpriseButton = document.getElementById("surpriseButton");
var stepTwo = document.getElementById("stepTwo");
var cake = document.getElementById("cake");
var blowButton = document.getElementById("blowButton");
var bouquetLeft = document.getElementById("bouquetLeft");
var bouquetRight = document.getElementById("bouquetRight");
var loveLetterWrap = document.getElementById("loveLetterWrap");
var openLetterButton = document.getElementById("openLetterButton");
var loveLetterSection = document.getElementById("loveLetterSection");
var bgMusic = document.getElementById("bgMusic");
var confettiCanvas = document.getElementById("confettiCanvas");

var countdownWrap = document.getElementById("countdownWrap");
var countdownNum = document.getElementById("countdownNum");
var introText = document.getElementById("introText");

var confettiAnimationId = null;

// ============================================
// Animated countdown 3 → 2 → 1 (not real time)
// Then remove countdown, trigger confetti. After confetti, hide countdown so only title + button remain.
// ============================================
var COUNTDOWN_DURATION_MS = 1200;

function runCountdownAnimation() {
  var num = 3;

  function showNext() {
    if (num < 1) {
      countdownWrap.classList.add("done");
      if (introText) introText.classList.add("hide-with-countdown");
      startConfetti(3500, function () {
        if (surpriseWrap) surpriseWrap.classList.add("visible");
      });
      return;
    }

    countdownNum.textContent = num;
    countdownNum.classList.remove("tick", "pop");
    countdownNum.offsetHeight;
    countdownNum.classList.add("pop");

    num = num - 1;
    setTimeout(function () {
      countdownNum.classList.add("tick");
      setTimeout(showNext, 400);
    }, COUNTDOWN_DURATION_MS);
  }

  setTimeout(showNext, 400);
}

runCountdownAnimation();

// ============================================
// Confetti setup
// ============================================
function resizeCanvas() {
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

var ctx = confettiCanvas.getContext("2d");

var pastelColors = [
  "#ff9ac4",
  "#ffc3e1",
  "#f6b2ff",
  "#c08bff",
  "#ffe6f2",
  "#fff0f5",
];

function ConfettiPiece() {
  this.reset();
}

ConfettiPiece.prototype.reset = function () {
  this.x = Math.random() * confettiCanvas.width;
  this.y = Math.random() * -confettiCanvas.height;
  this.size = 5 + Math.random() * 7;
  this.speedY = 2 + Math.random() * 3;
  this.speedX = -1.5 + Math.random() * 3;
  this.tilt = Math.random() * 10;
  this.tiltSpeed = 0.03 + Math.random() * 0.06;
  this.color =
    pastelColors[Math.floor(Math.random() * pastelColors.length)];
};

ConfettiPiece.prototype.update = function () {
  this.y += this.speedY;
  this.x += this.speedX;
  this.tilt += this.tiltSpeed;

  if (this.y > confettiCanvas.height + 30) {
    this.reset();
    this.y = -20;
  }
};

ConfettiPiece.prototype.draw = function (context) {
  context.beginPath();
  context.fillStyle = this.color;
  context.ellipse(
    this.x,
    this.y,
    this.size,
    this.size * 0.6,
    this.tilt,
    0,
    Math.PI * 2
  );
  context.fill();
};

var CONFETTI_COUNT = 160;
var confettiPieces = [];

for (var i = 0; i < CONFETTI_COUNT; i++) {
  confettiPieces.push(new ConfettiPiece());
}

function drawConfetti() {
  ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  for (var i = 0; i < confettiPieces.length; i++) {
    confettiPieces[i].update();
    confettiPieces[i].draw(ctx);
  }
}

function startConfetti(duration, onComplete) {
  duration = duration || 3000;
  if (confettiAnimationId !== null) {
    cancelAnimationFrame(confettiAnimationId);
    confettiAnimationId = null;
  }

  var endTime = performance.now() + duration;

  function frame(now) {
    drawConfetti();
    if (now < endTime) {
      confettiAnimationId = requestAnimationFrame(frame);
    } else {
      ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
      confettiAnimationId = null;
      if (typeof onComplete === "function") onComplete();
    }
  }

  confettiAnimationId = requestAnimationFrame(frame);
}

// ============================================
// STEP 1 -> STEP 2: Remove button, show cake + start music
// ============================================
if (surpriseButton) {
  surpriseButton.addEventListener("click", function () {
    if (surpriseWrap && surpriseWrap.parentNode) {
      surpriseWrap.parentNode.removeChild(surpriseWrap);
    }
    stepTwo.style.display = "block";
    stepTwo.classList.add("show");

    if (bgMusic) {
      bgMusic.currentTime = 0;
      bgMusic.play().catch(function () {});
    }
  });
}

// ============================================
// STEP 3: Blow candles – flames out, smoke, confetti, two bouquets, hide Blow button
// STEP 4: Show "Open Love Letter" button
// ============================================
function blowCandles() {
  cake.classList.add("blown");
  startConfetti();

  if (bouquetLeft) bouquetLeft.classList.add("show");
  if (bouquetRight) bouquetRight.classList.add("show");

  if (blowButton) blowButton.classList.add("hidden");
  if (loveLetterWrap) loveLetterWrap.classList.add("show");
}

if (blowButton) blowButton.addEventListener("click", blowCandles);

// ============================================
// Open Love Letter: fade in love letter section on same page
// ============================================
if (openLetterButton && loveLetterSection) {
  openLetterButton.addEventListener("click", function () {
    loveLetterSection.classList.add("show");
  });
}
