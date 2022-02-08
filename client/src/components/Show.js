import React, { useContext, useState } from "react";

import { useUpdateEffect } from "react-use";

import {
  Box,
  Image,
  Flex,
  Heading,
  Text,
  Select,
  IconButton,
  PseudoBox,
  Icon,
  Input,
  InputGroup,
  InputRightAddon,
  Stack,
  Checkbox,
  useColorMode,
  useToast,
} from "@chakra-ui/core";

// import context for global state
import UserInfoContext from "../utils/UserInfoContext";
import AuthService from "../utils/auth";

import { deleteShow, updateShow, getShow } from "../utils/API";

function Show({ show }) {
  const layer1Color = {
    dark: "#242423",
    light: "white",
  };
  const toast = useToast();
  const [flipCard, setFlipCard] = useState(false);
  const handleFlip = () => setFlipCard(!flipCard);
  const [watchStatus, setWatchStatus] = useState(show.watchStatus);
  const [episodeState, setEpisodeState] = useState(show.episodes);

  const { colorMode } = useColorMode();
  const userData = useContext(UserInfoContext);

  // checking for watchStatus updates
  useUpdateEffect(() => {
    //check if need to update epis too
    const showStatus = checkSeasonStatus();
    toast({
      title: `Show updated.`,
      description: `${show.title} moved to ${watchStatus}`,
      status: "success",
      position: "bottom-left",
      duration: 9000,
      isClosable: false,
    });

    if (watchStatus === showStatus || watchStatus === "watching") {
      handleUpdateShow();
      return;
    }

    if (watchStatus === "to watch") {
      handleUpdateAll("0");
      return;
    }

    if (watchStatus === "completed") {
      handleUpdateAll("completed");
      return;
    }
  }, [watchStatus]);
  //checking for episodeState updates
  useUpdateEffect(() => {
    const showStatus = checkSeasonStatus();
    //   console.log(showStatus);
    if (watchStatus === showStatus) {
      handleUpdateShow();
      return;
    }

    if (showStatus === "completed") {
      setWatchStatus("completed");
      return;
    }

    if (showStatus === "to watch") {
      setWatchStatus("to watch");
      return;
    }

    if (showStatus === "watching") {
      setWatchStatus("watching");
      return;
    }

    handleUpdateShow();
  }, [episodeState]);

  async function handleUpdateShow() {
    let showToUpdate = await handleRetrieveShow();
    showToUpdate.watchStatus = watchStatus;
    showToUpdate.episodes = episodeState;
    // console.log(showToUpdate);

    // get token
    const token = AuthService.loggedIn() ? AuthService.getToken() : null;

    if (!token) {
      return false;
    }
    updateShow(show.tvMazeId, token, showToUpdate)
      .then(() => {
        userData.getUserData();
      })
      .catch((err) => console.log(err));
  }

  const checkSeasonStatus = () => {
    let watchedCount = 0;
    let unwatchedCount = 0;
    episodeState.forEach((season) => {
      // console.log(season);
      if (season.watchedEpis === 0) {
        unwatchedCount++;
      }
      if (season.watchedEpis == season.seasonEpis) {
        watchedCount++;
      }
    });
    if (watchedCount === episodeState.length) {
      return "completed";
    }
    if (unwatchedCount === episodeState.length) {
      return "to watch";
    }

    return "watching";
  };

  async function handleRetrieveShow() {
    //get & return show obj
    // get token
    const token = AuthService.loggedIn() ? AuthService.getToken() : null;

    if (!token) {
      return false;
    }
    const showObj = await getShow(show.tvMazeId, token)
      .then(({ data }) => {
        //console.log(data.savedShows[0]);
        return data.savedShows[0];
      })
      .catch((err) => console.log(err));

    return showObj;
  }

  async function handleUpdateSeason(season, status) {
    //console.log(season);
    let newSeason = season;
    if (parseInt(status) === 0) {
      newSeason.watchedEpis = 0;
    } else if (status === "completed") {
      newSeason.watchedEpis = season.seasonEpis;
    } else {
      newSeason.watchedEpis = status;
    }

    return newSeason;
  }

  async function handleUpdateOne(season, value) {
    //get show
    let showObj = await handleRetrieveShow();
    let seasonIndex = showObj.episodes.findIndex(
      (seasonObj) => seasonObj.id == season.id
    );

    const updatedSeason = await handleUpdateSeason(season, value);
    // console.log(updatedSeason);

    const epiObj = showObj.episodes;
    epiObj.splice(seasonIndex, 1, updatedSeason);

    setEpisodeState(epiObj);
  }

  async function constructNewEpiObj({ episodes }, newStatus) {
    let epiObj = [];
    // console.log(episodes);
    for (let i = 0; i < episodes.length; i++) {
      let updatedSeason = await handleUpdateSeason(episodes[i], newStatus);
      epiObj.push(updatedSeason);
    }

    return epiObj;
  }

  async function handleUpdateAll(newStatus) {
    //function update all seasons
    // get show
    let showObj = await handleRetrieveShow();
    // console.log(showObj);
    let epiObj = await constructNewEpiObj(showObj, newStatus);
    //  console.log(epiObj);

    //setEpisodeState as new epiObj
    setEpisodeState(epiObj);
  }

  function handleDeleteShow(showId) {
    // get token
    const token = AuthService.loggedIn() ? AuthService.getToken() : null;

    if (!token) {
      return false;
    }

    deleteShow(showId, token)
      .then(() => userData.getUserData())
      .catch((err) => console.log(err));
  }

  async function handleUpdateEpiInput(season, value) {
    let error;
    if (!value || value < 0 || value > season.seasonEpis) {
      //add validation
      error = `there's an error`;
      console.log(error);
      return error;
    }

    const epsWatched = parseInt(value);
    handleUpdateOne(season, epsWatched);
  }

  return (
    <PseudoBox
      className={flipCard ? "flip-container flip" : "flip-container"}
      mx='auto'
    >
      <PseudoBox className='flipper'>
        <Flex
          bg={layer1Color[colorMode]}
          overflow='hidden'
          align='center'
          rounded='lg'
          flexDir='column'
          className='front'
          boxShadow='5px 5px 5px rgba(0, 0, 0, 0.2)'
        >
          <PseudoBox overflow='hidden'>
            <Image
              cursor='pointer'
              onClick={handleFlip}
              width='100%'
              src={show.image}
              alt={`${show.title} cover`}
            />
          </PseudoBox>
          <Flex flexDir='column' p='0 1rem 1rem 1rem' minWidth='100%'>
            <PseudoBox
              onClick={handleFlip}
              cursor='pointer'
              display='flex'
              flexDir='row'
              alignItems='center'
              justifyContent='flex-start'
              marginY='.5rem'
            >
              <Heading as='h4' size='lg'>
                {" "}
                {show.title}{" "}
              </Heading>{" "}
              <Icon marginLeft='.5rem' name='info' />
            </PseudoBox>

            <Select
              backgroundColor={
                colorMode === "dark" ? `orchid.200` : `orchid.400`
              }
              backgroundImage='linear-gradient(315deg, rgba(255,255,255,0) 0%, rgba(254,37,194,0.20211834733893552) 100%)'
              border={colorMode === "dark" ? `orchid.200` : `orchid.400`}
              color={colorMode === "dark" ? `black` : `white`}
              value={watchStatus}
              onChange={(e) => setWatchStatus(e.target.value)}
            >
              <option
                bgimage='linear-gradient(315deg, rgba(255,255,255,0) 0%, rgba(254,37,194,0.20211834733893552) 100%)'
                value='to watch'
              >
                to watch
              </option>
              <option
                bgimage='linear-gradient(315deg, rgba(255,255,255,0) 0%, rgba(254,37,194,0.20211834733893552) 100%)'
                value='watching'
              >
                watching
              </option>
              <option
                bgimage='linear-gradient(315deg, rgba(255,255,255,0) 0%, rgba(254,37,194,0.20211834733893552) 100%)'
                value='completed'
              >
                completed
              </option>
            </Select>
          </Flex>
        </Flex>

        <Flex
          bg={layer1Color[colorMode]}
          bgImage={
            colorMode === "dark"
              ? "linear-gradient(243deg, rgba(255,255,255,0) 0%, rgba(0,0,0,1) 100%)"
              : "linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(147,37,254,0.05) 100%);"
          }
          overflow='hidden'
          align='center'
          rounded='lg'
          flexDir='column'
          className='back'
          boxShadow='5px 5px 5px rgba(0, 0, 0, 0.1)'
        >
          <Flex width='100%' justifyContent='space-between' height='10%'>
            <IconButton
              size='lg'
              variant='ghost'
              variantColor='tartorange'
              aria-label='delete show'
              icon='delete'
              onClick={() => handleDeleteShow(show.tvMazeId)}
            />
            <IconButton
              size='lg'
              variant='ghost'
              aria-label='show card front'
              icon='arrow-back'
              onClick={handleFlip}
            />
          </Flex>
          <Flex
            flexDir='column'
            padding='0 1rem 1rem 1rem'
            width='100%'
            height='90%'
          >
            <Heading as='h4' size='lg'>
              {" "}
              {show.title}{" "}
            </Heading>
            <Text> episodes: </Text>
            <Stack paddingY='.5rem' overflowY='scroll'>
              {episodeState.map((season) => {
                return (
                  <Flex
                    key={season.id}
                    flexDir='row'
                    justifyContent='space-between'
                    paddingX='1rem'
                  >
                    <Box display='flex' width='40%'>
                      <Checkbox
                        isChecked={
                          season.watchedEpis === season.seasonEpis
                            ? true
                            : false
                        }
                        isDisabled={
                          season.watchedEpis === season.seasonEpis
                            ? true
                            : false
                        }
                        onChange={(e) => handleUpdateOne(season, "completed")}
                      >
                        S {season.seasonName}
                      </Checkbox>
                    </Box>

                    <InputGroup key={season.id} size='sm'>
                      <Input
                        rounded='md'
                        roundedRight='0'
                        placeholder={season.watchedEpis}
                        type='number'
                        min='0'
                        max={season.seasonEpis}
                        step='1'
                        width='100%'
                        textAlign='right'
                        paddingRight='.5rem'
                        variant={
                          season.watchedEpis === season.seasonEpis
                            ? "filled"
                            : "flushed"
                        }
                        onBlur={(e) =>
                          handleUpdateEpiInput(season, e.target.value)
                        }
                      />
                      <InputRightAddon
                        children={`/ ${season.seasonEpis}`}
                        color={colorMode === "dark" ? `black` : `white`}
                        backgroundColor={
                          colorMode === "dark" ? `orchid.200` : `orchid.400`
                        }
                        border='none'
                        rounded='md'
                      />
                    </InputGroup>
                  </Flex>
                );
              })}
            </Stack>
          </Flex>
        </Flex>
      </PseudoBox>
    </PseudoBox>
  );
}

export default Show;
