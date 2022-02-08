import React, { useState, useContext } from "react";

import {
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Input,
  Stack,
  IconButton,
  SimpleGrid,
  Flex,
  Heading,
  Text,
  Box,
  Image,
  AspectRatioBox,
  Select,
  Button,
  useColorMode,
  Spinner,
} from "@chakra-ui/core";

import UserInfoContext from "../utils/UserInfoContext";
import AuthService from "../utils/auth";

import { searchTvMaze, getSeasons, getEpisodes, saveShow } from "../utils/API";

function AddShowModal() {
  const [searchedShows, setSearchedShows] = useState([]);

  const [searchInput, setSearchInput] = useState("");

  const userData = useContext(UserInfoContext);
  const { colorMode } = useColorMode();
  const layer1Color = {
    dark: "#242423",
    light: "#EFEFF0",
  };
  const layer2Color = {
    dark: "#333533",
    light: "white",
  };

  function returnSummary(summary) {
    return { __html: summary };
  }

  const handleFormSubmit = (event) => {
    event.preventDefault();

    if (!searchInput) {
      return false;
    }

    searchTvMaze(searchInput)
      .then(({ data }) => {
        //console.log(data);
        const showData = data.map(({ show }) => ({
          tvMazeId: show.id,
          title: show.name,
          summary: show.summary,
          image:
            show.image?.original ||
            `https://via.placeholder.com/680x1000?text=No+Image`,
          watchStatus: "to watch",
          loading: false,
        }));

        return setSearchedShows(showData);
      })
      .catch((err) => console.log(err));
  };

  const stageWatchStatus = (status, showId) => {
    const showToEffect = searchedShows.find((show) => show.tvMazeId == showId);
    // console.log(showToEffect);
    showToEffect.watchStatus = status;
  };

  async function formatEpis(season) {
    if (!season.episodeOrder) {
      let episodesRes = await getEpisodes(season.id);
      //console.log(episodesRes.data);
      let seasonEpis = episodesRes.data.length;
      return seasonEpis;
    } else {
      let seasonEpis = season.episodeOrder;
      return seasonEpis;
    }
  }

  async function formatSeason(season, status) {
    //console.log(status);
    let formattedSeason = {
      id: season.id,
      seasonName: season.number,
      seasonEpis: await formatEpis(season),
    };
    //console.log(formattedSeason);

    if (status === "completed") {
      formattedSeason.watchedEpis = formattedSeason.seasonEpis;
    }
    if (status === "to watch" || status === "watching") {
      formattedSeason.watchedEpis = 0;
    }
    if (status === "watching" && formattedSeason.seasonName === 1) {
      formattedSeason.watchedEpis = 1;
    }
    //console.log(formattedSeason);

    if (!formattedSeason.seasonEpis) {
      throw new Error("no episodes");
    }
    return formattedSeason;
  }

  async function populateSeasons(showToSave, seasonData) {
    for (let i = 0; i < seasonData.length; i++) {
      try {
        const formattedSeason = await formatSeason(
          seasonData[i],
          showToSave.watchStatus
        );
        showToSave.episodes.push(formattedSeason);
      } catch (err) {
        console.log(err);
      }
    }
    //console.log(showToSave);
    return showToSave;
  }

  async function handleSaveShow(showId) {
    let showToFormat = searchedShows.find((show) => show.tvMazeId == showId);
    showToFormat.loading = true;
    //searchedShows.splice(showToSave);
    //console.log(searchedShows);

    // get token
    const token = AuthService.loggedIn() ? AuthService.getToken() : null;

    if (!token) {
      return false;
    }

    showToFormat.episodes = [];

    let { data: seasonData } = await getSeasons(showId);
    let showToSave = await populateSeasons(showToFormat, seasonData);
    // .then(() => console.log(showToSave))
    //console.log(showToSave);

    saveShow(showToSave, token)
      .then(() => {
        showToFormat.loading = false;
        userData.getUserData();
      })
      .catch((err) => console.log(err));
  }

  return (
    <>
      <ModalHeader bg={layer1Color[colorMode]} roundedTop='lg'>
        <Heading as='h6'>Search for a Show to Add!</Heading>
        <form onSubmit={handleFormSubmit}>
          <Stack display='flex' flexDir='row'>
            <Input
              placeholder='Search by show name...'
              variant='outline'
              name='searchInput'
              variantColor='white'
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />

            <IconButton
              type='submit'
              aria-label='search for show'
              icon='search'
              variantColor='orchid'
            />
          </Stack>
        </form>
        <ModalCloseButton />
      </ModalHeader>
      <ModalBody
        bg={layer1Color[colorMode]}
        bgImage={
          colorMode === "dark"
            ? "linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(0,0,0,.5) 100%)"
            : "linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(147,37,254,0.05) 100%);"
        }
        roundedBottom='lg'
      >
        <SimpleGrid columns={{ sm: "1", xl: "2" }} spacing='1.5rem'>
          {searchInput || searchedShows ? (
            <>
              {searchedShows.map((show) => {
                return (
                  <Box
                    bg={layer2Color[colorMode]}
                    key={show.tvMazeId}
                    p='1rem'
                    display={{ md: "flex" }}
                    margin='auto'
                    shadow='sm'
                    margin='0'
                    rounded='lg'
                    boxShadow='5px 5px 5px rgba(0, 0, 0, 0.1)'
                  >
                    <Flex flexDir='column' minWidth={{ sm: "40%", xl: "50%" }}>
                      <AspectRatioBox
                        ratio={3 / 4}
                        maxWidth={{ xl: "60%" }}
                        margin='0 20%'
                      >
                        <Image
                          src={`${show.image}`}
                          alt={`${show.title}`}
                          rounded='lg'
                        />
                      </AspectRatioBox>

                      <Heading
                        as='h4'
                        size='lg'
                        alignSelf='center'
                        marginY='1rem'
                      >
                        {show.title}
                      </Heading>

                      <Select
                        disabled={userData.savedShows?.some(
                          (savedShow) => savedShow.tvMazeId == show.tvMazeId
                        )}
                        backgroundColor={layer1Color[colorMode]}
                        defaultValue={show.watchStatus}
                        onChange={(e) =>
                          stageWatchStatus(e.target.value, show.tvMazeId)
                        }
                      >
                        <option value='to watch'>to watch</option>
                        <option value='watching'>watching</option>
                        <option value='completed'>completed</option>
                      </Select>
                      <Button
                        leftIcon={
                          userData.savedShows?.some(
                            (savedShow) => savedShow.tvMazeId == show.tvMazeId
                          )
                            ? "check"
                            : "add"
                        }
                        variantColor='orchid'
                        backgroundImage='linear-gradient(315deg, rgba(255,255,255,0) 0%, rgba(254,37,194,0.20211834733893552) 100%)'
                        onClick={() => handleSaveShow(show.tvMazeId)}
                        disabled={userData.savedShows?.some(
                          (savedShow) => savedShow.tvMazeId == show.tvMazeId
                        )}
                      >
                        {show.loading ? (
                          <Spinner />
                        ) : (
                          <>
                            {userData.savedShows?.some(
                              (savedShow) => savedShow.tvMazeId == show.tvMazeId
                            )
                              ? "Already on list! "
                              : "Add to list!! "}
                          </>
                        )}
                      </Button>
                    </Flex>
                    <Box
                      justifyContent='center'
                      paddingLeft={{ md: "1rem" }}
                      paddingTop={{ sm: "1rem", md: "0" }}
                    >
                      <Text
                        margin='auto'
                        dangerouslySetInnerHTML={returnSummary(show.summary)}
                      ></Text>
                    </Box>
                  </Box>
                );
              })}
            </>
          ) : (
            <Heading as='h3' size='lg' alignSelf='center'>
              Search for a show to add!
            </Heading>
          )}
        </SimpleGrid>
      </ModalBody>
    </>
  );
}

export default AddShowModal;
