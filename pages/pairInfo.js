import Layout from "../components/Layout/Layout";
import SeoHead from "../components/SeoHead";
import PairInfo from "../components/PairInfo";

export default function pairInfo() {
  return (
    <>
      <SeoHead title='' />
      <Layout>
        <PairInfo/>
      </Layout>
    </>
  );
}
