// import PairInfo from "../components/PairInfo";
import dynamic from 'next/dynamic'
const PairInfo = dynamic(() => import('../components/PairInfo'),);
export default function pairInfo() {
  return (
    <>
        <PairInfo/>
    </>
  );
}
