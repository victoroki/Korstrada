// Validate required field
export const required = (value) => {
  if (!value || value.toString().trim() === '') {
    return 'This field is required';
  }
  return null;
};

// Validate email
export const email = (value) => {
  if (!value) return null;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) {
    return 'Please enter a valid email address';
  }
  return null;
};

// Validate password strength
export const passwordStrength = (value) => {
  if (!value) return null;
  if (value.length < 6) {
    return 'Password must be at least 6 characters long';
  }
  return null;
};

// Validate phone number
export const phone = (value) => {
  if (!value) return null;
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
  if (!phoneRegex.test(value)) {
    return 'Please enter a valid phone number';
  }
  return null;
};

// Validate URL
export const url = (value) => {
  if (!value) return null;
  try {
    new URL(value);
    return null;
  } catch (e) {
    return 'Please enter a valid URL';
  }
};

// Validate minimum value
export const minValue = (min) => (value) => {
  if (value === null || value === undefined || value === '') return null;
  if (Number(value) < min) {
    return `Value must be at least ${min}`;
  }
  return null;
};

// Validate maximum value
export const maxValue = (max) => (value) => {
  if (value === null || value === undefined || value === '') return null;
  if (Number(value) > max) {
    return `Value must be no more than ${max}`;
  }
  return null;
};

// Validate minimum length
export const minLength = (min) => (value) => {
  if (!value) return null;
  if (value.length < min) {
    return `Must be at least ${min} characters long`;
  }
  return null;
};

// Validate maximum length
export const maxLength = (max) => (value) => {
  if (!value) return null;
  if (value.length > max) {
    return `Must be no more than ${max} characters long`;
  }
  return null;
};

// Validate number
export const number = (value) => {
  if (!value) return null;
  if (isNaN(Number(value))) {
    return 'Must be a number';
  }
  return null;
};

// Validate integer
export const integer = (value) => {
  if (!value) return null;
  if (!Number.isInteger(Number(value))) {
    return 'Must be an integer';
  }
  return null;
};

// Validate date
export const date = (value) => {
  if (!value) return null;
  const dateObj = new Date(value);
  if (isNaN(dateObj.getTime())) {
    return 'Please enter a valid date';
  }
  return null;
};

// Validate date in the future
export const futureDate = (value) => {
  if (!value) return null;
  const dateObj = new Date(value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (dateObj < today) {
    return 'Date must be in the future';
  }
  return null;
};

// Combine multiple validators
export const combineValidators = (...validators) => (value) => {
  for (const validator of validators) {
    const error = validator(value);
    if (error) return error;
  }
  return null;
};