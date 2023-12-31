import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import styles from "@/styles/Home.module.css";

const Home: React.FC = () => {
    const [currentWord, setCurrentWord] = useState<string>("");
    const [typedWord, setTypedWord] = useState<string>("");
    const [score, setScore] = useState<number>(0);
    const [message] = useState<string>("");
    const [timeLeft, setTimeLeft] = useState<number>(10);
    const [isGameActive, setIsGameActive] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const resetGame = () => {
        setIsGameActive(false);
        setTimeLeft(10);
        setScore(0);
        setTypedWord("");
        fetchWord();
    };

    useEffect(() => {
        if (isGameActive && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isGameActive]);

    const startGame = () => {
      setIsGameActive(true);
    }

    useEffect(() => {
        if (isGameActive && timeLeft > 0) {
            const timerId = setTimeout(() => {
                setTimeLeft(prevTime => prevTime - 1);
            }, 1000);
            return () => clearTimeout(timerId);
        } else if (timeLeft === 0) {
            setIsGameActive(false);
        }
    }, [timeLeft, isGameActive]);

    const fetchWord = async () => {
        try {
            const response = await axios.get<{ word: string }>('http://localhost:5298/api/game/getword');
            setCurrentWord(response.data.word);
        } catch (error) {
            console.error("Error fetching word:", error);
        }
    }

    useEffect(() => {
        fetchWord();
    }, []);

    useEffect(() => {
        if (currentWord === typedWord) {
            setScore(prevScore => prevScore + 1);
            setTypedWord("");
            fetchWord();
        } else if (currentWord.startsWith(typedWord)) {
            setCurrentWord(currentWord.substring(typedWord.length));
            setTypedWord("");
        } else {
            setTypedWord(typedWord.slice(0, -1));
        }
    }, [typedWord, currentWord]);

    return (
        <div>
            <h2>タイピングゲーム</h2>
            <div className={styles.typeBox}>
                {isGameActive ? (
                    <>
                        <p>{message}</p>
                        <p className={styles.currentWord}>{currentWord}</p>
                        <input 
                            ref={inputRef}
                            type="text" 
                            value={typedWord}
                            onChange={(e) => {
                                setTypedWord(e.target.value);
                            }}
                        />
                    </>
                ) : (
                    <button onClick={startGame} className={styles.startGame}>ゲームを開始</button>
                )}
                <button onClick={resetGame}>リセット</button>
            </div>
            <p>残り時間: {timeLeft}秒</p>
            <p>スコア: {score}</p>
        </div>
    );
}

export default Home;