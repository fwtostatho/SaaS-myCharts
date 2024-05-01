import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Gallery = ({ images , onButtonClick }) => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
    };
    const handleButtonClick = (buttonText,index) => {
        onButtonClick(index);
    };
    return (
        <div>
            <Slider {...settings}>
                {images.map((image, index) => (
                    <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <img src={image.src} alt={`Image ${index}`} style={{ maxWidth: '100%', height: 'auto' }} />
                        <div>
                            <h2>{image.description}</h2>
                            <button  className="button" onClick={() => handleButtonClick(image.buttonText,index)}>
                                {image.buttonText}
                            </button>
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default Gallery;
