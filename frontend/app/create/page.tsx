'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const Create = () => {
  const router = useRouter(); // useRouterフックを使用

  // 各フォーム要素の状態を管理
  const [title, setTitle] = useState('');
  const [majorCategory, setMajorCategory] = useState('');
  const [minorCategory, setMinorCategory] = useState('');
  const [content, setContent] = useState('');

  //   // Auth0のユーザ情報を取得 TODO
  //   const { user } = useAuth0();
  //   const auth0user = user.name ?? '';

  const handlePost = async () => {
    // POSTリクエストのパラメータを構築
    const postParams = {
      title,
      majorCategory,
      minorCategory,
      content,
    };

    console.log(postParams);

    // ここにAPIエンドポイントへのPOSTリクエストを実行するコードを記述
    // https://i9pnpgf341.execute-api.ap-northeast-1.amazonaws.com/prod/
    try {
      // Execute the POST request to the provided API endpoint
      const response = await fetch('https://i9pnpgf341.execute-api.ap-northeast-1.amazonaws.com/prod/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // You may need to add authorization headers or other headers here
        },
        body: JSON.stringify(postParams),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // 投稿後にTopに遷移する
      void router.push('/');
    } catch (error) {
      console.error('There was an error!', error);
    }
  };

  return (
    <div className="my-8 flex w-full flex-col items-center justify-center space-y-4 p-4">
      <input
        type="text"
        placeholder="Title"
        name="title"
        className="input input-bordered mb-4 w-full max-w-lg p-4 text-lg"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <select
        className="select select-bordered mb-4 w-full max-w-lg text-lg"
        name="majorCategory"
        value={majorCategory}
        onChange={(e) => setMajorCategory(e.target.value)}
      >
        <option disabled value="">
          資格種別を選択
        </option>
        <option value="aws">AWS</option>
        <option value="google cloud">Google Cloud</option>
        <option value="azure">Azure</option>
      </select>

      <select
        className="select select-bordered mb-4 w-full max-w-lg text-lg"
        name="minorCategory"
        value={minorCategory}
        onChange={(e) => setMinorCategory(e.target.value)}
      >
        <option disabled value="">
          資格名を選択
        </option>
        <option value="clf">CLF</option>
        <option value="saa">SAA</option>
      </select>

      <textarea
        className="textarea textarea-bordered mb-4 w-full h-32 max-w-lg p-4 text-lg"
        placeholder="ここに内容を入力"
        name="content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      ></textarea>

      <button className="btn btn-primary w-full max-w-lg text-lg" onClick={handlePost}>
        送信
      </button>
    </div>
  );
};

export default Create;
