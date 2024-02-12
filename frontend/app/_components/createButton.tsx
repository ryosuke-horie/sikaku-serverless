'use client';

import { useRouter } from 'next/navigation';

const CreateButton = () => {
  const router = useRouter(); // useRouterフックを使用

  const handleClick = () => {
    void router.push('/create'); // /createに遷移する
  };

  return (
    <button className="btn btn-outline btn-primary mr-2" onClick={handleClick}>
      投稿する
    </button>
  );
};

export default CreateButton;
