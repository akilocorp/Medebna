import { useEffect, useState } from 'react';
import AdminLayout from '@/components/amin/adminLayout';
import { getOperators, deleteOperator, updateOperator } from '@/stores/admin/ApiCallerAdmin'; // Assuming updateOperator exists
import { showToast } from '@/components/popup';
import { FaTrash, FaEdit } from 'react-icons/fa';
import Link from 'next/link';
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

  useEffect(() => {
    const fetchOperators = async () => {
      try {
        const data = await getOperators();
        setOperators(data);
      } catch (error) {
        showToast("Error fetching operators", "error");
      }
    };
    fetchOperators();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteOperator(id);
      setOperators(operators.filter(operator => operator.id !== id));
      showToast("Operator deleted successfully", "success");
    } catch (error) {
      showToast("Error deleting operator", "error");
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
    } catch (error) {
      showToast("Error updating operator", "error");
    }
  };
 
  
  return (
    <AdminLayout>
      <h1 className="text-2xl text-[#fccc52] font-bold mb-6">View Operators</h1>
      <div className="overflow-x-auto">
        <table className="w-full bg-gray-800 text-[#fccc52] rounded-lg">
          <thead>
            <tr className="bg-gray-700">
              <th className="py-2 px-4 text-left w-1/4">Name</th>
              <th className="py-2 px-4 text-left w-1/4">Email</th>
              <th className="py-2 px-4 text-left w-1/5">Phone</th>
              <th className="py-2 px-4 text-left w-1/5">Role</th>
              <th className="py-2 px-4 text-center w-1/6">Actions</th>
            </tr>
          </thead>
          <tbody>
            {operators.map((operator) => (
              <tr key={operator.id} className="border-t text-gray-300 border-gray-700 hover:bg-gray-600">
                <td className="py-4 px-4">{operator.name}</td>
                <td className="py-4 px-4">{operator.email}</td>
                <td className="py-4 px-4">{operator.phone}</td>
                <td className="py-4 px-4 capitalize">{operator.type}</td>
                <td className="py-4 px-4 flex justify-center space-x-4">
                  <button onClick={() => handleEdit(operator)} className="text-yellow-400 hover:text-yellow-500">
                    <FaEdit />
                  </button>
                  <button onClick={() => handleDelete(operator.id)} className="text-red-400 hover:text-red-500">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Operator Modal */}
      <EditOperatorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        operator={selectedOperator}
        onSave={handleSave}
      />
    </AdminLayout>
  );
};

export default ViewOperatorsPage;
