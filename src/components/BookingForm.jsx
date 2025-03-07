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
  Center,
  useToast
} from "@chakra-ui/react";

// Remove trailing slash and ensure consistent URL
const API_URL = import.meta.env.VITE_API_URL.replace(/\/$/, '');

const BookingForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [overlappingDates, setOverlappingDates] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const handleBooking = async () => {
    setIsSubmitting(true);
    try {
      // Create dates at midnight in local timezone
      const adjustedStartDate = new Date(startDate);
      adjustedStartDate.setHours(0, 0, 0, 0);
      
      const adjustedEndDate = new Date(endDate);
      adjustedEndDate.setHours(23, 59, 59, 999);

      // Adjust for timezone
      const offset = adjustedStartDate.getTimezoneOffset();
      adjustedStartDate.setMinutes(adjustedStartDate.getMinutes() - offset);
      adjustedEndDate.setMinutes(adjustedEndDate.getMinutes() - offset);

      const response = await fetch(`${API_URL}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          startDate: adjustedStartDate.toISOString(),
          endDate: adjustedEndDate.toISOString()
        })
      });

      const data = await response.json();

      if (response.status === 409) {
        // Handle overlapping bookings
        const formattedDates = data.existingBookings.map(booking => ({
          startDate: new Date(booking.startDate),
          endDate: new Date(booking.endDate)
        }));
        setOverlappingDates(formattedDates);
        setShowAlert(true);
      } else if (response.ok) {
        // Booking successful
        toast({
          title: "Booking successful!",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        // Reset form
        setName('');
        setEmail('');
        setStartDate(null);
        setEndDate(null);
      } else {
        throw new Error(data.message || 'Failed to create booking');
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error creating booking",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmBooking = async () => {
    try {
      const adjustedStartDate = new Date(startDate);
      adjustedStartDate.setHours(0, 0, 0, 0);
      
      const adjustedEndDate = new Date(endDate);
      adjustedEndDate.setHours(23, 59, 59, 999);

      // Adjust for timezone
      const offset = adjustedStartDate.getTimezoneOffset();
      adjustedStartDate.setMinutes(adjustedStartDate.getMinutes() - offset);
      adjustedEndDate.setMinutes(adjustedEndDate.getMinutes() - offset);

      const response = await fetch(`${API_URL}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          startDate: adjustedStartDate.toISOString(),
          endDate: adjustedEndDate.toISOString(),
          forceBook: true  // Ensure this flag is sent
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Booking confirmed!",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        setShowAlert(false);
        // Reset form
        setName('');
        setEmail('');
        setStartDate(null);
        setEndDate(null);
      } else {
        throw new Error(data.message || 'Failed to create booking');
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error confirming booking",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Center>
      <VStack spacing={6} width="100%" maxW="500px" align="center">
        <Heading size="lg" mb={4}>Book Your Stay</Heading>
        
        <Box width={{ base: "100%", md: "80%", lg: "60%" }} p={4}>
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
                    These dates overlap with existing bookings:{" "}
                    <Text as="span" fontWeight="bold">
                      {overlappingDates.map((booking) => (
                        `${new Date(booking.startDate).toLocaleDateString()} - ${new Date(booking.endDate).toLocaleDateString()}`
                      )).join(" | ")}
                    </Text>
                  </Text>
                  <Text mt={2}>Would you like to book these dates anyway?</Text>
                  <Button colorScheme="teal" mt={2} mr={2} onClick={handleConfirmBooking}>
                    Yes, Book Anyway
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
              size="lg"
            >
              Confirm Booking
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Center>
  );
};

export default BookingForm; 