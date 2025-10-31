import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CreditCard, ExternalLink, CheckCircle, AlertCircle, ArrowLeft, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

function Payments() {
  const { oppId } = useParams();
  const navigate = useNavigate();
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleMakePayment = async () => {
    if (!oppId) {
      setError("No opportunity ID provided");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:3000/api/company/payments/opportunity/${oppId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add authorization header if needed
          // 'Authorization': `Bearer ${token}`
        },
        credentials: 'include', // Include cookies if using session-based auth
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 404) {
          throw new Error("Opportunity not found");
        } else if (response.status === 401) {
          throw new Error("This is a free opportunity - no payment required");
        }
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setPaymentData(data);
      setSuccess(true);

    } catch (err) {
      console.error('Payment error:', err);
      setError(err.message || 'Failed to create payment link');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentLinkClick = () => {
    if (paymentData?.link) {
      window.open(paymentData.link, '_blank', 'noopener,noreferrer');
    }
  };

  const getPaymentTypeText = (level) => {
    return level === "1" ? "First Payment" : "Second Payment";
  };

  const getPaymentDescription = (level) => {
    return level === "1" 
      ? "Complete your first payment (50% upfront) to proceed with this opportunity."
      : "Complete your second payment (remaining 50%) to finalize this opportunity.";
  };

  const getPaymentBadgeVariant = (level) => {
    return level === "1" ? "default" : "secondary";
  };

  useEffect(() => {
    if (!oppId) {
      setError("No opportunity ID provided in URL");
    }
  }, [oppId]);

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate(-1)}
            className="p-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Processing</h1>
            <p className="text-gray-600">
              Complete your payment to proceed with opportunity: 
              <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded ml-2">
                {oppId}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Initial Payment Card */}
      {!success && (
        <Card className="mb-6 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-blue-600" />
              Initialize Payment
            </CardTitle>
            <CardDescription>
              Click the button below to generate a secure payment link for this opportunity.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  What happens next?
                </h3>
                <ul className="text-sm text-blue-800 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    A secure payment link will be generated for your opportunity
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    You'll be redirected to our secure payment gateway
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    Complete the payment to activate and proceed with your opportunity
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    Receive instant confirmation and access to next steps
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleMakePayment} 
              disabled={loading || !oppId}
              className="w-full"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Payment Link...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Generate Secure Payment Link
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Success Payment Card */}
      {success && paymentData && (
        <Card className="mb-6 border-green-200 bg-green-50 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <CheckCircle className="h-5 w-5" />
              Payment Link Generated Successfully
            </CardTitle>
            <CardDescription className="text-green-700">
              Your secure payment link is ready. Click below to complete your payment.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Company</label>
                <p className="text-gray-900 font-semibold">{paymentData.company}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Payment Type</label>
                <Badge variant={getPaymentBadgeVariant(paymentData.paymentLevel)} className="w-fit">
                  {getPaymentTypeText(paymentData.paymentLevel)}
                </Badge>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Payment Details</label>
              <p className="text-gray-600 bg-white p-3 rounded border">
                {paymentData.message}
              </p>
            </div>

            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                <p className="text-sm text-yellow-800 font-medium">
                  {getPaymentDescription(paymentData.paymentLevel)}
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={handlePaymentLinkClick}
              className="flex-1 bg-green-600 hover:bg-green-700"
              size="lg"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Proceed to Secure Payment
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/Dashboard')}
              className="flex-1"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Help & Information Card */}
      <Card className="bg-gray-50 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="h-5 w-5 text-gray-600" />
            Payment Information & Support
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div className="space-y-2">
                <p className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  Payments are processed securely through our certified payment gateway
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  First payments are typically 50% of the total opportunity amount
                </p>
              </div>
              <div className="space-y-2">
                <p className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">ⓘ</span>
                  You will receive confirmation email after successful payment
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">ⓘ</span>
                  For support, contact our team at support@company.com
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Payments;
