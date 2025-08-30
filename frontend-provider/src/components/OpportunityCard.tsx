import { useState } from "react"
import { Calendar, Users, Award, User, ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Opportunity } from "@/api/api.opportunities"
import useCompanyStore from "@/store/store"
import { Link } from "react-router"


export function OpportunityCard({ opportunity }: { opportunity: Opportunity }) {
    const {company} = useCompanyStore();
  const [isHovered, setIsHovered] = useState(false)

  const formattedDate = new Date(opportunity.deadline).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="w-full"
    >
      <Card className="overflow-hidden border-gray-200 transition-all duration-300 hover:border-[#6a7cff]/50 hover:shadow-md">
        <CardHeader>
          <div className="flex items-start justify-between">
            <h3 className="text-xl font-semibold text-gray-800 line-clamp-2">{opportunity.title}</h3>
            <div className="flex flex-col items-end gap-1">
              <Badge variant="outline" className="bg-[#6a7cff]/10 text-[#6a7cff] border-[#6a7cff]/20">
                {opportunity.type.charAt(0).toUpperCase()+ opportunity.type.slice(1)}
              </Badge>
              <Badge
                variant="outline"
                className={
                  opportunity.status === "open"
                    ? "bg-green-100 text-green-700 border-green-200"
                    : "bg-amber-100 text-amber-700 border-amber-200"
                }
              >
                {opportunity.status.charAt(0).toUpperCase() + opportunity.status.slice(1)}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pb-2">
          <p className="mb-4 line-clamp-2">{opportunity.description}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-center text-gray-600">
              <Calendar className="h-4 w-4 mr-2 text-[#6a7cff]" />
              <span className="text-sm">
                Deadline: <span className="font-medium">{formattedDate}</span>
              </span>
            </div>

            <div className="flex items-center text-gray-600">
              <Users className="h-4 w-4 mr-2 text-[#6a7cff]" />
              <span className="text-sm">
                Openings: <span className="font-medium">{opportunity.numberOfOpenings}</span>
              </span>
            </div>

            <div className="flex items-center text-gray-600">
              <User className="h-4 w-4 mr-2 text-[#6a7cff]" />
              <span className="text-sm">
                Posted by: <span className="font-medium">{opportunity.createdBy.name}</span>
              </span>
            </div>

            <div className="flex items-center text-gray-600">
              <Users className="h-4 w-4 mr-2 text-[#6a7cff]" />
              <span className="text-sm">
                Applicants: <span className="font-medium">{opportunity.applicants.length}</span>
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between text-primary text-xs mt-4">
            <span>
              Posted on{" "}
              {new Date(opportunity.createdAt).toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
              <span className="flex items-center">
                {(opportunity.paymentStatus.firstPayment.status === null) ? "": <div>
                <span  className="text-black">
              is First Payment done?
              </span>
            <span  className="p-2 border rounded-md">
              {(opportunity.paymentStatus?.firstPayment?.status === true)?" True":" False"}
              </span>
              </div>}

              
               </span>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between items-center border-t bg-gray-50/50">
        {/* If User: Participate, if Provider: Vew Applicants */}
          <Link to={(opportunity.paymentStatus.firstPayment.status === true || opportunity.paymentStatus.firstPayment.status === null) ? `/Dashboard/allApplicants/${opportunity._id}` : `/Dashboard/payments`}>
          <Button
            variant="outline"
            className="text-[#6a7cff] border-[#6a7cff]/30 hover:bg-[#6a7cff]/10 hover:text-[#6a7cff] hover:border-[#6a7cff]"
            >
{(company) && (opportunity.paymentStatus.firstPayment.status === true || opportunity.paymentStatus.firstPayment.status === null) 
  ? <span>View Applicants</span> 
  : <span>Make first payment</span>
}
            <ChevronRight
              className={`ml-1 h-4 w-4 transition-transform duration-300 ${isHovered ? "translate-x-1" : ""}`}
              />
          </Button>
              </Link>

          <div className="flex items-center gap-1 bg-[#6a7cff] text-white px-4 py-2 rounded-full">
            <Award className="h-4 w-4" />
            <span className="text-sm font-medium">{(opportunity.amount===0) ? "1000 AURA" : ("₹ " + opportunity.amount.toLocaleString())}</span>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
