import React, { useState } from 'react';
import { Field, reduxForm, InjectedFormProps, FieldArray } from 'redux-form';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { addCarRental } from '@/stores/operator/ApiCallerOperatorCar';
import OperatorLayout from '@/components/operator/operatorLayout';

interface Car {
  numberOfCars: number;
  type: string;
  price: number;
  image: string;
  description: string;
  status: string;
}

interface CarDetails {
  details: string;
  rentalInfo: string;
  additionalInfo: string;
  language: string;
}

interface RentalRules {
  rentalDuration: string;
  cancellationPolicy: string;
  prepayment: boolean;
  noAgeRestriction: boolean;
  additionalInfo: string;
  acceptedPaymentMethods: string;
}

interface FormValues {
  rating: string;
  cars: Car[];
  carDetails: CarDetails;
  rentalRules: RentalRules;
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

const renderCarFields = ({ fields }: { fields: any }) => (
  <div>
    {fields.map((car: any, index: number) => (
      <div key={index} className="mb-6 p-4 rounded-lg">
        <h4 className="text-lg font-bold mb-2 text-[#fccc52]">Car #{index + 1}</h4>
        <Field name={`${car}.numberOfCars`} type="number" component={renderField} label="Number of Cars" />
        <Field name={`${car}.type`} type="text" component={renderField} label="Car Type" />
        <Field name={`${car}.price`} type="number" component={renderField} label="Price" />
        <Field name={`${car}.image`} type="text" component={renderField} label="Image URL" />
        <Field name={`${car}.description`} type="text" component={renderField} label="Description" />
        <Field name={`${car}.status`} component="select" className="w-full p-3 rounded-full bg-[#323232] text-white focus:outline-none focus:ring-2 focus:ring-[#fccc52] focus:border-transparent shadow-md">
          <option value="Available">Available</option>
          <option value="Rented">Rented</option>
        </Field>
        <button
          type="button"
          onClick={() => fields.remove(index)}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-md"
        >
          Remove Car
        </button>
      </div>
    ))}
    <button
      type="button"
      onClick={() => fields.push({})}
      className="bg-[#fccc52] text-[#323232] px-4 py-2 mt-6 rounded-full font-bold text-lg shadow-md"
    >
      Add Car
    </button>
  </div>
);

const renderCarDetailsFields = () => (
  <div className="mb-6 p-4 rounded-lg">
    <h4 className="text-lg font-bold mb-4 text-white">Car Details</h4>
    <Field name="carDetails.details" type="text" component={renderField} label="Details" />
    <Field name="carDetails.rentalInfo" type="text" component={renderField} label="Rental Info" />
    <Field name="carDetails.additionalInfo" type="text" component={renderField} label="Additional Info" />
    <Field name="carDetails.language" type="text" component={renderField} label="Language" />
  </div>
);

const renderRentalRulesFields = () => (
  <div className="mb-6 p-4 rounded-lg">
    <h4 className="text-lg font-bold mb-4 text-white">Rental Rules</h4>
    <Field name="rentalRules.rentalDuration" type="text" component={renderField} label="Rental Duration" />
    <Field name="rentalRules.cancellationPolicy" type="text" component={renderField} label="Cancellation Policy" />
    <Field name="rentalRules.prepayment" type="checkbox" component={renderField} label="Prepayment Required" />
    <Field name="rentalRules.noAgeRestriction" type="checkbox" component={renderField} label="No Age Restriction" />
    <Field name="rentalRules.additionalInfo" type="text" component={renderField} label="Additional Info" />
    <Field name="rentalRules.acceptedPaymentMethods" type="text" component={renderField} label="Accepted Payment Methods" />
  </div>
);

const MultiStepForm: React.FC<InjectedFormProps<FormValues>> = ({ handleSubmit }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const router = useRouter();

  const nextStep = () => setCurrentStep(currentStep + 1);
  const previousStep = () => setCurrentStep(currentStep - 1);

  const onSubmit = async (values: FormValues) => {
    const formattedValues = {
      ...values,
      rating: parseFloat(values.rating),
      cars: values.cars.map((car) => ({
        ...car,
        price: parseFloat(car.price.toString()),
        numberOfCars: parseInt(car.numberOfCars.toString(), 10),
      })),
    };

    try {
      await addCarRental(formattedValues);
      toast.success("Car rental added successfully");
      router.push("/operator/view-cars");
    } catch (error) {
      toast.error("Error adding car rental");
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <Field name="rating" component={renderField} type="number" label="Rating" />
          </>
        );
      case 2:
        return (
          <div className='overflow-y-auto max-h-96'>
            <FieldArray name="cars" component={renderCarFields} />
          </div>
        );
      case 3:
        return (
          <div className='overflow-y-auto max-h-96'>
            {renderCarDetailsFields()}
          </div>
        );
      case 4:
        return (
          <div className='overflow-y-auto max-h-96'>
            {renderRentalRulesFields()}
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
        {currentStep < 4 ? (
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

const ConnectedMultiStepForm = reduxForm<FormValues>({
  form: 'addCarRental',
})(MultiStepForm);

const AddCarRentalPage = () => (
  <OperatorLayout>
    <h1 className="text-3xl text-center font-bold mb-8 text-[#fccc52]">Add Car Rental</h1>
    <ConnectedMultiStepForm />
  </OperatorLayout>
);

export default AddCarRentalPage;
