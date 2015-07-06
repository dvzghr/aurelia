import {HttpClient} from "aurelia-http-client";

export class App{

    constructor() {
        this.message = '';
        //this.counter = 0;
        this.http = new HttpClient();
    }

    activate(){
        this.message = 'Hello from Aurelia! :)';
        return this.http.get("/movies.json")
                        .then(response => {
                            this.movies = response.content;
                        });
    }

    changeMessage(){
        this.message += ' LORENA';
        //alert('counter: ' + ++this.counter);
    }

}