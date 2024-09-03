import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { IoChevronBack } from 'react-icons/io5';
import { useTheme, Direction } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Button } from '@mui/material';
import { useSwipeable } from 'react-swipeable';
import CartIcon from '@/components/carticon';
import { getListing } from '@/stores/operator/ApiCallerOperatorHotel';
import { fetchHotelOwnerProfiles } from '@/stores/operator/hotelprofileapicaller';
import { addToCart, getCartCount } from '@/stores/cart/carapicaller'; // Make sure the path is correct
import { FaBed, FaUtensils, FaSwimmingPool, FaWifi, FaShower, FaParking, FaAccessibleIcon, FaSpa, FaLanguage, FaBriefcase } from 'react-icons/fa';
interface Facilities {
  popularFacilities: string[];
  roomAmenities: string[];
  outdoorFacilities: string[];
  kitchenFacilities: string[];
  mediaTech: string[];
  foodDrink: string[];
  transportFacilities: string[];
  receptionServices: string[];
  cleaningServices: string[];
  businessFacilities: string[];
  safetyFacilities: string[];
  generalFacilities: string[];
  accessibility: string[];
  wellnessFacilities: string[];
  languages: string[];
}

interface CheckInOut {
  time: string;
  description: string;
}

interface HouseRules {
  checkIn: CheckInOut;
  checkOut: CheckInOut;
  cancellationPrepayment: string;
  childrenAndBeds: string;
  cribsAndExtraBedPolicies: string;
  noAgeRestriction: string;
  pets: string;
  acceptedPaymentMethods: string;
}

interface Room {
  _id: string;
  roomNumber: string;
  status: string;
}

interface RoomType {
  id: string;
  type: string;
  price: number;
  image: string;
  description: string;
  numberOfGuests: number;
  rooms: Room[];
}

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
          <Typography component="div">{children}</Typography>
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

const categoryDisplayNames: { [key in keyof Facilities]: string } = {
  popularFacilities: 'Popular Facilities',
  roomAmenities: 'Room Amenities',
  outdoorFacilities: 'Outdoor Facilities',
  kitchenFacilities: 'Kitchen Facilities',
  mediaTech: 'Media & Technology',
  foodDrink: 'Food & Drink',
  transportFacilities: 'Transport Facilities',
  receptionServices: 'Reception Services',
  cleaningServices: 'Cleaning Services',
  businessFacilities: 'Business Facilities',
  safetyFacilities: 'Safety & Security',
  generalFacilities: 'General Facilities',
  accessibility: 'Accessibility',
  wellnessFacilities: 'Wellness Facilities',
  languages: 'Languages',
};

const facilityIcons: { [key in keyof Facilities]: React.ElementType } = {
  popularFacilities: FaBed,
  roomAmenities: FaShower,
  outdoorFacilities: FaSwimmingPool,
  kitchenFacilities: FaUtensils,
  mediaTech: FaWifi,
  foodDrink: FaUtensils,
  transportFacilities: FaParking,
  receptionServices: FaAccessibleIcon,
  cleaningServices: FaSpa,
  businessFacilities: FaBriefcase,
  safetyFacilities: FaAccessibleIcon,
  generalFacilities: FaBed,
  accessibility: FaAccessibleIcon,
  wellnessFacilities: FaSpa,
  languages: FaLanguage,
};

