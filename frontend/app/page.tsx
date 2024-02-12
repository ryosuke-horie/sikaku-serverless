import Card from './_components/card';

export default function Home() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
      {/* レスポンシブグリッドレイアウトを適用 */}
      {Array.from({ length: 9 }).map((_, index) => (
        <Card key={index} />
      ))}
    </div>
  );
}
