import { useParams } from "react-router"

function AllApplications() {
  const {oppId} = useParams()
  return (
    <div>
      All Applicant (Cards) of Specific Opportunity
      <p>Here Company can Review(View) Work and Accept or Reject</p>
      <p>Current Opp Id: {oppId}</p>
    </div>
  )
}

export default AllApplications
