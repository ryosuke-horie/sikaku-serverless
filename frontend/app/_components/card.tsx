import Image from 'next/image';

interface CardData {
  title: string;
  // 必要に応じて他のプロパティを追加
}

interface CardProps {
  cardData: CardData;
}

const Card: React.FC<CardProps> = ({ cardData }) => {
  const handleClick = () => {
    console.log('clicked');
  };

  return (
    <div className="card w-96 bg-base-100 shadow-xl">
      <figure className="px-10 pt-10">
        <Image
          src="https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg"
          alt="Shoes"
          className="rounded-xl"
          width={200}
          height={200}
        />
      </figure>
      <div className="card-body items-center text-center">
        {/* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access */}
        <h2 className="card-title">{cardData.title}</h2>
        <div className="card-actions">
          <button className="btn btn-primary" onClick={handleClick}>
            続きを読む
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;
