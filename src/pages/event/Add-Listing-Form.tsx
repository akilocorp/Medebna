import React, { useState } from 'react';
import { Field, reduxForm, InjectedFormProps, FieldArray } from 'redux-form';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { addEvent } from '@/stores/operator/ApiCallerOperatorEvent';
import OperatorLayout from '@/components/operator/operatorLayout';

interface EventPrice {
  type: string;
  ticketAvailable: number;
  price: number;
}

interface EventDetails {
  details: string;
  ticketInfo: string;
  additionalInfo: string;
  foodAndDrink: string;
}

interface EventRules {
  checkIn: string;
  checkOut: string;
  cancellationPolicy: string;
  prepayment: boolean;
  noAgeRestriction: boolean;
  pets: boolean;
  additionalInfo: string;
  acceptedPaymentMethods: string;
}

interface FormValues {
  rating: string;
  location: string;
  date: string;
  startTime: string;
  endTime: string;
  image: string;
  description: string;
  status: string;
  eventPrices: EventPrice[];
  eventDetails: EventDetails;
  eventRules: EventRules;
}


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
    <label className="block text-[#fccc52] mb-2 text-lg font-bold">{label}</label>
    <div className="relative">
      <input
        {...input}
        type={type}
        className="w-full p-3 rounded-full bg-[#323232] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#fccc52] focus:border-transparent shadow-md"
        placeholder={label}
      />
      {touched && error && <span className="text-red-500 text-sm mt-1 block">{error}</span>}
    </div>
  </div>
);

const renderEventPriceFields = ({ fields }: { fields: any }) => (
  <div>
    {fields.map((eventPrice: any, index: number) => (
      <div key={index} className="mb-6 p-4 rounded-lg">
        <h4 className="text-lg font-bold mb-2 text-[#fccc52]">Event Price #{index + 1}</h4>
        <Field name={`${eventPrice}.type`} type="text" component={renderField} label="Ticket Type" />
        <Field name={`${eventPrice}.ticketAvailable`} type="number" component={renderField} label="Tickets Available" />
        <Field name={`${eventPrice}.price`} type="number" component={renderField} label="Price" />
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
    <h4 className="text-lg font-bold mb-4 text-white">Event Details</h4>
    <Field name="eventDetails.details" type="text" component={renderField} label="Details" />
    <Field name="eventDetails.ticketInfo" type="text" component={renderField} label="Ticket Info" />
    <Field name="eventDetails.additionalInfo" type="text" component={renderField} label="Additional Info" />
    <Field name="eventDetails.foodAndDrink" type="text" component={renderField} label="Food and Drink" />
  </div>
);

const renderEventRulesFields = () => (
  <div className="mb-6 p-4 rounded-lg">
    <h4 className="text-lg font-bold mb-4 text-white">Event Rules</h4>
    <Field name="eventRules.checkIn" type="text" component={renderField} label="Check-In Time" />
    <Field name="eventRules.checkOut" type="text" component={renderField} label="Check-Out Time" />
    <Field name="eventRules.cancellationPolicy" type="text" component={renderField} label="Cancellation Policy" />
    <div className="flex items-center mb-4">
      <Field name="eventRules.prepayment" type="checkbox" component="input" />
      <label className="ml-2 text-[#fccc52]">Prepayment Required</label>
    </div>
    <div className="flex items-center mb-4">
      <Field name="eventRules.noAgeRestriction" type="checkbox" component="input" />
      <label className="ml-2 text-[#fccc52]">No Age Restriction</label>
    </div>
    <div className="flex items-center mb-4">
      <Field name="eventRules.pets" type="checkbox" component="input" />
      <label className="ml-2 text-[#fccc52]">Pets Allowed</label>
    </div>
    <Field name="eventRules.additionalInfo" type="text" component={renderField} label="Additional Info" />
    <Field name="eventRules.acceptedPaymentMethods" type="text" component={renderField} label="Accepted Payment Methods" />
  </div>
);

const AddEventForm: React.FC<InjectedFormProps<FormValues>> = ({ handleSubmit }) => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);

  const nextStep = () => setCurrentStep(currentStep + 1);
  const previousStep = () => setCurrentStep(currentStep - 1);

  const onSubmit = async (values: FormValues) => {
    const formattedValues = {
      ...values,
      rating: parseFloat(values.rating),
      eventPrices: (values.eventPrices || []).map((price) => ({
        ...price,
        price: parseFloat(price.price.toString()),
        ticketAvailable: parseInt(price.ticketAvailable.toString(), 10),
      })),
    };
  
    try {
      await addEvent(formattedValues);
      toast.success("Event added successfully");
      router.push("/operator/view-events");
    } catch (error) {
      toast.error("Error adding event");
    }
  };
  

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <Field name="rating" component={renderField} type="number" label="Rating" />
            <Field name="location" component={renderField} type="text" label="Location" />
            <Field name="date" component={renderField} type="date" label="Date" />
            <Field name="startTime" component={renderField} type="time" label="Start Time" />
          </>
        );
      case 2:
        return (
          <>
            <Field name="endTime" component={renderField} type="time" label="End Time" />
            <Field name="image" component={renderField} type="text" label="Image URL" />
            <Field name="description" component={renderField} type="text" label="Description" />
            <Field name="status" component={renderField} type="text" label="Status" />
          </>
        );
      case 3:
        return (
          <div className="overflow-y-auto max-h-96">
            <FieldArray name="eventPrices" component={renderEventPriceFields} />
          </div>
        );
      case 4:
        return (
          <div className="overflow-y-auto max-h-96">
            {renderEventDetailsFields()}
          </div>
        );
      case 5:
        return (
          <div className="overflow-y-auto max-h-96">
            {renderEventRulesFields()}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto mt-8 p-6 bg-[#1a1a1a] rounded-lg shadow-lg">
      {renderStep()}
      <div className="flex justify-between mt-6">
        {currentStep > 1 && (
          <button
            type="button"
            onClick={previousStep}
            className="bg-[#fccc52] text-[#323232] px-6 py-3 rounded-full font-bold text-lg shadow-md"
          >
            Previous
          </button>
        )}
        {currentStep < 5 ? (
          <button
            type="button"
            onClick={nextStep}
            className="bg-[#fccc52] text-[#323232] px-6 py-3 rounded-full font-bold text-lg shadow-md"
          >
            Next
          </button>
        ) : (
          <button
            type="submit"
            className="bg-[#fccc52] text-[#323232] px-6 py-3 rounded-full font-bold text-lg shadow-md"
          >
            Submit
          </button>
        )}
      </div>
    </form>
  );
};

const ConnectedAddEventForm = reduxForm<FormValues>({
  form: 'addEvent',
})(AddEventForm);

const AddEventPage = () => (
  <OperatorLayout>
    <h1 className="text-3xl text-center font-bold mb-8 text-[#fccc52]">Add Event</h1>
    <ConnectedAddEventForm />
  </OperatorLayout>
);

export default AddEventPage;
