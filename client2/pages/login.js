import React, { useEffect, useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import axios from 'axios';
import AboutButton from '../components/aboutButton';
import { format } from 'date-fns';


const Login = () => {
    const router = useRouter();
    const { data, status } = useSession();
    const [newUser, setNewUser] = useState(false);
    const [oldUser, setOldUser] = useState(null);
    const [userEmail, setUserEmail] = useState(null);
    const [lastLogin, setLastLogin] = useState(null);
    const [numOfCharts, setNumOfCharts] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            if (status === 'authenticated') {
                try {
                    if(data.user.email !==null) {
                        const response = await axios.get(`http://localhost:4000/user/${userEmail}`);
                        console.log(response.data);
                        if (response.data.length === 0) {
                            setNewUser(true);
                        } else {
                            setLastLogin(response.data[0].currentLogin)
                            setNumOfCharts(response.data[0].numOfCharts)
                            setOldUser(true);
                        }
                    }
                } catch (error) {
                    console.error('Error occurred:', error);
                }
            }
        };

        if (status === 'authenticated') {
            setUserEmail(data.user.email);
            fetchUser();
        }
        if (oldUser === true) {
            updateUser()
            router.push('/mainPage');
        }
    }, [status, data, userEmail,oldUser, router]);

    const createNew = async () =>{
        const addUser = {
            username: data.user.name,
            userEmail: data.user.email,
            numOfCharts: 0,
            lastLogin: new Date().toISOString(),
            currentLogin: new Date().toISOString(),
        };

        // Send parsedData to the localhost server using axios.post
        const response = await axios.post('http://localhost:4000/user', addUser);
        console.log(response.data);
    }
    const updateUser = async () =>{
        const putUser = {
            username: data.user.name,
            userEmail: data.user.email,
            numOfCharts: numOfCharts,
            lastLogin: lastLogin,
            currentLogin: new Date().toISOString(),
        };

        // Send parsedData to the localhost server using axios.post
        const response = await axios.put('http://localhost:4000/user', putUser);
        console.log(response.data);
    }

    if (status === 'loading') {
        return <p>Loading...</p>;
    }

    if (status === 'authenticated') {
        return (
            <>
                {oldUser ? (
                    <h1></h1>
                ) : (
                    newUser ? (
                    <>
                        <h2>This is the first time you are logging in with {data.user.email}</h2>
                        <p>
                            If you continue, your email will be stored in our database to allow you to store your
                            created charts and
                            purchase chart credits
                        </p>
                        <button className="button" onClick={() =>{
                            createNew();
                            router.push('/mainPage')}}>
                            Continue
                        </button>
                        <button className="button" onClick={() => router.push('/')}>
                            No, thanks
                        </button>
                    </>
                    ) : (
                        <h2>loading...</h2>
                    )
                )}
                <AboutButton/>
            </>
        );
    }
    else if (status === "unauthenticated"){
        return (
            <>
                <div className="center">
                    <button onClick={() => signIn('google')}>Sign in with Google</button>
                </div>
                <AboutButton/>
            </>

        );
    }
};

export default Login;
