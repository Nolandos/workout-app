class Exercise {
    constructor (title, video, timeDuration ){
        this.title = title;
        this.video = video;
        this.timeDuration = timeDuration;
    }
}

class WorkoutManager { 
    constructor(selector) {
        this.selector = selector       
        this.userList = JSON.parse(localStorage.getItem('exerciseBase'))
        this.render()
        this.createExerciseWiki()
        this.createExerciseSelect()
        this.createExercisesRecords()
        this.addListeners()  
    }

    addListeners() {
        document.querySelector('#btn-add').addEventListener('click', (e) => {
            e.preventDefault();
            this.addExerciseToUserList();
        });

        
        document.querySelector('#btn-save').addEventListener('click',(e) => {
            e.preventDefault();
            localStorage.setItem('exerciseBase', JSON.stringify(this.userList));
      });

      
        document.querySelector('#btn-delete-all').addEventListener('click', (e) => {
            localStorage.removeItem('exerciseBase');
            this.userList = [];
            this.createExercisesRecords();
        });

        document.querySelector('#current-exercises').addEventListener('click', (e) => {
            if(e.target.classList.contains('delete-button')) {            
                this.deleteExercise(e.target.dataset.index);
              }
        });

        document.querySelector('#btn-start').addEventListener('click', (e) => {
            this.renderModal();
        });

        document.querySelector('#modal-place').addEventListener('click', (e) => {
            if(e.target.classList.contains('finish-training')) {            
                document.querySelector('#modal-place').innerHTML= '';
            }
        });

        
    }

    render() {
        this.selector.innerHTML = `
        <div class="container">
            <div class="modal-place" id="modal-place"></div>
                <div class="exercises-to-choice">
                    <div class="panel panel-default base-pannel">
                        <div class="panel-heading">
                            <div class="row">
                                <div class="col-md-5">
                                    <h3 class="panel-title">Baza ćwiczeń:</h3>
                                </div>
                                <div class="col-md-5 text-right">
                                    <button type="button" class="btn btn-info btn-expand" data-toggle="collapse" data-target="#exercise-base">Rozwiń</button>
                                </div>
                            </div>
                        </div>
                        <div id="exercise-base" class="collapse">
                            <div class="panel-body" id="exercises-base"> </div>
                        </div> 
                    </div>
                </div>
                <header>
                    <h1>Stwórz własną listę ćwiczeń: 
                        <button type="button" class="btn btn-dark" id="btn-save">Zapisz listę</button>
                        <button type="button" class="btn btn-danger" id="btn-delete-all">Usuń Listę</button>
                    </h1>        
                </header>
                <form id="add-exercise-form">
                    <div class="form-group">
                        <div class="row">
                            <div class="col-md-5">
                                <label for="exercise-list">Wybierz ćwiczenie</label>
                                <select class="form-control" id="exercise-select"></select>
                            </div>
                            <div class="col-md-3">
                                <label for="time-duration">Czas Wykonywania</label>
                                <input type="text" class="form-control" id="exercise-duration" placeholder="czas trwania (s)" required>
                            </div>
                            <div class="col-md-4">
                                <label for="btn-add">Akcja</label> </br>
                                <button type="submit" class="btn btn-success" id="btn-add">Dodaj</button>
                            </div>
                        </div>
                    </div>
                </form>
                <div class="exercise-list">
                    <table class="table table-bordered">
                        <thead>
                            <tr>
                                <th scope="col">Tytuł</th>
                                <th scope="col">video</th>
                                <th scope="col">Czas Trwania</th>
                                <th scope="col">Opcja</th>
                            </tr>
                        </thead>
                        <tbody id="current-exercises">
                            
                        </tbody>
                        <thead>
                            <tr>
                                <th scope="col"></th>
                                <th scope="col"> Łączny czas:</th>
                                <th scope="col" id="sum-of-time"></th>
                            </tr>
                        </thead>
                    </table>
                </div>
                <button class="btn btn-warning btn-block text-center align-middle" id="btn-start" data-toggle="modal" data-target="#exampleModal">Rozpocznij Trening</button>
            </div>
        `;    
    }

