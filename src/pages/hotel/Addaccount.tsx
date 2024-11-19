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
  // Removed bankCode since bank selection is handled via buttons and component state
}

const AddBankAccountForm: React.FC<InjectedFormProps<FormValues>> = ({
  handleSubmit,
  pristine,
  submitting,
}) => {
  const router = useRouter();
  const [userId, setUserId] = useState<string>('');
  const [businessName, setBusinessName] = useState<string>('');
  const [bankList, setBankList] = useState<any[]>([]);
  const [selectedBank, setSelectedBank] = useState<string | null>(null); // Track selected bank

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const response = await fetchBankList();
        const banks = response.banks || response;
        setBankList(banks);
      } catch (error) {
        console.error('Error fetching bank list:', error);
        toast.error('Failed to load bank list. Please try again later.');
      }
    };
    fetchBanks();

    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      const decodedToken: any = jwt.decode(storedToken);
      console.log('Decoded Token:', decodedToken);
      setUserId(decodedToken.id);
      setBusinessName(decodedToken.name || '');
    }
  }, []);

  // Field-level validation for accountNumber
  const validateAccountNumber = (value: string) => {
    if (!value || value.trim() === '') {
      return 'Account number is required';
    }
    if (!selectedBank) {
      return 'Please select a bank';
    }
    const bank = bankList.find((b) => b.id.toString() === selectedBank);
    if (bank) {
      const expectedLength = bank.acct_length;
      if (value.length !== expectedLength) {
        return `Account number must be exactly ${expectedLength} characters`;
      }
    }
    return undefined;
  };

  const onSubmit = async (values: FormValues) => {
    if (!selectedBank) {
      toast.error('Please select a bank');
      return;
    }

    try {
      const formData = {
        userId,
        accountName: values.accountName,
        accountNumber: values.accountNumber,
        business_name: businessName,
        bankCode: selectedBank,
      };
      console.log(formData);
      await addAccount(formData);
      toast.success('Bank account added successfully');
     
    } catch (error) {
      console.error('Error adding bank account:', error);
      toast.error('Error adding bank account. Please try again.');
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full p-6 bg-white rounded-lg shadow-md"
    >
      <div className="mb-6">
        <label className="block text-[#ff914d] mb-2 text-lg font-bold">
          Select Bank
        </label>
        <div className="grid grid-cols-4 gap-4">
          {bankList.map((bank: any) => (
            <button
              type="button"
              key={bank.id}
              className={`p-3 rounded-full shadow-md ${
                selectedBank === bank.id.toString()
                  ? 'bg-[#ff914d] text-white'
                  : 'bg-white text-[#6a6a6a]'
              } focus:outline-none focus:ring-2 focus:ring-[#ff914d]`}
              onClick={() => setSelectedBank(bank.id.toString())}
            >
              {bank.name}
            </button>
          ))}
        </div>
      </div>

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
        validate={validateAccountNumber} // Attach field-level validation
      />
      <div className="flex justify-center">
        <button
          type="submit"
          disabled={pristine || submitting || !selectedBank}
          className="bg-gradient-to-r from-[#fccc52] to-[#ff914d] text-white px-6 py-3 mt-6 rounded-full font-bold text-lg shadow-md hover:from-[#ff914d] hover:to-[#fccc52] transition duration-300"
        >
          Add Bank Account
        </button>
      </div>
    </form>
  );
};

// Existing validation function for other fields
const validate = (values: FormValues) => {
  const errors: Partial<FormValues> = {};
  if (!values.accountName) {
    errors.accountName = 'Account name is required';
  }
  if (!values.accountNumber) {
    errors.accountNumber = 'Account number is required';
  }
  // Removed bankCode validation as it's handled via selectedBank
  return errors;
};

// Render functions remain unchanged
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

// Removed renderSelectField as it's no longer needed
// If you still need it for other purposes, you can keep it

const ConnectedAddBankAccountForm = reduxForm<FormValues>({
  form: 'addBankAccount',
  validate,
})(AddBankAccountForm);

const AddBankAccountPage = () => (
  <OperatorLayout>
    <ConnectedAddBankAccountForm />
  </OperatorLayout>
);

export default AddBankAccountPage;
