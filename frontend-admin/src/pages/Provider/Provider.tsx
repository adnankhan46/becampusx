// import React, { useState } from "react";
// import axios from "axios";
// import { useQuery } from "@tanstack/react-query";
// import {
//   CompaniesResponse,
//   Company,
//   Opportunity,
//   Applicant,
// } from "@/api/api.client";

// const fetchCompanies = async (): Promise<CompaniesResponse> => {
//   const res = await axios.get("http://localhost:3000/api/admin/getAllCompany");
//   return res.data;
// };

// const fetchOpportunitiesByCompany = async (
//   companyId: string
// ): Promise<{ opportunities: Opportunity[] }> => {
//   const res = await axios.get(
//     `http://localhost:3000/api/admin/getAllOppByComp/${companyId}`
//   );
//   return res.data;
// };

// const fetchApplicantsByCompany = async (
//   OppId: string
// ): Promise<{ applicants: Applicant[] }> => {
//   const res = await axios.get(
//     `http://localhost:3000/api/admin/getAllApplicantsByCompany/${OppId}`
//   );
//   return res.data;
// };

// interface ModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   title: string;
//   children: React.ReactNode;
// }

// const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg p-6 max-w-4xl max-h-[80vh] overflow-auto w-full mx-4">
//         <div className="flex justify-between items-center mb-4">
//           <h3 className="text-xl font-bold">{title}</h3>
//           <button
//             onClick={onClose}
//             className="text-gray-500 hover:text-gray-700 text-2xl"
//           >
//             ×
//           </button>
//         </div>
//         {children}
//       </div>
//     </div>
//   );
// };

// function Provider() {
//   const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(
//     null
//   );
//   const [selectedOppId, setSelectedOppId] = useState<string | null>(null);
//   const [selectedOppTitle, setSelectedOppTitle] = useState<string>("");
//   const [modalType, setModalType] = useState<
//     "opportunities" | "applicants" | null
//   >(null);

//   const { data, isLoading, isError } = useQuery({
//     queryKey: ["admin-companies"],
//     queryFn: fetchCompanies,
//   });

//   const { data: opportunitiesData, isLoading: opportunitiesLoading } = useQuery(
//     {
//       queryKey: ["company-opportunities", selectedCompanyId],
//       queryFn: () => fetchOpportunitiesByCompany(selectedCompanyId!),
//       enabled: !!selectedCompanyId && modalType === "opportunities",
//     }
//   );

//   const { data: applicantsData, isLoading: applicantsLoading } = useQuery({
//     queryKey: ["Opp-applicants", selectedOppId],
//     queryFn: () => fetchApplicantsByCompany(selectedOppId!),
//     enabled: !!selectedOppId && modalType === "applicants",
//   });

//   const handleViewOpportunities = (companyId: string, companyName: string) => {
//     setSelectedCompanyId(companyId);
//     setModalType("opportunities");
//   };

//   const handleViewApplicants = (OppId: string, OpportunityTitle: string) => {
//     setSelectedCompanyId(OppId);
//     setSelectedOppTitle(OpportunityTitle);
//     setModalType("applicants");
//   };

//   const closeModal = () => {
//     setModalType(null);
//     setSelectedCompanyId(null);
//   };

//   const getSelectedCompanyName = () => {
//     if (!selectedCompanyId || !data?.companies) return "";
//     const company = data.companies.find((c) => c._id === selectedCompanyId);
//     return company?.name || "";
//   };

//   if (isLoading) return <div>Loading companies...</div>;
//   if (isError) return <div>Failed to load companies</div>;

//   return (
//     <div>
//       <h2 className="text-xl font-bold mb-4">Providers</h2>
//       {data?.companies?.length === 0 ? (
//         <p>No companies found.</p>
//       ) : (
//         <ul className="space-y-4">
//           {data?.companies?.map((company) => (
//             <li
//               key={company._id}
//               className="flex items-center justify-between border p-4 rounded shadow"
//             >
//               <div className="flex items-center space-x-4">
//                 <img
//                   src={company.profilePicture}
//                   alt={company.name}
//                   className="w-12 h-12 rounded-full object-cover"
//                 />
//                 <div>
//                   <h3 className="text-lg font-semibold">{company.name}</h3>
//                   <h3 className="text-lg font-semibold">{company._id}</h3>
//                   <p className="text-sm text-gray-600">{company.email}</p>
//                   <p className="text-sm">
//                     <strong>Website:</strong>{" "}
//                     {company.url ? (
//                       <a
//                         href={company.url}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="text-blue-500 underline"
//                       >
//                         {company.url}
//                       </a>
//                     ) : (
//                       "N/A"
//                     )}
//                   </p>
//                 </div>
//               </div>
//               <div className="flex space-x-2">
//                 <button
//                   onClick={() =>
//                     handleViewOpportunities(company._id, company.name)
//                   }
//                   className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm"
//                 >
//                   View Opportunities
//                 </button>
//               </div>
//             </li>
//           ))}
//         </ul>
//       )}

