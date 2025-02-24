import { Box, Flex, Heading, Button, Spacer } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const Header = () => (
  <Box bg="teal.600" color="white" p={4} shadow="md">
    <Flex align="center" maxW="1200px" mx="auto" justify="space-between">
      {/* Logo/Brand Name */}
      <Heading size="lg" fontWeight="bold">
        Annes Way Bnb
      </Heading>

      {/* Navigation Buttons */}
      <Flex gap={4}>
        <Link to="/">
          <Button colorScheme="whiteAlpha" variant="outline" size="sm" _hover={{ bg: 'teal.700' }}>
            Home
          </Button>
        </Link>
        <Link to="/currentbookings">
          <Button colorScheme="whiteAlpha" variant="outline" size="sm" _hover={{ bg: 'teal.700' }}>
            Calendar
          </Button>
        </Link>
        <Link to="/booking">
          <Button colorScheme="whiteAlpha" variant="outline" size="sm" _hover={{ bg: 'teal.700' }}>
            Booking
          </Button>
        </Link>
        <Link to="/guestbook">
          <Button colorScheme="whiteAlpha" variant="outline" size="sm" _hover={{ bg: 'teal.700' }}>
            Guest Book
          </Button>
        </Link>
      </Flex>
    </Flex>
  </Box>
);

export default Header;