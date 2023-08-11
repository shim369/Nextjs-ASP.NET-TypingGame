import { useState, useEffect } from 'react';
import axios from 'axios';

const Game: React.FC = () => {
    const [currentWord, setCurrentWord] = useState<string>("");
    const [typedWord, setTypedWord] = useState<string>("");
    const [score, setScore] = useState<number>(0);
    const [message, setMessage] = useState<string>("");

    const fetchWord = async () => {
        try {
            const response = await axios.get<{ word: string }>('http://localhost:5298/api/game/getword');
            console.log(response.data);
            setCurrentWord(response.data.word);
        } catch (error) {
            console.error("Error fetching word:", error);
        }
    }

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            const response = await axios.post<{ isCorrect: boolean }>('http://localhost:5298/api/game/checkword', { TypedWord: typedWord.toLowerCase() });
            console.log(response.data);
            
            if(response.data.isCorrect) {
                setScore(prevScore => prevScore + 1);
                setMessage(`正解！入力した単語: ${typedWord}`);
                fetchWord();
            } else {
                setMessage(`不正解... 入力した単語: ${typedWord}`);
            }
            setTypedWord(""); // 入力欄を空にする
        } catch (error) {
            console.error("Error checking word:", error);
        }
    }

    useEffect(() => {
        fetchWord();
    }, []);

    return (
        <div>
            <h2>タイピングゲーム</h2>
            <p>タイプしてください: {currentWord}</p>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    value={typedWord}
                    onChange={(e) => {
                        setTypedWord(e.target.value);
                        setMessage(`入力中の単語: ${e.target.value}`);
                    }}
                />
                <button type="submit">提出</button>
            </form>
            <p>スコア: {score}</p>
            <p>{message}</p>
        </div>
    );
}

export default Game;
