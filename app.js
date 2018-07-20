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
let isLoaded = {
    door_state: 0,
    bulb_state: 0,
    airconditioner_state: 0,
    temperature: 0,
    humidity: 0,
    light_intensity: 0,
    speaker_state:0
};
let checkLoadCnt = function(compare,callback) {
    let cnt = 0;
    for (var i = 0; i < home.dataList.length; i++) {
        cnt+=isLoaded[home.dataList[i]] 
    }
    console.log("cnt "+cnt+" compare "+compare)
    if(compare==cnt) {
        callback();
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
                isLoaded[key] = 1
                checkLoadCnt(home.dataList.length,function() {
                    $('#cover-spin').hide();
                })

                console.log(`updateData ${key} RESP: ${resp}`)
                if (resp == null || resp == "") {
                    this[key] = "N/A"
                } else {
                    this[key] = resp
                }

                if(key.indexOf('_state')!=-1){
                    if(this[key]==1)
                        $('#'+key).prop('checked','true')
                    else 
                        $('#'+key).removeProp('checked')
                } else if(key=="temperature"||key=="humidity"||key=="light_intensity") {
                    $('#'+key).text(this[key])
                }
                
                //Additional Icon change
                if(key=="airconditioner_state") $('#'+key.replace("_state","")+"-icon").attr('src','img/airconditioner-'+((this[key])?'on':'off')+'.png')
            })
        }
    },
    toggleState: function (device) {
        console.log(`Toggling ${device} to ${this[device + "_state"]}...`)
        $('#'+device+'Loading').show(500);
        exceed.saveVal(device+"_state", (this[device + "_state"]) ? 1 : 0, function (isOK) {
            $('#'+device+'Loading').hide(500);
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
        home[dataId] = ($('#'+dataId).is(':checked')==true)?1:0;
        home.toggleState(dataId.replace("_state",""))
    })
    $('[data-action="timer"]').click(function(){
        console.log("clickkk");
        let btnData = $(this).data();
        $('.popover').remove();
        $(this).popover({
            title: `Set timer for ${btnData.device}`,
            content: `
            <input class="form-control" type="number" min="0" value="0"> min(s) <input class="form-control" type="number" min="0" max="59" value="0"> sec(s) 
            <button type="submit" class="btn btn-block btn-primary">Set</button>
            `,
            html: true,
            template:'<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-header text-dark"></h3><div class="popover-body text-dark"></div></div>'
        })
        $(this).popover('show')
        return false;
    })
    $('#cover-spin').show(0)
    home.updateData()
    setInterval(function() { home.updateData() },7000)
})