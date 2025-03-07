import { Box, Heading, Text, VStack } from '@chakra-ui/react';

const Home = () => {
  return (
    <Box position="relative" height="90vh" overflow="hidden">
      {/* Video Background */}
      <Box
        as="video"
        autoPlay
        muted
        loop
        playsInline
        position="absolute"
        top="0"
        left="0"
        width="100%"
        height="100%"
        objectFit="cover"
        zIndex="0"
      >
        <source 
          src="/videos/nztest.mp4"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </Box>

      {/* Overlay */}
      <Box
        position="absolute"
        top="0"
        left="0"
        width="100%"
        height="100%"
        bg="blackAlpha.200"
        zIndex="1"
      />

      {/* Content */}
      <VStack
        position="relative"
        zIndex="2"
        height="100%"
        justify="center"
        spacing={6}
        color="white"
        textAlign="center"
        px={4}
      >
        <Heading size="2xl">
          Welcome Home
        </Heading>
        <Text fontSize="xl" maxW="2xl">
        </Text>
      </VStack>

      {/* Image */}
      <Box
        as="img"
        src="/path/to/image.jpg"
        alt="Description"
        width="100%"
        height="auto"
        objectFit="cover"
        loading="lazy"
      />
    </Box>
  );
};

export default Home;