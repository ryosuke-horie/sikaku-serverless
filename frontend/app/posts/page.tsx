/* eslint-disable @typescript-eslint/no-unsafe-assignment */
'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';

interface CardData {
  Title: string;
  Content: string;
}

export default function PostPageWrapper() {
  return (
    <Suspense fallback={<div>ロード中...</div>}>
      <PostPage />
    </Suspense>
  );
}

function PostPage() {
  const [data, setData] = useState<CardData | null>(null);

  // クエリパラメータでpost_idとcreated_atを取得（DynamoDBのパーティションキー＋ソートキー）
  const searchParams = useSearchParams();
  const post_id = searchParams.get('post_id');
  const created_at = searchParams.get('created_at');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = new URL('https://i9pnpgf341.execute-api.ap-northeast-1.amazonaws.com/prod/get');
        url.searchParams.append('post_id', post_id); // クエリパラメータとしてpost_idを追加
        url.searchParams.append('created_at', created_at);

        const response = await fetch(url.toString());
        if (!response.ok) {
          throw new Error('APIからのデータの取得に失敗しました');
        }
        const jsonData = await response.json();
        setData(jsonData as CardData); // データをStateに保存
      } catch (error) {
        console.error('データの取得中にエラーが発生しました:', error);
      }
    };

    fetchData().catch((error) => console.error('データの取得中にエラーが発生しました:', error));
  }, [post_id, created_at]);

  return (
    <div className="p-4">
      {data ? (
        <>
          <h1 className="mb-2 text-xl font-bold">{data.Title}</h1>
          <p>{data.Content}</p>
        </>
      ) : (
        <p>データの読み込み中...</p>
      )}
    </div>
  );
}
