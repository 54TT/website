import '/public/style/all.css'
import Head from 'next/head'
function DexPert({Component}) {
    return (
        <>
            <Head>
                <link rel="shortcut icon" href="/logo.gif"/>
                <title>DexPert</title>
            </Head>
            <Component/>
        </>
    );
}
export default DexPert;
