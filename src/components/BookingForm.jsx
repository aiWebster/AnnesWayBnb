import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { 
  Box, 
  Text, 
  Button, 
  Input, 
  Alert, 
  AlertIcon, 
  VStack,
  Heading,
  Center
} from "@chakra-ui/react";

const BookingForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [overlappingDates, setOverlappingDates] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBooking = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch('http://localhost:5001/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          startDate,
          endDate
        })
      });

      const data = await response.json();

      if (response.status === 409) {
        setOverlappingDates(data.existingBookings);
        setShowAlert(true);
      } else if (!response.ok) {
        throw new Error(data.message || 'Failed to create booking');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmBooking = async () => {
    setShowAlert(false);
  };

  return (
    <Center>
      <VStack spacing={6} width="100%" maxW="500px" align="center">
        <Heading size="lg" mb={4}>Book Your Stay</Heading>
        
        <VStack spacing={4} width="100%">
          <Box width="100%">
            <Text mb={2}>Name:</Text>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              width="100%"
            />
          </Box>

          <Box width="100%">
            <Text mb={2}>Email:</Text>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              width="100%"
            />
          </Box>

          {showAlert && (
            <Alert status="warning">
              <AlertIcon />
              <Box>
                <Text>
                  Some of the selected dates overlap with existing bookings:{" "}
                  <Text as="span" fontWeight="bold">
                    {overlappingDates.map((date) => date.toDateString()).join(" | ")}
                  </Text>
                </Text>
                <Text mt={2}>Are you sure you want to proceed with double booking?</Text>
                <Button colorScheme="teal" mt={2} mr={2} onClick={handleConfirmBooking}>
                  Confirm Booking
                </Button>
                <Button colorScheme="red" mt={2} onClick={() => setShowAlert(false)}>
                  Cancel
                </Button>
              </Box>
            </Alert>
          )}

          <Box width="100%">
            <Text mb={2}>Select Start Date:</Text>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              placeholderText="Choose a start date"
              className="date-picker-custom"
            />
          </Box>

          <Box width="100%">
            <Text mb={2}>Select End Date:</Text>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              placeholderText="Choose an end date"
              className="date-picker-custom"
            />
          </Box>

          <Button 
            colorScheme="teal" 
            onClick={handleBooking} 
            isLoading={isSubmitting}
            width="100%"
          >
            Confirm Booking
          </Button>
        </VStack>
      </VStack>
    </Center>
  );
};

export default BookingForm; 