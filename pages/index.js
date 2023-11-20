// import Home from "../components/Home";
import dynamic from 'next/dynamic'
const Home = dynamic(() => import('../components/Home'));
export default function index() {
  return (
    <>
        <Home />
    </>
  );
}
