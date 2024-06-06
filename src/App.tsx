import { useEffect, useState } from "react";
import "./App.css";

import hole from "./assets/images/hole.png";
import mole from "./assets/images/mole.png";
import hummer from "./assets/images/hummer1.png";
import hummerAttack from "./assets/images/hummer2.png";

import bonkSound from "./assets/sounds/bonk.mp3";
import scoreSound from "./assets/sounds/score.mp3";

function App() {
  const [moles, setMoles] = useState<boolean[]>(new Array(9).fill(false));
  const [score, setScore] = useState(0);
  const [cursor, setCursor] = useState<string>(hummer);

  const bonkAudio = new Audio(bonkSound);
  const scoreAudio = new Audio(scoreSound);

  function handleHummerAttack() {
    bonkAudio.play();
    setCursor(hummerAttack);
    setTimeout(() => {
      setCursor(hummer);
    }, 200);
  }

  function setMoleVisibility(index: number, isVisible: boolean) {
    setMoles((currMoles) => {
      const newMoles = [...currMoles];
      newMoles[index] = isVisible;
      return newMoles;
    });
  }

  function whackMole(index: number) {
    if (!moles[index]) return;
    setMoleVisibility(index, false);
    setScore((score) => score + 1);

    setTimeout(() => {
      scoreAudio.play();
    }, 100);
  }

  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * moles.length);
      setMoleVisibility(randomIndex, true);
      setTimeout(() => {
        setMoleVisibility(randomIndex, false);
      }, 700);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [moles]);

  return (
    <>
      <h1>Score {score}</h1>
      <div
        className="grid"
        style={{ cursor: `url(${cursor}), auto` }}
        onClick={handleHummerAttack}
      >
        {moles.map((isMole, idx) => (
          <img
            key={idx}
            src={isMole ? mole : hole}
            onClick={() => {
              whackMole(idx);
            }}
          />
        ))}
      </div>
    </>
  );
}

export default App;
