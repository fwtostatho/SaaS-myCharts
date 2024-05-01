import { useRouter } from 'next/router';

const ReturnButton = () => {
    const router = useRouter();

    const handleClick = () => {
        router.push('/mainPage');
    };

    return (
        <button className='button' onClick={handleClick} style={{ position: 'fixed', bottom: '20px', right: '20px' }}>
            Back Home
        </button>
    );
};

export default ReturnButton;