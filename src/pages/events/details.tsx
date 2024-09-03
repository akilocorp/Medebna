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
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaTicketAlt, FaInfoCircle, FaConciergeBell, FaUserFriends, FaHandHoldingHeart, FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { useSwipeable } from "react-swipeable";
import CartIcon from "@/components/carticon";
import { getAllEvent } from "@/stores/operator/ApiCallerOperatorEvent";
import { fetchEventOwnerProfile } from "@/stores/operator/eventprofileapicaller";

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
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

export default function EventDetailsPage() {
  const router = useRouter();
  const { eventCompanyId, eventCompanyName } = router.query;

  const [eventDetails, setEventDetails] = useState<any[]>([]);
  const [filteredEventDetails, setFilteredEventDetails] = useState<any[]>([]);
  const [eventPrices, setEventPrices] = useState<any[]>([]);
  const [additionalDetails, setAdditionalDetails] = useState<any>(null);
  const [eventOwnerProfile, setEventOwnerProfile] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ticketCount, setTicketCount] = useState(1);
  const [value, setValue] = useState(0);
  const theme = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof eventCategories>("event_Details");
  const [searchTerm, setSearchTerm] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    if (eventCompanyId) {
      fetchEventDetailsData(eventCompanyId as string);
      fetchEventOwnerProfileData(eventCompanyId as string);
    }
  }, [eventCompanyId]);

  const fetchEventDetailsData = async (id: string) => {
    try {
        const response = await getAllEvent(id);
        
        // Assuming response is an array of events
        if (response && Array.isArray(response) && response.length > 0) {
            const event = response[0]; // Access the first event in the array
            
            if (event) {
                setEventDetails([event.events]);
                setFilteredEventDetails([event.events]); // Initially show all events
                setEventPrices(event.eventPrices);
                setAdditionalDetails(event.eventDetails);
            }
        } else {
            console.error("Unexpected response structure:", response);
        }
    } catch (error) {
        console.error("Error fetching event details:", error);
    }
};



  const fetchEventOwnerProfileData = async (id: string) => {
    try {
      const profile = await fetchEventOwnerProfile(id);
      if (profile) {
        setEventOwnerProfile(profile);
      }
    } catch (error) {
      console.error("Error fetching event owner profile:", error);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchTerm(searchValue);

    const filtered = eventDetails.filter((detail: any) =>
      detail.location.toLowerCase().includes(searchValue) ||
      detail.description.toLowerCase().includes(searchValue)
    );

    setFilteredEventDetails(filtered);
  };

  const handleImageClick = () => {
    setIsModalOpen(true);
  };

  const handleAddToCart = () => {
    if (ticketCount < 1) {
      alert("Please enter a valid number of tickets.");
      return;
    }

    console.log("Added to cart.", eventDetails);
    setIsModalOpen(false);
  };

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

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

  const handlers = useSwipeable({
    onSwipedLeft: () => setValue((prev) => Math.min(prev + 1, 2)),
    onSwipedRight: () => setValue((prev) => Math.max(prev - 1, 0)),
  });

  if (!isMounted) {
    return null;
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
              <a className="inline-flex items-center bg-gradient-to-r from-[#fccc52] to-[#ff914d] text-[#323232] mb-8 px-4 py-2 bg-[#ff914d] bg-opacity-90 rounded-lg hover:bg-[#fccc52] hover:text-[#ffffff] transition-colors duration-300">
                <IoChevronBack className="mr-2 text-2xl" />
              </a>
            </Link>
          </div>
          <div className="w-full max-w-8xl p-4 flex flex-col items-center">
            <div className="flex flex-col items-center text-center py-4 px-10">
              <h1 className="text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#fccc52] to-[#ff914d] drop-shadow-md mb-8">
                {eventCompanyName}
              </h1>
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
          <main className="bg-[#ffffff] text-[#323232] p-8 flex flex-col items-center">
            <div className="w-full max-w-6xl flex flex-col items-center">
              {filteredEventDetails.length > 0 ? (
                filteredEventDetails.map((detail: any) => (
                  <div
                    key={detail._id}
                    className="w-[320px] md:w-[350px] bg-[#ff914d] bg-opacity-5 rounded-3xl shadow-lg flex-shrink-0 flex flex-col overflow-hidden cursor-pointer"
                    onClick={handleImageClick}
                  >
                    <div className="w-[320px] md:w-[350px] h-64 bg-gray-300 rounded-t-3xl overflow-hidden mb-4">
                      <img
                        src={detail.image}
                        alt={detail.location}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="px-6 py-4 flex justify-between w-full items-center">
                      <div>
                        <h3 className="text-xl font-extrabold text-gray-800 drop-shadow-md text-left">
                          {detail.location}
                        </h3>
                        <p className="text-left mb-2 text-sm text-gray-600 drop-shadow-md">
                          {new Date(detail.date).toLocaleDateString()}, {detail.startTime} - {detail.endTime}
                        </p>
                        <p className="text-left mb-2 text-sm text-gray-600 drop-shadow-md">
                          {detail.description}
                        </p>
                      </div>
                      <div className="text-3xl text-[#fccc52]">
                        <FaTicketAlt />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>No events match your search.</p>
              )}

              {isModalOpen && eventDetails && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                  <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                    <h2 className="text-2xl drop-shadow-md font-bold text-[#fccc52] mb-4">{filteredEventDetails[0].location}</h2>
                    <p className="mb-2 drop-shadow-md">{filteredEventDetails[0].description}</p>
                    
                    {/* Assuming eventPrices is an array of objects */}
                    {Array.isArray(eventPrices) ? (
                      eventPrices.map((price, index) => (
                        <p key={index} className="mb-4 drop-shadow-md">
                          ${price.price} per ticket
                        </p>
                      ))
                    ) : (
                      <p className="mb-4 drop-shadow-md">No price information available</p>
                    )}

                    <div className="mb-4 text-[#fccc52]">
                      <label className="block text-sm mb-2 drop-shadow-md">
                        Number of tickets
                      </label>
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
                  {renderStars(eventOwnerProfile.rating)}
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
                    <Typography fontSize="1.1rem">{eventOwnerProfile.eventRules.checkIn}</Typography>
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
                    <Typography fontSize="1.1rem">Until {eventOwnerProfile.eventRules.checkOut}</Typography>
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
                    <Typography fontSize="1.1rem">
                      Prepayment: {eventOwnerProfile.eventRules.prepayment ? "Required" : "Not Required"}
                    </Typography>
                    <Typography fontSize="1rem">
                      {eventOwnerProfile.eventRules.cancellationPolicy}
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
                      Additional Information
                    </Typography>
                    <Typography fontSize="1rem">
                      {eventOwnerProfile.eventRules.additionalInfo}
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
                      No age restriction
                    </Typography>
                    <Typography fontSize="1.1rem">{eventOwnerProfile.eventRules.noAgeRestriction ? "No age restriction" : "Age restriction applies"}</Typography>
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
                    <Typography fontSize="1.1rem">{eventOwnerProfile.eventRules.pets ? "Pets allowed" : "Pets not allowed"}</Typography>
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
                    <Typography fontSize="1.1rem">
                      {eventOwnerProfile.eventRules.acceptedPaymentMethods}
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
