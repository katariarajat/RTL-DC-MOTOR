const axios = require('axios');
axios.defaults.withCredentials = true;

// export { signupData  };
export async function signupData(newUser){

    axios.post("http://localhost:4000/user/signup", JSON.stringify(newUser),{
      headers:{ 
          'Content-Type': 'application/json',
          // 'Access-Control-Allow-Origin': '*'
       }
    }
    ).then(res => {
      console.log("Adding: \n");
      console.log(res.data);
      if(res.data.success === false)
        alert("This email-id has already been taken! Try with a different email-id");
      else
      {
        // localStorage.removeItem("currentUser");
        // localStorage.setItem('currentUser',JSON.stringify(res.data.email));
        // var currentUser = JSON.parse(localStorage.getItem('currentUser'));
        // console.log("setting local storage as: \n");
        // console.log(currentUser.email);
        window.location.href="http://localhost:3000/sessionsList";
        // this.props.history.push("/sessionsList");
      }
    });
}

export async function checkedLogged(){
  return new Promise((resolve,reject) =>{
    console.log("IN CHECKEDLOGGED");
    axios.get('http://localhost:4000/user/checklog',{
      headers:{ 
          'Content-Type': 'application/json',
       }
    })
    .then(function (response) {
      
      console.log("IN CHECKED LOGGED THEN");
      console.log(response.data.user_email);
        if(response.data.res !== "Authenticated"){
          window.location.href="http://localhost:3000/login";
        }
        else 
        {
          resolve(response.data.user_email);
        }
    })
    .catch(function (error) {
      console.log("IN CATCH");
    });
    
  });
  
}

export async function GetBookedSession(request){
  return new Promise(async (resolve,reject) => {
    
      try {
      
        console.log("CHECKEDLOGG");
        console.log(request);
        axios.get("http://localhost:4000/booking/getsession",{params : request})
        .then(response => {

            if(response.data.success === true)
            {
                console.log(response.data.sessions);
                resolve(response.data.sessions);
            }
            else
            {
              alert("Not able to get session.");
              window.location.href="http://localhost:3000/sessionsList";
            }
        });
    }
    catch (error) {
          alert("Request Not Sent")
      }
  });
}


export async function GetUnBookedSessions(Data){
  return new Promise(async (resolve,reject) => {
      try {
        axios.get("http://localhost:4000/booking/getslot",{ params : Data}).then(res => {
                console.log("Got slots: \n");
                console.log(res.data);
                if(res.data.success === true)
                {
                  resolve(res.data.slots);
                    // return res.data.slots;
                }
                else {
                  resolve(["error"]);
                  alert("No Data Received");
                }
            });  
      } catch (error) {
          alert("Request Not Sent")
      }
  });
  
}

export async function BookSession(session){
  return new Promise((resolve,reject) => {
    try {
      axios.post("http://localhost:4000/booking/addsession", session).then(res => {
      console.log("Adding session: \n");
      console.log(res.data);
      if(res.data.success === true)
      {
          alert(res.data.res);
          window.location.href="http://localhost:3000/sessionsList";
      }  
      else 
      {
          alert("Session was not Booked");
      }
     });
    }
   catch (error) {
        alert("Request Not Sent")
    }
  });
}


export async function DeleteSession(req){
  return new Promise((resolve,reject) => {
    
    try {
      axios.post("http://localhost:4000/booking/deleteSession", req)
      .then(response => {
          if(response.data.success === true)
          {
              alert(response.data.res);
              window.location.href="http://localhost:3000/sessionsList";
          }
          else 
          {
            alert("Not able to Delete Data");
          }
      });
    }
   catch (error) {
        alert("Request Not Sent");
    }
  });
}

export async function GetExperimentDataById(req){
  return new Promise((resolve,reject) => {
    try {
      axios.post("http://localhost:4000/booking/experimentdata", req)
    .then(response => {
        if(response.data.success === true)
        {
            console.log(response.data.data.experimentData);
            resolve(response.data.data);
        }
    });
    }
   catch (error) {
        alert("Request Not Sent");
    }
  });
}

export async function GetExperimentList(req){
  return new Promise((resolve,reject) => {
    try {
      axios.post("http://localhost:4000/booking/getExperiment", req)
        .then(response => {
            if(response.data.success === true)
            {
                console.log(response.data.experiments);
                resolve(response.data.experiments)

            }
        });
    }
   catch (error) {
        alert("Request Not Sent");
    }
  });
}

export async function CreateNewExperiment(exp){
  return new Promise((resolve,reject) => {
    try {
      axios.post("http://localhost:4000/booking/createxperiment", exp).then(res => {
            console.log("Creating: \n");
            console.log(res.data);
            if(res.data.success === true)
            {
              try{
                var data = {
                  experimentId: res.data.res
                }
                axios.post("http://localhost:4000/makeNewNode", data).then(res => {
                  console.log("Created New Node \n");
                });
                resolve(res.data.res);
              }
              catch {
                
                // THIS CODE MUST BE UNCOMMENTED IN FUTURE 

                DeleteExperimentById({
                  experiment_id : res.data.res,
                  session_id : exp.session_Id,
                });
                alert("ERROR: PLease create New experiment, Couldn't connect to sensors");
              }
            }
            else
            {
                alert(res.data.res);
            }
        });
    }
   catch (error) {
        alert("Request Not Sent");
    }
  });
}

export async function DeleteExperimentById(req){
  return new Promise((resolve,reject) => {
    try {
      axios.post("http://localhost:4000/booking/deleteExperiment", req)
        .then(response => {
            if(response.data.success === true)
            {
                alert(response.data.res);
                window.location.reload(false);
            }
            else 
            {
                alert("Unable to Delete");
            }
        });
    }
   catch (error) {
        alert("Request Not Sent");
    }
  });
}


export async function SaveExperimentData(request){
  return new Promise((resolve,reject) => {
    try {
      axios.post("http://localhost:4000/booking/saveExperiment", request)
        .then(response => {
            if(response.data.success === true)
            {
                alert(response.data.res);
                resolve(response.data.success);
            }
            else 
            {
              resolve(response.data.success);
                alert("Unable to Save Data, please try again");
            }
        });
    }
   catch (error) {
        alert("Request Not Sent");
    }
  });

}

// 