import React, { useState } from 'react';
import { Eye, EyeOff, Phone, Lock, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api/AdminApis';
import FormInput from '../components/ui components/FormInput'; // update the path if needed

export default function LoginComponent() {
  const [formData, setFormData] = useState({
    phone: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s\-\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 3) {
      newErrors.password = 'Password must be at least 3 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoginError('');

    try {
      const user = await loginUser(formData);
      navigate('/');
    } catch (error) {
      if (error.response?.data?.error) {
        setLoginError(error.response.data.error);
      } else {
        setLoginError('Something went wrong. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-violet-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-violet-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        <div className="space-y-6">
          {/* Phone Input */}
          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3  pt-5  flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-purple-400" />
              </div>
              <FormInput
                label="Phone Number"
                type="tel"
                name="phone"
                placeholder="+919876543210"
                value={formData.phone}
                onChange={handleInputChange}
                className={`pl-10 ${errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-purple-300'}`}
              />
            </div>
            {errors.phone && (
              <p className="mt-2 text-sm text-red-600">{errors.phone}</p>
            )}
          </div>

          {/* Password Input */}
          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 pt-5 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-purple-400" />
              </div>
              <FormInput
                label="Password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                className={`pl-10 pr-12 ${errors.password ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-purple-300'}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3  pt-5 flex items-center text-purple-400 hover:text-purple-600"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-2 text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-purple-600 to-violet-600 text-white py-3 px-4 rounded-lg font-medium hover:from-purple-700 hover:to-violet-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200"
          >
            Sign In
          </button>

          {loginError && (
            <p className="text-sm text-red-600 text-center mt-2">{loginError}</p>
          )}
        </div>
      </div>
    </div>
  );
}
