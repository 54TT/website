import dynamic from 'next/dynamic'
const NewPair = dynamic(() => import('../components/NewPair'));
export default function index() {
  return (
    <>
        <NewPair/>
    </>
  );
}
