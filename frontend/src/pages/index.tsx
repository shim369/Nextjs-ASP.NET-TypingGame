import Link from 'next/link';

const Home: React.FC = () => {
  return (
    <div>
      <h1>タイピングゲーム</h1>
      <Link href="/game">
        ゲームを開始
      </Link>
    </div>
  );
}

export default Home;
