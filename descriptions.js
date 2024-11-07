let textField = "";

async function findByID(num){

    try{
        const response = await fetch('waypoints.json')
        if(id >=0 && id < waypoints.length){
            textField+= response.name;
            textField+="<br>";
            
        }
    }catch{
        

    }
}