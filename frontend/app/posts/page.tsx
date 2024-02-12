'use client';

import { useSearchParams } from 'next/navigation';

export default function Posts() {
  const searchParams = useSearchParams();
  const post_id = searchParams.get('post_id');

  return (
    <>
      <div>{post_id}</div>
    </>
  );
}
