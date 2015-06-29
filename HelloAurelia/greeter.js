var message = "Hello world!";

export function sayHello(msg) {
    if (!msg) msg = message;
    alert(msg);
}