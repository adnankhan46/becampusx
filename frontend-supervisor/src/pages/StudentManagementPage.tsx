import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {   Button } from "@/components/ui/button"
import { Badge  } from "@/components/ui/badge"
import { Student } from "./types"


// Example dummy data for students
const dummyStudents: Student[] = [
  {
    id: 1,
    name: "Rahul Sharma",
    rollNo: "21CS101",
    department: "Computer Science",
    internshipTitle: "Web Development Intern",
    duration: "2 months",
    status: "pending_feedback",
    startDate: "2024-07-01",
    endDate: "2024-08-31"
  },
  {
    id: 2,
    name: "Priya Patel",
    rollNo: "21EC205",
    department: "Electronics",
    internshipTitle: "IoT Solutions Intern",
    duration: "3 months",
    status: "in_progress",
    startDate: "2024-08-01",
    endDate: "2024-10-31"
  },
  {
    id: 3,
    name: "Amit Kumar",
    rollNo: "21ME150",
    department: "Mechanical",
    internshipTitle: "CAD Design Intern",
    duration: "2 months",
    status: "completed",
    startDate: "2024-06-01",
    endDate: "2024-07-31"
  }
]

// Example usage component for testing
export function StudentManagementPageWrapper() {
  // Dummy feedback handler
  function handleGiveFeedback(student: Student) {
    alert(`Give feedback for ${student.name}`)
  }

  return <StudentManagementPage students={dummyStudents} onGiveFeedback={handleGiveFeedback} />
}


interface StudentManagementPageProps {
  students?: Student[]
  onGiveFeedback: (student: Student) => void
}

function getStatusBadge(status: Student['status']) {
  switch (status) {
    case "in_progress":
      return <Badge className="bg-blue-100 text-blue-700 border-blue-200">In Progress</Badge>
    case "pending_feedback":
      return <Badge className="bg-amber-100 text-amber-700 border-amber-200">Pending Feedback</Badge>
    case "completed":
      return <Badge className="bg-green-100 text-green-700 border-green-200">Completed</Badge>
    default:
      return <Badge variant="outline">Unknown</Badge>
  }
}

export default function StudentManagementPage({  students = [],
  onGiveFeedback,
}: StudentManagementPageProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Assigned Students</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Roll No</th>
                <th>Department</th>
                <th>Internship Title</th>
                <th>Duration</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td>{student.name}</td>
                  <td>{student.rollNo}</td>
                  <td>{student.department}</td>
                  <td>{student.internshipTitle}</td>
                  <td>{student.duration}</td>
                  <td>{getStatusBadge(student.status)}</td>
                  <td>
                    {student.status === "pending_feedback" && (
                      <Button onClick={() => onGiveFeedback(student)} size="sm">
                        Give Feedback
                      </Button>
                    )}
                    {student.status === "completed" && (
                      <Button variant="outline" size="sm">
                        Certificate
                      </Button>
                    )}
                    {student.status === "in_progress" && (
                      <Button variant="ghost" size="sm" disabled>
                        In Progress
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
