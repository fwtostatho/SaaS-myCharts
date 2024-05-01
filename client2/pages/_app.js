import { signOut, getSession, SessionProvider } from 'next-auth/react';
import { useRouter } from 'next/router';
import React, {useEffect, useState} from 'react';
import "../styles/globals.css"
import Banner from './banner'
import AboutButton from "../components/aboutButton";
import ReturnButton from "../components/returnButton";


function App({ Component, pageProps }) {
    const router = useRouter();
    return (
        <>
            <SessionProvider session={pageProps.session}>
                <>

                    <Banner/>
                    <Component {...pageProps} />
                </>
            </SessionProvider>
        </>
    );
}

export default App;
