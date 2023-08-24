import React, { useState, useRef, useEffect } from 'react';
import Recommendation from './Recommendation';
import '../styles/Carousel.css';
import OwnRecommendation from './OwnRecommendation';

const Carousel = ({ recommendations , openEditModal ,feed , shelf}) => {
  const [startX, setStartX] = useState(null);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  console.log(recommendations)
  const carouselRef = useRef(null);

  const handleDragStart = (e) => {
    e.preventDefault();
    setStartX(e.clientX);
    setIsDragging(true);
    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('mouseup', handleDragEnd);
  };

  const handleDragMove = (e) => {
    if (!isDragging) return;
    const offsetX = e.clientX - startX;
    carouselRef.current.scrollLeft = scrollLeft - offsetX;
  };

  const handleDragEnd = () => {
    if (isDragging) {
      setIsDragging(false);
      setScrollLeft(carouselRef.current.scrollLeft);
      document.removeEventListener('mousemove', handleDragMove);
      document.removeEventListener('mouseup', handleDragEnd);
    }
  };

  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleDragMove);
      document.removeEventListener('mouseup', handleDragEnd);
    };
  }, []);

  return (
    <div
      className="carousel"
      ref={carouselRef}
      onMouseDown={handleDragStart}
      onMouseMove={handleDragMove}
      onMouseUp={handleDragEnd}
      style={{ display: 'flex', overflowX: 'scroll'  }}
    >
      <div style={{ display: 'flex' , gap:"40px"}}>
        {!feed && recommendations?.map((rec) =><Recommendation shelf recommendation={rec}  openEditModal={() => openEditModal(rec)} /> )}
        {feed && recommendations?.map((rec) =><OwnRecommendation recommendation={rec}  openEditModal={() => openEditModal(rec)} /> )}
      </div>
    </div>
  );
};

export default Carousel;
