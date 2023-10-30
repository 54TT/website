import Layout from "../components/Layout/Layout";
import SeoHead from "../components/SeoHead";
import PairForm from "../components/PairForm";

export default function addPair() {
  return (
    <>
      <SeoHead title='' />
      <Layout>
        <PairForm/>
      </Layout>
    </>
  );
}
