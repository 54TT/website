import dynamic from 'next/dynamic'
const Featured = dynamic(() => import('../components/Featured'),);
export default function index() {
  return (
    <>
        <Featured />
    </>
  );
}
