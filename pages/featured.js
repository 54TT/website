import Featured from "../components/Featured";
import Layout from "../components/Layout/Layout";
import SeoHead from "../components/SeoHead";

export default function index() {
  return (
    <>
      <SeoHead title='' />
      <Layout>
        <Featured />
      </Layout>
    </>
  );
}
