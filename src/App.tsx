import { useEffect, useState } from "react";
import "./App.css";

import hole from "./assets/images/hole.png";
import mole from "./assets/images/mole.png";
import bomb from "./assets/images/bomb.png";
import hummer from "./assets/images/hummer1.png";
import hummerAttack from "./assets/images/hummer2.png";
import heart from "./assets/images/heart.png";

import bonkSound from "./assets/sounds/bonk.mp3";
import scoreSound from "./assets/sounds/score.mp3";
import explosionSound from "./assets/sounds/explosion.mp3";

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
  const [gameStarted, setGameStarted] = useState<boolean>(false);

  const bonkAudio = new Audio(bonkSound);
  const scoreAudio = new Audio(scoreSound);
  const explosionAudio = new Audio(explosionSound);

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
      explosionAudio.play();
      setPlayerHealth((health) => health - 1);
      document.documentElement.classList.add("bomb-hit");
      setTimeout(() => {
        document.documentElement.classList.remove("bomb-hit");
      }, 700);
    } else {
      setScore((score) => score + 1);
      setTimeout(() => {
        scoreAudio.play();
      }, 100);
    }
  }

  function restartGame() {
    setMoles(Array(9).fill({ isVisible: false, isBomb: false }));
    setScore(0);
    setPlayerHealth(3);
  }

  useEffect(() => {
    if (playerHealth === 0 || !gameStarted) return;

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
  }, [moles, playerHealth, gameStarted]);

  useEffect(() => {
    if (playerHealth === 0 || !gameStarted) return;

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
  }, [playerHealth, gameStarted]);

  return (
    <>
      {!gameStarted ? (
        <div className="game-start-screen">
          <h1>WHACK A MOLE</h1>
          <button onClick={() => setGameStarted(true)}>PLAY</button>
        </div>
      ) : (
        <div className="game-container">
          <h1>Score: {score}</h1>

          <div className="player-health">
            <img className="heart" src={heart} />
            <h2>x {playerHealth}</h2>
          </div>

          {playerHealth === 0 && (
            <div>
              <h2>GG. YOU'R LOSE</h2>
              <button onClick={restartGame}>RESTART</button>
            </div>
          )}

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
        </div>
      )}
    </>
  );
}

export default App;
