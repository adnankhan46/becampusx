import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Download } from "lucide-react"
import { FeedbackHistory } from "./types"

// Example Dummy Data
const dummyHistory: FeedbackHistory[] = [
  {
    id: 1,
    studentName: "John Doe",
    internshipTitle: "Frontend Development",
    rating: "Excellent",
    recommendation: "Yes",
    dateSubmitted: "2024-08-15",
    certificateId: "CERT001"
  },
  {
    id: 2,
    studentName: "Jane Smith",
    internshipTitle: "Backend Development",
    rating: "Good",
    recommendation: "Yes",
    dateSubmitted: "2024-07-20",
    certificateId: "CERT002"
  }
]

interface FeedbackHistoryPageProps {
  history?: FeedbackHistory[] // Optional prop
}

export default function FeedbackHistoryPage({ history = [] }: FeedbackHistoryPageProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Feedback History</CardTitle>
      </CardHeader>
      <CardContent>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Internship Title</th>
              <th>Rating</th>
              <th>Recommendation</th>
              <th>Date Submitted</th>
              <th>Certificate</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item) => (
              <tr key={item.id}>
                <td>{item.studentName}</td>
                <td>{item.internshipTitle}</td>
                <td>
                  <Star className="h-4 w-4 text-yellow-500 mr-1" />
                  {item.rating}
                </td>
                <td>
                  <Badge className={item.recommendation === 'Yes' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                    {item.recommendation}
                  </Badge>
                </td>
                <td>{new Date(item.dateSubmitted).toLocaleDateString()}</td>
                <td>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </td>
              </tr>
            ))}
            {history.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-500">
                  No feedback history available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </CardContent>
    </Card>
  )
}

 

export function FeedbackHistoryPageWrapper() {
  return <FeedbackHistoryPage history={dummyHistory} />
}
