import React from 'react';

//MUI
import {Typography, Grid} from '@mui/material';

//css
import '../styles/texts/text.css'; 

function Description({descriptions}){  //descriptions: array of descriptions that contains the title, content, image, and a boolean value determining the order/ orientation of the text content and the image
    return(
        <>
        {descriptions.map((section, index) => (
            <Grid 
              container   //it means this grid is the container
              spacing={2} //spacing of items inside the container
              sx={{ padding:3, alignItems: 'center'}} //alignItems is used to align the items vertically
              key={index}
              direction={section.reverse ? "row-reverse" : "row"}>  {/**direction is used to tell in which order the items should be put*/}

              <Grid 
              item  //it means that this grid is an item
              xs={12} md={6}  /* Content that will take full width (12 columns as a 12 column system has been adopted) on xs screens and half width (6 out of 12 columns) on md screens and up */ 
              sx={{ 
                
                display: 'flex',
                justifyContent: section.reverse ? 'flex-end' : 'flex-start'  // Aligns the contents of the grid (that is the iamges) horizontally
              }}>

                <img src={section.img} alt={`Description ${index + 1}`} style={{maxWidth: '100%'}} className='hoverScale'/>
                {/** hoverscale= custom css class to add hovereffect to images */}

              </Grid>
              <Grid item xs={12} md={6} sx={{

                display: 'flex',  //default flexDirection is row
                flexDirection: 'column', // This ensures text alignment works vertically

                //justifyContent: section.reverse ? 'flex-end' : 'flex-start',
                textAlign: section.reverse ? 'left' : 'right'  // Text alignment matches the content justification
              }}>

                <Typography variant="h3" fontWeight="bold" className='hoverScale'>{section.title}</Typography>
                <Typography className='hoverScale'>{section.content}</Typography>
                
              </Grid>
            </Grid>
          ))}
          </>
    );
}

export default Description;