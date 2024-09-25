import React from 'react';

//MUI
import { Box, Container, Typography, Grid, Link } from '@mui/material';

//import icons
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";

//css
import '../styles/texts/text.css'; 

function Footer({quickLinks, bottomText, email, phone, backgroundColor, textColor}) {  //the names are self-explanatory
                                                                                       //text color is the color of all the texts and icons. You can customize it if you want

  //common styles to be used in titles "Quick Links", "Contact Us", "Follow Us"
  const styles={
    title:{
      //variant:'h6',  //variant property should be applied directly as a prop, the sx prop is primarily for CSS styles and does not handle component-specific props like variant.
      color: textColor,
      fontWeight:'bold',
    }
  }
  
  return (
    <Box sx={{ 
      backgroundColor: backgroundColor,
      padding: '20px 0',  //first value is the top and bottom padding, the second value is the left and right padding. Also could have been set explicitly
      //borderTop: '1px solid #ccc',
    }}>
      <Container maxWidth="lg"> 
      {/**
       * standard widths (xs, sm, md, lg, xl). Here, lg represents a large breakpoint. This means that the maximum width of the container will be bound by the lg breakpoint's width, which typically is defined (but can be customized) as 1280px. This ensures that on larger screens, the content will not stretch too wide, helping maintain readability and aesthetic layout.
       * By default, the <Container> component centers itself horizontally within its parent.
       * 
       */}

        <Grid 
        container 
        spacing={2}>

          <Grid item xs={12} sm={4}>
            <Typography sx={styles.title} variant='h6' className="hoverScale">
              Quick Links
            </Typography>
            <Box 
              component="ul"   //This prop changes the underlying DOM element for the Box component to be an unordered list. This means the Box will render as a <ul> tag in the HTML
              sx={{ pl: 0, 
                listStyle: 'none', //Removes bullet points from the list, which are default for <ul> elements.
                margin: 0,

              '& li': { //This targets all <li> elements within the styled component
                marginTop: '0.7rem', // Add space below each list item
              }
              }}>
              {quickLinks.map((item, index) => (
                <li key={index}>
                  <Link href={'/' + item.toLowerCase().replace(/\s/g, '')} color={textColor} className="hoverScale" >
                    {item}
                  </Link>
                </li>
              ))}
            </Box>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Typography sx={styles.title} variant='h6' className="hoverScale">
              Contact Us
            </Typography>
            <Typography color={textColor} className="hoverScale" sx={{ marginTop: '0.7rem' }}>
              Email: {email}
            </Typography>
            <Typography color={textColor} className="hoverScale" sx={{ marginTop: '0.7rem' }}>
              Phone: {phone}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Typography sx={styles.title} variant='h6' className="hoverScale">
              Follow Us
            </Typography>
            <Box sx={{ display: 'flex',  alignItems: 'center', gap: '1rem', height: '50px'}}>
              <Link href="#" color={textColor} className="iconHoverScale"><FaFacebook size="24"/></Link>  {/**The destination URL for the link. Here, "#" is used as a placeholder, commonly seen in examples or templates. */}
              <Link href="#" color={textColor} className="iconHoverScale"><FaInstagram size="24"/></Link>
              <Link href="#" color={textColor} className="iconHoverScale"><FaTwitter size="24"/></Link>
              <Link href="#" color={textColor} className="iconHoverScale"><FaLinkedin size="24"/></Link>
            </Box>
          </Grid>
        </Grid>

        <Typography variant="body2" color={textColor} align="center" className="hoverScale" sx={{ mt: 4 }}>  {/**Typogrphy elements can be centered using align */}
          {bottomText}
        </Typography>

      </Container>
    </Box>
  );
}

export default Footer;
