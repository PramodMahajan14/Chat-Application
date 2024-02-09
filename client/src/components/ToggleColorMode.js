import { useState } from "react";
import { SunIcon, MoonIcon } from "@chakra-ui/icons";
import { useColorMode } from "@chakra-ui/color-mode";
import { Button } from "@chakra-ui/button";
const ToggleColorMode = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <>
      <Button
        onClick={() => toggleColorMode()}
        pos="absolute"
        top="0"
        right="0"
        m="1 rem"
      >
        {colorMode === "dark" ? <SunIcon color="orange.500" /> : <MoonIcon color="blue.700" />}
      </Button>
    </>
  );
};
export default ToggleColorMode;
