import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, AlertCircle, Clock, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"
import { Stats } from "./types"

interface DashboardPageProps {
  stats?: Stats
}

const FallbackStats: Stats = {
  totalStudents: 40,
  pendingFeedback: 12,
  completed: 20,
  inProgress: 8,
}

export default function DashboardPage({ stats }: DashboardPageProps) {
  // Define safeStats here to fall back if stats is undefined
  const safeStats = stats ?? FallbackStats

  return (
    <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Total Students */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <CardHeader>
            <CardTitle>Total Students</CardTitle>
            <Users />
          </CardHeader>
          <CardContent>
            <div>{safeStats.totalStudents}</div> {/* Use safeStats, not Stats */}
          </CardContent>
        </Card>
      </motion.div>

      {/* Pending Feedback */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <CardHeader>
            <CardTitle>Pending Feedback</CardTitle>
            <AlertCircle />
          </CardHeader>
          <CardContent>
            <div>{safeStats.pendingFeedback}</div> {/* Use safeStats */}
          </CardContent>
        </Card>
      </motion.div>

      {/* In Progress */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <CardHeader>
            <CardTitle>In Progress</CardTitle>
            <Clock />
          </CardHeader>
          <CardContent>
            <div>{safeStats.inProgress}</div> {/* Use safeStats */}
          </CardContent>
        </Card>
      </motion.div>

      {/* Completed */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <CardHeader>
            <CardTitle>Completed</CardTitle>
            <CheckCircle />
          </CardHeader>
          <CardContent>
            <div>{safeStats.completed}</div> {/* Use safeStats */}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
