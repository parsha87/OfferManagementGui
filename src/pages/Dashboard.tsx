import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import config from '../config';
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Dashboard = () => {
  const [statusData, setStatusData] = useState<{ name: string; value: number }[]>([]);
  const [customerTypeData, setCustomerTypeData] = useState<{ name: string; value: number }[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.get('Inquiry');
      const inquiries = response.data;

      // Group by status
      const statusCounts: Record<string, number> = {};
      const customerTypeCounts: Record<string, number> = {};

      for (const inquiry of inquiries) {
        const status = inquiry.status || 'Unknown';
        const customerType = inquiry.customerType || 'Unknown';

        statusCounts[status] = (statusCounts[status] || 0) + 1;
        customerTypeCounts[customerType] = (customerTypeCounts[customerType] || 0) + 1;
      }

      setStatusData(
        Object.entries(statusCounts).map(([name, value]) => ({ name, value }))
      );
      setCustomerTypeData(
        Object.entries(customerTypeCounts).map(([name, value]) => ({ name, value }))
      );
    } catch (error) {
      console.error('Failed to fetch inquiries:', error);
    } finally {
      setLoading(false);
    }
  };
  // Create an Axios instance
  const api = axios.create({
    baseURL: config.apiUrl,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="shadow-lg p-4 rounded-xl bg-white">
        <h2 className="text-xl font-bold mb-4">Inquiry Status</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={statusData}>
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#0088FE" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="shadow-lg p-4 rounded-xl bg-white">
        <h2 className="text-xl font-bold mb-4">Customer Type</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={customerTypeData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
            >
              {customerTypeData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
