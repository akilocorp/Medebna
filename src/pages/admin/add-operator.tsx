import { useState } from 'react';
import AdminLayout from '@/components/amin/adminLayout';
import { Field, reduxForm, InjectedFormProps } from 'redux-form';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { addOperator } from '@/stores/admin/ApiCallerAdmin';

interface FormValues {
  companyName: string;
  email: string;
  phone: string;
  role: string;
}

const validate = (values: FormValues) => {
  const errors: Partial<FormValues> = {};
  if (!values.companyName) {
    errors.companyName = 'Company name is required';
  }
  if (!values.email) {
    errors.email = 'Email is required';
  }
  if (!values.phone) {
    errors.phone = 'Phone number is required';
  }
  if (!values.role) {
    errors.role = 'Role is required';
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
}: any) => (
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

const AddOperatorForm: React.FC<InjectedFormProps<FormValues>> = ({ handleSubmit }) => {
  const router = useRouter();

  const onSubmit = async (values: FormValues) => {
    try {
      await addOperator(values);
      toast.success("Operator added successfully");
      router.push("/admin/view-operators");
    } catch (error) {
      toast.error("Error adding operator");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto mt-8 p-6 bg-[#1a1a1a] rounded-lg shadow-lg">
      <Field
        name="companyName"
        component={renderField}
        type="text"
        label="Company Name"
      />
      <Field name="email" component={renderField} type="email" label="Email" />
      <Field name="phone" component={renderField} type="text" label="Phone Number" />
      <Field name="role" component={renderSelectField} label="Role">
        <option value="">Select Role</option>
        <option value="hotel">Hotel Booking</option>
        <option value="car">Car Rental</option>
        <option value="event">Event Booking</option>
      </Field>
      <div className="flex justify-center">
        <button type="submit" className="bg-[#fccc52] text-[#323232] px-6 py-3 mt-6 rounded-full font-bold text-lg shadow-md">Add Operator</button>
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
    <h1 className="text-3xl text-center font-bold mb-8 text-[#fccc52]">Add Operator</h1>
    <ConnectedAddOperatorForm />
  </AdminLayout>
);

export default AddOperatorPage;
