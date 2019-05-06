class WorkoutManager { 
    constructor(selector) {
        this.selector = selector; 
    }

}



/*TUTAJ RENDERUJĘ WIDOK PODSTAWOWY/STARTOWY APLIIKACJI*/
const App = new WorkoutManager(document.querySelector('#app'));