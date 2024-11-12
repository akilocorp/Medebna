import React, { useEffect, useState } from 'react';
import { Field, reduxForm, InjectedFormProps, FieldArray } from 'redux-form';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { addEvent } from '@/stores/operator/ApiCallerOperatorEvent';
import OperatorLayout from '@/components/operator/operatorLayout';
import jwt from 'jsonwebtoken';
import { CldUploadWidget } from 'next-cloudinary';
import { RiUploadCloudFill } from 'react-icons/ri';

interface EventPrice {
  type: string;
  ticketAvailable: number;
  price: number;
  status: string;
}

interface EventDetails {
  details: string;
  ticketInfo: string;
  additionalInfo: string;
  foodAndDrink: string;
}

interface FormValues {
  location: string;
  date: string;
  startTime: string;
  endTime: string;
  image: string;
  description: string;
  eventPrices: EventPrice[];
  eventDetails: EventDetails;
}

const validate = (values: FormValues) => {
  const errors: { [key in keyof FormValues]?: any } = {};

  if (!values.location) errors.location = 'Location is required';
  if (!values.date) errors.date = 'Date is required';
  if (!values.startTime) errors.startTime = 'Start time is required';
  if (!values.endTime) errors.endTime = 'End time is required';
  if (!values.image) errors.image = 'Image is required';
  if (!values.description) errors.description = 'Description is required';


  if (!values.eventPrices || values.eventPrices.length === 0) {
    errors.eventPrices = 'At least one event price is required';
  } else {
    const eventPricesArrayErrors: any[] = [];
    values.eventPrices.forEach((eventPrice, index) => {
      const eventPriceErrors: { [key in keyof EventPrice]?: string } = {};
      if (!eventPrice.type) eventPriceErrors.type = 'Ticket type is required';
      if (eventPrice.ticketAvailable === undefined || eventPrice.ticketAvailable === null) {
        eventPriceErrors.ticketAvailable = 'Tickets available is required';
      } else if (eventPrice.ticketAvailable <= 0) {
        eventPriceErrors.ticketAvailable = 'Tickets available must be greater than 0';
      }
      if (!eventPrice.status) eventPriceErrors.status = 'Status is required';
      if (eventPrice.price === undefined || eventPrice.price === null) {
        eventPriceErrors.price = 'Price is required';
      } else if (eventPrice.price <= 0) {
        eventPriceErrors.price = 'Price must be greater than 0';
      }
      if (Object.keys(eventPriceErrors).length > 0) {
        eventPricesArrayErrors[index] = eventPriceErrors;
      }
    });
    if (eventPricesArrayErrors.length > 0) {
      errors.eventPrices = eventPricesArrayErrors;
    }
  }

  // Ensure eventDetails is defined before accessing its properties
  if (!values.eventDetails) {
    errors.eventDetails = 'Event details are required';
  } else {
    const eventDetailsErrors: { [key in keyof EventDetails]?: string } = {};
    if (!values.eventDetails.details) eventDetailsErrors.details = 'Details are required';
    if (!values.eventDetails.ticketInfo) eventDetailsErrors.ticketInfo = 'Ticket info is required';
    if (!values.eventDetails.additionalInfo) eventDetailsErrors.additionalInfo = 'Additional info is required';
    if (!values.eventDetails.foodAndDrink) eventDetailsErrors.foodAndDrink = 'Food and drink info is required';
    if (Object.keys(eventDetailsErrors).length > 0) {
      errors.eventDetails = eventDetailsErrors;
    }
  }

  return errors;
};



const renderField = ({
  input,
  label,
  type,
  meta: { touched, error },
}: {
  input: any;
  label: string;
  type: string;
  meta: { touched: boolean; error?: string };
}) => (
  <div className="mb-6">
    <label className="block text-[#ff914d] mb-2 text-lg font-bold">{label}</label>
    <div className="relative">
      <input
        {...input}
        type={type}
        className="w-full p-3 rounded-full bg-[#ffffff] text-[#323232] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ff914d] focus:border-transparent shadow-md"
        placeholder={label}
      />
      {touched && error && <span className="text-red-500 text-sm mt-1 block">{error}</span>}
    </div>
  </div>
);

const renderSelectField = ({
  input,
  label,
  meta: { touched, error },
  children,
}: {
  input: any;
  label: string;
  meta: { touched: boolean; error?: string };
  children: React.ReactNode;
}) => (
  <div className="mb-6">
    <label className="block text-[#ff914d] mb-2 text-lg font-bold">{label}</label>
    <div className="relative">
      <select
        {...input}
        className="w-full p-3 rounded-full bg-[#ffffff] text-[#323232] focus:outline-none focus:ring-2 focus:ring-[#ff914d] focus:border-transparent shadow-md"
      >
        {children}
      </select>
      {touched && error && <span className="text-red-500 text-sm mt-1 block">{error}</span>}
    </div>
  </div>
);

