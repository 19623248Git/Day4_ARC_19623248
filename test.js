const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 8080;
app.use(express.json());
let moviesData = [];

// Fungsi untuk membaca data film dari file JSON
function loadMoviesData() {
    try {
        fs.readFile(__dirname + '/movies.json', 'utf8', function(err, data) {
            if (err) throw err;
            console.log(data);
            moviesData = JSON.parse(data);
        });
        data = fs.readFileSync(__dirname + '/movies.json', 'utf8');
    } catch (err) {
        console.error('Error reading movies data:', err);
    }
}

// Fungsi untuk menyimpan data film ke file JSON
function saveMoviesData() {
    try {
        fs.writeFileSync('movies.json', JSON.stringify(moviesData, null, 2));
        console.log('Movies data saved successfully.');
    } catch (err) {
        console.error('Error saving movies data:', err);
    }
}

//menampilkan semua film
app.get('/', (req, res) => {
    res.end(data);
});

//menampilkan film berdasarkan ID
app.get('/:id', (req, res) => {
    const movie = moviesData.find(function (something){
        return something == req.params.id
    });
    if (!movie) {
        res.status(404).send('Movie not found');
    };
    res.json(movie);
});

//menambahkan film baru
app.post('/', (req, res) => {
    const { Title, Year, imdbID, Type, Poster } = req.body;
    const newMovie = {
        Title: Title,
        Year: Year,
        imdbID: imdbID,
        Type: Type,
        Poster: Poster,
      };
    moviesData.push(newMovie);
    saveMoviesData();
    res.status(201).send('Movie added successfully');
});

//menghapus film berdasarkan ID
app.delete('/:id', (req, res) => {
    const index = moviesData.findIndex(movie => movie.imdbID === req.params.id);
    if (index !== -1) {
        moviesData.splice(index, 1);
        saveMoviesData();
        res.send('Movie deleted successfully');
    } else {
        res.status(404).send('Movie not found');
    }
});

//mengupdate film berdasarkan ID
app.put('/movies/:id', (req, res) => {
    const index = moviesData.findIndex(movie => movie.imdbID === req.params.id);
    if (index !== -1) {
        moviesData[index] = req.body;
        saveMoviesData();
        res.send('Movie updated successfully');
    } else {
        res.status(404).send('Movie not found');
    }
});

//melakukan pencarian film berdasarkan nama
app.get('/search/:title', (req, res) => {
    const title = req.params.title.toLowerCase();
    const foundMovies = moviesData.filter(movie => movie.Title.toLowerCase().includes(title));
    res.json(foundMovies);
});

// Jalankan server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    // Memuat data film saat server dinyalakan
    loadMoviesData();
});

// Simpan data film saat server dimatikan
process.on('SIGINT', () => {
    saveMoviesData();
    process.exit();
});
