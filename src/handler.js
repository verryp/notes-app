const { nanoid } = require("nanoid");
const notes = require("./notes");

const addNoteHandler = (request, h) => {
  const { title, tags, body } = request.payload;

  const id = nanoid(16);
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;

  const newNote = {
    id,
    title,
    tags,
    body,
    createdAt,
    updatedAt,
  };

  notes.push(newNote);

  const isSuccess = notes.filter((note) => note.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: true,
      message: "Catatan berhasil ditambahkan",
      data: {
        note_id: id,
      },
    });

    response.code(201);
    return response;
  }

  const response = errorResponse(h, 500);
  return response;
};

const getAllNotesHandler = () => ({
  status: true,
  data: {
    notes,
  },
});

const getNoteByIdHandler = (request, h) => {
  const { id } = request.params;

  const note = notes.find((note) => note.id === id);

  if (note)
    return {
      status: true,
      message: "Catatan berhasil ditemukan",
      data: {
        note,
      },
    };

  const response = errorResponse(h, 404);
  return response;
};

const editNoteByIdHandler = (request, h) => {
  const { id } = request.params;
  const { title, tags, body } = request.payload;
  const updatedAt = new Date().toISOString();

  const index = notes.findIndex((note) => note.id === id);

  if (index !== -1) {
    notes[index] = {
      ...notes[index],
      title,
      tags,
      body,
      updatedAt,
    };

    const response = h.response({
      status: false,
      message: "Catatan berhasil diubah",
      data: {},
    });

    response.code(200);
    return response;
  }

  const response = errorResponse(h, 404);
  return response;
};

const deleteNoteById = (request, h) => {
  const { id } = request.params;

  const index = notes.findIndex((note) => note.id === id);

  if (index !== -1) {
    notes.splice(index, 1);
    const response = h.response({
      status: true,
      message: "Catatan berhasil dihapus",
    });

    response.code(200);
    return response;
  }

  const response = errorResponse(h, 404);
  return response;
};

const errorResponse = (h, statusCode) => {
  const response = h.response({
    status: false,
    message: "Catatan tidak ditemukan",
    data: null,
  });

  response.code(statusCode);
  return response;
};

module.exports = {
  addNoteHandler,
  getAllNotesHandler,
  getNoteByIdHandler,
  editNoteByIdHandler,
  deleteNoteById,
};
