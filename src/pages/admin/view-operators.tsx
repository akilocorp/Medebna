import { useEffect, useState } from 'react';
import AdminLayout from '@/components/amin/adminLayout';
import { getOperators, deleteOperator, updateOperator } from '@/stores/admin/ApiCallerAdmin'; // Assuming updateOperator exists
import { showToast } from '@/components/popup';
import { FaTrash, FaEdit } from 'react-icons/fa';
import EditOperatorModal from '@/components/EditOperatorModal'; // Assuming the modal is in the same directory

interface Operator {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: string;
}

const ViewOperatorsPage = () => {
  const [operators, setOperators] = useState<Operator[]>([]);
  const [selectedOperator, setSelectedOperator] = useState<Operator | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOperators = async () => {
      setLoading(true); // Show loading spinner while fetching operators
      try {
        const data = await getOperators();
        setOperators(data);
      } catch (error) {
        showToast("Error fetching operators", "error");
      }
      finally {
        setLoading(false); // End loading
      }
    };
    fetchOperators();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this operator? This action cannot be undone.");
  if (confirmDelete) {
    try {
      await deleteOperator(id);
      setOperators(operators.filter(operator => operator.id !== id));
      showToast("Operator deleted successfully", "success");
    } catch (error) {
      showToast("Error deleting operator", "error");
    }
  }
};

  const handleEdit = (operator: Operator) => {
    setSelectedOperator(operator);
    setIsModalOpen(true);
  };

  const handleSave = async (updatedOperator: Operator) => {
    try {
      await updateOperator(updatedOperator);
      setOperators(operators.map(op => (op.id === updatedOperator.id ? updatedOperator : op)));
      showToast("Operator updated successfully", "success");
      setIsModalOpen(false); // Close the modal after saving
    } catch (error) {
      showToast("Error updating operator", "error");
    }
  };
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f9f9f9]">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <svg
              className="animate-spin h-10 w-10 text-[#ff914d]"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          </div>
          <p className="text-[#fccc52] text-lg font-semibold">Loading, please wait...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <h1 className="text-3xl drop-shadow-md text-center font-bold mb-8 bg-gradient-to-r from-[#ff914d] to-[#fccc52] bg-clip-text text-transparent">
        View Operators
      </h1>
      <div className="overflow-x-auto max-h-[42rem] rounded-lg overflow-y-scroll">
        <table className="w-full bg-white text-black rounded-lg shadow-md">
          <thead>
            <tr className="bg-gradient-to-r from-[#ff914d] to-[#fccc52] bg-opacity-10 rounded-lg text-white">
              <th className="py-2 px-4 text-left w-1/4">Name</th>
              <th className="py-2 px-4 text-left w-1/4">Email</th>
              <th className="py-2 px-4 text-left w-1/5">Phone</th>
              <th className="py-2 px-4 text-left w-1/5">Role</th>
              <th className="py-2 px-4 text-center w-1/6">Actions</th>
            </tr>
          </thead>
          <tbody>
            {operators.map((operator) => (
              <tr key={operator.id} className="border-t border-gray-300 drop-shadow-md">
                <td className="py-4 px-4">{operator.name}</td>
                <td className="py-4 px-4">{operator.email}</td>
                <td className="py-4 px-4">{operator.phone}</td>
                <td className="py-4 px-4 capitalize">{operator.type}</td>
                <td className="py-4 px-4 flex justify-center space-x-4">
                  <button onClick={() => handleEdit(operator)} className="bg-[#fccc52] bg-opacity-20 text-center p-2 text-[#fccc52] rounded-full hover:text-[#fccc52]">
                    <FaEdit />
                  </button>
                  <button onClick={() => handleDelete(operator.id)} className="text-red-500 bg-red-500 bg-opacity-20 text-center p-2 rounded-full hover:text-red-600">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Operator Modal */}
      {selectedOperator && (
        <EditOperatorModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          operator={selectedOperator}
          onSave={handleSave}
        />
      )}
    </AdminLayout>
  );
};

export default ViewOperatorsPage;