export default function ChooseRoom() {
  const router = useRouter();
  const { hotelId, hotelname } = router.query;

  const [rooms, setRooms] = useState<RoomType[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<RoomType[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<RoomType | null>(null);
  const [facilities, setFacilities] = useState<Facilities | null>(null);
  const [houseRules, setHouseRules] = useState<HouseRules | null>(null);
  const [value, setValue] = useState(0);
  const theme = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [numRooms, setNumRooms] = useState(1);
  const [numGuests, setNumGuests] = useState(1);
  const [roomNumber, setRoomNumber] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<keyof Facilities>('popularFacilities');
  const [searchTerm, setSearchTerm] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [HotelId, setHotelId] = useState<string | null>(null);



  useEffect(() => {
    setIsMounted(true);

    if (hotelId) {
      fetchListingData(hotelId as string);
      fetchHotelProfileData(hotelId as string);
    }
  }, [hotelId]);

  const fetchListingData = async (id: string) => {
    setLoading(true);
    try {
      const { roomTypes, HotelId } = await getListing(id); // Destructure to get both roomTypes and HotelId
      if (roomTypes && roomTypes.length > 0) {
        setRooms(roomTypes);
        setFilteredRooms(roomTypes);
        setHotelId(HotelId); // Store the HotelId in state
      } else {
        console.error('No room types found for this hotel');
      }
    } catch (error) {
      console.error('Error fetching listing data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  

  const fetchHotelProfileData = async (id: string) => {
    setLoading(true);
    try {
      const profile = await fetchHotelOwnerProfiles(id);
      if (profile && profile.data && profile.data.hotelProfile) {
        setFacilities(profile.data.hotelProfile.facilities);
        setHouseRules(profile.data.hotelProfile.houseRules);
      } else {
        console.error('No hotel profile found for this ID');
      }
    } catch (error) {
      console.error('Error fetching hotel profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchTerm(searchValue);

    const filtered = rooms.filter(room =>
      room.type.toLowerCase().includes(searchValue) ||
      room.description.toLowerCase().includes(searchValue)
    );

    setFilteredRooms(filtered);
  };

  const handleRoomClick = (room: RoomType) => {
    setSelectedRoom(room);
    setIsModalOpen(true);
  };

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  const handleAddToCart = async () => {
    if (!selectedRoom || !roomNumber || !HotelId) {
      alert('Please select a room, room number, and ensure the HotelId is available.');
      return;
    }
  
    // Extract the roomId from the selected room based on the roomNumber
    const selectedRoomObject = selectedRoom.rooms.find(room => room.roomNumber === roomNumber);
    if (!selectedRoomObject) {
      alert('Invalid room selection. Please try again.');
      return;
    }
  
    try {
      const response = await addToCart(HotelId, 'hotel', selectedRoomObject._id);
      if (response) {
        alert('Room added to cart successfully.');
        setIsModalOpen(false); // Close the modal after adding to the cart
        window.location.reload(); // Refresh the page
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add room to cart. Please try again.');
    }
  };
 

  const handlers = useSwipeable({
    onSwipedLeft: () => setValue((prev) => Math.min(prev + 1, 2)),
    onSwipedRight: () => setValue((prev) => Math.max(prev - 1, 0)),
  });

  if (!isMounted) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f9f9f9]">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <svg
              className="animate-spin h-10 w-10 text-[#ff914d]"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          </div>
          <p className="text-[#fccc52] text-lg font-semibold">Loading, please wait...</p>
        </div>
      </div>
    );
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
            <Tab label="Facilities" {...a11yProps(1)} />
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
            <Link href="/hotels" legacyBehavior>
              <a className="inline-flex items-center bg-gradient-to-r from-[#fccc52] to-[#ff914d] text-[#323232] mb-8 px-4 py-2 bg-[#ff914d] bg-opacity-90 rounded-lg hover:bg-[#fccc52] hover:text-[#ffffff] transition-colors duration-300">
                <IoChevronBack className="mr-2 text-2xl" />
              </a>
            </Link>
          </div>
          <div className="w-full max-w-8xl p-4 flex flex-col items-center">
            <div className="flex flex-col items-center text-center py-4 px-10">
              <h1 className="text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#fccc52] to-[#ff914d] drop-shadow-md mb-8">
                Choose Your Room at {hotelname}
              </h1>
              <div className="flex items-center mb-8 w-full max-w-md">
                <input
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="flex-grow px-4 py-2 rounded-full bg-gray-100 border-2 border-[#fccc52] shadow-lg text-[#323232] focus:outline-none focus:border-[#ff914d] hover:border-[#ff914d]"
                />
                <button className="sm:ml-4 px-4 py-2 bg-gradient-to-r from-[#fccc52] to-[#ff914d] font-md drop-shadow-md text-[#323232] rounded-lg transition-colors duration-300">
                  Search
                </button>
              </div>
              <p className="text-lg leading-relaxed text-[#323232] drop-shadow-md">
                Select a room type to see more details and book your stay.
              </p>
            </div>
          </div>
          <main className="bg-[#ffffff] text-[#323232] p-8 flex flex-col items-center">
            <div className="w-full max-w-6xl flex flex-col items-center">
              <div className="flex flex-wrap justify-between gap-8">
                {filteredRooms && filteredRooms.length > 0 ? (
                  filteredRooms.map((room) => (
                    <div
                      key={room.id}
                      className="w-[320px] md:w-[350px] bg-[#ff914d] bg-opacity-5 rounded-3xl shadow-lg flex-shrink-0 transform transition duration-500 hover:scale-105 hover:shadow-2xl flex flex-col overflow-hidden cursor-pointer"
                      onClick={() => handleRoomClick(room)}
                    >
                      <div className="w-full h-48 bg-gray-300 rounded-t-3xl overflow-hidden mb-4">
                        <img
                          src={room.image}
                          alt={room.type}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="px-6 py-4 flex justify-between w-full items-center">
                        <div>
                          <h3 className="text-xl font-extrabold text-gray-800 drop-shadow-md text-left">
                            {room.type}
                          </h3>
                          <p className="text-left mb-2 text-sm text-gray-600 drop-shadow-md">
                            {room.description}
                          </p>
                          <p className="text-left mb-2 text-sm text-gray-600 drop-shadow-md">
                            ${room.price} per night
                          </p>
                        </div>
                        <div className="text-3xl text-[#fccc52]">
                          <FaBed />
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No rooms available</p>
                )}
              </div>
            </div>

            {isModalOpen && selectedRoom && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                  <h2 className="text-2xl drop-shadow-md font-bold text-[#fccc52] mb-4">{selectedRoom.type}</h2>
                  <p className="mb-2 drop-shadow-md">{selectedRoom.description}</p>
                  <p className="mb-4 drop-shadow-md">${selectedRoom.price} per night</p>

                  <div className="mb-4 text-[#fccc52]">
                    <label className="block text-sm drop-shadow-md mb-2">Room Number</label>
                    <select
                      value={roomNumber}
                      onChange={(e) => setRoomNumber(e.target.value)}
                      required
                      className="rounded-full bg-gray-100 border-2 border-[#fccc52] shadow-lg text-[#323232] px-4 py-2 focus:outline-none focus:border-[#ff914d] hover:border-[#ff914d]"
                    >
                      <option value="">Select Room Number</option>
                      {selectedRoom.rooms
                        .filter((room) => room.status === 'available')
                        .map((room) => (
                          <option key={room.roomNumber} value={room.roomNumber}>
                            {room.roomNumber}
                          </option>
                        ))}
                    </select>
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
          </main>
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          {facilities && (
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
                Hotel Facilities
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
                  {Object.keys(facilities)
                    .filter((category) => category in categoryDisplayNames)
                    .map((category) => {
                      const Icon = facilityIcons[category as keyof Facilities];
                      return (
                        <Button
                          key={category}
                          variant={selectedCategory === category ? 'contained' : 'outlined'}
                          color="primary"
                          onClick={() => setSelectedCategory(category as keyof Facilities)}
                          sx={{
                            textTransform: 'capitalize',
                            backgroundColor: selectedCategory === category ? '#fccc52' : 'transparent',
                            color: selectedCategory === category ? '#ffffff' : '#ff914d',
                            borderColor: '#ff914d',
                            borderRadius: '20px',
                            fontWeight: 'bold',
                            boxShadow: selectedCategory === category ? '0px 4px 15px rgba(0, 0, 0, 0.1)' : 'none',
                            padding: '16px 20px',
                            '&:hover': {
                              backgroundColor: '#fccc52',
                              color: '#6a6a6a',
                              boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.12)',
                            },
                            '&.MuiButton-outlined': {
                              borderColor: '#ffffff',
                              backgroundColor: '#f9f9f9',
                              color: '#6a6a6a',
                              boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.12)',
                            },
                          }}
                        >
                          <Icon style={{ marginRight: '8px' }} />
                          {categoryDisplayNames[category as keyof Facilities]}
                        </Button>
                      );
                    })}
                </Box>
              </div>
              <Box
                display="grid"
                gridTemplateColumns="repeat(auto-fill, minmax(220px, 1fr))"
                gap={3}
                sx={{
                  padding: '20px',
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                }}
              >
                {facilities[selectedCategory].map((item, index) => {
                  const Icon = facilityIcons[selectedCategory];
                  return (
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
                        transition: 'transform 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                        },
                      }}
                    >
                      <Icon style={{ color: '#ff914d', marginRight: '12px', fontSize: '1.5rem' }} />
                      <Typography
                        sx={{
                          fontSize: '1.1rem',
                          fontWeight: 'bold',
                          letterSpacing: '0.5px',
                        }}
                      >
                        {item}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            </div>
          )}
        </TabPanel>
        <TabPanel value={value} index={2} dir={theme.direction}>
          {houseRules && (
            <Box
              className="bg-[#ffffff] p-8 rounded-3xl shadow-2xl"
              display="flex"
              flexDirection="column"
              gap={6}
              mx="auto"
              maxWidth="800px"
              sx={{
                transition: 'transform 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-10px)',
                },
              }}
            >
              <Typography
                variant="h4"
                gutterBottom
                align="center"
                sx={{
                  fontWeight: 'bold',
                  background: 'linear-gradient(90deg, #ff914d, #fccc52)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
                }}
              >
                House Rules
              </Typography>

              <Box display="flex" flexDirection="column" gap={4}>
                <Box
                  p={4}
                  sx={{
                    backgroundColor: '#ffffff',
                    color: '#323232',
                  }}
                >
                  <Typography variant="h6" gutterBottom fontWeight="bold" style={{
                    color: '#ff914d',
                    fontWeight: 'bold',
                    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)',
                  }}>
                    Check-in
                  </Typography>
                  <Typography fontSize="1.1rem">{houseRules.checkIn.time}</Typography>
                  <Typography fontSize="1rem">{houseRules.checkIn.description}</Typography>
                </Box>

                <Box
                  p={4}
                  borderRadius="20px"
                  sx={{
                    backgroundColor: '#ffffff',
                    color: '#323232',
                  }}
                >
                  <Typography variant="h6" gutterBottom fontWeight="bold" style={{
                    color: '#ff914d',
                    fontWeight: 'bold',
                    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)',
                  }}>
                    Check-out
                  </Typography>
                  <Typography fontSize="1.1rem">{houseRules.checkOut.time}</Typography>
                  <Typography fontSize="1rem">{houseRules.checkOut.description}</Typography>
                </Box>

                <Box
                  p={4}
                  borderRadius="20px"
                  sx={{
                    backgroundColor: '#ffffff',
                    color: '#323232',
                  }}
                >
                  <Typography variant="h6" gutterBottom fontWeight="bold" style={{
                    color: '#ff914d',
                    fontWeight: 'bold',
                    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)',
                  }}>
                    Cancellation/ prepayment
                  </Typography>
                  <Typography fontSize="1rem">{houseRules.cancellationPrepayment}</Typography>
                </Box>

                <Box
                  p={4}
                  borderRadius="20px"
                  sx={{
                    backgroundColor: '#ffffff',
                    color: '#323232',
                  }}
                >
                  <Typography variant="h6" gutterBottom fontWeight="bold" style={{
                    color: '#ff914d',
                    fontWeight: 'bold',
                    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)',
                  }}>
                    Children and beds
                  </Typography>
                  <Typography fontSize="1.1rem">{houseRules.childrenAndBeds}</Typography>
                  <Typography fontSize="1rem">{houseRules.cribsAndExtraBedPolicies}</Typography>
                </Box>

                <Box
                  p={4}
                  borderRadius="20px"
                  sx={{
                    backgroundColor: '#ffffff',
                    color: '#323232',
                  }}
                >
                  <Typography variant="h6" gutterBottom fontWeight="bold" style={{
                    color: '#ff914d',
                    fontWeight: 'bold',
                    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)',
                  }}>
                    No age restriction
                  </Typography>
                  <Typography fontSize="1.1rem">{houseRules.noAgeRestriction}</Typography>
                </Box>

                <Box
                  p={4}
                  borderRadius="20px"
                  sx={{
                    backgroundColor: '#ffffff',
                    color: '#323232',
                  }}
                >
                  <Typography variant="h6" gutterBottom fontWeight="bold" style={{
                    color: '#ff914d',
                    fontWeight: 'bold',
                    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)',
                  }}>
                    Pets
                  </Typography>
                  <Typography fontSize="1.1rem">{houseRules.pets}</Typography>
                </Box>

                <Box
                  p={4}
                  borderRadius="20px"
                  sx={{
                    backgroundColor: '#ffffff',
                    color: '#323232',
                  }}
                >
                  <Typography variant="h6" gutterBottom fontWeight="bold" style={{
                    color: '#ff914d',
                    fontWeight: 'bold',
                    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)',
                  }}>
                    Accepted payment methods
                  </Typography>
                  <Typography fontSize="1.1rem">{houseRules.acceptedPaymentMethods}</Typography>
                </Box>
              </Box>
            </Box>
          )}
        </TabPanel>
      </div>
    </div>
  );
}
