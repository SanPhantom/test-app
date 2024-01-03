import React from "react";

interface IMusicCanvasProps {
  player: HTMLAudioElement;
}

const MusicCanvas = ({ player }: IMusicCanvasProps) => {
  const audioCtx = new AudioContext();

  const source = audioCtx.createMediaElementSource(player);
  const analyser = audioCtx.createAnalyser();

  source.connect(analyser);
  analyser.connect(audioCtx.destination);

  analyser.fftSize = 128;

  const frequencyData = new Uint8Array(analyser.frequencyBinCount);

  analyser.getByteFrequencyData(frequencyData);

  player.onload = (e) => {
    console.log({ e });
  };

  return <div>Component</div>;
};

export default MusicCanvas;
