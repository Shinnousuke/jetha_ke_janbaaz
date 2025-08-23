// Speech-to-Text
let recognition;
function startRecording() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) return alert('SpeechRecognition not supported in this browser.');
  recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.onresult = (event) => {
    let transcript = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
      if (event.results[i].isFinal) {
        transcript += event.results[i][0].transcript + ' ';
      }
    }
    console.log('Transcript:', transcript);
    alert("Captured: " + transcript);
  };
  recognition.start();
}

// Summarize using Hugging Face
async function summarizeText() {
  const text = prompt("Enter text to summarize:");
  const token = prompt("Enter Hugging Face token:");
  if (!text || !token) return;
  const res = await fetch("https://api-inference.huggingface.co/models/facebook/bart-large-cnn", {
    method: "POST",
    headers: { "Authorization": "Bearer " + token, "Content-Type": "application/json" },
    body: JSON.stringify({ inputs: text })
  });
  const data = await res.json();
  alert("Summary: " + (data[0]?.summary_text || 'Error'));
}

// Text-to-Speech
function playTTS() {
  const text = prompt("Enter text to speak:");
  if (!text) return;
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'en-US';
  speechSynthesis.speak(utter);
}

// Whisper Upload
async function uploadWhisper() {
  const fileInput = document.getElementById("audioFile");
  const file = fileInput.files[0];
  if (!file) return alert("Please select an audio file.");
  const key = prompt("Enter OpenAI API key:");
  if (!key) return;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("model", "whisper-1");

  const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: { "Authorization": `Bearer ${key}` },
    body: formData
  });
  const result = await response.json();
  alert("Transcription: " + (result.text || 'Error'));
}

document.addEventListener("DOMContentLoaded", function() {
  const faders = document.querySelectorAll(".fade-in");

  const appearOptions = {
    threshold: 0.2,
    rootMargin: "0px 0px -50px 0px"
  };

  const appearOnScroll = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    });
  }, appearOptions);

  faders.forEach(fader => {
    appearOnScroll.observe(fader);
  });
});
