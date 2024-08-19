import { useState, useEffect } from 'react';

interface Operator {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: string;
}

interface EditOperatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  operator: Operator | null;
  onSave: (operator: Operator) => void;
}

const EditOperatorModal: React.FC<EditOperatorModalProps> = ({ isOpen, onClose, operator, onSave }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [type, setType] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (operator) {
      setName(operator.name);
      setEmail(operator.email);
      setPhone(operator.phone);
      setType(operator.type);
    }
  }, [operator]);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!name) {
      newErrors.name = 'Name is required';
    }
    if (!email) {
      newErrors.email = 'Email is required';
    }
    if (!phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^(\+251|0)[1-9]\d{8}$/.test(phone)) {
      newErrors.phone = 'Phone number is invalid. It should be in the format 0911818413 or +251913808013';
    }
    if (!type) {
      newErrors.type = 'Role is required';
    } else if (!['hotel', 'car', 'event'].includes(type.toLowerCase())) {
      newErrors.type = 'Role must be one of: hotel, car, event';
    }

    setErrors(newErrors);

    // Return whether the form is valid or not
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (operator && validate()) {
      onSave({
        id: operator.id,
        name,
        email,
        phone,
        type,
      });
      onClose();
    }
  };

  if (!isOpen || !operator) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg text-black w-96 shadow-lg">
        <h2 className="text-2xl font-bold drop-shadow-md mb-4 bg-gradient-to-r from-[#ff914d] to-[#fccc52] bg-clip-text text-transparent">
          Edit Operator
        </h2>
        <div className="mb-4">
          <label className="block mb-1 text-[#ff914d] drop-shadow-md font-semibold">Name</label>
          <input
            type="text"
            className="w-full p-2 rounded-full bg-white text-[#6a6a6a] placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#ff914d] shadow-md"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-[#ff914d] drop-shadow-md font-semibold">Email</label>
          <input
            type="email"
            className="w-full p-2 rounded-full  bg-white text-[#6a6a6a] placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#ff914d] shadow-md"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-[#ff914d] font-semibold drop-shadow-md">Phone</label>
          <input
            type="text"
            className="w-full p-2 rounded-full bg-white text-[#6a6a6a] placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#ff914d] shadow-md"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-[#ff914d] font-semibold drop-shadow-md">Role</label>
          <select
            className="w-full p-2 rounded-full bg-white text-[#6a6a6a] placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#ff914d] shadow-md"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="">Select a role</option>
            <option value="hotel">Hotel</option>
            <option value="car">Car Rental</option>
            <option value="event">Event Booking</option>
          </select>
          {errors.type && <p className="text-red-500 text-sm">{errors.type}</p>}
        </div>
        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2 bg-red-500 rounded-full text-white shadow-md hover:bg-red-600">
            Cancel
          </button>
          <button onClick={handleSave} className="px-4 py-2 bg-[#ff914d] rounded-full text-white shadow-md hover:bg-[#fccc52]">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditOperatorModal;
