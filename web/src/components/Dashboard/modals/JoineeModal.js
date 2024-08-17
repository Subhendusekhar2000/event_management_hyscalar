import React from "react";

const JoineeModal = ({ joinees, onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded shadow-lg w-1/2">
        <h2 className="text-2xl font-bold mb-4">Joinees</h2>
        <ul className="list-disc pl-5">
          {joinees.map((joinee) => (
            <li key={joinee._id} className="mb-2">
              {joinee.name} - {joinee.email}
            </li>
          ))}
        </ul>
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default JoineeModal;
