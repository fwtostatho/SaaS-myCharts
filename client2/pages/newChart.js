import React, {useEffect, useRef, useState} from 'react';
import { useSession  } from "next-auth/react"
import { useRouter } from "next/router";
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import axios from 'axios';
import Gallery from '../components/Gallery';
import AboutButton from "../components/aboutButton";
import ReturnButton from "../components/returnButton";
import IndexButton from "../components/indexButton";

const UploadForm = () => {
    const router = useRouter();
    const chartRef = useRef(null);
    const {data, status} = useSession();
    const [modulesLoaded, setModulesLoaded] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [parsedData, setParsedData] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [fileSelected, setFileSelected] = useState(false);

    useEffect(() => {
        Promise.all([
            import('highcharts/modules/exporting'),
            import('highcharts/modules/sankey'),
            import('highcharts/modules/dependency-wheel'),
        ]).then(([ExportingModule, SankeyModule, WheelModule]) => {
            ExportingModule.default(Highcharts);
            SankeyModule.default(Highcharts);
            WheelModule.default(Highcharts);
            setModulesLoaded(true);
        });
    }, []);

    if (status === 'authenticated') {

        const handleFileChange = (event) => {
            setSelectedFile(event.target.files[0]);
            setFileSelected(true);
        };

        const handleSubmit = async (event) => {
            event.preventDefault();
            if (selectedFile) {
                try {
                    const formData = new FormData();
                    formData.append('file', selectedFile);

                    const response =await axios.post('http://localhost:3000/api/upload', formData);
                    // File uploaded successfully
                    console.log('File uploaded successfully');
                    if(!response.data.data.error) {
                        const chartData = response.data.data;
                        console.log(chartData);
                        const checkQuotas =await axios.post('http://localhost:3000/api/checkQuotas', {
                            data: chartData,
                            userEmail: data.user.email
                        });
                        setParsedData(chartData);
                        setErrorMessage(null);
                    }
                    else {
                        console.log(response.data.data.error)
                        setParsedData(null);
                        setErrorMessage(response.data.data.error);
                    }
                } catch (error) {
                    // Handle error
                    setParsedData(null);
                    setErrorMessage(error.response.data.error);
                }
            }
        };
        const handleSave = async () => {
            try {
                const response = await axios.post('http://localhost:3000/api/saveChart', {
                    data: JSON.stringify(parsedData),
                    userEmail: data.user.email,
                });
                console.log(response.data);
                console.log('Chart saved successfully');
                await router.push('/myCharts');
                //await router.push('/myCharts');
            } catch (error) {
                console.error('Error saving file:', error);
            }
        };


        const handleDownload = async (index) => {
            try {
                let filename;

                // Set the filename based on the image index
                switch (index) {
                    case 0:
                        filename = 'annotations_template.csv';
                        break;
                    case 1:
                        filename = 'basicLine_template.csv';
                        break;
                    case 2:
                        filename = 'wheel_template.csv';
                        break;
                    // Add more cases as needed for other image indices
                    default:
                        filename = 'template.csv';
                        break;
                }
                const response = await fetch(`http://localhost:3000/api/download?index=${index}`);
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                a.click();
                window.URL.revokeObjectURL(url);
            } catch (error) {
                console.error('Error downloading file:', error);
            }
        };

        const handleCancel = () => {
            setSelectedFile(null);
            setParsedData(null);
            setErrorMessage(null);
            setFileSelected(false);
            const fileInput = document.querySelector('input[type="file"]');
            if (fileInput) {
                fileInput.value = null;
            }
        };


        const images = [
            {
                src: '/images/image1.jpg',
                description: 'Line with Annotations Chart',
                buttonText: 'Download Template',
            },
            {
                src: '/images/image2.jpg',
                description: 'Basic Line Chart',
                buttonText: 'Download Template',
            },
            {
                src: '/images/image3.jpg',
                description: 'Dependency Wheel Chart',
                buttonText: 'Download Template',
            }
        ];


        return (
            <div style={{ textAlign: 'center' }}>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <input  type="file" name="file" onChange={handleFileChange} />
                <button className="button" type="submit">Upload</button>
            </form>
                {fileSelected && !parsedData && (
                    <button className="button" onClick={handleCancel}>Cancel</button>
                )}
                {errorMessage ? (
                    <h3>{errorMessage}</h3>
                ) : (
                    parsedData ? (
                        <>
                            <div  style={{ margin: '0 auto', maxWidth: '50%' }}>
                                <HighchartsReact highcharts={Highcharts} options={parsedData} ref={chartRef} />
                                <div >
                                    <button className="button" onClick={handleCancel}>Discard</button>
                                    <button className="button" onClick={handleSave}>Save to my Charts</button>
                                </div>
                            </div>

                        </>
                    ) : (
                        <div>
                            <Gallery images={images} onButtonClick={handleDownload} />
                        </div>
                    )
                )}
                <AboutButton />
                <ReturnButton />
            </div>
        );
    } else {
        return (<div>
            <h1>Not authorized</h1>
            <IndexButton/>
            <AboutButton />
        </div>)
    }
};

export default UploadForm;
