import { Customer } from '@/data/mock-customers';

interface CustomerCardProps {
  customer: Customer;
}

export default function CustomerCard({ customer }: CustomerCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {customer.name}
      </h3>
      <div className="space-y-1">
        <p className="text-sm text-gray-600">
          <span className="font-medium">Company:</span> {customer.company}
        </p>
        {customer.email && (
          <p className="text-sm text-gray-500">
            <span className="font-medium">Email:</span> {customer.email}
          </p>
        )}
      </div>
    </div>
  );
}
