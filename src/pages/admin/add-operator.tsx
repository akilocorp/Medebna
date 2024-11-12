import { useState, useEffect } from 'react';
import AdminLayout from '@/components/amin/adminLayout';
import { Field, reduxForm, InjectedFormProps } from 'redux-form';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { addOperator } from '@/stores/admin/ApiCallerAdmin';
import jwt from "jsonwebtoken";

interface FormValues {
  name: string;   // Updated from companyName to name
  email: string;
  phone: string;
  type: string;   // Updated from role to type
}

const validate = (values: FormValues) => {
  const errors: Partial<FormValues> = {};
  if (!values.name) {   // Updated from companyName to name
    errors.name = 'Company name is required';
  }
  if (!values.email) {
    errors.email = 'Email is required';
  }
  if (!values.phone) {
    errors.phone = 'Phone number is required';
  } else if (!/^(\+251|0)[1-9]\d{8}$/.test(values.phone)) {
    errors.phone = 'Phone number is invalid. It should be in the format 0911818413 or +251913808013';
  }

  if (!values.type) {   // Updated from role to type
    errors.type = 'Role is required';
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
    <div className="relative">
      <input
        {...input}
        type={type}
        className="w-full p-3 rounded-full bg-white text-[#6a6a6a] placeholder-[#6a6a6a] focus:outline-none focus:ring-2 focus:ring-[#ff914d] focus:border-transparent shadow-md"
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
}: any) => (
  <div className="mb-6">
    <label className="block text-[#ff914d] mb-2 text-lg font-bold">{label}</label>
    <div className="relative">
      <select
        {...input}
        className="w-full p-3 rounded-full bg-white text-[#6a6a6a] focus:outline-none focus:ring-2 focus:ring-[#ff914d] focus:border-transparent shadow-md"
      >
        {children}
      </select>
      {touched && error && <span className="text-red-500 text-sm mt-1 block">{error}</span>}
    </div>
  </div>
);

const AddOperatorForm: React.FC<InjectedFormProps<FormValues>> = ({ handleSubmit }) => {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const onSubmit = async (values: FormValues) => {
    try {
      // Convert the email to lowercase
      const formattedValues = {
        ...values,
        email: values.email.toLowerCase(), // Convert email to lowercase
      };
  
      
  
      await addOperator(formattedValues);
      toast.success('Operator added successfully');
      router.push('/admin/view-operators');
    } catch (error) {
      toast.error('Error adding operator');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto mt-8 p-6 bg-[#ffffff] rounded-lg shadow-lg">
      <Field name="name" component={renderField} type="text" label="Company Name" />  {/* Updated */}
      <Field name="email" component={renderField} type="email" label="Email" />
      <Field name="phone" component={renderField} type="text" label="Phone Number" />
      <Field name="type" component={renderSelectField} label="Role">  {/* Updated */}
        <option value="">Select Role</option>
        <option value="hotel">Hotel Booking</option>
        <option value="car">Car Rental</option>
        <option value="event">Event Booking</option>
      </Field>
      <div className="flex justify-center">
        <button type="submit" className="bg-gradient-to-r from-[#fccc52] to-[#ff914d] text-white  px-6 py-3 mt-6 rounded-full font-bold text-lg shadow-md hover:bg-[#fccc52] transition duration-300">Add Operator</button>
      </div>
    </form>
  );
};

const ConnectedAddOperatorForm = reduxForm<FormValues>({
  form: 'addOperator',
  validate,
})(AddOperatorForm);

const AddOperatorPage = () => (
  <AdminLayout>
   <h1 className="text-3xl text-center drop-shadow-md font-bold mb-8 bg-gradient-to-r from-[#ff914d] to-[#fccc52] bg-clip-text text-transparent">
  Add Operator
</h1>

    <ConnectedAddOperatorForm />
  </AdminLayout>
);

export default AddOperatorPage;
