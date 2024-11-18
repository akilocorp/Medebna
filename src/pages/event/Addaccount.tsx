// AddBankAccountPage.tsx
import { useState, useEffect } from 'react';
import OperatorLayout from '@/components/operator/operatorLayout';
import { Field, reduxForm, InjectedFormProps } from 'redux-form';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

import { addAccount, fetchBankList } from '@/stores/operator/ApiCaller';
import jwt from 'jsonwebtoken';

interface FormValues {
  accountName: string;
  accountNumber: string;
  bankCode: string;
}

const validate = (values: FormValues) => {
  const errors: Partial<FormValues> = {};
  if (!values.accountName) {
    errors.accountName = 'Account name is required';
  }
  if (!values.accountNumber) {
    errors.accountNumber = 'Account number is required';
  }
  if (!values.bankCode) {
    errors.bankCode = 'Please select a bank';
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
    <label className="block text-[#ff914d] mb-2  text-lg font-bold">{label}</label>
    <div className="relative">
      <select
        {...input}
        className="w-full p-3 rounded-full bg-white text-[#6a6a6a] overflow-y-scroll focus:outline-none focus:ring-2 focus:ring-[#ff914d] focus:border-transparent shadow-md"
      >
        {children}
      </select>
      {touched && error && <span className="text-red-500 text-sm mt-1 block">{error}</span>}
    </div>
  </div>
);

const AddBankAccountForm: React.FC<InjectedFormProps<FormValues>> = ({ handleSubmit, pristine, submitting }) => {
  const router = useRouter();
  const [userId, setUserId] = useState<string>('');
  const [businessName, setBusinessName] = useState<string>('');
  const [bankList, setBankList] = useState<any[]>([]); // Use local state for bank list

  useEffect(() => {
    // Fetch the bank list directly
    const fetchBanks = async () => {
      try {
        const response = await fetchBankList();
        // Assuming the response structure has a 'banks' array
        const banks = response.banks || response;
        setBankList(banks);
      } catch (error) {
        console.error('Error fetching bank list:', error);
      }
    };
    fetchBanks();

    // Retrieve userId and businessName from the token
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      const decodedToken: any = jwt.decode(storedToken);
      setUserId(decodedToken.userId);
      setBusinessName(decodedToken.name || '');
    }
  }, []);

  // Field-level validator for accountNumber
  const validateAccountNumber = (value: string, allValues: FormValues) => {
    if (!allValues.bankCode) {
      return undefined; // Bank not selected yet
    }
    const selectedBank = bankList.find(bank => bank.id === parseInt(allValues.bankCode, 10));
    if (selectedBank) {
      if (value.length !== selectedBank.acct_length) {
        return `Account number must be exactly ${selectedBank.acct_length} characters`;
      }
    }
    return undefined;
  };

  const onSubmit = async (values: FormValues) => {
    try {
      const formData = {
        userId,
        accountName: values.accountName,
        accountNumber: values.accountNumber,
        business_name: businessName,
        bankCode: values.bankCode,
      };

      await addAccount(formData);
      toast.success('Bank account added successfully');
      router.push('/operator/dashboard'); // Adjust the route as needed
    } catch (error) {
      toast.error('Error adding bank account');
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-2xl mx-auto mt-8 p-6 bg-[#ffffff] rounded-lg shadow-lg"
    >
      <Field name="bankCode" component={renderSelectField} label="Select Bank">
        <option value="">Select Bank</option>
        {bankList.map((bank: any) => (
          <option key={bank.id} value={bank.id}>
            {bank.name}
          </option>
        ))}
      </Field>
      <Field
        name="accountName"
        component={renderField}
        type="text"
        label="Account Name"
      />
      <Field
        name="accountNumber"
        component={renderField}
        type="text"
        label="Account Number"
        validate={validateAccountNumber} // Add field-level validation
      />
      <div className="flex justify-center">
        <button
          type="submit"
          disabled={pristine || submitting}
          className="bg-gradient-to-r from-[#fccc52] to-[#ff914d] text-white px-6 py-3 mt-6 rounded-full font-bold text-lg shadow-md hover:bg-[#fccc52] transition duration-300"
        >
          Add Bank Account
        </button>
      </div>
    </form>
  );
};

const ConnectedAddBankAccountForm = reduxForm<FormValues>({
  form: 'addBankAccount',
  validate,
})(AddBankAccountForm);

const AddBankAccountPage = () => (
  <OperatorLayout>
    <h1 className="text-3xl text-center drop-shadow-md font-bold mb-8 bg-gradient-to-r from-[#ff914d] to-[#fccc52] bg-clip-text text-transparent">
      Add Bank Account
    </h1>
    <ConnectedAddBankAccountForm />
  </OperatorLayout>
);

export default AddBankAccountPage;
