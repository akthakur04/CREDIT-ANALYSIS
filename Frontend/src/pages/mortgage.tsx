import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Select, SelectTrigger, SelectContent, SelectValue, SelectItem } from "../components/ui/select"
import { Label } from "../components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Separator } from "../components/ui/separator"
import { Badge } from "../components/ui/badge"
import { AlertCircle, CheckCircle2, Delete,IndianRupee, Edit, Home, Loader2, TrashIcon } from "lucide-react"
import { cn } from "../lib/utils"
import EditModal from "../components/EditMortage"
const formatCurrency = (value: string) => {
  if (!value && typeof (value) != 'string') return ""
  const number = Number.parseFloat(value.replace(/[^\d.]/g, ""))
  return isNaN(number)
    ? ""
    : number.toLocaleString("en-IN", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
}

// Helper function to parse currency input
const parseCurrency = (value: string) => {
  return value.replace(/[^\d.]/g, "")
}

type MortgageData = {
  id?: string | undefined,
  credit_score: string,
  loan_amount: string,
  property_value: string,
  annual_income: string,
  debt_amount: string,
  loan_type: string,
  property_type: string,
  status?: string,
  interestRate?: string,
  monthlyPayment?: string,
  credit_rating?: string

}

type MortgageDataRecieved = {
  id?: string
  credit_score: string
  loan_amount: string
  property_value: string
  annual_income: string
  debt_amount: string
  loan_type: string,
  property_type: string
  status?: string
  interestRate?: string,
  credit_rating?: string,
  monthlyPayment?: string
}

export default function MortgageApp() {
  const [mortgages, setMortgages] = useState<MortgageData[]>([])
  const [token,setToken]=useState<String|null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("application")
  const [formData, setFormData] = useState<MortgageData>({
    credit_score: "",
    loan_amount: "",
    property_value: "",
    annual_income: "",
    debt_amount: "",
    loan_type: "fixed",
    property_type: "single_family",
  })
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedMortgage, setSelectedMortgage] = useState<MortgageData | null>(null);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (name: string, value: string) => {
    let errorMessage = "";
  
    if (name === "credit_score") {
      const score = Number(value);
      if (isNaN(score) || score < 300 || score > 900) {
        errorMessage = "Credit score must be between 300 and 900.";
      }
    }
  
    if (name === "loan_amount") {
      const loanAmount = Number(value.replace(/[^\d.]/g, ""));
      if (isNaN(loanAmount) || loanAmount < 100000) {
        errorMessage = "Loan amount must be at least ₹1,00,000.";
      }
    }
  
    if (name === "annual_income") {
      const income = Number(value.replace(/[^\d.]/g, ""));
      if (isNaN(income) || income < 300000) {
        errorMessage = "Annual income must be at least ₹3,00,000.";
      }
    }
  
    if (name === "property_value") {
      const propertyValue = Number(value.replace(/[^\d.]/g, ""));
      if (isNaN(propertyValue) || propertyValue < 500000) {
        errorMessage = "Property value must be at least ₹5,00,000.";
      }
    }
  
    if (name === "debt_amount") {
      const debt = Number(value.replace(/[^\d.]/g, ""));
      if (isNaN(debt) || debt < 0) {
        errorMessage = "Debt amount must be a positive number.";
      }
    }
  
    setErrors((prev) => ({ ...prev, [name]: errorMessage }));
    setFormData({ ...formData, [name]: value });
  };
  

  const handleEdit = (mortgage: MortgageData) => {
    setSelectedMortgage(mortgage);
    setIsEditOpen(true);
  };
  useEffect(()=>{

    let authtoken=localStorage.getItem('token')
    setToken(authtoken)
  },[])
  const handleCurrencyChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: parseCurrency(value) })
  }
  const fetchMortgages = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/mortgages", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (!response.ok) throw new Error("Failed to fetch mortgages")
      const data = await response.json()
      setMortgages(data)
    } catch (error) {
      console.error("Error fetching mortgage data:", error)
    }
  }
  const DeleteMortage = async (mortgageId: string) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/mortgages/${mortgageId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        },

      })
      if (!response.ok) throw new Error("Failed to fetch mortgages")
      await fetchMortgages()
    } catch (error) {
      console.error("Error fetching mortgage data:", error)
    }
  }
  useEffect(() => {
    fetchMortgages()
  }, [])
  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/mortgages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          credit_score: Number(formData.credit_score),
          loan_amount: Number(formData.loan_amount),
          property_value: Number(formData.property_value),
          annual_income: Number(formData.annual_income),
          debt_amount: Number(formData.debt_amount),
          loan_type: formData.loan_type,
          property_type: formData.property_type,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to submit mortgage application")
      }
      await fetchMortgages()

      const data = await response.json()
      setActiveTab("applications")

      setFormData({
        credit_score: "",
        loan_amount: "",
        property_value: "",
        annual_income: "",
        debt_amount: "",
        loan_type: "fixed",
        property_type: "single_family",
      })
    } catch (error) {
      console.error("Error submitting mortgage application:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const isFormValid = () => {
    return (
      formData.credit_score &&
      formData.loan_amount &&
      formData.property_value &&
      formData.annual_income &&
      formData.loan_type &&
      formData.property_type &&
      Object.values(errors).every((err) => err === "")
    );
  };
  
  return (
    <div className="container mx-auto py-8 pt-[100px] max-w-4xl">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Mortgage Center</h1>
            <p className="text-muted-foreground mt-1">Apply for a new mortgage or view your applications</p>
          </div>
          <TabsList>
            <TabsTrigger value="application" className={`px-4`}>
              New Application
            </TabsTrigger>
            <TabsTrigger value="applications" className={` px-4`}>
              Applications
              {mortgages.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {mortgages.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="application">
          <Card className="shadow-md">
            <CardHeader className="bg-muted/50">
              <CardTitle>Credit Analysis</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="credit_score">Credit Score</Label>
                      <Input
                        id="credit_score"
                        name="credit_score"
                        type="number"
                        placeholder="Enter your credit score"
                        value={formData.credit_score}
                        onChange={(e) => handleChange(e.target.name, e.target.value)}
                      />
                        {errors.credit_score && <p className="text-red-500 text-sm">{errors.credit_score}</p>}

                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="annual_income">Annual Income</Label>
                      <div className="relative">
                        <IndianRupee className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                        <Input
                          id="annual_income"
                          name="annual_income"
                          className="pl-10"
                          placeholder="Enter your annual income"
                          value={formData.annual_income ? formatCurrency(formData.annual_income) : ""}
                          onChange={(e) => handleCurrencyChange(e.target.name, e.target.value)}
                        />
                                                {errors.annual_income && <p className="text-red-500 text-sm">{errors.annual_income}</p>}

                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="debt_amount">Current Debt</Label>
                      <div className="relative">
                        <IndianRupee className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                        <Input
                          id="debt_amount"
                          name="debt_amount"
                          className="pl-10"
                          placeholder="Enter your current debt"
                          value={formData.debt_amount ? formatCurrency(formData.debt_amount) : ""}
                          onChange={(e) => handleCurrencyChange(e.target.name, e.target.value)}
                        />
                        {errors.debt_amount && <p className="text-red-500 text-sm">{errors.debt_amount}</p>}

                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-medium mb-4">Loan Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="loan_amount">Loan Amount</Label>
                      <div className="relative">
                        <IndianRupee className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                        <Input
                          id="loan_amount"
                          name="loan_amount"
                          className="pl-10"
                          placeholder="Enter loan amount"
                          value={formData.loan_amount ? formatCurrency(formData.loan_amount) : ""}
                          onChange={(e) => handleCurrencyChange(e.target.name, e.target.value)}
                        />
                                                {errors.loan_amount && <p className="text-red-500 text-sm">{errors.loan_amount}</p>}

                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="property_value">Property Value</Label>
                      <div className="relative">
                        <IndianRupee className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                        <Input
                          id="property_value"
                          name="property_value"
                          className="pl-10"
                          placeholder="Enter property value"
                          value={formData.property_value ? formatCurrency(formData.property_value) : ""}
                          onChange={(e) => handleCurrencyChange(e.target.name, e.target.value)}
                        />
                                                {errors.property_value && <p className="text-red-500 text-sm">{errors.property_value}</p>}

                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="loan_type">Loan Type</Label>
                      <Select value={formData.loan_type} onValueChange={(value: string) => handleChange("loan_type", value)}>
                        <SelectTrigger id="loan_type">
                          <SelectValue placeholder="Select Loan Type" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          <SelectItem value="fixed">Fixed Rate</SelectItem>
                          <SelectItem value="adjustable">Adjustable Rate</SelectItem>
                          <SelectItem value="fha">FHA Loan</SelectItem>
                          <SelectItem value="va">VA Loan</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="property_type">Property Type</Label>
                      <Select
                        value={formData.property_type}
                        onValueChange={(value: string) => handleChange("property_type", value)}
                      >
                        <SelectTrigger id="property_type">
                          <SelectValue placeholder="Select Property Type" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          <SelectItem value="single_family">Single Family Home</SelectItem>
                          <SelectItem value="condo">Condominium</SelectItem>
                          <SelectItem value="townhouse">Townhouse</SelectItem>
                          <SelectItem value="multi_family">Multi-Family Home</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/30 flex justify-between">
              <Button
                variant="outline"
                onClick={() =>
                  setFormData({
                    credit_score: "",
                    loan_amount: "",
                    property_value: "",
                    annual_income: "",
                    debt_amount: "",
                    loan_type: "fixed",
                    property_type: "single_family",
                  })
                }
              >
                Clear Form
              </Button>
              <Button onClick={handleSubmit} className="bg-black text-white" disabled={!isFormValid() || isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing
                  </>
                ) : (
                  "Submit Application"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="applications">
          <Card className="shadow-md">
            <CardHeader className="bg-muted/50">
              <CardTitle>Applications</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {mortgages.length === 0 ? (
                <div className="text-center py-12">
                  <Home className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No applications yet</h3>
                  <p className="text-muted-foreground mt-1">Submit a new application to get started</p>
                  <Button variant="outline" className="mt-4" onClick={() => setActiveTab("application")}>
                    Create New Application
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {mortgages.map((mortgage, index) => (
                    <Card key={index} className="overflow-hidden">
                      <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 ">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-medium">Credt Rating - </h3>
                            <Badge
                              className={cn(
                                "capitalize",
                                mortgage.credit_rating === "AAA" ? "bg-green-100 text-green-800" : "",
                              )}
                            >
                              {mortgage.credit_rating === "AAA" ? (
                                <CheckCircle2 className="mr-1 h-3 w-3" />
                              ) : (
                                <AlertCircle className="mr-1 h-3 w-3" />
                              )}
                              {mortgage.credit_rating}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                            <div>
                              <span className="text-muted-foreground">Loan Amount:</span>{" "}
                              {mortgage.loan_amount}
                            </div>
                            <div>
                              <span className="text-muted-foreground">Property Type:</span>{" "}
                              {mortgage.property_type.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                            </div>
                            <div>
                              <span className="text-muted-foreground">Loan Type:</span>{" "}
                              {mortgage.loan_type.charAt(0).toUpperCase() + mortgage.loan_type.slice(1)} Rate
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <Edit className="cursor-pointer" onClick={() => handleEdit(mortgage)} />
                          <TrashIcon className="cursor-pointer" onClick={() => {
                            if (mortgage.id) DeleteMortage(mortgage?.id)
                          }} />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
            <EditModal
              isOpen={isEditOpen}
              onClose={() => setIsEditOpen(false)}
              mortgage={selectedMortgage}
              onUpdate={fetchMortgages} // Refresh mortgage list after update
            />

          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

