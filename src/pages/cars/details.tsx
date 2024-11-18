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
import { Button, Paper } from "@mui/material";
import { FaCar, FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { useSwipeable } from "react-swipeable";
import CartIcon from "@/components/carticon";
import { getCarListing } from "@/stores/operator/ApiCallerOperatorCar";
import { fetchCarOwnerProfileWithoutToken } from "@/stores/operator/carprofileapicaller";
import { addToCartcar, getSessionId } from "@/stores/cart/carapicaller";
import { motion } from "framer-motion";

// Define interfaces
interface CarCategory {
  popularFeatures: string[];
  safetyFeatures: string[];
  comfortFeatures: string[];
  entertainmentFeatures: string[];
}

interface CarSpecificity {
  _id: string;
  numberOfCars: number;
  color: string;
  status: string;
  image: string;
}

interface Car {
  _id: string;
  type: string; // The car type (e.g., SUV, V88)
  price: number;
  description: string;
  carSpecificity: CarSpecificity[]; // Array of carSpecificity properties
}

interface CarDetails {
  _id: string;
  details: string;
  rentalInfo: string;
  additionalInfo: string;
}

interface CarType {
  _id: string;
  createdBy: string;
  cars: Car[]; // Array of cars
  carDetails: CarDetails; // Additional details of the car
}

interface CarOwnerProfile {
  _id: string;
  address: string;
  rating: number;
  zipCode: string;
  city: string;
  companyImage: string;
  description: string;
  rentalRules: {
    rentalDuration: string;
    cancellationPolicy: string;
    prepayment: boolean;
    noAgeRestriction: boolean;
    additionalInfo: string;
    acceptedPaymentMethods: string;
  };
}

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
          <Typography component="div">{children}</Typography>
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
export default function ChooseCar() {
  const router = useRouter();
  const { carId, rentalName } = router.query;

  // State variables
  const [carTypes, setCarTypes] = useState<CarType[]>([]);
  const [filteredCars, setFilteredCars] = useState<CarType[]>([]);
  const [selectedCar, setSelectedCar] = useState<CarType | null>(null);
  const [value, setValue] = useState(0);
  const theme = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [numCars, setNumCars] = useState(1);
  const [carTypeId, setCarTypeId] = useState("");
  const [carColorId, setCarColorId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [carOwnerProfile, setCarOwnerProfile] = useState<CarOwnerProfile | null>(null);

  // Initialize swipe handlers
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => setValue((prev) => Math.min(prev + 1, 2)),
    onSwipedRight: () => setValue((prev) => Math.max(prev - 1, 0)),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  // Fetch data on mount or when carId changes
  useEffect(() => {
    setIsMounted(true);

    if (carId) {
      fetchCarListingData(carId as string);
      fetchCarOwnerProfile(carId as string);
    }
  }, [carId]);

  // Fetch car listings
  const fetchCarListingData = async (id: string) => {
    setLoading(true);
    try {
      const carTypes = await getCarListing(id);
     
      if (carTypes && carTypes.length > 0) {
        setCarTypes(carTypes);
        setFilteredCars(carTypes); // Set filtered cars to display initially
      } else {
       
        setFilteredCars([]);
      }
    } catch (error) {
     
    } finally {
      setLoading(false);
    }
  };

  // Fetch car owner profile
  const fetchCarOwnerProfile = async (id: string) => {
    setLoading(true);
    try {
      const profile = (await fetchCarOwnerProfileWithoutToken(id)) as CarOwnerProfile;
      if (profile) {
        setCarOwnerProfile(profile);
      } else {
        
      }
    } catch (error) {
     
    } finally {
      setLoading(false);
    }
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchTerm(searchValue);

    const filtered = carTypes.filter(
      (car) =>
        car.cars.some((c) => c.type.toLowerCase().includes(searchValue)) ||
        car.cars.some((c) => c.description.toLowerCase().includes(searchValue))
    );

    setFilteredCars(filtered);
  };

  // Handle tab change
  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  // Handle car card click
  const handleCarClick = (car: CarType) => {
    setSelectedCar(car);
    setCarTypeId(car._id);
    setIsModalOpen(true);
  };
  useEffect(() => {
    if (typeof window !== "undefined") {
      getSessionId();
    }
  }, []);
  
  // Handle adding car to cart
  const handleAddToCart = async () => {
    if (!selectedCar || !carTypeId || !carColorId) {
      alert("Please select a car type and color before proceeding.");
      return;
    }

    const sessionId = getSessionId();
    if (!sessionId) {
      alert("No session found. Please try again.");
      return;
    }

    const dataToSend = {
      id: carTypeId, // Use the car's `_id`
      productType: "car",
      roomId: "", // Optional for cars
      carTypeId: selectedCar.cars[0]._id, // Ensure this is the carTypeId (car._id)
      carColorId: carColorId, // Ensure this is the car color's `_id` (from carSpecificity)
      numberOfTickets: numCars,
      sessionId,
    };

    try {
      await addToCartcar(
        dataToSend.id,
        dataToSend.productType,
        dataToSend.roomId,
        dataToSend.carTypeId,
        dataToSend.carColorId,
        dataToSend.numberOfTickets
      );
      alert("Car added to cart successfully!");
      setIsModalOpen(false);
    } catch (error) {
     
      alert("Failed to add car to cart. Please try again.");
    }
  };

  // Render stars based on rating
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <>
        {Array(fullStars)
          .fill(0)
          .map((_, i) => (
            <FaStar key={`full-${i}`} color="#ff914d" />
          ))}
        {halfStar && <FaStarHalfAlt color="#ff914d" />}
        {Array(emptyStars)
          .fill(0)
          .map((_, i) => (
            <FaRegStar key={`empty-${i}`} color="#ff914d" />
          ))}
      </>
    );
  };

  // Render nothing if not mounted
  if (!isMounted) {
    return null;
  }

  // Loading state
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
          <p className="text-[#fccc52] text-lg font-semibold">
            Loading, please wait...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="bg-[#ffffff] min-h-screen text-[#000000]"
      {...swipeHandlers}

    >
      
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
      <Link href="/cars" legacyBehavior>
      <a className="inline-flex items-center bg-gradient-to-r from-[#fccc52] to-[#ff914d] text-[#323232] px-4 py-2 bg-opacity-90 rounded-lg hover:bg-[#fccc52] hover:text-[#ffffff] transition-colors duration-300">
      <IoChevronBack className="mr-2 text-2xl" />
    </a>
      </Link>
    </div>
    {/* Page Title */}
    <h1
      className="text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#fccc52] to-[#ff914d] drop-shadow-md mb-8"
      style={{ textAlign: 'center', paddingTop: '64px' }}
    >
      Choose Your Car at {rentalName}
    </h1>
  </div>
  {/* Cart Icon */}
  <Box sx={{ position: "absolute", right: "16px" }}>
            <CartIcon />
          </Box>
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
          >
            <Tab label="Overview" {...a11yProps(0)} />
            <Tab label="Car Details" {...a11yProps(1)} />
            <Tab label="Rental Info" {...a11yProps(2)} />
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
                Select a car type to see more details and book your rental.
              </p>
            </div>
          </div>

          {/* Cars List */}
          <main className="bg-[#ffffff] text-[#323232] p-8 flex flex-col items-center">
            <div className="w-full max-w-6xl flex flex-col items-center">
              <div className="flex flex-wrap justify-between gap-8">
                {filteredCars && filteredCars.length > 0 ? (
                  filteredCars.map((carType) =>
                    carType.cars.length > 0 ? (
                      <div
                        key={carType._id}
                        className="w-[320px] md:w-[350px] bg-[#ff914d] bg-opacity-5 rounded-3xl shadow-lg flex-shrink-0 transform transition duration-500 hover:scale-105 hover:shadow-2xl flex flex-col overflow-hidden cursor-pointer"
                        onClick={() => handleCarClick(carType)}
                      >
                        {/* Car Image */}
                        <div className="w-full h-48 bg-gray-300 rounded-t-3xl overflow-hidden mb-4">
                          {carType.cars[0]?.carSpecificity[0]?.image ? (
                            <img
                              src={carType.cars[0].carSpecificity[0].image}
                              alt={carType.cars[0].type}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <img
                              src="/assets/default-car.png"
                              alt="Default car"
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        {/* Car Details */}
                        <div className="px-6 py-4 flex justify-between w-full items-center">
                          <div>
                            <h3 className="text-xl font-extrabold text-gray-800 drop-shadow-md text-left">
                              {carType.cars[0].type || "Unknown Car Type"}
                            </h3>
                            <p className="text-left mb-2 text-sm text-gray-600 drop-shadow-md">
                              {carType.cars[0].description || "No description available."}
                            </p>
                            <p className="text-left mb-2 text-sm text-gray-600 drop-shadow-md">
                              ${carType.cars[0].price || "N/A"} per day
                            </p>
                          </div>
                          <div className="text-3xl text-[#fccc52]">
                            <FaCar />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div key={carType._id} className="text-red-500">
                        No cars available for this car type
                      </div>
                    )
                  )
                ) : (
                  <p>No cars available for this rental</p>
                )}
              </div>
            </div>

            {/* Modal for selected car */}
            {isModalOpen && selectedCar && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                  {/* Selected Car Details */}
                  <h2 className="text-2xl drop-shadow-md font-bold text-[#fccc52] mb-4">
                    {selectedCar.cars[0].type || "Unknown Car Type"}
                  </h2>
                  <p className="text-left mb-2 text-sm text-gray-600 drop-shadow-md">
                    {selectedCar.cars[0].description || "No description available."}
                  </p>
                  <p className="text-left mb-2 text-sm text-gray-600 drop-shadow-md">
                    ${selectedCar.cars[0].price || "N/A"} per day
                  </p>

                  {/* Car Color Selection */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 justify-center">
                    {selectedCar.cars[0].carSpecificity.map((specificity) => (
                      <button
                        key={specificity._id}
                        className={`flex flex-col items-center p-2 w-24 h-24 rounded-lg cursor-pointer border-4 transition-all duration-300 ${
                          carColorId === specificity._id
                            ? "border-[#fccc52] bg-gray-100 "
                            : "border-gray-300"
                        } hover:scale-105 hover:shadow-xl`}
                        onClick={() => setCarColorId(specificity._id)}
                      >
                        <img
                          src={specificity.image}
                          alt={specificity.color}
                          className="w-24 h-24 rounded-lg object-cover"
                        />
                        <span className="text-sm text-gray-700 mt-2">
                          {specificity.color}
                        </span>
                      </button>
                    ))}
                  </div>

                

                  {/* Action Buttons */}
                  <div className="flex justify-between mt-4">
                    <button
                      className="bg-[#fccc52] text-[#323232] px-6 py-2 rounded-lg"
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
            )}
          </main>
        </TabPanel>

        {/* Car Details Tab */}
        <TabPanel value={value} index={1} dir={theme.direction}>
          {carOwnerProfile && (
            <Box className="p-8 bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
              <Box className="mb-4">
                <Typography variant="h5" className="text-[#323232] font-bold">
                  Address:
                </Typography>
                <Typography variant="body1" className="text-[#323232]">
                  {carOwnerProfile.address}, {carOwnerProfile.city}, {carOwnerProfile.zipCode}
                </Typography>
              </Box>
              <Box className="mb-4">
                <Typography variant="h5" className="text-[#323232] font-bold">
                  Rating:
                </Typography>
                <Typography variant="body1" className="text-[#323232] flex items-center">
                  {renderStars(carOwnerProfile.rating)}
                </Typography>
              </Box>
              <Box className="mb-4">
                <Typography variant="h5" className="text-[#323232] font-bold">
                  Description:
                </Typography>
                <Typography variant="body1" className="text-[#323232]">
                  {carOwnerProfile.description}
                </Typography>
              </Box>
            </Box>
          )}
        </TabPanel>

        {/* Rental Info Tab */}
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
              Rental Information
            </Typography>

            {carOwnerProfile && (
              <>
                <Box display="flex" flexDirection="column" gap={4}>
                  {/* Rental Duration */}
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
                      Rental Duration
                    </Typography>
                    <Typography fontSize="1.1rem">
                      {carOwnerProfile.rentalRules.rentalDuration}
                    </Typography>
                  </Box>

                  {/* Rental Description */}
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
                      Rental Description
                    </Typography>
                    <Typography fontSize="1rem">
                      {carOwnerProfile.description}
                    </Typography>
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
                    <Typography fontSize="1.1rem">Until 12:00</Typography>
                  </Box>

                  {/* Cancellation/Prepayment */}
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
                    <Typography fontSize="1rem">
                      {carOwnerProfile.rentalRules.cancellationPolicy}
                    </Typography>
                  </Box>

                  {/* Children and Beds */}
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
                      Children and Beds
                    </Typography>
                    <Typography fontSize="1.1rem">Child policies</Typography>
                    <Typography fontSize="1rem">
                      Children of any age are welcome.
                    </Typography>
                    <Typography fontSize="1rem">
                      {carOwnerProfile.rentalRules.additionalInfo}
                    </Typography>
                  </Box>

                  {/* No Age Restriction */}
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
                      No Age Restriction
                    </Typography>
                    <Typography fontSize="1.1rem">
                      {carOwnerProfile.rentalRules.noAgeRestriction
                        ? "No age restriction"
                        : "Age restriction applies"}
                    </Typography>
                  </Box>

                  {/* Accepted Payment Methods */}
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
                    <Typography fontSize="1.1rem">
                      {carOwnerProfile.rentalRules.acceptedPaymentMethods}
                    </Typography>
                  </Box>
                </Box>
              </>
            )}
          </Box>
        </TabPanel>
      </div>
       {/* Floating Car Icons */}
       {Array.from({ length: 10 }).map((_, index) => (
        <motion.div
          key={`calendar-${index}`}
          className="absolute text-6xl opacity-20"
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
          <FaCar />
        </motion.div>
      ))}
       {Array.from({ length: 10 }).map((_, index) => (
        <motion.div
          key={`calendar-${index}`}
          className="absolute text-6xl opacity-20"
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
          <FaCar />
        </motion.div>
      ))}
    </div>
  );
}
