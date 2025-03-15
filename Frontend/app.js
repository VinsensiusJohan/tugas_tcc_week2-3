const form = document.querySelector("form");
const red_green_btn = document.querySelector("#tambah_btn");
const backendURL = "http://34.55.86.116:3000";

red_green_btn.addEventListener("click", function () {
    if (this.classList.contains("green")) {
        this.classList.remove("green");
        this.classList.add("red");
    } else {
        this.classList.remove("red");
        this.classList.add("green");
    }
});

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const element_title = document.querySelector('#title');
    const element_content = document.querySelector('#content');

    const title = element_title.value;
    const content = element_content.value;

    const id = element_title.dataset.id;


    if(id == ""){
        axios
            .post(`${backendURL}/add`, {title, content})
            .then(()=>{
                element_title.value = "";
                element_content.value = "";
                form_div.style.display = "none";
                btn_tambah.textContent = "Tambah";

                getNote();
            })
            .catch((error) => console.error(error.message));
    } else {
        axios
            .put(`${backendURL}/note-update/${id}`, {title, content})
            .then(() => {
                element_title.value = "";
                element_content.value = "";
                form_div.style.display = "none";
                btn_tambah.textContent = "Tambah";

                getNote();
            })
            .catch((error) => console.error(error.message));
    }
});

async function getNote() {
    try {
        const {data} = await axios.get(`${backendURL}/note`);
        const noteList = document.querySelector('#note-list');
        noteList.innerHTML = "";

        data.reverse().forEach((note) => {
            noteList.innerHTML += showNote(note);
        });
        editNote();
        deleteNote();

    } catch (error) {
        console.error("Gagal mengambil data:", error);
    }
}

function deleteNote() {
    const all_btn_del = document.querySelectorAll(".btn-del");

    all_btn_del.forEach((btn) => {
        btn.addEventListener("click", () => {
            const id = btn.dataset.id;
            axios
                .delete(`${backendURL}/note-delete/${id}`)
                .then(()=> getNote())
                .catch((error) => console.error(error.message));
        });
    });
}

function editNote() {
    const all_btn_edit = document.querySelectorAll('.btn-edit');

    all_btn_edit.forEach((btn_edit) => {
        btn_edit.addEventListener("click", () => {
            const id = btn_edit.dataset.id;
            form_div.style.display = "block";
            btn_tambah.textContent = "Ga Jadi";
            const title = 
                btn_edit.parentElement.parentElement.querySelector(
                    ".note-title"
                ).innerText;
            const content =
                btn_edit.parentElement.parentElement.querySelector(
                    ".note-content"
                ).innerText;
            
            const element_title = document.querySelector('#title');
            const element_content = document.querySelector('#content');
            
            element_title.value = title;
            element_content.value = content;
            element_title.dataset.id = id;
        });
    });
}

function showNote(note){
    const partedNote = note.content.length > 15 ? note.content.substring(0, 15) + "..." : note.content;
    const fullNote = note.content;

    return `
        <div class="note-card" data-id="${note.id}" data-parted-note="${partedNote}" data-full-note="${fullNote}">
            <div class="note-title">${note.title}</div>
            <div class="note-content">${partedNote}</div>
            <div class="note-footer">
            <div class="note-date">Created: ${formatDate(note.tanggal_buat)} | Updated: ${formatDate(note.tanggal_ubah)}</div>
            <button class="expand_btn" data-id="${note.id}">Expand</button>
            </div>
            <div class="update-delete hidden">
                <button data-id="${note.id}" class='btn-edit'>Edit</button>
                <button data-id="${note.id}" class='btn-del'>Hapus</button>
            </div>
        </div>
        `;
}

document.addEventListener("click", function (event) {
    if (event.target.classList.contains("expand_btn")) {
        const noteCard = event.target.closest(".note-card");
        const contentDiv = noteCard.querySelector(".note-content");
        const updateDeleteDiv = noteCard.querySelector(".update-delete");

        const fullNote = noteCard.getAttribute("data-full-note");
        const partedNote = noteCard.getAttribute("data-parted-note");

        if (event.target.textContent === "Expand") {
            contentDiv.textContent = fullNote;
            updateDeleteDiv.classList.remove("hidden");
            event.target.textContent = "Close";
        } else {
            contentDiv.textContent = partedNote;
            updateDeleteDiv.classList.add("hidden");
            event.target.textContent = "Expand";
        }
    }
});

function formatDate(dateString){
    const date = new Date(dateString);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${hours}:${minutes} ${day}/${month}/${year}`;
}


getNote();

const btn_tambah = document.getElementById("tambah_btn");
const form_div = document.getElementById("formDiv");

document.addEventListener("DOMContentLoaded", () => {
    form_div.style.display = "none";
});

btn_tambah.addEventListener("click", () => {
    if (form_div.style.display === "none") {
        form_div.style.display = "block";
        btn_tambah.textContent = "Ga Jadi";
    } else {
        form_div.style.display = "none";
        btn_tambah.textContent = "Tambah";
    }
});


