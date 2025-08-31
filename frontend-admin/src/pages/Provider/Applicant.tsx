import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {  Applicant,ApplicantsResponse} from './types';  
 

const Applicant = () => {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const res = await axios.get<ApplicantsResponse>('http://localhost:3000/api/admin/getAllApplicants');
        setApplicants(res.data.applicants);
      } catch (err) {
        console.error('Error fetching applicants:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, []);

  if (loading) return <div>Loading applicants...</div>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Applicants</h2>
      {applicants.length === 0 ? (
        <p>No applicants found.</p>
      ) : (
        <ul className="space-y-4">
          {applicants.map((applicant) => (
            <li key={applicant._id} className="p-4 border rounded shadow">
              <p><strong>User ID:</strong> {applicant.userId}</p>
              <p><strong>Opportunity ID:</strong> {applicant.opportunityId}</p>
              
              <p><strong>Cover Letter:</strong> {applicant.coverLetter}</p>
              <p><strong>Applied At:</strong> {new Date(applicant.appliedAt).toLocaleString()}</p>
              <p><strong>Proof of Work:</strong> <a href={applicant.proofOfWork?.link} target="_blank" rel="noreferrer">{applicant.proofOfWork?.link}</a></p>
              <p><strong>Payment:</strong> {applicant.paymentStatus.status} ({applicant.paymentStatus.amount})</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Applicant;
