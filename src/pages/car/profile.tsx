import React, { useState } from 'react';
import { Field, reduxForm, InjectedFormProps } from 'redux-form';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { addCarOwnerProfile } from '@/stores/operator/carprofileapicaller';
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
  rentalDuration: string;
  cancellationPolicy: string;
  prepayment: boolean;
  noAgeRestriction: boolean;
  additionalInfo: string;
  acceptedPaymentMethods: string;
}

type ValidationErrors = {
  [K in keyof FormValues]?: string;
};

const validate = (values: FormValues): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!values.address) {
    errors.address = 'Address is required';
  }
  if (!values.rating) {
    errors.rating = 'Rating is required';
  }
  if (!values.zipCode) {
    errors.zipCode = 'Zip Code is required';
  }
  if (!values.city) {
    errors.city = 'City is required';
  }
  if (!values.companyImage) {
    errors.companyImage = 'Company Image URL is required';
  }
  if (!values.description) {
    errors.description = 'Description is required';
  }
  if (!values.rentalDuration) {
    errors.rentalDuration = 'Rental Duration is required';
  }
  if (!values.cancellationPolicy) {
    errors.cancellationPolicy = 'Cancellation Policy is required';
  }
  if (!values.acceptedPaymentMethods) {
    errors.acceptedPaymentMethods = 'Accepted Payment Methods are required';
  }

  return errors;
};

const renderField = ({
  input,
  label,
  type,
  meta: { touched, error },
}: any) => (
  <div className="mb-6">
    <label className="block text-[#ff914d] mb-2 text-lg font-bold">{label}</label>
    <input
      {...input}
      type={type}
      className="w-full p-3 rounded-full bg-white text-[#6a6a6a] placeholder-[#6a6a6a] focus:outline-none focus:ring-2 focus:ring-[#ff914d] focus:border-transparent shadow-md"
      placeholder={label}
    />
    {touched && error && <span className="text-red-500 text-sm mt-1 block">{error}</span>}
  </div>
);

const renderCheckboxField = ({
  input,
  label,
  meta: { touched, error },
}: any) => (
  <div className="mb-6">
    <label className="block text-[#ff914d] mb-2 text-lg font-bold">{label}</label>
    <input
      {...input}
      type="checkbox"
      className="mr-2 leading-tight"
    />
    {touched && error && <span className="text-red-500 text-sm mt-1 block">{error}</span>}
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

const ProfileForm: React.FC<InjectedFormProps<FormValues>> = ({ handleSubmit }) => {
  const router = useRouter();

  const onSubmit = async (values: FormValues) => {
    try {
      // Structure the data according to the required format
      const formattedValues = {
        address: values.address,
        rating: values.rating,
        zipCode: values.zipCode,
        city: values.city,
        companyImage: values.companyImage,
        description: values.description,
        rentalRules: {
          rentalDuration: values.rentalDuration,
          cancellationPolicy: values.cancellationPolicy,
          prepayment: values.prepayment,
          noAgeRestriction: values.noAgeRestriction,
          additionalInfo: values.additionalInfo,
          acceptedPaymentMethods: values.acceptedPaymentMethods,
        },
      };

      await addCarOwnerProfile(formattedValues);
      toast.success('Profile added successfully');
      router.push('/car/myprofile');
    } catch (error) {
      toast.error('Error adding profile');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl max-h-[42rem] overflow-y-scroll mx-auto mt-8 p-6 bg-[#ffffff] rounded-lg shadow-lg">
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
      <Field name="rentalDuration" component={renderField} type="text" label="Rental Duration" />
      <Field name="cancellationPolicy" component={renderField} type="text" label="Cancellation Policy" />
      <Field name="prepayment" component={renderCheckboxField} type="checkbox" label="Prepayment Required?" />
      <Field name="noAgeRestriction" component={renderCheckboxField} type="checkbox" label="No Age Restriction?" />
      <Field name="additionalInfo" component={renderField} type="text" label="Additional Info" />
      <Field name="acceptedPaymentMethods" component={renderField} type="text" label="Accepted Payment Methods" />
      <div className="flex justify-center">
        <button type="submit" className="bg-gradient-to-r from-[#fccc52] to-[#ff914d] text-white  px-6 py-3 mt-6 rounded-full font-bold text-lg shadow-md hover:bg-[#fccc52] transition duration-300">
          Add Profile
        </button>
      </div>
    </form>
  );
};

const ConnectedProfileForm = reduxForm<FormValues>({
  form: 'profileForm',
  validate,
})(ProfileForm);

const ProfileFormPage = () => (
  <OperatorLayout>
    <h1 className="text-3xl text-center drop-shadow-md font-bold mb-8 bg-gradient-to-r from-[#ff914d] to-[#fccc52] bg-clip-text text-transparent">
      Add Profile
    </h1>
    <ConnectedProfileForm />
  </OperatorLayout>
);

export default ProfileFormPage;
