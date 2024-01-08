import '/public/style/all.css'
import Head from 'next/head'
function DexPert({Component}) {
    return (
        <>
            <Head>
                <link rel="shortcut icon" href="/Group19.svg"/>
                <title>DexPert</title>
            </Head>
            <Component/>
        </>
    );
}
export default DexPert;