const RenderImageUpload = ({ input, label }: any) => {
  const [imageUrl, setImageUrl] = useState<string | null>(input.value);

  const handleUpload = (result: any) => {
    if (result.event === 'success') {
      const imageUrl = result.info.secure_url;
      input.onChange(imageUrl);
      setImageUrl(imageUrl);
    }
  };

  return (
    <div className="relative mb-4">
      <label className="block text-[#ff914d] mb-2 text-lg font-bold">{label}</label>
      <CldUploadWidget
        uploadPreset="u06vgrf1" // Replace with your Cloudinary upload preset
        onSuccess={handleUpload}
      >
        {({ open }) => (
          <button
            type="button"
            className="block w-40 p-2 py-2 rounded-full border text-[#323232] border-[#fccc52] cursor-pointer flex items-center justify-center bg-[#ffffff] shadow-md"
            onClick={(e) => {
              e.preventDefault();
              open();
            }}
          >
            <RiUploadCloudFill className="mr-2 text-lg text-[#ff914d]" />
            {imageUrl ? 'Change Image' : 'Upload Image'}
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

const renderEventPriceFields = ({ fields }: { fields: any }) => (
  <div>
    {fields.map((eventPrice: any, index: number) => (
      <div key={index} className="mb-6 p-4 rounded-lg">
        <h4 className="text-lg font-bold mb-2 text-[#ff914d]">Event Price #{index + 1}</h4>
        <Field name={`${eventPrice}.type`} type="text" component={renderField} label="Ticket Type" />
        <Field name={`${eventPrice}.ticketAvailable`} type="number" component={renderField} label="Tickets Available" />
        <Field name={`${eventPrice}.price`} type="number" component={renderField} label="Price" />
        
        {/* Add status field */}
        <Field
          name={`${eventPrice}.status`}
          component={renderSelectField}
          label="Status"
        >
          <option value="">Select Status</option>
          <option value="available">Available</option>
          <option value="booked">Booked</option>
        </Field>

        <button
          type="button"
          onClick={() => fields.remove(index)}
          className="mt-2 bg-red-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-md"
        >
          Remove Event Price
        </button>
      </div>
    ))}
    <button
      type="button"
      onClick={() => fields.push({})}
      className="bg-[#fccc52] text-[#323232] px-4 py-2 mt-4 rounded-full font-bold text-lg shadow-md"
    >
      Add Event Price
    </button>
  </div>
);


const renderEventDetailsFields = () => (
  <div className="mb-6 p-4 rounded-lg">
    <h4 className="text-lg font-bold mb-4 text-[#ff914d]">Event Details</h4>
    <Field name="eventDetails.details" type="text" component={renderField} label="Details" />
    <Field name="eventDetails.ticketInfo" type="text" component={renderField} label="Ticket Info" />
    <Field name="eventDetails.additionalInfo" type="text" component={renderField} label="Additional Info" />
    <Field name="eventDetails.foodAndDrink" type="text" component={renderField} label="Food and Drink" />
  </div>
);

const AddEventForm: React.FC<InjectedFormProps<FormValues>> = ({ handleSubmit }) => {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const onSubmit = async (values: FormValues) => {
    if (!token) {
      toast.error("Token not found");
      return;
    }

    const decodedToken: any = jwt.decode(token);
    const userId = decodedToken?.id;
    if (!userId) {
      toast.error("Invalid token");
      return;
    }

    // Reformatting the values to match the desired structure
    const formattedValues = {
      events: {
        location: values.location,
        date: values.date,
        startTime: values.startTime,
        endTime: values.endTime,
        image: values.image,
        description: values.description,
       
      },
      eventPrices: (values.eventPrices || []).map((price) => ({
        ...price,
        price: parseFloat(price.price.toString()),
        ticketAvailable: parseInt(price.ticketAvailable.toString(), 10),
        status: price.status,
      })),
      eventDetails: {
        details: values.eventDetails.details,
        ticketInfo: values.eventDetails.ticketInfo,
        additionalInfo: values.eventDetails.additionalInfo,
        foodAndDrink: values.eventDetails.foodAndDrink,
      },
    };
    
    
    try {
      await addEvent(formattedValues, token);
      toast.success("Event added successfully");
      router.push("/event/View-Listings");
    } catch (error) {
      toast.error("Error adding event");
    }
  };


  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-2xl mx-auto mt-8 p-6 bg-[#ffffff] rounded-lg shadow-lg max-h-[42rem] overflow-y-scroll"
    >
    
      <Field name="location" component={renderField} type="text" label="Location" />
      <Field name="date" component={renderField} type="date" label="Date" />
      <Field name="startTime" component={renderField} type="time" label="Start Time" />
      <Field name="endTime" component={renderField} type="time" label="End Time" />
      <Field name="image" component={RenderImageUpload} label="Image URL" />
      <Field name="description" component={renderField} type="text" label="Description" />
     
      <FieldArray name="eventPrices" component={renderEventPriceFields} />
      {renderEventDetailsFields()}
      <div className="flex justify-end mt-6">
        <button
          type="submit"
          className="bg-[#ff914d] text-[#ffffff] px-6 py-3 rounded-full font-bold text-lg shadow-md"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

const ConnectedAddEventForm = reduxForm<FormValues>({
  form: 'addEvent',
  validate, // Add the validate function here
})(AddEventForm);


const AddEventPage = () => (
  <OperatorLayout>
    <h1 className="text-3xl text-center font-bold mb-8 text-[#ff914d]">Add Event</h1>
    <ConnectedAddEventForm />
  </OperatorLayout>
);

export default AddEventPage;
