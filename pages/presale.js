import dynamic from 'next/dynamic'
const Presale = dynamic(() => import('../components/Presale'),{ ssr: false });
export default function index() {
  return (
    <>
        <Presale />
    </>
  );
}
