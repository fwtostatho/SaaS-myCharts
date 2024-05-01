import { useRouter } from 'next/router';

const AboutButton = () => {
    const router = useRouter();

    const handleClick = () => {
        router.push('/about');
    };

    return (
        <button className='button' onClick={handleClick} style={{ position: 'fixed', bottom: '20px', left: '20px' }}>
            About
        </button>
    );
};

export default AboutButton;
