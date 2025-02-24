import { useState, useEffect } from 'react';
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  Box,
  Text,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";

const CurrentBookings = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/bookings/all");
        if (response.ok) {
          const bookings = await response.json();
          console.log("Raw bookings data:", bookings);

          // Convert the array of bookings into event objects
          const formattedEvents = bookings.map((booking) => ({
            title: booking.name,  // Use the name instead of 'Booked'
            start: new Date(booking.date),
            end: new Date(booking.date),
            backgroundColor: '#2C7A7B',
            borderColor: '#2C7A7B',
            allDay: true,
            extendedProps: {
              email: booking.email
            }
          }));
          
          console.log("Formatted events:", formattedEvents);
          setEvents(formattedEvents);
        } else {
          throw new Error(`Failed to fetch bookings: ${response.statusText}`);
        }
      } catch (error) {
        console.error("Fetch error:", error);
        toast({
          title: "Error fetching bookings",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };

    fetchBookings();
  }, [toast]);

  const handleEventClick = (clickInfo) => {
    setSelectedEvent({
      title: clickInfo.event.title,
      start: clickInfo.event.start,
      end: clickInfo.event.end,
      email: clickInfo.event.extendedProps.email
    });
    setIsModalOpen(true);
  };

  return (
    <Box p={6} bg="white" borderRadius="lg" shadow="md">
      <Text fontSize="3xl" fontWeight="bold" mb={6} color="teal.600">
        Booking Calendar
      </Text>
      
      <Box className="calendar-container" bg="white" p={4} borderRadius="lg" shadow="sm">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          eventClick={handleEventClick}
          height="700px"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,dayGridWeek'
          }}
          dayMaxEvents={true}
          eventDisplay="block"
        />
      </Box>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Booking Information</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {selectedEvent && (
              <>
                <Text mb={2}>
                  Guest: {selectedEvent.title}
                </Text>
                <Text mb={2}>
                  Date: {new Date(selectedEvent.start).toLocaleDateString()}
                </Text>
                <Text mb={2}>
                  Email: {selectedEvent.email}
                </Text>
              </>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default CurrentBookings;