const canvas = document.querySelector(".canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
// ctx.globalCompositeOperation = "destination-over";
const audio = document.querySelector(".audio");

const fileUpload = document.getElementById("fileupload");

fileUpload.addEventListener("change", visualizer);

let audioSource;
let analyser;
let hue;

function visualizer() {
  const audioCtx = new AudioContext();
  const file = this.files;
  audio.src = URL.createObjectURL(file[0]);
  audio.load();
  audio.play();
  audioSource = audioCtx.createMediaElementSource(audio);
  analyser = audioCtx.createAnalyser();
  audioSource.connect(analyser);
  analyser.connect(audioCtx.destination);
  analyser.fftSize = 512;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  const barWidth = canvas.width / bufferLength;
  let barHeight;
  let x;

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    x = 0;
    analyser.getByteFrequencyData(dataArray);
    drawVisualiser(bufferLength, barHeight, dataArray, barWidth, x);
    requestAnimationFrame(animate);
  }

  animate();
}

function drawVisualiser(bufferLength, barHeight, dataArray, barWidth, x) {
  for (let i = 0; i < bufferLength; i++) {
    barHeight = dataArray[i];
    ctx.fillStyle = "hsl(" + hue + ", 100%, 50%)";
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(i / 4);
    ctx.fillRect(0, 0, barWidth, barHeight);

    if (barHeight > 0) {
      ctx.fillStyle = `hsl(${hue}, 100%, 55%)`;
      ctx.beginPath();
      ctx.arc(0, barHeight + 200, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    x += barWidth;
    hue = i;
    ctx.restore();
  }
}
