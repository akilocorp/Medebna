import { Field, reduxForm, InjectedFormProps } from 'redux-form';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { addListing } from '@/stores/operator/ApiCallerOperator'; // Update with the correct path
import OperatorLayout from '@/components/operator/operatorLayout';

interface FormValues {
  title: string;
  description: string;
  category: string;
  price: string; // Change price to string
  availability: string;
}

const validate = (values: FormValues) => {
  const errors: Partial<FormValues> = {};
  if (!values.title) {
    errors.title = 'Title is required';
  }
  if (!values.description) {
    errors.description = 'Description is required';
  }
  if (!values.category) {
    errors.category = 'Category is required';
  }
  if (!values.price) {
    errors.price = 'Price is required';
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
    <label className="block text-[#fccc52] mb-2 text-lg font-bold">{label}</label>
    <div className="relative">
      <select
        {...input}
        className="w-full p-3 rounded-full bg-[#323232] text-white focus:outline-none focus:ring-2 focus:ring-[#fccc52] focus:border-transparent shadow-md"
      >
        {children}
      </select>
      {touched && error && <span className="text-red-500 text-sm mt-1 block">{error}</span>}
    </div>
  </div>
);

const AddListingForm: React.FC<InjectedFormProps<FormValues>> = ({ handleSubmit }) => {
  const router = useRouter();

  const onSubmit = async (values: FormValues) => {
    const formattedValues = {
      ...values,
      price: parseFloat(values.price), // Convert price to number before sending to the server
      availability: values.availability === 'true', // Convert availability to boolean
    };

    try {
      await addListing(formattedValues);
      toast.success("Listing added successfully");
      router.push("/operator/view-listings");
    } catch (error) {
      toast.error("Error adding listing");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto mt-8 p-6 bg-[#1a1a1a] rounded-lg shadow-lg">
      <Field
        name="title"
        component={renderField}
        type="text"
        label="Title"
      />
      <Field
        name="description"
        component={renderField}
        type="text"
        label="Description"
      />
      <Field name="category" component={renderSelectField} label="Category">
        <option value="">Select Category</option>
        <option value="event">Event</option>
        <option value="hotel">Hotel</option>
        <option value="car">Car</option>
      </Field>
      <Field
        name="price"
        component={renderField}
        type="number"
        label="Price"
      />
      <Field name="availability" component={renderSelectField} label="Availability">
        <option value="true">Available</option>
        <option value="false">Not Available</option>
      </Field>
      <div className="flex justify-center">
        <button type="submit" className="bg-[#fccc52] text-[#323232] px-6 py-3 mt-6 rounded-full font-bold text-lg shadow-md">Add Listing</button>
      </div>
    </form>
  );
};

const ConnectedAddListingForm = reduxForm<FormValues>({
  form: 'addListing',
  validate,
})(AddListingForm);

const AddListingPage = () => (
  <OperatorLayout>
    <h1 className="text-3xl text-center font-bold mb-8 text-[#fccc52]">Add Listing</h1>
    <ConnectedAddListingForm />
  </OperatorLayout>
);

export default AddListingPage;
