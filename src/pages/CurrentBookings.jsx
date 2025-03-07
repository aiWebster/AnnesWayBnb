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

// Remove trailing slash and ensure consistent URL
const API_URL = import.meta.env.VITE_API_URL.replace(/\/$/, '');

const CurrentBookings = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch(`${API_URL}/api/bookings/all`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const bookings = await response.json();
        console.log("Raw bookings data:", bookings);

        // Convert the array of bookings into event objects
        const formattedEvents = bookings.map((booking) => {
          // Create dates in local timezone
          const startDate = new Date(booking.date + 'T00:00:00');
          const endDate = new Date(booking.date + 'T23:59:59');
          
          // Adjust for timezone
          const offset = startDate.getTimezoneOffset();
          startDate.setMinutes(startDate.getMinutes() - offset);
          endDate.setMinutes(endDate.getMinutes() - offset);

          console.log('Dates after timezone adjustment:', {
            original: booking.date,
            adjustedStart: startDate.toISOString(),
            adjustedEnd: endDate.toISOString(),
            localString: startDate.toLocaleDateString()
          });

          return {
            title: booking.name,
            start: startDate,
            end: endDate,
            backgroundColor: '#2C7A7B',
            borderColor: '#2C7A7B',
            allDay: true,
            extendedProps: {
              email: booking.email
            }
          };
        });
        
        console.log("Formatted events:", formattedEvents);
        setEvents(formattedEvents);
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