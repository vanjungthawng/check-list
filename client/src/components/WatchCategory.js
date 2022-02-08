import React, { useContext, useEffect, useState } from "react";

import {
  SimpleGrid,
  Text,
  Flex,
  useColorMode,
  PseudoBox,
} from "@chakra-ui/core";

import UserInfoContext from "../utils/UserInfoContext";

import Show from "../components/Show";

function WatchCategory({ category }) {
  const userData = useContext(UserInfoContext);
  const { colorMode } = useColorMode();
  const [categoryShows, setCategoryShows] = useState([]);

  const cateColors = {
    "to watch": "maize",
    watching: "pistachio",
    completed: "tartorange",
  };
  const cate404 = {
    "to watch": `You haven't added any shows you plan to watch!`,
    watching: `You're not watching anything!`,
    completed: `You haven't completed any shows!`,
  };

  useEffect(() => {
    // console.log(category);
    let showArr = [];
    userData.savedShows.forEach((show) => {
      if (show.watchStatus === category) {
        showArr.push(show);
      }
    });
    //console.log(showArr)
    setCategoryShows(showArr);
  }, [userData]);

  return (
    <>
      <Flex paddingTop='6rem' textAlign='center' width='300px' margin='0 auto'>
        {categoryShows.length ? (
          <PseudoBox
            fontWeight='bold'
            textShadow={
              colorMode === "dark" ? "0 0 5px black" : "0 0 5px white"
            }
            fontSize='1.3rem'
          >
            You have {categoryShows.length} show
            {categoryShows.length > 1 ? "s" : ""} marked as{" "}
            <Text textShadow='0px 0px 10px #DB92F6' display='inline'>
              "{category}"
            </Text>
            !{" "}
          </PseudoBox>
        ) : (
          <Text
            textShadow={
              colorMode === "dark" ? "0 0 5px black" : "0 0 5px white"
            }
            fontSize='1.3rem'
          >
            {cate404[category]}
          </Text>
        )}
      </Flex>
      <SimpleGrid
        padding='4rem .5rem 1rem 0.5rem'
        spacing='3rem'
        minChildWidth='300px'
      >
        {categoryShows.map((show) => {
          return (
            <Show
              key={show.tvMazeId}
              show={show}
              cateColor={cateColors[category]}
            />
          );
        })}
      </SimpleGrid>
    </>
  );
}
export default WatchCategory;
