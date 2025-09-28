import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, AlertCircle, Clock, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Dashboard({ stats }) {
  return (
    <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <CardHeader>
            <CardTitle>Total Students</CardTitle>
            <Users />
          </CardHeader>
          <CardContent>
            <div>{stats.totalStudents}</div>
          </CardContent>
        </Card>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <CardHeader>
            <CardTitle>Pending Feedback</CardTitle>
            <AlertCircle />
          </CardHeader>
          <CardContent>
            <div>{stats.pendingFeedback}</div>
          </CardContent>
        </Card>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <CardHeader>
            <CardTitle>In Progress</CardTitle>
            <Clock />
          </CardHeader>
          <CardContent>
            <div>{stats.inProgress}</div>
          </CardContent>
        </Card>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <CardHeader>
            <CardTitle>Completed</CardTitle>
            <CheckCircle />
          </CardHeader>
          <CardContent>
            <div>{stats.completed}</div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
