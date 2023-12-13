import dynamic from 'next/dynamic'
const PairInfo = dynamic(() => import('../components/PairInfo'),{ ssr: false });
export default function pairInfo() {
  return (
    <>
        <PairInfo/>
    </>
  );
}
