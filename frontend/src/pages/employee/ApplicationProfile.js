import React, { useState, useEffect } from 'react';
import './ApplicationProfile.css';

import { useHttp } from '../../components/hooks/http-hook';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import Divider from '@mui/material/Divider';
import LoadingSpinner from '../../components/utils/LoadingSpinner';

function ApplicationProfile() {
  const { loading, httpRequest } = useHttp();
  const [user, setUser] = useState({
    name: '',
    sex: '',
    phone: '',
    email: '',
    dob: '',
    about: '',
    resume: ''
  });
  const [application, setApplication] = useState({
    answers: []
  });
  const [post, setPost] = useState({
    questions: []
  });

  useEffect(() => {
    async function getApplication() {
      const appID = window.location.href.split('/')[5];
      let response;
      try {
        response = await httpRequest(`http://localhost:5000/dashboard/apply/one/${appID}`);
      } catch (err) {}
      setApplication(response.application);
      setUser(response.user);
      setPost(response.post);
    }

    getApplication();
  }, []);

  return (
    <>
      {!loading && <div>
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
                        {user.name || '---'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {user.about || '---'}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
                <Typography className='about' variant="h6" mt = {8} > 
                    Email: {user.email || ''}
                </Typography>
                <Divider variant="middle"/>
                <Typography className='about' variant="h6" mt = {1} > 
                    Phone: {user.phone || '---'}
                </Typography>
                <Divider variant="middle"/>
                <Typography className='about' variant="h6" mt = {1} > 
                    DOB: {user.dob || '---'}
                </Typography>
                <Divider variant="middle"/>
                <Typography className='about' variant="h6" mt = {1} > 
                    Sex: {user.sex || '---'}
                </Typography>
                <Divider variant="middle" />
                <Typography className='about' variant="h6" mt = {1} > 
                    Resume: <a style={{ color: 'blue' }} href={user.resume || ''}>Click Here!</a>
                </Typography>
                </div>
              
              </div>
              <div className='divide'>

              </div>
              <div className="rightPane">
              <div className="profile">
              <Typography className='ques' variant="h2">
                  Answers
                </Typography>
                {application.answers.length > 0 && application.answers.map((answer, index) => {
                  return (<>  
                    <p className='quesNo' > Question {index+1}: {post.questions[index]} </p>
                    <div className='Box'>
                      {answer}
                    </div>
                  </>);
                })}
              </div>
              </div>
              
          </div>
      </div>}
      {loading && <LoadingSpinner />}
    </>
  );
}

export default ApplicationProfile;