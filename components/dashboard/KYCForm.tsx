'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Upload, Check, ArrowRight, ArrowLeft, User, MapPin, FileText, Clock, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface KYCFormData {
  // Personal Information
  firstName: string;
  lastName: string;
  otherName: string;
  gender: string;
  dateOfBirth: string;
  phoneNumber: string;
  
  // Location Information
  nationality: string;
  countryOfResidence: string;
  stateRegion: string;
  address: string;
  
  // Identification
  idType: string;
  issuingCountry: string;
  idNumber: string;
  
  // Documents
  frontIdImage: File | null;
  backIdImage: File | null;
}

const INITIAL_FORM_DATA: KYCFormData = {
  firstName: '',
  lastName: '',
  otherName: '',
  gender: '',
  dateOfBirth: '',
  phoneNumber: '',
  nationality: '',
  countryOfResidence: '',
  stateRegion: '',
  address: '',
  idType: '',
  issuingCountry: '',
  idNumber: '',
  frontIdImage: null,
  backIdImage: null,
};

const COUNTRIES = [
  'Nigeria', 'Ghana', 'Kenya', 'South Africa', 'United States', 
  'United Kingdom', 'Canada', 'Australia', 'Others'
];

const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa',
  'Benue', 'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo',
  'Ekiti', 'Enugu', 'FCT', 'Gombe', 'Imo', 'Jigawa', 'Kaduna',
  'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa',
  'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers',
  'Sokoto', 'Taraba', 'Yobe', 'Zamfara'
];

const ID_TYPES = [
  'National ID Card',
  'International Passport',
  "Driver's License",
  "Voter's Card",
  'Others'
];

