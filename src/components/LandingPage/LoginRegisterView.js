import React, { useState } from 'react';

//MUI
import { Tab, Tabs } from '@mui/material';

//components
import Login from './Login.js';
import Register from './Register.js';

function LoginRegisterView({setAuth, setUserType, setUserID, setIsLoading, type}) {
    
    //Tab functionalities
    const [tabValue, setTabValue] = useState(0); // 0 for login, 1 for register

    const handleTabChange = (event, newValue) => {
      setTabValue(newValue);
    };

    const styles={
        tabStyle:{
            color: 'black', 
            fontWeight: 'bold',
            width: '50%',
            backgroundColor:'#f9fae6', 
        }
    }

    return (
        <div style={{
            height: '100%', 
            width: '50%', 
            border: '5px solid black', 
            borderRadius: '30px', 
            overflow: 'hidden',
            display: 'flex',
        }}>
            <div style={{    //this dummy div is used so that the inner components occupy all the space inside the outer div
                display: 'flex', 
                flex: 1,
                flexDirection: 'column', 
            }}>
                <div style={{width: '100%'}}>
                    <Tabs 
                      value={tabValue} 
                      onChange={handleTabChange} 
                      centered   //ensures that the tabs are centered horizontally within the <Tabs> component's available width. Without the centered property, the tabs are aligned to the left by default. 
                      sx={{
                        width: '100%',
                        '.MuiTabs-indicator': {
                          backgroundColor: '#c2c006', // Change indicator color
                        },
                        '.MuiTab-root': {
                          '&.Mui-selected': {
                            color: 'black', // Change text color when selected
                            backgroundColor: '#f7f6ab', // Change background color when selected
                            outline: 'none', // Removes outline
                          }
                        }
                      }}
                    >
                        <Tab label="Login" sx={
                            styles.tabStyle
                            // '&.Mui-selected': {
                            //     backgroundColor: 'lightgreen',  //the color when selected can be set here manually too
                            // }
                        } />
                        <Tab label="Register" sx={
                            styles.tabStyle 
                            // '&.Mui-selected': {
                            //     backgroundColor: 'lightgreen',
                            // }
                        } />
                    </Tabs>
                </div>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flex: 1,
                    backgroundColor: 'rgba(164, 198, 252, 0.34)',
                }}>
                    {/* Content based on selected tab */}
                    {tabValue === 0 && <Login setAuth={setAuth} setUserType={setUserType} setUserID={setUserID} setIsLoading={setIsLoading} type={type}/>}
                    {tabValue === 1 && <Register setAuth={setAuth} setUserType={setUserType} setUserID={setUserID} setIsLoading={setIsLoading} type={type}/>}
                </div>
            </div>
        </div>
    );
}

export default LoginRegisterView;
