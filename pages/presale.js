import dynamic from 'next/dynamic'
const Presale = dynamic(() => import('../components/Presale'),);
export default function index() {
  return (
    <>
        <Presale />
    </>
  );
}
