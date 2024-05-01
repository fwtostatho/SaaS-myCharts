import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import Dashboard from "./dashboard";
import AboutButton from "../components/aboutButton";
import axios from "axios";
import React, { useState, useEffect } from 'react';

export default  function mainPage() {
    const [chartCount, setChartCount] = useState(0);
    const [lastLogin, setLastLogin] = useState('');
    const [userCredits, setCredits] = useState(0);

    const router = useRouter();
    const {data, status} = useSession();


    useEffect(() => {
        if (status === 'authenticated') {
            // Fetch the number of index
            const fetchUserInfo = async () => {
                try {
                    const mail = data.user.email;
                    const response = await axios.get(`http://localhost:3000/api/userInfo?userEmail=${mail}`);
                    const userInfo = response.data;
                    console.log("User Info:", userInfo);
                    setChartCount(userInfo.numOfCharts);
                    setLastLogin(userInfo.lastLogin);
                } catch (error) {
                    console.error('Error fetching chart count and lastLogin:', error);
                }
            };

            // Fetch the credits
            const fetchUserCredits = async () => {
                try {
                    const mail = data.user.email;
                    const response = await axios.get(`http://localhost:3000/api/userInfo?query=1&userEmail=${mail}`);
                    const userCredits = response.data;
                    console.log("User Credits:", userCredits);
                    setCredits(userCredits.total);
                } catch (error) {
                    console.error('Error fetching credits:', error);
                }
            };

            // Call the fetch functions
            fetchUserInfo();
            fetchUserCredits();
        }
    }, [status, data]);

    if (status === 'loading') return <h1> loading... please wait</h1>;



  if (status === 'authenticated') {
    return (
        <>
        <div className="center">
            <h1>Hello {data.user.name}</h1>
            {/*<img src={data.user.image} alt={data.user.name + ' photo'} />*/}
            <Dashboard
                numberOfCharts={chartCount}   //to be fixed later
                lastLoginTime={lastLogin}
                credits={userCredits}
            />
            <div className="button-container">
                <button onClick={() => { router.push('/myCharts '); }}>My Charts</button>
                <button onClick={() => { router.push('/buyCredits'); }}>Buy Credits</button>
                <button onClick={() => { router.push('/newChart'); }}>New Chart</button>
                <button style={{ display: 'none' }} onClick={() => { }}></button>
            </div>
        </div>
            <AboutButton/>
            </>

     );
  }
  return (
      <>
          <div className="center">
              <button onClick={() => { router.push('/'); }}>Return to Home Page</button>
          </div>
          <AboutButton/>
      </>

    );
}
