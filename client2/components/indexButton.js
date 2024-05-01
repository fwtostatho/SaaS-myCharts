import { useRouter } from 'next/router';

const indexButton = () => {
    const router = useRouter();

    const handleClick = () => {
        router.push('/');
    };

    return (
        <button className='button' onClick={handleClick} style={{ position: 'fixed', bottom: '20px', right: '20px' }}>
            Back Home
        </button>
    );
};

export default indexButton;