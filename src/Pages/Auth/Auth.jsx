import React, { useState } from 'react';
import axios from 'axios';
import main from '../../Images/main.png';
import './Auth.css';
import { useNavigate } from 'react-router-dom';
import {Formik,Form,Field} from 'formik'
import * as Yup from 'yup'; // Import Yup for validation

const Auth = () => {
  const navigation = useNavigate()
 

const initialValues={
  username:"",
  email:"",
  password:"",

}
const validationSchema = Yup.object().shape({
  username: Yup.string(),
  email: Yup.string().email('Invalid email address').required('Required'),
  password: Yup.string().required('Required'),
});

  const [isSignUp, setIsSignUp] = useState(true);
  const [data, setData] = useState(initialValues);
  const [confirmPass, setConfirmPass] = useState(true);
 


  const handleRegistration = async (values, { setSubmitting }) => {
    try {
      await axios.post('https://communifyserver.mrzera.in/api/register', {
        username: values.username,
        email: values.email,
        password: values.password,
      });
      alert('Registration success');
      navigation('/'); // Redirect to home or wherever you want
    } catch (err) {
      console.error('Registration failed', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogin = async (values, { setSubmitting }) => {
    try {
      const response = await axios.post(
        'https://communifyserver.mrzera.in/api/login',
        {
          email: values.email,
          password: values.password,
        }
      );




      const { adminemail, token } = response.data;
      if (adminemail) {
        localStorage.setItem('adminAuthToken', token);
        navigation('/Admin');
      } else {
        localStorage.setItem('authToken', token);
        console.log('Login success');
        navigation('/');
        location.reload();
      }
    } catch (error) {
      console.error('Login failed', error);
    } finally {
      setSubmitting(false);
    }
  };


  const resetForm = () => {
    setData(initialValues);
    setConfirmPass(true);
  };

  return (


    <div className="Auth">
      <div className="a-left">
        <img src={main} alt="" />
        <div className="Webname">
          <h1>Communify</h1>
          <h6>Explore the ideas throughout the world</h6>
        </div>
      </div>




      <div className="a-right">
      <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting }) => {
            if (isSignUp) {
              handleRegistration(values, { setSubmitting });
            } else {
              handleLogin(values, { setSubmitting });
            }
          }}
        >
  {({errors,isSubmitting})=>(
 <Form className="infoForm authForm" >
 <h3>{isSignUp ? 'Register' : 'Login'}</h3>

 {isSignUp && (
   <div>
   <Field type="text"  name="username" className="infoInput"></Field>
<br />
{errors.username && <small>{errors.username}</small> }


   </div>
 )}

 <div>
 <Field type="text"  name="email" className="infoInput"></Field>
   <br />
   {errors.email && <small>{errors.email}</small> }

 </div>

 <div>
 <Field type="password"  name="password" className="infoInput"></Field>
   <br />
   {errors.password && <small>{errors.password}</small> }
 </div>

 {/* <span
   style={{
     color: 'red',
     fontSize: '12px',
     alignSelf: 'flex-end',
     marginRight: '5px',
  
   }}
 >
   *Confirm password is not the same
 </span> */}

 <div>
   <span
     style={{
       fontSize: '12px',
       cursor: 'pointer',
       textDecoration: 'underline',
     }}
     onClick={() => {
       resetForm();
       setIsSignUp((prev) => !prev);
     }}
   >
     {isSignUp ? 'Already have an account Login' : "Don't have an account Sign up"}
   </span>
   <button className="button infoButton" type="submit" disabled={isSubmitting}>
    

     {isSignUp ? 'Signup' : 'Log in'}
   </button>
 </div>
</Form>
  )}
 
       
        </Formik>
      </div>
    </div>
  );
};

export default Auth
