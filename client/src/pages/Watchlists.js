import React, { useState } from "react";
import {
  Tab,
  TabList,
  Tabs,
  TabPanel,
  TabPanels,
  Menu,
  MenuButton,
  Button,
  MenuList,
  MenuItem,
  useDisclosure,
  useColorMode,
  Modal,
  ModalOverlay,
  ModalContent,
} from "@chakra-ui/core";

import AddShowModal from "../components/AddShowModal";
import WatchCategory from "../components/WatchCategory";

function Watchlists() {
  const [selectedCategory, setSelectedCategory] = useState("watching");
  const { colorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const layer1Color = {
    dark: "#242423",
    light: "white",
  };

  return (
    <>
      <Tabs orientation='vertical' defaultIndex={1}>
        <Menu>
          <MenuButton
            as={Button}
            rightIcon='chevron-down'
            pos='fixed'
            zIndex={3}
            m='.5rem 0 0 .5rem'
          >
            {selectedCategory}
          </MenuButton>
          <Button
            pos='fixed'
            zIndex={3}
            m='.5rem 0 0 9rem'
            onClick={onOpen}
            leftIcon='small-add'
          >
            {" "}
            Add Show{" "}
          </Button>
          <MenuList as={TabList} bg={layer1Color[colorMode]} border='none'>
            <MenuItem as={Tab} onClick={() => setSelectedCategory("to watch")}>
              To Watch
            </MenuItem>
            <MenuItem as={Tab} onClick={() => setSelectedCategory("watching")}>
              Watching
            </MenuItem>
            <MenuItem as={Tab} onClick={() => setSelectedCategory("completed")}>
              Completed
            </MenuItem>
          </MenuList>
        </Menu>
        <TabPanels>
          <TabPanel>
            <WatchCategory category='to watch' />
          </TabPanel>
          <TabPanel>
            <WatchCategory category='watching' />
          </TabPanel>
          <TabPanel>
            <WatchCategory category='completed' />
          </TabPanel>
        </TabPanels>
      </Tabs>

      <Modal
        isOpen={isOpen}
        scrollBehavior='inside'
        onClose={onClose}
        size={{ sm: "100%", md: "90%", xl: "80%" }}
      >
        <ModalOverlay />
        <ModalContent rounded='lg' bg={layer1Color[colorMode]}>
          <AddShowModal />
        </ModalContent>
      </Modal>
    </>
  );
}

export default Watchlists;
