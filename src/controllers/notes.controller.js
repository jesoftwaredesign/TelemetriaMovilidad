const notesCtrl = {};

// Models
const Note = require("../models/Note");

notesCtrl.renderNoteForm = (req, res) => {
  res.render("notes/new-note");
};

notesCtrl.createNewNote = async (req, res) => {
  const { title, tipo, ubicacion, description } = req.body;
  const errors = [];
  if (!title) {
    errors.push({ text: "Por favor indique un nombre" });
  }
  if (!tipo) {
    errors.push({ text: "Por favor indique un tipo" });
  }
  if (!ubicacion) {
    errors.push({ text: "Por favor indique la ubicación" });
  }
  if (!description) {
    errors.push({ text: "Por favor indique una descripción" });
  }
  if (errors.length > 0) {
    res.render("notes/new-note", {
      errors,
      title,
      tipo,
      ubicacion,
      description
    });
  } else {
    const newNote = new Note({ title, tipo, ubicacion, description });
    newNote.user = req.user.id;
    await newNote.save();
    req.flash("success_msg", "Sensor adicionado correctamente");
    res.redirect("/notes");
  }
};

notesCtrl.renderNotes = async (req, res) => {
  const notes = await Note.find({ user: req.user.id }).sort({ date: "desc" });
  res.render("notes/all-notes", { notes });
};

notesCtrl.renderEditForm = async (req, res) => {
  const note = await Note.findById(req.params.id);
  if (note.user != req.user.id) {
    req.flash("error_msg", "Not Authorized");
    return res.redirect("/notes");
  }
  res.render("notes/edit-note", { note });
};

notesCtrl.updateNote = async (req, res) => {
  const { title, tipo, ubicacion, description } = req.body;
  await Note.findByIdAndUpdate(req.params.id, { title, tipo, ubicacion, description });
  req.flash("success_msg", "Sensor actualizado correctamente");
  res.redirect("/notes");
};

notesCtrl.deleteNote = async (req, res) => {
  await Note.findByIdAndDelete(req.params.id);
  req.flash("success_msg", "Sensor eliminado correctamente");
  res.redirect("/notes");
};

module.exports = notesCtrl;
