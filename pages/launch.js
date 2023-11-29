import dynamic from 'next/dynamic'
const Launch = dynamic(() => import('../components/Launch'),{suspense: true,ssr: true});
export default function index() {
  return (
    <>
        <Launch />
    </>
  );
}
