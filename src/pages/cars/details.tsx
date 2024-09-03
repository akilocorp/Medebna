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
import { Button } from "@mui/material";
import { FaCar, FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { useSwipeable } from "react-swipeable";
import CartIcon from "@/components/carticon";
import { getCarListing } from "@/stores/operator/ApiCallerOperatorCar";
import { fetchCarOwnerProfileWithoutToken } from "@/stores/operator/carprofileapicaller";

interface CarCategory {
  popularFeatures: string[];
  safetyFeatures: string[];
  comfortFeatures: string[];
  entertainmentFeatures: string[];
}
interface CarProfile {
  features: keyof CarCategory;
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

interface Car {
  id: string;
  model: string;
  status: string;
}

interface CarType {
  _id: string;
  type: string;
  price: number;
  image: string;
  description: string;
  features: CarCategory;
  cars: Car[];
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
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

export default function ChooseCar() {
  const router = useRouter();
  const { carId, rentalName } = router.query;

  const [carTypes, setCarTypes] = useState<CarType[]>([]);
  const [filteredCars, setFilteredCars] = useState<CarType[]>([]);
  const [selectedCar, setSelectedCar] = useState<CarType | null>(null);
  const [value, setValue] = useState(0);
  const theme = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [numCars, setNumCars] = useState(1);
  const [carModel, setCarModel] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [carOwnerProfile, setCarOwnerProfile] = useState<CarOwnerProfile | null>(null);

  useEffect(() => {
    setIsMounted(true);

    if (carId) {
      fetchCarListingData(carId as string);
      fetchCarOwnerProfile(carId as string);
    }
  }, [carId]);

  const fetchCarListingData = async (id: string) => {
    setLoading(true);
    try {
      const response: CarType[] = await getCarListing(id); // Explicitly typing the response
      if (response && response.length > 0) {
        const carTypes = response
          .map((carObject: CarType) => {
            if (carObject.cars && carObject.cars.length > 0) {
              return carObject.cars.map((car: Car) => ({
                _id: carObject._id, // Include the _id field from carObject
                type: carObject.type || "Unknown Car Type",
                price: carObject.price || 0,
                image: carObject.image || "/assets/default-car.png",
                description: carObject.description || "No description available.",
                features: carObject.features || {}, // Assuming carDetails are features
                cars: carObject.cars,
              }));
            } else {
              console.error("Car data is missing or empty in one of the car objects.");
              return [];
            }
          })
          .flat(); // Flattening the array in case of nested arrays

        setCarTypes(carTypes as CarType[]); // Cast the result to CarType[]
        setFilteredCars(carTypes as CarType[]); // Cast the result to CarType[]
      } else {
        console.error("No car types found for this rental");
      }
    } catch (error) {
      console.error("Error fetching car listing data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCarOwnerProfile = async (id: string) => {
    setLoading(true);
    try {
      const profile = (await fetchCarOwnerProfileWithoutToken(id)) as CarOwnerProfile;
      if (profile) {
        setCarOwnerProfile(profile);
      } else {
        console.error("No car owner profile found for this ID");
      }
    } catch (error) {
      console.error("Error fetching car profile data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchTerm(searchValue);

    const filtered = carTypes.filter(
      (car) =>
        car.type.toLowerCase().includes(searchValue) ||
        car.description.toLowerCase().includes(searchValue)
    );

    setFilteredCars(filtered);
  };

  const handleCarClick = (car: CarType) => {
    setSelectedCar(car);
    setIsModalOpen(true);
  };

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  const handleAddToCart = () => {
    if (numCars < 1) {
      alert("Please enter a valid number of cars.");
      return;
    }

    if (!carModel) {
      alert("Please select a car model.");
      return;
    }

    setIsModalOpen(false);
    console.log("Car added to cart");
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => setValue((prev) => Math.min(prev + 1, 2)),
    onSwipedRight: () => setValue((prev) => Math.max(prev - 1, 0)),
  });

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
          <p className="text-[#fccc52] text-lg font-semibold">
            Loading, please wait...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#ffffff] min-h-screen text-[#000000]" {...handlers}>
      <AppBar position="static" style={{ backgroundColor: "#ffffff" }}>
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
              "& .MuiTabs-indicator": {
                backgroundColor: "#fccc52",
              },
              "& .MuiTab-root": {
                color: "black",
              },
              "& .Mui-selected": {
                color: "black",
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
                  value={searchTerm}
                  onChange={handleSearchChange}
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
                {filteredCars && filteredCars.length > 0 ? (
                  filteredCars.map((car, index) =>
                    car && car._id ? (
                      <div
                        key={car._id}
                        className="w-[320px] md:w-[350px] bg-[#ff914d] bg-opacity-5 rounded-3xl shadow-lg flex-shrink-0 transform transition duration-500 hover:scale-105 hover:shadow-2xl flex flex-col overflow-hidden cursor-pointer"
                        onClick={() => handleCarClick(car)}
                      >
                        <div className="w-full h-48 bg-gray-300 rounded-t-3xl overflow-hidden mb-4">
                          <img
                            src={car.image || "/assets/default-car.png"} // Use a default image if car.image is undefined
                            alt={car.type || "Car image"} // Provide a fallback alt text if car.type is undefined
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="px-6 py-4 flex justify-between w-full items-center">
                          <div>
                            <h3 className="text-xl font-extrabold text-gray-800 drop-shadow-md text-left">
                              {car.type || "Unknown Car Type"}{" "}
                              {/* Provide a fallback for car.type */}
                            </h3>
                            <p className="text-left mb-2 text-sm text-gray-600 drop-shadow-md">
                              {car.description || "No description available."}{" "}
                              {/* Provide a fallback for car.description */}
                            </p>
                            <p className="text-left mb-2 text-sm text-gray-600 drop-shadow-md">
                              ${car.price || "N/A"} per day{" "}
                              {/* Provide a fallback for car.price */}
                            </p>
                          </div>
                          <div className="text-3xl text-[#fccc52]">
                            <FaCar />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div key={index} className="text-red-500">
                        Invalid car data
                      </div>
                    )
                  )
                ) : (
                  <p>No cars available</p>
                )}
              </div>
            </div>

            {isModalOpen && selectedCar && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                  <h2 className="text-2xl drop-shadow-md font-bold text-[#fccc52] mb-4">
                    {selectedCar.type}
                  </h2>
                  <p className="mb-2 drop-shadow-md">
                    {selectedCar.description}
                  </p>
                  <p className="mb-4 drop-shadow-md">
                    ${selectedCar.price} per day
                  </p>

                  <div className="mb-4 text-[#fccc52]">
                    <label className="block text-sm mb-2 drop-shadow-md">
                      Number of Cars
                    </label>
                    <input
                      type="number"
                      value={numCars}
                      onChange={(e) => setNumCars(Number(e.target.value))}
                      className="rounded-full bg-gray-100 border-2 border-[#fccc52] shadow-lg text-[#323232] px-4 py-2 focus:outline-none focus:border-[#ff914d] hover:border-[#ff914d]"
                      required
                      min="1"
                    />
                  </div>

                  <div className="mb-4 text-[#fccc52]">
                    <label className="block text-sm drop-shadow-md mb-2">
                      Car Model
                    </label>
                    <select
                      value={carModel}
                      onChange={(e) => setCarModel(e.target.value)}
                      required
                      className="rounded-full bg-gray-100 border-2 border-[#fccc52] shadow-lg text-[#323232] px-4 py-2 focus:outline-none focus:border-[#ff914d] hover:border-[#ff914d]"
                    >
                      <option value="">Select Car Model</option>
                      {selectedCar.cars
                        .filter((car) => car.status === "available")
                        .map((car) => (
                          <option key={car.model} value={car.model}>
                            {car.model}
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
            </Box>
          )}
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
              Rental Information
            </Typography>

            {carOwnerProfile && (
              <>
                <Box display="flex" flexDirection="column" gap={4}>
                  <Box
                    p={4}
                    sx={{
                      backgroundColor: "#ffffff",
                      color: "#323232",
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
                  <Box
                    p={4}
                    sx={{
                      backgroundColor: "#ffffff",
                      color: "#323232",
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

                  <Box
                    p={4}
                    borderRadius="20px"
                    sx={{
                      backgroundColor: "#ffffff",
                      color: "#323232",
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
                    <Typography fontSize="1.1rem">
                      Until 12:00
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
                      Cancellation/ prepayment
                    </Typography>
                    <Typography fontSize="1rem">
                      {carOwnerProfile.rentalRules.cancellationPolicy}
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
                      Children and beds
                    </Typography>
                    <Typography fontSize="1.1rem">Child policies</Typography>
                    <Typography fontSize="1rem">
                      Children of any age are welcome.
                    </Typography>
                    <Typography fontSize="1rem">
                      {carOwnerProfile.rentalRules.additionalInfo}
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
                      No age restriction
                    </Typography>
                    <Typography fontSize="1.1rem">
                      {carOwnerProfile.rentalRules.noAgeRestriction
                        ? "No age restriction"
                        : "Age restriction applies"}
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
                      Accepted payment methods
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
    </div>
  );
}
