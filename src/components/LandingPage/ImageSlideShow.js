import React, { useState, useEffect } from 'react';

//MUI
import {Box} from '@mui/material';

function ImageSlideShow({images, height}) {  //images= array of paths of images, height= height of the slidshow box

  
  const [currentImage, setCurrentImage] = useState(0);     //to keep track of the current image in the slideshow
  const [translateValue, setTranslateValue] = useState(0); //to update the translation value of the images during transition

  
  const transition= images.length>1 ? 'transform 1s ease-in-out': 'none';  //if there's just one image in the array, then no slideshow is needed


  
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (currentImage < images.length - 1) {

        setTranslateValue((prev) => prev - 100); //100 because translate values are being calculated in vw units

        setCurrentImage((prevImage) => prevImage + 1); //go to the next image

        //images.push(images[currentImage])   //this can be done to simulate infinite slide
      } else {
        // Immediately show duplicate then reset without user noticing
        setTranslateValue((prev) => prev - 100); // Move to duplicate
        setTimeout(() => {
          setTranslateValue(0); // Reset position after transition to the last image (duplicate of the first)
          setCurrentImage(0);
        }, 3000); // Should match transition duration
      }
    }, 3000);

    return () => clearInterval(intervalId);

    /**
     * When setting up intervals using setInterval, it will continue to run and execute the specified function at the defined interval (every 3000 milliseconds in your case) indefinitely, or until it is explicitly cleared.
     * If the component that set up the interval is unmounted from the React DOM, the interval would continue to run in the background if not cleared. This leads to potential memory leaks, as the interval may reference component state or props that are no longer in use or have been changed.
     * Without clearing the interval when the component unmounts, it can lead to React state updates on an unmounted component. This can cause errors in your application, such as trying to update the state of a component that no longer exists in the DOM.
     * By clearing the interval when the component is about to unmount, you ensure that the interval is stopped, which is especially important for intervals that may affect resources or cause side effects (like API calls, DOM updates, etc.).
     * In the useEffect hook, the return statement defines a cleanup function that will be called when the component unmounts or before the effect runs again due to changes in its dependencies ([currentImage] in this case). 
     * This cleanup function calls clearInterval(intervalId), where intervalId is the identifier returned by setInterval. This stops the interval, ensuring that the function you passed to setInterval stops executing.
     */
  }, [currentImage]);


  return (
    <>
      <Box sx={{
        mt: 8,  //mt= marginTop (sx prop)
        overflow: 'hidden',
        display: 'flex', // Align images horizontally by default
        height: height, // Set a fixed height for the slider
        border: '10px solid black',
        marginTop: '6.5%'  //If both mt and marginTop are applied to the same element, the one that appears last in the object will override the others.
      }}>
        {images.concat(images[0]).map((image, index) => (  //the first image is also concatenated at the end
          <Box key={index}
            sx={{
              maxHeight: '100%',
              width: '100vw',
              flexShrink: 0,  //the inner Box components (which display the images) are not allowed to shrink below their original size. Even if the container is too small to fit all items naturally, these items will not shrink to fit. This is crucial in a slider/carousel setup where you want each image to fully occupy the designated space
              transition: transition,
              backgroundImage: `url(${image})`,
              backgroundPosition: 'center', // Center the background image
              backgroundRepeat: 'no-repeat', // No repeat of the image
              transform: images.length>1?`translateX(${translateValue}vw)`:'none' // Use viewport width units
            }}
          />
        ))}
      </Box>
    </>
  );
}

export default ImageSlideShow;
