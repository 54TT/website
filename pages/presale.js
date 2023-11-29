import dynamic from 'next/dynamic'
const Presale = dynamic(() => import('../components/Presale'),{suspense: false});
export default function index() {
  return (
    <>
        <Presale />
    </>
  );
}
