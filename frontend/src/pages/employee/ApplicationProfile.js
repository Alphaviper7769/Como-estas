import React from 'react'
import './ApplicationProfile.css'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import Divider from '@mui/material/Divider';

function Profile() {
  return (
    <div>
        <div className= "splitScreen">
            <div className="leftPane" >
              <div className="profile">
              <Card className='card'>
                <CardActionArea>
                  <CardMedia
                    component="img"
                    height="360"
                    image="https://www.shareicon.net/data/512x512/2016/07/05/791214_man_512x512.png"
                    alt="John Doe"
                    className='img'
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      John Doe
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sagittis eros arcu,
                      at bibendum dui tristique consectetur. Vivamus semper enim quis.
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
              <Typography className='about' variant="h6" mt = {8} > 
                  Email: johndoe69@gmail.com
              </Typography>
              <Divider variant="middle"/>
              <Typography className='about' variant="h6" mt = {1} > 
                  Phone: 8210371121
              </Typography>
              <Divider variant="middle"/>
              <Typography className='about' variant="h6" mt = {1} > 
                  DOB: 09-02-2022
              </Typography>
              <Divider variant="middle"/>
              <Typography className='about' variant="h6" mt = {1} > 
                  Sex: Male
              </Typography>
              <Divider variant="middle" />
              <Typography className='about' variant="h6" mt = {1} > 
                  Resume: <a href="https://youtu.be/dQw4w9WgXcQ">Click Here!</a>
              </Typography>
              </div>
            
            </div>
            <div className='divide'>

            </div>
            <div className="rightPane">
            <div className="profile">
              <Typography className='ques' variant="h2">
                Questions for you!
              </Typography>
              <p className='quesNo' > Question One: </p>
              <textarea
                placeholder="Your Answer here"
                className='quesBox'
              />
              <p className='quesNo' > Question Two: </p>
              <textarea
                placeholder="Your Answer here"
                className='quesBox'
              />
              <p className='quesNo' > Question Three: </p>
              <textarea
                placeholder="Your Answer here"
                className='quesBox'
              />

              
            </div>
            </div>
            
        </div>
    </div>
  )
}

export default Profile