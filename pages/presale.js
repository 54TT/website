import Presale from "../components/Presale";
import Layout from "../components/Layout/Layout";
import SeoHead from "../components/SeoHead";

export default function index() {
  return (
    <>
      <SeoHead title='' />
      <Layout>
        <Presale />
      </Layout>
    </>
  );
}
