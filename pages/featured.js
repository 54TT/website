import dynamic from 'next/dynamic'
const Featured = dynamic(() => import('../components/Featured'),{suspense: false});
export default function index() {
  return (
    <>
        <Featured />
    </>
  );
}