export function KYCForm() {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<KYCFormData>(INITIAL_FORM_DATA);
  const [frontIdPreview, setFrontIdPreview] = useState<string>('');
  const [backIdPreview, setBackIdPreview] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [kycStatus, setKycStatus] = useState<{
    status: 'none' | 'pending' | 'approved' | 'rejected';
    rejectionReason?: string;
    submittedAt?: string;
  }>({ status: 'none' });

  // Check KYC status on mount
  useEffect(() => {
    const checkKycStatus = () => {
      const userKycStatus = localStorage.getItem('user-kyc-status');
      if (userKycStatus) {
        setKycStatus(JSON.parse(userKycStatus));
      }
    };
    checkKycStatus();

    // Poll for status updates every 5 seconds
    const interval = setInterval(checkKycStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const updateField = (field: keyof KYCFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'front' | 'back') => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Please upload an image smaller than 5MB',
        variant: 'destructive'
      });
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload an image file',
        variant: 'destructive'
      });
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === 'front') {
        setFrontIdPreview(reader.result as string);
        updateField('frontIdImage', file);
      } else {
        setBackIdPreview(reader.result as string);
        updateField('backIdImage', file);
      }
    };
    reader.readAsDataURL(file);
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        // Personal Information validation
        if (!formData.firstName || !formData.lastName || !formData.gender || 
            !formData.dateOfBirth || !formData.phoneNumber) {
          toast({
            title: 'Incomplete Information',
            description: 'Please fill in all required personal information fields',
            variant: 'destructive'
          });
          return false;
        }
        return true;
      
      case 2:
        // Location Information validation
        if (!formData.nationality || !formData.countryOfResidence || 
            !formData.stateRegion || !formData.address) {
          toast({
            title: 'Incomplete Information',
            description: 'Please fill in all required location information fields',
            variant: 'destructive'
          });
          return false;
        }
        return true;
      
      case 3:
        // Identification validation
        if (!formData.idType || !formData.issuingCountry || !formData.idNumber) {
          toast({
            title: 'Incomplete Information',
            description: 'Please fill in all required identification fields',
            variant: 'destructive'
          });
          return false;
        }
        return true;
      
      case 4:
        // Document upload validation
        if (!formData.frontIdImage || !formData.backIdImage) {
          toast({
            title: 'Documents Required',
            description: 'Please upload both front and back of your ID document',
            variant: 'destructive'
          });
          return false;
        }
        return true;
      
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) return;

    setSubmitting(true);
    try {
      // Create KYC request object
      const kycRequest = {
        id: `kyc_${Date.now()}`,
        name: `${formData.firstName} ${formData.lastName}`,
        legalName: `${formData.firstName} ${formData.lastName}${formData.otherName ? ' ' + formData.otherName : ''}`,
        email: 'user@example.com', // In real app, get from user session
        phone: formData.phoneNumber,
        address: formData.address,
        documentType: formData.idType,
        frontIdImage: frontIdPreview,
        backIdImage: backIdPreview,
        submittedAt: new Date().toISOString(),
        status: 'pending',
        documents: ['ID Front', 'ID Back'],
        // Extended fields
        firstName: formData.firstName,
        lastName: formData.lastName,
        otherName: formData.otherName,
        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth,
        nationality: formData.nationality,
        countryOfResidence: formData.countryOfResidence,
        stateRegion: formData.stateRegion,
        idType: formData.idType,
        issuingCountry: formData.issuingCountry,
        idNumber: formData.idNumber,
      };

      // Save to localStorage for admin review
      const existingRequests = JSON.parse(localStorage.getItem('kyc-requests') || '[]');
      existingRequests.push(kycRequest);
      localStorage.setItem('kyc-requests', JSON.stringify(existingRequests));

      // Set user's KYC status to pending
      const userStatus = {
        status: 'pending' as const,
        submittedAt: new Date().toISOString(),
      };
      localStorage.setItem('user-kyc-status', JSON.stringify(userStatus));
      setKycStatus(userStatus);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: 'KYC Submitted Successfully',
        description: 'Your application is under review. You will be notified once processed.',
      });
      
      // Reset form
      setFormData(INITIAL_FORM_DATA);
      setFrontIdPreview('');
      setBackIdPreview('');
      setCurrentStep(1);
    } catch (error) {
      toast({
        title: 'Submission Failed',
        description: 'Please try again later',
        variant: 'destructive'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="mb-6">
      <div className="flex items-center justify-center max-w-2xl mx-auto">
        {[1, 2, 3, 4].map((step) => (
          <div key={step} className="flex items-center flex-1">
            <div className={`
              flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full font-semibold text-sm
              ${currentStep >= step 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-500'}
            `}>
              {currentStep > step ? <Check className="w-5 h-5" /> : step}
            </div>
            {step < 4 && (
              <div className={`flex-1 h-1 mx-2 ${currentStep > step ? 'bg-blue-600' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <Card className="p-6 md:p-8 border-gray-200 shadow-sm">
      {/* KYC Approved Status */}
      {kycStatus.status === 'approved' && (
        <div className="text-center py-12">
          <div className="mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">KYC Approved!</h3>
            <p className="text-gray-600">
              Your identity has been verified successfully. You now have full access to all platform features.
            </p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-md mx-auto">
            <p className="text-sm text-green-800">
              <strong>Status:</strong> Verified ✓
            </p>
          </div>
        </div>
      )}

      {/* KYC Pending Status */}
      {kycStatus.status === 'pending' && (
        <div className="text-center py-12">
          <div className="mb-6">
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Clock className="w-10 h-10 text-yellow-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">KYC Under Review</h3>
            <p className="text-gray-600 mb-4">
              Your verification documents have been submitted and are currently being reviewed by our team.
            </p>
            <p className="text-sm text-gray-500">
              Submitted on: {kycStatus.submittedAt ? new Date(kycStatus.submittedAt).toLocaleString() : 'N/A'}
            </p>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md mx-auto">
            <p className="text-sm text-yellow-800">
              <strong>Status:</strong> Pending Review
            </p>
            <p className="text-xs text-yellow-700 mt-2">
              This usually takes 24-48 hours. You'll be notified once the review is complete.
            </p>
          </div>
        </div>
      )}

      {/* KYC Rejected - Show reason and allow resubmission */}
      {kycStatus.status === 'rejected' && (
        <>
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <X className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-red-900 mb-1">KYC Application Rejected</h4>
                <p className="text-sm text-red-800 mb-2">
                  Unfortunately, your KYC application was not approved. Please review the reason below and resubmit with the correct information.
                </p>
                <div className="bg-white border border-red-300 rounded p-3 mt-3">
                  <p className="text-xs font-semibold text-red-900 mb-1">Rejection Reason:</p>
                  <p className="text-sm text-red-800">{kycStatus.rejectionReason || 'No reason provided'}</p>
                </div>
              </div>
            </div>
          </div>
          {/* Show form for resubmission */}
        </>
      )}

      {/* Show form only if not approved or pending */}
      {(kycStatus.status === 'none' || kycStatus.status === 'rejected') && (
        <>
          {renderStepIndicator()}

      {/* Step 1: Personal Information */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-6 pb-3 border-b border-gray-200">
            <User className="w-6 h-6 text-blue-600" />
            <h3 className="text-xl font-bold text-gray-900">Personal Information</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName" className="text-sm font-medium mb-2 block">
                First Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => updateField('firstName', e.target.value)}
                placeholder="Enter your first name"
                className="border-gray-200"
              />
            </div>

            <div>
              <Label htmlFor="lastName" className="text-sm font-medium mb-2 block">
                Last Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => updateField('lastName', e.target.value)}
                placeholder="Enter your last name"
                className="border-gray-200"
              />
            </div>

            <div>
              <Label htmlFor="otherName" className="text-sm font-medium mb-2 block">
                Other Name
              </Label>
              <Input
                id="otherName"
                value={formData.otherName}
                onChange={(e) => updateField('otherName', e.target.value)}
                placeholder="Enter other name (optional)"
                className="border-gray-200"
              />
            </div>

            <div>
              <Label htmlFor="gender" className="text-sm font-medium mb-2 block">
                Gender <span className="text-red-500">*</span>
              </Label>
              <Select value={formData.gender} onValueChange={(val) => updateField('gender', val)}>
                <SelectTrigger className="border-gray-200">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="dateOfBirth" className="text-sm font-medium mb-2 block">
                Date of Birth <span className="text-red-500">*</span>
              </Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => updateField('dateOfBirth', e.target.value)}
                className="border-gray-200"
                max={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div>
              <Label htmlFor="phoneNumber" className="text-sm font-medium mb-2 block">
                Phone Number <span className="text-red-500">*</span>
              </Label>
              <Input
                id="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => updateField('phoneNumber', e.target.value)}
                placeholder="+234 801 234 5678"
                className="border-gray-200"
              />
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Location Information */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-6 pb-3 border-b border-gray-200">
            <MapPin className="w-6 h-6 text-green-600" />
            <h3 className="text-xl font-bold text-gray-900">Location Information</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nationality" className="text-sm font-medium mb-2 block">
                Nationality <span className="text-red-500">*</span>
              </Label>
              <Select value={formData.nationality} onValueChange={(val) => updateField('nationality', val)}>
                <SelectTrigger className="border-gray-200">
                  <SelectValue placeholder="Select nationality" />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRIES.map(country => (
                    <SelectItem key={country} value={country}>{country}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="countryOfResidence" className="text-sm font-medium mb-2 block">
                Country of Residence <span className="text-red-500">*</span>
              </Label>
              <Select 
                value={formData.countryOfResidence} 
                onValueChange={(val) => updateField('countryOfResidence', val)}
              >
                <SelectTrigger className="border-gray-200">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRIES.map(country => (
                    <SelectItem key={country} value={country}>{country}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="stateRegion" className="text-sm font-medium mb-2 block">
                State/Region <span className="text-red-500">*</span>
              </Label>
              {formData.countryOfResidence === 'Nigeria' ? (
                <Select value={formData.stateRegion} onValueChange={(val) => updateField('stateRegion', val)}>
                  <SelectTrigger className="border-gray-200">
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {NIGERIAN_STATES.map(state => (
                      <SelectItem key={state} value={state}>{state}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  id="stateRegion"
                  value={formData.stateRegion}
                  onChange={(e) => updateField('stateRegion', e.target.value)}
                  placeholder="Enter your state/region"
                  className="border-gray-200"
                />
              )}
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="address" className="text-sm font-medium mb-2 block">
                Address <span className="text-red-500">*</span>
              </Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => updateField('address', e.target.value)}
                placeholder="Enter your full address"
                className="border-gray-200"
              />
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Identification */}
      {currentStep === 3 && (
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-6 pb-3 border-b border-gray-200">
            <FileText className="w-6 h-6 text-purple-600" />
            <h3 className="text-xl font-bold text-gray-900">Identification</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="idType" className="text-sm font-medium mb-2 block">
                ID Type <span className="text-red-500">*</span>
              </Label>
              <Select value={formData.idType} onValueChange={(val) => updateField('idType', val)}>
                <SelectTrigger className="border-gray-200">
                  <SelectValue placeholder="Select ID type" />
                </SelectTrigger>
                <SelectContent>
                  {ID_TYPES.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="issuingCountry" className="text-sm font-medium mb-2 block">
                Issuing Country <span className="text-red-500">*</span>
              </Label>
              <Select 
                value={formData.issuingCountry} 
                onValueChange={(val) => updateField('issuingCountry', val)}
              >
                <SelectTrigger className="border-gray-200">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRIES.map(country => (
                    <SelectItem key={country} value={country}>{country}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="idNumber" className="text-sm font-medium mb-2 block">
                ID Number <span className="text-red-500">*</span>
              </Label>
              <Input
                id="idNumber"
                value={formData.idNumber}
                onChange={(e) => updateField('idNumber', e.target.value)}
                placeholder="Enter your ID number"
                className="border-gray-200"
              />
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Document Upload */}
      {currentStep === 4 && (
        <div className="space-y-6">
          <div className="mb-6 pb-3 border-b border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <Upload className="w-6 h-6 text-orange-600" />
              <h3 className="text-xl font-bold text-gray-900">Upload ID Documents</h3>
            </div>
            <p className="text-sm text-gray-600 pl-8">
              Please upload clear photos of both the front and back of your ID document
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Front ID Upload */}
            <div>
              <Label className="text-sm font-medium mb-2 block">
                ID Front <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'front')}
                  className="hidden"
                  id="frontIdUpload"
                />
                <label
                  htmlFor="frontIdUpload"
                  className="block border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-600 transition-colors cursor-pointer"
                >
                  {frontIdPreview ? (
                    <div className="relative">
                      <img 
                        src={frontIdPreview} 
                        alt="ID Front" 
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1">
                        <Check className="w-4 h-4" />
                      </div>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Click to upload</p>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                    </>
                  )}
                </label>
              </div>
            </div>

            {/* Back ID Upload */}
            <div>
              <Label className="text-sm font-medium mb-2 block">
                ID Back <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'back')}
                  className="hidden"
                  id="backIdUpload"
                />
                <label
                  htmlFor="backIdUpload"
                  className="block border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-600 transition-colors cursor-pointer"
                >
                  {backIdPreview ? (
                    <div className="relative">
                      <img 
                        src={backIdPreview} 
                        alt="ID Back" 
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1">
                        <Check className="w-4 h-4" />
                      </div>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Click to upload</p>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                    </>
                  )}
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 1 || submitting}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Previous
        </Button>

        {currentStep < 4 ? (
          <Button
            onClick={handleNext}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
          >
            Next
            <ArrowRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={submitting}
            className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
          >
            {submitting ? 'Submitting...' : 'Submit KYC'}
            <Check className="w-4 h-4" />
          </Button>
        )}
      </div>
        </>
      )}
    </Card>
  );
}
