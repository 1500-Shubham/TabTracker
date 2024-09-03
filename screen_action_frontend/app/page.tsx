import Image from "next/image";
import { useEffect } from "react";
import InteractionData from "./interactionData";
import { Stack, HStack, VStack, StackDivider, Box } from '@chakra-ui/react'
export default function Home() {

  return (
<VStack
  divider={<StackDivider borderColor='gray.200' />}
  spacing={4}
  align='stretch'
  w="100%" // Set width to 100% of parent
  h="100%" // Set height to 100% of parent
>
  <Box h='40px' bg='yellow.200'  textAlign="center" fontWeight="bold" fontSize="20px">
  Welcome to Screen Action Recorder
  </Box>
  <Box flex="1">
  <InteractionData/>
  </Box>
</VStack>
  );
}
