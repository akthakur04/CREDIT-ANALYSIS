import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectValue, SelectItem } from "./ui/select";
import { Label } from "./ui/label";

type MortgageData = {
  id?: string | undefined // Explicitly allowing undefined
  credit_score: string;
  loan_amount: string;
  property_value: string;
  annual_income: string;
  debt_amount: string;
  loan_type: string;
  property_type: string;
};

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  mortgage: MortgageData | null;
  onUpdate: () => void;
}

export default function EditModal({ isOpen, onClose, mortgage, onUpdate }: EditModalProps) {
  const [formData, setFormData] = useState<MortgageData | null>(mortgage);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [token, setToken] = useState<String | null>(null)

  useEffect(() => {

    let authtoken = localStorage.getItem('token')
    setToken(authtoken)
  }, [])

  useEffect(() => {
    setFormData(mortgage);
  }, [mortgage]);

  const handleChange = (name: string, value: string) => {
    if (formData) {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async () => {
    if (!formData) return;
    setIsSubmitting(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API}/api/mortgages/${formData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update mortgage");
      }

      onUpdate(); // Refresh mortgage list
      onClose(); // Close modal
    } catch (error) {
      console.error("Error updating mortgage:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !formData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}  >
      <DialogContent className="bg-white max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Edit Mortgage</DialogTitle>
        </DialogHeader>
        <div className="overflow-y-auto flex-grow p-4 space-y-4">
          <div className="space-y-2">
            <Label>Credit Score</Label>
            <Input value={formData.credit_score} onChange={(e) => handleChange("credit_score", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Loan Amount</Label>
            <Input value={formData.loan_amount} onChange={(e) => handleChange("loan_amount", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Property Value</Label>
            <Input value={formData.property_value} onChange={(e) => handleChange("property_value", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Annual Income</Label>
            <Input value={formData.annual_income} onChange={(e) => handleChange("annual_income", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Debt Amount</Label>
            <Input value={formData.debt_amount} onChange={(e) => handleChange("debt_amount", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Loan Type</Label>
            <Select value={formData.loan_type} onValueChange={(value: string) => handleChange("loan_type", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Loan Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fixed">Fixed</SelectItem>
                <SelectItem value="adjustable">Adjustable</SelectItem>
                <SelectItem value="fha">FHA</SelectItem>
                <SelectItem value="va">VA</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Property Type</Label>
            <Select value={formData.property_type} onValueChange={(value: string) => handleChange("property_type", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Property Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single_family">Single Family</SelectItem>
                <SelectItem value="condo">Condo</SelectItem>
                <SelectItem value="townhouse">Townhouse</SelectItem>
                <SelectItem value="multi_family">Multi-Family</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="bg-black  text-white" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
