import React, { useState, useEffect } from 'react';
import { Field, reduxForm, InjectedFormProps, FieldArray } from 'redux-form';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { addCarRental } from '@/stores/operator/ApiCallerOperatorCar';
import OperatorLayout from '@/components/operator/operatorLayout';
import { CldUploadWidget } from 'next-cloudinary';
import { RiUploadCloudFill } from 'react-icons/ri';
import jwt from 'jsonwebtoken';

interface Car {
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
}

interface FormValues {
  cars: Car[];
  carDetails: CarDetails;
  numberOfCars: number;
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
    <label className="block text-[#ff914d] mb-2 text-lg font-bold">{label}</label>
    <div className="relative">
      <input
        {...input}
        type={type}
        className="w-full p-3 rounded-full bg-[#ffffff] text-[#323232] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#fccc52] focus:border-transparent shadow-md"
        placeholder={label}
      />
      {touched && error && <span className="text-red-500 text-sm mt-1 block">{error}</span>}
    </div>
  </div>
);

const RenderImageUpload = ({ input, label }: any) => {
  const [imageUrl, setImageUrl] = useState<string | null>(input.value);

  const handleUpload = (result: any) => {
    if (result.event === "success") {
      const imageUrl = result.info.secure_url;
      input.onChange(imageUrl);
      setImageUrl(imageUrl);
    }
  };

  return (
    <div className="relative mb-4">
      <label className="block text-[#ff914d] mb-2 text-lg font-bold">{label}</label>
      <CldUploadWidget
        uploadPreset="u06vgrf1" // your upload preset here
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

const RenderCarFields = ({ fields }: { fields: any }) => {
  useEffect(() => {
    if (fields.length === 0) {
      fields.push({});
    }
  }, [fields]);

  return (
    <div>
      {fields.map((car: any, index: number) => (
        <div key={index} className="mb-6 p-4 rounded-lg bg-[#ffffff] ">
          <h4 className="text-lg font-bold mb-2 text-[#ff914d]">Car #{index + 1}</h4>
          <Field name={`${car}.type`} type="text" component={renderField} label="Car Type" validate={[required]} />
          <Field name={`${car}.price`} type="number" component={renderField} label="Price" validate={[required, number]} />
          <Field name={`${car}.image`} component={RenderImageUpload} label="Image URL" />
          <Field name={`${car}.description`} type="text" component={renderField} label="Description" validate={[required]} />
          <Field name={`${car}.status`} component="select" className="w-full p-3 rounded-full bg-[#ffffff] text-[#323232] focus:outline-none focus:ring-2 focus:ring-[#fccc52] focus:border-transparent shadow-md" validate={[required]}>
            <option value="" disabled>Select Status</option>
            <option value="available">Available</option>
            <option value="booked">Booked</option>
          </Field>
        </div>
      ))}
    </div>
  );
};

const renderCarDetailsFields = () => (
  <div className="mb-6 p-4 rounded-lg bg-[#ffffff] ">
    <h4 className="text-lg font-bold mb-4 text-[#ff914d]">Car Details</h4>
    <Field name="carDetails.details" type="text" component={renderField} label="Details" />
    <Field name="carDetails.rentalInfo" type="text" component={renderField} label="Rental Info" />
    <Field name="carDetails.additionalInfo" type="text" component={renderField} label="Additional Info" />
  </div>
);

const required = (value: any) => (value ? undefined : 'This field is required');
const number = (value: any) => (isNaN(Number(value)) ? 'Must be a number' : undefined);

const CarRentalForm: React.FC<InjectedFormProps<FormValues>> = ({ handleSubmit }) => {
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

    const formattedValues = {
        createdBy: userId,
        numberOfCars: values.numberOfCars,
        cars: values.cars.map((car) => ({
            ...car,
            price: parseFloat((car.price ?? 0).toString()),
            numberOfCars: values.numberOfCars,
        })),
        carDetails: values.carDetails,
    };

    try {
        await addCarRental(formattedValues, token);
        toast.success("Car rental added successfully");
        router.push("/car/View-Listings");
    } catch (error) {
        toast.error("Error adding car rental");
    }
};


  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto mt-8 p-6 bg-[#ffffff] rounded-lg  max-h-[42rem] overflow-y-scroll">
      <Field name="numberOfCars" component={renderField} type="number" label="Number of Cars" validate={[required, number]} />
      <FieldArray name="cars" component={RenderCarFields} />
      {renderCarDetailsFields()}
      <div className="flex justify-end mt-6">
        <button
          type="submit"
          className="bg-[#fccc52] text-[#ffffff] px-6 py-3 rounded-full font-bold text-lg shadow-md"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

const ConnectedCarRentalForm = reduxForm<FormValues>({
  form: 'addCarRental',
})(CarRentalForm);

const AddCarRentalPage = () => (
  <OperatorLayout>
    <h1 className="text-3xl text-center font-bold mb-8 text-[#ff914d]">Add Car Rental</h1>
    <ConnectedCarRentalForm />
  </OperatorLayout>
);

export default AddCarRentalPage;
