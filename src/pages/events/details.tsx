import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { IoChevronBack } from 'react-icons/io5';
import SwipeableViews from 'react-swipeable-views';
import { useTheme, Theme, Direction } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Button } from '@mui/material';
import { FaCalendarAlt, FaMapMarkerAlt, FaClock, FaTicketAlt, FaInfoCircle, FaConciergeBell, FaUserFriends, FaHandHoldingHeart } from 'react-icons/fa';

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
  const { eventId, eventName } = router.query;

  const events: Event[] = [
    { id: 1, name: 'Music Concert', description: 'Enjoy a night of classical music.', image: '/assets/event3.png', date: '2024-12-25', time: '19:00', location: 'Concert Hall', price: 50 },
    { id: 2, name: 'Art Exhibition', description: 'Explore contemporary art.', image: '/assets/event3.png', date: '2024-12-26', time: '14:00', location: 'Art Gallery', price: 20 },
    { id: 3, name: 'Tech Conference', description: 'Discover the latest in technology.', image: '/assets/event3.png', date: '2024-12-27', time: '09:00', location: 'Convention Center', price: 100 },
  ];

  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [value, setValue] = useState(0);
  const theme = useTheme();

  const [selectedCategory, setSelectedCategory] = useState<keyof typeof eventCategories>("event_Details");

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
  };

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index: number) => {
    setValue(index);
  };

  return (
    <div className="bg-[#1a1a1a] min-h-screen text-[#ffffff]">
      <Head>
        <title>Choose Event - {eventName}</title>
      </Head>
      <AppBar position="static" style={{ backgroundColor: '#3d3c3f', opacity: 0.9 }}>
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
              color: 'white',
            },
            '& .Mui-selected': {
              color: 'white',
            },
          }}
        >
          <Tab label="Overview & Prices" {...a11yProps(0)} />
          <Tab label="Event Details" {...a11yProps(1)} />
          <Tab label="House Rules" {...a11yProps(2)} />
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <TabPanel value={value} index={0} dir={theme.direction}>
          <div className="p-4">
            <Link href="/events" legacyBehavior>
              <a className="inline-flex items-center text-[#fccc52] mb-8 px-4 py-2 bg-[#3d3c3f] bg-opacity-90 rounded-lg hover:bg-[#fccc52] hover:text-[#323232] transition-colors duration-300">
                <IoChevronBack className="mr-2 text-2xl" />
                <span className="font-bold text-lg"></span>
              </a>
            </Link>
          </div>
          <div className="w-full max-w-8xl p-4 flex flex-col items-center">
            <div className="flex flex-col items-center text-center py-4 px-10">
              <h1 className="text-4xl font-bold mb-8">Choose Your Event at {eventName}</h1>
              <div className="flex items-center mb-8 w-full max-w-md">
                <input type="text" placeholder="Search" className="flex-grow px-4 py-2 rounded-lg bg-[#fccc52] bg-opacity-30 text-gray-500" />
                <button className="ml-4 px-4 py-2 rounded-lg bg-[#323232] text-[#fccc52]">Search</button>
              </div>
              <p className="text-lg text-gray-500 leading-relaxed">Select an event to see more details and book your spot.</p>
            </div>
          </div>
          <main className="bg-[#3d3c3f] bg-opacity-90 p-8 flex flex-col items-center">
            <div className="w-full max-w-7xl">
              <div className="flex flex-wrap justify-between gap-8">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className={`w-full sm:w-[48%] lg:w-[30%] bg-[#323232] text-white rounded-xl shadow-lg cursor-pointer transform transition-transform duration-300 hover:scale-105 ${selectedEvent === event ? 'border-4 border-[#fccc52]' : ''}`}
                    onClick={() => handleEventClick(event)}
                  >
                    <img src={event.image} alt={event.name} className="rounded-lg mb-4" />
                    <div className="px-4 flex justify-between w-full items-center">
                      <div>
                        <h3 className="text-lg font-bold text-gray-200 text-left">{event.name}</h3>
                        <p className="text-left mb-2 text-sm text-gray-300">{event.description}</p>
                        <p className="text-left mb-2 text-sm text-gray-300">${event.price} per ticket</p>
                      </div>
                      <div className="text-2xl text-[#fccc52] mb-2">
                        <FaTicketAlt />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {selectedEvent && (
                <div className="mt-8 text-center">
                  <h2 className="text-3xl font-bold mb-4 text-[#fccc52]">{selectedEvent.name}</h2>
                  <p className="mb-4">{selectedEvent.description}</p>
                  <p className="mb-4">${selectedEvent.price} per ticket</p>
                  <button className="bg-[#fccc52] text-[#323232] px-6 py-2 mt-4 rounded-lg">Book Now</button>
                </div>
              )}
            </div>
          </main>
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          <div className=" bg-[#3d3c3f] p-4">
            <Typography variant="h6" gutterBottom>Event Details</Typography>
            <div className="mt-4">
            <Box mb={2} display="flex" justifyContent="center" flexWrap="wrap" gap={2}>
              {Object.keys(eventCategories).map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "contained" : "outlined"}
                  color="primary"
                  onClick={() => setSelectedCategory(category as keyof typeof eventCategories)}
                  sx={{
                    textTransform: "capitalize",
                    backgroundColor: selectedCategory === category ? "#fccc52" : "transparent",
                    color: selectedCategory === category ? "#323232" : "#fccc52",
                    "&:hover": {
                      backgroundColor: "#fccc52",
                      color: "#323232",
                     
                    }
                  }}
                >
                 {category.replace("_", " ")}
                </Button>
              ))}
            </Box>
            </div>
            <Box display="grid" gridTemplateColumns="repeat(auto-fill, minmax(200px, 1fr))" gap={2}>
              {eventCategories[selectedCategory].map(item => (
                <Box
                  key={item.text}
                  p={2}
                  bgcolor="#323232"
                  color="white"
                  borderRadius="8px"
                  boxShadow={2}
                  display="flex"
                  alignItems="center"
                >
                  <item.icon style={{ color: '#fccc52', marginRight: '8px' }} />
                  <Typography>{item.text}</Typography>
                </Box>
              ))}
            </Box>
          </div>
        </TabPanel>
        <TabPanel value={value} index={2} dir={theme.direction}>
  <Box
    className="bg-[#3d3c3f] bg-opacity-90 p-6 rounded-lg shadow-lg"
    display="flex"
    flexDirection="column"
    gap={4}
    mx="auto"
    maxWidth="800px"
  >
    <Typography variant="h4" gutterBottom color="#fccc52" align="center" fontWeight="bold">
      House Rules
    </Typography>
    <Box display="flex" flexDirection="column" gap={2}>
      <Box>
        <Typography variant="h6" color="#fccc52" gutterBottom fontWeight="bold">
          Check-in
        </Typography>
        <Typography color="white" fontSize="1.1rem">From 12:00</Typography>
        <Typography color="white" fontSize="1rem">
          Guests are required to show a photo identification and credit card upon check-in. You'll need to let the property know in advance what time you'll arrive.
        </Typography>
      </Box>
      <Box>
        <Typography variant="h6" color="#fccc52" gutterBottom fontWeight="bold">
          Check-out
        </Typography>
        <Typography color="white" fontSize="1.1rem">Until 12:00</Typography>
      </Box>
    </Box>
    <Box>
      <Typography variant="h6" color="#fccc52" gutterBottom fontWeight="bold">
        Cancellation/ prepayment
      </Typography>
      <Typography color="white" fontSize="1rem">
        Cancellation and prepayment policies vary according to accommodation type. Please enter the dates of your stay and check the conditions of your required option.
      </Typography>
    </Box>
    <Box>
      <Typography variant="h6" color="#fccc52" gutterBottom fontWeight="bold">
        Children and beds
      </Typography>
      <Typography color="white" fontSize="1.1rem">Child policies</Typography>
      <Typography color="white" fontSize="1rem">Children of any age are welcome.</Typography>
      <Typography color="white" fontSize="1rem">
        To see correct prices and occupancy information, please add the number of children in your group and their ages to your search.
      </Typography>
      <Box mt={2}>
        <Typography variant="h6" color="#fccc52" gutterBottom fontWeight="bold">
          Cot and extra bed policies
        </Typography>
        <Typography color="white" fontSize="1rem">0 - 2 years: Cot upon request, US$20 per child, per night</Typography>
        <Typography color="white" fontSize="1rem">3+ years: Extra bed upon request, US$25 per person, per night</Typography>
        <Typography color="white" fontSize="1rem">
          Prices for cots and extra beds are not included in the total price, and will have to be paid for separately during your stay.
        </Typography>
        <Typography color="white" fontSize="1rem">
          The number of extra beds and cots allowed is dependent on the option you choose. Please check your selected option for more information.
        </Typography>
        <Typography color="white" fontSize="1rem">All cots and extra beds are subject to availability.</Typography>
      </Box>
    </Box>
    <Box>
      <Typography variant="h6" color="#fccc52" gutterBottom fontWeight="bold">
        No age restriction
      </Typography>
      <Typography color="white" fontSize="1.1rem">There is no age requirement for check-in</Typography>
    </Box>
    <Box>
      <Typography variant="h6" color="#fccc52" gutterBottom fontWeight="bold">
        Pets
      </Typography>
      <Typography color="white" fontSize="1.1rem">Pets are not allowed.</Typography>
    </Box>
    <Box>
      <Typography variant="h6" color="#fccc52" gutterBottom fontWeight="bold">
        Accepted payment methods
      </Typography>
      <Typography color="white" fontSize="1.1rem">Visa, Mastercard, Cash</Typography>
    </Box>
  </Box>
</TabPanel>

      </SwipeableViews>
    </div>
  );
}
