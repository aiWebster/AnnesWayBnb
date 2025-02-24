import { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  Button,
  Input,
  Textarea,
  Select,
  useToast,
  SimpleGrid,
  Card,
  CardBody,
  CardHeader,
  Stack,
  HStack
} from '@chakra-ui/react';
import axios from 'axios';

const GuestBook = () => {
  const [entries, setEntries] = useState([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(5);
  const toast = useToast();

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/guestbook');
      setEntries(response.data);
    } catch (error) {
      toast({
        title: 'Error fetching entries',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5001/api/guestbook', {
        name,
        message,
        rating: Number(rating)
      });
      
      toast({
        title: 'Entry added successfully!',
        status: 'success',
        duration: 3000,
      });
      
      // Reset form
      setName('');
      setMessage('');
      setRating(5);
      
      // Refresh entries
      fetchEntries();
    } catch (error) {
      toast({
        title: 'Error adding entry',
        status: 'error',
        duration: 3000,
      });
    }
  };

  return (
    <Box p={6}>
      <VStack spacing={8} align="stretch">
        {/* Entry Form */}
        <Box bg="white" p={6} borderRadius="lg" shadow="md">
          <Heading size="lg" mb={4}>Leave a Message</Heading>
          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <Input
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Textarea
                placeholder="Your Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
              <Select
                value={rating}
                onChange={(e) => setRating(e.target.value)}
              >
                {[5, 4, 3, 2, 1].map((num) => (
                  <option key={num} value={num}>
                    {num} Star{num !== 1 ? 's' : ''}
                  </option>
                ))}
              </Select>
              <Button type="submit" colorScheme="teal" width="full">
                Submit
              </Button>
            </VStack>
          </form>
        </Box>

        {/* Entries Display */}
        <Box>
          <Heading size="lg" mb={4}>Guest Messages</Heading>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
            {entries.map((entry) => (
              <Card key={entry._id}>
                <CardHeader>
                  <Stack>
                    <Heading size="md">{entry.name}</Heading>
                    <HStack>
                      {[...Array(entry.rating)].map((_, i) => (
                        <Box key={i} color="yellow.400">★</Box>
                      ))}
                    </HStack>
                  </Stack>
                </CardHeader>
                <CardBody>
                  <Text>{entry.message}</Text>
                  <Text fontSize="sm" color="gray.500" mt={2}>
                    {new Date(entry.date).toLocaleDateString()}
                  </Text>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        </Box>
      </VStack>
    </Box>
  );
};

export default GuestBook; 