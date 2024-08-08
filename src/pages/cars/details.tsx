import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { IoChevronBack } from 'react-icons/io5';
import { useTheme, Theme, Direction } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Button } from '@mui/material';
import { FaCar, FaGasPump, FaCogs, FaUsers, FaRoad, FaClock, FaMoneyBillWave, FaMapMarkerAlt, FaInfoCircle, FaLock } from 'react-icons/fa';
import { useSwipeable } from 'react-swipeable';

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
    { icon: FaGasPump, text: "Fuel Type" },
    { icon: FaCogs, text: "Transmission" },
    { icon: FaUsers, text: "Seats" },
    { icon: FaRoad, text: "Mileage" },
  ],
  rental_Info: [
    { icon: FaClock, text: "Rental Duration" },
    { icon: FaMoneyBillWave, text: "Price per Day" },
    { icon: FaMapMarkerAlt, text: "Pick-up Location" },
  ],
  additional_Info: [
    { icon: FaInfoCircle, text: "Additional Information" },
    { icon: FaLock, text: "Security Deposit" },
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
  const { rentalId, rentalName } = router.query;

  const cars: Car[] = [
    { id: 1, name: 'Economy Car', description: 'A small, fuel-efficient car perfect for city driving.', image: '/assets/car.png', price: 40, fuel: 'Petrol', transmission: 'Automatic', seats: 4, mileage: '25 mpg' },
    { id: 2, name: 'SUV', description: 'A spacious SUV ideal for family trips.', image: '/assets/car.png', price: 80, fuel: 'Diesel', transmission: 'Manual', seats: 7, mileage: '20 mpg' },
    { id: 3, name: 'Luxury Sedan', description: 'A luxury sedan with all the latest features.', image: '/assets/car.png', price: 120, fuel: 'Hybrid', transmission: 'Automatic', seats: 5, mileage: '30 mpg' },
  ];

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
    <div className="bg-[#1a1a1a] min-h-screen text-[#ffffff]" {...handlers}>
      <Head>
        <title>Choose Car - {rentalName}</title>
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
          <Tab label="Car Details" {...a11yProps(1)} />
          <Tab label="Rental Info" {...a11yProps(2)} />
        </Tabs>
      </AppBar>
      <div>
        <TabPanel value={value} index={0} dir={theme.direction}>
          <div className="p-4">
            <Link href="/cars" legacyBehavior>
              <a className="inline-flex items-center text-[#fccc52] mb-8 px-4 py-2 bg-[#3d3c3f] bg-opacity-90 rounded-lg hover:bg-[#fccc52] hover:text-[#323232] transition-colors duration-300">
                <IoChevronBack className="mr-2 text-2xl" />
                <span className="font-bold text-lg"></span>
              </a>
            </Link>
          </div>
          <div className="w-full max-w-8xl p-4 flex flex-col items-center">
            <div className="flex flex-col items-center text-center py-4 px-10">
              <h1 className="text-4xl font-bold mb-8">Choose Your Car at {rentalName}</h1>
              <div className="flex items-center mb-8 w-full max-w-md">
                <input type="text" placeholder="Search" className="flex-grow px-4 py-2 rounded-lg bg-[#fccc52] bg-opacity-30 text-gray-500" />
                <button className="ml-4 px-4 py-2 rounded-lg bg-[#323232] text-[#fccc52]">Search</button>
              </div>
              <p className="text-lg text-gray-500 leading-relaxed">Select a car type to see more details and book your rental.</p>
            </div>
          </div>
          <main className="bg-[#3d3c3f] bg-opacity-90 p-8 flex flex-col items-center">
            <div className="w-full max-w-7xl">
              <div className="flex flex-wrap justify-between gap-8">
                {cars.map((car) => (
                  <div
                    key={car.id}
                    className={`w-full sm:w-[48%] lg:w-[30%] bg-[#323232] text-white rounded-xl shadow-lg cursor-pointer transform transition-transform duration-300 hover:scale-105 ${selectedCar === car ? 'border-4 border-[#fccc52]' : ''}`}
                    onClick={() => handleCarClick(car)}
                  >
                    <img src={car.image} alt={car.name} className="rounded-lg mb-4" />
                    <div className="px-4 flex justify-between w-full items-center">
                      <div>
                        <h3 className="text-lg font-bold text-gray-200 text-left">{car.name}</h3>
                        <p className="text-left mb-2 text-sm text-gray-300">{car.description}</p>
                        <p className="text-left mb-2 text-sm text-gray-300">${car.price} per day</p>
                      </div>
                      <div className="text-2xl text-[#fccc52] mb-2">
                        <FaCar />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {selectedCar && (
                <div className="mt-8 text-center">
                  <h2 className="text-3xl font-bold mb-4 text-[#fccc52]">{selectedCar.name}</h2>
                  <p className="mb-4">{selectedCar.description}</p>
                  <p className="mb-4">${selectedCar.price} per day</p>
                  <button className="bg-[#fccc52] text-[#323232] px-6 py-2 mt-4 rounded-lg">Book Now</button>
                </div>
              )}
            </div>
          </main>
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          <div className=" bg-[#3d3c3f] p-4">
            <Typography variant="h6" gutterBottom>Car Details</Typography>
            <div className="mt-4">
              <Box mb={2} display="flex" justifyContent="center" flexWrap="wrap" gap={2}>
                {Object.keys(carCategories).map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "contained" : "outlined"}
                    color="primary"
                    onClick={() => setSelectedCategory(category as keyof typeof carCategories)}
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
              {carCategories[selectedCategory].map(item => (
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
              Rental Information
            </Typography>
            <Box display="flex" flexDirection="column" gap={2}>
              <Box>
                <Typography variant="h6" color="#fccc52" gutterBottom fontWeight="bold">
                  Rental Duration
                </Typography>
                <Typography color="white" fontSize="1.1rem">From 12:00</Typography>
                <Typography color="white" fontSize="1rem">
                  Guests are required to show a photo identification and credit card upon check-in. You&apos;ll need to let the property know in advance what time you&apos;ll arrive.
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
      </div>
    </div>
  );
}
