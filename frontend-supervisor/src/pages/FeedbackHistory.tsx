import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge, Button } from "@/components/ui/button"
import { Star, Download } from "lucide-react"
import { FeedbackHistory } from "./types"

interface FeedbackHistoryPageProps {
  history: FeedbackHistory[]
}

export default function FeedbackHistoryPage({ history }: FeedbackHistoryPageProps) {
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
          </tbody>
        </table>
      </CardContent>
    </Card>
  )
}
