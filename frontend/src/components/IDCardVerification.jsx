import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Tesseract from 'tesseract.js';
import { setCurrentUser } from '../redux/user/userSlice';
import { BadgeCheck } from 'lucide-react';
import axios from 'axios';

const IDCardVerification = () => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState('');
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [scannedImage, setScannedImage] = useState(null);
  const [detectedNumber, setDetectedNumber] = useState('');
  const [cardValidation, setCardValidation] = useState({ isValid: false, reason: '' });
  const [processingStage, setProcessingStage] = useState('');
  const [isUpdatingServer, setIsUpdatingServer] = useState(false);
  const [isFaqVisible, setIsFaqVisible] = useState(false);
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);

  // Function to validate if image is likely a BIT ID card
  const validateIDCard = async (imageFile) => {
    // Existing validation code...
    // This function remains unchanged
    return new Promise((resolve) => {
      setProcessingStage('Validating card format...');
      
      // Create image element to check dimensions and perform initial validation
      const img = new Image();
      img.onload = async () => {
        // Check aspect ratio (ID cards typically have ratio between 1.5 and 1.7)
        const aspectRatio = img.width / img.height;
        if (aspectRatio < 0.5 || aspectRatio > 0.85) {
          resolve({ isValid: false, reason: 'Image does not have the correct dimensions for an ID card' });
          return;
        }

        // Check image size (not too small for OCR to work effectively)
        if (img.width < 300 || img.height < 400) {
          resolve({ isValid: false, reason: 'Image resolution is too low for accurate verification' });
          return;
        }
        
        // Perform initial text recognition to check for key BIT ID card phrases
        setProcessingStage('Analyzing card content...');
        try {
          const initialCheck = await Tesseract.recognize(
            imageFile,
            'eng',
            { 
              logger: m => console.log(m)
            }
          );
          
          const text = initialCheck.data.text.toLowerCase();
          
          // Look for key markers of BIT ID card
          const hasBITMarkers = 
            text.includes('Bhilai Institute') || 
            text.includes('Admission No') || 
            text.includes('Admission No.') || 
            text.includes('BhilaiHouse, G.E.Road, Durg-491001(CG)') || 
            text.includes('Durg-491001(CG)');
          
          if (!hasBITMarkers) {
            resolve({ isValid: false, reason: 'This does not appear to be a BIT ID card' });
            return;
          }
          
          resolve({ isValid: true, reason: '' });
        } catch (err) {
          resolve({ isValid: false, reason: 'Failed to analyze the image' });
        }
      };
      
      img.onerror = () => {
        resolve({ isValid: false, reason: 'Failed to load the image' });
      };
      
      img.src = URL.createObjectURL(imageFile);
    });
  };

  // Function to update user authentication status in the backend
  const updateAuthenticationStatus = async (userId, isAuthenticated) => {
    try {
      setIsUpdatingServer(true);
      
      const response = await axios.post('/api/auth/update-authentication', {
        userId,
        isAuthenticated
      });
      
      if (response.status === 200) {
        console.log('Authentication status updated');
        return true;
      }
    } catch (error) {
      console.error('Failed to update authentication status in database:', error);
      setVerificationError('Verification successful locally but failed to update server. Please try again or contact support.');
      return false;
    } finally {
      setIsUpdatingServer(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file is an image
    if (!file.type.startsWith('image/')) {
      setVerificationError('Please upload an image file');
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setVerificationError('Image size should be less than 5MB');
      return;
    }

    // Preview the uploaded image
    setScannedImage(URL.createObjectURL(file));
    setIsVerifying(true);
    setVerificationError('');
    setVerificationSuccess(false);
    setDetectedNumber('');

    try {
      // First validate if the image appears to be a BIT ID card
      const validation = await validateIDCard(file);
      setCardValidation(validation);
      
      if (!validation.isValid) {
        setVerificationError(validation.reason);
        setIsVerifying(false);
        return;
      }
      
      // Process the ID card image
      setProcessingStage('Extracting information...');
      
      // Create a canvas to enhance the image before OCR
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = async () => {
        // Set canvas dimensions
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Draw and enhance image (increase contrast)
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Simple contrast enhancement
        const factor = 1.5; // contrast factor
        for (let i = 0; i < data.length; i += 4) {
          data[i] = ((data[i] / 255 - 0.5) * factor + 0.5) * 255;     // red
          data[i+1] = ((data[i+1] / 255 - 0.5) * factor + 0.5) * 255; // green
          data[i+2] = ((data[i+2] / 255 - 0.5) * factor + 0.5) * 255; // blue
        }
        
        ctx.putImageData(imageData, 0, 0);
        
        // Convert canvas to blob for Tesseract
        canvas.toBlob(async (blob) => {
          try {
            // Process with Tesseract - full image scan
            const result = await Tesseract.recognize(
              blob,
              'eng',
              { 
                logger: m => console.log(m)
              }
            );

            // Extract text from the scanned image
            const scannedText = result.data.text;
            console.log("Extracted text:", scannedText);
            
            // Search for multiple ID patterns
            // Pattern for BIT admission numbers (10-11 digits, specifically starting with 23 for BIT)
            let admissionNumberMatch = scannedText.match(/Admission No\.?\s*(\d{10,11})/i);
            
            // If not found with label, try to find admission number pattern
            if (!admissionNumberMatch) {
              admissionNumberMatch = scannedText.match(/\b(23\d{8,9})\b/); // BIT numbers start with '23'
            }
            
            // Additional check for enrollment number
            let enrollMatch = scannedText.match(/Enroll No\.?\s*:\s*([A-Z0-9]+)/i);
            
            // Additional check for university roll number
            let rollMatch = scannedText.match(/Roll No\.?\s*:\s*(\d+)/i);
            
            // Process the matches
            if (admissionNumberMatch) {
              const scannedAdmissionNumber = admissionNumberMatch[1] || admissionNumberMatch[0];
              setDetectedNumber(scannedAdmissionNumber);
              
              // Additional verification - check if detected number meets BIT format
              if (!scannedAdmissionNumber.startsWith('23')) {
                setVerificationError('The detected number does not match BIT admission number format. BIT numbers typically start with "23".');
              }
              // Compare with the user's admission number
              else if (scannedAdmissionNumber === currentUser.admissionNumber) {
                // Update the user's isAuthenticated status in local state
                const updatedUser = {
                  ...currentUser,
                  isAuthenticated: true
                };
                
                // Update authentication status in the backend
                const serverUpdateSuccess = await updateAuthenticationStatus(currentUser._id, true);
                
                if (serverUpdateSuccess) {
                  // Update Redux state
                  dispatch(setCurrentUser(updatedUser));
                  
                  // Also update in localStorage to persist the change
                  const persistRoot = JSON.parse(localStorage.getItem('persist:root'));
                  if (persistRoot) {
                    const user = JSON.parse(persistRoot.user);
                    user.currentUser = updatedUser;
                    persistRoot.user = JSON.stringify(user);
                    localStorage.setItem('persist:root', JSON.stringify(persistRoot));
                  }
                  
                  setVerificationSuccess(true);
                }
              } else {
                setVerificationError(`Admission number on ID card (${scannedAdmissionNumber}) does not match your profile (${currentUser.admissionNumber}).`);
              }
            } 
            // If no admission number found but enrollment or roll number matched, provide specific feedback
            else if (enrollMatch || rollMatch) {
              setVerificationError('Found enrollment or roll number, but could not detect admission number. Please ensure the admission number is clearly visible.');
            } else {
              setVerificationError('Could not detect a valid admission number on the ID card. Please ensure the number is clearly visible.');
            }
          } catch (error) {
            console.error('ID verification error:', error);
            setVerificationError('Failed to process the ID card. Please try again with a clearer image.');
          } finally {
            setIsVerifying(false);
            setProcessingStage('');
          }
        }, 'image/jpeg', 0.95);
      };
      
      img.onerror = () => {
        setVerificationError('Failed to process the image');
        setIsVerifying(false);
      };
      
      img.src = URL.createObjectURL(file);
      
    } catch (error) {
      console.error('ID verification error:', error);
      setVerificationError('Failed to process the ID card. Please try again.');
      setIsVerifying(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const resetVerification = () => {
    setScannedImage(null);
    setVerificationError('');
    setVerificationSuccess(false);
    setDetectedNumber('');
    setCardValidation({ isValid: false, reason: '' });
  };

  const toggleFaqVisibility = () => {
    setIsFaqVisible(!isFaqVisible);
  };

  if (currentUser.isAuthenticated) {
    return (
      <div className="w-full mb-4 p-3 text-[#4b6cfcec] flex items-center justify-center gap-2">
        <span><BadgeCheck className='w-5 text-[#4b6cfcec]'/></span>
        <span>ID card is verified</span>
      </div>
    );
  }

  return (
    <div className="w-full mb-4">
      <div className="p-4 bg-[#FAF4FE] border border-[#E8D8F3] rounded-xl">
        <h3 className="text-lg font-semibold mb-2">Verify Your Account</h3>
        <p className="text-sm text-gray-600 mb-3">
          Upload your BIT ID card to verify your admission number and authenticate your account.
        </p>
        
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          capture="environment"
          onChange={handleFileUpload}
        />
        
        {scannedImage ? (
          <div className="mb-4">
            <div className="flex items-center justify-center mb-3">
              <img 
                src={scannedImage} 
                alt="Uploaded ID Card" 
                className="max-h-48 rounded-lg shadow-sm border border-gray-200" 
              />
            </div>
            
            {detectedNumber && (
              <div className="text-center mb-3">
                <p className="text-sm text-gray-700">Detected Admission Number:</p>
                <p className="font-bold text-lg">{detectedNumber}</p>
              </div>
            )}
            
            <button
              className="w-full p-3 bg-gray-200 text-gray-700 font-bold rounded-xl mb-3"
              onClick={resetVerification}
              disabled={isVerifying || isUpdatingServer}
            >
              Try Another Image
            </button>
          </div>
        ) : (
          <button
            className="w-full p-3 bg-[#6a7cff] text-white font-bold rounded-xl flex justify-center items-center mb-3"
            onClick={triggerFileInput}
            disabled={isVerifying || isUpdatingServer}
          >
            {isVerifying || isUpdatingServer ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {isUpdatingServer ? 'Updating...' : 'Processing...'}
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Upload ID Card
              </>
            )}
          </button>
        )}
        
        {isVerifying && (
          <div className="flex flex-col items-center mb-3">
            <div className="flex items-center">
              <svg className="animate-spin h-8 w-8 text-[#6a7cff]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="ml-2 text-sm text-gray-600">Processing...</p>
            </div>
            {processingStage && (
              <p className="text-xs text-gray-500 mt-1">{processingStage}</p>
            )}
          </div>
        )}

        {isUpdatingServer && (
          <div className="flex flex-col items-center mb-3">
            <div className="flex items-center">
              <svg className="animate-spin h-8 w-8 text-[#6a7cff]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="ml-2 text-sm text-gray-600">Updating your verification status...</p>
            </div>
          </div>
        )}
        
        {verificationError && (
          <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {verificationError}
          </div>
        )}
        
        {verificationSuccess && (
          <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Verification successful! Your account is now authenticated.
          </div>
        )}
        
        {/* FAQs Section - Expandable */}
        <div className="mt-4 border-t border-gray-200 pt-3">
          <button 
            onClick={toggleFaqVisibility}
            className="flex justify-between items-center w-full text-left focus:outline-none"
          >
            <h4 className="font-medium text-sm">Guidelines for Scanning</h4>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-5 w-5 text-gray-500 transition-transform ${isFaqVisible ? 'transform rotate-180' : ''}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {isFaqVisible && (
            <div className="mt-2 text-xs text-gray-600 space-y-3">
              <div>
                <h5 className="font-medium mb-1">Guidelines for ID Card Scanning:</h5>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Upload only your official BIT ID card</li>
                  <li>Ensure the admission number is clearly visible</li>
                  <li>Make sure all four corners of the ID card are visible</li>
                  <li>Take the photo in good lighting without glare</li>
                  <li>Hold the camera steady to avoid blur</li>
                </ul>
              </div>
              
              <div>
                <h5 className="font-medium mb-1">Privacy Policy:</h5>
                <p>Your ID card is processed locally and not stored or sent to any server</p>
              </div>
              
              <div>
                <h5 className="font-medium mb-1">Troubleshooting:</h5>
                <ul className="list-disc pl-4 space-y-1">
                  <li>If verification fails, try taking the photo again with better lighting</li>
                  <li>Make sure there's no glare or shadows on the admission number</li>
                  <li>Clean your camera lens for better image quality</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IDCardVerification;