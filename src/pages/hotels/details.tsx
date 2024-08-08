import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { IoChevronBack } from 'react-icons/io5';
import { FaBed } from 'react-icons/fa';
import SwipeableViews from 'react-swipeable-views';
import { useTheme, Theme, Direction } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Button } from '@mui/material';
import { FaWifi, FaShuttleVan, FaSpa, FaDumbbell, FaUtensils, FaParking, FaSmokingBan, FaCoffee, FaGlassMartiniAlt, FaBath, FaTv, FaPhone, FaSwimmer, FaConciergeBell, FaLock, FaUserShield, FaTshirt, FaLaptop, FaAccessibleIcon, FaHandHoldingHeart } from 'react-icons/fa';

interface Room {
  id: number;
  name: string;
  description: string;
  image: string;
  price: number;
}

const facilitiesData = {
  facilities: [
    { icon: FaWifi, text: "Free WiFi" },
    { icon: FaShuttleVan, text: "Airport shuttle (free)" },
    { icon: FaSpa, text: "Spa and wellness centre" },
    { icon: FaDumbbell, text: "Fitness centre" },
    { icon: FaUtensils, text: "Restaurant" },
    { icon: FaParking, text: "Free parking" },
    { icon: FaSmokingBan, text: "Non-smoking rooms" },
    { icon: FaCoffee, text: "Tea/coffee maker in all rooms" },
    { icon: FaGlassMartiniAlt, text: "Bar" },
    { icon: FaBed, text: "Breakfast" },
  ],
  room_Amenities: [
    { icon: FaBath, text: "Bathroom" },
    { icon: FaBath, text: "Toilet paper" },
    { icon: FaBath, text: "Towels" },
    { icon: FaBath, text: "Bath or shower" },
    { icon: FaBath, text: "Slippers" },
    { icon: FaBath, text: "Private bathroom" },
    { icon: FaBath, text: "Toilet" },
    { icon: FaBath, text: "Free toiletries" },
    { icon: FaBath, text: "Bathrobe" },
    { icon: FaBath, text: "Hairdryer" },
    { icon: FaBath, text: "Shower" },
    { icon: FaBed, text: "Bedroom" },
    { icon: FaBed, text: "Linen" },
    { icon: FaBed, text: "Wardrobe or closet" },
    { icon: FaBed, text: "City view" },
    { icon: FaBed, text: "View" },
  ],
  outdoor_Facilities: [
    { icon: FaSwimmer, text: "Outdoors" },
    { icon: FaSwimmer, text: "BBQ facilities (Additional charge)" },
    { icon: FaSwimmer, text: "Balcony" },
    { icon: FaSwimmer, text: "Terrace" },
  ],
  kitchen_Facilities: [
    { icon: FaUtensils, text: "Kitchen" },
    { icon: FaUtensils, text: "Tumble dryer" },
    { icon: FaUtensils, text: "Electric kettle" },
    { icon: FaUtensils, text: "Refrigerator" },
  ],
  room_Amenities2: [
    { icon: FaBed, text: "Room Amenities" },
    { icon: FaBed, text: "Socket near the bed" },
    { icon: FaBed, text: "Clothes rack" },
  ],
  mediaTech: [
    { icon: FaTv, text: "Media & Technology" },
    { icon: FaTv, text: "Flat-screen TV" },
    { icon: FaTv, text: "Satellite channels" },
    { icon: FaTv, text: "Telephone" },
    { icon: FaTv, text: "TV" },
  ],
  foodDrink: [
    { icon: FaUtensils, text: "Food & Drink" },
    { icon: FaUtensils, text: "Coffee house on site" },
    { icon: FaUtensils, text: "Fruits (Additional charge)" },
    { icon: FaUtensils, text: "Wine/champagne (Additional charge)" },
    { icon: FaUtensils, text: "Kid-friendly buffet" },
    { icon: FaUtensils, text: "Kid meals" },
    { icon: FaUtensils, text: "Snack bar" },
    { icon: FaUtensils, text: "Breakfast in the room" },
    { icon: FaUtensils, text: "Bar" },
    { icon: FaUtensils, text: "Minibar" },
    { icon: FaUtensils, text: "Restaurant" },
    { icon: FaUtensils, text: "Tea/Coffee maker" },
  ],
  transport_Facilities: [
    { icon: FaShuttleVan, text: "Transport" },
    { icon: FaShuttleVan, text: "Public transport tickets (Additional charge)" },
  ],
  reception_Services: [
    { icon: FaConciergeBell, text: "Reception services" },
    { icon: FaConciergeBell, text: "Invoice provided" },
    { icon: FaConciergeBell, text: "Lockers" },
    { icon: FaConciergeBell, text: "Private check-in/check-out" },
    { icon: FaConciergeBell, text: "Concierge service" },
    { icon: FaConciergeBell, text: "ATM/cash machine on site" },
    { icon: FaConciergeBell, text: "Luggage storage" },
    { icon: FaConciergeBell, text: "Tour desk" },
    { icon: FaConciergeBell, text: "Currency exchange" },
    { icon: FaConciergeBell, text: "Express check-in/check-out" },
    { icon: FaConciergeBell, text: "24-hour front desk" },
  ],
  cleaning_Services: [
    { icon: FaTshirt, text: "Cleaning services" },
    { icon: FaTshirt, text: "Daily housekeeping" },
    { icon: FaTshirt, text: "Trouser press (Additional charge)" },
    { icon: FaTshirt, text: "Ironing service (Additional charge)" },
    { icon: FaTshirt, text: "Dry cleaning (Additional charge)" },
    { icon: FaTshirt, text: "Laundry (Additional charge)" },
  ],
  business_Facilities: [
    { icon: FaLaptop, text: "Business facilities" },
    { icon: FaLaptop, text: "Fax/photocopying (Additional charge)" },
    { icon: FaLaptop, text: "Business centre (Additional charge)" },
    { icon: FaLaptop, text: "Meeting/banquet facilities (Additional charge)" },
  ],
  safety_Security: [
    { icon: FaLock, text: "Safety & security" },
    { icon: FaLock, text: "Fire extinguishers" },
    { icon: FaLock, text: "CCTV outside property" },
    { icon: FaLock, text: "CCTV in common areas" },
    { icon: FaLock, text: "Smoke alarms" },
    { icon: FaLock, text: "Security alarm" },
    { icon: FaLock, text: "Key card access" },
    { icon: FaLock, text: "Key access" },
    { icon: FaLock, text: "24-hour security" },
    { icon: FaLock, text: "Safety deposit box" },
  ],
  general_Facilities: [
    { icon: FaUserShield, text: "General" },
    { icon: FaUserShield, text: "Shuttle service (Additional charge)" },
    { icon: FaUserShield, text: "Grocery deliveries (Additional charge)" },
    { icon: FaUserShield, text: "Adult only" },
    { icon: FaUserShield, text: "Minimarket on site" },
    { icon: FaUserShield, text: "Shared lounge/TV area" },
    { icon: FaUserShield, text: "Designated smoking area" },
    { icon: FaUserShield, text: "Non-smoking throughout" },
    { icon: FaUserShield, text: "Wake-up service" },
    { icon: FaUserShield, text: "Car hire" },
    { icon: FaUserShield, text: "Laptop safe" },
    { icon: FaUserShield, text: "Packed lunches" },
    { icon: FaUserShield, text: "Carpeted" },
    { icon: FaUserShield, text: "Lift" },
    { icon: FaUserShield, text: "Facilities for disabled guests" },
    { icon: FaUserShield, text: "Airport shuttle" },
    { icon: FaUserShield, text: "Non-smoking rooms" },
    { icon: FaUserShield, text: "Room service" },
  ],
  accessibility: [
    { icon: FaAccessibleIcon, text: "Accessibility" },
    { icon: FaAccessibleIcon, text: "Wheelchair accessible" },
    { icon: FaAccessibleIcon, text: "Entire unit wheelchair accessible" },
    { icon: FaAccessibleIcon, text: "Upper floors accessible by stairs only" },
    { icon: FaAccessibleIcon, text: "Upper floors accessible by elevator" },
  ],
  wellnessFacilities: [
    { icon: FaHandHoldingHeart, text: "Wellness" },
    { icon: FaHandHoldingHeart, text: "Fitness/spa locker rooms" },
    { icon: FaHandHoldingHeart, text: "Fitness" },
    { icon: FaHandHoldingHeart, text: "Full body massage" },
    { icon: FaHandHoldingHeart, text: "Hand massage" },
    { icon: FaHandHoldingHeart, text: "Head massage" },
    { icon: FaHandHoldingHeart, text: "Couples massage" },
    { icon: FaHandHoldingHeart, text: "Foot massage" },
    { icon: FaHandHoldingHeart, text: "Neck massage" },
    { icon: FaHandHoldingHeart, text: "Back massage" },
    { icon: FaHandHoldingHeart, text: "Steam room" },
    { icon: FaHandHoldingHeart, text: "Massage (Additional charge)" },
    { icon: FaHandHoldingHeart, text: "Spa and wellness centre (Additional charge)" },
    { icon: FaHandHoldingHeart, text: "Fitness centre" },
    { icon: FaHandHoldingHeart, text: "Sauna" },
  ],
  languages: [
    { icon: FaUserShield, text: "English" },
    { icon: FaUserShield, text: "Tigrigna" },
    { icon: FaUserShield, text: "Amharic" },
  ]
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


export default function ChooseRoom() {
  const router = useRouter();
  const { hotelName } = router.query;

  const rooms: Room[] = [
    { id: 1, name: 'Standard Room', description: 'A comfortable room with all basic amenities.', image: '/assets/room.png', price: 100 },
    { id: 2, name: 'Deluxe Room', description: 'A spacious room with a king-sized bed and a beautiful view.', image: '/assets/room.png', price: 150 },
    { id: 3, name: 'Suite', description: 'A luxurious suite with a separate living area.', image: '/assets/room.png', price: 200 },
  ];

  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [value, setValue] = useState(0);
  const theme = useTheme();

  const [selectedCategory, setSelectedCategory] = useState<keyof typeof facilitiesData>("facilities");

  const handleRoomClick = (room: Room) => {
    setSelectedRoom(room);
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
        <title>Choose Room - {hotelName}</title>
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
          <Tab label="Facilities" {...a11yProps(1)} />
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
            <Link href="/hotels" legacyBehavior>
              <a className="inline-flex items-center text-[#fccc52] mb-8 px-4 py-2 bg-[#3d3c3f] bg-opacity-90 rounded-lg hover:bg-[#fccc52] hover:text-[#323232] transition-colors duration-300">
                <IoChevronBack className="mr-2 text-2xl" />
                <span className="font-bold text-lg"></span>
              </a>
            </Link>
          </div>
          <div className="w-full max-w-8xl p-4 flex flex-col items-center">
            <div className="flex flex-col items-center text-center py-4 px-10">
              <h1 className="text-4xl font-bold mb-8">Choose Your Room at {hotelName}</h1>
              <div className="flex items-center mb-8 w-full max-w-md">
                <input type="text" placeholder="Search" className="flex-grow px-4 py-2 rounded-lg bg-[#fccc52] bg-opacity-30 text-gray-500" />
                <button className="ml-4 px-4 py-2 rounded-lg bg-[#323232] text-[#fccc52]">Search</button>
              </div>
              <p className="text-lg text-gray-500 leading-relaxed">Select a room type to see more details and book your stay.</p>
            </div>
          </div>
          <main className="bg-[#3d3c3f] bg-opacity-90 p-8 flex flex-col items-center">
            <div className="w-full max-w-7xl">
              <div className="flex flex-wrap justify-between gap-8">
                {rooms.map((room) => (
                  <div
                    key={room.id}
                    className={`w-full sm:w-[48%] lg:w-[30%] bg-[#323232] text-white rounded-xl shadow-lg cursor-pointer transform transition-transform duration-300 hover:scale-105 ${selectedRoom === room ? 'border-4 border-[#fccc52]' : ''}`}
                    onClick={() => handleRoomClick(room)}
                  >
                    <img src={room.image} alt={room.name} className="rounded-lg mb-4" />
                    <div className="px-4 flex justify-between w-full items-center">
                      <div>
                        <h3 className="text-lg font-bold text-gray-200 text-left">{room.name}</h3>
                        <p className="text-left mb-2 text-sm text-gray-300">{room.description}</p>
                        <p className="text-left mb-2 text-sm text-gray-300">${room.price} per night</p>
                      </div>
                      <div className="text-2xl text-[#fccc52] mb-2">
                        <FaBed />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {selectedRoom && (
                <div className="mt-8 text-center">
                  <h2 className="text-3xl font-bold mb-4 text-[#fccc52]">{selectedRoom.name}</h2>
                  <p className="mb-4">{selectedRoom.description}</p>
                  <p className="mb-4">${selectedRoom.price} per night</p>
                  <button className="bg-[#fccc52] text-[#323232] px-6 py-2 mt-4 rounded-lg">Book Now</button>
                </div>
              )}
            </div>
          </main>
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          <div className=" bg-[#3d3c3f] p-4">
            <Typography variant="h6" gutterBottom>Facilities of the Hotel</Typography>
            <div className="mt-4">
            <Box mb={2} display="flex" justifyContent="center" flexWrap="wrap" gap={2}>
              {Object.keys(facilitiesData).map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "contained" : "outlined"}
                  color="primary"
                  onClick={() => setSelectedCategory(category as keyof typeof facilitiesData)}
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
              {facilitiesData[selectedCategory].map(item => (
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
