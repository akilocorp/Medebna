import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { IoChevronBack } from 'react-icons/io5';
import { useTheme, Direction } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Button } from '@mui/material';
import { FaCar } from 'react-icons/fa';
import { useSwipeable } from 'react-swipeable';
import CartIcon from '@/components/carticon';

interface Car {
  id: number;
  name: string;
  description: string;
  image: string;
  price: number;
  fuel: string;
  transmission: string;
  seats: number;
  mileage: string;
}

const carCategories = {
  car_Details: [
    { icon: FaCar, text: "Fuel Type" },
    { icon: FaCar, text: "Transmission" },
    { icon: FaCar, text: "Seats" },
    { icon: FaCar, text: "Mileage" },
  ],
  rental_Info: [
    { icon: FaCar, text: "Rental Duration" },
    { icon: FaCar, text: "Price per Day" },
    { icon: FaCar, text: "Pick-up Location" },
  ],
  additional_Info: [
    { icon: FaCar, text: "Additional Information" },
    { icon: FaCar, text: "Security Deposit" },
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

export default function ChooseCar() {
  const router = useRouter();
  const { rentalName } = router.query;

  const cars: Car[] = [
    { id: 1, name: 'Economy Car', description: 'A small, fuel-efficient car perfect for city driving.', image: '/assets/car.png', price: 40, fuel: 'Petrol', transmission: 'Automatic', seats: 4, mileage: '25 mpg' },
    { id: 2, name: 'SUV', description: 'A spacious SUV ideal for family trips.', image: '/assets/car.png', price: 80, fuel: 'Diesel', transmission: 'Manual', seats: 7, mileage: '20 mpg' },
    { id: 3, name: 'Luxury Sedan', description: 'A luxury sedan with all the latest features.', image: '/assets/car.png', price: 120, fuel: 'Hybrid', transmission: 'Automatic', seats: 5, mileage: '30 mpg' },
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [value, setValue] = useState(0);
  const theme = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof carCategories>("car_Details");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleCarClick = (car: Car) => {
    setSelectedCar(car);
    setIsModalOpen(true);
  };

  const handleAddToCart = () => {
    if (!startDate || !endDate) {
      alert("Please select both the start and end dates.");
      return;
    }

    if (new Date(endDate) <= new Date(startDate)) {
      alert("End date must be after the start date.");
      return;
    }

    console.log('Added to cart.', selectedCar);
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
            <Tab label="Car Details" {...a11yProps(1)} />
            <Tab label="Rental Info" {...a11yProps(2)} />
          </Tabs>
          <div className="absolute top-3 right-4">
            <CartIcon />
          </div>
        </div>
      </AppBar>

      <div>
        <TabPanel value={value} index={0} dir={theme.direction}>
          <div className="p-4">
            <Link href="/cars" legacyBehavior>
              <a className="inline-flex items-center bg-gradient-to-r from-[#fccc52] to-[#ff914d] text-[#323232] mb-8 px-4 py-2 bg-[#ff914d] bg-opacity-90 rounded-lg hover:bg-[#fccc52] hover:text-[#ffffff] transition-colors duration-300">
                <IoChevronBack className="mr-2 text-2xl" />
              </a>
            </Link>
          </div>
          <div className="w-full max-w-8xl p-4 flex flex-col items-center">
            <div className="flex flex-col items-center text-center py-4 px-10">
              <h1 className="text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#fccc52] to-[#ff914d] drop-shadow-md mb-8">
                Choose Your Car at {rentalName}
              </h1>
              <div className="flex items-center mb-8 w-full max-w-md">
                <input
                  type="text"
                  placeholder="Search"
                  className="flex-grow px-4 py-2 rounded-full bg-gray-100 border-2 border-[#fccc52] shadow-lg text-[#323232] focus:outline-none focus:border-[#ff914d] hover:border-[#ff914d]"
                />
                <button className="sm:ml-4 px-4 py-2 bg-gradient-to-r from-[#fccc52] to-[#ff914d] font-md drop-shadow-md text-[#323232] rounded-lg transition-colors duration-300">
                  Search
                </button>
              </div>
              <p className="text-lg leading-relaxed text-[#323232] drop-shadow-md">
                Select a car type to see more details and book your rental.
              </p>
            </div>
          </div>
          <main className="bg-[#ffffff] text-[#323232] p-8 flex flex-col items-center">
            <div className="w-full max-w-6xl flex flex-col items-center">
              <div className="flex flex-wrap justify-between gap-8">
                {cars.map((car) => (
                  <div
                    key={car.id}
                    className="w-[320px] md:w-[350px] bg-[#ff914d] bg-opacity-5 rounded-3xl shadow-lg flex-shrink-0 transform transition duration-500 hover:scale-105 hover:shadow-2xl flex flex-col overflow-hidden cursor-pointer"
                    onClick={() => handleCarClick(car)}
                  >
                    <div className="w-full h-48 bg-gray-300 rounded-t-3xl overflow-hidden mb-4">
                      <img
                        src={car.image}
                        alt={car.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="px-6 py-4 flex justify-between w-full items-center">
                      <div>
                        <h3 className="text-xl font-extrabold text-gray-800 drop-shadow-md text-left">
                          {car.name}
                        </h3>
                        <p className="text-left mb-2 text-sm text-gray-600 drop-shadow-md">
                          {car.description}
                        </p>
                        <p className="text-left mb-2 text-sm text-gray-600 drop-shadow-md">
                          ${car.price} per day
                        </p>
                      </div>
                      <div className="text-3xl text-[#fccc52]">
                        <FaCar />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {isModalOpen && selectedCar && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                  <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                    <h2 className="text-2xl drop-shadow-md font-bold text-[#fccc52] mb-4">{selectedCar.name}</h2>
                    <p className="mb-2 drop-shadow-md">{selectedCar.description}</p>
                    <p className="mb-4 drop-shadow-md">${selectedCar.price} per day</p>

                    <div className="flex gap-4 p-3">
                      <label className="block mb-4 text-[#fccc52]">
                        From:
                        <input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="ml-2 p-2 text-white rounded bg-[#323232]"
                          required
                        />
                      </label>
                      <label className="block mb-4 text-[#fccc52]">
                        To:
                        <input
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="ml-2 p-2 text-white rounded bg-[#323232]"
                          required
                        />
                      </label>
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
              Car Details
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
                {Object.keys(carCategories)
                  .map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? 'contained' : 'outlined'}
                      color="primary"
                      onClick={() => setSelectedCategory(category as keyof typeof carCategories)}
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
                padding: '20px',
                backgroundColor: '#ffffff',
                borderRadius: '12px',
              }}
            >
              {carCategories[selectedCategory].map((item, index) => (
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
                  <item.icon style={{ color: '#ff914d', marginRight: '12px', fontSize: '1.5rem' }} />
                  <Typography
                    sx={{
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      letterSpacing: '0.5px',
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
              Rental Information
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
                  Rental Duration
                </Typography>
                <Typography fontSize="1.1rem">From 12:00</Typography>
                <Typography fontSize="1rem">
                  Guests are required to show a photo identification and credit card upon check-in. You will need to let the property know in advance what time you will arrive.
                </Typography>
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
                <Typography fontSize="1.1rem">Until 12:00</Typography>
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
                <Typography fontSize="1rem">Cancellation and prepayment policies vary according to accommodation type. Please enter the dates of your stay and check the conditions of your required option.</Typography>
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
                <Typography fontSize="1.1rem">Child policies</Typography>
                <Typography fontSize="1rem">Children of any age are welcome.</Typography>
                <Typography fontSize="1rem">
                  To see correct prices and occupancy information, please add the number of children in your group and their ages to your search.
                </Typography>
                <Box mt={2}>
                  <Typography variant="h6" gutterBottom fontWeight="bold" style={{
                    color: '#ff914d',
                    fontWeight: 'bold',
                    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)',
                  }}>
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
                <Typography fontSize="1.1rem">There is no age requirement for check-in</Typography>
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
                <Typography fontSize="1.1rem">Pets are not allowed.</Typography>
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
                <Typography fontSize="1.1rem">Visa, Mastercard, Cash</Typography>
              </Box>
            </Box>
          </Box>
        </TabPanel>
      </div>
    </div>
  );
}
