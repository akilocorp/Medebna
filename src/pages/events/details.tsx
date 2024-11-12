// Import necessary libraries and components
import Head from "next/head";
import Link from "next/link";

import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { IoChevronBack } from "react-icons/io5";
import { useTheme, Direction } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Button, Container, Paper } from "@mui/material";
import {
  FaCalendarAlt,
  FaRegCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaTicketAlt,
  FaInfoCircle,
  FaConciergeBell,
  FaUserFriends,
  FaHandHoldingHeart,
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
} from "react-icons/fa";
import CartIcon from "@/components/carticon";
import { getAllEvent } from "@/stores/operator/ApiCallerOperatorEvent";
import { fetchEventOwnerProfile } from "@/stores/operator/eventprofileapicaller";
import { addEventToCart, getSessionId } from "@/stores/cart/carapicaller";
import { useSwipeable } from "react-swipeable";
import { motion } from "framer-motion";

// Define event categories (if needed elsewhere)
const eventCategories = {
  event_Details: [
    { icon: FaCalendarAlt, text: "Event Date" },
    { icon: FaClock, text: "Event Time" },
    { icon: FaMapMarkerAlt, text: "Location" },
  ],
  ticket_Info: [
    { icon: FaTicketAlt, text: "Ticket Price" },
    { icon: FaUserFriends, text: "Attendees" },
    { icon: FaConciergeBell, text: "Services Included" },
  ],
  additional_Info: [
    { icon: FaInfoCircle, text: "Additional Information" },
    { icon: FaHandHoldingHeart, text: "Health & Safety" },
  ],
};

// Interface for TabPanel
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
  dir?: Direction;
}

// TabPanel Component
function TabPanel(props: TabPanelProps) {
  const { children, value, index, dir, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }} dir={dir}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

// Accessibility props for tabs
function a11yProps(index: number) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

// Main Component
export default function EventDetailsPage() {
  const router = useRouter();
  const { eventCompanyId, eventCompanyName } = router.query;

  // State variables
  const [eventsData, setEventsData] = useState<any[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [eventOwnerProfile, setEventOwnerProfile] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ticketCount, setTicketCount] = useState(1);
  const [selectedTicketType, setSelectedTicketType] = useState("");
  const [value, setValue] = useState(0);
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  // Initialize swipe handlers
  const handlers = useSwipeable({
    onSwipedLeft: () => handleChange(null, value + 1),
    onSwipedRight: () => handleChange(null, value - 1),
    preventDefaultTouchmoveEvent: false, // You can also set this to false if needed
    trackMouse: true,
  });

  // Effect to fetch data on mount or when eventCompanyId changes
  useEffect(() => {
    setIsMounted(true);

    if (eventCompanyId) {
      fetchEventDetailsData(eventCompanyId as string);
      fetchEventOwnerProfileData(eventCompanyId as string);
    }
  }, [eventCompanyId]);

  // Fetch event details
  const fetchEventDetailsData = async (id: string) => {
    try {
      const response = await getAllEvent(id);
      if (response && response.length > 0) {
        setEventsData(response);
        setFilteredEvents(response);
      } else {
       
      }
    } catch (error) {
      
    }
  };

  // Fetch event owner profile
  const fetchEventOwnerProfileData = async (id: string) => {
    try {
      const profile = await fetchEventOwnerProfile(id);
      if (profile) {
        setEventOwnerProfile(profile);
      }
    } catch (error) {
     
    }
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchTerm(searchValue);

    const filtered = eventsData.filter((event: any) => {
      const { location, description } = event.events;
      return (
        location.toLowerCase().includes(searchValue) ||
        description.toLowerCase().includes(searchValue)
      );
    });
    setFilteredEvents(filtered);
  };

  // Handle event card click
  const handleCardClick = (event: any) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };
  useEffect(() => {
    if (typeof window !== "undefined") {
      getSessionId();
    }
  }, []);
  // Handle adding event to cart
  const handleAddToCart = async () => {
    if (!selectedEvent) {
      alert("No event selected.");
      return;
    }

    const sessionId = getSessionId();
    if (!sessionId) {
      alert("No session found. Please try again.");
      return;
    }

    const selectedTicket = selectedEvent.eventPrices.find(
      (ticket: any) => ticket.type === selectedTicketType
    );

    if (!selectedTicket) {
      alert("Please select a valid ticket type.");
      return;
    }

    const dataToSend = {
      id: selectedEvent._id,
      productType: "event",
      eventTypeId: selectedTicket._id,
      numberOfTickets: ticketCount,
      sessionId,
    };

    try {
      const response = await addEventToCart(
        dataToSend.id,
        dataToSend.productType,
        dataToSend.eventTypeId,
        dataToSend.numberOfTickets
      );

      if (response) {
        alert("Tickets added to cart successfully!");
        setIsModalOpen(false);
      }
    } catch (error) {
     
    }
  };

  // Handle tab change
  const handleChange = (event: React.ChangeEvent<{}> | null, newValue: number) => {
    // Ensure newValue is within bounds
    if (newValue >= 0 && newValue < 3) {
      setValue(newValue);
    }
  };

  // Render nothing if not mounted
  if (!isMounted) {
    return null;
  }

  return (
    <div
      className="bg-[#ffffff] min-h-screen text-[#000000]"
    >
      {/* Custom AppBar with Rounded Corners and Padding */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          padding: "16px 0",
          backgroundColor: "#f5f5f5",
        }}
      >
        {/* Header Section */}
        <div style={{ position: 'relative', width: '100%' }}>
          {/* Back Arrow */}
          <div style={{ position: 'absolute', top: '16px', left: '16px', zIndex: 10 }}>
  <Link href="/events" legacyBehavior>
    <a className="inline-flex items-center bg-gradient-to-r from-[#fccc52] to-[#ff914d] text-[#323232] px-4 py-2 bg-opacity-90 rounded-lg hover:bg-[#fccc52] hover:text-[#ffffff] transition-colors duration-300">
      <IoChevronBack className="mr-2 text-2xl" />
    </a>
  </Link>
