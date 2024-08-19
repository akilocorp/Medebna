import React, { useState, useEffect, ChangeEvent } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { addHotel } from "@/stores/operator/ApiCallerOperatorHotel";
import OperatorLayout from "@/components/operator/operatorLayout";
import jwt from "jsonwebtoken";
import { CldUploadWidget } from "next-cloudinary";
import { RiUploadCloudFill } from "react-icons/ri";

interface Room {
  roomNumber: string;
  status: string;
}

interface RoomType {
  type: string;
  price: string;
  image: string;
  description: string;
  numberOfGuests: string;
  rooms: Room[];
}

interface FormValues {
  roomTypes: RoomType[];
}

const AddHotelPage: React.FC = () => {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormValues>({
    roomTypes: [
      {
        type: '',
        price: '',
        image: '',
        description: '',
        numberOfGuests: '',
        rooms: [{ roomNumber: '', status: 'available' }],
      },
    ],
  });

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    index: number,
    field: keyof RoomType
  ) => {
    const value = e.target.type === "number" ? Number(e.target.value) : e.target.value;
    const updatedRoomTypes = [...formData.roomTypes];
    updatedRoomTypes[index] = {
      ...updatedRoomTypes[index],
      [field]: value,
    };
    setFormData({ roomTypes: updatedRoomTypes });
  };

  const handleRoomChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    roomIndex: number,
    field: keyof Room,
    typeIndex: number
  ) => {
    const updatedRoomTypes = [...formData.roomTypes];
    updatedRoomTypes[typeIndex].rooms[roomIndex] = {
      ...updatedRoomTypes[typeIndex].rooms[roomIndex],
      [field]: e.target.value,
    };
    setFormData({ roomTypes: updatedRoomTypes });
  };

  const handleAddRoomType = () => {
    setFormData({
      ...formData,
      roomTypes: [
        ...formData.roomTypes,
        {
          type: '',
          price: '',
          image: '',
          description: '',
          numberOfGuests: '',
          rooms: [{ roomNumber: '', status: 'available' }],
        },
      ],
    });
  };

  const handleAddRoom = (typeIndex: number) => {
    const updatedRoomTypes = [...formData.roomTypes];
    updatedRoomTypes[typeIndex].rooms.push({ roomNumber: '', status: 'available' });
    setFormData({ roomTypes: updatedRoomTypes });
  };

  const handleRemoveRoomType = (index: number) => {
    const updatedRoomTypes = formData.roomTypes.filter((_, i) => i !== index);
    setFormData({ roomTypes: updatedRoomTypes });
  };

  const handleRemoveRoom = (typeIndex: number, roomIndex: number) => {
    const updatedRoomTypes = [...formData.roomTypes];
    updatedRoomTypes[typeIndex].rooms = updatedRoomTypes[typeIndex].rooms.filter(
      (_, i) => i !== roomIndex
    );
    setFormData({ roomTypes: updatedRoomTypes });
  };

  const handleImageUpload = (imageUrl: string, index: number) => {
    setFormData((prevFormData) => {
      const updatedRoomTypes = prevFormData.roomTypes.map((roomType, i) => 
        i === index ? { ...roomType, image: imageUrl } : roomType
      );
      return { ...prevFormData, roomTypes: updatedRoomTypes };
    });
  };

  const validateForm = () => {
    for (const roomType of formData.roomTypes) {
      if (parseFloat(roomType.price) < 1) {
        toast.error("Price must be at least 1");
        return false;
      }
      if (parseInt(roomType.numberOfGuests, 10) < 1) {
        toast.error("Number of Guests must be at least 1");
        return false;
      }
    }
    return true;
  };

  const onSubmit = async () => {
    if (!token) {
      toast.error("Token not found");
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      const decodedToken: any = jwt.decode(token);
      const userId = decodedToken?.id;
      if (!userId) {
        toast.error("Invalid token");
        return;
      }

      const formattedValues = {
        ...formData,
        createdBy: userId,
        roomTypes: formData.roomTypes.map((roomType) => ({
          ...roomType,
          price: parseFloat(roomType.price),
          numberOfGuests: parseInt(roomType.numberOfGuests, 10),
          rooms: roomType.rooms.map((r) => ({
            ...r,
            status: r.status || "available",
          })),
        })),
      };

      console.log("Formatted Values: ", formattedValues);

      const response = await addHotel(formattedValues);
      console.log("API response:", response);
      toast.success("Hotel added successfully");
      router.push("/hotel/View-Listings");
    } catch (error) {
      console.error("Add hotel error:", error);
      toast.error("Error adding hotel");
    }
  };

  return (
    <OperatorLayout>
      <h1 className="text-3xl text-center font-bold mb-8 bg-gradient-to-r from-[#ff914d] to-[#fccc52] text-transparent bg-clip-text">
        Add Hotel
      </h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="max-w-3xl mx-auto mt-8 p-6 bg-[#ffffff] text-black rounded-lg shadow-lg max-h-[42rem] overflow-y-auto"
      >
        {formData.roomTypes.map((roomType, index) => (
          <div key={index} className="mb-6 p-4 rounded-lg">
            <h4 className="text-lg font-bold mb-2 text-[#ff914d]">
              Room Type #{index + 1}
            </h4>
            <input
              type="text"
              placeholder="Room Type"
              required
              value={roomType.type}
              onChange={(e) => handleInputChange(e, index, 'type')}
              className="w-full p-3 mb-3 rounded-full bg-[#ffffff] text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#ff914d] shadow-md"
            />
            <input
              type="number"
              placeholder="Price"
              required
              min={1}
              value={roomType.price}
              onChange={(e) => handleInputChange(e, index, 'price')}
              className="w-full p-3 mb-3 rounded-full bg-[#ffffff] text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#ff914d] shadow-md"
            />
            <RenderImageUpload
              key={`image-upload-${index}`}
              input={{
                value: roomType.image,
                onChange: (url: string) => handleImageUpload(url, index),
              }}
              label="Room Image"
              widgetParams={{ uploadPreset: "u06vgrf1" }}
            />
            <input
              type="text"
              placeholder="Description"
              required
              value={roomType.description}
              onChange={(e) => handleInputChange(e, index, 'description')}
              className="w-full p-3 mb-3 rounded-full bg-[#ffffff] text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#ff914d] shadow-md"
            />
            <input
              type="number"
              placeholder="Number of Guests"
              required
              min={1}
              value={roomType.numberOfGuests}
              onChange={(e) => handleInputChange(e, index, 'numberOfGuests')}
              className="w-full p-3 mb-3 rounded-full bg-[#ffffff] text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#ff914d] shadow-md"
            />
            <div>
              <h4 className="text-lg font-bold mb-2 text-[#ff914d]">Rooms</h4>
              {roomType.rooms.map((room, roomIndex) => (
                <div key={roomIndex} className="mb-4">
                  <input
                    type="text"
                    placeholder="Room Number"
                    required
                    min={1}
                    value={room.roomNumber}
                    onChange={(e) => handleRoomChange(e, roomIndex, 'roomNumber', index)}
                    className="w-full p-3 mb-3 rounded-full bg-[#ffffff] text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#ff914d] shadow-md"
                  />
                  <select
                    value={room.status}
                    onChange={(e) => handleRoomChange(e, roomIndex, 'status', index)}
                    className="w-full p-3 mb-3 rounded-full bg-[#ffffff] text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#ff914d] shadow-md"
                  >
                    <option value="available">Available</option>
                    <option value="booked">Booked</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => handleRemoveRoom(index, roomIndex)}
                    className="mt-3 bg-red-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-md"
                  >
                    Remove Room
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => handleAddRoom(index)}
                className="bg-[#ff914d] text-[#ffffff] px-6 py-2 mt-6 rounded-full font-bold text-lg shadow-md"
              >
                Add Room
              </button>
            </div>
            <button
              type="button"
              onClick={() => handleRemoveRoomType(index)}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-md"
            >
              Remove Room Type
            </button>
          </div>
        ))}
        
        <div className="flex justify-end mt-6">
          <button
            type="submit"
            className="bg-[#ff914d] text-[#ffffff] px-6 py-3 rounded-full font-bold text-lg shadow-md"
          >
            Submit
          </button>
        </div>
      </form>
    </OperatorLayout>
  );
};

