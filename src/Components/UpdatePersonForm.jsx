import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import PropTypes from "prop-types";
import "./AddPersonModal.css"; 

// Set the root element for the modal
Modal.setAppElement("#root");

const UpdatePersonForm = ({ isOpen, onRequestClose, onSave, currentPerson }) => {
 // State for form data and errors
 const [formData, setFormData] = useState({
  first_name: '',
  middle_name: '',
  last_name: '',
  email: '',
  description: '',
  dob: '',
  is_male: false,
});
const [errors, setErrors] = useState({});

// Effect to update form data when currentPerson changes
useEffect(() => {
  if (currentPerson) {
    setFormData({
      first_name: currentPerson.first_name || '',
      middle_name: currentPerson.middle_name || '',
      last_name: currentPerson.last_name || '',
      email: currentPerson.email || '',
      description: currentPerson.description || '',
      dob: currentPerson.dob || '',
      is_male: currentPerson.is_male || false,
    });
  }
}, [currentPerson]);

// Handle input changes in the form
const handleChange = (e) => {
  const { name, value, type, checked } = e.target;
  setFormData({
    ...formData,
    [name]: type === 'checkbox' ? checked : value,
  });
};

// Validate form fields
const validateForm = () => {
  const newErrors = {};
  if (!formData.first_name) newErrors.first_name = 'First name is required';
  if (!formData.last_name) newErrors.last_name = 'Last name is required';
  if (!formData.email) newErrors.email = 'Email is required';
  if (!formData.dob) newErrors.dob = 'Date of birth is required';
  return newErrors;
};

// Handle form submission
const handleSubmit = (e) => {
  e.preventDefault();
  const formErrors = validateForm();
  if (Object.keys(formErrors).length === 0) {
    onSave({ ...currentPerson, ...formData }); // Merge currentPerson data with updated formData
    setFormData({
      first_name: '',
      middle_name: '',
      last_name: '',
      email: '',
      description: '',
      dob: '',
      is_male: false,
    });
    setErrors({});
    onRequestClose(); // Close the modal after saving
  } else {
    setErrors(formErrors);
  }
};
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Update Person Modal"
      className="form"
      overlayClassName="overlay"
    >
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl mb-4">Update Person</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col">
            <label htmlFor="first_name" className="text-lg">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              id="first_name"
              name="first_name"
              type="text"
              value={formData.first_name}
              onChange={handleChange}
              className="border rounded p-2"
              
            />
            {errors.first_name && <p className="text-red-500 text-sm">{errors.first_name}</p>}
          </div>

          <div className="flex flex-col">
            <label htmlFor="middle_name" className="text-lg">
              Middle Name
            </label>
            <input
              id="middle_name"
              name="middle_name"
              type="text"
              value={formData.middle_name}
              onChange={handleChange}
              className="border rounded p-2"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="last_name" className="text-lg">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              id="last_name"
              name="last_name"
              type="text"
              value={formData.last_name}
              onChange={handleChange}
              className="border rounded p-2"
              
            />
            {errors.last_name && <p className="text-red-500 text-sm">{errors.last_name}</p>}
          </div>

          <div className="flex flex-col">
            <label htmlFor="email" className="text-lg">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="border rounded p-2"
              
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          <div className="flex flex-col">
            <label htmlFor="description" className="text-lg">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="border rounded p-2"
            ></textarea>
          </div>

          <div className="flex flex-col">
            <label htmlFor="dob" className="text-lg">
              Date of Birth <span className="text-red-500">*</span>
            </label>
            <input
              id="dob"
              name="dob"
              type="date"
              value={formData.dob}
              onChange={handleChange}
              className="border rounded p-2"
            />
            {errors.dob && <p className="text-red-500 text-sm">{errors.dob}</p>}
          </div>

          <div className="flex items-center">
            <input
              id="is_male"
              name="is_male"
              type="checkbox"
              checked={formData.is_male}
              onChange={handleChange}
              className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <label htmlFor="is_male" className="ml-2 block text-sm font-medium text-gray-700">
              Is Male
            </label>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onRequestClose}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 text-white rounded"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

UpdatePersonForm.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  currentPerson: PropTypes.shape({
    first_name: PropTypes.string,
    middle_name: PropTypes.string,
    last_name: PropTypes.string,
    email: PropTypes.string,
    description: PropTypes.string,
    dob: PropTypes.string,
    is_male: PropTypes.bool,
  }).isRequired,
};

export default UpdatePersonForm;
