import { useSession  } from "next-auth/react"
import { useRouter } from 'next/router';
import React, {useState} from "react";
import AboutButton from "../components/aboutButton";
import ReturnButton from "../components/returnButton";
import IndexButton from "../components/indexButton";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import Gallery from "../components/Gallery";

export default function BuyCredits() {
    const {data, status} = useSession();
    const email = data?.user?.email;
    console.log(email);
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);


    const handleSaveData = async (amount,email) => {
        const data = {
            "userEmail": email,
            "total": 0,
            "sub": 0,
            "added": amount
        }

        try {

            const response = await fetch(`http://localhost:3000/api/credits?query=1&userEmail=${email}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            console.log(response)
            const responseData = await response.json();
            console.log(responseData);

            if (responseData.length > 0) {

                // User exists, update the "added" property using PUT
                const updatedResponse = await fetch('http://localhost:3000/api/credits', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userEmail: email,
                        added: amount,
                    })
                });


                if (updatedResponse.ok) {
                    setSuccessMessage("Credits purchased successfully.")
                    setErrorMessage(null)
                    console.log('Data updated successfully');
                } else {
                    setErrorMessage("Failed to purchase.")
                    setSuccessMessage(null)
                    console.error('Error updating data');
                }

            }else {
                // User doesn't exist, create new record using POST
                const createResponse = await fetch('http://localhost:3000/api/credits', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ data }),
                });

                if (createResponse.ok) {
                    setSuccessMessage("Credits purchased successfully.")
                    setErrorMessage(null)
                    console.log('Data created successfully');
                } else {
                    setErrorMessage("Failed to purchase.")
                    setSuccessMessage(null)
                    console.error('Error creating data');
                }

            }
        } catch (error) {
            console.error('Failed to save data', error);
        }
    };

    if (status === 'authenticated') {

        return (errorMessage ? (
            <>
                <h3>{errorMessage}</h3>
                <AboutButton />
                <ReturnButton/>
                </>
            ) : (
                successMessage ? (
                    <>
                        <h3>{successMessage}</h3>
                        <AboutButton />
                        <ReturnButton/>
                    </>
                ) :
            <>

                <div className="center-buttons">
                    <button onClick={() => handleSaveData(5, email)}>5</button>
                    <button onClick={() => handleSaveData(10, email)}>10</button>
                    <button onClick={() => handleSaveData(15, email)}>15</button>
                </div>

                <button onClick={() => {
                    router.push('/mainPage');
                }} className='button' style={{ position: 'fixed', bottom: '20px', right: '20px' }}>
                    Cancel Purchase
                </button>
                <AboutButton />
            </>
        ) );
    }else{
        return (
            <div>
                 <h1>Not authorized</h1>
                <AboutButton />
                <IndexButton/>
             </div>)
    }
}