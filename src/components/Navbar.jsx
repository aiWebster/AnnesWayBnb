import { Box, Flex, Link as ChakraLink, Stack, IconButton, useDisclosure } from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Box bg="teal.500" px={4} position="sticky" top="0" zIndex="sticky">
      <Flex h={16} alignItems="center" justifyContent="space-between">
        {/* Logo/Home link */}
        <ChakraLink as={Link} to="/" fontSize="xl" fontWeight="bold" color="white">
          Anne's Way
        </ChakraLink>

        {/* Mobile menu button */}
        <IconButton
          display={{ base: 'flex', md: 'none' }}
          onClick={onToggle}
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          variant="ghost"
          color="white"
          aria-label="Toggle Navigation"
        />

        {/* Desktop Navigation */}
        <Stack
          direction={{ base: 'column', md: 'row' }}
          display={{ base: 'none', md: 'flex' }}
          spacing={4}
        >
          <NavLink to="/booking">Book Now</NavLink>
          <NavLink to="/current-bookings">Calendar</NavLink>
          <NavLink to="/guestbook">Guest Book</NavLink>
        </Stack>
      </Flex>

      {/* Mobile Navigation */}
      <Box
        display={{ base: isOpen ? 'block' : 'none', md: 'none' }}
        pb={4}
      >
        <Stack spacing={4}>
          <NavLink to="/booking" mobile>Book Now</NavLink>
          <NavLink to="/current-bookings" mobile>Calendar</NavLink>
          <NavLink to="/guestbook" mobile>Guest Book</NavLink>
        </Stack>
      </Box>
    </Box>
  );
};

// NavLink component for consistent styling
const NavLink = ({ to, children, mobile }) => (
  <ChakraLink
    as={Link}
    to={to}
    px={2}
    py={mobile ? 2 : 1}
    rounded="md"
    color="white"
    _hover={{
      textDecoration: 'none',
      bg: 'teal.600',
    }}
    w={mobile ? "full" : "auto"}
    textAlign={mobile ? "center" : "left"}
  >
    {children}
  </ChakraLink>
);

export default Navbar; 