interface RenderImageUploadProps {
  input: {
    value: string;
    onChange: (url: string) => void;
  };
  label: string;
  widgetParams: {
    uploadPreset: string;
  };
}

const RenderImageUpload: React.FC<RenderImageUploadProps> = ({
  input: { value, onChange },
  label,
  widgetParams,
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(value);

  const handleUpload = (result: any) => {
    if (result.event === "success") {
      const imageUrl = result.info.secure_url;
      onChange(imageUrl);
      setImageUrl(imageUrl);
    }
  };

  return (
    <div className="relative mb-4">
      <label className="block text-[#ff914d] mb-2 text-lg font-bold">
        {label}
      </label>
      <CldUploadWidget
        uploadPreset={widgetParams.uploadPreset}
        onSuccess={handleUpload}
      >
        {({ open }) => (
          <button
            type="button"
            className="block w-40 p-2 py-2 rounded-full border text-gray-300 border-[#ff914d] cursor-pointer flex items-center justify-center bg-[#ffffff] shadow-md"
            onClick={(e) => {
              e.preventDefault();
              open();
            }}
          >
            <RiUploadCloudFill className="mr-2 text-lg text-[#ff914d]" />
            {imageUrl ? "Change Image" : "Upload Image"}
          </button>
        )}
      </CldUploadWidget>
      {imageUrl && (
        <div className="mt-4">
          <img src={imageUrl} alt="Preview" className="w-32 h-32 rounded-lg shadow-md" />
        </div>
      )}
    </div>
  );
};

export default AddHotelPage;
