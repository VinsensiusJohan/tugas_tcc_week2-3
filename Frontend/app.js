const form = document.querySelector("form");

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const element_title = document.querySelector('#title');
    const element_content = document.querySelector('#content');

    const title = element_title.value;
    const content = element_content.value;

    const id = element_title.dataset.id;

    if(id == ""){
        axios
            .post("http://localhost:3000/add", {title, content})
            .then(()=>{
                element_title.value = "";
                element_content.value = "";

                getNote();
            })
            .catch((error) => console.error(error.message));
    } else {
        console.log(id);
        console.log(title);
        console.log(content);
        axios
            .put(`http://localhost:3000/note-update/${id}`, {title, content})
            .then(() => {
                element_title.value = "";
                element_content.value = "";

                getNote();
            })
            .catch((error) => console.error(error.message));
    }
});

async function getNote() {
    try {
        const {data} = await axios.get("http://localhost:3000/note");
        const table = document.querySelector('#table-note');
        let show = "";
        let num_id = 1;

        for(const note of await data){
            show += showNote(num_id, note);
            num_id++;
        }
        table.innerHTML = show;
        deleteNote();
        editNote();

    } catch (error) {
        
    }
}

function showNote(num_id, note) {
    return `
        <tr>
            <td>${num_id}</td>
            <td class="title">${note.title}</td>
            <td class="content">${note.content}</td>
            <td class="date_created">${note.tanggal_buat}</td>
            <td class="date_updated">${note.tanggal_ubah}</td>
            <td><button data-id=${note.id} class='btn-edit'>Edit</button></td>
            <td><button data-id=${note.id} class='btn-del'>Hapus</button></td>
        </tr>
    `;
}

function deleteNote() {
    const all_btn_del = document.querySelectorAll(".btn-del");

    all_btn_del.forEach((btn) => {
        btn.addEventListener("click", () => {
            const id = btn.dataset.id;
            axios
                .delete(`http://localhost:3000/note-delete/${id}`)
                .then(()=> getNote())
                .catch((error) => console.error(error.message));
        });
    });
}

function editNote() {
    const all_btn_edit = document.querySelectorAll('.btn-edit');

    all_btn_edit.forEach((btn_edit) => {
        btn_edit.addEventListener("click", () => {
            console.log("edit oy");
            const id = btn_edit.dataset.id;
            const title = 
                btn_edit.parentElement.parentElement.querySelector(
                    ".title"
                ).innerText;
            const content =
                btn_edit.parentElement.parentElement.querySelector(
                    ".content"
                ).innerText;
            
            const element_title = document.querySelector('#title');
            const element_content = document.querySelector('#content');
            
            element_title.value = title;
            element_content.value = content;
            element_title.dataset.id = id;
        });
    });
}

getNote();