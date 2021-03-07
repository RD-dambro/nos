export class Utils {
    readPromise = (promise: Promise<any>) =>{
        promise
        .then(data => console.log("got: ", data))
        .catch((err) => console.log("CAUGHT! ", err))
        .finally(() => console.log('done'))
    }
}