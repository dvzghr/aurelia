import {inject} from "aurelia-framework";
import {MovieData} from "./movieData";

@inject(MovieData)
export class App{

    constructor(movieData) {
        this.message = '';
        //this.counter = 0;
        //this.http = httpClient;

        this.movieData = movieData;
    }

    static inject() { return [HttpClient];}

    activate(){
        this.message = 'Hello from Aurelia! :)';

        //return this.http.get("/movies.json")
        //                .then(response => {
        //                    this.movies = response.content;
        //                    console.log(this.movies);
        // });

        return this.movieData.getAll()
                             .then(movies => this.movies = movies);    
}

changeMessage(){
    this.message += ' LORENA';
    //alert('counter: ' + ++this.counter);
}

}