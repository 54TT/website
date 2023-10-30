import Layout from "../components/Layout/Layout";
import SeoHead from "../components/SeoHead";
import CoinForm from "../components/CoinForm";

export default function addCoin() {
  return (
    <>
      <SeoHead title='' />
      <Layout>
        <CoinForm/>
      </Layout>
    </>
  );
}