    createExerciseWiki() {
        let container = document.querySelector('#exercises-base');

        exercise_data.forEach((item) => {
            container.innerHTML += `
            <div class="panel panel-default base-pannel">
                <div class="panel-heading">
                    <div class="row">
                        <div class="col-md-5">
                            <h3 class="panel-title">${item.title}</h3>
                        </div>
                        <div class="col-md-5 text-right">
                            <button type="button" class="btn btn-primary" data-toggle="collapse" data-target="#${item.id}">Więcej</button>
                        </div>
                    </div>
                </div>
  
                <div id="${item.id}" class="collapse">
                    <div class="panel-body">
                        <div class="row">
                            <div class="col-md-5">
                                <div class="embed-responsive embed-responsive-4by3">
                                    <video class="embed-responsive-item" controls><source src="${item.video}" type="video/mp4"> </video>
                                </div>
                            </div>
                            <div class="col-md-5">
                                <p>${item.description}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
        });
    }

    createExerciseSelect() {
        let selectList = document.querySelector('#exercise-select');
        exercise_data.forEach((item) => { 
            selectList.innerHTML += `
            <option>${item.title}</option>
            `;
        });
    }

    addExerciseToUserList() {
        let selectedExercise = document.querySelector('#exercise-select').value;
        let timeDuration = document.querySelector('#exercise-duration').value;
        let newOwnExercise;

        if(timeDuration === '') {
            document.querySelector('#exercise-duration').classList.add('error');
        } else {

            exercise_data.forEach((item) => {
                if(selectedExercise === item.title) {
                    newOwnExercise = new Exercise (selectedExercise, item.video, timeDuration);
                }
            });
 
            this.userList.push(newOwnExercise);
            this.createExercisesRecords();
        }
    }

    createExercisesRecords() {
        let currentExercise = document.querySelector('#current-exercises');
        let sum = 0;
        let totalTime = document.querySelector('#sum-of-time');

        currentExercise.innerHTML = ''; 

        if(this.userList === null) {
            this.userList = [];
        }

        this.userList.forEach((item, index) => {
            currentExercise.innerHTML += `
            <tr>
                <td>${item.title}</td>
                <td><video width="320" height="240" class="embed-responsive-item" controls><source src="${item.video}" type="video/mp4"> </video></td>
                <td>${item.timeDuration}</td>
                <td> <button class="btn btn-danger btn-sm delete-button" data-index="${index}">Usuń</button></td>
            </tr>
            `;

            sum += parseInt(item.timeDuration);
        });

        totalTime.innerHTML = sum;
    }

    deleteExercise(index) {
        this.userList.splice(index, 1);
        this.createExercisesRecords();
    }

    renderModal() {
        document.querySelector('#modal-place').innerHTML = `
        <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel"></h5>                       
                    </div>
                    <div class="modal-body" id="modal-body">
                        
                    </div>
                    <div class="modal-footer">
                        <div class="counter-seconds" id="counter-seconds"></div>
                        <div class="wrapper">
                            <button type="button" class="btn btn-secondary start-training" id="start-training">Start</button>
                            <button type="button" class="btn btn-secondary stop-training" id="stop-training">Stop</button>
                            <button type="button" class="btn btn-secondary finish-training" data-dismiss="modal" id="finish-training">Zakończ</button>
                        </div>
                    </div>
                </div>
            </div>
      </div>
    `;

        this.switchExercise();
    }

    switchExercise() {
        let modalTitle = document.querySelector('.modal-title');
        let modalBody = document.querySelector('#modal-body');
        let modalSeconds = document.querySelector('#counter-seconds');

        let list = this.userList;
        let index = 0;
        let isPaused = false; 
        

        document.querySelector('#start-training').addEventListener('click', (e) => {
            isPaused = false;
            document.querySelector('video').play();            
        });

        document.querySelector('#stop-training').addEventListener('click', (e) => {
            isPaused = true;
            document.querySelector('video').pause();            
        });

        


        function nextExercise () {
            if(index < list.length) {
                let second = list[index].timeDuration;
                
                modalSeconds.innerHTML = second; 
                modalBody.innerHTML = `
                    <video class="embed-responsive-item video" autoplay loop><source src="${list[index].video}" type="video/mp4"> </video>
                `;
                
                modalTitle.innerHTML = `${list[index].title}`;

                const interval = setInterval(function() {
                    if(!isPaused) {

                        second--;
                        modalSeconds.innerHTML = second;

                        if(second == 0) {
                            index++;
                            clearInterval(interval);
                            nextExercise();
                        }
                    }
                }, 1000);
            } else {
                modalBody.innerHTML = `
                <div class="end-training">Koniec treningu!</div>                
                `; 
            }            
        }
        nextExercise();
    }

 
        
}



/*TUTAJ RENDERUJĘ WIDOK PODSTAWOWY/STARTOWY APLIIKACJI*/
const App = new WorkoutManager(document.querySelector('#app'));