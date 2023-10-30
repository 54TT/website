import Launch from "../components/Launch";
import Layout from "../components/Layout/Layout";
import SeoHead from "../components/SeoHead";

export default function index() {
  return (
    <>
      <SeoHead title='' />
      <Layout>
        <Launch />
      </Layout>
    </>
  );
}
