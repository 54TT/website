import dynamic from 'next/dynamic'
const NewPair = dynamic(() => import('/components/NewPair'),{ ssr: false });
export default function index() {
  return (
    <>
        <NewPair/>
    </>
  );
}
