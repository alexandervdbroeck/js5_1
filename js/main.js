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
    var keyArray = [43,46,40,41]


    // click and hover events---------------------------------------------------------//

    // Submit button
    sendButtonTag.click(function () {
        messagesArray.push("<p>u drukte op de knop</p>");
        $('#testval').validate({
            rules: {
                usr_naam: "required",
                minlength: 5
            },
            messages:{
                usr_naam: {
                    required: "test required",
                    minlegth: "test minlenght"
                }
            }
            }
        );

        //  if (CheckFormBeforeSubmit("form",numberfields))
        // {
        //     var formdata = $("form").serialize();
        //     AjaxCall("formhandler.php","POST",formdata,"json",saveFormInDb)
        // }else{
        //     messagesArray.push("<p style='color: red'>Controleer aub of uw formulier goed ingevuld is</p>")
        //      sendArrayMessage(messagesArray,MessageTag)
        //
        // }
    })

    // Mous events
    title.hover(function () {
        title.css("color","blue").stop()
        sendButtonTag.slideUp("slow");
    },function () {
        title.css("color","black").stop()
        sendButtonTag.slideDown("slow");


    })
    title.mousedown(function () {
        title.css("color","black").stop()
    }).mouseup(function () {
        title.css("color","blue").stop()
    })

    /// --------------Form Checks while typing------------------------------------------------------///
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
    // city search when city code is filed in
    postCodeTag.keyup(function () {
        if(postCodeTag.val().length == 4)
        {
            AjaxCall("formhandler.php","POST",{post_code: postCodeTag.val()},"json",getCommuneByPostalCode);

        }
    });

    $('#telefoon').keypress(function (event) {
        var arrayCheck = jQuery.inArray(event.which, keyArray)
        if(arrayCheck == -1 & (event.which < 47 || event.which > 58) ){
            messagesArray.push("<p>uw gebruikt foutive waarde voor een telefoonnr</p>")
            event.preventDefault();
            sendArrayMessage(messagesArray,MessageTag)

        }
    })

    // pop up screen from city name check result
    $('body').on("click",gemeentecheckbox,function () {

        var CheckedCity =$("#PopUpGemeente input[type='radio']:checked").val()
        GemeenteTag.attr("value",CheckedCity);
        gemeenteDiv.css("display","none");

    })



//--------------------------Functions-------------------------------------//

    function sendArrayMessage(message,tag) {
        // for multiple message's
        tag.empty()
        for (let i = 0; i < message.length ; i++) {
            tag.append(message[i]);
        }
        // Delete the messages
        messagesArray = [];
    }

    var saveFormInDb = function (data) {
        messagesArray.push("<p>"+data+"</p>")
        sendArrayMessage(messagesArray,MessageTag)

    }
    var getCommuneByPostalCode  = function (data) {
        // when there is just 1 commune for the postal code
        gemeenteDivList.empty()
        switch (data.length) {
            case 0:
                messagesArray.push("<p>Sorry, uw postcode bestaat niet</p>");
                sendArrayMessage(messagesArray,MessageTag);
                break;
            case 1:
                var townname = data[0].post_naam.toLowerCase();
                GemeenteTag.attr("value",townname);
                break;
                // with more than one city , the pop uw with the list is displayed
            default:
                for (let i = 0; i < data.length; i++) {
                    var cityinput = "<li><input   type='radio' name='gemeentecheck' id='gemeentecheck' value='"+data[i].post_naam.toLowerCase()+"'>"+data[i].post_naam.toLowerCase()+"</li>"
                    gemeenteDivList.append(cityinput)
                }
                // display the popup
                gemeenteDiv.css("display","flex")
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
            if (! $(this).val() & $(this).attr("id") != "gemeente" & $(this).attr("id") != "bus" ) {
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
            }
            // Phone validation
            if($(this).attr('id') == "telefoon"  ){
                var newphone = $(this).val().split('.').join(" ")
                $(this).val(newphone)
                var emailReg = /^[0-9-+s( )]*$/;
                if(!emailReg.test($(this).val())){
                    errorOnFormField("telefoon niet geldig",$(this));
                    allIsOk = false;
                }else{
                    $(this).removeClass('borderR')
                }
            }
            
        });
        return allIsOk;
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






