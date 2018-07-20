let exceed = {
    url: 'http://ecourse.cpe.ku.ac.th:1515/api/',
    prefix: 'palmyut-',
    getVal: function (name, callback, type, optdata) {
        if (!type) type = "view"
        $.ajax({
            type: "GET",
            url: `${this.url}${this.prefix}${name}/${type}/`,
            data: (optdata) ? optdata : {},
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
            type: "GET",
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
    getHistory: function (name, callback, limit, before, after) {
        this.getVal(name, (typeof callback != "undefined") ? callback : null, "history",
            {
                limit: (limit) ? limit : null,
                before: (before) ? before : null,
                after: (after) ? after : null
            })
    }
}
let home = {
    dataList: ['door_state','bulb_state','airconditioner_state','temperature','humidity','light_intensity','speaker_state'],
    speaker_state: 0,
    door_state: 0,
    bulb_state: 0,
    airconditioner_state: 0,
    temperature: 0.00,//Float
    humidity: 0.00,//Float
    light_intensity: 0,//Int
    updateData: function (name) {
        for (var i = 0; i < this.dataList.length; i++) {
            console.log(`updateData i=${i} ${this.dataList[i]} START!`)
            let key = this.dataList[i]
            exceed.getVal(key, function (resp) {
                console.log(`updateData ${key} RESP: ${resp}`)
                if (resp == null || resp == "") {
                    this[key] = "N/A"
                } else {
                    this[key] = resp
                }

                if(key.indexOf('_state')!=-1){
                    if(this[key]==1)
                        $('#'+key).attr('checked','true')
                    else 
                        $('#'+key).removeAttr('checked')
                } else if(key=="temperature"||key=="humidity"||key=="light_intensity") {
                    $('#'+key).text(this[key])
                }
            })
        }
    },
    toggleState: function (device) {
        console.log(`Toggling ${device} to ${this[device + "_state"]}...`)
        $('#'+device+'Loading').show();
        exceed.saveVal(device, (this[device + "_state"]) ? 1 : 0, function (isOK) {
            $('#'+device+'Loading').hide();
            if (!isOK){
                alert("Cannot toggle state of "+device);
            } else {
                console.log("Toggle ok!")
            }
        })
    },
    showHistory: function (device) {
        exceed.getHistory(device, function (json) {
            if (json.length == 0) {

            } else {
            }
        })
    }
}
$(function () {
    $('input[type="checkbox"]').click(function(){
        let dataId = $(this).attr('id');
        console.log("checkBox clicked "+dataId);
        this[dataId] = ($('#'+dataId).is(':checked'))?1:0;
        home.toggleState(dataId.replace("_state",""))
    })
    $('[data-action="timer"]').click(function(){
        let data = $(this).data();
        //TODO: Timer Dialog
        return false;
    })
    home.updateData()
})