//       {/* Opportunities Modal */}
//       <Modal
//         isOpen={modalType === "opportunities"}
//         onClose={closeModal}
//         title={`Opportunities - ${getSelectedCompanyName()}`}
//       >
//         {opportunitiesLoading ? (
//           <div>Loading opportunities...</div>
//         ) : (
//           <div>
//             {opportunitiesData?.opportunities?.length === 0 ? (
//               <p>No opportunities found for this company.</p>
//             ) : (
//               <div className="space-y-4">
//                 {opportunitiesData?.opportunities?.map((opportunity) => (
//                   <div key={opportunity._id} className="border p-4 rounded">
//                     <h4 className="text-lg font-semibold">
//                       {opportunity.title}
//                     </h4>
//                     <p className="text-gray-600 mb-2">
//                       {opportunity.description}
//                     </p>
//                     <div className="grid grid-cols-2 gap-4 text-sm">
//                       <p>
//                         <strong>Type:</strong> {opportunity.type}
//                       </p>
//                       <p>
//                         <strong>Status:</strong> {opportunity.status}
//                       </p>
//                       <p>
//                         <strong>Openings:</strong>{" "}
//                         {opportunity.numberOfOpenings}
//                       </p>
//                       <p>
//                         <strong>ID:</strong> {opportunity._id}
//                       </p>
//                       <p>
//                         <strong>Paid:</strong>{" "}
//                         {opportunity.isPaid
//                           ? `Yes ($${opportunity.amount})`
//                           : "No"}
//                       </p>
//                       <p>
//                         <strong>Deadline:</strong>{" "}
//                         {new Date(opportunity.deadline).toLocaleDateString()}
//                       </p>
//                       <p>
//                         <strong>Applicants:</strong>{" "}
//                         {opportunity.applicants.length}
//                       </p>

//                       <div className="mt-3">
//                         <button
//                           onClick={() =>
//                             handleViewApplicants(
//                               opportunity._id,
//                               opportunity.title
//                             )
//                           }
//                           className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-sm"
//                         >
//                           View Applicants ({opportunity.applicants.length})
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         )}
//       </Modal>

//       {/* Applicants Modal */}
//       <Modal
//         isOpen={modalType === "applicants"}
//         onClose={closeModal}
//         title={`Applicants - ${selectedOppTitle}`}
//       >
//         {applicantsLoading ? (
//           <div>Loading applicants...</div>
//         ) : (
//           <div>
//             {applicantsData?.applicants?.length === 0 ? (
//               <p>No applicants found for this company.</p>
//             ) : (
//               <div className="space-y-4">
//                 {applicantsData?.applicants?.map((applicant) => (
//                   <div key={applicant._id} className="border p-4 rounded">
//                     <div className="grid grid-cols-2 gap-4 text-sm">
//                       <p>
//                         <strong>User ID:</strong> {applicant.userId}
//                       </p>
//                       <p>
//                         <strong>Status:</strong>
//                         <span
//                           className={`ml-2 px-2 py-1 rounded text-xs ${
//                             applicant.status === "selected"
//                               ? "bg-green-100 text-green-800"
//                               : applicant.status === "shortlisted"
//                               ? "bg-yellow-100 text-yellow-800"
//                               : applicant.status === "rejected"
//                               ? "bg-red-100 text-red-800"
//                               : "bg-gray-100 text-gray-800"
//                           }`}
//                         >
//                           {applicant.status}
//                         </span>
//                       </p>
//                       <p>
//                         <strong>Applied At:</strong>{" "}
//                         {new Date(applicant.appliedAt).toLocaleDateString()}
//                       </p>
//                       <p>
//                         <strong>Completion:</strong>{" "}
//                         {applicant.completionStatus}
//                       </p>
//                     </div>
//                     {applicant.coverLetter && (
//                       <div className="mt-2">
//                         <strong>Cover Letter:</strong>
//                         <p className="text-gray-600 mt-1">
//                           {applicant.coverLetter}
//                         </p>
//                       </div>
//                     )}
//                     {(applicant.proofOfWork?.link ||
//                       applicant.proofOfWork?.screenshot) && (
//                       <div className="mt-2">
//                         <strong>Proof of Work:</strong>
//                         {applicant.proofOfWork.link && (
//                           <p>
//                             <a
//                               href={applicant.proofOfWork.link}
//                               target="_blank"
//                               rel="noopener noreferrer"
//                               className="text-blue-500 underline"
//                             >
//                               View Link
//                             </a>
//                           </p>
//                         )}
//                         {applicant.proofOfWork.screenshot && (
//                           <p>Screenshot: {applicant.proofOfWork.screenshot}</p>
//                         )}
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         )}
//       </Modal>
//     </div>
//   );
// }

