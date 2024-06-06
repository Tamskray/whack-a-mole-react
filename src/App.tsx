import { useEffect, useState } from "react";
import "./App.css";

import hole from "./assets/images/hole.png";
import mole from "./assets/images/mole.png";
import bomb from "./assets/images/bomb.png";
import hummer from "./assets/images/hummer1.png";
import hummerAttack from "./assets/images/hummer2.png";

import bonkSound from "./assets/sounds/bonk.mp3";
import scoreSound from "./assets/sounds/score.mp3";

interface Mole {
  isVisible: boolean;
  isBomb: boolean;
}

function App() {
  const [moles, setMoles] = useState<Mole[]>(
    new Array(9).fill({ isVisible: false, isBomb: false })
  );
  const [score, setScore] = useState(0);
  const [cursor, setCursor] = useState<string>(hummer);
  const [playerHealth, setPlayerHealth] = useState<number>(3);

  const bonkAudio = new Audio(bonkSound);
  const scoreAudio = new Audio(scoreSound);

  function handleHummerAttack() {
    bonkAudio.play();
    setCursor(hummerAttack);
    setTimeout(() => {
      setCursor(hummer);
    }, 200);
  }

  function setMoleVisibility(
    index: number,
    isVisible: boolean,
    isBomb: boolean = false
  ) {
    setMoles((currMoles) => {
      const newMoles = [...currMoles];
      newMoles[index] = { isVisible: isVisible, isBomb: isBomb };
      return newMoles;
    });
  }

  function whackMole(index: number) {
    const mole = moles[index];
    if (!mole.isVisible) return;

    setMoleVisibility(index, false);

    if (mole.isBomb) {
      console.log("You hit a bomb");
      setPlayerHealth((health) => health - 1);
    } else {
      setScore((score) => score + 1);
      setTimeout(() => {
        scoreAudio.play();
      }, 100);
    }
  }

  useEffect(() => {
    if (playerHealth === 0) return;

    const moleInterval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * moles.length);
      setMoleVisibility(randomIndex, true);
      setTimeout(() => {
        setMoleVisibility(randomIndex, false);
      }, 700);
    }, 1000);

    return () => {
      clearInterval(moleInterval);
    };
  }, [moles, playerHealth]);

  useEffect(() => {
    if (playerHealth === 0) return;

    const bombInterval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * moles.length);
      setMoleVisibility(randomIndex, true, true);
      setTimeout(() => {
        setMoleVisibility(randomIndex, false);
      }, 700);
    }, 5000);

    return () => {
      clearInterval(bombInterval);
    };
  }, [playerHealth]);

  useEffect(() => {
    console.log(playerHealth);
  }, [playerHealth]);

  return (
    <>
      <h1>Score {score}</h1>
      <h1>HP: {playerHealth}</h1>
      {playerHealth === 0 && <h1>GG. YOU'R LOSE</h1>}
      <div
        className="grid"
        style={{ cursor: `url(${cursor}), auto` }}
        onClick={handleHummerAttack}
      >
        {moles.map((isMole, idx) => (
          <img
            key={idx}
            src={isMole.isVisible ? (isMole.isBomb ? bomb : mole) : hole}
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
