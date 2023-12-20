import dynamic from 'next/dynamic'
const Featured = dynamic(() => import('/components/Featured'),{ ssr: false });
export default function index() {
  return (
    <>
        <Featured />
    </>
  );
}
