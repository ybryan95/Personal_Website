// Import necessary modules, components, and styles
import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import car_1 from './assets/car_1.jpg';
import car_4 from './assets/car_3.jpg';
import car_3 from './assets/car_4.jpg';
import car_5 from './assets/car_5.jpg';
import car_6 from './assets/car_6.jpg';
import car_7 from './assets/car_7.jpg';
import car_8 from './assets/car_8.jpg';
import './carousel-custom.css';

// Define the CarouselComponent as a functional component
const CarouselComponent = () => {
  return (
    // Set the container for the Carousel with a maximum width of 900px and center it
    <div className="w-full" style={{ maxWidth: '900px', margin: '0 auto' }}>
      
      {/* Initialize the Carousel component with custom settings */}
      <Carousel
        showThumbs={false}
        autoPlay
        interval={3000}
        infiniteLoop
        showStatus={false}
        className="carousel-custom"
      >
        
        {/* Slide 1 */}
        <div style={{ backgroundColor: 'lightgray' }}>
          {/* Image for slide 1 */}
          <img src={car_1} 
          alt="Car 1" 
          style={{ height: '300px', objectFit: 'contain', maxWidth: '100%' }} 
          />
          {/* Caption for slide 1 */}
          <p className="legend">
            Data Science, Machine Learning
          </p>
        </div>

        {/* Slide 2 */}
        <div style={{ backgroundColor: 'lightgray' }}>
          {/* Image for slide 2 */}
          <img src={car_3} alt="Car 3" style={{ height: '300px', objectFit: 'contain', maxWidth: '100%' }} />
          {/* Caption for slide 2 */}
          <p className="legend">
          Full Stack Development, Spiderbot
            <a
              href="https://www.hackster.io/ybryan3/hexabitz-ir-theremin-6c96b0"
              target="_blank"
              rel="noreferrer"
              style={{
                color: 'white',
                fontWeight: 'bold',
                textDecoration: 'underline', 
              }}
            >
              https://www.hackster.io/ybryan3/hexabitz-ir-theremin-6c96b0
            </a>
          </p>
        </div>

        {/* Slide 3 */}
        <div style={{ backgroundColor: 'lightgray' }}>
          {/* Image for slide 3 */}
          <img src={car_4} alt="Car 4" style={{ height: '300px', objectFit: 'contain', maxWidth: '100%' }} />
          {/* Caption for slide 3 */}
          <p className="legend">
            [Capstone: Hexabitx IR Theremin] For more information, visit{' '}
          </p>
        </div>
        
        {/* Slide 4 */}
        <div style={{ backgroundColor: 'lightgray' }}>
          {/* YouTube video for slide 4 */}
          <iframe
            title="YouTube Video"
            width="100%"
            height="310"
            src="https://www.youtube.com/embed/hEOKye3S25c"
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
          ></iframe>
          <p className="legend">
            [Multifunction Wheelchair] {' '}
            <a
              href="https://www.linkedin.com/pulse/project-summary-multifunctional-wheelchair-ryan-cho"
              target="_blank"
              rel="noreferrer"
              style={{
                color: 'white',
                fontWeight: 'bold',
                textDecoration: 'underline', 
              }}
            >
              https://www.linkedin.com/pulse/project-summary-multifunctional-wheelchair-ryan-cho
            </a>
          </p>
        </div>

        <div style={{ backgroundColor: 'lightgray' }}>
          <img src={car_5} alt="Car 5" style={{ height: '300px', objectFit: 'contain', maxWidth: '100%' }} />
          <p className="legend">
            [Organizational Activities] Young Generation Office Member from 2019-2021{' '}
            <a
              href="https://seattle.ksea.org/#About"
              target="_blank"
              rel="noreferrer"
              style={{
                color: 'white',
                fontWeight: 'bold',
                textDecoration: 'underline', 
              }}
            >
              https://seattle.ksea.org/#About
            </a>
          </p>
        </div>
        <div style={{ backgroundColor: 'lightgray' }}>
          <img src={car_6} alt="Car 6" style={{ height: '300px', objectFit: 'contain', maxWidth: '100%' }} />
          <p className="legend">
            [Volunteer Work at Phillipines] News Article{' '}
            <a
              href="https://m.catholictimes.org/mobile/article_view.php?aid=229977"
              target="_blank"
              rel="noreferrer"
              style={{
                color: 'white',
                fontWeight: 'bold',
                textDecoration: 'underline', 
              }}
            >
              https://m.catholictimes.org/mobile/article_view.php?aid=229977
            </a>
          </p>
        </div>

        <div style={{ backgroundColor: 'lightgray' }}>
          <img src={car_7} alt="Car 7" style={{ height: '300px', objectFit: 'contain', maxWidth: '100%' }} />
          <p className="legend">
            [Korean Army] Served as Information Systems Technician 
          </p>
        </div>

        <div style={{ backgroundColor: 'lightgray' }}>
          <img src={car_8} alt="Car 8" style={{ height: '300px', objectFit: 'contain', maxWidth: '100%' }} />
          <p className="legend">
            [Autodesk Maya] 3D Modeling, Animation
          </p>
        </div>

        

      </Carousel>
    </div>
  );
};

export default CarouselComponent;