</div>
          {/* Event Name */}
          <h1
            className="text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#fccc52] to-[#ff914d] drop-shadow-md mb-8"
            style={{ textAlign: 'center', paddingTop: '64px' }}
          >
            {eventCompanyName}
          </h1>
        </div>
         {/* Cart Icon */}
         <Box sx={{ position: "absolute", right: "16px" }}>
            <CartIcon />
          </Box>

        {/* Tabs */}
        <Paper
  elevation={3}
  sx={{
    borderRadius: "20px",
    width: { xs: "90%", sm: "80%", md: "70%", lg: "30%" },
    backgroundColor: "#fcd152",
    padding: "8px 16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center", // Center the Tabs horizontally
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
    position: "relative",
    margin: '0 auto',
  }}
  className="mx-4"
>
  <Tabs
    value={value}
    onChange={handleChange}
    textColor="inherit"
    indicatorColor="primary"
    aria-label="customized tabs example"
    variant="scrollable"
    scrollButtons="auto"
    sx={{
      "& .MuiTabs-indicator": {
        backgroundColor: "#ffffff",
        height: "4px",
        borderRadius: "2px",
      },
      "& .MuiTab-root": {
        color: "#323232",
        fontSize: "1.1rem",
        fontWeight: "bold",
        textTransform: "none",
        letterSpacing: "0.5px",
        padding: "12px 16px",
        borderRadius: "10px",
        transition: "background-color 0.3s, color 0.3s",
      },
      "& .Mui-selected": {
        color: "#ffffff",
        backgroundColor: "#fcc652",
        boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.2)",
      },
    }}
            {...handlers} // Attach swipe handlers here
          >
            <Tab label="Overview" {...a11yProps(0)} />
            <Tab label="Event Details" {...a11yProps(1)} />
            <Tab label="House Rules" {...a11yProps(2)} />
          </Tabs>

         
        </Paper>
      </Box>
      {/* Tab Panels */}
      <div>
        {/* Overview & Prices Tab */}
        <TabPanel value={value} index={0} dir={theme.direction}>
          {/* Back Button */}

          {/* Header Section */}
          <div className="w-full max-w-8xl p-4 flex flex-col items-center">
            <div className="flex flex-col items-center text-center py-4 px-10">
              
              {/* Search Bar */}
              <div className="flex items-center mb-8 w-full max-w-md">
                <input
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="flex-grow px-4 py-2 rounded-full bg-gray-100 border-2 border-[#fccc52] shadow-lg text-[#323232] focus:outline-none focus:border-[#ff914d] hover:border-[#ff914d]"
                />
                <button className="ml-4 px-4 py-2 bg-gradient-to-r from-[#fccc52] to-[#ff914d] font-md drop-shadow-md text-[#323232] rounded-lg transition-colors duration-300">
                  Search
                </button>
              </div>
              <p className="text-lg leading-relaxed text-[#323232] drop-shadow-md">
                Explore the event details and book your tickets below.
              </p>
            </div>
          </div>

          {/* Events List */}
          <main className="bg-[#ffffff] text-[#323232] p-8 flex flex-col items-center">
            <div className="w-full max-w-6xl flex flex-wrap justify-center gap-6">
              {filteredEvents.length > 0 ? (
                filteredEvents.map((event: any) => (
                  <div
                    key={event._id}
                    className="w-[320px] md:w-[350px] bg-[#ff914d] bg-opacity-5 rounded-3xl shadow-lg transform transition duration-500 hover:scale-105 hover:shadow-2xl flex flex-col overflow-hidden cursor-pointer"
                    onClick={() => handleCardClick(event)}
                  >
                    {/* Event Image */}
                    <div className="w-full h-48 bg-gray-300 rounded-t-3xl overflow-hidden mb-4">
                      <img
                        src={event.events.image}
                        alt={event.events.location}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {/* Event Details */}
                    <div className="px-6 py-4 flex justify-between w-full items-center">
                      <div>
                        <h3 className="text-xl font-extrabold text-gray-800 drop-shadow-md text-left">
                          {event.events.location}
                        </h3>
                        <p className="text-left mb-2 text-sm text-gray-600 drop-shadow-md">
                          {event.events.description}
                        </p>
                        <p className="text-left mb-2 text-sm text-gray-600 drop-shadow-md">
                          {new Date(event.events.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-3xl text-[#fccc52]">
                        <FaCalendarAlt />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>No events match your search.</p>
              )}
            </div>

            {/* Modal for selected event */}
            {isModalOpen && selectedEvent && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                  {/* Selected Event Details */}
                  <h2 className="text-2xl drop-shadow-md font-bold text-[#fccc52] mb-4">
                    {selectedEvent.events.location}
                  </h2>
                  <p className="mb-2 drop-shadow-md">{selectedEvent.events.description}</p>
                  <p>
                    Time: {selectedEvent.events.startTime} - {selectedEvent.events.endTime}
                  </p>

                  {/* Ticket Selection */}
                  <div className="mt-6">
                    <h2 className="text-xl font-bold text-[#fccc52] mb-4">Select Tickets</h2>
                    <div>
                      <select
                        className="w-full px-4 py-2 rounded-full drop-shadow-md text-xs bg-gray-100 border-2 border-[#fccc52] shadow-lg"
                        onChange={(e) => setSelectedTicketType(e.target.value)}
                        required
                        value={selectedTicketType}
                      >
                        <option value="" disabled>
                          Choose Ticket Type
                        </option>
                        {selectedEvent.eventPrices.map((ticket: any, index: number) => (
                          <option key={index} value={ticket.type} className="drop-shadow-md text-xs">
                            {ticket.type} ticket, priced at ${ticket.price}, with {ticket.ticketAvailable} available
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mt-4 mb-4 text-[#fccc52]">
                      <label className="text-lg font-bold text-[#fccc52] mb-4">Number of tickets</label>
                      <input
                        type="number"
                        min="1"
                        value={ticketCount}
                        onChange={(e) => setTicketCount(Number(e.target.value))}
                        className="rounded-full bg-gray-100 border-2 border-[#fccc52] shadow-lg text-[#323232] px-4 py-2 focus:outline-none focus:border-[#ff914d] text-sm hover:border-[#ff914d]"
                        required
                      />
                    </div>

                    <div className="flex justify-between">
                      <button
                        className="bg-[#fccc52] text-[#323232] px-6 py-2 mt-4 rounded-lg"
                        onClick={handleAddToCart}
                      >
                        Add to Cart
                      </button>
                      <button
                        className="ml-4 text-red-500"
                        onClick={() => setIsModalOpen(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>
        </TabPanel>

        {/* Event Details Tab */}
        <TabPanel value={value} index={1} dir={theme.direction}>
          {eventOwnerProfile && (
            <Box className="p-8 bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
              <Box className="mb-4">
                <Typography variant="h5" className="text-[#323232] font-bold">
                  Address:
                </Typography>
                <Typography variant="body1" className="text-[#323232]">
                  {eventOwnerProfile.address}, {eventOwnerProfile.city}, {eventOwnerProfile.zipCode}
                </Typography>
              </Box>
              <Box className="mb-4">
                <Typography variant="h5" className="text-[#323232] font-bold">
                  Rating:
                </Typography>
                <Typography variant="body1" className="text-[#323232] flex items-center">
                  {/* Display star ratings */}
                  {[...Array(5)].map((_, index) => (
                    <FaStar
                      key={index}
                      color={index < Math.floor(eventOwnerProfile.rating) ? "#ff914d" : "#e4e5e9"}
                    />
                  ))}
                  {eventOwnerProfile.rating % 1 !== 0 && <FaStarHalfAlt color="#ff914d" />}
                </Typography>
              </Box>
              <Box className="mb-4">
                <Typography variant="h5" className="text-[#323232] font-bold">
                  Description:
                </Typography>
                <Typography variant="body1" className="text-[#323232]">
                  {eventOwnerProfile.description}
                </Typography>
              </Box>
            </Box>
          )}
        </TabPanel>

        {/* House Rules Tab */}
        <TabPanel value={value} index={2} dir={theme.direction}>
          <Box
            className="bg-[#ffffff] p-8 rounded-3xl shadow-2xl"
            display="flex"
            flexDirection="column"
            gap={6}
            mx="auto"
            maxWidth="800px"
            sx={{
              transition: "transform 0.3s ease-in-out",
              "&:hover": {
                transform: "translateY(-10px)",
              },
            }}
          >
            <Typography
              variant="h4"
              gutterBottom
              align="center"
              sx={{
                fontWeight: "bold",
                background: "linear-gradient(90deg, #ff914d, #fccc52)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)",
              }}
            >
              House Rules
            </Typography>

            {eventOwnerProfile && (
              <>
                <Box display="flex" flexDirection="column" gap={4}>
                  {/* Check-in Rule */}
                  <Box
                    p={4}
                    sx={{
                      backgroundColor: "#ffffff",
                      color: "#323232",
                      borderRadius: "15px",
                      boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <Typography
                      variant="h6"
                      gutterBottom
                      fontWeight="bold"
                      style={{
                        color: "#ff914d",
                        fontWeight: "bold",
                        textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)",
                      }}
                    >
                      Check-in
                    </Typography>
                    <Typography fontSize="1.1rem">{eventOwnerProfile.eventRules.checkIn}</Typography>
                  </Box>

                  {/* Check-out Rule */}
                  <Box
                    p={4}
                    borderRadius="15px"
                    sx={{
                      backgroundColor: "#ffffff",
                      color: "#323232",
                      boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <Typography
                      variant="h6"
                      gutterBottom
                      fontWeight="bold"
                      style={{
                        color: "#ff914d",
                        fontWeight: "bold",
                        textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)",
                      }}
                    >
                      Check-out
                    </Typography>
                    <Typography fontSize="1.1rem">Until {eventOwnerProfile.eventRules.checkOut}</Typography>
                  </Box>

                  {/* Cancellation Policy */}
                  <Box
                    p={4}
                    borderRadius="15px"
                    sx={{
                      backgroundColor: "#ffffff",
                      color: "#323232",
                      boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <Typography
                      variant="h6"
                      gutterBottom
                      fontWeight="bold"
                      style={{
                        color: "#ff914d",
                        fontWeight: "bold",
                        textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)",
                      }}
                    >
                      Cancellation/ Prepayment
                    </Typography>
                    <Typography fontSize="1.1rem">
                      Prepayment: {eventOwnerProfile.eventRules.prepayment ? "Required" : "Not Required"}
                    </Typography>
                    <Typography fontSize="1rem">{eventOwnerProfile.eventRules.cancellationPolicy}</Typography>
                  </Box>

                  {/* Additional Information */}
                  <Box
                    p={4}
                    borderRadius="15px"
                    sx={{
                      backgroundColor: "#ffffff",
                      color: "#323232",
                      boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <Typography
                      variant="h6"
                      gutterBottom
                      fontWeight="bold"
                      style={{
                        color: "#ff914d",
                        fontWeight: "bold",
                        textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)",
                      }}
                    >
                      Additional Information
                    </Typography>
                    <Typography fontSize="1rem">{eventOwnerProfile.eventRules.additionalInfo}</Typography>
                  </Box>

                  {/* Age Restriction */}
                  <Box
                    p={4}
                    borderRadius="15px"
                    sx={{
                      backgroundColor: "#ffffff",
                      color: "#323232",
                      boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <Typography
                      variant="h6"
                      gutterBottom
                      fontWeight="bold"
                      style={{
                        color: "#ff914d",
                        fontWeight: "bold",
                        textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)",
                      }}
                    >
                      Pets
                    </Typography>
                    <Typography fontSize="1.1rem">
                      {eventOwnerProfile.eventRules.pets ? "Pets allowed" : "Pets not allowed"}
                    </Typography>
                  </Box>

                  {/* Payment Methods */}
                  <Box
                    p={4}
                    borderRadius="15px"
                    sx={{
                      backgroundColor: "#ffffff",
                      color: "#323232",
                      boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <Typography
                      variant="h6"
                      gutterBottom
                      fontWeight="bold"
                      style={{
                        color: "#ff914d",
                        fontWeight: "bold",
                        textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)",
                      }}
                    >
                      Accepted Payment Methods
                    </Typography>
                    <Typography fontSize="1.1rem">{eventOwnerProfile.eventRules.acceptedPaymentMethods}</Typography>
                  </Box>
                </Box>
              </>
            )}
          </Box>
        </TabPanel>
      </div>
       {/* Floating Hotel and Calendar Icons */}
       {Array.from({ length: 10 }).map((_, index) => (
        <motion.div
          key={`hotel-${index}`}
          className="absolute absolute text-6xl opacity-20"
          style={{
            color: "#ff914d", // Lighter color for hotel icons
            top: `${Math.random() * 100}vh`,
            left: `${Math.random() * 100}vw`,
          }}
          animate={{
            y: ["0%", "10%", "0%"],
            x: ["0%", "-10%", "10%", "0%"],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "mirror",
          }}
        >
          <FaCalendarAlt />
        </motion.div>
      ))}
      {Array.from({ length: 10 }).map((_, index) => (
        <motion.div
          key={`calendar-${index}`}
          className="absolute absolute text-6xl opacity-20"
          style={{
            color: "#ff914d", // Lighter color for calendar icons
            top: `${Math.random() * 100}vh`,
            left: `${Math.random() * 100}vw`,
          }}
          animate={{
            y: ["0%", "10%", "0%"],
            x: ["0%", "-10%", "10%", "0%"],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: "mirror",
          }}
        >
          <FaRegCalendarAlt />
        </motion.div>
      ))}
    </div>
  );
}
