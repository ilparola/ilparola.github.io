let audioCtx = null;
let isMuted = false;

const initAudio = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
};

export const setMuted = (muted) => {
  isMuted = muted;
  localStorage.setItem("intesa_vincente_muted", muted ? "true" : "false");
};

export const getMuted = () => {
  // Carica preferenza salvata
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("intesa_vincente_muted");
    if (saved !== null) {
      isMuted = saved === "true";
    }
  }
  return isMuted;
};

export const playSound = (type) => {
  if (getMuted()) return;
  
  try {
    const ctx = initAudio();
    const now = ctx.currentTime;
    
    switch (type) {
      case 'buzzer': {
        // Suono buzzer pulito ed energico
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, now); // La5
        
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        
        osc.start(now);
        osc.stop(now + 0.15);
        break;
      }
      case 'correct': {
        // Chime a due note ascendenti piacevoli (Do5 -> Mi5)
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(523.25, now); // Do5
        gain1.gain.setValueAtTime(0.15, now);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
        osc1.start(now);
        osc1.stop(now + 0.18);
        
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(659.25, now + 0.08); // Mi5
        gain2.gain.setValueAtTime(0.15, now + 0.08);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.08 + 0.25);
        osc2.start(now + 0.08);
        osc2.stop(now + 0.08 + 0.25);
        break;
      }
      case 'incorrect': {
        // Suono di errore basso e vibrante (sawtooth + triangle detuned)
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);
        
        osc1.type = 'sawtooth';
        osc1.frequency.setValueAtTime(130, now);
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(133, now); // detune per effetto battimento
        
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0.15, now + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        
        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.4);
        osc2.stop(now + 0.4);
        break;
      }
      case 'passo': {
        // Suono di transizione/scivolamento (swoosh synth)
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(330, now); // Mi4
        osc.frequency.exponentialRampToValueAtTime(660, now + 0.18);
        
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
        
        osc.start(now);
        osc.stop(now + 0.18);
        break;
      }
      case 'tick': {
        // Click leggero simile a un woodblock per gli ultimi secondi
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, now);
        
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
        
        osc.start(now);
        osc.stop(now + 0.03);
        break;
      }
      case 'timeup': {
        // Sirena prolungata TV di stop
        const duration = 1.3;
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);
        
        osc1.type = 'sawtooth';
        osc1.frequency.setValueAtTime(150, now);
        osc2.type = 'square';
        osc2.frequency.setValueAtTime(152, now);
        
        gain.gain.setValueAtTime(0.2, now);
        // Effetto a impulsi della sirena
        for (let t = 0.1; t < duration; t += 0.2) {
          gain.gain.setValueAtTime(0.2, now + t);
          gain.gain.setValueAtTime(0.05, now + t + 0.1);
        }
        gain.gain.setValueAtTime(0.2, now + duration - 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
        
        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + duration);
        osc2.stop(now + duration);
        break;
      }
      case 'intro': {
        // Breve arpeggio di inizio (Do4 -> Mi4 -> Sol4 -> Do5)
        const notes = [261.63, 329.63, 392.00, 523.25];
        notes.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + i * 0.08);
          
          gain.gain.setValueAtTime(0.12, now + i * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.22);
          
          osc.start(now + i * 0.08);
          osc.stop(now + i * 0.08 + 0.22);
        });
        break;
      }
      default:
        break;
    }
  } catch (err) {
    console.warn("Impossibile riprodurre l'effetto sonoro sintetizzato:", err);
  }
};
