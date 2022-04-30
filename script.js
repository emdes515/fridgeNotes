const addNote = document.querySelector('[data-add-note]');
const listOfNotes = document.querySelector('[data-list-of-notes]');
const popup = document.querySelector('[data-popup]');
const popupExit = document.querySelector('[data-popup-exit]');
const popupBtn = document.querySelector('[data-popup-btn]');
const popupTitle = document.querySelector('[data-popup-title]');
const popupDescription = document.querySelector('[data-popup-description]');
const popupTitleSpan = document.querySelector('[data-popup-title-span]');
const popupDescriptionSpan = document.querySelector('[data-popup-description-span]');

let arrNotes = []; 
let noteOptions; 

let flagEdit = false;
let flagDel = false;

Note.prototype.monthNamePl = ['Styczeń', 'Luty', 'Marzec', 'Kwienień', 'Maj', 'Czerwiec', 'Lipiec', 'Śierpień', 'Wrzesień', 'Pażdziernik', 'Listopad', 'Grudzień']; 
Note.prototype.monthNameEn = ['January', 'February', 'March', 'April','May', 'June', 'July',' August', 'September', 'Octber', 'November', 'December'];

function Note(title, description, date){
    this.title = title;0
        this.description = description;
    this.date = date; 

    console.log(this.date.getDate())

    this.day = this.date.getDate();
    this.month = Note.prototype.monthNameEn[this.date.getMonth()];  
    this.year = this.date.getFullYear();

    this.id = arrNotes.length;

    listOfNotes.insertAdjacentHTML('afterbegin', 
    `<li class="note" id=${this.id}>
    <div class="noteHeader"><h2 data-note-header>${this.title}</h2></div>
    <div class="noteDescription" data-note-description>${this.description}</div>
    <div class="noteDate"> <span data-note-date>${this.day} ${this.month} ${this.year}</span>
    <span data-note-options class="tDots" >&hellip;</span>
    </div></li>`);
}

function addElement() {

    let note, title, description, date; 


    title = popupTitle.value;
    description = popupDescription.value;

    if(title && description){
        date = new Date();

        note = new Note(title, description, date);
    
        arrNotes.push(note);

        popupHide(); 
    
        popupTitle.value = ''; 
        popupDescription.value = ''; 
        popupTitleSpan.style.opacity = 0;
        popupDescriptionSpan.style.opacity = 0;

        localStorage.setItem('note', JSON.stringify(arrNotes));
    }

    if(!title){
        popupTitleSpan.style.opacity = 100;
    }
    else{
        popupTitleSpan.style.opacity = 0;
    }

    if(!description){
        popupDescriptionSpan.style.opacity = 100;
    }
    else{
        popupDescriptionSpan.style.opacity = 0;
    }

    let noteOptionsLocal = document.querySelectorAll('[data-note-options]');
    noteOptionsLocal = [...noteOptionsLocal];
  
    noteOptions = noteOptionsLocal; 
}

function popupShow(){
    popup.style.display = 'block';
}

function popupHide(){
    popup.style.display = 'none';
}

function showOptions(target){
    noteOptions.forEach((e,i)=>noteOptions[i].classList.remove('tDotsAct'));
    noteOptions.forEach((e,i)=>noteOptions[i].innerHTML = '&hellip;');
    if(target.classList.contains('tDots')){
        target.classList.add('tDotsAct');
        target.innerHTML = `
                <figure  class="edit">
                    <img class="editEl" src="img/icons8-edit-30.png" alt="">
                    <figcaption class="editEl" >Edit</figcaption>
                </figure> 
                <figure class="del">
                    <img clas="delEl" src="img/icons8-bin-30.png" alt="">
                    <figcaption class="delEl" >Delete</figcaption>
                </figure>`; 
    }
    else return;
}

function init(){
  arrNotes = localStorage.getItem('note') ? JSON.parse(localStorage.getItem('note')) : []; 

  arrNotes.forEach((e,i)=>{
    listOfNotes.insertAdjacentHTML('afterbegin', 
    `<li class="note" id=${arrNotes[i].id}>
    <div class="noteHeader"><h2 data-note-header>${arrNotes[i].title}</h2></div>
    <div class="noteDescription" data-note-description>${arrNotes[i].description}</div>
    <div class="noteDate"> <span data-note-date>${arrNotes[i].day} ${arrNotes[i].month} ${arrNotes[i].year}</span>
    <span data-note-options class="tDots" >&hellip;</span>
    </div></li>`);
  });

  let noteOptionsLocal = document.querySelectorAll('[data-note-options]');
  noteOptionsLocal = [...noteOptionsLocal];

  noteOptions = noteOptionsLocal; 
}

function edit(target){
    if(target.classList.contains('edit') && flagEdit == false){
        flagEdit = true;
        let li = target.parentElement.parentElement.parentElement; 
        editCheck(li);
    }
    if(target.classList.contains('editEl') && flagEdit == false){
        flagEdit = true;
        let li = target.parentElement.parentElement.parentElement.parentElement;
        editCheck(li);  
    }
}

function editCheck(li){
    let beforeTitle = li.querySelector('[data-note-header]').innerHTML;
    let beforeDescription = li.querySelector('[data-note-description]').innerHTML; 

    li.querySelector('[data-note-header]').innerHTML = `<input type="text" value="${beforeTitle}" class="beforeHeader"/>`;
    li.querySelector(['[data-note-description]']).innerHTML = `<textarea class="beforeDescription">${beforeDescription}</textarea>`;

    const checkClick = e => {
        if((!e.target.classList.contains('beforeHeader') && !e.target.classList.contains('beforeDescription'))  ||  e.key == 'Enter'){
             modify('title'); 
             modify('description'); 
        }
    }

    function modify(what) { 
        if(what == 'title') what = 'header';
        let inputValue = li.querySelector(`[data-note-${what}]`).firstElementChild.value;
        if(what == 'header'){
            arrNotes[li.id].title = inputValue;
            li.querySelector(`[data-note-header]`).innerHTML = `${arrNotes[li.id].title}`;
        } 
        if(what == 'description'){
            arrNotes[li.id].description = inputValue;
            li.querySelector(`[data-note-description]`).innerHTML = `${arrNotes[li.id].description}`;
        } 
        localStorage.setItem('note', JSON.stringify(arrNotes));
        flagEdit = false;
        document.removeEventListener('click', checkClick);
        document.removeEventListener('keydown', checkClick)
    }

    document.addEventListener('keydown', checkClick)

    document.addEventListener('click', checkClick);
}

function del(target){
    if(target.classList.contains('del')){
        let li = target.parentElement.parentElement.parentElement; 
        make(li); 
    }
    if(target.classList.contains('delEl')){
        let li = target.parentElement.parentElement.parentElement.parentElement; 
        make(li); 
    }
    function make(li){
        li.remove(); 
        arrNotes.splice(li.id, 1);
        localStorage.setItem('note', JSON.stringify(arrNotes));
    }
}


window.addEventListener('load', init); 
addNote.addEventListener('click', popupShow);
document.addEventListener('click', e=> {del(e.target); edit(e.target); showOptions(e.target);});
popupExit.addEventListener('click', popupHide);
popupBtn.addEventListener('click', addElement);



