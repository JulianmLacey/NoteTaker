const express = require("express");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

/*
Get /notes - notes.html
Get * - index.html

Get .api/notes - return all notes as json

*/

app.get("/notes", (req, res) => {
	res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("/api/notes", (req, res) => {
	fs.readFile("./db/db.json", "utf-8", (error, data) => {
		error ? console.error("error updating the data") : console.log("File Read for render");
		let notes = JSON.parse(data);
		res.json(notes);
	});
});
app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.post("/api/notes", (req, res) => {
	let newNote = req.body;
	newNote.id = uuidv4();
	fs.readFile("./db/db.json", "utf8", (err, data) => {
		if (err) {
			console.error(err);
			return;
		} else {
			const parsedData = JSON.parse(data);
			parsedData.push(newNote);
			fs.writeFile("./db/db.json", JSON.stringify(parsedData), (err) => {
				err ? console.error(err) : console.log("Note saved from post");
			});
			res.status(200).json(newNote);
		}
	});
});

app.delete("/api/notes/:id", (req, res) => {
	let noteId = req.params.id;
	fs.readFile("./db/db.json", "utf8", (err, data) => {
		err ? console.error(err) : console.log("File Read for Deletion");
		let savedNoted = JSON.parse(data);
		console.log(savedNoted);
		for (let i = 0; i < savedNoted.length; i++) {
			if (savedNoted[i].id === noteId) {
				savedNoted.splice(i, 1);
				continue;
			}
		}

		fs.writeFile("./db/db.json", JSON.stringify(savedNoted), (err) => {
			err ? console.error(err) : console.log("Note deleted!");
		});
	});
});

app.listen(PORT, () => console.log(`Listening for requests on port ${PORT}`));
