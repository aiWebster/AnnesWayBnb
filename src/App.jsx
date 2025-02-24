import { ChakraProvider, Box } from "@chakra-ui/react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Booking from "./pages/Booking";
import CurrentBookings from "./pages/Currentbookings";
import GuestBook from "./pages/GuestBook";
import './styles/styles.css';

function App() {
  return (
    <ChakraProvider>
      <Router>
        <Header />
        <Box p={4}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/currentbookings" element={<CurrentBookings />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/guestbook" element={<GuestBook />} />
          </Routes>
        </Box>
      </Router>
    </ChakraProvider>
  );
}

export default App;