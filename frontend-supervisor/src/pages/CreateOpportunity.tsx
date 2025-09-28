import { useNavigate } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import OpportunityService, { CreateOppRequest } from "../api/api.opportunities";
import useCompanyStore from "@/store/store";

// shadcn/ui imports
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";


// Zod schema for form validation
const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  numberOfOpenings: z.number().min(1, "Number of openings must be at least 1"),
  isPaid: z.boolean(),
  amount: z.number().min(0),
  type: z.string(),
  status: z.string(),
  deadline: z.string().min(1, "Deadline is required"),
}).refine((data) => {
  if (data.isPaid && data.amount < 5) {
    return false;
  }
  return true;
}, {
  message: "Amount must be at least ₹5 for paid opportunities",
  path: ["amount"],
}).refine((data) => {
  const deadlineDate = new Date(data.deadline);
  const now = new Date();
  return deadlineDate > now;
}, {
  message: "Deadline must be in the future",
  path: ["deadline"],
});

function CreateOpportunity() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { company } = useCompanyStore();

  const opportunityTypes = [
    'engagement', 'survey', 'academic', 'development', 
    'marketing', 'design', 'research', 'other'
  ];

  // react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      numberOfOpenings: 1,
      isPaid: false,
      amount: 0,
      type: 'other',
      status: 'open',
      deadline: ''
    },
  });

  // Mutatation
  const createOpportunityMutation = useMutation({
    mutationFn: (data: CreateOppRequest) => OpportunityService.CreateOpportunity(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['OpportunitiesData'] });
      navigate('/Dashboard/allOpportunities');
    },
    onError: (error) => {
      console.error('Failed to create opportunity:', error);
    },
  });

  // minimum date (tomorrow)
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!company?._id) {
      alert('Company information not found');
      return;
    }

    const requestData: CreateOppRequest = {
      title: values.title,
      description: values.description,
      numberOfOpenings: values.numberOfOpenings,
      isPaid: values.isPaid,
      amount: values.amount,
      type: values.type,
      status: values.status,
      creator: 'Company',
      createdBy: {
        id: company._id,
        name: company.name || 'Unknown Company'
      },
      deadline: new Date(values.deadline).toISOString()
    };

    try {
      await createOpportunityMutation.mutateAsync(requestData);
    } catch (error) {
      console.error('Error creating opportunity:', error);
    }
  };

  return (
    <div className="w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Create New Opportunity</h1>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Title */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter opportunity title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description *</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Describe the opportunity in detail"
                    rows={4}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Number of Openings */}
          <FormField
            control={form.control}
            name="numberOfOpenings"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Openings *</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="1"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Type */}
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Opportunity Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select opportunity type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {opportunityTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Is Paid */}
          <FormField
            control={form.control}
            name="isPaid"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Is this Paid?</FormLabel>
                </div>
              </FormItem>
            )}
          />

          {/* Amount (conditional) */}
          {form.watch("isPaid") && (
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount (₹) *</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="5" 
                      step="0.01"
                      placeholder="Enter amount"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <p className="text-primary text-sm">Amount must be at least ₹5 (INR)</p>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Deadline */}
          <FormField
            control={form.control}
            name="deadline"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Deadline *</FormLabel>
                <FormControl>
                  <Input 
                    type="date" 
                    min={getMinDate()}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <div className="flex space-x-4">
            <Button 
              type="submit" 
              disabled={createOpportunityMutation.isPending}
              className="flex-1"
            >
              {createOpportunityMutation.isPending ? 'Creating...' : 'Create Opportunity'}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/Dashboard/allOpportunities')}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>

      {/* Error Display */}
      {createOpportunityMutation.isError && (
        <Alert variant="destructive" className="mt-4">
          <AlertDescription>
            Failed to create opportunity. Please try again.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

export default CreateOpportunity;
