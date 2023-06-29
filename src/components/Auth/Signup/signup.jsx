import React,{useState} from 'react';
import {Button,Form,Grid,Header,Message,Segment} from 'semantic-ui-react'
import "../auth.css"
import {auth,createUserWithEmailAndPassword,updateProfile,ref,database,set} from '../../../server/firebase';
import {Link} from 'react-router-dom';

function Signup() {
    let user={
        userName: '',
        email: '',
        password: '',
        confirmpassword: ''
    }
    const [userState,setuserState]=useState(user);

    let errors=[];
    const [errorState,seterrorState]=useState(errors);

    const [isLoading,setIsLoading]=useState(false);
    const [isSuccess,setIsSuccess]=useState(false);

    const handleInput=(event) => {
        let target=event.target;
        setuserState((currentState)=>{
            let currentuser={...currentState};
            currentuser[target.name]=target.value;
            return currentuser;
        })
    }
    const checkForm = () => {
        if(isFormEmpty()) 
        {
            seterrorState((error)=>error.concat({message:"Fields cannot be empty!"}));
            return false;
        }
        else if(!checkPassword()) {
            return false;
        }
        return true;
    }

    const isFormEmpty = () => {
        return !userState.userName.length || 
        !userState.email.length ||
        !userState.password.length ||
        !userState.confirmpassword.length;
        
    }
    const checkPassword = () => {
        if(userState.password.length<8) 
        {
            seterrorState((error)=>error.concat({message:"Password length cannot be less than 8!"}));
            return false;
        }
        else if(userState.password!==userState.confirmpassword) 
        {
            seterrorState((error)=>error.concat({message:"Passwords do not match!"}));
            return false;
        }
        return true;
    }
    const onSubmit = (event) => 
    {
        seterrorState(() => []);
        setIsSuccess(false);
        if(checkForm()) {
            setIsLoading(true);
            createUserWithEmailAndPassword(auth,userState.email, userState.password)
                .then(createdUser => {
                    setIsLoading(false);
                    updateuserDetails(createdUser)
                })
                .catch(serverError => {
                    setIsLoading(false);
                    if(serverError.code==='auth/email-already-in-use'){
                        seterrorState((error) => error.concat({message:"Email already in use!"}));
                    }
                })
        }
    }

    const updateuserDetails = (createdUser) => {
        if(createdUser) {
            setIsLoading(true);
            updateProfile(createdUser.user,{
                    displayName: userState.userName,
                    photoURL: `http://gravatar.com/avatar/${createdUser.user.uid}?d=identicon`
                })
                .then(() => {
                    setIsLoading(false);
                    saveUserInDB(createdUser);
                })
                .catch((serverError) => {
                    setIsLoading(false);
                    seterrorState((error)=>error.concat(serverError));
                })
        }
    }

    const saveUserInDB = (createdUser) => {
        setIsLoading(true);
        set(ref(database,'users/'+createdUser.user.uid),{
            displayName: createdUser.user.displayName,
            photoURL: createdUser.user.photoURL
        })
            .then(() => {
                setIsLoading(false);
                setIsSuccess(true);
            })
            .catch(serverError => {
                setIsLoading(false);
                seterrorState((error) => error.concat(serverError));
            })
    }

    const formaterrors = () => 
    {
        return errorState.map((error,index)=><p key={index}>{error.message}</p>)
    }

  return (
    <Grid verticalAlign='middle' textAlign='center' className='grid-form'>
        <Grid.Column style={{ maxWidth: '500px' }}>
            <Header icon as="h1" style={{color:"#adefd1ff" }}>
                Talkative
            </Header>
            <br/>
            <Header inverted as="h2" style={{ padding: '10px'}}>
                Sign Up
            </Header>
            <Form onSubmit={onSubmit} >
                <Segment stacked>
                    <Form.Input 
                        name="userName"
                        value={userState.userName}
                        icon="user"
                        iconPosition="left"
                        onChange={handleInput}
                        type="text"
                        placeholder="User Name"
                    />
                    <Form.Input 
                        name="email"
                        value={userState.email}
                        icon="mail"
                        iconPosition="left"
                        onChange={handleInput}
                        type="email"
                        placeholder="Email"
                    />
                    <Form.Input 
                        name="password"
                        value={userState.password}
                        icon="lock"
                        iconPosition="left"
                        onChange={handleInput}
                        type="password"
                        placeholder="Password"
                    />
                    <Form.Input 
                        name="confirmpassword"
                        value={userState.confirmpassword}
                        icon="lock"
                        iconPosition="left"
                        onChange={handleInput}
                        type="password"
                        placeholder="Confirm Password"
                    />
                </Segment>
                <Button disabled={isLoading} loading={isLoading} basic color='teal'>Submit</Button>
            </Form>
            <p className='already'>
                Already an User? <Link to="/login" className='l' >Login </Link>
            </p>
            {errorState.length>0 && <Message error>
                <h3>{formaterrors()}</h3>
            </Message>
            }
            {isSuccess && <Message success>
                <h3>Registered Successfully</h3>
            </Message>
            }
        </Grid.Column>

    </Grid>
  )
}

export default Signup
