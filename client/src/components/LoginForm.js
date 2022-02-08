import React, { useState, useContext } from "react";

import {
  Input,
  Stack,
  FormControl,
  Button,
  FormHelperText,
  FormLabel,
  Alert,
  AlertIcon,
  AlertDescription,
  CloseButton,
} from "@chakra-ui/core";

import UserInfoContext from "../utils/UserInfoContext";
import { loginUser } from "../utils/API";
import AuthService from "../utils/auth";

function LoginForm() {
  const [userFormData, setUserFormData] = useState({
    username: "",
    password: "",
  });

  const [showAlert, setShowAlert] = useState(false);
  const [errorText, setErrorText] = useState("");

  const userData = useContext(UserInfoContext);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserFormData({ ...userFormData, [name]: value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    loginUser(userFormData)
      .then(({ data }) => {
        // console.log(data);
        AuthService.login(data.token);
        userData.getUserData();
        //onClose();
      })
      .catch((err) => {
        console.log(err.response);
        setShowAlert(true);
        setErrorText(err.response.data.message);
      });
  };

  return (
    <form onSubmit={handleFormSubmit}>
      {showAlert ? (
        <Alert status='error'>
          <AlertIcon />
          <AlertDescription>
            {errorText || "Something went wrong with your login credentials!"}
          </AlertDescription>
          <CloseButton
            onClick={() => setShowAlert(false)}
            position='absolute'
            right='8px'
            top='8px'
          />
        </Alert>
      ) : (
        ""
      )}

      <Stack spacing={3} my={3}>
        <FormControl isRequired>
          <FormLabel>Username</FormLabel>
          <Input
            name='username'
            placeholder='Username'
            aria-label='username'
            onChange={handleInputChange}
            value={userFormData.username}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Password</FormLabel>
          <Input
            name='password'
            type='password'
            placeholder='Password'
            aria-label='password'
            onChange={handleInputChange}
            value={userFormData.password}
          />
        </FormControl>

        <Button
          type='submit'
          rounded='lg'
          backgroundImage='linear-gradient(315deg, rgba(255,255,255,0) 0%, rgba(254,37,194,0.20211834733893552) 100%)'
        >
          Log in
        </Button>
        <FormHelperText textAlign='center'>Welcome!</FormHelperText>
      </Stack>
    </form>
  );
}

export default LoginForm;
