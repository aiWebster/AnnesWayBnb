import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Box, Text, Button, Input, Alert, AlertIcon, Container, VStack } from "@chakra-ui/react";
import { ErrorBoundary } from "react-error-boundary";
import BookingForm from "../components/BookingForm";

const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <Box p={4} bg="red.100" borderRadius="md" textAlign="center">
    <Text fontWeight="bold">Something went wrong:</Text>
    <Text>{error.message}</Text>
    <Button mt={4} colorScheme="teal" onClick={resetErrorBoundary}>
      Try again
    </Button>
  </Box>
);

const Booking = () => {
  return (
    <Container maxW="container.md" centerContent py={8}>
      <VStack spacing={8} width="100%">
        <Box 
          width="100%" 
          bg="white" 
          p={8} 
          borderRadius="lg" 
          shadow="md"
        >
          <BookingForm />
        </Box>
      </VStack>
    </Container>
  );
};

export default Booking;