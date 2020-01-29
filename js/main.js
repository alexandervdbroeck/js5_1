$(function () {

    // Function declaration---------------------------------------------------------//
    var verzendenButtonSubmit = $('#Verzenden');
    var formTitle = $('#formtitle')
    var formPostCodeInputField = $('#postcode')
    var formGemeenteInputField = $('#gemeente')
    var gemeentePopUpDiv = $('#PopUpGemeente');
    var formGemeentePopupList = $('#popuplist')
    var formGemeenteRadioButton = $('#gemeentecheck');
    var messageParagraph = $('#message');
    var messagesArray = [];
    var formFieldsWithNumbers = ["huisnr","bus"];
    var allowedStrokesArray = [43,46,40,41];

    // click and hover events---------------------------------------------------------//

    // Submit button
    verzendenButtonSubmit.click(function () {
         if (CheckFormBeforeSubmit("form",formFieldsWithNumbers))
        {
            var formdata = $("form").serialize();
            AjaxCall("formhandler.php","POST",formdata,"json",saveFormInDb)
        }else{
            messagesArray.push("<p style='color: red'>Controleer aub of uw formulier goed ingevuld is</p>")
             sendArrayMessage(messagesArray,messageParagraph)

        }
    })

    // Mous events
    formTitle.hover(function () {
        formTitle.css("color","blue").stop()
        verzendenButtonSubmit.slideUp("slow");
    },function () {
        formTitle.css("color","black").stop()
        verzendenButtonSubmit.slideDown("slow");


    })
    formTitle.mousedown(function () {
        formTitle.css("color","black").stop()
    }).mouseup(function () {
        formTitle.css("color","blue").stop()
    })

    /// --------------Form Checks while typing------------------------------------------------------///
    formPostCodeInputField.keypress(function (event) {
        if(event.which < 47 || event.which > 58){
            messagesArray.push("<p>Gelieve enkel cijfers in te geven</p>")
            event.preventDefault();
            sendArrayMessage(messagesArray,messageParagraph)

        }
        if(formPostCodeInputField.val().length >= 4)
        {
            messagesArray.push("<p>U kan maar 4 cijfers ingeven</p>")
            event.preventDefault();
            sendArrayMessage(messagesArray,messageParagraph)
        }

    });
    // city search when city code is filed in
    formPostCodeInputField.keyup(function () {
        if(formPostCodeInputField.val().length == 4)
        {
            AjaxCall("formhandler.php","POST",{post_code: formPostCodeInputField.val()},"json",getCommuneByPostalCode);

        }
    });

    $('#telefoon').keypress(function (event) {
        var arrayCheck = jQuery.inArray(event.which, allowedStrokesArray)
        if(arrayCheck == -1 & (event.which < 47 || event.which > 58) ){
            messagesArray.push("<p>uw gebruikt foutive waarde voor een telefoonnr</p>")
            event.preventDefault();
            sendArrayMessage(messagesArray,messageParagraph)

        }
    })

    // pop up screen from city name check result
    $('body').on("click",formGemeenteRadioButton,function () {

        var CheckedCity =$("#PopUpGemeente input[type='radio']:checked").val()
        formGemeenteInputField.attr("value",CheckedCity);
        gemeentePopUpDiv.css("display","none");

    })



//--------------------------------------------------Functions-------------------------------------//

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
        sendArrayMessage(messagesArray,messageParagraph)

    }
    var getCommuneByPostalCode  = function (data) {
        // when there is just 1 commune for the postal code
        formGemeentePopupList.empty()
        switch (data.length) {
            case 0:
                messagesArray.push("<p>Sorry, uw postcode bestaat niet</p>");
                sendArrayMessage(messagesArray,messageParagraph);
                break;
            case 1:
                var townname = data[0].post_naam.toLowerCase();
                formGemeenteInputField.attr("value",townname);
                break;
                // with more than one city , the pop uw with the list is displayed
            default:
                for (let i = 0; i < data.length; i++) {
                    var cityinput = "<li><input   type='radio' name='gemeentecheck' id='gemeentecheck' value='"+data[i].post_naam.toLowerCase()+"'>"+data[i].post_naam.toLowerCase()+"</li>"
                    formGemeentePopupList.append(cityinput)
                }
                // display the popup
                gemeentePopUpDiv.css("display","flex")
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





