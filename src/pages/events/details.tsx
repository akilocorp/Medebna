import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { IoChevronBack } from 'react-icons/io5';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaTicketAlt, FaInfoCircle, FaConciergeBell, FaUserFriends, FaHandHoldingHeart } from 'react-icons/fa';
import { useTheme, Direction } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Button } from '@mui/material';
import { useSwipeable } from 'react-swipeable';
import CartIcon from '@/components/carticon';

interface Event {
  id: number;
  name: string;
  description: string;
  image: string;
  date: string;
  time: string;
  location: string;
  price: number;
}

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

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
  dir?: Direction;
}

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

function a11yProps(index: number) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

export default function ChooseEvent() {
  const router = useRouter();
  const { eventName } = router.query;

  const events: Event[] = [
    { id: 1, name: 'Music Concert', description: 'Enjoy a night of classical music.', image: '/assets/event3.png', date: '2024-12-25', time: '19:00', location: 'Concert Hall', price: 50 },
    { id: 2, name: 'Art Exhibition', description: 'Explore contemporary art.', image: '/assets/event3.png', date: '2024-12-26', time: '14:00', location: 'Art Gallery', price: 20 },
    { id: 3, name: 'Tech Conference', description: 'Discover the latest in technology.', image: '/assets/event3.png', date: '2024-12-27', time: '09:00', location: 'Convention Center', price: 100 },
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ticketCount, setTicketCount] = useState(1);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [value, setValue] = useState(0);
  const theme = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof eventCategories>("event_Details");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleAddToCart = () => {
    if (ticketCount < 1) {
      alert("Please enter a valid number of tickets.");
      return;
    }

    console.log('Added to cart.', selectedEvent);
    setIsModalOpen(false);
  };

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => setValue((prev) => Math.min(prev + 1, 2)),
    onSwipedRight: () => setValue((prev) => Math.max(prev - 1, 0)),
  });

  if (!isMounted) {
    return null;
  }

  return (
    <div className="bg-[#ffffff] min-h-screen text-[#000000]" {...handlers}>
      <AppBar position="static" style={{ backgroundColor: '#ffffff' }}>
        <div className="relative flex justify-between items-center px-4">
          <Tabs
            value={value}
            onChange={handleChange}
            textColor="inherit"
            indicatorColor="primary"
            aria-label="full width tabs example"
            variant="fullWidth"
            centered
            sx={{
              '& .MuiTabs-indicator': {
                backgroundColor: '#fccc52',
              },
              '& .MuiTab-root': {
                color: 'black',
              },
              '& .Mui-selected': {
                color: 'black',
              },
            }}
          >
            <Tab label="Overview & Prices" {...a11yProps(0)} />
            <Tab label="Event Details" {...a11yProps(1)} />
            <Tab label="House Rules" {...a11yProps(2)} />
          </Tabs>
          <div className="absolute top-3 right-4">
            <CartIcon />
          </div>
        </div>
      </AppBar>

      <div>
        <TabPanel value={value} index={0} dir={theme.direction}>
          <div className="p-4">
            <Link href="/events" legacyBehavior>
              <a className="inline-flex items-center bg-gradient-to-r from-[#fccc52] to-[#ff914d] text-[#323232] mb-8 px-4 py-2 bg-opacity-90 rounded-lg hover:bg-[#fccc52] hover:text-[#ffffff] transition-colors duration-300">
                <IoChevronBack className="mr-2 text-2xl" />
              </a>
            </Link>
          </div>
          <div className="w-full max-w-8xl p-4 flex flex-col items-center">
            <div className="flex flex-col items-center text-center py-4 px-10">
              <h1 className="text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#fccc52] to-[#ff914d] drop-shadow-md mb-8">
                Choose Your Event at {eventName}
              </h1>
              <div className="flex items-center mb-8 w-full max-w-md">
                <input
                  type="text"
                  placeholder="Search"
                  className="flex-grow px-4 py-2 rounded-full bg-gray-100 border-2 border-[#fccc52] shadow-lg text-[#323232] focus:outline-none focus:border-[#ff914d] hover:border-[#ff914d]"
                />
                <button className="ml-4 px-4 py-2 bg-gradient-to-r from-[#fccc52] to-[#ff914d] font-md drop-shadow-md text-[#323232] rounded-lg transition-colors duration-300">
                  Search
                </button>
              </div>
              <p className="text-lg leading-relaxed text-[#323232] drop-shadow-md">
                Select an event to see more details and book your spot.
              </p>
            </div>
          </div>
          <main className="bg-[#ffffff] text-[#323232] p-8 flex flex-col items-center">
            <div className="w-full max-w-6xl flex flex-col items-center">
              <div className="flex flex-wrap justify-between gap-8">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className="w-[320px] md:w-[350px] bg-[#ff914d] bg-opacity-5 rounded-3xl shadow-lg flex-shrink-0 transform transition duration-500 hover:scale-105 hover:shadow-2xl flex flex-col overflow-hidden cursor-pointer"
                    onClick={() => handleEventClick(event)}
                  >
                    <div className="w-full h-48 bg-gray-300 rounded-t-3xl overflow-hidden mb-4">
                      <img
                        src={event.image}
                        alt={event.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="px-6 py-4 flex justify-between w-full items-center">
                      <div>
                        <h3 className="text-xl font-extrabold text-gray-800 drop-shadow-md text-left">
                          {event.name}
                        </h3>
                        <p className="text-left mb-2 text-sm text-gray-600 drop-shadow-md">
                          {event.description}
                        </p>
                        <p className="text-left mb-2 text-sm text-gray-600 drop-shadow-md">
                          ${event.price} per ticket
                        </p>
                      </div>
                      <div className="text-3xl text-[#fccc52]">
                        <FaTicketAlt />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {isModalOpen && selectedEvent && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                  <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                    <h2 className="text-2xl drop-shadow-md font-bold text-[#fccc52] mb-4">{selectedEvent.name}</h2>
                    <p className="mb-2 drop-shadow-md">{selectedEvent.description}</p>
                    <p className="mb-4 drop-shadow-md">${selectedEvent.price} per ticket</p>

                    <div className="mb-4 text-[#fccc52]">
                      <label className="block text-sm mb-2 drop-shadow-md">Number of tickets</label>
                      <input
                        type="number"
                        min="1"
                        value={ticketCount}
                        onChange={(e) => setTicketCount(Number(e.target.value))}
                        className="rounded-full bg-gray-100 border-2 border-[#fccc52] shadow-lg text-[#323232] px-4 py-2 focus:outline-none focus:border-[#ff914d] hover:border-[#ff914d]"
                        required
                      />
                    </div>

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
              )}
            </div>
          </main>
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          <div className="bg-[#ffffff] p-6 rounded-lg">
            <Typography
              variant="h4"
              gutterBottom
              style={{
                color: '#ff914d',
                fontWeight: 'bold',
                textAlign: 'center',
                textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)',
              }}
            >
              Event Details
            </Typography>
            <div className="mt-6">
              <Box
                mb={8}
                display="flex"
                justifyContent="center"
                flexWrap="wrap"
                gap={2}
                sx={{ textAlign: 'center' }}
              >
                {Object.keys(eventCategories).map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "contained" : "outlined"}
                    color="primary"
                    onClick={() => setSelectedCategory(category as keyof typeof eventCategories)}
                    sx={{
                      textTransform: "capitalize",
                      backgroundColor: selectedCategory === category ? "#fccc52" : "transparent",
                      color: selectedCategory === category ? "#ffffff" : "#ff914d",
                      borderColor: "#ff914d",
                      borderRadius: "20px",
                      fontWeight: "bold",
                      boxShadow: selectedCategory === category ? "0px 4px 15px rgba(0, 0, 0, 0.1)" : "none",
                      padding: "16px 20px",
                      "&:hover": {
                        backgroundColor: "#fccc52",
                        color: "#6a6a6a",
                        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.12)",
                      },
                      "&.MuiButton-outlined": {
                        borderColor: "#ffffff",
                        backgroundColor: "#f9f9f9",
                        color: "#6a6a6a",
                        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.12)",
                      },
                    }}
                  >
                    {category.replace("_", " ")}
                  </Button>
                ))}
              </Box>
            </div>
            <Box
              display="grid"
              gridTemplateColumns="repeat(auto-fill, minmax(220px, 1fr))"
              gap={3}
              sx={{
                padding: "20px",
                backgroundColor: "#ffffff",
                borderRadius: "12px",
              }}
            >
              {eventCategories[selectedCategory].map((item, index) => (
                <Box
                  key={index}
                  p={2}
                  bgcolor="#f9f9f9"
                  color="#6a6a6a"
                  borderRadius="12px"
                  boxShadow="0px 6px 18px rgba(0, 0, 0, 0.15)"
                  display="flex"
                  alignItems="center"
                  sx={{
                    transition: "transform 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-5px)",
                    },
                  }}
                >
                  <item.icon style={{ color: "#ff914d", marginRight: "12px", fontSize: "1.5rem" }} />
                  <Typography
                    sx={{
                      fontSize: "1.1rem",
                      fontWeight: "bold",
                      letterSpacing: "0.5px",
                    }}
                  >
                    {item.text}
                  </Typography>
                </Box>
              ))}
            </Box>
          </div>
        </TabPanel>
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

            <Box display="flex" flexDirection="column" gap={4}>
              <Box
                p={4}
                sx={{
                  backgroundColor: "#ffffff",
                  color: "#323232",
                }}
              >
                <Typography variant="h6" gutterBottom fontWeight="bold" style={{ color: "#ff914d", fontWeight: "bold", textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)" }}>
                  Check-in
                </Typography>
                <Typography fontSize="1.1rem">From 12:00</Typography>
                <Typography fontSize="1rem">
                  Guests are required to show a photo identification and credit card upon check-in. You&apos;ll need to let the property know in advance what time you&apos;ll arrive.
                </Typography>
              </Box>

              <Box
                p={4}
                borderRadius="20px"
                sx={{
                  backgroundColor: "#ffffff",
                  color: "#323232",
                }}
              >
                <Typography variant="h6" gutterBottom fontWeight="bold" style={{ color: "#ff914d", fontWeight: "bold", textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)" }}>
                  Check-out
                </Typography>
                <Typography fontSize="1.1rem">Until 12:00</Typography>
              </Box>

              <Box
                p={4}
                borderRadius="20px"
                sx={{
                  backgroundColor: "#ffffff",
                  color: "#323232",
                }}
              >
                <Typography variant="h6" gutterBottom fontWeight="bold" style={{ color: "#ff914d", fontWeight: "bold", textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)" }}>
                  Cancellation/ prepayment
                </Typography>
                <Typography fontSize="1rem">
                  Cancellation and prepayment policies vary according to accommodation type. Please enter the dates of your stay and check the conditions of your required option.
                </Typography>
              </Box>

              <Box
                p={4}
                borderRadius="20px"
                sx={{
                  backgroundColor: "#ffffff",
                  color: "#323232",
                }}
              >
                <Typography variant="h6" gutterBottom fontWeight="bold" style={{ color: "#ff914d", fontWeight: "bold", textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)" }}>
                  Children and beds
                </Typography>
                <Typography fontSize="1.1rem">Children of any age are welcome.</Typography>
                <Typography fontSize="1rem">
                  To see correct prices and occupancy information, please add the number of children in your group and their ages to your search.
                </Typography>
                <Box mt={2}>
                  <Typography variant="h6" gutterBottom fontWeight="bold" style={{ color: "#ff914d", fontWeight: "bold", textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)" }}>
                    Cot and extra bed policies
                  </Typography>
                  <Typography fontSize="1rem">0 - 2 years: Cot upon request, US$20 per child, per night</Typography>
                  <Typography fontSize="1rem">3+ years: Extra bed upon request, US$25 per person, per night</Typography>
                  <Typography fontSize="1rem">
                    Prices for cots and extra beds are not included in the total price, and will have to be paid for separately during your stay.
                  </Typography>
                  <Typography fontSize="1rem">
                    The number of extra beds and cots allowed is dependent on the option you choose. Please check your selected option for more information.
                  </Typography>
                  <Typography fontSize="1rem">All cots and extra beds are subject to availability.</Typography>
                </Box>
              </Box>

              <Box
                p={4}
                borderRadius="20px"
                sx={{
                  backgroundColor: "#ffffff",
                  color: "#323232",
                }}
              >
                <Typography variant="h6" gutterBottom fontWeight="bold" style={{ color: "#ff914d", fontWeight: "bold", textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)" }}>
                  No age restriction
                </Typography>
                <Typography fontSize="1.1rem">There is no age requirement for check-in.</Typography>
              </Box>

              <Box
                p={4}
                borderRadius="20px"
                sx={{
                  backgroundColor: "#ffffff",
                  color: "#323232",
                }}
              >
                <Typography variant="h6" gutterBottom fontWeight="bold" style={{ color: "#ff914d", fontWeight: "bold", textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)" }}>
                  Pets
                </Typography>
                <Typography fontSize="1.1rem">Pets are not allowed.</Typography>
              </Box>

              <Box
                p={4}
                borderRadius="20px"
                sx={{
                  backgroundColor: "#ffffff",
                  color: "#323232",
                }}
              >
                <Typography variant="h6" gutterBottom fontWeight="bold" style={{ color: "#ff914d", fontWeight: "bold", textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)" }}>
                  Accepted payment methods
                </Typography>
                <Typography fontSize="1.1rem">Visa, Mastercard, Cash</Typography>
              </Box>
            </Box>
          </Box>
        </TabPanel>
      </div>
    </div>
  );
}
