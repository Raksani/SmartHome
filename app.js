let exceed = {
    url: 'http://ecourse.cpe.ku.ac.th:1515/api/',
    prefix: 'palmyut-',
    getVal: function (name, callback, type) {
        if (!type) type = "view"
        $.ajax({
            type: "GET",
            url: `${this.url}${this.prefix}${name}/${type}/`,
            dataType: "text",
            success: function (response) {
                if (typeof callback == "function") callback(response)
            },
            fail: function (response) {
                console.log(`Failed AJAX getting [${name}] value: ${response}`)
                if (typeof callback == "function") callback(null)
            }
        });
    },
    saveVal: function (name, val, callback) {
        $.ajax({
            type: "POST",
            url: `${this.url}${this.prefix}${name}/set/`,
            data: { value: val },
            dataType: "json",
            success: function (response) {
                if (response.status) {
                    if (response.status == 'success') {
                        if (typeof callback == "function") callback(true)
                    } else {
                        console.log(`Failed API saving [${name}] value`)
                        if (typeof callback == "function") callback(false)
                    }
                } else {
                    console.log(`API not return status`)
                }
            },
            fail: function (response) {
                console.log(`Failed AJAX saving [${name}] value: ${response}`)
                if (typeof callback == "function") callback(false)
            }
        });
    },
    getHistory: function(name, callback) { 
        this.getVal(name, (typeof callback != "undefined") ? callback : null, "history") 
    }
}
$(function () {

})