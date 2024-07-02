import React, { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import {Button,Dialog,DialogActions,DialogContent,DialogTitle,} from "@material-ui/core";
import AddPersonModal from "./AddPersonModal";
import UpdatePersonForm from "./UpdatePersonForm";
import {
  fetchPeople, // function to fetch the list of people
  addPerson, //function to add a new person to the database
  updatePerson, //function to update the details of an existing person in the database
  deletePerson, // function to delete a person from the database
} from "../services/api.js";

const PeopleList = () => {
  // State variables
  const [persons, setPersons] = useState([]); // List of all persons
  const [filteredPersons, setFilteredPersons] = useState([]);// Filtered list based on search query
  const [selectedPerson, setSelectedPerson] = useState(null); // Person selected for editing
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // State for edit modal visibility
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // State for add modal visibility
  const [personToDelete, setPersonToDelete] = useState(null); // Person selected for deletion
  const [open, setOpen] = useState(false); // State for delete confirmation dialog
  const [searchQuery, setSearchQuery] = useState(""); // Search query state

  // Close delete confirmation dialog
  const handleCancelDelete = () => {
    setOpen(false);
  };

  // Close add person modal
  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  // Open add person modal
  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
  };

  // Open edit person modal with selected person data
  const handleOpenEditModal = (person) => {
    setSelectedPerson(person);
    setIsEditModalOpen(true);
  };

  // Close edit person modal
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedPerson(null);
  };

  // Add a new person
  const handleAddPerson = async (person) => {
    try {
      const newPerson = await addPerson(person);
      console.log(newPerson.data);
  
      // Ensure newPerson.data is an array and has at least one element
      if (Array.isArray(newPerson.data) && newPerson.data.length > 0) {
        setPersons([...persons, newPerson.data[0]]);
      } else {
        console.error("newPerson.data is not a valid array or it's empty:", newPerson.data);
      }
    } catch (error) {
      console.error("Failed to add person:", error);
    }
  };
  

  // Update an existing person
  const handleUpdatePerson = async (updatedPerson) => {
    const { id } = updatedPerson;
    await updatePerson(id, updatedPerson);
    setPersons(
      persons.map((person) => (person.id === id ? updatedPerson : person))
    );
    setSelectedPerson(null);
  };

  // Initiate person deletion confirmation
  const handleDelete = (personId) => {
    setPersonToDelete(personId);
    setOpen(true);
  };

  // Confirm and delete a person
  const handleDeletePerson = async () => {
    await deletePerson(personToDelete);
    setPersons(persons.filter((person) => person.id !== personToDelete));
    setOpen(false);
  };

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    filterPersons(event.target.value);
  };

  // Filter persons based on search query
  const filterPersons = (query) => {
    const filtered = persons.filter(
      (person) =>
        person.first_name.toLowerCase().includes(query.toLowerCase()) ||
        person.last_name.toLowerCase().includes(query.toLowerCase()) ||
        person.email.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredPersons(filtered);
  };

  // Load initial data on component mount
const loadPeople = async () => {
  const data = await fetchPeople();
  setPersons(Array.isArray(data.data) ? data.data : []);
};
  // Load initial data on component mount using useEffect
  useEffect(() => {
    loadPeople();
  }, []); // Empty dependency array ensures it runs only once on mount
  return (
    <>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">
          People Management Application
        </h1>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center px-3 py-2 bg-purple-600 text-white rounded text-sm md:text-base hover:bg-purple-700 transition-colors duration-300 ml-auto my-2"
        >
          <FaPlus size={20} color="white" className="mr-1" /> Add Person
        </button>

        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <div className="pb-4 bg-white dark:bg-gray-900">
            <label htmlFor="table-search" className="sr-only">
              Search
            </label>
            <div className="relative mt-1">
              <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <input
                type="text"
                id="table-search"
                className="block pt-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Search for items"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
          </div>
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="p-4">
                  <div className="flex items-center">
                    <input
                      id="checkbox-all-search"
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label htmlFor="checkbox-all-search" className="sr-only">
                      checkbox
                    </label>
                  </div>
                </th>
                <th scope="col" className="px-6 py-3">
                  First Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Last Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Email
                </th>
                <th scope="col" className="px-6 py-3">
                  Date of Birth
                </th>
                <th scope="col" className="px-6 py-3">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {(searchQuery ? filteredPersons : persons).map((person) => (
                <tr
                  key={person.id}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <td className="w-4 p-4">
                    <div className="flex items-center">
                      <input
                        id={`checkbox-table-${person.id}`}
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <label
                        htmlFor={`checkbox-table-${person.id}`}
                        className="sr-only"
                      >
                        checkbox
                      </label>
                    </div>
                  </td>
                  <td
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {person.first_name}
                  </td>
                  <td
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {person.last_name}
                  </td>
                  <td className="px-6 py-4">{person.email}</td>
                  <td className="px-6 py-4">
                    {new Date(person.dob).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 space-x-2">
                    <button
                      onClick={() => handleOpenEditModal(person)}
                      className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(person.id)}
                      className="font-medium text-red-600 dark:text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Dialog open={open} onClose={handleCancelDelete}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <p>Are you sure you want to delete this person?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            No
          </Button>
          <Button onClick={handleDeletePerson} color="primary">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
      <AddPersonModal
        isOpen={isAddModalOpen}
        onRequestClose={handleCloseAddModal}
        onSave={handleAddPerson}
      />
      {selectedPerson && (
        <UpdatePersonForm
          isOpen={isEditModalOpen}
          onRequestClose={handleCloseEditModal}
          onSave={handleUpdatePerson}
          currentPerson={selectedPerson}
        />
      )}
    </>
  );
};

export default PeopleList;
