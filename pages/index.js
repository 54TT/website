// import Home from "../components/Home";
import dynamic from 'next/dynamic'
const Home = dynamic(() => import('../components/Home'),{suspense: false});
export default function index() {
  return (
    <>
        <Home />
    </>
  );
}
