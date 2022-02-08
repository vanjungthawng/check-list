import React from "react";
import {
  Flex,
  Heading,
  Text,
  useColorMode,
  Tabs,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
} from "@chakra-ui/core";
import SignUpForm from "../components/SignupForm";
import LogInForm from "../components/LoginForm";

function Welcome() {
  const { colorMode } = useColorMode();
  const layer1Color = {
    dark: "#242423",
    light: "white",
  };

  return (
    <>
      <Flex paddingTop='5rem' alignItems='center' flexDir='column'>
        <Heading
          size='2xl'
          as='h1'
          textAlign='center'
          textShadow={colorMode === "dark" ? "0 0 5px black" : "0 0 5px white"}
        >
          <Text
            fontFamily='mono'
            display='inline'
            color='light'
            fontWeight='bold'
          >
            Check-list
          </Text>{" "}
        </Heading>

        <Text
          margin='0 auto'
          maxWidth='30rem'
          textAlign='center'
          textShadow={colorMode === "dark" ? "0 0 5px black" : "0 0 5px white"}
          fontWeight='bold'
        >
          A place where you can record your current watch status!
        </Text>

        <Flex
          margin='2rem auto'
          bg={layer1Color[colorMode]}
          bgImage={
            colorMode === "dark"
              ? "linear-gradient(243deg, rgba(255,255,255,0) 0%, rgba(0,0,0,1) 100%)"
              : "linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(147,37,254,0.05) 100%);"
          }
          padding='1rem'
          rounded='lg'
          boxShadow='5px 5px 5px rgba(0, 0, 0, 0.1)'
        >
          <Tabs isFitted variant='soft-rounded' variantColor='orchid'>
            <TabList>
              <Tab>Log In</Tab>
              <Tab>Sign up</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <LogInForm />
              </TabPanel>
              <TabPanel>
                <SignUpForm />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Flex>
      </Flex>
    </>
  );
}

export default Welcome;
