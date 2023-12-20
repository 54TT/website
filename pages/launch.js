import dynamic from 'next/dynamic'
const Launch = dynamic(() => import('/components/Launch'),);
export default function index() {
  return (
    <>
        <Launch />
    </>
  );
}
