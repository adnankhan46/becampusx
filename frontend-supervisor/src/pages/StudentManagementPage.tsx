import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge, Button } from "@/components/ui/button"
import FeedbackDialog from "./FeedbackDialog" // Separate feedback modal

export default function StudentManagementPage({ students, openFeedbackModal }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Assigned Students</CardTitle>
      </CardHeader>
      <CardContent>
        <table className="w-full border-collapse">
          <thead>{/* ...same as yours... */}</thead>
          <tbody>
            {students.map(student => (
              <tr key={student.id}>
                <td>{student.name}</td>
                {/* ...other td... */}
                <td>
                  {student.status === 'pending_feedback' && (
                    <Button onClick={() => openFeedbackModal(student)}>
                      Give Feedback
                    </Button>
                  )}
                  {/* ...other actions... */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
      {/* FeedbackDialog should be controlled at a higher level, e.g. in parent */}
    </Card>
  )
}
