import dynamic from 'next/dynamic'
const NewPair = dynamic(() => import('../components/NewPair'),{suspense: false});
export default function index() {
  return (
    <>
        <NewPair/>
    </>
  );
}
