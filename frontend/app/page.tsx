/* eslint-disable @typescript-eslint/no-unsafe-assignment */
'use client';

import { useState, useEffect } from 'react';

import Card from './_components/card';

interface CardData {
  title: string;
  // 他のプロパティを追加
}

export default function Home() {
  const [data, setData] = useState<CardData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://i9pnpgf341.execute-api.ap-northeast-1.amazonaws.com/prod/list');
        if (!response.ok) {
          throw new Error('APIからのデータの取得に失敗しました');
        }
        const jsonData = (await response.json()) ?? [];
        setData(jsonData as CardData[]); // データをStateに保存
      } catch (error) {
        console.error('データの取得中にエラーが発生しました:', error);
      }
    };

    fetchData().catch((error) => console.error('データの取得中にエラーが発生しました:', error)); // 非同期関数内でPromiseを待機
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
      {/* 取得したデータをマップしてCardコンポーネントを生成 */}
      {data.map((item, index) => (
        <Card key={index} cardData={item} />
      ))}
    </div>
  );
}
