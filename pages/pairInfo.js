// import PairInfo from "../components/PairInfo";
import dynamic from 'next/dynamic'
const PairInfo = dynamic(() => import('../components/PairInfo'),{suspense: false});
export default function pairInfo() {
  return (
    <>
        <PairInfo/>
    </>
  );
}
