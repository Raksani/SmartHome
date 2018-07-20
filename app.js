let apiUrl = 'http://ecourse.cpe.ku.ac.th:1515/api/'
function getVal(name,callback){
    $.ajax({
        type: "GET",
        url: `${apiUrl}${name}/view/`,
        dataType: "text",
        success: function (response) {
            if(typeof callback =="function") callback(response)
        },
        fail: function (response) {
            console.log(`Failed AJAX getting [${name}] value: ${response}`)
            if(typeof callback =="function") callback(null)
        }
    });
}
function saveVal(name,val,callback){
    $.ajax({
        type: "POST",
        url: `${apiUrl}${name}/set/`,
        data: {value: val},
        dataType: "json",
        success: function (response) {
            if(response.status){
                if(response.status=='success'){
                    if(typeof callback =="function") callback(true)
                } else {
                    console.log(`Failed API saving [${name}] value`)
                    if(typeof callback =="function") callback(false)
                }
            } else {
                console.log(`API not return status`)
            }
        },
        fail: function (response) {
            console.log(`Failed AJAX saving [${name}] value: ${response}`)
            if(typeof callback =="function") callback(false)
        }
    });
}
$(function(){
    
})