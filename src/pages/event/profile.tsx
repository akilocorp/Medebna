import React, { useState } from 'react';
import { Field, reduxForm, InjectedFormProps } from 'redux-form';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { addEventOwnerProfile } from '@/stores/operator/eventprofileapicaller';
import OperatorLayout from '@/components/operator/operatorLayout';
import { CldUploadWidget } from 'next-cloudinary';
import { RiUploadCloudFill } from 'react-icons/ri';

interface FormValues {
  address: string;
  rating: number;
  zipCode: string;
  city: string;
  companyImage: string;
  description: string;
  checkIn: string;
  checkOut: string;
  cancellationPolicy: string;
  prepayment: boolean;
  noAgeRestriction: boolean;
  pets: boolean;
  additionalInfo: string;
  acceptedPaymentMethods: string;
}

const validate = (values: FormValues) => {
  const errors: { [key in keyof FormValues]?: string } = {};

  if (!values.address) errors.address = 'Address is required';
  if (values.rating === undefined || values.rating === null) errors.rating = 'Rating is required';
  if (!values.zipCode) errors.zipCode = 'Zip Code is required';
  if (!values.city) errors.city = 'City is required';
  if (!values.companyImage) errors.companyImage = 'Company Image URL is required';
  if (!values.description) errors.description = 'Description is required';
  if (!values.checkIn) errors.checkIn = 'Check-in time is required';
  if (!values.checkOut) errors.checkOut = 'Check-out time is required';
  if (!values.cancellationPolicy) errors.cancellationPolicy = 'Cancellation Policy is required';
  if (!values.acceptedPaymentMethods) errors.acceptedPaymentMethods = 'Accepted Payment Methods are required';

  return errors;
};

const renderField = ({
  input,
  label,
  type,
  meta: { touched, error },
}: any) => (
  <div className="mb-6">
    <label className="block text-[#ff914d] mb-2 text-lg font-semibold">{label}</label>
    <div className="relative">
      <input
        {...input}
        type={type}
        className="w-full p-4 rounded-lg bg-gray-100 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ff914d] focus:border-transparent shadow-sm transition ease-in-out duration-300"
        placeholder={label}
      />
      {touched && error && <span className="text-red-500 text-sm mt-1 block">{error}</span>}
    </div>
  </div>
);

const renderCheckboxField = ({
  input,
  label,
  type,
  meta: { touched, error },
}: any) => (
  <div className="flex items-center mb-6">
    <input
      {...input}
      type={type}
      className="w-5 h-5 text-[#ff914d] border-gray-300 rounded focus:ring-[#ff914d] transition ease-in-out duration-300"
    />
    <label className="ml-3 text-[#ff914d] text-lg font-semibold">{label}</label>
    {touched && error && <span className="text-red-500 text-sm mt-1 block ml-3">{error}</span>}
  </div>
);

const RenderImageUpload = ({
  input: { value, onChange },
  label,
  widgetParams,
  meta: { touched, error },
}: {
  input: any;
  label: string;
  widgetParams: any;
  meta: { touched: boolean; error?: string };
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
            className="block w-40 p-2 py-2 rounded border text-black border-[#ff914d] cursor-pointer flex items-center justify-center bg-[#ffffff] hover:bg-[#fccc52]"
            onClick={() => open()}
          >
            <RiUploadCloudFill className="mr-2 text-lg" />
            {imageUrl ? "Change Image" : "Upload Image"}
          </button>
        )}
      </CldUploadWidget>
      {imageUrl && (
        <div className="mt-4">
          <img src={imageUrl} alt="Preview" className="w-32 h-32 rounded" />
        </div>
      )}
      {touched && error && (
        <span className="text-red-500 text-xs absolute -bottom-4 left-0 right-0">
          {error}
        </span>
      )}
    </div>
  );
};

const AddEventOwnerProfileForm: React.FC<InjectedFormProps<FormValues>> = ({ handleSubmit }) => {
  const router = useRouter();

  const onSubmit = async (values: FormValues) => {
    try {
      const profileData = {
        address: values.address,
        rating: values.rating,
        zipCode: values.zipCode,
        city: values.city,
        companyImage: values.companyImage,
        description: values.description,
        eventRules: {
          checkIn: values.checkIn,
          checkOut: values.checkOut,
          cancellationPolicy: values.cancellationPolicy,
          prepayment: values.prepayment,
          noAgeRestriction: values.noAgeRestriction,
          pets: values.pets,
          additionalInfo: values.additionalInfo,
          acceptedPaymentMethods: values.acceptedPaymentMethods,
        },
      };

      await addEventOwnerProfile(profileData);
      toast.success('Event owner profile added successfully');
      router.push('/event/myprofile');
    } catch (error) {
      toast.error('Error adding event owner profile');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl mx-auto p-8 bg-white max-h-[42rem]  overflow-y-scroll rounded-lg shadow-lg">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Field name="address" component={renderField} type="text" label="Address" />
        <Field name="rating" component={renderField} type="number" label="Rating" />
        <Field name="zipCode" component={renderField} type="text" label="Zip Code" />
        <Field name="city" component={renderField} type="text" label="City" />
        <Field
          name="companyImage"
          component={RenderImageUpload}
          label="Company Image"
          widgetParams={{ uploadPreset: "u06vgrf1" }}
        />
        <Field name="description" component={renderField} type="text" label="Description" />
        <Field name="checkIn" component={renderField} type="text" label="Check-in Time" />
        <Field name="checkOut" component={renderField} type="text" label="Check-out Time" />
        <Field name="cancellationPolicy" component={renderField} type="text" label="Cancellation Policy" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
        <Field name="prepayment" component={renderCheckboxField} type="checkbox" label="Prepayment Required" />
        <Field name="noAgeRestriction" component={renderCheckboxField} type="checkbox" label="No Age Restriction" />
        <Field name="pets" component={renderCheckboxField} type="checkbox" label="Pets Allowed" />
      </div>

      <div className="grid grid-cols-1 gap-8 mt-8">
        <Field name="additionalInfo" component={renderField} type="text" label="Additional Info" />
        <Field name="acceptedPaymentMethods" component={renderField} type="text" label="Accepted Payment Methods" />
      </div>

      <div className="flex justify-center mt-10">
        <button
          type="submit"
          className="bg-gradient-to-r from-[#fccc52] to-[#ff914d] text-white px-8 py-3 rounded-full font-bold text-lg shadow-md hover:bg-gradient-to-r hover:from-[#ff914d] hover:to-[#fccc52] transition duration-300 transform hover:scale-105"
        >
          Add Event Owner Profile
        </button>
      </div>
    </form>
  );
};

const ConnectedAddEventOwnerProfileForm = reduxForm<FormValues>({
  form: 'addEventOwnerProfile',
  validate,
})(AddEventOwnerProfileForm);

const AddEventOwnerProfilePage = () => (
  <OperatorLayout>
    <h1 className="text-4xl text-center font-extrabold mb-4 bg-gradient-to-r from-[#ff914d] to-[#fccc52] bg-clip-text text-transparent">
      Add Event Owner Profile
    </h1>
    <ConnectedAddEventOwnerProfileForm />
  </OperatorLayout>
);

export default AddEventOwnerProfilePage;
