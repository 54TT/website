import Home from "../components/Home";
import Layout from "../components/Layout/Layout";
import SeoHead from "../components/SeoHead";

export default function index() {
  return (
    <>
      <SeoHead title='' />
      <Layout>
        <Home />
      </Layout>
    </>
  );
}
