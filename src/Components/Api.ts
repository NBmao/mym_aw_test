export const enum ActionType {
    Init,
    Loading,
    Success,
    Error
}

export class Actions {
    public static get(){}

    public static post(url, data){
        var promise = new Promise((resolve, reject) =>{
            var client = new XMLHttpRequest();
            client.open("Post",url);
            client.onreadystatechange=handler;
            client.responseType="json";
            client.setRequestHeader("Accept","application/json");
            client.send(JSON.stringify(data));
      
            function handler(){
              if(this.readyState !==4){
                return;
              }
              if(this.status === 200){
                resolve(this.response);
              }else if(this.status === 400){
                reject(this.response);
              }else{
                alert("Unhandled error")
                //reject(new Error(this.statusText))
              }
            }
        });
        
        return promise;
    }
}