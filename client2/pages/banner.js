import {signOut, getSession, SessionProvider, useSession} from 'next-auth/react';
import {useEffect, useState} from "react";
import {useRouter} from "next/router";

// function Redirect({ to }) {
//     const router = useRouter();
//
//     useEffect(() => {
//         router.push(to);
//     }, [to]);
//
//     return null;
// }
export default function Banner() {
    const router = useRouter();
    const [shouldRedirect, setShouldRedirect] = useState(false);


    // if (shouldRedirect) {
    //     return <Redirect to="/" />;
    // }

    return(
        <header className="banner">
            <h1 className="banner-title">My Charts</h1>
            <button onClick={() => {
                signOut();
                // setShouldRedirect(true);
                }
                }
                    id="sign-out-button" className="sign-out-button">Sign Out</button>
        </header>
    );

}