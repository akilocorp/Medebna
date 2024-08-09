import { useEffect, useState } from 'react';
import OperatorLayout from '@/components/operator/operatorLayout';
import { getListings, deleteListing } from '@/stores/operator/ApiCallerOperator'; // Update with the correct path
import { showToast } from '@/components/popup';
import { FaTrash, FaEdit } from 'react-icons/fa';
import Link from 'next/link';

interface Listing {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  availability: boolean;
}

const ViewListingsPage = () => {
  const [listings, setListings] = useState<Listing[]>([]);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const data = await getListings();
        setListings(data);
      } catch (error) {
        showToast("Error fetching listings", "error");
      }
    };
    fetchListings();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteListing(id);
      setListings(listings.filter(listing => listing.id !== id));
      showToast("Listing deleted successfully", "success");
    } catch (error) {
      showToast("Error deleting listing", "error");
    }
  };

  return (
    <OperatorLayout>
      <h1 className="text-2xl font-bold mb-6">View Listings</h1>
      <table className="w-full bg-gray-800 text-white rounded-lg">
        <thead>
          <tr>
            <th className="py-2 px-4">Title</th>
            <th className="py-2 px-4">Description</th>
            <th className="py-2 px-4">Category</th>
            <th className="py-2 px-4">Price</th>
            <th className="py-2 px-4">Availability</th>
            <th className="py-2 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {listings.map((listing) => (
            <tr key={listing.id} className="border-t border-gray-700">
              <td className="py-2 px-4">{listing.title}</td>
              <td className="py-2 px-4">{listing.description}</td>
              <td className="py-2 px-4 capitalize">{listing.category}</td>
              <td className="py-2 px-4">{listing.price}</td>
              <td className="py-2 px-4">{listing.availability ? 'Available' : 'Not Available'}</td>
              <td className="py-2 px-4 flex space-x-2">
                <Link href={`/operator/edit-listing?id=${listing.id}`}>
                  <a className="text-yellow-400 hover:text-yellow-500">
                    <FaEdit />
                  </a>
                </Link>
                <button onClick={() => handleDelete(listing.id)} className="text-red-400 hover:text-red-500">
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </OperatorLayout>
  );
};

export default ViewListingsPage;