// export default Provider;

import React, { useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import {
  CompaniesResponse,
  Company,
  Opportunity,
  Applicant,
} from "@/api/api.client";

const fetchCompanies = async (): Promise<CompaniesResponse> => {
  const res = await axios.get("http://localhost:3000/api/admin/getAllCompany");
  return res.data;
};

const fetchOpportunitiesByCompany = async (
  companyId: string
): Promise<{ opportunities: Opportunity[] }> => {
  const res = await axios.get(
    `http://localhost:3000/api/admin/getAllOppByComp/${companyId}`
  );
  return res.data;
};

const fetchApplicantsByOpportunity = async (
  oppId: string
): Promise<Applicant[] > => {
  const res = await axios.get(
    `http://localhost:3000/api/admin/getAllApplicantsByCompany/${oppId}`
  );
  return res.data;
};

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl max-h-[80vh] overflow-auto w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

function Provider() {
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [selectedOppId, setSelectedOppId] = useState<string | null>(null);
  const [selectedOppTitle, setSelectedOppTitle] = useState<string>("");
  const [modalType, setModalType] = useState<"opportunities" | "applicants" | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-companies"],
    queryFn: fetchCompanies,
  });

  const { data: opportunitiesData, isLoading: opportunitiesLoading } = useQuery({
    queryKey: ["company-opportunities", selectedCompanyId],
    queryFn: () => fetchOpportunitiesByCompany(selectedCompanyId!),
    enabled: !!selectedCompanyId && modalType === "opportunities",
  });

  const { data: applicantsData, isLoading: applicantsLoading } = useQuery({
    queryKey: ["opp-applicants", selectedOppId],
    queryFn: () => fetchApplicantsByOpportunity(selectedOppId!),
    enabled: !!selectedOppId && modalType === "applicants",
  });

  const handleViewOpportunities = (companyId: string, companyName: string) => {
    setSelectedCompanyId(companyId);
    setModalType("opportunities");
  };

  const handleViewApplicants = (oppId: string, opportunityTitle: string) => {
    setSelectedOppId(oppId);
    setSelectedOppTitle(opportunityTitle);
    console.log("Selected Opportunity ID:", oppId);
    setModalType("applicants");
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedCompanyId(null);
    setSelectedOppId(null);
    setSelectedOppTitle("");
  };

  const getSelectedCompanyName = () => {
    if (!selectedCompanyId || !data?.companies) return "";
    const company = data.companies.find((c) => c._id === selectedCompanyId);
    return company?.name || "";
  };

  if (isLoading) return <div>Loading companies...</div>;
  if (isError) return <div>Failed to load companies</div>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Providers</h2>
      {data?.companies?.length === 0 ? (
        <p>No companies found.</p>
      ) : (
        <ul className="space-y-4">
          {data?.companies?.map((company) => (
            <li
              key={company._id}
              className="flex items-center justify-between border p-4 rounded shadow"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={company.profilePicture}
                  alt={company.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-lg font-semibold">{company.name}</h3>
                  <h3 className="text-lg font-semibold">{company._id}</h3>
                  <p className="text-sm text-gray-600">{company.email}</p>
                  <p className="text-sm">
                    <strong>Website:</strong>{" "}
                    {company.url ? (
                      <a
                        href={company.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline"
                      >
                        {company.url}
                      </a>
                    ) : (
                      "N/A"
                    )}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() =>
                    handleViewOpportunities(company._id, company.name)
                  }
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm"
                >
                  View Opportunities
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Opportunities Modal */}
      <Modal
        isOpen={modalType === "opportunities"}
        onClose={closeModal}
        title={`Opportunities - ${getSelectedCompanyName()}`}
      >
        {opportunitiesLoading ? (
          <div>Loading opportunities...</div>
        ) : (
          <div>
            {opportunitiesData?.opportunities?.length === 0 ? (
              <p>No opportunities found for this company.</p>
            ) : (
              <div className="space-y-4">
                {opportunitiesData?.opportunities?.map((opportunity) => (
                  <div key={opportunity._id} className="border p-4 rounded">
                    <h4 className="text-lg font-semibold">
                      {opportunity.title}
                    </h4>
                    <p className="text-gray-600 mb-2">
                      {opportunity.description}
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <p>
                        <strong>Type:</strong> {opportunity.type}
                      </p>
                      <p>
                        <strong>Status:</strong> {opportunity.status}
                      </p>
                      <p>
                        <strong>Openings:</strong>{" "}
                        {opportunity.numberOfOpenings}
                      </p>
                      <p>
                        <strong>ID:</strong> {opportunity._id}
                      </p>
                      <p>
                        <strong>Paid:</strong>{" "}
                        {opportunity.isPaid
                          ? `Yes ($${opportunity.amount})`
                          : "No"}
                      </p>
                      <p>
                        <strong>Deadline:</strong>{" "}
                        {new Date(opportunity.deadline).toLocaleDateString()}
                      </p>
                      <p>
                        <strong>Applicants:</strong>{" "}
                        {opportunity.applicants.length}
                      </p>
                    </div>
                    <div className="mt-3">
                      <button
                        onClick={() =>
                          handleViewApplicants(
                            opportunity._id,
                            opportunity.title
                          )
                        }
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-sm"
                      >
                        View Applicants ({opportunity.applicants.length})
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Applicants Modal */}
      <Modal
        isOpen={modalType === "applicants"}
        onClose={closeModal}
        title={`Applicants - ${selectedOppTitle}`}
      >
        {applicantsLoading ? (
          <div>Loading applicants...</div>
        ) : (
          <div>
            {applicantsData?.length === 0 ? (
              <p>No applicants found for this opportunity.</p>
            ) : (
              <div className="space-y-4">
                {applicantsData?.map((applicant) => (
                  <div key={applicant._id} className="border p-4 rounded">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <p>
                        <strong>User ID:</strong> {applicant._id}
                      </p>
                      <p>
                        <strong>Status:</strong>
                        <span
                          className={`ml-2 px-2 py-1 rounded text-xs ${
                            applicant.status === "selected"
                              ? "bg-green-100 text-green-800"
                              : applicant.status === "shortlisted"
                              ? "bg-yellow-100 text-yellow-800"
                              : applicant.status === "rejected"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {applicant.status}
                        </span>
                      </p>
                      <p>
                        <strong>Applied At:</strong>{" "}
                        {new Date(applicant.appliedAt).toLocaleDateString()}
                      </p>
                      <p>
                        <strong>Completion:</strong>{" "}
                        {applicant.completionStatus}
                      </p>
                    </div>
                    {applicant.coverLetter && (
                      <div className="mt-2">
                        <strong>Cover Letter:</strong>
                        <p className="text-gray-600 mt-1">
                          {applicant.coverLetter}
                        </p>
                      </div>
                    )}
                    {(applicant.proofOfWork?.link ||
                      applicant.proofOfWork?.screenshot) && (
                      <div className="mt-2">
                        <strong>Proof of Work:</strong>
                        {applicant.proofOfWork.link && (
                          <p>
                            <a
                              href={applicant.proofOfWork.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 underline"
                            >
                              View Link
                            </a>
                          </p>
                        )}
                        {applicant.proofOfWork.screenshot && (
                          <p>Screenshot: {applicant.proofOfWork.screenshot}</p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

export default Provider;

// /* =========================== In Sidebar of Provider Layout
//  * PROVIDER - [GET] : getallcompanies | Filter getsinglecompany
//  * OPPORTUNITY - [GET] : getallOpp | getOppBysinglecompany
//  * Applicant - [GET] : getallapplicants | getapplicantsyOppId | getapplicantsdetail
//  * PAYMENT-TO-APPLICANT - [GET/POST] : getapplicantspaymentdetail | MakePaymentToApplicant
//  * */

// /* 
// * STEP 1: [Make children pages with Layout] : Matlab Outlet wale pages banana h (Day 1)
// *STEP 2:  [Re-Edit Both Layouts] : Matlb ClientLayout aur ProviderLayout ko edit krna h, add sidebar
// ...API
// * 
// */
