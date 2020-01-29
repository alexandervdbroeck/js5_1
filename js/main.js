$(function () {

    // Function declaration---------------------------------------------------------//
    var sendButtonTag = $('#Verzenden');
    var title = $('#formtitle')
    var postCodeTag = $('#postcode')
    var GemeenteTag = $('#gemeente')
    var gemeenteDiv = $('#PopUpGemeente');
    var gemeenteDivList = $('#popuplist')
    var gemeentecheckbox = $('#gemeentecheck');
    var MessageTag = $('#message');
    var messagesArray = [];
    var numberfields = ["huisnr","bus"]


    // click and hover events---------------------------------------------------------//

    // Submit button
    sendButtonTag.click(function () {
        messagesArray.push("<p>u drukte op de knop</p>");
        sendArrayMessage(messagesArray,MessageTag);
         if (CheckFormBeforeSubmit("form",numberfields))
        {
            console.log("truee")
        }else{
            console.log("faalse")
        }
    })

    // Mous events
    title.hover(function () {
        title.css("color","blue").stop()
    },function () {
        title.css("color","black").stop()

    })
    title.mousedown(function () {
        title.css("color","black").stop()
    }).mouseup(function () {
        title.css("color","blue").stop()
    })

    /// --------------post code checks------------------------------------------------------///
    postCodeTag.keypress(function (event) {
        if(event.which < 47 || event.which > 58){
            messagesArray.push("<p>Gelieve enkel cijfers in te geven</p>")
            event.preventDefault();
            sendArrayMessage(messagesArray,MessageTag)

        }
        if(postCodeTag.val().length >= 4)
        {
            messagesArray.push("<p>U kan maar 4 cijfers ingeven</p>")
            event.preventDefault();
            sendArrayMessage(messagesArray,MessageTag)
        }

    });
        // if the 4 number of the postal code is typed, check db for possibilities
    postCodeTag.keyup(function () {
        if(postCodeTag.val().length == 4)
        {
            AjaxCall("formhandler.php","POST",{post_code: postCodeTag.val()},"json",getCommuneByPostalCode);

        }
    });

    // pop up screen from city name check result
    $('body').on("click",gemeentecheckbox,function () {

        var CheckedCity =$("#PopUpGemeente input[type='radio']:checked").val()
        GemeenteTag.attr("value",CheckedCity);
        gemeenteDiv.css("display","none");

    })



//--------------------------Functions-------------------------------------//

    function sendArrayMessage(message,tag) {
            // for multiple message's
        for (let i = 0; i < message.length ; i++) {
            if(i == 0) {
                tag.empty().html(message[i]);
            } else
            {
                tag.append(message[i]);
            }
        }
            // Delete the messages
        messagesArray = [];
    }

    var getCommuneByPostalCode  = function (data) {
        // when there is just 1 commune for the postal code
        if(data.length > 1)
        {
            for (let i = 0; i < data.length; i++) {
                var cityinput = "<li><input   type='radio' name='gemeentecheck' id='gemeentecheck' value='"+data[i].post_naam+"'>"+data[i].post_naam+"</li>"
                if(i == 0)
                {
                    gemeenteDivList.html(cityinput)
                }else
                {
                    gemeenteDivList.append(cityinput)
                }
                gemeenteDiv.css("display","flex")
            }
        }
        if(data.length == 1)
        {
            var townname = data[0].post_naam;
            GemeenteTag.attr("value",townname);
        }
        if(data.length ==0)
        {
            messagesArray.push("<p>Sorry, uw postcode bestaat niet</p>")
            sendArrayMessage(messagesArray,MessageTag)
        }
    };


    function CheckFormBeforeSubmit(formid,numberfields)
    {
        var allIsOk = true;
        // if checkbox "no check" is checked, the form wil not be checked
        if($('form input[type="checkbox"]').prop("checked") == false){
            return allIsOk;
        }
        // loop thrue form for each field
        $(formid).find( 'input[type!="hidden"]' ).each(function () {
            // if there is no value
            if (! $(this).val() ) {
                errorOnFormField("Dit veld is verplicht",$(this));
                allIsOk = false;
            }else {
                $(this).removeClass('borderR')

            }

            // check of fields containing numbers
            if(jQuery.inArray($(this).attr('id'), numberfields) !== -1 &  isNaN($(this).val()) ){
                errorOnFormField("enkel nummers aub",$(this));
                allIsOk = false;

            } else {
                $(this).removeClass('borderR')

            }

            // mail validation
            if($(this).attr('id') == "E-mail"  ){
                var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
                if(!emailReg.test($(this).val())){
                    errorOnFormField("e-mail niet geldig",$(this));
                    allIsOk = false;
                }else{
                    $(this).removeClass('borderR')
                }
                return allIsOk;
            }

            // Phone validation
            if($(this).attr('id') == "telefoon"  ){
                var newphone = $(this).val().split('.').join(" ")
                $(this).val(newphone)
                console.log($(this).val())
                var emailReg = /^[0-9-+s( )]*$/;
                if(!emailReg.test($(this).val())){
                    errorOnFormField("telefoon niet geldig",$(this));
                    allIsOk = false;
                }else{
                    $(this).removeClass('borderR')
                }
            }

        });
    }
function errorOnFormField(message,tag) {
    tag.addClass('borderR');
    tag.attr("placeholder",message)
    tag.val("")
}
    // ajax funties----------------------------------------------------------
    function AjaxCall(url,type,data,datatype,function_for_succes) {
        $.ajax({
            url: url,
            type: type,
            data: data,
            dataType: datatype,
            async: true,
            success: function(data) {
                function_for_succes(data)
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert("Error")
                alert(thrownError)
            }
        });
    }



});






