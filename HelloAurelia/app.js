export class App{

    constructor() {
        this.message = '';
        this.counter = 0;
    }

    activate(){
        this.message = 'Hello from Aurelia! :)';
    }

    changeMessage(){
        this.message += ' LORENA';
        alert('counter: ' + ++this.counter);
    }

}