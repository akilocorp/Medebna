import { useEffect, useState } from 'react';
import AdminLayout from '@/components/amin/adminLayout';
import { getOperators, deleteOperator } from '@/stores/admin/ApiCallerAdmin'; // Update with the correct path
import { showToast } from '@/components/popup';
import { FaTrash, FaEdit } from 'react-icons/fa';
import Link from 'next/link';

interface Operator {
  id: string;
  companyName: string;
  email: string;
  phone: string;
  role: string;
}

const ViewOperatorsPage = () => {
  const [operators, setOperators] = useState<Operator[]>([]);

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

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">View Operators</h1>
      <table className="w-full bg-gray-800 text-white rounded-lg">
        <thead>
          <tr>
            <th className="py-2 px-4">Company Name</th>
            <th className="py-2 px-4">Email</th>
            <th className="py-2 px-4">Phone</th>
            <th className="py-2 px-4">Role</th>
            <th className="py-2 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {operators.map((operator) => (
            <tr key={operator.id} className="border-t border-gray-700">
              <td className="py-2 px-4">{operator.companyName}</td>
              <td className="py-2 px-4">{operator.email}</td>
              <td className="py-2 px-4">{operator.phone}</td>
              <td className="py-2 px-4 capitalize">{operator.role}</td>
              <td className="py-2 px-4 flex space-x-2">
                <Link href={`/admin/edit-operator?id=${operator.id}`}>
                  <a className="text-yellow-400 hover:text-yellow-500">
                    <FaEdit />
                  </a>
                </Link>
                <button onClick={() => handleDelete(operator.id)} className="text-red-400 hover:text-red-500">
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminLayout>
  );
};

export default ViewOperatorsPage;
