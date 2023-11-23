import dynamic from 'next/dynamic'
const Launch = dynamic(() => import('../components/Launch'),{suspense: false});
export default function index() {
  return (
    <>
        <Launch />
    </>
  );
}
