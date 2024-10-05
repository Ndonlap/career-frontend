import React, { useState } from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faChartBar } from '@fortawesome/free-solid-svg-icons';

// Sample members data (you would replace this with real data from your backend or API)
const membersData = [
  { id: 1, name: 'John Doe', status: 'punctual', contribution: 200, payout: 150 },
  { id: 2, name: 'Jane Smith', status: 'non-punctual', contribution: 100, payout: 0 },
  { id: 3, name: 'Emily Johnson', status: 'non-payer', contribution: 0, payout: 0 },
  { id: 4, name: 'Chris Lee', status: 'punctual', contribution: 300, payout: 200 },
];

const TontineReport = () => {
  // const [isPageVisible, setIsPageVisible] = useState(false);
  const [filter, setFilter] = useState('all'); // To manage the filter state (punctual, non-punctual, non-payers)

  // Filter members based on the selected filter
  const filteredMembers = membersData.filter((member) => {
    if (filter === 'punctual') return member.status === 'punctual';
    if (filter === 'non-punctual') return member.status === 'non-punctual';
    if (filter === 'non-payer') return member.status === 'non-payer';
    return true; // If "all" is selected
  });

  return (
    <div className="min-h-screen bg-gray-100 p-8">
        {/* Icon Button to make page appear */}
        {/* {!isPageVisible && (
        <button
          className="bg-blue-500 text-white p-4 rounded-full"
          onClick={() => setIsPageVisible(true)}
        >
          <FontAwesomeIcon icon={faChartBar} size="2x" />
        </button>
      )} */}

      {/* Report Page */}
      {/* {isPageVisible && ( */}
        <div className='w-[80%] content-center'>
          <h1 className="text-2xl font-bold mb-4">Tontine Reports</h1>

          {/* Slide to classify members */}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Filter Members</label>
            <select
              className="w-[50%] rounded-xl bg-gray-200 px-3 py-2 "
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="punctual">Punctual</option>
              <option value="non-punctual">Non-Punctual</option>
              <option value="non-payer">Non-Payers</option>
            </select>
          </div>

          {/* Display Members */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <table className="min-w-full table-auto">
              <thead>
                <tr>
                  <th className="px-4 py-2">Member Name</th>
                  <th className="px-4 py-2">Contribution</th>
                  <th className="px-4 py-2">Payout</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Status</th>

                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((member) => (
                  <tr key={member.id} className="text-center border-t">
                    <td className="px-4 py-2">{member.name}</td>
                    <td className="px-4 py-2">CFA {member.contribution}</td>
                    <td className="px-4 py-2">CFA {member.payout}</td>
                    <td className="px-4 py-2 capitalize">{member.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      {/* )} */}
    </div>
  );
};

export default TontineReport;
