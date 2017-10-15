/*
 eab-revised JS
 */

$( document ).ready(function() {
    $('.alert-header h2').parent().css({"font-size":".7em","padding":"5px 0px 0px 0px", "height":"90px"});
   $('.alert-header h2').css({"font-size":"1.7em","margin-top":"15px"});     

$('.alert-header h2').filter(':contains("Agency Closure")').parent().css({'color': '#fff','background-image':'none','background-color':'#5E700D;'});

$('.alert-header h2').filter(':contains("System Outage")').parent().css({'color': '#fff','background-image':'none','background-color':' #916011;'});

$('.alert-header h2').filter(':contains("Emergency Alert")').parent().css({'color': '#fff','background-image':'none','background-color':' #D13217;'});



});

/*
 * Restricted Content Component JS
 */

;(function($, window, document, undefined) {
    
    $(document).ready(function() {        
        
        $(".restricted-path").each(function(i, e) {
            var elm = $(e),
                pathText = elm.text(),
                parent = elm.parent(),
                restricted = $(".restricted-content", parent);
            
            if( $.trim(pathText) ) {
                $.ajax({
                    type: "POST",
                    url: pathText + ".html",
                    success: function(data, textStatus, xhr) {
                        if(xhr.status === 200) {
                            restricted.show();
                        } else {
                            restricted.remove();
                        }
                    }, error: function() {
                        restricted.remove();
                    }
                });
            } 
        });        
    });    
    
}(jQuery, window, document));
/*
 * Reciprocity Schedule Component JS
 */

;(function($, window, document, undefined) {
    var recSched = $(".reciprocity-schedule"),
        tableInitNum = 0,
        infoBoxes, 
        rsTables,
        vcForm, vcFormSelect, 
        visaFootnotes, countryFootnotes,
        isMultiTable, multiRadio;
    
    $(document).ready(function() {        
        recSched = $(".reciprocity-schedule");
        
        if(recSched.length) {
            
            //not in authoring environment
            if( !$("body").hasClass("cq-wcm-edit") && !$("body").hasClass("cq-wcm-design") ) {

                var selected_index = 0,
                    arrow = $(".arrow-indicator", recSched),
                    default_menu_item = $(".feature-menu li:first-child", recSched),
                    menu_items = $(".feature-menu li", recSched),
                    menu_items_link = $(".feature-menu li a", recSched),
                    height_accumalator = 0,
                    menu_item_heights = $.map(menu_items, function(menu_item) {
                        height_accumalator = height_accumalator + $(menu_item).outerHeight();
                        return height_accumalator;
                    });

                $(".feature-viewport > ul > li", recSched).each(function(){
                    $(this).hide();
                });
                $(".feature-viewport li:first-child", recSched).show();

                // calculation is the difference between the selected item's height and the arrow's height, divided by two
                arrow.css("top", (default_menu_item.outerHeight()  - arrow.outerHeight())/2 + "px");
                arrow.show();                

                // add 0 to the beginning of array
                menu_item_heights.unshift(0);

                menu_items.keyup(function(e) {
                    var code = (e.keyCode ? e.keyCode : e.which),
                        selected_item = $(this),
                        index = selected_item.index(),
                        slides = $(".feature-viewport > ul > li", recSched);

                    if (code === 13) {
                        e.preventDefault();

                        if(selected_index === index) {
                            return false;
                        }

                        selected_index = index;
                        menu_items.removeClass("selected");
                        selected_item.addClass("selected");

                        //animate arrow slider
                        arrow.clearQueue().animate({top : menu_item_heights[index] + (selected_item.outerHeight()  - arrow.outerHeight())/2 }, 500); 

                        slides.each(function() {
                            $(this).hide();  
                        });

                        slides.eq(index).show().focus();
                    }
                });
                
                menu_items.click(function(e) {

                    var selected_item = $(this),
                        index = selected_item.index(),
                        slides = $(".feature-viewport > ul > li", recSched);

                    e.preventDefault();

                    if(selected_index === index) {
                        return false;
                    }

                    selected_index = index;
                    menu_items.removeClass("selected");
                    selected_item.addClass("selected");

                    //animate arrow slider
                    arrow.clearQueue().animate({top : menu_item_heights[index] + (selected_item.outerHeight()  - arrow.outerHeight())/2 }, 500); 

                    slides.each(function() {
                        $(this).hide();  
                    });

                    slides.eq(index).show().focus();
                });



                menu_items_link.click(function(e){
                    e.preventDefault();
                });
                
                /* TODO: Update this for 508
                for(var i = 1; i <= 11; i++) {
                    $(".feature-viewport li#slide-" + i + " a").attr("tabindex", i * 2); 
                }
                */
                
            } else {
                var menu_items = $(".feature-menu li", recSched),
                    slides = $(".feature-viewport > ul > li", recSched);

                //make sure selected slow shows up on page load
                slides.eq($(".feature-menu li.selected", recSched).index()).addClass("selected");

                menu_items.click(function(e) {
                    var menuItem = $(this),
                        index = menuItem.index();
                        
                    if(!menuItem.hasClass("selected")){
                        slides.removeClass("selected")
                            .eq(index)
                            .addClass("selected");
                        menu_items.removeClass("selected");
                        menuItem.addClass("selected");       
                    }
                });
            }
            
            infoBoxes = $(".reciprocity-schedule-shadow", recSched).data("infoboxes").split("|");
            rsTables = $(".tab1 > div > table", recSched);
            isMultiTable = $(".multi-table", recSched).length > 0;
            visaFootnotes = $(".reciprocity-schedule #slide-1 .content.parsys");
            countryFootnotes = $(".tab1 .footnotes", recSched);
            vcForm = $(".vc-form", recSched);
            vcFormSelect = $(".vc-form select", recSched);
            
            if(rsTables.length) {
            
                if(isMultiTable) {
                    multiRadio = $(".multi-radio", vcForm);
                    multiRadio.addClass("show");
                    
                    if($("input[type='radio']:checked", vcForm).val() === "palestinian") {
                        tableInitNum = 1;
                    }
                }
                
                setFormSubmit();

                rsTables.eq(tableInitNum).addClass("show");
                vcForm.removeClass("no-table");
                populateDropDown(tableInitNum);                

                rsTables.each(function() {
                    var rsTable = $(this),
                        tableHeaders = $("th", rsTable).addClass("rs-tooltip-wrap");

                    if(tableHeaders.length === 4) {
                        addToolTips(tableHeaders);                    
                    }
                });

                $("input[type='radio']", vcForm).change(function() {
                    var val = $(this).val();
                    
                    visaFootnotes.removeClass("show");
                    countryFootnotes.removeClass("show");
                    rsTables.removeClass("show");
                    $("tr", rsTables).removeClass("show odd");

                    if(val === "israeli") {
                        rsTables.eq(0).addClass("show");
                        populateDropDown(0);
                    } else if(val === "palestinian") {
                        rsTables.eq(1).addClass("show");
                        populateDropDown(1);
                    }
                });
                
                $(".tab1 .footnotes ol li", recSched).each(function(i) {
                    var liElm = $(this),
                        liId = liElm.attr("id"),
                        currLetter = String.fromCharCode("a".charCodeAt() + i);
                    
                    if(!liId) {                        
                        liElm.attr("id", "fn" + currLetter);
                    }
                });
            }
        }
    }); 
    
    function addToolTips(tableHeaders) {
        for (var i = 0; i < infoBoxes.length; i++) {
            if (infoBoxes[i] !== "") {
                var toolTipStr = "<div class=\"chart-tooltip\ tooltip" + (i + 1) + "\">\
                                    <div class=\"tooltip-inner\">\
                                        <p>" + infoBoxes[i] + "</p>\
                                    </div>\
                                </div>";

                tableHeaders.eq(i).append(toolTipStr);
            }
        }           
    }
    
    function populateDropDown(rsTableNum) {
        var rsTable = rsTables.eq(rsTableNum);
        
        vcFormSelect.empty()
            .append("<option value=\"\">Select a Classification</option><option value=\"all\">All</option>");
        
        $("tr td:first-child", rsTable).each(function() {
            var tdTxt = $(this).text(),
                tdHtml = $(this).clone(),
                optTxt = tdHtml.find("a").remove().end().html();

            vcFormSelect.append("<option value=\"" + tdTxt + "\">" + optTxt + "</option>");
        });
    }
    
    function setFormSubmit() {
        vcForm.submit(function(e) {
            var selectVal = vcFormSelect.val(),
                rsTable = rsTables.eq(0),
                radioVal = $("input[type='radio']:checked", vcForm).val();

            e.preventDefault();

            if(isMultiTable && radioVal === "palestinian") {
                rsTable = rsTables.eq(1);
            }
            
            $("tr", rsTable).removeClass("show odd");

            if(selectVal === "all") {
                $("tr", rsTable).addClass("show").filter(":odd").addClass("odd");
            } else {
                $("tr td:first-child", rsTable).filter(function() {
                    return $(this).text() === selectVal;
                }).parent().addClass("show odd");
            }

            if(selectVal) {
                visaFootnotes.addClass("show");
                countryFootnotes.addClass("show");
            } else {
                visaFootnotes.removeClass("show");
                countryFootnotes.removeClass("show");
            }
        });     
    }
    
}(jQuery, window, document));
/*
 * Twitter hashtag Rail Module Component JS
 */

;(function($, window, document, undefined) {
    
    $(document).ready(function() {        
        $(".feed-target").each(function() {
            var targetElm = this;
           
            twttr.ready(function(twttr) {            
                twttr.widgets.createTimeline(
                    $(targetElm).attr("data-widgetid"),
                    targetElm,
                    {
                        width: "300",
                        height: $(targetElm).data("feed-height")
                    });
            });
       });
    });
    
}(jQuery, window, document));
/*
 * Rail Carousel Component JS
 */

;(function($, window, document, undefined) {
    
    $(document).ready(function() {        
        $(".rail-carousel").each(function() {
            var railCarousel = $(this), 
                slides = $(".rail-carousel-wrap", railCarousel).children().not(".new").length,
                interval;
        
            if( $("body.cq-wcm-edit").length < 1 && slides > 1 ) {
                interval = parseInt( $(".carousel-interval", railCarousel).text() ) || 4000;
                
                railCarousel.jcarousel({
                    list: ".rail-carousel-wrap",
                    items: function() {
                        return this.list().children().not(".new");
                    },
                    wrap: "circular"
                }).jcarouselAutoscroll({
                    autostart: true,
                    interval: interval
                }).on('mouseover', function() {
                    $(this).jcarouselAutoscroll('stop');
                }).on('mouseout', function() {
                    $(this).jcarouselAutoscroll('start');
                });
            }
        });        
    });
    
}(jQuery, window, document));
/*
 * NVC Form Component JS
 */

;(function($, window, document, undefined) {
    var datepickerArgs = {
        buttonImage: "/etc/designs/travel/images_global/calendar.gif",
        changeMonth: true,
        changeYear: true,
        maxDate: 0,
        showOn: "both",
        yearRange: "1900"
    },
    duration = 400,
    extraFileInputs = [],
    skipCaptcha = true;
    
    $(document).ready(function() {        
        $(".nvc-form-wrap .dob-picker").datepicker(datepickerArgs);
        $(".nvc-form-wrap .reset-form").click(function(e) {
            var resetLink = $(this);
            
            e.preventDefault();
            resetLink.closest("form")[0].reset();
            $.each(extraFileInputs, function(i, val) {
                val.remove();
            });
            $(".add-file-btn", resetLink.closest("form")).show();
        });
        
        $(".nvc-form-wrap .inquirer").change(function() {
            var selectElm = $(this);
            
            selectElm.siblings("fieldset").hide(duration);
            if(selectElm.val() === "Attorney of Record") {
                selectElm.siblings(".aor-name-wrap").show(duration);
            } else if(selectElm.val() === "Other") {
                selectElm.siblings(".inquirer-name-wrap").show(duration);
            }
        });
        
        $(".nvc-form-wrap .question").change(function() {
            var selectElm = $(this),
                parentForm = selectElm.closest("form"),
                attachmentWrap = $(".attachments-wrap", parentForm),
                selectVal = selectElm.val();
            
            if( selectVal.indexOf("Change in status") > -1 ) {
                attachmentWrap.show(duration);
            } else {
                attachmentWrap.hide(duration);
            }
        });
        
        $(".nvc-form-wrap .add-file-btn").click(function(e) {
            var addFiles = $(this),
                fileTypes = addFiles.closest(".nvc-form-wrap").data("file-types"),
                maxAttachments = addFiles.closest(".nvc-form-wrap").data("maxattachments"),
                attachmentWrap = addFiles.siblings(".file-wrap"),
                attachmentNum = attachmentWrap.children("input[type='file']").length,
                newFileInput;
                
            e.preventDefault();
            if(attachmentNum < maxAttachments) {
                newFileInput = $("<input type=\"file\" name=\"file\" accept=\"" + fileTypes + "\" />");
                extraFileInputs.push(newFileInput);
                attachmentWrap.append(newFileInput);
                if(attachmentNum === maxAttachments - 1) {
                    addFiles.hide();
                }
            }
        });
        
        if( $(".nvc-form-wrap .captcha-wrap").length && typeof Recaptcha !== 'undefined' ) {
            skipCaptcha = false;
            Recaptcha.create(
                $(".nvc-form-wrap").data("public-key"),
                "nvc-captcha",
                {theme: "white"}
            );
        }
        
        $(".nvc-form-wrap .success-back").click(function(){
            window.location.reload();
        });
        
        $(".nvc-form-wrap .error-back").click(function() {
            var errorBackBtn = $(this),
                errorWrap = errorBackBtn.parent();
            
            errorWrap.hide();
            errorWrap.siblings("form").show();
        });
        
        $("form.nvc-form").submit(function(e) {
            var formElm = $(this),
                parentElm = formElm.parent(),
                validationElm = $(".validation", formElm),
                submitBtn = $(".button-wrap .form-btn"),
                validationStr, options;
            
            e.preventDefault();
            submitBtn.prop("disabled", true);
            formElm.addClass("wait");            
            options = {
                dataType: "json",
                success: function(data) {
                    if(!skipCaptcha) {
                        Recaptcha.reload_internal("t");
                    }
                    $("input, select, #recaptcha_area", formElm).removeClass("error");
                    if(data.status === "success") {
                        $(formElm).hide();
                        $(".success-wrap", parentElm).show();
                        window.scrollTo(0, 0);
                    } else if(data.status === "validation errors") {
                        validationStr = data.validation.join("<br>");
                        validationElm.html(validationStr);
                        $.each(data.inputs, function(i, val) {
                            if(val === "recaptcha_area") {
                                $("#recaptcha_area", formElm).addClass("error");
                            } else if(val === "file-wrap") {
                                $(".file-wrap", formElm).addClass("error");
                            } else {
                                $("[name='" + val + "']", formElm).addClass("error");
                            }   
                        });
                        validationElm.show();
                        window.scrollTo(0, 0);
                    } else {
                        $(formElm).hide();
                        $(".error-wrap", parentElm).show();
                        window.scrollTo(0, 0);
                    }
                    submitBtn.prop("disabled", false);
                    formElm.removeClass("wait");
                },
                error: function(e) {
                    $(formElm).hide();
                    $(".error-wrap", parentElm).show();
                    window.scrollTo(0, 0);
                    submitBtn.prop("disabled", false);
                    formElm.removeClass("wait");
                }
            };
            
            formElm.ajaxSubmit(options);
        });
    });
    
}(jQuery, window, document));
/*! jQuery v1.8.3 jquery.com | jquery.org/license */
(function(e,t){function _(e){var t=M[e]={};return v.each(e.split(y),function(e,n){t[n]=!0}),t}function H(e,n,r){if(r===t&&e.nodeType===1){var i="data-"+n.replace(P,"-$1").toLowerCase();r=e.getAttribute(i);if(typeof r=="string"){try{r=r==="true"?!0:r==="false"?!1:r==="null"?null:+r+""===r?+r:D.test(r)?v.parseJSON(r):r}catch(s){}v.data(e,n,r)}else r=t}return r}function B(e){var t;for(t in e){if(t==="data"&&v.isEmptyObject(e[t]))continue;if(t!=="toJSON")return!1}return!0}function et(){return!1}function tt(){return!0}function ut(e){return!e||!e.parentNode||e.parentNode.nodeType===11}function at(e,t){do e=e[t];while(e&&e.nodeType!==1);return e}function ft(e,t,n){t=t||0;if(v.isFunction(t))return v.grep(e,function(e,r){var i=!!t.call(e,r,e);return i===n});if(t.nodeType)return v.grep(e,function(e,r){return e===t===n});if(typeof t=="string"){var r=v.grep(e,function(e){return e.nodeType===1});if(it.test(t))return v.filter(t,r,!n);t=v.filter(t,r)}return v.grep(e,function(e,r){return v.inArray(e,t)>=0===n})}function lt(e){var t=ct.split("|"),n=e.createDocumentFragment();if(n.createElement)while(t.length)n.createElement(t.pop());return n}function Lt(e,t){return e.getElementsByTagName(t)[0]||e.appendChild(e.ownerDocument.createElement(t))}function At(e,t){if(t.nodeType!==1||!v.hasData(e))return;var n,r,i,s=v._data(e),o=v._data(t,s),u=s.events;if(u){delete o.handle,o.events={};for(n in u)for(r=0,i=u[n].length;r<i;r++)v.event.add(t,n,u[n][r])}o.data&&(o.data=v.extend({},o.data))}function Ot(e,t){var n;if(t.nodeType!==1)return;t.clearAttributes&&t.clearAttributes(),t.mergeAttributes&&t.mergeAttributes(e),n=t.nodeName.toLowerCase(),n==="object"?(t.parentNode&&(t.outerHTML=e.outerHTML),v.support.html5Clone&&e.innerHTML&&!v.trim(t.innerHTML)&&(t.innerHTML=e.innerHTML)):n==="input"&&Et.test(e.type)?(t.defaultChecked=t.checked=e.checked,t.value!==e.value&&(t.value=e.value)):n==="option"?t.selected=e.defaultSelected:n==="input"||n==="textarea"?t.defaultValue=e.defaultValue:n==="script"&&t.text!==e.text&&(t.text=e.text),t.removeAttribute(v.expando)}function Mt(e){return typeof e.getElementsByTagName!="undefined"?e.getElementsByTagName("*"):typeof e.querySelectorAll!="undefined"?e.querySelectorAll("*"):[]}function _t(e){Et.test(e.type)&&(e.defaultChecked=e.checked)}function Qt(e,t){if(t in e)return t;var n=t.charAt(0).toUpperCase()+t.slice(1),r=t,i=Jt.length;while(i--){t=Jt[i]+n;if(t in e)return t}return r}function Gt(e,t){return e=t||e,v.css(e,"display")==="none"||!v.contains(e.ownerDocument,e)}function Yt(e,t){var n,r,i=[],s=0,o=e.length;for(;s<o;s++){n=e[s];if(!n.style)continue;i[s]=v._data(n,"olddisplay"),t?(!i[s]&&n.style.display==="none"&&(n.style.display=""),n.style.display===""&&Gt(n)&&(i[s]=v._data(n,"olddisplay",nn(n.nodeName)))):(r=Dt(n,"display"),!i[s]&&r!=="none"&&v._data(n,"olddisplay",r))}for(s=0;s<o;s++){n=e[s];if(!n.style)continue;if(!t||n.style.display==="none"||n.style.display==="")n.style.display=t?i[s]||"":"none"}return e}function Zt(e,t,n){var r=Rt.exec(t);return r?Math.max(0,r[1]-(n||0))+(r[2]||"px"):t}function en(e,t,n,r){var i=n===(r?"border":"content")?4:t==="width"?1:0,s=0;for(;i<4;i+=2)n==="margin"&&(s+=v.css(e,n+$t[i],!0)),r?(n==="content"&&(s-=parseFloat(Dt(e,"padding"+$t[i]))||0),n!=="margin"&&(s-=parseFloat(Dt(e,"border"+$t[i]+"Width"))||0)):(s+=parseFloat(Dt(e,"padding"+$t[i]))||0,n!=="padding"&&(s+=parseFloat(Dt(e,"border"+$t[i]+"Width"))||0));return s}function tn(e,t,n){var r=t==="width"?e.offsetWidth:e.offsetHeight,i=!0,s=v.support.boxSizing&&v.css(e,"boxSizing")==="border-box";if(r<=0||r==null){r=Dt(e,t);if(r<0||r==null)r=e.style[t];if(Ut.test(r))return r;i=s&&(v.support.boxSizingReliable||r===e.style[t]),r=parseFloat(r)||0}return r+en(e,t,n||(s?"border":"content"),i)+"px"}function nn(e){if(Wt[e])return Wt[e];var t=v("<"+e+">").appendTo(i.body),n=t.css("display");t.remove();if(n==="none"||n===""){Pt=i.body.appendChild(Pt||v.extend(i.createElement("iframe"),{frameBorder:0,width:0,height:0}));if(!Ht||!Pt.createElement)Ht=(Pt.contentWindow||Pt.contentDocument).document,Ht.write("<!doctype html><html><body>"),Ht.close();t=Ht.body.appendChild(Ht.createElement(e)),n=Dt(t,"display"),i.body.removeChild(Pt)}return Wt[e]=n,n}function fn(e,t,n,r){var i;if(v.isArray(t))v.each(t,function(t,i){n||sn.test(e)?r(e,i):fn(e+"["+(typeof i=="object"?t:"")+"]",i,n,r)});else if(!n&&v.type(t)==="object")for(i in t)fn(e+"["+i+"]",t[i],n,r);else r(e,t)}function Cn(e){return function(t,n){typeof t!="string"&&(n=t,t="*");var r,i,s,o=t.toLowerCase().split(y),u=0,a=o.length;if(v.isFunction(n))for(;u<a;u++)r=o[u],s=/^\+/.test(r),s&&(r=r.substr(1)||"*"),i=e[r]=e[r]||[],i[s?"unshift":"push"](n)}}function kn(e,n,r,i,s,o){s=s||n.dataTypes[0],o=o||{},o[s]=!0;var u,a=e[s],f=0,l=a?a.length:0,c=e===Sn;for(;f<l&&(c||!u);f++)u=a[f](n,r,i),typeof u=="string"&&(!c||o[u]?u=t:(n.dataTypes.unshift(u),u=kn(e,n,r,i,u,o)));return(c||!u)&&!o["*"]&&(u=kn(e,n,r,i,"*",o)),u}function Ln(e,n){var r,i,s=v.ajaxSettings.flatOptions||{};for(r in n)n[r]!==t&&((s[r]?e:i||(i={}))[r]=n[r]);i&&v.extend(!0,e,i)}function An(e,n,r){var i,s,o,u,a=e.contents,f=e.dataTypes,l=e.responseFields;for(s in l)s in r&&(n[l[s]]=r[s]);while(f[0]==="*")f.shift(),i===t&&(i=e.mimeType||n.getResponseHeader("content-type"));if(i)for(s in a)if(a[s]&&a[s].test(i)){f.unshift(s);break}if(f[0]in r)o=f[0];else{for(s in r){if(!f[0]||e.converters[s+" "+f[0]]){o=s;break}u||(u=s)}o=o||u}if(o)return o!==f[0]&&f.unshift(o),r[o]}function On(e,t){var n,r,i,s,o=e.dataTypes.slice(),u=o[0],a={},f=0;e.dataFilter&&(t=e.dataFilter(t,e.dataType));if(o[1])for(n in e.converters)a[n.toLowerCase()]=e.converters[n];for(;i=o[++f];)if(i!=="*"){if(u!=="*"&&u!==i){n=a[u+" "+i]||a["* "+i];if(!n)for(r in a){s=r.split(" ");if(s[1]===i){n=a[u+" "+s[0]]||a["* "+s[0]];if(n){n===!0?n=a[r]:a[r]!==!0&&(i=s[0],o.splice(f--,0,i));break}}}if(n!==!0)if(n&&e["throws"])t=n(t);else try{t=n(t)}catch(l){return{state:"parsererror",error:n?l:"No conversion from "+u+" to "+i}}}u=i}return{state:"success",data:t}}function Fn(){try{return new e.XMLHttpRequest}catch(t){}}function In(){try{return new e.ActiveXObject("Microsoft.XMLHTTP")}catch(t){}}function $n(){return setTimeout(function(){qn=t},0),qn=v.now()}function Jn(e,t){v.each(t,function(t,n){var r=(Vn[t]||[]).concat(Vn["*"]),i=0,s=r.length;for(;i<s;i++)if(r[i].call(e,t,n))return})}function Kn(e,t,n){var r,i=0,s=0,o=Xn.length,u=v.Deferred().always(function(){delete a.elem}),a=function(){var t=qn||$n(),n=Math.max(0,f.startTime+f.duration-t),r=n/f.duration||0,i=1-r,s=0,o=f.tweens.length;for(;s<o;s++)f.tweens[s].run(i);return u.notifyWith(e,[f,i,n]),i<1&&o?n:(u.resolveWith(e,[f]),!1)},f=u.promise({elem:e,props:v.extend({},t),opts:v.extend(!0,{specialEasing:{}},n),originalProperties:t,originalOptions:n,startTime:qn||$n(),duration:n.duration,tweens:[],createTween:function(t,n,r){var i=v.Tween(e,f.opts,t,n,f.opts.specialEasing[t]||f.opts.easing);return f.tweens.push(i),i},stop:function(t){var n=0,r=t?f.tweens.length:0;for(;n<r;n++)f.tweens[n].run(1);return t?u.resolveWith(e,[f,t]):u.rejectWith(e,[f,t]),this}}),l=f.props;Qn(l,f.opts.specialEasing);for(;i<o;i++){r=Xn[i].call(f,e,l,f.opts);if(r)return r}return Jn(f,l),v.isFunction(f.opts.start)&&f.opts.start.call(e,f),v.fx.timer(v.extend(a,{anim:f,queue:f.opts.queue,elem:e})),f.progress(f.opts.progress).done(f.opts.done,f.opts.complete).fail(f.opts.fail).always(f.opts.always)}function Qn(e,t){var n,r,i,s,o;for(n in e){r=v.camelCase(n),i=t[r],s=e[n],v.isArray(s)&&(i=s[1],s=e[n]=s[0]),n!==r&&(e[r]=s,delete e[n]),o=v.cssHooks[r];if(o&&"expand"in o){s=o.expand(s),delete e[r];for(n in s)n in e||(e[n]=s[n],t[n]=i)}else t[r]=i}}function Gn(e,t,n){var r,i,s,o,u,a,f,l,c,h=this,p=e.style,d={},m=[],g=e.nodeType&&Gt(e);n.queue||(l=v._queueHooks(e,"fx"),l.unqueued==null&&(l.unqueued=0,c=l.empty.fire,l.empty.fire=function(){l.unqueued||c()}),l.unqueued++,h.always(function(){h.always(function(){l.unqueued--,v.queue(e,"fx").length||l.empty.fire()})})),e.nodeType===1&&("height"in t||"width"in t)&&(n.overflow=[p.overflow,p.overflowX,p.overflowY],v.css(e,"display")==="inline"&&v.css(e,"float")==="none"&&(!v.support.inlineBlockNeedsLayout||nn(e.nodeName)==="inline"?p.display="inline-block":p.zoom=1)),n.overflow&&(p.overflow="hidden",v.support.shrinkWrapBlocks||h.done(function(){p.overflow=n.overflow[0],p.overflowX=n.overflow[1],p.overflowY=n.overflow[2]}));for(r in t){s=t[r];if(Un.exec(s)){delete t[r],a=a||s==="toggle";if(s===(g?"hide":"show"))continue;m.push(r)}}o=m.length;if(o){u=v._data(e,"fxshow")||v._data(e,"fxshow",{}),"hidden"in u&&(g=u.hidden),a&&(u.hidden=!g),g?v(e).show():h.done(function(){v(e).hide()}),h.done(function(){var t;v.removeData(e,"fxshow",!0);for(t in d)v.style(e,t,d[t])});for(r=0;r<o;r++)i=m[r],f=h.createTween(i,g?u[i]:0),d[i]=u[i]||v.style(e,i),i in u||(u[i]=f.start,g&&(f.end=f.start,f.start=i==="width"||i==="height"?1:0))}}function Yn(e,t,n,r,i){return new Yn.prototype.init(e,t,n,r,i)}function Zn(e,t){var n,r={height:e},i=0;t=t?1:0;for(;i<4;i+=2-t)n=$t[i],r["margin"+n]=r["padding"+n]=e;return t&&(r.opacity=r.width=e),r}function tr(e){return v.isWindow(e)?e:e.nodeType===9?e.defaultView||e.parentWindow:!1}var n,r,i=e.document,s=e.location,o=e.navigator,u=e.jQuery,a=e.$,f=Array.prototype.push,l=Array.prototype.slice,c=Array.prototype.indexOf,h=Object.prototype.toString,p=Object.prototype.hasOwnProperty,d=String.prototype.trim,v=function(e,t){return new v.fn.init(e,t,n)},m=/[\-+]?(?:\d*\.|)\d+(?:[eE][\-+]?\d+|)/.source,g=/\S/,y=/\s+/,b=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,w=/^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,E=/^<(\w+)\s*\/?>(?:<\/\1>|)$/,S=/^[\],:{}\s]*$/,x=/(?:^|:|,)(?:\s*\[)+/g,T=/\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,N=/"[^"\\\r\n]*"|true|false|null|-?(?:\d\d*\.|)\d+(?:[eE][\-+]?\d+|)/g,C=/^-ms-/,k=/-([\da-z])/gi,L=function(e,t){return(t+"").toUpperCase()},A=function(){i.addEventListener?(i.removeEventListener("DOMContentLoaded",A,!1),v.ready()):i.readyState==="complete"&&(i.detachEvent("onreadystatechange",A),v.ready())},O={};v.fn=v.prototype={constructor:v,init:function(e,n,r){var s,o,u,a;if(!e)return this;if(e.nodeType)return this.context=this[0]=e,this.length=1,this;if(typeof e=="string"){e.charAt(0)==="<"&&e.charAt(e.length-1)===">"&&e.length>=3?s=[null,e,null]:s=w.exec(e);if(s&&(s[1]||!n)){if(s[1])return n=n instanceof v?n[0]:n,a=n&&n.nodeType?n.ownerDocument||n:i,e=v.parseHTML(s[1],a,!0),E.test(s[1])&&v.isPlainObject(n)&&this.attr.call(e,n,!0),v.merge(this,e);o=i.getElementById(s[2]);if(o&&o.parentNode){if(o.id!==s[2])return r.find(e);this.length=1,this[0]=o}return this.context=i,this.selector=e,this}return!n||n.jquery?(n||r).find(e):this.constructor(n).find(e)}return v.isFunction(e)?r.ready(e):(e.selector!==t&&(this.selector=e.selector,this.context=e.context),v.makeArray(e,this))},selector:"",jquery:"1.8.3",length:0,size:function(){return this.length},toArray:function(){return l.call(this)},get:function(e){return e==null?this.toArray():e<0?this[this.length+e]:this[e]},pushStack:function(e,t,n){var r=v.merge(this.constructor(),e);return r.prevObject=this,r.context=this.context,t==="find"?r.selector=this.selector+(this.selector?" ":"")+n:t&&(r.selector=this.selector+"."+t+"("+n+")"),r},each:function(e,t){return v.each(this,e,t)},ready:function(e){return v.ready.promise().done(e),this},eq:function(e){return e=+e,e===-1?this.slice(e):this.slice(e,e+1)},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},slice:function(){return this.pushStack(l.apply(this,arguments),"slice",l.call(arguments).join(","))},map:function(e){return this.pushStack(v.map(this,function(t,n){return e.call(t,n,t)}))},end:function(){return this.prevObject||this.constructor(null)},push:f,sort:[].sort,splice:[].splice},v.fn.init.prototype=v.fn,v.extend=v.fn.extend=function(){var e,n,r,i,s,o,u=arguments[0]||{},a=1,f=arguments.length,l=!1;typeof u=="boolean"&&(l=u,u=arguments[1]||{},a=2),typeof u!="object"&&!v.isFunction(u)&&(u={}),f===a&&(u=this,--a);for(;a<f;a++)if((e=arguments[a])!=null)for(n in e){r=u[n],i=e[n];if(u===i)continue;l&&i&&(v.isPlainObject(i)||(s=v.isArray(i)))?(s?(s=!1,o=r&&v.isArray(r)?r:[]):o=r&&v.isPlainObject(r)?r:{},u[n]=v.extend(l,o,i)):i!==t&&(u[n]=i)}return u},v.extend({noConflict:function(t){return e.$===v&&(e.$=a),t&&e.jQuery===v&&(e.jQuery=u),v},isReady:!1,readyWait:1,holdReady:function(e){e?v.readyWait++:v.ready(!0)},ready:function(e){if(e===!0?--v.readyWait:v.isReady)return;if(!i.body)return setTimeout(v.ready,1);v.isReady=!0;if(e!==!0&&--v.readyWait>0)return;r.resolveWith(i,[v]),v.fn.trigger&&v(i).trigger("ready").off("ready")},isFunction:function(e){return v.type(e)==="function"},isArray:Array.isArray||function(e){return v.type(e)==="array"},isWindow:function(e){return e!=null&&e==e.window},isNumeric:function(e){return!isNaN(parseFloat(e))&&isFinite(e)},type:function(e){return e==null?String(e):O[h.call(e)]||"object"},isPlainObject:function(e){if(!e||v.type(e)!=="object"||e.nodeType||v.isWindow(e))return!1;try{if(e.constructor&&!p.call(e,"constructor")&&!p.call(e.constructor.prototype,"isPrototypeOf"))return!1}catch(n){return!1}var r;for(r in e);return r===t||p.call(e,r)},isEmptyObject:function(e){var t;for(t in e)return!1;return!0},error:function(e){throw new Error(e)},parseHTML:function(e,t,n){var r;return!e||typeof e!="string"?null:(typeof t=="boolean"&&(n=t,t=0),t=t||i,(r=E.exec(e))?[t.createElement(r[1])]:(r=v.buildFragment([e],t,n?null:[]),v.merge([],(r.cacheable?v.clone(r.fragment):r.fragment).childNodes)))},parseJSON:function(t){if(!t||typeof t!="string")return null;t=v.trim(t);if(e.JSON&&e.JSON.parse)return e.JSON.parse(t);if(S.test(t.replace(T,"@").replace(N,"]").replace(x,"")))return(new Function("return "+t))();v.error("Invalid JSON: "+t)},parseXML:function(n){var r,i;if(!n||typeof n!="string")return null;try{e.DOMParser?(i=new DOMParser,r=i.parseFromString(n,"text/xml")):(r=new ActiveXObject("Microsoft.XMLDOM"),r.async="false",r.loadXML(n))}catch(s){r=t}return(!r||!r.documentElement||r.getElementsByTagName("parsererror").length)&&v.error("Invalid XML: "+n),r},noop:function(){},globalEval:function(t){t&&g.test(t)&&(e.execScript||function(t){e.eval.call(e,t)})(t)},camelCase:function(e){return e.replace(C,"ms-").replace(k,L)},nodeName:function(e,t){return e.nodeName&&e.nodeName.toLowerCase()===t.toLowerCase()},each:function(e,n,r){var i,s=0,o=e.length,u=o===t||v.isFunction(e);if(r){if(u){for(i in e)if(n.apply(e[i],r)===!1)break}else for(;s<o;)if(n.apply(e[s++],r)===!1)break}else if(u){for(i in e)if(n.call(e[i],i,e[i])===!1)break}else for(;s<o;)if(n.call(e[s],s,e[s++])===!1)break;return e},trim:d&&!d.call("\ufeff\u00a0")?function(e){return e==null?"":d.call(e)}:function(e){return e==null?"":(e+"").replace(b,"")},makeArray:function(e,t){var n,r=t||[];return e!=null&&(n=v.type(e),e.length==null||n==="string"||n==="function"||n==="regexp"||v.isWindow(e)?f.call(r,e):v.merge(r,e)),r},inArray:function(e,t,n){var r;if(t){if(c)return c.call(t,e,n);r=t.length,n=n?n<0?Math.max(0,r+n):n:0;for(;n<r;n++)if(n in t&&t[n]===e)return n}return-1},merge:function(e,n){var r=n.length,i=e.length,s=0;if(typeof r=="number")for(;s<r;s++)e[i++]=n[s];else while(n[s]!==t)e[i++]=n[s++];return e.length=i,e},grep:function(e,t,n){var r,i=[],s=0,o=e.length;n=!!n;for(;s<o;s++)r=!!t(e[s],s),n!==r&&i.push(e[s]);return i},map:function(e,n,r){var i,s,o=[],u=0,a=e.length,f=e instanceof v||a!==t&&typeof a=="number"&&(a>0&&e[0]&&e[a-1]||a===0||v.isArray(e));if(f)for(;u<a;u++)i=n(e[u],u,r),i!=null&&(o[o.length]=i);else for(s in e)i=n(e[s],s,r),i!=null&&(o[o.length]=i);return o.concat.apply([],o)},guid:1,proxy:function(e,n){var r,i,s;return typeof n=="string"&&(r=e[n],n=e,e=r),v.isFunction(e)?(i=l.call(arguments,2),s=function(){return e.apply(n,i.concat(l.call(arguments)))},s.guid=e.guid=e.guid||v.guid++,s):t},access:function(e,n,r,i,s,o,u){var a,f=r==null,l=0,c=e.length;if(r&&typeof r=="object"){for(l in r)v.access(e,n,l,r[l],1,o,i);s=1}else if(i!==t){a=u===t&&v.isFunction(i),f&&(a?(a=n,n=function(e,t,n){return a.call(v(e),n)}):(n.call(e,i),n=null));if(n)for(;l<c;l++)n(e[l],r,a?i.call(e[l],l,n(e[l],r)):i,u);s=1}return s?e:f?n.call(e):c?n(e[0],r):o},now:function(){return(new Date).getTime()}}),v.ready.promise=function(t){if(!r){r=v.Deferred();if(i.readyState==="complete")setTimeout(v.ready,1);else if(i.addEventListener)i.addEventListener("DOMContentLoaded",A,!1),e.addEventListener("load",v.ready,!1);else{i.attachEvent("onreadystatechange",A),e.attachEvent("onload",v.ready);var n=!1;try{n=e.frameElement==null&&i.documentElement}catch(s){}n&&n.doScroll&&function o(){if(!v.isReady){try{n.doScroll("left")}catch(e){return setTimeout(o,50)}v.ready()}}()}}return r.promise(t)},v.each("Boolean Number String Function Array Date RegExp Object".split(" "),function(e,t){O["[object "+t+"]"]=t.toLowerCase()}),n=v(i);var M={};v.Callbacks=function(e){e=typeof e=="string"?M[e]||_(e):v.extend({},e);var n,r,i,s,o,u,a=[],f=!e.once&&[],l=function(t){n=e.memory&&t,r=!0,u=s||0,s=0,o=a.length,i=!0;for(;a&&u<o;u++)if(a[u].apply(t[0],t[1])===!1&&e.stopOnFalse){n=!1;break}i=!1,a&&(f?f.length&&l(f.shift()):n?a=[]:c.disable())},c={add:function(){if(a){var t=a.length;(function r(t){v.each(t,function(t,n){var i=v.type(n);i==="function"?(!e.unique||!c.has(n))&&a.push(n):n&&n.length&&i!=="string"&&r(n)})})(arguments),i?o=a.length:n&&(s=t,l(n))}return this},remove:function(){return a&&v.each(arguments,function(e,t){var n;while((n=v.inArray(t,a,n))>-1)a.splice(n,1),i&&(n<=o&&o--,n<=u&&u--)}),this},has:function(e){return v.inArray(e,a)>-1},empty:function(){return a=[],this},disable:function(){return a=f=n=t,this},disabled:function(){return!a},lock:function(){return f=t,n||c.disable(),this},locked:function(){return!f},fireWith:function(e,t){return t=t||[],t=[e,t.slice?t.slice():t],a&&(!r||f)&&(i?f.push(t):l(t)),this},fire:function(){return c.fireWith(this,arguments),this},fired:function(){return!!r}};return c},v.extend({Deferred:function(e){var t=[["resolve","done",v.Callbacks("once memory"),"resolved"],["reject","fail",v.Callbacks("once memory"),"rejected"],["notify","progress",v.Callbacks("memory")]],n="pending",r={state:function(){return n},always:function(){return i.done(arguments).fail(arguments),this},then:function(){var e=arguments;return v.Deferred(function(n){v.each(t,function(t,r){var s=r[0],o=e[t];i[r[1]](v.isFunction(o)?function(){var e=o.apply(this,arguments);e&&v.isFunction(e.promise)?e.promise().done(n.resolve).fail(n.reject).progress(n.notify):n[s+"With"](this===i?n:this,[e])}:n[s])}),e=null}).promise()},promise:function(e){return e!=null?v.extend(e,r):r}},i={};return r.pipe=r.then,v.each(t,function(e,s){var o=s[2],u=s[3];r[s[1]]=o.add,u&&o.add(function(){n=u},t[e^1][2].disable,t[2][2].lock),i[s[0]]=o.fire,i[s[0]+"With"]=o.fireWith}),r.promise(i),e&&e.call(i,i),i},when:function(e){var t=0,n=l.call(arguments),r=n.length,i=r!==1||e&&v.isFunction(e.promise)?r:0,s=i===1?e:v.Deferred(),o=function(e,t,n){return function(r){t[e]=this,n[e]=arguments.length>1?l.call(arguments):r,n===u?s.notifyWith(t,n):--i||s.resolveWith(t,n)}},u,a,f;if(r>1){u=new Array(r),a=new Array(r),f=new Array(r);for(;t<r;t++)n[t]&&v.isFunction(n[t].promise)?n[t].promise().done(o(t,f,n)).fail(s.reject).progress(o(t,a,u)):--i}return i||s.resolveWith(f,n),s.promise()}}),v.support=function(){var t,n,r,s,o,u,a,f,l,c,h,p=i.createElement("div");p.setAttribute("className","t"),p.innerHTML="  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>",n=p.getElementsByTagName("*"),r=p.getElementsByTagName("a")[0];if(!n||!r||!n.length)return{};s=i.createElement("select"),o=s.appendChild(i.createElement("option")),u=p.getElementsByTagName("input")[0],r.style.cssText="top:1px;float:left;opacity:.5",t={leadingWhitespace:p.firstChild.nodeType===3,tbody:!p.getElementsByTagName("tbody").length,htmlSerialize:!!p.getElementsByTagName("link").length,style:/top/.test(r.getAttribute("style")),hrefNormalized:r.getAttribute("href")==="/a",opacity:/^0.5/.test(r.style.opacity),cssFloat:!!r.style.cssFloat,checkOn:u.value==="on",optSelected:o.selected,getSetAttribute:p.className!=="t",enctype:!!i.createElement("form").enctype,html5Clone:i.createElement("nav").cloneNode(!0).outerHTML!=="<:nav></:nav>",boxModel:i.compatMode==="CSS1Compat",submitBubbles:!0,changeBubbles:!0,focusinBubbles:!1,deleteExpando:!0,noCloneEvent:!0,inlineBlockNeedsLayout:!1,shrinkWrapBlocks:!1,reliableMarginRight:!0,boxSizingReliable:!0,pixelPosition:!1},u.checked=!0,t.noCloneChecked=u.cloneNode(!0).checked,s.disabled=!0,t.optDisabled=!o.disabled;try{delete p.test}catch(d){t.deleteExpando=!1}!p.addEventListener&&p.attachEvent&&p.fireEvent&&(p.attachEvent("onclick",h=function(){t.noCloneEvent=!1}),p.cloneNode(!0).fireEvent("onclick"),p.detachEvent("onclick",h)),u=i.createElement("input"),u.value="t",u.setAttribute("type","radio"),t.radioValue=u.value==="t",u.setAttribute("checked","checked"),u.setAttribute("name","t"),p.appendChild(u),a=i.createDocumentFragment(),a.appendChild(p.lastChild),t.checkClone=a.cloneNode(!0).cloneNode(!0).lastChild.checked,t.appendChecked=u.checked,a.removeChild(u),a.appendChild(p);if(p.attachEvent)for(l in{submit:!0,change:!0,focusin:!0})f="on"+l,c=f in p,c||(p.setAttribute(f,"return;"),c=typeof p[f]=="function"),t[l+"Bubbles"]=c;return v(function(){var n,r,s,o,u="padding:0;margin:0;border:0;display:block;overflow:hidden;",a=i.getElementsByTagName("body")[0];if(!a)return;n=i.createElement("div"),n.style.cssText="visibility:hidden;border:0;width:0;height:0;position:static;top:0;margin-top:1px",a.insertBefore(n,a.firstChild),r=i.createElement("div"),n.appendChild(r),r.innerHTML="<table><tr><td></td><td>t</td></tr></table>",s=r.getElementsByTagName("td"),s[0].style.cssText="padding:0;margin:0;border:0;display:none",c=s[0].offsetHeight===0,s[0].style.display="",s[1].style.display="none",t.reliableHiddenOffsets=c&&s[0].offsetHeight===0,r.innerHTML="",r.style.cssText="box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;",t.boxSizing=r.offsetWidth===4,t.doesNotIncludeMarginInBodyOffset=a.offsetTop!==1,e.getComputedStyle&&(t.pixelPosition=(e.getComputedStyle(r,null)||{}).top!=="1%",t.boxSizingReliable=(e.getComputedStyle(r,null)||{width:"4px"}).width==="4px",o=i.createElement("div"),o.style.cssText=r.style.cssText=u,o.style.marginRight=o.style.width="0",r.style.width="1px",r.appendChild(o),t.reliableMarginRight=!parseFloat((e.getComputedStyle(o,null)||{}).marginRight)),typeof r.style.zoom!="undefined"&&(r.innerHTML="",r.style.cssText=u+"width:1px;padding:1px;display:inline;zoom:1",t.inlineBlockNeedsLayout=r.offsetWidth===3,r.style.display="block",r.style.overflow="visible",r.innerHTML="<div></div>",r.firstChild.style.width="5px",t.shrinkWrapBlocks=r.offsetWidth!==3,n.style.zoom=1),a.removeChild(n),n=r=s=o=null}),a.removeChild(p),n=r=s=o=u=a=p=null,t}();var D=/(?:\{[\s\S]*\}|\[[\s\S]*\])$/,P=/([A-Z])/g;v.extend({cache:{},deletedIds:[],uuid:0,expando:"jQuery"+(v.fn.jquery+Math.random()).replace(/\D/g,""),noData:{embed:!0,object:"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",applet:!0},hasData:function(e){return e=e.nodeType?v.cache[e[v.expando]]:e[v.expando],!!e&&!B(e)},data:function(e,n,r,i){if(!v.acceptData(e))return;var s,o,u=v.expando,a=typeof n=="string",f=e.nodeType,l=f?v.cache:e,c=f?e[u]:e[u]&&u;if((!c||!l[c]||!i&&!l[c].data)&&a&&r===t)return;c||(f?e[u]=c=v.deletedIds.pop()||v.guid++:c=u),l[c]||(l[c]={},f||(l[c].toJSON=v.noop));if(typeof n=="object"||typeof n=="function")i?l[c]=v.extend(l[c],n):l[c].data=v.extend(l[c].data,n);return s=l[c],i||(s.data||(s.data={}),s=s.data),r!==t&&(s[v.camelCase(n)]=r),a?(o=s[n],o==null&&(o=s[v.camelCase(n)])):o=s,o},removeData:function(e,t,n){if(!v.acceptData(e))return;var r,i,s,o=e.nodeType,u=o?v.cache:e,a=o?e[v.expando]:v.expando;if(!u[a])return;if(t){r=n?u[a]:u[a].data;if(r){v.isArray(t)||(t in r?t=[t]:(t=v.camelCase(t),t in r?t=[t]:t=t.split(" ")));for(i=0,s=t.length;i<s;i++)delete r[t[i]];if(!(n?B:v.isEmptyObject)(r))return}}if(!n){delete u[a].data;if(!B(u[a]))return}o?v.cleanData([e],!0):v.support.deleteExpando||u!=u.window?delete u[a]:u[a]=null},_data:function(e,t,n){return v.data(e,t,n,!0)},acceptData:function(e){var t=e.nodeName&&v.noData[e.nodeName.toLowerCase()];return!t||t!==!0&&e.getAttribute("classid")===t}}),v.fn.extend({data:function(e,n){var r,i,s,o,u,a=this[0],f=0,l=null;if(e===t){if(this.length){l=v.data(a);if(a.nodeType===1&&!v._data(a,"parsedAttrs")){s=a.attributes;for(u=s.length;f<u;f++)o=s[f].name,o.indexOf("data-")||(o=v.camelCase(o.substring(5)),H(a,o,l[o]));v._data(a,"parsedAttrs",!0)}}return l}return typeof e=="object"?this.each(function(){v.data(this,e)}):(r=e.split(".",2),r[1]=r[1]?"."+r[1]:"",i=r[1]+"!",v.access(this,function(n){if(n===t)return l=this.triggerHandler("getData"+i,[r[0]]),l===t&&a&&(l=v.data(a,e),l=H(a,e,l)),l===t&&r[1]?this.data(r[0]):l;r[1]=n,this.each(function(){var t=v(this);t.triggerHandler("setData"+i,r),v.data(this,e,n),t.triggerHandler("changeData"+i,r)})},null,n,arguments.length>1,null,!1))},removeData:function(e){return this.each(function(){v.removeData(this,e)})}}),v.extend({queue:function(e,t,n){var r;if(e)return t=(t||"fx")+"queue",r=v._data(e,t),n&&(!r||v.isArray(n)?r=v._data(e,t,v.makeArray(n)):r.push(n)),r||[]},dequeue:function(e,t){t=t||"fx";var n=v.queue(e,t),r=n.length,i=n.shift(),s=v._queueHooks(e,t),o=function(){v.dequeue(e,t)};i==="inprogress"&&(i=n.shift(),r--),i&&(t==="fx"&&n.unshift("inprogress"),delete s.stop,i.call(e,o,s)),!r&&s&&s.empty.fire()},_queueHooks:function(e,t){var n=t+"queueHooks";return v._data(e,n)||v._data(e,n,{empty:v.Callbacks("once memory").add(function(){v.removeData(e,t+"queue",!0),v.removeData(e,n,!0)})})}}),v.fn.extend({queue:function(e,n){var r=2;return typeof e!="string"&&(n=e,e="fx",r--),arguments.length<r?v.queue(this[0],e):n===t?this:this.each(function(){var t=v.queue(this,e,n);v._queueHooks(this,e),e==="fx"&&t[0]!=="inprogress"&&v.dequeue(this,e)})},dequeue:function(e){return this.each(function(){v.dequeue(this,e)})},delay:function(e,t){return e=v.fx?v.fx.speeds[e]||e:e,t=t||"fx",this.queue(t,function(t,n){var r=setTimeout(t,e);n.stop=function(){clearTimeout(r)}})},clearQueue:function(e){return this.queue(e||"fx",[])},promise:function(e,n){var r,i=1,s=v.Deferred(),o=this,u=this.length,a=function(){--i||s.resolveWith(o,[o])};typeof e!="string"&&(n=e,e=t),e=e||"fx";while(u--)r=v._data(o[u],e+"queueHooks"),r&&r.empty&&(i++,r.empty.add(a));return a(),s.promise(n)}});var j,F,I,q=/[\t\r\n]/g,R=/\r/g,U=/^(?:button|input)$/i,z=/^(?:button|input|object|select|textarea)$/i,W=/^a(?:rea|)$/i,X=/^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,V=v.support.getSetAttribute;v.fn.extend({attr:function(e,t){return v.access(this,v.attr,e,t,arguments.length>1)},removeAttr:function(e){return this.each(function(){v.removeAttr(this,e)})},prop:function(e,t){return v.access(this,v.prop,e,t,arguments.length>1)},removeProp:function(e){return e=v.propFix[e]||e,this.each(function(){try{this[e]=t,delete this[e]}catch(n){}})},addClass:function(e){var t,n,r,i,s,o,u;if(v.isFunction(e))return this.each(function(t){v(this).addClass(e.call(this,t,this.className))});if(e&&typeof e=="string"){t=e.split(y);for(n=0,r=this.length;n<r;n++){i=this[n];if(i.nodeType===1)if(!i.className&&t.length===1)i.className=e;else{s=" "+i.className+" ";for(o=0,u=t.length;o<u;o++)s.indexOf(" "+t[o]+" ")<0&&(s+=t[o]+" ");i.className=v.trim(s)}}}return this},removeClass:function(e){var n,r,i,s,o,u,a;if(v.isFunction(e))return this.each(function(t){v(this).removeClass(e.call(this,t,this.className))});if(e&&typeof e=="string"||e===t){n=(e||"").split(y);for(u=0,a=this.length;u<a;u++){i=this[u];if(i.nodeType===1&&i.className){r=(" "+i.className+" ").replace(q," ");for(s=0,o=n.length;s<o;s++)while(r.indexOf(" "+n[s]+" ")>=0)r=r.replace(" "+n[s]+" "," ");i.className=e?v.trim(r):""}}}return this},toggleClass:function(e,t){var n=typeof e,r=typeof t=="boolean";return v.isFunction(e)?this.each(function(n){v(this).toggleClass(e.call(this,n,this.className,t),t)}):this.each(function(){if(n==="string"){var i,s=0,o=v(this),u=t,a=e.split(y);while(i=a[s++])u=r?u:!o.hasClass(i),o[u?"addClass":"removeClass"](i)}else if(n==="undefined"||n==="boolean")this.className&&v._data(this,"__className__",this.className),this.className=this.className||e===!1?"":v._data(this,"__className__")||""})},hasClass:function(e){var t=" "+e+" ",n=0,r=this.length;for(;n<r;n++)if(this[n].nodeType===1&&(" "+this[n].className+" ").replace(q," ").indexOf(t)>=0)return!0;return!1},val:function(e){var n,r,i,s=this[0];if(!arguments.length){if(s)return n=v.valHooks[s.type]||v.valHooks[s.nodeName.toLowerCase()],n&&"get"in n&&(r=n.get(s,"value"))!==t?r:(r=s.value,typeof r=="string"?r.replace(R,""):r==null?"":r);return}return i=v.isFunction(e),this.each(function(r){var s,o=v(this);if(this.nodeType!==1)return;i?s=e.call(this,r,o.val()):s=e,s==null?s="":typeof s=="number"?s+="":v.isArray(s)&&(s=v.map(s,function(e){return e==null?"":e+""})),n=v.valHooks[this.type]||v.valHooks[this.nodeName.toLowerCase()];if(!n||!("set"in n)||n.set(this,s,"value")===t)this.value=s})}}),v.extend({valHooks:{option:{get:function(e){var t=e.attributes.value;return!t||t.specified?e.value:e.text}},select:{get:function(e){var t,n,r=e.options,i=e.selectedIndex,s=e.type==="select-one"||i<0,o=s?null:[],u=s?i+1:r.length,a=i<0?u:s?i:0;for(;a<u;a++){n=r[a];if((n.selected||a===i)&&(v.support.optDisabled?!n.disabled:n.getAttribute("disabled")===null)&&(!n.parentNode.disabled||!v.nodeName(n.parentNode,"optgroup"))){t=v(n).val();if(s)return t;o.push(t)}}return o},set:function(e,t){var n=v.makeArray(t);return v(e).find("option").each(function(){this.selected=v.inArray(v(this).val(),n)>=0}),n.length||(e.selectedIndex=-1),n}}},attrFn:{},attr:function(e,n,r,i){var s,o,u,a=e.nodeType;if(!e||a===3||a===8||a===2)return;if(i&&v.isFunction(v.fn[n]))return v(e)[n](r);if(typeof e.getAttribute=="undefined")return v.prop(e,n,r);u=a!==1||!v.isXMLDoc(e),u&&(n=n.toLowerCase(),o=v.attrHooks[n]||(X.test(n)?F:j));if(r!==t){if(r===null){v.removeAttr(e,n);return}return o&&"set"in o&&u&&(s=o.set(e,r,n))!==t?s:(e.setAttribute(n,r+""),r)}return o&&"get"in o&&u&&(s=o.get(e,n))!==null?s:(s=e.getAttribute(n),s===null?t:s)},removeAttr:function(e,t){var n,r,i,s,o=0;if(t&&e.nodeType===1){r=t.split(y);for(;o<r.length;o++)i=r[o],i&&(n=v.propFix[i]||i,s=X.test(i),s||v.attr(e,i,""),e.removeAttribute(V?i:n),s&&n in e&&(e[n]=!1))}},attrHooks:{type:{set:function(e,t){if(U.test(e.nodeName)&&e.parentNode)v.error("type property can't be changed");else if(!v.support.radioValue&&t==="radio"&&v.nodeName(e,"input")){var n=e.value;return e.setAttribute("type",t),n&&(e.value=n),t}}},value:{get:function(e,t){return j&&v.nodeName(e,"button")?j.get(e,t):t in e?e.value:null},set:function(e,t,n){if(j&&v.nodeName(e,"button"))return j.set(e,t,n);e.value=t}}},propFix:{tabindex:"tabIndex",readonly:"readOnly","for":"htmlFor","class":"className",maxlength:"maxLength",cellspacing:"cellSpacing",cellpadding:"cellPadding",rowspan:"rowSpan",colspan:"colSpan",usemap:"useMap",frameborder:"frameBorder",contenteditable:"contentEditable"},prop:function(e,n,r){var i,s,o,u=e.nodeType;if(!e||u===3||u===8||u===2)return;return o=u!==1||!v.isXMLDoc(e),o&&(n=v.propFix[n]||n,s=v.propHooks[n]),r!==t?s&&"set"in s&&(i=s.set(e,r,n))!==t?i:e[n]=r:s&&"get"in s&&(i=s.get(e,n))!==null?i:e[n]},propHooks:{tabIndex:{get:function(e){var n=e.getAttributeNode("tabindex");return n&&n.specified?parseInt(n.value,10):z.test(e.nodeName)||W.test(e.nodeName)&&e.href?0:t}}}}),F={get:function(e,n){var r,i=v.prop(e,n);return i===!0||typeof i!="boolean"&&(r=e.getAttributeNode(n))&&r.nodeValue!==!1?n.toLowerCase():t},set:function(e,t,n){var r;return t===!1?v.removeAttr(e,n):(r=v.propFix[n]||n,r in e&&(e[r]=!0),e.setAttribute(n,n.toLowerCase())),n}},V||(I={name:!0,id:!0,coords:!0},j=v.valHooks.button={get:function(e,n){var r;return r=e.getAttributeNode(n),r&&(I[n]?r.value!=="":r.specified)?r.value:t},set:function(e,t,n){var r=e.getAttributeNode(n);return r||(r=i.createAttribute(n),e.setAttributeNode(r)),r.value=t+""}},v.each(["width","height"],function(e,t){v.attrHooks[t]=v.extend(v.attrHooks[t],{set:function(e,n){if(n==="")return e.setAttribute(t,"auto"),n}})}),v.attrHooks.contenteditable={get:j.get,set:function(e,t,n){t===""&&(t="false"),j.set(e,t,n)}}),v.support.hrefNormalized||v.each(["href","src","width","height"],function(e,n){v.attrHooks[n]=v.extend(v.attrHooks[n],{get:function(e){var r=e.getAttribute(n,2);return r===null?t:r}})}),v.support.style||(v.attrHooks.style={get:function(e){return e.style.cssText.toLowerCase()||t},set:function(e,t){return e.style.cssText=t+""}}),v.support.optSelected||(v.propHooks.selected=v.extend(v.propHooks.selected,{get:function(e){var t=e.parentNode;return t&&(t.selectedIndex,t.parentNode&&t.parentNode.selectedIndex),null}})),v.support.enctype||(v.propFix.enctype="encoding"),v.support.checkOn||v.each(["radio","checkbox"],function(){v.valHooks[this]={get:function(e){return e.getAttribute("value")===null?"on":e.value}}}),v.each(["radio","checkbox"],function(){v.valHooks[this]=v.extend(v.valHooks[this],{set:function(e,t){if(v.isArray(t))return e.checked=v.inArray(v(e).val(),t)>=0}})});var $=/^(?:textarea|input|select)$/i,J=/^([^\.]*|)(?:\.(.+)|)$/,K=/(?:^|\s)hover(\.\S+|)\b/,Q=/^key/,G=/^(?:mouse|contextmenu)|click/,Y=/^(?:focusinfocus|focusoutblur)$/,Z=function(e){return v.event.special.hover?e:e.replace(K,"mouseenter$1 mouseleave$1")};v.event={add:function(e,n,r,i,s){var o,u,a,f,l,c,h,p,d,m,g;if(e.nodeType===3||e.nodeType===8||!n||!r||!(o=v._data(e)))return;r.handler&&(d=r,r=d.handler,s=d.selector),r.guid||(r.guid=v.guid++),a=o.events,a||(o.events=a={}),u=o.handle,u||(o.handle=u=function(e){return typeof v=="undefined"||!!e&&v.event.triggered===e.type?t:v.event.dispatch.apply(u.elem,arguments)},u.elem=e),n=v.trim(Z(n)).split(" ");for(f=0;f<n.length;f++){l=J.exec(n[f])||[],c=l[1],h=(l[2]||"").split(".").sort(),g=v.event.special[c]||{},c=(s?g.delegateType:g.bindType)||c,g=v.event.special[c]||{},p=v.extend({type:c,origType:l[1],data:i,handler:r,guid:r.guid,selector:s,needsContext:s&&v.expr.match.needsContext.test(s),namespace:h.join(".")},d),m=a[c];if(!m){m=a[c]=[],m.delegateCount=0;if(!g.setup||g.setup.call(e,i,h,u)===!1)e.addEventListener?e.addEventListener(c,u,!1):e.attachEvent&&e.attachEvent("on"+c,u)}g.add&&(g.add.call(e,p),p.handler.guid||(p.handler.guid=r.guid)),s?m.splice(m.delegateCount++,0,p):m.push(p),v.event.global[c]=!0}e=null},global:{},remove:function(e,t,n,r,i){var s,o,u,a,f,l,c,h,p,d,m,g=v.hasData(e)&&v._data(e);if(!g||!(h=g.events))return;t=v.trim(Z(t||"")).split(" ");for(s=0;s<t.length;s++){o=J.exec(t[s])||[],u=a=o[1],f=o[2];if(!u){for(u in h)v.event.remove(e,u+t[s],n,r,!0);continue}p=v.event.special[u]||{},u=(r?p.delegateType:p.bindType)||u,d=h[u]||[],l=d.length,f=f?new RegExp("(^|\\.)"+f.split(".").sort().join("\\.(?:.*\\.|)")+"(\\.|$)"):null;for(c=0;c<d.length;c++)m=d[c],(i||a===m.origType)&&(!n||n.guid===m.guid)&&(!f||f.test(m.namespace))&&(!r||r===m.selector||r==="**"&&m.selector)&&(d.splice(c--,1),m.selector&&d.delegateCount--,p.remove&&p.remove.call(e,m));d.length===0&&l!==d.length&&((!p.teardown||p.teardown.call(e,f,g.handle)===!1)&&v.removeEvent(e,u,g.handle),delete h[u])}v.isEmptyObject(h)&&(delete g.handle,v.removeData(e,"events",!0))},customEvent:{getData:!0,setData:!0,changeData:!0},trigger:function(n,r,s,o){if(!s||s.nodeType!==3&&s.nodeType!==8){var u,a,f,l,c,h,p,d,m,g,y=n.type||n,b=[];if(Y.test(y+v.event.triggered))return;y.indexOf("!")>=0&&(y=y.slice(0,-1),a=!0),y.indexOf(".")>=0&&(b=y.split("."),y=b.shift(),b.sort());if((!s||v.event.customEvent[y])&&!v.event.global[y])return;n=typeof n=="object"?n[v.expando]?n:new v.Event(y,n):new v.Event(y),n.type=y,n.isTrigger=!0,n.exclusive=a,n.namespace=b.join("."),n.namespace_re=n.namespace?new RegExp("(^|\\.)"+b.join("\\.(?:.*\\.|)")+"(\\.|$)"):null,h=y.indexOf(":")<0?"on"+y:"";if(!s){u=v.cache;for(f in u)u[f].events&&u[f].events[y]&&v.event.trigger(n,r,u[f].handle.elem,!0);return}n.result=t,n.target||(n.target=s),r=r!=null?v.makeArray(r):[],r.unshift(n),p=v.event.special[y]||{};if(p.trigger&&p.trigger.apply(s,r)===!1)return;m=[[s,p.bindType||y]];if(!o&&!p.noBubble&&!v.isWindow(s)){g=p.delegateType||y,l=Y.test(g+y)?s:s.parentNode;for(c=s;l;l=l.parentNode)m.push([l,g]),c=l;c===(s.ownerDocument||i)&&m.push([c.defaultView||c.parentWindow||e,g])}for(f=0;f<m.length&&!n.isPropagationStopped();f++)l=m[f][0],n.type=m[f][1],d=(v._data(l,"events")||{})[n.type]&&v._data(l,"handle"),d&&d.apply(l,r),d=h&&l[h],d&&v.acceptData(l)&&d.apply&&d.apply(l,r)===!1&&n.preventDefault();return n.type=y,!o&&!n.isDefaultPrevented()&&(!p._default||p._default.apply(s.ownerDocument,r)===!1)&&(y!=="click"||!v.nodeName(s,"a"))&&v.acceptData(s)&&h&&s[y]&&(y!=="focus"&&y!=="blur"||n.target.offsetWidth!==0)&&!v.isWindow(s)&&(c=s[h],c&&(s[h]=null),v.event.triggered=y,s[y](),v.event.triggered=t,c&&(s[h]=c)),n.result}return},dispatch:function(n){n=v.event.fix(n||e.event);var r,i,s,o,u,a,f,c,h,p,d=(v._data(this,"events")||{})[n.type]||[],m=d.delegateCount,g=l.call(arguments),y=!n.exclusive&&!n.namespace,b=v.event.special[n.type]||{},w=[];g[0]=n,n.delegateTarget=this;if(b.preDispatch&&b.preDispatch.call(this,n)===!1)return;if(m&&(!n.button||n.type!=="click"))for(s=n.target;s!=this;s=s.parentNode||this)if(s.disabled!==!0||n.type!=="click"){u={},f=[];for(r=0;r<m;r++)c=d[r],h=c.selector,u[h]===t&&(u[h]=c.needsContext?v(h,this).index(s)>=0:v.find(h,this,null,[s]).length),u[h]&&f.push(c);f.length&&w.push({elem:s,matches:f})}d.length>m&&w.push({elem:this,matches:d.slice(m)});for(r=0;r<w.length&&!n.isPropagationStopped();r++){a=w[r],n.currentTarget=a.elem;for(i=0;i<a.matches.length&&!n.isImmediatePropagationStopped();i++){c=a.matches[i];if(y||!n.namespace&&!c.namespace||n.namespace_re&&n.namespace_re.test(c.namespace))n.data=c.data,n.handleObj=c,o=((v.event.special[c.origType]||{}).handle||c.handler).apply(a.elem,g),o!==t&&(n.result=o,o===!1&&(n.preventDefault(),n.stopPropagation()))}}return b.postDispatch&&b.postDispatch.call(this,n),n.result},props:"attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),fixHooks:{},keyHooks:{props:"char charCode key keyCode".split(" "),filter:function(e,t){return e.which==null&&(e.which=t.charCode!=null?t.charCode:t.keyCode),e}},mouseHooks:{props:"button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),filter:function(e,n){var r,s,o,u=n.button,a=n.fromElement;return e.pageX==null&&n.clientX!=null&&(r=e.target.ownerDocument||i,s=r.documentElement,o=r.body,e.pageX=n.clientX+(s&&s.scrollLeft||o&&o.scrollLeft||0)-(s&&s.clientLeft||o&&o.clientLeft||0),e.pageY=n.clientY+(s&&s.scrollTop||o&&o.scrollTop||0)-(s&&s.clientTop||o&&o.clientTop||0)),!e.relatedTarget&&a&&(e.relatedTarget=a===e.target?n.toElement:a),!e.which&&u!==t&&(e.which=u&1?1:u&2?3:u&4?2:0),e}},fix:function(e){if(e[v.expando])return e;var t,n,r=e,s=v.event.fixHooks[e.type]||{},o=s.props?this.props.concat(s.props):this.props;e=v.Event(r);for(t=o.length;t;)n=o[--t],e[n]=r[n];return e.target||(e.target=r.srcElement||i),e.target.nodeType===3&&(e.target=e.target.parentNode),e.metaKey=!!e.metaKey,s.filter?s.filter(e,r):e},special:{load:{noBubble:!0},focus:{delegateType:"focusin"},blur:{delegateType:"focusout"},beforeunload:{setup:function(e,t,n){v.isWindow(this)&&(this.onbeforeunload=n)},teardown:function(e,t){this.onbeforeunload===t&&(this.onbeforeunload=null)}}},simulate:function(e,t,n,r){var i=v.extend(new v.Event,n,{type:e,isSimulated:!0,originalEvent:{}});r?v.event.trigger(i,null,t):v.event.dispatch.call(t,i),i.isDefaultPrevented()&&n.preventDefault()}},v.event.handle=v.event.dispatch,v.removeEvent=i.removeEventListener?function(e,t,n){e.removeEventListener&&e.removeEventListener(t,n,!1)}:function(e,t,n){var r="on"+t;e.detachEvent&&(typeof e[r]=="undefined"&&(e[r]=null),e.detachEvent(r,n))},v.Event=function(e,t){if(!(this instanceof v.Event))return new v.Event(e,t);e&&e.type?(this.originalEvent=e,this.type=e.type,this.isDefaultPrevented=e.defaultPrevented||e.returnValue===!1||e.getPreventDefault&&e.getPreventDefault()?tt:et):this.type=e,t&&v.extend(this,t),this.timeStamp=e&&e.timeStamp||v.now(),this[v.expando]=!0},v.Event.prototype={preventDefault:function(){this.isDefaultPrevented=tt;var e=this.originalEvent;if(!e)return;e.preventDefault?e.preventDefault():e.returnValue=!1},stopPropagation:function(){this.isPropagationStopped=tt;var e=this.originalEvent;if(!e)return;e.stopPropagation&&e.stopPropagation(),e.cancelBubble=!0},stopImmediatePropagation:function(){this.isImmediatePropagationStopped=tt,this.stopPropagation()},isDefaultPrevented:et,isPropagationStopped:et,isImmediatePropagationStopped:et},v.each({mouseenter:"mouseover",mouseleave:"mouseout"},function(e,t){v.event.special[e]={delegateType:t,bindType:t,handle:function(e){var n,r=this,i=e.relatedTarget,s=e.handleObj,o=s.selector;if(!i||i!==r&&!v.contains(r,i))e.type=s.origType,n=s.handler.apply(this,arguments),e.type=t;return n}}}),v.support.submitBubbles||(v.event.special.submit={setup:function(){if(v.nodeName(this,"form"))return!1;v.event.add(this,"click._submit keypress._submit",function(e){var n=e.target,r=v.nodeName(n,"input")||v.nodeName(n,"button")?n.form:t;r&&!v._data(r,"_submit_attached")&&(v.event.add(r,"submit._submit",function(e){e._submit_bubble=!0}),v._data(r,"_submit_attached",!0))})},postDispatch:function(e){e._submit_bubble&&(delete e._submit_bubble,this.parentNode&&!e.isTrigger&&v.event.simulate("submit",this.parentNode,e,!0))},teardown:function(){if(v.nodeName(this,"form"))return!1;v.event.remove(this,"._submit")}}),v.support.changeBubbles||(v.event.special.change={setup:function(){if($.test(this.nodeName)){if(this.type==="checkbox"||this.type==="radio")v.event.add(this,"propertychange._change",function(e){e.originalEvent.propertyName==="checked"&&(this._just_changed=!0)}),v.event.add(this,"click._change",function(e){this._just_changed&&!e.isTrigger&&(this._just_changed=!1),v.event.simulate("change",this,e,!0)});return!1}v.event.add(this,"beforeactivate._change",function(e){var t=e.target;$.test(t.nodeName)&&!v._data(t,"_change_attached")&&(v.event.add(t,"change._change",function(e){this.parentNode&&!e.isSimulated&&!e.isTrigger&&v.event.simulate("change",this.parentNode,e,!0)}),v._data(t,"_change_attached",!0))})},handle:function(e){var t=e.target;if(this!==t||e.isSimulated||e.isTrigger||t.type!=="radio"&&t.type!=="checkbox")return e.handleObj.handler.apply(this,arguments)},teardown:function(){return v.event.remove(this,"._change"),!$.test(this.nodeName)}}),v.support.focusinBubbles||v.each({focus:"focusin",blur:"focusout"},function(e,t){var n=0,r=function(e){v.event.simulate(t,e.target,v.event.fix(e),!0)};v.event.special[t]={setup:function(){n++===0&&i.addEventListener(e,r,!0)},teardown:function(){--n===0&&i.removeEventListener(e,r,!0)}}}),v.fn.extend({on:function(e,n,r,i,s){var o,u;if(typeof e=="object"){typeof n!="string"&&(r=r||n,n=t);for(u in e)this.on(u,n,r,e[u],s);return this}r==null&&i==null?(i=n,r=n=t):i==null&&(typeof n=="string"?(i=r,r=t):(i=r,r=n,n=t));if(i===!1)i=et;else if(!i)return this;return s===1&&(o=i,i=function(e){return v().off(e),o.apply(this,arguments)},i.guid=o.guid||(o.guid=v.guid++)),this.each(function(){v.event.add(this,e,i,r,n)})},one:function(e,t,n,r){return this.on(e,t,n,r,1)},off:function(e,n,r){var i,s;if(e&&e.preventDefault&&e.handleObj)return i=e.handleObj,v(e.delegateTarget).off(i.namespace?i.origType+"."+i.namespace:i.origType,i.selector,i.handler),this;if(typeof e=="object"){for(s in e)this.off(s,n,e[s]);return this}if(n===!1||typeof n=="function")r=n,n=t;return r===!1&&(r=et),this.each(function(){v.event.remove(this,e,r,n)})},bind:function(e,t,n){return this.on(e,null,t,n)},unbind:function(e,t){return this.off(e,null,t)},live:function(e,t,n){return v(this.context).on(e,this.selector,t,n),this},die:function(e,t){return v(this.context).off(e,this.selector||"**",t),this},delegate:function(e,t,n,r){return this.on(t,e,n,r)},undelegate:function(e,t,n){return arguments.length===1?this.off(e,"**"):this.off(t,e||"**",n)},trigger:function(e,t){return this.each(function(){v.event.trigger(e,t,this)})},triggerHandler:function(e,t){if(this[0])return v.event.trigger(e,t,this[0],!0)},toggle:function(e){var t=arguments,n=e.guid||v.guid++,r=0,i=function(n){var i=(v._data(this,"lastToggle"+e.guid)||0)%r;return v._data(this,"lastToggle"+e.guid,i+1),n.preventDefault(),t[i].apply(this,arguments)||!1};i.guid=n;while(r<t.length)t[r++].guid=n;return this.click(i)},hover:function(e,t){return this.mouseenter(e).mouseleave(t||e)}}),v.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "),function(e,t){v.fn[t]=function(e,n){return n==null&&(n=e,e=null),arguments.length>0?this.on(t,null,e,n):this.trigger(t)},Q.test(t)&&(v.event.fixHooks[t]=v.event.keyHooks),G.test(t)&&(v.event.fixHooks[t]=v.event.mouseHooks)}),function(e,t){function nt(e,t,n,r){n=n||[],t=t||g;var i,s,a,f,l=t.nodeType;if(!e||typeof e!="string")return n;if(l!==1&&l!==9)return[];a=o(t);if(!a&&!r)if(i=R.exec(e))if(f=i[1]){if(l===9){s=t.getElementById(f);if(!s||!s.parentNode)return n;if(s.id===f)return n.push(s),n}else if(t.ownerDocument&&(s=t.ownerDocument.getElementById(f))&&u(t,s)&&s.id===f)return n.push(s),n}else{if(i[2])return S.apply(n,x.call(t.getElementsByTagName(e),0)),n;if((f=i[3])&&Z&&t.getElementsByClassName)return S.apply(n,x.call(t.getElementsByClassName(f),0)),n}return vt(e.replace(j,"$1"),t,n,r,a)}function rt(e){return function(t){var n=t.nodeName.toLowerCase();return n==="input"&&t.type===e}}function it(e){return function(t){var n=t.nodeName.toLowerCase();return(n==="input"||n==="button")&&t.type===e}}function st(e){return N(function(t){return t=+t,N(function(n,r){var i,s=e([],n.length,t),o=s.length;while(o--)n[i=s[o]]&&(n[i]=!(r[i]=n[i]))})})}function ot(e,t,n){if(e===t)return n;var r=e.nextSibling;while(r){if(r===t)return-1;r=r.nextSibling}return 1}function ut(e,t){var n,r,s,o,u,a,f,l=L[d][e+" "];if(l)return t?0:l.slice(0);u=e,a=[],f=i.preFilter;while(u){if(!n||(r=F.exec(u)))r&&(u=u.slice(r[0].length)||u),a.push(s=[]);n=!1;if(r=I.exec(u))s.push(n=new m(r.shift())),u=u.slice(n.length),n.type=r[0].replace(j," ");for(o in i.filter)(r=J[o].exec(u))&&(!f[o]||(r=f[o](r)))&&(s.push(n=new m(r.shift())),u=u.slice(n.length),n.type=o,n.matches=r);if(!n)break}return t?u.length:u?nt.error(e):L(e,a).slice(0)}function at(e,t,r){var i=t.dir,s=r&&t.dir==="parentNode",o=w++;return t.first?function(t,n,r){while(t=t[i])if(s||t.nodeType===1)return e(t,n,r)}:function(t,r,u){if(!u){var a,f=b+" "+o+" ",l=f+n;while(t=t[i])if(s||t.nodeType===1){if((a=t[d])===l)return t.sizset;if(typeof a=="string"&&a.indexOf(f)===0){if(t.sizset)return t}else{t[d]=l;if(e(t,r,u))return t.sizset=!0,t;t.sizset=!1}}}else while(t=t[i])if(s||t.nodeType===1)if(e(t,r,u))return t}}function ft(e){return e.length>1?function(t,n,r){var i=e.length;while(i--)if(!e[i](t,n,r))return!1;return!0}:e[0]}function lt(e,t,n,r,i){var s,o=[],u=0,a=e.length,f=t!=null;for(;u<a;u++)if(s=e[u])if(!n||n(s,r,i))o.push(s),f&&t.push(u);return o}function ct(e,t,n,r,i,s){return r&&!r[d]&&(r=ct(r)),i&&!i[d]&&(i=ct(i,s)),N(function(s,o,u,a){var f,l,c,h=[],p=[],d=o.length,v=s||dt(t||"*",u.nodeType?[u]:u,[]),m=e&&(s||!t)?lt(v,h,e,u,a):v,g=n?i||(s?e:d||r)?[]:o:m;n&&n(m,g,u,a);if(r){f=lt(g,p),r(f,[],u,a),l=f.length;while(l--)if(c=f[l])g[p[l]]=!(m[p[l]]=c)}if(s){if(i||e){if(i){f=[],l=g.length;while(l--)(c=g[l])&&f.push(m[l]=c);i(null,g=[],f,a)}l=g.length;while(l--)(c=g[l])&&(f=i?T.call(s,c):h[l])>-1&&(s[f]=!(o[f]=c))}}else g=lt(g===o?g.splice(d,g.length):g),i?i(null,o,g,a):S.apply(o,g)})}function ht(e){var t,n,r,s=e.length,o=i.relative[e[0].type],u=o||i.relative[" "],a=o?1:0,f=at(function(e){return e===t},u,!0),l=at(function(e){return T.call(t,e)>-1},u,!0),h=[function(e,n,r){return!o&&(r||n!==c)||((t=n).nodeType?f(e,n,r):l(e,n,r))}];for(;a<s;a++)if(n=i.relative[e[a].type])h=[at(ft(h),n)];else{n=i.filter[e[a].type].apply(null,e[a].matches);if(n[d]){r=++a;for(;r<s;r++)if(i.relative[e[r].type])break;return ct(a>1&&ft(h),a>1&&e.slice(0,a-1).join("").replace(j,"$1"),n,a<r&&ht(e.slice(a,r)),r<s&&ht(e=e.slice(r)),r<s&&e.join(""))}h.push(n)}return ft(h)}function pt(e,t){var r=t.length>0,s=e.length>0,o=function(u,a,f,l,h){var p,d,v,m=[],y=0,w="0",x=u&&[],T=h!=null,N=c,C=u||s&&i.find.TAG("*",h&&a.parentNode||a),k=b+=N==null?1:Math.E;T&&(c=a!==g&&a,n=o.el);for(;(p=C[w])!=null;w++){if(s&&p){for(d=0;v=e[d];d++)if(v(p,a,f)){l.push(p);break}T&&(b=k,n=++o.el)}r&&((p=!v&&p)&&y--,u&&x.push(p))}y+=w;if(r&&w!==y){for(d=0;v=t[d];d++)v(x,m,a,f);if(u){if(y>0)while(w--)!x[w]&&!m[w]&&(m[w]=E.call(l));m=lt(m)}S.apply(l,m),T&&!u&&m.length>0&&y+t.length>1&&nt.uniqueSort(l)}return T&&(b=k,c=N),x};return o.el=0,r?N(o):o}function dt(e,t,n){var r=0,i=t.length;for(;r<i;r++)nt(e,t[r],n);return n}function vt(e,t,n,r,s){var o,u,f,l,c,h=ut(e),p=h.length;if(!r&&h.length===1){u=h[0]=h[0].slice(0);if(u.length>2&&(f=u[0]).type==="ID"&&t.nodeType===9&&!s&&i.relative[u[1].type]){t=i.find.ID(f.matches[0].replace($,""),t,s)[0];if(!t)return n;e=e.slice(u.shift().length)}for(o=J.POS.test(e)?-1:u.length-1;o>=0;o--){f=u[o];if(i.relative[l=f.type])break;if(c=i.find[l])if(r=c(f.matches[0].replace($,""),z.test(u[0].type)&&t.parentNode||t,s)){u.splice(o,1),e=r.length&&u.join("");if(!e)return S.apply(n,x.call(r,0)),n;break}}}return a(e,h)(r,t,s,n,z.test(e)),n}function mt(){}var n,r,i,s,o,u,a,f,l,c,h=!0,p="undefined",d=("sizcache"+Math.random()).replace(".",""),m=String,g=e.document,y=g.documentElement,b=0,w=0,E=[].pop,S=[].push,x=[].slice,T=[].indexOf||function(e){var t=0,n=this.length;for(;t<n;t++)if(this[t]===e)return t;return-1},N=function(e,t){return e[d]=t==null||t,e},C=function(){var e={},t=[];return N(function(n,r){return t.push(n)>i.cacheLength&&delete e[t.shift()],e[n+" "]=r},e)},k=C(),L=C(),A=C(),O="[\\x20\\t\\r\\n\\f]",M="(?:\\\\.|[-\\w]|[^\\x00-\\xa0])+",_=M.replace("w","w#"),D="([*^$|!~]?=)",P="\\["+O+"*("+M+")"+O+"*(?:"+D+O+"*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|("+_+")|)|)"+O+"*\\]",H=":("+M+")(?:\\((?:(['\"])((?:\\\\.|[^\\\\])*?)\\2|([^()[\\]]*|(?:(?:"+P+")|[^:]|\\\\.)*|.*))\\)|)",B=":(even|odd|eq|gt|lt|nth|first|last)(?:\\("+O+"*((?:-\\d)?\\d*)"+O+"*\\)|)(?=[^-]|$)",j=new RegExp("^"+O+"+|((?:^|[^\\\\])(?:\\\\.)*)"+O+"+$","g"),F=new RegExp("^"+O+"*,"+O+"*"),I=new RegExp("^"+O+"*([\\x20\\t\\r\\n\\f>+~])"+O+"*"),q=new RegExp(H),R=/^(?:#([\w\-]+)|(\w+)|\.([\w\-]+))$/,U=/^:not/,z=/[\x20\t\r\n\f]*[+~]/,W=/:not\($/,X=/h\d/i,V=/input|select|textarea|button/i,$=/\\(?!\\)/g,J={ID:new RegExp("^#("+M+")"),CLASS:new RegExp("^\\.("+M+")"),NAME:new RegExp("^\\[name=['\"]?("+M+")['\"]?\\]"),TAG:new RegExp("^("+M.replace("w","w*")+")"),ATTR:new RegExp("^"+P),PSEUDO:new RegExp("^"+H),POS:new RegExp(B,"i"),CHILD:new RegExp("^:(only|nth|first|last)-child(?:\\("+O+"*(even|odd|(([+-]|)(\\d*)n|)"+O+"*(?:([+-]|)"+O+"*(\\d+)|))"+O+"*\\)|)","i"),needsContext:new RegExp("^"+O+"*[>+~]|"+B,"i")},K=function(e){var t=g.createElement("div");try{return e(t)}catch(n){return!1}finally{t=null}},Q=K(function(e){return e.appendChild(g.createComment("")),!e.getElementsByTagName("*").length}),G=K(function(e){return e.innerHTML="<a href='#'></a>",e.firstChild&&typeof e.firstChild.getAttribute!==p&&e.firstChild.getAttribute("href")==="#"}),Y=K(function(e){e.innerHTML="<select></select>";var t=typeof e.lastChild.getAttribute("multiple");return t!=="boolean"&&t!=="string"}),Z=K(function(e){return e.innerHTML="<div class='hidden e'></div><div class='hidden'></div>",!e.getElementsByClassName||!e.getElementsByClassName("e").length?!1:(e.lastChild.className="e",e.getElementsByClassName("e").length===2)}),et=K(function(e){e.id=d+0,e.innerHTML="<a name='"+d+"'></a><div name='"+d+"'></div>",y.insertBefore(e,y.firstChild);var t=g.getElementsByName&&g.getElementsByName(d).length===2+g.getElementsByName(d+0).length;return r=!g.getElementById(d),y.removeChild(e),t});try{x.call(y.childNodes,0)[0].nodeType}catch(tt){x=function(e){var t,n=[];for(;t=this[e];e++)n.push(t);return n}}nt.matches=function(e,t){return nt(e,null,null,t)},nt.matchesSelector=function(e,t){return nt(t,null,null,[e]).length>0},s=nt.getText=function(e){var t,n="",r=0,i=e.nodeType;if(i){if(i===1||i===9||i===11){if(typeof e.textContent=="string")return e.textContent;for(e=e.firstChild;e;e=e.nextSibling)n+=s(e)}else if(i===3||i===4)return e.nodeValue}else for(;t=e[r];r++)n+=s(t);return n},o=nt.isXML=function(e){var t=e&&(e.ownerDocument||e).documentElement;return t?t.nodeName!=="HTML":!1},u=nt.contains=y.contains?function(e,t){var n=e.nodeType===9?e.documentElement:e,r=t&&t.parentNode;return e===r||!!(r&&r.nodeType===1&&n.contains&&n.contains(r))}:y.compareDocumentPosition?function(e,t){return t&&!!(e.compareDocumentPosition(t)&16)}:function(e,t){while(t=t.parentNode)if(t===e)return!0;return!1},nt.attr=function(e,t){var n,r=o(e);return r||(t=t.toLowerCase()),(n=i.attrHandle[t])?n(e):r||Y?e.getAttribute(t):(n=e.getAttributeNode(t),n?typeof e[t]=="boolean"?e[t]?t:null:n.specified?n.value:null:null)},i=nt.selectors={cacheLength:50,createPseudo:N,match:J,attrHandle:G?{}:{href:function(e){return e.getAttribute("href",2)},type:function(e){return e.getAttribute("type")}},find:{ID:r?function(e,t,n){if(typeof t.getElementById!==p&&!n){var r=t.getElementById(e);return r&&r.parentNode?[r]:[]}}:function(e,n,r){if(typeof n.getElementById!==p&&!r){var i=n.getElementById(e);return i?i.id===e||typeof i.getAttributeNode!==p&&i.getAttributeNode("id").value===e?[i]:t:[]}},TAG:Q?function(e,t){if(typeof t.getElementsByTagName!==p)return t.getElementsByTagName(e)}:function(e,t){var n=t.getElementsByTagName(e);if(e==="*"){var r,i=[],s=0;for(;r=n[s];s++)r.nodeType===1&&i.push(r);return i}return n},NAME:et&&function(e,t){if(typeof t.getElementsByName!==p)return t.getElementsByName(name)},CLASS:Z&&function(e,t,n){if(typeof t.getElementsByClassName!==p&&!n)return t.getElementsByClassName(e)}},relative:{">":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(e){return e[1]=e[1].replace($,""),e[3]=(e[4]||e[5]||"").replace($,""),e[2]==="~="&&(e[3]=" "+e[3]+" "),e.slice(0,4)},CHILD:function(e){return e[1]=e[1].toLowerCase(),e[1]==="nth"?(e[2]||nt.error(e[0]),e[3]=+(e[3]?e[4]+(e[5]||1):2*(e[2]==="even"||e[2]==="odd")),e[4]=+(e[6]+e[7]||e[2]==="odd")):e[2]&&nt.error(e[0]),e},PSEUDO:function(e){var t,n;if(J.CHILD.test(e[0]))return null;if(e[3])e[2]=e[3];else if(t=e[4])q.test(t)&&(n=ut(t,!0))&&(n=t.indexOf(")",t.length-n)-t.length)&&(t=t.slice(0,n),e[0]=e[0].slice(0,n)),e[2]=t;return e.slice(0,3)}},filter:{ID:r?function(e){return e=e.replace($,""),function(t){return t.getAttribute("id")===e}}:function(e){return e=e.replace($,""),function(t){var n=typeof t.getAttributeNode!==p&&t.getAttributeNode("id");return n&&n.value===e}},TAG:function(e){return e==="*"?function(){return!0}:(e=e.replace($,"").toLowerCase(),function(t){return t.nodeName&&t.nodeName.toLowerCase()===e})},CLASS:function(e){var t=k[d][e+" "];return t||(t=new RegExp("(^|"+O+")"+e+"("+O+"|$)"))&&k(e,function(e){return t.test(e.className||typeof e.getAttribute!==p&&e.getAttribute("class")||"")})},ATTR:function(e,t,n){return function(r,i){var s=nt.attr(r,e);return s==null?t==="!=":t?(s+="",t==="="?s===n:t==="!="?s!==n:t==="^="?n&&s.indexOf(n)===0:t==="*="?n&&s.indexOf(n)>-1:t==="$="?n&&s.substr(s.length-n.length)===n:t==="~="?(" "+s+" ").indexOf(n)>-1:t==="|="?s===n||s.substr(0,n.length+1)===n+"-":!1):!0}},CHILD:function(e,t,n,r){return e==="nth"?function(e){var t,i,s=e.parentNode;if(n===1&&r===0)return!0;if(s){i=0;for(t=s.firstChild;t;t=t.nextSibling)if(t.nodeType===1){i++;if(e===t)break}}return i-=r,i===n||i%n===0&&i/n>=0}:function(t){var n=t;switch(e){case"only":case"first":while(n=n.previousSibling)if(n.nodeType===1)return!1;if(e==="first")return!0;n=t;case"last":while(n=n.nextSibling)if(n.nodeType===1)return!1;return!0}}},PSEUDO:function(e,t){var n,r=i.pseudos[e]||i.setFilters[e.toLowerCase()]||nt.error("unsupported pseudo: "+e);return r[d]?r(t):r.length>1?(n=[e,e,"",t],i.setFilters.hasOwnProperty(e.toLowerCase())?N(function(e,n){var i,s=r(e,t),o=s.length;while(o--)i=T.call(e,s[o]),e[i]=!(n[i]=s[o])}):function(e){return r(e,0,n)}):r}},pseudos:{not:N(function(e){var t=[],n=[],r=a(e.replace(j,"$1"));return r[d]?N(function(e,t,n,i){var s,o=r(e,null,i,[]),u=e.length;while(u--)if(s=o[u])e[u]=!(t[u]=s)}):function(e,i,s){return t[0]=e,r(t,null,s,n),!n.pop()}}),has:N(function(e){return function(t){return nt(e,t).length>0}}),contains:N(function(e){return function(t){return(t.textContent||t.innerText||s(t)).indexOf(e)>-1}}),enabled:function(e){return e.disabled===!1},disabled:function(e){return e.disabled===!0},checked:function(e){var t=e.nodeName.toLowerCase();return t==="input"&&!!e.checked||t==="option"&&!!e.selected},selected:function(e){return e.parentNode&&e.parentNode.selectedIndex,e.selected===!0},parent:function(e){return!i.pseudos.empty(e)},empty:function(e){var t;e=e.firstChild;while(e){if(e.nodeName>"@"||(t=e.nodeType)===3||t===4)return!1;e=e.nextSibling}return!0},header:function(e){return X.test(e.nodeName)},text:function(e){var t,n;return e.nodeName.toLowerCase()==="input"&&(t=e.type)==="text"&&((n=e.getAttribute("type"))==null||n.toLowerCase()===t)},radio:rt("radio"),checkbox:rt("checkbox"),file:rt("file"),password:rt("password"),image:rt("image"),submit:it("submit"),reset:it("reset"),button:function(e){var t=e.nodeName.toLowerCase();return t==="input"&&e.type==="button"||t==="button"},input:function(e){return V.test(e.nodeName)},focus:function(e){var t=e.ownerDocument;return e===t.activeElement&&(!t.hasFocus||t.hasFocus())&&!!(e.type||e.href||~e.tabIndex)},active:function(e){return e===e.ownerDocument.activeElement},first:st(function(){return[0]}),last:st(function(e,t){return[t-1]}),eq:st(function(e,t,n){return[n<0?n+t:n]}),even:st(function(e,t){for(var n=0;n<t;n+=2)e.push(n);return e}),odd:st(function(e,t){for(var n=1;n<t;n+=2)e.push(n);return e}),lt:st(function(e,t,n){for(var r=n<0?n+t:n;--r>=0;)e.push(r);return e}),gt:st(function(e,t,n){for(var r=n<0?n+t:n;++r<t;)e.push(r);return e})}},f=y.compareDocumentPosition?function(e,t){return e===t?(l=!0,0):(!e.compareDocumentPosition||!t.compareDocumentPosition?e.compareDocumentPosition:e.compareDocumentPosition(t)&4)?-1:1}:function(e,t){if(e===t)return l=!0,0;if(e.sourceIndex&&t.sourceIndex)return e.sourceIndex-t.sourceIndex;var n,r,i=[],s=[],o=e.parentNode,u=t.parentNode,a=o;if(o===u)return ot(e,t);if(!o)return-1;if(!u)return 1;while(a)i.unshift(a),a=a.parentNode;a=u;while(a)s.unshift(a),a=a.parentNode;n=i.length,r=s.length;for(var f=0;f<n&&f<r;f++)if(i[f]!==s[f])return ot(i[f],s[f]);return f===n?ot(e,s[f],-1):ot(i[f],t,1)},[0,0].sort(f),h=!l,nt.uniqueSort=function(e){var t,n=[],r=1,i=0;l=h,e.sort(f);if(l){for(;t=e[r];r++)t===e[r-1]&&(i=n.push(r));while(i--)e.splice(n[i],1)}return e},nt.error=function(e){throw new Error("Syntax error, unrecognized expression: "+e)},a=nt.compile=function(e,t){var n,r=[],i=[],s=A[d][e+" "];if(!s){t||(t=ut(e)),n=t.length;while(n--)s=ht(t[n]),s[d]?r.push(s):i.push(s);s=A(e,pt(i,r))}return s},g.querySelectorAll&&function(){var e,t=vt,n=/'|\\/g,r=/\=[\x20\t\r\n\f]*([^'"\]]*)[\x20\t\r\n\f]*\]/g,i=[":focus"],s=[":active"],u=y.matchesSelector||y.mozMatchesSelector||y.webkitMatchesSelector||y.oMatchesSelector||y.msMatchesSelector;K(function(e){e.innerHTML="<select><option selected=''></option></select>",e.querySelectorAll("[selected]").length||i.push("\\["+O+"*(?:checked|disabled|ismap|multiple|readonly|selected|value)"),e.querySelectorAll(":checked").length||i.push(":checked")}),K(function(e){e.innerHTML="<p test=''></p>",e.querySelectorAll("[test^='']").length&&i.push("[*^$]="+O+"*(?:\"\"|'')"),e.innerHTML="<input type='hidden'/>",e.querySelectorAll(":enabled").length||i.push(":enabled",":disabled")}),i=new RegExp(i.join("|")),vt=function(e,r,s,o,u){if(!o&&!u&&!i.test(e)){var a,f,l=!0,c=d,h=r,p=r.nodeType===9&&e;if(r.nodeType===1&&r.nodeName.toLowerCase()!=="object"){a=ut(e),(l=r.getAttribute("id"))?c=l.replace(n,"\\$&"):r.setAttribute("id",c),c="[id='"+c+"'] ",f=a.length;while(f--)a[f]=c+a[f].join("");h=z.test(e)&&r.parentNode||r,p=a.join(",")}if(p)try{return S.apply(s,x.call(h.querySelectorAll(p),0)),s}catch(v){}finally{l||r.removeAttribute("id")}}return t(e,r,s,o,u)},u&&(K(function(t){e=u.call(t,"div");try{u.call(t,"[test!='']:sizzle"),s.push("!=",H)}catch(n){}}),s=new RegExp(s.join("|")),nt.matchesSelector=function(t,n){n=n.replace(r,"='$1']");if(!o(t)&&!s.test(n)&&!i.test(n))try{var a=u.call(t,n);if(a||e||t.document&&t.document.nodeType!==11)return a}catch(f){}return nt(n,null,null,[t]).length>0})}(),i.pseudos.nth=i.pseudos.eq,i.filters=mt.prototype=i.pseudos,i.setFilters=new mt,nt.attr=v.attr,v.find=nt,v.expr=nt.selectors,v.expr[":"]=v.expr.pseudos,v.unique=nt.uniqueSort,v.text=nt.getText,v.isXMLDoc=nt.isXML,v.contains=nt.contains}(e);var nt=/Until$/,rt=/^(?:parents|prev(?:Until|All))/,it=/^.[^:#\[\.,]*$/,st=v.expr.match.needsContext,ot={children:!0,contents:!0,next:!0,prev:!0};v.fn.extend({find:function(e){var t,n,r,i,s,o,u=this;if(typeof e!="string")return v(e).filter(function(){for(t=0,n=u.length;t<n;t++)if(v.contains(u[t],this))return!0});o=this.pushStack("","find",e);for(t=0,n=this.length;t<n;t++){r=o.length,v.find(e,this[t],o);if(t>0)for(i=r;i<o.length;i++)for(s=0;s<r;s++)if(o[s]===o[i]){o.splice(i--,1);break}}return o},has:function(e){var t,n=v(e,this),r=n.length;return this.filter(function(){for(t=0;t<r;t++)if(v.contains(this,n[t]))return!0})},not:function(e){return this.pushStack(ft(this,e,!1),"not",e)},filter:function(e){return this.pushStack(ft(this,e,!0),"filter",e)},is:function(e){return!!e&&(typeof e=="string"?st.test(e)?v(e,this.context).index(this[0])>=0:v.filter(e,this).length>0:this.filter(e).length>0)},closest:function(e,t){var n,r=0,i=this.length,s=[],o=st.test(e)||typeof e!="string"?v(e,t||this.context):0;for(;r<i;r++){n=this[r];while(n&&n.ownerDocument&&n!==t&&n.nodeType!==11){if(o?o.index(n)>-1:v.find.matchesSelector(n,e)){s.push(n);break}n=n.parentNode}}return s=s.length>1?v.unique(s):s,this.pushStack(s,"closest",e)},index:function(e){return e?typeof e=="string"?v.inArray(this[0],v(e)):v.inArray(e.jquery?e[0]:e,this):this[0]&&this[0].parentNode?this.prevAll().length:-1},add:function(e,t){var n=typeof e=="string"?v(e,t):v.makeArray(e&&e.nodeType?[e]:e),r=v.merge(this.get(),n);return this.pushStack(ut(n[0])||ut(r[0])?r:v.unique(r))},addBack:function(e){return this.add(e==null?this.prevObject:this.prevObject.filter(e))}}),v.fn.andSelf=v.fn.addBack,v.each({parent:function(e){var t=e.parentNode;return t&&t.nodeType!==11?t:null},parents:function(e){return v.dir(e,"parentNode")},parentsUntil:function(e,t,n){return v.dir(e,"parentNode",n)},next:function(e){return at(e,"nextSibling")},prev:function(e){return at(e,"previousSibling")},nextAll:function(e){return v.dir(e,"nextSibling")},prevAll:function(e){return v.dir(e,"previousSibling")},nextUntil:function(e,t,n){return v.dir(e,"nextSibling",n)},prevUntil:function(e,t,n){return v.dir(e,"previousSibling",n)},siblings:function(e){return v.sibling((e.parentNode||{}).firstChild,e)},children:function(e){return v.sibling(e.firstChild)},contents:function(e){return v.nodeName(e,"iframe")?e.contentDocument||e.contentWindow.document:v.merge([],e.childNodes)}},function(e,t){v.fn[e]=function(n,r){var i=v.map(this,t,n);return nt.test(e)||(r=n),r&&typeof r=="string"&&(i=v.filter(r,i)),i=this.length>1&&!ot[e]?v.unique(i):i,this.length>1&&rt.test(e)&&(i=i.reverse()),this.pushStack(i,e,l.call(arguments).join(","))}}),v.extend({filter:function(e,t,n){return n&&(e=":not("+e+")"),t.length===1?v.find.matchesSelector(t[0],e)?[t[0]]:[]:v.find.matches(e,t)},dir:function(e,n,r){var i=[],s=e[n];while(s&&s.nodeType!==9&&(r===t||s.nodeType!==1||!v(s).is(r)))s.nodeType===1&&i.push(s),s=s[n];return i},sibling:function(e,t){var n=[];for(;e;e=e.nextSibling)e.nodeType===1&&e!==t&&n.push(e);return n}});var ct="abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",ht=/ jQuery\d+="(?:null|\d+)"/g,pt=/^\s+/,dt=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,vt=/<([\w:]+)/,mt=/<tbody/i,gt=/<|&#?\w+;/,yt=/<(?:script|style|link)/i,bt=/<(?:script|object|embed|option|style)/i,wt=new RegExp("<(?:"+ct+")[\\s/>]","i"),Et=/^(?:checkbox|radio)$/,St=/checked\s*(?:[^=]|=\s*.checked.)/i,xt=/\/(java|ecma)script/i,Tt=/^\s*<!(?:\[CDATA\[|\-\-)|[\]\-]{2}>\s*$/g,Nt={option:[1,"<select multiple='multiple'>","</select>"],legend:[1,"<fieldset>","</fieldset>"],thead:[1,"<table>","</table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],col:[2,"<table><tbody></tbody><colgroup>","</colgroup></table>"],area:[1,"<map>","</map>"],_default:[0,"",""]},Ct=lt(i),kt=Ct.appendChild(i.createElement("div"));Nt.optgroup=Nt.option,Nt.tbody=Nt.tfoot=Nt.colgroup=Nt.caption=Nt.thead,Nt.th=Nt.td,v.support.htmlSerialize||(Nt._default=[1,"X<div>","</div>"]),v.fn.extend({text:function(e){return v.access(this,function(e){return e===t?v.text(this):this.empty().append((this[0]&&this[0].ownerDocument||i).createTextNode(e))},null,e,arguments.length)},wrapAll:function(e){if(v.isFunction(e))return this.each(function(t){v(this).wrapAll(e.call(this,t))});if(this[0]){var t=v(e,this[0].ownerDocument).eq(0).clone(!0);this[0].parentNode&&t.insertBefore(this[0]),t.map(function(){var e=this;while(e.firstChild&&e.firstChild.nodeType===1)e=e.firstChild;return e}).append(this)}return this},wrapInner:function(e){return v.isFunction(e)?this.each(function(t){v(this).wrapInner(e.call(this,t))}):this.each(function(){var t=v(this),n=t.contents();n.length?n.wrapAll(e):t.append(e)})},wrap:function(e){var t=v.isFunction(e);return this.each(function(n){v(this).wrapAll(t?e.call(this,n):e)})},unwrap:function(){return this.parent().each(function(){v.nodeName(this,"body")||v(this).replaceWith(this.childNodes)}).end()},append:function(){return this.domManip(arguments,!0,function(e){(this.nodeType===1||this.nodeType===11)&&this.appendChild(e)})},prepend:function(){return this.domManip(arguments,!0,function(e){(this.nodeType===1||this.nodeType===11)&&this.insertBefore(e,this.firstChild)})},before:function(){if(!ut(this[0]))return this.domManip(arguments,!1,function(e){this.parentNode.insertBefore(e,this)});if(arguments.length){var e=v.clean(arguments);return this.pushStack(v.merge(e,this),"before",this.selector)}},after:function(){if(!ut(this[0]))return this.domManip(arguments,!1,function(e){this.parentNode.insertBefore(e,this.nextSibling)});if(arguments.length){var e=v.clean(arguments);return this.pushStack(v.merge(this,e),"after",this.selector)}},remove:function(e,t){var n,r=0;for(;(n=this[r])!=null;r++)if(!e||v.filter(e,[n]).length)!t&&n.nodeType===1&&(v.cleanData(n.getElementsByTagName("*")),v.cleanData([n])),n.parentNode&&n.parentNode.removeChild(n);return this},empty:function(){var e,t=0;for(;(e=this[t])!=null;t++){e.nodeType===1&&v.cleanData(e.getElementsByTagName("*"));while(e.firstChild)e.removeChild(e.firstChild)}return this},clone:function(e,t){return e=e==null?!1:e,t=t==null?e:t,this.map(function(){return v.clone(this,e,t)})},html:function(e){return v.access(this,function(e){var n=this[0]||{},r=0,i=this.length;if(e===t)return n.nodeType===1?n.innerHTML.replace(ht,""):t;if(typeof e=="string"&&!yt.test(e)&&(v.support.htmlSerialize||!wt.test(e))&&(v.support.leadingWhitespace||!pt.test(e))&&!Nt[(vt.exec(e)||["",""])[1].toLowerCase()]){e=e.replace(dt,"<$1></$2>");try{for(;r<i;r++)n=this[r]||{},n.nodeType===1&&(v.cleanData(n.getElementsByTagName("*")),n.innerHTML=e);n=0}catch(s){}}n&&this.empty().append(e)},null,e,arguments.length)},replaceWith:function(e){return ut(this[0])?this.length?this.pushStack(v(v.isFunction(e)?e():e),"replaceWith",e):this:v.isFunction(e)?this.each(function(t){var n=v(this),r=n.html();n.replaceWith(e.call(this,t,r))}):(typeof e!="string"&&(e=v(e).detach()),this.each(function(){var t=this.nextSibling,n=this.parentNode;v(this).remove(),t?v(t).before(e):v(n).append(e)}))},detach:function(e){return this.remove(e,!0)},domManip:function(e,n,r){e=[].concat.apply([],e);var i,s,o,u,a=0,f=e[0],l=[],c=this.length;if(!v.support.checkClone&&c>1&&typeof f=="string"&&St.test(f))return this.each(function(){v(this).domManip(e,n,r)});if(v.isFunction(f))return this.each(function(i){var s=v(this);e[0]=f.call(this,i,n?s.html():t),s.domManip(e,n,r)});if(this[0]){i=v.buildFragment(e,this,l),o=i.fragment,s=o.firstChild,o.childNodes.length===1&&(o=s);if(s){n=n&&v.nodeName(s,"tr");for(u=i.cacheable||c-1;a<c;a++)r.call(n&&v.nodeName(this[a],"table")?Lt(this[a],"tbody"):this[a],a===u?o:v.clone(o,!0,!0))}o=s=null,l.length&&v.each(l,function(e,t){t.src?v.ajax?v.ajax({url:t.src,type:"GET",dataType:"script",async:!1,global:!1,"throws":!0}):v.error("no ajax"):v.globalEval((t.text||t.textContent||t.innerHTML||"").replace(Tt,"")),t.parentNode&&t.parentNode.removeChild(t)})}return this}}),v.buildFragment=function(e,n,r){var s,o,u,a=e[0];return n=n||i,n=!n.nodeType&&n[0]||n,n=n.ownerDocument||n,e.length===1&&typeof a=="string"&&a.length<512&&n===i&&a.charAt(0)==="<"&&!bt.test(a)&&(v.support.checkClone||!St.test(a))&&(v.support.html5Clone||!wt.test(a))&&(o=!0,s=v.fragments[a],u=s!==t),s||(s=n.createDocumentFragment(),v.clean(e,n,s,r),o&&(v.fragments[a]=u&&s)),{fragment:s,cacheable:o}},v.fragments={},v.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(e,t){v.fn[e]=function(n){var r,i=0,s=[],o=v(n),u=o.length,a=this.length===1&&this[0].parentNode;if((a==null||a&&a.nodeType===11&&a.childNodes.length===1)&&u===1)return o[t](this[0]),this;for(;i<u;i++)r=(i>0?this.clone(!0):this).get(),v(o[i])[t](r),s=s.concat(r);return this.pushStack(s,e,o.selector)}}),v.extend({clone:function(e,t,n){var r,i,s,o;v.support.html5Clone||v.isXMLDoc(e)||!wt.test("<"+e.nodeName+">")?o=e.cloneNode(!0):(kt.innerHTML=e.outerHTML,kt.removeChild(o=kt.firstChild));if((!v.support.noCloneEvent||!v.support.noCloneChecked)&&(e.nodeType===1||e.nodeType===11)&&!v.isXMLDoc(e)){Ot(e,o),r=Mt(e),i=Mt(o);for(s=0;r[s];++s)i[s]&&Ot(r[s],i[s])}if(t){At(e,o);if(n){r=Mt(e),i=Mt(o);for(s=0;r[s];++s)At(r[s],i[s])}}return r=i=null,o},clean:function(e,t,n,r){var s,o,u,a,f,l,c,h,p,d,m,g,y=t===i&&Ct,b=[];if(!t||typeof t.createDocumentFragment=="undefined")t=i;for(s=0;(u=e[s])!=null;s++){typeof u=="number"&&(u+="");if(!u)continue;if(typeof u=="string")if(!gt.test(u))u=t.createTextNode(u);else{y=y||lt(t),c=t.createElement("div"),y.appendChild(c),u=u.replace(dt,"<$1></$2>"),a=(vt.exec(u)||["",""])[1].toLowerCase(),f=Nt[a]||Nt._default,l=f[0],c.innerHTML=f[1]+u+f[2];while(l--)c=c.lastChild;if(!v.support.tbody){h=mt.test(u),p=a==="table"&&!h?c.firstChild&&c.firstChild.childNodes:f[1]==="<table>"&&!h?c.childNodes:[];for(o=p.length-1;o>=0;--o)v.nodeName(p[o],"tbody")&&!p[o].childNodes.length&&p[o].parentNode.removeChild(p[o])}!v.support.leadingWhitespace&&pt.test(u)&&c.insertBefore(t.createTextNode(pt.exec(u)[0]),c.firstChild),u=c.childNodes,c.parentNode.removeChild(c)}u.nodeType?b.push(u):v.merge(b,u)}c&&(u=c=y=null);if(!v.support.appendChecked)for(s=0;(u=b[s])!=null;s++)v.nodeName(u,"input")?_t(u):typeof u.getElementsByTagName!="undefined"&&v.grep(u.getElementsByTagName("input"),_t);if(n){m=function(e){if(!e.type||xt.test(e.type))return r?r.push(e.parentNode?e.parentNode.removeChild(e):e):n.appendChild(e)};for(s=0;(u=b[s])!=null;s++)if(!v.nodeName(u,"script")||!m(u))n.appendChild(u),typeof u.getElementsByTagName!="undefined"&&(g=v.grep(v.merge([],u.getElementsByTagName("script")),m),b.splice.apply(b,[s+1,0].concat(g)),s+=g.length)}return b},cleanData:function(e,t){var n,r,i,s,o=0,u=v.expando,a=v.cache,f=v.support.deleteExpando,l=v.event.special;for(;(i=e[o])!=null;o++)if(t||v.acceptData(i)){r=i[u],n=r&&a[r];if(n){if(n.events)for(s in n.events)l[s]?v.event.remove(i,s):v.removeEvent(i,s,n.handle);a[r]&&(delete a[r],f?delete i[u]:i.removeAttribute?i.removeAttribute(u):i[u]=null,v.deletedIds.push(r))}}}}),function(){var e,t;v.uaMatch=function(e){e=e.toLowerCase();var t=/(chrome)[ \/]([\w.]+)/.exec(e)||/(webkit)[ \/]([\w.]+)/.exec(e)||/(opera)(?:.*version|)[ \/]([\w.]+)/.exec(e)||/(msie) ([\w.]+)/.exec(e)||e.indexOf("compatible")<0&&/(mozilla)(?:.*? rv:([\w.]+)|)/.exec(e)||[];return{browser:t[1]||"",version:t[2]||"0"}},e=v.uaMatch(o.userAgent),t={},e.browser&&(t[e.browser]=!0,t.version=e.version),t.chrome?t.webkit=!0:t.webkit&&(t.safari=!0),v.browser=t,v.sub=function(){function e(t,n){return new e.fn.init(t,n)}v.extend(!0,e,this),e.superclass=this,e.fn=e.prototype=this(),e.fn.constructor=e,e.sub=this.sub,e.fn.init=function(r,i){return i&&i instanceof v&&!(i instanceof e)&&(i=e(i)),v.fn.init.call(this,r,i,t)},e.fn.init.prototype=e.fn;var t=e(i);return e}}();var Dt,Pt,Ht,Bt=/alpha\([^)]*\)/i,jt=/opacity=([^)]*)/,Ft=/^(top|right|bottom|left)$/,It=/^(none|table(?!-c[ea]).+)/,qt=/^margin/,Rt=new RegExp("^("+m+")(.*)$","i"),Ut=new RegExp("^("+m+")(?!px)[a-z%]+$","i"),zt=new RegExp("^([-+])=("+m+")","i"),Wt={BODY:"block"},Xt={position:"absolute",visibility:"hidden",display:"block"},Vt={letterSpacing:0,fontWeight:400},$t=["Top","Right","Bottom","Left"],Jt=["Webkit","O","Moz","ms"],Kt=v.fn.toggle;v.fn.extend({css:function(e,n){return v.access(this,function(e,n,r){return r!==t?v.style(e,n,r):v.css(e,n)},e,n,arguments.length>1)},show:function(){return Yt(this,!0)},hide:function(){return Yt(this)},toggle:function(e,t){var n=typeof e=="boolean";return v.isFunction(e)&&v.isFunction(t)?Kt.apply(this,arguments):this.each(function(){(n?e:Gt(this))?v(this).show():v(this).hide()})}}),v.extend({cssHooks:{opacity:{get:function(e,t){if(t){var n=Dt(e,"opacity");return n===""?"1":n}}}},cssNumber:{fillOpacity:!0,fontWeight:!0,lineHeight:!0,opacity:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{"float":v.support.cssFloat?"cssFloat":"styleFloat"},style:function(e,n,r,i){if(!e||e.nodeType===3||e.nodeType===8||!e.style)return;var s,o,u,a=v.camelCase(n),f=e.style;n=v.cssProps[a]||(v.cssProps[a]=Qt(f,a)),u=v.cssHooks[n]||v.cssHooks[a];if(r===t)return u&&"get"in u&&(s=u.get(e,!1,i))!==t?s:f[n];o=typeof r,o==="string"&&(s=zt.exec(r))&&(r=(s[1]+1)*s[2]+parseFloat(v.css(e,n)),o="number");if(r==null||o==="number"&&isNaN(r))return;o==="number"&&!v.cssNumber[a]&&(r+="px");if(!u||!("set"in u)||(r=u.set(e,r,i))!==t)try{f[n]=r}catch(l){}},css:function(e,n,r,i){var s,o,u,a=v.camelCase(n);return n=v.cssProps[a]||(v.cssProps[a]=Qt(e.style,a)),u=v.cssHooks[n]||v.cssHooks[a],u&&"get"in u&&(s=u.get(e,!0,i)),s===t&&(s=Dt(e,n)),s==="normal"&&n in Vt&&(s=Vt[n]),r||i!==t?(o=parseFloat(s),r||v.isNumeric(o)?o||0:s):s},swap:function(e,t,n){var r,i,s={};for(i in t)s[i]=e.style[i],e.style[i]=t[i];r=n.call(e);for(i in t)e.style[i]=s[i];return r}}),e.getComputedStyle?Dt=function(t,n){var r,i,s,o,u=e.getComputedStyle(t,null),a=t.style;return u&&(r=u.getPropertyValue(n)||u[n],r===""&&!v.contains(t.ownerDocument,t)&&(r=v.style(t,n)),Ut.test(r)&&qt.test(n)&&(i=a.width,s=a.minWidth,o=a.maxWidth,a.minWidth=a.maxWidth=a.width=r,r=u.width,a.width=i,a.minWidth=s,a.maxWidth=o)),r}:i.documentElement.currentStyle&&(Dt=function(e,t){var n,r,i=e.currentStyle&&e.currentStyle[t],s=e.style;return i==null&&s&&s[t]&&(i=s[t]),Ut.test(i)&&!Ft.test(t)&&(n=s.left,r=e.runtimeStyle&&e.runtimeStyle.left,r&&(e.runtimeStyle.left=e.currentStyle.left),s.left=t==="fontSize"?"1em":i,i=s.pixelLeft+"px",s.left=n,r&&(e.runtimeStyle.left=r)),i===""?"auto":i}),v.each(["height","width"],function(e,t){v.cssHooks[t]={get:function(e,n,r){if(n)return e.offsetWidth===0&&It.test(Dt(e,"display"))?v.swap(e,Xt,function(){return tn(e,t,r)}):tn(e,t,r)},set:function(e,n,r){return Zt(e,n,r?en(e,t,r,v.support.boxSizing&&v.css(e,"boxSizing")==="border-box"):0)}}}),v.support.opacity||(v.cssHooks.opacity={get:function(e,t){return jt.test((t&&e.currentStyle?e.currentStyle.filter:e.style.filter)||"")?.01*parseFloat(RegExp.$1)+"":t?"1":""},set:function(e,t){var n=e.style,r=e.currentStyle,i=v.isNumeric(t)?"alpha(opacity="+t*100+")":"",s=r&&r.filter||n.filter||"";n.zoom=1;if(t>=1&&v.trim(s.replace(Bt,""))===""&&n.removeAttribute){n.removeAttribute("filter");if(r&&!r.filter)return}n.filter=Bt.test(s)?s.replace(Bt,i):s+" "+i}}),v(function(){v.support.reliableMarginRight||(v.cssHooks.marginRight={get:function(e,t){return v.swap(e,{display:"inline-block"},function(){if(t)return Dt(e,"marginRight")})}}),!v.support.pixelPosition&&v.fn.position&&v.each(["top","left"],function(e,t){v.cssHooks[t]={get:function(e,n){if(n){var r=Dt(e,t);return Ut.test(r)?v(e).position()[t]+"px":r}}}})}),v.expr&&v.expr.filters&&(v.expr.filters.hidden=function(e){return e.offsetWidth===0&&e.offsetHeight===0||!v.support.reliableHiddenOffsets&&(e.style&&e.style.display||Dt(e,"display"))==="none"},v.expr.filters.visible=function(e){return!v.expr.filters.hidden(e)}),v.each({margin:"",padding:"",border:"Width"},function(e,t){v.cssHooks[e+t]={expand:function(n){var r,i=typeof n=="string"?n.split(" "):[n],s={};for(r=0;r<4;r++)s[e+$t[r]+t]=i[r]||i[r-2]||i[0];return s}},qt.test(e)||(v.cssHooks[e+t].set=Zt)});var rn=/%20/g,sn=/\[\]$/,on=/\r?\n/g,un=/^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,an=/^(?:select|textarea)/i;v.fn.extend({serialize:function(){return v.param(this.serializeArray())},serializeArray:function(){return this.map(function(){return this.elements?v.makeArray(this.elements):this}).filter(function(){return this.name&&!this.disabled&&(this.checked||an.test(this.nodeName)||un.test(this.type))}).map(function(e,t){var n=v(this).val();return n==null?null:v.isArray(n)?v.map(n,function(e,n){return{name:t.name,value:e.replace(on,"\r\n")}}):{name:t.name,value:n.replace(on,"\r\n")}}).get()}}),v.param=function(e,n){var r,i=[],s=function(e,t){t=v.isFunction(t)?t():t==null?"":t,i[i.length]=encodeURIComponent(e)+"="+encodeURIComponent(t)};n===t&&(n=v.ajaxSettings&&v.ajaxSettings.traditional);if(v.isArray(e)||e.jquery&&!v.isPlainObject(e))v.each(e,function(){s(this.name,this.value)});else for(r in e)fn(r,e[r],n,s);return i.join("&").replace(rn,"+")};var ln,cn,hn=/#.*$/,pn=/^(.*?):[ \t]*([^\r\n]*)\r?$/mg,dn=/^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/,vn=/^(?:GET|HEAD)$/,mn=/^\/\//,gn=/\?/,yn=/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,bn=/([?&])_=[^&]*/,wn=/^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,En=v.fn.load,Sn={},xn={},Tn=["*/"]+["*"];try{cn=s.href}catch(Nn){cn=i.createElement("a"),cn.href="",cn=cn.href}ln=wn.exec(cn.toLowerCase())||[],v.fn.load=function(e,n,r){if(typeof e!="string"&&En)return En.apply(this,arguments);if(!this.length)return this;var i,s,o,u=this,a=e.indexOf(" ");return a>=0&&(i=e.slice(a,e.length),e=e.slice(0,a)),v.isFunction(n)?(r=n,n=t):n&&typeof n=="object"&&(s="POST"),v.ajax({url:e,type:s,dataType:"html",data:n,complete:function(e,t){r&&u.each(r,o||[e.responseText,t,e])}}).done(function(e){o=arguments,u.html(i?v("<div>").append(e.replace(yn,"")).find(i):e)}),this},v.each("ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split(" "),function(e,t){v.fn[t]=function(e){return this.on(t,e)}}),v.each(["get","post"],function(e,n){v[n]=function(e,r,i,s){return v.isFunction(r)&&(s=s||i,i=r,r=t),v.ajax({type:n,url:e,data:r,success:i,dataType:s})}}),v.extend({getScript:function(e,n){return v.get(e,t,n,"script")},getJSON:function(e,t,n){return v.get(e,t,n,"json")},ajaxSetup:function(e,t){return t?Ln(e,v.ajaxSettings):(t=e,e=v.ajaxSettings),Ln(e,t),e},ajaxSettings:{url:cn,isLocal:dn.test(ln[1]),global:!0,type:"GET",contentType:"application/x-www-form-urlencoded; charset=UTF-8",processData:!0,async:!0,accepts:{xml:"application/xml, text/xml",html:"text/html",text:"text/plain",json:"application/json, text/javascript","*":Tn},contents:{xml:/xml/,html:/html/,json:/json/},responseFields:{xml:"responseXML",text:"responseText"},converters:{"* text":e.String,"text html":!0,"text json":v.parseJSON,"text xml":v.parseXML},flatOptions:{context:!0,url:!0}},ajaxPrefilter:Cn(Sn),ajaxTransport:Cn(xn),ajax:function(e,n){function T(e,n,s,a){var l,y,b,w,S,T=n;if(E===2)return;E=2,u&&clearTimeout(u),o=t,i=a||"",x.readyState=e>0?4:0,s&&(w=An(c,x,s));if(e>=200&&e<300||e===304)c.ifModified&&(S=x.getResponseHeader("Last-Modified"),S&&(v.lastModified[r]=S),S=x.getResponseHeader("Etag"),S&&(v.etag[r]=S)),e===304?(T="notmodified",l=!0):(l=On(c,w),T=l.state,y=l.data,b=l.error,l=!b);else{b=T;if(!T||e)T="error",e<0&&(e=0)}x.status=e,x.statusText=(n||T)+"",l?d.resolveWith(h,[y,T,x]):d.rejectWith(h,[x,T,b]),x.statusCode(g),g=t,f&&p.trigger("ajax"+(l?"Success":"Error"),[x,c,l?y:b]),m.fireWith(h,[x,T]),f&&(p.trigger("ajaxComplete",[x,c]),--v.active||v.event.trigger("ajaxStop"))}typeof e=="object"&&(n=e,e=t),n=n||{};var r,i,s,o,u,a,f,l,c=v.ajaxSetup({},n),h=c.context||c,p=h!==c&&(h.nodeType||h instanceof v)?v(h):v.event,d=v.Deferred(),m=v.Callbacks("once memory"),g=c.statusCode||{},b={},w={},E=0,S="canceled",x={readyState:0,setRequestHeader:function(e,t){if(!E){var n=e.toLowerCase();e=w[n]=w[n]||e,b[e]=t}return this},getAllResponseHeaders:function(){return E===2?i:null},getResponseHeader:function(e){var n;if(E===2){if(!s){s={};while(n=pn.exec(i))s[n[1].toLowerCase()]=n[2]}n=s[e.toLowerCase()]}return n===t?null:n},overrideMimeType:function(e){return E||(c.mimeType=e),this},abort:function(e){return e=e||S,o&&o.abort(e),T(0,e),this}};d.promise(x),x.success=x.done,x.error=x.fail,x.complete=m.add,x.statusCode=function(e){if(e){var t;if(E<2)for(t in e)g[t]=[g[t],e[t]];else t=e[x.status],x.always(t)}return this},c.url=((e||c.url)+"").replace(hn,"").replace(mn,ln[1]+"//"),c.dataTypes=v.trim(c.dataType||"*").toLowerCase().split(y),c.crossDomain==null&&(a=wn.exec(c.url.toLowerCase()),c.crossDomain=!(!a||a[1]===ln[1]&&a[2]===ln[2]&&(a[3]||(a[1]==="http:"?80:443))==(ln[3]||(ln[1]==="http:"?80:443)))),c.data&&c.processData&&typeof c.data!="string"&&(c.data=v.param(c.data,c.traditional)),kn(Sn,c,n,x);if(E===2)return x;f=c.global,c.type=c.type.toUpperCase(),c.hasContent=!vn.test(c.type),f&&v.active++===0&&v.event.trigger("ajaxStart");if(!c.hasContent){c.data&&(c.url+=(gn.test(c.url)?"&":"?")+c.data,delete c.data),r=c.url;if(c.cache===!1){var N=v.now(),C=c.url.replace(bn,"$1_="+N);c.url=C+(C===c.url?(gn.test(c.url)?"&":"?")+"_="+N:"")}}(c.data&&c.hasContent&&c.contentType!==!1||n.contentType)&&x.setRequestHeader("Content-Type",c.contentType),c.ifModified&&(r=r||c.url,v.lastModified[r]&&x.setRequestHeader("If-Modified-Since",v.lastModified[r]),v.etag[r]&&x.setRequestHeader("If-None-Match",v.etag[r])),x.setRequestHeader("Accept",c.dataTypes[0]&&c.accepts[c.dataTypes[0]]?c.accepts[c.dataTypes[0]]+(c.dataTypes[0]!=="*"?", "+Tn+"; q=0.01":""):c.accepts["*"]);for(l in c.headers)x.setRequestHeader(l,c.headers[l]);if(!c.beforeSend||c.beforeSend.call(h,x,c)!==!1&&E!==2){S="abort";for(l in{success:1,error:1,complete:1})x[l](c[l]);o=kn(xn,c,n,x);if(!o)T(-1,"No Transport");else{x.readyState=1,f&&p.trigger("ajaxSend",[x,c]),c.async&&c.timeout>0&&(u=setTimeout(function(){x.abort("timeout")},c.timeout));try{E=1,o.send(b,T)}catch(k){if(!(E<2))throw k;T(-1,k)}}return x}return x.abort()},active:0,lastModified:{},etag:{}});var Mn=[],_n=/\?/,Dn=/(=)\?(?=&|$)|\?\?/,Pn=v.now();v.ajaxSetup({jsonp:"callback",jsonpCallback:function(){var e=Mn.pop()||v.expando+"_"+Pn++;return this[e]=!0,e}}),v.ajaxPrefilter("json jsonp",function(n,r,i){var s,o,u,a=n.data,f=n.url,l=n.jsonp!==!1,c=l&&Dn.test(f),h=l&&!c&&typeof a=="string"&&!(n.contentType||"").indexOf("application/x-www-form-urlencoded")&&Dn.test(a);if(n.dataTypes[0]==="jsonp"||c||h)return s=n.jsonpCallback=v.isFunction(n.jsonpCallback)?n.jsonpCallback():n.jsonpCallback,o=e[s],c?n.url=f.replace(Dn,"$1"+s):h?n.data=a.replace(Dn,"$1"+s):l&&(n.url+=(_n.test(f)?"&":"?")+n.jsonp+"="+s),n.converters["script json"]=function(){return u||v.error(s+" was not called"),u[0]},n.dataTypes[0]="json",e[s]=function(){u=arguments},i.always(function(){e[s]=o,n[s]&&(n.jsonpCallback=r.jsonpCallback,Mn.push(s)),u&&v.isFunction(o)&&o(u[0]),u=o=t}),"script"}),v.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/javascript|ecmascript/},converters:{"text script":function(e){return v.globalEval(e),e}}}),v.ajaxPrefilter("script",function(e){e.cache===t&&(e.cache=!1),e.crossDomain&&(e.type="GET",e.global=!1)}),v.ajaxTransport("script",function(e){if(e.crossDomain){var n,r=i.head||i.getElementsByTagName("head")[0]||i.documentElement;return{send:function(s,o){n=i.createElement("script"),n.async="async",e.scriptCharset&&(n.charset=e.scriptCharset),n.src=e.url,n.onload=n.onreadystatechange=function(e,i){if(i||!n.readyState||/loaded|complete/.test(n.readyState))n.onload=n.onreadystatechange=null,r&&n.parentNode&&r.removeChild(n),n=t,i||o(200,"success")},r.insertBefore(n,r.firstChild)},abort:function(){n&&n.onload(0,1)}}}});var Hn,Bn=e.ActiveXObject?function(){for(var e in Hn)Hn[e](0,1)}:!1,jn=0;v.ajaxSettings.xhr=e.ActiveXObject?function(){return!this.isLocal&&Fn()||In()}:Fn,function(e){v.extend(v.support,{ajax:!!e,cors:!!e&&"withCredentials"in e})}(v.ajaxSettings.xhr()),v.support.ajax&&v.ajaxTransport(function(n){if(!n.crossDomain||v.support.cors){var r;return{send:function(i,s){var o,u,a=n.xhr();n.username?a.open(n.type,n.url,n.async,n.username,n.password):a.open(n.type,n.url,n.async);if(n.xhrFields)for(u in n.xhrFields)a[u]=n.xhrFields[u];n.mimeType&&a.overrideMimeType&&a.overrideMimeType(n.mimeType),!n.crossDomain&&!i["X-Requested-With"]&&(i["X-Requested-With"]="XMLHttpRequest");try{for(u in i)a.setRequestHeader(u,i[u])}catch(f){}a.send(n.hasContent&&n.data||null),r=function(e,i){var u,f,l,c,h;try{if(r&&(i||a.readyState===4)){r=t,o&&(a.onreadystatechange=v.noop,Bn&&delete Hn[o]);if(i)a.readyState!==4&&a.abort();else{u=a.status,l=a.getAllResponseHeaders(),c={},h=a.responseXML,h&&h.documentElement&&(c.xml=h);try{c.text=a.responseText}catch(p){}try{f=a.statusText}catch(p){f=""}!u&&n.isLocal&&!n.crossDomain?u=c.text?200:404:u===1223&&(u=204)}}}catch(d){i||s(-1,d)}c&&s(u,f,c,l)},n.async?a.readyState===4?setTimeout(r,0):(o=++jn,Bn&&(Hn||(Hn={},v(e).unload(Bn)),Hn[o]=r),a.onreadystatechange=r):r()},abort:function(){r&&r(0,1)}}}});var qn,Rn,Un=/^(?:toggle|show|hide)$/,zn=new RegExp("^(?:([-+])=|)("+m+")([a-z%]*)$","i"),Wn=/queueHooks$/,Xn=[Gn],Vn={"*":[function(e,t){var n,r,i=this.createTween(e,t),s=zn.exec(t),o=i.cur(),u=+o||0,a=1,f=20;if(s){n=+s[2],r=s[3]||(v.cssNumber[e]?"":"px");if(r!=="px"&&u){u=v.css(i.elem,e,!0)||n||1;do a=a||".5",u/=a,v.style(i.elem,e,u+r);while(a!==(a=i.cur()/o)&&a!==1&&--f)}i.unit=r,i.start=u,i.end=s[1]?u+(s[1]+1)*n:n}return i}]};v.Animation=v.extend(Kn,{tweener:function(e,t){v.isFunction(e)?(t=e,e=["*"]):e=e.split(" ");var n,r=0,i=e.length;for(;r<i;r++)n=e[r],Vn[n]=Vn[n]||[],Vn[n].unshift(t)},prefilter:function(e,t){t?Xn.unshift(e):Xn.push(e)}}),v.Tween=Yn,Yn.prototype={constructor:Yn,init:function(e,t,n,r,i,s){this.elem=e,this.prop=n,this.easing=i||"swing",this.options=t,this.start=this.now=this.cur(),this.end=r,this.unit=s||(v.cssNumber[n]?"":"px")},cur:function(){var e=Yn.propHooks[this.prop];return e&&e.get?e.get(this):Yn.propHooks._default.get(this)},run:function(e){var t,n=Yn.propHooks[this.prop];return this.options.duration?this.pos=t=v.easing[this.easing](e,this.options.duration*e,0,1,this.options.duration):this.pos=t=e,this.now=(this.end-this.start)*t+this.start,this.options.step&&this.options.step.call(this.elem,this.now,this),n&&n.set?n.set(this):Yn.propHooks._default.set(this),this}},Yn.prototype.init.prototype=Yn.prototype,Yn.propHooks={_default:{get:function(e){var t;return e.elem[e.prop]==null||!!e.elem.style&&e.elem.style[e.prop]!=null?(t=v.css(e.elem,e.prop,!1,""),!t||t==="auto"?0:t):e.elem[e.prop]},set:function(e){v.fx.step[e.prop]?v.fx.step[e.prop](e):e.elem.style&&(e.elem.style[v.cssProps[e.prop]]!=null||v.cssHooks[e.prop])?v.style(e.elem,e.prop,e.now+e.unit):e.elem[e.prop]=e.now}}},Yn.propHooks.scrollTop=Yn.propHooks.scrollLeft={set:function(e){e.elem.nodeType&&e.elem.parentNode&&(e.elem[e.prop]=e.now)}},v.each(["toggle","show","hide"],function(e,t){var n=v.fn[t];v.fn[t]=function(r,i,s){return r==null||typeof r=="boolean"||!e&&v.isFunction(r)&&v.isFunction(i)?n.apply(this,arguments):this.animate(Zn(t,!0),r,i,s)}}),v.fn.extend({fadeTo:function(e,t,n,r){return this.filter(Gt).css("opacity",0).show().end().animate({opacity:t},e,n,r)},animate:function(e,t,n,r){var i=v.isEmptyObject(e),s=v.speed(t,n,r),o=function(){var t=Kn(this,v.extend({},e),s);i&&t.stop(!0)};return i||s.queue===!1?this.each(o):this.queue(s.queue,o)},stop:function(e,n,r){var i=function(e){var t=e.stop;delete e.stop,t(r)};return typeof e!="string"&&(r=n,n=e,e=t),n&&e!==!1&&this.queue(e||"fx",[]),this.each(function(){var t=!0,n=e!=null&&e+"queueHooks",s=v.timers,o=v._data(this);if(n)o[n]&&o[n].stop&&i(o[n]);else for(n in o)o[n]&&o[n].stop&&Wn.test(n)&&i(o[n]);for(n=s.length;n--;)s[n].elem===this&&(e==null||s[n].queue===e)&&(s[n].anim.stop(r),t=!1,s.splice(n,1));(t||!r)&&v.dequeue(this,e)})}}),v.each({slideDown:Zn("show"),slideUp:Zn("hide"),slideToggle:Zn("toggle"),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(e,t){v.fn[e]=function(e,n,r){return this.animate(t,e,n,r)}}),v.speed=function(e,t,n){var r=e&&typeof e=="object"?v.extend({},e):{complete:n||!n&&t||v.isFunction(e)&&e,duration:e,easing:n&&t||t&&!v.isFunction(t)&&t};r.duration=v.fx.off?0:typeof r.duration=="number"?r.duration:r.duration in v.fx.speeds?v.fx.speeds[r.duration]:v.fx.speeds._default;if(r.queue==null||r.queue===!0)r.queue="fx";return r.old=r.complete,r.complete=function(){v.isFunction(r.old)&&r.old.call(this),r.queue&&v.dequeue(this,r.queue)},r},v.easing={linear:function(e){return e},swing:function(e){return.5-Math.cos(e*Math.PI)/2}},v.timers=[],v.fx=Yn.prototype.init,v.fx.tick=function(){var e,n=v.timers,r=0;qn=v.now();for(;r<n.length;r++)e=n[r],!e()&&n[r]===e&&n.splice(r--,1);n.length||v.fx.stop(),qn=t},v.fx.timer=function(e){e()&&v.timers.push(e)&&!Rn&&(Rn=setInterval(v.fx.tick,v.fx.interval))},v.fx.interval=13,v.fx.stop=function(){clearInterval(Rn),Rn=null},v.fx.speeds={slow:600,fast:200,_default:400},v.fx.step={},v.expr&&v.expr.filters&&(v.expr.filters.animated=function(e){return v.grep(v.timers,function(t){return e===t.elem}).length});var er=/^(?:body|html)$/i;v.fn.offset=function(e){if(arguments.length)return e===t?this:this.each(function(t){v.offset.setOffset(this,e,t)});var n,r,i,s,o,u,a,f={top:0,left:0},l=this[0],c=l&&l.ownerDocument;if(!c)return;return(r=c.body)===l?v.offset.bodyOffset(l):(n=c.documentElement,v.contains(n,l)?(typeof l.getBoundingClientRect!="undefined"&&(f=l.getBoundingClientRect()),i=tr(c),s=n.clientTop||r.clientTop||0,o=n.clientLeft||r.clientLeft||0,u=i.pageYOffset||n.scrollTop,a=i.pageXOffset||n.scrollLeft,{top:f.top+u-s,left:f.left+a-o}):f)},v.offset={bodyOffset:function(e){var t=e.offsetTop,n=e.offsetLeft;return v.support.doesNotIncludeMarginInBodyOffset&&(t+=parseFloat(v.css(e,"marginTop"))||0,n+=parseFloat(v.css(e,"marginLeft"))||0),{top:t,left:n}},setOffset:function(e,t,n){var r=v.css(e,"position");r==="static"&&(e.style.position="relative");var i=v(e),s=i.offset(),o=v.css(e,"top"),u=v.css(e,"left"),a=(r==="absolute"||r==="fixed")&&v.inArray("auto",[o,u])>-1,f={},l={},c,h;a?(l=i.position(),c=l.top,h=l.left):(c=parseFloat(o)||0,h=parseFloat(u)||0),v.isFunction(t)&&(t=t.call(e,n,s)),t.top!=null&&(f.top=t.top-s.top+c),t.left!=null&&(f.left=t.left-s.left+h),"using"in t?t.using.call(e,f):i.css(f)}},v.fn.extend({position:function(){if(!this[0])return;var e=this[0],t=this.offsetParent(),n=this.offset(),r=er.test(t[0].nodeName)?{top:0,left:0}:t.offset();return n.top-=parseFloat(v.css(e,"marginTop"))||0,n.left-=parseFloat(v.css(e,"marginLeft"))||0,r.top+=parseFloat(v.css(t[0],"borderTopWidth"))||0,r.left+=parseFloat(v.css(t[0],"borderLeftWidth"))||0,{top:n.top-r.top,left:n.left-r.left}},offsetParent:function(){return this.map(function(){var e=this.offsetParent||i.body;while(e&&!er.test(e.nodeName)&&v.css(e,"position")==="static")e=e.offsetParent;return e||i.body})}}),v.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(e,n){var r=/Y/.test(n);v.fn[e]=function(i){return v.access(this,function(e,i,s){var o=tr(e);if(s===t)return o?n in o?o[n]:o.document.documentElement[i]:e[i];o?o.scrollTo(r?v(o).scrollLeft():s,r?s:v(o).scrollTop()):e[i]=s},e,i,arguments.length,null)}}),v.each({Height:"height",Width:"width"},function(e,n){v.each({padding:"inner"+e,content:n,"":"outer"+e},function(r,i){v.fn[i]=function(i,s){var o=arguments.length&&(r||typeof i!="boolean"),u=r||(i===!0||s===!0?"margin":"border");return v.access(this,function(n,r,i){var s;return v.isWindow(n)?n.document.documentElement["client"+e]:n.nodeType===9?(s=n.documentElement,Math.max(n.body["scroll"+e],s["scroll"+e],n.body["offset"+e],s["offset"+e],s["client"+e])):i===t?v.css(n,r,i,u):v.style(n,r,i,u)},n,o?i:t,o,null)}})}),e.jQuery=e.$=v,typeof define=="function"&&define.amd&&define.amd.jQuery&&define("jquery",[],function(){return v})})(window);
var jQ183 = jQuery.noConflict(true);            
/**
 * jVectorMap version 2.0.1
 *
 * Copyright 2011-2014, Kirill Lebedev
 *
 */

(function( $ ){
  var apiParams = {
        set: {
          colors: 1,
          values: 1,
          backgroundColor: 1,
          scaleColors: 1,
          normalizeFunction: 1,
          focus: 1
        },
        get: {
          selectedRegions: 1,
          selectedMarkers: 1,
          mapObject: 1,
          regionName: 1
        }
      };

  $.fn.vectorMap = function(options) {
    var map,
        methodName,
        map = this.children('.jvectormap-container').data('mapObject');

    if (options === 'addMap') {
      jvm.Map.maps[arguments[1]] = arguments[2];
    } else if ((options === 'set' || options === 'get') && apiParams[options][arguments[1]]) {
      methodName = arguments[1].charAt(0).toUpperCase()+arguments[1].substr(1);
      return map[options+methodName].apply(map, Array.prototype.slice.call(arguments, 2));
    } else {
      options = options || {};
      options.container = this;
      map = new jvm.Map(options);
    }

    return this;
  };
})( jQ183 );
/*! Copyright (c) 2013 Brandon Aaron (http://brandon.aaron.sh)
 * Licensed under the MIT License (LICENSE.txt).
 *
 * Version: 3.1.9
 *
 * Requires: jQuery 1.2.2+
 */

(function (factory) {
    if ( typeof define === 'function' && define.amd ) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node/CommonJS style for Browserify
        module.exports = factory;
    } else {
        // Browser globals
        factory(jQ183);
    }
}(function ($) {

    var toFix  = ['wheel', 'mousewheel', 'DOMMouseScroll', 'MozMousePixelScroll'],
        toBind = ( 'onwheel' in document || document.documentMode >= 9 ) ?
                    ['wheel'] : ['mousewheel', 'DomMouseScroll', 'MozMousePixelScroll'],
        slice  = Array.prototype.slice,
        nullLowestDeltaTimeout, lowestDelta;

    if ( $.event.fixHooks ) {
        for ( var i = toFix.length; i; ) {
            $.event.fixHooks[ toFix[--i] ] = $.event.mouseHooks;
        }
    }

    var special = $.event.special.mousewheel = {
        version: '3.1.9',

        setup: function() {
            if ( this.addEventListener ) {
                for ( var i = toBind.length; i; ) {
                    this.addEventListener( toBind[--i], handler, false );
                }
            } else {
                this.onmousewheel = handler;
            }
            // Store the line height and page height for this particular element
            $.data(this, 'mousewheel-line-height', special.getLineHeight(this));
            $.data(this, 'mousewheel-page-height', special.getPageHeight(this));
        },

        teardown: function() {
            if ( this.removeEventListener ) {
                for ( var i = toBind.length; i; ) {
                    this.removeEventListener( toBind[--i], handler, false );
                }
            } else {
                this.onmousewheel = null;
            }
        },

        getLineHeight: function(elem) {
            return parseInt($(elem)['offsetParent' in $.fn ? 'offsetParent' : 'parent']().css('fontSize'), 10);
        },

        getPageHeight: function(elem) {
            return $(elem).height();
        },

        settings: {
            adjustOldDeltas: true
        }
    };

    $.fn.extend({
        mousewheel: function(fn) {
            return fn ? this.bind('mousewheel', fn) : this.trigger('mousewheel');
        },

        unmousewheel: function(fn) {
            return this.unbind('mousewheel', fn);
        }
    });


    function handler(event) {
        var orgEvent   = event || window.event,
            args       = slice.call(arguments, 1),
            delta      = 0,
            deltaX     = 0,
            deltaY     = 0,
            absDelta   = 0;
        event = $.event.fix(orgEvent);
        event.type = 'mousewheel';

        // Old school scrollwheel delta
        if ( 'detail'      in orgEvent ) { deltaY = orgEvent.detail * -1;      }
        if ( 'wheelDelta'  in orgEvent ) { deltaY = orgEvent.wheelDelta;       }
        if ( 'wheelDeltaY' in orgEvent ) { deltaY = orgEvent.wheelDeltaY;      }
        if ( 'wheelDeltaX' in orgEvent ) { deltaX = orgEvent.wheelDeltaX * -1; }

        // Firefox < 17 horizontal scrolling related to DOMMouseScroll event
        if ( 'axis' in orgEvent && orgEvent.axis === orgEvent.HORIZONTAL_AXIS ) {
            deltaX = deltaY * -1;
            deltaY = 0;
        }

        // Set delta to be deltaY or deltaX if deltaY is 0 for backwards compatabilitiy
        delta = deltaY === 0 ? deltaX : deltaY;

        // New school wheel delta (wheel event)
        if ( 'deltaY' in orgEvent ) {
            deltaY = orgEvent.deltaY * -1;
            delta  = deltaY;
        }
        if ( 'deltaX' in orgEvent ) {
            deltaX = orgEvent.deltaX;
            if ( deltaY === 0 ) { delta  = deltaX * -1; }
        }

        // No change actually happened, no reason to go any further
        if ( deltaY === 0 && deltaX === 0 ) { return; }

        // Need to convert lines and pages to pixels if we aren't already in pixels
        // There are three delta modes:
        //   * deltaMode 0 is by pixels, nothing to do
        //   * deltaMode 1 is by lines
        //   * deltaMode 2 is by pages
        if ( orgEvent.deltaMode === 1 ) {
            var lineHeight = $.data(this, 'mousewheel-line-height');
            delta  *= lineHeight;
            deltaY *= lineHeight;
            deltaX *= lineHeight;
        } else if ( orgEvent.deltaMode === 2 ) {
            var pageHeight = $.data(this, 'mousewheel-page-height');
            delta  *= pageHeight;
            deltaY *= pageHeight;
            deltaX *= pageHeight;
        }

        // Store lowest absolute delta to normalize the delta values
        absDelta = Math.max( Math.abs(deltaY), Math.abs(deltaX) );

        if ( !lowestDelta || absDelta < lowestDelta ) {
            lowestDelta = absDelta;

            // Adjust older deltas if necessary
            if ( shouldAdjustOldDeltas(orgEvent, absDelta) ) {
                lowestDelta /= 40;
            }
        }

        // Adjust older deltas if necessary
        if ( shouldAdjustOldDeltas(orgEvent, absDelta) ) {
            // Divide all the things by 40!
            delta  /= 40;
            deltaX /= 40;
            deltaY /= 40;
        }

        // Get a whole, normalized value for the deltas
        delta  = Math[ delta  >= 1 ? 'floor' : 'ceil' ](delta  / lowestDelta);
        deltaX = Math[ deltaX >= 1 ? 'floor' : 'ceil' ](deltaX / lowestDelta);
        deltaY = Math[ deltaY >= 1 ? 'floor' : 'ceil' ](deltaY / lowestDelta);

        // Add information to the event object
        event.deltaX = deltaX;
        event.deltaY = deltaY;
        event.deltaFactor = lowestDelta;
        // Go ahead and set deltaMode to 0 since we converted to pixels
        // Although this is a little odd since we overwrite the deltaX/Y
        // properties with normalized deltas.
        event.deltaMode = 0;

        // Add event and delta to the front of the arguments
        args.unshift(event, delta, deltaX, deltaY);

        // Clearout lowestDelta after sometime to better
        // handle multiple device types that give different
        // a different lowestDelta
        // Ex: trackpad = 3 and mouse wheel = 120
        if (nullLowestDeltaTimeout) { clearTimeout(nullLowestDeltaTimeout); }
        nullLowestDeltaTimeout = setTimeout(nullLowestDelta, 200);

        return ($.event.dispatch || $.event.handle).apply(this, args);
    }

    function nullLowestDelta() {
        lowestDelta = null;
    }

    function shouldAdjustOldDeltas(orgEvent, absDelta) {
        // If this is an older event and the delta is divisable by 120,
        // then we are assuming that the browser is treating this as an
        // older mouse wheel event and that we should divide the deltas
        // by 40 to try and get a more usable deltaFactor.
        // Side note, this actually impacts the reported scroll distance
        // in older browsers and can cause scrolling to be slower than native.
        // Turn this off by setting $.event.special.mousewheel.settings.adjustOldDeltas to false.
        return special.settings.adjustOldDeltas && orgEvent.type === 'mousewheel' && absDelta % 120 === 0;
    }

}));/**
 * @namespace jvm Holds core methods and classes used by jVectorMap.
 */
var jvm = {

  /**
   * Inherits child's prototype from the parent's one.
   * @param {Function} child
   * @param {Function} parent
   */
  inherits: function(child, parent) {
    function temp() {}
    temp.prototype = parent.prototype;
    child.prototype = new temp();
    child.prototype.constructor = child;
    child.parentClass = parent;
  },

  /**
   * Mixes in methods from the source constructor to the target one.
   * @param {Function} target
   * @param {Function} source
   */
  mixin: function(target, source){
    var prop;

    for (prop in source.prototype) {
      if (source.prototype.hasOwnProperty(prop)) {
        target.prototype[prop] = source.prototype[prop];
      }
    }
  },

  min: function(values){
    var min = Number.MAX_VALUE,
        i;

    if (values instanceof Array) {
      for (i = 0; i < values.length; i++) {
        if (values[i] < min) {
          min = values[i];
        }
      }
    } else {
      for (i in values) {
        if (values[i] < min) {
          min = values[i];
        }
      }
    }
    return min;
  },

  max: function(values){
    var max = Number.MIN_VALUE,
        i;

    if (values instanceof Array) {
      for (i = 0; i < values.length; i++) {
        if (values[i] > max) {
          max = values[i];
        }
      }
    } else {
      for (i in values) {
        if (values[i] > max) {
          max = values[i];
        }
      }
    }
    return max;
  },

  keys: function(object){
    var keys = [],
        key;

    for (key in object) {
      keys.push(key);
    }
    return keys;
  },

  values: function(object){
    var values = [],
        key,
        i;

    for (i = 0; i < arguments.length; i++) {
      object = arguments[i];
      for (key in object) {
        values.push(object[key]);
      }
    }
    return values;
  },

  whenImageLoaded: function(url){
    var deferred = new jvm.$.Deferred(),
        img = jvm.$('<img/>');

    img.error(function(){
      deferred.reject();
    }).load(function(){
      deferred.resolve(img);
    });
    img.attr('src', url);

    return deferred;
  },

  isImageUrl: function(s){
    return /\.\w{3,4}$/.test(s);
  }
};

jvm.$ = jQ183;

/**
 * indexOf polyfill for IE < 9
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf
 */
if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function (searchElement, fromIndex) {

    var k;

    // 1. Let O be the result of calling ToObject passing
    //    the this value as the argument.
    if (this == null) {
      throw new TypeError('"this" is null or not defined');
    }

    var O = Object(this);

    // 2. Let lenValue be the result of calling the Get
    //    internal method of O with the argument "length".
    // 3. Let len be ToUint32(lenValue).
    var len = O.length >>> 0;

    // 4. If len is 0, return -1.
    if (len === 0) {
      return -1;
    }

    // 5. If argument fromIndex was passed let n be
    //    ToInteger(fromIndex); else let n be 0.
    var n = +fromIndex || 0;

    if (Math.abs(n) === Infinity) {
      n = 0;
    }

    // 6. If n >= len, return -1.
    if (n >= len) {
      return -1;
    }

    // 7. If n >= 0, then Let k be n.
    // 8. Else, n<0, Let k be len - abs(n).
    //    If k is less than 0, then let k be 0.
    k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

    // 9. Repeat, while k < len
    while (k < len) {
      // a. Let Pk be ToString(k).
      //   This is implicit for LHS operands of the in operator
      // b. Let kPresent be the result of calling the
      //    HasProperty internal method of O with argument Pk.
      //   This step can be combined with c
      // c. If kPresent is true, then
      //    i.  Let elementK be the result of calling the Get
      //        internal method of O with the argument ToString(k).
      //   ii.  Let same be the result of applying the
      //        Strict Equality Comparison Algorithm to
      //        searchElement and elementK.
      //  iii.  If same is true, return k.
      if (k in O && O[k] === searchElement) {
        return k;
      }
      k++;
    }
    return -1;
  };
}/**
 * Basic wrapper for DOM element.
 * @constructor
 * @param {String} name Tag name of the element
 * @param {Object} config Set of parameters to initialize element with
 */
jvm.AbstractElement = function(name, config){
  /**
   * Underlying DOM element
   * @type {DOMElement}
   * @private
   */
  this.node = this.createElement(name);

  /**
   * Name of underlying element
   * @type {String}
   * @private
   */
  this.name = name;

  /**
   * Internal store of attributes
   * @type {Object}
   * @private
   */
  this.properties = {};

  if (config) {
    this.set(config);
  }
};

/**
 * Set attribute of the underlying DOM element.
 * @param {String} name Name of attribute
 * @param {Number|String} config Set of parameters to initialize element with
 */
jvm.AbstractElement.prototype.set = function(property, value){
  var key;

  if (typeof property === 'object') {
    for (key in property) {
      this.properties[key] = property[key];
      this.applyAttr(key, property[key]);
    }
  } else {
    this.properties[property] = value;
    this.applyAttr(property, value);
  }
};

/**
 * Returns value of attribute.
 * @param {String} name Name of attribute
 */
jvm.AbstractElement.prototype.get = function(property){
  return this.properties[property];
};

/**
 * Applies attribute value to the underlying DOM element.
 * @param {String} name Name of attribute
 * @param {Number|String} config Value of attribute to apply
 * @private
 */
jvm.AbstractElement.prototype.applyAttr = function(property, value){
  this.node.setAttribute(property, value);
};

jvm.AbstractElement.prototype.remove = function(){
  jvm.$(this.node).remove();
};/**
 * Implements abstract vector canvas.
 * @constructor
 * @param {HTMLElement} container Container to put element to.
 * @param {Number} width Width of canvas.
 * @param {Number} height Height of canvas.
 */
jvm.AbstractCanvasElement = function(container, width, height){
  this.container = container;
  this.setSize(width, height);
  this.rootElement = new jvm[this.classPrefix+'GroupElement']();
  this.node.appendChild( this.rootElement.node );
  this.container.appendChild(this.node);
}

/**
 * Add element to the certain group inside of the canvas.
 * @param {HTMLElement} element Element to add to canvas.
 * @param {HTMLElement} group Group to add element into or into root group if not provided.
 */
jvm.AbstractCanvasElement.prototype.add = function(element, group){
  group = group || this.rootElement;
  group.add(element);
  element.canvas = this;
}

/**
 * Create path and add it to the canvas.
 * @param {Object} config Parameters of path to create.
 * @param {Object} style Styles of the path to create.
 * @param {HTMLElement} group Group to add path into.
 */
jvm.AbstractCanvasElement.prototype.addPath = function(config, style, group){
  var el = new jvm[this.classPrefix+'PathElement'](config, style);

  this.add(el, group);
  return el;
};

/**
 * Create circle and add it to the canvas.
 * @param {Object} config Parameters of path to create.
 * @param {Object} style Styles of the path to create.
 * @param {HTMLElement} group Group to add circle into.
 */
jvm.AbstractCanvasElement.prototype.addCircle = function(config, style, group){
  var el = new jvm[this.classPrefix+'CircleElement'](config, style);

  this.add(el, group);
  return el;
};

/**
 * Create circle and add it to the canvas.
 * @param {Object} config Parameters of path to create.
 * @param {Object} style Styles of the path to create.
 * @param {HTMLElement} group Group to add circle into.
 */
jvm.AbstractCanvasElement.prototype.addImage = function(config, style, group){
  var el = new jvm[this.classPrefix+'ImageElement'](config, style);

  this.add(el, group);
  return el;
};

/**
 * Create text and add it to the canvas.
 * @param {Object} config Parameters of path to create.
 * @param {Object} style Styles of the path to create.
 * @param {HTMLElement} group Group to add circle into.
 */
jvm.AbstractCanvasElement.prototype.addText = function(config, style, group){
  var el = new jvm[this.classPrefix+'TextElement'](config, style);

  this.add(el, group);
  return el;
};

/**
 * Add group to the another group inside of the canvas.
 * @param {HTMLElement} group Group to add circle into or root group if not provided.
 */
jvm.AbstractCanvasElement.prototype.addGroup = function(parentGroup){
  var el = new jvm[this.classPrefix+'GroupElement']();

  if (parentGroup) {
    parentGroup.node.appendChild(el.node);
  } else {
    this.node.appendChild(el.node);
  }
  el.canvas = this;
  return el;
};/**
 * Abstract shape element. Shape element represents some visual vector or raster object.
 * @constructor
 * @param {String} name Tag name of the element.
 * @param {Object} config Set of parameters to initialize element with.
 * @param {Object} style Object with styles to set on element initialization.
 */
jvm.AbstractShapeElement = function(name, config, style){
  this.style = style || {};
  this.style.current = this.style.current || {};
  this.isHovered = false;
  this.isSelected = false;
  this.updateStyle();
};

/**
 * Set element's style.
 * @param {Object|String} property Could be string to set only one property or object to set several style properties at once.
 * @param {String} value Value to set in case only one property should be set.
 */
jvm.AbstractShapeElement.prototype.setStyle = function(property, value){
  var styles = {};

  if (typeof property === 'object') {
    styles = property;
  } else {
    styles[property] = value;
  }
  jvm.$.extend(this.style.current, styles);
  this.updateStyle();
};


jvm.AbstractShapeElement.prototype.updateStyle = function(){
  var attrs = {};

  jvm.AbstractShapeElement.mergeStyles(attrs, this.style.initial);
  jvm.AbstractShapeElement.mergeStyles(attrs, this.style.current);
  if (this.isHovered) {
    jvm.AbstractShapeElement.mergeStyles(attrs, this.style.hover);
  }
  if (this.isSelected) {
    jvm.AbstractShapeElement.mergeStyles(attrs, this.style.selected);
    if (this.isHovered) {
      jvm.AbstractShapeElement.mergeStyles(attrs, this.style.selectedHover);
    }
  }
  this.set(attrs);
};

jvm.AbstractShapeElement.mergeStyles = function(styles, newStyles){
  var key;

  newStyles = newStyles || {};
  for (key in newStyles) {
    if (newStyles[key] === null) {
      delete styles[key];
    } else {
      styles[key] = newStyles[key];
    }
  }
}/**
 * Wrapper for SVG element.
 * @constructor
 * @extends jvm.AbstractElement
 * @param {String} name Tag name of the element
 * @param {Object} config Set of parameters to initialize element with
 */

jvm.SVGElement = function(name, config){
  jvm.SVGElement.parentClass.apply(this, arguments);
}

jvm.inherits(jvm.SVGElement, jvm.AbstractElement);

jvm.SVGElement.svgns = "http://www.w3.org/2000/svg";

/**
 * Creates DOM element.
 * @param {String} tagName Name of element
 * @private
 * @returns DOMElement
 */
jvm.SVGElement.prototype.createElement = function( tagName ){
  return document.createElementNS( jvm.SVGElement.svgns, tagName );
};

/**
 * Adds CSS class for underlying DOM element.
 * @param {String} className Name of CSS class name
 */
jvm.SVGElement.prototype.addClass = function( className ){
  this.node.setAttribute('class', className);
};

/**
 * Returns constructor for element by name prefixed with 'VML'.
 * @param {String} ctr Name of basic constructor to return
 * proper implementation for.
 * @returns Function
 * @private
 */
jvm.SVGElement.prototype.getElementCtr = function( ctr ){
  return jvm['SVG'+ctr];
};

jvm.SVGElement.prototype.getBBox = function(){
  return this.node.getBBox();
};jvm.SVGGroupElement = function(){
  jvm.SVGGroupElement.parentClass.call(this, 'g');
}

jvm.inherits(jvm.SVGGroupElement, jvm.SVGElement);

jvm.SVGGroupElement.prototype.add = function(element){
  this.node.appendChild( element.node );
};jvm.SVGCanvasElement = function(container, width, height){
  this.classPrefix = 'SVG';
  jvm.SVGCanvasElement.parentClass.call(this, 'svg');

  this.defsElement = new jvm.SVGElement('defs');
  this.node.appendChild( this.defsElement.node );

  jvm.AbstractCanvasElement.apply(this, arguments);
}

jvm.inherits(jvm.SVGCanvasElement, jvm.SVGElement);
jvm.mixin(jvm.SVGCanvasElement, jvm.AbstractCanvasElement);

jvm.SVGCanvasElement.prototype.setSize = function(width, height){
  this.width = width;
  this.height = height;
  this.node.setAttribute('width', width);
  this.node.setAttribute('height', height);
};

jvm.SVGCanvasElement.prototype.applyTransformParams = function(scale, transX, transY) {
  this.scale = scale;
  this.transX = transX;
  this.transY = transY;
  this.rootElement.node.setAttribute('transform', 'scale('+scale+') translate('+transX+', '+transY+')');
};jvm.SVGShapeElement = function(name, config, style){
  jvm.SVGShapeElement.parentClass.call(this, name, config);
  jvm.AbstractShapeElement.apply(this, arguments);
};

jvm.inherits(jvm.SVGShapeElement, jvm.SVGElement);
jvm.mixin(jvm.SVGShapeElement, jvm.AbstractShapeElement);

jvm.SVGShapeElement.prototype.applyAttr = function(attr, value){
  var patternEl,
      imageEl,
      that = this;

  if (attr === 'fill' && jvm.isImageUrl(value)) {
    if (!jvm.SVGShapeElement.images[value]) {
      jvm.whenImageLoaded(value).then(function(img){
        imageEl = new jvm.SVGElement('image');
        imageEl.node.setAttributeNS('http://www.w3.org/1999/xlink', 'href', value);
        imageEl.applyAttr('x', '0');
        imageEl.applyAttr('y', '0');
        imageEl.applyAttr('width', img[0].width);
        imageEl.applyAttr('height', img[0].height);

        patternEl = new jvm.SVGElement('pattern');
        patternEl.applyAttr('id', 'image'+jvm.SVGShapeElement.imageCounter);
        patternEl.applyAttr('x', 0);
        patternEl.applyAttr('y', 0);
        patternEl.applyAttr('width', img[0].width / 2);
        patternEl.applyAttr('height', img[0].height / 2);
        patternEl.applyAttr('viewBox', '0 0 '+img[0].width+' '+img[0].height);
        patternEl.applyAttr('patternUnits', 'userSpaceOnUse');
        patternEl.node.appendChild( imageEl.node );

        that.canvas.defsElement.node.appendChild( patternEl.node );

        jvm.SVGShapeElement.images[value] = jvm.SVGShapeElement.imageCounter++;

        that.applyAttr('fill', 'url(#image'+jvm.SVGShapeElement.images[value]+')');
      });
    } else {
      this.applyAttr('fill', 'url(#image'+jvm.SVGShapeElement.images[value]+')');
    }
  } else {
    jvm.SVGShapeElement.parentClass.prototype.applyAttr.apply(this, arguments);
  }
};

jvm.SVGShapeElement.imageCounter = 1;
jvm.SVGShapeElement.images = {};jvm.SVGPathElement = function(config, style){
  jvm.SVGPathElement.parentClass.call(this, 'path', config, style);
  this.node.setAttribute('fill-rule', 'evenodd');
}

jvm.inherits(jvm.SVGPathElement, jvm.SVGShapeElement);jvm.SVGCircleElement = function(config, style){
  jvm.SVGCircleElement.parentClass.call(this, 'circle', config, style);
};

jvm.inherits(jvm.SVGCircleElement, jvm.SVGShapeElement);jvm.SVGImageElement = function(config, style){
  jvm.SVGImageElement.parentClass.call(this, 'image', config, style);
};

jvm.inherits(jvm.SVGImageElement, jvm.SVGShapeElement);

jvm.SVGImageElement.prototype.applyAttr = function(attr, value){
  var that = this;

  if (attr == 'image') {
    jvm.whenImageLoaded(value).then(function(img){
      that.node.setAttributeNS('http://www.w3.org/1999/xlink', 'href', value);
      that.width = img[0].width;
      that.height = img[0].height;
      that.applyAttr('width', that.width);
      that.applyAttr('height', that.height);

      that.applyAttr('x', that.cx - that.width / 2);
      that.applyAttr('y', that.cy - that.height / 2);

      jvm.$(that.node).trigger('imageloaded', [img]);
    });
  } else if(attr == 'cx') {
    this.cx = value;
    if (this.width) {
      this.applyAttr('x', value - this.width / 2);
    }
  } else if(attr == 'cy') {
    this.cy = value;
    if (this.height) {
      this.applyAttr('y', value - this.height / 2);
    }
  } else {
    jvm.SVGImageElement.parentClass.prototype.applyAttr.apply(this, arguments);
  }
};jvm.SVGTextElement = function(config, style){
  jvm.SVGTextElement.parentClass.call(this, 'text', config, style);
}

jvm.inherits(jvm.SVGTextElement, jvm.SVGShapeElement);

jvm.SVGTextElement.prototype.applyAttr = function(attr, value){
  if (attr === 'text') {
    this.node.textContent = value;
  } else {
    jvm.SVGTextElement.parentClass.prototype.applyAttr.apply(this, arguments);
  }
};/**
 * Wrapper for VML element.
 * @constructor
 * @extends jvm.AbstractElement
 * @param {String} name Tag name of the element
 * @param {Object} config Set of parameters to initialize element with
 */

jvm.VMLElement = function(name, config){
  if (!jvm.VMLElement.VMLInitialized) {
    jvm.VMLElement.initializeVML();
  }

  jvm.VMLElement.parentClass.apply(this, arguments);
};

jvm.inherits(jvm.VMLElement, jvm.AbstractElement);

/**
 * Shows if VML was already initialized for the current document or not.
 * @static
 * @private
 * @type {Boolean}
 */
jvm.VMLElement.VMLInitialized = false;

/**
 * Initializes VML handling before creating the first element
 * (adds CSS class and creates namespace). Adds one of two forms
 * of createElement method depending of support by browser.
 * @static
 * @private
 */

 // The following method of VML handling is borrowed from the
 // Raphael library by Dmitry Baranovsky.

jvm.VMLElement.initializeVML = function(){
  try {
    if (!document.namespaces.rvml) {
      document.namespaces.add("rvml","urn:schemas-microsoft-com:vml");
    }
    /**
     * Creates DOM element.
     * @param {String} tagName Name of element
     * @private
     * @returns DOMElement
     */
    jvm.VMLElement.prototype.createElement = function (tagName) {
      return document.createElement('<rvml:' + tagName + ' class="rvml">');
    };
  } catch (e) {
    /**
     * @private
     */
    jvm.VMLElement.prototype.createElement = function (tagName) {
      return document.createElement('<' + tagName + ' xmlns="urn:schemas-microsoft.com:vml" class="rvml">');
    };
  }
  document.createStyleSheet().addRule(".rvml", "behavior:url(#default#VML)");
  jvm.VMLElement.VMLInitialized = true;
};

/**
 * Returns constructor for element by name prefixed with 'VML'.
 * @param {String} ctr Name of basic constructor to return
 * proper implementation for.
 * @returns Function
 * @private
 */
jvm.VMLElement.prototype.getElementCtr = function( ctr ){
  return jvm['VML'+ctr];
};

/**
 * Adds CSS class for underlying DOM element.
 * @param {String} className Name of CSS class name
 */
jvm.VMLElement.prototype.addClass = function( className ){
  jvm.$(this.node).addClass(className);
};

/**
 * Applies attribute value to the underlying DOM element.
 * @param {String} name Name of attribute
 * @param {Number|String} config Value of attribute to apply
 * @private
 */
jvm.VMLElement.prototype.applyAttr = function( attr, value ){
  this.node[attr] = value;
};

/**
 * Returns boundary box for the element.
 * @returns {Object} Boundary box with numeric fields: x, y, width, height
 * @override
 */
jvm.VMLElement.prototype.getBBox = function(){
  var node = jvm.$(this.node);

  return {
    x: node.position().left / this.canvas.scale,
    y: node.position().top / this.canvas.scale,
    width: node.width() / this.canvas.scale,
    height: node.height() / this.canvas.scale
  };
};jvm.VMLGroupElement = function(){
  jvm.VMLGroupElement.parentClass.call(this, 'group');

  this.node.style.left = '0px';
  this.node.style.top = '0px';
  this.node.coordorigin = "0 0";
};

jvm.inherits(jvm.VMLGroupElement, jvm.VMLElement);

jvm.VMLGroupElement.prototype.add = function(element){
  this.node.appendChild( element.node );
};jvm.VMLCanvasElement = function(container, width, height){
  this.classPrefix = 'VML';
  jvm.VMLCanvasElement.parentClass.call(this, 'group');
  jvm.AbstractCanvasElement.apply(this, arguments);
  this.node.style.position = 'absolute';
};

jvm.inherits(jvm.VMLCanvasElement, jvm.VMLElement);
jvm.mixin(jvm.VMLCanvasElement, jvm.AbstractCanvasElement);

jvm.VMLCanvasElement.prototype.setSize = function(width, height){
  var paths,
      groups,
      i,
      l;

  this.width = width;
  this.height = height;
  this.node.style.width = width + "px";
  this.node.style.height = height + "px";
  this.node.coordsize = width+' '+height;
  this.node.coordorigin = "0 0";
  if (this.rootElement) {
    paths = this.rootElement.node.getElementsByTagName('shape');
    for(i = 0, l = paths.length; i < l; i++) {
      paths[i].coordsize = width+' '+height;
      paths[i].style.width = width+'px';
      paths[i].style.height = height+'px';
    }
    groups = this.node.getElementsByTagName('group');
    for(i = 0, l = groups.length; i < l; i++) {
      groups[i].coordsize = width+' '+height;
      groups[i].style.width = width+'px';
      groups[i].style.height = height+'px';
    }
  }
};

jvm.VMLCanvasElement.prototype.applyTransformParams = function(scale, transX, transY) {
  this.scale = scale;
  this.transX = transX;
  this.transY = transY;
  this.rootElement.node.coordorigin = (this.width-transX-this.width/100)+','+(this.height-transY-this.height/100);
  this.rootElement.node.coordsize = this.width/scale+','+this.height/scale;
};jvm.VMLShapeElement = function(name, config){
  jvm.VMLShapeElement.parentClass.call(this, name, config);

  this.fillElement = new jvm.VMLElement('fill');
  this.strokeElement = new jvm.VMLElement('stroke');
  this.node.appendChild(this.fillElement.node);
  this.node.appendChild(this.strokeElement.node);
  this.node.stroked = false;

  jvm.AbstractShapeElement.apply(this, arguments);
};

jvm.inherits(jvm.VMLShapeElement, jvm.VMLElement);
jvm.mixin(jvm.VMLShapeElement, jvm.AbstractShapeElement);

jvm.VMLShapeElement.prototype.applyAttr = function(attr, value){
  switch (attr) {
    case 'fill':
      this.node.fillcolor = value;
      break;
    case 'fill-opacity':
      this.fillElement.node.opacity = Math.round(value*100)+'%';
      break;
    case 'stroke':
      if (value === 'none') {
        this.node.stroked = false;
      } else {
        this.node.stroked = true;
      }
      this.node.strokecolor = value;
      break;
    case 'stroke-opacity':
      this.strokeElement.node.opacity = Math.round(value*100)+'%';
      break;
    case 'stroke-width':
      if (parseInt(value, 10) === 0) {
        this.node.stroked = false;
      } else {
        this.node.stroked = true;
      }
      this.node.strokeweight = value;
      break;
    case 'd':
      this.node.path = jvm.VMLPathElement.pathSvgToVml(value);
      break;
    default:
      jvm.VMLShapeElement.parentClass.prototype.applyAttr.apply(this, arguments);
  }
};jvm.VMLPathElement = function(config, style){
  var scale = new jvm.VMLElement('skew');

  jvm.VMLPathElement.parentClass.call(this, 'shape', config, style);

  this.node.coordorigin = "0 0";

  scale.node.on = true;
  scale.node.matrix = '0.01,0,0,0.01,0,0';
  scale.node.offset = '0,0';

  this.node.appendChild(scale.node);
};

jvm.inherits(jvm.VMLPathElement, jvm.VMLShapeElement);

jvm.VMLPathElement.prototype.applyAttr = function(attr, value){
  if (attr === 'd') {
    this.node.path = jvm.VMLPathElement.pathSvgToVml(value);
  } else {
    jvm.VMLShapeElement.prototype.applyAttr.call(this, attr, value);
  }
};

jvm.VMLPathElement.pathSvgToVml = function(path) {
  var cx = 0, cy = 0, ctrlx, ctrly;

  path = path.replace(/(-?\d+)e(-?\d+)/g, '0');
  return path.replace(/([MmLlHhVvCcSs])\s*((?:-?\d*(?:\.\d+)?\s*,?\s*)+)/g, function(segment, letter, coords, index){
    coords = coords.replace(/(\d)-/g, '$1,-')
            .replace(/^\s+/g, '')
            .replace(/\s+$/g, '')
            .replace(/\s+/g, ',').split(',');
    if (!coords[0]) coords.shift();
    for (var i=0, l=coords.length; i<l; i++) {
      coords[i] = Math.round(100*coords[i]);
    }
    switch (letter) {
      case 'm':
        cx += coords[0];
        cy += coords[1];
        return 't'+coords.join(',');
      case 'M':
        cx = coords[0];
        cy = coords[1];
        return 'm'+coords.join(',');
      case 'l':
        cx += coords[0];
        cy += coords[1];
        return 'r'+coords.join(',');
      case 'L':
        cx = coords[0];
        cy = coords[1];
        return 'l'+coords.join(',');
      case 'h':
        cx += coords[0];
        return 'r'+coords[0]+',0';
      case 'H':
        cx = coords[0];
        return 'l'+cx+','+cy;
      case 'v':
        cy += coords[0];
        return 'r0,'+coords[0];
      case 'V':
        cy = coords[0];
        return 'l'+cx+','+cy;
      case 'c':
        ctrlx = cx + coords[coords.length-4];
        ctrly = cy + coords[coords.length-3];
        cx += coords[coords.length-2];
        cy += coords[coords.length-1];
        return 'v'+coords.join(',');
      case 'C':
        ctrlx = coords[coords.length-4];
        ctrly = coords[coords.length-3];
        cx = coords[coords.length-2];
        cy = coords[coords.length-1];
        return 'c'+coords.join(',');
      case 's':
        coords.unshift(cy-ctrly);
        coords.unshift(cx-ctrlx);
        ctrlx = cx + coords[coords.length-4];
        ctrly = cy + coords[coords.length-3];
        cx += coords[coords.length-2];
        cy += coords[coords.length-1];
        return 'v'+coords.join(',');
      case 'S':
        coords.unshift(cy+cy-ctrly);
        coords.unshift(cx+cx-ctrlx);
        ctrlx = coords[coords.length-4];
        ctrly = coords[coords.length-3];
        cx = coords[coords.length-2];
        cy = coords[coords.length-1];
        return 'c'+coords.join(',');
    }
    return '';
  }).replace(/z/g, 'e');
};jvm.VMLCircleElement = function(config, style){
  jvm.VMLCircleElement.parentClass.call(this, 'oval', config, style);
};

jvm.inherits(jvm.VMLCircleElement, jvm.VMLShapeElement);

jvm.VMLCircleElement.prototype.applyAttr = function(attr, value){
  switch (attr) {
    case 'r':
      this.node.style.width = value*2+'px';
      this.node.style.height = value*2+'px';
      this.applyAttr('cx', this.get('cx') || 0);
      this.applyAttr('cy', this.get('cy') || 0);
      break;
    case 'cx':
      if (!value) return;
      this.node.style.left = value - (this.get('r') || 0) + 'px';
      break;
    case 'cy':
      if (!value) return;
      this.node.style.top = value - (this.get('r') || 0) + 'px';
      break;
    default:
      jvm.VMLCircleElement.parentClass.prototype.applyAttr.call(this, attr, value);
  }
};/**
 * Class for vector images manipulations.
 * @constructor
 * @param {DOMElement} container to place canvas to
 * @param {Number} width
 * @param {Number} height
 */
jvm.VectorCanvas = function(container, width, height) {
  this.mode = window.SVGAngle ? 'svg' : 'vml';

  if (this.mode == 'svg') {
    this.impl = new jvm.SVGCanvasElement(container, width, height);
  } else {
    this.impl = new jvm.VMLCanvasElement(container, width, height);
  }
  this.impl.mode = this.mode;
  return this.impl;
};jvm.SimpleScale = function(scale){
  this.scale = scale;
};

jvm.SimpleScale.prototype.getValue = function(value){
  return value;
};jvm.OrdinalScale = function(scale){
  this.scale = scale;
};

jvm.OrdinalScale.prototype.getValue = function(value){
  return this.scale[value];
};

jvm.OrdinalScale.prototype.getTicks = function(){
  var ticks = [],
      key;

  for (key in this.scale) {
    ticks.push({
      label: key,
      value: this.scale[key]
    });
  }

  return ticks;
};jvm.NumericScale = function(scale, normalizeFunction, minValue, maxValue) {
  this.scale = [];

  normalizeFunction = normalizeFunction || 'linear';

  if (scale) this.setScale(scale);
  if (normalizeFunction) this.setNormalizeFunction(normalizeFunction);
  if (typeof minValue !== 'undefined' ) this.setMin(minValue);
  if (typeof maxValue !== 'undefined' ) this.setMin(maxValue);
};

jvm.NumericScale.prototype = {
  setMin: function(min) {
    this.clearMinValue = min;
    if (typeof this.normalize === 'function') {
      this.minValue = this.normalize(min);
    } else {
      this.minValue = min;
    }
  },

  setMax: function(max) {
    this.clearMaxValue = max;
    if (typeof this.normalize === 'function') {
      this.maxValue = this.normalize(max);
    } else {
      this.maxValue = max;
    }
  },

  setScale: function(scale) {
    var i;

    this.scale = [];
    for (i = 0; i < scale.length; i++) {
      this.scale[i] = [scale[i]];
    }
  },

  setNormalizeFunction: function(f) {
    if (f === 'polynomial') {
      this.normalize = function(value) {
        return Math.pow(value, 0.2);
      }
    } else if (f === 'linear') {
      delete this.normalize;
    } else {
      this.normalize = f;
    }
    this.setMin(this.clearMinValue);
    this.setMax(this.clearMaxValue);
  },

  getValue: function(value) {
    var lengthes = [],
        fullLength = 0,
        l,
        i = 0,
        c;

    if (typeof this.normalize === 'function') {
      value = this.normalize(value);
    }
    for (i = 0; i < this.scale.length-1; i++) {
      l = this.vectorLength(this.vectorSubtract(this.scale[i+1], this.scale[i]));
      lengthes.push(l);
      fullLength += l;
    }

    c = (this.maxValue - this.minValue) / fullLength;
    for (i=0; i<lengthes.length; i++) {
      lengthes[i] *= c;
    }

    i = 0;
    value -= this.minValue;
    while (value - lengthes[i] >= 0) {
      value -= lengthes[i];
      i++;
    }

    if (i == this.scale.length - 1) {
      value = this.vectorToNum(this.scale[i])
    } else {
      value = (
        this.vectorToNum(
          this.vectorAdd(this.scale[i],
            this.vectorMult(
              this.vectorSubtract(this.scale[i+1], this.scale[i]),
              (value) / (lengthes[i])
            )
          )
        )
      );
    }

    return value;
  },

  vectorToNum: function(vector) {
    var num = 0,
        i;

    for (i = 0; i < vector.length; i++) {
      num += Math.round(vector[i])*Math.pow(256, vector.length-i-1);
    }
    return num;
  },

  vectorSubtract: function(vector1, vector2) {
    var vector = [],
        i;

    for (i = 0; i < vector1.length; i++) {
      vector[i] = vector1[i] - vector2[i];
    }
    return vector;
  },

  vectorAdd: function(vector1, vector2) {
    var vector = [],
        i;

    for (i = 0; i < vector1.length; i++) {
      vector[i] = vector1[i] + vector2[i];
    }
    return vector;
  },

  vectorMult: function(vector, num) {
    var result = [],
        i;

    for (i = 0; i < vector.length; i++) {
      result[i] = vector[i] * num;
    }
    return result;
  },

  vectorLength: function(vector) {
    var result = 0,
        i;
    for (i = 0; i < vector.length; i++) {
      result += vector[i] * vector[i];
    }
    return Math.sqrt(result);
  },

  /* Derived from d3 implementation https://github.com/mbostock/d3/blob/master/src/scale/linear.js#L94 */
  getTicks: function(){
    var m = 5,
        extent = [this.clearMinValue, this.clearMaxValue],
        span = extent[1] - extent[0],
        step = Math.pow(10, Math.floor(Math.log(span / m) / Math.LN10)),
        err = m / span * step,
        ticks = [],
        tick,
        v;

    if (err <= .15) step *= 10;
    else if (err <= .35) step *= 5;
    else if (err <= .75) step *= 2;

    extent[0] = Math.floor(extent[0] / step) * step;
    extent[1] = Math.ceil(extent[1] / step) * step;

    tick = extent[0];
    while (tick <= extent[1]) {
      if (tick == extent[0]) {
        v = this.clearMinValue;
      } else if (tick == extent[1]) {
        v = this.clearMaxValue;
      } else {
        v = tick;
      }
      ticks.push({
        label: tick,
        value: this.getValue(v)
      });
      tick += step;
    }

    return ticks;
  }
};
jvm.ColorScale = function(colors, normalizeFunction, minValue, maxValue) {
  jvm.ColorScale.parentClass.apply(this, arguments);
}

jvm.inherits(jvm.ColorScale, jvm.NumericScale);

jvm.ColorScale.prototype.setScale = function(scale) {
  var i;

  for (i = 0; i < scale.length; i++) {
    this.scale[i] = jvm.ColorScale.rgbToArray(scale[i]);
  }
};

jvm.ColorScale.prototype.getValue = function(value) {
  return jvm.ColorScale.numToRgb(jvm.ColorScale.parentClass.prototype.getValue.call(this, value));
};

jvm.ColorScale.arrayToRgb = function(ar) {
  var rgb = '#',
      d,
      i;

  for (i = 0; i < ar.length; i++) {
    d = ar[i].toString(16);
    rgb += d.length == 1 ? '0'+d : d;
  }
  return rgb;
};

jvm.ColorScale.numToRgb = function(num) {
  num = num.toString(16);

  while (num.length < 6) {
    num = '0' + num;
  }

  return '#'+num;
};

jvm.ColorScale.rgbToArray = function(rgb) {
  rgb = rgb.substr(1);
  return [parseInt(rgb.substr(0, 2), 16), parseInt(rgb.substr(2, 2), 16), parseInt(rgb.substr(4, 2), 16)];
};/**
 * Represents map legend.
 * @constructor
 * @param {Object} params Configuration parameters.
 * @param {String} params.cssClass Additional CSS class to apply to legend element.
 * @param {Boolean} params.vertical If <code>true</code> legend will be rendered as vertical.
 * @param {String} params.title Legend title.
 * @param {Function} params.labelRender Method to convert series values to legend labels.
 */
jvm.Legend = function(params) {
  this.params = params || {};
  this.map = this.params.map;
  this.series = this.params.series;
  this.body = jvm.$('<div/>');
  this.body.addClass('jvectormap-legend');
  if (this.params.cssClass) {
    this.body.addClass(this.params.cssClass);
  }

  if (params.vertical) {
    this.map.legendCntVertical.append( this.body );
  } else {
    this.map.legendCntHorizontal.append( this.body );
  }

  this.render();
}

jvm.Legend.prototype.render = function(){
  var ticks = this.series.scale.getTicks(),
      i,
      inner = jvm.$('<div/>').addClass('jvectormap-legend-inner'),
      tick,
      sample,
      label;

  this.body.html('');
  if (this.params.title) {
    this.body.append(
      jvm.$('<div/>').addClass('jvectormap-legend-title').html(this.params.title)
    );
  }
  this.body.append(inner);

  for (i = 0; i < ticks.length; i++) {
    tick = jvm.$('<div/>').addClass('jvectormap-legend-tick');
    sample = jvm.$('<div/>').addClass('jvectormap-legend-tick-sample');

    switch (this.series.params.attribute) {
      case 'fill':
        if (jvm.isImageUrl(ticks[i].value)) {
          sample.css('background', 'url('+ticks[i].value+')');
        } else {
          sample.css('background', ticks[i].value);
        }
        break;
      case 'stroke':
        sample.css('background', ticks[i].value);
        break;
      case 'image':
        sample.css('background', 'url('+ticks[i].value+') no-repeat center center');
        break;
      case 'r':
        jvm.$('<div/>').css({
          'border-radius': ticks[i].value,
          border: this.map.params.markerStyle.initial['stroke-width']+'px '+
                  this.map.params.markerStyle.initial['stroke']+' solid',
          width: ticks[i].value * 2 + 'px',
          height: ticks[i].value * 2 + 'px',
          background: this.map.params.markerStyle.initial['fill']
        }).appendTo(sample);
        break;
    }
    tick.append( sample );
    label = ticks[i].label;
    if (this.params.labelRender) {
      label = this.params.labelRender(label);
    }
    tick.append( jvm.$('<div>'+label+' </div>').addClass('jvectormap-legend-tick-text') );
    inner.append(tick);
  }
  inner.append( jvm.$('<div/>').css('clear', 'both') );
}/**
 * Creates data series.
 * @constructor
 * @param {Object} params Parameters to initialize series with.
 * @param {Array} params.values The data set to visualize.
 * @param {String} params.attribute Numberic or color attribute to use for data visualization. This could be: <code>fill</code>, <code>stroke</code>, <code>fill-opacity</code>, <code>stroke-opacity</code> for markers and regions and <code>r</code> (radius) for markers only.
 * @param {Array} params.scale Values used to map a dimension of data to a visual representation. The first value sets visualization for minimum value from the data set and the last value sets visualization for the maximum value. There also could be intermidiate values. Default value is <code>['#C8EEFF', '#0071A4']</code>
 * @param {Function|String} params.normalizeFunction The function used to map input values to the provided scale. This parameter could be provided as function or one of the strings: <code>'linear'</code> or <code>'polynomial'</code>, while <code>'linear'</code> is used by default. The function provided takes value from the data set as an input and returns corresponding value from the scale.
 * @param {Number} params.min Minimum value of the data set. Could be calculated automatically if not provided.
 * @param {Number} params.min Maximum value of the data set. Could be calculated automatically if not provided.
 */
jvm.DataSeries = function(params, elements, map) {
  var scaleConstructor;

  params = params || {};
  params.attribute = params.attribute || 'fill';

  this.elements = elements;
  this.params = params;
  this.map = map;

  if (params.attributes) {
    this.setAttributes(params.attributes);
  }

  if (jvm.$.isArray(params.scale)) {
    scaleConstructor = (params.attribute === 'fill' || params.attribute === 'stroke') ? jvm.ColorScale : jvm.NumericScale;
    this.scale = new scaleConstructor(params.scale, params.normalizeFunction, params.min, params.max);
  } else if (params.scale) {
    this.scale = new jvm.OrdinalScale(params.scale);
  } else {
    this.scale = new jvm.SimpleScale(params.scale);
  }

  this.values = params.values || {};
  this.setValues(this.values);

  if (this.params.legend) {
    this.legend = new jvm.Legend($.extend({
      map: this.map,
      series: this
    }, this.params.legend))
  }
};

jvm.DataSeries.prototype = {
  setAttributes: function(key, attr){
    var attrs = key,
        code;

    if (typeof key == 'string') {
      if (this.elements[key]) {
        this.elements[key].setStyle(this.params.attribute, attr);
      }
    } else {
      for (code in attrs) {
        if (this.elements[code]) {
          this.elements[code].element.setStyle(this.params.attribute, attrs[code]);
        }
      }
    }
  },

  /**
   * Set values for the data set.
   * @param {Object} values Object which maps codes of regions or markers to values.
   */
  setValues: function(values) {
    var max = -Number.MAX_VALUE,
        min = Number.MAX_VALUE,
        val,
        cc,
        attrs = {};

    if (!(this.scale instanceof jvm.OrdinalScale) && !(this.scale instanceof jvm.SimpleScale)) {
      // we have a color scale as an array
      if (typeof this.params.min === 'undefined' || typeof this.params.max === 'undefined') {
        // min and/or max are not defined, so calculate them
        for (cc in values) {
          val = parseFloat(values[cc]);
          if (val > max) max = val;
          if (val < min) min = val;
        }
      }

      if (typeof this.params.min === 'undefined') {
        this.scale.setMin(min);
        this.params.min = min;
      } else {
        this.scale.setMin(this.params.min);
      }

      if (typeof this.params.max === 'undefined') {
        this.scale.setMax(max);
        this.params.max = max;
      } else {
        this.scale.setMax(this.params.max);
      }

      for (cc in values) {
        if (cc != 'indexOf') {
          val = parseFloat(values[cc]);
          if (!isNaN(val)) {
            attrs[cc] = this.scale.getValue(val);
          } else {
            attrs[cc] = this.elements[cc].element.style.initial[this.params.attribute];
          }
        }
      }
    } else {
      for (cc in values) {
        if (values[cc]) {
          attrs[cc] = this.scale.getValue(values[cc]);
        } else {
          attrs[cc] = this.elements[cc].element.style.initial[this.params.attribute];
        }
      }
    }

    this.setAttributes(attrs);
    jvm.$.extend(this.values, values);
  },

  clear: function(){
    var key,
        attrs = {};

    for (key in this.values) {
      if (this.elements[key]) {
        attrs[key] = this.elements[key].element.shape.style.initial[this.params.attribute];
      }
    }
    this.setAttributes(attrs);
    this.values = {};
  },

  /**
   * Set scale of the data series.
   * @param {Array} scale Values representing scale.
   */
  setScale: function(scale) {
    this.scale.setScale(scale);
    if (this.values) {
      this.setValues(this.values);
    }
  },

  /**
   * Set normalize function of the data series.
   * @param {Function|String} normilizeFunction.
   */
  setNormalizeFunction: function(f) {
    this.scale.setNormalizeFunction(f);
    if (this.values) {
      this.setValues(this.values);
    }
  }
};
/**
 * Contains methods for transforming point on sphere to
 * Cartesian coordinates using various projections.
 * @class
 */
jvm.Proj = {
  degRad: 180 / Math.PI,
  radDeg: Math.PI / 180,
  radius: 6381372,

  sgn: function(n){
    if (n > 0) {
      return 1;
    } else if (n < 0) {
      return -1;
    } else {
      return n;
    }
  },

  /**
   * Converts point on sphere to the Cartesian coordinates using Miller projection
   * @param {Number} lat Latitude in degrees
   * @param {Number} lng Longitude in degrees
   * @param {Number} c Central meridian in degrees
   */
  mill: function(lat, lng, c){
    return {
      x: this.radius * (lng - c) * this.radDeg,
      y: - this.radius * Math.log(Math.tan((45 + 0.4 * lat) * this.radDeg)) / 0.8
    };
  },

  /**
   * Inverse function of mill()
   * Converts Cartesian coordinates to point on sphere using Miller projection
   * @param {Number} x X of point in Cartesian system as integer
   * @param {Number} y Y of point in Cartesian system as integer
   * @param {Number} c Central meridian in degrees
   */
  mill_inv: function(x, y, c){
    return {
      lat: (2.5 * Math.atan(Math.exp(0.8 * y / this.radius)) - 5 * Math.PI / 8) * this.degRad,
      lng: (c * this.radDeg + x / this.radius) * this.degRad
    };
  },

  /**
   * Converts point on sphere to the Cartesian coordinates using Mercator projection
   * @param {Number} lat Latitude in degrees
   * @param {Number} lng Longitude in degrees
   * @param {Number} c Central meridian in degrees
   */
  merc: function(lat, lng, c){
    return {
      x: this.radius * (lng - c) * this.radDeg,
      y: - this.radius * Math.log(Math.tan(Math.PI / 4 + lat * Math.PI / 360))
    };
  },

  /**
   * Inverse function of merc()
   * Converts Cartesian coordinates to point on sphere using Mercator projection
   * @param {Number} x X of point in Cartesian system as integer
   * @param {Number} y Y of point in Cartesian system as integer
   * @param {Number} c Central meridian in degrees
   */
  merc_inv: function(x, y, c){
    return {
      lat: (2 * Math.atan(Math.exp(y / this.radius)) - Math.PI / 2) * this.degRad,
      lng: (c * this.radDeg + x / this.radius) * this.degRad
    };
  },

  /**
   * Converts point on sphere to the Cartesian coordinates using Albers Equal-Area Conic
   * projection
   * @see <a href="http://mathworld.wolfram.com/AlbersEqual-AreaConicProjection.html">Albers Equal-Area Conic projection</a>
   * @param {Number} lat Latitude in degrees
   * @param {Number} lng Longitude in degrees
   * @param {Number} c Central meridian in degrees
   */
  aea: function(lat, lng, c){
    var fi0 = 0,
        lambda0 = c * this.radDeg,
        fi1 = 29.5 * this.radDeg,
        fi2 = 45.5 * this.radDeg,
        fi = lat * this.radDeg,
        lambda = lng * this.radDeg,
        n = (Math.sin(fi1)+Math.sin(fi2)) / 2,
        C = Math.cos(fi1)*Math.cos(fi1)+2*n*Math.sin(fi1),
        theta = n*(lambda-lambda0),
        ro = Math.sqrt(C-2*n*Math.sin(fi))/n,
        ro0 = Math.sqrt(C-2*n*Math.sin(fi0))/n;

    return {
      x: ro * Math.sin(theta) * this.radius,
      y: - (ro0 - ro * Math.cos(theta)) * this.radius
    };
  },

  /**
   * Converts Cartesian coordinates to the point on sphere using Albers Equal-Area Conic
   * projection
   * @see <a href="http://mathworld.wolfram.com/AlbersEqual-AreaConicProjection.html">Albers Equal-Area Conic projection</a>
   * @param {Number} x X of point in Cartesian system as integer
   * @param {Number} y Y of point in Cartesian system as integer
   * @param {Number} c Central meridian in degrees
   */
  aea_inv: function(xCoord, yCoord, c){
    var x = xCoord / this.radius,
        y = yCoord / this.radius,
        fi0 = 0,
        lambda0 = c * this.radDeg,
        fi1 = 29.5 * this.radDeg,
        fi2 = 45.5 * this.radDeg,
        n = (Math.sin(fi1)+Math.sin(fi2)) / 2,
        C = Math.cos(fi1)*Math.cos(fi1)+2*n*Math.sin(fi1),
        ro0 = Math.sqrt(C-2*n*Math.sin(fi0))/n,
        ro = Math.sqrt(x*x+(ro0-y)*(ro0-y)),
        theta = Math.atan( x / (ro0 - y) );

    return {
      lat: (Math.asin((C - ro * ro * n * n) / (2 * n))) * this.degRad,
      lng: (lambda0 + theta / n) * this.degRad
    };
  },

  /**
   * Converts point on sphere to the Cartesian coordinates using Lambert conformal
   * conic projection
   * @see <a href="http://mathworld.wolfram.com/LambertConformalConicProjection.html">Lambert Conformal Conic Projection</a>
   * @param {Number} lat Latitude in degrees
   * @param {Number} lng Longitude in degrees
   * @param {Number} c Central meridian in degrees
   */
  lcc: function(lat, lng, c){
    var fi0 = 0,
        lambda0 = c * this.radDeg,
        lambda = lng * this.radDeg,
        fi1 = 33 * this.radDeg,
        fi2 = 45 * this.radDeg,
        fi = lat * this.radDeg,
        n = Math.log( Math.cos(fi1) * (1 / Math.cos(fi2)) ) / Math.log( Math.tan( Math.PI / 4 + fi2 / 2) * (1 / Math.tan( Math.PI / 4 + fi1 / 2) ) ),
        F = ( Math.cos(fi1) * Math.pow( Math.tan( Math.PI / 4 + fi1 / 2 ), n ) ) / n,
        ro = F * Math.pow( 1 / Math.tan( Math.PI / 4 + fi / 2 ), n ),
        ro0 = F * Math.pow( 1 / Math.tan( Math.PI / 4 + fi0 / 2 ), n );

    return {
      x: ro * Math.sin( n * (lambda - lambda0) ) * this.radius,
      y: - (ro0 - ro * Math.cos( n * (lambda - lambda0) ) ) * this.radius
    };
  },

  /**
   * Converts Cartesian coordinates to the point on sphere using Lambert conformal conic
   * projection
   * @see <a href="http://mathworld.wolfram.com/LambertConformalConicProjection.html">Lambert Conformal Conic Projection</a>
   * @param {Number} x X of point in Cartesian system as integer
   * @param {Number} y Y of point in Cartesian system as integer
   * @param {Number} c Central meridian in degrees
   */
  lcc_inv: function(xCoord, yCoord, c){
    var x = xCoord / this.radius,
        y = yCoord / this.radius,
        fi0 = 0,
        lambda0 = c * this.radDeg,
        fi1 = 33 * this.radDeg,
        fi2 = 45 * this.radDeg,
        n = Math.log( Math.cos(fi1) * (1 / Math.cos(fi2)) ) / Math.log( Math.tan( Math.PI / 4 + fi2 / 2) * (1 / Math.tan( Math.PI / 4 + fi1 / 2) ) ),
        F = ( Math.cos(fi1) * Math.pow( Math.tan( Math.PI / 4 + fi1 / 2 ), n ) ) / n,
        ro0 = F * Math.pow( 1 / Math.tan( Math.PI / 4 + fi0 / 2 ), n ),
        ro = this.sgn(n) * Math.sqrt(x*x+(ro0-y)*(ro0-y)),
        theta = Math.atan( x / (ro0 - y) );

    return {
      lat: (2 * Math.atan(Math.pow(F/ro, 1/n)) - Math.PI / 2) * this.degRad,
      lng: (lambda0 + theta / n) * this.degRad
    };
  }
};jvm.MapObject = function(config){};

jvm.MapObject.prototype.getLabelText = function(key){
  var text;

  if (this.config.label) {
    if (typeof this.config.label.render === 'function') {
      text = this.config.label.render(key);
    } else {
      text = key;
    }
  } else {
    text = null;
  }
  return text;
}

jvm.MapObject.prototype.getLabelOffsets = function(key){
  var offsets;

  if (this.config.label) {
    if (typeof this.config.label.offsets === 'function') {
      offsets = this.config.label.offsets(key);
    } else if (typeof this.config.label.offsets === 'object') {
      offsets = this.config.label.offsets[key];
    }
  }
  return offsets || [0, 0];
}

/**
 * Set hovered state to the element. Hovered state means mouse cursor is over element. Styles will be updates respectively.
 * @param {Boolean} isHovered <code>true</code> to make element hovered, <code>false</code> otherwise.
 */
jvm.MapObject.prototype.setHovered = function(isHovered){
  if (this.isHovered !== isHovered) {
    this.isHovered = isHovered;
    this.shape.isHovered = isHovered;
    this.shape.updateStyle();
    if (this.label) {
      this.label.isHovered = isHovered;
      this.label.updateStyle();
    }
  }
};

/**
 * Set selected state to the element. Styles will be updates respectively.
 * @param {Boolean} isSelected <code>true</code> to make element selected, <code>false</code> otherwise.
 */
jvm.MapObject.prototype.setSelected = function(isSelected){
  if (this.isSelected !== isSelected) {
    this.isSelected = isSelected;
    this.shape.isSelected = isSelected;
    this.shape.updateStyle();
    if (this.label) {
      this.label.isSelected = isSelected;
      this.label.updateStyle();
    }
    jvm.$(this.shape).trigger('selected', [isSelected]);
  }
};

jvm.MapObject.prototype.setStyle = function(){
	this.shape.setStyle.apply(this.shape, arguments);
};

jvm.MapObject.prototype.remove = function(){
  this.shape.remove();
  if (this.label) {
    this.label.remove();
  }
};jvm.Region = function(config){
  var bbox,
      text,
      offsets,
      labelDx,
      labelDy;

  this.config = config;
  this.map = this.config.map;

  this.shape = config.canvas.addPath({
    d: config.path,
    'data-code': config.code
  }, config.style, config.canvas.rootElement);
  this.shape.addClass('jvectormap-region jvectormap-element');

  bbox = this.shape.getBBox();

  text = this.getLabelText(config.code);
  if (this.config.label && text) {
    offsets = this.getLabelOffsets(config.code);
    this.labelX = bbox.x + bbox.width / 2 + offsets[0];
    this.labelY = bbox.y + bbox.height / 2 + offsets[1];
    this.label = config.canvas.addText({
      text: text,
      'text-anchor': 'middle',
      'alignment-baseline': 'central',
      x: this.labelX,
      y: this.labelY,
      'data-code': config.code
    }, config.labelStyle, config.labelsGroup);
    this.label.addClass('jvectormap-region jvectormap-element');
  }
};

jvm.inherits(jvm.Region, jvm.MapObject);

jvm.Region.prototype.updateLabelPosition = function(){
  if (this.label) {
    this.label.set({
      x: this.labelX * this.map.scale + this.map.transX * this.map.scale,
      y: this.labelY * this.map.scale + this.map.transY * this.map.scale
    });
  }
};jvm.Marker = function(config){
  var text,
      offsets;

  this.config = config;
  this.map = this.config.map;

  this.isImage = !!this.config.style.initial.image;
  this.createShape();

  text = this.getLabelText(config.index);
  if (this.config.label && text) {
    this.offsets = this.getLabelOffsets(config.index);
    this.labelX = config.cx / this.map.scale - this.map.transX;
    this.labelY = config.cy / this.map.scale - this.map.transY;
    this.label = config.canvas.addText({
      text: text,
      'data-index': config.index,
      dy: "0.6ex",
      x: this.labelX,
      y: this.labelY
    }, config.labelStyle, config.labelsGroup);

    this.label.addClass('jvectormap-marker jvectormap-element');
  }
};

jvm.inherits(jvm.Marker, jvm.MapObject);

jvm.Marker.prototype.createShape = function(){
  var that = this;

  if (this.shape) {
    this.shape.remove();
  }
  this.shape = this.config.canvas[this.isImage ? 'addImage' : 'addCircle']({
    "data-index": this.config.index,
    cx: this.config.cx,
    cy: this.config.cy
  }, this.config.style, this.config.group);

  this.shape.addClass('jvectormap-marker jvectormap-element');

  if (this.isImage) {
    jvm.$(this.shape.node).on('imageloaded', function(){
      that.updateLabelPosition();
    });
  }
};

jvm.Marker.prototype.updateLabelPosition = function(){
  if (this.label) {
    this.label.set({
      x: this.labelX * this.map.scale + this.offsets[0] +
         this.map.transX * this.map.scale + 5 + (this.isImage ? (this.shape.width || 0) / 2 : this.shape.properties.r),
      y: this.labelY * this.map.scale + this.map.transY * this.map.scale + this.offsets[1]
    });
  }
};

jvm.Marker.prototype.setStyle = function(property, value){
  var isImage;

  jvm.Marker.parentClass.prototype.setStyle.apply(this, arguments);

  if (property === 'r') {
    this.updateLabelPosition();
  }

  isImage = !!this.shape.get('image');
  if (isImage != this.isImage) {
    this.isImage = isImage;
    this.config.style = jvm.$.extend(true, {}, this.shape.style);
    this.createShape();
  }
};/**
 * Creates map, draws paths, binds events.
 * @constructor
 * @param {Object} params Parameters to initialize map with.
 * @param {String} params.map Name of the map in the format <code>territory_proj_lang</code> where <code>territory</code> is a unique code or name of the territory which the map represents (ISO 3166 standard is used where possible), <code>proj</code> is a name of projection used to generate representation of the map on the plane (projections are named according to the conventions of proj4 utility) and <code>lang</code> is a code of the language, used for the names of regions.
 * @param {String} params.backgroundColor Background color of the map in CSS format.
 * @param {Boolean} params.zoomOnScroll When set to true map could be zoomed using mouse scroll. Default value is <code>true</code>.
 * @param {Boolean} params.panOnDrag When set to true, the map pans when being dragged. Default value is <code>true</code>.
 * @param {Number} params.zoomMax Indicates the maximum zoom ratio which could be reached zooming the map. Default value is <code>8</code>.
 * @param {Number} params.zoomMin Indicates the minimum zoom ratio which could be reached zooming the map. Default value is <code>1</code>.
 * @param {Number} params.zoomStep Indicates the multiplier used to zoom map with +/- buttons. Default value is <code>1.6</code>.
 * @param {Boolean} params.zoomAnimate Indicates whether or not to animate changing of map zoom with zoom buttons.
 * @param {Boolean} params.regionsSelectable When set to true regions of the map could be selected. Default value is <code>false</code>.
 * @param {Boolean} params.regionsSelectableOne Allow only one region to be selected at the moment. Default value is <code>false</code>.
 * @param {Boolean} params.markersSelectable When set to true markers on the map could be selected. Default value is <code>false</code>.
 * @param {Boolean} params.markersSelectableOne Allow only one marker to be selected at the moment. Default value is <code>false</code>.
 * @param {Object} params.regionStyle Set the styles for the map's regions. Each region or marker has four states: <code>initial</code> (default state), <code>hover</code> (when the mouse cursor is over the region or marker), <code>selected</code> (when region or marker is selected), <code>selectedHover</code> (when the mouse cursor is over the region or marker and it's selected simultaneously). Styles could be set for each of this states. Default value for that parameter is:
<pre>{
  initial: {
    fill: 'white',
    "fill-opacity": 1,
    stroke: 'none',
    "stroke-width": 0,
    "stroke-opacity": 1
  },
  hover: {
    "fill-opacity": 0.8,
    cursor: 'pointer'
  },
  selected: {
    fill: 'yellow'
  },
  selectedHover: {
  }
}</pre>
* @param {Object} params.regionLabelStyle Set the styles for the regions' labels. Each region or marker has four states: <code>initial</code> (default state), <code>hover</code> (when the mouse cursor is over the region or marker), <code>selected</code> (when region or marker is selected), <code>selectedHover</code> (when the mouse cursor is over the region or marker and it's selected simultaneously). Styles could be set for each of this states. Default value for that parameter is:
<pre>{
  initial: {
    'font-family': 'Verdana',
    'font-size': '12',
    'font-weight': 'bold',
    cursor: 'default',
    fill: 'black'
  },
  hover: {
    cursor: 'pointer'
  }
}</pre>
 * @param {Object} params.markerStyle Set the styles for the map's markers. Any parameter suitable for <code>regionStyle</code> could be used as well as numeric parameter <code>r</code> to set the marker's radius. Default value for that parameter is:
<pre>{
  initial: {
    fill: 'grey',
    stroke: '#505050',
    "fill-opacity": 1,
    "stroke-width": 1,
    "stroke-opacity": 1,
    r: 5
  },
  hover: {
    stroke: 'black',
    "stroke-width": 2,
    cursor: 'pointer'
  },
  selected: {
    fill: 'blue'
  },
  selectedHover: {
  }
}</pre>
 * @param {Object} params.markerLabelStyle Set the styles for the markers' labels. Default value for that parameter is:
<pre>{
  initial: {
    'font-family': 'Verdana',
    'font-size': '12',
    'font-weight': 'bold',
    cursor: 'default',
    fill: 'black'
  },
  hover: {
    cursor: 'pointer'
  }
}</pre>
 * @param {Object|Array} params.markers Set of markers to add to the map during initialization. In case of array is provided, codes of markers will be set as string representations of array indexes. Each marker is represented by <code>latLng</code> (array of two numeric values), <code>name</code> (string which will be show on marker's tip) and any marker styles.
 * @param {Object} params.series Object with two keys: <code>markers</code> and <code>regions</code>. Each of which is an array of series configs to be applied to the respective map elements. See <a href="jvm.DataSeries.html">DataSeries</a> description for a list of parameters available.
 * @param {Object|String} params.focusOn This parameter sets the initial position and scale of the map viewport. See <code>setFocus</code> docuemntation for possible parameters.
 * @param {Object} params.labels Defines parameters for rendering static labels. Object could contain two keys: <code>regions</code> and <code>markers</code>. Each key value defines configuration object with the following possible options:
<ul>
  <li><code>render {Function}</code> - defines method for converting region code or marker index to actual label value.</li>
  <li><code>offsets {Object|Function}</code> - provides method or object which could be used to define label offset by region code or marker index.</li>
</ul>
<b>Plase note: static labels feature is not supported in Internet Explorer 8 and below.</b>
 * @param {Array|Object|String} params.selectedRegions Set initially selected regions.
 * @param {Array|Object|String} params.selectedMarkers Set initially selected markers.
 * @param {Function} params.onRegionTipShow <code>(Event e, Object tip, String code)</code> Will be called right before the region tip is going to be shown.
 * @param {Function} params.onRegionOver <code>(Event e, String code)</code> Will be called on region mouse over event.
 * @param {Function} params.onRegionOut <code>(Event e, String code)</code> Will be called on region mouse out event.
 * @param {Function} params.onRegionClick <code>(Event e, String code)</code> Will be called on region click event.
 * @param {Function} params.onRegionSelected <code>(Event e, String code, Boolean isSelected, Array selectedRegions)</code> Will be called when region is (de)selected. <code>isSelected</code> parameter of the callback indicates whether region is selected or not. <code>selectedRegions</code> contains codes of all currently selected regions.
 * @param {Function} params.onMarkerTipShow <code>(Event e, Object tip, String code)</code> Will be called right before the marker tip is going to be shown.
 * @param {Function} params.onMarkerOver <code>(Event e, String code)</code> Will be called on marker mouse over event.
 * @param {Function} params.onMarkerOut <code>(Event e, String code)</code> Will be called on marker mouse out event.
 * @param {Function} params.onMarkerClick <code>(Event e, String code)</code> Will be called on marker click event.
 * @param {Function} params.onMarkerSelected <code>(Event e, String code, Boolean isSelected, Array selectedMarkers)</code> Will be called when marker is (de)selected. <code>isSelected</code> parameter of the callback indicates whether marker is selected or not. <code>selectedMarkers</code> contains codes of all currently selected markers.
 * @param {Function} params.onViewportChange <code>(Event e, Number scale)</code> Triggered when the map's viewport is changed (map was panned or zoomed).
 */
jvm.Map = function(params) {
  var map = this,
      e;

  this.params = jvm.$.extend(true, {}, jvm.Map.defaultParams, params);

  if (!jvm.Map.maps[this.params.map]) {
    throw new Error('Attempt to use map which was not loaded: '+this.params.map);
  }

  this.mapData = jvm.Map.maps[this.params.map];
  this.markers = {};
  this.regions = {};
  this.regionsColors = {};
  this.regionsData = {};

  this.container = jvm.$('<div>').addClass('jvectormap-container');
  if (this.params.container) {
    this.params.container.append( this.container );
  }
  this.container.data('mapObject', this);

  this.defaultWidth = this.mapData.width;
  this.defaultHeight = this.mapData.height;

  this.setBackgroundColor(this.params.backgroundColor);

  this.onResize = function(){
    map.updateSize();
  }
  jvm.$(window).resize(this.onResize);

  for (e in jvm.Map.apiEvents) {
    if (this.params[e]) {
      this.container.bind(jvm.Map.apiEvents[e]+'.jvectormap', this.params[e]);
    }
  }

  this.canvas = new jvm.VectorCanvas(this.container[0], this.width, this.height);

  if ( ('ontouchstart' in window) || (window.DocumentTouch && document instanceof DocumentTouch) ) {
    if (this.params.bindTouchEvents) {
      this.bindContainerTouchEvents();
    }
  }
  this.bindContainerEvents();
  this.bindElementEvents();
  this.createTip();
  if (this.params.zoomButtons) {
    this.bindZoomButtons();
  }

  this.createRegions();
  this.createMarkers(this.params.markers || {});

  this.updateSize();

  if (this.params.focusOn) {
    if (typeof this.params.focusOn === 'string') {
      this.params.focusOn = {region: this.params.focusOn};
    } else if (jvm.$.isArray(this.params.focusOn)) {
      this.params.focusOn = {regions: this.params.focusOn};
    }
    this.setFocus(this.params.focusOn);
  }

  if (this.params.selectedRegions) {
    this.setSelectedRegions(this.params.selectedRegions);
  }
  if (this.params.selectedMarkers) {
    this.setSelectedMarkers(this.params.selectedMarkers);
  }

  this.legendCntHorizontal = jvm.$('<div/>').addClass('jvectormap-legend-cnt jvectormap-legend-cnt-h');
  this.legendCntVertical = jvm.$('<div/>').addClass('jvectormap-legend-cnt jvectormap-legend-cnt-v');
  this.container.append(this.legendCntHorizontal);
  this.container.append(this.legendCntVertical);

  if (this.params.series) {
    this.createSeries();
  }
};

jvm.Map.prototype = {
  transX: 0,
  transY: 0,
  scale: 1,
  baseTransX: 0,
  baseTransY: 0,
  baseScale: 1,

  width: 0,
  height: 0,

  /**
   * Set background color of the map.
   * @param {String} backgroundColor Background color in CSS format.
   */
  setBackgroundColor: function(backgroundColor) {
    this.container.css('background-color', backgroundColor);
  },

  resize: function() {
    var curBaseScale = this.baseScale;
    if (this.width / this.height > this.defaultWidth / this.defaultHeight) {
      this.baseScale = this.height / this.defaultHeight;
      this.baseTransX = Math.abs(this.width - this.defaultWidth * this.baseScale) / (2 * this.baseScale);
    } else {
      this.baseScale = this.width / this.defaultWidth;
      this.baseTransY = Math.abs(this.height - this.defaultHeight * this.baseScale) / (2 * this.baseScale);
    }
    this.scale *= this.baseScale / curBaseScale;
    this.transX *= this.baseScale / curBaseScale;
    this.transY *= this.baseScale / curBaseScale;
  },

  /**
   * Synchronize the size of the map with the size of the container. Suitable in situations where the size of the container is changed programmatically or container is shown after it became visible.
   */
  updateSize: function(){
    this.width = this.container.width();
    this.height = this.container.height();
    this.resize();
    this.canvas.setSize(this.width, this.height);
    this.applyTransform();
  },

  /**
   * Reset all the series and show the map with the initial zoom.
   */
  reset: function() {
    var key,
        i;

    for (key in this.series) {
      for (i = 0; i < this.series[key].length; i++) {
        this.series[key][i].clear();
      }
    }
    this.scale = this.baseScale;
    this.transX = this.baseTransX;
    this.transY = this.baseTransY;
    this.applyTransform();
  },

  applyTransform: function() {
    var maxTransX,
        maxTransY,
        minTransX,
        minTransY;

    if (this.defaultWidth * this.scale <= this.width) {
      maxTransX = (this.width - this.defaultWidth * this.scale) / (2 * this.scale);
      minTransX = (this.width - this.defaultWidth * this.scale) / (2 * this.scale);
    } else {
      maxTransX = 0;
      minTransX = (this.width - this.defaultWidth * this.scale) / this.scale;
    }

    if (this.defaultHeight * this.scale <= this.height) {
      maxTransY = (this.height - this.defaultHeight * this.scale) / (2 * this.scale);
      minTransY = (this.height - this.defaultHeight * this.scale) / (2 * this.scale);
    } else {
      maxTransY = 0;
      minTransY = (this.height - this.defaultHeight * this.scale) / this.scale;
    }

    if (this.transY > maxTransY) {
      this.transY = maxTransY;
    } else if (this.transY < minTransY) {
      this.transY = minTransY;
    }
    if (this.transX > maxTransX) {
      this.transX = maxTransX;
    } else if (this.transX < minTransX) {
      this.transX = minTransX;
    }

    this.canvas.applyTransformParams(this.scale, this.transX, this.transY);

    if (this.markers) {
      this.repositionMarkers();
    }

    this.repositionLabels();

    this.container.trigger('viewportChange', [this.scale/this.baseScale, this.transX, this.transY]);
  },

  bindContainerEvents: function(){
    var mouseDown = false,
        oldPageX,
        oldPageY,
        map = this;

    if (this.params.panOnDrag) {
      this.container.mousemove(function(e){
        if (mouseDown) {
          map.transX -= (oldPageX - e.pageX) / map.scale;
          map.transY -= (oldPageY - e.pageY) / map.scale;

          map.applyTransform();

          oldPageX = e.pageX;
          oldPageY = e.pageY;
        }
        return false;
      }).mousedown(function(e){
        mouseDown = true;
        oldPageX = e.pageX;
        oldPageY = e.pageY;
        return false;
      });

      this.onContainerMouseUp = function(){
        mouseDown = false;
      };
      jvm.$('body').mouseup(this.onContainerMouseUp);
    }

    if (this.params.zoomOnScroll) {
      this.container.mousewheel(function(event, delta, deltaX, deltaY) {
        var offset = jvm.$(map.container).offset(),
            centerX = event.pageX - offset.left,
            centerY = event.pageY - offset.top,
            zoomStep = Math.pow(1.2, event.deltaY);

        map.tip.hide();

        map.setScale(map.scale * zoomStep, centerX, centerY);
        event.preventDefault();
      });
    }
  },

  bindContainerTouchEvents: function(){
    var touchStartScale,
        touchStartDistance,
        map = this,
        touchX,
        touchY,
        centerTouchX,
        centerTouchY,
        lastTouchesLength,
        handleTouchEvent = function(e){
          var touches = e.originalEvent.touches,
              offset,
              scale,
              transXOld,
              transYOld;

          if (e.type == 'touchstart') {
            lastTouchesLength = 0;
          }

          if (touches.length == 1) {
            if (lastTouchesLength == 1) {
              transXOld = map.transX;
              transYOld = map.transY;
              map.transX -= (touchX - touches[0].pageX) / map.scale;
              map.transY -= (touchY - touches[0].pageY) / map.scale;
              map.applyTransform();
              map.tip.hide();
              if (transXOld != map.transX || transYOld != map.transY) {
                e.preventDefault();
              }
            }
            touchX = touches[0].pageX;
            touchY = touches[0].pageY;
          } else if (touches.length == 2) {
            if (lastTouchesLength == 2) {
              scale = Math.sqrt(
                Math.pow(touches[0].pageX - touches[1].pageX, 2) +
                Math.pow(touches[0].pageY - touches[1].pageY, 2)
              ) / touchStartDistance;
              map.setScale(
                touchStartScale * scale,
                centerTouchX,
                centerTouchY
              )
              map.tip.hide();
              e.preventDefault();
            } else {
              offset = jvm.$(map.container).offset();
              if (touches[0].pageX > touches[1].pageX) {
                centerTouchX = touches[1].pageX + (touches[0].pageX - touches[1].pageX) / 2;
              } else {
                centerTouchX = touches[0].pageX + (touches[1].pageX - touches[0].pageX) / 2;
              }
              if (touches[0].pageY > touches[1].pageY) {
                centerTouchY = touches[1].pageY + (touches[0].pageY - touches[1].pageY) / 2;
              } else {
                centerTouchY = touches[0].pageY + (touches[1].pageY - touches[0].pageY) / 2;
              }
              centerTouchX -= offset.left;
              centerTouchY -= offset.top;
              touchStartScale = map.scale;
              touchStartDistance = Math.sqrt(
                Math.pow(touches[0].pageX - touches[1].pageX, 2) +
                Math.pow(touches[0].pageY - touches[1].pageY, 2)
              );
            }
          }

          lastTouchesLength = touches.length;
        };

    jvm.$(this.container).bind('touchstart', handleTouchEvent);
    jvm.$(this.container).bind('touchmove', handleTouchEvent);
  },

  bindElementEvents: function(){
    var map = this,
        mouseMoved;

    this.container.mousemove(function(){
      mouseMoved = true;
    });

    /* Can not use common class selectors here because of the bug in jQuery
       SVG handling, use with caution. */
    this.container.delegate("[class~='jvectormap-element']", 'mouseover mouseout', function(e){
      var baseVal = jvm.$(this).attr('class').baseVal || jvm.$(this).attr('class'),
          type = baseVal.indexOf('jvectormap-region') === -1 ? 'marker' : 'region',
          code = type == 'region' ? jvm.$(this).attr('data-code') : jvm.$(this).attr('data-index'),
          element = type == 'region' ? map.regions[code].element : map.markers[code].element,
          tipText = type == 'region' ? map.mapData.paths[code].name : (map.markers[code].config.name || ''),
          tipShowEvent = jvm.$.Event(type+'TipShow.jvectormap'),
          overEvent = jvm.$.Event(type+'Over.jvectormap');

      if (e.type == 'mouseover') {
        map.container.trigger(overEvent, [code]);
        if (!overEvent.isDefaultPrevented()) {
          element.setHovered(true);
        }

        map.tip.text(tipText);
        map.container.trigger(tipShowEvent, [map.tip, code]);
        if (!tipShowEvent.isDefaultPrevented()) {
          map.tip.show();
          map.tipWidth = map.tip.width();
          map.tipHeight = map.tip.height();
        }
      } else {
        element.setHovered(false);
        map.tip.hide();
        map.container.trigger(type+'Out.jvectormap', [code]);
      }
    });

    /* Can not use common class selectors here because of the bug in jQuery
       SVG handling, use with caution. */
    this.container.delegate("[class~='jvectormap-element']", 'mousedown', function(){
      mouseMoved = false;
    });

    /* Can not use common class selectors here because of the bug in jQuery
       SVG handling, use with caution. */
    this.container.delegate("[class~='jvectormap-element']", 'mouseup', function(){
      var baseVal = jvm.$(this).attr('class').baseVal ? jvm.$(this).attr('class').baseVal : jvm.$(this).attr('class'),
          type = baseVal.indexOf('jvectormap-region') === -1 ? 'marker' : 'region',
          code = type == 'region' ? jvm.$(this).attr('data-code') : jvm.$(this).attr('data-index'),
          clickEvent = jvm.$.Event(type+'Click.jvectormap'),
          element = type == 'region' ? map.regions[code].element : map.markers[code].element;

      if (!mouseMoved) {
        map.container.trigger(clickEvent, [code]);
        if ((type === 'region' && map.params.regionsSelectable) || (type === 'marker' && map.params.markersSelectable)) {
          if (!clickEvent.isDefaultPrevented()) {
            if (map.params[type+'sSelectableOne']) {
              map.clearSelected(type+'s');
            }
            element.setSelected(!element.isSelected);
          }
        }
      }
    });
  },

  bindZoomButtons: function() {
    var map = this;

    jvm.$('<div/>').addClass('jvectormap-zoomin').text('+').appendTo(this.container);
    jvm.$('<div/>').addClass('jvectormap-zoomout').html('&#x2212;').appendTo(this.container);

    this.container.find('.jvectormap-zoomin').click(function(){
      map.setScale(map.scale * map.params.zoomStep, map.width / 2, map.height / 2, false, map.params.zoomAnimate);
    });
    this.container.find('.jvectormap-zoomout').click(function(){
      map.setScale(map.scale / map.params.zoomStep, map.width / 2, map.height / 2, false, map.params.zoomAnimate);
    });
  },

  createTip: function(){
    var map = this;

    this.tip = jvm.$('<div/>').addClass('jvectormap-tip').appendTo(jvm.$('body'));

    this.container.mousemove(function(e){
      var left = e.pageX-15-map.tipWidth,
          top = e.pageY-15-map.tipHeight;

      if (left < 5) {
        left = e.pageX + 15;
      }
      if (top < 5) {
        top = e.pageY + 15;
      }

      if (map.tip.is(':visible')) {
        map.tip.css({
          left: left,
          top: top
        })
      }
    });
  },

  setScale: function(scale, anchorX, anchorY, isCentered, animate) {
    var viewportChangeEvent = jvm.$.Event('zoom.jvectormap'),
        interval,
        that = this,
        i = 0,
        count = Math.abs(Math.round((scale - this.scale) * 60 / Math.max(scale, this.scale))),
        scaleStart,
        scaleDiff,
        transXStart,
        transXDiff,
        transYStart,
        transYDiff,
        transX,
        transY,
        deferred = new jvm.$.Deferred();

    if (scale > this.params.zoomMax * this.baseScale) {
      scale = this.params.zoomMax * this.baseScale;
    } else if (scale < this.params.zoomMin * this.baseScale) {
      scale = this.params.zoomMin * this.baseScale;
    }

    if (typeof anchorX != 'undefined' && typeof anchorY != 'undefined') {
      zoomStep = scale / this.scale;
      if (isCentered) {
        transX = anchorX + this.defaultWidth * (this.width / (this.defaultWidth * scale)) / 2;
        transY = anchorY + this.defaultHeight * (this.height / (this.defaultHeight * scale)) / 2;
      } else {
        transX = this.transX - (zoomStep - 1) / scale * anchorX;
        transY = this.transY - (zoomStep - 1) / scale * anchorY;
      }
    }

    if (animate && count > 0)  {
      scaleStart = this.scale;
      scaleDiff = (scale - scaleStart) / count;
      transXStart = this.transX * this.scale;
      transYStart = this.transY * this.scale;
      transXDiff = (transX * scale - transXStart) / count;
      transYDiff = (transY * scale - transYStart) / count;
      interval = setInterval(function(){
        i += 1;
        that.scale = scaleStart + scaleDiff * i;
        that.transX = (transXStart + transXDiff * i) / that.scale;
        that.transY = (transYStart + transYDiff * i) / that.scale;
        that.applyTransform();
        if (i == count) {
          clearInterval(interval);
          that.container.trigger(viewportChangeEvent, [scale/that.baseScale]);
          deferred.resolve();
        }
      }, 10);
    } else {
      this.transX = transX;
      this.transY = transY;
      this.scale = scale;
      this.applyTransform();
      this.container.trigger(viewportChangeEvent, [scale/this.baseScale]);
      deferred.resolve();
    }

    return deferred;
  },

  /**
   * Set the map's viewport to the specific point and set zoom of the map to the specific level. Point and zoom level could be defined in two ways: using the code of some region to focus on or a central point and zoom level as numbers.
   * @param This method takes a configuration object as the single argument. The options passed to it are the following:
   * @param {Array} params.regions Array of region codes to zoom to.
   * @param {String} params.region Region code to zoom to.
   * @param {Number} params.scale Map scale to set.
   * @param {Number} params.lat Latitude to set viewport to.
   * @param {Number} params.lng Longitude to set viewport to.
   * @param {Number} params.x Number from 0 to 1 specifying the horizontal coordinate of the central point of the viewport.
   * @param {Number} params.y Number from 0 to 1 specifying the vertical coordinate of the central point of the viewport.
   * @param {Boolean} params.animate Indicates whether or not to animate the scale change and transition.
   */
  setFocus: function(config){
    var bbox,
        itemBbox,
        newBbox,
        codes,
        i,
        point;

    config = config || {};

    if (config.region) {
      codes = [config.region];
    } else if (config.regions) {
      codes = config.regions;
    }

    if (codes) {
      for (i = 0; i < codes.length; i++) {
        if (this.regions[codes[i]]) {
          itemBbox = this.regions[codes[i]].element.shape.getBBox();
          if (itemBbox) {
            if (typeof bbox == 'undefined') {
              bbox = itemBbox;
            } else {
              newBbox = {
                x: Math.min(bbox.x, itemBbox.x),
                y: Math.min(bbox.y, itemBbox.y),
                width: Math.max(bbox.x + bbox.width, itemBbox.x + itemBbox.width) - Math.min(bbox.x, itemBbox.x),
                height: Math.max(bbox.y + bbox.height, itemBbox.y + itemBbox.height) - Math.min(bbox.y, itemBbox.y)
              }
              bbox = newBbox;
            }
          }
        }
      }
      return this.setScale(
        Math.min(this.width / bbox.width, this.height / bbox.height),
        - (bbox.x + bbox.width / 2),
        - (bbox.y + bbox.height / 2),
        true,
        config.animate
      );
    } else {
      if (config.lat && config.lng) {
        point = this.latLngToPoint(config.lat, config.lng);
        config.x = this.transX - point.x / this.scale;
        config.y = this.transY - point.y / this.scale;
      } else if (config.x && config.y) {
        config.x *= -this.defaultWidth;
        config.y *= -this.defaultHeight;
      }
      return this.setScale(config.scale * this.baseScale, config.x, config.y, true, config.animate);
    }
  },

  getSelected: function(type){
    var key,
        selected = [];

    for (key in this[type]) {
      if (this[type][key].element.isSelected) {
        selected.push(key);
      }
    }
    return selected;
  },

  /**
   * Return the codes of currently selected regions.
   * @returns {Array}
   */
  getSelectedRegions: function(){
    return this.getSelected('regions');
  },

  /**
   * Return the codes of currently selected markers.
   * @returns {Array}
   */
  getSelectedMarkers: function(){
    return this.getSelected('markers');
  },

  setSelected: function(type, keys){
    var i;

    if (typeof keys != 'object') {
      keys = [keys];
    }

    if (jvm.$.isArray(keys)) {
      for (i = 0; i < keys.length; i++) {
        this[type][keys[i]].element.setSelected(true);
      }
    } else {
      for (i in keys) {
        this[type][i].element.setSelected(!!keys[i]);
      }
    }
  },

  /**
   * Set or remove selected state for the regions.
   * @param {String|Array|Object} keys If <code>String</code> or <code>Array</code> the region(s) with the corresponding code(s) will be selected. If <code>Object</code> was provided its keys are  codes of regions, state of which should be changed. Selected state will be set if value is true, removed otherwise.
   */
  setSelectedRegions: function(keys){
    this.setSelected('regions', keys);
  },

  /**
   * Set or remove selected state for the markers.
   * @param {String|Array|Object} keys If <code>String</code> or <code>Array</code> the marker(s) with the corresponding code(s) will be selected. If <code>Object</code> was provided its keys are  codes of markers, state of which should be changed. Selected state will be set if value is true, removed otherwise.
   */
  setSelectedMarkers: function(keys){
    this.setSelected('markers', keys);
  },

  clearSelected: function(type){
    var select = {},
        selected = this.getSelected(type),
        i;

    for (i = 0; i < selected.length; i++) {
      select[selected[i]] = false;
    };

    this.setSelected(type, select);
  },

  /**
   * Remove the selected state from all the currently selected regions.
   */
  clearSelectedRegions: function(){
    this.clearSelected('regions');
  },

  /**
   * Remove the selected state from all the currently selected markers.
   */
  clearSelectedMarkers: function(){
    this.clearSelected('markers');
  },

  /**
   * Return the instance of Map. Useful when instantiated as a jQuery plug-in.
   * @returns {Map}
   */
  getMapObject: function(){
    return this;
  },

  /**
   * Return the name of the region by region code.
   * @returns {String}
   */
  getRegionName: function(code){
    return this.mapData.paths[code].name;
  },

  createRegions: function(){
    var key,
        region,
        map = this;

    this.regionLabelsGroup = this.regionLabelsGroup || this.canvas.addGroup();

    for (key in this.mapData.paths) {
      region = new jvm.Region({
        map: this,
        path: this.mapData.paths[key].path,
        code: key,
        style: jvm.$.extend(true, {}, this.params.regionStyle),
        labelStyle: jvm.$.extend(true, {}, this.params.regionLabelStyle),
        canvas: this.canvas,
        labelsGroup: this.regionLabelsGroup,
        label: this.canvas.mode != 'vml' ? (this.params.labels && this.params.labels.regions) : null
      });

      jvm.$(region.shape).bind('selected', function(e, isSelected){
        map.container.trigger('regionSelected.jvectormap', [jvm.$(this.node).attr('data-code'), isSelected, map.getSelectedRegions()]);
      });
      this.regions[key] = {
        element: region,
        config: this.mapData.paths[key]
      };
    }
  },

  createMarkers: function(markers) {
    var i,
        marker,
        point,
        markerConfig,
        markersArray,
        map = this;

    this.markersGroup = this.markersGroup || this.canvas.addGroup();
    this.markerLabelsGroup = this.markerLabelsGroup || this.canvas.addGroup();

    if (jvm.$.isArray(markers)) {
      markersArray = markers.slice();
      markers = {};
      for (i = 0; i < markersArray.length; i++) {
        markers[i] = markersArray[i];
      }
    }

    for (i in markers) {
      markerConfig = markers[i] instanceof Array ? {latLng: markers[i]} : markers[i];
      point = this.getMarkerPosition( markerConfig );

      if (point !== false) {
        marker = new jvm.Marker({
          map: this,
          style: jvm.$.extend(true, {}, this.params.markerStyle, {initial: markerConfig.style || {}}),
          labelStyle: jvm.$.extend(true, {}, this.params.markerLabelStyle),
          index: i,
          cx: point.x,
          cy: point.y,
          group: this.markersGroup,
          canvas: this.canvas,
          labelsGroup: this.markerLabelsGroup,
          label: this.canvas.mode != 'vml' ? (this.params.labels && this.params.labels.markers) : null
        });

        jvm.$(marker.shape).bind('selected', function(e, isSelected){
          map.container.trigger('markerSelected.jvectormap', [jvm.$(this.node).attr('data-index'), isSelected, map.getSelectedMarkers()]);
        });
        if (this.markers[i]) {
          this.removeMarkers([i]);
        }
        this.markers[i] = {element: marker, config: markerConfig};
      }
    }
  },

  repositionMarkers: function() {
    var i,
        point;

    for (i in this.markers) {
      point = this.getMarkerPosition( this.markers[i].config );
      if (point !== false) {
        this.markers[i].element.setStyle({cx: point.x, cy: point.y});
      }
    }
  },

  repositionLabels: function() {
    var key;

    for (key in this.regions) {
      this.regions[key].element.updateLabelPosition();
    }

    for (key in this.markers) {
      this.markers[key].element.updateLabelPosition();
    }
  },

  getMarkerPosition: function(markerConfig) {
    if (jvm.Map.maps[this.params.map].projection) {
      return this.latLngToPoint.apply(this, markerConfig.latLng || [0, 0]);
    } else {
      return {
        x: markerConfig.coords[0]*this.scale + this.transX*this.scale,
        y: markerConfig.coords[1]*this.scale + this.transY*this.scale
      };
    }
  },

  /**
   * Add one marker to the map.
   * @param {String} key Marker unique code.
   * @param {Object} marker Marker configuration parameters.
   * @param {Array} seriesData Values to add to the data series.
   */
  addMarker: function(key, marker, seriesData){
    var markers = {},
        data = [],
        values,
        i,
        seriesData = seriesData || [];

    markers[key] = marker;

    for (i = 0; i < seriesData.length; i++) {
      values = {};
      if (typeof seriesData[i] !== 'undefined') {
        values[key] = seriesData[i];
      }
      data.push(values);
    }
    this.addMarkers(markers, data);
  },

  /**
   * Add set of marker to the map.
   * @param {Object|Array} markers Markers to add to the map. In case of array is provided, codes of markers will be set as string representations of array indexes.
   * @param {Array} seriesData Values to add to the data series.
   */
  addMarkers: function(markers, seriesData){
    var i;

    seriesData = seriesData || [];

    this.createMarkers(markers);
    for (i = 0; i < seriesData.length; i++) {
      this.series.markers[i].setValues(seriesData[i] || {});
    };
  },

  /**
   * Remove some markers from the map.
   * @param {Array} markers Array of marker codes to be removed.
   */
  removeMarkers: function(markers){
    var i;

    for (i = 0; i < markers.length; i++) {
      this.markers[ markers[i] ].element.remove();
      delete this.markers[ markers[i] ];
    };
  },

  /**
   * Remove all markers from the map.
   */
  removeAllMarkers: function(){
    var i,
        markers = [];

    for (i in this.markers) {
      markers.push(i);
    }
    this.removeMarkers(markers)
  },

  /**
   * Converts coordinates expressed as latitude and longitude to the coordinates in pixels on the map.
   * @param {Number} lat Latitide of point in degrees.
   * @param {Number} lng Longitude of point in degrees.
   */
  latLngToPoint: function(lat, lng) {
    var point,
        proj = jvm.Map.maps[this.params.map].projection,
        centralMeridian = proj.centralMeridian,
        inset,
        bbox;

    if (lng < (-180 + centralMeridian)) {
      lng += 360;
    }

    point = jvm.Proj[proj.type](lat, lng, centralMeridian);

    inset = this.getInsetForPoint(point.x, point.y);
    if (inset) {
      bbox = inset.bbox;

      point.x = (point.x - bbox[0].x) / (bbox[1].x - bbox[0].x) * inset.width * this.scale;
      point.y = (point.y - bbox[0].y) / (bbox[1].y - bbox[0].y) * inset.height * this.scale;

      return {
        x: point.x + this.transX*this.scale + inset.left*this.scale,
        y: point.y + this.transY*this.scale + inset.top*this.scale
      };
     } else {
       return false;
     }
  },

  /**
   * Converts cartesian coordinates into coordinates expressed as latitude and longitude.
   * @param {Number} x X-axis of point on map in pixels.
   * @param {Number} y Y-axis of point on map in pixels.
   */
  pointToLatLng: function(x, y) {
    var proj = jvm.Map.maps[this.params.map].projection,
        centralMeridian = proj.centralMeridian,
        insets = jvm.Map.maps[this.params.map].insets,
        i,
        inset,
        bbox,
        nx,
        ny;

    for (i = 0; i < insets.length; i++) {
      inset = insets[i];
      bbox = inset.bbox;

      nx = x - (this.transX*this.scale + inset.left*this.scale);
      ny = y - (this.transY*this.scale + inset.top*this.scale);

      nx = (nx / (inset.width * this.scale)) * (bbox[1].x - bbox[0].x) + bbox[0].x;
      ny = (ny / (inset.height * this.scale)) * (bbox[1].y - bbox[0].y) + bbox[0].y;

      if (nx > bbox[0].x && nx < bbox[1].x && ny > bbox[0].y && ny < bbox[1].y) {
        return jvm.Proj[proj.type + '_inv'](nx, -ny, centralMeridian);
      }
    }

    return false;
  },

  getInsetForPoint: function(x, y){
    var insets = jvm.Map.maps[this.params.map].insets,
        i,
        bbox;

    for (i = 0; i < insets.length; i++) {
      bbox = insets[i].bbox;
      if (x > bbox[0].x && x < bbox[1].x && y > bbox[0].y && y < bbox[1].y) {
        return insets[i];
      }
    }
  },

  createSeries: function(){
    var i,
        key;

    this.series = {
      markers: [],
      regions: []
    };

    for (key in this.params.series) {
      for (i = 0; i < this.params.series[key].length; i++) {
        this.series[key][i] = new jvm.DataSeries(
          this.params.series[key][i],
          this[key],
          this
        );
      }
    }
  },

  /**
   * Gracefully remove the map and and all its accessories, unbind event handlers.
   */
  remove: function(){
    this.tip.remove();
    this.container.remove();
    jvm.$(window).unbind('resize', this.onResize);
    jvm.$('body').unbind('mouseup', this.onContainerMouseUp);
  }
};

jvm.Map.maps = {};
jvm.Map.defaultParams = {
  map: 'world_mill_en',
  backgroundColor: '#505050',
  zoomButtons: true,
  zoomOnScroll: true,
  panOnDrag: true,
  zoomMax: 8,
  zoomMin: 1,
  zoomStep: 1.6,
  zoomAnimate: true,
  regionsSelectable: false,
  markersSelectable: false,
  bindTouchEvents: true,
  regionStyle: {
    initial: {
      fill: 'white',
      "fill-opacity": 1,
      stroke: 'none',
      "stroke-width": 0,
      "stroke-opacity": 1
    },
    hover: {
      "fill-opacity": 0.8,
      cursor: 'pointer'
    },
    selected: {
      fill: 'yellow'
    },
    selectedHover: {
    }
  },
  regionLabelStyle: {
    initial: {
      'font-family': 'Verdana',
      'font-size': '12',
      'font-weight': 'bold',
      cursor: 'default',
      fill: 'black'
    },
    hover: {
      cursor: 'pointer'
    }
  },
  markerStyle: {
    initial: {
      fill: 'grey',
      stroke: '#505050',
      "fill-opacity": 1,
      "stroke-width": 1,
      "stroke-opacity": 1,
      r: 5
    },
    hover: {
      stroke: 'black',
      "stroke-width": 2,
      cursor: 'pointer'
    },
    selected: {
      fill: 'blue'
    },
    selectedHover: {
    }
  },
  markerLabelStyle: {
    initial: {
      'font-family': 'Verdana',
      'font-size': '12',
      'font-weight': 'bold',
      cursor: 'default',
      fill: 'black'
    },
    hover: {
      cursor: 'pointer'
    }
  }
};
jvm.Map.apiEvents = {
  onRegionTipShow: 'regionTipShow',
  onRegionOver: 'regionOver',
  onRegionOut: 'regionOut',
  onRegionClick: 'regionClick',
  onRegionSelected: 'regionSelected',
  onMarkerTipShow: 'markerTipShow',
  onMarkerOver: 'markerOver',
  onMarkerOut: 'markerOut',
  onMarkerClick: 'markerClick',
  onMarkerSelected: 'markerSelected',
  onViewportChange: 'viewportChange'
};
/**
 * Creates map with drill-down functionality.
 * @constructor
 * @param {Object} params Parameters to initialize map with.
 * @param {Number} params.maxLevel Maximum number of levels user can go through
 * @param {Object} params.main Config of the main map. See <a href="./jvm-map/">jvm.Map</a> for more information.
 * @param {Function} params.mapNameByCode Function go generate map name by region code. Default value is:
<pre>
function(code, multiMap) {
  return code.toLowerCase()+'_'+
         multiMap.defaultProjection+'_en';
}
</pre>
 * @param {Function} params.mapUrlByCode Function to generate map url by region code. Default value is:
<pre>
function(code, multiMap){
  return 'jquery-jvectormap-data-'+
         code.toLowerCase()+'-'+
         multiMap.defaultProjection+'-en.js';
}
</pre>
 */
jvm.MultiMap = function(params) {
  var that = this;

  this.maps = {};
  this.params = jvm.$.extend(true, {}, jvm.MultiMap.defaultParams, params);
  this.params.maxLevel = this.params.maxLevel || Number.MAX_VALUE;
  this.params.main = this.params.main || {};
  this.params.main.multiMapLevel = 0;
  this.history = [ this.addMap(this.params.main.map, this.params.main) ];
  this.defaultProjection = this.history[0].mapData.projection.type;
  this.mapsLoaded = {};

  this.params.container.css({position: 'relative'});
  this.backButton = jvm.$('<div/>').addClass('jvectormap-goback').text('Back').appendTo(this.params.container);
  this.backButton.hide();
  this.backButton.click(function(){
    that.goBack();
  });

  this.spinner = jvm.$('<div/>').addClass('jvectormap-spinner').appendTo(this.params.container);
  this.spinner.hide();
};

jvm.MultiMap.prototype = {
  addMap: function(name, config){
    var cnt = jvm.$('<div/>').css({
      width: '100%',
      height: '100%'
    });

    this.params.container.append(cnt);

    this.maps[name] = new jvm.Map(jvm.$.extend(config, {container: cnt}));
    if (this.params.maxLevel > config.multiMapLevel) {
      this.maps[name].container.on('regionClick.jvectormap', {scope: this}, function(e, code){
        var multimap = e.data.scope,
            mapName = multimap.params.mapNameByCode(code, multimap);

        if (!multimap.drillDownPromise || multimap.drillDownPromise.state() !== 'pending') {
          multimap.drillDown(mapName, code);
        }
      });
    }


    return this.maps[name];
  },

  downloadMap: function(code){
    var that = this,
        deferred = jvm.$.Deferred();

    if (!this.mapsLoaded[code]) {
      jvm.$.get(this.params.mapUrlByCode(code, this)).then(function(){
        that.mapsLoaded[code] = true;
        deferred.resolve();
      }, function(){
        deferred.reject();
      });
    } else {
      deferred.resolve();
    }
    return deferred;
  },

  drillDown: function(name, code){
    var currentMap = this.history[this.history.length - 1],
        that = this,
        focusPromise = currentMap.setFocus({region: code, animate: true}),
        downloadPromise = this.downloadMap(code);

    focusPromise.then(function(){
      if (downloadPromise.state() === 'pending') {
        that.spinner.show();
      }
    });
    downloadPromise.always(function(){
      that.spinner.hide();
    });
    this.drillDownPromise = jvm.$.when(downloadPromise, focusPromise);
    this.drillDownPromise.then(function(){
      currentMap.params.container.hide();
      if (!that.maps[name]) {
        that.addMap(name, {map: name, multiMapLevel: currentMap.params.multiMapLevel + 1});
      } else {
        that.maps[name].params.container.show();
      }
      that.history.push( that.maps[name] );
      that.backButton.show();
    });
  },

  goBack: function(){
    var currentMap = this.history.pop(),
        prevMap = this.history[this.history.length - 1],
        that = this;

    currentMap.setFocus({scale: 1, x: 0.5, y: 0.5, animate: true}).then(function(){
      currentMap.params.container.hide();
      prevMap.params.container.show();
      prevMap.updateSize();
      if (that.history.length === 1) {
        that.backButton.hide();
      }
      prevMap.setFocus({scale: 1, x: 0.5, y: 0.5, animate: true});
    });
  }
};

jvm.MultiMap.defaultParams = {
  mapNameByCode: function(code, multiMap){
    return code.toLowerCase()+'_'+multiMap.defaultProjection+'_en';
  },
  mapUrlByCode: function(code, multiMap){
    return 'jquery-jvectormap-data-'+code.toLowerCase()+'-'+multiMap.defaultProjection+'-en.js';
  }
}

jQ183.fn.vectorMap('addMap', 'world_mill_en',{"insets": [{"width": 900, "top": 0, "height": 440.70631074413296, "bbox": [{"y": -12671671.123330014, "x": -20004297.151525836}, {"y": 6930392.02513512, "x": 20026572.39474939}], "left": 0}], "paths": {"BD": {"path": "M651.84,230.21l-0.6,-2.0l-1.36,-1.71l-2.31,-0.11l-0.41,0.48l0.2,0.94l-0.53,0.99l-0.72,-0.36l-0.68,0.35l-1.2,-0.36l-0.37,-2.0l-0.81,-1.86l0.39,-1.46l-0.22,-0.47l-1.14,-0.53l0.29,-0.5l1.48,-0.94l0.03,-0.65l-1.55,-1.22l0.55,-1.14l1.61,0.94l1.04,0.15l0.18,1.54l0.34,0.35l5.64,0.63l-0.84,1.64l-1.22,0.34l-0.77,1.51l0.07,0.47l1.37,1.37l0.67,-0.19l0.42,-1.39l1.21,3.84l-0.03,1.21l-0.33,-0.15l-0.4,0.28Z", "name": "Bangladesh"}, "BE": {"path": "M429.29,144.05l1.91,0.24l2.1,-0.63l2.63,1.99l-0.21,1.66l-0.69,0.4l-0.18,1.2l-1.66,-1.13l-1.39,0.15l-2.73,-2.7l-1.17,-0.18l-0.16,-0.52l1.54,-0.5Z", "name": "Belgium"}, "BF": {"path": "M421.42,247.64l-0.11,0.95l0.34,1.16l1.4,1.71l0.07,1.1l0.32,0.37l2.55,0.51l-0.04,1.28l-0.38,0.53l-1.07,0.21l-0.72,1.18l-0.63,0.21l-3.22,-0.25l-0.94,0.39l-5.4,-0.05l-0.39,0.38l0.16,2.73l-1.23,-0.43l-1.17,0.1l-0.89,0.57l-2.27,-1.72l-0.13,-1.11l0.61,-0.96l0.02,-0.93l1.87,-1.98l0.44,-1.81l0.43,-0.39l1.28,0.26l1.05,-0.52l0.47,-0.73l1.84,-1.09l0.55,-0.83l2.2,-1.0l1.15,-0.3l0.72,0.45l1.13,-0.01Z", "name": "Burkina Faso"}, "BG": {"path": "M491.65,168.18l-0.86,0.88l-0.91,2.17l0.48,1.34l-1.6,-0.24l-2.55,0.95l-0.28,1.51l-1.8,0.22l-2.0,-1.0l-1.92,0.79l-1.42,-0.07l-0.15,-1.63l-1.05,-0.97l0.0,-0.8l1.2,-1.57l0.01,-0.56l-1.14,-1.23l-0.05,-0.94l0.88,0.97l0.88,-0.2l1.91,0.47l3.68,0.16l1.42,-0.81l2.72,-0.66l2.55,1.24Z", "name": "Bulgaria"}, "BA": {"path": "M463.49,163.65l2.1,0.5l1.72,-0.03l1.52,0.68l-0.36,0.78l0.08,0.45l1.04,1.02l-0.25,0.98l-1.81,1.15l-0.38,1.38l-1.67,-0.87l-0.89,-1.2l-2.11,-1.83l-1.63,-2.22l0.23,-0.57l0.48,0.38l0.55,-0.06l0.43,-0.51l0.94,-0.06Z", "name": "Bosnia and Herz."}, "BN": {"path": "M707.48,273.58l0.68,-0.65l1.41,-0.91l-0.15,1.63l-0.81,-0.05l-0.61,0.58l-0.53,-0.6Z", "name": "Brunei"}, "BO": {"path": "M263.83,340.69l-3.09,-0.23l-0.38,0.23l-0.7,1.52l-1.31,-1.53l-3.28,-0.64l-2.37,2.4l-1.31,0.26l-0.88,-3.26l-1.3,-2.86l0.74,-2.37l-0.13,-0.43l-1.2,-1.01l-0.37,-1.89l-1.08,-1.55l1.45,-2.56l-0.96,-2.33l0.47,-1.06l-0.34,-0.73l0.91,-1.32l0.16,-3.84l0.5,-1.18l-1.81,-3.41l2.46,0.07l0.8,-0.85l3.4,-1.91l2.66,-0.35l-0.19,1.38l0.3,1.07l-0.05,1.97l2.72,2.27l2.88,0.49l0.89,0.86l1.79,0.58l0.98,0.7l1.71,0.05l1.17,0.61l0.6,2.7l-0.7,0.54l0.96,2.99l0.37,0.28l4.3,0.1l-0.25,1.2l0.27,1.02l1.43,0.9l0.5,1.35l-0.41,1.86l-0.65,1.08l0.12,1.35l-2.69,-1.65l-2.4,-0.03l-4.36,0.76l-1.49,2.5l-0.11,1.52l-0.75,2.37Z", "name": "Bolivia"}, "JP": {"path": "M781.12,166.87l1.81,0.68l1.62,-0.97l0.39,2.42l-3.35,0.75l-2.23,2.88l-3.63,-1.9l-0.56,0.2l-1.26,3.05l-2.16,0.03l-0.29,-2.51l1.08,-2.03l2.45,-0.16l0.37,-0.33l1.25,-5.94l2.47,2.71l2.03,1.12ZM773.56,187.34l-0.91,2.22l0.37,1.52l-1.14,1.75l-3.02,1.26l-4.58,0.27l-3.34,3.01l-1.25,-0.8l-0.09,-1.9l-0.46,-0.38l-4.35,0.62l-3.0,1.32l-2.85,0.05l-0.37,0.27l0.13,0.44l2.32,1.89l-1.54,4.34l-1.26,0.9l-0.79,-0.7l0.56,-2.27l-0.21,-0.45l-1.47,-0.75l-0.74,-1.4l2.12,-0.84l1.26,-1.7l2.45,-1.42l1.83,-1.91l4.78,-0.81l2.6,0.57l0.44,-0.21l2.39,-4.66l1.29,1.06l0.5,0.01l5.1,-4.02l1.69,-3.73l-0.38,-3.4l0.9,-1.61l2.14,-0.44l1.23,3.72l-0.07,2.18l-2.23,2.84l-0.04,3.16ZM757.78,196.26l0.19,0.56l-1.01,1.21l-1.16,-0.68l-1.28,0.65l-0.69,1.45l-1.02,-0.5l0.01,-0.93l1.14,-1.38l1.57,0.14l0.85,-0.98l1.4,0.46Z", "name": "Japan"}, "BI": {"path": "M495.45,295.49l-1.08,-2.99l1.14,-0.11l0.64,-1.19l0.76,0.09l0.65,1.83l-2.1,2.36Z", "name": "Burundi"}, "BJ": {"path": "M429.57,255.75l-0.05,0.8l0.5,1.34l-0.42,0.86l0.17,0.79l-1.81,2.12l-0.57,1.76l-0.08,5.42l-1.41,0.2l-0.48,-1.36l0.11,-5.71l-0.52,-0.7l-0.2,-1.35l-1.48,-1.48l0.21,-0.9l0.89,-0.43l0.42,-0.92l1.27,-0.36l1.22,-1.34l0.61,-0.0l1.62,1.24Z", "name": "Benin"}, "BT": {"path": "M650.32,213.86l0.84,0.71l-0.12,1.1l-3.76,-0.11l-1.57,0.4l-1.93,-0.87l1.48,-1.96l1.13,-0.57l1.63,0.57l1.33,0.08l0.99,0.65Z", "name": "Bhutan"}, "JM": {"path": "M228.38,239.28l-0.8,0.4l-2.26,-1.06l0.84,-0.23l2.14,0.3l1.17,0.56l-1.08,0.03Z", "name": "Jamaica"}, "BW": {"path": "M483.92,330.07l2.27,4.01l2.83,2.86l0.96,0.31l0.78,2.43l2.13,0.61l1.02,0.76l-3.0,1.64l-2.32,2.02l-1.54,2.69l-1.52,0.45l-0.64,1.94l-1.34,0.52l-1.85,-0.12l-1.21,-0.74l-1.35,-0.3l-1.22,0.62l-0.75,1.37l-2.31,1.9l-1.4,0.21l-0.35,-0.59l0.16,-1.75l-1.48,-2.54l-0.62,-0.43l-0.0,-7.1l2.08,-0.08l0.39,-0.4l0.07,-8.9l5.19,-0.93l0.8,0.89l0.51,0.07l1.5,-0.95l2.21,-0.49Z", "name": "Botswana"}, "BR": {"path": "M259.98,275.05l3.24,0.7l0.65,-0.53l4.55,-1.32l1.08,-1.06l-0.02,-0.63l0.55,-0.05l0.28,0.28l-0.26,0.87l0.22,0.48l0.73,0.32l0.4,0.81l-0.62,0.86l-0.4,2.13l0.82,2.56l1.69,1.43l1.43,0.2l3.17,-1.68l3.18,0.3l0.65,-0.75l-0.27,-0.92l1.9,-0.09l2.39,0.99l1.06,-0.61l0.84,0.78l1.2,-0.18l1.18,-1.06l0.84,-1.94l1.36,-2.11l0.37,-0.05l1.89,5.45l1.33,0.59l0.05,1.28l-1.77,1.94l0.02,0.56l1.02,0.87l4.07,0.36l0.08,2.16l0.66,0.29l1.74,-1.5l6.97,2.32l1.02,1.22l-0.35,1.18l0.49,0.5l2.81,-0.74l4.77,1.3l3.75,-0.08l3.57,2.0l3.29,2.86l1.93,0.72l2.12,0.12l0.71,0.62l1.21,4.51l-0.95,3.98l-4.72,5.06l-1.64,2.92l-1.72,2.05l-0.8,0.3l-0.72,2.03l0.18,4.75l-0.94,5.53l-0.81,1.13l-0.43,3.36l-2.55,3.5l-0.4,2.51l-1.86,1.04l-0.67,1.53l-2.54,0.01l-3.94,1.01l-1.83,1.2l-2.87,0.82l-3.03,2.19l-2.2,2.83l-0.36,2.0l0.4,1.58l-0.44,2.6l-0.51,1.2l-1.77,1.54l-2.75,4.78l-3.83,3.42l-1.24,2.74l-1.18,1.15l-0.36,-0.83l0.95,-1.14l0.01,-0.5l-1.52,-1.97l-4.56,-3.32l-1.03,-0.0l-2.38,-2.02l-0.81,-0.0l5.34,-5.45l3.77,-2.58l0.22,-2.46l-1.35,-1.81l-0.91,0.07l0.58,-2.33l0.01,-1.54l-1.11,-0.83l-1.75,0.3l-0.44,-3.11l-0.52,-0.95l-1.88,-0.88l-1.24,0.47l-2.17,-0.41l0.15,-3.21l-0.62,-1.34l0.66,-0.73l-0.22,-1.34l0.66,-1.13l0.44,-2.04l-0.61,-1.83l-1.4,-0.86l-0.2,-0.75l0.34,-1.39l-0.38,-0.5l-4.52,-0.1l-0.72,-2.22l0.59,-0.42l-0.03,-1.1l-0.5,-0.87l-0.32,-1.7l-1.45,-0.76l-1.63,-0.02l-1.05,-0.72l-1.6,-0.48l-1.13,-0.99l-2.69,-0.4l-2.47,-2.06l0.13,-4.35l-0.45,-0.45l-3.46,0.5l-3.44,1.94l-0.6,0.74l-2.9,-0.17l-1.47,0.42l-0.72,-0.18l0.15,-3.52l-0.63,-0.34l-1.94,1.41l-1.87,-0.06l-0.83,-1.18l-1.37,-0.26l0.21,-1.01l-1.35,-1.49l-0.88,-1.91l0.56,-0.6l-0.0,-0.81l1.29,-0.62l0.22,-0.43l-0.22,-1.19l0.61,-0.91l0.15,-0.99l2.65,-1.58l1.99,-0.47l0.42,-0.36l2.06,0.11l0.42,-0.33l1.19,-8.0l-0.41,-1.56l-1.1,-1.0l0.01,-1.33l1.91,-0.42l0.08,-0.96l-0.33,-0.43l-1.14,-0.2l-0.02,-0.83l4.47,0.05l0.82,-0.67l0.82,1.81l0.8,0.07l1.15,1.1l2.26,-0.05l0.71,-0.83l2.78,-0.96l0.48,-1.13l1.6,-0.64l0.24,-0.47l-0.48,-0.82l-1.83,-0.19l-0.36,-3.22Z", "name": "Brazil"}, "BS": {"path": "M226.4,223.87l-0.48,-1.15l-0.84,-0.75l0.36,-1.11l0.95,1.95l0.01,1.06ZM225.56,216.43l-1.87,0.29l-0.04,-0.22l0.74,-0.14l1.17,0.06Z", "name": "Bahamas"}, "BY": {"path": "M493.84,128.32l0.29,0.7l0.49,0.23l1.19,-0.38l2.09,0.72l0.19,1.26l-0.45,1.24l1.57,2.26l0.89,0.59l0.17,0.81l1.58,0.56l0.4,0.5l-0.53,0.41l-1.87,-0.11l-0.73,0.38l-0.13,0.52l1.04,2.74l-1.91,0.26l-0.89,0.99l-0.11,1.18l-2.73,-0.04l-0.53,-0.62l-0.52,-0.08l-0.75,0.46l-0.91,-0.42l-1.92,-0.07l-2.75,-0.79l-2.6,-0.28l-2.0,0.07l-1.5,0.92l-0.67,0.07l-0.08,-1.22l-0.59,-1.19l1.36,-0.88l0.01,-1.35l-0.7,-1.41l-0.07,-1.0l2.16,-0.02l2.72,-1.3l0.75,-2.04l1.91,-1.04l0.2,-0.41l-0.19,-1.25l3.8,-1.78l2.3,0.77Z", "name": "Belarus"}, "BZ": {"path": "M198.03,244.38l0.1,-4.49l0.69,-0.06l0.74,-1.3l0.34,0.28l-0.4,1.3l0.17,0.58l-0.34,2.25l-1.3,1.42Z", "name": "Belize"}, "RU": {"path": "M491.55,115.25l2.55,-1.85l-0.01,-0.65l-2.2,-1.5l7.32,-6.76l1.03,-2.11l-0.13,-0.49l-3.46,-2.52l0.86,-2.7l-2.11,-2.81l1.56,-3.67l-2.77,-4.52l2.15,-2.99l-0.08,-0.55l-3.65,-2.73l0.3,-2.54l1.81,-0.37l4.26,-1.77l2.42,-1.45l4.06,2.61l6.79,1.04l9.34,4.85l1.78,1.88l0.14,2.46l-2.55,2.02l-3.9,1.06l-11.07,-3.14l-2.06,0.53l-0.13,0.7l3.94,2.94l0.31,5.86l0.26,0.36l5.14,2.24l0.58,-0.29l0.32,-1.94l-1.35,-1.78l1.13,-1.09l6.13,2.42l2.11,-0.98l0.18,-0.56l-1.51,-2.67l5.41,-3.76l2.07,0.22l2.26,1.41l0.57,-0.16l1.46,-2.87l-0.05,-0.44l-1.92,-2.32l1.12,-2.32l-1.32,-2.27l5.87,1.16l1.04,1.75l-2.59,0.43l-0.33,0.4l0.02,2.36l2.46,1.83l3.87,-0.91l0.86,-2.8l13.69,-5.65l0.99,0.11l-1.92,2.06l0.23,0.67l3.11,0.45l2.0,-1.48l4.56,-0.12l3.64,-1.73l2.65,2.44l0.56,-0.01l2.85,-2.88l-0.01,-0.57l-2.35,-2.29l0.9,-1.01l7.14,1.3l3.41,1.36l9.05,4.97l0.51,-0.11l1.67,-2.27l-0.05,-0.53l-2.43,-2.21l-0.06,-0.78l-0.34,-0.36l-2.52,-0.36l0.64,-1.93l-1.32,-3.46l-0.06,-1.21l4.48,-4.06l1.69,-4.29l1.6,-0.81l6.23,1.18l0.44,2.21l-2.29,3.64l0.06,0.5l1.47,1.39l0.76,3.0l-0.56,6.03l2.69,2.82l-0.96,2.57l-4.86,5.95l0.23,0.64l2.86,0.61l0.42,-0.17l0.93,-1.4l2.64,-1.03l0.87,-2.24l2.09,-1.96l0.07,-0.5l-1.36,-2.28l1.09,-2.69l-0.32,-0.55l-2.47,-0.33l-0.5,-2.06l1.94,-4.38l-0.06,-0.42l-2.96,-3.4l4.12,-2.88l0.16,-0.4l-0.51,-2.93l0.54,-0.05l1.13,2.25l-0.96,4.35l0.27,0.47l2.68,0.84l0.5,-0.51l-1.02,-2.99l3.79,-1.66l5.01,-0.24l4.53,2.61l0.48,-0.06l0.07,-0.48l-2.18,-3.82l-0.23,-4.67l3.98,-0.9l5.97,0.21l5.49,-0.64l0.27,-0.65l-1.83,-2.31l2.56,-2.9l2.87,-0.17l4.8,-2.47l6.54,-0.67l1.03,-1.42l6.25,-0.45l2.32,1.11l5.53,-2.7l4.5,0.08l0.39,-0.28l0.66,-2.15l2.26,-2.12l5.69,-2.11l3.21,1.29l-2.46,0.94l-0.25,0.42l0.34,0.35l5.41,0.77l0.61,2.33l0.58,0.25l2.2,-1.22l7.13,0.07l5.51,2.47l1.79,1.72l-0.53,2.24l-9.16,4.15l-1.97,1.52l0.16,0.71l6.77,1.91l2.16,-0.78l1.13,2.74l0.67,0.11l1.01,-1.15l3.81,-0.73l7.7,0.77l0.54,1.99l0.36,0.29l10.47,0.71l0.43,-0.38l0.13,-3.23l4.87,0.78l3.95,-0.02l3.83,2.4l1.03,2.71l-1.35,1.79l0.02,0.5l3.15,3.64l4.07,1.96l0.53,-0.18l2.23,-4.47l3.95,1.93l4.16,-1.21l4.73,1.39l2.05,-1.26l3.94,0.62l0.43,-0.55l-1.68,-4.02l2.89,-1.8l22.31,3.03l2.16,2.75l6.55,3.51l10.29,-0.81l4.82,0.73l1.85,1.66l-0.29,3.08l0.25,0.41l3.08,1.26l3.56,-0.88l4.35,-0.11l4.8,0.87l4.57,-0.47l4.23,3.79l0.43,0.07l3.1,-1.4l0.16,-0.6l-1.88,-2.62l0.85,-1.52l7.71,1.21l5.22,-0.26l7.09,2.09l9.59,5.22l6.35,4.11l-0.2,2.38l1.88,1.41l0.6,-0.42l-0.48,-2.53l6.15,0.57l4.4,3.51l-1.97,1.43l-4.0,0.41l-0.36,0.39l-0.06,3.79l-0.74,0.62l-2.07,-0.11l-1.91,-1.39l-3.14,-1.11l-0.78,-1.85l-2.72,-0.68l-2.63,0.49l-1.04,-1.1l0.46,-1.31l-0.5,-0.51l-3.0,0.98l-0.22,0.58l0.99,1.7l-1.21,1.48l-3.04,1.68l-3.12,-0.28l-0.4,0.23l0.09,0.46l2.2,2.09l1.46,3.2l1.15,1.1l0.24,1.33l-0.42,0.67l-4.63,-0.77l-6.96,2.9l-2.19,0.44l-7.6,5.06l-0.84,1.45l-3.61,-2.37l-6.24,2.82l-0.94,-1.15l-0.53,-0.08l-2.28,1.52l-3.2,-0.49l-0.44,0.27l-0.78,2.37l-3.05,3.78l0.09,1.47l0.29,0.36l2.54,0.72l-0.29,4.53l-1.97,0.11l-0.35,0.26l-1.07,2.94l0.8,1.45l-3.91,1.58l-1.05,3.95l-3.48,0.77l-0.3,0.3l-0.72,3.29l-3.09,2.65l-0.7,-1.74l-2.44,-12.44l1.16,-4.71l2.04,-2.06l0.22,-1.64l3.8,-0.86l4.46,-4.61l4.28,-3.81l4.48,-3.01l2.17,-5.63l-0.42,-0.54l-3.04,0.33l-1.77,3.31l-5.86,3.86l-1.86,-4.25l-0.45,-0.23l-6.46,1.3l-6.47,6.44l-0.01,0.55l1.58,1.74l-8.24,1.17l0.15,-2.2l-0.34,-0.42l-3.89,-0.56l-3.25,1.81l-7.62,-0.62l-8.45,1.19l-17.71,15.41l0.22,0.7l3.74,0.41l1.36,2.17l2.43,0.76l1.88,-1.68l2.4,0.2l3.4,3.54l0.08,2.6l-1.95,3.42l-0.21,3.9l-1.1,5.06l-3.71,4.54l-0.87,2.21l-8.29,8.89l-3.19,1.7l-1.32,0.03l-1.45,-1.36l-0.49,-0.04l-2.27,1.5l0.41,-3.65l-0.59,-2.47l1.75,-0.89l2.91,0.53l0.42,-0.2l1.68,-3.03l0.87,-3.46l0.97,-1.18l1.32,-2.88l-0.45,-0.56l-4.14,0.95l-2.19,1.25l-3.41,-0.0l-1.06,-2.93l-2.97,-2.3l-4.28,-1.06l-1.75,-5.07l-2.66,-5.01l-2.29,-1.29l-3.75,-1.01l-3.44,0.08l-3.18,0.62l-2.24,1.77l0.05,0.66l1.18,0.69l0.02,1.43l-1.33,1.05l-2.26,3.51l-0.04,1.43l-3.16,1.84l-2.82,-1.16l-3.01,0.23l-1.35,-1.07l-1.5,-0.35l-3.9,2.31l-3.22,0.52l-2.27,0.79l-3.05,-0.51l-2.21,0.03l-1.48,-1.6l-2.6,-1.63l-2.63,-0.43l-5.46,1.01l-3.23,-1.25l-0.72,-2.57l-5.2,-1.24l-2.75,-1.36l-0.5,0.12l-2.59,3.45l0.84,2.1l-2.06,1.93l-3.41,-0.77l-2.42,-0.12l-1.83,-1.54l-2.53,-0.05l-2.42,-0.98l-3.86,1.57l-4.72,2.78l-3.3,0.75l-1.55,-1.92l-3.0,0.41l-1.11,-1.33l-1.62,-0.59l-1.31,-1.94l-1.38,-0.6l-3.7,0.79l-3.31,-1.83l-0.51,0.11l-0.99,1.29l-5.29,-8.05l-2.96,-2.48l0.65,-0.77l0.01,-0.51l-0.5,-0.11l-6.2,3.21l-1.84,0.15l0.15,-1.39l-0.26,-0.42l-3.22,-1.17l-2.46,0.7l-0.69,-3.16l-0.32,-0.31l-4.5,-0.75l-2.47,1.47l-6.19,1.27l-1.29,0.86l-9.51,1.3l-1.15,1.17l-0.03,0.53l1.47,1.9l-1.89,0.69l-0.22,0.56l0.31,0.6l-2.11,1.44l0.03,0.68l3.75,2.12l-0.39,0.98l-3.23,-0.13l-0.86,0.86l-3.09,-1.59l-3.97,0.07l-2.66,1.35l-8.32,-3.56l-4.07,0.06l-5.39,3.68l-0.39,2.0l-2.03,-1.5l-0.59,0.13l-2.0,3.59l0.57,0.93l-1.28,2.16l0.06,0.48l2.13,2.17l1.95,0.04l1.37,1.82l-0.23,1.46l0.25,0.43l0.83,0.33l-0.8,1.31l-2.49,0.62l-2.49,3.2l0.0,0.49l2.17,2.78l-0.15,2.18l2.5,3.24l-1.58,1.59l-0.7,-0.13l-1.63,-1.72l-2.29,-0.84l-0.94,-1.31l-2.34,-0.63l-1.48,0.4l-0.43,-0.47l-3.51,-1.48l-5.76,-1.01l-0.45,0.19l-2.89,-2.34l-2.9,-1.2l-1.53,-1.29l1.29,-0.43l2.08,-2.61l-0.05,-0.55l-0.89,-0.79l3.05,-1.06l0.27,-0.42l-0.07,-0.69l-0.49,-0.35l-1.73,0.39l0.04,-0.68l1.04,-0.72l2.66,-0.48l0.4,-1.32l-0.5,-1.6l0.92,-1.54l0.03,-1.17l-0.29,-0.37l-3.69,-1.06l-1.41,0.02l-1.42,-1.41l-2.19,0.38l-2.77,-1.01l-0.03,-0.59l-0.89,-1.43l-2.0,-0.32l-0.11,-0.54l0.49,-0.53l0.01,-0.53l-1.6,-1.9l-3.58,0.02l-0.88,0.73l-0.46,-0.07l-1.0,-2.79l2.22,-0.02l0.97,-0.74l0.07,-0.57l-0.9,-1.04l-1.35,-0.48l-0.11,-0.7l-0.95,-0.58l-1.38,-1.99l0.46,-0.98l-0.51,-1.96l-2.45,-0.84l-1.21,0.3l-0.46,-0.76l-2.46,-0.83l-0.72,-1.87l-0.21,-1.69l-0.99,-0.85l0.85,-1.17l-0.7,-3.21l1.66,-1.97l-0.16,-0.79ZM749.2,170.72l-0.6,0.4l-0.13,0.16l-0.01,-0.51l0.74,-0.05ZM874.85,67.94l-5.63,0.48l-0.26,-0.84l3.15,-1.89l1.94,0.01l3.19,1.16l-2.39,1.09ZM797.39,48.49l-2.0,1.36l-3.8,-0.42l-4.25,-1.8l0.35,-0.97l9.69,1.83ZM783.67,46.12l-1.63,3.09l-8.98,-0.13l-4.09,1.14l-4.54,-2.97l1.16,-3.01l3.05,-0.89l6.5,0.22l8.54,2.56ZM778.2,134.98l-0.56,-0.9l0.27,-0.12l0.29,1.01ZM778.34,135.48l0.94,3.53l-0.05,3.38l1.05,3.39l2.18,5.0l-2.89,-0.83l-0.49,0.26l-1.54,4.65l2.42,3.5l-0.04,1.13l-1.24,-1.24l-0.61,0.06l-1.09,1.61l-0.28,-1.61l0.27,-3.1l-0.28,-3.4l0.58,-2.47l0.11,-4.39l-1.46,-3.36l0.21,-4.32l2.15,-1.46l0.07,-0.34ZM771.95,56.61l1.76,-1.42l2.89,-0.42l3.28,1.71l0.14,0.6l-3.27,0.03l-4.81,-0.5ZM683.76,31.09l-13.01,1.93l4.03,-6.35l1.82,-0.56l1.73,0.34l5.99,2.98l-0.56,1.66ZM670.85,27.93l-5.08,0.64l-6.86,-1.57l-3.99,-2.05l-2.1,-4.16l-2.6,-0.87l5.72,-3.5l5.2,-1.28l4.69,2.85l5.59,5.4l-0.56,4.53ZM564.15,68.94l-0.64,0.17l-7.85,-0.57l-0.86,-2.04l-4.28,-1.17l-0.28,-1.94l2.27,-0.89l0.25,-0.39l-0.08,-2.38l4.81,-3.97l-0.15,-0.7l-1.47,-0.38l5.3,-3.81l0.15,-0.44l-0.58,-1.94l5.28,-2.51l8.21,-3.27l8.28,-0.96l4.35,-1.94l4.6,-0.64l1.36,1.61l-1.34,1.28l-16.43,4.94l-7.97,4.88l-7.74,9.63l0.66,4.14l4.16,3.27ZM548.81,18.48l-5.5,1.18l-0.58,1.02l-2.59,0.84l-2.13,-1.07l1.12,-1.42l-0.3,-0.65l-2.33,-0.07l1.68,-0.36l3.47,-0.06l0.42,1.29l0.66,0.16l1.38,-1.34l2.15,-0.88l2.94,1.01l-0.39,0.36ZM477.37,133.15l-4.08,0.05l-2.56,-0.32l0.33,-0.87l3.17,-1.03l3.24,0.96l-0.09,1.23Z", "name": "Russia"}, "RW": {"path": "M497.0,288.25l0.71,1.01l-0.11,1.09l-1.63,0.03l-1.04,1.39l-0.83,-0.11l0.51,-1.2l0.08,-1.34l0.42,-0.41l0.7,0.14l1.19,-0.61Z", "name": "Rwanda"}, "RS": {"path": "M469.4,163.99l0.42,-0.5l-0.01,-0.52l-1.15,-1.63l1.43,-0.62l1.33,0.12l1.17,1.06l0.46,1.13l1.34,0.64l0.35,1.35l1.46,0.9l0.76,-0.29l0.2,0.69l-0.48,0.78l0.22,1.12l1.05,1.22l-0.77,0.8l-0.37,1.52l-1.21,0.08l0.24,-0.64l-0.39,-0.54l-2.08,-1.64l-0.9,0.05l-0.48,0.94l-2.12,-1.37l0.53,-1.6l-1.11,-1.37l0.51,-1.1l-0.41,-0.57Z", "name": "Serbia"}, "LT": {"path": "M486.93,129.3l0.17,1.12l-1.81,0.98l-0.72,2.02l-2.47,1.18l-2.1,-0.02l-0.73,-1.05l-1.06,-0.3l-0.09,-1.87l-3.56,-1.13l-0.43,-2.36l2.48,-0.94l4.12,0.22l2.25,-0.31l0.52,0.69l1.24,0.21l2.19,1.56Z", "name": "Lithuania"}, "LU": {"path": "M436.08,149.45l-0.48,-0.07l0.3,-1.28l0.27,0.4l-0.09,0.96Z", "name": "Luxembourg"}, "LR": {"path": "M399.36,265.97l0.18,1.54l-0.48,0.99l0.08,0.47l2.47,1.8l-0.33,2.8l-2.65,-1.13l-5.78,-4.61l0.58,-1.32l2.1,-2.33l0.86,-0.22l0.77,1.14l-0.14,0.85l0.59,0.87l1.0,0.14l0.76,-0.99Z", "name": "Liberia"}, "RO": {"path": "M487.53,154.23l0.6,0.24l2.87,3.98l-0.17,2.69l0.45,1.42l1.32,0.81l1.35,-0.42l0.76,0.36l0.02,0.31l-0.83,0.45l-0.59,-0.22l-0.54,0.3l-0.62,3.3l-1.0,-0.22l-2.07,-1.13l-2.95,0.71l-1.25,0.76l-3.51,-0.15l-1.89,-0.47l-0.87,0.16l-0.82,-1.3l0.29,-0.26l-0.06,-0.64l-1.09,-0.34l-0.56,0.5l-1.05,-0.64l-0.39,-1.39l-1.36,-0.65l-0.35,-1.0l-0.83,-0.75l1.54,-0.54l2.66,-4.21l2.4,-1.24l2.96,0.34l1.48,0.73l0.79,-0.45l1.78,-0.3l0.75,-0.74l0.79,0.0Z", "name": "Romania"}, "GW": {"path": "M386.23,253.6l-0.29,0.84l0.15,0.6l-2.21,0.59l-0.86,0.96l-1.04,-0.83l-1.09,-0.23l-0.54,-1.06l-0.66,-0.49l2.41,-0.48l4.13,0.1Z", "name": "Guinea-Bissau"}, "GT": {"path": "M195.08,249.77l-2.48,-0.37l-1.03,-0.45l-1.14,-0.89l0.3,-0.99l-0.24,-0.68l0.96,-1.66l2.98,-0.01l0.4,-0.37l-0.19,-1.28l-1.67,-1.4l0.51,-0.4l0.0,-1.05l3.85,0.02l-0.21,4.53l0.4,0.43l1.46,0.38l-1.48,0.98l-0.35,0.7l0.12,0.57l-2.2,1.96Z", "name": "Guatemala"}, "GR": {"path": "M487.07,174.59l-0.59,1.43l-0.37,0.21l-2.84,-0.35l-3.03,0.77l-0.18,0.68l1.28,1.23l-0.61,0.23l-1.14,0.0l-1.2,-1.39l-0.63,0.03l-0.53,1.01l0.56,1.76l1.03,1.19l-0.56,0.38l-0.05,0.62l2.52,2.12l0.02,0.87l-1.78,-0.59l-0.48,0.56l0.5,1.0l-1.07,0.2l-0.3,0.53l0.75,2.01l-0.98,0.02l-1.84,-1.12l-1.37,-4.2l-2.21,-2.95l-0.11,-0.56l1.04,-1.28l0.2,-0.95l0.85,-0.66l0.03,-0.46l1.32,-0.21l1.01,-0.64l1.22,0.05l0.65,-0.56l2.26,-0.0l1.82,-0.75l1.85,1.0l2.28,-0.28l0.35,-0.39l0.01,-0.77l0.34,0.22ZM480.49,192.16l0.58,0.4l-0.68,-0.12l0.11,-0.28ZM482.52,192.82l2.51,0.06l0.24,0.32l-1.99,0.13l-0.77,-0.51Z", "name": "Greece"}, "GQ": {"path": "M448.79,279.62l0.02,2.22l-4.09,0.0l0.69,-2.27l3.38,0.05Z", "name": "Eq. Guinea"}, "GY": {"path": "M277.42,270.07l-0.32,1.83l-1.32,0.57l-0.23,0.46l-0.28,2.0l1.11,1.82l0.83,0.19l0.32,1.25l1.13,1.62l-1.21,-0.19l-1.08,0.71l-1.77,0.5l-0.44,0.46l-0.86,-0.09l-1.32,-1.01l-0.77,-2.27l0.36,-1.9l0.68,-1.23l-0.57,-1.17l-0.74,-0.43l0.12,-1.16l-0.9,-0.69l-1.1,0.09l-1.31,-1.48l0.53,-0.72l-0.04,-0.84l1.99,-0.86l0.05,-0.59l-0.71,-0.78l0.14,-0.57l1.66,-1.24l1.36,0.77l1.41,1.49l0.06,1.15l0.37,0.38l0.8,0.05l2.06,1.86Z", "name": "Guyana"}, "GE": {"path": "M521.71,168.93l5.29,0.89l4.07,2.01l1.41,-0.44l2.07,0.56l0.68,1.1l1.07,0.55l-0.12,0.59l0.98,1.29l-1.01,-0.13l-1.81,-0.83l-0.94,0.47l-3.23,0.43l-2.29,-1.39l-2.33,0.05l0.21,-0.97l-0.76,-2.26l-1.45,-1.12l-1.43,-0.39l-0.41,-0.42Z", "name": "Georgia"}, "GB": {"path": "M412.61,118.72l-2.19,3.22l-0.0,0.45l5.13,-0.3l-0.53,2.37l-2.2,3.12l0.29,0.63l2.37,0.21l2.33,4.3l1.76,0.69l2.2,5.12l2.94,0.77l-0.23,1.62l-1.15,0.88l-0.1,0.52l0.82,1.42l-1.86,1.43l-3.3,-0.02l-4.12,0.87l-1.04,-0.58l-0.47,0.06l-1.51,1.41l-2.12,-0.34l-1.86,1.18l-0.6,-0.29l3.19,-3.0l2.16,-0.69l0.28,-0.41l-0.34,-0.36l-3.73,-0.53l-0.4,-0.76l2.2,-0.87l0.17,-0.61l-1.26,-1.67l0.36,-1.7l3.38,0.28l0.43,-0.33l0.37,-1.99l-1.79,-2.49l-3.11,-0.72l-0.38,-0.59l0.79,-1.35l-0.04,-0.46l-0.82,-0.97l-0.61,0.01l-0.68,0.84l-0.1,-2.34l-1.23,-1.88l0.85,-3.47l1.77,-2.68l1.85,0.26l2.17,-0.22ZM406.26,132.86l-1.01,1.77l-1.57,-0.59l-1.16,0.01l0.37,-1.54l-0.39,-1.39l1.45,-0.1l2.3,1.84Z", "name": "United Kingdom"}, "GA": {"path": "M453.24,279.52l-0.08,0.98l0.7,1.29l2.36,0.24l-0.98,2.63l1.18,1.79l0.25,1.78l-0.29,1.52l-0.6,0.93l-1.84,-0.09l-1.23,-1.11l-0.66,0.23l-0.15,0.84l-1.42,0.26l-1.02,0.7l-0.11,0.52l0.77,1.35l-1.34,0.97l-3.94,-4.3l-1.44,-2.45l0.06,-0.6l0.54,-0.81l1.05,-3.46l4.17,-0.07l0.4,-0.4l-0.02,-2.66l2.39,0.21l1.25,-0.27Z", "name": "Gabon"}, "GN": {"path": "M391.8,254.11l0.47,0.8l1.11,-0.32l0.98,0.7l1.07,0.2l2.26,-1.22l0.64,0.44l1.13,1.56l-0.48,1.4l0.8,0.3l-0.08,0.48l0.46,0.68l-0.35,1.36l1.05,2.61l-1.0,0.69l0.03,1.41l-0.72,-0.06l-1.08,1.0l-0.24,-0.27l0.07,-1.11l-1.05,-1.54l-1.79,0.21l-0.35,-2.01l-1.6,-2.18l-2.0,-0.0l-1.31,0.54l-1.95,2.18l-1.86,-2.19l-1.2,-0.78l-0.3,-1.11l-0.8,-0.85l0.65,-0.72l0.81,-0.03l1.64,-0.8l0.23,-1.87l2.67,0.64l0.89,-0.3l1.21,0.15Z", "name": "Guinea"}, "GM": {"path": "M379.31,251.39l0.1,-0.35l2.43,-0.07l0.74,-0.61l0.51,-0.03l0.77,0.49l-1.03,-0.3l-1.87,0.9l-1.65,-0.04ZM384.03,250.91l0.91,0.05l0.75,-0.24l-0.59,0.31l-1.08,-0.13Z", "name": "Gambia"}, "GL": {"path": "M353.02,1.2l14.69,4.67l-3.68,1.89l-22.97,0.86l-0.36,0.27l0.12,0.43l1.55,1.18l8.79,-0.66l7.48,2.07l4.86,-1.77l1.66,1.73l-2.53,3.19l-0.01,0.48l0.46,0.15l6.35,-2.2l12.06,-2.31l7.24,1.13l1.09,1.99l-9.79,4.01l-1.44,1.32l-7.87,0.98l-0.35,0.41l0.38,0.38l5.07,0.24l-2.53,3.58l-2.07,3.81l0.08,6.05l2.57,3.11l-3.22,0.2l-4.12,1.66l-0.05,0.72l4.45,2.65l0.51,3.75l-2.3,0.4l-0.25,0.64l2.79,3.69l-4.82,0.31l-0.36,0.29l0.16,0.44l2.62,1.8l-0.59,1.22l-3.3,0.7l-3.45,0.01l-0.29,0.68l3.03,3.12l0.02,1.34l-4.4,-1.73l-1.72,1.35l0.15,0.66l3.31,1.15l3.13,2.71l0.81,3.16l-3.85,0.75l-4.89,-4.26l-0.47,-0.03l-0.17,0.44l0.79,2.86l-2.71,2.21l-0.13,0.44l0.37,0.27l8.73,0.34l-12.32,6.64l-7.24,1.48l-2.94,0.08l-2.69,1.75l-3.43,4.41l-5.24,2.84l-1.73,0.18l-7.12,2.1l-2.15,2.52l-0.13,2.99l-1.19,2.45l-4.01,3.09l-0.14,0.44l0.97,2.9l-2.28,6.48l-3.1,0.2l-3.83,-3.07l-4.86,-0.02l-2.25,-1.93l-1.7,-3.79l-4.3,-4.84l-1.21,-2.49l-0.44,-3.8l-3.32,-3.63l0.84,-2.86l-1.56,-1.7l2.28,-4.6l3.83,-1.74l1.03,-1.96l0.52,-3.47l-0.59,-0.41l-4.17,2.21l-2.07,0.58l-2.72,-1.28l-0.15,-2.71l0.85,-2.09l2.01,-0.06l5.06,1.2l0.46,-0.23l-0.14,-0.49l-6.54,-4.47l-2.67,0.55l-1.58,-0.86l2.56,-4.01l-0.03,-0.48l-1.5,-1.74l-4.98,-8.5l-3.13,-1.96l0.03,-1.88l-0.24,-0.37l-6.85,-3.02l-5.36,-0.38l-12.7,0.58l-2.78,-1.57l-3.66,-2.77l5.73,-1.45l5.0,-0.28l0.38,-0.38l-0.35,-0.41l-10.67,-1.38l-5.3,-2.06l0.25,-1.54l18.41,-5.26l1.22,-2.27l-0.25,-0.55l-6.14,-1.86l1.68,-1.77l8.55,-4.03l3.59,-0.63l0.3,-0.54l-0.88,-2.27l5.47,-1.47l7.65,-0.95l7.55,-0.05l3.04,1.85l6.48,-3.27l5.81,2.22l3.56,0.5l5.16,1.94l0.5,-0.21l-0.17,-0.52l-5.71,-3.13l0.28,-2.13l8.12,-3.6l8.7,0.28l3.35,-2.34l8.71,-0.6l19.93,0.8Z", "name": "Greenland"}, "KW": {"path": "M540.81,207.91l0.37,0.86l-0.17,0.76l0.6,1.53l-0.95,0.04l-0.82,-1.28l-1.57,-0.18l1.31,-1.88l1.22,0.17Z", "name": "Kuwait"}, "GH": {"path": "M420.53,257.51l-0.01,0.72l0.96,1.2l0.24,3.73l0.59,0.95l-0.51,2.1l0.19,1.41l1.02,2.21l-6.97,2.84l-1.8,-0.57l0.04,-0.89l-1.02,-2.04l0.61,-2.65l1.07,-2.32l-0.96,-6.47l5.01,0.07l0.94,-0.39l0.61,0.11Z", "name": "Ghana"}, "OM": {"path": "M568.09,230.93l-0.91,1.67l-1.22,0.04l-0.6,0.76l-0.41,1.51l0.27,1.58l-1.16,0.05l-1.56,0.97l-0.76,1.74l-1.62,0.05l-0.98,0.65l-0.17,1.15l-0.89,0.52l-1.49,-0.18l-2.4,0.94l-2.47,-5.4l7.35,-2.71l1.67,-5.23l-1.12,-2.09l0.05,-0.83l0.67,-1.0l0.07,-1.05l0.9,-0.42l-0.05,-2.07l0.7,-0.01l1.0,1.62l1.51,1.08l3.3,0.84l1.73,2.29l0.81,0.37l-1.23,2.35l-0.99,0.79Z", "name": "Oman"}, "_1": {"path": "M531.15,258.94l1.51,0.12l5.13,-0.95l5.3,-1.48l-0.01,4.4l-2.67,3.39l-1.85,0.01l-8.04,-2.94l-2.55,-3.17l1.12,-1.71l2.04,2.34Z", "name": "Somaliland"}, "_0": {"path": "M472.77,172.64l-1.08,-1.29l0.96,-0.77l0.29,-0.83l1.98,1.64l-0.36,0.67l-1.79,0.58Z", "name": "Kosovo"}, "JO": {"path": "M518.64,201.38l-5.14,1.56l-0.19,0.65l2.16,2.39l-0.89,1.14l-1.71,0.34l-1.71,1.8l-2.34,-0.37l1.21,-4.32l0.56,-4.07l2.8,0.94l4.46,-2.71l0.79,2.66Z", "name": "Jordan"}, "HR": {"path": "M455.59,162.84l1.09,0.07l-0.82,0.94l-0.27,-1.01ZM456.96,162.92l0.62,-0.41l1.73,0.45l0.42,-0.4l-0.01,-0.59l0.86,-0.52l0.2,-1.05l1.63,-0.68l2.57,1.68l2.07,0.6l0.87,-0.31l1.05,1.57l-0.52,0.63l-1.05,-0.56l-1.68,0.04l-2.1,-0.5l-1.29,0.06l-0.57,0.49l-0.59,-0.47l-0.62,0.16l-0.46,1.7l1.79,2.42l2.79,2.75l-1.18,-0.87l-2.21,-0.87l-1.67,-1.78l0.13,-0.63l-1.05,-1.19l-0.32,-1.27l-1.42,-0.43Z", "name": "Croatia"}, "HT": {"path": "M237.05,238.38l-1.16,0.43l-0.91,-0.55l0.05,-0.2l2.02,0.31ZM237.53,238.43l1.06,0.12l-0.05,0.01l-1.01,-0.12ZM239.25,238.45l0.79,-0.51l0.06,-0.62l-1.02,-1.0l0.02,-0.82l-0.3,-0.4l-0.93,-0.32l3.16,0.45l0.02,1.84l-0.48,0.34l-0.08,0.58l0.54,0.72l-1.78,-0.26Z", "name": "Haiti"}, "HU": {"path": "M462.08,157.89l0.65,-1.59l-0.09,-0.44l0.64,-0.0l0.39,-0.34l0.1,-0.69l1.75,0.87l2.32,-0.37l0.43,-0.66l3.49,-0.78l0.69,-0.78l0.57,-0.14l2.57,0.93l0.67,-0.23l1.03,0.65l0.08,0.37l-1.42,0.71l-2.59,4.14l-1.8,0.53l-1.68,-0.1l-2.74,1.23l-1.85,-0.54l-2.54,-1.66l-0.66,-1.1Z", "name": "Hungary"}, "HN": {"path": "M199.6,249.52l-1.7,-1.21l0.06,-0.94l3.04,-2.14l2.37,0.28l1.27,-0.09l1.1,-0.52l1.3,0.28l1.14,-0.25l1.38,0.37l2.23,1.37l-2.36,0.93l-1.23,-0.39l-0.88,1.3l-1.28,0.99l-0.98,-0.22l-0.42,0.52l-0.96,0.05l-0.36,0.41l0.04,0.88l-0.52,0.6l-0.3,0.04l-0.3,-0.55l-0.66,-0.31l0.11,-0.67l-0.48,-0.65l-0.87,-0.26l-0.73,0.2Z", "name": "Honduras"}, "PR": {"path": "M256.17,238.73l-0.26,0.27l-2.83,0.05l-0.07,-0.55l1.95,-0.1l1.22,0.33Z", "name": "Puerto Rico"}, "PS": {"path": "M509.21,203.07l0.1,-0.06l-0.02,0.03l-0.09,0.03ZM509.36,202.91l-0.02,-0.63l-0.33,-0.16l0.31,-1.09l0.24,0.1l-0.2,1.78Z", "name": "Palestine"}, "PT": {"path": "M401.84,187.38l-0.64,0.47l-1.13,-0.35l-0.91,0.17l0.28,-1.78l-0.24,-1.78l-1.25,-0.56l-0.45,-0.84l0.17,-1.66l1.01,-1.18l0.69,-2.92l-0.04,-1.39l-0.59,-1.9l1.3,-0.85l0.84,1.35l3.1,-0.3l0.46,0.99l-1.05,0.94l-0.03,2.16l-0.41,0.57l-0.08,1.1l-0.79,0.18l-0.26,0.59l0.91,1.6l-0.63,1.75l0.76,1.09l-1.1,1.52l0.07,1.05Z", "name": "Portugal"}, "PY": {"path": "M274.9,336.12l0.74,1.52l-0.16,3.45l0.32,0.41l2.64,0.5l1.11,-0.47l1.4,0.59l0.36,0.6l0.53,3.42l1.27,0.4l0.98,-0.38l0.51,0.27l-0.0,1.18l-1.21,5.32l-2.09,1.9l-1.8,0.4l-4.71,-0.98l2.2,-3.63l-0.32,-1.5l-2.78,-1.28l-3.03,-1.94l-2.07,-0.44l-4.34,-4.06l0.91,-2.9l0.08,-1.42l1.07,-2.04l4.13,-0.72l2.18,0.03l2.05,1.17l0.03,0.59Z", "name": "Paraguay"}, "PA": {"path": "M213.8,263.68l0.26,-1.52l-0.36,-0.26l-0.01,-0.49l0.44,-0.1l0.93,1.4l1.26,0.03l0.77,0.49l1.38,-0.23l2.51,-1.11l0.86,-0.72l3.45,0.85l1.4,1.18l0.41,1.74l-0.21,0.34l-0.53,-0.12l-0.47,0.29l-0.16,0.6l-0.68,-1.28l0.45,-0.49l-0.19,-0.66l-0.47,-0.13l-0.54,-0.84l-1.5,-0.75l-1.1,0.16l-0.75,0.99l-1.62,0.84l-0.18,0.96l0.85,0.97l-0.58,0.45l-0.69,0.08l-0.34,-1.18l-1.27,0.03l-0.71,-1.05l-2.59,-0.46Z", "name": "Panama"}, "PG": {"path": "M808.58,298.86l2.54,2.56l-0.13,0.26l-0.33,0.12l-0.87,-0.78l-1.22,-2.16ZM801.41,293.04l0.5,0.29l0.26,0.27l-0.49,-0.35l-0.27,-0.21ZM803.17,294.58l0.59,0.5l0.08,1.06l-0.29,-0.91l-0.38,-0.65ZM796.68,298.41l0.52,0.75l1.43,-0.19l2.27,-1.81l-0.01,-1.43l1.12,0.16l-0.04,1.1l-0.7,1.28l-1.12,0.18l-0.62,0.79l-2.46,1.11l-1.17,-0.0l-3.08,-1.25l3.41,0.0l0.45,-0.68ZM789.15,303.55l2.31,1.8l1.59,2.61l1.34,0.13l-0.06,0.66l0.31,0.43l1.06,0.24l0.06,0.65l2.25,1.05l-1.22,0.13l-0.72,-0.63l-4.56,-0.65l-3.22,-2.87l-1.49,-2.34l-3.27,-1.1l-2.38,0.72l-1.59,0.86l-0.2,0.42l0.27,1.55l-1.55,0.68l-1.36,-0.4l-2.21,-0.09l-0.08,-15.41l8.39,2.93l2.95,2.4l0.6,1.64l4.02,1.49l0.31,0.68l-1.76,0.21l-0.33,0.52l0.55,1.68Z", "name": "Papua New Guinea"}, "PE": {"path": "M244.96,295.21l-1.26,-0.07l-0.57,0.42l-1.93,0.45l-2.98,1.75l-0.36,1.36l-0.58,0.8l0.12,1.37l-1.24,0.59l-0.22,1.22l-0.62,0.84l1.04,2.27l1.28,1.44l-0.41,0.84l0.32,0.57l1.48,0.13l1.16,1.37l2.21,0.07l1.63,-1.08l-0.13,3.02l0.3,0.4l1.14,0.29l1.31,-0.34l1.9,3.59l-0.48,0.85l-0.17,3.85l-0.94,1.59l0.35,0.75l-0.47,1.07l0.98,1.97l-2.1,3.82l-0.98,0.5l-2.17,-1.28l-0.39,-1.16l-4.95,-2.58l-4.46,-2.79l-1.84,-1.51l-0.91,-1.84l0.3,-0.96l-2.11,-3.33l-4.82,-9.68l-1.04,-1.2l-0.87,-1.94l-3.4,-2.48l0.58,-1.18l-1.13,-2.23l0.66,-1.49l1.45,-1.15l-0.6,0.98l0.07,0.92l0.47,0.36l1.74,0.03l0.97,1.17l0.54,0.07l1.42,-1.03l0.6,-1.84l1.42,-2.02l3.04,-1.04l2.73,-2.62l0.86,-1.74l-0.1,-1.87l1.44,1.02l0.9,1.25l1.06,0.59l1.7,2.73l1.86,0.31l1.45,-0.61l0.96,0.39l1.36,-0.19l1.45,0.89l-1.4,2.21l0.31,0.61l0.59,0.05l0.47,0.5Z", "name": "Peru"}, "PK": {"path": "M615.09,192.34l-1.83,1.81l-2.6,0.39l-3.73,-0.68l-1.58,1.33l-0.09,0.42l1.77,4.39l1.7,1.23l-1.69,1.27l-0.12,2.14l-2.33,2.64l-1.6,2.8l-2.46,2.67l-3.03,-0.07l-2.76,2.83l0.05,0.6l1.5,1.11l0.26,1.9l1.44,1.5l0.37,1.68l-5.01,-0.01l-1.78,1.7l-1.42,-0.52l-0.76,-1.87l-2.27,-2.15l-11.61,0.86l0.71,-2.34l3.43,-1.32l0.25,-0.44l-0.21,-1.24l-1.2,-0.65l-0.28,-2.46l-2.29,-1.14l-1.28,-1.94l2.82,0.94l2.62,-0.38l1.42,0.33l0.76,-0.56l1.71,0.19l3.25,-1.14l0.27,-0.36l0.08,-2.19l1.18,-1.32l1.68,0.0l0.58,-0.82l1.6,-0.3l1.19,0.16l0.98,-0.78l0.02,-1.88l0.93,-1.47l1.48,-0.66l0.19,-0.55l-0.66,-1.25l2.04,-0.11l0.69,-1.01l-0.02,-1.16l1.11,-1.06l-0.17,-1.78l-0.49,-1.03l1.15,-0.98l5.42,-0.91l2.6,-0.82l1.6,1.16l0.97,2.34l3.45,0.97Z", "name": "Pakistan"}, "PH": {"path": "M737.01,263.84l0.39,2.97l-0.44,1.18l-0.55,-1.53l-0.67,-0.14l-1.17,1.28l0.65,2.09l-0.42,0.69l-2.48,-1.23l-0.57,-1.49l0.65,-1.03l-0.1,-0.54l-1.59,-1.19l-0.56,0.08l-0.65,0.87l-1.23,0.0l-1.58,0.97l0.83,-1.8l2.56,-1.42l0.65,0.84l0.45,0.13l1.9,-0.69l0.56,-1.11l1.5,-0.06l0.38,-0.43l-0.09,-1.19l1.21,0.71l0.36,2.02ZM733.59,256.58l0.05,0.75l0.08,0.26l-0.8,-0.42l-0.18,-0.71l0.85,0.12ZM734.08,256.1l-0.12,-1.12l-1.0,-1.27l1.36,0.03l0.53,0.73l0.51,2.04l-1.27,-0.4ZM733.76,257.68l0.38,0.98l-0.32,0.15l-0.07,-1.13ZM724.65,238.43l1.46,0.7l0.72,-0.31l-0.32,1.17l0.79,1.71l-0.57,1.84l-1.53,1.04l-0.39,2.25l0.56,2.04l1.63,0.57l1.16,-0.27l2.71,1.23l-0.19,1.08l0.76,0.84l-0.08,0.36l-1.4,-0.9l-0.88,-1.27l-0.66,0.0l-0.38,0.55l-1.6,-1.31l-2.15,0.36l-0.87,-0.39l0.07,-0.61l0.66,-0.55l-0.01,-0.62l-0.75,-0.59l-0.72,0.44l-0.74,-0.87l-0.39,-2.49l0.32,0.27l0.66,-0.28l0.26,-3.97l0.7,-2.02l1.14,0.0ZM731.03,258.87l-0.88,0.85l-1.19,1.94l-1.05,-1.19l0.93,-1.1l0.32,-1.47l0.52,-0.06l-0.27,1.15l0.22,0.45l0.49,-0.12l1.0,-1.32l-0.08,0.85ZM726.83,255.78l0.83,0.38l1.17,-0.0l-0.02,0.48l-2.0,1.4l0.03,-2.26ZM724.81,252.09l-0.38,1.27l-1.42,-1.95l1.2,0.05l0.6,0.63ZM716.55,261.82l1.1,-0.95l0.03,-0.03l-0.28,0.36l-0.85,0.61ZM719.22,259.06l0.04,-0.06l0.8,-1.53l0.16,0.75l-1.0,0.84Z", "name": "Philippines"}, "PL": {"path": "M468.44,149.42l-1.11,-1.54l-1.86,-0.33l-0.48,-1.05l-1.72,-0.37l-0.65,0.69l-0.72,-0.36l0.11,-0.61l-0.33,-0.46l-1.75,-0.27l-1.04,-0.93l-0.94,-1.94l0.16,-1.22l-0.62,-1.8l-0.78,-1.07l0.57,-1.04l-0.48,-1.43l1.41,-0.83l6.91,-2.71l2.14,0.5l0.52,0.91l5.51,0.44l4.55,-0.05l1.07,0.31l0.48,0.84l0.15,1.58l0.65,1.2l-0.01,0.99l-1.27,0.58l-0.19,0.54l0.73,1.48l0.08,1.55l1.2,2.76l-0.17,0.58l-1.23,0.44l-2.27,2.72l0.18,0.95l-1.97,-1.03l-1.98,0.4l-1.36,-0.28l-1.24,0.58l-1.07,-0.97l-1.16,0.24Z", "name": "Poland"}, "-99": {"path": "M504.91,192.87l0.34,0.01l0.27,-0.07l-0.29,0.26l-0.31,-0.2Z", "name": "N. Cyprus"}, "ZM": {"path": "M481.47,313.3l0.39,0.31l2.52,0.14l0.99,1.17l2.01,0.35l1.4,-0.64l0.69,1.17l1.78,0.33l1.84,2.35l2.23,0.18l0.4,-0.43l-0.21,-2.74l-0.62,-0.3l-0.48,0.32l-1.98,-1.17l0.72,-5.29l-0.51,-1.18l0.57,-1.3l3.68,-0.62l0.26,0.63l1.21,0.63l0.9,-0.22l2.16,0.67l1.33,0.71l1.07,1.02l0.56,1.87l-0.88,2.7l0.43,2.09l-0.73,0.87l-0.76,2.37l0.59,0.68l-6.6,1.83l-0.29,0.44l0.19,1.45l-1.68,0.35l-1.43,1.02l-0.38,0.87l-0.87,0.26l-3.48,3.69l-4.16,-0.53l-1.52,-1.0l-1.77,-0.13l-1.83,0.52l-3.04,-3.4l0.11,-7.59l4.82,0.03l0.39,-0.49l-0.18,-0.76l0.33,-0.83l-0.4,-1.36l0.24,-1.05Z", "name": "Zambia"}, "EH": {"path": "M384.42,230.28l0.25,-0.79l1.06,-1.29l0.8,-3.51l3.38,-2.78l0.7,-1.81l0.06,4.84l-1.98,0.2l-0.94,1.59l0.39,3.56l-3.7,-0.01ZM392.01,218.1l0.7,-1.8l1.77,-0.24l2.09,0.34l0.95,-0.62l1.28,-0.07l-0.0,2.51l-6.79,-0.12Z", "name": "W. Sahara"}, "EE": {"path": "M485.71,115.04l2.64,0.6l2.56,0.11l-1.6,1.91l0.61,3.54l-0.81,0.87l-1.78,-0.01l-3.22,-1.76l-1.8,0.45l0.21,-1.53l-0.58,-0.41l-0.69,0.34l-1.26,-1.03l-0.17,-1.63l2.83,-0.92l3.05,-0.52Z", "name": "Estonia"}, "EG": {"path": "M492.06,205.03l1.46,0.42l2.95,-1.64l2.04,-0.21l1.53,0.3l0.59,1.19l0.69,0.04l0.41,-0.64l1.81,0.58l1.95,0.16l1.04,-0.51l1.42,4.08l-2.03,4.54l-1.66,-1.77l-1.76,-3.85l-0.64,-0.12l-0.36,0.67l1.04,2.88l3.44,6.95l1.78,3.04l2.03,2.65l-0.36,0.53l0.23,2.01l2.7,2.19l-28.41,0.0l0.0,-18.96l-0.73,-2.2l0.59,-1.56l-0.32,-1.26l0.68,-0.99l3.06,-0.04l4.82,1.52Z", "name": "Egypt"}, "ZA": {"path": "M467.14,373.21l-0.13,-1.96l-0.68,-1.56l0.7,-0.68l-0.13,-2.33l-4.56,-8.19l0.77,-0.86l0.6,0.45l0.69,1.31l2.83,0.72l1.5,-0.26l2.24,-1.39l0.19,-9.55l1.35,2.3l-0.21,1.5l0.61,1.2l0.4,0.19l1.79,-0.27l2.6,-2.07l0.69,-1.32l0.96,-0.48l2.19,1.04l2.04,0.13l1.77,-0.65l0.85,-2.12l1.38,-0.33l1.59,-2.76l2.15,-1.89l3.41,-1.87l2.0,0.45l1.02,-0.28l0.99,0.2l1.75,5.29l-0.38,3.25l-0.81,-0.23l-1.0,0.46l-0.87,1.68l-0.05,1.16l1.97,1.84l1.47,-0.29l0.69,-1.18l1.09,0.01l-0.76,3.69l-0.58,1.09l-2.2,1.79l-3.17,4.76l-2.8,2.83l-3.57,2.88l-2.53,1.05l-1.22,0.14l-0.51,0.7l-1.18,-0.32l-1.39,0.5l-2.59,-0.52l-1.61,0.33l-1.18,-0.11l-2.55,1.1l-2.1,0.44l-1.6,1.07l-0.85,0.05l-0.93,-0.89l-0.93,-0.15l-0.97,-1.13l-0.25,0.05ZM491.45,364.19l0.62,-0.93l1.48,-0.59l1.18,-2.19l-0.07,-0.49l-1.99,-1.69l-1.66,0.56l-1.43,1.14l-1.34,1.73l0.02,0.51l1.88,2.11l1.31,-0.16Z", "name": "South Africa"}, "EC": {"path": "M231.86,285.53l0.29,1.59l-0.69,1.45l-2.61,2.51l-3.13,1.11l-1.53,2.18l-0.49,1.68l-1.0,0.73l-1.02,-1.11l-1.78,-0.16l0.67,-1.15l-0.24,-0.86l1.25,-2.13l-0.54,-1.09l-0.67,-0.08l-0.72,0.87l-0.87,-0.64l0.35,-0.69l-0.36,-1.96l0.81,-0.51l0.45,-1.51l0.92,-1.57l-0.07,-0.97l2.65,-1.33l2.75,1.35l0.77,1.05l2.12,0.35l0.76,-0.32l1.96,1.21Z", "name": "Ecuador"}, "AL": {"path": "M470.32,171.8l0.74,0.03l0.92,0.89l-0.17,1.95l0.36,1.28l1.01,0.82l-1.82,2.83l-0.19,-0.61l-1.25,-0.89l-0.18,-1.2l0.53,-2.82l-0.54,-1.47l0.6,-0.83Z", "name": "Albania"}, "AO": {"path": "M461.55,300.03l1.26,3.15l1.94,2.36l2.47,-0.53l1.25,0.32l0.44,-0.18l0.93,-1.92l1.31,-0.08l0.41,-0.44l0.47,-0.0l-0.1,0.41l0.39,0.49l2.65,-0.02l0.03,1.19l0.48,1.01l-0.34,1.52l0.18,1.55l0.83,1.04l-0.13,2.85l0.54,0.39l3.96,-0.41l-0.1,1.79l0.39,1.05l-0.24,1.43l-4.7,-0.03l-0.4,0.39l-0.12,8.13l2.92,3.49l-3.83,0.88l-5.89,-0.36l-1.88,-1.24l-10.47,0.22l-1.3,-1.01l-1.85,-0.16l-2.4,0.77l-0.15,-1.06l0.33,-2.16l1.0,-3.45l1.35,-3.2l2.24,-2.8l0.33,-2.06l-0.13,-1.53l-0.8,-1.08l-1.21,-2.87l0.87,-1.62l-1.27,-4.12l-1.17,-1.53l2.47,-0.63l7.03,0.03ZM451.71,298.87l-0.47,-1.25l1.25,-1.11l0.32,0.3l-0.99,1.03l-0.12,1.03Z", "name": "Angola"}, "KZ": {"path": "M552.8,172.89l0.46,-1.27l-0.48,-1.05l-2.96,-1.19l-1.06,-2.58l-1.37,-0.87l-0.03,-0.3l1.95,0.23l0.45,-0.38l0.08,-1.96l1.75,-0.41l2.1,0.45l0.48,-0.33l0.45,-3.04l-0.45,-2.09l-0.41,-0.31l-2.42,0.15l-2.36,-0.73l-2.87,1.37l-2.17,0.61l-0.85,-0.34l0.13,-1.61l-1.6,-2.12l-2.02,-0.08l-1.78,-1.82l1.29,-2.18l-0.57,-0.95l1.62,-2.91l2.21,1.63l0.63,-0.27l0.29,-2.22l4.92,-3.43l3.71,-0.08l8.4,3.6l2.92,-1.36l3.77,-0.06l3.11,1.66l0.51,-0.11l0.6,-0.81l3.31,0.13l0.39,-0.25l0.63,-1.57l-0.17,-0.5l-3.5,-1.98l1.87,-1.27l-0.13,-1.03l1.98,-0.72l0.18,-0.62l-1.59,-2.06l0.81,-0.82l9.23,-1.18l1.33,-0.88l6.18,-1.26l2.26,-1.42l4.08,0.68l0.73,3.33l0.51,0.3l2.48,-0.8l2.79,1.02l-0.17,1.56l0.43,0.44l2.55,-0.24l4.89,-2.53l0.03,0.32l3.15,2.61l5.56,8.47l0.65,0.02l1.12,-1.46l3.15,1.74l3.76,-0.78l1.15,0.49l1.14,1.8l1.84,0.76l0.99,1.29l3.35,-0.25l1.02,1.52l-1.6,1.81l-1.93,0.28l-0.34,0.38l-0.11,3.05l-1.13,1.16l-4.75,-1.0l-0.46,0.27l-1.76,5.47l-1.1,0.59l-4.91,1.23l-0.27,0.54l2.1,4.97l-1.37,0.63l-0.23,0.41l0.13,1.13l-0.88,-0.25l-1.42,-1.13l-7.89,-0.4l-0.92,0.31l-3.73,-1.22l-1.42,0.63l-0.53,1.66l-3.72,-0.94l-1.85,0.43l-0.76,1.4l-4.65,2.62l-1.13,2.08l-0.44,0.01l-0.92,-1.4l-2.87,-0.09l-0.45,-2.14l-0.38,-0.32l-0.8,-0.01l0.0,-2.96l-3.0,-2.22l-7.31,0.58l-2.35,-2.68l-6.71,-3.69l-6.45,1.83l-0.29,0.39l0.1,10.85l-0.7,0.08l-1.62,-2.17l-1.83,-0.96l-3.11,0.59l-0.64,0.51Z", "name": "Kazakhstan"}, "ET": {"path": "M516.04,247.79l1.1,0.84l1.63,-0.45l0.68,0.47l1.63,0.03l2.01,0.94l1.73,1.66l1.64,2.07l-1.52,2.04l0.16,1.72l0.39,0.38l2.05,0.0l-0.36,1.03l2.86,3.58l8.32,3.08l1.31,0.02l-6.32,6.75l-3.1,0.11l-2.36,1.77l-1.47,0.04l-0.86,0.79l-1.38,-0.0l-1.32,-0.81l-2.29,1.05l-0.76,0.98l-3.29,-0.41l-3.07,-2.07l-1.8,-0.07l-0.62,-0.6l0.0,-1.24l-0.28,-0.38l-1.15,-0.37l-1.4,-2.59l-1.19,-0.68l-0.47,-1.0l-1.27,-1.23l-1.16,-0.22l0.43,-0.72l1.45,-0.28l0.41,-0.95l-0.03,-2.21l0.68,-2.44l1.05,-0.63l1.43,-3.06l1.57,-1.37l1.02,-2.51l0.35,-1.88l2.52,0.46l0.44,-0.24l0.58,-1.43Z", "name": "Ethiopia"}, "ZW": {"path": "M498.91,341.09l-1.11,-0.22l-0.92,0.28l-2.09,-0.44l-1.5,-1.11l-1.89,-0.43l-0.62,-1.4l-0.01,-0.84l-0.3,-0.38l-0.97,-0.25l-2.71,-2.74l-1.92,-3.32l3.83,0.45l3.73,-3.82l1.08,-0.44l0.26,-0.77l1.25,-0.9l1.41,-0.26l0.5,0.89l1.99,-0.05l1.72,1.17l1.11,0.17l1.05,0.66l0.01,2.99l-0.59,3.76l0.38,0.86l-0.23,1.23l-0.39,0.35l-0.63,1.81l-2.43,2.75Z", "name": "Zimbabwe"}, "ES": {"path": "M416.0,169.21l1.07,1.17l4.61,1.38l1.06,-0.57l2.6,1.26l2.71,-0.3l0.09,1.12l-2.14,1.8l-3.11,0.61l-0.31,0.31l-0.2,0.89l-1.54,1.69l-0.97,2.4l0.84,1.74l-1.32,1.27l-0.48,1.68l-1.88,0.65l-1.66,2.07l-5.36,-0.01l-1.79,1.08l-0.89,0.98l-0.88,-0.17l-0.79,-0.82l-0.68,-1.59l-2.37,-0.63l-0.11,-0.5l1.21,-1.82l-0.77,-1.13l0.61,-1.68l-0.76,-1.62l0.87,-0.49l0.09,-1.25l0.42,-0.6l0.03,-2.11l0.99,-0.69l0.13,-0.5l-1.03,-1.73l-1.46,-0.11l-0.61,0.38l-1.06,0.0l-0.52,-1.23l-0.53,-0.21l-1.32,0.67l-0.01,-1.49l-0.75,-0.96l3.03,-1.88l2.99,0.53l3.32,-0.02l2.63,0.51l6.01,-0.06Z", "name": "Spain"}, "ER": {"path": "M520.38,246.23l3.42,2.43l3.5,3.77l0.84,0.54l-0.95,-0.01l-3.51,-3.89l-2.33,-1.15l-1.73,-0.07l-0.91,-0.51l-1.26,0.51l-1.34,-1.02l-0.61,0.17l-0.66,1.61l-2.35,-0.43l-0.17,-0.67l1.29,-5.29l0.61,-0.61l1.95,-0.53l0.87,-1.01l1.17,2.41l0.68,2.33l1.49,1.43Z", "name": "Eritrea"}, "ME": {"path": "M468.91,172.53l-1.22,-1.02l0.47,-1.81l0.89,-0.72l2.26,1.51l-0.5,0.57l-0.75,-0.27l-1.14,1.73Z", "name": "Montenegro"}, "MD": {"path": "M488.41,153.73l1.4,-0.27l1.72,0.93l1.07,0.15l0.85,0.65l-0.14,0.84l0.96,0.85l1.12,2.47l-1.15,-0.07l-0.66,-0.41l-0.52,0.25l-0.09,0.86l-1.08,1.89l-0.27,-0.86l0.25,-1.34l-0.16,-1.6l-3.29,-4.34Z", "name": "Moldova"}, "MG": {"path": "M545.91,319.14l0.4,3.03l0.62,1.21l-0.21,1.02l-0.57,-0.8l-0.69,-0.01l-0.47,0.76l0.41,2.12l-0.18,0.87l-0.73,0.78l-0.15,2.14l-4.71,15.2l-1.06,2.88l-3.92,1.64l-3.12,-1.49l-0.6,-1.21l-0.19,-2.4l-0.86,-2.05l-0.21,-1.77l0.38,-1.62l1.21,-0.75l0.01,-0.76l1.19,-2.04l0.23,-1.66l-1.06,-2.99l-0.19,-2.21l0.81,-1.33l0.32,-1.46l4.63,-1.22l3.44,-3.0l0.85,-1.4l-0.08,-0.7l0.78,-0.04l1.38,-1.77l0.13,-1.64l0.45,-0.61l1.16,1.69l0.59,1.6Z", "name": "Madagascar"}, "MA": {"path": "M378.78,230.02l0.06,-0.59l0.92,-0.73l0.82,-1.37l-0.09,-1.04l0.79,-1.7l1.31,-1.58l0.96,-0.59l0.66,-1.55l0.09,-1.47l0.81,-1.48l1.72,-1.07l1.55,-2.69l1.16,-0.96l2.44,-0.39l1.94,-1.82l1.31,-0.78l2.09,-2.28l-0.51,-3.65l1.24,-3.7l1.5,-1.75l4.46,-2.57l2.37,-4.47l1.44,0.01l1.68,1.21l2.32,-0.19l3.47,0.65l0.8,1.54l0.16,1.71l0.86,2.96l0.56,0.59l-0.26,0.61l-3.05,0.44l-1.26,1.05l-1.33,0.22l-0.33,0.37l-0.09,1.78l-2.68,1.0l-1.07,1.42l-4.47,1.13l-4.04,2.01l-0.54,4.64l-1.15,0.06l-0.92,0.61l-1.96,-0.35l-2.42,0.54l-0.74,1.9l-0.86,0.4l-1.14,3.26l-3.53,3.01l-0.8,3.55l-0.96,1.1l-0.29,0.82l-4.95,0.18Z", "name": "Morocco"}, "UZ": {"path": "M598.64,172.75l-1.63,1.52l0.06,0.64l1.85,1.12l1.97,-0.64l2.21,1.17l-2.52,1.68l-2.59,-0.22l-0.18,-0.41l0.46,-1.23l-0.45,-0.53l-3.35,0.69l-2.1,3.51l-1.87,-0.12l-1.03,1.51l0.22,0.55l1.64,0.62l0.46,1.83l-1.19,2.49l-2.66,-0.53l0.05,-1.36l-0.26,-0.39l-3.3,-1.23l-2.56,-1.4l-4.4,-3.34l-1.34,-3.14l-1.08,-0.6l-2.58,0.13l-0.69,-0.44l-0.47,-2.52l-3.37,-1.6l-0.43,0.05l-2.07,1.72l-2.1,1.01l-0.21,0.47l0.28,1.01l-1.91,0.03l-0.09,-10.5l5.99,-1.7l6.19,3.54l2.71,2.84l7.05,-0.67l2.71,2.01l-0.17,2.81l0.39,0.42l0.9,0.02l0.44,2.14l0.38,0.32l2.94,0.09l0.95,1.42l1.28,-0.24l1.05,-2.04l4.43,-2.5Z", "name": "Uzbekistan"}, "MM": {"path": "M673.9,230.21l-1.97,1.57l-0.57,0.96l-1.4,0.6l-1.36,1.05l-1.99,0.36l-1.08,2.66l-0.91,0.4l-0.19,0.55l1.21,2.27l2.52,3.43l-0.79,1.91l-0.74,0.41l-0.17,0.52l0.65,1.37l1.61,1.95l0.25,2.58l0.9,2.13l-1.92,3.57l0.68,-2.25l-0.81,-1.74l0.19,-2.65l-1.05,-1.53l-1.24,-6.17l-1.12,-2.26l-0.6,-0.13l-4.34,3.02l-2.39,-0.65l0.77,-2.84l-0.52,-2.61l-1.91,-2.96l0.25,-0.75l-0.29,-0.51l-1.33,-0.3l-1.61,-1.93l-0.1,-1.3l0.82,-0.24l0.04,-1.64l1.02,-0.52l0.21,-0.45l-0.23,-0.95l0.54,-0.96l0.08,-2.22l1.46,0.45l0.47,-0.2l1.12,-2.19l0.16,-1.35l1.33,-2.16l-0.0,-1.52l2.89,-1.66l1.63,0.44l0.5,-0.44l-0.17,-1.4l0.64,-0.36l0.08,-1.04l0.77,-0.11l0.71,1.35l1.06,0.69l-0.03,3.86l-2.38,2.37l-0.3,3.15l0.46,0.43l2.28,-0.38l0.51,2.08l1.47,0.67l-0.6,1.8l0.19,0.48l2.97,1.48l1.64,-0.55l0.02,0.32Z", "name": "Myanmar"}, "ML": {"path": "M392.61,254.08l-0.19,-2.37l-0.99,-0.87l-0.44,-1.3l-0.09,-1.28l0.81,-0.58l0.35,-1.24l2.37,0.65l1.31,-0.47l0.86,0.15l0.66,-0.56l9.83,-0.04l0.38,-0.28l0.56,-1.8l-0.44,-0.65l-2.35,-21.95l3.27,-0.04l16.7,11.38l0.74,1.31l2.5,1.09l0.02,1.38l0.44,0.39l2.34,-0.21l0.01,5.38l-1.28,1.61l-0.26,1.49l-5.31,0.57l-1.07,0.92l-2.9,0.1l-0.86,-0.48l-1.38,0.36l-2.4,1.08l-0.6,0.87l-1.85,1.09l-0.43,0.7l-0.79,0.39l-1.44,-0.21l-0.81,0.84l-0.34,1.64l-1.91,2.02l-0.06,1.03l-0.67,1.22l0.13,1.16l-0.97,0.39l-0.23,-0.64l-0.52,-0.24l-1.35,0.4l-0.34,0.55l-2.69,-0.28l-0.37,-0.35l-0.02,-0.9l-0.65,-0.35l0.45,-0.64l-0.03,-0.53l-2.12,-2.44l-0.76,-0.01l-2.0,1.16l-0.78,-0.15l-0.8,-0.67l-1.21,0.23Z", "name": "Mali"}, "MN": {"path": "M676.61,146.48l3.81,1.68l5.67,-1.0l2.37,0.41l2.34,1.5l1.79,1.75l2.29,-0.03l3.12,0.52l2.47,-0.81l3.41,-0.59l3.53,-2.21l1.25,0.29l1.53,1.13l2.27,-0.21l-2.66,5.01l0.64,1.68l0.47,0.21l1.32,-0.38l2.38,0.48l2.02,-1.11l1.76,0.89l2.06,2.02l-0.13,0.53l-1.72,-0.29l-3.77,0.46l-1.88,0.99l-1.76,1.99l-3.71,1.17l-2.45,1.6l-3.83,-0.87l-0.41,0.17l-1.31,1.99l1.04,2.24l-1.52,0.9l-1.74,1.57l-2.79,1.02l-3.78,0.13l-4.05,1.05l-2.77,1.52l-1.16,-0.85l-2.94,0.0l-3.62,-1.79l-2.58,-0.49l-3.4,0.41l-5.12,-0.67l-2.63,0.06l-1.31,-1.6l-1.4,-3.0l-1.48,-0.33l-3.13,-1.94l-6.16,-0.93l-0.71,-1.06l0.86,-3.82l-1.93,-2.71l-3.5,-1.18l-1.95,-1.58l-0.5,-1.72l2.34,-0.52l4.75,-2.8l3.62,-1.47l2.18,0.97l2.46,0.05l1.81,1.53l2.46,0.12l3.95,0.71l2.43,-2.28l0.08,-0.48l-0.9,-1.72l2.24,-2.98l2.62,1.27l4.94,1.17l0.43,2.24Z", "name": "Mongolia"}, "MK": {"path": "M472.8,173.98l0.49,-0.71l3.57,-0.71l1.0,0.77l0.13,1.45l-0.65,0.53l-1.15,-0.05l-1.12,0.67l-1.39,0.22l-0.79,-0.55l-0.29,-1.03l0.19,-0.6Z", "name": "Macedonia"}, "MW": {"path": "M505.5,309.31l0.85,1.95l0.15,2.86l-0.69,1.65l0.71,1.8l0.06,1.28l0.49,0.64l0.07,1.06l0.4,0.55l0.8,-0.23l0.55,0.61l0.69,-0.21l0.34,0.6l0.19,2.94l-1.04,0.62l-0.54,1.25l-1.11,-1.08l-0.16,-1.56l0.51,-1.31l-0.32,-1.3l-0.99,-0.65l-0.82,0.12l-2.36,-1.64l0.63,-1.96l0.82,-1.18l-0.46,-2.01l0.9,-2.86l-0.94,-2.51l0.96,0.18l0.29,0.4Z", "name": "Malawi"}, "MR": {"path": "M407.36,220.66l-2.58,0.03l-0.39,0.44l2.42,22.56l0.36,0.43l-0.39,1.24l-9.75,0.04l-0.56,0.53l-0.91,-0.11l-1.27,0.45l-1.61,-0.66l-0.97,0.03l-0.36,0.29l-0.38,1.35l-0.42,0.23l-2.93,-3.4l-2.96,-1.52l-1.62,-0.03l-1.27,0.54l-1.12,-0.2l-0.65,0.4l-0.08,-0.49l0.68,-1.29l0.31,-2.43l-0.57,-3.91l0.23,-1.21l-0.69,-1.5l-1.15,-1.02l0.25,-0.39l9.58,0.02l0.4,-0.45l-0.46,-3.68l0.47,-1.04l2.12,-0.21l0.36,-0.4l-0.08,-6.4l7.81,0.13l0.41,-0.4l0.01,-3.31l7.76,5.35Z", "name": "Mauritania"}, "UG": {"path": "M498.55,276.32l0.7,-0.46l1.65,0.5l1.96,-0.57l1.7,0.01l1.45,-0.98l0.91,1.33l1.33,3.95l-2.57,4.03l-1.46,-0.4l-2.54,0.91l-1.37,1.61l-0.01,0.81l-2.42,-0.01l-2.26,1.01l-0.17,-1.59l0.58,-1.04l0.14,-1.94l1.37,-2.28l1.78,-1.58l-0.17,-0.65l-0.72,-0.24l0.13,-2.43Z", "name": "Uganda"}, "MY": {"path": "M717.47,273.46l-1.39,0.65l-2.12,-0.41l-2.88,-0.0l-0.38,0.28l-0.84,2.75l-0.99,0.96l-1.21,3.29l-1.73,0.45l-2.45,-0.68l-1.39,0.31l-1.33,1.15l-1.59,-0.14l-1.41,0.44l-1.44,-1.19l-0.18,-0.73l1.34,0.53l1.93,-0.47l0.75,-2.22l4.02,-1.03l2.75,-3.21l0.82,0.94l0.64,-0.05l0.4,-0.65l0.96,0.06l0.42,-0.36l0.24,-2.68l1.81,-1.64l1.21,-1.86l0.63,-0.01l1.07,1.05l0.34,1.28l3.44,1.35l-0.06,0.35l-1.37,0.1l-0.35,0.54l0.32,0.88ZM673.68,269.59l0.17,1.09l0.47,0.33l1.65,-0.3l0.87,-0.94l1.61,1.52l0.98,1.56l-0.12,2.81l0.41,2.29l0.95,0.9l0.88,2.44l-1.27,0.12l-5.1,-3.67l-0.34,-1.29l-1.37,-1.59l-0.33,-1.97l-0.88,-1.4l0.25,-1.68l-0.46,-1.05l1.63,0.84Z", "name": "Malaysia"}, "MX": {"path": "M133.12,200.41l0.2,0.47l9.63,3.33l6.96,-0.02l0.4,-0.4l0.0,-0.74l3.77,0.0l3.55,2.93l1.39,2.83l1.52,1.04l2.08,0.82l0.47,-0.14l1.46,-2.0l1.73,-0.04l1.59,0.98l2.05,3.35l1.47,1.56l1.26,3.14l2.18,1.02l2.26,0.58l-1.18,3.72l-0.42,5.04l1.79,4.89l1.62,1.89l0.61,1.52l1.2,1.42l2.55,0.66l1.37,1.1l7.54,-1.89l1.86,-1.3l1.14,-4.3l4.1,-1.21l3.57,-0.11l0.32,0.3l-0.06,0.94l-1.26,1.45l-0.67,1.71l0.38,0.7l-0.72,2.27l-0.49,-0.3l-1.0,0.08l-1.0,1.39l-0.47,-0.11l-0.53,0.47l-4.26,-0.02l-0.4,0.4l-0.0,1.06l-1.1,0.26l0.1,0.44l1.82,1.44l0.56,0.91l-3.19,0.21l-1.21,2.09l0.24,0.72l-0.2,0.44l-2.24,-2.18l-1.45,-0.93l-2.22,-0.69l-1.52,0.22l-3.07,1.16l-10.55,-3.85l-2.86,-1.96l-3.78,-0.92l-1.08,-1.19l-2.62,-1.43l-1.18,-1.54l-0.38,-0.81l0.66,-0.63l-0.18,-0.53l0.52,-0.76l0.01,-0.91l-2.0,-3.82l-2.21,-2.63l-2.53,-2.09l-1.19,-1.62l-2.2,-1.17l-0.3,-0.43l0.34,-1.48l-0.21,-0.45l-1.23,-0.6l-1.36,-1.2l-0.59,-1.78l-1.54,-0.47l-2.44,-2.55l-0.16,-0.9l-1.33,-2.03l-0.84,-1.99l-0.16,-1.33l-1.81,-1.1l-0.97,0.05l-1.31,-0.7l-0.57,0.22l-0.4,1.12l0.72,3.77l3.51,3.89l0.28,0.78l0.53,0.26l0.41,1.43l1.33,1.73l1.58,1.41l0.8,2.39l1.43,2.41l0.13,1.32l0.37,0.36l1.04,0.08l1.67,2.28l-0.85,0.76l-0.66,-1.51l-1.68,-1.54l-2.91,-1.87l0.06,-1.82l-0.54,-1.68l-2.91,-2.03l-0.55,0.09l-1.95,-1.1l-0.88,-0.94l0.68,-0.08l0.93,-1.01l0.08,-1.78l-1.93,-1.94l-1.46,-0.77l-3.75,-7.56l4.88,-0.42Z", "name": "Mexico"}, "VU": {"path": "M839.04,322.8l0.22,1.14l-0.44,0.03l-0.2,-1.45l0.42,0.27Z", "name": "Vanuatu"}, "FR": {"path": "M444.48,172.62l-0.64,1.78l-0.58,-0.31l-0.49,-1.72l0.4,-0.89l1.0,-0.72l0.3,1.85ZM429.64,147.1l1.78,1.58l1.46,-0.13l2.1,1.42l1.35,0.27l1.23,0.83l3.04,0.5l-1.03,1.85l-0.3,2.12l-0.41,0.32l-0.95,-0.24l-0.5,0.43l0.06,0.61l-1.81,1.92l-0.04,1.42l0.55,0.38l0.88,-0.36l0.61,0.97l-0.03,1.0l0.57,0.91l-0.75,1.09l0.65,2.39l1.27,0.57l-0.18,0.82l-2.01,1.53l-4.77,-0.8l-3.82,1.0l-0.53,1.85l-2.49,0.34l-2.71,-1.31l-1.16,0.57l-4.31,-1.29l-0.72,-0.86l1.19,-1.78l0.39,-6.45l-2.58,-3.3l-1.9,-1.66l-3.72,-1.23l-0.19,-1.72l2.81,-0.61l4.12,0.81l0.47,-0.48l-0.6,-2.77l1.94,0.95l5.83,-2.54l0.92,-2.74l1.6,-0.49l0.24,0.78l1.36,0.33l1.05,1.19ZM289.01,278.39l-0.81,0.8l-0.78,0.12l-0.5,-0.66l-0.56,-0.1l-0.91,0.6l-0.46,-0.22l1.09,-2.96l-0.96,-1.77l-0.17,-1.49l1.07,-1.77l2.32,0.75l2.51,2.01l0.3,0.74l-2.14,3.96Z", "name": "France"}, "FI": {"path": "M492.17,76.39l-0.23,3.5l3.52,2.63l-2.08,2.88l-0.02,0.44l2.8,4.56l-1.59,3.31l2.16,3.24l-0.94,2.39l0.14,0.47l3.44,2.51l-0.77,1.62l-7.52,6.95l-4.5,0.31l-4.38,1.37l-3.8,0.74l-1.44,-1.96l-2.17,-1.11l0.5,-3.66l-1.16,-3.33l1.09,-2.08l2.21,-2.42l5.67,-4.32l1.64,-0.83l0.21,-0.42l-0.46,-2.02l-3.38,-1.89l-0.75,-1.43l-0.22,-6.74l-6.79,-4.8l0.8,-0.62l2.54,2.12l3.46,-0.12l3.0,0.96l2.51,-2.11l1.17,-3.08l3.55,-1.38l2.76,1.53l-0.95,2.79Z", "name": "Finland"}, "FJ": {"path": "M871.53,326.34l-2.8,1.05l-0.08,-0.23l2.97,-1.21l-0.1,0.39ZM867.58,329.25l0.43,0.37l-0.27,0.88l-1.24,0.28l-1.04,-0.24l-0.14,-0.66l0.63,-0.58l0.92,0.26l0.7,-0.31Z", "name": "Fiji"}, "FK": {"path": "M274.36,425.85l1.44,1.08l-0.47,0.73l-3.0,0.89l-0.96,-1.0l-0.52,-0.05l-1.83,1.29l-0.73,-0.88l2.46,-1.64l1.93,0.76l1.67,-1.19Z", "name": "Falkland Is."}, "NI": {"path": "M202.33,252.67l0.81,-0.18l1.03,-1.02l-0.04,-0.88l0.68,-0.0l0.63,-0.54l0.97,0.22l1.53,-1.26l0.58,-0.99l1.17,0.34l2.41,-0.94l0.13,1.32l-0.81,1.94l0.1,2.74l-0.36,0.37l-0.11,1.75l-0.47,0.81l0.18,1.14l-1.73,-0.85l-0.71,0.27l-1.47,-0.6l-0.52,0.16l-4.01,-3.81Z", "name": "Nicaragua"}, "NL": {"path": "M430.31,143.39l0.6,-0.5l2.13,-4.8l3.2,-1.33l1.74,0.08l0.33,0.8l-0.59,2.92l-0.5,0.99l-1.26,0.0l-0.4,0.45l0.33,2.7l-2.2,-1.78l-2.62,0.58l-0.75,-0.11Z", "name": "Netherlands"}, "NO": {"path": "M491.44,67.41l6.8,2.89l-2.29,0.86l-0.15,0.65l2.33,2.38l-4.98,1.79l0.84,-2.45l-0.18,-0.48l-3.55,-1.8l-3.89,1.52l-1.42,3.38l-2.12,1.72l-2.64,-1.0l-3.11,0.21l-2.66,-2.22l-0.5,-0.01l-1.41,1.1l-1.44,0.17l-0.35,0.35l-0.32,2.47l-4.32,-0.64l-0.44,0.29l-0.58,2.11l-2.45,0.2l-4.15,7.68l-3.88,5.76l0.78,1.62l-0.64,1.16l-2.24,-0.06l-0.38,0.24l-1.66,3.89l0.15,5.17l1.57,2.04l-0.78,4.16l-2.02,2.48l-0.85,1.63l-1.3,-1.75l-0.58,-0.07l-4.87,4.19l-3.1,0.79l-3.16,-1.7l-0.85,-3.77l-0.77,-8.55l2.14,-2.31l6.55,-3.27l5.02,-4.17l10.63,-13.84l10.98,-8.7l5.35,-1.91l4.34,0.12l3.69,-3.64l4.49,0.19l4.37,-0.89ZM484.55,20.04l4.26,1.75l-3.1,2.55l-7.1,0.65l-7.08,-0.9l-0.37,-1.31l-0.37,-0.29l-3.44,-0.1l-2.08,-2.0l6.87,-1.44l3.9,1.31l2.39,-1.64l6.13,1.4ZM481.69,33.93l-4.45,1.74l-3.54,-0.99l1.12,-0.9l0.05,-0.58l-1.06,-1.22l4.22,-0.89l1.09,1.97l2.57,0.87ZM466.44,24.04l7.43,3.77l-5.41,1.86l-1.58,4.08l-2.26,1.2l-1.12,4.11l-2.61,0.18l-4.79,-2.86l1.84,-1.54l-0.1,-0.68l-3.69,-1.53l-4.77,-4.51l-1.73,-3.89l6.11,-1.82l1.54,1.92l3.57,-0.08l1.2,-1.96l3.32,-0.18l3.05,1.92Z", "name": "Norway"}, "NA": {"path": "M474.26,330.66l-0.97,0.04l-0.38,0.4l-0.07,8.9l-2.09,0.08l-0.39,0.4l-0.0,17.42l-1.98,1.23l-1.17,0.17l-2.44,-0.66l-0.48,-1.13l-0.99,-0.74l-0.54,0.05l-0.9,1.01l-1.53,-1.68l-0.93,-1.88l-1.99,-8.56l-0.06,-3.12l-0.33,-1.52l-2.3,-3.34l-1.91,-4.83l-1.96,-2.43l-0.12,-1.57l2.33,-0.79l1.43,0.07l1.81,1.13l10.23,-0.25l1.84,1.23l5.87,0.35ZM474.66,330.64l6.51,-1.6l1.9,0.39l-1.69,0.4l-1.31,0.83l-1.12,-0.94l-4.29,0.92Z", "name": "Namibia"}, "NC": {"path": "M838.78,341.24l-0.33,0.22l-2.9,-1.75l-3.26,-3.37l1.65,0.83l4.85,4.07Z", "name": "New Caledonia"}, "NE": {"path": "M454.75,226.53l1.33,1.37l0.48,0.07l1.27,-0.7l0.53,3.52l0.94,0.83l0.17,0.92l0.81,0.69l-0.44,0.95l-0.96,5.26l-0.13,3.22l-3.04,2.31l-1.22,3.57l1.02,1.24l-0.0,1.46l0.39,0.4l1.13,0.04l-0.9,1.25l-1.47,-2.42l-0.86,-0.29l-2.09,1.37l-1.74,-0.67l-1.45,-0.17l-0.85,0.35l-1.36,-0.07l-1.64,1.09l-1.06,0.05l-2.94,-1.28l-1.44,0.59l-1.01,-0.03l-0.97,-0.94l-2.7,-0.98l-2.69,0.3l-0.87,0.64l-0.47,1.6l-0.75,1.16l-0.12,1.53l-1.57,-1.1l-1.31,0.24l0.03,-0.81l-0.32,-0.41l-2.59,-0.52l-0.15,-1.16l-1.35,-1.6l-0.29,-1.0l0.13,-0.84l1.29,-0.08l1.08,-0.92l3.31,-0.22l2.22,-0.41l0.32,-0.34l0.2,-1.47l1.39,-1.88l-0.01,-5.66l3.36,-1.12l7.24,-5.12l8.42,-4.92l3.69,1.06Z", "name": "Niger"}, "NG": {"path": "M456.32,253.89l0.64,0.65l-0.28,1.04l-2.11,2.01l-2.03,5.18l-1.37,1.16l-1.15,3.18l-1.33,0.66l-1.46,-0.97l-1.21,0.16l-1.38,1.36l-0.91,0.24l-1.79,4.06l-2.33,0.81l-1.11,-0.07l-0.86,0.5l-1.71,-0.05l-1.19,-1.39l-0.89,-1.89l-1.77,-1.66l-3.95,-0.08l0.07,-5.21l0.42,-1.43l1.95,-2.3l-0.14,-0.91l0.43,-1.18l-0.53,-1.41l0.25,-2.92l0.72,-1.07l0.32,-1.34l0.46,-0.39l2.47,-0.28l2.34,0.89l1.15,1.02l1.28,0.04l1.22,-0.58l3.03,1.27l1.49,-0.14l1.36,-1.0l1.33,0.07l0.82,-0.35l3.45,0.8l1.82,-1.32l1.84,2.67l0.66,0.16Z", "name": "Nigeria"}, "NZ": {"path": "M857.8,379.65l1.86,3.12l0.44,0.18l0.3,-0.38l0.03,-1.23l0.38,0.27l0.57,2.31l2.02,0.94l1.81,0.27l1.57,-1.06l0.7,0.18l-1.15,3.59l-1.98,0.11l-0.74,1.2l0.2,1.11l-2.42,3.98l-1.49,0.92l-1.04,-0.85l1.21,-2.05l-0.81,-2.01l-2.63,-1.25l0.04,-0.57l1.82,-1.19l0.43,-2.34l-0.16,-2.03l-0.95,-1.82l-0.06,-0.72l-3.11,-3.64l-0.79,-1.52l1.56,1.45l1.76,0.66l0.65,2.34ZM853.83,393.59l0.57,1.24l0.59,0.16l1.42,-0.97l0.46,0.79l0.0,1.03l-2.47,3.48l-1.26,1.2l-0.06,0.5l0.55,0.87l-1.41,0.07l-2.33,1.38l-2.03,5.02l-3.02,2.16l-2.06,-0.06l-1.71,-1.04l-2.47,-0.2l-0.27,-0.73l1.22,-2.1l3.05,-2.94l1.62,-0.59l4.02,-2.82l1.57,-1.67l1.07,-2.16l0.88,-0.7l0.48,-1.75l1.24,-0.97l0.35,0.79Z", "name": "New Zealand"}, "NP": {"path": "M641.14,213.62l0.01,3.19l-1.74,0.04l-4.8,-0.86l-1.58,-1.39l-3.37,-0.34l-7.65,-3.7l0.8,-2.09l2.33,-1.7l1.77,0.75l2.49,1.76l1.38,0.41l0.99,1.35l1.9,0.52l1.99,1.17l5.49,0.9Z", "name": "Nepal"}, "CI": {"path": "M407.4,259.27l0.86,0.42l0.56,0.9l1.13,0.53l1.19,-0.61l0.97,-0.08l1.42,0.54l0.6,3.24l-1.03,2.08l-0.65,2.84l1.06,2.33l-0.06,0.53l-2.54,-0.47l-1.66,0.03l-3.06,0.46l-4.11,1.6l0.32,-3.06l-1.18,-1.31l-1.32,-0.66l0.42,-0.85l-0.2,-1.4l0.5,-0.67l0.01,-1.59l0.84,-0.32l0.26,-0.5l-1.15,-3.01l0.12,-0.5l0.51,-0.25l0.66,0.31l1.93,0.02l0.67,-0.71l0.71,-0.14l0.25,0.69l0.57,0.22l1.4,-0.61Z", "name": "C\u00f4te d'Ivoire"}, "CH": {"path": "M444.62,156.35l-0.29,0.87l0.18,0.53l1.13,0.58l1.0,0.1l-0.1,0.65l-0.79,0.38l-1.72,-0.37l-0.45,0.23l-0.45,1.04l-0.75,0.06l-0.84,-0.4l-1.32,1.0l-0.96,0.12l-0.88,-0.55l-0.81,-1.3l-0.49,-0.16l-0.63,0.26l0.02,-0.65l1.71,-1.66l0.1,-0.56l0.93,0.08l0.58,-0.46l1.99,0.02l0.66,-0.61l2.19,0.79Z", "name": "Switzerland"}, "CO": {"path": "M242.07,254.93l-1.7,0.59l-0.59,1.18l-1.7,1.69l-0.38,1.93l-0.67,1.43l0.31,0.57l1.03,0.13l0.25,0.9l0.57,0.64l-0.04,2.34l1.64,1.42l3.16,-0.24l1.26,0.28l1.67,2.06l0.41,0.13l4.09,-0.39l0.45,0.22l-0.92,1.95l-0.2,1.8l0.52,1.83l0.75,1.05l-1.12,1.1l0.07,0.63l0.84,0.51l0.74,1.29l-0.39,-0.45l-0.59,-0.01l-0.71,0.74l-4.71,-0.05l-0.4,0.41l0.03,1.57l0.33,0.39l1.11,0.2l-1.68,0.4l-0.29,0.38l-0.01,1.82l1.16,1.14l0.34,1.25l-1.05,7.05l-1.04,-0.87l1.26,-1.99l-0.13,-0.56l-2.18,-1.23l-1.38,0.2l-1.14,-0.38l-1.27,0.61l-1.55,-0.26l-1.38,-2.46l-1.23,-0.75l-0.85,-1.2l-1.67,-1.19l-0.86,0.13l-2.11,-1.32l-1.01,0.31l-1.8,-0.29l-0.52,-0.91l-3.09,-1.68l0.77,-0.52l-0.1,-1.12l0.41,-0.64l1.34,-0.32l2.0,-2.88l-0.11,-0.57l-0.66,-0.43l0.39,-1.38l-0.52,-2.1l0.49,-0.83l-0.4,-2.13l-0.97,-1.35l0.17,-0.66l0.86,-0.08l0.47,-0.75l-0.46,-1.63l1.41,-0.07l1.8,-1.69l0.93,-0.24l0.3,-0.38l0.45,-2.76l1.22,-1.0l1.44,-0.04l0.45,-0.5l1.91,0.12l2.93,-1.84l1.15,-1.14l0.91,0.46l-0.25,0.45Z", "name": "Colombia"}, "CN": {"path": "M740.23,148.97l4.57,1.3l2.8,2.17l0.98,2.9l0.38,0.27l3.8,0.0l2.32,-1.28l3.29,-0.75l-0.96,2.09l-1.02,1.28l-0.85,3.4l-1.52,2.73l-2.76,-0.5l-2.4,1.13l-0.21,0.45l0.64,2.57l-0.32,3.2l-0.94,0.06l-0.37,0.89l-0.91,-1.01l-0.64,0.07l-0.92,1.57l-3.73,1.25l-0.26,0.48l0.26,1.06l-1.5,-0.08l-1.09,-0.86l-0.56,0.06l-1.67,2.06l-2.7,1.56l-2.03,1.88l-3.4,0.83l-1.93,1.4l-1.15,0.34l0.33,-0.7l-0.41,-0.89l1.79,-1.79l0.02,-0.54l-1.32,-1.56l-0.48,-0.1l-2.24,1.09l-2.83,2.06l-1.51,1.83l-2.28,0.13l-1.55,1.49l-0.04,0.5l1.32,1.97l2.0,0.58l0.31,1.35l1.98,0.84l3.0,-1.96l2.0,1.02l1.49,0.11l0.22,0.83l-3.37,0.86l-1.12,1.48l-2.5,1.52l-1.29,1.99l0.14,0.56l2.57,1.48l0.97,2.7l3.17,4.63l-0.03,1.66l-1.35,0.65l-0.2,0.51l0.6,1.47l1.4,0.91l-0.89,3.82l-1.43,0.38l-3.85,6.44l-2.27,3.11l-6.78,4.57l-2.73,0.29l-1.45,1.04l-0.62,-0.61l-0.55,-0.01l-1.36,1.25l-3.39,1.27l-2.61,0.4l-1.1,2.79l-0.81,0.09l-0.49,-1.42l0.5,-0.85l-0.25,-0.59l-3.36,-0.84l-1.3,0.4l-2.31,-0.62l-0.94,-0.84l0.33,-1.28l-0.3,-0.49l-2.19,-0.46l-1.13,-0.93l-0.47,-0.02l-2.06,1.36l-4.29,0.28l-2.76,1.05l-0.28,0.43l0.32,2.53l-0.59,-0.03l-0.19,-1.34l-0.55,-0.34l-1.68,0.7l-2.46,-1.23l0.62,-1.87l-0.26,-0.51l-1.37,-0.44l-0.54,-2.22l-0.45,-0.3l-2.13,0.35l0.24,-2.48l2.39,-2.4l0.03,-4.31l-1.19,-0.92l-0.78,-1.49l-0.41,-0.21l-1.41,0.19l-1.98,-0.3l0.46,-1.07l-1.17,-1.7l-0.55,-0.11l-1.63,1.05l-2.25,-0.57l-2.89,1.73l-2.25,1.98l-1.75,0.29l-1.17,-0.71l-3.31,-0.65l-1.48,0.79l-1.04,1.27l-0.12,-1.17l-0.54,-0.34l-1.44,0.54l-5.55,-0.86l-1.98,-1.16l-1.89,-0.54l-0.99,-1.35l-1.34,-0.37l-2.55,-1.79l-2.01,-0.84l-1.21,0.56l-5.57,-3.45l-0.53,-2.31l1.19,0.25l0.48,-0.37l0.08,-1.42l-0.98,-1.56l0.15,-2.44l-2.69,-3.32l-4.12,-1.23l-0.67,-2.0l-1.92,-1.48l-0.38,-0.7l-0.51,-3.01l-1.52,-0.66l-0.7,0.13l-0.48,-2.05l0.55,-0.51l-0.09,-0.82l2.03,-1.19l1.6,-0.54l2.56,0.38l0.42,-0.22l0.85,-1.7l3.0,-0.33l1.1,-1.26l4.05,-1.77l0.39,-0.91l-0.17,-1.44l1.45,-0.67l0.2,-0.52l-2.07,-4.9l4.51,-1.12l1.37,-0.73l1.89,-5.51l4.98,0.86l1.51,-1.7l0.11,-2.87l1.99,-0.38l1.83,-2.06l0.49,-0.13l0.68,2.08l2.23,1.77l3.44,1.16l1.55,2.29l-0.92,3.49l0.96,1.67l6.54,1.13l2.95,1.87l1.47,0.35l1.06,2.62l1.53,1.91l3.05,0.08l5.14,0.67l3.37,-0.41l2.36,0.43l3.65,1.8l3.06,0.04l1.45,0.88l2.87,-1.59l3.95,-1.02l3.83,-0.14l3.06,-1.14l1.77,-1.6l1.72,-1.01l0.17,-0.49l-1.1,-2.05l1.02,-1.54l4.02,0.8l2.45,-1.61l3.76,-1.19l1.96,-2.13l1.63,-0.83l3.51,-0.4l1.92,0.34l0.46,-0.3l0.17,-1.5l-2.27,-2.22l-2.11,-1.09l-2.18,1.11l-2.32,-0.47l-1.29,0.32l-0.4,-0.82l2.73,-5.16l3.02,1.06l3.53,-2.06l0.18,-1.68l2.16,-3.35l1.49,-1.35l-0.03,-1.85l-1.07,-0.85l1.54,-1.26l2.98,-0.59l3.23,-0.09l3.64,0.99l2.04,1.16l3.29,6.71l0.92,3.19ZM696.92,237.31l-1.87,1.08l-1.63,-0.64l-0.06,-1.79l1.03,-0.98l2.58,-0.69l1.16,0.05l0.3,0.54l-0.98,1.06l-0.53,1.37Z", "name": "China"}, "CM": {"path": "M457.92,257.49l1.05,1.91l-1.4,0.16l-1.05,-0.23l-0.45,0.22l-0.54,1.19l0.08,0.45l1.48,1.47l1.05,0.45l1.01,2.46l-1.52,2.99l-0.68,0.68l-0.13,3.69l2.38,3.84l1.09,0.8l0.24,2.48l-3.67,-1.14l-11.27,-0.13l0.23,-1.79l-0.98,-1.66l-1.19,-0.54l-0.44,-0.97l-0.6,-0.42l1.71,-4.27l0.75,-0.13l1.38,-1.36l0.65,-0.03l1.71,0.99l1.93,-1.12l1.14,-3.18l1.38,-1.17l2.0,-5.14l2.17,-2.13l0.3,-1.64l-0.86,-0.88l0.03,-0.33l0.94,1.28l0.07,3.22Z", "name": "Cameroon"}, "CL": {"path": "M246.5,429.18l-3.14,1.83l-0.57,3.16l-0.64,0.05l-2.68,-1.06l-2.82,-2.33l-3.04,-1.89l-0.69,-1.85l0.63,-2.14l-1.21,-2.11l-0.31,-5.37l1.01,-2.91l2.57,-2.38l-0.18,-0.68l-3.16,-0.77l2.05,-2.47l0.77,-4.65l2.32,0.9l0.54,-0.29l1.31,-6.31l-0.22,-0.44l-1.68,-0.8l-0.56,0.28l-0.7,3.36l-0.81,-0.22l1.56,-9.41l1.15,-2.24l-0.71,-2.82l-0.18,-2.84l1.01,-0.33l3.26,-9.14l1.07,-4.22l-0.56,-4.21l0.74,-2.34l-0.29,-3.27l1.46,-3.34l2.04,-16.59l-0.66,-7.76l1.03,-0.53l0.54,-0.9l0.79,1.14l0.32,1.78l1.25,1.16l-0.69,2.55l1.33,2.9l0.97,3.59l0.46,0.29l1.5,-0.3l0.11,0.23l-0.76,2.44l-2.57,1.23l-0.23,0.37l0.08,4.33l-0.46,0.77l0.56,1.21l-1.58,1.51l-1.68,2.62l-0.89,2.47l0.2,2.7l-1.48,2.73l1.12,5.09l0.64,0.61l-0.01,2.29l-1.38,2.68l0.01,2.4l-1.89,2.04l0.02,2.75l0.69,2.57l-1.43,1.13l-1.26,5.68l0.39,3.51l-0.97,0.89l0.58,3.5l1.02,1.14l-0.65,1.02l0.15,0.57l1.0,0.53l0.16,0.69l-1.03,0.85l0.26,1.75l-0.89,4.03l-1.31,2.66l0.24,1.75l-0.71,1.83l-1.99,1.7l0.3,3.67l0.88,1.19l1.58,0.01l0.01,2.21l1.04,1.95l5.98,0.63ZM248.69,430.79l0.0,7.33l0.4,0.4l3.52,0.05l-0.44,0.75l-1.94,0.98l-2.49,-0.37l-1.88,-1.06l-2.55,-0.49l-5.59,-3.71l-2.38,-2.63l4.1,2.48l3.32,1.23l0.45,-0.12l1.29,-1.57l0.83,-2.32l2.05,-1.24l1.31,0.29Z", "name": "Chile"}, "CA": {"path": "M280.06,145.6l-1.67,2.88l0.07,0.49l0.5,0.04l1.46,-0.98l1.0,0.42l-0.56,0.72l0.17,0.62l2.22,0.89l1.35,-0.71l1.95,0.78l-0.66,2.01l0.5,0.51l1.32,-0.42l0.98,3.17l-0.91,2.41l-0.8,0.08l-1.23,-0.45l0.47,-2.25l-0.89,-0.83l-0.48,0.06l-2.78,2.63l-0.34,-0.02l1.02,-0.85l-0.14,-0.69l-2.4,-0.77l-7.4,0.08l-0.17,-0.41l1.3,-0.94l0.02,-0.64l-0.73,-0.58l1.85,-1.74l2.57,-5.16l1.47,-1.79l1.99,-1.05l0.46,0.06l-1.53,2.45ZM68.32,74.16l4.13,0.95l4.02,2.14l2.61,0.4l2.47,-1.89l2.88,-1.31l3.85,0.48l3.71,-1.94l3.82,-1.04l1.56,1.68l0.49,0.08l1.87,-1.04l0.65,-1.98l1.24,0.35l4.16,3.94l0.54,0.01l2.75,-2.49l0.26,2.59l0.49,0.35l3.08,-0.73l1.04,-1.27l2.73,0.23l3.83,1.86l5.86,1.61l3.47,0.75l2.44,-0.26l2.73,1.78l-2.98,1.81l-0.19,0.41l0.31,0.32l4.53,0.92l6.87,-0.5l2.0,-0.69l2.49,2.39l0.53,0.02l2.72,-2.16l-0.02,-0.64l-2.16,-1.54l1.15,-1.06l4.83,-0.61l1.84,0.95l2.48,2.31l3.01,-0.23l4.55,1.92l3.85,-0.67l3.61,0.1l0.41,-0.44l-0.25,-2.36l1.79,-0.61l3.49,1.32l-0.01,3.77l0.31,0.39l0.45,-0.22l1.48,-3.16l1.74,0.1l0.41,-0.3l1.13,-4.37l-2.78,-3.11l-2.8,-1.74l0.19,-4.64l2.71,-3.07l2.98,0.67l2.41,1.95l3.19,4.8l-1.99,1.97l0.21,0.68l4.33,0.84l-0.01,4.15l0.25,0.37l0.44,-0.09l3.07,-3.15l2.54,2.39l-0.61,3.33l2.42,2.88l0.61,0.0l2.61,-3.08l1.88,-3.82l0.17,-4.58l6.72,0.94l3.13,2.04l0.13,1.82l-1.76,2.19l-0.01,0.49l1.66,2.16l-0.26,1.71l-4.68,2.8l-3.28,0.61l-2.47,-1.2l-0.55,0.23l-0.73,2.04l-2.38,3.43l-0.74,1.77l-2.74,2.57l-3.44,0.25l-2.21,1.78l-0.28,2.53l-2.82,0.55l-3.12,3.22l-2.72,4.31l-1.03,3.17l-0.14,4.31l0.33,0.41l3.44,0.57l2.24,5.95l0.45,0.23l3.4,-0.69l4.52,1.51l2.43,1.31l1.91,1.73l3.1,0.96l2.62,1.46l6.6,0.54l-0.35,2.74l0.81,3.53l1.81,3.78l3.83,3.3l0.45,0.04l2.1,-1.28l1.37,-3.69l-1.31,-5.38l-1.45,-1.58l3.57,-1.47l2.84,-2.46l1.52,-2.8l-0.25,-2.55l-1.7,-3.07l-2.85,-2.61l2.8,-3.95l-1.08,-3.37l-0.79,-5.67l1.36,-0.7l6.76,1.41l2.12,-0.96l5.12,3.36l1.05,1.61l4.08,0.26l-0.06,2.87l0.83,4.7l0.3,0.32l2.16,0.54l1.73,2.06l0.5,0.09l3.63,-2.03l2.52,-4.19l1.26,-1.32l7.6,11.72l-0.92,2.04l0.16,0.51l3.3,1.97l2.22,1.98l4.1,0.98l1.43,0.99l0.95,2.79l2.1,0.68l0.84,1.08l0.17,3.45l-3.37,2.26l-4.22,1.24l-3.06,2.63l-4.06,0.51l-5.35,-0.69l-6.39,0.2l-2.3,2.41l-3.26,1.51l-6.47,7.15l-0.06,0.48l0.44,0.19l2.13,-0.52l4.17,-4.24l5.12,-2.62l3.52,-0.3l1.69,1.21l-2.12,2.21l0.81,3.47l1.02,2.61l3.47,1.6l4.14,-0.45l2.15,-2.8l0.26,1.48l1.14,0.8l-2.56,1.69l-5.5,1.82l-2.54,1.27l-2.74,2.15l-1.4,-0.16l-0.07,-2.01l4.14,-2.44l0.18,-0.45l-0.39,-0.29l-6.63,0.45l-1.39,-1.49l-0.14,-4.43l-1.11,-0.91l-1.82,0.39l-0.66,-0.66l-0.6,0.03l-1.91,2.39l-0.82,2.52l-0.8,1.27l-1.67,0.56l-0.46,0.76l-8.31,0.07l-1.21,0.62l-2.35,1.97l-0.71,-0.14l-1.37,0.96l-1.12,-0.48l-4.74,1.26l-0.9,1.17l0.21,0.62l1.73,0.3l-1.81,0.31l-1.85,0.81l-2.11,-0.13l-2.95,1.78l-0.69,-0.09l1.39,-2.1l1.73,-1.21l0.1,-2.29l1.16,-1.99l0.49,0.53l2.03,0.42l1.2,-1.16l0.02,-0.47l-2.66,-3.51l-2.28,-0.61l-5.64,-0.71l-0.4,-0.57l-0.79,0.13l0.2,-0.41l-0.22,-0.55l-0.68,-0.26l0.19,-1.26l-0.78,-0.73l0.31,-0.64l-0.29,-0.57l-2.6,-0.44l-0.75,-1.63l-0.94,-0.66l-4.31,-0.65l-1.13,1.19l-1.48,0.59l-0.85,1.06l-2.83,-0.76l-2.09,0.39l-2.39,-0.97l-4.24,-0.7l-0.57,-0.4l-0.41,-1.63l-0.4,-0.3l-0.85,0.02l-0.39,0.4l-0.01,0.85l-69.13,-0.01l-6.51,-4.52l-4.5,-1.38l-1.26,-2.66l0.33,-1.93l-0.23,-0.43l-3.01,-1.35l-0.55,-2.77l-2.89,-2.38l-0.04,-1.45l1.39,-1.83l-0.28,-2.55l-4.16,-2.2l-4.07,-6.6l-4.02,-3.22l-1.3,-1.88l-0.5,-0.13l-2.51,1.21l-2.23,1.87l-3.85,-3.88l-2.44,-1.04l-2.22,-0.13l0.03,-37.49ZM260.37,148.65l3.04,0.76l2.26,1.2l-3.78,-0.95l-1.53,-1.01ZM249.4,3.81l6.68,0.49l5.32,0.79l4.26,1.57l-0.07,1.1l-5.85,2.53l-6.02,1.21l-2.39,1.39l-0.18,0.45l0.39,0.29l4.01,-0.02l-4.65,2.82l-4.2,1.74l-4.19,4.59l-5.03,0.92l-1.67,1.15l-7.47,0.59l-0.37,0.37l0.32,0.42l2.41,0.49l-0.81,0.47l-0.12,0.59l1.83,2.41l-2.02,1.59l-3.81,1.51l-1.32,2.16l-3.38,1.53l-0.22,0.48l0.35,1.19l0.4,0.29l3.88,-0.18l0.03,0.61l-6.33,2.95l-6.41,-1.4l-7.43,0.79l-3.72,-0.62l-4.4,-0.25l-0.23,-1.83l4.29,-1.11l0.28,-0.51l-1.1,-3.45l1.0,-0.25l6.58,2.28l0.47,-0.16l-0.05,-0.49l-3.41,-3.45l-3.58,-0.98l1.48,-1.55l4.34,-1.29l0.97,-2.19l-0.16,-0.48l-3.42,-2.13l-0.81,-2.26l6.2,0.22l2.24,0.58l3.91,-2.1l0.2,-0.43l-0.35,-0.32l-5.64,-0.67l-8.73,0.36l-4.26,-1.9l-2.12,-2.4l-2.78,-1.66l-0.41,-1.52l3.31,-1.03l2.93,-0.2l4.91,-0.99l3.7,-2.27l2.87,0.3l2.62,1.67l0.56,-0.14l1.82,-3.2l3.13,-0.94l4.44,-0.69l7.53,-0.26l1.48,0.67l7.19,-1.06l10.8,0.79ZM203.85,57.54l0.01,0.42l1.97,2.97l0.68,-0.02l2.24,-3.72l5.95,-1.86l4.01,4.64l-0.35,2.91l0.5,0.43l4.95,-1.36l2.32,-1.8l5.31,2.28l3.27,2.11l0.3,1.84l0.48,0.33l4.42,-0.99l2.64,2.87l5.97,1.77l2.06,1.72l2.11,3.71l-4.19,1.86l-0.01,0.73l5.9,2.83l3.94,0.94l3.78,3.95l3.46,0.25l-0.63,2.37l-4.11,4.47l-2.76,-1.56l-3.9,-3.94l-3.59,0.41l-0.33,0.34l-0.19,2.72l2.63,2.38l3.42,1.89l0.94,0.97l1.55,3.75l-0.7,2.29l-2.74,-0.92l-6.25,-3.15l-0.51,0.13l0.05,0.52l6.07,5.69l0.18,0.59l-6.09,-1.39l-5.31,-2.24l-2.63,-1.66l0.6,-0.77l-0.12,-0.6l-7.39,-4.01l-0.59,0.37l0.03,0.79l-6.73,0.6l-1.69,-1.1l1.36,-2.46l4.51,-0.07l5.15,-0.52l0.31,-0.6l-0.74,-1.3l0.78,-1.84l3.21,-4.05l-0.67,-2.35l-1.11,-1.6l-3.84,-2.1l-4.35,-1.28l0.91,-0.63l0.06,-0.61l-2.65,-2.75l-2.34,-0.36l-1.89,-1.46l-0.53,0.03l-1.24,1.23l-4.36,0.55l-9.04,-0.99l-9.26,-1.98l-1.6,-1.22l2.22,-1.77l0.13,-0.44l-0.38,-0.27l-3.22,-0.02l-0.72,-4.25l1.83,-4.04l2.42,-1.85l5.5,-1.1l-1.39,2.35ZM261.19,159.33l2.07,0.61l1.44,-0.04l-1.15,0.63l-2.94,-1.23l-0.4,-0.68l0.36,-0.37l0.61,1.07ZM230.83,84.39l-2.37,0.18l-0.49,-1.63l0.93,-2.09l1.94,-0.51l1.62,0.99l0.02,1.52l-1.66,1.54ZM229.43,58.25l0.11,0.65l-4.87,-0.21l-2.72,0.62l-3.1,-2.57l0.08,-1.26l0.86,-0.23l5.57,0.51l4.08,2.5ZM222.0,105.02l-0.72,1.49l-0.63,-0.19l-0.48,-0.84l0.81,-0.99l0.65,0.05l0.37,0.46ZM183.74,38.32l2.9,1.7l4.79,-0.01l1.84,1.46l-0.49,1.68l0.23,0.48l2.82,1.14l1.76,1.26l7.01,0.65l4.1,-1.1l5.03,-0.43l3.93,0.35l2.48,1.77l0.46,1.7l-1.3,1.1l-3.56,1.01l-3.23,-0.59l-7.17,0.76l-5.09,0.09l-3.99,-0.6l-6.42,-1.54l-0.79,-2.51l-0.3,-2.49l-2.64,-2.5l-5.32,-0.72l-2.52,-1.4l0.68,-1.57l4.78,0.31ZM207.38,91.35l0.4,1.56l0.56,0.26l1.06,-0.52l1.32,0.96l5.42,2.57l0.2,1.68l0.46,0.35l1.68,-0.28l1.15,0.85l-1.55,0.87l-3.61,-0.88l-1.32,-1.69l-0.57,-0.06l-2.45,2.1l-3.12,1.79l-0.7,-1.87l-0.42,-0.26l-2.16,0.24l1.39,-1.39l0.32,-3.14l0.76,-3.35l1.18,0.22ZM215.49,102.6l-2.67,1.95l-1.4,-0.07l-0.3,-0.58l1.53,-1.48l2.84,0.18ZM202.7,24.12l2.53,1.59l-2.87,1.4l-4.53,4.05l-4.25,0.38l-5.03,-0.68l-2.45,-2.04l0.03,-1.62l1.82,-1.37l0.14,-0.45l-0.38,-0.27l-4.45,0.04l-2.59,-1.76l-1.41,-2.29l1.57,-2.32l1.62,-1.66l2.44,-0.39l0.25,-0.65l-0.6,-0.74l4.86,-0.25l3.24,3.11l8.16,2.3l1.9,3.61ZM187.47,59.2l-2.76,3.49l-2.38,-0.15l-1.44,-3.84l0.04,-2.2l1.19,-1.88l2.3,-1.23l5.07,0.17l4.11,1.02l-3.24,3.72l-2.88,0.89ZM186.07,48.79l-1.08,1.53l-3.34,-0.34l-2.56,-1.1l1.03,-1.75l3.25,-1.23l1.95,1.58l0.75,1.3ZM185.71,35.32l-5.3,-0.2l-0.32,-0.71l4.31,0.07l1.3,0.84ZM180.68,32.48l-3.34,1.0l-1.79,-1.1l-0.98,-1.87l-0.15,-1.73l4.1,0.53l2.67,1.7l-0.51,1.47ZM180.9,76.31l-1.1,1.08l-3.13,-1.23l-2.12,0.43l-2.71,-1.57l1.72,-1.09l1.55,-1.72l3.81,1.9l1.98,2.2ZM169.74,54.87l2.96,0.97l4.17,-0.57l0.41,0.88l-2.14,2.11l0.09,0.64l3.55,1.92l-0.4,3.72l-3.79,1.65l-2.17,-0.35l-1.72,-1.74l-6.02,-3.5l0.03,-0.85l4.68,0.54l0.4,-0.21l-0.05,-0.45l-2.48,-2.81l2.46,-1.95ZM174.45,40.74l1.37,1.73l0.07,2.44l-1.05,3.45l-3.79,0.47l-2.32,-0.69l0.05,-2.64l-0.44,-0.41l-3.68,0.35l-0.12,-3.1l2.45,0.1l3.67,-1.73l3.41,0.29l0.37,-0.26ZM170.05,31.55l0.67,1.56l-3.33,-0.49l-4.22,-1.77l-4.35,-0.16l1.4,-0.94l-0.06,-0.7l-2.81,-1.23l-0.12,-1.39l4.39,0.68l6.62,1.98l1.81,2.47ZM134.5,58.13l-1.02,1.82l0.45,0.58l5.4,-1.39l3.33,2.29l0.49,-0.03l2.6,-2.23l1.94,1.32l2.0,4.5l0.7,0.06l1.3,-2.29l-1.63,-4.46l1.69,-0.54l2.31,0.71l2.65,1.81l2.49,7.92l8.48,4.27l-0.19,1.35l-3.79,0.33l-0.26,0.67l1.4,1.49l-0.58,1.1l-4.23,-0.64l-4.43,-1.19l-3.0,0.28l-4.66,1.47l-10.52,1.04l-1.43,-2.02l-3.42,-1.2l-2.21,0.43l-2.51,-2.86l4.84,-1.05l3.6,0.19l3.27,-0.78l0.31,-0.39l-0.31,-0.39l-4.84,-1.06l-8.79,0.27l-0.85,-1.07l5.26,-1.66l0.27,-0.45l-0.4,-0.34l-3.8,0.06l-3.81,-1.06l1.81,-3.01l1.66,-1.79l6.48,-2.81l1.97,0.71ZM158.7,56.61l-1.7,2.44l-3.2,-2.75l0.37,-0.3l3.11,-0.18l1.42,0.79ZM149.61,42.73l1.01,1.89l0.5,0.18l2.14,-0.82l2.23,0.19l0.36,2.04l-1.33,2.09l-8.28,0.76l-6.35,2.15l-3.41,0.1l-0.19,-0.96l4.9,-2.08l0.23,-0.46l-0.41,-0.31l-11.25,0.59l-2.89,-0.74l3.04,-4.44l2.14,-1.32l6.81,1.69l4.58,3.06l4.37,0.39l0.36,-0.63l-3.36,-4.6l1.85,-1.53l2.18,0.51l0.77,2.26ZM144.76,34.41l-4.36,1.44l-3.0,-1.4l1.46,-1.24l3.47,-0.52l2.96,0.71l-0.52,1.01ZM145.13,29.83l-1.9,0.66l-3.67,-0.0l2.27,-1.61l3.3,0.95ZM118.92,65.79l-6.03,2.02l-1.33,-1.9l-5.38,-2.28l2.59,-5.05l2.16,-3.14l-0.02,-0.48l-1.97,-2.41l7.64,-0.7l3.6,1.02l6.3,0.27l4.42,2.95l-2.53,0.98l-6.24,3.43l-3.1,3.28l-0.11,2.01ZM129.54,35.53l-0.28,3.37l-1.72,1.62l-2.33,0.28l-4.61,2.19l-3.86,0.76l-2.64,-0.87l3.72,-3.4l5.01,-3.34l3.72,0.07l3.0,-0.67ZM111.09,152.69l-0.67,0.24l-3.85,-1.37l-0.83,-1.17l-2.12,-1.07l-0.66,-1.02l-2.4,-0.55l-0.74,-1.71l6.02,1.45l2.0,2.55l2.52,1.39l0.73,1.27ZM87.8,134.64l0.89,0.29l1.86,-0.21l-0.65,3.34l1.69,2.33l-1.31,-1.33l-0.99,-1.62l-1.17,-0.98l-0.33,-1.82Z", "name": "Canada"}, "CG": {"path": "M466.72,276.48l-0.1,1.03l-1.25,2.97l-0.19,3.62l-0.46,1.78l-0.23,0.63l-1.61,1.19l-1.21,1.39l-1.09,2.43l0.04,2.09l-3.25,3.24l-0.5,-0.24l-0.5,-0.83l-1.36,-0.02l-0.98,0.89l-1.68,-0.99l-1.54,1.24l-1.52,-1.96l1.57,-1.14l0.11,-0.52l-0.77,-1.35l2.1,-0.66l0.39,-0.73l1.05,0.82l2.21,0.11l1.12,-1.37l0.37,-1.81l-0.27,-2.09l-1.13,-1.5l1.0,-2.69l-0.13,-0.45l-0.92,-0.58l-1.6,0.17l-0.51,-0.94l0.1,-0.61l2.75,0.09l3.97,1.24l0.51,-0.33l0.17,-1.28l1.24,-2.21l1.28,-1.14l2.76,0.49Z", "name": "Congo"}, "CF": {"path": "M461.16,278.2l-0.26,-1.19l-1.09,-0.77l-0.84,-1.17l-0.29,-1.0l-1.04,-1.15l0.08,-3.43l0.58,-0.49l1.16,-2.35l1.85,-0.17l0.61,-0.62l0.97,0.58l3.15,-0.96l2.48,-1.92l0.02,-0.96l2.81,0.02l2.36,-1.17l1.93,-2.85l1.16,-0.93l1.11,-0.3l0.27,0.86l1.34,1.47l-0.39,2.01l0.3,1.01l4.01,2.75l0.17,0.93l2.63,2.31l0.6,1.44l2.08,1.4l-3.84,-0.21l-1.94,0.88l-1.23,-0.49l-2.67,1.2l-1.29,-0.18l-0.51,0.36l-0.6,1.22l-3.35,-0.65l-1.57,-0.91l-2.42,-0.83l-1.45,0.91l-0.97,1.27l-0.26,1.56l-3.22,-0.43l-1.49,1.33l-0.94,1.62Z", "name": "Central African Rep."}, "CD": {"path": "M487.01,272.38l2.34,-0.14l1.35,1.84l1.34,0.45l0.86,-0.39l1.21,0.12l1.07,-0.41l0.54,0.89l2.04,1.54l-0.14,2.72l0.7,0.54l-1.38,1.13l-1.53,2.54l-0.17,2.05l-0.59,1.08l-0.02,1.72l-0.72,0.84l-0.66,3.01l0.63,1.32l-0.44,4.26l0.64,1.47l-0.37,1.22l0.86,1.8l1.53,1.41l0.3,1.26l0.44,0.5l-4.08,0.75l-0.92,1.81l0.51,1.34l-0.74,5.43l0.17,0.38l2.45,1.46l0.54,-0.1l0.12,1.62l-1.28,-0.01l-1.85,-2.35l-1.94,-0.45l-0.48,-1.13l-0.55,-0.2l-1.41,0.74l-1.71,-0.3l-1.01,-1.18l-2.49,-0.19l-0.44,-0.77l-1.98,-0.21l-2.88,0.36l0.11,-2.41l-0.85,-1.13l-0.16,-1.36l0.32,-1.73l-0.46,-0.89l-0.04,-1.49l-0.4,-0.39l-2.53,0.02l0.1,-0.41l-0.39,-0.49l-1.28,0.01l-0.43,0.45l-1.62,0.32l-0.83,1.79l-1.09,-0.28l-2.4,0.52l-1.37,-1.91l-1.3,-3.3l-0.38,-0.27l-7.39,-0.03l-2.46,0.42l0.5,-0.45l0.37,-1.47l0.66,-0.38l0.92,0.08l0.73,-0.82l0.87,0.02l0.31,0.68l1.4,0.36l3.59,-3.63l0.01,-2.23l1.02,-2.29l2.69,-2.39l0.43,-0.99l0.49,-1.96l0.17,-3.51l1.25,-2.95l0.36,-3.14l0.86,-1.13l1.1,-0.66l3.57,1.73l3.65,0.73l0.46,-0.21l0.8,-1.46l1.24,0.19l2.61,-1.17l0.81,0.44l1.04,-0.03l0.59,-0.66l0.7,-0.16l1.81,0.25Z", "name": "Dem. Rep. Congo"}, "CZ": {"path": "M458.46,144.88l1.22,1.01l1.47,0.23l0.13,0.93l1.36,0.68l0.54,-0.2l0.24,-0.55l1.15,0.25l0.53,1.09l1.68,0.18l0.6,0.84l-1.04,0.73l-0.96,1.28l-1.6,0.17l-0.55,0.56l-1.04,-0.46l-1.05,0.15l-2.12,-0.96l-1.05,0.34l-1.2,1.12l-1.56,-0.87l-2.57,-2.1l-0.53,-1.88l4.7,-2.52l0.71,0.26l0.9,-0.28Z", "name": "Czech Rep."}, "CY": {"path": "M504.36,193.47l0.43,0.28l-1.28,0.57l-0.92,-0.28l-0.24,-0.46l2.01,-0.13Z", "name": "Cyprus"}, "CR": {"path": "M211.34,258.05l0.48,0.99l1.6,1.6l-0.54,0.45l0.29,1.42l-0.25,1.19l-1.09,-0.59l-0.05,-1.25l-2.46,-1.42l-0.28,-0.77l-0.66,-0.45l-0.45,-0.0l-0.11,1.04l-1.32,-0.95l0.31,-1.3l-0.36,-0.6l0.31,-0.27l1.42,0.58l1.29,-0.14l0.56,0.56l0.74,0.17l0.55,-0.27Z", "name": "Costa Rica"}, "CU": {"path": "M221.21,227.25l1.27,1.02l2.19,-0.28l4.43,3.33l2.08,0.43l-0.1,0.38l0.36,0.5l1.75,0.1l1.48,0.84l-3.11,0.51l-4.15,-0.03l0.77,-0.67l-0.04,-0.64l-1.2,-0.74l-1.49,-0.16l-0.7,-0.61l-0.56,-1.4l-0.4,-0.25l-1.34,0.1l-2.2,-0.66l-0.88,-0.58l-3.18,-0.4l-0.27,-0.16l0.58,-0.74l-0.36,-0.29l-2.72,-0.05l-1.7,1.29l-0.91,0.03l-0.61,0.69l-1.01,0.22l1.11,-1.29l1.01,-0.52l3.69,-1.01l3.98,0.21l2.21,0.84Z", "name": "Cuba"}, "SZ": {"path": "M500.35,351.36l0.5,2.04l-0.38,0.89l-1.05,0.21l-1.23,-1.2l-0.02,-0.64l0.83,-1.57l1.34,0.27Z", "name": "Swaziland"}, "SY": {"path": "M511.0,199.79l0.05,-1.33l0.54,-1.36l1.28,-0.99l0.13,-0.45l-0.41,-1.11l-1.14,-0.36l-0.19,-1.74l0.52,-1.0l1.29,-1.21l0.2,-1.18l0.59,0.23l2.62,-0.76l1.36,0.52l2.06,-0.01l2.95,-1.08l3.25,-0.26l-0.67,0.94l-1.28,0.66l-0.21,0.4l0.23,2.01l-0.88,3.19l-10.15,5.73l-2.15,-0.85Z", "name": "Syria"}, "KG": {"path": "M621.35,172.32l-3.87,1.69l-0.96,1.18l-3.04,0.34l-1.13,1.86l-2.36,-0.35l-1.99,0.63l-2.39,1.4l0.06,0.95l-0.4,0.37l-4.52,0.43l-3.02,-0.93l-2.37,0.17l0.11,-0.79l2.32,0.42l1.13,-0.88l1.99,0.2l3.21,-2.14l-0.03,-0.69l-2.97,-1.57l-1.94,0.65l-1.22,-0.74l1.71,-1.58l-0.12,-0.67l-0.36,-0.15l0.32,-0.77l1.36,-0.35l4.02,1.02l0.49,-0.3l0.35,-1.59l1.09,-0.48l3.42,1.22l1.11,-0.31l7.64,0.39l1.16,1.0l1.23,0.39Z", "name": "Kyrgyzstan"}, "KE": {"path": "M506.26,284.69l1.87,-2.56l0.93,-2.15l-1.38,-4.08l-1.06,-1.6l2.82,-2.75l0.79,0.26l0.12,1.41l0.86,0.83l1.9,0.11l3.28,2.13l3.57,0.44l1.05,-1.12l1.96,-0.9l0.82,0.68l1.16,0.09l-1.78,2.45l0.03,9.12l1.3,1.94l-1.37,0.78l-0.67,1.03l-1.08,0.46l-0.34,1.67l-0.81,1.07l-0.45,1.55l-0.68,0.56l-3.2,-2.23l-0.35,-1.58l-8.86,-4.98l0.14,-1.6l-0.57,-1.04Z", "name": "Kenya"}, "SS": {"path": "M481.71,263.34l1.07,-0.72l1.2,-3.18l1.36,-0.26l1.61,1.99l0.87,0.34l1.1,-0.41l1.5,0.07l0.57,0.53l2.49,0.0l0.44,-0.63l1.07,-0.4l0.45,-0.84l0.59,-0.33l1.9,1.33l1.6,-0.2l2.83,-3.33l-0.32,-2.21l1.59,-0.52l-0.24,1.6l0.3,1.83l1.35,1.18l0.2,1.87l0.35,0.41l0.02,1.53l-0.23,0.47l-1.42,0.25l-0.85,1.44l0.3,0.6l1.4,0.16l1.11,1.08l0.59,1.13l1.03,0.53l1.28,2.36l-4.41,3.98l-1.74,0.01l-1.89,0.55l-1.47,-0.52l-1.15,0.57l-2.96,-2.62l-1.3,0.49l-1.06,-0.15l-0.79,0.39l-0.82,-0.22l-1.8,-2.7l-1.91,-1.1l-0.66,-1.5l-2.62,-2.32l-0.18,-0.94l-2.37,-1.6Z", "name": "S. Sudan"}, "SR": {"path": "M283.12,270.19l2.1,0.53l-1.08,1.95l0.2,1.72l0.93,1.49l-0.59,2.03l-0.43,0.71l-1.12,-0.42l-1.32,0.22l-0.93,-0.2l-0.46,0.26l-0.25,0.73l0.33,0.7l-0.89,-0.13l-1.39,-1.97l-0.31,-1.34l-0.97,-0.31l-0.89,-1.47l0.35,-1.61l1.45,-0.82l0.33,-1.87l2.61,0.44l0.57,-0.47l1.75,-0.16Z", "name": "Suriname"}, "KH": {"path": "M689.52,249.39l0.49,1.45l-0.28,2.74l-4.0,1.86l-0.16,0.6l0.68,0.95l-2.06,0.17l-2.05,0.97l-1.82,-0.32l-2.12,-3.7l-0.55,-2.85l1.4,-1.85l3.02,-0.45l2.23,0.35l2.01,0.98l0.51,-0.14l0.95,-1.48l1.74,0.74Z", "name": "Cambodia"}, "SV": {"path": "M195.8,250.13l1.4,-1.19l2.24,1.45l0.98,-0.27l0.44,0.2l-0.27,1.05l-1.14,-0.03l-3.64,-1.21Z", "name": "El Salvador"}, "SK": {"path": "M476.82,151.17l-1.14,1.9l-2.73,-0.92l-0.82,0.2l-0.74,0.8l-3.46,0.73l-0.47,0.69l-1.76,0.33l-1.88,-1.0l-0.18,-0.81l0.38,-0.75l1.87,-0.32l1.74,-1.89l0.83,0.16l0.79,-0.34l1.51,1.04l1.34,-0.63l1.25,0.3l1.65,-0.42l1.81,0.95Z", "name": "Slovakia"}, "KR": {"path": "M737.51,185.84l0.98,-0.1l0.87,-1.17l2.69,-0.32l0.33,-0.29l1.76,2.79l0.58,1.76l0.02,3.12l-0.8,1.32l-2.21,0.55l-1.93,1.13l-1.8,0.19l-0.2,-1.1l0.43,-2.28l-0.95,-2.56l1.43,-0.37l0.23,-0.62l-1.43,-2.06Z", "name": "Korea"}, "SI": {"path": "M456.18,162.07l-0.51,-1.32l0.18,-1.05l1.69,0.2l1.42,-0.71l2.09,-0.07l0.62,-0.51l0.21,0.47l-1.61,0.67l-0.44,1.34l-0.66,0.24l-0.26,0.82l-1.22,-0.49l-0.84,0.46l-0.69,-0.04Z", "name": "Slovenia"}, "KP": {"path": "M736.77,185.16l-0.92,-0.42l-0.88,0.62l-1.21,-0.88l0.96,-1.15l0.59,-2.59l-0.46,-0.74l-2.09,-0.77l1.64,-1.52l2.72,-1.58l1.58,-1.91l1.11,0.78l2.17,0.11l0.41,-0.5l-0.3,-1.22l3.52,-1.18l0.94,-1.4l0.98,1.08l-2.19,2.18l0.01,2.14l-1.06,0.54l-1.41,1.4l-1.7,0.52l-1.25,1.09l-0.14,1.98l0.94,0.45l1.15,1.04l-0.13,0.26l-2.6,0.29l-1.13,1.29l-1.22,0.08Z", "name": "Dem. Rep. Korea"}, "SO": {"path": "M525.13,288.48l-1.13,-1.57l-0.03,-8.86l2.66,-3.38l1.67,-0.13l2.13,-1.69l3.41,-0.23l7.08,-7.55l2.91,-3.69l0.08,-4.82l2.98,-0.67l1.24,-0.86l0.45,-0.0l-0.2,3.0l-1.21,3.62l-2.73,5.97l-2.13,3.65l-5.03,6.16l-8.56,6.4l-2.78,3.08l-0.8,1.56Z", "name": "Somalia"}, "SN": {"path": "M390.09,248.21l0.12,1.55l0.49,1.46l0.96,0.82l0.05,1.28l-1.26,-0.19l-0.75,0.33l-1.84,-0.61l-5.84,-0.13l-2.54,0.51l-0.22,-1.03l1.77,0.04l2.01,-0.91l1.03,0.48l1.09,0.04l1.29,-0.62l0.14,-0.58l-0.51,-0.74l-1.81,0.25l-1.13,-0.63l-0.79,0.04l-0.72,0.61l-2.31,0.06l-0.92,-1.77l-0.81,-0.64l0.64,-0.35l2.46,-3.74l1.04,0.19l1.38,-0.56l1.19,-0.02l2.72,1.37l3.03,3.48Z", "name": "Senegal"}, "SL": {"path": "M394.46,264.11l-1.73,1.98l-0.58,1.33l-2.07,-1.06l-1.22,-1.26l-0.65,-2.39l1.16,-0.96l0.67,-1.17l1.21,-0.52l1.66,0.0l1.03,1.64l0.52,2.41Z", "name": "Sierra Leone"}, "SB": {"path": "M826.69,311.6l-0.61,0.09l-0.2,-0.33l0.37,0.15l0.44,0.09ZM824.18,307.38l-0.26,-0.3l-0.31,-0.91l0.03,0.0l0.54,1.21ZM823.04,309.33l-1.66,-0.22l-0.2,-0.52l1.16,0.28l0.69,0.46ZM819.28,304.68l1.14,0.65l0.02,0.03l-0.81,-0.44l-0.35,-0.23Z", "name": "Solomon Is."}, "SA": {"path": "M537.53,210.34l2.0,0.24l0.9,1.32l1.49,-0.06l0.87,2.08l1.29,0.76l0.51,0.99l1.56,1.03l-0.1,1.9l0.32,0.9l1.58,2.47l0.76,0.53l0.7,-0.04l1.68,4.23l7.53,1.33l0.51,-0.29l0.77,1.25l-1.55,4.87l-7.29,2.52l-7.3,1.03l-2.34,1.17l-1.88,2.74l-0.76,0.28l-0.82,-0.78l-0.91,0.12l-2.88,-0.51l-3.51,0.25l-0.86,-0.56l-0.57,0.15l-0.66,1.27l0.16,1.11l-0.43,0.32l-0.93,-1.4l-0.33,-1.16l-1.23,-0.88l-1.27,-2.06l-0.78,-2.22l-1.73,-1.79l-1.14,-0.48l-1.54,-2.31l-0.21,-3.41l-1.44,-2.93l-1.27,-1.16l-1.33,-0.57l-1.31,-3.37l-0.77,-0.67l-0.97,-1.97l-2.8,-4.03l-1.06,-0.17l0.37,-1.96l0.2,-0.72l2.74,0.3l1.08,-0.84l0.6,-0.94l1.74,-0.35l0.65,-1.03l0.71,-0.4l0.1,-0.62l-2.06,-2.28l4.39,-1.22l0.48,-0.37l2.77,0.69l3.66,1.9l7.03,5.5l4.87,0.3Z", "name": "Saudi Arabia"}, "SE": {"path": "M480.22,89.3l-4.03,1.17l-2.43,2.86l0.26,2.57l-8.77,6.64l-1.78,5.79l1.78,2.68l2.22,1.96l-2.07,3.77l-2.72,1.13l-0.95,6.04l-1.29,3.01l-2.74,-0.31l-0.4,0.22l-1.31,2.59l-2.34,0.13l-0.75,-3.09l-2.08,-4.03l-1.83,-4.96l1.0,-1.93l2.14,-2.7l0.83,-4.45l-1.6,-2.17l-0.15,-4.94l1.48,-3.39l2.58,-0.15l0.87,-1.59l-0.78,-1.57l3.76,-5.59l4.04,-7.48l2.17,0.01l0.39,-0.29l0.57,-2.07l4.37,0.64l0.46,-0.34l0.33,-2.56l1.1,-0.13l6.94,4.87l0.06,6.32l0.66,1.36Z", "name": "Sweden"}, "SD": {"path": "M505.98,259.4l-0.34,-0.77l-1.17,-0.9l-0.26,-1.61l0.29,-1.81l-0.34,-0.46l-1.16,-0.17l-0.54,0.59l-1.23,0.11l-0.28,0.65l0.53,0.65l0.17,1.22l-2.44,3.0l-0.96,0.19l-2.39,-1.4l-0.95,0.52l-0.38,0.78l-1.11,0.41l-0.29,0.5l-1.94,0.0l-0.54,-0.52l-1.81,-0.09l-0.95,0.4l-2.45,-2.35l-2.07,0.54l-0.73,1.26l-0.6,2.1l-1.25,0.58l-0.75,-0.62l0.27,-2.65l-1.48,-1.78l-0.22,-1.48l-0.92,-0.96l-0.02,-1.29l-0.57,-1.16l-0.68,-0.16l0.69,-1.29l-0.18,-1.14l0.65,-0.62l0.03,-0.55l-0.36,-0.41l1.55,-2.97l1.91,0.16l0.43,-0.4l-0.1,-10.94l2.49,-0.01l0.4,-0.4l-0.0,-4.82l29.02,0.0l0.64,2.04l-0.49,0.66l0.36,2.69l0.93,3.16l2.12,1.55l-0.89,1.04l-1.72,0.39l-0.98,0.9l-1.43,5.65l0.24,1.15l-0.38,2.06l-0.96,2.38l-1.53,1.31l-1.32,2.91l-1.22,0.86l-0.37,1.34Z", "name": "Sudan"}, "DO": {"path": "M241.8,239.2l0.05,-0.65l-0.46,-0.73l0.42,-0.44l0.19,-1.0l-0.09,-1.53l1.66,0.01l1.99,0.63l0.33,0.67l1.28,0.19l0.33,0.76l1.0,0.08l0.8,0.62l-0.45,0.51l-1.13,-0.47l-1.88,-0.01l-1.27,0.59l-0.75,-0.55l-1.01,0.54l-0.79,1.4l-0.23,-0.61Z", "name": "Dominican Rep."}, "DJ": {"path": "M528.43,256.18l-0.45,0.66l-0.58,-0.25l-1.51,0.13l-0.18,-1.01l1.45,-1.95l0.83,0.17l0.77,-0.44l0.2,1.0l-1.2,0.51l-0.06,0.7l0.73,0.47Z", "name": "Djibouti"}, "DK": {"path": "M452.28,129.07l-1.19,2.24l-2.13,-1.6l-0.23,-0.95l2.98,-0.95l0.57,1.26ZM447.74,126.31l-0.26,0.57l-0.88,-0.07l-1.8,2.53l0.48,1.69l-1.09,0.36l-1.61,-0.39l-0.89,-1.69l-0.07,-3.43l0.96,-1.73l2.02,-0.2l1.09,-1.07l1.33,-0.67l-0.05,1.06l-0.73,1.41l0.3,1.0l1.2,0.64Z", "name": "Denmark"}, "DE": {"path": "M453.14,155.55l-0.55,-0.36l-1.2,-0.1l-1.87,0.57l-2.13,-0.13l-0.56,0.63l-0.86,-0.6l-0.96,0.09l-2.57,-0.93l-0.85,0.67l-1.47,-0.02l0.24,-1.75l1.23,-2.14l-0.28,-0.59l-3.52,-0.58l-0.92,-0.66l0.12,-1.2l-0.48,-0.88l0.27,-2.17l-0.37,-3.03l1.41,-0.22l0.63,-1.26l0.66,-3.19l-0.41,-1.18l0.26,-0.39l1.66,-0.15l0.33,0.54l0.62,0.07l1.7,-1.69l-0.54,-3.02l1.37,0.33l1.31,-0.37l0.31,1.18l2.25,0.71l-0.02,0.92l0.5,0.4l2.55,-0.65l1.34,-0.87l2.57,1.24l1.06,0.98l0.48,1.44l-0.57,0.74l-0.0,0.48l0.87,1.15l0.57,1.64l-0.14,1.29l0.82,1.7l-1.5,-0.07l-0.56,0.57l-4.47,2.15l-0.22,0.54l0.68,2.26l2.58,2.16l-0.66,1.11l-0.79,0.36l-0.23,0.43l0.32,1.87Z", "name": "Germany"}, "YE": {"path": "M528.27,246.72l0.26,-0.42l-0.22,-1.01l0.19,-1.5l0.92,-0.69l-0.07,-1.35l0.39,-0.75l1.01,0.47l3.34,-0.27l3.76,0.41l0.95,0.81l1.36,-0.58l1.74,-2.62l2.18,-1.09l6.86,-0.94l2.48,5.41l-1.64,0.76l-0.56,1.9l-6.23,2.16l-2.29,1.8l-1.93,0.05l-1.41,1.02l-4.24,0.74l-1.72,1.49l-3.28,0.19l-0.52,-1.18l0.02,-1.51l-1.34,-3.29Z", "name": "Yemen"}, "AT": {"path": "M462.89,152.8l0.04,2.25l-1.07,0.0l-0.33,0.63l0.36,0.51l-1.04,2.13l-2.02,0.07l-1.33,0.7l-5.29,-0.99l-0.47,-0.93l-0.44,-0.21l-2.47,0.55l-0.42,0.51l-3.18,-0.81l0.43,-0.91l1.12,0.78l0.6,-0.17l0.25,-0.58l1.93,0.12l1.86,-0.56l1.0,0.08l0.68,0.57l0.62,-0.15l0.26,-0.77l-0.3,-1.78l0.8,-0.44l0.68,-1.15l1.52,0.85l0.47,-0.06l1.34,-1.25l0.64,-0.17l1.81,0.92l1.28,-0.11l0.7,0.37Z", "name": "Austria"}, "DZ": {"path": "M441.46,188.44l-0.32,1.07l0.39,2.64l-0.54,2.16l-1.58,1.82l0.37,2.39l1.91,1.55l0.18,0.8l1.42,1.03l1.84,7.23l0.12,1.16l-0.57,5.0l0.2,1.51l-0.87,0.99l-0.02,0.51l1.41,1.86l0.14,1.2l0.89,1.48l0.5,0.16l0.98,-0.41l1.73,1.08l0.82,1.23l-8.22,4.81l-7.23,5.11l-3.43,1.13l-2.3,0.21l-0.28,-1.59l-2.56,-1.09l-0.67,-1.25l-26.12,-17.86l0.01,-3.47l3.77,-1.88l2.44,-0.41l2.12,-0.75l1.08,-1.42l2.81,-1.05l0.35,-2.08l1.33,-0.29l1.04,-0.94l3.47,-0.69l0.46,-1.08l-0.1,-0.45l-0.58,-0.52l-0.82,-2.81l-0.19,-1.83l-0.78,-1.49l2.03,-1.31l2.63,-0.48l1.7,-1.22l2.31,-0.84l8.24,-0.73l1.49,0.38l2.28,-1.1l2.46,-0.02l0.92,0.6l1.35,-0.05Z", "name": "Algeria"}, "US": {"path": "M892.72,99.2l1.31,0.53l1.41,-0.37l1.89,0.98l1.89,0.42l-1.32,0.58l-2.9,-1.53l-2.08,0.22l-0.26,-0.15l0.07,-0.67ZM183.22,150.47l0.37,1.47l1.12,0.85l4.23,0.7l2.39,0.98l2.17,-0.38l1.85,0.5l-1.55,0.65l-3.49,2.61l-0.16,0.77l0.5,0.39l2.33,-0.61l1.77,1.02l5.15,-2.4l-0.31,0.65l0.25,0.56l1.36,0.38l1.71,1.16l4.7,-0.88l0.67,0.85l1.31,0.21l0.58,0.58l-1.34,0.17l-2.18,-0.32l-3.6,0.89l-2.71,3.25l0.35,0.9l0.59,-0.0l0.55,-0.6l-1.36,4.65l0.29,3.09l0.67,1.58l0.61,0.45l1.77,-0.44l1.6,-1.96l0.14,-2.21l-0.82,-1.96l0.11,-1.13l1.19,-2.37l0.44,-0.33l0.48,0.75l0.4,-0.29l0.4,-1.37l0.6,-0.47l0.24,-0.8l1.69,0.49l1.65,1.08l-0.03,2.37l-1.27,1.13l-0.0,1.13l0.87,0.36l1.66,-1.29l0.5,0.17l0.5,2.6l-2.49,3.75l0.17,0.61l1.54,0.62l1.48,0.17l1.92,-0.44l4.72,-2.15l2.16,-1.8l-0.05,-1.24l0.75,-0.22l3.92,0.36l2.12,-1.05l0.21,-0.4l-0.28,-1.48l3.27,-2.4l8.32,-0.02l0.56,-0.82l1.9,-0.77l0.93,-1.51l0.74,-2.37l1.58,-1.98l0.92,0.62l1.47,-0.47l0.8,0.66l-0.0,4.09l1.96,2.6l-2.34,1.31l-5.37,2.09l-1.83,2.72l0.02,1.79l0.83,1.59l0.54,0.23l-6.19,0.94l-2.2,0.89l-0.23,0.48l0.45,0.29l2.99,-0.46l-2.19,0.56l-1.13,0.0l-0.15,-0.32l-0.48,0.08l-0.76,0.82l0.22,0.67l0.32,0.06l-0.41,1.62l-1.27,1.58l-1.48,-1.07l-0.49,-0.04l-0.16,0.46l0.52,1.58l0.61,0.59l0.03,0.79l-0.95,1.38l-1.21,-1.22l-0.27,-2.27l-0.35,-0.35l-0.42,0.25l-0.48,1.27l0.33,1.41l-0.97,-0.27l-0.48,0.24l0.18,0.5l1.52,0.83l0.1,2.52l0.79,0.51l0.52,3.42l-1.42,1.88l-2.47,0.8l-1.71,1.66l-1.31,0.25l-1.27,1.03l-0.43,0.99l-2.69,1.78l-2.64,3.03l-0.45,2.12l0.45,2.08l0.85,2.38l1.09,1.9l0.04,1.2l1.16,3.06l-0.18,2.69l-0.55,1.43l-0.47,0.21l-0.89,-0.23l-0.49,-1.18l-0.87,-0.56l-2.75,-5.16l0.48,-1.68l-0.72,-1.78l-2.01,-2.38l-1.12,-0.53l-2.72,1.18l-1.47,-1.35l-1.57,-0.68l-2.99,0.31l-2.17,-0.3l-2.0,0.19l-1.15,0.46l-0.19,0.58l0.39,0.63l0.14,1.34l-0.84,-0.2l-0.84,0.46l-1.58,-0.07l-2.08,-1.44l-2.09,0.33l-1.91,-0.62l-3.73,0.84l-2.39,2.07l-2.54,1.22l-1.45,1.41l-0.61,1.38l0.34,3.71l-0.29,0.02l-3.5,-1.33l-1.25,-3.11l-1.44,-1.5l-2.24,-3.56l-1.76,-1.09l-2.27,-0.01l-1.71,2.07l-1.76,-0.69l-1.16,-0.74l-1.52,-2.98l-3.93,-3.16l-4.34,-0.0l-0.4,0.4l-0.0,0.74l-6.5,0.02l-9.02,-3.14l-0.34,-0.71l-5.7,0.49l-0.43,-1.29l-1.62,-1.61l-1.14,-0.38l-0.55,-0.88l-1.28,-0.13l-1.01,-0.77l-2.22,-0.27l-0.43,-0.3l-0.36,-1.58l-2.4,-2.83l-2.01,-3.85l-0.06,-0.9l-2.92,-3.26l-0.33,-2.29l-1.3,-1.66l0.52,-2.37l-0.09,-2.57l-0.78,-2.3l0.95,-2.82l0.61,-5.68l-0.47,-4.27l-1.46,-4.08l3.19,0.79l1.26,2.83l0.69,0.08l0.69,-1.14l-1.1,-4.79l68.76,-0.0l0.4,-0.4l0.14,-0.86ZM32.44,67.52l1.73,1.97l0.55,0.05l0.99,-0.79l3.65,0.24l-0.09,0.62l0.32,0.45l3.83,0.77l2.61,-0.43l5.19,1.4l4.84,0.43l1.89,0.57l3.42,-0.7l6.14,1.87l-0.03,38.06l0.38,0.4l2.39,0.11l2.31,0.98l3.9,3.99l0.55,0.04l2.4,-2.03l2.16,-1.04l1.2,1.71l3.95,3.14l4.09,6.63l4.2,2.29l0.06,1.83l-1.02,1.23l-1.16,-1.08l-2.04,-1.03l-0.67,-2.89l-3.28,-3.03l-1.65,-3.57l-6.35,-0.32l-2.82,-1.01l-5.26,-3.85l-6.77,-2.04l-3.53,0.3l-4.81,-1.69l-3.25,-1.63l-2.78,0.8l-0.28,0.46l0.44,2.21l-3.91,0.96l-2.26,1.27l-2.3,0.65l-0.27,-1.65l1.05,-3.42l2.49,-1.09l0.16,-0.6l-0.69,-0.96l-0.55,-0.1l-3.19,2.12l-1.78,2.56l-3.55,2.61l-0.04,0.61l1.56,1.52l-2.07,2.29l-5.11,2.57l-0.77,1.66l-3.76,1.77l-0.92,1.73l-2.69,1.38l-1.81,-0.22l-6.95,3.32l-3.97,0.91l4.85,-2.5l2.59,-1.86l3.26,-0.52l1.19,-1.4l3.42,-2.1l2.59,-2.27l0.42,-2.68l1.23,-2.1l-0.04,-0.46l-0.45,-0.11l-2.68,1.03l-0.63,-0.49l-0.53,0.03l-1.05,1.04l-1.36,-1.54l-0.66,0.08l-0.32,0.62l-0.58,-1.14l-0.56,-0.16l-2.41,1.42l-1.07,-0.0l-0.17,-1.75l0.3,-1.71l-1.61,-1.33l-3.41,0.59l-1.96,-1.63l-1.57,-0.84l-0.15,-2.21l-1.7,-1.43l0.82,-1.88l1.99,-2.12l0.88,-1.92l1.71,-0.24l2.04,0.51l1.87,-1.77l1.91,0.25l1.91,-1.23l0.17,-0.43l-0.47,-1.82l-1.07,-0.7l1.39,-1.17l0.12,-0.45l-0.39,-0.26l-1.65,0.07l-2.66,0.88l-0.75,0.78l-1.92,-0.8l-3.46,0.44l-3.44,-0.91l-1.06,-1.61l-2.65,-1.99l2.91,-1.43l5.5,-2.0l1.52,0.0l-0.26,1.62l0.41,0.46l5.29,-0.16l0.3,-0.65l-2.03,-2.59l-3.14,-1.68l-1.79,-2.12l-2.4,-1.83l-3.09,-1.24l1.04,-1.69l4.23,-0.14l3.36,-2.07l0.73,-2.27l2.39,-1.99l2.42,-0.52l4.65,-1.97l2.46,0.23l3.71,-2.35l3.5,0.89ZM37.6,123.41l-2.25,1.23l-0.95,-0.69l-0.29,-1.24l3.21,-1.63l1.42,0.21l0.67,0.7l-1.8,1.42ZM31.06,234.03l0.98,0.47l0.74,0.87l-1.77,1.07l-0.44,-1.53l0.49,-0.89ZM29.34,232.07l0.18,0.05l0.08,0.05l-0.16,0.03l-0.11,-0.14ZM25.16,230.17l0.05,-0.03l0.18,0.22l-0.13,-0.01l-0.1,-0.18ZM5.89,113.26l-1.08,0.41l-2.21,-1.12l1.53,-0.4l1.62,0.28l0.14,0.83Z", "name": "United States"}, "LV": {"path": "M489.16,122.85l0.96,0.66l0.22,1.65l0.68,1.76l-3.65,1.7l-2.23,-1.58l-1.29,-0.26l-0.68,-0.77l-2.42,0.34l-4.16,-0.23l-2.47,0.9l0.06,-1.98l1.13,-2.06l1.95,-1.02l2.12,2.58l2.01,-0.07l0.38,-0.33l0.44,-2.52l1.76,-0.53l3.06,1.7l2.15,0.07Z", "name": "Latvia"}, "UY": {"path": "M286.85,372.74l-0.92,1.5l-2.59,1.44l-1.69,-0.52l-1.42,0.26l-2.39,-1.19l-1.52,0.08l-1.27,-1.3l0.16,-1.5l0.56,-0.79l-0.02,-2.73l1.21,-4.74l1.19,-0.21l2.37,2.0l1.08,0.03l4.36,3.17l1.22,1.6l-0.96,1.5l0.61,1.4Z", "name": "Uruguay"}, "LB": {"path": "M510.37,198.01l-0.88,0.51l1.82,-3.54l0.62,0.08l0.22,0.61l-1.13,0.88l-0.65,1.47Z", "name": "Lebanon"}, "LA": {"path": "M689.54,248.53l-1.76,-0.74l-0.49,0.15l-0.94,1.46l-1.32,-0.64l0.62,-0.98l0.11,-2.17l-2.04,-2.42l-0.25,-2.65l-1.9,-2.1l-2.15,-0.31l-0.78,0.91l-1.12,0.06l-1.05,-0.4l-2.06,1.2l-0.04,-1.59l0.61,-2.68l-0.36,-0.49l-1.35,-0.1l-0.11,-1.23l-0.96,-0.88l1.96,-1.89l0.39,0.36l1.33,0.07l0.42,-0.45l-0.34,-2.66l0.7,-0.21l1.28,1.81l1.11,2.35l0.36,0.23l2.82,0.02l0.71,1.67l-1.39,0.65l-0.72,0.93l0.13,0.6l2.91,1.51l3.6,5.25l1.88,1.78l0.56,1.62l-0.35,1.96Z", "name": "Lao PDR"}, "TW": {"path": "M724.01,226.68l-0.74,1.48l-0.9,-1.52l-0.25,-1.74l1.38,-2.44l1.73,-1.74l0.64,0.44l-1.85,5.52Z", "name": "Taiwan"}, "TT": {"path": "M266.64,259.32l0.28,-1.16l1.13,-0.22l-0.06,1.2l-1.35,0.18Z", "name": "Trinidad and Tobago"}, "TR": {"path": "M513.21,175.47l3.64,1.17l3.05,-0.44l2.1,0.26l3.11,-1.56l2.46,-0.13l2.19,1.33l0.33,0.82l-0.22,1.33l0.25,0.44l2.28,1.13l-1.17,0.57l-0.21,0.45l0.75,3.2l-0.41,1.16l1.13,1.92l-0.55,0.22l-0.9,-0.67l-2.91,-0.37l-1.24,0.46l-4.23,0.41l-2.81,1.05l-1.91,0.01l-1.52,-0.53l-2.58,0.75l-0.66,-0.45l-0.62,0.3l-0.12,1.45l-0.89,0.84l-0.47,-0.67l0.79,-1.3l-0.41,-0.2l-1.43,0.23l-2.0,-0.63l-2.02,1.65l-3.51,0.3l-2.13,-1.53l-2.7,-0.1l-0.86,1.24l-1.38,0.27l-2.29,-1.44l-2.71,-0.01l-1.37,-2.65l-1.68,-1.52l1.07,-1.99l-0.09,-0.49l-1.27,-1.12l2.37,-2.41l3.7,-0.11l1.28,-2.24l4.49,0.37l3.21,-1.97l2.81,-0.82l3.99,-0.06l4.29,2.07ZM488.79,176.72l-1.72,1.31l-0.5,-0.88l1.37,-2.57l-0.7,-0.85l1.7,-0.63l1.8,0.34l0.46,1.17l1.76,0.78l-2.87,0.32l-1.3,1.01Z", "name": "Turkey"}, "LK": {"path": "M624.16,268.99l-1.82,0.48l-0.99,-1.67l-0.42,-3.46l0.95,-3.43l1.21,0.98l2.26,4.19l-0.34,2.33l-0.85,0.58Z", "name": "Sri Lanka"}, "TN": {"path": "M448.1,188.24l-1.0,1.27l-0.02,1.32l0.84,0.88l-0.28,2.09l-1.53,1.32l-0.12,0.42l0.48,1.54l1.42,0.32l0.53,1.11l0.9,0.52l-0.11,1.67l-3.54,2.64l-0.1,2.38l-0.58,0.3l-0.96,-4.45l-1.54,-1.25l-0.16,-0.78l-1.92,-1.56l-0.18,-1.76l1.51,-1.62l0.59,-2.34l-0.38,-2.78l0.42,-1.21l2.45,-1.05l1.29,0.26l-0.06,1.11l0.58,0.38l1.47,-0.73Z", "name": "Tunisia"}, "TL": {"path": "M734.55,307.93l-0.1,-0.97l4.5,-0.86l-2.82,1.28l-1.59,0.55Z", "name": "Timor-Leste"}, "TM": {"path": "M553.03,173.76l-0.04,0.34l-0.09,-0.22l0.13,-0.12ZM555.87,172.66l0.45,-0.1l1.48,0.74l2.06,2.43l4.07,-0.18l0.38,-0.51l-0.32,-1.19l1.92,-0.94l1.91,-1.59l2.94,1.39l0.43,2.47l1.19,0.67l2.58,-0.13l0.62,0.4l1.32,3.12l4.54,3.44l2.67,1.45l3.06,1.14l-0.04,1.05l-1.33,-0.75l-0.59,0.19l-0.32,0.84l-2.2,0.81l-0.46,2.13l-1.21,0.74l-1.91,0.42l-0.73,1.33l-1.56,0.31l-2.22,-0.94l-0.2,-2.17l-0.38,-0.36l-1.73,-0.09l-2.76,-2.46l-2.14,-0.4l-2.84,-1.48l-1.78,-0.27l-1.24,0.53l-1.57,-0.08l-2.0,1.69l-1.7,0.43l-0.36,-1.58l0.36,-2.98l-0.22,-0.4l-1.65,-0.84l0.54,-1.69l-0.34,-0.52l-1.22,-0.13l0.36,-1.64l2.22,0.59l2.2,-0.95l0.12,-0.65l-1.77,-1.74l-0.66,-1.57Z", "name": "Turkmenistan"}, "TJ": {"path": "M597.75,178.82l-2.54,-0.44l-0.47,0.34l-0.24,1.7l0.43,0.45l2.64,-0.22l3.18,0.95l4.39,-0.41l0.56,2.37l0.52,0.29l0.67,-0.24l1.11,0.49l0.21,2.13l-3.76,-0.21l-1.8,1.32l-1.76,0.74l-0.61,-0.58l0.21,-2.23l-0.64,-0.49l-0.07,-0.93l-1.36,-0.66l-0.45,0.07l-1.08,1.01l-0.55,1.48l-1.31,-0.05l-0.95,1.16l-0.9,-0.35l-1.86,0.74l1.26,-2.83l-0.54,-2.17l-1.67,-0.82l0.33,-0.66l2.18,-0.04l1.19,-1.63l0.76,-1.79l2.43,-0.5l-0.26,1.0l0.73,1.05Z", "name": "Tajikistan"}, "LS": {"path": "M491.06,363.48l-0.49,0.15l-1.49,-1.67l1.1,-1.43l2.19,-1.44l1.51,1.27l-0.98,1.82l-1.23,0.38l-0.62,0.93Z", "name": "Lesotho"}, "TH": {"path": "M670.27,255.86l-1.41,3.87l0.15,2.0l0.38,0.36l1.38,0.07l0.9,2.04l0.55,2.34l1.4,1.44l1.61,0.38l0.96,0.97l-0.5,0.64l-1.1,0.2l-0.34,-1.18l-2.04,-1.1l-0.63,0.23l-0.63,-0.62l-0.48,-1.3l-2.56,-2.63l-0.73,0.41l0.95,-3.89l2.16,-4.22ZM670.67,254.77l-0.92,-2.18l-0.26,-2.61l-2.14,-3.06l0.71,-0.49l0.89,-2.59l-3.61,-5.45l0.87,-0.51l1.05,-2.58l1.74,-0.18l2.6,-1.59l0.76,0.56l0.13,1.39l0.37,0.36l1.23,0.09l-0.51,2.28l0.05,2.42l0.6,0.34l2.43,-1.42l0.77,0.39l1.47,-0.07l0.71,-0.88l1.48,0.14l1.71,1.88l0.25,2.65l1.92,2.11l-0.1,1.89l-0.61,0.86l-2.22,-0.33l-3.5,0.64l-1.6,2.12l0.36,2.58l-1.51,-0.79l-1.84,-0.01l0.28,-1.52l-0.4,-0.47l-2.21,0.01l-0.4,0.37l-0.19,2.74l-0.34,0.93Z", "name": "Thailand"}, "TF": {"path": "M596.68,420.38l-3.2,0.18l-0.05,-1.26l0.39,-1.41l1.3,0.78l2.08,0.35l-0.52,1.36Z", "name": "Fr. S. Antarctic Lands"}, "TG": {"path": "M422.7,257.63l-0.09,1.23l1.53,1.52l0.08,1.09l0.5,0.65l-0.11,5.62l0.49,1.47l-1.31,0.35l-1.02,-2.13l-0.18,-1.12l0.53,-2.19l-0.63,-1.16l-0.22,-3.68l-1.01,-1.4l0.07,-0.28l1.37,0.03Z", "name": "Togo"}, "TD": {"path": "M480.25,235.49l0.12,9.57l-2.1,0.05l-1.14,1.89l-0.69,1.63l0.34,0.73l-0.66,0.91l0.24,0.89l-0.86,1.95l0.45,0.5l0.6,-0.1l0.34,0.64l0.03,1.38l0.9,1.04l-1.45,0.43l-1.27,1.03l-1.83,2.76l-2.16,1.07l-2.31,-0.15l-0.86,0.25l-0.26,0.49l0.17,0.61l-2.11,1.68l-2.85,0.87l-1.09,-0.57l-0.73,0.66l-1.12,0.1l-1.1,-3.12l-1.25,-0.64l-1.22,-1.22l0.29,-0.64l3.01,0.04l0.35,-0.6l-1.3,-2.2l-0.08,-3.31l-0.97,-1.66l0.22,-1.04l-0.38,-0.48l-1.22,-0.04l0.0,-1.25l-0.98,-1.07l0.96,-3.01l3.25,-2.65l0.13,-3.33l0.95,-5.18l0.52,-1.07l-0.1,-0.48l-0.91,-0.78l-0.2,-0.96l-0.8,-0.58l-0.55,-3.65l2.1,-1.2l19.57,9.83Z", "name": "Chad"}, "LY": {"path": "M483.48,203.15l-0.75,1.1l0.29,1.39l-0.6,1.83l0.73,2.14l0.0,24.12l-2.48,0.01l-0.41,0.85l-19.41,-9.76l-4.41,2.28l-1.37,-1.33l-3.82,-1.1l-1.14,-1.65l-1.98,-1.23l-1.22,0.32l-0.66,-1.11l-0.17,-1.26l-1.28,-1.69l0.87,-1.19l-0.07,-4.34l0.43,-2.27l-0.86,-3.45l1.13,-0.76l0.22,-1.16l-0.2,-1.03l3.48,-2.61l0.29,-1.94l2.45,0.8l1.18,-0.21l1.98,0.44l3.15,1.18l1.37,2.54l5.72,1.67l2.64,1.35l1.61,-0.72l1.29,-1.34l-0.44,-2.34l0.66,-1.13l1.67,-1.21l1.57,-0.35l3.14,0.53l1.08,1.28l3.99,0.78l0.36,0.54Z", "name": "Libya"}, "AE": {"path": "M550.76,223.97l1.88,-0.4l3.84,0.02l4.78,-4.75l0.19,0.36l0.26,1.58l-0.81,0.01l-0.39,0.35l-0.08,2.04l-0.81,0.63l-0.01,0.96l-0.66,0.99l-0.39,1.41l-7.08,-1.25l-0.7,-1.96Z", "name": "United Arab Emirates"}, "VE": {"path": "M240.68,256.69l0.53,0.75l-0.02,1.06l-1.07,1.78l0.95,2.0l0.42,0.22l1.4,-0.44l0.56,-1.83l-0.77,-1.17l-0.1,-1.47l2.82,-0.93l0.26,-0.49l-0.28,-0.96l0.3,-0.28l0.66,1.31l1.96,0.26l1.4,1.22l0.08,0.68l0.39,0.35l4.81,-0.22l1.49,1.11l1.92,0.31l1.67,-0.84l0.22,-0.6l3.44,-0.14l-0.17,0.55l0.86,1.19l2.19,0.35l1.67,1.1l0.37,1.86l0.41,0.32l1.55,0.17l-1.66,1.35l-0.22,0.92l0.65,0.97l-1.67,0.54l-0.3,0.4l0.04,0.99l-0.56,0.57l-0.01,0.55l1.85,2.27l-0.66,0.69l-4.47,1.29l-0.72,0.54l-3.69,-0.9l-0.71,0.27l-0.02,0.7l0.91,0.53l-0.08,1.54l0.35,1.58l0.35,0.31l1.66,0.17l-1.3,0.52l-0.48,1.13l-2.68,0.91l-0.6,0.77l-1.57,0.13l-1.17,-1.13l-0.8,-2.52l-1.25,-1.26l1.02,-1.23l-1.29,-2.95l0.18,-1.62l1.0,-2.21l-0.2,-0.49l-1.14,-0.46l-4.02,0.36l-1.82,-2.1l-1.57,-0.33l-2.99,0.22l-1.06,-0.97l0.25,-1.23l-0.2,-1.01l-0.59,-0.69l-0.29,-1.06l-1.08,-0.39l0.78,-2.79l1.9,-2.11Z", "name": "Venezuela"}, "AF": {"path": "M600.7,188.88l-1.57,1.3l-0.1,0.48l0.8,2.31l-1.09,1.04l-0.03,1.27l-0.48,0.71l-2.16,-0.08l-0.37,0.59l0.78,1.48l-1.38,0.69l-1.06,1.69l0.06,1.7l-0.65,0.52l-0.91,-0.21l-1.91,0.36l-0.48,0.77l-1.88,0.13l-1.4,1.56l-0.18,2.32l-2.91,1.02l-1.65,-0.23l-0.71,0.55l-1.41,-0.3l-2.41,0.39l-3.52,-1.17l1.96,-2.35l-0.21,-1.78l-0.3,-0.34l-1.63,-0.4l-0.19,-1.58l-0.75,-2.03l0.95,-1.36l-0.19,-0.6l-0.73,-0.28l1.47,-4.8l2.14,0.9l2.12,-0.36l0.74,-1.34l1.77,-0.39l1.54,-0.92l0.63,-2.31l1.87,-0.5l0.49,-0.81l0.94,0.56l2.13,0.11l2.55,0.92l1.95,-0.83l0.65,0.43l0.56,-0.13l0.69,-1.12l1.57,-0.08l0.72,-1.66l0.79,-0.74l0.8,0.39l-0.17,0.56l0.71,0.58l-0.08,2.39l1.11,0.95ZM601.37,188.71l1.73,-0.71l1.43,-1.18l4.03,0.35l-2.23,0.74l-4.95,0.8Z", "name": "Afghanistan"}, "IQ": {"path": "M530.82,187.47l0.79,0.66l1.26,-0.28l1.46,3.08l1.63,0.94l0.14,1.23l-1.22,1.05l-0.53,2.52l1.73,2.67l3.12,1.62l1.15,1.88l-0.38,1.85l0.39,0.48l0.41,-0.0l0.02,1.07l0.76,0.94l-2.47,-0.1l-1.71,2.44l-4.31,-0.2l-7.02,-5.48l-3.73,-1.94l-2.88,-0.73l-0.85,-2.87l5.45,-3.02l0.95,-3.43l-0.19,-1.96l1.27,-0.7l1.22,-1.7l0.87,-0.36l2.69,0.34Z", "name": "Iraq"}, "IS": {"path": "M384.14,88.06l-0.37,2.61l2.54,2.51l-2.9,2.75l-9.19,3.4l-9.25,-1.66l1.7,-1.22l-0.1,-0.7l-4.05,-1.47l2.96,-0.53l0.33,-0.43l-0.11,-1.2l-0.33,-0.36l-4.67,-0.85l1.28,-2.04l3.45,-0.56l3.77,2.72l0.44,0.02l3.64,-2.16l3.3,1.08l3.98,-2.16l3.58,0.26Z", "name": "Iceland"}, "IR": {"path": "M533.43,187.16l-1.27,-2.15l0.42,-0.98l-0.71,-3.04l1.03,-0.5l0.33,0.83l1.26,1.35l2.05,0.51l1.11,-0.16l2.89,-2.11l0.62,-0.14l0.39,0.46l-0.72,1.2l0.06,0.49l1.56,1.53l0.65,0.04l0.67,1.81l2.56,0.83l1.87,1.48l3.69,0.49l3.91,-0.76l0.47,-0.73l2.17,-0.6l1.66,-1.54l1.51,0.08l1.18,-0.53l1.59,0.24l2.83,1.48l1.88,0.3l2.77,2.47l1.77,0.18l0.18,1.99l-1.68,5.49l0.24,0.5l0.61,0.23l-0.82,1.48l0.8,2.18l0.19,1.71l0.3,0.34l1.63,0.4l0.15,1.32l-2.15,2.35l-0.01,0.53l2.21,3.03l2.34,1.24l0.06,2.14l1.24,0.72l0.11,0.69l-3.31,1.27l-1.08,3.03l-9.68,-1.68l-0.99,-3.05l-1.43,-0.73l-2.17,0.46l-2.47,1.26l-2.83,-0.82l-2.46,-2.02l-2.41,-0.8l-3.42,-6.06l-0.48,-0.2l-1.18,0.39l-1.44,-0.82l-0.5,0.08l-0.65,0.74l-0.97,-1.01l-0.02,-1.31l-0.71,-0.39l0.26,-1.81l-1.29,-2.11l-3.13,-1.63l-1.58,-2.43l0.5,-1.9l1.31,-1.26l-0.19,-1.66l-1.74,-1.1l-1.57,-3.3Z", "name": "Iran"}, "AM": {"path": "M536.99,182.33l-0.28,0.03l-1.23,-2.13l-0.93,0.01l-0.62,-0.66l-0.69,-0.07l-0.96,-0.81l-1.56,-0.62l0.19,-1.12l-0.26,-0.79l2.72,-0.36l1.09,1.01l-0.17,0.92l1.02,0.78l-0.47,0.62l0.08,0.56l2.04,1.23l0.04,1.4Z", "name": "Armenia"}, "IT": {"path": "M451.59,158.63l3.48,0.94l-0.21,1.17l0.3,0.83l-1.49,-0.24l-2.04,1.1l-0.21,0.39l0.13,1.45l-0.25,1.12l0.82,1.57l2.39,1.63l1.31,2.54l2.79,2.43l2.05,0.08l0.21,0.23l-0.39,0.33l0.09,0.67l4.05,1.97l2.17,1.76l-0.16,0.36l-1.17,-1.08l-2.18,-0.49l-0.44,0.2l-1.05,1.91l0.14,0.54l1.57,0.95l-0.19,0.98l-1.06,0.33l-1.25,2.34l-0.37,0.08l0.0,-0.33l1.0,-2.45l-1.73,-3.17l-1.12,-0.51l-0.88,-1.33l-1.51,-0.51l-1.27,-1.25l-1.75,-0.18l-4.12,-3.21l-1.62,-1.65l-1.03,-3.19l-3.53,-1.36l-1.3,0.51l-1.69,1.41l0.16,-0.72l-0.28,-0.47l-1.14,-0.33l-0.53,-1.96l0.72,-0.78l0.04,-0.48l-0.65,-1.17l0.8,0.39l1.4,-0.23l1.11,-0.84l0.52,0.35l1.19,-0.1l0.75,-1.2l1.53,0.33l1.36,-0.56l0.35,-1.14l1.08,0.32l0.68,-0.64l1.98,-0.44l0.42,0.82ZM459.19,184.75l-0.65,1.65l0.32,1.05l-0.31,0.89l-1.5,-0.85l-4.5,-1.67l0.19,-0.82l2.67,0.23l3.78,-0.48ZM443.93,176.05l1.18,1.66l-0.3,3.32l-1.06,-0.01l-0.77,0.73l-0.53,-0.44l-0.1,-3.37l-0.39,-1.22l1.04,0.01l0.92,-0.68Z", "name": "Italy"}, "VN": {"path": "M690.56,230.25l-2.7,1.82l-2.09,2.46l-0.63,1.95l4.31,6.45l2.32,1.65l1.43,1.94l1.11,4.59l-0.32,4.24l-1.93,1.54l-2.84,1.61l-2.11,2.15l-2.73,2.06l-0.59,-1.05l0.63,-1.53l-0.13,-0.47l-1.34,-1.04l1.51,-0.71l2.55,-0.18l0.3,-0.63l-0.82,-1.14l4.0,-2.07l0.31,-3.05l-0.57,-1.77l0.42,-2.66l-0.73,-1.97l-1.86,-1.76l-3.63,-5.29l-2.72,-1.46l0.36,-0.47l1.5,-0.64l0.21,-0.52l-0.97,-2.27l-0.37,-0.24l-2.83,-0.02l-2.24,-3.9l0.83,-0.4l4.39,-0.29l2.06,-1.31l1.15,0.89l1.88,0.4l-0.17,1.51l1.35,1.16l1.67,0.45Z", "name": "Vietnam"}, "AR": {"path": "M249.29,428.93l-2.33,-0.52l-5.83,-0.43l-0.89,-1.66l0.05,-2.37l-0.45,-0.4l-1.43,0.18l-0.67,-0.91l-0.2,-3.13l1.88,-1.47l0.79,-2.04l-0.25,-1.7l1.3,-2.68l0.91,-4.15l-0.22,-1.69l0.85,-0.45l0.2,-0.44l-0.27,-1.16l-0.98,-0.68l0.59,-0.92l-0.05,-0.5l-1.04,-1.07l-0.52,-3.1l0.97,-0.86l-0.42,-3.58l1.2,-5.43l1.38,-0.98l0.16,-0.43l-0.75,-2.79l-0.01,-2.43l1.78,-1.75l0.06,-2.57l1.43,-2.85l0.01,-2.58l-0.69,-0.74l-1.09,-4.52l1.47,-2.7l-0.18,-2.79l0.85,-2.35l1.59,-2.46l1.73,-1.64l0.05,-0.52l-0.6,-0.84l0.44,-0.85l-0.07,-4.19l2.7,-1.44l0.86,-2.75l-0.21,-0.71l1.76,-2.01l2.9,0.57l1.38,1.78l0.68,-0.08l0.87,-1.87l2.39,0.09l4.95,4.77l2.17,0.49l3.0,1.92l2.47,1.0l0.25,0.82l-2.37,3.93l0.23,0.59l5.39,1.16l2.12,-0.44l2.45,-2.16l0.5,-2.38l0.76,-0.31l0.98,1.2l-0.04,1.8l-3.67,2.51l-2.85,2.66l-3.43,3.88l-1.3,5.07l0.01,2.72l-0.54,0.73l-0.36,3.28l3.14,2.64l-0.16,2.11l1.4,1.11l-0.1,1.09l-2.29,3.52l-3.55,1.49l-4.92,0.6l-2.71,-0.29l-0.43,0.51l0.5,1.65l-0.49,2.1l0.38,1.42l-1.19,0.83l-2.36,0.38l-2.3,-1.04l-1.38,0.83l0.41,3.64l1.69,0.91l1.4,-0.71l0.36,0.76l-2.04,0.86l-2.01,1.89l-0.97,4.63l-2.34,0.1l-2.09,1.78l-0.61,2.75l2.46,2.31l2.17,0.63l-0.7,2.32l-2.83,1.73l-1.73,3.86l-2.17,1.22l-1.16,1.67l0.75,3.76l1.04,1.28ZM256.71,438.88l-2.0,0.15l-1.4,-1.22l-3.82,-0.1l-0.0,-5.83l1.6,3.05l3.26,2.07l3.08,0.78l-0.71,1.1Z", "name": "Argentina"}, "AU": {"path": "M705.8,353.26l0.26,0.04l0.17,-0.47l-0.48,-1.42l0.92,1.11l0.45,0.15l0.27,-0.39l-0.1,-1.56l-1.98,-3.63l1.09,-3.31l-0.24,-1.57l0.34,-0.62l0.38,1.06l0.43,-0.19l0.99,-1.7l1.91,-0.83l1.29,-1.15l1.81,-0.91l0.96,-0.17l0.92,0.26l1.92,-0.95l1.47,-0.28l1.03,-0.8l1.43,0.04l2.78,-0.84l1.36,-1.15l0.71,-1.45l1.41,-1.26l0.3,-2.58l1.27,-1.59l0.78,1.65l0.54,0.19l1.07,-0.51l0.15,-0.6l-0.73,-1.0l0.45,-0.71l0.78,0.39l0.58,-0.3l0.28,-1.82l1.87,-2.14l1.12,-0.39l0.28,-0.58l0.62,0.17l0.53,-0.73l1.87,-0.57l1.65,1.05l1.35,1.48l3.39,0.38l0.43,-0.54l-0.46,-1.23l1.05,-1.79l1.04,-0.61l0.14,-0.55l-0.25,-0.41l0.88,-1.17l1.31,-0.77l1.3,0.27l2.1,-0.48l0.31,-0.4l-0.05,-1.3l-0.92,-0.77l1.48,0.56l1.41,1.07l2.11,0.65l0.81,-0.2l1.4,0.7l1.69,-0.66l0.8,0.19l0.64,-0.33l0.71,0.77l-1.33,1.94l-0.71,0.07l-0.35,0.51l0.24,0.86l-1.52,2.35l0.12,1.05l2.15,1.65l1.97,0.85l3.04,2.36l1.97,0.65l0.55,0.88l2.72,0.85l1.84,-1.1l2.07,-5.97l-0.42,-3.59l0.3,-1.73l0.47,-0.87l-0.31,-0.68l1.09,-3.28l0.46,-0.47l0.4,0.71l0.16,1.51l0.65,0.52l0.16,1.04l0.85,1.21l0.12,2.38l0.9,2.0l0.57,0.18l1.3,-0.78l1.69,1.7l-0.2,1.08l0.53,2.2l0.39,1.3l0.68,0.48l0.6,1.95l-0.19,1.48l0.81,1.76l6.01,3.69l-0.11,0.76l1.38,1.58l0.95,2.77l0.58,0.22l0.72,-0.41l0.8,0.9l0.61,0.01l0.46,2.41l4.81,4.71l0.66,2.02l-0.07,3.31l1.14,2.2l-0.13,2.24l-1.1,3.68l0.03,1.64l-0.47,1.89l-1.05,2.4l-1.9,1.47l-1.72,3.51l-2.38,6.09l-0.24,2.82l-1.14,0.8l-2.85,0.15l-2.31,1.19l-2.51,2.25l-3.09,-1.57l0.3,-1.15l-0.54,-0.47l-1.5,0.63l-2.01,1.94l-7.12,-2.18l-1.48,-1.63l-1.14,-3.74l-1.45,-1.26l-1.81,-0.26l0.56,-1.18l-0.61,-2.1l-0.72,-0.1l-1.14,1.82l-0.9,0.21l0.63,-0.82l0.36,-1.55l0.92,-1.31l-0.13,-2.34l-0.7,-0.22l-2.0,2.34l-1.51,0.93l-0.94,2.01l-1.35,-0.81l-0.02,-1.52l-1.57,-2.04l-1.09,-0.88l0.24,-0.33l-0.14,-0.59l-3.21,-1.69l-1.83,-0.12l-2.54,-1.35l-4.58,0.28l-6.02,1.9l-2.53,-0.13l-2.62,1.41l-2.13,0.63l-1.49,2.6l-3.49,0.31l-2.29,-0.5l-3.48,0.43l-1.6,1.47l-0.81,-0.04l-2.37,1.63l-3.26,-0.1l-3.72,-2.21l0.04,-1.05l1.19,-0.46l0.49,-0.89l0.21,-2.97l-0.28,-1.64l-1.34,-2.86l-0.38,-1.47l0.05,-1.72l-0.95,-1.7l-0.18,-0.97l-1.01,-0.99l-0.29,-1.98l-1.13,-1.75ZM784.92,393.44l2.65,1.02l3.23,-0.96l1.09,0.14l0.15,3.06l-0.85,1.13l-0.17,1.63l-0.87,-0.24l-1.57,1.91l-1.68,-0.18l-1.4,-2.36l-0.37,-2.04l-1.39,-2.51l0.04,-0.8l1.15,0.18Z", "name": "Australia"}, "IL": {"path": "M507.76,203.05l0.4,-0.78l0.18,0.4l-0.33,1.03l0.52,0.44l0.68,-0.22l-0.86,3.6l-1.16,-3.32l0.59,-0.74l-0.03,-0.41ZM508.73,200.34l0.37,-1.02l0.64,0.0l0.52,-0.51l-0.49,1.53l-0.56,-0.24l-0.48,0.23Z", "name": "Israel"}, "IN": {"path": "M623.34,207.03l-1.24,1.04l-0.97,2.55l0.22,0.51l8.04,3.87l3.42,0.37l1.57,1.38l4.92,0.88l2.18,-0.04l0.38,-0.3l0.29,-1.24l-0.32,-1.64l0.14,-0.87l0.82,-0.31l0.45,2.48l2.28,1.02l1.77,-0.38l4.14,0.1l0.38,-0.36l0.18,-1.66l-0.5,-0.65l1.37,-0.29l2.25,-1.99l2.7,-1.62l1.93,0.62l1.8,-0.98l0.79,1.14l-0.68,0.91l0.26,0.63l2.42,0.36l0.09,0.47l-0.83,0.75l0.13,1.07l-1.52,-0.29l-3.24,1.86l-0.13,1.78l-1.32,2.14l-0.18,1.39l-0.93,1.82l-1.64,-0.5l-0.52,0.37l-0.09,2.63l-0.56,1.11l0.19,0.81l-0.53,0.27l-1.18,-3.73l-1.08,-0.27l-0.38,0.31l-0.24,1.0l-0.66,-0.66l0.54,-1.06l1.22,-0.34l1.15,-2.25l-0.24,-0.56l-1.57,-0.47l-4.34,-0.28l-0.18,-1.56l-0.35,-0.35l-1.11,-0.12l-1.91,-1.12l-0.56,0.17l-0.88,1.82l0.11,0.49l1.36,1.07l-1.09,0.69l-0.69,1.11l0.18,0.56l1.24,0.57l-0.32,1.54l0.85,1.94l0.36,2.01l-0.22,0.59l-4.58,0.52l-0.33,0.42l0.13,1.8l-1.17,1.36l-3.65,1.81l-2.79,3.03l-4.32,3.28l-0.18,1.27l-4.65,1.79l-0.77,2.16l0.64,5.3l-1.06,2.49l-0.01,3.94l-1.24,0.28l-1.14,1.93l0.39,0.84l-1.68,0.53l-1.04,1.83l-0.65,0.47l-2.06,-2.05l-2.1,-6.02l-2.2,-3.64l-1.05,-4.75l-2.29,-3.57l-1.76,-8.2l0.01,-3.11l-0.49,-2.53l-0.55,-0.29l-3.53,1.52l-1.53,-0.27l-2.86,-2.77l0.85,-0.67l0.08,-0.55l-0.74,-1.03l-2.67,-2.06l1.24,-1.32l5.34,0.01l0.39,-0.49l-0.5,-2.29l-1.42,-1.46l-0.27,-1.93l-1.43,-1.2l2.31,-2.37l3.05,0.06l2.62,-2.85l1.6,-2.81l2.4,-2.73l0.07,-2.04l1.97,-1.48l-0.02,-0.65l-1.93,-1.31l-0.82,-1.78l-0.8,-2.21l0.9,-0.89l3.59,0.65l2.92,-0.42l2.33,-2.19l2.31,2.85l-0.24,2.13l0.99,1.59l-0.05,0.82l-1.34,-0.28l-0.47,0.48l0.7,3.06l2.62,1.99l2.99,1.65Z", "name": "India"}, "TZ": {"path": "M495.56,296.42l2.8,-3.12l-0.02,-0.81l-0.64,-1.3l0.68,-0.52l0.14,-1.47l-0.76,-1.25l0.31,-0.11l2.26,0.03l-0.51,2.76l0.76,1.3l0.5,0.12l1.05,-0.53l1.19,-0.12l0.61,0.24l1.43,-0.62l0.1,-0.67l-0.71,-0.62l1.57,-1.7l8.65,4.86l0.32,1.53l3.34,2.33l-1.05,2.8l0.13,1.61l1.63,1.12l-0.6,1.76l-0.01,2.33l1.89,4.03l0.57,0.43l-1.46,1.08l-2.61,0.94l-1.43,-0.04l-1.06,0.77l-2.29,0.36l-2.87,-0.68l-0.83,0.07l-0.63,-0.75l-0.31,-2.78l-1.32,-1.35l-3.25,-0.77l-3.96,-1.58l-1.18,-2.41l-0.32,-1.75l-1.76,-1.49l0.42,-1.05l-0.44,-0.89l0.08,-0.96l-0.46,-0.58l0.06,-0.56Z", "name": "Tanzania"}, "AZ": {"path": "M539.29,175.73l1.33,0.32l1.94,-1.8l2.3,3.34l1.43,0.43l-1.26,0.15l-0.35,0.32l-0.8,3.14l-0.99,0.96l0.05,1.11l-1.26,-1.13l0.7,-1.18l-0.04,-0.47l-0.74,-0.86l-1.48,0.15l-2.34,1.71l-0.03,-1.27l-2.03,-1.35l0.47,-0.62l-0.08,-0.56l-1.03,-0.79l0.29,-0.43l-0.14,-0.58l-1.13,-0.86l1.89,0.68l1.69,0.06l0.37,-0.87l-0.81,-1.37l0.42,0.06l1.63,1.72ZM533.78,180.57l0.61,0.46l0.69,-0.0l0.59,1.15l-0.68,-0.15l-1.21,-1.45Z", "name": "Azerbaijan"}, "IE": {"path": "M405.08,135.42l0.35,2.06l-1.75,2.78l-4.22,1.88l-2.84,-0.4l1.73,-3.0l-1.18,-3.53l4.6,-3.74l0.32,1.15l-0.49,1.74l0.4,0.51l1.47,-0.04l1.6,0.6Z", "name": "Ireland"}, "ID": {"path": "M756.47,287.89l0.69,4.01l2.79,1.78l0.51,-0.1l2.04,-2.59l2.71,-1.43l2.05,-0.0l3.9,1.73l2.46,0.45l0.08,15.12l-1.75,-1.54l-2.54,-0.51l-0.88,0.71l-2.32,0.06l0.69,-1.33l1.45,-0.64l0.23,-0.46l-0.65,-2.74l-1.24,-2.21l-5.04,-2.29l-2.09,-0.23l-3.68,-2.27l-0.55,0.13l-0.65,1.07l-0.52,0.12l-0.55,-1.89l-1.21,-0.78l1.84,-0.62l1.72,0.05l0.39,-0.52l-0.21,-0.66l-0.38,-0.28l-3.45,-0.0l-1.13,-1.48l-2.1,-0.43l-0.52,-0.6l2.69,-0.48l1.28,-0.78l3.66,0.94l0.3,0.71ZM757.91,300.34l-0.62,0.82l-0.1,-0.8l0.59,-1.12l0.13,1.1ZM747.38,292.98l0.34,0.72l-1.22,-0.57l-4.68,-0.1l0.27,-0.62l2.78,-0.09l2.52,0.67ZM741.05,285.25l-0.67,-2.88l0.64,-2.01l0.41,0.86l1.21,0.18l0.16,0.7l-0.1,1.68l-0.84,-0.16l-0.46,0.3l-0.34,1.34ZM739.05,293.5l-0.5,0.44l-1.34,-0.36l-0.17,-0.37l1.73,-0.08l0.27,0.36ZM721.45,284.51l-0.19,1.97l2.24,2.23l0.54,0.02l1.27,-1.07l2.75,-0.5l-0.9,1.21l-2.11,0.93l-0.16,0.6l2.22,3.01l-0.3,1.07l1.36,1.74l-2.26,0.85l-0.28,-0.31l0.12,-1.19l-1.64,-1.34l0.17,-2.23l-0.56,-0.39l-1.67,0.76l-0.23,0.39l0.3,6.17l-1.1,0.25l-0.69,-0.47l0.64,-2.21l-0.39,-2.42l-0.39,-0.34l-0.8,-0.01l-0.58,-1.29l0.98,-1.6l0.35,-1.96l1.32,-3.87ZM728.59,296.27l0.38,0.49l-0.02,1.28l-0.88,0.49l-0.53,-0.47l1.04,-1.79ZM729.04,286.98l0.27,-0.05l-0.02,0.13l-0.24,-0.08ZM721.68,284.05l0.16,-0.32l1.89,-1.65l1.83,0.68l3.16,0.35l2.94,-0.1l2.39,-1.66l-1.73,2.13l-1.66,0.43l-2.41,-0.48l-4.17,0.13l-2.39,0.51ZM730.55,310.47l1.11,-1.93l2.03,-0.82l0.08,0.62l-1.45,1.67l-1.77,0.46ZM728.12,305.88l-0.1,0.38l-3.46,0.66l-2.91,-0.27l-0.0,-0.25l1.54,-0.41l1.66,0.73l1.67,-0.19l1.61,-0.65ZM722.9,310.24l-0.64,0.03l-2.26,-1.2l1.11,-0.24l1.78,1.41ZM716.26,305.77l0.88,0.51l1.28,-0.17l0.2,0.35l-4.65,0.73l0.39,-0.67l1.15,-0.02l0.75,-0.73ZM711.66,293.84l-0.38,-0.16l-2.54,1.01l-1.12,-1.44l-1.69,-0.13l-1.16,-0.75l-3.04,0.77l-1.1,-1.15l-3.31,-0.11l-0.35,-3.05l-1.35,-0.95l-1.11,-1.98l-0.33,-2.06l0.27,-2.14l0.9,-1.01l0.37,1.15l2.09,1.49l1.53,-0.48l1.82,0.08l1.38,-1.19l1.0,-0.18l2.28,0.67l2.26,-0.53l1.52,-3.64l1.01,-0.99l0.78,-2.57l4.1,0.3l-1.11,1.77l0.02,0.46l1.7,2.2l-0.23,1.39l2.07,1.71l-2.33,0.42l-0.88,1.9l0.1,2.05l-2.4,1.9l-0.06,2.45l-0.7,2.79ZM692.58,302.03l0.35,0.26l4.8,0.25l0.78,-0.97l4.17,1.09l1.13,1.68l3.69,0.45l2.13,1.04l-1.8,0.6l-2.77,-0.99l-4.8,-0.12l-5.24,-1.41l-1.84,-0.25l-1.11,0.3l-4.26,-0.97l-0.7,-1.14l-1.59,-0.13l1.18,-1.65l2.74,0.13l2.87,1.13l0.26,0.68ZM685.53,299.17l-2.22,0.04l-2.06,-2.03l-3.15,-2.01l-2.93,-3.51l-3.11,-5.33l-2.2,-2.12l-1.64,-4.06l-2.32,-1.69l-1.27,-2.07l-1.96,-1.5l-2.51,-2.65l-0.11,-0.66l4.81,0.53l2.15,2.38l3.31,2.74l2.35,2.66l2.7,0.17l1.95,1.59l1.54,2.17l1.59,0.95l-0.84,1.71l0.15,0.52l1.44,0.87l0.79,0.1l0.4,1.58l0.87,1.4l1.96,0.39l1.0,1.31l-0.6,3.01l-0.09,3.5Z", "name": "Indonesia"}, "UA": {"path": "M492.5,162.44l1.28,-2.49l1.82,0.19l0.66,-0.23l0.09,-0.71l-0.25,-0.75l-0.79,-0.72l-0.33,-1.21l-0.86,-0.62l-0.02,-1.19l-1.13,-0.86l-1.15,-0.19l-2.04,-1.0l-1.66,0.32l-0.66,0.47l-0.92,-0.0l-0.84,0.78l-2.48,0.7l-1.18,-0.71l-3.07,-0.36l-0.89,0.43l-0.24,-0.55l-1.11,-0.7l0.35,-0.93l1.26,-1.02l-0.54,-1.23l2.04,-2.43l1.4,-0.62l0.25,-1.19l-1.04,-2.39l0.83,-0.13l1.28,-0.84l1.8,-0.07l2.47,0.26l2.86,0.81l1.88,0.06l0.86,0.44l1.04,-0.41l0.77,0.66l2.18,-0.15l0.92,0.3l0.52,-0.34l0.15,-1.53l0.56,-0.54l2.85,-0.05l0.84,-0.72l3.04,-0.18l1.23,1.46l-0.48,0.77l0.21,1.03l0.36,0.32l1.8,0.14l0.93,2.08l3.18,1.15l1.94,-0.45l1.67,1.49l1.4,-0.03l3.35,0.96l0.02,0.54l-0.96,1.59l0.47,1.97l-0.26,0.7l-2.36,0.28l-1.29,0.89l-0.23,1.38l-1.83,0.27l-1.58,0.97l-2.41,0.21l-2.16,1.17l-0.21,0.38l0.34,2.26l1.23,0.75l2.13,-0.08l-0.14,0.31l-2.65,0.53l-3.23,1.69l-0.87,-0.39l0.42,-1.1l-0.25,-0.52l-2.21,-0.73l2.35,-1.06l0.12,-0.65l-0.93,-0.82l-3.62,-0.74l-0.13,-0.89l-0.46,-0.34l-2.61,0.59l-0.91,1.69l-1.71,2.04l-0.86,-0.4l-1.62,0.27Z", "name": "Ukraine"}, "QA": {"path": "M549.33,221.64l-0.76,-0.23l-0.14,-1.64l0.84,-1.29l0.47,0.52l0.04,1.34l-0.45,1.3Z", "name": "Qatar"}, "MZ": {"path": "M508.58,318.75l-0.34,-2.57l0.51,-2.05l3.55,0.63l2.5,-0.38l1.02,-0.76l1.49,0.01l2.74,-0.98l1.66,-1.2l0.5,9.24l0.41,1.23l-0.68,1.67l-0.93,1.71l-1.5,1.5l-5.16,2.28l-2.78,2.73l-1.02,0.53l-1.71,1.8l-0.98,0.57l-0.35,2.41l1.16,1.94l0.49,2.17l0.43,0.31l-0.06,2.06l-0.39,1.17l0.5,0.72l-0.25,0.73l-0.92,0.83l-5.12,2.39l-1.22,1.36l0.21,1.13l0.58,0.39l-0.11,0.72l-1.22,-0.01l-0.73,-2.97l0.42,-3.09l-1.78,-5.37l2.49,-2.81l0.69,-1.89l0.44,-0.43l0.28,-1.53l-0.39,-0.93l0.59,-3.65l-0.01,-3.26l-1.49,-1.16l-1.2,-0.22l-1.74,-1.17l-1.92,0.01l-0.29,-2.08l7.06,-1.96l1.28,1.09l0.89,-0.1l0.67,0.44l0.1,0.73l-0.51,1.29l0.19,1.81l1.75,1.83l0.65,-0.13l0.71,-1.65l1.17,-0.86l-0.26,-3.47l-1.05,-1.85l-1.04,-0.94Z", "name": "Mozambique"}}, "height": 440.70631074413296, "projection": {"type": "mill", "centralMeridian": 11.5}, "width": 900.0});
jQ183.fn.vectorMap('addMap', 'us_aea_en',{
    "insets":           [
        {"width": 120, 
            "top": 440, 
            "height": 146.91301153152673, 
            "bbox": 
                    [
                {"y": -8441276.54251503, 
                    "x": -5263964.484711316}, 
                {"y": -6227982.667213126, 
                    "x": -1949590.5739843722}], 
                "left": 0
                }, 
           
            {"width": 80, 
                "top": 460, 
                "height": 130.45734820283394, 
                "bbox": 
                        [
                    {"y": -4207088.188987161, 
                        "x": -5958848.012819753}, 
                    {"y": -3657293.3059425415, 
                        "x": -5621698.812337889}], 
                "left": 245}, 
            {"width": 900, 
                "top": 0, 
                "height": 549.6951074701432, 
                "bbox": 
                        [
                    {"y": -5490816.561605522, 
                        "x": -2029882.6485830692}, 
                    {"y": -2690009.0242363815, 
                        "x": 2555799.0309089404}], 
                "left": 0}], 
        "paths": {"US-VA": {"path": "M681.9,289.76l1.61,-0.93l1.65,-0.48l1.11,-0.95l3.56,-1.69l0.74,-2.33l0.82,-0.19l2.31,-1.53l0.05,-1.81l2.04,-1.86l-0.13,-1.58l0.26,-0.41l5.0,-4.08l4.76,-6.0l0.09,0.63l0.96,0.54l0.33,1.37l1.32,0.74l0.71,0.81l1.46,0.09l2.08,1.12l1.41,-0.09l0.79,-0.41l0.76,-1.22l1.17,-0.57l0.53,-1.38l2.72,1.48l1.42,-1.09l2.25,-0.99l0.76,0.06l1.08,-0.96l0.33,-0.82l-0.48,-0.96l0.23,-0.42l1.89,0.58l3.26,-2.62l0.3,-0.1l0.51,0.73l0.66,-0.07l2.38,-2.33l0.17,-0.85l-0.49,-0.51l0.98,-1.12l0.1,-0.6l-0.28,-0.51l-1.0,-0.46l0.71,-3.03l2.6,-4.79l0.55,-2.15l-0.01,-1.91l1.61,-2.54l-0.22,-0.94l0.24,-0.84l0.5,-0.48l0.39,-1.7l-0.0,-3.17l1.22,0.19l1.18,1.73l3.8,0.43l0.59,-0.28l1.04,-2.52l0.2,-2.36l0.71,-1.05l-0.04,-1.61l0.76,-2.3l1.78,0.75l0.65,-0.17l1.3,-3.29l0.57,0.05l0.59,-0.39l0.52,-1.2l0.81,-0.68l0.44,-1.8l1.37,-2.43l-0.35,-2.57l0.54,-1.76l-0.3,-2.0l9.17,4.57l0.59,-0.29l0.63,-3.99l2.59,-0.07l0.63,0.57l1.05,0.23l-0.5,1.74l0.6,0.88l1.61,0.85l2.52,-0.04l1.03,1.18l1.49,0.13l2.24,1.73l-0.0,1.31l0.44,1.27l-1.66,0.96l-0.12,0.65l-0.64,0.14l-0.27,0.45l-0.47,5.03l-0.36,0.13l-0.04,0.48l1.16,0.97l-0.29,0.11l-0.04,0.76l2.03,-0.01l2.4,-1.45l0.49,-0.72l0.34,0.74l-0.52,0.63l1.21,0.88l0.69,0.13l0.42,1.11l1.62,0.52l1.94,-0.2l0.84,0.43l0.82,-0.65l0.89,0.02l0.23,0.6l1.33,0.48l0.46,1.1l1.12,-0.05l0.02,0.3l1.18,0.42l2.84,0.65l0.4,1.01l-0.85,-0.41l-0.57,0.45l0.89,1.74l-0.35,0.57l0.62,0.79l-0.43,0.89l0.23,0.59l-1.35,-0.36l-0.59,-0.72l-0.67,0.18l-0.1,0.43l-2.44,-2.29l-0.56,0.05l-0.37,-0.56l-0.52,0.32l-1.47,-1.32l-1.19,-0.38l-0.43,-0.64l-0.9,-0.39l-0.7,-1.29l-0.77,-0.64l-1.34,-0.12l-1.11,-0.81l-1.17,0.05l-0.39,0.52l0.47,0.71l1.1,-0.01l0.63,0.68l1.33,0.07l0.59,0.42l0.38,1.52l2.73,1.56l1.85,1.88l1.95,0.61l1.58,2.1l0.98,0.24l1.35,-0.45l1.28,0.47l-0.61,0.69l0.3,0.49l2.03,0.34l0.26,0.72l0.46,0.12l0.31,1.96l-0.57,-0.83l-0.52,-0.22l-0.39,0.21l-1.13,-1.0l-0.58,0.3l0.1,0.82l-0.31,0.68l0.7,0.7l-0.18,0.59l0.51,0.28l0.43,-0.14l0.28,0.35l-1.39,0.72l-6.14,-4.74l-0.58,0.11l-0.19,0.81l0.24,0.54l2.28,1.52l2.09,2.14l2.77,1.18l1.25,-0.68l0.45,1.05l1.27,0.26l-0.44,0.67l0.29,0.56l0.93,-0.19l-0.0,1.24l-0.92,0.41l-0.57,0.73l-0.64,-0.88l-3.14,-1.26l-0.42,-1.53l-0.59,-0.58l-0.87,-0.12l-1.2,0.67l-1.71,-0.44l-0.36,-1.15l-0.71,-0.05l-0.05,1.31l-0.33,0.41l-1.42,-1.31l-0.51,0.09l-0.48,0.57l-0.64,-0.4l-0.99,0.45l-2.22,-0.1l-0.37,0.94l0.34,0.46l1.9,0.22l1.39,-0.31l0.85,0.24l0.56,-0.69l0.62,0.88l1.34,0.43l1.95,-0.31l0.82,0.72l0.84,0.12l0.51,-0.55l0.77,2.44l1.34,0.13l0.23,0.43l1.68,0.71l0.45,0.68l-0.57,1.03l0.56,0.44l1.72,-1.31l0.88,-0.02l0.83,0.65l0.8,-0.26l-0.61,-0.9l0.0,-0.82l-0.46,-0.34l3.98,0.08l0.93,-0.73l2.07,3.52l-0.4,0.7l0.65,3.09l-1.19,-0.58l-0.02,0.88l-30.92,7.82l-37.15,8.4l-19.5,3.35l-11.77,1.24l-0.82,0.62l-28.18,5.01ZM780.58,223.31l0.11,0.08l-0.08,0.06l0.0,-0.03l-0.03,-0.11ZM807.4,244.36l0.53,-1.15l-0.62,-0.62l0.58,-0.97l-0.39,-0.71l-0.03,-0.49l0.44,-0.35l-0.17,-0.73l0.62,-0.3l0.23,-0.6l0.14,-2.33l1.01,-0.39l-0.12,-0.9l0.48,-0.14l-0.26,-1.53l-0.78,-0.4l0.87,-0.57l0.1,-0.96l2.63,-1.01l0.31,2.47l-3.87,10.47l0.17,1.12l-0.48,0.31l-0.33,1.09l0.25,4.27l-1.1,-1.81l0.23,-0.94l-0.33,-1.57l0.28,-0.97l-0.38,-0.29ZM809.95,249.4l0.28,0.05l-0.1,0.2l-0.16,-0.22l-0.02,-0.03Z", "name": "Virginia"}, "US-PA": {"path": "M715.9,159.83l0.63,-0.19l4.29,-3.73l1.12,5.19l0.48,0.31l34.81,-7.92l34.25,-8.63l1.42,0.58l0.71,1.38l0.63,0.13l0.77,-0.33l1.23,0.59l0.14,0.85l0.81,0.41l-0.16,0.58l0.89,2.69l1.9,2.07l2.11,0.75l2.2,-0.2l0.72,0.79l-0.89,0.87l-0.73,1.48l-0.17,2.25l-1.41,3.35l-1.37,1.58l0.04,0.79l1.79,1.71l-0.31,1.65l-0.84,0.43l-0.22,0.66l0.14,1.48l1.04,2.87l0.52,0.25l1.2,-0.18l1.18,2.38l0.95,0.58l0.66,-0.26l0.6,0.9l4.23,2.74l0.12,0.41l-1.28,0.93l-3.71,4.22l-0.23,0.75l0.17,0.9l-1.36,1.13l-0.84,0.15l-1.33,1.08l-0.31,0.65l-1.72,-0.12l-2.03,0.84l-1.15,1.37l-0.41,1.39l-37.2,9.2l-39.07,8.65l-10.03,-48.16l1.92,-1.22l3.07,-3.04Z", "name": "Pennsylvania"}, "US-TN": {"path": "M571.31,340.76l0.86,-0.83l0.29,-1.37l1.0,0.04l0.65,-0.79l-0.99,-4.88l1.41,-1.93l0.06,-1.32l1.18,-0.46l0.36,-0.48l-0.63,-1.31l0.57,-1.21l-0.89,-1.33l2.55,-1.57l1.09,-1.12l-0.14,-0.84l-0.85,-0.53l0.14,-0.19l0.34,-0.16l0.84,0.37l0.46,-0.33l-0.27,-1.31l-0.85,-0.9l0.06,-0.71l0.51,-1.43l1.0,-1.11l-1.35,-2.06l1.37,-0.21l0.61,-0.55l-0.13,-0.64l-1.17,-0.82l0.82,-0.15l0.58,-0.54l0.13,-0.69l-0.58,-1.38l0.02,-0.36l0.37,0.53l0.47,0.08l1.18,-1.15l23.64,-2.81l0.35,-0.41l-0.1,-1.34l-0.83,-2.39l2.98,-0.08l0.82,0.58l22.77,-3.54l7.63,-0.46l7.49,-0.86l8.81,-1.42l23.99,-3.09l1.11,-0.6l29.27,-5.2l0.73,-0.6l3.55,-0.54l-0.4,1.43l0.43,0.85l-0.4,2.0l0.36,0.81l-1.15,-0.03l-1.71,1.79l-1.2,3.88l-0.55,0.7l-0.56,0.08l-0.63,-0.74l-1.44,-0.02l-2.66,1.73l-1.42,2.72l-0.96,0.89l-0.34,-0.34l-0.13,-1.05l-0.73,-0.54l-0.53,0.15l-2.3,1.81l-0.29,1.32l-0.93,-0.24l-0.89,0.48l-0.16,0.76l0.32,0.73l-0.84,2.17l-1.28,0.06l-1.75,1.13l-1.89,2.3l-0.78,0.27l-2.28,2.46l-4.03,0.78l-2.58,1.7l-0.49,1.09l-0.88,0.55l-0.55,0.81l-0.18,2.88l-0.35,0.6l-1.65,0.52l-0.89,-0.16l-1.06,1.14l0.21,5.24l-20.19,3.31l-21.6,3.04l-25.54,2.95l-0.34,0.31l-7.39,0.9l-28.7,3.17Z", "name": "Tennessee"}, "US-ID": {"path": "M132.38,121.27l-0.34,-0.44l0.08,-1.99l0.53,-1.74l1.42,-1.22l2.11,-3.59l1.68,-0.92l1.39,-1.52l1.08,-2.15l0.05,-1.22l2.21,-2.41l1.43,-2.69l0.37,-1.37l2.04,-2.25l1.89,-2.81l0.03,-1.01l-0.79,-2.95l-2.13,-1.94l-0.87,-0.36l-0.85,-1.61l-0.41,-3.02l-0.59,-1.19l0.94,-1.19l-0.12,-2.35l-1.04,-2.68l10.12,-55.38l13.37,2.35l-3.54,20.69l1.29,2.89l0.99,1.27l0.27,1.55l1.17,1.76l-0.12,0.83l0.39,1.14l-0.99,0.95l0.83,1.76l-0.83,0.11l-0.28,0.71l1.93,1.68l1.03,2.03l2.24,1.22l0.54,1.58l1.09,1.33l1.49,2.79l0.08,0.68l1.64,1.81l0.01,1.88l1.79,1.71l-0.07,1.35l0.74,0.19l0.9,-0.58l0.36,0.46l-0.36,0.55l0.07,0.54l1.11,0.96l1.61,0.15l1.81,-0.36l-0.63,2.61l-0.99,0.54l0.25,1.14l-1.83,3.73l0.06,1.71l-0.81,0.07l-0.37,0.54l0.6,1.33l-0.62,0.9l-0.03,1.16l0.96,0.93l-0.37,0.81l0.28,1.01l-1.57,0.43l-1.21,1.41l0.1,1.11l0.46,0.77l-0.13,0.73l-0.82,0.77l-0.2,1.52l1.48,0.63l1.38,1.79l0.78,0.27l1.08,-0.35l0.56,-0.8l1.85,-0.41l1.21,-1.28l0.81,-0.29l0.15,-0.76l0.78,0.81l0.23,0.71l1.05,0.64l-0.42,1.23l0.73,0.95l-0.34,1.38l0.57,1.34l-0.21,1.61l1.54,2.64l0.31,1.72l0.82,0.36l0.67,2.08l-0.18,0.98l-0.76,0.64l0.51,1.89l1.24,1.16l0.3,0.79l0.81,0.08l0.86,-0.37l1.04,0.93l1.06,2.79l-0.5,0.81l0.89,1.83l-0.28,0.6l0.11,0.98l2.29,2.41l0.97,-0.14l-0.01,-1.14l1.07,-0.89l0.93,-0.22l4.53,1.62l0.69,-0.32l0.67,-1.35l1.19,-0.39l2.25,0.93l3.3,-0.1l0.96,0.88l2.29,-0.58l3.22,0.78l0.45,-0.49l-0.67,-0.76l0.26,-1.06l0.74,-0.48l-0.07,-0.96l1.23,-0.51l0.48,0.37l1.07,2.11l0.12,1.11l1.36,1.95l0.73,0.45l-6.27,53.81l-47.43,-6.31l-46.93,-7.72l6.88,-39.13l1.12,-1.18l1.07,-2.67l-0.21,-1.74l0.74,-0.15l0.77,-1.62l-0.9,-1.26l-0.18,-1.2l-1.24,-0.08l-0.64,-0.81l-0.88,0.29Z", "name": "Idaho"}, "US-NV": {"path": "M139.35,328.89l-12.68,-16.92l-36.56,-51.05l-25.32,-34.49l13.69,-64.13l46.84,9.23l46.95,7.73l-18.7,125.71l-0.9,1.16l-0.99,2.19l-0.44,0.17l-1.34,-0.22l-0.98,-2.24l-0.7,-0.63l-1.41,0.22l-1.95,-1.02l-1.6,0.23l-1.78,0.96l-0.76,2.48l0.88,2.59l-0.6,0.97l-0.24,1.3l0.38,3.12l-0.76,2.54l0.77,3.71l-0.13,3.07l-0.3,1.07l-1.04,0.31l0.2,1.31l-0.52,0.62Z", "name": "Nevada"}, "US-TX": {"path": "M276.03,412.2l33.04,1.98l32.76,1.35l0.41,-0.39l3.6,-98.61l25.84,0.61l26.27,0.22l0.05,42.05l0.44,0.4l1.02,-0.13l0.78,0.28l3.74,3.82l1.66,0.21l0.88,-0.58l2.49,0.64l0.6,-0.68l0.11,-1.05l0.6,0.75l0.92,0.22l0.38,0.93l0.77,0.78l-0.01,1.64l0.52,0.83l2.85,0.42l1.25,-0.2l1.38,0.89l2.78,0.69l1.82,-0.56l0.62,0.1l1.89,1.8l1.4,-0.11l1.25,-1.43l2.43,0.26l1.67,-0.46l0.1,2.27l0.91,0.67l1.61,0.4l-0.04,2.08l1.56,0.78l1.82,-0.66l1.57,-1.67l1.02,-0.65l0.41,0.19l0.45,1.64l2.01,0.2l0.24,1.05l0.72,0.48l1.47,-0.21l0.88,-0.93l0.38,0.33l0.59,-0.08l0.61,-0.99l0.26,0.41l-0.45,1.23l0.14,0.76l0.67,1.14l0.78,0.42l0.57,-0.04l0.6,-0.5l0.68,-2.36l0.91,-0.65l0.35,-1.54l0.57,-0.14l0.4,0.14l0.29,0.99l0.57,0.64l1.2,0.02l0.83,0.5l1.25,-0.2l0.68,-1.34l0.48,0.15l-0.13,0.7l0.49,0.69l1.21,0.45l0.49,0.72l1.52,-0.05l1.48,1.73l0.52,0.02l0.63,-0.62l0.08,-0.71l1.49,-0.1l0.93,-1.43l1.88,-0.41l1.66,-1.13l1.52,0.83l1.51,-0.22l0.29,-0.83l2.28,-0.73l0.52,-0.55l0.5,0.32l0.38,0.87l1.82,0.42l1.69,-0.06l1.86,-1.14l0.41,-1.05l1.06,0.31l2.24,1.56l1.16,0.17l1.78,2.07l2.14,0.41l1.04,0.92l0.76,-0.11l2.48,0.85l1.04,0.04l0.37,0.79l1.38,0.97l1.44,-0.12l0.39,-0.72l0.8,0.36l0.88,-0.4l0.92,0.35l0.76,-0.15l0.64,0.36l2.22,34.0l1.51,1.67l1.3,0.82l1.24,1.87l0.57,1.63l-0.1,2.64l1.0,1.21l0.85,0.4l-0.12,0.85l0.75,0.54l0.28,0.87l0.65,0.7l-0.19,1.17l1.0,1.02l0.59,1.63l0.5,0.34l0.55,-0.1l-0.16,1.71l0.81,1.22l-0.64,0.25l-0.35,0.68l0.77,1.27l-0.55,0.89l0.19,1.39l-0.75,2.69l-0.74,0.85l-0.36,1.54l-0.79,1.13l0.64,2.0l-0.83,2.27l0.17,1.07l0.75,0.91l-0.11,1.3l0.49,1.6l-0.24,1.41l-1.18,1.78l-1.18,0.4l-1.16,2.72l-0.03,2.1l1.39,1.67l-3.42,0.08l-7.36,3.78l-0.02,-0.43l-0.69,-0.24l-0.23,0.23l-0.78,-0.43l-3.38,1.13l0.65,-1.31l0.35,-1.91l-0.34,-1.48l-0.52,-0.67l-2.07,0.05l-1.18,2.58l-0.42,0.15l-0.36,-0.65l-2.37,-1.23l-0.4,0.31l-0.18,0.82l0.23,0.45l1.07,0.38l-0.3,0.82l0.54,0.81l-0.47,0.64l0.04,0.99l1.48,0.76l-0.44,0.47l0.5,1.12l0.91,0.23l0.28,0.37l-0.4,1.25l-0.45,-0.12l-0.97,0.81l-1.72,2.25l-1.18,-0.4l-0.49,0.12l0.32,1.0l0.08,2.54l-1.85,1.49l-1.9,2.11l-0.96,0.37l-4.1,2.9l-3.3,0.44l-2.54,1.07l-0.2,1.12l-0.75,-0.34l-2.04,0.88l-0.33,-0.34l-1.11,0.18l0.43,-0.87l-0.52,-0.6l-1.43,0.22l-1.22,1.08l-0.6,-0.62l-0.11,-1.2l-1.38,-0.81l-0.5,0.44l0.65,1.44l0.01,1.12l-0.71,0.09l-0.54,-0.44l-0.75,-0.0l-0.55,-1.34l-1.46,-0.37l-0.58,0.39l0.04,0.54l0.94,1.7l0.03,1.23l0.58,0.37l0.37,-0.16l1.13,0.78l-0.75,0.37l-0.12,0.9l0.7,0.23l1.08,-0.55l0.95,0.6l-4.27,2.42l-0.57,-0.13l-0.37,-1.44l-0.5,-0.19l-1.13,-1.46l-0.48,-0.03l-1.05,1.99l1.18,1.61l-0.31,1.04l0.33,0.85l-1.66,1.79l-0.37,0.2l0.37,-0.63l-0.18,-0.72l0.25,-0.73l-0.46,-0.67l-0.52,0.17l-0.71,1.1l0.26,0.72l-0.39,0.94l-0.07,-1.13l-0.52,-0.55l-1.94,1.28l-0.78,-0.33l-0.69,0.51l0.07,0.75l-0.81,0.99l0.02,0.49l1.25,0.63l0.03,0.56l0.78,0.29l0.7,-1.41l0.86,-0.41l0.01,0.62l-2.82,4.35l-1.23,-1.0l-1.36,0.39l-0.32,-0.34l-2.39,0.39l-0.46,-0.31l-0.65,0.16l-0.18,0.58l0.41,0.61l0.55,0.38l1.53,0.03l0.54,1.55l2.07,1.03l-2.7,7.63l-0.2,0.1l-0.39,-0.54l-0.33,0.1l0.18,-0.75l-0.57,-0.43l-2.35,1.95l-1.72,-2.36l-1.18,-0.91l-0.61,0.4l0.09,0.52l1.44,2.0l-0.24,0.46l0.36,0.47l-1.16,-0.21l-0.33,0.63l0.5,0.56l0.89,0.23l1.12,-0.16l0.66,0.62l1.36,0.18l1.0,-0.03l0.99,-0.61l-0.34,1.58l0.24,0.77l-0.98,0.7l0.37,1.59l-1.12,0.14l-0.43,0.41l0.4,2.1l-0.33,1.59l0.45,0.64l0.84,0.24l0.87,2.86l0.71,2.8l-0.91,0.82l0.62,0.49l-0.08,1.28l0.71,0.3l0.18,0.61l0.58,0.29l0.4,1.79l0.68,0.31l0.45,3.21l1.46,0.62l-0.52,1.1l0.31,1.08l-0.62,0.77l-0.84,-0.05l-0.54,0.44l0.09,1.3l-0.49,-0.33l-0.49,0.25l-0.39,-0.67l-1.49,-0.45l-2.91,-2.53l-2.2,-0.18l-0.81,-0.51l-4.2,0.09l-0.9,0.42l-0.79,-0.62l-1.64,0.24l-2.12,-0.89l-0.73,-0.97l-0.6,-0.14l-0.21,-0.72l-1.17,-0.49l-0.99,-0.02l-1.98,-0.87l-1.45,0.39l-0.83,-1.09l-0.6,-0.21l-1.43,-1.38l-1.96,0.01l-1.47,-0.64l-0.86,0.11l-1.61,-0.41l0.35,-0.9l-0.3,-0.97l-1.11,-0.7l0.3,-0.29l-0.26,-1.44l0.56,-1.21l-0.35,-0.67l0.88,-0.38l0.12,-0.54l-1.03,-0.54l-0.91,0.67l-0.32,-0.31l0.03,-1.09l-0.59,-0.83l0.31,-0.09l0.53,-1.43l-0.22,-0.71l-0.71,0.09l-1.02,0.96l-0.57,-0.89l-0.85,-0.28l-0.26,-1.34l-1.51,-0.77l0.29,-0.65l-0.24,-0.76l0.34,-2.18l-0.44,-0.96l-1.04,-1.01l0.65,-1.99l0.05,-1.19l-0.18,-0.7l-0.54,-0.32l-0.15,-1.81l-1.85,-1.44l-0.85,0.21l-0.3,-0.41l-0.81,-0.11l-0.74,-1.31l-2.22,-1.71l0.01,-0.69l-0.51,-0.58l0.12,-0.87l-0.97,-0.92l-0.08,-0.75l-1.12,-0.61l-1.3,-2.88l-2.66,-1.47l-0.38,-0.91l-1.13,-0.59l-0.06,-1.16l-0.82,-1.18l-0.59,-1.95l0.41,-0.22l-0.04,-0.72l-1.03,-0.49l-0.26,-1.29l-0.82,-0.58l-0.94,-1.73l-0.61,-2.38l-1.85,-2.36l-0.87,-4.24l-1.81,-1.34l0.05,-0.7l-0.75,-1.21l-4.07,-2.82l-0.29,-1.39l1.68,-0.02l0.79,-0.84l-0.29,-0.39l-0.65,-0.06l-0.09,-0.72l0.08,-0.88l0.64,-0.7l-0.11,-0.74l-0.48,0.05l-0.77,0.72l-0.45,0.69l0.01,0.66l-0.88,0.15l-0.39,1.07l-0.54,-0.04l-1.8,-1.75l0.06,-0.67l-0.41,-0.68l-0.77,-0.2l-0.64,0.29l-0.33,-0.53l-0.73,-0.13l-0.89,-2.16l-1.49,-0.8l-0.85,0.27l-0.44,-0.87l-0.61,0.1l-0.25,0.61l-1.05,0.16l-2.88,-0.47l-0.39,-0.38l-1.48,-0.03l-0.78,0.29l-0.77,-0.44l-2.66,0.27l-2.42,-1.08l-1.14,-0.89l-0.68,-0.07l-1.03,0.82l-0.64,1.61l-1.99,-0.17l-0.51,0.44l-0.49,-0.16l-2.52,0.78l-3.07,6.25l-0.18,1.77l-0.76,0.67l-0.38,1.8l0.34,0.59l-1.96,0.98l-0.75,1.32l-1.06,0.61l-0.62,0.83l-0.29,1.09l-2.91,-0.34l-1.04,-0.87l-0.54,0.3l-1.69,-1.2l-1.31,-1.63l-2.89,-0.85l-1.15,-0.95l-0.02,-0.67l-0.42,-0.4l-2.75,-0.51l-2.27,-1.03l-1.89,-1.75l-0.91,-1.53l-0.96,-0.91l-1.53,-0.29l-1.76,-1.25l-0.22,-0.56l-1.14,-0.96l-0.83,-2.9l-0.86,-1.01l-0.24,-1.1l-0.76,-1.27l-0.26,-2.34l0.52,-3.04l-3.0,-5.06l-0.06,-1.93l-1.26,-2.51l-0.99,-0.44l-0.43,-1.23l-1.43,-0.81l-2.15,-2.17l-1.02,-0.1l-2.01,-1.25l-3.18,-3.35l-0.59,-1.55l-3.12,-2.55l-1.58,-2.45l-1.19,-0.95l-0.61,-1.05l-4.41,-2.6l-2.4,-5.42l-1.37,-1.08l-1.12,-0.08l-1.76,-1.68l-0.78,-3.04ZM501.74,467.74l-0.32,0.17l0.18,-0.16l0.14,-0.02ZM498.34,470.41l-0.09,0.11l-0.04,0.02l0.12,-0.13ZM497.45,471.84l0.56,0.11l-2.39,1.98l1.6,-1.46l0.24,-0.63ZM467.22,488.72l0.02,0.02l-0.02,0.01l-0.0,-0.03ZM453.63,546.67l0.75,-0.5l0.25,-0.67l0.11,1.07l-1.11,0.1ZM460.58,499.32l-0.15,-0.59l1.22,-0.36l-0.28,0.33l-0.79,0.63ZM463.2,497.36l0.1,-0.23l1.26,-0.88l-0.91,0.84l-0.45,0.26ZM465.48,495.65l0.28,-0.24l0.47,-0.04l-0.24,0.13l-0.5,0.15ZM457.65,502.44l0.71,-1.63l0.64,-0.71l-0.02,0.75l-1.33,1.59ZM450.0,517.92l0.11,-0.75l0.21,-0.49l-0.02,0.05l-0.3,1.18ZM450.93,514.97l0.2,-0.61l0.22,-0.56l-0.42,1.17ZM451.46,513.55l0.69,-1.73l0.23,-0.76l0.12,0.06l-1.04,2.43Z", "name": "Texas"}, "US-NH": {"path": "M829.28,105.31l0.2,-1.33l-1.43,-5.38l0.53,-1.45l-0.28,-2.22l1.0,-1.86l-0.13,-2.3l0.64,-2.28l-0.44,-0.62l0.29,-2.3l-0.93,-3.8l0.08,-0.7l0.3,-0.45l1.83,-0.8l0.7,-1.39l1.43,-1.62l0.74,-1.8l-0.25,-1.12l0.52,-0.62l-2.34,-3.49l0.87,-3.26l-0.11,-0.78l-0.81,-1.29l0.28,-0.59l-0.23,-0.7l0.48,-3.2l-0.36,-0.82l0.91,-1.49l2.43,0.33l0.65,-0.86l12.98,34.83l0.84,3.65l2.59,2.21l0.88,0.34l0.36,1.6l1.71,1.31l0.0,0.35l0.77,0.23l-0.06,0.58l-0.46,3.09l-1.57,0.24l-1.32,1.19l-0.51,0.94l-0.96,0.37l-0.5,1.68l-1.1,1.43l-17.6,4.74l-1.69,-1.43l-0.41,-0.88l-0.1,-2.0l0.54,-0.59l0.03,-0.52l-1.02,-5.18Z", "name": "New Hampshire"}, "US-NY": {"path": "M821.32,168.46l-0.84,-0.72l0.83,-3.22l1.03,-0.3l0.37,-0.48l0.74,0.21l0.64,-0.32l-0.06,-0.58l0.43,-0.05l0.28,-0.66l0.72,-0.32l-0.21,-1.42l0.73,-0.46l0.35,0.56l1.04,-0.16l0.49,-0.33l0.01,-0.54l1.46,-0.18l0.24,-0.74l1.66,0.02l0.91,-0.54l0.45,-1.21l0.61,0.24l0.43,-0.5l4.32,-1.28l2.35,-1.12l2.36,-2.84l0.18,0.16l-2.53,3.41l-0.01,0.46l0.56,0.38l1.59,-0.33l0.28,0.61l-1.3,1.19l-2.05,0.53l-0.37,0.58l-1.16,0.41l0.23,0.43l-0.24,0.3l-0.68,-0.16l-0.74,0.7l-1.04,0.17l-0.37,0.55l-1.41,0.45l-0.26,0.67l-1.34,0.19l-0.44,0.7l-1.35,0.96l-2.76,1.33l-1.02,0.88l-1.04,0.09l-0.32,0.93l-0.28,0.03l-0.26,-0.68l-1.45,-0.25l-0.88,0.74l0.07,0.96l-0.94,0.56ZM843.65,154.91l0.88,-2.14l1.18,-0.48l0.6,-0.92l0.81,0.34l0.13,-0.83l0.75,0.63l-3.84,3.68l-0.5,-0.28ZM844.52,149.04l0.06,-0.06l0.18,-0.06l-0.11,0.19l-0.13,-0.07ZM844.28,150.64l0.16,0.07l0.26,0.04l-0.61,0.15l0.19,-0.26ZM721.53,155.41l3.76,-3.84l1.27,-2.19l1.75,-1.86l1.16,-0.78l1.28,-3.35l2.09,-2.13l-0.21,-1.83l-1.61,-2.41l0.42,-1.13l-0.17,-0.78l-0.83,-0.53l-2.09,-0.0l0.04,-0.99l-0.58,-2.23l4.97,-2.93l4.48,-1.79l2.38,-0.2l1.84,-0.74l5.63,-0.24l3.12,1.25l3.16,-1.68l5.48,-1.06l0.59,0.45l0.68,-0.2l0.12,-0.98l3.23,-1.85l0.69,-2.05l1.87,-1.76l0.78,-1.26l1.11,0.03l1.13,-0.52l1.06,-1.63l-0.46,-0.69l0.36,-1.2l-0.25,-0.51l-0.64,0.02l-0.17,-1.17l-0.94,-1.58l-1.01,-0.62l0.12,-0.18l0.59,0.39l0.53,-0.27l0.74,-1.43l-0.01,-0.91l0.81,-0.64l-0.01,-0.98l-0.93,-0.19l-0.6,0.7l-0.28,0.12l0.56,-1.3l-0.81,-0.63l-1.26,0.05l-0.87,0.77l-0.98,-0.7l2.05,-2.5l1.78,-1.47l1.67,-2.63l0.7,-0.56l0.89,-1.54l0.07,-0.56l-0.49,-0.94l0.78,-1.9l4.82,-7.61l4.76,-4.5l2.83,-0.51l19.64,-5.65l0.4,0.87l-0.08,2.0l1.01,1.22l0.43,3.79l2.29,3.24l-0.09,1.89l0.85,2.41l-0.59,1.07l-0.0,3.41l0.71,0.89l1.32,2.76l0.19,1.08l0.61,0.84l0.12,3.92l0.55,0.85l0.54,0.07l0.53,-0.61l0.06,-0.87l0.33,-0.07l1.05,1.12l3.86,14.47l0.11,1.59l0.62,1.09l0.33,14.91l0.6,0.62l3.57,16.22l1.26,1.34l-2.82,3.18l0.03,0.54l1.74,1.62l-1.86,3.36l0.21,1.06l-1.03,0.45l-0.24,-4.26l-0.56,-2.23l-0.74,-1.62l-1.46,-1.1l-0.17,-1.13l-0.7,-0.09l-0.42,1.33l0.8,1.45l0.94,0.69l0.95,2.79l-13.73,-4.05l-1.28,-1.47l-2.38,0.24l-0.63,-0.43l-1.06,-0.15l-1.74,-1.91l-0.75,-2.33l0.12,-0.72l-0.36,-0.63l-0.56,-0.21l0.09,-0.46l-0.35,-0.42l-1.64,-0.67l-1.08,0.32l-0.53,-1.22l-1.92,-0.93l-34.57,8.72l-34.4,7.84l-1.11,-5.14ZM817.91,170.84l0.35,-0.91l-0.16,-1.32l1.12,-0.32l0.34,0.32l-0.38,0.97l-1.26,1.26ZM729.5,136.49l0.03,-0.69l0.78,-0.07l-0.37,1.09l-0.43,-0.33Z", "name": "New York"}, "US-HI": {"path": "M298.48,589.39l-0.18,-1.01l-1.54,-3.01l-1.01,-1.15l0.02,-1.22l0.53,-1.37l3.84,-4.27l0.75,-4.3l0.79,-2.44l-0.28,-2.12l0.34,-1.47l0.97,-0.64l1.3,-0.07l1.05,-0.42l1.31,0.25l2.26,-0.99l1.3,-0.07l0.99,-0.98l-0.03,-2.68l0.29,-1.04l0.82,-1.33l0.97,-0.43l2.21,2.03l-0.08,1.42l1.58,3.24l1.4,0.91l1.72,2.22l3.34,6.53l0.49,2.76l-1.76,2.78l0.14,0.54l1.62,0.56l0.23,0.53l-0.68,1.38l-0.07,1.58l1.47,3.99l-0.29,0.34l-1.95,0.56l-1.23,-0.27l-2.08,0.34l-3.11,-0.42l-2.64,-0.85l-0.76,-0.79l-1.19,-0.58l-2.44,0.12l-4.01,-0.54l-1.64,0.28l-0.92,1.02l-3.83,1.11ZM306.47,542.25l1.23,-2.02l0.53,-1.67l-0.74,-1.06l-0.93,0.01l-1.23,-1.84l-0.25,-2.17l0.26,-0.83l0.75,-0.73l1.59,-0.51l0.71,0.35l0.6,1.14l0.08,3.24l2.5,1.07l1.4,0.1l1.57,1.41l0.55,2.77l0.46,0.29l0.1,0.91l1.82,2.24l-0.11,0.94l-1.17,0.93l-1.38,0.09l-1.99,-0.52l-1.63,-1.1l-2.59,-0.42l-1.99,-1.51l-0.12,-1.11ZM297.87,518.73l3.75,3.65l0.77,0.58l0.82,-0.14l-0.08,0.78l0.9,1.01l2.78,1.54l0.71,0.98l-1.26,0.3l-2.78,-0.67l-3.58,-3.88l-4.47,-2.84l0.39,-0.59l1.42,-0.11l0.63,-0.62ZM302.23,542.72l-2.54,-1.48l-0.04,-0.2l2.91,0.18l0.31,0.71l-0.63,0.79ZM297.9,532.9l-0.83,-0.51l-0.02,-0.56l1.02,-1.89l-0.82,-1.66l0.18,-0.37l1.26,0.5l1.73,1.57l0.51,2.43l-0.07,0.53l-1.01,0.49l-1.94,-0.51ZM281.6,504.1l0.34,-1.82l-0.24,-1.37l0.32,-0.93l-0.26,-1.35l0.7,-1.2l-0.18,-0.95l2.51,1.67l2.21,-0.12l0.92,-0.54l1.66,0.13l0.3,0.96l-0.43,1.34l0.01,2.02l0.34,1.03l-0.65,0.36l-0.51,1.07l0.54,2.14l0.9,0.29l0.12,1.28l-0.41,1.19l0.44,1.05l-0.8,0.09l-0.3,-0.63l-2.22,-0.69l-0.85,-2.97l-0.9,0.19l-0.3,-0.61l0.93,-0.1l0.41,-0.6l-0.36,-0.81l-0.88,-0.72l-0.38,0.16l-0.44,-0.42l-0.38,0.32l0.12,1.58l-2.3,-1.0ZM258.46,463.92l1.68,-0.35l0.93,-0.56l1.11,0.43l3.05,0.32l0.62,1.16l0.88,-0.05l2.28,1.88l0.22,1.27l-0.2,0.96l-0.4,0.48l-1.74,0.75l-1.12,1.64l-3.25,0.41l-3.02,-3.19l-0.21,-1.61l-1.4,-1.87l0.04,-1.02l0.53,-0.64ZM245.6,462.78l0.04,-0.98l0.76,-0.58l3.31,-0.05l1.1,-0.71l0.49,0.42l-1.16,0.6l-0.33,0.67l-2.69,-0.26l-1.51,0.88Z", "name": "Hawaii"}, "US-VT": {"path": "M804.93,72.62l26.0,-7.96l0.89,1.84l-0.74,2.37l-0.03,1.54l2.22,2.74l-0.51,0.58l0.26,1.13l-0.66,1.6l-1.35,1.49l-0.64,1.32l-1.72,0.7l-0.62,0.92l-0.1,0.98l0.93,3.73l-0.29,2.44l0.4,0.54l-0.6,2.11l0.15,2.19l-1.0,1.87l0.27,2.36l-0.53,1.54l1.43,5.44l-0.22,1.22l1.04,5.3l-0.58,0.85l0.11,2.3l0.6,1.26l1.5,1.1l-11.71,3.08l-4.3,-16.78l-1.71,-1.59l-0.9,0.25l-0.3,1.19l-0.12,-0.25l-0.11,-3.9l-0.68,-1.0l-0.14,-0.98l-1.36,-2.85l-0.63,-0.68l0.01,-3.14l0.6,-1.14l-0.86,-2.56l0.08,-1.93l-0.39,-0.91l-1.55,-1.63l-0.38,-0.81l-0.41,-3.71l-1.03,-1.26l0.11,-1.87l-0.42,-1.0Z", "name": "Vermont"}, "US-NM": {"path": "M230.76,422.48l11.81,-123.55l25.64,2.24l26.07,1.86l26.1,1.45l25.72,1.02l-0.31,10.23l-0.74,0.39l-3.59,98.59l-32.35,-1.33l-33.5,-2.01l-0.44,0.76l0.54,2.31l0.44,1.26l1.0,0.77l-30.51,-2.46l-0.43,0.36l-0.81,9.45l-14.63,-1.33Z", "name": "New Mexico"}, "US-NC": {"path": "M826.21,289.21l0.06,-0.04l-0.02,0.03l-0.04,0.02ZM818.93,272.14l0.2,0.23l-0.05,0.01l-0.16,-0.24ZM821.18,276.42l0.19,0.15l-0.02,0.18l-0.05,-0.08l-0.12,-0.25ZM676.2,321.46l0.92,0.17l1.52,-0.39l0.42,-0.39l0.52,-0.97l0.12,-2.7l1.34,-1.19l0.47,-1.05l2.24,-1.46l2.12,-0.52l0.75,0.18l1.32,-0.52l2.36,-2.52l0.78,-0.25l1.84,-2.29l1.48,-1.0l1.55,-0.19l1.15,-2.65l-0.28,-1.22l1.65,0.06l0.51,-1.65l0.93,-0.77l1.08,-0.77l0.51,1.51l1.06,0.33l1.34,-1.17l1.35,-2.64l2.48,-1.59l0.79,0.08l0.82,0.8l1.06,-0.21l0.84,-1.07l1.47,-4.18l1.08,-1.09l1.47,0.09l0.44,-0.31l-0.69,-1.26l0.4,-2.0l-0.42,-0.9l0.38,-1.25l7.41,-0.86l19.53,-3.36l37.18,-8.41l31.09,-7.87l0.4,1.21l3.53,3.24l1.0,1.52l-1.2,-1.0l-0.16,-0.63l-0.92,-0.4l-0.52,0.05l-0.24,0.65l0.66,0.54l0.59,1.56l-0.53,0.01l-0.91,-0.75l-2.31,-0.8l-0.4,-0.48l-0.55,0.13l-0.31,0.69l0.14,0.64l1.37,0.44l1.69,1.38l-1.1,0.66l-2.48,-1.2l-0.35,0.5l0.14,0.42l1.6,1.18l-1.84,-0.33l-2.23,-0.87l-0.46,0.14l0.01,0.48l0.6,0.7l1.7,0.83l-0.97,0.57l0.0,0.6l-0.43,0.53l-1.47,0.75l-0.89,-0.77l-0.61,0.22l-0.1,0.35l-0.2,-0.13l-1.31,-2.32l0.21,-2.63l-0.42,-0.48l-0.89,-0.22l-0.37,0.64l0.62,0.71l-0.43,0.99l-0.02,1.03l0.49,1.73l1.6,2.2l-0.31,1.27l0.48,0.29l2.96,-0.59l2.09,-1.49l0.27,0.01l0.37,0.79l0.76,-0.34l1.56,0.05l0.16,-0.72l-0.57,-0.32l1.29,-0.76l2.04,-0.46l-0.1,1.19l0.64,0.29l-0.6,0.88l0.88,1.19l-0.84,0.1l-0.19,0.66l1.38,0.46l0.26,0.94l-1.21,0.05l-0.19,0.66l0.66,0.59l1.24,-0.16l0.52,0.26l0.41,-0.38l0.18,-1.94l-0.74,-3.33l0.41,-0.48l0.56,0.43l0.94,0.06l0.28,-0.58l-0.29,-0.44l0.48,-0.57l1.71,1.84l-0.01,1.4l0.62,0.9l-0.78,0.65l0.9,1.14l-0.08,0.37l-0.42,0.55l-0.78,0.09l-0.9,-0.86l-0.32,0.34l0.13,1.26l-1.08,1.62l0.2,0.56l-0.32,0.22l-0.15,0.98l-0.74,0.55l0.1,0.91l-0.9,0.96l-1.05,0.21l-0.6,-0.37l-0.52,0.52l-0.93,-0.81l-0.86,0.1l-0.4,-0.82l-0.58,-0.21l-0.52,0.38l0.08,0.94l-0.52,0.22l-1.42,-1.24l1.31,-0.4l0.23,-0.88l-0.57,-0.42l-2.02,0.31l-1.14,1.01l0.29,0.67l0.44,0.16l0.09,0.82l0.35,0.25l-0.03,0.12l-0.57,-0.34l-1.69,0.83l-1.12,-0.43l-1.45,0.06l-3.32,-0.7l0.42,1.08l0.97,0.45l0.36,0.64l1.5,-0.21l4.02,1.02l3.5,0.11l0.47,0.42l-0.06,0.52l-0.99,0.05l-0.25,0.72l-1.61,1.44l0.32,0.58l1.85,0.01l-2.55,3.49l-1.66,0.04l-1.6,-0.98l-0.9,-0.19l-1.21,-1.02l-1.12,0.07l0.07,0.47l1.04,1.14l2.32,2.09l2.67,0.26l1.31,0.49l1.7,-2.16l0.51,0.47l1.17,0.33l0.4,-0.57l-0.55,-0.9l0.87,0.16l0.19,0.57l0.66,0.23l1.63,-1.19l-0.18,0.61l0.29,0.57l-0.29,0.38l-0.43,-0.21l-0.41,0.37l0.03,0.9l-0.97,1.72l0.01,0.78l-0.71,-0.07l-0.06,-0.74l-1.12,-0.61l-0.42,0.47l0.27,1.45l-0.52,-1.1l-0.65,-0.15l-1.22,1.08l-0.21,0.53l0.25,0.27l-2.03,0.32l-2.75,1.83l-0.67,-1.03l-0.75,-0.3l-0.37,0.49l0.43,1.25l-0.57,-0.01l-0.1,0.82l-0.94,1.72l-0.91,0.84l-0.59,-0.26l0.48,-0.69l-0.02,-0.77l-1.06,-0.93l-0.08,-0.52l-1.69,-0.41l-0.16,0.47l0.43,1.16l0.2,0.33l0.58,0.07l0.3,0.61l-0.88,0.37l-0.08,0.71l0.65,0.64l0.76,0.18l-0.01,0.37l-2.12,1.67l-1.91,2.65l-2.0,4.3l-0.3,2.66l-1.08,-1.82l-0.55,-0.17l-0.3,0.48l1.17,3.95l-0.63,2.27l-3.9,0.19l-1.43,0.65l-0.35,-0.52l-0.58,-0.18l-0.54,1.07l-1.89,1.14l-0.61,-0.02l-23.23,-15.34l-1.04,-0.02l-18.66,3.49l-0.65,-2.76l-3.25,-2.84l-0.47,0.08l-1.23,1.31l-0.01,-1.28l-0.81,-0.54l-22.8,3.35l-0.64,-0.27l-0.62,0.46l-0.25,0.65l-3.98,1.92l-0.89,1.23l-1.01,0.08l-4.78,2.65l-20.93,3.92l-0.34,-4.55l0.7,-0.95ZM816.35,271.22l0.18,0.35l0.24,0.38l-0.45,-0.41l0.02,-0.32ZM806.89,290.01l0.2,0.32l-0.16,-0.09l-0.04,-0.24ZM791.78,323.84l0.08,0.8l-0.07,-0.21l-0.01,-0.59ZM814.67,298.87l0.16,-0.36l0.15,0.07l-0.13,0.29l-0.18,0.01ZM812.11,298.83l-0.06,-0.28l-0.03,-0.11l0.3,0.26l-0.21,0.13ZM812.33,263.77l0.36,-0.24l0.15,0.42l-0.42,0.07l-0.1,-0.25ZM791.29,329.09l0.04,-0.08l0.22,0.03l-0.0,0.09l-0.25,-0.05Z", "name": "North Carolina"}, "US-ND": {"path": "M438.24,42.74l2.06,6.89l-0.73,2.53l0.57,2.36l-0.27,1.17l0.47,1.99l0.01,3.26l1.42,3.95l0.45,0.54l-0.08,0.97l0.39,1.52l0.62,0.74l1.48,3.74l-0.06,3.89l0.42,0.7l0.5,8.34l0.51,1.53l0.51,0.25l-0.47,2.64l0.36,1.63l-0.14,1.75l0.69,1.1l0.2,2.16l0.49,1.13l1.8,2.56l0.15,2.2l0.51,1.08l0.17,1.39l-0.24,1.36l0.28,1.74l-27.87,0.73l-28.36,0.19l-28.35,-0.36l-28.46,-0.92l2.75,-65.39l23.07,0.78l25.54,0.42l25.54,-0.06l24.08,-0.49Z", "name": "North Dakota"}, "US-NE": {"path": "M422.3,173.85l3.92,2.71l3.93,1.9l1.33,-0.22l0.51,-0.47l0.36,-1.08l0.48,-0.2l2.49,0.34l1.31,-0.47l1.58,0.25l3.44,-0.65l2.37,1.98l1.4,0.14l1.55,0.77l1.45,0.08l0.88,1.1l1.48,0.17l-0.06,0.98l1.68,2.08l3.31,0.6l-0.02,2.55l1.13,1.94l0.01,2.29l1.15,1.07l0.33,1.71l1.73,1.46l0.07,1.88l1.5,2.1l-0.49,2.33l0.44,3.09l0.52,0.54l0.93,-0.2l-0.04,1.24l1.21,0.5l-0.4,2.36l0.21,0.44l1.12,0.4l-0.6,0.77l-0.09,1.01l0.13,0.59l0.82,0.5l0.16,1.45l-0.26,0.92l0.26,1.27l0.55,0.61l0.3,1.92l-0.22,1.33l0.23,0.72l-0.57,0.92l0.02,0.79l0.44,0.88l1.23,0.63l0.25,2.5l1.1,0.51l0.03,0.79l1.18,2.75l-0.23,0.96l1.16,0.21l0.8,0.99l1.1,0.24l-0.15,0.96l1.31,1.68l-0.21,1.12l0.51,0.91l-26.12,1.04l-27.81,0.63l-27.82,0.14l-27.86,-0.35l0.46,-21.63l-0.39,-0.41l-32.33,-1.04l1.85,-43.2l43.32,1.22l44.63,-0.04Z", "name": "Nebraska"}, "US-LA": {"path": "M508.61,412.57l-1.33,-21.74l51.4,-4.07l0.34,0.83l1.48,0.65l-0.92,1.35l-0.25,2.13l0.49,0.72l1.17,0.31l-1.21,0.47l-0.45,0.78l0.45,1.36l1.04,0.84l0.08,2.14l0.46,0.54l1.51,0.74l0.45,1.05l1.42,0.44l-0.87,1.22l-0.85,2.34l-0.75,0.04l-0.52,0.51l-0.02,0.73l0.63,0.72l-0.22,1.16l-1.34,0.95l-1.08,1.89l-1.37,0.67l-0.68,0.82l-0.79,2.41l-0.25,3.52l-1.54,1.74l0.13,1.2l0.62,0.96l-0.35,2.37l-1.6,0.29l-0.59,0.57l0.28,0.97l0.64,0.59l-0.25,1.41l0.98,1.51l-1.18,1.18l-0.08,0.45l0.4,0.23l6.17,-0.55l29.21,-2.92l-0.68,3.47l-0.52,1.02l-0.2,2.24l0.69,0.98l-0.09,0.66l0.6,1.0l1.31,0.7l1.22,1.42l0.14,0.88l0.89,1.38l0.14,1.05l1.11,1.84l-1.85,0.39l-0.38,-0.08l-0.01,-0.56l-0.53,-0.57l-1.28,0.27l-1.18,-0.59l-1.51,0.17l-0.61,-0.98l-1.24,-0.86l-2.84,-0.47l-1.24,0.63l-1.39,2.29l-1.3,1.42l-0.42,0.91l0.07,1.2l0.55,0.89l0.82,0.57l4.24,0.82l3.34,-1.0l1.32,-1.19l0.68,-1.2l0.34,0.59l1.08,0.43l0.59,-0.4l0.81,0.03l0.5,-0.46l-0.76,1.21l-1.11,-0.12l-0.57,0.32l-0.38,0.62l0.0,0.83l0.76,1.22l1.48,-0.02l0.65,0.89l1.1,0.48l1.44,-0.66l0.46,-1.11l-0.02,-1.37l0.93,-0.57l0.42,-0.99l0.23,0.05l0.1,1.16l-0.24,0.25l0.19,0.57l0.42,0.15l-0.07,0.75l1.34,1.08l0.35,-0.16l-0.48,0.59l0.18,0.63l-0.24,0.17l-0.84,-0.71l-0.71,-0.08l-1.0,1.89l-0.84,0.14l-0.46,0.53l0.16,1.19l-1.59,-0.6l-0.43,0.19l0.04,0.46l1.14,1.06l-1.17,-0.14l-0.92,0.6l0.68,0.43l1.26,2.04l2.73,0.97l-0.08,1.2l0.33,0.4l2.07,-0.31l0.77,0.17l0.17,0.53l0.73,0.32l1.35,-0.34l0.53,0.78l1.08,-0.46l1.13,0.73l0.14,0.3l-0.4,0.62l1.53,0.86l-0.39,0.65l0.39,0.58l-0.18,0.62l-0.95,1.49l-1.3,-1.55l-0.68,0.34l0.1,0.66l-0.38,0.12l0.41,-1.88l-1.32,-0.76l-0.51,0.5l0.2,1.17l-0.54,0.45l-0.27,-1.02l-0.57,-0.25l-0.89,-1.27l0.03,-0.77l-0.96,-0.14l-0.47,0.5l-1.41,-0.17l-0.74,-0.77l-2.31,-0.09l0.38,-0.86l-0.13,-0.66l-0.64,-0.69l-0.91,0.04l0.1,-0.96l-0.37,-0.36l-0.91,-0.03l-0.22,0.59l-0.85,-0.38l-0.48,0.27l-2.61,-1.26l-1.24,-0.02l-0.67,-0.64l-0.61,0.18l-0.3,0.56l-0.05,1.25l1.72,0.94l1.67,0.35l-0.16,0.92l0.28,0.4l-0.34,0.34l0.23,0.68l-0.76,0.94l-0.03,0.66l0.81,0.97l-0.95,1.43l-1.33,0.94l-0.76,-1.15l0.22,-1.5l-0.35,-0.92l-0.49,-0.18l-0.4,0.36l-1.15,-1.08l-0.6,0.42l-0.76,-1.05l-0.62,-0.2l-0.64,1.33l-0.85,0.26l-0.89,-0.53l-0.85,0.53l-0.1,0.62l0.48,0.41l-0.67,0.56l-0.13,1.44l-0.45,0.13l-0.4,0.84l-0.92,0.08l-0.11,-0.68l-1.6,-0.4l-0.76,0.97l-1.92,-0.93l-0.3,-0.54l-0.99,0.01l-0.35,0.6l-1.15,-0.51l0.42,-0.4l0.0,-1.46l-0.38,-0.57l-1.89,-1.19l-0.08,-0.54l-0.83,-0.71l-0.09,-0.91l0.73,-1.15l-0.34,-1.14l-0.88,-0.19l-0.34,0.57l0.16,0.43l-0.58,0.81l0.04,0.91l-1.79,-0.4l0.07,-0.38l-0.47,-0.54l-1.96,0.76l-0.7,-2.21l-1.32,0.23l-0.18,-2.12l-1.3,-0.35l-1.89,0.3l-1.08,0.65l-0.21,-0.71l0.84,-0.26l-0.05,-0.8l-0.6,-0.58l-1.03,-0.1l-0.85,0.42l-0.94,-0.15l-0.4,0.8l-1.99,1.11l-0.63,-0.31l-1.29,0.71l0.53,1.37l0.81,0.31l1.04,1.55l-1.27,0.36l-1.81,1.06l-7.62,-0.92l-6.69,-2.31l-3.45,-0.65l-6.85,0.69l-3.4,0.8l-1.57,0.73l-0.91,-1.41l1.2,-0.45l0.79,-0.98l0.27,-2.3l-0.59,-0.84l1.15,-1.62l0.23,-1.59l-0.5,-1.83l0.07,-1.46l-0.66,-0.7l-0.21,-1.04l0.83,-2.21l-0.63,-1.95l0.76,-0.84l0.3,-1.49l0.78,-0.94l0.79,-2.83l-0.18,-1.42l0.58,-0.97l-0.75,-1.33l0.84,-0.39l0.19,-0.44l-0.89,-1.35l0.03,-2.13l-1.07,-0.23l-0.57,-1.57l-0.92,-0.84l0.28,-1.27l-0.81,-0.75l-0.33,-0.95l-0.64,-0.34l0.22,-0.98l-1.16,-0.58l-0.81,-0.93l0.16,-2.45l-0.68,-1.93l-1.33,-1.98l-2.63,-2.2ZM607.03,467.01l-0.03,-0.03l-0.07,-0.04l0.13,-0.01l-0.03,0.08ZM607.05,465.4l-0.02,-0.01l0.03,-0.01l-0.01,0.02ZM566.62,468.53l-1.99,-0.42l-0.66,-0.5l0.73,-0.43l0.35,-0.75l0.39,0.49l0.83,0.21l-0.14,0.6l0.5,0.81ZM549.99,462.56l1.73,-1.05l3.34,1.07l-0.69,0.56l-0.17,0.81l-0.68,0.17l-3.52,-1.57Z", "name": "Louisiana"}, "US-SD": {"path": "M336.18,128.72l0.3,-0.53l0.75,-19.91l28.47,0.92l28.37,0.36l28.37,-0.19l27.75,-0.73l-0.18,1.7l-0.73,1.71l-2.9,2.46l-0.42,1.27l1.59,2.13l1.06,2.06l0.54,0.36l1.74,0.24l1.01,0.84l0.57,1.02l1.45,38.8l-1.84,0.09l-0.42,0.56l0.24,1.43l0.88,1.14l0.01,1.45l-0.65,0.36l0.17,1.47l0.48,0.43l1.09,0.04l0.33,1.68l-0.16,0.91l-0.62,0.83l0.02,1.73l-0.68,2.45l-0.49,0.44l-0.67,1.88l0.5,1.1l1.33,1.08l-0.16,0.62l0.64,0.66l0.35,1.15l-1.65,-0.28l-0.34,-0.94l-0.85,-0.73l0.19,-0.61l-0.28,-0.59l-1.58,-0.23l-1.03,-1.18l-1.57,-0.11l-1.5,-0.75l-1.34,-0.12l-2.38,-1.99l-3.78,0.59l-1.65,-0.25l-1.19,0.46l-2.62,-0.33l-0.98,0.48l-0.76,1.44l-0.72,0.05l-3.66,-1.82l-4.12,-2.8l-44.78,0.05l-43.29,-1.22l1.79,-43.16Z", "name": "South Dakota"}, "US-DC": {"path": "M782.5,218.31l-0.45,-0.64l-1.55,-0.67l0.58,-1.01l2.03,1.25l-0.61,1.06Z", "name": "District of Columbia"}, "US-DE": {"path": "M797.82,194.97l0.48,-1.56l0.92,-1.11l1.72,-0.71l1.12,0.06l-0.33,0.56l-0.08,1.38l-0.46,1.09l-0.6,0.54l-0.09,0.77l0.13,0.61l1.03,0.85l0.11,2.3l3.97,3.32l1.13,3.99l1.96,1.68l0.47,1.25l3.17,2.26l1.35,-0.08l0.48,1.21l-0.58,0.27l-0.31,0.67l0.03,0.76l0.36,0.19l-0.82,0.57l-0.08,1.21l0.66,0.21l0.85,-0.73l0.72,0.34l0.29,-0.21l0.59,1.55l-9.83,2.64l-8.37,-25.87Z", "name": "Delaware"}, "US-FL": {"path": "M629.81,423.29l47.15,-6.85l1.52,1.9l0.86,2.72l1.47,1.0l48.74,-5.1l1.03,1.38l0.03,1.09l0.55,1.05l1.04,0.48l1.64,-0.28l0.85,-0.75l-0.14,-4.57l-0.98,-1.49l-0.22,-1.76l0.28,-0.73l0.62,-0.3l0.12,-0.7l5.59,0.96l4.03,-0.16l0.14,1.24l-0.75,-0.12l-0.32,0.43l0.25,1.54l2.11,1.81l0.22,1.01l0.42,0.38l0.3,1.92l5.3,11.49l1.8,3.07l7.13,10.21l0.62,0.36l6.81,7.53l-0.48,-0.02l-0.27,0.61l-1.35,-0.02l-0.34,-0.65l0.38,-1.38l-0.16,-0.56l-2.3,-0.92l-0.46,0.53l1.0,2.79l0.77,0.97l2.14,4.77l9.91,13.7l1.37,3.11l3.66,5.33l-1.38,-0.35l-0.43,0.74l0.8,0.65l0.85,0.24l0.56,-0.22l1.46,0.94l2.04,3.05l-0.5,0.34l-0.12,0.53l1.16,0.53l0.89,1.83l-0.08,1.06l0.59,0.95l0.6,2.64l-0.27,0.75l0.93,8.98l-0.31,1.07l0.46,0.67l0.5,3.09l-0.78,1.26l0.03,2.43l-0.84,0.74l-0.22,1.8l-0.48,0.85l0.21,1.47l-0.3,1.74l0.54,1.74l0.45,0.23l-1.15,1.8l-0.39,1.28l-0.94,0.24l-0.53,-0.22l-1.37,0.45l-0.35,1.06l-0.89,0.3l-0.18,0.58l-0.85,0.67l-1.44,0.14l-0.27,-0.32l-1.23,-0.1l-0.9,1.05l-3.17,1.13l-1.06,-0.59l-0.7,-1.04l0.06,-1.79l1.0,0.84l1.64,0.47l0.26,0.63l0.52,0.07l1.35,-0.72l0.2,-0.69l-0.26,-0.64l-1.58,-1.11l-2.4,-0.26l-0.91,-0.46l-0.85,-1.67l-0.89,-0.72l0.22,-0.98l-0.48,-0.28l-0.53,0.15l-1.38,-2.51l-0.44,-0.3l-0.64,0.07l-0.44,-0.61l0.22,-0.89l-0.7,-0.65l-1.2,-0.6l-1.06,-0.08l-0.75,-0.54l-0.57,0.18l-2.8,-0.59l-0.5,0.64l0.25,-0.91l-0.46,-0.42l-0.87,0.12l-0.26,-0.72l-0.88,-0.65l-0.61,-1.41l-0.55,-0.11l-0.73,-2.95l-0.76,-0.98l-0.16,-1.52l-0.44,-0.83l-0.71,-0.89l-0.49,-0.15l-0.12,0.93l-1.29,-0.26l1.06,-1.3l0.18,-1.37l0.86,-1.46l0.65,-0.34l0.28,-0.83l-0.61,-0.38l-1.42,0.93l-1.03,1.66l-0.28,1.79l-1.37,0.35l-0.2,-1.33l-0.79,-1.33l-0.27,-4.03l-0.86,-0.6l1.63,-1.32l0.22,-0.97l-0.58,-0.42l-3.05,1.92l-0.75,-0.66l-0.4,0.26l-1.27,-0.88l-0.37,0.74l1.13,1.09l0.52,0.1l1.26,2.0l-1.04,0.24l-1.42,-0.38l-0.84,-1.59l-1.13,-0.6l-1.94,-2.54l-1.04,-2.28l-1.28,-0.87l0.1,-0.87l-0.97,-1.8l-1.77,-0.98l0.09,-0.67l0.98,-0.41l-0.35,-0.49l0.44,-0.73l-0.39,-0.35l0.4,-1.2l2.47,-4.47l-1.05,-2.41l-0.68,-0.46l-0.91,0.42l-0.28,0.93l0.29,1.19l-0.24,0.03l-0.73,-2.43l-0.99,-0.28l-1.18,-0.87l-1.52,-0.31l0.29,1.94l-0.48,0.61l0.27,0.59l2.21,0.56l0.24,0.97l-0.37,2.46l-0.31,-0.58l-0.79,-0.21l-2.13,-1.53l-0.41,0.2l-0.29,-0.62l0.59,-2.1l0.07,-2.97l-0.66,-1.97l0.42,-0.51l0.48,-1.91l-0.24,-0.54l0.66,-3.03l-0.37,-5.4l-0.69,-1.56l0.35,-0.47l-0.47,-2.18l-2.1,-1.33l-0.05,-0.52l-0.55,-0.43l-0.1,-1.01l-0.92,-0.73l-0.55,-1.51l-0.64,-0.25l-1.44,0.32l-1.02,-0.2l-1.57,0.54l-1.15,-1.74l-1.5,-0.47l-0.19,-0.6l-1.35,-1.51l-3.81,-1.88l-0.5,-2.75l-3.06,-1.13l-0.65,-0.59l-0.52,-1.23l-2.15,-1.92l-2.19,-1.09l-1.45,-0.12l-3.43,-1.68l-2.84,0.98l-1.01,-0.4l-1.04,0.42l-0.36,0.68l-1.33,0.68l-0.5,0.71l0.03,0.64l-0.73,-0.22l-0.59,0.6l0.67,0.94l1.5,0.08l0.41,0.21l-3.03,0.23l-1.58,1.51l-0.91,0.45l-1.29,1.56l-1.55,1.03l-0.32,0.13l0.2,-0.48l-0.26,-0.54l-0.67,-0.04l-2.07,2.24l-2.2,0.23l-2.11,1.06l-0.78,0.03l-0.27,-2.02l-1.71,-2.23l-2.21,-1.0l-0.18,-0.41l-2.51,-1.5l2.79,1.33l1.21,-0.74l-0.0,-0.74l-1.32,-0.34l-0.35,0.55l-0.21,-1.01l-0.34,-0.1l0.12,-0.52l-0.49,-0.33l-1.39,0.61l-2.3,-0.76l0.65,-1.08l0.83,-0.1l1.03,-1.45l-0.91,-0.95l-0.46,0.13l-0.49,1.01l-0.44,-0.04l-0.81,0.56l-0.72,-0.9l-0.7,0.09l-0.17,0.38l-1.34,0.72l-0.14,0.68l0.28,0.46l-3.95,-1.35l-5.04,-0.71l0.11,-0.24l1.27,0.29l0.61,-0.53l2.1,0.39l0.23,-0.78l-0.94,-1.02l0.09,-0.69l-0.62,-0.29l-0.5,0.32l-0.28,-0.47l-1.9,0.19l-2.25,1.1l0.3,-0.63l-0.41,-0.58l-0.96,0.35l-0.58,-0.25l-0.23,0.44l0.2,0.71l-1.45,0.79l-0.4,0.64l-5.17,0.97l0.31,-0.52l-0.4,-0.52l-1.35,-0.28l-0.72,-0.53l0.69,-0.53l0.01,-0.78l-0.68,-0.13l-0.81,-0.66l-0.46,0.11l0.14,0.76l-0.42,1.77l-1.04,-1.39l-0.69,-0.45l-0.55,0.07l-0.3,0.71l0.82,1.77l-0.25,0.79l-1.38,0.99l-0.05,1.04l-0.6,0.22l-0.17,0.57l-1.48,0.55l0.28,-0.65l-0.22,-0.45l1.14,-1.03l0.07,-0.74l-0.4,-0.58l-1.18,-0.24l-0.42,-0.84l0.3,-1.7l-0.18,-1.61l-2.17,-1.11l-2.39,-2.46l0.32,-1.44l-0.15,-1.03ZM643.87,433.71l-0.93,0.26l0.4,-0.44l0.53,0.18ZM664.63,435.28l0.98,-0.28l0.35,0.31l0.08,0.72l-1.41,-0.75ZM769.95,454.57l0.42,0.56l-0.43,0.75l0.0,-1.3ZM788.25,524.73l0.01,-0.07l0.01,0.03l-0.03,0.04ZM788.85,522.37l-0.22,-0.23l0.49,-0.32l-0.27,0.55ZM768.22,453.18l0.21,0.76l-0.31,2.33l0.28,1.79l-1.37,-3.23l1.19,-1.65ZM679.29,445.18l0.22,-0.2l0.36,0.02l-0.11,0.42l-0.47,-0.25Z", "name": "Florida"}, "US-WA": {"path": "M38.48,55.02l0.37,-1.08l0.93,0.64l0.55,-0.14l0.54,-0.65l0.49,0.67l0.71,-0.01l0.17,-0.77l-0.98,-1.47l0.84,-0.83l-0.09,-1.36l0.49,-0.39l-0.1,-1.03l0.81,-0.27l0.05,0.5l0.48,0.41l0.95,-0.31l-0.09,-0.68l-1.44,-1.82l-1.83,-0.1l-0.15,0.32l-0.78,-0.82l0.26,-1.62l0.66,0.53l0.52,-0.07l0.29,-0.56l-0.17,-0.68l3.33,-0.52l0.25,-0.68l-2.59,-1.29l-0.05,-0.79l-0.67,-0.57l-1.3,-0.31l0.37,-4.73l-0.5,-1.29l0.25,-0.72l-0.52,-0.48l0.55,-3.93l0.04,-4.37l-0.56,-1.02l-0.05,-0.98l-1.56,-2.34l0.33,-4.23l-0.21,-1.29l0.78,-0.79l0.04,-0.71l0.97,-1.44l-0.6,-1.43l1.04,0.8l0.44,0.0l3.35,3.31l0.99,0.35l2.18,2.41l3.72,1.49l1.21,0.07l0.79,0.71l0.67,0.3l0.6,-0.15l1.57,1.07l1.49,0.47l1.28,0.28l1.22,-0.61l0.53,0.31l0.46,0.71l-0.05,1.24l0.55,0.74l0.8,-0.24l0.07,-0.75l0.44,0.03l0.63,1.39l-0.4,0.58l0.34,0.49l0.56,-0.04l0.73,-0.84l-0.38,-1.7l1.02,-0.24l-0.43,0.23l-0.22,0.69l1.27,4.41l-0.46,0.1l-1.67,1.72l0.22,-1.29l-0.22,-0.41l-1.31,0.31l-0.38,0.81l0.09,0.94l-1.37,1.7l-1.98,1.38l-1.06,1.41l-0.96,0.69l-1.1,1.66l-0.06,0.71l0.62,0.6l0.95,0.12l2.77,-0.48l1.22,-0.58l-0.03,-0.7l-0.64,-0.23l-2.94,0.79l-0.35,-0.3l3.23,-3.42l3.05,-0.88l0.89,-1.51l1.73,-1.53l0.53,0.57l0.54,-0.19l0.22,-1.8l-0.06,2.25l0.26,0.91l-0.98,-0.21l-0.64,0.77l-0.41,-0.73l-0.53,-0.19l-0.39,0.64l0.32,2.33l-0.21,-1.06l-0.67,-0.21l-0.46,0.69l-0.07,0.75l0.46,0.66l-0.63,0.58l-0.0,0.45l0.42,0.17l1.67,-0.57l0.25,1.09l-1.08,1.79l-0.08,1.05l-0.83,0.7l0.13,1.0l-0.85,-0.67l1.12,-1.44l-0.23,-0.96l-1.96,1.08l-0.38,0.64l-0.05,-2.11l-0.52,0.02l-1.03,1.59l-1.26,0.53l-1.14,1.87l-1.51,0.3l-0.46,0.44l-0.2,1.18l1.11,-0.03l-0.25,0.36l0.27,0.37l0.92,0.02l0.06,0.68l0.53,0.47l0.52,-0.27l0.35,-1.76l0.15,0.42l0.83,-0.15l1.11,1.48l1.31,-0.61l1.64,-1.47l0.98,-1.56l0.63,0.78l0.73,0.14l0.44,-0.23l-0.06,-0.86l1.55,-0.54l0.35,-0.94l-0.33,-1.26l0.22,-1.19l-0.18,-1.35l0.83,0.2l0.3,-0.92l-0.19,-0.75l-0.72,-0.63l0.89,-1.13l0.07,-1.74l1.24,-1.24l0.61,-1.36l1.61,-0.49l0.78,-1.15l-0.45,-0.66l-0.51,-0.02l-0.86,-1.3l0.16,-2.09l-0.26,-0.87l0.49,-0.78l0.06,-0.83l-1.15,-1.73l-0.62,-0.4l-0.17,-0.64l0.18,-0.5l0.59,0.24l0.53,-0.33l0.24,-1.79l0.79,-0.24l0.3,-1.0l-0.61,-2.31l0.44,-0.53l-0.03,-0.86l-0.96,-0.88l-0.95,0.3l-1.09,-2.65l0.93,-1.82l41.28,9.39l38.92,7.64l-10.12,55.35l1.04,3.0l0.13,2.0l-1.0,1.3l0.73,1.88l-31.15,-5.91l-1.66,0.79l-7.23,-1.02l-1.68,0.91l-4.19,-0.12l-3.17,0.45l-1.64,0.75l-0.88,-0.26l-1.2,0.3l-1.5,-0.23l-2.43,-0.94l-0.91,0.46l-3.45,0.5l-2.1,-0.71l-1.65,0.3l-0.31,-1.36l-1.08,-0.88l-4.34,-1.46l-2.32,-0.11l-1.15,-0.51l-1.27,0.21l-1.89,0.86l-4.49,0.58l-2.26,-1.01l-1.61,-1.15l-1.84,-0.51l-0.63,-0.81l0.64,-6.82l-0.46,-0.95l-0.22,-1.9l-0.98,-1.35l-1.96,-1.67l-1.59,-0.23l-1.31,0.28l-1.95,-3.24l-2.07,-0.23l-0.56,-0.3l-0.1,-0.52l-0.55,-0.47l-1.22,0.28l-0.81,-0.15l-1.0,0.52l-1.03,-1.77l-0.93,-0.23ZM61.92,39.74l0.16,0.73l-0.42,0.48l0.0,-0.9l0.26,-0.31ZM71.33,20.35l-0.61,0.87l-0.15,0.51l0.18,-1.38l0.57,-0.01ZM71.2,15.6l-0.09,-0.05l0.05,-0.04l0.04,0.09ZM70.43,15.46l-0.77,0.39l0.37,-0.68l-0.07,-0.6l0.22,-0.07l0.25,0.97ZM57.65,42.39l0.02,-0.01l-0.0,0.0l-0.02,0.01ZM67.81,19.2l1.73,-2.09l0.47,-0.02l0.53,1.71l-0.35,-0.55l-0.5,-0.12l-0.55,0.44l-0.35,-0.1l-0.35,0.73l-0.63,-0.01ZM67.94,20.38l0.43,0.0l0.61,0.5l0.08,0.34l-0.79,-0.2l-0.33,-0.65ZM68.9,23.13l-0.1,0.51l-0.0,0.0l-0.02,-0.24l0.12,-0.28ZM69.21,25.39l0.08,0.04l0.12,-0.04l-0.15,0.11l-0.05,-0.1ZM69.58,25.3l0.48,-0.93l1.02,1.21l0.11,1.12l-0.34,0.36l-0.33,-0.09l-0.1,-1.3l-0.84,-0.37ZM66.4,9.95l0.48,-0.34l0.18,1.51l-0.22,-0.05l-0.44,-1.12ZM68.1,9.65l0.82,0.8l-0.65,0.3l-0.18,-1.1ZM66.75,37.99l0.34,-1.07l0.21,-0.25l-0.03,1.06l-0.52,0.26ZM67.06,33.28l0.1,-1.04l0.35,-0.34l-0.23,1.56l-0.22,-0.18ZM66.57,14.25l-0.41,-0.4l0.6,-0.75l-0.18,0.61l-0.01,0.54ZM66.74,14.61l0.4,0.19l-0.08,0.12l-0.29,-0.12l-0.03,-0.2ZM66.8,12.94l-0.01,-0.1l0.05,-0.12l-0.04,0.22ZM64.42,13.11l-1.05,-0.82l0.19,-1.81l1.33,1.92l-0.47,0.72ZM62.25,42.5l0.23,-0.25l0.02,0.01l-0.13,0.31l-0.12,-0.07ZM60.11,40.25l-0.09,-0.19l0.04,-0.07l0.0,0.13l0.05,0.13Z", "name": "Washington"}, "US-KS": {"path": "M477.57,239.44l0.44,0.63l0.76,0.18l1.04,0.8l2.19,-1.08l-0.0,0.75l1.08,0.79l0.23,1.44l-0.95,-0.15l-0.6,0.31l-0.17,0.97l-1.14,1.37l-0.06,1.14l-0.79,0.5l0.04,0.63l1.56,2.1l2.0,1.49l0.2,1.13l0.41,0.86l0.74,0.56l0.32,1.1l1.89,0.91l1.54,0.26l2.67,46.77l-31.52,1.48l-31.94,0.88l-31.95,0.26l-32.02,-0.37l1.21,-65.41l27.87,0.35l27.83,-0.14l27.82,-0.63l27.65,-1.12l1.65,1.23Z", "name": "Kansas"}, "US-WI": {"path": "M598.26,107.33l0.82,-0.15l-0.13,0.81l-0.55,0.01l-0.14,-0.67ZM593.78,115.94l0.47,-0.41l0.26,-2.36l0.95,-0.24l0.64,-0.7l0.22,-1.41l0.41,-0.63l0.63,-0.03l0.07,0.38l-0.76,0.06l-0.18,0.51l0.17,1.27l-0.39,0.18l-0.11,0.57l0.56,0.57l-0.74,0.97l-0.69,1.91l0.07,1.23l-1.05,2.28l-0.41,0.15l-0.86,-0.97l-0.19,-0.72l0.31,-1.57l0.62,-1.05ZM509.7,123.96l0.4,-0.27l0.28,-0.9l-0.45,-1.48l0.04,-1.91l0.7,-1.15l0.53,-2.24l-1.61,-2.91l-0.83,-0.36l-1.28,-0.01l-0.21,-2.31l1.67,-2.26l-0.05,-0.77l0.77,-1.54l1.95,-1.08l0.48,-0.75l0.97,-0.25l0.45,-0.75l1.16,-0.14l1.04,-1.56l-0.97,-12.1l1.03,-0.35l0.22,-1.1l0.73,-0.97l0.78,0.69l1.68,0.64l2.61,-0.56l3.27,-1.57l2.65,-0.82l2.21,-2.12l0.31,0.29l1.39,-0.11l1.25,-1.48l0.79,-0.58l1.04,-0.1l0.4,-0.52l1.07,0.99l-0.48,1.68l-0.67,1.01l0.23,1.61l-1.21,2.21l0.64,0.66l2.5,-1.09l0.72,-0.86l2.15,1.22l2.33,0.47l0.44,0.53l0.86,-0.13l1.6,0.7l2.23,3.54l15.46,2.52l4.64,1.96l1.67,-0.16l1.63,0.42l1.33,-0.59l3.17,0.71l2.18,0.09l0.85,0.41l0.56,0.89l-0.42,1.09l0.41,0.77l3.4,0.63l1.4,1.13l-0.16,0.71l0.59,1.11l-0.36,0.81l0.43,1.25l-0.78,1.25l-0.03,1.75l0.91,0.63l1.38,-0.26l1.02,-0.72l0.2,0.26l-0.79,2.44l0.04,1.31l1.31,1.46l0.84,0.35l-0.24,2.01l-2.42,1.2l-0.51,0.78l0.04,1.26l-1.61,3.49l-0.4,3.5l1.11,0.83l0.91,-0.04l0.5,-0.37l0.49,-1.37l1.82,-1.47l0.66,-2.54l1.06,-1.7l0.59,0.18l0.58,-0.71l0.87,-0.4l1.12,1.12l0.59,0.19l-0.28,2.17l-1.19,2.85l-0.56,5.57l0.23,1.11l0.8,0.93l0.07,0.52l-0.51,0.98l-1.3,1.34l-0.86,3.88l0.15,2.57l0.72,1.2l0.06,1.24l-1.07,3.22l0.12,2.11l-0.73,2.11l-0.28,2.46l0.59,2.02l-0.04,1.32l0.49,0.53l-0.21,1.7l0.92,0.78l0.54,2.43l1.2,1.53l0.08,1.69l-0.33,1.44l0.47,2.95l-44.16,4.6l-0.19,-0.79l-1.56,-2.19l-4.93,-0.84l-1.06,-1.35l-0.36,-1.68l-0.9,-1.21l-0.86,-4.89l1.04,-2.61l-0.09,-0.99l-0.71,-0.79l-1.44,-0.48l-0.71,-1.76l-0.47,-6.02l-0.7,-1.4l-0.52,-2.56l-1.15,-0.6l-1.1,-1.56l-0.93,-0.11l-1.17,-0.75l-1.71,0.09l-2.67,-1.79l-2.3,-3.49l-2.63,-2.1l-2.93,-0.53l-0.73,-1.23l-1.12,-1.0l-3.12,-0.45l-3.53,-2.74l0.45,-1.24l-0.12,-1.61l0.25,-0.81l-0.88,-3.11ZM541.19,78.17l0.05,-0.28l0.03,0.16l-0.08,0.11ZM537.53,83.64l0.28,-0.21l0.05,0.08l-0.33,0.12Z", "name": "Wisconsin"}, "US-OR": {"path": "M10.8,139.99l0.63,-3.94l1.32,-2.52l0.23,-1.22l-0.01,-1.26l-0.46,-0.66l-0.14,-1.12l-0.42,-0.32l-0.11,-1.84l2.73,-3.63l2.2,-4.72l0.1,-1.09l0.42,-0.27l0.01,0.79l0.73,0.1l0.42,-1.1l0.88,-0.84l0.23,0.94l1.39,0.27l-0.51,-2.63l-0.91,0.08l2.09,-3.8l1.11,-0.76l0.8,0.39l0.55,-0.33l-0.66,-1.35l-0.6,-0.3l1.71,-4.39l0.41,-0.38l0.04,-0.96l1.74,-5.48l0.97,-1.98l0.4,0.33l0.67,-0.29l-0.12,-0.97l-0.56,-0.32l0.96,-2.74l0.81,0.17l0.23,-0.45l-0.16,-0.52l-0.52,-0.28l0.54,-2.86l1.57,-2.7l0.83,-3.01l1.14,-1.76l0.97,-3.1l-0.08,-1.03l1.21,-1.1l0.04,-0.6l-0.46,-0.65l0.14,-0.52l0.51,0.64l0.45,0.05l0.39,-0.63l0.17,-1.39l-0.74,-0.72l0.5,-1.2l1.28,-0.78l0.05,-0.46l-0.86,-0.5l-0.26,-1.11l0.85,-2.17l-0.06,-1.43l0.92,-0.59l0.4,-0.85l0.07,-3.74l0.49,0.86l0.9,0.41l-0.04,0.9l0.55,0.53l0.43,-0.82l0.39,-0.14l-0.27,-0.98l1.12,0.84l1.53,0.0l1.45,-0.68l1.44,2.36l1.99,0.78l1.39,-0.67l0.91,0.06l1.72,1.51l0.77,1.04l0.21,1.9l0.43,0.78l-0.03,2.04l-0.39,1.24l0.19,0.93l-0.43,1.74l0.26,1.44l0.79,0.85l1.94,0.56l1.44,1.05l2.4,1.1l4.98,-0.53l2.9,-1.06l1.14,0.5l2.23,0.09l4.24,1.43l0.69,0.54l0.19,1.15l0.57,0.58l1.86,-0.27l2.11,0.71l3.78,-0.55l0.69,-0.42l2.19,0.93l1.64,0.24l1.19,-0.3l0.87,0.26l1.88,-0.78l3.06,-0.43l4.16,0.13l1.61,-0.91l7.16,1.02l0.96,-0.19l0.79,-0.58l31.24,5.93l0.23,1.81l0.93,1.82l1.16,0.63l1.96,1.86l0.57,2.45l-0.16,1.0l-3.68,4.54l-0.4,1.41l-1.39,2.62l-2.21,2.41l-0.65,2.68l-1.49,1.84l-2.23,1.5l-1.92,3.34l-1.49,1.27l-0.62,2.02l-0.12,1.87l0.28,0.92l0.56,0.61l0.54,0.04l0.39,-0.35l0.63,0.76l0.89,-0.05l0.07,0.87l0.8,0.95l-0.46,1.0l-0.65,0.06l-0.33,0.4l0.21,1.8l-1.02,2.56l-1.21,1.41l-6.86,39.12l-26.19,-4.98l-28.87,-6.04l-28.78,-6.6l-28.85,-7.21l-1.54,-2.51l0.26,-2.47l-0.29,-0.87Z", "name": "Oregon"}, "US-KY": {"path": "M582.59,306.3l0.35,-2.18l1.13,0.96l0.72,0.2l0.75,-0.36l0.46,-0.88l0.87,-3.54l-0.54,-1.75l0.38,-0.86l-0.1,-1.87l-1.26,-2.04l1.78,-3.2l1.24,-0.51l0.73,0.06l7.02,2.56l0.81,-0.2l0.65,-0.72l0.24,-1.93l-1.48,-2.13l-0.24,-1.43l0.2,-0.87l0.4,-0.52l1.1,-0.18l1.24,-0.83l3.0,-0.95l0.64,-0.51l0.15,-1.13l-1.53,-2.05l-0.08,-0.68l1.33,-1.97l0.14,-1.16l1.25,0.42l1.12,-1.33l-0.68,-2.0l1.91,0.9l1.72,-0.84l0.03,1.18l1.0,0.46l0.99,-0.94l0.02,-1.36l0.51,0.16l1.89,-0.96l4.4,1.52l0.64,0.94l0.86,0.18l0.59,-0.59l0.73,-2.52l1.38,-0.54l1.39,-1.34l0.86,1.28l0.77,0.42l1.16,-0.13l0.11,0.75l0.95,0.19l0.67,-0.62l0.03,-1.0l0.84,-0.38l0.26,-0.48l-0.25,-2.09l0.84,-0.4l0.34,-0.56l-0.06,-0.69l1.25,-0.56l0.34,-0.72l0.38,1.47l0.61,0.6l1.46,0.64l1.25,-0.0l1.11,0.81l0.53,-0.11l0.26,-0.55l1.1,-0.45l0.53,-0.69l0.04,-3.47l0.85,-2.18l1.02,0.18l1.55,-1.19l0.75,-3.46l1.04,-0.37l1.65,-2.23l0.0,-0.81l-1.18,-2.88l2.78,-0.59l1.54,0.81l3.85,-2.82l2.23,-0.46l-0.18,-1.07l0.36,-1.47l-0.32,-0.36l-1.22,-0.04l0.58,-1.39l-1.08,-1.54l1.65,-1.83l1.81,1.18l0.92,-0.11l1.93,-1.01l0.78,0.88l1.75,0.54l0.57,1.28l0.94,0.92l0.79,1.84l2.6,0.67l1.87,-0.57l1.63,0.27l2.18,1.85l0.96,0.42l1.28,-0.18l0.61,-1.31l0.99,-0.54l1.34,0.5l1.34,0.04l1.33,1.09l1.26,-0.69l1.41,-0.15l1.81,-2.55l1.72,-1.03l0.92,2.35l0.7,0.83l2.45,0.81l1.35,0.97l0.75,1.04l0.93,3.34l-0.37,0.45l0.09,0.72l-0.44,0.61l0.02,0.53l2.23,2.62l1.35,0.92l-0.08,0.89l1.33,0.96l0.58,1.35l1.55,1.2l0.98,1.62l2.14,0.84l1.09,1.12l2.14,0.25l-4.86,6.13l-5.06,4.15l-0.42,0.86l0.22,1.25l-2.07,1.93l0.04,1.64l-3.06,1.63l-0.8,2.38l-1.71,0.6l-2.69,1.83l-1.66,0.48l-3.39,2.42l-23.93,3.08l-8.8,1.41l-7.46,0.86l-7.67,0.46l-22.69,3.52l-0.64,-0.56l-3.63,0.09l-0.41,0.6l1.03,3.57l-22.97,2.73ZM580.47,306.49l-0.59,0.08l-0.06,-0.55l0.47,-0.01l0.18,0.48Z", "name": "Kentucky"}, "US-CO": {"path": "M363.96,239.34l-1.22,65.81l-29.26,-0.9l-29.36,-1.42l-29.33,-1.95l-32.14,-2.74l8.32,-87.07l27.76,2.39l28.2,1.92l29.56,1.46l27.93,0.86l-0.46,21.63Z", "name": "Colorado"}, "US-OH": {"path": "M664.57,178.75l1.66,0.36l0.97,-0.31l1.74,1.07l2.07,0.26l1.47,1.17l1.69,0.24l-2.16,1.18l-0.12,0.47l0.42,0.24l2.45,0.18l1.39,-1.1l1.76,-0.25l3.39,0.96l0.92,-0.08l1.48,-1.3l1.73,-0.59l1.15,-0.96l1.91,-0.97l2.61,-0.03l1.09,-0.62l1.24,-0.06l1.07,-0.8l4.24,-5.45l4.53,-3.47l6.91,-4.36l5.82,28.02l-0.51,0.54l-1.28,0.43l-0.41,0.95l1.65,2.23l0.02,2.1l0.41,0.26l0.31,0.94l-0.04,0.76l-0.54,0.83l-0.5,4.07l0.18,3.21l-0.58,0.41l0.34,1.11l-0.35,1.74l-0.39,0.54l0.76,1.23l-0.25,1.87l-2.41,2.65l-0.82,1.86l-1.37,1.5l-1.24,0.67l-0.6,0.7l-0.87,-0.92l-1.18,0.14l-1.32,1.74l-0.09,1.32l-1.77,0.85l-0.78,2.24l0.28,1.58l-0.94,0.85l0.3,0.67l0.63,0.41l0.27,1.3l-0.8,0.17l-0.5,1.6l0.06,-0.93l-0.91,-1.26l-1.53,-0.55l-1.07,0.71l-0.82,1.97l-0.34,2.69l-0.53,0.82l1.22,3.58l-1.27,0.39l-0.28,0.42l-0.25,3.12l-2.66,1.2l-1.0,0.05l-0.76,-1.06l-1.51,-1.1l-2.34,-0.73l-1.16,-1.92l-0.31,-1.14l-0.42,-0.33l-0.73,0.13l-1.84,1.17l-1.1,1.28l-0.4,1.05l-1.43,0.15l-0.87,0.61l-1.11,-1.0l-3.14,-0.59l-1.37,0.72l-0.53,1.25l-0.71,0.05l-3.04,-2.26l-1.93,-0.29l-1.77,0.56l-2.14,-0.52l-0.55,-1.54l-0.96,-0.97l-0.63,-1.37l-2.03,-0.76l-1.14,-1.01l-0.97,0.26l-1.31,0.88l-0.46,0.03l-1.79,-1.22l-0.61,0.2l-0.6,0.7l-8.66,-55.53l20.63,-4.25ZM675.1,181.16l0.53,-0.79l0.67,0.41l-0.47,0.35l-0.72,0.03Z", "name": "Ohio"}, "US-OK": {"path": "M398.8,358.96l-0.05,-41.99l-0.39,-0.4l-51.77,-0.82l0.31,-10.22l36.66,0.74l35.97,-0.07l35.96,-0.86l35.53,-1.62l0.6,10.67l4.55,24.32l1.41,37.84l-1.2,-0.22l-0.29,-0.36l-2.13,-0.21l-0.82,-0.79l-2.11,-0.39l-1.77,-2.05l-1.23,-0.22l-2.25,-1.56l-1.5,-0.4l-0.8,0.46l-0.23,0.88l-0.82,0.24l-0.46,0.62l-2.47,-0.14l-1.79,-1.48l-2.3,1.29l-1.16,0.2l-0.19,0.56l-0.63,0.28l-2.12,-0.77l-1.7,1.18l-2.06,0.51l-0.83,1.37l-1.48,0.06l-0.57,1.24l-1.26,-1.55l-1.7,-0.1l-0.32,-0.58l-1.21,-0.46l-0.02,-0.96l-0.44,-0.5l-1.24,-0.18l-0.73,1.38l-0.66,0.11l-0.84,-0.5l-0.97,0.07l-0.71,-1.51l-1.09,-0.35l-1.17,0.57l-0.45,1.7l-0.7,-0.08l-0.49,0.43l0.29,0.73l-0.51,1.68l-0.43,0.19l-0.86,-1.45l0.39,-1.65l-0.75,-0.86l-0.8,0.18l-0.49,0.76l-0.84,-0.18l-0.92,0.97l-1.07,0.13l-0.53,-1.36l-1.98,-0.19l-0.3,-1.48l-1.19,-0.53l-0.82,0.33l-2.12,2.15l-1.21,0.51l-0.97,-0.38l0.19,-1.25l-0.28,-1.13l-2.32,-0.67l-0.07,-2.18l-0.43,-0.55l-2.11,0.39l-2.52,-0.25l-0.64,0.26l-0.81,1.21l-0.95,0.06l-1.76,-1.77l-0.97,-0.12l-1.49,0.56l-2.68,-0.63l-1.85,-1.0l-1.05,0.25l-2.46,-0.3l-0.17,-2.12l-0.85,-0.87l-0.43,-1.02l-1.16,-0.41l-0.7,-0.83l-0.83,0.08l-0.44,1.64l-2.21,-0.68l-1.07,0.6l-0.96,-0.09l-3.79,-3.78l-1.12,-0.43l-0.8,0.08Z", "name": "Oklahoma"}, "US-WV": {"path": "M692.5,248.18l3.94,-1.54l0.35,-0.71l0.12,-2.77l1.15,-0.22l0.4,-0.61l-0.57,-2.49l-0.61,-1.24l0.49,-0.64l0.36,-2.77l0.68,-1.66l0.45,-0.38l1.24,0.55l0.41,0.71l-0.14,1.13l0.71,0.46l0.78,-0.43l0.48,-1.41l0.49,0.21l0.57,-0.2l0.2,-0.44l-0.63,-2.09l-0.75,-0.55l0.81,-0.79l-0.26,-1.71l0.74,-2.0l1.65,-0.51l0.17,-1.6l1.02,-1.42l0.43,-0.08l0.65,0.79l0.67,0.19l2.28,-1.59l1.5,-1.64l0.79,-1.83l2.45,-2.66l0.37,-2.41l-0.73,-1.0l0.71,-2.33l-0.25,-0.76l0.59,-0.58l-0.27,-3.43l0.47,-3.92l0.53,-0.8l0.08,-1.11l-0.38,-1.2l-0.39,-0.33l-0.04,-2.0l-1.57,-1.9l0.44,-0.54l0.85,-0.1l0.29,-0.33l4.03,19.32l0.47,0.31l16.58,-3.55l2.17,10.67l0.5,0.37l2.06,-2.5l0.97,-0.56l0.34,-1.03l1.63,-1.99l0.25,-1.05l0.52,-0.4l1.19,0.45l0.74,-0.32l1.32,-2.6l0.6,-0.46l-0.04,-0.85l0.42,0.59l1.81,0.52l3.2,-0.57l0.78,-0.86l0.08,-1.46l2.0,-0.74l1.02,-1.69l0.67,-0.1l3.15,1.5l1.8,-0.71l-0.45,1.02l0.56,0.92l1.27,0.42l0.09,0.96l1.12,0.43l0.09,1.2l0.33,0.42l-0.58,3.64l-8.99,-4.47l-0.64,0.24l-0.31,1.14l0.38,1.61l-0.52,1.62l0.41,2.28l-1.36,2.4l-0.42,1.76l-0.72,0.53l-0.42,1.1l-0.27,0.21l-0.61,-0.23l-0.37,0.33l-1.25,3.28l-1.84,-0.78l-0.64,0.25l-0.94,2.77l0.08,1.46l-0.73,1.14l-0.19,2.33l-0.89,2.2l-3.25,-0.36l-1.43,-1.76l-1.71,-0.24l-0.5,0.41l-0.26,2.17l0.19,1.3l-0.32,1.45l-0.49,0.45l-0.31,1.04l0.23,0.92l-1.58,2.44l-0.04,2.1l-0.52,2.0l-2.58,4.72l-0.75,3.16l0.14,0.76l1.13,0.55l-1.08,1.38l0.06,0.6l0.45,0.4l-2.15,2.12l-0.55,-0.7l-0.84,0.15l-3.12,2.53l-1.03,-0.56l-1.31,0.26l-0.44,0.9l0.45,1.17l-0.91,0.91l-0.73,-0.05l-2.27,1.0l-1.21,0.96l-2.18,-1.36l-0.73,-0.01l-0.82,1.58l-1.1,0.49l-1.22,1.46l-1.08,0.08l-1.97,-1.09l-1.3,-0.01l-0.61,-0.74l-1.19,-0.6l-0.31,-1.33l-0.89,-0.55l0.36,-0.67l-0.3,-0.81l-0.85,-0.37l-0.84,0.24l-1.33,-0.17l-1.26,-1.19l-2.06,-0.79l-0.76,-1.43l-1.58,-1.24l-0.7,-1.49l-1.0,-0.6l-0.12,-1.09l-1.38,-0.95l-2.0,-2.26l0.71,-2.02l-0.25,-1.62l-0.66,-1.46Z", "name": "West Virginia"}, "US-WY": {"path": "M218.45,206.82l10.09,-86.52l25.43,2.74l26.77,2.4l26.81,1.91l27.82,1.46l-3.67,87.03l-27.29,-1.41l-28.18,-1.96l-29.67,-2.62l-28.11,-3.02Z", "name": "Wyoming"}, "US-UT": {"path": "M220.12,185.64l-2.5,21.48l0.35,0.45l32.21,3.42l-8.32,87.06l-42.5,-4.66l-42.37,-5.77l16.07,-108.24l47.06,6.25Z", "name": "Utah"}, "US-IN": {"path": "M600.42,189.45l1.42,0.87l2.1,0.15l1.52,-0.38l2.63,-1.39l2.73,-2.1l32.11,-4.8l8.95,57.36l-0.66,1.15l0.3,0.92l0.81,0.79l-0.66,1.13l0.49,0.8l1.12,0.04l-0.36,1.13l0.18,0.51l-1.81,0.29l-3.18,2.55l-0.43,0.17l-1.4,-0.81l-3.45,0.91l-0.09,0.78l1.19,3.1l-1.4,1.88l-1.17,0.49l-0.45,0.89l-0.31,2.6l-1.11,0.88l-1.06,-0.24l-0.47,0.47l-0.85,1.95l0.05,3.13l-0.39,0.99l-1.38,0.85l-0.93,-0.68l-1.24,0.01l-1.47,-0.69l-0.62,-1.84l-1.89,-0.73l-0.44,0.3l-0.04,0.5l0.83,0.68l-0.62,0.31l-0.89,-0.35l-0.36,0.29l0.5,1.41l-1.08,0.68l0.14,2.37l-1.06,0.65l-0.0,0.83l-0.16,0.37l-0.25,-1.01l-1.6,0.18l-1.4,-1.69l-0.5,-0.08l-1.67,1.49l-1.57,0.69l-1.07,2.89l-0.81,-1.07l-2.79,-0.77l-1.11,-0.61l-1.08,-0.18l-1.75,0.92l-0.64,-1.02l-0.58,-0.18l-0.53,0.56l0.64,1.86l-0.34,0.83l-0.28,0.09l-0.02,-1.18l-0.42,-0.4l-2.04,0.81l-1.41,-0.84l-0.85,0.0l-0.48,0.95l0.71,1.55l-0.49,0.74l-1.15,-0.39l-0.07,-0.54l-0.53,-0.44l0.55,-0.63l-0.35,-3.09l0.96,-0.78l-0.07,-0.58l-0.44,-0.23l0.69,-0.46l0.25,-0.61l-1.17,-1.47l0.46,-1.16l0.32,0.19l1.39,-0.55l0.33,-1.8l0.55,-0.4l0.44,-0.92l-0.06,-0.83l1.52,-1.07l0.06,-0.69l-0.41,-0.92l0.57,-0.86l0.14,-1.29l0.87,-0.51l0.4,-1.91l-1.08,-2.54l0.06,-1.91l-0.93,-0.91l-0.61,-1.5l-1.05,-0.78l-0.04,-0.58l0.92,-1.39l-0.62,-2.25l1.27,-1.31l-6.49,-50.63Z", "name": "Indiana"}, "US-IL": {"path": "M539.69,225.33l0.86,-0.35l0.37,-0.67l-0.23,-2.33l-0.73,-0.93l0.15,-0.41l0.71,-0.69l2.41,-0.98l0.71,-0.65l0.63,-1.68l0.17,-2.1l1.65,-2.47l0.27,-0.94l-0.03,-1.22l-0.59,-1.95l-2.23,-1.87l-0.11,-1.77l0.67,-2.38l0.45,-0.37l4.6,-0.84l0.81,-0.41l0.82,-1.12l2.55,-1.0l1.43,-1.56l0.39,-3.28l1.42,-1.46l0.29,-0.74l0.33,-4.37l-0.76,-2.14l-4.02,-2.47l-0.28,-1.49l-0.48,-0.82l-3.64,-2.47l44.54,-4.63l-0.01,2.65l0.57,2.59l1.38,2.49l1.3,0.94l0.76,2.59l1.26,2.71l1.42,1.85l6.6,51.44l-1.22,1.13l-0.1,0.69l0.67,1.75l-0.83,1.09l-0.03,1.11l1.19,1.09l0.56,1.41l0.89,0.82l-0.1,1.8l1.06,2.31l-0.28,1.49l-0.87,0.56l-0.21,1.47l-0.59,0.93l0.34,1.2l-1.48,1.12l-0.23,0.41l0.28,0.7l-0.93,1.17l-0.31,1.19l-1.64,0.67l-0.63,1.67l0.15,0.8l0.97,0.83l-1.27,1.15l0.42,0.76l-0.49,0.23l-0.13,0.54l0.43,2.94l-1.15,0.19l0.08,0.45l0.91,0.78l-0.48,0.17l-0.03,0.64l0.83,0.29l0.04,0.42l-1.31,1.97l-0.25,1.19l0.59,1.22l0.7,0.64l0.37,1.08l-3.3,1.22l-1.19,0.82l-1.24,0.24l-0.77,1.01l-0.18,2.04l1.7,2.8l0.07,0.54l-0.53,1.19l-0.96,0.03l-6.3,-2.43l-1.08,-0.08l-1.57,0.64l-0.67,0.72l-1.43,2.94l0.06,0.66l-1.18,-1.2l-0.79,0.14l-0.35,0.47l0.59,1.13l-1.24,-0.79l-0.01,-0.67l-1.6,-2.21l-0.4,-1.12l-0.75,-0.37l-0.05,-0.49l0.94,-1.35l0.2,-1.03l-0.32,-1.01l-1.44,-2.02l-0.47,-3.17l-2.26,-0.99l-1.55,-2.14l-1.95,-0.82l-1.72,-1.34l-1.56,-0.14l-1.82,-0.96l-2.32,-1.78l-2.34,-2.44l-0.36,-1.95l2.36,-6.85l-0.25,-2.31l0.98,-2.06l-0.38,-0.84l-2.66,-1.45l-2.59,-0.67l-1.29,0.45l-0.86,1.45l-0.9,0.15l-1.3,-1.9l-0.43,-1.52l0.15,-0.87l-0.54,-0.91l-0.29,-1.64l-0.83,-1.36l-0.94,-0.9l-4.1,-2.52l-1.0,-1.64l-4.53,-3.52l-0.73,-1.9l-1.04,-1.21l-0.04,-1.6l-0.96,-1.48l-0.75,-3.54l0.1,-2.94l0.6,-1.28ZM585.09,295.24l0.05,0.05l0.04,0.04l-0.05,-0.0l-0.04,-0.09Z", "name": "Illinois"}, "US-AK": {"path": "M89.36,517.03l0.84,0.08l0.09,0.36l-0.94,0.62l0.02,-1.06ZM91.79,517.2l0.6,-0.13l0.26,-0.56l1.74,-0.37l2.26,0.07l1.57,0.63l0.83,0.69l0.02,1.85l0.57,0.79l-3.13,-0.34l-0.31,-0.44l0.27,-0.21l0.74,0.72l0.46,-0.02l0.2,-0.48l-0.61,-1.42l-0.96,-0.52l-1.05,0.27l-0.57,0.69l-1.04,0.3l-0.44,-0.3l-1.17,0.1l-0.48,0.31l0.22,-1.63ZM99.82,520.19l0.59,-0.34l-0.03,-0.55l1.07,1.57l-0.93,-0.51l-0.44,0.41l-0.26,-0.58ZM100.06,520.81l0.0,0.04l-0.03,0.0l0.02,-0.04ZM102.01,520.78l0.38,-0.65l-0.49,-1.44l1.53,-0.88l3.26,-0.1l2.28,0.69l0.5,-0.27l0.85,0.25l0.75,0.92l0.7,-0.06l0.74,-1.39l2.25,-0.65l0.87,0.27l1.79,-0.33l-0.11,0.41l0.43,0.51l1.05,0.32l0.55,-0.85l-0.65,-0.32l-0.01,-0.82l1.87,-1.98l0.85,0.08l0.51,0.67l0.66,-0.29l-0.1,-0.57l-0.89,-0.81l0.15,-0.44l0.77,-0.47l2.87,-0.21l-0.12,-0.52l0.66,-0.6l0.66,-0.05l0.99,-1.11l-0.8,-0.27l-0.69,0.53l-1.0,0.19l-4.59,-1.01l0.09,-0.95l-0.28,-0.56l0.45,-0.35l0.43,-0.13l0.36,0.38l-0.04,1.08l0.88,-0.03l0.13,-0.66l-0.05,-0.75l-0.84,-1.05l0.01,-0.7l-0.67,-0.19l-0.25,0.71l-0.41,0.22l-0.68,-0.62l-0.68,0.82l-0.86,0.24l-0.78,2.05l-0.3,-0.28l0.05,-4.14l-0.59,-0.59l-1.0,0.32l0.03,-0.52l-0.55,-0.74l0.1,-1.27l-2.48,-0.21l-1.62,-0.43l-0.39,-0.48l-1.04,0.57l-0.77,-0.2l-0.09,-0.39l0.87,-0.08l-0.01,-0.82l0.36,-0.56l1.26,-0.12l-0.02,-0.77l-1.11,-0.64l0.09,-0.27l0.72,-0.61l1.12,-0.0l0.41,-0.42l0.49,-3.93l1.08,-1.23l-0.65,-0.57l1.59,-0.86l1.31,0.18l0.44,-0.55l-0.68,-0.42l-0.32,-0.64l-2.16,0.95l-1.86,0.22l-0.12,0.5l0.4,0.64l-0.54,0.63l-0.36,-0.37l-2.72,-0.69l-1.83,-1.2l-0.52,-0.69l0.62,-0.3l0.03,-0.64l-0.51,-1.06l-0.08,-1.3l0.33,-0.54l-0.63,-0.34l-0.45,-0.88l0.89,-0.5l-0.41,-0.7l1.82,-0.33l0.08,0.51l0.89,1.0l-0.82,0.2l-0.53,0.51l0.31,0.45l2.29,-0.04l-0.48,1.05l0.68,0.67l1.42,0.07l0.63,-0.6l-0.2,-0.74l0.35,-0.35l-0.13,-1.14l-0.52,-0.26l-1.11,0.09l-1.51,-1.2l-0.01,-0.53l-0.76,-0.89l0.55,0.15l0.53,-0.4l-0.87,-0.92l0.4,-0.45l-0.14,-0.5l1.01,-0.18l1.2,0.23l0.67,-0.44l-0.08,-0.48l-2.62,-0.27l-1.68,0.55l-0.3,0.54l-0.13,-0.19l0.63,-0.77l-0.55,-1.14l0.77,-0.09l0.24,-0.58l-0.22,-0.6l0.55,0.23l0.42,-0.51l-0.44,-0.59l1.32,0.69l0.41,-1.33l0.48,-0.28l3.25,-0.5l0.49,0.95l-0.27,0.16l0.14,0.47l1.09,0.16l0.29,-0.39l-0.06,-0.79l1.21,-0.11l0.29,-0.63l-1.24,-0.28l0.44,-0.11l0.15,-0.63l0.72,-0.27l1.18,0.99l0.46,-0.54l-0.22,-0.67l0.34,0.01l1.04,0.64l0.54,0.81l-0.06,0.29l-0.91,0.12l-0.13,0.47l1.49,0.3l0.36,0.81l0.91,0.5l1.02,0.09l3.03,-0.32l0.1,0.49l3.54,1.97l2.37,-0.41l0.47,-0.49l0.96,-2.62l-0.11,-1.41l1.64,0.15l0.77,-0.64l-0.12,-1.36l0.33,-0.47l-0.23,-0.32l-0.73,-0.39l-1.24,0.28l-0.8,-1.01l-3.4,-0.42l-0.81,0.19l-0.46,-2.1l-1.33,-0.22l-2.58,-2.31l-0.95,-0.23l-0.8,-0.77l-0.67,0.12l-2.77,-3.36l-0.26,-0.87l0.61,-0.26l0.35,-0.76l-0.34,-1.12l1.26,-0.06l1.05,0.96l0.37,-0.74l-3.28,-3.93l-0.78,-1.83l1.35,0.65l1.01,-0.37l0.37,0.6l1.09,0.35l1.08,-0.18l1.53,0.45l1.15,1.53l1.03,0.47l0.56,-0.36l-0.43,-0.99l1.48,0.48l0.47,0.65l2.29,0.47l1.49,0.99l0.18,0.46l-1.0,0.75l-1.12,-0.35l-0.12,0.69l0.62,0.53l0.18,0.89l2.9,2.19l-0.12,0.57l1.84,0.97l0.55,1.15l0.41,0.19l1.83,-0.75l0.48,0.77l-0.25,0.06l0.01,0.5l0.81,0.31l0.86,-0.65l-0.05,-0.98l-0.45,-0.65l0.19,0.01l0.88,1.79l1.82,1.01l0.6,-0.34l0.62,-1.41l-0.16,-0.23l-1.16,-0.42l-0.49,-0.92l-0.89,-0.53l-1.03,0.09l-0.32,-0.28l-0.4,-1.32l0.93,-0.41l0.68,0.34l0.37,-0.56l-0.75,-1.21l-1.13,-0.68l-0.03,-1.06l-0.43,-0.23l-0.85,0.36l-2.69,-2.75l0.6,-1.16l0.03,-2.07l-2.01,-4.96l-1.06,-1.45l-0.46,-1.62l1.08,-0.49l1.04,-1.04l2.82,2.37l3.54,1.93l3.58,0.21l2.08,-1.41l1.66,0.14l0.96,-0.29l4.06,1.99l2.69,0.39l-0.27,1.2l0.44,0.21l0.33,1.19l0.53,-0.27l0.27,-0.97l1.84,0.72l0.29,-0.35l-0.22,-0.39l-1.24,-0.82l0.04,-0.25l0.76,-0.07l0.53,1.02l1.3,0.32l3.28,1.92l2.49,0.37l2.26,-0.17l0.27,0.71l0.68,0.48l0.08,0.62l1.13,0.62l-1.38,-0.44l-0.86,0.24l0.32,1.65l1.61,0.4l0.86,-0.33l0.9,0.55l0.73,-0.06l0.16,0.38l-0.54,-0.04l-0.29,0.34l1.51,1.88l1.43,0.17l1.86,0.96l1.25,1.47l0.85,0.18l-1.25,0.43l-0.18,0.63l1.75,1.04l-0.08,0.69l1.48,0.96l0.49,0.67l2.05,0.41l0.54,0.89l1.82,0.48l1.69,1.0l1.77,1.66l0.1,0.53l1.03,0.33l0.87,0.77l-0.11,0.33l0.39,0.41l5.47,3.27l1.27,1.64l1.04,0.65l1.19,0.58l0.8,0.03l0.63,0.31l0.03,0.31l1.38,0.05l1.48,1.02l0.22,-0.19l1.42,1.17l0.77,1.33l1.73,1.4l0.56,0.96l1.03,0.39l-23.74,51.65l0.14,0.58l1.44,1.22l0.74,-0.12l1.21,1.25l1.77,-0.25l1.74,0.67l-0.92,1.14l0.49,1.3l-0.5,-0.27l-0.32,-1.02l-0.61,-0.69l-1.94,0.87l-1.71,-0.01l-1.2,-0.55l-1.91,-1.84l0.61,-1.21l-0.43,-0.93l-0.52,-0.09l-0.45,0.71l-0.6,-0.04l-3.66,-2.85l-4.43,-1.33l-0.25,-1.53l-1.55,-0.89l-0.52,-1.01l0.7,-0.5l0.21,-0.62l0.99,-0.19l0.14,-0.66l-0.9,-0.29l-2.19,0.85l-0.81,0.01l-0.85,-1.18l1.04,-0.79l-0.31,-0.45l-0.53,-0.01l-0.68,-2.15l-0.95,-0.05l-0.43,-0.37l0.22,-0.56l0.34,-0.05l1.02,0.43l0.42,-0.5l-0.14,-0.42l-1.31,-0.78l-1.54,0.27l-0.5,-0.5l-1.19,-0.38l0.3,-1.04l-0.53,-0.31l0.21,-0.77l-0.33,-0.28l-1.66,0.58l-0.32,-0.46l-1.19,-0.19l-0.69,0.52l0.29,0.74l-1.46,-0.3l-0.74,0.87l0.12,0.53l0.71,0.24l-1.28,0.3l-0.21,0.61l0.37,0.28l0.83,-0.12l0.38,0.6l-1.46,0.8l-0.26,0.85l-0.78,0.1l-0.76,-0.39l-0.32,-0.39l0.11,-0.5l-1.02,-0.25l0.09,-0.74l-0.49,-0.33l-0.87,0.89l-0.94,-0.57l-0.93,0.66l-0.71,-0.34l-0.27,0.46l-0.54,-0.43l-1.09,0.46l-0.14,-0.36l-0.8,-0.04l-0.38,0.2l-0.09,0.49l-1.46,0.21l-0.87,-0.77l-0.51,0.24l-1.41,-0.31l-0.34,-0.65l0.45,0.02l0.16,-0.37l0.53,0.01l0.73,0.75l0.49,-0.04l0.2,-0.43l0.67,0.06l1.45,-0.63l0.32,-0.52l-0.21,-0.37l-2.33,-0.15l-0.64,-0.99l1.28,-0.98l1.62,-0.44l1.16,-0.81l0.66,-0.89l0.14,-1.04l1.1,0.28l2.94,-0.14l0.14,0.8l0.66,0.6l1.06,0.16l2.4,2.31l0.56,-0.35l-0.27,-1.05l-0.71,-0.37l-1.44,-2.06l1.57,-0.56l1.83,0.31l0.25,-0.66l-1.72,-0.88l-1.31,0.15l-0.59,0.51l-1.45,-0.89l-0.13,-0.9l-1.07,0.27l-1.34,-0.19l-0.84,0.41l-1.25,-0.44l-1.18,0.04l-0.71,0.35l-0.19,0.5l-1.0,-0.11l-1.66,0.42l-1.03,0.91l-0.59,-0.02l-0.75,-1.05l-0.92,-0.34l-0.42,0.31l1.06,2.28l-0.73,0.34l-1.87,-0.82l-0.57,0.21l0.02,0.44l-0.39,-0.71l-0.65,0.59l-0.2,-0.38l-0.81,0.14l-0.11,0.46l-0.7,-0.35l-0.36,0.28l0.13,0.39l-1.49,-0.27l-0.68,0.98l-0.74,0.3l-0.16,0.84l0.35,0.58l0.59,-0.05l0.95,0.69l0.63,1.33l-0.65,0.54l-0.94,0.13l-1.25,-0.43l-0.48,0.4l-0.65,-0.13l-0.34,0.59l-0.97,-0.11l-0.58,0.49l-0.42,-0.28l-0.88,0.42l-0.68,-0.03l-0.98,-0.59l-0.9,0.53l-0.9,-0.16l-0.45,0.28l-0.56,-0.66l-1.51,0.75l-0.87,-0.51l-0.7,0.31l-2.16,-0.11l-0.53,0.41l0.24,0.95l-0.46,0.15l-1.09,-0.52l-0.52,0.31l-0.2,-0.24l-1.73,0.29l-0.58,-0.87l-1.4,0.41l-0.14,0.34l-0.32,-0.56l-0.54,-0.14l-1.29,-0.05l-0.62,0.31l-0.94,-0.38l-1.57,0.37l-0.27,0.68l-0.26,-0.07l-0.7,0.67l-2.46,-0.65l-0.5,-0.56l-0.81,-0.0l-0.71,-0.67l-1.2,-0.22l-0.4,0.21ZM111.33,502.76l-0.43,0.23l-0.11,-0.04l0.22,-0.23l0.31,0.03ZM128.45,468.26l-0.1,0.14l-0.06,0.02l0.02,-0.15l0.14,-0.02ZM194.04,541.32l0.49,0.51l0.05,1.1l2.39,4.74l-0.4,2.31l0.52,0.32l1.64,-0.32l-0.96,0.74l0.29,0.54l0.73,-0.18l0.8,0.55l0.26,1.19l-0.26,0.54l1.17,0.54l-0.21,0.46l0.42,0.41l-0.05,0.37l-1.08,-1.19l-1.25,0.46l-0.26,-0.63l-0.96,-0.51l-0.89,-1.43l0.35,-0.75l-0.85,-0.27l-0.47,-0.93l-0.02,-1.09l-1.16,-1.84l0.1,-0.61l-1.01,-0.43l-2.84,-3.43l1.15,-0.58l-0.33,0.74l0.73,0.46l0.37,-0.28l0.39,-1.25l1.15,0.71l0.35,-0.35l-0.33,-0.63ZM191.84,541.2l-0.01,-0.72l0.25,-0.06l0.08,0.39l-0.31,0.39ZM199.71,549.77l1.7,0.14l0.76,-0.63l0.33,-0.76l0.88,-0.16l0.36,-0.66l2.94,0.08l1.01,1.73l-0.48,0.47l0.08,1.5l0.89,0.74l0.22,0.83l0.4,0.31l0.08,1.48l1.47,1.92l0.18,0.72l-1.01,-0.15l-1.44,1.36l-0.52,-0.98l-0.84,-0.65l-0.17,-1.5l0.4,-1.2l-0.67,-0.47l0.34,-1.99l-0.15,-1.05l0.53,-1.32l-0.66,-0.25l-0.5,0.69l-0.69,-0.02l-0.31,0.89l0.3,1.04l-0.34,0.85l-0.19,4.27l-0.28,0.29l-0.54,-2.09l-1.5,0.06l0.42,-0.3l0.2,-0.91l-0.26,-1.17l0.88,0.13l0.45,-0.45l-0.11,-0.33l-0.96,-0.35l0.0,-0.84l-0.33,-0.34l-0.31,-0.02l-0.69,1.16l-0.5,-0.23l0.24,-0.5l-0.28,-0.54l-0.3,-0.02l-0.18,-0.5l-0.47,-0.15l-0.19,0.31l-0.21,-0.45ZM201.64,551.89l0.22,0.2l-0.19,0.19l-0.03,-0.38ZM210.75,558.13l0.49,0.94l-0.19,0.67l0.77,3.12l-1.94,-1.23l0.48,-1.32l-0.74,-0.3l-0.75,0.68l-0.11,-0.36l0.05,-0.59l0.78,-1.08l0.43,-0.42l0.73,-0.11ZM211.88,563.04l1.24,5.48l-0.54,0.45l0.03,0.64l0.81,0.55l-0.47,0.67l0.05,0.52l0.58,0.54l-0.16,1.32l0.35,0.43l0.9,0.26l1.46,1.84l1.18,0.8l0.89,1.18l0.09,0.77l1.3,0.84l-0.15,0.68l-1.0,0.87l-0.37,3.3l-2.62,2.05l-0.48,-0.13l-0.04,-0.92l-0.72,0.24l-0.1,-0.51l0.85,0.25l2.03,-1.46l-0.23,-0.63l-0.47,0.07l-0.37,-0.49l-0.54,0.12l0.77,-3.33l-0.69,-1.08l0.49,-0.15l0.54,-0.82l-0.43,-0.27l-1.49,0.44l-0.55,-0.29l-2.02,0.23l0.58,-1.29l1.44,0.45l0.7,-0.34l-0.07,-0.49l-1.61,-0.59l0.03,-0.84l-0.69,-0.55l-0.4,-1.04l0.27,-0.3l-0.16,-0.68l-0.35,-0.03l0.75,-1.07l-0.38,-0.25l-0.67,0.18l-0.27,-0.29l-0.26,-0.66l0.33,-0.21l0.18,-1.04l-0.39,-0.3l-0.64,0.08l-0.3,-0.92l-0.45,-0.27l1.09,-0.08l0.35,-0.42l-0.28,-0.52l-0.93,-0.06l0.15,-0.64l-0.47,-0.39l0.64,0.01l0.69,0.95l0.59,-0.13l0.04,-0.52l-1.49,-2.18l0.12,-0.39l1.23,0.83l0.52,-0.46ZM214.19,585.45l-0.17,0.68l-0.05,-0.01l0.09,-0.42l0.13,-0.25ZM215.43,583.76l-0.46,0.24l-0.88,-0.08l0.57,-0.42l0.76,0.26ZM211.63,577.77l0.18,0.7l-0.46,0.4l-0.51,-0.23l-0.2,0.77l-0.07,-0.87l0.74,-0.19l0.32,-0.57ZM209.08,567.16l-0.25,-0.24l0.08,-0.14l0.49,0.2l-0.32,0.18ZM165.84,518.29l-0.59,0.72l-0.72,-0.01l0.48,-0.52l0.84,-0.19ZM162.11,521.34l0.08,0.0l-0.06,0.02l-0.02,-0.02ZM162.26,521.34l0.08,-0.02l0.01,0.04l-0.04,0.04l-0.05,-0.05ZM141.64,514.72l0.19,0.06l0.26,0.22l-0.46,0.03l0.0,-0.31ZM132.07,521.13l-0.0,0.0l0.0,-0.0l0.0,0.0ZM132.06,520.84l-0.02,-0.07l0.06,-0.01l-0.03,0.08ZM109.91,522.38l0.07,-0.02l0.05,0.12l-0.03,0.01l-0.09,-0.11ZM107.83,523.67l0.01,0.02l-0.02,0.0l0.0,-0.01l0.01,-0.01ZM138.39,458.34l-0.47,-0.44l0.06,-0.45l0.41,0.27l0.0,0.62ZM108.6,500.59l-0.13,0.01l0.01,-0.02l0.12,0.01ZM211.75,580.86l0.58,-0.23l-0.18,0.96l-0.22,-0.23l-0.18,-0.5ZM212.61,580.42l0.07,-0.67l0.83,-0.31l0.46,-0.91l0.57,-0.03l0.4,2.14l-0.55,1.09l-0.28,0.21l-0.2,-0.36l0.13,-1.47l-0.39,-0.42l-0.59,0.65l-0.46,0.07ZM211.52,574.36l0.6,0.43l0.01,0.48l-0.65,-0.45l0.05,-0.46ZM209.53,574.99l0.45,-0.25l0.04,0.47l1.03,0.42l-0.3,0.25l0.03,0.55l-0.28,0.08l0.14,-0.47l-0.4,-0.66l-0.69,-0.39ZM210.35,574.41l0.09,-0.07l0.07,0.06l-0.0,0.01l-0.16,-0.0ZM209.53,571.91l0.03,-0.1l0.32,-0.15l0.15,-0.76l0.34,1.01l-0.83,0.01ZM206.96,580.16l0.1,-0.52l-0.64,-1.09l0.79,-0.24l0.21,-0.67l-1.77,-0.43l1.32,-0.73l0.08,-1.5l1.31,1.02l0.55,1.56l-0.14,0.62l-0.61,0.35l0.02,0.34l-0.75,0.25l-0.08,0.43l0.07,0.45l0.56,-0.01l1.27,1.12l-0.39,-0.07l-0.37,0.75l0.22,0.37l0.42,0.05l0.21,0.1l-1.09,0.58l0.11,0.7l0.38,0.27l-0.21,1.02l-0.44,-1.52l0.16,-0.81l-0.44,-0.45l-0.21,-1.59l-0.58,0.07l-0.05,-0.39ZM207.26,574.01l-0.23,-0.53l0.29,-0.13l0.18,0.45l-0.24,0.21ZM206.89,573.4l-0.43,-0.14l-0.38,-0.35l0.5,0.03l0.31,0.46ZM208.71,573.08l0.26,-0.17l0.69,0.23l-0.38,0.56l-0.56,-0.62ZM206.48,567.38l1.81,1.29l0.06,0.4l-0.46,0.04l-0.19,0.76l0.32,1.74l-0.85,-0.57l-0.68,0.22l0.79,-2.43l-0.8,-1.45ZM208.6,569.23l0.34,0.07l0.2,-0.33l0.4,0.52l-0.43,1.24l-0.5,-1.49ZM206.63,568.47l0.02,0.01l-0.01,0.01l-0.01,-0.02ZM204.28,565.52l0.44,-0.15l0.26,-0.56l0.29,0.26l0.51,-0.3l-0.24,0.69l-1.46,0.49l0.19,-0.44ZM206.36,564.27l-0.49,0.31l-0.02,-0.59l-0.46,-0.14l0.52,-0.15l0.24,-0.65l-0.97,-0.55l0.51,-2.93l0.34,-0.33l0.95,0.48l-0.57,1.9l0.35,0.2l0.07,1.28l0.43,0.45l-0.08,0.23l-0.57,-0.12l-0.25,0.63ZM206.14,574.27l-0.13,-0.03l0.0,-0.02l0.15,-0.04l-0.02,0.09ZM205.18,574.32l-0.02,0.0l0.01,-0.01l0.01,0.0ZM204.96,570.24l-0.05,-0.24l0.09,0.22l-0.04,0.01ZM205.24,569.02l-0.25,0.19l-0.9,-0.64l1.19,-0.15l-0.04,0.59ZM198.99,558.2l0.09,-0.07l0.23,0.49l-0.21,-0.07l-0.11,-0.35ZM199.36,558.71l0.39,0.44l0.56,-0.45l-0.44,-1.09l0.59,0.02l0.03,-0.77l0.75,0.33l0.49,-0.34l0.61,0.72l-0.97,-0.03l-0.88,0.41l0.35,0.96l1.2,1.34l-0.02,0.58l-1.22,-1.52l-0.61,0.35l-0.15,0.48l0.41,0.77l-0.14,0.51l0.26,0.3l-0.28,0.06l-0.92,-3.07ZM202.26,558.92l0.82,-0.38l1.25,0.94l-0.11,0.18l-0.99,-0.55l-0.0,1.0l-0.97,-1.19ZM202.11,560.96l0.72,0.4l0.85,-0.01l-0.23,1.25l-1.34,-1.64ZM201.28,562.69l0.51,-0.02l0.7,0.74l0.26,2.34l-0.36,2.31l-1.1,2.63l-0.28,-1.78l0.93,-0.51l-0.06,-0.73l-0.8,-1.37l-0.47,-0.03l0.25,-0.44l0.65,-0.05l0.21,-0.31l-0.13,-0.51l-0.53,-0.25l0.57,-0.27l-0.34,-1.16l-0.33,-0.12l0.32,-0.49ZM199.27,560.14l0.0,0.0l-0.01,0.0l0.0,-0.0ZM199.1,564.3l0.25,-0.07l0.1,-0.06l-0.12,0.15l-0.23,-0.02ZM199.63,563.32l0.06,-0.2l-0.05,-0.12l0.09,0.12l-0.1,0.2ZM162.15,525.49l0.25,-0.21l0.11,-0.0l-0.2,0.31l-0.16,-0.1ZM136.7,524.68l0.22,0.25l0.59,-0.1l0.04,-0.44l0.61,0.38l0.58,-0.95l0.41,0.07l-0.14,0.5l0.39,0.73l-0.5,0.38l-0.2,-0.72l-0.36,-0.02l-0.69,0.57l-0.12,-0.24l-0.6,0.21l-0.23,-0.63ZM139.88,525.12l-0.03,-0.01l0.02,-0.02l0.01,0.03ZM127.78,528.12l0.49,-0.13l0.09,0.05l-0.34,0.29l-0.24,-0.2ZM128.01,526.81l0.09,-0.93l-0.34,-0.42l0.92,-0.62l0.44,0.22l1.29,-0.18l0.25,0.25l-0.44,0.12l0.02,0.5l0.44,0.31l-0.25,0.64l0.13,1.11l0.79,0.74l-0.67,0.41l-0.19,-0.77l-0.69,-0.05l-0.9,-0.98l-0.9,-0.35ZM131.4,528.57l0.28,-0.39l-0.12,-1.16l0.76,-0.42l1.27,-0.11l0.68,0.47l0.83,-0.59l0.41,1.21l0.47,-0.02l0.28,-0.39l1.11,0.14l-0.99,0.85l0.16,0.91l0.58,0.28l-0.5,0.18l-1.93,-1.69l-0.88,0.36l-0.07,0.55l-0.38,-0.39l-0.44,0.12l-0.19,0.46l-1.33,-0.4ZM134.19,529.01l0.07,-0.02l0.09,0.03l-0.15,-0.01l-0.01,0.0ZM134.4,529.04l0.27,0.1l0.23,0.58l-0.25,-0.11l-0.25,-0.57ZM135.82,526.14l0.09,-0.06l0.02,0.01l-0.11,0.04ZM132.89,525.47l-0.57,-0.58l0.11,-0.17l0.61,-0.02l-0.14,0.76ZM98.14,450.76l0.91,-0.6l0.03,0.8l1.35,1.54l-1.87,-0.62l-0.42,-1.11ZM100.8,452.78l1.01,0.2l0.93,0.65l0.23,0.8l-0.52,0.59l1.78,3.15l-1.75,-0.21l-0.84,-3.48l-0.85,-1.69ZM104.84,458.76l0.28,0.01l0.41,0.53l-0.25,0.05l-0.43,-0.59ZM96.98,478.79l0.06,-0.22l1.37,1.26l0.71,-0.21l1.8,0.82l0.25,0.75l0.83,0.68l-0.55,0.55l-0.42,1.13l-1.5,-0.61l-1.48,-1.3l-1.06,-2.86ZM97.68,522.17l0.05,-0.07l0.04,-0.11l0.07,0.18l-0.15,-0.0ZM98.03,522.39l0.04,0.02l-0.0,0.03l-0.03,-0.05ZM80.23,514.88l1.15,0.07l1.73,-0.69l0.6,0.76l2.34,0.41l0.44,0.41l0.03,0.72l-0.39,0.84l-0.8,0.28l-2.14,-1.6l-1.22,-0.08l-0.63,0.33l-0.91,-0.42l-0.33,-0.34l0.13,-0.67ZM74.26,514.0l0.03,-0.25l0.32,0.05l0.02,0.35l-0.37,-0.15ZM64.81,513.23l0.09,-0.01l0.13,0.09l-0.17,0.0l-0.05,-0.08ZM70.29,514.34l-0.28,0.34l-0.61,-0.19l0.56,-0.1l0.41,-0.61l-0.92,-1.22l0.18,-0.35l1.26,0.65l-0.61,1.49ZM68.8,514.2l-0.28,0.32l-0.09,-0.1l0.14,-0.56l0.23,0.34ZM59.97,511.7l0.38,-0.51l0.48,-0.06l0.85,0.53l-0.94,0.27l-0.77,-0.22ZM62.67,511.55l0.36,-0.67l0.75,-0.01l0.67,0.35l0.17,0.49l-0.28,0.29l-1.66,-0.44ZM37.79,498.37l-0.03,-0.46l0.32,0.03l0.09,0.49l-0.39,-0.06ZM36.41,498.87l-0.02,0.01l0.01,-0.02l0.01,0.01ZM36.85,498.71l-0.01,-0.07l-0.0,-0.01l0.02,0.01l-0.01,0.07ZM30.2,493.17l-0.02,-0.03l0.04,-0.04l0.0,0.08l-0.02,-0.0ZM26.76,492.74l0.41,-0.33l0.12,0.35l-0.27,0.1l-0.26,-0.12ZM25.01,490.83l0.02,0.0l-0.01,0.01l-0.02,-0.01ZM23.18,488.38l-0.09,0.01l0.05,-0.17l0.04,0.08l0.01,0.08ZM23.19,487.9l-0.06,0.1l-0.14,-0.54l0.19,0.18l0.0,0.26ZM15.95,478.85l0.25,0.07l-0.02,0.19l-0.14,-0.01l-0.09,-0.25ZM1.23,449.67l0.23,0.17l0.21,0.66l0.47,0.45l-0.25,0.16l0.12,0.4l-0.78,-0.56l0.28,-0.8l-0.28,-0.48Z", "name": "Alaska"}, "US-NJ": {"path": "M801.04,165.08l1.31,-1.55l0.48,-1.57l0.5,-0.62l0.54,-1.45l0.11,-2.05l0.67,-1.35l0.92,-0.71l14.1,4.16l-0.4,6.02l-0.34,0.55l-0.23,-0.43l-0.7,0.11l-0.26,1.18l-0.76,0.97l0.12,1.42l-0.46,0.6l0.08,1.71l0.58,0.62l1.2,0.29l1.38,-0.43l2.3,0.24l0.9,6.91l-0.56,0.39l0.18,0.66l-0.61,0.95l0.46,0.58l-0.21,0.6l0.53,1.94l-0.47,2.0l0.11,0.61l0.62,0.64l-0.39,1.13l-0.49,0.45l-0.01,0.59l-0.93,1.13l0.02,0.52l-1.06,0.1l0.09,1.21l0.64,0.83l-0.82,0.56l-0.18,1.15l1.04,0.77l-0.31,0.29l-0.17,-0.44l-0.53,-0.18l-0.5,0.22l-0.44,1.51l-1.28,0.61l-0.2,0.45l0.46,0.55l0.8,0.06l-0.65,1.26l-0.26,1.5l-0.68,0.65l0.19,0.48l0.4,0.04l-0.89,1.57l0.07,0.95l-1.64,1.72l-0.12,-1.33l0.36,-2.43l-0.11,-0.87l-0.58,-0.82l-0.89,-0.28l-1.11,0.34l-0.81,-0.34l-1.5,0.88l-0.31,-0.7l-1.62,-0.96l-1.0,0.04l-0.65,-0.71l-0.7,0.07l-3.23,-2.03l-0.06,-1.72l-1.02,-0.94l0.48,-0.68l0.0,-0.87l0.43,-0.83l-0.12,-0.73l0.51,-1.18l1.2,-1.16l2.6,-1.49l0.54,-0.86l-0.38,-0.85l0.5,-0.37l0.47,-1.44l1.24,-1.7l2.52,-2.22l0.18,-0.67l-0.47,-0.82l-4.26,-2.77l-0.75,-1.05l-0.9,0.24l-0.48,-0.33l-1.24,-2.46l-1.62,-0.02l-1.0,-3.44l1.02,-1.03l0.36,-2.23l-1.87,-1.91Z", "name": "New Jersey"}, "US-ME": {"path": "M899.43,43.99l-0.01,-0.31l0.01,-0.16l0.04,0.37l-0.04,0.1ZM836.38,56.23l0.87,-1.15l1.42,1.7l0.84,0.04l0.39,-2.12l-0.46,-2.19l1.7,0.36l0.73,-0.42l0.21,-0.52l-0.32,-0.7l-1.18,-0.47l-0.44,-0.62l0.19,-1.42l0.86,-2.02l2.08,-2.25l0.01,-0.98l-0.52,-0.93l1.02,-1.64l0.39,-1.51l-0.22,-0.92l-1.02,-0.35l-0.07,-1.42l-0.4,-0.43l0.55,-0.96l-0.04,-0.63l-1.0,-1.26l0.13,-1.73l0.37,-0.63l-0.15,-0.97l1.22,-1.93l-0.96,-6.16l5.57,-18.86l2.25,-0.23l1.14,3.18l0.55,0.43l2.54,0.56l1.83,-1.73l1.68,-0.82l1.24,-1.71l1.25,-0.12l0.64,-0.47l0.25,-1.43l0.42,-0.29l1.36,0.04l3.68,1.41l1.14,0.96l2.36,1.05l8.37,22.68l0.64,0.65l-0.19,1.26l0.64,0.86l-0.1,1.52l-0.32,0.05l-0.24,0.66l1.71,1.13l1.79,0.22l0.82,0.41l1.88,-0.19l1.25,-0.63l0.34,0.86l-0.59,1.42l1.69,1.86l0.28,2.68l2.72,1.68l0.98,-0.1l0.47,-0.74l-0.06,-0.5l0.36,0.08l0.25,0.49l0.64,0.07l1.41,1.11l0.27,0.75l1.27,0.94l0.04,0.47l-0.52,-0.14l-0.39,0.41l0.18,0.77l-0.76,-0.15l-0.35,0.4l0.16,0.63l0.81,0.53l0.55,0.92l0.48,0.17l0.16,-0.88l0.38,-0.17l0.8,0.32l0.25,-0.83l0.34,0.41l-0.31,0.85l-0.53,0.19l-1.21,3.24l-0.63,-0.04l-0.31,0.44l-0.55,-1.05l-0.72,0.03l-0.3,0.5l-0.56,0.06l-0.02,0.49l0.58,0.85l-0.9,-0.45l-0.33,0.63l0.26,0.52l-1.2,-0.28l-0.36,0.3l-0.37,0.78l0.07,0.45l0.44,0.08l0.07,1.21l-0.37,-0.57l-0.55,-0.06l-0.39,0.45l-0.2,1.09l-0.48,-1.53l-1.14,0.01l-0.67,0.75l-0.36,1.48l0.59,0.63l-0.83,0.63l-0.69,-0.46l-0.73,1.04l0.1,0.64l0.99,0.63l-0.35,0.21l-0.1,0.82l-0.45,-0.21l-0.85,-1.82l-1.03,-0.46l-0.39,0.22l-0.45,-0.41l-0.57,0.63l-1.24,-0.19l-0.26,0.85l0.78,0.4l0.01,0.37l-0.51,-0.05l-0.56,0.4l-0.09,0.69l-0.49,-1.02l-1.17,-0.02l-0.16,0.64l0.52,0.87l-1.44,0.95l0.84,1.11l0.08,1.06l0.53,0.65l-0.96,-0.41l-0.96,0.22l-1.2,-0.42l-0.17,-0.91l0.74,-0.28l-0.08,-0.55l-0.42,-0.49l-0.67,-0.12l-0.3,0.33l-0.23,-2.37l-0.37,-0.22l-1.1,0.27l0.04,1.96l-1.85,1.92l0.02,0.49l1.25,1.47l-0.64,0.96l-0.19,3.86l0.77,1.41l-1.08,1.72l-0.8,-0.19l-0.45,0.93l-0.62,-0.06l-0.41,-1.15l-0.73,-0.21l-0.52,1.03l0.11,0.69l-0.45,0.59l0.12,2.41l-0.95,-1.0l0.14,-1.28l-0.24,-0.59l-0.81,0.29l-0.08,2.0l-0.44,-0.25l0.15,-1.54l-0.47,-0.4l-0.68,0.49l-0.76,3.04l-0.77,-1.97l0.17,-1.21l-0.4,-0.27l-0.46,0.21l-1.05,2.59l0.35,0.53l0.85,-0.15l0.95,2.08l-0.28,-0.59l-0.51,-0.23l-0.66,0.3l-0.07,0.64l-1.38,-0.1l-2.16,3.17l-0.53,1.86l0.29,0.6l-0.68,0.65l0.51,0.43l0.91,-0.21l0.36,0.92l-0.77,0.3l-0.2,0.39l-0.4,-0.04l-0.51,0.57l-0.14,1.03l0.66,1.37l-0.08,0.68l-0.79,1.29l-0.93,0.61l-0.54,1.28l0.44,1.56l-0.4,2.81l-0.8,-0.33l-0.41,0.59l-1.02,-0.76l-0.57,-1.85l-0.93,-0.37l-2.36,-1.99l-0.76,-3.45l-13.23,-35.5ZM863.26,81.18l0.08,0.26l-0.08,0.23l0.03,-0.28l-0.04,-0.2ZM864.67,81.4l0.46,0.7l-0.04,0.47l-0.32,-0.25l-0.1,-0.93ZM867.01,78.26l0.42,0.82l-0.16,0.14l-0.42,-0.19l0.16,-0.77ZM876.37,64.84l-0.14,0.2l-0.03,-0.23l0.17,0.04ZM872.41,75.18l0.01,0.02l-0.03,0.03l0.01,-0.05ZM898.03,42.84l-0.08,-0.14l0.13,-0.32l-0.05,0.4l-0.0,0.06ZM882.05,63.75l0.04,-1.17l0.41,-0.65l-0.18,-0.44l0.4,-0.5l0.62,-0.11l1.54,1.35l-0.49,0.65l-1.08,0.05l-0.27,0.43l0.57,1.3l-0.99,-0.18l-0.14,-0.56l-0.44,-0.17ZM882.89,67.0l0.09,-0.08l0.06,0.18l-0.03,-0.03l-0.12,-0.08ZM880.68,70.54l-0.02,-0.23l-0.04,-0.26l0.1,0.22l-0.03,0.27ZM878.64,66.32l0.61,0.4l-0.35,0.29l0.15,0.96l-0.39,-0.63l-0.02,-1.03ZM877.4,70.84l0.09,-0.01l0.48,-0.08l-0.25,0.45l-0.32,-0.37ZM876.27,69.51l0.32,-0.46l0.2,-0.05l-0.31,0.54l-0.2,-0.04Z", "name": "Maine"}, "US-MD": {"path": "M740.11,219.45l-2.04,-10.05l19.83,-4.49l-0.66,1.29l-0.94,0.08l-1.54,0.81l0.16,0.7l-0.42,0.49l0.23,0.78l-1.76,0.5l-1.47,0.03l-1.13,-0.39l0.21,-0.36l-0.3,-0.49l-1.11,-0.31l-0.47,1.8l-1.63,2.84l-1.37,-0.39l-1.03,0.62l-0.41,1.25l-1.59,1.93l-0.36,1.04l-0.88,0.45l-1.3,1.86ZM760.17,204.38l36.9,-9.12l8.48,26.17l0.45,0.26l1.06,-0.21l8.17,-2.07l-0.9,0.53l0.31,0.64l0.52,0.01l0.37,0.76l0.52,-0.05l-0.38,1.95l-0.12,-0.26l-0.47,0.07l-0.73,0.86l-0.17,2.69l-0.6,0.19l-0.36,0.71l-0.02,1.66l-3.61,1.37l-0.45,0.7l-2.2,0.43l-0.56,0.65l-0.3,-1.09l0.5,-0.31l0.86,-1.84l-0.4,-0.51l-0.45,0.12l0.08,-0.49l-0.44,-0.42l-2.29,0.63l0.3,-0.6l1.15,-0.83l-0.17,-0.69l-1.36,-0.18l0.38,-2.23l-0.18,-1.01l-0.91,0.16l-0.53,1.76l-0.34,-0.68l-0.62,-0.07l-0.44,0.47l-0.5,1.39l0.53,1.02l-2.86,-2.14l-0.43,-0.19l-0.61,0.36l-0.73,-0.76l0.33,-1.67l0.76,-0.6l-0.08,-1.35l2.55,0.23l0.78,-1.5l-0.32,-1.42l-0.72,0.27l-0.28,1.29l-0.97,-0.25l-0.38,-1.07l-0.52,-0.28l-0.55,0.23l-0.22,-0.68l-0.63,0.08l1.0,-0.82l0.22,-1.04l-0.54,-0.55l-0.75,0.83l-0.21,-0.61l1.06,-0.91l-0.25,-0.65l-0.54,-0.08l-0.51,-0.75l-0.42,0.22l-0.53,-0.37l0.83,-1.03l-0.24,-1.02l0.84,-1.95l-0.07,-0.86l-0.46,0.02l-0.66,0.66l-0.56,-0.16l-0.48,0.45l-0.19,0.97l-0.94,-1.2l0.75,-3.46l0.59,-0.51l0.07,-0.74l3.88,-0.78l0.49,-0.41l-0.23,-0.67l-0.45,-0.07l-2.38,0.56l0.88,-1.55l1.42,-0.05l0.35,-0.5l-0.99,-0.67l0.44,-1.9l-0.63,-0.32l-0.48,0.39l-0.87,1.95l0.2,-2.02l-0.59,-0.34l-0.88,1.43l-1.41,0.34l-0.31,1.64l0.39,0.53l0.65,0.12l-1.44,1.92l-0.2,-1.64l-0.64,-0.42l-0.61,0.73l0.07,1.45l-0.84,-0.29l-1.16,0.64l0.02,0.71l1.01,0.27l-0.37,0.53l-0.83,0.22l-0.05,0.34l-0.44,-0.04l-0.35,0.64l1.2,1.22l-0.29,0.17l-1.52,-0.76l-1.33,0.48l0.16,0.69l0.82,0.1l1.26,1.21l1.49,0.58l0.1,0.28l-0.44,0.33l-1.37,0.5l-0.12,1.19l1.83,1.04l0.46,0.62l-0.65,-0.43l-1.05,0.29l0.2,0.64l0.92,0.48l-0.34,0.47l0.4,1.15l0.6,0.09l-0.62,1.26l0.13,0.43l0.63,0.65l1.28,4.18l2.83,2.58l-0.01,0.35l-0.38,0.54l-0.67,-1.23l-1.21,-0.22l-1.69,-0.87l-1.51,-3.64l-0.73,-0.68l-0.28,0.69l1.17,3.93l0.65,0.92l1.45,0.81l1.3,0.31l1.49,1.39l0.89,-0.32l0.37,1.32l1.47,1.47l0.1,1.07l-1.08,-0.68l-0.33,-1.23l-0.63,-0.45l-0.45,0.04l-0.13,0.44l0.27,0.78l-0.74,0.13l-0.62,-0.73l-1.16,-0.38l-1.53,0.0l-0.92,0.43l-0.54,-0.2l-1.0,-2.19l-1.26,-0.71l-0.46,0.14l0.01,0.48l1.19,2.0l-0.67,-0.12l-0.28,-0.5l-0.89,-0.4l-1.61,-2.6l-0.48,-0.14l-0.43,1.47l-0.25,-0.74l-0.62,-0.04l-0.4,0.46l0.33,0.72l-0.18,0.69l-0.64,0.59l-0.56,-0.26l-0.63,-1.86l0.25,-1.14l0.71,-0.37l0.19,-0.51l-0.36,-0.52l0.83,-0.52l0.21,-1.61l1.06,-0.35l0.07,-0.66l-0.33,-0.42l0.23,-0.42l-0.38,-0.38l-0.04,-0.7l1.27,-2.19l-0.14,-0.54l-2.71,-1.67l-0.56,0.14l-0.69,1.19l-1.81,-0.37l-1.09,-1.19l-2.96,-0.09l-1.25,-0.91l0.61,-1.35l-0.4,-0.97l-1.19,-0.3l-0.89,-0.66l-2.69,0.07l-0.36,-0.23l-0.11,-1.26l-1.04,-0.6l0.09,-1.2l-0.51,-0.29l-0.48,0.19l-0.23,-0.64l-0.51,-0.13l0.26,-0.83l-0.45,-0.58l-0.69,-0.12l-1.81,0.67l-2.24,-1.27ZM789.47,212.09l0.29,-0.0l0.93,0.21l-0.44,0.4l-0.78,-0.61ZM796.19,217.99l0.0,0.16l-0.13,-0.11l0.12,-0.06ZM802.41,225.45l-0.02,0.33l-0.21,-0.15l0.23,-0.19ZM806.38,228.91l-0.16,0.3l-0.12,0.07l0.02,-0.24l0.26,-0.12ZM796.93,220.4l-0.06,0.01l-0.08,0.03l0.11,-0.06l0.03,0.02ZM796.6,220.53l-0.26,0.56l-0.18,0.12l0.15,-0.61l0.29,-0.07ZM795.49,216.88l-0.6,0.31l-0.58,-0.42l0.02,-0.53l0.16,-0.22l0.68,0.3l0.32,0.56ZM793.86,212.93l-0.25,0.5l-0.8,0.39l0.15,-1.17l0.9,0.27ZM801.56,228.92l0.02,-0.04l0.06,0.04l-0.0,0.01l-0.08,-0.01Z", "name": "Maryland"}, "US-AR": {"path": "M498.38,376.62l-1.42,-37.98l-4.48,-23.96l37.65,-2.57l38.99,-3.58l0.8,1.6l1.01,0.7l0.11,1.77l-0.77,0.57l-0.22,0.93l-1.42,0.93l-0.29,1.04l-0.83,0.54l-1.19,2.59l0.02,0.7l0.53,0.26l10.93,-1.46l0.86,0.93l-1.18,0.37l-0.52,0.96l0.25,0.49l0.84,0.41l-3.6,2.7l0.02,0.83l0.83,1.04l-0.59,1.14l0.61,0.97l-1.42,0.74l-0.11,1.44l-1.45,2.09l0.12,1.64l0.91,3.1l-0.15,0.27l-1.08,-0.01l-0.33,0.26l-0.51,1.73l-1.52,0.95l-0.04,0.51l0.79,0.91l0.05,0.65l-1.1,1.21l-2.02,1.13l-0.21,0.62l0.43,1.0l-0.19,0.27l-1.23,0.03l-0.42,0.67l-0.32,1.88l0.47,1.56l0.02,3.07l-1.27,1.09l-1.54,0.13l0.23,1.48l-0.21,0.48l-0.93,0.25l-0.59,1.77l-1.48,1.19l-0.02,0.93l1.39,0.76l-0.03,0.7l-1.23,0.3l-2.23,1.23l0.03,0.67l0.99,0.82l-0.45,1.14l0.53,1.38l-1.09,0.62l-1.9,2.57l0.52,0.7l1.0,0.49l0.01,0.57l-0.98,0.29l-0.42,0.64l0.51,0.84l1.63,1.01l0.06,1.76l-0.59,0.98l-0.09,0.84l1.34,0.79l0.5,2.17l-1.09,1.01l0.06,2.11l-51.41,4.07l-0.83,-11.52l-1.18,-0.85l-0.9,0.16l-0.82,-0.35l-0.93,0.39l-1.22,-0.33l-0.57,0.72l-0.47,0.01l-0.49,-0.48l-0.82,-0.15l-0.62,-1.0Z", "name": "Arkansas"}, "US-MA": {"path": "M876.8,135.88l1.21,-0.36l0.85,-1.12l0.63,0.63l-0.21,0.44l-2.48,0.41ZM819.78,119.93l30.02,-7.99l1.53,-1.8l0.34,-1.48l0.95,-0.35l0.61,-1.04l1.17,-1.05l1.35,-0.1l-0.44,1.05l1.03,0.32l0.21,1.55l1.17,0.55l-0.06,0.32l0.39,0.28l1.31,0.19l-0.17,0.56l-2.29,1.79l-0.05,1.07l0.45,0.16l-1.11,1.4l0.23,1.08l-1.01,0.96l0.58,1.41l1.4,0.45l0.5,0.63l1.36,-0.57l0.33,-0.59l1.2,0.09l0.79,0.47l0.23,0.68l1.78,1.37l-0.07,1.25l-0.55,0.55l0.12,0.6l1.23,0.66l1.73,-0.23l0.68,1.2l0.21,1.14l0.89,0.68l1.33,0.41l1.48,-0.12l0.43,0.38l1.05,-0.23l2.92,-2.34l0.81,-1.11l0.54,0.02l0.56,1.86l-3.32,1.51l-0.94,0.82l-2.75,0.98l-0.49,1.64l-1.93,1.37l-0.82,-2.64l0.11,-1.34l-0.55,-0.31l-0.5,0.39l-0.93,-0.1l-0.3,0.51l0.25,0.92l-0.26,0.79l-0.4,0.06l-0.63,1.09l-0.6,-0.2l-0.5,0.48l0.22,1.85l-0.89,0.87l-0.63,-0.79l-0.47,0.01l-0.11,0.55l-0.26,0.03l-0.71,-2.02l-1.02,-0.35l0.44,-2.5l-0.21,-0.4l-0.78,0.4l-0.29,1.47l-0.69,0.2l-1.4,-0.64l-0.78,-2.11l-0.8,-0.22l-0.77,-2.15l-0.49,-0.24l-6.13,2.0l-0.3,-0.15l-14.83,4.19l-0.28,0.5l-0.46,-0.28l-0.86,0.17l-9.53,2.36l-0.25,-0.18l-0.32,-14.65ZM859.98,110.04l-0.02,-0.37l-0.14,-0.48l0.51,0.23l-0.35,0.62ZM875.58,122.76l-0.12,-0.42l0.24,0.35l-0.13,0.06ZM874.57,121.06l-0.77,0.0l-0.54,-1.2l0.56,0.44l0.76,0.76ZM870.77,119.48l-0.08,0.14l-0.09,-0.07l0.0,-0.0l0.17,-0.07ZM871.17,135.05l0.01,-0.02l0.01,0.03l-0.02,-0.01ZM866.42,137.8l0.28,-0.09l0.16,-0.13l-0.14,0.38l-0.3,-0.16ZM867.13,137.17l0.41,-1.4l0.84,-1.18l0.17,0.26l0.46,-0.11l0.34,0.52l0.71,-0.01l0.18,0.38l-2.1,0.73l-1.01,0.81Z", "name": "Massachusetts"}, "US-AL": {"path": "M608.21,337.14l25.15,-2.9l19.38,-2.74l14.02,43.26l1.01,2.45l1.17,1.59l0.59,1.87l2.24,2.49l0.92,1.79l-0.11,2.13l1.79,1.13l-0.17,0.73l-0.63,0.1l-0.16,0.7l-0.98,0.84l-0.22,2.29l0.25,1.48l-0.76,2.29l-0.14,1.84l1.1,2.93l1.21,1.52l0.53,1.6l-0.08,5.02l-0.25,0.81l0.48,2.03l1.35,1.16l1.14,2.06l-47.6,6.92l-0.42,0.61l-0.08,2.99l2.64,2.75l2.0,0.96l-0.34,2.7l0.56,1.6l0.43,0.39l-0.94,1.69l-1.24,1.0l-1.13,-0.75l-0.34,0.49l0.66,1.46l-2.81,1.05l0.29,-0.63l-0.45,-0.86l-0.99,-0.76l-0.1,-1.11l-0.57,-0.22l-0.52,0.61l-0.32,-0.1l-0.89,-1.53l0.41,-1.67l-0.97,-2.21l-1.32,-0.65l-0.3,-0.89l-0.56,-0.17l-0.37,0.61l0.14,0.35l-0.77,3.1l-0.01,5.08l-0.59,0.0l-0.25,-0.71l-2.22,-0.44l-1.64,0.31l-5.45,-31.96l-0.98,-66.43l-0.02,-0.37l-1.07,-0.63l-0.69,-1.02Z", "name": "Alabama"}, "US-MO": {"path": "M468.37,225.32l24.69,-0.73l18.93,-1.42l22.08,-2.58l0.42,0.35l0.39,0.91l2.43,1.65l0.29,0.74l1.21,0.87l-0.51,1.36l-0.1,3.21l0.78,3.65l0.95,1.43l0.03,1.58l1.1,1.37l0.46,1.55l4.96,4.1l1.06,1.69l4.93,3.31l0.7,1.15l0.27,1.62l0.5,0.82l-0.18,0.69l0.47,1.8l0.97,1.63l0.77,0.73l1.03,0.16l0.83,-0.56l0.84,-1.4l0.57,-0.19l2.41,0.61l1.68,0.76l0.84,0.77l-0.97,1.95l0.26,2.28l-2.37,6.86l0.01,1.02l0.7,1.92l4.67,4.05l1.99,1.04l1.45,0.09l1.66,1.3l1.92,0.8l1.5,2.11l2.04,0.83l0.42,2.96l1.72,2.9l-1.1,1.94l0.18,1.38l0.75,0.33l2.31,4.24l1.94,0.92l0.55,-0.32l0.0,-0.65l0.87,1.1l1.07,-0.08l0.14,1.85l-0.37,1.07l0.53,1.59l-1.07,3.86l-0.51,0.07l-1.37,-1.13l-0.65,0.13l-0.78,3.34l-0.52,0.74l0.13,-1.06l-0.56,-1.09l-0.96,-0.2l-0.74,0.63l0.02,1.05l0.53,0.66l-0.04,0.7l0.58,1.34l-0.2,0.39l-1.2,0.39l-0.17,0.41l0.15,0.55l0.85,0.83l-1.7,0.37l-0.14,0.62l1.53,1.97l-0.89,0.75l-0.63,2.13l-10.6,1.42l1.06,-2.27l0.87,-0.61l0.18,-0.87l1.43,-0.95l0.25,-0.96l0.63,-0.37l0.29,-0.59l-0.22,-2.28l-1.05,-0.75l-0.2,-0.77l-1.09,-1.18l-39.21,3.6l-37.68,2.58l-3.21,-58.14l-1.03,-0.63l-1.2,-0.02l-1.52,-0.73l-0.19,-0.93l-1.11,-1.3l-0.36,-1.55l-0.55,-0.09l-0.3,-0.56l-1.13,-0.66l-1.4,-1.84l0.73,-0.51l0.09,-1.24l1.12,-1.27l0.09,-0.79l1.01,0.16l0.56,-0.43l-0.2,-2.23l-1.02,-0.74l-0.32,-1.1l-1.17,-0.01l-1.31,0.96l-0.81,-0.7l-0.73,-0.17l-2.67,-2.35l-1.05,-0.28l0.13,-1.6l-1.32,-1.72l0.1,-1.01l-0.37,-0.36l-1.01,-0.18l-0.59,-0.85l-0.84,-0.26l0.07,-0.52l-1.23,-2.88l-0.0,-0.74l-0.39,-0.49l-0.85,-0.29l-0.05,-0.53ZM583.34,294.3l-0.1,-0.1l-0.08,-0.15l0.11,-0.01l0.07,0.26Z", "name": "Missouri"}, "US-MN": {"path": "M443.33,67.63l-0.4,-1.36l0.05,-1.19l-0.48,-0.53l-1.36,-3.76l0.0,-3.21l-0.47,-1.96l0.27,-1.12l-0.56,-2.31l0.73,-2.56l-2.06,-6.89l29.52,-1.22l0.47,-0.81l-0.38,-7.11l2.84,0.15l1.24,0.82l0.38,2.69l1.73,5.3l0.13,2.3l0.52,0.86l1.46,1.05l1.3,0.49l3.22,-0.36l0.39,0.85l0.54,0.38l5.24,0.04l0.37,0.24l0.54,1.58l0.72,0.61l4.26,-0.77l0.77,-0.65l0.07,-0.69l0.69,-0.35l1.74,-0.44l3.97,-0.02l1.42,0.7l3.38,0.66l-1.0,0.78l0.0,0.82l0.51,0.45l2.9,-0.06l0.52,2.08l1.58,2.29l0.71,0.05l1.03,-0.78l-0.04,-1.73l2.67,-0.46l1.43,2.16l2.0,0.79l1.53,0.18l0.54,0.57l-0.03,0.83l0.58,0.35l1.32,0.06l0.19,0.75l0.41,0.1l1.2,-0.22l1.12,0.22l2.21,-0.85l2.77,-2.55l2.49,-1.54l1.24,2.52l0.96,0.51l2.22,-0.66l0.87,0.36l5.97,-1.3l0.56,0.18l1.32,1.64l1.24,0.59l0.62,-0.01l1.61,-0.82l1.29,0.1l-0.88,1.0l-4.68,3.07l-6.34,2.82l-3.68,2.47l-2.15,2.49l-0.96,0.57l-6.62,8.66l-0.95,0.6l-1.07,1.56l-1.96,1.97l-4.17,3.55l-0.86,1.78l-0.55,0.44l-0.14,0.96l-0.78,-0.01l-0.46,0.51l0.98,12.21l-0.79,1.2l-1.04,0.08l-0.52,0.82l-0.83,0.15l-0.61,0.83l-2.06,1.19l-0.93,1.86l0.06,0.72l-1.69,2.39l-0.01,2.06l0.38,0.91l2.15,0.39l1.42,2.49l-0.52,1.92l-0.71,1.25l-0.05,2.12l0.45,1.32l-0.71,1.23l0.91,3.14l-0.51,4.08l3.95,3.03l3.02,0.4l1.89,2.25l2.87,0.49l2.45,1.93l2.39,3.59l2.63,1.8l2.09,0.09l1.07,0.71l0.88,0.1l0.82,1.36l1.26,0.84l0.27,2.03l0.68,1.3l0.39,4.81l-40.59,3.19l-40.59,2.08l-1.45,-38.95l-1.52,-2.05l-2.57,-0.79l-0.94,-1.91l-1.46,-1.79l0.21,-0.67l2.82,-2.34l0.93,-2.03l0.43,-2.53l-0.35,-1.58l0.23,-1.86l-0.18,-1.51l-0.5,-1.03l-0.18,-2.33l-1.81,-2.59l-0.47,-1.13l-0.21,-2.16l-0.66,-0.98l0.15,-1.66l-0.35,-1.52l0.53,-2.69l-1.08,-1.85l-0.49,-8.32l-0.42,-0.79l0.06,-3.91l-1.58,-3.95l-0.53,-0.65Z", "name": "Minnesota"}, "US-CA": {"path": "M3.07,175.23l0.87,-1.1l0.96,0.24l1.21,-2.15l0.92,0.12l0.64,-0.23l0.41,-0.57l-0.27,-0.82l-0.71,-0.36l1.52,-2.68l0.12,-0.78l-0.43,-0.48l0.1,-1.34l0.85,-0.87l1.17,-2.25l1.26,-3.01l0.39,-2.09l-0.28,-1.0l0.05,-3.88l-1.25,-1.24l0.91,-1.24l0.94,-2.8l32.7,8.12l32.54,7.33l-13.66,64.62l25.42,34.63l36.56,51.05l13.29,17.71l-0.19,2.73l0.73,0.94l0.21,1.71l0.85,0.63l0.81,2.56l-0.07,0.91l0.63,1.46l-0.16,1.36l3.8,3.82l0.01,0.5l-1.95,1.52l-3.11,1.26l-1.2,1.99l-1.72,1.14l-0.33,0.81l0.38,1.03l-0.51,0.51l-0.1,0.9l0.08,2.29l-0.6,0.72l-0.64,2.43l-2.02,2.47l-1.6,0.14l-0.42,0.51l0.33,0.89l-0.59,1.34l0.54,1.11l-0.01,1.19l-0.78,2.68l0.57,1.02l2.74,1.13l0.34,0.83l-0.18,2.4l-1.18,0.78l-0.42,1.37l-2.27,-0.62l-1.26,0.61l-43.33,-3.35l0.04,-0.76l0.39,-0.07l0.3,-0.56l-0.12,-1.38l-1.1,-1.65l-1.08,0.02l0.16,-1.13l-0.24,-1.11l0.35,-0.13l0.36,-0.93l0.05,-2.47l-0.39,-2.64l-2.46,-5.66l-3.46,-4.07l-1.29,-1.97l-2.42,-2.12l-2.07,-2.85l-2.01,-1.04l-1.23,0.18l-0.29,0.88l-1.56,-0.94l-0.11,-0.38l0.63,-0.52l0.22,-0.95l-0.46,-2.65l-1.0,-1.95l-0.7,-0.58l-2.17,-0.43l-1.45,-0.13l-1.11,0.3l-0.49,-0.59l-1.65,-0.64l-3.05,-1.94l-1.24,-1.35l-0.54,-2.64l-0.88,-0.66l-1.77,-2.24l-1.66,-1.3l-1.91,-0.51l-1.09,0.24l-1.1,-0.72l-1.51,-0.14l-2.0,-1.52l-2.34,-0.83l-5.72,-0.67l-0.4,-1.69l-1.01,-0.93l-0.92,-0.35l1.28,-2.62l-0.33,-1.38l0.84,-2.21l-0.65,-1.27l1.18,-2.39l0.32,-2.41l-0.99,-1.24l-1.32,-0.26l-1.34,-1.39l-0.08,-0.75l1.44,-1.4l-0.5,-2.3l-0.34,-0.54l-1.67,-0.76l-1.88,-4.27l-1.79,-1.16l-0.32,-2.63l-1.62,-2.61l-0.22,-2.75l-1.01,-0.76l-1.13,-3.38l-2.15,-2.3l-0.75,-1.6l0.04,-3.93l0.55,-1.46l-0.54,-0.6l0.52,-0.53l0.56,0.71l0.58,-0.1l0.8,-0.59l0.9,-1.63l0.83,0.01l0.08,-0.52l-0.51,-0.5l0.4,-0.88l-0.05,-0.93l-0.49,-2.22l-0.61,-1.2l-0.6,-0.44l-0.92,0.24l-2.02,-0.43l-1.45,-1.81l-0.86,-2.15l-0.53,-0.38l-0.32,-1.18l-0.46,-0.5l0.04,-1.12l0.85,-2.26l-0.21,-2.94l-0.89,-1.29l1.1,-2.73l0.21,-2.33l1.33,-0.2l0.23,1.52l-0.62,0.31l-0.1,2.71l1.73,1.17l0.7,1.41l1.0,0.72l0.4,1.01l0.89,0.4l0.85,-0.4l-0.19,-1.18l-0.68,-0.51l-0.37,-1.53l0.13,-1.99l-0.54,-1.26l-0.37,-0.02l-0.11,-0.14l0.62,-0.35l-0.0,-0.34l-1.62,-1.2l0.69,-0.67l-0.17,-1.88l-0.94,-0.36l-0.3,-0.61l1.06,-0.65l0.99,-0.01l0.95,-0.71l1.25,1.03l2.62,-0.1l5.0,2.23l0.53,-0.22l0.04,-0.59l0.61,-0.67l-0.3,0.75l0.39,0.76l0.81,-0.06l0.35,-0.49l1.35,1.59l0.7,-0.16l0.02,-0.38l-0.53,-1.14l-0.97,-0.74l-0.27,-0.8l-0.66,-0.38l-1.08,-0.07l0.27,-0.58l-0.25,-0.54l-2.47,1.29l-0.7,-0.34l-0.75,0.18l-0.18,-0.55l-1.09,-0.25l0.28,-0.66l-0.36,-0.69l-1.08,-0.17l-1.85,1.57l-0.34,-0.46l-1.36,-0.54l-0.36,-0.88l-1.36,-1.35l-2.59,0.52l0.1,0.92l-0.69,1.21l0.53,0.72l-0.88,0.92l-0.07,2.28l-0.37,-0.09l-1.52,-2.07l-1.18,-0.34l-1.16,-2.44l-1.41,-1.2l0.09,-0.69l-0.68,-0.18l0.72,-1.17l0.93,2.05l0.44,0.25l0.33,-0.38l-1.77,-5.64l-0.41,-0.59l-0.57,-0.2l0.2,-0.84l-0.53,-2.28l-2.72,-3.32l-1.0,-2.98l-3.44,-6.17l-0.03,-0.38l1.13,-1.43l0.12,-0.84l-0.51,-6.74l0.61,-1.86l1.33,-2.02l0.4,-3.04l-0.36,-1.21l0.19,-2.39l-0.7,-1.04l-1.24,-3.68l-0.57,-0.53l0.1,-0.93l-0.32,-0.88l-1.03,-0.88l-2.01,-3.31l0.52,-1.23l-0.26,-2.71l2.37,-3.43ZM33.34,240.42l0.01,-0.01l0.01,0.01l-0.02,-0.01ZM45.64,325.97l-0.02,0.03l0.02,-0.03l0.01,0.01ZM31.6,240.2l-0.09,0.14l-0.63,0.23l-0.2,-0.07l0.92,-0.3ZM64.39,351.36l0.25,0.02l0.12,0.18l-0.3,-0.09l-0.08,-0.11ZM65.88,352.49l1.24,0.77l0.76,1.84l-0.71,-0.55l-1.36,-0.3l-0.19,-0.45l0.25,-1.3ZM62.75,362.69l0.35,0.67l1.43,1.87l-0.36,0.2l-0.93,-0.98l-0.49,-1.75ZM43.78,333.68l1.01,0.67l1.25,0.32l1.01,0.93l-0.99,0.28l-2.06,-0.63l-0.22,-1.56ZM48.37,335.72l0.36,-0.44l0.53,0.07l-0.3,0.37l-0.6,-0.0ZM45.95,352.06l0.3,-0.1l1.05,0.9l-0.69,-0.26l-0.66,-0.54ZM37.78,333.89l1.16,-0.17l1.18,0.26l0.31,0.81l0.69,0.46l-2.29,0.46l-0.6,-0.54l-0.46,-1.28Z", "name": "California"}, "US-IA": {"path": "M452.59,162.09l42.79,-2.19l40.52,-3.19l0.96,2.52l1.99,1.0l0.08,0.59l-0.9,1.8l-0.16,1.04l0.9,5.08l0.92,1.26l0.39,1.75l1.46,1.72l4.94,0.85l1.26,2.03l-0.3,1.03l0.29,0.66l3.61,2.37l0.85,2.41l3.84,2.31l0.62,1.68l-0.31,4.21l-1.64,1.98l-0.5,1.94l0.13,1.28l-1.25,1.36l-2.51,0.96l-0.89,1.18l-0.55,0.25l-4.56,0.83l-0.89,0.73l-0.61,1.71l-0.15,2.55l0.4,1.08l2.01,1.47l0.54,2.65l-1.87,3.25l-0.22,2.24l-0.52,1.42l-2.88,1.39l-1.02,1.02l-0.2,0.99l0.72,0.87l0.2,2.15l-0.58,0.23l-1.34,-0.82l-0.31,-0.76l-1.29,-0.82l-0.29,-0.51l-0.88,-0.36l-0.3,-0.82l-0.94,-0.68l-22.28,2.61l-15.11,1.16l-7.58,0.51l-20.76,0.47l-0.22,-1.06l-1.29,-0.73l-0.33,-0.67l0.57,-1.16l-0.21,-0.95l0.22,-1.39l-0.36,-2.18l-0.6,-0.73l0.07,-3.64l-1.05,-0.5l0.05,-0.9l0.71,-1.02l-0.05,-0.44l-1.31,-0.56l0.33,-2.54l-0.41,-0.45l-0.89,-0.16l0.23,-0.8l-0.3,-0.58l-0.51,-0.25l-0.74,0.23l-0.42,-2.81l0.5,-2.36l-0.2,-0.67l-1.36,-1.71l-0.08,-1.92l-1.78,-1.54l-0.36,-1.74l-1.08,-0.94l0.03,-2.18l-1.1,-1.87l0.21,-1.7l-0.27,-1.08l-1.38,-0.67l-0.87,-2.17l0.05,-0.63l-1.8,-1.82l0.56,-1.6l0.54,-0.47l0.72,-2.68l0.0,-1.68l0.54,-0.68l0.21,-1.19l-0.51,-2.24l-1.33,-0.29l-0.05,-0.73l0.45,-0.56l-0.0,-1.71l-0.95,-1.42l-0.05,-0.87Z", "name": "Iowa"}, "US-MI": {"path": "M611.79,185.66l1.83,-2.17l0.7,-1.59l1.18,-4.4l1.43,-3.04l1.01,-5.05l0.09,-5.36l-0.86,-5.54l-2.4,-5.17l0.6,-0.5l0.3,-0.79l-0.57,-0.42l-1.08,0.55l-3.82,-7.03l-0.21,-1.1l1.13,-2.68l-0.01,-0.97l-0.74,-3.12l-1.28,-1.65l-0.05,-0.62l1.72,-2.73l1.22,-4.13l-0.21,-5.34l-0.77,-1.59l1.09,-1.15l0.81,-0.02l0.56,-0.47l-0.27,-3.48l1.08,-0.11l0.67,-1.43l1.18,0.47l0.66,-0.33l0.76,-2.59l0.82,-1.2l0.56,-1.68l0.55,-0.18l-0.58,0.87l0.6,1.65l-0.71,1.8l0.71,0.42l-0.48,2.61l0.88,1.42l0.73,-0.05l0.52,0.56l0.64,-0.24l0.89,-2.26l0.66,-3.51l-0.08,-2.07l-0.76,-3.42l0.58,-1.02l2.13,-1.64l2.74,-0.54l0.98,-0.63l0.28,-0.64l-0.25,-0.54l-1.76,-0.11l-0.96,-0.86l-0.52,-1.98l1.85,-2.97l-0.1,-0.73l1.72,-0.23l0.74,-0.94l4.16,2.0l0.83,0.12l1.98,-0.4l1.37,0.4l1.19,1.04l0.53,1.15l0.77,0.49l2.41,-0.29l1.7,1.01l1.92,0.09l0.8,0.64l3.26,0.45l1.1,0.77l-0.01,1.12l1.04,1.31l0.64,0.21l0.37,0.91l-0.14,0.55l-0.66,-0.25l-0.94,0.57l-0.23,1.83l0.81,1.29l1.6,0.98l0.69,1.37l0.65,2.26l-0.12,1.73l0.77,5.56l-0.14,0.59l-0.58,0.21l-0.48,0.96l-0.74,0.07l-0.8,0.81l-0.17,4.47l-1.12,0.49l-0.18,0.82l-1.86,0.43l-0.72,0.6l-0.58,2.61l0.26,0.45l-0.21,0.52l0.25,2.57l1.38,1.31l2.89,0.84l0.91,-0.08l1.08,-1.23l0.6,-1.44l0.62,0.19l0.39,-0.24l1.01,-3.59l0.6,-1.06l-0.08,-0.51l0.97,-1.45l1.39,-0.39l1.06,-0.69l0.83,-1.1l0.87,-0.44l2.06,0.59l1.13,0.7l1.0,1.08l1.21,2.15l2.0,5.9l0.82,1.6l1.03,3.71l1.49,3.62l1.28,1.74l-0.34,3.92l0.45,2.48l-0.48,2.79l-0.35,0.45l-0.57,-1.2l0.03,-0.85l-1.46,-0.52l-0.47,0.08l-1.48,1.36l-0.06,0.83l0.54,0.67l-0.82,0.57l-0.29,0.79l0.28,2.94l-0.48,0.75l-1.62,0.92l-1.06,1.85l-0.43,3.73l0.27,1.55l-0.33,0.93l-0.42,0.19l0.02,0.91l-0.64,0.3l-0.89,1.6l-0.5,1.29l-0.02,1.05l-0.52,0.91l-20.49,4.22l-0.15,-0.92l-0.45,-0.33l-31.42,4.7ZM621.0,115.76l0.0,-0.07l0.11,-0.12l-0.01,0.03l-0.11,0.16ZM621.26,114.84l-0.07,-0.16l0.07,-0.14l-0.0,0.3ZM543.09,87.95l4.87,-2.38l3.55,-3.62l5.77,-1.36l1.38,-0.84l2.36,-2.7l0.98,0.04l1.52,-0.73l1.0,-2.24l2.82,-2.84l0.23,1.72l1.85,0.59l0.05,1.44l0.67,0.14l0.51,0.59l-0.17,3.14l0.44,0.95l-0.34,0.47l0.2,0.47l0.74,-0.02l1.08,-2.21l1.08,-0.89l-0.42,1.15l0.58,0.45l0.83,-0.67l0.52,-1.22l1.0,-0.43l3.09,-0.25l1.5,0.21l1.18,0.93l1.54,0.44l0.47,1.05l2.3,2.58l1.17,0.55l0.53,1.55l0.73,0.34l1.87,0.07l0.73,-0.4l1.06,-0.06l1.4,-1.09l1.0,1.11l1.1,0.64l1.01,-0.25l0.68,-0.82l1.87,1.06l0.64,-0.34l1.65,-2.58l2.81,-1.89l1.7,-1.64l0.92,0.11l3.26,-1.2l5.17,-0.25l3.25,-2.08l2.28,-0.88l1.52,-0.11l-0.01,3.24l0.29,0.71l-0.36,1.1l0.46,0.7l0.68,0.28l0.91,-0.41l2.19,0.7l1.14,-0.43l1.03,-0.87l0.66,0.48l0.21,0.7l0.85,0.22l1.22,-0.76l0.79,-1.57l0.69,-0.28l1.06,0.23l1.35,-1.14l0.53,-0.01l0.22,0.08l-0.3,2.02l0.75,1.32l-1.1,-0.04l-0.36,0.5l0.84,1.82l-0.87,1.04l0.12,0.45l0.83,0.79l1.37,-0.42l0.59,0.47l0.62,0.04l0.18,1.19l0.98,0.87l1.53,0.51l-1.17,0.68l-4.96,-0.15l-0.53,0.3l-1.35,-0.17l-0.88,0.41l-0.66,-0.75l-1.63,-0.07l-0.59,0.47l-0.07,1.22l-0.49,0.75l0.38,2.04l-0.92,-0.22l-0.89,-0.92l-0.77,-0.13l-1.95,-1.65l-2.41,-0.6l-1.6,0.04l-1.04,-0.5l-2.88,0.47l-0.61,0.45l-1.18,2.52l-3.47,0.73l-0.57,0.77l-2.06,-0.33l-2.82,0.93l-0.68,0.83l-0.56,2.51l-0.78,0.28l-0.81,0.87l-0.65,0.28l0.16,-1.95l-0.74,-0.91l-1.02,0.34l-0.77,0.92l-0.97,-0.39l-0.68,0.17l-0.37,0.4l0.1,0.82l-0.73,2.01l-1.2,0.59l-0.1,-1.37l-0.46,-1.06l0.34,-1.69l-0.17,-0.37l-0.66,-0.17l-0.45,0.57l-0.6,2.13l-0.22,2.56l-1.11,0.91l-1.26,3.02l-0.62,2.65l-2.55,5.33l-0.69,0.73l0.12,0.91l-1.4,-1.27l0.18,-1.74l0.63,-1.69l-0.41,-0.81l-0.62,-0.31l-1.35,0.85l-1.16,0.1l0.04,-1.29l0.81,-1.44l-0.41,-1.34l0.3,-1.09l-0.58,-0.98l0.15,-0.83l-1.9,-1.55l-1.1,-0.06l-0.59,-0.44l-1.48,0.0l0.3,-1.36l-0.94,-1.45l-1.13,-0.51l-2.23,-0.1l-3.19,-0.71l-1.55,0.59l-1.43,-0.42l-1.62,0.17l-4.56,-1.94l-15.36,-2.5l-1.99,-3.39l-1.88,-0.96l-0.76,0.26l-0.1,-0.29ZM602.93,98.55l-0.0,0.51l-0.46,0.32l-0.7,1.39l0.08,0.57l-0.65,-0.58l0.91,-2.15l0.83,-0.06ZM643.38,87.38l1.98,-1.52l0.17,-0.57l-0.27,-0.64l1.04,0.16l0.8,1.24l0.81,0.19l-0.28,1.09l-0.36,0.18l-1.51,-0.33l-0.77,0.45l-1.63,-0.24ZM636.91,81.17l0.4,0.45l0.22,0.61l-0.63,-0.71l0.01,-0.34ZM633.25,93.04l1.77,0.07l0.4,0.21l-0.18,0.52l-0.57,0.13l-1.42,-0.92ZM618.39,96.67l0.62,2.25l-0.43,0.61l-0.63,0.14l0.43,-3.0ZM612.8,110.72l0.47,0.3l-0.09,0.56l-0.44,-0.69l0.06,-0.17ZM611.78,113.45l0.0,-0.02l0.02,-0.03l-0.02,0.06ZM598.97,82.56l-0.23,-0.37l0.02,-0.4l0.37,0.33l-0.17,0.44ZM570.09,72.68l-0.5,-0.27l-1.16,0.06l-0.04,-1.56l1.0,-1.02l1.17,-2.09l1.83,-1.49l0.63,-0.0l0.52,-0.58l2.08,-0.89l3.34,-0.42l1.1,0.66l-0.54,0.38l-1.31,-0.12l-2.26,0.78l0.15,0.87l0.71,0.13l-1.19,0.98l-1.4,1.89l-0.69,0.28l-0.36,1.45l-1.15,1.36l-0.66,2.04l-0.67,-0.87l0.75,-0.97l0.14,-1.95l-0.84,-0.23l-0.6,0.92l-0.05,0.67ZM557.88,58.15l0.75,-0.98l-0.39,-0.33l0.56,-0.53l7.2,-4.88l-0.45,0.66l0.1,0.79l-0.43,0.49l-4.24,2.56l-0.86,0.98l0.24,0.36l-1.87,1.17l-0.61,-0.28Z", "name": "Michigan"}, "US-GA": {"path": "M653.55,331.39l22.0,-3.56l20.63,-3.86l-0.07,0.58l-2.59,3.34l-0.41,1.73l0.11,1.23l0.82,0.78l1.84,0.8l1.03,0.12l2.7,2.02l0.84,0.23l1.9,-0.37l0.6,0.25l0.8,1.64l1.51,1.6l1.04,2.5l1.33,0.82l0.84,1.16l0.56,0.26l1.0,1.77l1.07,0.3l1.17,0.99l3.81,1.84l2.41,3.16l2.25,0.58l2.53,1.67l0.5,2.33l1.24,1.01l0.47,-0.16l0.31,0.49l-0.1,0.62l0.79,0.72l0.79,0.09l0.56,1.2l4.98,1.88l0.4,1.78l1.54,1.73l1.02,2.0l-0.07,0.8l0.48,0.69l0.11,1.24l1.04,0.79l2.41,0.79l0.28,0.53l0.57,0.23l1.12,2.55l0.76,0.57l0.08,2.68l0.77,1.48l1.38,0.9l1.52,-0.27l1.44,0.76l1.45,0.12l-0.58,0.78l-0.55,-0.35l-0.47,0.27l-0.4,0.99l0.62,0.91l-0.38,0.48l-1.38,-0.16l-0.77,-0.55l-0.65,0.44l0.26,0.71l-0.49,0.52l0.36,0.6l1.44,0.25l-0.58,1.35l-1.43,0.27l-1.08,-0.44l-0.6,0.21l0.03,0.82l1.45,0.6l-1.76,3.73l0.36,1.73l-0.48,0.97l0.85,1.47l-2.29,-0.19l-0.46,0.29l0.06,0.63l0.55,0.34l2.76,0.24l1.07,0.66l-0.02,0.34l-0.56,0.22l-0.88,1.95l-0.5,-1.41l-0.45,-0.13l-0.6,0.33l-0.15,0.84l0.34,0.96l-0.6,0.12l-0.03,0.84l-0.3,0.16l0.07,0.46l1.33,1.15l-1.09,1.03l0.32,0.47l0.77,0.08l-0.39,0.91l0.06,0.88l-0.46,0.51l1.1,1.66l0.03,0.76l-0.79,0.33l-2.63,-0.16l-4.06,-0.96l-1.31,0.35l-0.18,0.74l-0.68,0.26l-0.35,1.25l0.28,2.08l0.95,1.36l0.13,4.24l-1.97,0.4l-0.54,-0.92l-0.12,-1.3l-1.33,-1.82l-49.17,5.13l-0.72,-0.56l-0.86,-2.7l-0.94,-1.51l-0.56,-0.38l0.16,-0.68l-0.73,-1.51l-1.82,-1.81l-0.43,-1.75l0.25,-0.8l0.06,-5.18l-0.6,-1.81l-1.18,-1.47l-1.03,-2.65l0.12,-1.65l0.77,-2.36l-0.25,-1.53l0.19,-2.11l1.62,-1.33l0.46,-1.47l-0.55,-0.61l-1.42,-0.69l0.09,-2.15l-0.97,-1.87l-2.18,-2.41l-1.03,-2.8l-0.75,-0.68l-0.16,-0.96l-0.77,-1.37l-13.98,-43.08ZM745.36,389.39l0.09,0.25l-0.07,0.25l-0.06,-0.25l0.04,-0.24ZM744.17,394.91l0.39,-2.07l0.44,-0.49l-0.31,1.19l-0.53,1.36ZM743.16,406.34l0.05,0.87l-0.01,0.45l-0.33,-0.56l0.3,-0.76Z", "name": "Georgia"}, "US-AZ": {"path": "M128.41,383.85l0.44,-1.81l1.28,-1.28l0.53,-1.12l0.48,-0.25l1.66,0.62l0.96,-0.03l0.51,-0.46l0.28,-1.17l1.31,-0.99l0.24,-2.73l-0.46,-1.24l-0.84,-0.66l-2.06,-0.66l-0.3,-0.61l0.8,-2.4l0.0,-1.38l-0.52,-1.19l0.57,-0.86l-0.2,-0.87l1.57,-0.27l2.29,-2.8l0.65,-2.43l0.65,-0.81l0.02,-3.17l0.55,-0.62l-0.29,-1.43l1.71,-1.14l1.03,-1.85l3.16,-1.29l2.03,-1.58l0.26,-0.53l-0.13,-1.04l-3.24,-3.48l-0.51,-0.22l0.22,-1.26l-0.66,-1.45l0.07,-0.91l-0.88,-2.76l-0.84,-0.56l-0.19,-1.65l-0.69,-0.8l0.19,-3.53l0.58,-0.87l-0.3,-0.86l1.03,-0.4l0.4,-1.42l0.14,-3.2l-0.76,-3.65l0.75,-2.55l-0.39,-3.0l0.85,-2.55l-0.8,-1.87l-0.03,-0.92l0.78,-1.88l2.53,-0.63l1.75,0.99l1.43,-0.19l0.96,2.24l0.78,0.71l1.54,0.14l1.01,-0.5l1.02,-2.27l0.94,-1.19l2.57,-16.93l42.39,5.77l42.52,4.67l-11.81,123.55l-36.84,-4.05l-36.3,-18.96l-28.41,-15.55Z", "name": "Arizona"}, "US-MT": {"path": "M166.27,57.26l0.69,-0.1l0.33,-0.38l-0.9,-1.99l0.83,-0.96l-0.39,-1.3l0.09,-0.96l-1.24,-1.93l-0.24,-1.49l-1.03,-1.33l-1.19,-2.44l3.53,-20.62l43.63,6.71l43.01,5.22l42.72,3.84l43.09,2.52l-3.53,85.97l-28.08,-1.47l-26.79,-1.91l-26.76,-2.4l-25.82,-2.78l-0.44,0.35l-1.22,10.4l-1.51,-2.01l-0.03,-0.91l-1.18,-2.35l-1.24,-0.74l-1.8,0.92l0.03,1.05l-0.72,0.42l-0.34,1.56l-2.42,-0.41l-1.91,0.57l-0.92,-0.85l-3.35,0.09l-2.38,-0.96l-1.68,0.58l-0.84,1.48l-4.66,-1.6l-1.29,0.37l-1.12,0.9l-0.31,0.67l-1.65,-1.4l0.22,-1.43l-0.9,-1.71l0.4,-0.36l0.07,-0.62l-1.17,-3.07l-1.45,-1.25l-1.44,0.35l-0.21,-0.64l-1.08,-0.9l-0.41,-1.37l0.68,-0.61l0.2,-1.41l-0.77,-2.38l-0.77,-0.35l-0.31,-1.58l-1.51,-2.54l0.23,-1.51l-0.56,-1.26l0.34,-1.4l-0.72,-0.86l0.48,-0.97l-0.21,-0.74l-1.14,-0.75l-0.13,-0.59l-0.85,-0.91l-0.8,-0.4l-0.51,0.37l-0.07,0.74l-0.7,0.27l-1.13,1.22l-1.75,0.37l-1.21,1.07l-1.08,-0.85l-0.64,-1.01l-1.05,-0.44l0.02,-0.86l0.74,-0.63l0.24,-1.06l-0.61,-1.6l0.9,-1.09l1.07,-0.08l0.83,-0.8l-0.26,-1.14l0.38,-1.07l-0.95,-0.8l-0.04,-0.8l0.66,-1.28l-0.59,-1.07l0.74,-0.07l0.38,-0.42l-0.04,-1.77l1.82,-3.73l-0.14,-1.05l0.89,-0.62l0.6,-3.16l-0.78,-0.5l-1.8,0.37l-1.33,-0.11l-0.64,-0.55l0.37,-0.83l-0.62,-0.97l-0.66,-0.23l-0.72,0.35l-0.07,-0.95l-1.74,-1.62l0.04,-1.84l-1.68,-1.82l-0.08,-0.68l-1.54,-2.88l-1.07,-1.29l-0.57,-1.63l-2.35,-1.34l-0.95,-1.95l-1.43,-1.19Z", "name": "Montana"}, "US-MS": {"path": "M555.09,430.69l0.67,-0.97l-1.05,-1.76l0.18,-1.63l-0.81,-0.87l1.68,-0.25l0.47,-0.54l0.4,-2.74l-0.77,-1.82l1.56,-1.79l0.25,-3.58l0.74,-2.26l1.88,-1.25l1.15,-1.97l1.4,-1.03l0.34,-0.78l-0.04,-0.99l-0.63,-0.96l1.14,-0.28l0.96,-2.58l0.91,-1.3l-0.16,-0.86l-1.53,-0.43l-0.35,-0.96l-1.82,-1.04l-0.07,-2.14l-0.93,-0.74l-0.45,-0.84l-0.02,-0.37l1.14,-0.29l0.46,-0.69l-0.26,-0.89l-1.4,-0.49l0.23,-1.77l0.98,-1.54l-0.77,-1.06l-1.08,-0.31l-0.15,-2.82l0.9,-0.54l0.23,-0.8l-0.62,-2.52l-1.25,-0.66l0.7,-1.32l-0.07,-2.21l-2.02,-1.52l1.13,-0.47l0.12,-1.41l-1.34,-0.89l1.58,-2.03l0.93,-0.31l0.36,-0.69l-0.52,-1.56l0.42,-1.35l-0.9,-0.89l2.84,-1.1l0.59,-0.76l-0.09,-1.07l-1.41,-0.95l1.39,-1.07l0.62,-1.77l0.94,-0.17l0.34,-0.97l-0.2,-0.77l1.47,-0.43l1.22,-1.21l0.07,-3.52l-0.46,-1.53l0.36,-1.78l0.73,0.09l0.68,-0.33l0.42,-0.87l-0.41,-1.06l2.72,-1.71l0.58,-1.06l-0.29,-1.28l36.41,-4.1l0.86,1.25l0.85,0.45l0.98,66.44l5.51,32.92l-0.73,0.69l-1.53,-0.3l-0.9,-0.94l-1.32,1.06l-1.23,0.17l-2.17,-1.26l-1.85,-0.19l-0.83,0.36l-0.34,0.44l0.32,0.41l-0.56,0.36l-3.96,1.66l-0.05,-0.49l-0.96,-0.52l-1.0,0.05l-0.58,1.0l0.76,0.61l-1.59,1.21l-0.32,1.28l-0.69,0.3l-1.33,-0.06l-1.16,-1.86l-0.08,-0.89l-0.91,-1.47l-0.21,-1.0l-1.4,-1.63l-1.16,-0.54l-0.47,-0.77l0.1,-0.62l-0.69,-0.92l0.21,-1.98l0.5,-0.93l0.66,-2.98l-0.06,-1.22l-0.43,-0.29l-34.63,3.41Z", "name": "Mississippi"}, "US-SC": {"path": "M697.02,323.8l4.86,-2.69l1.02,-0.05l1.11,-1.38l3.93,-1.89l0.45,-0.88l0.63,0.22l22.69,-3.36l0.07,1.22l0.42,0.57l0.71,0.01l1.21,-1.3l2.82,2.54l0.46,2.47l0.55,0.52l19.72,-3.48l22.72,15.06l0.02,0.55l-2.48,2.18l-2.44,3.66l-2.41,5.72l-0.09,2.73l-1.08,-0.21l0.85,-2.72l-0.63,-0.23l-0.76,0.87l-0.56,1.38l-0.11,1.55l0.83,0.95l1.05,0.23l0.44,0.91l-0.75,0.08l-0.41,0.56l-0.87,0.02l-0.24,0.68l0.94,0.45l-1.1,1.13l-0.07,1.02l-1.34,0.63l-0.49,-0.61l-0.5,-0.08l-1.06,0.87l-0.56,1.77l0.43,0.87l-1.19,1.23l-0.61,1.44l-1.2,1.01l-0.9,-0.4l0.27,-0.59l-0.53,-0.73l-1.37,0.31l0.25,1.2l-0.51,0.03l0.05,0.76l2.02,1.01l-0.12,0.39l-0.88,0.94l-1.22,0.23l-0.24,0.51l0.33,0.45l-2.29,1.34l-1.42,-0.84l-0.56,0.11l-0.1,0.67l1.19,0.78l-1.54,1.57l-0.72,-0.75l-0.5,0.52l-0.0,0.74l-1.54,-0.37l-1.34,-0.84l-0.44,0.5l0.16,0.53l-1.72,0.17l-0.44,0.37l-0.06,0.78l2.07,0.05l-0.25,0.55l0.42,0.25l1.91,-0.15l0.11,0.22l-0.97,0.86l-0.32,0.78l0.57,0.49l0.94,-0.53l0.03,0.21l-1.12,1.09l-0.99,0.43l-0.21,-2.04l-0.69,-0.27l-0.22,-1.54l-0.88,-0.15l-0.3,0.58l0.86,2.69l-1.12,-0.66l-0.63,-1.0l-0.39,-1.76l-0.65,-0.21l-0.52,-0.63l-0.69,0.0l-0.27,0.6l0.84,1.02l0.01,0.68l1.11,1.83l-0.02,0.86l1.22,1.17l-0.62,0.35l0.03,0.98l-1.2,3.56l-1.51,-0.78l-1.52,0.26l-0.97,-0.68l-0.54,-1.03l-0.16,-2.93l-0.86,-0.75l-1.06,-2.47l-1.04,-0.94l-3.23,-1.33l-0.49,-2.65l-1.12,-2.17l-1.43,-1.58l-0.06,-1.07l-0.76,-1.21l-4.81,-1.69l-0.58,-1.27l-1.21,-0.37l0.02,-0.7l-0.53,-0.87l-0.87,0.0l-0.73,-0.61l0.03,-1.21l-0.66,-1.26l-2.69,-1.78l-2.16,-0.52l-2.36,-3.12l-3.93,-1.92l-1.22,-1.03l-0.83,-0.12l-1.04,-1.81l-0.51,-0.22l-0.91,-1.21l-1.18,-0.68l-0.99,-2.42l-1.54,-1.65l-1.02,-1.87l-1.06,-0.37l-1.93,0.37l-0.46,-0.16l-2.75,-2.19l-1.06,0.02l-2.22,-1.27l0.36,-2.22l2.6,-3.31l0.15,-1.07ZM749.79,374.91l0.72,-0.08l0.51,0.45l-1.22,1.9l0.28,-1.22l-0.3,-1.06Z", "name": "South Carolina"}, "US-RI": {"path": "M858.46,132.97l0.33,0.01l1.02,2.65l-0.31,0.56l-1.03,-3.22ZM857.72,136.64l-0.28,-0.34l0.24,-1.5l0.41,1.53l-0.37,0.31ZM850.45,141.35l0.22,-0.46l-0.53,-2.22l-3.14,-9.99l5.6,-1.84l0.76,2.06l0.8,0.25l0.19,0.73l0.08,0.42l-0.77,0.25l0.03,0.29l0.51,1.45l0.58,0.55l-0.59,0.11l-0.46,0.73l0.86,0.97l-0.14,1.22l0.89,1.89l0.03,1.67l-0.27,0.71l-0.9,0.16l-3.59,2.35l-0.18,-1.31ZM855.24,131.44l0.26,0.1l0.01,0.09l-0.17,-0.08l-0.1,-0.12ZM856.63,132.11l0.25,0.54l-0.05,0.32l-0.15,0.01l-0.05,-0.87ZM855.33,144.99l0.14,0.11l-0.2,0.1l-0.0,-0.11l0.06,-0.1Z", "name": "Rhode Island"}, "US-CT": {"path": "M822.78,156.39l2.83,-3.23l-0.07,-0.54l-1.31,-1.25l-3.49,-15.88l9.8,-2.41l0.6,0.46l0.65,-0.26l0.23,-0.58l14.15,-3.99l3.2,10.17l0.47,1.95l-0.04,1.69l-1.65,0.32l-0.91,0.81l-0.69,-0.36l-0.5,0.1l-0.18,0.91l-1.14,0.07l-1.27,1.27l-0.62,-0.14l-0.56,-1.02l-0.89,-0.09l-0.21,0.67l0.75,0.64l0.08,0.54l-0.89,-0.02l-1.02,0.87l-1.65,0.07l-1.15,0.94l-1.44,0.13l-1.21,0.93l-0.65,-1.0l-0.61,0.11l-1.01,2.45l-1.06,0.61l-0.25,1.02l-0.77,-0.26l-0.96,0.56l-0.09,0.85l-1.72,0.98l-1.94,2.27l-1.18,0.46l-0.24,0.38l-1.4,-1.23Z", "name": "Connecticut"}}, "height": 590.4573482028339, "projection": {"type": "aea", "centralMeridian": -100.0}, "width": 900.0});
jQ183.fn.vectorMap('addMap', 'us_territories', {"width":"1100","height":"1052.3622047","paths":{"US-HI":{"name":"Hawaii","path":"m341.40 752.80l1.94 -3.56l2.26 -0.32l0.32 0.81l-2.10 3.07l-2.42 0.00zm10.18 -3.72l6.14 2.59l2.10 -0.32l1.62 -3.88l-0.65 -3.39l-4.20 -0.48l-4.04 1.78l-0.97 3.72zm30.72 10.02l3.72 5.50l2.42 -0.32l1.13 -0.48l1.45 1.29l3.72 -0.16l0.97 -1.45l-2.91 -1.78l-1.94 -3.72l-2.10 -3.56l-5.82 2.91l-0.65 1.78zm20.21 8.89l1.29 -1.94l4.69 0.97l0.65 -0.48l6.14 0.65l-0.32 1.29l-2.59 1.45l-4.36 -0.32l-5.50 -1.62zm5.33 5.17l1.94 3.88l3.07 -1.13l0.32 -1.62l-1.62 -2.10l-3.72 -0.32l0.00 1.29zm6.95 -1.13l2.26 -2.91l4.69 2.42l4.36 1.13l4.36 2.75l0.00 1.94l-3.56 1.78l-4.85 0.97l-2.42 -1.45l-4.85 -6.63zm16.65 15.52l1.62 -1.29l3.39 1.62l7.60 3.56l3.39 2.10l1.62 2.42l1.94 4.36l4.04 2.59l-0.32 1.29l-3.88 3.23l-4.20 1.45l-1.45 -0.65l-3.07 1.78l-2.42 3.23l-2.26 2.91l-1.78 -0.16l-3.56 -2.59l-0.32 -4.53l0.65 -2.42l-1.62 -5.66l-2.10 -1.78l-0.16 -2.59l2.26 -0.97l2.10 -3.07l0.48 -0.97l-1.62 -1.78l-0.32 -2.10z"},"US-AK":{"name":"Alaska","path":"m266.39 687.16l-0.32 85.36l1.62 0.97l3.07 0.16l1.45 -1.13l2.59 0.00l0.16 2.91l6.95 6.79l0.48 2.59l3.39 -1.94l0.65 -0.16l0.32 -3.07l1.45 -1.62l1.13 -0.16l1.94 -1.45l3.07 2.10l0.65 2.91l1.94 1.13l1.13 2.42l3.88 1.78l3.39 5.98l2.75 3.88l2.26 2.75l1.45 3.72l5.01 1.78l5.17 2.10l0.97 4.36l0.48 3.07l-0.97 3.39l-1.78 2.26l-1.62 -0.81l-1.45 -3.07l-2.75 -1.45l-1.78 -1.13l-0.81 0.81l1.45 2.75l0.16 3.72l-1.13 0.48l-1.94 -1.94l-2.10 -1.29l0.48 1.62l1.29 1.78l-0.81 0.81c0.00 0.00 -0.81 -0.32 -1.29 -0.97c-0.48 -0.65 -2.10 -3.39 -2.10 -3.39l-0.97 -2.26c0.00 0.00 -0.32 1.29 -0.97 0.97c-0.65 -0.32 -1.29 -1.45 -1.29 -1.45l1.78 -1.94l-1.45 -1.45l0.00 -5.01l-0.81 0.00l-0.81 3.39l-1.13 0.48l-0.97 -3.72l-0.65 -3.72l-0.81 -0.48l0.32 5.66l0.00 1.13l-1.45 -1.29l-3.56 -5.98l-2.10 -0.48l-0.65 -3.72l-1.62 -2.91l-1.62 -1.13l0.00 -2.26l2.10 -1.29l-0.48 -0.32l-2.59 0.65l-3.39 -2.42l-2.59 -2.91l-4.85 -2.59l-4.04 -2.59l1.29 -3.23l0.00 -1.62l-1.78 1.62l-2.91 1.13l-3.72 -1.13l-5.66 -2.42l-5.50 0.00l-0.65 0.48l-6.47 -3.88l-2.10 -0.32l-2.75 -5.82l-3.56 0.32l-3.56 1.45l0.48 4.53l1.13 -2.91l0.97 0.32l-1.45 4.36l3.23 -2.75l0.65 1.62l-3.88 4.36l-1.29 -0.32l-0.48 -1.94l-1.29 -0.81l-1.29 1.13l-2.75 -1.78l-3.07 2.10l-1.78 2.10l-3.39 2.10l-4.69 -0.16l-0.48 -2.10l3.72 -0.65l0.00 -1.29l-2.26 -0.65l0.97 -2.42l2.26 -3.88l0.00 -1.78l0.16 -0.81l4.36 -2.26l0.97 1.29l2.75 0.00l-1.29 -2.59l-3.72 -0.32l-5.01 2.75l-2.42 3.39l-1.78 2.59l-1.13 2.26l-4.20 1.45l-3.07 2.59l-0.32 1.62l2.26 0.97l0.81 2.10l-2.75 3.23l-6.47 4.20l-7.76 4.20l-2.10 1.13l-5.33 1.13l-5.33 2.26l1.78 1.29l-1.45 1.45l-0.48 1.13l-2.75 -0.97l-3.23 0.16l-0.81 2.26l-0.97 0.00l0.32 -2.42l-3.56 1.29l-2.91 0.97l-3.39 -1.29l-2.91 1.94l-3.23 0.00l-2.10 1.29l-1.62 0.81l-2.10 -0.32l-2.59 -1.13l-2.26 0.65l-0.97 0.97l-1.62 -1.13l0.00 -1.94l3.07 -1.29l6.30 0.65l4.36 -1.62l2.10 -2.10l2.91 -0.65l1.78 -0.81l2.75 0.16l1.62 1.29l0.97 -0.32l2.26 -2.75l3.07 -0.97l3.39 -0.65l1.29 -0.32l0.65 0.48l0.81 0.00l1.29 -3.72l4.04 -1.45l1.94 -3.72l2.26 -4.53l1.62 -1.45l0.32 -2.59l-1.62 1.29l-3.39 0.65l-0.65 -2.42l-1.29 -0.32l-0.97 0.97l-0.16 2.91l-1.45 -0.16l-1.45 -5.82l-1.29 1.29l-1.13 -0.48l-0.32 -1.94l-4.04 0.16l-2.10 1.13l-2.59 -0.32l1.45 -1.45l0.48 -2.59l-0.65 -1.94l1.45 -0.97l1.29 -0.16l-0.65 -1.78l0.00 -4.36l-0.97 -0.97l-0.81 1.45l-6.14 0.00l-1.45 -1.29l-0.65 -3.88l-2.10 -3.56l0.00 -0.97l2.10 -0.81l0.16 -2.10l1.13 -1.13l-0.81 -0.48l-1.29 0.48l-1.13 -2.75l0.97 -5.01l4.53 -3.23l2.59 -1.62l1.94 -3.72l2.75 -1.29l2.59 1.13l0.32 2.42l2.42 -0.32l3.23 -2.42l1.62 0.65l0.97 0.65l1.62 0.00l2.26 -1.29l0.81 -4.36c0.00 0.00 0.32 -2.91 0.97 -3.39c0.65 -0.48 0.97 -0.97 0.97 -0.97l-1.13 -1.94l-2.59 0.81l-3.23 0.81l-1.94 -0.48l-3.56 -1.78l-5.01 -0.16l-3.56 -3.72l0.48 -3.88l0.65 -2.42l-2.10 -1.78l-1.94 -3.72l0.48 -0.81l6.79 -0.48l2.10 0.00l0.97 0.97l0.65 0.00l-0.16 -1.62l3.88 -0.65l2.59 0.32l1.45 1.13l-1.45 2.10l-0.48 1.45l2.75 1.62l5.01 1.78l1.78 -0.97l-2.26 -4.36l-0.97 -3.23l0.97 -0.81l-3.39 -1.94l-0.48 -1.13l0.48 -1.62l-0.81 -3.88l-2.91 -4.69l-2.42 -4.20l2.91 -1.94l3.23 0.00l1.78 0.65l4.20 -0.16l3.72 -3.56l1.13 -3.07l3.72 -2.42l1.62 0.97l2.75 -0.65l3.72 -2.10l1.13 -0.16l0.97 0.81l4.53 -0.16l2.75 -3.07l1.13 0.00l3.56 2.42l1.94 2.10l-0.48 1.13l0.65 1.13l1.62 -1.62l3.88 0.32l0.32 3.72l1.94 1.45l7.11 0.65l6.30 4.20l1.45 -0.97l5.17 2.59l2.10 -0.65l1.94 -0.81l4.85 1.94l4.36 2.91zm-115.10 28.94l2.10 5.33l-0.16 0.97l-2.91 -0.32l-1.78 -4.04l-1.78 -1.45l-2.42 0.00l-0.16 -2.59l1.78 -2.42l1.13 2.42l1.45 1.45l2.75 0.65zm-2.59 33.46l3.72 0.81l3.72 0.97l0.81 0.97l-1.62 3.72l-3.07 -0.16l-3.39 -3.56l-0.16 -2.75zm-20.69 -14.06l1.13 2.59l1.13 1.62l-1.13 0.81l-2.10 -3.07l0.00 -1.94l0.97 0.00zm-13.74 73.07l3.39 -2.26l3.39 -0.97l2.59 0.32l0.48 1.62l1.94 0.48l1.94 -1.94l-0.32 -1.62l2.75 -0.65l2.91 2.59l-1.13 1.78l-4.36 1.13l-2.75 -0.48l-3.72 -1.13l-4.36 1.45l-1.62 0.32l-1.13 -0.65zm48.98 -4.53l1.62 1.94l2.10 -1.62l-1.45 -1.29l-2.26 0.97zm2.91 3.07l1.13 -2.26l2.10 0.32l-0.81 1.94l-2.42 0.00zm23.60 -1.94l1.45 1.78l0.97 -1.13l-0.81 -1.94l-1.62 1.29zm8.73 -12.45l1.13 5.82l2.91 0.81l5.01 -2.91l4.36 -2.59l-1.62 -2.42l0.48 -2.42l-2.10 1.29l-2.91 -0.81l1.62 -1.13l1.94 0.81l3.88 -1.78l0.48 -1.45l-2.42 -0.81l0.81 -1.94l-2.75 1.94l-4.69 3.56l-4.85 2.91l-1.29 1.13zm42.36 -19.88l2.42 -1.45l-0.97 -1.78l-1.78 0.97l0.32 2.26z"},"US-FL":{"name":"Florida","path":"m863.71 679.00l2.27 7.32l3.73 9.74l5.33 9.38l3.72 6.30l4.85 5.50l4.04 3.72l1.62 2.91l-1.13 1.29l-0.81 1.29l2.91 7.44l2.91 2.91l2.59 5.33l3.56 5.82l4.53 8.24l1.29 7.60l0.48 11.96l0.65 1.78l-0.32 3.39l-2.42 1.29l0.32 1.94l-0.65 1.94l0.32 2.42l0.48 1.94l-2.75 3.23l-3.07 1.45l-3.88 0.16l-1.45 1.62l-2.42 0.97l-1.29 -0.48l-1.13 -0.97l-0.32 -2.91l-0.81 -3.39l-3.39 -5.17l-3.56 -2.26l-3.88 -0.32l-0.81 1.29l-3.07 -4.36l-0.65 -3.56l-2.59 -4.04l-1.78 -1.13l-1.62 2.10l-1.78 -0.32l-2.10 -5.01l-2.91 -3.88l-2.91 -5.33l-2.59 -3.07l-3.56 -3.72l2.10 -2.42l3.23 -5.50l-0.16 -1.62l-4.53 -0.97l-1.62 0.65l0.32 0.65l2.59 0.97l-1.45 4.53l-0.81 0.48l-1.78 -4.04l-1.29 -4.85l-0.32 -2.75l1.45 -4.69l0.00 -9.54l-3.07 -3.72l-1.29 -3.07l-5.17 -1.29l-1.94 -0.65l-1.62 -2.59l-3.39 -1.62l-1.13 -3.39l-2.75 -0.97l-2.42 -3.72l-4.20 -1.45l-2.91 -1.45l-2.59 0.00l-4.04 0.81l-0.16 1.94l0.81 0.97l-0.48 1.13l-3.07 -0.16l-3.72 3.56l-3.56 1.94l-3.88 0.00l-3.23 1.29l-0.32 -2.75l-1.62 -1.94l-2.91 -1.13l-1.62 -1.45l-8.08 -3.88l-7.60 -1.78l-4.36 0.65l-5.98 0.48l-5.98 2.10l-3.48 0.61l-0.24 -8.05l-2.59 -1.94l-1.78 -1.78l0.32 -3.07l10.18 -1.29l25.54 -2.91l6.79 -0.65l5.44 0.28l2.59 3.88l1.45 1.45l8.10 0.52l10.82 -0.65l21.51 -1.29l5.45 -0.67l4.58 0.03l0.16 2.91l3.82 0.81l0.32 -4.81l-1.62 -4.53l0.95 -0.73l5.11 0.45l5.17 0.32zm12.55 132.41l2.42 -0.65l1.29 -0.24l1.45 -2.34l2.34 -1.62l1.29 0.48l1.70 0.32l0.40 1.05l-3.48 1.21l-4.20 1.45l-2.34 1.21l-0.89 -0.89zm13.50 -5.01l1.21 1.05l2.75 -2.10l5.33 -4.20l3.72 -3.88l2.51 -6.63l0.97 -1.70l0.16 -3.39l-0.73 0.48l-0.97 2.83l-1.45 4.61l-3.23 5.25l-4.36 4.20l-3.39 1.94l-2.51 1.54z"},"US-SC":{"name":"South Carolina","path":"m869.55 646.43l-1.78 0.97l-2.59 -1.29l-0.65 -2.10l-1.29 -3.56l-2.26 -2.10l-2.59 -0.65l-1.62 -4.85l-2.75 -5.98l-4.20 -1.94l-2.10 -1.94l-1.29 -2.59l-2.10 -1.94l-2.26 -1.29l-2.26 -2.91l-3.07 -2.26l-4.53 -1.78l-0.48 -1.45l-2.42 -2.91l-0.49 -1.45l-3.39 -5.17l-3.39 0.16l-4.04 -2.42l-1.29 -1.29l-0.32 -1.78l0.81 -1.94l2.26 -0.97l-0.32 -2.10l6.14 -2.59l9.05 -4.53l7.27 -0.81l16.49 -0.48l2.26 1.94l1.62 3.23l4.36 -0.48l12.61 -1.46l2.91 0.81l12.61 7.60l10.11 8.12l-5.42 5.46l-2.59 6.14l-0.48 6.30l-1.62 0.81l-1.13 2.75l-2.42 0.65l-2.10 3.56l-2.75 2.75l-2.26 3.39l-1.62 0.81l-3.56 3.39l-2.91 0.16l0.97 3.23l-5.01 5.50l-2.10 1.29z"},"US-GA":{"name":"Georgia","path":"m797.93 591.46l-4.85 0.81l-8.41 1.13l-8.57 0.89l0.00 2.18l0.16 2.10l0.65 3.39l3.39 7.92l2.42 9.86l1.45 6.14l1.62 4.85l1.45 6.95l2.10 6.30l2.59 3.39l0.48 3.39l1.94 0.81l0.16 2.10l-1.78 4.85l-0.48 3.23l-0.16 1.94l1.62 4.36l0.32 5.33l-0.81 2.42l0.65 0.81l1.45 0.81l0.65 3.39l2.59 3.88l1.45 1.45l7.92 0.16l10.82 -0.65l21.51 -1.29l5.45 -0.67l4.58 0.03l0.16 2.91l2.59 0.81l0.32 -4.36l-1.62 -4.53l1.13 -1.62l5.82 0.81l4.98 0.32l-0.78 -6.30l2.26 -10.02l1.45 -4.20l-0.48 -2.59l3.33 -6.24l-0.51 -1.35l-1.91 0.70l-2.59 -1.29l-0.65 -2.10l-1.29 -3.56l-2.26 -2.10l-2.59 -0.65l-1.62 -4.85l-2.92 -6.34l-4.20 -1.94l-2.10 -1.94l-1.29 -2.59l-2.10 -1.94l-2.26 -1.29l-2.26 -2.91l-3.07 -2.26l-4.53 -1.78l-0.48 -1.45l-2.42 -2.91l-0.48 -1.45l-3.39 -4.91l-3.39 0.16l-4.13 -3.04l-1.29 -1.29l-0.32 -1.78l0.81 -1.94l2.35 -1.24l-1.13 -1.22l0.08 -0.29l-5.82 0.97l-6.95 0.81l-6.79 0.49z"},"US-AL":{"name":"Alabama","path":"m733.91 700.26l-1.62 -15.20l-2.75 -18.75l0.16 -14.06l0.81 -31.04l-0.16 -16.65l0.17 -6.42l7.76 -0.37l27.81 -2.59l8.92 -0.66l-0.15 2.18l0.16 2.10l0.65 3.39l3.39 7.92l2.42 9.86l1.45 6.14l1.62 4.85l1.45 6.95l2.10 6.30l2.59 3.39l0.48 3.39l1.94 0.81l0.16 2.10l-1.78 4.85l-0.48 3.23l-0.16 1.94l1.62 4.36l0.32 5.33l-0.81 2.42l0.65 0.81l1.45 0.81l1.04 2.54l-6.30 0.00l-6.79 0.65l-25.54 2.91l-10.41 1.41l-0.10 3.75l1.78 1.78l2.59 1.94l0.58 7.94l-5.54 2.57l-2.75 -0.32l2.75 -1.94l0.00 -0.97l-3.07 -5.98l-2.26 -0.65l-1.45 4.36l-1.29 2.75l-0.65 -0.16l-2.75 0.00z"},"US-NC":{"name":"North Carolina","path":"m940.42 531.96l1.71 4.70l3.56 6.47l2.42 2.42l0.65 2.26l-2.42 0.16l0.81 0.65l-0.32 4.20l-2.59 1.29l-0.65 2.10l-1.29 2.91l-3.72 1.62l-2.42 -0.32l-1.45 -0.16l-1.62 -1.29l0.32 1.29l0.00 0.97l1.94 0.00l0.81 1.29l-1.94 6.30l4.20 0.00l0.65 1.62l2.26 -2.26l1.29 -0.48l-1.94 3.56l-3.07 4.85l-1.29 0.00l-1.13 -0.48l-2.75 0.65l-5.17 2.42l-6.47 5.33l-3.39 4.69l-1.94 6.47l-0.48 2.42l-4.69 0.48l-5.45 1.34l-9.95 -8.20l-12.61 -7.60l-2.91 -0.81l-12.61 1.45l-4.28 0.75l-1.62 -3.23l-2.97 -2.12l-16.49 0.48l-7.27 0.81l-9.05 4.53l-6.14 2.59l-1.62 0.32l-5.82 0.97l-6.95 0.81l-6.79 0.48l0.50 -4.05l1.78 -1.45l2.75 -0.65l0.65 -3.72l4.20 -2.75l3.88 -1.45l4.20 -3.56l4.36 -2.10l0.65 -3.07l3.88 -3.88l0.65 -0.16c0.00 0.00 0.00 1.13 0.81 1.13c0.81 0.00 1.94 0.32 1.94 0.32l2.26 -3.56l2.10 -0.65l2.26 0.32l1.62 -3.56l2.91 -2.59l0.48 -2.10l0.00 -3.96l4.53 0.73l7.14 -1.29l15.82 -1.94l17.14 -2.59l19.92 -4.00l19.73 -4.16l11.36 -2.80l5.14 -1.17zm3.90 32.99l2.59 -2.51l3.15 -2.59l1.54 -0.65l0.16 -2.02l-0.65 -6.14l-1.45 -2.34l-0.65 -1.86l0.73 -0.24l2.75 5.50l0.40 4.45l-0.16 3.39l-3.39 1.54l-2.83 2.42l-1.13 1.21l-1.05 -0.16z"},"US-TN":{"name":"Tennessee","path":"m805.37 554.12l-51.89 5.01l-15.76 1.78l-4.62 0.51l-3.87 -0.03l0.00 3.88l-8.41 0.48l-6.95 0.65l-11.10 0.05l-0.26 5.84l-2.14 6.28l-1.00 3.02l-1.35 4.38l-0.32 2.59l-4.04 2.26l1.45 3.56l-0.97 4.36l-0.97 0.79l7.26 -0.19l24.09 -1.94l5.33 -0.16l8.08 -0.48l27.81 -2.59l10.17 -0.81l8.42 -0.97l8.41 -1.13l4.85 -0.81l-0.13 -4.51l1.78 -1.45l2.75 -0.65l0.65 -3.72l4.20 -2.75l3.88 -1.45l4.20 -3.56l4.36 -2.10l0.87 -3.53l4.33 -3.88l0.65 -0.16c0.00 0.00 0.00 1.13 0.81 1.13c0.81 0.00 1.94 0.32 1.94 0.32l2.26 -3.56l2.10 -0.65l2.26 0.32l1.62 -3.56l2.12 -2.25l0.60 -0.97l0.18 -3.93l-1.48 -0.29l-2.42 1.94l-7.92 0.16l-12.00 1.90l-9.83 0.85z"},"US-RI":{"name":"Rhode Island","path":"m982.38 413.31l-0.48 -4.20l-0.81 -4.36l-1.70 -5.90l5.74 -1.54l1.62 1.13l3.39 4.36l2.91 4.45l-2.91 1.54l-1.29 -0.16l-1.13 1.78l-2.42 1.94l-2.91 0.97z"},"US-CT":{"name":"Connecticut","path":"m981.51 413.54l-0.63 -4.20l-0.81 -4.36l-1.62 -5.98l-4.15 0.90l-21.82 4.77l0.65 3.31l1.45 7.27l0.00 8.08l-1.13 2.26l1.83 2.11l4.96 -3.40l3.56 -3.23l1.94 -2.10l0.81 0.65l2.75 -1.45l5.17 -1.13l7.04 -3.49z"},"US-MA":{"name":"Massachusetts","path":"m1008.29 407.34l2.17 -0.69l0.46 -1.71l1.03 0.11l1.03 2.29l-1.26 0.46l-3.89 0.11l0.46 -0.57zm-9.37 0.80l2.29 -2.63l1.60 0.00l1.83 1.49l-2.40 1.03l-2.17 1.03l-1.14 -0.91zm-34.80 -21.99l17.46 -4.20l2.26 -0.65l2.10 -3.23l3.74 -1.66l2.89 4.41l-2.42 5.17l-0.32 1.45l1.94 2.59l1.13 -0.81l1.78 0.00l2.26 2.59l3.88 5.98l3.56 0.48l2.26 -0.97l1.78 -1.78l-0.81 -2.75l-2.10 -1.62l-1.45 0.81l-0.97 -1.29l0.48 -0.48l2.10 -0.16l1.78 0.81l1.94 2.42l0.97 2.91l0.32 2.42l-4.20 1.45l-3.88 1.94l-3.88 4.53l-1.94 1.45l0.00 -0.97l2.42 -1.45l0.48 -1.78l-0.81 -3.07l-2.91 1.45l-0.81 1.45l0.48 2.26l-2.07 1.00l-2.75 -4.53l-3.39 -4.36l-2.07 -1.81l-6.53 1.88l-5.09 1.05l-21.82 4.77l-0.40 -4.94l0.65 -10.59l5.17 -0.89l6.79 -1.29z"},"US-ME":{"name":"Maine","path":"m1031.53 310.82l1.94 2.10l2.26 3.72l0.00 1.94l-2.10 4.69l-1.94 0.65l-3.39 3.07l-4.85 5.50c0.00 0.00 -0.65 0.00 -1.29 0.00c-0.65 0.00 -0.97 -2.10 -0.97 -2.10l-1.78 0.16l-0.97 1.45l-2.42 1.45l-0.97 1.45l1.62 1.45l-0.48 0.65l-0.48 2.75l-1.94 -0.16l0.00 -1.62l-0.32 -1.29l-1.45 0.32l-1.78 -3.23l-2.10 1.29l1.29 1.45l0.32 1.13l-0.81 1.29l0.32 3.07l0.16 1.62l-1.62 2.59l-2.91 0.48l-0.32 2.91l-5.33 3.07l-1.29 0.48l-1.62 -1.45l-3.07 3.56l0.97 3.23l-1.45 1.29l-0.16 4.36l-1.12 6.26l-2.46 -1.16l-0.48 -3.07l-3.88 -1.13l-0.32 -2.75l-7.27 -23.44l-4.20 -13.64l1.42 -0.12l1.51 0.41l0.00 -2.59l0.81 -5.50l2.59 -4.69l1.45 -4.04l-1.94 -2.42l0.00 -5.98l0.81 -0.97l0.81 -2.75l-0.16 -1.45l-0.16 -4.85l1.78 -4.85l2.91 -8.89l2.10 -4.20l1.29 0.00l1.29 0.16l0.00 1.13l1.29 2.26l2.75 0.65l0.81 -0.81l0.00 -0.97l4.04 -2.91l1.78 -1.78l1.45 0.16l5.98 2.42l1.94 0.97l9.05 29.91l5.98 0.00l0.81 1.94l0.16 4.85l2.91 2.26l0.81 0.00l0.16 -0.48l-0.48 -1.13l2.75 -0.16zm-20.93 30.15l1.54 -1.54l1.37 1.05l0.57 2.42l-1.70 0.89l-1.78 -2.83zm6.71 -5.90l1.78 1.86c0.00 0.00 1.29 0.08 1.29 -0.24c0.00 -0.32 0.24 -2.02 0.24 -2.02l0.89 -0.81l-0.81 -1.78l-2.02 0.73l-1.37 2.26z"},"US-NH":{"name":"New Hampshire","path":"m989.11 375.91l0.87 -1.08l1.09 -3.29l-2.54 -0.91l-0.48 -3.07l-3.88 -1.13l-0.32 -2.75l-7.27 -23.44l-4.60 -14.54l-0.90 -0.01l-0.65 1.62l-0.65 -0.48l-0.97 -0.97l-1.45 1.94l-0.05 5.03l0.31 5.67l1.94 2.75l0.00 4.04l-3.72 5.06l-2.59 1.13l0.00 1.13l1.13 1.78l0.00 8.57l-0.81 9.21l-0.16 4.85l0.97 1.29l-0.16 4.53l-0.48 1.78l1.45 0.89l16.39 -4.69l2.26 -0.65l1.53 -2.55l3.74 -1.70z"},"US-VT":{"name":"Vermont","path":"m952.66 387.22l-0.81 -5.66l-2.39 -9.97l-0.65 -0.32l-2.91 -1.29l0.81 -2.91l-0.81 -2.10l-2.70 -4.64l0.97 -3.88l-0.81 -5.17l-2.42 -6.47l-0.81 -4.92l26.25 -6.75l0.32 5.82l1.94 2.75l0.00 4.04l-3.72 4.04l-2.59 1.13l0.00 1.13l1.13 1.78l0.00 8.57l-0.81 9.21l-0.16 4.85l0.97 1.29l-0.16 4.53l-0.48 1.78l0.66 1.57l-6.95 1.37l-3.88 0.22z"},"US-NY":{"name":"New York","path":"m936.93 422.91l-1.13 -0.97l-2.59 -0.16l-2.26 -1.94l-1.63 -6.13l-3.46 0.09l-2.44 -2.71l-19.39 4.38l-43.00 8.73l-7.53 1.23l-0.74 -6.47l1.43 -1.13l1.29 -1.13l0.97 -1.62l1.78 -1.13l1.94 -1.78l0.48 -1.62l2.10 -2.75l1.13 -0.97l-0.16 -0.97l-1.29 -3.07l-1.78 -0.16l-1.94 -6.14l2.91 -1.78l4.36 -1.45l4.04 -1.29l3.23 -0.48l6.30 -0.16l1.94 1.29l1.62 0.16l2.10 -1.29l2.59 -1.13l5.17 -0.48l2.10 -1.78l1.78 -3.23l1.62 -1.94l2.10 0.00l1.94 -1.13l0.16 -2.26l-1.45 -2.10l-0.32 -1.45l1.13 -2.10l0.00 -1.45l-1.78 0.00l-1.78 -0.81l-0.81 -1.13l-0.16 -2.59l5.82 -5.50l0.65 -0.81l1.45 -2.91l2.91 -4.53l2.75 -3.72l2.10 -2.42l2.42 -1.83l3.08 -1.25l5.50 -1.29l3.23 0.16l4.53 -1.45l7.57 -2.07l0.52 4.98l2.42 6.47l0.81 5.17l-0.97 3.88l2.59 4.53l0.81 2.10l-0.81 2.91l2.91 1.29l0.65 0.32l3.07 10.99l-0.54 5.06l-0.48 10.83l0.81 5.50l0.81 3.56l1.45 7.27l0.00 8.08l-1.13 2.26l1.84 1.99l0.80 1.68l-1.94 1.78l0.32 1.29l1.29 -0.32l1.45 -1.29l2.26 -2.59l1.13 -0.65l1.62 0.65l2.26 0.16l7.92 -3.88l2.91 -2.75l1.29 -1.45l4.20 1.62l-3.39 3.56l-3.88 2.91l-7.11 5.33l-2.59 0.97l-5.82 1.94l-4.04 1.13l-1.17 -0.53l-0.24 -3.69l0.48 -2.75l-0.16 -2.10l-2.81 -1.70l-4.53 -0.97l-3.88 -1.13l-3.72 -1.78z"},"US-NJ":{"name":"New Jersey","path":"m936.47 423.82l-2.10 2.42l0.00 3.07l-1.94 3.07l-0.16 1.62l1.29 1.29l-0.16 2.42l-2.26 1.13l0.81 2.75l0.16 1.13l2.75 0.32l0.97 2.59l3.56 2.42l2.42 1.62l0.00 0.81l-3.23 3.07l-1.62 2.26l-1.45 2.75l-2.26 1.29l-1.21 0.73l-0.24 1.21l-0.61 2.61l1.09 2.24l3.23 2.91l4.85 2.26l4.04 0.65l0.16 1.45l-0.81 0.97l0.32 2.75l0.81 0.00l2.10 -2.42l0.81 -4.85l2.75 -4.04l3.07 -6.47l1.13 -5.50l-0.65 -1.13l-0.16 -9.38l-1.62 -3.39l-1.13 0.81l-2.75 0.32l-0.48 -0.48l1.13 -0.97l2.10 -1.94l0.06 -1.09l-0.38 -3.43l0.48 -2.75l-0.16 -2.10l-2.59 -1.13l-4.53 -0.97l-3.88 -1.13l-3.72 -1.78z"},"US-PA":{"name":"Pennsylvania","path":"m930.52 459.95l1.13 -0.65l2.26 -0.61l1.45 -2.75l1.62 -2.26l3.23 -3.07l0.00 -0.81l-2.42 -1.62l-3.56 -2.42l-0.97 -2.59l-2.75 -0.32l-0.16 -1.13l-0.81 -2.75l2.26 -1.13l0.16 -2.42l-1.29 -1.29l0.16 -1.62l1.94 -3.07l0.00 -3.07l2.34 -2.42l0.21 -1.08l-2.59 -0.16l-2.26 -1.94l-2.42 -5.33l-3.00 -0.93l-2.33 -2.14l-18.59 4.04l-43.00 8.73l-8.89 1.45l-0.50 -7.08l-5.49 5.63l-1.29 0.48l-4.20 3.01l2.91 19.14l2.48 9.73l3.57 19.26l3.27 -0.64l11.94 -1.50l37.93 -7.67l14.88 -2.82l8.30 -1.62l0.27 -0.24l2.10 -1.62l2.10 -0.68z"},"US-DE":{"name":"Delaware","path":"m930.67 463.91l0.59 -2.10l0.02 -1.20l-1.27 -0.09l-2.10 1.62l-1.45 1.45l1.45 4.20l2.26 5.66l2.10 9.70l1.62 6.30l5.01 -0.16l6.14 -1.21l-2.26 -7.36l-0.97 0.48l-3.56 -2.42l-1.78 -4.69l-1.94 -3.56l-2.26 -0.97l-2.10 -3.56l0.50 -2.10z"},"US-MD":{"name":"Maryland","path":"m945.27 488.79l-6.14 1.29l-5.81 0.16l-1.84 -7.10l-2.10 -9.70l-2.26 -5.66l-1.29 -4.40l-7.51 1.62l-14.88 2.82l-37.45 7.55l1.13 5.01l0.97 5.66l0.32 -0.32l2.10 -2.42l2.26 -2.62l2.42 -0.62l1.45 -1.45l1.78 -2.59l1.29 0.65l2.91 -0.32l2.59 -2.10l2.01 -1.45l1.85 -0.48l1.64 1.13l2.91 1.45l1.94 1.78l1.21 1.54l4.12 1.70l0.00 2.91l5.50 1.29l1.14 0.54l1.41 -2.03l2.88 1.97l-1.28 2.48l-0.77 3.99l-1.78 2.59l0.00 2.10l0.65 1.78l5.06 1.36l4.31 -0.06l3.07 0.97l2.10 0.32l0.97 -2.10l-1.45 -2.10l0.00 -1.78l-2.42 -2.10l-2.10 -5.50l1.29 -5.33l-0.16 -2.10l-1.29 -1.29c0.00 0.00 1.45 -1.62 1.45 -2.26c0.00 -0.65 0.48 -2.10 0.48 -2.10l1.94 -1.29l1.94 -1.62l0.48 0.97l-1.45 1.62l-1.29 3.72l0.32 1.13l1.78 0.32l0.48 5.50l-2.10 0.97l0.32 3.56l0.48 -0.16l1.13 -1.94l1.62 1.78l-1.62 1.29l-0.32 3.39l2.59 3.39l3.88 0.48l1.62 -0.81l3.24 4.18l1.36 0.54l6.65 -2.80l2.01 -4.02l0.23 -4.86zm-16.63 8.98l1.13 2.51l0.16 1.78l1.13 1.86c0.00 0.00 0.89 -0.89 0.89 -1.21c0.00 -0.32 -0.73 -3.07 -0.73 -3.07l-0.73 -2.34l-1.86 0.48z"},"US-WV":{"name":"West Virginia","path":"m864.87 475.46l1.11 4.94l1.08 6.91l3.56 -2.75l2.26 -3.07l2.54 -0.62l1.45 -1.45l1.78 -2.59l1.18 0.65l2.91 -0.32l2.59 -2.10l2.01 -1.45l1.85 -0.48l1.30 1.02l2.23 1.11l1.94 1.78l1.37 1.29l-0.14 4.67l-5.66 -3.07l-4.53 -1.78l-0.16 5.33l-0.48 2.10l-1.62 2.75l-0.65 1.62l-3.07 2.42l-0.48 2.26l-3.39 0.32l-0.32 3.07l-1.13 5.50l-2.59 0.00l-1.29 -0.81l-1.62 -2.75l-1.78 0.16l-0.32 4.36l-2.10 6.63l-5.01 10.83l0.81 1.29l-0.16 2.75l-2.10 1.94l-1.45 -0.32l-3.23 2.42l-2.59 -0.97l-1.78 4.69c0.00 0.00 -3.72 0.81 -4.36 0.97c-0.65 0.16 -2.42 -1.29 -2.42 -1.29l-2.42 2.26l-2.59 0.65l-2.91 -0.81l-1.29 -1.29l-2.19 -3.02l-3.14 -1.99l-2.59 -2.75l-2.91 -3.72l-0.65 -2.26l-2.59 -1.45l-0.81 -1.62l-0.24 -5.25l2.18 -0.08l1.94 -0.81l0.16 -2.75l1.62 -1.45l0.16 -5.01l0.97 -3.88l1.29 -0.65l1.29 1.13l0.48 1.78l1.78 -0.97l0.48 -1.62l-1.13 -1.78l0.00 -2.42l0.97 -1.29l2.26 -3.39l1.29 -1.45l2.10 0.48l2.26 -1.62l3.07 -3.39l2.26 -3.88l0.32 -5.66l0.48 -5.01l0.00 -4.69l-1.13 -3.07l0.97 -1.45l1.28 -1.29l3.49 19.83l4.63 -0.75l11.30 -1.55z"},"US-KY":{"name":"Kentucky","path":"m830.10 531.31l-2.32 2.68l-4.20 3.56l-4.30 5.90l-1.78 1.78l0.00 2.10l-3.88 2.10l-5.66 3.39l-3.52 0.38l-51.87 4.90l-15.76 1.78l-4.62 0.51l-3.87 -0.03l-0.23 4.22l-8.18 0.14l-6.95 0.65l-10.43 0.21l1.91 -0.22l2.18 -1.76l2.06 -1.14l0.23 -3.20l0.91 -1.83l-1.61 -2.54l0.80 -1.91l2.26 -1.78l2.10 -0.65l2.75 1.29l3.56 1.29l1.13 -0.32l0.16 -2.26l-1.29 -2.42l0.32 -2.26l1.94 -1.45l2.59 -0.65l1.62 -0.65l-0.81 -1.78l-0.65 -1.94l1.13 -0.81l1.05 -3.31l2.99 -1.70l5.82 -0.97l3.56 -0.48l1.45 1.94l1.78 0.81l1.78 -3.23l2.91 -1.45l1.94 1.62l0.81 1.13l2.10 -0.48l-0.16 -3.39l2.91 -1.62l1.13 -0.81l1.13 1.62l4.69 0.00l0.81 -2.10l-0.32 -2.26l2.91 -3.56l4.69 -3.88l0.48 -4.53l2.75 -0.32l3.88 -1.78l2.75 -1.94l-0.32 -1.94l-1.45 -1.45l0.57 -2.18l4.12 -0.24l2.42 -0.81l2.91 1.62l1.62 4.36l5.82 0.32l1.78 1.78l2.10 0.16l2.42 -1.45l3.07 0.48l1.29 1.45l2.75 -2.59l1.78 -1.29l1.62 0.00l0.65 2.75l1.78 0.97l2.42 2.22l0.16 5.50l0.81 1.62l2.59 1.45l0.65 2.26l2.91 3.72l2.59 2.75l3.39 1.97z"},"US-OH":{"name":"Ohio","path":"m839.75 428.50l-6.09 4.05l-3.88 2.26l-3.39 3.72l-4.04 3.88l-3.23 0.81l-2.91 0.48l-5.50 2.59l-2.10 0.16l-3.39 -3.07l-5.17 0.65l-2.59 -1.45l-2.38 -1.35l-4.89 0.70l-10.18 1.62l-7.76 1.21l1.29 14.63l1.78 13.74l2.59 23.44l0.57 4.83l4.12 -0.13l2.42 -0.81l3.36 1.50l2.07 4.36l5.14 -0.02l1.89 2.12l1.76 -0.07l2.54 -1.34l2.50 0.37l1.97 1.45l1.73 -2.13l2.35 -1.29l2.07 -0.68l0.65 2.75l1.78 0.97l3.48 2.34l2.18 -0.08l1.15 -1.15l-0.07 -1.39l1.62 -1.45l0.16 -5.01c0.00 0.00 0.97 -3.88 0.97 -3.88l1.52 -1.44l1.52 0.90l0.83 1.21l1.21 -0.18l-0.42 -2.41l-0.56 -0.64l0.00 -2.42l0.97 -1.29l2.26 -3.39l1.29 -1.45l2.10 0.48l2.26 -1.62l3.07 -3.39l2.26 -3.88l0.21 -5.43l0.48 -5.01l0.00 -4.69l-1.13 -3.07l0.97 -1.45l0.92 -0.95l-1.40 -9.84l-2.91 -19.36z"},"US-MI":{"name":"Michigan","path":"m689.93 315.55l1.83 -2.06l2.17 -0.80l5.37 -3.89l2.29 -0.57l0.46 0.46l-5.14 5.14l-3.32 1.94l-2.06 0.91l-1.60 -1.14zm86.17 32.13l0.65 2.51l3.23 0.16l1.29 -1.21c0.00 0.00 -0.08 -1.45 -0.40 -1.62c-0.32 -0.16 -1.62 -1.86 -1.62 -1.86l-2.18 0.24l-1.62 0.16l-0.32 1.13l0.97 0.49zm30.07 63.05l-3.23 -8.24l-2.26 -9.05l-2.42 -3.23l-2.59 -1.78l-1.62 1.13l-3.88 1.78l-1.94 5.01l-2.75 3.72l-1.13 0.65l-1.45 -0.65c0.00 0.00 -2.59 -1.45 -2.42 -2.10c0.16 -0.65 0.48 -5.01 0.48 -5.01l3.39 -1.29l0.81 -3.39l0.65 -2.59l2.42 -1.62l-0.32 -10.02l-1.62 -2.26l-1.29 -0.81l-0.81 -2.10l0.81 -0.81l1.62 0.32l0.16 -1.62l-2.42 -2.26l-1.29 -2.59l-2.59 0.00l-4.53 -1.45l-5.50 -3.39l-2.75 0.00l-0.65 0.65l-0.97 -0.48l-3.07 -2.26l-2.91 1.78l-2.91 2.26l0.32 3.56l0.97 0.32l2.10 0.48l0.48 0.81l-2.59 0.81l-2.59 0.32l-1.45 1.78l-0.32 2.10l0.32 1.62l0.32 5.50l-3.56 2.10l-0.65 -0.16l0.00 -4.20l1.29 -2.42l0.65 -2.42l-0.81 -0.81l-1.94 0.81l-0.97 4.20l-2.75 1.13l-1.78 1.94l-0.16 0.97l0.65 0.81l-0.65 2.59l-2.26 0.48l0.00 1.13l0.81 2.42l-1.13 6.14l-1.62 4.04l0.65 4.69l0.48 1.13l-0.81 2.42l-0.32 0.81l-0.32 2.75l3.56 5.98l2.91 6.47l1.45 4.85l-0.81 4.69l-0.97 5.98l-2.42 5.17l-0.32 2.75l-3.26 3.09l4.41 -0.16l21.42 -2.26l7.28 -0.99l0.10 1.67l6.85 -1.21l10.30 -1.50l3.85 -0.46l0.14 -0.59l0.16 -1.45l2.10 -3.72l2.00 -1.74l-0.22 -5.05l1.60 -1.60l1.09 -0.34l0.22 -3.56l1.54 -3.03l1.05 0.61l0.16 0.65l0.81 0.16l1.94 -0.97l-0.32 -9.54zm-130.37 -66.02l0.72 -0.58l2.75 -0.81l3.56 -2.26l0.00 -0.97l0.65 -0.65l5.98 -0.97l2.42 -1.94l4.36 -2.10l0.16 -1.29l1.94 -2.91l1.78 -0.81l1.29 -1.78l2.26 -2.26l4.36 -2.42l4.69 -0.48l1.13 1.13l-0.32 0.97l-3.72 0.97l-1.45 3.07l-2.26 0.81l-0.48 2.42l-2.42 3.23l-0.32 2.59l0.81 0.48l0.97 -1.13l3.56 -2.91l1.29 1.29l2.26 0.00l3.23 0.97l1.45 1.13l1.45 3.07l2.75 2.75l3.88 -0.16l1.45 -0.97l1.62 1.29l1.62 0.48l1.29 -0.81l1.13 0.00l1.62 -0.97l4.04 -3.56l3.39 -1.13l6.63 -0.32l4.53 -1.94l2.59 -1.29l1.45 0.16l0.00 5.66l0.48 0.32l2.91 0.81l1.94 -0.48l6.14 -1.62l1.13 -1.13l1.45 0.48l0.00 6.95l3.23 3.07l1.29 0.65l1.29 0.97l-1.29 0.32l-0.81 -0.32l-3.72 -0.48l-2.10 0.65l-2.26 -0.16l-3.23 1.45l-1.78 0.00l-5.82 -1.29l-5.17 0.16l-1.94 2.59l-6.95 0.65l-2.42 0.81l-1.13 3.07l-1.29 1.13l-0.48 -0.16l-1.45 -1.62l-4.53 2.42l-0.65 0.00l-1.13 -1.62l-0.81 0.16l-1.94 4.36l-0.97 4.04l-3.18 7.00l-1.18 -1.03l-1.37 -1.03l-1.94 -10.29l-3.54 -1.37l-2.05 -2.29l-12.12 -2.74l-2.86 -1.03l-8.23 -2.17l-7.89 -1.14l-3.72 -5.15z"},"US-WY":{"name":"Wyoming","path":"m462.57 377.27l-10.55 -0.81l-32.09 -3.30l-16.23 -2.06l-28.35 -4.12l-19.89 -2.97l-1.42 11.18l-3.84 24.26l-5.26 30.41l-1.53 10.52l-1.67 11.89l6.52 0.93l25.88 2.50l20.57 2.31l36.78 4.12l23.82 2.86l4.50 -44.19l1.44 -25.38l1.30 -18.14z"},"US-MT":{"name":"Montana","path":"m464.98 355.76l0.65 -11.15l2.26 -24.79c0.46 -5.03 1.08 -8.47 1.37 -15.41l0.94 -14.55l-30.67 -2.81l-29.26 -3.56l-29.26 -4.04l-32.33 -5.33l-18.43 -3.39l-32.72 -6.93l-4.48 21.35l3.43 7.54l-1.37 4.57l1.83 4.57l3.20 1.37l4.62 10.77l2.70 3.18l0.46 1.14l3.43 1.14l0.46 2.06l-7.09 17.60l0.00 2.51l2.51 3.20l0.91 0.00l4.80 -2.97l0.69 -1.14l1.60 0.69l-0.23 5.26l2.74 12.57l2.97 2.51l0.91 0.69l1.83 2.29l-0.46 3.43l0.69 3.43l1.14 0.91l2.29 -2.29l2.74 0.00l3.20 1.60l2.51 -0.91l4.12 0.00l3.66 1.60l2.74 -0.46l0.46 -2.97l2.97 -0.69l1.37 1.37l0.46 3.20l1.78 1.36l1.53 -11.57l20.69 2.97l28.19 3.95l16.55 1.90l31.45 3.46l10.99 1.52l1.05 -15.43l1.41 -5.35z"},"US-ID":{"name":"Idaho","path":"m270.43 414.45c-22.61 -4.34 -14.15 -2.85 -21.14 -4.35l4.43 -17.50l4.34 -17.72l1.37 -4.23l2.51 -5.94l-1.26 -2.29l-2.51 0.11l-0.80 -1.03l0.46 -1.14l0.34 -3.09l4.46 -5.49l1.83 -0.46l1.14 -1.14l0.57 -3.20l0.91 -0.69l3.89 -5.83l3.89 -4.34l0.23 -3.77l-3.43 -2.63l-1.31 -4.40l0.40 -9.66l3.66 -16.46l4.46 -20.80l3.77 -13.49l0.76 -3.80l13.00 2.53l-4.16 21.51l2.95 7.71l-1.05 4.57l1.99 4.57l3.20 1.69l4.46 9.81l2.70 3.82l0.62 1.14l3.43 1.14l0.46 2.54l-6.93 16.80l0.32 3.32l2.68 2.88l1.88 0.48l4.80 -3.61l0.36 -0.50l0.16 0.85l0.25 4.13l2.58 12.90l3.45 2.68l0.43 0.85l2.15 2.45l-0.78 2.79l0.69 3.75l1.95 0.91l2.13 -1.64l2.58 -0.48l3.36 1.60l2.51 -0.59l3.79 -0.16l3.98 1.60l2.74 -0.30l0.94 -2.33l2.49 -1.65l0.73 1.69l0.62 2.24l2.31 2.54l-3.77 23.98l-5.14 29.01l-4.16 -0.32l-8.18 -1.53l-9.81 -1.83l-12.16 -2.38l-12.53 -2.50l-8.48 -1.84l-9.26 -1.67l-9.24 -1.78z"},"US-WA":{"name":"Washington","path":"m201.89 239.85l4.36 1.45l9.70 2.75l8.57 1.94l20.05 5.66l22.96 5.66l15.16 3.39l-1.00 3.88l-4.09 13.81l-4.46 20.80l-3.18 16.14l-0.35 9.38l-13.18 -3.89l-15.57 -3.38l-13.67 0.60l-1.58 -1.53l-5.33 1.90l-3.98 -0.25l-2.72 -1.76l-1.58 0.53l-4.21 -0.23l-1.88 -1.37l-4.78 -1.74l-1.44 -0.21l-4.99 -1.33l-1.78 1.51l-5.69 -0.34l-4.82 -3.79l0.20 -0.80l0.07 -7.93l-2.13 -3.89l-4.12 -0.73l-0.36 -2.35l-2.51 -0.63l-2.88 -0.53l-1.78 0.97l-2.26 -2.91l0.32 -2.91l2.75 -0.32l1.62 -4.04l-2.59 -1.13l0.16 -3.72l4.36 -0.65l-2.75 -2.75l-1.45 -7.11l0.65 -2.91l0.00 -7.92l-1.78 -3.23l2.26 -9.38l2.10 0.48l2.42 2.91l2.75 2.59l3.23 1.94l4.53 2.10l3.07 0.65l2.91 1.45l3.39 0.97l2.26 -0.16l0.00 -2.42l1.29 -1.13l2.10 -1.29l0.32 1.13l0.32 1.78l-2.26 0.48l-0.32 2.10l1.78 1.45l1.13 2.42l0.65 1.94l1.45 -0.16l0.16 -1.29l-0.97 -1.29l-0.48 -3.23l0.81 -1.78l-0.65 -1.45l0.00 -2.26l1.78 -3.56l-1.13 -2.59l-2.42 -4.85l0.32 -0.81l1.13 -0.81zm-9.46 5.98l2.02 -0.16l0.48 1.37l1.54 -1.62l2.34 0.00l0.81 1.54l-1.54 1.70l0.65 0.81l-0.73 2.02l-1.37 0.40c0.00 0.00 -0.89 0.08 -0.89 -0.24c0.00 -0.32 1.45 -2.59 1.45 -2.59l-1.70 -0.57l-0.32 1.45l-0.73 0.65l-1.54 -2.26l-0.48 -2.51z"},"US-TX":{"name":"Texas","path":"m465.37 566.86l22.69 1.09l31.09 1.14l-2.33 23.46l-0.30 18.15l0.07 2.08l4.34 3.82l1.74 0.82l1.81 0.25l0.69 -1.26l0.89 0.87l1.74 0.48l1.60 -0.73l1.14 0.41l-0.30 3.41l4.28 1.03l2.68 0.82l3.95 0.53l2.19 1.83l3.25 -1.58l2.79 0.36l2.03 2.79l1.07 0.32l-0.16 1.97l3.09 1.17l2.77 -1.80l1.51 0.36l2.35 0.16l0.43 1.87l4.64 1.99l2.66 -0.20l1.99 -4.12l0.34 0.00l1.14 1.90l4.44 1.01l3.34 1.21l3.29 0.75l2.15 -0.75l0.85 -2.51l3.70 0.00l1.90 0.75l3.06 -1.58l0.66 0.00l0.36 1.12l4.28 0.00l2.40 -1.26l1.67 0.30l1.42 1.87l2.88 1.67l3.52 1.07l2.74 1.42l2.45 1.62l3.29 -0.89l1.94 0.98l0.51 10.14l0.34 9.70l0.69 9.53l0.53 4.05l2.68 4.60l1.07 4.07l3.86 6.29l0.55 2.88l0.53 1.01l-0.69 7.50l-2.65 4.39l0.96 2.86l-0.36 2.51l-0.85 7.32l-1.37 2.72l0.60 4.39l-5.66 1.59l-9.86 4.53l-0.97 1.94l-2.59 1.94l-2.10 1.45l-1.29 0.81l-5.66 5.33l-2.75 2.10l-5.33 3.23l-5.66 2.42l-6.30 3.39l-1.78 1.45l-5.82 3.56l-3.39 0.65l-3.88 5.50l-4.04 0.32l-0.97 1.94l2.26 1.94l-1.45 5.50l-1.29 4.53l-1.13 3.88l-0.81 4.53l0.81 2.42l1.78 6.95l0.97 6.14l1.78 2.75l-0.97 1.45l-3.07 1.94l-5.66 -3.88l-5.50 -1.13l-1.29 0.48l-3.23 -0.65l-4.20 -3.07l-5.17 -1.13l-7.60 -3.39l-2.10 -3.88l-1.29 -6.47l-3.23 -1.94l-0.65 -2.26l0.65 -0.65l0.32 -3.39l-1.29 -0.65l-0.65 -0.97l1.29 -4.36l-1.62 -2.26l-3.23 -1.29l-3.39 -4.36l-3.56 -6.63l-4.20 -2.59l0.16 -1.94l-5.33 -12.29l-0.81 -4.20l-1.78 -1.94l-0.16 -1.45l-5.98 -5.33l-2.59 -3.07l0.00 -1.13l-2.59 -2.10l-6.79 -1.13l-7.44 -0.65l-3.07 -2.26l-4.53 1.78l-3.56 1.45l-2.26 3.23l-0.97 3.72l-4.36 6.14l-2.42 2.42l-2.59 -0.97l-1.78 -1.13l-1.94 -0.65l-3.88 -2.26l0.00 -0.65l-1.78 -1.94l-5.17 -2.10l-7.44 -7.76l-2.26 -4.69l0.00 -8.08l-3.23 -6.47l-0.48 -2.75l-1.62 -0.97l-1.13 -2.10l-5.01 -2.10l-1.29 -1.62l-7.11 -7.92l-1.29 -3.23l-4.69 -2.26l-1.45 -4.36l-2.59 -2.91l-1.94 -0.48l-0.65 -4.68l8.00 0.69l29.03 2.74l29.04 1.60l2.29 -23.78l3.89 -55.56l1.60 -18.75l1.37 0.03m98.98 233.98l-0.57 -7.11l-2.75 -7.19l-0.57 -7.03l1.54 -8.24l3.31 -6.87l3.48 -5.42l3.15 -3.56l0.65 0.24l-4.77 6.63l-4.36 6.55l-2.02 6.63l-0.32 5.17l0.89 6.14l2.59 7.19l0.48 5.17l0.16 1.45l-0.89 0.24l0.00 0.00z"},"US-CA":{"name":"California","path":"m245.06 620.24l3.82 -0.49l1.49 -2.01l0.73 -1.94l-3.18 -0.09l-1.10 -1.76l0.78 -1.71l-0.05 -6.15l2.22 -1.33l2.70 -2.58l0.41 -4.92l1.65 -3.50l1.94 -2.10l3.27 -1.71l1.28 -0.73l0.76 -1.48l-0.87 -0.89l-0.96 -1.51l-0.94 -5.35l-2.90 -5.24l0.10 -2.79l-2.20 -3.25l-15.00 -23.23l-19.43 -28.71l-22.43 -33.03l-12.70 -19.54l1.80 -7.21l6.81 -25.95l8.12 -31.44l-12.37 -3.34l-13.49 -3.43l-12.57 -4.12l-7.54 -2.06l-11.43 -2.97l-7.05 -2.41l-1.58 4.72l-0.16 7.44l-5.17 11.80l-3.07 2.59l-0.32 1.13l-1.78 0.81l-1.45 4.20l-0.81 3.23l2.75 4.20l1.62 4.20l1.13 3.56l-0.32 6.47l-1.78 3.07l-0.65 5.82l-0.97 3.72l1.78 3.88l2.75 4.53l2.26 4.85l1.29 4.04l-0.32 3.23l-0.32 0.48l0.00 2.10l5.66 6.30l-0.48 2.42l-0.65 2.26l-0.65 1.94l0.16 8.24l2.10 3.72l1.94 2.59l2.75 0.49l0.97 2.75l-1.13 3.56l-2.10 1.62l-1.13 0.00l-0.81 3.88l0.48 2.91l3.23 4.36l1.62 5.33l1.45 4.69l1.29 3.07l3.39 5.82l1.45 2.59l0.48 2.91l1.62 0.97l0.00 2.42l-0.81 1.94l-1.78 7.11l-0.48 1.94l2.42 2.75l4.20 0.48l4.53 1.78l3.88 2.10l2.91 0.00l2.91 3.07l2.59 4.85l1.13 2.26l3.88 2.10l4.85 0.81l1.45 2.10l0.65 3.23l-1.45 0.65l0.32 0.97l3.23 0.81l2.75 0.16l2.91 4.69l3.88 4.20l0.81 2.26l2.59 4.20l0.32 3.23l0.00 9.38l0.48 1.78l10.02 1.45l19.72 2.75l13.91 0.97zm-87.95 -49.72l1.29 1.54l-0.16 1.29l-3.23 -0.08l-0.57 -1.21l-0.65 -1.45l3.31 -0.08zm1.94 0.00l1.21 -0.65l3.56 2.10l3.07 1.21l-0.89 0.65l-4.53 -0.24l-1.62 -1.62l-0.81 -1.45zm20.69 19.80l1.78 2.34l0.81 0.97l1.54 0.57l0.57 -1.45l-0.97 -1.78l-2.67 -2.02l-1.05 0.16l0.00 1.21zm-1.45 8.65l1.78 3.15l1.21 1.94l-1.45 0.24l-1.29 -1.21c0.00 0.00 -0.73 -1.45 -0.73 -1.86c0.00 -0.40 0.00 -2.18 0.00 -2.18l0.48 -0.08z"},"US-AZ":{"name":"Arizona","path":"m246.06 620.99l-2.63 2.16l-0.32 1.45l0.48 0.97l18.91 10.67l12.12 7.60l14.71 8.57l16.81 10.02l12.29 2.42l25.13 2.70l2.53 -12.51l3.75 -27.24l6.96 -52.88l4.26 -30.97l-24.60 -3.68l-27.21 -4.57l-33.43 -6.32l-2.92 18.09l-0.46 0.46l-1.71 2.63l-2.51 -0.11l-1.26 -2.74l-2.74 -0.34l-0.91 -1.14l-0.91 0.00l-0.91 0.57l-1.94 1.03l-0.11 6.97l-0.23 1.71l-0.57 12.57l-1.49 2.17l-0.57 3.31l2.74 4.92l1.26 5.83l0.80 1.03l1.03 0.57l-0.11 2.29l-1.60 1.37l-3.43 1.71l-1.94 1.94l-1.49 3.66l-0.57 4.92l-2.86 2.74l-2.06 0.69l-0.11 5.83l-0.46 1.71l0.46 0.80l3.66 0.57l-0.57 2.74l-1.49 2.17l-3.77 0.91z"},"US-NV":{"name":"Nevada","path":"m248.97 411.06l20.98 4.51l9.72 1.94l9.26 1.83l6.61 1.63l-0.56 5.87l-3.54 17.33l-4.09 19.98l-1.94 9.72l-2.17 13.28l-3.15 16.41l-3.52 15.68l-1.97 10.18l-2.47 16.77l-0.46 1.10l-1.07 2.47l-1.87 -0.11l-1.10 -2.74l-2.74 -0.50l-1.40 -0.98l-2.04 0.32l-0.91 0.73l-1.30 1.35l-0.44 6.97l-0.55 1.71l-0.41 12.09l-1.32 1.71l-1.88 -2.26l-14.52 -22.75l-19.43 -29.04l-22.75 -33.84l-12.38 -18.58l1.64 -6.57l6.97 -25.95l7.89 -31.35l33.61 8.14l13.72 2.97"},"US-UT":{"name":"Utah","path":"m361.28 542.80l-24.64 -3.47l-26.56 -4.89l-33.83 -6.02l1.59 -9.16l3.20 -15.20l3.32 -16.58l2.17 -13.60l1.94 -8.92l3.77 -20.46l3.54 -17.49l1.11 -5.57l12.72 2.26l12.00 2.06l10.29 1.83l8.34 1.37l3.68 0.48l-1.48 10.63l-2.31 13.17l7.81 0.93l16.41 1.80l8.21 0.86l-2.13 21.97l-3.20 22.57l-3.75 27.83l-1.67 11.11l-0.53 2.51z"},"US-CO":{"name":"Colorado","path":"m486.94 490.29l1.44 -21.28l-32.10 -3.06l-24.46 -2.70l-37.27 -4.12l-20.69 -2.51l-2.63 22.18l-3.20 22.41l-3.75 27.99l-1.51 11.11l-0.25 2.76l33.93 3.79l37.74 4.27l31.96 3.17l16.61 0.85"},"US-NM":{"name":"New Mexico","path":"m391.04 664.53l-0.65 -6.12l8.64 0.53l29.52 3.06l28.39 1.44l1.97 -22.33l3.73 -55.88l1.12 -19.39l2.01 0.35l-0.01 -11.08l-32.20 -2.40l-36.94 -4.43l-34.46 -4.12l-4.20 30.76l-6.96 53.20l-3.75 26.92l-2.05 13.31l15.46 1.99l1.29 -10.02l16.65 2.59l12.46 1.62z"},"US-OR":{"name":"Oregon","path":"m248.62 410.18l4.30 -17.90l4.66 -17.88l1.05 -4.23l2.35 -5.62l-0.62 -1.16l-2.51 -0.05l-1.28 -1.67l0.46 -1.46l0.50 -3.25l4.46 -5.49l1.83 -1.10l1.14 -1.14l1.49 -3.57l4.05 -5.67l3.57 -3.86l0.23 -3.45l-3.27 -2.47l-1.21 -4.51l-13.24 -3.74l-15.09 -3.54l-15.43 0.11l-0.46 -1.37l-5.49 2.06l-4.46 -0.57l-2.40 -1.60l-1.26 0.69l-4.69 -0.23l-1.71 -1.37l-5.26 -2.06l-0.80 0.11l-4.34 -1.49l-1.94 1.83l-6.17 -0.34l-5.94 -4.12l0.69 -0.80l0.23 -7.77l-2.29 -3.89l-4.12 -0.57l-0.69 -2.51l-2.35 -0.47l-5.80 2.06l-2.26 6.47l-3.23 10.02l-3.23 6.47l-5.01 14.06l-6.47 13.58l-8.08 12.61l-1.94 2.91l-0.81 8.57l-1.29 5.98l2.71 3.53l6.73 2.25l11.59 3.29l7.87 2.54l12.41 3.63l13.33 3.59l13.17 3.57"},"US-ND":{"name":"North Dakota","path":"m579.62 361.16l-0.36 -7.50l-1.99 -7.32l-1.83 -13.65l-0.46 -9.83l-1.99 -3.11l-1.60 -5.35l0.00 -10.29l0.69 -3.89l-2.12 -5.50l-28.42 -0.56l-18.59 -0.65l-26.51 -1.29l-24.95 -1.88l-1.26 14.23l-1.37 15.09l-2.26 24.95l-0.49 11.02l56.82 3.76l56.69 1.76z"},"US-SD":{"name":"South Dakota","path":"m581.11 436.67l-0.95 -1.08l-1.52 -3.63l1.83 -3.70l1.05 -5.56l-2.58 -2.06l-0.30 -2.74l0.59 -3.00l2.15 -0.80l0.30 -5.74l-0.07 -30.09l-0.62 -2.97l-4.12 -3.59l-0.98 -1.99l0.00 -1.92l1.90 -1.28l1.53 -1.85l0.18 -2.72l-57.38 -1.60l-56.17 -3.89l-0.77 5.28l-1.61 15.87l-1.35 17.95l-1.60 24.60l16.03 1.03l19.64 1.14l17.99 1.30l23.78 1.30l10.75 -0.78l2.86 2.29l4.32 2.97l0.98 0.75l3.54 -0.89l4.05 -0.30l2.74 -0.07l3.11 1.21l4.55 1.44l3.13 1.76l0.62 1.92l0.91 1.90l0.71 -0.48l0.78 -0.00z"},"US-NE":{"name":"Nebraska","path":"m592.56 480.48l1.37 2.68l0.09 2.13l2.35 3.73l2.72 3.15l-5.05 0.00l-43.48 -0.94l-40.79 -0.89l-21.19 -0.96l1.07 -21.33l-33.38 -2.74l4.34 -44.01l15.55 1.03l20.12 1.14l17.83 1.14l23.78 1.14l10.75 -0.46l2.06 2.29l4.80 2.97l1.14 0.91l4.34 -1.37l3.89 -0.46l2.74 -0.23l1.83 1.37l5.03 1.60l2.97 1.60l0.46 1.60l0.91 2.06l1.83 0.00l0.80 0.05l0.98 5.21l2.74 8.03l1.24 4.64l2.13 3.82l0.53 4.94l1.44 4.28l0.55 6.47"},"US-IA":{"name":"Iowa","path":"m674.91 435.12l0.17 1.94l2.29 1.14l1.14 1.26l0.34 1.26l3.89 3.20l0.69 2.17l-0.80 2.86l-1.49 3.54l-0.80 2.74l-2.17 1.60l-1.72 0.57l-5.49 1.49l-0.69 2.28l-0.80 2.28l0.57 1.37l1.72 1.71l-0.00 3.66l-2.17 1.60l-0.46 1.49l0.00 2.52l-1.49 0.46l-1.71 1.37l-0.46 1.49l0.46 1.72l-1.37 1.20l-2.29 -2.69l-1.48 -2.63l-8.34 0.80l-10.17 0.57l-25.04 0.69l-13.03 0.23l-9.37 0.23l-1.32 0.12l-1.65 -4.47l-0.23 -6.63l-1.60 -4.12l-0.69 -5.26l-2.29 -3.66l-0.91 -4.80l-2.74 -7.54l-1.14 -5.37l-1.37 -2.17l-1.60 -2.74l1.83 -4.34l1.37 -5.72l-2.74 -2.06l-0.46 -2.74l0.91 -2.51l1.71 0.00l11.55 0.00l49.61 -0.69l19.88 -0.69l1.85 2.75l1.83 2.62l0.46 0.80l-1.83 2.75l0.46 4.22l2.51 3.89l2.97 1.82l2.40 0.23l1.31 2.18z"},"US-MS":{"name":"Mississippi","path":"m732.87 700.46l-0.25 1.26l-5.17 0.00l-1.45 -0.81l-2.10 -0.32l-6.79 1.94l-1.78 -0.81l-2.59 4.20l-1.10 0.78l-1.12 -2.49l-1.14 -3.89l-3.43 -3.20l1.14 -7.54l-0.69 -0.91l-1.83 0.23l-8.23 0.69l-24.23 0.69l-0.46 -1.60l0.69 -8.00l3.43 -6.17l5.26 -9.14l-0.91 -2.06l1.14 0.00l0.69 -3.20l-2.29 -1.83l0.23 -1.83l-2.06 -4.57l-0.29 -5.34l1.37 -2.66l-0.40 -4.34l-1.37 -2.97l1.37 -1.37l-1.37 -2.06l0.46 -1.83l0.91 -6.17l2.97 -2.74l-0.69 -2.06l3.66 -5.26l2.74 -0.91l0.00 -2.51l-0.69 -1.37l2.74 -5.26l2.74 -1.14l0.11 -3.41l8.68 -0.08l24.09 -1.94l4.58 -0.23l0.01 6.37l0.16 16.65l-0.81 31.04l-0.16 14.06l2.75 18.75l1.48 15.40z"},"US-IN":{"name":"Indiana","path":"m726.73 534.34l0.07 -2.86l0.48 -4.53l2.26 -2.91l1.78 -3.88l2.59 -4.20l-0.48 -5.82l-1.78 -2.75l-0.32 -3.23l0.81 -5.50l-0.48 -6.95l-1.29 -16.00l-1.29 -15.36l-0.97 -11.72l3.07 0.89l1.45 0.97l1.13 -0.32l2.10 -1.94l2.83 -1.62l5.09 -0.16l21.99 -2.26l5.58 -0.53l1.50 15.96l4.25 36.84l0.60 5.77l-0.37 2.26l1.23 1.80l0.10 1.37l-2.52 1.60l-3.54 1.55l-3.20 0.55l-0.60 4.87l-4.57 3.31l-2.80 4.01l0.32 2.38l-0.58 1.53l-3.33 0.00l-1.59 -1.62l-2.49 1.26l-2.68 1.50l0.16 3.05l-1.19 0.26l-0.47 -1.02l-2.17 -1.50l-3.25 1.34l-1.55 3.01l-1.44 -0.81l-1.45 -1.60l-4.46 0.48l-5.59 0.97l-2.91 1.55z"},"US-IL":{"name":"Illinois","path":"m726.12 535.09l0.00 -3.60l0.26 -4.87l2.38 -3.14l1.78 -3.77l2.59 -3.86l-0.37 -5.25l-2.01 -3.54l-0.10 -3.35l0.69 -5.27l-0.83 -7.18l-1.07 -15.78l-1.29 -15.02l-0.92 -11.64l-0.27 -0.92l-0.81 -2.59l-1.29 -3.72l-1.62 -1.78l-1.45 -2.59l-0.23 -5.49l-9.90 1.31l-27.21 1.71l-8.69 -0.43l0.23 2.37l2.29 0.69l0.91 1.14l0.46 1.83l3.89 3.43l0.69 2.29l-0.69 3.43l-1.83 3.66l-0.69 2.51l-2.29 1.83l-1.83 0.69l-5.26 1.37l-0.69 1.83l-0.69 2.06l0.69 1.37l1.83 1.60l-0.23 4.12l-1.83 1.60l-0.69 1.60l0.00 2.74l-1.83 0.46l-1.60 1.14l-0.23 1.37l0.23 2.06l-1.71 1.31l-1.03 2.80l0.46 3.66l2.29 7.32l7.32 7.54l5.49 3.66l-0.23 4.34l0.91 1.37l6.40 0.46l2.74 1.37l-0.69 3.66l-2.29 5.94l-0.69 3.20l2.29 3.89l6.40 5.26l4.57 0.69l2.06 5.03l2.06 3.20l-0.91 2.97l1.60 4.12l1.83 2.06l1.94 -0.79l0.69 -2.16l2.04 -1.44l3.24 -1.10l3.09 1.18l2.88 1.07l0.79 -0.21l-0.07 -1.24l-1.07 -2.77l0.44 -2.38l2.28 -1.57l2.36 -0.99l1.16 -0.42l-0.58 -1.32l-0.76 -2.17l1.25 -1.26l0.97 -2.71z"},"US-MN":{"name":"Minnesota","path":"m580.19 361.96l-0.46 -8.46l-1.83 -7.32l-1.83 -13.49l-0.46 -9.83l-1.83 -3.43l-1.60 -5.03l0.00 -10.29l0.69 -3.89l-1.82 -5.45l30.13 0.04l0.32 -8.24l0.65 -0.16l2.26 0.48l1.94 0.81l0.81 5.50l1.45 6.14l1.62 1.62l4.85 0.00l0.32 1.45l6.30 0.32l0.00 2.10l4.85 0.00l0.32 -1.29l1.13 -1.13l2.26 -0.65l1.29 0.97l2.91 0.00l3.88 2.59l5.33 2.42l2.42 0.48l0.48 -0.97l1.45 -0.48l0.48 2.91l2.59 1.29l0.48 -0.48l1.29 0.16l0.00 2.10l2.59 0.97l3.07 0.00l1.62 -0.81l3.23 -3.23l2.59 -0.48l0.81 1.78l0.48 1.29l0.97 0.00l0.97 -0.81l8.89 -0.32l1.78 3.07l0.65 0.00l0.71 -1.08l4.44 -0.37l-0.61 2.28l-3.94 1.84l-9.25 4.06l-4.77 2.01l-3.07 2.59l-2.42 3.56l-2.26 3.88l-1.78 0.81l-4.53 5.01l-1.29 0.16l-3.84 2.93l-2.82 3.16l-0.23 2.97l0.23 7.78l-1.60 1.60l-5.26 4.11l-1.83 5.72l2.52 3.65l0.46 2.52l-1.15 2.97l-0.23 3.66l0.46 7.08l3.43 4.11l2.98 0.00l2.51 2.29l3.20 1.37l3.66 5.03l7.09 5.02l1.83 2.06l0.23 5.50l-20.59 0.69l-60.25 0.46l-0.34 -35.68l-0.46 -2.97l-4.12 -3.43l-1.14 -1.83l0.00 -1.60l2.06 -1.60l1.37 -1.37l0.23 -3.20z"},"US-WI":{"name":"Wisconsin","path":"m721.26 430.67l0.37 -2.97l-1.62 -4.53l-0.65 -6.14l-1.13 -2.42l0.97 -3.07l0.81 -2.91l1.45 -2.59l-0.65 -3.39l-0.65 -3.56l0.48 -1.78l1.94 -2.42l0.16 -2.75l-0.81 -1.29l0.65 -2.59l0.48 -3.23l2.75 -5.66l2.91 -6.79l0.16 -2.26l-0.32 -0.97l-0.81 0.48l-4.20 6.30l-2.75 4.04l-1.94 1.78l-0.81 2.26l-1.45 0.81l-1.13 1.94l-1.45 -0.32l-0.16 -1.78l1.29 -2.42l2.10 -4.69l1.78 -1.62l1.10 -2.29l-1.63 -0.91l-1.37 -1.37l-1.60 -10.29l-3.66 -1.14l-1.37 -2.29l-12.57 -2.74l-2.51 -1.14l-8.23 -2.29l-8.23 -1.14l-4.17 -5.40l-0.53 1.26l-1.13 -0.16l-0.65 -1.13l-2.75 -0.81l-1.13 0.16l-1.78 0.97l-0.97 -0.65l0.65 -1.94l1.94 -3.07l1.13 -1.13l-1.94 -1.45l-2.10 0.81l-2.91 1.94l-7.44 3.23l-2.91 0.65l-2.91 -0.48l-0.98 -0.88l-2.12 2.84l-0.23 2.74l0.00 8.46l-1.14 1.60l-5.26 3.89l-2.29 5.94l0.46 0.23l2.51 2.06l0.69 3.20l-1.83 3.20l0.00 3.89l0.46 6.63l2.97 2.97l3.43 0.00l1.83 3.20l3.43 0.46l3.89 5.72l7.09 4.12l2.06 2.74l0.91 7.43l0.69 3.31l2.29 1.60l0.23 1.37l-2.06 3.43l0.23 3.20l2.51 3.89l2.51 1.14l2.97 0.46l1.34 1.38l9.17 0.00l26.07 -1.49l10.06 -1.37z"},"US-MO":{"name":"Missouri","path":"m664.10 483.02l-2.52 -3.09l-1.14 -2.29l-7.77 0.69l-9.83 0.46l-25.38 0.91l-13.49 0.23l-7.89 0.11l-2.29 0.11l1.26 2.51l-0.23 2.29l2.51 3.89l3.09 4.12l3.09 2.74l2.29 0.23l1.37 0.91l0.00 2.97l-1.83 1.60l-0.46 2.29l2.06 3.43l2.51 2.97l2.51 1.83l1.37 11.66l-0.69 35.32l0.23 4.69l0.46 5.38l23.43 -0.12l23.21 -0.69l20.80 -0.80l11.65 -0.23l2.17 3.43l-0.68 3.31l-3.09 2.40l-0.57 1.84l5.38 0.46l3.89 -0.69l1.72 -5.49l0.65 -5.86l2.32 -2.02l1.71 -1.49l2.06 -1.03l0.12 -2.86l0.57 -1.72l-1.03 -1.75l-2.75 0.14l-2.17 -2.63l-1.37 -4.23l0.80 -2.52l-1.94 -3.43l-1.83 -4.58l-4.80 -0.80l-6.97 -5.60l-1.72 -4.11l0.80 -3.20l2.06 -6.06l0.46 -2.86l-1.95 -1.03l-6.86 -0.80l-1.03 -1.71l-0.11 -4.23l-5.49 -3.43l-6.98 -7.77l-2.29 -7.32l-0.23 -4.23l0.80 -2.29z"},"US-AR":{"name":"Arkansas","path":"m699.27 578.44l-3.85 0.94l-6.17 -0.46l0.69 -2.97l3.20 -2.74l0.46 -2.29l-1.83 -2.97l-10.97 0.46l-20.80 0.91l-23.32 0.69l-23.32 0.46l1.60 6.86l0.00 8.23l1.37 10.97l0.23 37.84l2.29 1.94l2.97 -1.37l2.74 1.14l0.43 10.32l22.89 -0.14l18.86 -0.80l10.12 -0.20l1.15 -2.09l-0.29 -3.55l-1.83 -2.97l1.60 -1.49l-1.60 -2.51l0.68 -2.51l1.37 -5.61l2.52 -2.06l-0.69 -2.28l3.66 -5.37l2.74 -1.37l-0.11 -1.49l-0.35 -1.83l2.86 -5.60l2.40 -1.26l0.38 -3.43l1.77 -1.24l0.86 -4.23l-1.34 -4.01l4.04 -2.38l0.55 -2.02l1.24 -4.27l0.80 -3.26z"},"US-OK":{"name":"Oklahoma","path":"m483.66 556.06l-10.69 -0.46l-6.43 -0.49l0.26 0.20l-0.70 10.42l21.97 1.41l32.06 1.30l-2.33 24.42l-0.46 17.83l0.23 1.60l4.34 3.66l2.06 1.14l0.69 -0.23l0.69 -2.06l1.37 1.83l2.06 0.00l0.00 -1.37l2.74 1.37l-0.46 3.89l4.12 0.23l2.51 1.14l4.12 0.69l2.51 1.83l2.29 -2.06l3.43 0.69l2.51 3.43l0.91 0.00l0.00 2.29l2.29 0.69l2.29 -2.29l1.83 0.69l2.51 0.00l0.91 2.51l4.80 1.83l1.37 -0.69l1.83 -4.12l1.14 0.00l1.14 2.06l4.12 0.69l3.66 1.37l2.97 0.91l1.83 -0.91l0.69 -2.51l4.34 0.00l2.06 0.91l2.74 -2.06l1.14 0.00l0.69 1.60l4.12 0.00l1.60 -2.06l1.83 0.46l2.06 2.51l3.20 1.83l3.20 0.91l1.94 1.12l-0.39 -37.22l-1.37 -10.97l-0.16 -8.87l-1.44 -6.54l-0.78 -7.18l-0.07 -3.82l-12.14 0.32l-46.41 -0.46l-45.04 -2.06l-24.29 -1.37z"},"US-KS":{"name":"Kansas","path":"m611.69 558.62l-12.62 0.20l-46.09 -0.46l-44.56 -2.06l-24.63 -1.26l4.14 -64.72l21.83 0.80l40.47 1.37l44.12 0.46l5.10 0.00l3.25 3.22l2.77 0.23l0.89 1.07l0.00 2.01l-1.83 1.60l-0.46 2.61l2.22 3.59l2.51 3.13l2.51 1.99l1.05 11.18l-0.69 35.02z"},"US-LA":{"name":"Louisiana","path":"m710.52 706.48l-1.03 -2.62l-1.14 -3.09l-3.32 -3.54l0.92 -6.75l-0.12 -1.14l-1.26 0.34l-8.23 0.91l-25.03 0.46l-0.68 -2.39l0.91 -8.46l3.32 -5.95l5.03 -8.69l-0.57 -2.40l1.26 -0.68l0.46 -1.95l-2.29 -2.06l-0.11 -1.94l-1.83 -4.35l-0.46 -5.94l-9.72 0.11l-19.20 0.91l-22.20 0.03l0.03 9.57l0.69 9.37l0.69 3.89l2.51 4.12l0.91 5.03l4.34 5.49l0.23 3.20l0.69 0.69l-0.69 8.46l-2.97 5.03l1.60 2.06l-0.69 2.51l-0.69 7.32l-1.37 3.20l0.12 3.62l4.69 -1.52l8.08 -0.32l10.35 3.56l6.47 1.13l3.72 -1.45l3.23 1.13l3.23 0.97l0.81 -2.10l-3.23 -1.13l-2.59 0.48l-2.75 -1.62c0.00 0.00 0.16 -1.29 0.81 -1.45c0.65 -0.16 3.07 -0.97 3.07 -0.97l1.78 1.45l1.78 -0.97l3.23 0.65l1.45 2.42l0.32 2.26l4.53 0.32l1.78 1.78l-0.81 1.62l-1.29 0.81l1.62 1.62l8.41 3.56l3.56 -1.29l0.97 -2.42l2.59 -0.65l1.78 -1.45l1.29 0.97l0.81 2.91l-2.26 0.81l0.65 0.65l3.39 -1.29l2.26 -3.39l0.81 -0.48l-2.10 -0.32l0.81 -1.62l-0.16 -1.45l2.10 -0.48l1.13 -1.29l0.65 0.81c0.00 0.00 -0.16 3.07 0.65 3.07c0.81 0.00 4.20 0.65 4.20 0.65l4.04 1.94l0.97 1.45l2.91 0.00l1.13 0.97l2.26 -3.07l0.00 -1.45l-1.29 0.00l-3.39 -2.75l-5.82 -0.81l-3.23 -2.26l1.13 -2.75l2.26 0.32l0.16 -0.65l-1.78 -0.97l0.00 -0.48l3.23 0.00l1.78 -3.07l-1.29 -1.94l-0.32 -2.75l-1.45 0.16l-1.94 2.10l-0.65 2.59l-3.07 -0.65l-0.97 -1.78l1.78 -1.94l2.02 -1.78l-0.36 -0.73z"},"US-VA":{"name":"Virginia","path":"m937.22 502.74l-0.14 -1.95l6.45 -2.55l-0.77 3.22l-2.92 3.78l-0.42 4.59l0.46 3.39l-1.83 4.98l-2.16 1.92l-1.47 -4.64l0.45 -5.45l1.59 -4.18l0.77 -3.10zm2.28 28.30l-58.17 12.58l-37.43 5.28l-6.68 -0.38l-2.59 1.93l-7.34 0.22l-8.38 0.98l-8.93 0.95l8.48 -4.95l-0.01 -2.07l1.52 -2.15l10.55 -11.50l3.95 4.48l3.78 0.96l2.54 -1.14l2.24 -1.31l2.54 1.34l3.91 -1.43l1.88 -4.56l2.60 0.54l2.86 -2.13l1.80 0.49l2.83 -3.68l0.35 -2.08l-0.96 -1.28l1.00 -1.87l5.27 -12.28l0.62 -5.74l1.23 -0.52l2.18 2.44l3.94 -0.30l1.93 -7.57l2.79 -0.56l1.05 -2.74l2.58 -2.35l1.27 -2.34l1.50 -3.35l0.08 -5.07l9.82 3.82c0.68 0.34 0.66 -4.78 0.66 -4.78l4.05 1.38l-0.46 2.63l8.16 2.94l1.29 1.79l-0.87 3.68l-1.26 1.33l-0.51 1.75l0.49 2.40l1.96 1.28l3.92 1.45l2.95 0.97l4.86 0.94l2.15 2.09l3.19 0.40l0.87 1.20l-0.44 4.69l1.37 1.10l-0.48 1.93l1.23 0.79l-0.22 1.38l-2.69 -0.09l0.09 1.62l2.28 1.54l0.12 1.41l1.77 1.79l0.49 2.52l-2.55 1.38l1.57 1.49l5.80 -1.69l3.61 6.01z"},"US-PR":{"name":"Puerto Rico","path":"m677.53 763.72c0.00 0.00 0.86 -2.14 0.86 -2.14c0.00 0.00 1.71 0.43 1.71 0.43c0.00 0.00 1.71 1.28 1.71 1.28c0.00 0.00 7.28 0.86 7.28 0.86c0.00 0.00 7.28 -0.43 7.28 -0.43c0.00 0.00 3.00 0.00 3.00 0.00c0.00 0.00 2.57 0.86 2.57 0.86c0.00 0.00 1.71 -1.28 1.71 -1.28c0.00 0.00 2.14 0.00 2.14 0.00c0.00 0.00 5.14 0.43 5.14 0.43c0.00 0.00 5.14 1.28 5.14 1.28c0.00 0.00 1.71 1.71 1.71 1.71c0.00 0.00 3.00 0.00 3.00 0.00c0.00 0.00 0.43 2.57 0.43 2.57c0.00 0.00 -0.43 1.71 -0.43 1.71c0.00 0.00 -3.43 0.43 -3.43 0.43c0.00 0.00 -2.14 0.86 -2.14 0.86c0.00 0.00 -0.86 2.14 -0.86 2.14c0.00 0.00 -1.29 2.14 -1.29 2.14c0.00 0.00 -2.57 1.28 -2.57 1.28c0.00 0.00 -5.14 0.00 -5.14 0.00c0.00 0.00 -4.28 0.00 -4.28 0.00c0.00 0.00 -2.14 -0.86 -2.14 -0.86c0.00 0.00 0.00 0.00 0.00 0.00c0.00 0.00 -4.28 0.00 -4.28 0.00c0.00 0.00 -2.14 -0.86 -2.14 -0.86c0.00 0.00 -3.43 0.86 -3.43 0.86c0.00 0.00 -4.28 0.00 -4.28 0.00c0.00 0.00 -2.14 -1.71 -2.14 -1.71c0.00 0.00 -2.57 0.86 -2.57 0.86c0.00 0.00 -3.43 0.43 -3.43 0.43c0.00 0.00 -0.43 -2.14 -0.43 -2.14c0.00 0.00 0.86 -1.28 0.86 -1.28c0.00 0.00 0.86 -2.14 0.86 -2.14c0.00 0.00 -0.86 -2.57 -0.86 -2.57c0.00 0.00 -3.43 -2.57 -3.43 -2.57c0.00 0.00 1.28 -0.86 1.28 -0.86c0.00 0.00 2.57 -1.28 2.57 -1.28zm46.71 11.57c0.00 0.00 -1.86 0.62 -1.86 0.62c0.00 0.00 3.72 1.24 3.72 1.24c0.00 0.00 4.96 -1.24 4.96 -1.24c0.00 0.00 1.24 -1.86 1.24 -1.86c0.00 0.00 -3.10 0.62 -3.10 0.62c0.00 0.00 -4.96 0.62 -4.96 0.62zm8.67 -4.34c0.00 0.00 -1.55 -0.93 -1.55 -0.93c0.00 0.00 2.17 -1.55 2.17 -1.55c0.00 0.00 0.62 1.55 0.62 1.55c0.00 0.00 -1.24 0.93 -1.24 0.93z"},"US-VI":{"name":"Virgin Islands","path":"m753.70 757.56c0.00 0.00 -1.46 1.10 -1.46 1.10c0.00 0.00 -1.82 1.09 -1.82 1.09c0.00 0.00 0.36 1.46 0.36 1.46c0.00 0.00 1.82 0.73 1.82 0.73c0.00 0.00 2.55 -0.36 2.55 -0.36c0.00 0.00 1.09 1.82 1.09 1.82c0.00 0.00 1.82 0.00 1.82 0.00c0.00 0.00 1.09 -1.09 1.09 -1.09c0.00 0.00 4.01 -0.73 4.01 -0.73c0.00 0.00 1.82 -0.36 1.82 -0.36c0.00 0.00 1.46 -1.09 1.46 -1.09c0.00 0.00 -0.73 -1.46 -0.73 -1.46c0.00 0.00 -2.19 0.00 -2.19 0.00c0.00 0.00 -5.11 -1.10 -5.11 -1.10c0.00 0.00 -4.74 0.00 -4.74 0.00zm14.45 1.40c0.00 0.00 -0.28 0.99 -0.28 0.99c0.00 0.00 0.85 0.50 0.85 0.50c0.00 0.00 1.99 -0.25 1.99 -0.25c0.00 0.00 1.42 0.75 1.42 0.75c0.00 0.00 1.14 -0.25 1.14 -0.25c0.00 0.00 0.29 -1.24 0.29 -1.24c0.00 0.00 0.00 0.00 0.00 0.00c0.00 0.00 1.42 -0.99 1.42 -0.99c0.00 0.00 0.29 -0.99 0.29 -0.99c0.00 0.00 -1.14 -0.50 -1.14 -0.50c0.00 0.00 -1.71 0.50 -1.71 0.50c0.00 0.00 -1.99 -0.74 -1.99 -0.74c0.00 0.00 -0.85 0.74 -0.85 0.74c0.00 0.00 -0.29 0.99 -0.29 0.99c0.00 0.00 -1.14 0.50 -1.14 0.50zm-5.30 20.42c0.00 0.00 2.61 -0.65 2.61 -0.65c0.00 0.00 1.63 0.33 1.63 0.33c0.00 0.00 2.28 -1.30 2.28 -1.30c0.00 0.00 0.98 0.33 0.98 0.33c0.00 0.00 0.65 0.98 0.65 0.98c0.00 0.00 0.98 1.63 0.98 1.63c0.00 0.00 1.95 -0.98 1.95 -0.98c0.00 0.00 0.98 0.65 0.98 0.65c0.00 0.00 4.27 -0.59 4.27 -0.59c0.00 0.00 0.49 2.43 0.49 2.43c0.00 0.00 -1.82 0.76 -1.82 0.76c0.00 0.00 -3.26 0.00 -3.26 0.00c0.00 0.00 -5.54 1.63 -5.54 1.63c0.00 0.00 -2.28 -0.32 -2.28 -0.32c0.00 0.00 -3.91 0.65 -3.91 0.65c0.00 0.00 -1.30 -0.65 -1.30 -0.65c0.00 0.00 -0.98 0.65 -0.98 0.65c0.00 0.00 -2.61 0.33 -2.61 0.33c0.00 0.00 -1.54 -0.50 -0.33 -1.31c1.95 -1.30 0.98 -3.58 0.98 -3.58c0.00 0.00 4.23 -0.98 4.23 -0.98z"},"US-GU":{"name":"Guam","path":"m693.26 794.10c0.04 0.00 0.08 0.00 0.13 0.00c0.43 0.00 0.84 0.14 1.26 0.21c0.55 0.09 0.80 0.75 1.26 0.94c0.49 0.21 0.64 0.64 1.01 0.94c0.11 0.09 0.22 0.27 0.25 0.31c0.72 0.60 -0.76 1.18 0.88 0.84c0.04 -0.01 1.30 0.48 1.51 0.52c0.62 0.13 1.29 0.11 1.76 0.21c0.60 0.13 -0.60 0.90 -0.88 1.36c-0.26 0.44 -0.13 1.09 -0.13 1.57c0.00 0.61 -0.13 0.97 -0.25 1.36c-0.14 0.48 -0.46 0.80 -0.76 1.05c-0.31 0.26 -0.90 0.53 -1.39 0.63c-0.65 0.13 -0.59 0.52 -1.51 0.52c-0.44 0.00 -0.50 1.04 -0.63 1.26c-0.38 0.64 -1.13 0.00 -1.39 0.84c-0.16 0.54 -0.50 0.52 -0.88 0.84c-0.36 0.30 -0.90 0.48 -1.26 0.63c-0.61 0.25 -0.99 0.52 -1.76 0.52c-0.31 0.00 -0.90 0.93 -1.01 1.05c-0.37 0.41 -0.54 0.66 -0.88 0.94c-0.15 0.13 -1.19 -0.09 -1.64 0.00c-0.07 0.01 0.00 1.43 0.00 1.57c0.00 0.25 -0.82 0.64 -0.88 0.73c-0.11 0.19 0.25 1.24 0.25 1.57c0.00 0.52 -0.02 1.11 -0.13 1.47c-0.14 0.48 -0.12 1.05 -0.76 1.05c-0.66 0.00 0.37 0.83 0.50 0.94c0.22 0.18 0.18 1.11 0.25 1.36c0.21 0.69 -0.38 0.93 -0.38 1.47c0.00 0.03 -1.02 0.58 -1.13 0.63c-0.36 0.15 -0.69 0.58 -1.01 0.84c-0.48 0.40 -0.58 0.59 -1.01 0.94c-0.41 0.34 -1.00 0.31 -1.64 0.42c-0.58 0.10 -1.08 0.21 -1.76 0.21c-0.39 0.00 -0.89 -0.64 -1.13 -0.84c-0.54 -0.45 -0.71 0.25 -1.01 -0.73c-0.03 -0.09 -0.41 -0.84 -0.50 -1.15c-0.17 -0.57 -0.12 -0.94 -0.25 -1.36c-0.11 -0.37 -0.49 -0.59 -0.63 -1.05c-0.16 -0.54 -0.08 -1.08 -0.38 -1.57c-0.30 -0.51 -0.88 -0.31 -0.88 -1.15c0.00 -0.72 0.34 -0.78 0.63 -1.26c0.20 -0.33 0.40 -0.91 0.50 -1.26c0.11 -0.35 0.55 -0.92 0.76 -1.26c0.05 -0.08 -0.13 -0.43 -0.13 -0.63l-3.15 -2.41c0.56 -0.93 0.69 -0.59 1.64 0.00c0.52 0.32 0.93 0.33 1.51 0.21c0.48 -0.10 0.45 -1.26 0.45 -0.27c0.00 0.73 -0.17 -0.11 0.51 -0.31c1.16 -0.35 1.05 -0.29 0.05 0.27c-0.22 0.12 1.05 0.47 0.76 -0.52c-0.16 -0.52 -1.01 0.01 -0.76 -0.84c0.09 -0.31 1.92 0.09 2.01 0.10c0.55 0.11 0.95 -0.63 1.51 -0.63c0.55 0.00 1.23 -0.21 1.89 -0.21c0.49 0.00 1.38 -0.23 1.76 -0.31c0.78 -0.16 1.12 -0.20 1.64 -0.52c0.36 -0.22 -0.22 -1.36 -0.25 -1.47c-0.16 -0.54 1.74 -0.00 1.76 0.00c0.81 0.14 0.90 -0.71 1.01 -1.05c0.20 -0.68 0.31 -0.86 1.01 -1.15c0.77 -0.32 1.01 -0.81 1.01 -1.47c0.00 -0.98 0.44 -1.29 0.63 -2.10c0.15 -0.61 -0.14 -0.78 0.38 -1.36c0.55 -0.61 0.94 -0.84 1.26 -1.36c0.28 -0.47 0.25 -0.87 0.25 -1.47c0.00 -0.55 0.16 -0.60 -0.38 -1.05"},"US-MP":{"name":"Northern Mariana Islands","path":"m752.79 792.18c0.00 0.00 1.07 -0.72 1.07 -0.72c0.00 0.00 0.90 -0.60 0.90 -0.60c0.00 0.00 -1.98 1.32 -1.98 1.32zm0.08 5.56c0.00 0.00 1.98 1.98 1.98 1.98c0.00 0.00 -0.18 -1.87 -0.18 -1.87c0.00 0.00 -1.80 -0.11 -1.80 -0.11zm4.61 5.93c0.00 0.00 1.32 3.29 1.32 3.29c0.00 0.00 0.00 0.00 0.00 0.00c0.00 0.00 1.32 -3.29 1.32 -3.29c0.00 0.00 -2.64 0.00 -2.64 0.00zm5.27 6.59c0.00 0.00 0.00 3.29 0.00 3.29c0.00 0.00 1.98 0.66 1.98 0.66c0.00 0.00 0.66 -3.29 0.66 -3.29c0.00 0.00 -2.63 -0.66 -2.63 -0.66zm8.65 8.44c0.00 0.00 -1.73 3.09 -1.73 3.09c0.00 0.00 0.58 1.85 0.58 1.85c0.00 0.00 2.88 1.23 2.88 1.23c0.00 0.00 1.15 -1.85 1.15 -1.85c0.00 0.00 0.00 -3.09 0.00 -3.09c0.00 0.00 -2.88 -1.23 -2.88 -1.23z"},"US-AS":{"name":"American Samoa","path":"m717.81 815.99c0.22 -0.10 0.55 -0.64 0.70 -0.92c0.26 -0.47 -0.25 -0.56 0.39 -0.71c0.32 -0.07 0.68 0.40 0.78 0.50c0.25 0.23 0.41 0.43 0.55 -0.07c0.06 -0.20 0.71 -0.91 0.94 -1.07c0.31 -0.21 0.56 -0.23 0.86 -0.50c0.25 -0.23 0.48 -0.43 0.70 -0.64c0.28 -0.26 0.43 -0.36 0.62 -0.71c0.18 -0.33 0.44 -0.54 0.62 -0.71c0.42 -0.38 -1.02 -0.21 -1.64 -0.21c-0.16 0.00 0.28 -0.64 0.31 -0.78c0.09 -0.43 0.21 -0.40 0.62 -0.50c0.59 -0.13 0.62 0.13 0.62 0.57c0.00 0.29 0.47 -0.43 0.55 -0.71c0.11 -0.39 0.36 -0.56 0.70 -0.71c0.33 -0.15 0.70 -0.25 0.94 -0.36c0.41 -0.19 0.40 -0.16 0.31 -0.50c-0.06 -0.21 0.06 -0.64 0.00 -0.85c-0.12 -0.45 0.50 -0.08 0.23 -0.57c-0.12 -0.21 -0.80 -0.36 -0.94 -0.43c-0.39 -0.18 -0.74 -0.12 -1.09 -0.28c-0.42 -0.19 -0.34 -0.33 -0.08 -0.57c0.15 -0.14 0.97 0.04 1.09 0.07c0.37 0.08 0.77 0.07 1.17 0.07c0.52 0.00 0.82 0.02 1.25 0.21c0.32 0.15 0.23 0.43 0.23 0.85c0.00 0.46 -0.14 0.68 0.31 0.78c0.55 0.12 0.66 0.03 1.01 -0.21c0.15 -0.10 1.14 -0.19 1.25 -0.21c0.42 -0.08 0.66 -0.25 0.86 -0.43c0.28 -0.26 0.66 -0.46 0.86 -0.64c0.29 -0.27 0.57 -0.34 0.94 -0.43c0.48 -0.11 0.67 0.19 0.86 0.36c0.19 0.17 0.08 0.75 0.08 0.99c0.00 0.22 1.43 -0.33 1.48 -0.36c0.42 -0.19 0.68 -0.12 0.94 -0.36c0.36 -0.33 0.12 -0.56 0.70 -0.43c0.44 0.10 0.71 -0.13 1.09 -0.21c0.41 -0.09 0.31 -0.34 0.31 -0.78c0.00 -0.36 0.00 -0.71 0.00 -1.07c0.00 -0.50 -0.31 -0.41 -0.70 -0.50c-0.32 -0.07 -0.77 0.13 -0.94 0.28c-0.33 0.30 -0.42 0.19 -0.55 0.64c-0.11 0.42 -0.16 0.47 -0.55 0.64c-0.18 0.08 -0.53 -0.36 -0.94 -0.36c-0.44 0.00 -0.61 -0.24 -0.86 -0.36c-0.34 -0.16 -0.61 -0.21 -1.09 -0.21c-0.17 0.00 -0.43 0.42 -0.78 0.50c-0.32 0.07 -0.91 0.00 -1.01 0.00c-0.32 0.00 0.37 -0.77 0.39 -0.78c0.43 -0.20 0.96 0.04 0.08 -0.28c-0.35 -0.13 -0.83 0.07 -1.17 0.07c-0.57 0.00 -0.62 0.08 -0.62 0.57c0.00 0.48 -0.29 0.43 -0.78 0.43c-0.30 0.00 -0.17 -0.64 -0.47 -0.71c-0.49 -0.11 -0.44 0.31 -0.62 -0.36c-0.07 -0.26 -0.65 0.02 -0.86 0.21c-0.23 0.21 -0.74 -0.08 -0.16 -0.21c0.50 -0.11 -0.25 -0.57 -0.55 -0.57c-0.52 0.00 -0.44 0.32 -0.70 0.64c-0.26 0.32 -0.65 0.08 -0.78 0.57c-0.07 0.25 -0.60 0.31 -0.86 0.43c-0.39 0.18 -0.68 0.35 -1.01 0.50c-0.49 0.22 -1.08 0.14 -1.64 0.14c-0.29 0.00 0.16 0.52 0.16 0.78c0.00 0.36 0.00 0.71 0.00 1.07c0.00 0.58 -0.08 0.45 -0.62 0.57c-0.29 0.07 -0.52 -0.28 -0.94 -0.28c-0.51 0.00 -0.62 0.22 -0.62 0.64c0.00 0.46 -0.43 0.20 -0.78 0.36c-0.43 0.20 -0.78 0.29 -0.78 -0.21c0.00 -0.38 -0.43 -0.42 -0.78 -0.50c-0.51 -0.12 -0.52 0.34 -0.86 0.50c-0.39 0.18 -0.80 0.12 -1.17 0.28c-0.10 0.05 -0.31 -0.52 -0.55 -0.57c-0.40 -0.09 -0.95 0.06 -1.33 0.14c-0.45 0.10 -0.22 0.43 -0.78 0.43c-0.42 0.00 -0.79 0.11 -1.01 0.21c-0.21 0.10 0.35 0.43 -0.55 0.43c-0.57 0.00 -0.65 0.05 -0.86 0.43c-0.23 0.42 -0.05 0.56 -0.70 0.71c-0.20 0.04 -0.57 0.46 -0.62 0.64c-0.08 0.30 -1.04 0.26 -0.31 0.43c0.39 0.09 0.73 0.11 1.17 0.21c0.38 0.09 0.84 0.24 1.09 0.36c0.26 0.12 0.94 -0.04 1.09 -0.07c0.39 -0.09 0.36 -0.23 0.86 0.00c0.30 0.14 0.26 0.51 0.55 0.64c0.28 0.13 1.11 0.07 1.40 0.07c0.07 0.00 0.13 0.91 0.16 0.99c0.06 0.21 0.16 0.64 0.23 0.92c0.02 0.09 0.75 0.40 0.86 0.50c0.22 0.20 0.51 0.29 0.78 0.36c0.45 0.10 0.63 0.07 0.86 0.28c0.24 0.22 -0.05 0.64 0.08 0.92z"}}});
jQ183.fn.vectorMap('addMap', 'europe_mill_en',{"insets": [{"width": 900, "top": 0, "height": 812.9890777806123, "bbox": [{"y": -9891594.817932213, "x": -2895774.757058966}, {"y": -3201145.6268246886, "x": 4510726.063880312}], "left": 0}], "paths": {"BE": {"path": "M246.24,456.55l-0.52,-2.24l-0.56,-0.57l-4.27,-0.9l-0.52,-2.3l-0.72,-1.22l-1.11,-0.96l-1.47,0.14l-2.33,0.95l-0.92,-0.58l-2.09,-2.12l0.05,-1.42l-0.93,-2.11l5.62,-2.88l4.82,-1.88l0.35,1.27l1.0,1.0l0.79,0.0l1.32,-0.71l1.21,0.17l1.92,1.09l1.12,0.14l2.05,-0.73l1.86,-1.11l0.78,-1.23l1.7,0.4l0.63,-0.24l0.21,-0.45l-0.2,-0.83l1.02,-0.54l1.08,0.83l0.82,0.06l1.67,-1.16l0.7,1.3l0.55,0.19l1.3,-0.08l1.16,-0.99l0.54,1.82l1.68,1.4l1.61,0.43l2.17,-0.42l1.55,1.44l2.54,0.82l0.16,0.74l-0.9,1.69l-0.1,0.88l-1.2,1.2l-0.17,0.9l0.73,1.23l0.43,0.19l1.63,-0.55l0.67,0.81l1.43,0.18l1.66,1.17l1.23,1.24l-0.57,0.56l0.11,0.94l0.57,0.56l1.13,0.22l0.42,0.41l0.27,2.03l-2.32,1.34l-0.73,1.47l-2.04,-0.25l-1.48,1.49l-1.77,3.1l-0.26,2.01l2.03,2.91l-0.89,1.45l-3.55,0.48l-3.14,-2.93l-1.98,-0.72l-1.6,-1.01l-1.76,-0.23l-0.27,-1.86l-0.65,-0.86l0.89,-2.9l-0.19,-0.47l-0.91,-0.32l-0.73,0.31l-1.0,0.88l-0.65,1.56l-1.29,0.64l-2.27,0.26l-2.48,-0.26l-0.25,-0.23l0.74,-1.68l-0.73,-1.1l0.42,-1.16l-0.09,-0.82l-1.77,-1.33l-1.44,-0.33l-2.3,-0.2l-1.23,0.59Z", "name": "Belgium"}, "FR": {"path": "M312.76,591.86l0.77,-0.77l0.94,-1.92l1.23,-0.85l3.08,-0.88l1.23,-1.13l1.7,0.56l0.82,-0.34l0.45,-1.04l-0.08,-2.96l0.33,-0.91l0.66,0.38l0.24,2.7l-0.35,2.37l0.97,1.88l0.4,6.27l-2.06,3.66l-0.12,3.27l-1.87,4.26l-0.66,0.88l-3.61,-1.93l-0.93,-0.91l0.98,-1.66l-0.25,-0.45l-2.02,-0.85l0.51,-1.35l-0.22,-1.18l-0.41,-0.29l-1.24,-0.03l1.05,-1.22l0.08,-1.12l-1.58,-1.27l-0.2,-0.63l1.2,-0.79l0.16,-0.59l-0.67,-0.97l-0.55,-0.18ZM158.92,505.37l0.65,-0.84l-0.12,-0.59l-0.73,-0.41l-2.57,0.36l-1.17,-0.3l-1.49,-1.3l-1.37,0.14l-0.87,-0.45l-1.51,-0.0l-0.86,-0.67l-5.4,-1.47l-2.3,-0.18l-2.16,0.65l-0.93,-0.18l-1.64,-2.53l-2.85,-1.02l3.51,-0.98l0.83,-0.82l-0.09,-0.62l-1.42,-0.83l-1.09,-0.24l-0.48,-0.51l4.02,0.01l0.24,-0.69l-0.82,-0.75l-1.49,-0.46l-4.18,0.09l-0.42,-1.11l0.47,-1.3l2.39,-1.29l6.28,-1.5l2.69,0.22l2.0,-0.28l2.38,-0.99l1.02,-0.81l3.05,-0.46l2.89,0.82l2.77,3.21l1.41,1.16l0.45,0.04l3.24,-1.88l4.68,0.05l0.91,0.97l0.66,-0.11l1.03,-1.63l1.04,1.03l6.14,-0.39l0.3,-0.33l-0.2,-0.4l-1.32,-0.73l-1.04,-1.7l-0.23,-6.83l-3.16,-5.2l-0.74,-1.77l0.1,-1.05l3.42,0.27l2.9,-0.67l1.05,0.35l-0.06,1.25l0.44,1.82l1.67,2.18l2.38,-0.09l2.65,0.58l3.27,0.09l4.99,1.0l2.16,-0.63l1.93,-1.21l3.73,-0.81l0.55,-0.6l-0.36,-0.63l-2.09,0.17l-1.74,-0.69l-0.18,-0.56l0.93,-2.26l5.64,-2.73l4.17,-0.84l4.35,-1.55l2.29,-1.65l1.52,-2.13l0.97,-0.76l0.11,-0.58l-0.47,-0.62l0.37,-7.73l0.38,-1.32l0.77,-1.06l3.1,-1.79l7.86,-1.69l0.89,1.97l-0.23,0.88l0.24,0.64l2.36,2.43l1.4,0.74l3.41,-1.17l1.46,1.78l0.66,2.52l0.79,0.51l3.62,0.5l1.16,2.94l0.53,0.06l1.11,-0.65l2.14,0.19l1.16,0.23l1.5,1.13l-0.49,1.57l0.74,1.06l-0.73,1.84l0.74,0.77l2.76,0.32l2.6,-0.31l1.5,-0.75l0.83,-1.78l1.17,-0.8l-0.75,2.86l0.69,1.08l0.35,2.16l0.4,0.31l1.74,0.15l1.55,0.98l2.02,0.76l3.09,2.9l3.87,-0.4l0.55,0.57l2.55,1.05l1.01,-0.16l1.41,-0.77l0.66,0.06l1.34,0.7l1.53,0.18l0.9,0.74l0.57,1.32l2.4,2.91l0.83,0.07l1.34,-0.87l1.17,0.37l0.34,0.99l0.66,0.25l0.87,-0.21l1.22,0.23l3.14,-0.67l0.9,1.02l1.32,0.54l5.31,0.9l1.54,0.57l0.05,1.06l-4.06,4.37l-1.78,6.15l-1.23,2.19l-0.44,1.6l0.31,1.21l-0.19,1.55l-0.73,2.24l-0.14,1.81l0.62,1.43l-1.03,0.58l-0.92,1.44l-0.88,0.32l-1.64,0.02l-0.4,-0.65l-0.67,-0.35l-1.3,0.06l-1.26,0.7l-0.98,1.46l0.57,0.78l0.73,0.13l-4.41,4.92l-2.88,1.4l-0.65,3.27l-3.36,2.49l-1.4,3.22l0.82,1.06l-0.3,1.32l-1.75,1.33l0.3,1.45l1.86,0.05l1.53,-0.78l1.1,-1.08l0.06,-0.49l-0.55,-0.89l1.09,-0.95l1.33,-0.57l1.91,-0.11l2.25,0.34l0.17,1.45l0.39,0.62l-0.48,2.05l2.48,2.54l0.73,1.16l-2.83,1.85l-0.18,1.53l0.36,0.71l0.96,0.63l1.81,2.87l1.7,1.48l-0.9,2.31l-1.21,0.37l-1.74,1.24l-1.94,-0.12l-1.05,0.48l-0.22,0.4l0.1,0.83l0.84,0.96l0.72,1.77l0.97,0.7l2.2,0.58l0.6,1.75l-0.87,0.55l-1.59,2.78l0.62,1.53l-0.2,0.75l0.43,1.08l1.01,1.0l4.77,2.37l0.96,0.2l3.03,-0.67l0.61,0.98l-2.54,3.4l0.06,1.58l-1.05,-0.07l-0.48,0.65l-2.48,1.14l-4.32,3.66l-1.97,1.05l-0.96,1.96l-1.06,0.92l-3.52,0.96l-2.41,1.02l-1.16,-0.44l-2.86,0.05l-1.9,-1.3l-3.42,-0.79l-1.08,-1.77l-3.35,-0.43l-0.12,-1.01l-0.5,-0.38l-2.08,0.32l-0.81,0.45l-0.79,-0.06l-0.3,0.4l-0.61,0.05l-6.5,-1.73l-2.24,-1.83l-2.23,0.45l-1.84,1.74l-7.09,4.4l-2.94,4.71l-0.16,1.52l0.65,4.04l1.42,2.15l-2.55,-0.57l-1.24,0.17l-2.7,0.83l-0.82,1.03l-5.68,-1.28l-2.77,1.03l-0.81,-1.08l-2.69,-1.15l0.34,-0.96l-0.7,-0.84l-2.87,-0.63l-0.99,0.54l-0.97,-1.29l-8.02,-2.44l-1.12,-0.09l-0.58,0.37l-0.39,2.16l-4.74,-0.06l-0.9,-0.43l-3.17,0.48l-3.51,-2.21l-3.8,0.41l-2.46,-2.29l-2.3,-0.16l-4.55,-1.72l-0.58,-0.75l-1.12,1.08l-0.39,-0.03l-0.35,-0.23l0.9,-1.91l-0.24,-1.16l-0.96,-0.5l-3.16,-0.62l-0.85,-0.97l2.08,-0.55l2.08,-2.25l1.89,-7.58l1.35,-8.89l0.9,-1.51l1.14,-0.42l0.17,-0.63l-1.03,-1.24l-0.59,-0.03l-0.43,0.42l0.62,-6.73l1.3,-5.64l2.92,2.19l0.73,1.01l1.11,3.81l1.99,1.6l0.49,-0.04l0.08,-0.49l-1.25,-1.54l-1.21,-4.81l-0.82,-1.5l-1.35,-1.32l-4.11,-2.8l-0.07,-0.37l1.77,0.46l0.54,-0.47l-0.98,-3.08l-0.57,-6.54l-0.32,-0.32l-3.24,-0.63l-5.21,-2.73l-4.02,-5.74l0.92,-3.09l-0.85,-1.26l-1.37,-0.73l0.46,-0.73l0.43,-0.53l0.88,-0.15l3.8,0.98l0.44,-0.27l-0.2,-0.48l-3.38,-1.66l-5.05,0.54l-1.01,-0.19l-0.71,-0.28l-0.22,-0.74l1.25,-1.47l-0.06,-0.51l-0.74,-0.7l-1.24,-0.37l-2.75,0.2ZM177.97,531.5l1.87,1.8l-0.15,0.47l-1.61,-1.84l-0.11,-0.43Z", "name": "France"}, "BG": {"path": "M506.97,608.28l0.29,-3.93l0.71,-1.74l-0.05,-0.72l-0.86,-0.68l-1.47,-3.53l-0.69,-0.61l-2.79,-1.24l-2.72,-2.83l0.66,-0.27l1.35,-1.8l0.2,-0.83l-1.28,-2.5l0.35,-1.28l-0.28,-1.38l0.24,-0.54l0.99,-0.47l2.26,-0.25l3.24,-3.57l0.5,-1.6l-1.7,-1.41l-1.32,-1.72l-2.82,-1.62l-0.65,-0.92l-1.73,-4.24l-0.05,-1.22l0.63,-2.11l2.3,-1.11l0.53,-2.07l0.7,-0.5l3.98,2.36l-2.14,1.89l-0.0,1.56l1.14,0.79l4.09,-0.64l4.12,0.33l5.61,1.1l3.77,0.39l2.8,-0.5l9.8,1.77l4.62,0.26l2.68,-0.69l1.87,-0.94l1.63,-1.76l3.73,-2.21l3.64,-1.25l7.86,-1.35l4.52,2.38l3.3,0.38l0.99,0.7l1.95,-0.44l2.27,2.65l4.45,1.3l2.5,0.06l-0.27,3.43l-1.07,1.52l-1.89,-0.54l-2.52,0.51l-1.56,2.22l-1.43,1.35l-0.55,2.98l-0.1,4.21l-1.73,0.67l-3.64,3.9l0.11,0.63l2.9,1.84l3.86,5.44l-1.29,-0.19l-1.14,0.47l-1.76,-0.06l-1.67,0.63l-3.01,-2.44l-0.84,-0.32l-3.32,0.55l-1.81,1.1l-3.71,0.47l-0.64,0.45l-0.79,1.79l-2.1,0.49l-0.67,1.12l-1.29,-0.3l-1.48,0.42l-0.64,1.22l1.04,2.43l-0.05,1.85l-2.57,1.05l-1.96,-0.27l-7.01,1.36l-1.54,-1.11l-1.95,-0.82l-1.99,-0.47l-1.13,0.51l-2.11,-1.23l-0.94,-1.63l-0.73,-0.26l-1.48,0.51l-4.42,-0.06l-0.73,1.11l-1.79,0.08l-3.22,1.09l-2.62,-0.19l-2.69,0.22l-1.27,1.01l-2.51,-0.16Z", "name": "Bulgaria"}, "DK": {"path": "M400.13,370.7l-0.27,0.17l-2.03,-0.48l-2.42,-1.16l0.34,-2.18l0.45,-0.71l4.45,2.57l0.04,0.75l-0.57,1.04ZM366.37,360.46l-0.22,-0.58l0.73,-0.82l0.32,0.88l-0.83,0.52ZM365.94,356.59l0.03,1.74l-0.24,0.39l-3.01,1.27l-1.04,0.95l-0.5,1.54l0.89,1.35l1.45,0.59l0.28,1.41l-0.97,0.73l-3.08,0.9l-0.28,0.33l-0.5,6.77l-2.01,0.63l-1.42,-2.32l-0.04,-1.1l-1.16,-4.02l-2.76,-0.73l-2.33,0.2l-1.41,-2.12l0.24,-2.45l-0.86,-1.5l-0.07,-1.09l-0.84,-0.87l-0.75,-0.28l-0.25,-0.91l2.9,-0.04l1.44,-0.44l2.05,-2.52l0.14,-1.11l1.62,-0.2l0.65,0.66l-0.05,3.29l0.25,0.34l1.83,0.62l0.44,-0.26l0.83,-1.97l0.58,-0.6l0.15,-1.48l-0.66,-1.19l4.24,-2.53l1.27,-0.06l3.22,1.02l0.2,0.29l-1.04,2.05l0.58,2.71ZM362.58,370.92l1.62,0.27l1.26,0.71l-1.93,-0.19l-2.4,1.25l-0.36,-0.17l1.81,-1.88ZM349.75,373.74l2.47,1.21l1.72,-0.02l0.86,0.38l0.26,1.84l-0.8,0.33l-1.36,-0.13l-1.58,0.57l-5.32,-2.52l0.22,-2.52l2.26,-0.18l1.27,1.03ZM345.52,328.07l-0.34,0.28l-1.08,-0.37l0.32,-0.35l1.92,-0.37l-0.83,0.82ZM341.24,375.71l-0.81,-1.41l2.93,-3.52l-1.79,4.2l-0.33,0.72ZM313.95,372.81l-0.42,-2.39l-0.69,-1.32l0.85,-0.26l0.28,-0.41l-0.25,-3.26l-0.49,-1.77l-6.51,-3.54l0.92,-6.99l-1.09,-3.14l0.55,-8.57l1.13,-0.11l3.55,1.07l0.63,0.75l1.02,0.47l0.49,-0.15l0.69,-1.1l0.22,-1.47l1.92,-1.94l2.1,-1.0l1.52,1.57l0.43,0.13l0.28,-0.35l0.79,-5.96l-0.27,-0.44l-1.95,-0.62l-1.84,0.53l-1.79,2.66l-1.34,2.97l-2.06,0.26l-1.76,0.83l-2.33,-1.47l0.18,-1.51l1.88,-2.47l2.45,-2.32l2.45,0.02l2.0,-0.79l1.05,-0.09l3.53,0.17l2.07,-0.61l1.73,-1.22l3.51,-4.76l1.88,-1.89l4.03,-0.74l3.39,-2.11l-0.97,1.0l-0.51,1.76l1.22,2.36l-0.16,3.78l-1.14,1.35l-1.29,2.83l-0.65,0.67l-0.18,7.29l1.49,1.58l1.55,0.73l4.8,0.01l0.83,1.17l-0.84,2.51l-2.95,1.65l-0.87,0.03l-1.39,-1.34l-0.5,-0.05l-0.78,0.52l-0.84,0.9l-1.81,6.5l-1.88,-0.35l-1.7,0.66l-0.08,0.69l1.35,1.25l-1.45,0.7l-1.73,1.9l-1.54,1.0l-0.95,1.22l0.98,4.53l-0.3,0.94l-1.79,1.6l-0.79,1.57l0.37,0.57l1.54,-0.02l1.37,0.66l0.38,0.38l-0.27,0.76l0.33,1.37l-1.22,-0.48l-3.69,0.91l-0.99,-0.03l-0.97,-0.68l-3.83,-0.98l-2.88,-0.13ZM340.07,360.25l2.16,5.07l-0.38,0.82l0.26,1.43l-0.26,1.07l-1.96,1.37l-2.27,0.06l-5.88,-2.06l-1.67,-3.43l0.02,-2.59l5.38,-1.72l1.83,0.94l1.1,0.04l1.67,-1.0ZM339.43,356.41l-0.34,-0.12l0.24,-1.95l-0.31,-1.06l1.06,1.49l-0.65,1.64ZM336.25,373.56l0.79,0.15l0.48,0.27l-0.26,0.06l-1.01,-0.47ZM328.94,370.61l2.32,1.32l0.69,1.27l-0.87,0.16l-1.78,-0.57l-0.36,-2.19Z", "name": "Denmark"}, "HR": {"path": "M385.7,540.33l1.22,0.46l3.99,-0.1l0.92,-0.53l1.59,-2.34l0.82,1.3l2.12,1.66l1.03,0.14l1.21,-0.48l2.01,0.79l1.89,0.18l1.48,-0.45l0.26,-0.49l-0.73,-1.78l0.98,-1.18l-0.97,-1.19l4.31,-1.53l0.65,-0.75l0.33,-2.14l-0.13,-1.17l-0.95,-1.16l0.13,-0.69l0.25,-0.33l4.89,-1.77l0.95,-1.13l2.19,-0.05l0.5,-0.65l-0.2,-1.45l0.85,-0.55l3.09,0.8l2.35,1.14l1.58,1.24l0.96,1.48l1.26,1.12l2.8,1.84l1.02,1.44l1.3,0.76l2.64,0.6l1.38,1.46l1.44,0.67l7.71,0.66l2.51,-0.79l1.72,-1.77l2.6,-0.25l-0.74,1.25l1.37,2.81l-0.3,1.16l0.68,0.87l0.9,0.34l-0.43,0.82l0.1,1.43l1.31,1.12l3.14,1.15l0.78,0.85l-2.14,0.07l-0.85,-0.43l-0.57,0.26l-0.1,0.53l-0.62,0.17l-0.29,0.46l0.49,2.65l-0.14,0.57l-0.99,0.12l-0.22,0.71l-0.35,0.03l-1.73,-0.65l-0.58,-1.84l-1.46,-1.06l-2.31,-0.14l-2.73,-0.8l-2.09,0.23l-1.83,-0.36l-1.83,1.07l-0.59,-0.01l-1.55,-1.26l-0.68,-0.17l-2.03,0.71l-2.45,-0.72l-2.58,-0.11l-2.74,-1.72l-0.46,0.02l-1.61,1.24l-3.67,-0.22l-3.03,3.33l-1.48,-0.9l-1.72,-1.94l-1.03,-0.46l-1.26,-0.1l-1.52,0.7l-0.82,5.65l0.14,1.89l1.91,1.38l2.26,2.38l0.73,0.32l1.41,4.87l1.26,1.68l3.92,3.5l1.7,2.25l5.01,4.32l2.43,1.02l0.02,1.53l0.33,0.88l1.52,1.8l2.96,2.52l0.33,0.7l-0.53,0.3l-3.22,-2.74l-2.74,-1.6l-3.2,-3.05l-4.07,-1.17l-2.76,-1.29l-3.77,0.57l-1.68,-0.17l-0.41,-0.57l-0.18,-1.66l-5.97,-4.16l-4.19,-4.31l-0.56,-0.93l1.66,-0.36l2.37,0.27l0.45,-0.22l-0.12,-0.48l-2.72,-1.86l-3.84,-3.59l-1.08,-1.6l0.16,-4.24l-0.73,-2.02l-4.36,-3.87l-2.22,-0.75l-1.46,0.24l-0.65,1.06l-0.42,1.98l-3.52,5.21l-0.94,-0.0l-3.02,-4.36l-1.43,-5.93l0.28,-0.2l0.5,0.51l3.57,0.81l1.03,-0.39l0.69,-0.89ZM432.19,582.77l2.81,1.18l-0.64,-0.13l-2.17,-1.05ZM436.37,584.23l-0.27,-0.82l0.24,-0.07l0.56,0.15l0.72,1.01l-1.25,-0.27ZM444.09,588.56l1.28,0.46l0.04,0.42l-0.83,-0.51l-0.49,-0.37ZM419.17,578.26l2.28,0.14l0.46,0.53l0.95,0.21l-2.53,-0.34l-1.17,-0.53ZM422.29,582.13l1.73,0.32l1.9,-0.2l1.58,0.28l-1.6,-0.19l-1.62,0.5l-1.35,-0.25l-0.64,-0.46ZM423.33,576.69l-2.03,0.04l-2.35,-0.62l0.18,-0.53l1.76,0.07l3.31,0.71l-0.86,0.32ZM397.58,555.25l1.48,1.21l2.63,2.62l-0.28,0.25l-3.0,-2.6l-0.82,-1.49ZM396.17,552.13l-1.0,-0.23l0.11,-0.54l0.35,0.02l0.54,0.75ZM392.18,546.87l0.86,-0.59l0.52,-0.96l2.47,3.2l-0.91,0.2l-1.06,-1.13l-1.25,-0.15l-0.63,-0.56ZM390.21,546.1l0.07,0.66l-0.21,-0.59l0.14,-0.08ZM390.72,548.1l0.9,0.94l-0.18,1.58l0.44,3.21l-1.56,-3.88l0.39,-1.85Z", "name": "Croatia"}, "DE": {"path": "M275.98,444.34l0.92,-0.06l2.69,-2.08l-0.1,-0.78l-0.62,-0.26l-0.01,-0.35l1.2,-2.31l0.46,-1.8l-0.14,-0.96l-1.32,-1.91l-0.18,-0.88l-1.74,-2.06l0.0,-0.39l2.54,-1.2l2.72,0.96l0.9,-0.57l1.26,0.05l3.03,-1.03l1.09,-1.58l-1.19,-1.26l0.08,-0.38l3.32,-2.17l0.69,-1.23l0.26,-2.25l-0.57,-1.0l-0.78,-0.57l-1.72,0.03l-0.99,-0.34l-0.56,-0.77l0.32,-0.8l-0.14,-0.63l0.26,-0.15l3.47,0.01l0.58,-0.47l1.19,-4.39l0.87,-1.53l0.25,-5.87l-0.69,-1.09l-1.22,-0.85l0.66,-2.97l1.24,-1.66l0.91,-0.42l4.56,-0.29l4.94,0.12l1.85,2.36l-0.66,1.16l0.16,0.55l1.25,0.65l0.93,-0.22l1.1,-2.84l1.7,1.34l0.03,2.08l0.36,0.39l0.43,-0.32l0.59,-3.0l-0.42,-2.19l0.28,-1.89l0.99,-1.44l3.66,0.69l4.05,-0.37l1.41,0.7l3.62,3.97l1.33,0.69l1.5,0.2l0.44,-0.29l-0.24,-0.47l-1.98,-0.81l-4.39,-4.82l-1.42,-0.63l-1.93,-0.18l-1.77,-1.03l-0.25,-5.55l-0.75,-0.72l-1.14,-0.35l-1.62,0.32l-0.16,-0.67l0.18,-0.5l2.27,-0.51l1.71,-0.77l0.31,-1.66l-3.73,-4.93l-0.12,-1.53l2.64,0.11l3.73,0.96l1.1,0.72l1.3,0.02l3.51,-0.88l1.75,0.87l1.88,0.47l1.56,1.78l0.07,1.44l-2.01,1.87l-0.12,0.46l0.4,0.25l3.45,-0.28l0.84,1.3l0.43,0.15l1.86,-0.51l4.89,2.22l3.71,-1.11l0.53,1.41l-0.65,1.6l-2.59,1.9l-0.12,0.5l0.59,1.21l1.09,0.48l2.61,-0.23l4.2,1.16l0.93,-0.43l3.2,-2.73l1.18,-0.54l4.48,-0.58l0.73,-1.01l1.74,-1.1l3.61,-3.28l5.78,1.01l1.62,2.35l4.07,2.64l3.72,-0.15l1.18,2.21l0.71,3.25l2.2,1.62l3.04,0.68l0.48,2.96l1.56,5.01l-0.04,1.42l-0.54,1.61l-0.94,1.33l-1.28,0.77l-0.84,0.99l-0.23,1.2l1.8,2.08l3.52,2.51l1.27,1.9l-0.81,3.14l0.34,0.97l1.43,1.19l0.26,2.34l0.57,0.56l-0.95,2.89l-1.01,1.59l0.34,1.21l1.35,1.96l-0.22,1.8l0.22,0.65l2.56,1.24l1.33,3.48l-1.28,4.17l-1.87,3.19l-1.45,-0.48l0.11,-0.81l-1.26,-1.82l-3.37,-0.82l-0.7,0.29l-0.4,0.92l1.31,1.41l-5.94,2.33l-4.66,1.03l-1.5,1.77l-0.93,-0.3l-2.04,0.95l-0.67,1.03l-2.05,0.33l-0.98,1.46l-2.31,-0.4l-3.18,0.72l-1.39,0.84l-2.01,2.57l-1.76,-1.93l-0.72,-0.08l-0.44,0.32l-0.04,1.02l1.14,1.65l0.52,1.47l1.03,1.05l2.35,1.46l0.63,0.9l-1.6,2.81l1.52,1.82l2.46,3.97l1.86,1.56l1.49,0.06l2.95,2.94l2.61,1.64l0.92,1.52l0.79,0.46l1.3,-0.06l3.28,2.99l-0.15,2.43l-0.83,1.09l-0.5,0.23l-2.76,-0.87l-0.49,0.51l-0.66,2.87l-0.38,0.46l-6.36,2.66l-1.17,0.77l-0.82,1.02l-0.01,1.03l2.54,3.11l0.01,1.17l-0.74,1.45l0.24,0.51l1.68,0.35l0.18,0.48l-0.4,2.6l-2.25,-1.03l-0.43,-1.57l-1.34,-0.67l-2.77,0.52l-1.62,-0.85l-2.1,-0.52l-0.57,0.25l-0.13,1.45l-6.21,0.61l-4.39,1.66l-1.31,1.07l-1.45,0.0l-1.9,0.52l-0.6,-0.06l-1.65,-2.11l-5.77,-0.52l-0.56,0.34l-0.83,3.0l-0.68,0.81l-1.08,0.46l0.2,-0.9l-0.26,-0.48l-1.5,-0.34l-0.22,-1.01l-1.29,-1.05l-3.11,-1.25l-0.84,0.48l-7.42,-4.0l-0.69,0.18l-0.13,0.52l0.62,1.16l-3.24,0.23l-0.69,-0.77l-0.81,-0.23l-0.59,0.27l-1.4,-1.07l-0.92,-0.24l-1.99,0.82l-0.57,0.89l0.1,0.75l0.96,0.47l-0.22,0.19l-3.27,-0.22l-1.5,0.54l-2.18,0.2l-3.01,-0.1l-1.57,-0.55l-0.38,-0.91l0.11,-1.57l0.74,-2.3l0.21,-1.67l-0.31,-1.12l0.39,-1.44l1.21,-2.15l1.76,-6.09l4.04,-4.31l0.04,-1.82l-0.29,-0.36l-1.84,-0.66l-5.26,-0.89l-1.02,-0.38l-1.24,-1.21l-3.4,0.67l-2.09,-0.1l-0.44,-1.02l-1.72,-0.51l-1.81,0.85l-2.04,-2.61l-0.66,-1.43l-1.18,-0.92l-1.21,-0.27l0.41,-1.96l1.46,-1.98l0.04,-1.7l-3.27,-1.56l-1.51,-1.7l-0.35,-1.87l0.82,-2.21l2.45,-1.41l0.19,-0.42l-0.31,-2.35l-0.74,-0.87l-1.49,-0.56l0.7,-0.84l-0.06,-0.62l-3.07,-2.45l0.64,-2.94l-0.69,-0.92l-1.76,-0.93ZM383.69,388.37l4.42,2.8l-0.02,0.84l-1.71,0.2l-1.35,-0.24l-0.07,-2.1l-1.26,-1.51ZM381.44,383.22l0.19,1.05l-1.39,-0.88l-1.53,0.01l-1.16,1.66l-0.33,0.03l-2.15,-1.36l-0.36,-1.04l0.29,-2.61l0.72,-0.83l0.1,-0.88l1.08,-0.91l0.74,-0.03l0.89,1.42l2.03,0.8l0.23,0.33l-1.12,1.59l0.47,0.93l1.3,0.71ZM348.45,381.91l-1.43,0.03l-1.18,-0.81l0.48,-0.55l1.68,0.5l0.45,0.83ZM308.86,374.08l0.28,-1.31l0.49,0.9l0.97,0.04l-1.75,0.36ZM312.01,376.65l-0.21,0.19l-1.34,-0.23l0.93,-0.31l0.63,0.35Z", "name": "Germany"}, "BA": {"path": "M453.51,550.99l3.06,-0.74l1.2,0.42l-0.79,2.62l-1.92,2.88l-0.45,3.02l0.51,1.08l2.61,1.36l3.16,2.87l-0.23,0.38l-1.19,0.13l-2.07,-0.23l-0.97,0.56l0.15,0.91l3.04,3.84l0.08,0.82l-0.38,0.94l-1.06,-0.49l-0.81,0.03l-0.9,0.24l-0.68,0.71l-1.4,0.25l-1.34,-0.37l-0.66,0.34l-0.25,0.99l1.25,2.2l-0.08,0.64l-0.78,-0.82l-1.48,-0.05l-2.53,2.08l-0.73,1.8l0.01,1.33l-1.63,0.26l-0.76,0.89l0.27,3.35l1.07,2.1l-1.07,0.98l-1.62,-0.59l-2.38,-1.46l-3.76,-2.49l-0.73,-1.03l-2.17,-0.15l0.47,-0.54l-0.1,-0.84l-4.83,-4.92l-0.31,-2.36l-0.52,-0.52l-2.14,-0.74l-4.92,-4.24l-1.7,-2.25l-3.9,-3.47l-1.1,-1.42l-1.5,-5.07l-0.87,-0.45l-2.22,-2.34l-1.83,-1.33l0.67,-6.5l0.28,-0.24l0.73,-0.18l1.63,0.37l1.74,1.95l1.95,1.12l1.36,-0.9l2.12,-2.54l3.35,0.32l1.79,-1.25l2.69,1.66l1.15,0.26l1.55,-0.13l2.52,0.74l2.07,-0.71l2.09,1.41l1.04,-0.04l1.55,-1.0l1.73,0.34l2.04,-0.24l2.67,0.79l2.33,0.15l0.96,0.73l0.49,1.68l0.79,0.76l2.59,0.32Z", "name": "Bosnia and Herz."}, "HU": {"path": "M419.21,503.1l1.54,-0.97l2.57,1.22l3.96,-0.49l0.32,-0.51l-0.38,-2.53l0.54,-0.63l0.13,-0.94l0.82,-0.63l1.72,0.33l4.26,3.09l1.92,0.75l5.22,0.12l7.83,-0.41l1.05,-1.32l-0.32,-1.6l0.46,-0.86l1.47,-0.78l4.67,-0.38l2.79,-0.66l1.42,-1.79l0.6,-0.13l3.87,1.55l5.91,-2.85l2.25,-4.03l1.81,-0.35l2.93,0.07l2.8,0.69l5.04,-0.81l1.4,0.9l2.13,2.57l0.79,0.23l6.35,-1.27l1.33,2.56l2.33,0.93l0.97,1.29l1.36,0.54l1.12,-0.08l0.79,0.7l0.31,1.75l-3.23,2.69l-1.5,-0.12l-2.91,0.86l-2.4,2.66l-1.56,1.19l-0.16,1.98l-1.62,1.48l-1.17,2.89l-1.73,1.75l-0.13,1.34l-2.11,2.94l-0.24,0.62l0.18,0.84l-2.28,1.58l-0.95,2.12l0.13,1.12l-0.94,0.47l-0.52,1.42l-1.26,0.86l-2.61,-0.28l-1.17,0.24l-0.9,1.33l-0.99,0.54l-1.52,-0.53l-3.55,0.89l-1.03,-0.47l-3.08,-0.33l-1.29,0.26l-3.02,-0.38l-1.28,0.24l-1.63,1.6l-1.87,1.0l-1.49,0.24l-1.07,-0.47l-1.04,0.98l-1.05,0.42l-2.7,0.54l-0.69,-0.13l-2.05,1.91l-2.19,0.68l-7.34,-0.61l-2.08,-1.2l-0.59,-0.86l-1.18,-0.5l-1.58,-0.16l-1.14,-0.67l-0.95,-1.36l-4.04,-2.96l-0.99,-1.51l-1.74,-1.35l-3.0,-1.37l-1.72,-2.19l-0.02,-0.77l-0.66,-0.74l-0.73,-2.29l-1.88,-0.24l2.28,-1.61l1.32,0.05l0.62,-0.39l0.55,-2.05l-0.16,-0.54l-0.64,-0.29l-0.2,-0.9l0.58,-1.02l-0.33,-1.7l2.31,-0.85l0.87,-1.68l-0.74,-1.82l-2.35,-0.68Z", "name": "Hungary"}, "JO": {"path": "M676.04,763.88l0.58,-3.52l1.27,-3.17l-0.33,-4.96l0.5,-2.13l-0.27,-2.33l0.23,-3.32l0.39,-0.64l1.55,-0.66l1.88,0.21l2.08,2.57l2.33,0.72l2.12,1.65l6.35,1.0l26.01,-15.66l3.59,12.4l-0.65,0.2l-0.27,0.51l0.81,2.51l0.49,0.26l2.43,-0.61l0.39,1.04l-4.13,3.47l-27.1,7.54l-0.18,0.66l7.04,7.22l6.44,7.17l-4.14,2.36l-2.32,4.87l-9.56,1.89l-0.85,0.58l-3.15,5.03l-5.39,4.24l-14.47,-2.21l0.34,-1.52l-0.11,-1.11l1.26,-6.16l0.98,-2.39l0.03,-4.27l4.01,-10.48l-0.48,-1.65l0.27,-1.3Z", "name": "Jordan"}, "DZ": {"path": "M312.04,678.73l0.2,0.96l-1.89,1.0l-1.15,2.08l-1.8,1.3l-0.48,0.75l0.24,0.71l1.18,0.57l0.48,1.05l-1.37,8.75l0.97,2.37l-0.03,3.73l1.02,3.03l-1.02,1.67l-0.52,1.71l-0.43,3.76l-1.55,2.43l-3.78,2.29l-1.32,2.46l-3.17,2.66l-0.33,1.77l0.06,2.26l3.21,8.79l0.53,0.63l4.63,2.6l1.28,1.87l1.23,3.4l0.54,2.52l9.48,6.93l6.34,27.14l-2.58,1.56l-0.13,0.55l4.45,7.05l2.41,7.6l0.29,2.12l-0.36,6.0l0.62,7.78l-250.18,0.0l0.2,-9.84l13.11,-9.25l2.7,-0.64l4.54,-3.31l6.7,0.76l0.68,-0.16l1.25,-1.34l0.32,-2.2l3.5,0.13l2.91,-0.31l3.15,-0.57l4.42,-1.3l2.22,-1.57l1.59,-1.64l2.86,-4.41l2.45,-1.23l6.15,-2.17l4.57,-3.18l3.74,-0.45l0.71,-0.41l0.65,-0.82l-0.08,-1.26l-0.77,-0.77l-1.92,-1.01l0.58,-2.4l-0.81,-3.06l0.22,-1.11l1.4,-0.46l1.34,0.19l2.31,-0.28l5.72,-1.94l0.65,-0.87l0.72,-2.37l0.66,-0.35l5.54,-0.82l15.86,0.61l0.83,-0.3l0.25,-0.37l-0.47,-2.47l0.23,-0.77l2.26,-1.88l0.11,-0.49l-0.72,-1.4l-4.52,-3.45l-0.75,-1.29l-0.59,-3.03l-1.67,-3.54l0.63,-3.66l-1.12,-3.37l0.29,-3.16l-0.19,-2.83l-1.11,-2.87l0.74,-1.61l-0.21,-0.67l-1.32,-1.45l0.7,-1.54l-0.0,-0.67l-4.68,-3.61l-0.88,-1.28l3.6,0.09l3.36,-1.39l2.62,-1.86l2.1,-1.02l3.29,-3.24l2.26,-1.35l6.56,-2.93l3.16,0.65l2.11,-0.3l1.4,-1.16l1.36,-2.43l2.08,-1.47l8.87,-4.33l3.78,-1.15l14.64,-1.4l3.35,0.15l5.24,-2.86l7.34,-0.16l3.58,-1.57l13.1,-0.0l3.06,1.31l2.8,2.08l1.57,0.45l1.83,-0.45l4.03,-1.91l4.63,-1.02l2.5,-1.15l1.15,-1.7l1.77,-0.51l1.23,1.22l4.76,1.3l4.43,-0.77l0.27,-0.48l-0.32,-1.34l2.45,0.41l2.28,0.89l2.45,1.83l1.76,0.44l3.09,-0.83l5.73,-0.39Z", "name": "Algeria"}, "JE": {"path": "M168.55,476.28l-0.06,0.37l-0.56,-0.27l-1.49,0.09l0.08,-0.63l2.02,0.44Z", "name": "Jersey"}, "FI": {"path": "M487.72,242.22l1.12,-0.27l0.17,-0.8l-3.0,-6.75l-1.65,-1.51l1.26,-4.64l-0.13,-1.29l-0.44,-1.65l-2.0,-1.4l-0.8,-4.19l0.5,-2.28l0.65,-0.99l3.51,-3.35l0.3,-1.68l2.07,-0.11l0.31,-0.63l-1.08,-1.53l-0.27,-1.43l2.99,-0.62l1.43,0.56l3.04,-0.72l2.79,-1.45l0.17,-1.13l-0.9,-1.84l1.23,0.03l-0.36,-1.05l1.03,0.05l1.75,-1.9l0.16,-1.41l2.9,-0.77l3.47,-2.95l3.21,-1.63l3.22,-2.9l1.63,-0.39l0.7,-1.93l2.7,-2.57l0.99,-0.5l1.28,-2.36l3.49,-2.87l2.17,-3.56l1.18,-1.25l0.4,-1.27l1.07,-0.09l1.37,-1.04l2.48,-0.66l2.46,0.18l1.24,0.48l1.0,-0.15l0.34,-0.43l-0.1,-1.23l-0.58,-0.75l1.83,-1.31l-0.47,-2.07l-1.06,-0.97l1.19,-7.21l-1.66,-1.93l-5.45,-2.53l-2.14,-0.22l-1.07,-1.63l0.59,-2.18l-0.41,-0.44l-0.76,0.14l-0.76,0.77l-1.53,0.82l-2.1,-0.66l-0.96,0.1l-1.35,-3.85l-1.94,-3.59l-2.51,-1.49l-0.59,-3.55l0.1,-1.32l0.2,-0.66l0.88,-0.57l1.4,-1.76l0.39,-2.96l1.27,-2.54l-0.7,-1.67l-3.54,-4.28l-0.46,-1.32l-0.2,-2.18l1.98,-2.11l-0.54,-2.43l-1.32,-0.69l-2.45,-0.23l0.14,-1.03l1.04,-2.32l-0.56,-2.0l0.01,-3.86l1.64,-1.24l0.06,-1.15l-2.19,-1.44l-1.54,-1.59l-0.47,-0.92l-1.92,-0.34l-1.17,-2.75l-3.36,-2.61l-1.05,-0.59l-5.69,-1.71l-2.28,-0.33l-2.6,-0.97l-7.12,-3.96l-0.62,-0.81l-3.27,-2.48l-3.41,-1.76l-0.16,-1.36l-0.37,-0.48l-3.13,-1.14l2.85,-0.25l2.64,0.65l0.68,-0.47l0.33,-0.96l-0.97,-2.39l0.11,-0.39l2.45,-1.26l4.53,0.04l9.06,9.72l1.07,1.79l0.36,1.29l0.39,0.29l8.78,1.05l1.17,0.77l2.43,-0.15l5.26,-1.54l2.04,-2.14l1.69,0.15l4.53,2.05l4.93,1.36l1.47,1.12l2.14,0.27l2.15,-1.29l1.14,-2.91l0.96,-1.23l1.35,-0.9l3.03,-0.64l2.4,-2.5l0.36,-2.24l-0.26,-3.72l0.23,-1.11l1.13,-2.03l1.5,-5.29l1.37,-2.28l3.19,-2.19l2.92,-3.18l2.69,-0.38l5.3,0.64l1.17,-0.33l5.2,-2.97l2.0,-0.52l1.71,0.07l2.05,2.1l4.98,3.63l5.31,2.23l4.5,1.41l2.4,4.4l-1.12,1.66l-2.88,2.51l-2.42,2.65l-0.24,1.85l1.37,1.93l-6.8,2.58l-0.22,0.62l0.84,0.92l3.35,0.16l0.61,0.39l0.04,0.39l-0.3,0.87l-3.66,5.46l-0.16,1.52l2.91,7.01l9.04,3.16l2.4,3.03l4.02,4.06l2.13,1.71l-0.59,2.59l-4.93,5.06l-4.46,5.23l-2.13,2.88l-0.36,2.02l0.45,1.23l2.69,3.47l2.3,3.67l2.8,5.78l3.13,4.13l2.47,6.74l0.12,1.92l-2.62,0.33l-2.15,0.65l-0.35,0.42l0.09,0.48l1.15,1.02l-1.13,2.01l-0.17,2.89l-1.24,1.48l-0.21,0.7l0.62,0.87l2.25,0.39l0.09,0.91l-0.16,0.59l-2.59,1.65l-0.27,1.72l1.38,2.87l1.19,1.01l3.94,0.91l0.37,0.52l0.12,1.58l-1.72,1.8l-0.07,1.16l1.84,3.65l3.79,1.8l1.2,0.91l0.47,1.84l-0.02,1.3l-0.27,1.1l-3.85,4.53l-2.71,1.17l-0.31,0.89l5.83,5.01l7.56,4.37l2.71,1.91l2.09,2.95l2.32,2.38l0.27,1.14l-3.31,6.62l-1.3,1.77l-3.36,3.28l-5.03,4.14l-11.82,12.08l-2.67,2.11l-3.25,3.23l-6.9,4.69l-1.08,1.18l-3.43,2.15l-8.19,7.32l-1.68,0.75l-1.87,0.16l-0.83,0.47l-3.54,-1.54l-1.89,0.43l-1.6,1.04l-3.06,0.33l-2.14,0.64l0.29,-1.94l0.65,-0.96l0.13,-0.85l-0.45,-0.43l-0.5,0.07l-1.27,1.66l-0.55,1.72l-0.89,0.72l-2.09,0.32l-2.16,-1.32l-1.3,-0.04l-0.33,0.63l1.05,2.04l-1.03,-0.03l-2.51,1.57l-0.89,-1.14l-0.5,-0.16l-2.7,1.44l-2.64,0.33l-1.46,1.06l-7.44,1.6l-1.27,1.45l-0.76,0.39l-1.42,-0.39l-8.38,1.54l-3.68,-0.35l-3.79,2.82l-1.98,0.53l2.57,-2.49l0.22,-1.2l-0.2,-0.4l-1.63,-0.55l-1.01,-0.9l-1.36,-2.4l-1.04,0.08l-0.67,2.34l-0.77,0.71l-1.25,0.53l-2.15,-0.02l-0.2,-0.77l0.41,-1.08l-0.13,-0.82l1.1,-0.12l0.67,-0.88l-0.37,-0.93l-0.64,-0.1l0.93,-1.94l-0.28,-0.49l-4.42,-0.42l-4.33,-2.0l-0.96,-0.12l-0.58,-1.57l-0.46,-0.25l-1.2,0.29l-1.31,0.9l-2.09,-1.15l-0.93,-7.29l0.21,-1.74l1.36,-2.28l0.49,-2.36l0.11,-2.74l-0.24,-1.14l0.43,0.0l0.38,-0.53l-0.76,-1.2ZM532.29,168.42l-1.79,0.65l-1.22,-0.34l-0.02,-0.9l0.75,-0.51l1.65,-0.25l1.69,0.46l-1.07,0.89ZM496.39,266.82l1.57,0.43l0.67,-0.11l0.36,0.47l-1.17,0.78l-0.1,0.84l0.62,0.92l-0.71,-0.0l-0.85,-1.34l-1.17,-0.85l0.39,-0.98l0.37,-0.17ZM491.93,265.96l0.23,-0.82l0.48,0.4l-0.15,0.7l0.64,0.5l-1.19,-0.79ZM491.4,270.79l-1.06,0.55l-0.05,-0.01l0.07,-0.67l0.56,-0.37l0.66,-0.03l-0.18,0.54ZM488.67,271.37l-0.79,0.13l-0.32,-0.25l1.18,-0.39l-0.07,0.5ZM486.11,263.34l-0.06,0.32l-1.37,0.07l-0.55,-0.69l-0.31,-1.48l2.29,1.77ZM483.0,206.57l0.17,0.59l0.43,0.26l0.96,-0.17l0.88,-0.6l0.27,0.45l-0.56,-0.04l-1.2,1.03l-1.17,-0.84l-0.53,-1.0l0.8,-0.0l-0.05,0.32Z", "name": "Finland"}, "BY": {"path": "M515.36,433.8l-0.13,-0.27l0.06,-1.46l1.09,-1.97l-0.23,-1.17l0.55,-1.58l0.0,-1.53l-0.91,-1.32l-1.92,-1.22l-3.4,-1.52l-0.13,-0.46l3.0,-3.65l5.76,-2.63l0.89,-0.8l0.33,-2.39l-0.78,-5.47l-3.53,-9.0l-1.36,-5.54l2.78,0.28l1.96,-0.44l4.11,-0.26l1.98,1.03l4.05,-1.59l1.9,0.09l0.64,-0.62l0.52,-2.24l0.36,-0.29l2.43,0.17l1.02,-0.51l0.87,-1.04l1.25,-0.61l1.3,-0.06l0.97,-0.62l0.5,0.91l-0.32,0.99l0.36,0.45l1.01,0.4l2.51,-0.34l0.49,-0.81l-0.35,-1.77l-0.79,-0.72l-1.78,-0.34l0.92,-2.2l1.45,-2.06l-0.02,-2.88l0.75,-2.05l0.96,-1.47l2.97,-0.74l1.28,-0.84l1.11,-2.32l0.33,-0.17l4.08,0.17l1.26,-1.86l1.38,-0.93l0.08,-0.49l-0.47,-0.58l-3.73,-0.67l1.4,-3.6l0.38,-2.2l2.86,-0.65l1.83,-1.98l1.15,-0.29l3.4,0.5l3.98,-0.04l0.92,-2.17l3.34,-3.06l1.74,-1.03l1.25,-0.18l1.75,1.58l0.64,0.16l1.24,-0.67l2.07,-0.07l0.81,0.47l1.37,1.97l0.92,0.38l3.4,-1.49l3.19,1.0l1.29,0.8l-0.51,2.55l1.82,1.97l0.47,0.03l2.62,-1.56l1.95,-0.51l1.41,-0.91l3.91,-0.0l2.82,1.04l2.23,2.21l1.47,0.96l2.03,0.41l0.22,0.33l-0.08,3.0l-1.06,1.29l-0.11,1.14l1.98,2.79l0.22,1.34l-1.98,2.55l-0.54,2.11l0.11,0.59l4.79,3.05l-1.06,2.23l0.22,0.44l1.4,0.68l1.5,2.94l1.41,1.78l5.67,3.03l-0.04,1.47l-0.93,2.24l0.22,0.54l1.06,0.37l5.01,0.19l3.1,1.5l-0.32,1.27l0.64,1.38l3.15,2.25l0.01,1.08l-3.01,1.21l-0.7,1.17l-3.64,2.08l-3.71,-0.26l-1.43,-1.43l-1.17,-0.32l-3.42,0.09l-0.75,0.46l-1.7,2.99l0.04,0.52l4.02,4.53l-0.61,1.04l0.17,1.41l0.94,1.23l-0.33,4.37l1.59,1.88l0.82,1.53l-5.15,-0.05l-1.77,0.96l-1.99,-0.42l-1.45,0.63l-3.04,2.72l-1.29,1.6l-1.83,3.95l1.26,4.36l-0.97,1.32l-0.91,-0.12l-1.36,-0.79l-0.43,-1.39l-2.23,-1.49l-8.26,0.78l-2.68,0.89l-2.11,-3.37l-0.52,-0.66l-0.8,-0.34l-0.77,0.12l-1.09,0.93l-1.76,0.6l-0.87,0.66l-0.7,1.15l-0.62,-0.26l-0.83,-1.64l-5.64,-1.18l-2.43,0.84l-2.32,-0.51l-1.81,1.97l0.15,-1.23l-0.24,-0.41l-1.34,-0.56l-3.99,0.09l-2.18,-2.79l-4.99,-0.34l-4.25,-0.76l-0.91,-0.57l-8.24,-1.44l-9.79,-0.12l-2.74,0.57l-6.84,0.57l-0.74,0.64l-0.63,1.19l-2.0,1.91l-1.93,1.27l-1.28,-0.61l-2.2,-0.32l-1.06,0.29l-0.7,0.7Z", "name": "Belarus"}, "FO": {"path": "M109.05,227.53l-0.39,0.91l-0.68,-0.21l-0.02,-1.72l1.1,1.02ZM106.06,237.21l-2.12,-1.38l-0.34,-0.59l2.21,0.79l0.36,0.54l-0.11,0.64ZM104.89,233.23l-3.25,-2.63l-1.86,-3.49l2.24,-0.5l4.05,1.71l-0.25,2.13l-1.83,-0.93l-0.67,0.61l-0.01,0.72l1.59,2.38ZM103.05,241.48l1.56,0.47l0.55,2.17l-1.8,-1.85l-0.31,-0.79ZM98.79,230.26l1.28,0.95l-1.0,0.36l-0.92,-0.11l-1.47,-0.53l-0.27,-0.63l1.88,-0.23l0.51,0.19Z", "name": "Faeroe Is."}, "PS": {"path": "M669.94,755.96l0.24,-0.99l-0.44,-3.64l1.39,-4.26l1.49,-0.96l2.07,0.37l0.46,0.8l1.11,0.74l0.77,0.13l0.23,1.98l-0.5,2.04l0.32,4.99l-0.78,1.37l-0.61,2.56l-4.48,1.73l-2.55,0.12l0.95,-3.04l1.02,-0.96l2.18,-1.1l0.26,-0.45l-0.26,-0.66l-1.05,-0.65l-1.0,-0.32l-0.82,0.19ZM660.71,764.12l-0.82,0.74l-0.34,-0.91l3.33,-3.42l0.17,0.18l-2.21,2.27l-0.13,1.14Z", "name": "Palestine"}, "LB": {"path": "M678.06,734.32l-0.47,-0.12l-0.63,0.32l-0.7,2.08l-0.87,0.52l-3.29,-0.17l1.59,-4.04l1.15,-1.7l2.36,-5.69l1.35,-2.29l0.52,-3.34l2.01,-2.73l1.51,-0.81l0.87,-0.91l0.09,-1.12l3.5,-0.06l0.61,-0.64l0.8,0.21l0.33,0.34l-1.18,1.22l-0.06,0.59l2.41,1.18l1.0,2.95l-1.51,2.17l-1.39,0.72l-0.91,0.95l-0.26,1.22l0.47,0.44l-2.71,0.06l-1.67,1.32l-0.64,1.77l1.11,1.11l-3.13,2.9l-2.26,1.55Z", "name": "Lebanon"}, "PT": {"path": "M71.98,654.4l0.09,-1.29l-0.52,-1.53l1.89,-0.52l1.05,-0.88l0.66,-1.19l-0.29,-1.44l0.72,-1.29l1.9,-1.21l0.16,-0.48l-0.45,-0.25l-1.03,0.19l-1.32,0.85l-2.53,4.32l-2.69,0.63l-1.22,-0.39l0.0,-1.57l0.59,-1.74l0.23,-2.35l0.81,-2.1l-0.23,-1.47l1.55,-1.26l1.44,-1.93l4.2,-9.12l-0.16,-0.87l-0.43,-0.47l0.16,-1.05l1.33,-5.45l1.22,-2.51l0.34,-5.42l-1.08,-3.29l-0.9,-4.38l-0.06,-1.28l0.63,-0.63l-0.25,-0.68l-1.02,-0.09l-0.39,-0.67l0.1,-0.85l2.49,-2.69l1.85,-0.94l3.63,-1.08l0.35,0.03l0.97,1.43l-1.22,1.94l0.7,1.49l0.68,0.39l0.93,-0.07l2.17,-1.03l3.05,-0.14l2.39,0.83l1.68,0.04l2.73,-1.05l0.62,-1.3l1.57,0.47l2.23,0.09l0.56,-0.29l1.5,0.44l1.18,-0.08l0.55,0.78l-0.02,2.65l0.26,0.7l3.35,0.69l0.74,0.55l0.27,0.69l-2.34,2.38l-2.17,1.14l-1.76,1.49l-1.17,1.72l-1.44,0.74l-0.73,1.02l1.23,3.93l0.23,1.89l-0.45,3.45l0.51,1.45l-2.56,1.95l-0.37,0.82l0.17,0.84l1.64,1.7l-1.02,3.32l-0.78,1.27l-0.86,0.37l-4.58,0.03l-1.1,0.3l-0.24,0.59l1.23,2.0l1.47,1.18l0.41,1.95l1.8,3.22l1.87,0.6l0.43,0.57l-0.58,2.03l-3.13,2.98l-0.94,4.27l3.28,4.64l1.82,-0.01l-0.65,1.59l-2.2,0.65l-3.58,4.49l-0.83,2.41l1.24,5.96l-0.9,0.16l-4.52,2.48l-1.25,0.0l-2.72,-1.11l-6.18,-0.68l-2.07,0.72l-1.4,-0.02l-1.47,0.83l2.33,-5.97l-0.06,-2.49l0.35,-2.3l-0.42,-2.18l-0.72,-1.33l1.01,-3.51l-0.12,-1.82l-0.72,-1.81l2.2,0.27l0.41,-0.22l-0.07,-0.46l-0.89,-0.92l-1.23,-0.68l-1.65,0.12l-3.48,1.12Z", "name": "Portugal"}, "NO": {"path": "M573.49,36.56l0.23,0.63l1.36,0.34l2.9,-0.91l0.43,0.5l-0.87,2.14l-0.5,5.31l0.03,1.92l0.75,1.21l0.37,-0.28l1.53,-4.62l1.78,-1.58l0.63,-2.83l1.64,-3.36l1.81,-1.92l0.95,-0.48l3.48,0.08l1.42,0.68l1.33,1.62l1.13,0.75l3.31,0.75l1.46,1.45l1.05,0.06l2.14,-1.23l1.18,-0.17l1.99,1.69l-0.39,1.45l0.53,0.75l2.77,-0.09l2.23,0.54l4.3,2.88l0.39,1.18l-0.18,1.34l-6.18,1.79l-2.82,1.78l-4.43,0.67l-15.45,-1.18l-0.42,0.49l0.6,1.58l10.65,2.77l0.42,0.55l-0.32,1.58l0.21,2.35l1.07,1.15l1.47,0.42l2.6,-0.2l1.62,0.37l1.06,-0.94l0.31,-2.12l0.45,-0.29l1.13,0.5l0.61,2.27l0.6,0.49l0.57,-0.18l0.64,-1.48l4.64,0.21l0.66,2.85l-0.32,1.93l-1.14,0.59l-2.22,-0.09l-3.1,-1.22l-2.03,-1.16l-1.02,-0.06l-0.46,0.65l0.45,1.08l-0.11,0.76l-1.24,2.43l-1.17,0.9l-2.11,0.74l-6.0,1.48l-0.74,0.88l-1.91,4.08l-1.08,0.98l-1.79,0.57l-1.49,-1.93l0.15,-1.12l2.31,-2.53l2.9,-2.54l1.32,-1.95l0.02,-0.42l-2.6,-4.76l-10.05,-3.81l-4.85,-3.54l-2.11,-2.16l-2.31,-0.18l-2.22,0.59l-3.29,1.98l-2.88,1.25l-2.51,-0.53l-2.63,-0.12l-3.06,0.46l-3.08,3.3l-3.22,2.21l-0.89,1.04l-0.68,1.54l-1.51,5.33l-1.14,2.08l-0.26,1.33l0.26,3.65l-0.25,1.89l-2.12,2.22l-2.89,0.58l-1.58,1.03l-1.18,1.51l-1.11,2.83l-1.72,0.95l-1.64,-0.27l-1.4,-1.1l-5.0,-1.38l-4.51,-2.04l-2.06,-0.21l-2.25,2.22l-5.04,1.49l-2.23,0.14l-1.05,-0.74l-8.7,-1.08l-1.5,-3.08l-9.19,-9.86l-5.11,-0.19l-1.89,0.71l-1.2,1.0l-0.17,0.91l0.95,2.35l-0.45,0.51l-2.34,-0.67l-2.89,0.05l-0.9,0.78l-6.68,0.37l-0.25,0.69l2.87,2.75l0.13,1.02l-0.37,2.11l-1.02,1.82l-1.19,1.47l-2.36,1.5l0.06,0.71l3.05,1.26l-2.99,2.31l-12.22,-3.17l-3.87,-0.18l-5.24,-1.45l-1.26,0.17l-2.17,0.96l-0.21,1.5l0.39,6.17l-0.64,1.44l-2.6,3.63l-7.73,-3.12l-7.68,4.88l-2.93,6.45l-1.5,1.48l-3.44,1.03l-1.16,2.04l0.05,0.43l3.12,3.95l0.93,2.07l-0.36,2.0l-2.17,1.74l-9.2,9.62l-1.79,1.39l-0.15,0.39l0.78,3.91l-1.25,1.03l-4.42,1.85l-6.66,0.85l-0.35,0.48l1.23,7.35l-1.15,3.31l-0.93,7.52l-4.88,7.77l-6.28,7.97l0.14,0.61l5.64,2.51l0.87,4.14l-0.09,1.74l-0.99,1.59l-1.2,1.56l-10.1,-1.3l-3.0,0.54l-2.79,1.15l-1.82,1.33l-4.89,5.81l-1.7,1.6l0.35,2.43l-2.78,4.14l2.79,6.36l-1.39,1.81l0.42,4.15l-0.34,2.72l2.55,6.54l-0.15,2.34l-1.85,9.31l2.03,1.81l4.11,2.33l3.65,3.69l-0.64,2.39l-1.64,3.29l-4.51,0.59l-1.11,0.86l0.31,2.38l3.23,7.07l0.44,1.8l-0.97,2.96l-0.38,3.86l-2.5,2.68l-1.57,1.04l-2.33,0.41l-0.95,0.63l-1.43,3.46l-2.02,2.05l-0.04,1.14l1.5,5.21l-1.13,5.28l-0.85,1.67l-1.08,0.53l-0.66,-0.22l-1.62,-3.95l-7.03,-1.56l-2.45,-3.91l-0.13,-4.21l-0.52,-3.19l-0.31,-0.36l-0.44,0.18l-0.83,1.38l0.38,2.25l-2.28,1.54l0.12,1.28l0.55,0.47l-0.21,2.88l-3.21,5.06l-1.35,-0.24l-1.59,1.15l-1.18,0.14l-0.57,-1.24l-2.23,-1.81l-1.34,0.01l-0.24,0.69l1.66,1.78l-0.34,0.49l-4.56,2.17l-0.1,0.66l0.86,0.76l-0.63,0.74l-1.2,0.24l-0.9,1.31l-3.32,2.05l-5.47,5.28l-2.78,1.47l-1.92,1.51l-1.6,-0.04l-2.35,1.34l-5.41,1.13l-3.61,-0.51l-2.53,0.43l-1.12,-0.74l0.13,-0.98l-0.23,-0.57l-0.48,-0.15l-1.41,0.03l-0.43,0.44l-0.3,1.11l-1.64,-0.49l-0.19,-0.2l0.48,-0.73l1.12,-0.9l0.02,-0.61l-0.66,-0.86l-3.6,-0.1l-4.4,-2.05l-1.12,-1.16l-3.58,-1.77l-1.54,-1.81l-0.87,-1.97l0.49,-4.67l0.5,-0.49l3.01,0.98l3.54,1.8l0.77,-0.24l0.99,-1.32l1.94,-1.08l-0.0,-0.7l-0.92,-0.33l-2.81,1.2l-2.48,-1.9l0.0,-0.39l0.79,-0.82l0.27,-1.01l-0.4,-1.11l0.16,-1.06l4.65,-4.0l1.44,-0.81l0.15,-0.54l-0.62,-0.47l-1.77,0.56l-5.82,3.61l-3.77,1.24l-1.46,1.82l-1.26,0.66l-2.2,0.07l-0.41,-0.92l0.7,-4.4l0.75,-2.16l0.74,-1.38l1.38,-0.37l0.81,-1.01l3.79,1.04l1.57,-1.49l1.65,-0.23l3.05,-1.49l0.15,-0.72l-0.45,-0.3l-5.04,0.73l-0.67,-0.19l-0.29,-0.73l4.43,-4.24l0.62,-1.06l0.38,-2.02l2.7,-2.32l1.96,-0.95l0.44,0.56l-0.61,2.89l0.01,1.23l0.32,0.39l0.45,-0.24l1.79,-4.3l0.74,-0.96l0.8,-0.64l2.32,-0.59l0.68,-1.13l-0.39,-0.22l-2.63,0.24l-6.22,1.66l-2.71,1.52l-3.49,4.08l-0.42,1.66l-0.85,0.74l-1.49,0.42l-1.92,2.07l-0.86,1.66l-3.07,2.3l-1.17,1.31l-0.32,-1.44l0.18,-1.93l0.87,-1.4l0.48,-1.54l-0.55,-1.46l0.22,-0.45l2.08,0.41l1.6,-0.06l2.76,-1.1l0.18,-0.59l-0.72,-0.8l-3.18,-0.01l-1.6,-0.94l-1.29,-1.95l-0.58,-2.58l0.3,-0.56l5.02,-2.79l1.46,-1.35l-0.21,-0.69l-1.12,-0.04l-1.87,1.53l-2.48,0.88l-1.51,-1.18l-0.82,-1.33l-0.5,-2.96l-0.01,-3.46l0.81,-0.47l2.51,0.46l3.0,-0.18l6.46,-1.25l4.1,0.74l1.78,-0.06l2.67,-1.09l2.1,-0.1l1.55,0.75l0.78,0.8l0.21,1.37l0.79,0.85l0.48,0.08l0.53,-0.27l0.19,-0.51l-0.46,-2.11l6.52,-1.69l0.96,-0.77l-0.22,-0.7l-2.49,-0.22l-0.59,-1.22l1.35,-2.63l-0.13,-0.32l-0.63,-0.15l-1.62,1.45l-0.74,1.82l0.08,1.93l-1.15,0.26l-3.02,0.11l-3.76,-0.92l-0.35,-0.26l0.16,-0.78l-0.54,-0.64l-0.52,0.09l-0.77,0.93l-0.68,1.78l-1.19,0.34l-4.08,-0.68l-5.9,0.41l-2.67,0.93l-1.54,-0.11l-2.81,-1.56l-1.03,-1.16l-0.28,-3.27l3.3,-0.44l1.09,-0.62l-0.04,-0.72l-2.18,-1.12l-0.87,-1.5l-1.48,-0.65l-0.8,-1.17l-0.22,-1.9l0.22,-1.2l0.46,-0.29l1.72,0.29l4.64,-0.24l7.53,2.27l6.21,-0.44l3.57,-1.3l0.06,-0.73l-0.92,-0.4l-3.84,0.74l-3.5,-0.03l-8.88,-1.94l-2.82,0.2l-1.23,-0.38l-0.69,-1.18l0.55,-2.44l0.89,-0.4l0.78,0.65l1.21,-0.11l1.76,-1.91l0.61,-1.38l2.32,-1.32l2.49,-0.75l0.72,0.14l1.38,1.17l2.02,-0.0l5.02,-1.15l1.71,-1.38l0.08,-0.46l-0.41,-0.22l-7.18,1.24l-0.09,-0.31l1.54,-1.49l0.43,-1.2l0.85,-0.45l5.23,-0.56l2.87,0.23l4.3,0.51l2.76,1.23l1.27,-0.08l1.19,-0.35l0.66,-0.54l-0.17,-0.69l-1.95,-0.46l0.08,-0.64l3.39,-0.97l3.89,-0.23l0.29,-0.65l-1.04,-0.98l-8.52,1.24l-2.15,-0.82l-1.92,-0.02l-1.28,0.5l-3.31,0.42l0.48,-1.1l2.15,-2.94l0.74,-0.46l5.09,-1.38l2.52,-1.63l3.75,-0.26l3.03,0.43l1.55,2.02l5.54,3.15l0.45,-0.02l-0.16,-1.34l-3.66,-3.43l-1.38,-0.85l-0.91,-1.47l0.29,-1.31l0.99,-0.9l4.06,-0.56l0.95,-0.71l0.22,-1.34l-0.74,-1.02l-2.78,-0.45l-0.24,-0.78l0.35,-0.54l2.29,-1.35l3.42,-0.91l3.71,1.05l-0.85,1.41l0.03,1.1l0.36,0.34l0.97,0.09l2.49,-2.4l2.53,-0.31l2.19,-0.78l1.71,2.01l1.34,0.96l0.53,1.62l0.88,0.37l1.1,-0.94l3.29,-0.73l3.34,0.47l2.32,-0.3l0.39,-0.56l-1.05,-1.98l0.54,-1.1l2.88,-1.45l2.34,-0.5l3.37,-1.81l0.2,-0.52l-0.89,-1.59l-1.46,-0.23l3.34,-1.94l0.12,-0.61l-0.57,-0.59l-1.9,-0.53l-3.19,1.33l-2.22,1.47l0.02,0.68l1.46,1.29l-1.22,1.3l-7.97,4.23l-3.73,1.21l-1.44,-0.16l-2.05,-3.62l-0.37,-0.22l-2.26,0.2l0.56,-1.66l1.16,-1.39l2.18,-1.22l1.06,-1.46l0.91,-2.09l3.04,-2.09l4.4,-5.12l3.55,-1.62l1.42,-1.85l2.13,-0.82l1.74,-1.35l1.46,-0.17l2.6,-1.28l1.59,-1.6l-0.25,-0.68l-0.96,-0.1l-3.19,1.24l0.62,-2.52l1.77,-1.44l8.8,-4.34l2.08,1.97l2.73,-0.3l3.32,-2.62l2.45,-2.81l0.03,-0.49l-0.47,-0.15l-1.3,0.48l-4.17,2.69l-1.12,0.22l-0.44,-0.12l-0.57,-1.09l-0.96,-0.34l-0.9,0.17l-0.6,-0.5l-0.14,-1.58l1.98,-4.42l4.74,-5.22l0.87,-2.16l1.5,-0.98l2.11,0.24l0.9,-0.36l0.18,-0.55l-0.77,-1.41l-2.48,-1.33l7.73,-1.75l3.84,0.06l1.35,-0.96l2.16,-0.63l1.6,-1.13l-0.02,-0.67l-1.13,-0.54l-6.35,1.51l-4.77,0.46l-0.62,-4.08l0.41,-2.05l0.83,0.04l0.41,-0.35l0.25,-2.21l1.17,-1.19l1.89,-0.34l2.23,-1.72l2.18,0.26l2.32,-0.27l0.24,-0.68l-0.57,-0.57l-2.9,-0.79l-0.45,-0.79l1.7,-0.95l1.18,-0.24l2.91,-3.35l1.39,0.1l1.69,-1.01l1.64,0.34l4.22,-1.18l8.63,-0.18l0.38,-0.3l0.26,-1.01l-0.34,-0.5l-8.3,-0.5l-4.76,0.14l4.07,-4.73l2.62,-1.62l1.91,0.39l2.4,1.68l1.53,0.19l0.6,0.42l1.44,2.4l0.56,0.07l0.45,-0.44l-0.23,-2.01l1.45,-1.65l0.01,-0.52l-0.82,-0.62l-2.23,0.61l-1.61,-0.6l-1.29,-1.22l-0.31,-0.94l1.51,-1.57l0.08,-0.57l-0.57,-0.71l-0.5,-0.1l-3.5,1.88l-2.87,0.28l0.41,-1.34l-0.24,-1.37l3.16,-3.18l0.98,-0.33l1.73,0.25l1.88,0.97l3.07,-0.68l0.26,-0.47l-0.56,-1.23l-3.24,-0.35l-0.56,-0.49l0.13,-0.32l2.22,-0.77l2.23,-1.39l2.55,-0.4l2.04,-1.02l0.41,0.39l0.79,4.04l1.89,3.27l0.98,0.31l0.45,-0.5l-0.67,-2.58l1.33,-1.18l0.41,-0.88l-0.28,-0.53l-0.85,-0.2l-0.68,-0.84l-1.07,-2.97l0.28,-0.58l2.32,-1.59l2.93,-0.37l3.24,1.16l1.3,0.04l8.5,-1.9l0.25,-0.5l-0.23,-0.56l-2.0,-0.82l-3.16,0.52l-8.2,-0.17l-0.57,-0.4l-0.1,-0.67l0.77,-1.23l0.88,-0.7l3.04,-1.35l3.47,-0.26l3.51,-2.5l1.5,-2.1l0.74,-2.8l1.99,-2.19l5.53,-1.56l0.2,-0.9l-0.53,-1.14l0.04,-2.01l1.39,-2.43l0.86,-0.78l1.14,0.66l1.52,1.87l2.2,1.03l3.03,0.21l1.01,-0.57l-0.05,-0.7l-2.2,-1.0l-1.53,-1.2l-0.1,-0.97l0.53,-0.47l2.72,-0.08l1.64,-0.96l0.77,-2.49l2.01,-1.96l6.28,-1.3l0.22,0.25l-0.34,3.85l-0.77,2.7l0.02,1.91l0.29,0.38l0.45,-0.16l1.34,-2.01l1.72,-5.21l1.25,-2.38l1.35,-1.31l3.09,-1.38l0.59,1.44l-0.72,4.5l0.06,1.44l-0.77,1.81l-3.13,4.27l0.08,0.89l0.5,0.28l2.12,-1.02l3.77,-3.95l3.21,0.49l0.46,-0.35l-0.06,-0.66l-2.38,-2.31l-0.35,-1.25l0.17,-3.65l0.84,-1.24l4.4,-0.04l0.96,0.67l1.77,-0.05l0.35,-0.24l1.13,-2.54l2.02,-0.2l2.09,1.76l2.52,1.2l2.02,1.72l0.51,0.0l0.58,-0.48l0.13,-0.41l-1.11,-4.1l-1.29,-1.64l-2.78,-0.89l-2.71,-1.79l-0.53,-0.8l2.14,-0.51l3.45,0.62l2.73,-1.45l0.93,0.35l2.03,-0.73l1.6,1.01l1.09,-0.57l0.42,-1.25l3.23,-0.82l2.09,0.77l1.06,0.76l1.38,4.79l1.87,1.95l1.31,0.98l1.7,0.08l0.63,-0.88l-0.06,-0.53l-1.13,-0.99l-0.26,-0.79l0.54,-2.3l0.62,-0.88l3.75,-3.65l3.07,-1.86l2.1,-0.31l3.32,-4.3l0.84,-0.7l0.77,-0.16l0.31,-0.47l-0.22,-1.06l-1.84,-0.88l-0.04,-0.83l2.27,-1.52l2.83,-2.62l1.15,-0.15l0.87,0.7l2.8,1.2l3.02,2.1l1.09,-0.1l1.51,-1.52l1.59,0.24l2.47,1.05l0.09,0.44l-1.4,0.88l-5.33,5.54l-0.92,1.61l-0.87,4.06l-2.09,2.72l-0.04,2.12l1.23,0.95l2.42,-0.75l2.8,-2.41l0.8,-2.65l6.93,-6.89l3.29,-3.86l3.65,-3.13l1.68,-0.53l0.77,1.67l-0.73,2.54l-1.53,1.7l0.07,0.6l0.97,0.67l-0.8,4.28l0.01,1.07l0.5,0.38l5.55,-2.51l2.3,-4.32l0.49,-1.51l1.5,-1.29l3.06,-0.01l0.39,-0.32l-0.08,-1.01l-3.76,-1.98l-0.27,-0.54l4.5,-3.23l1.64,0.23l1.18,0.54l4.35,0.4l3.09,1.53l-0.11,2.24l-0.66,0.96l-0.66,0.6l-4.29,1.95l-0.87,1.1ZM601.48,57.86l-2.18,0.6l-0.05,-0.09l1.05,-2.35l0.65,0.05l1.43,1.11l-0.91,0.68ZM539.33,27.69l3.23,-1.92l3.47,0.91l1.18,-0.0l1.68,1.65l0.73,0.05l-0.05,0.28l-1.54,0.43l-3.25,0.51l-2.14,-0.15l-1.48,-1.46l-1.84,-0.29ZM520.99,39.19l-2.24,0.85l-1.26,-0.71l-0.51,-0.7l-0.08,-1.73l0.28,-0.94l0.86,-0.43l3.58,2.06l-0.64,1.59ZM515.47,40.07l0.31,1.82l-1.1,1.19l-2.86,1.76l-0.12,0.61l-0.64,0.29l-1.35,0.3l-0.41,-0.17l0.09,-1.24l-0.29,-0.67l-0.54,-0.17l-0.94,0.5l-0.81,-0.53l0.24,-1.01l0.99,-0.93l1.65,-0.64l1.41,0.18l3.73,-2.53l0.64,1.24ZM513.02,33.5l-0.57,1.15l-4.22,3.84l-1.78,0.48l-1.29,0.76l-2.23,-0.41l-1.54,1.06l-2.44,0.03l-2.47,-1.11l-1.75,-1.58l2.44,-0.24l1.5,0.21l1.19,-1.09l1.93,0.11l3.79,-0.75l1.69,0.33l3.14,-2.47l1.07,0.02l1.3,-0.61l0.25,0.27ZM477.1,50.92l-1.42,0.59l-1.43,-0.54l-0.88,0.07l-0.57,-0.73l0.06,-0.57l0.93,-1.0l2.0,-0.61l1.58,0.25l-0.3,2.55ZM463.46,48.32l0.85,0.4l1.16,0.04l1.08,1.21l1.15,0.66l-0.82,0.46l-2.67,-0.01l-0.82,-1.9l-1.32,-1.36l-0.11,-0.62l0.52,-0.08l0.99,1.21ZM456.44,51.72l1.3,1.58l1.41,0.0l0.97,-0.71l1.04,0.5l-0.13,0.73l-1.99,1.49l-1.37,2.0l-1.61,0.43l-1.14,-0.16l-1.7,1.26l-2.75,2.91l-0.29,1.36l-6.6,1.0l-1.74,-0.48l-0.67,-0.77l1.81,-0.35l0.35,-0.37l0.05,-0.86l1.11,-0.95l0.4,-1.1l0.49,-0.21l1.67,0.18l1.11,-0.91l0.51,0.57l0.68,-0.15l0.32,-1.04l-0.18,-1.5l1.77,-1.59l0.83,-1.23l0.97,-0.66l0.97,0.11l0.43,-0.29l0.32,-1.16l-0.2,-1.94l0.85,-1.63l0.54,-0.04l0.39,1.32l0.08,2.67ZM433.26,63.69l1.23,1.04l2.36,-0.47l1.73,1.23l1.08,0.15l0.79,2.14l-0.59,0.87l-1.19,0.73l-0.29,1.47l0.32,1.44l-4.58,0.77l-0.96,-0.77l-0.48,-0.01l-2.22,1.59l-2.19,2.44l-0.49,0.13l-0.3,-0.65l-1.58,-0.54l-1.71,-0.05l2.12,-1.1l0.35,-1.25l-0.29,-2.32l0.35,-1.67l0.84,-0.67l3.6,0.4l0.4,-0.21l0.46,-0.84l-0.28,-0.91l-1.76,-0.93l1.26,-0.6l1.26,-0.07l0.78,-1.35ZM409.16,87.51l0.26,0.57l0.6,-0.03l1.77,-2.18l1.94,-0.67l1.19,-1.96l-0.08,-1.16l0.29,-0.74l1.54,-0.57l0.51,-0.13l1.1,0.69l1.51,2.7l-0.32,1.67l-2.27,1.42l-2.04,0.75l-1.97,1.76l-0.98,1.4l-0.62,0.23l-0.99,-0.45l-1.0,-0.0l-1.32,1.29l-3.11,0.95l-0.9,-0.2l-0.04,-0.93l-0.45,-0.38l-0.78,0.1l-1.43,1.55l-1.75,0.57l-1.75,-0.48l-3.96,2.48l-3.62,0.45l-0.87,-0.2l-0.0,-1.04l4.2,-3.16l6.8,-0.95l4.51,-4.2l1.14,-4.6l0.98,-1.56l-0.46,-1.31l-1.13,-0.33l-0.05,-0.99l0.54,-1.38l3.48,-3.0l1.99,-2.5l0.83,-0.48l0.9,0.0l0.78,0.48l-0.15,1.02l-1.57,2.35l-2.54,2.45l0.3,1.51l0.98,1.32l0.28,3.87l-1.78,2.63l-0.46,1.42ZM401.69,78.79l2.5,3.66l-0.58,2.33l-1.51,1.16l-4.23,0.12l-0.93,-0.5l-0.38,-0.83l-0.67,-0.21l-2.01,0.91l-1.05,0.11l-1.32,-0.6l-0.27,-0.72l2.17,-2.25l1.51,0.08l1.57,0.56l0.44,-0.22l0.64,-1.34l0.13,-1.3l1.98,0.41l0.48,-0.39l0.0,-2.19l0.63,-0.04l0.9,1.25ZM383.86,94.95l0.96,0.42l1.95,-0.11l-0.83,0.76l-1.83,0.42l-1.5,1.47l-2.62,0.27l-1.11,0.86l-0.71,-0.54l-0.6,0.13l-0.44,1.35l-1.52,0.4l-0.29,-1.54l1.17,-1.47l1.82,-0.2l1.4,-1.89l1.85,-0.52l2.31,0.17ZM371.55,103.36l-1.03,0.63l1.42,-3.35l1.2,-1.04l0.24,0.17l-0.26,1.89l-1.56,1.71ZM365.44,148.17l-0.58,0.03l0.0,-0.35l1.33,-1.13l2.37,-0.19l-3.13,1.64ZM364.25,145.01l-0.66,0.08l1.06,-1.26l0.59,-1.35l0.56,-0.36l0.86,0.5l0.02,0.91l-0.5,0.9l-1.93,0.58ZM357.88,154.45l-0.68,0.52l-1.31,-0.35l0.37,-0.9l0.78,-0.38l1.19,0.26l-0.35,0.85ZM347.88,171.29l-0.44,0.38l-1.53,-0.44l-3.0,0.36l-0.68,-0.32l0.6,-0.69l2.64,-1.15l1.27,0.05l1.27,1.24l-0.12,0.57ZM310.84,197.12l-1.51,0.0l4.87,-1.52l0.48,-0.61l0.38,0.44l-0.14,0.94l-4.1,0.75ZM305.71,204.17l-2.55,-0.29l-0.83,-0.71l3.05,-1.01l0.58,0.58l0.05,1.08l-0.3,0.35ZM263.6,265.19l1.08,2.54l0.03,1.89l-0.59,-0.09l-0.56,-1.19l-0.17,-2.74l0.21,-0.42ZM263.0,251.46l-1.35,0.07l0.25,-1.42l0.69,-0.25l0.54,0.73l-0.13,0.87ZM74.93,32.44l-1.19,-0.01l1.39,-1.15l5.96,-2.81l2.44,-2.71l4.11,-0.83l0.21,1.04l-0.26,1.57l-3.82,1.4l-4.48,1.0l-4.35,2.5Z", "name": "Norway"}, "TR": {"path": "M563.04,666.92l2.05,-0.84l0.41,-2.6l-0.3,-1.51l-0.34,-0.32l-3.8,-1.3l-0.85,0.07l-0.95,-1.23l-1.69,-0.94l-1.65,0.68l-3.36,-1.66l0.47,-0.97l0.73,0.03l0.41,-0.34l0.16,-1.36l-0.74,-1.82l0.05,-0.62l0.5,-0.16l0.74,0.14l0.84,0.97l0.27,0.93l-0.14,1.26l1.21,1.44l0.59,-0.24l0.28,-0.94l0.56,0.4l1.4,0.24l3.21,-0.67l0.81,-0.67l0.1,-0.44l-0.38,-0.25l-2.23,0.06l-0.7,-0.43l-0.87,-1.11l-0.88,-2.11l1.82,-0.87l1.41,-1.76l-0.05,-0.55l-0.59,-0.51l-0.8,-0.31l-0.76,0.12l-0.42,-0.36l-0.06,-0.51l0.54,-0.78l-0.03,-1.21l-2.15,-2.63l2.91,-3.24l-0.08,-0.89l-1.42,-0.49l-4.64,0.67l-1.83,0.58l-2.84,0.23l-0.12,-0.46l0.79,-2.13l-0.07,-3.39l0.36,-1.6l1.76,-0.62l2.17,-2.73l3.41,-3.12l3.55,0.06l1.61,-0.9l1.87,-0.04l0.7,1.23l1.93,0.9l3.6,-0.11l1.82,-0.91l0.07,-0.62l-1.28,-1.3l1.32,-0.12l1.19,0.29l-0.77,1.24l0.21,0.57l0.46,0.17l4.56,-0.5l4.58,0.42l5.14,-0.21l0.91,-0.65l-0.05,-0.64l-3.12,-1.42l1.75,-1.18l11.88,-1.7l0.41,-0.69l-0.39,-0.46l-6.45,-0.78l-1.33,-0.57l-2.67,-2.32l0.59,-2.43l0.54,-0.53l2.17,-0.1l8.04,1.23l5.79,-0.73l6.35,1.8l6.02,-0.37l1.56,-1.01l1.45,-2.51l8.4,-4.3l2.99,-2.28l3.11,-1.22l5.45,-1.38l4.59,-1.83l1.22,-0.2l10.94,0.87l7.57,0.11l3.51,-1.7l1.47,0.42l-0.45,0.92l0.19,1.27l2.54,2.76l3.78,1.55l4.81,-1.27l1.47,0.41l1.73,4.1l1.44,1.54l1.72,0.99l1.56,0.25l2.03,-1.46l1.58,-0.16l2.7,1.33l1.19,1.54l4.94,1.13l4.48,0.56l2.02,1.25l6.48,1.25l2.47,-0.21l3.97,-1.3l7.63,-1.4l5.13,1.98l1.4,0.26l1.24,-0.16l1.83,0.54l1.85,-0.29l5.8,-2.38l1.8,-1.33l1.9,-0.36l1.68,-0.8l4.51,-2.64l1.22,-1.39l4.03,1.3l1.6,-1.01l3.68,0.14l3.44,0.76l0.89,-0.58l1.21,-1.67l1.74,-0.0l0.9,1.39l1.08,0.39l3.21,2.53l-0.05,0.97l0.83,0.78l2.28,0.25l0.71,0.38l0.35,1.5l2.34,2.13l1.17,3.19l-0.11,1.0l-1.85,2.5l-0.06,0.46l0.57,1.28l-0.05,0.73l1.25,2.72l-0.45,0.57l0.15,0.56l1.75,0.92l2.96,0.92l3.83,-0.41l1.36,0.65l2.13,1.69l2.49,2.48l-1.62,-1.2l-0.45,-0.02l-1.05,0.68l-0.82,1.03l-0.94,3.88l-0.48,0.27l-3.91,0.06l-0.59,0.77l0.85,2.67l1.24,1.1l-0.44,2.31l0.36,0.95l1.32,1.59l-0.18,1.92l0.55,2.32l0.02,2.75l0.46,0.44l1.56,0.41l-0.92,1.08l-0.65,2.14l-1.38,2.27l-0.25,1.23l0.5,0.7l1.41,0.12l3.09,2.14l-0.51,0.83l0.43,1.54l-0.04,1.93l3.0,2.45l-0.46,1.36l-1.89,-0.12l-4.32,3.01l-0.56,-0.78l-0.15,-3.14l-1.33,-1.08l-1.46,-0.19l-2.49,1.4l-2.06,-0.05l-2.08,-0.26l-5.73,-1.92l-2.24,0.64l-2.29,-0.7l-0.63,0.28l-1.4,1.72l-2.33,1.8l-0.87,0.21l-0.51,-1.54l-0.67,-0.86l-1.31,-0.45l-2.03,1.45l-7.22,1.78l-3.32,0.3l-4.16,-0.62l-3.47,0.18l-9.43,4.25l-4.42,1.35l-4.4,0.87l-7.89,-0.18l-0.92,-0.3l-3.38,-2.31l-3.5,-0.63l-10.34,4.01l-4.81,-0.15l-1.71,-1.63l-3.89,-0.69l-0.82,0.65l-1.25,5.04l1.38,3.17l-1.94,0.18l-1.49,0.83l-0.49,2.61l-1.87,1.01l-0.67,1.53l-2.54,-1.23l0.53,-1.07l-1.9,-4.64l0.83,-1.27l4.23,-4.18l-0.21,-2.57l-1.83,-1.66l-2.38,0.94l-1.39,1.07l-1.93,0.86l-0.59,1.19l-1.03,0.75l-1.76,0.31l-2.82,-0.89l-5.01,-2.57l-1.67,-0.26l-1.47,0.55l-4.08,2.8l-4.65,4.78l-3.45,1.72l-2.21,0.56l-1.14,-0.13l-6.89,0.88l-1.84,0.9l-3.33,-0.94l-2.02,-1.23l-3.27,-4.03l-1.52,-1.39l-3.41,-1.27l-5.74,-2.91l-9.74,-1.05l-1.26,1.43l-0.31,4.12l-0.66,1.08l-0.34,2.22l-0.38,0.48l-0.53,0.27l-2.28,-0.9l-1.99,0.89l-5.15,1.4l-4.48,-1.54l-1.61,-0.97l-0.97,-1.0l-0.34,-1.79l-0.69,-1.15l-0.37,-1.58l-1.17,-0.6l-1.25,0.62l-0.89,-0.02l-4.39,-1.95l-2.59,-0.17l-1.75,2.04l-1.0,0.54l-0.76,0.11l0.84,-1.12l-0.34,-0.64l-3.79,0.23l-2.05,0.95l-2.04,-0.37l1.87,-0.57l4.05,-0.35l1.06,-0.38l1.19,-1.45l1.85,-1.15l0.39,-0.68l-0.36,-0.57l-7.77,0.34l-4.3,-0.19l-0.83,0.62l-0.11,-1.01l0.43,-0.47l0.87,0.04l2.26,-0.65l0.29,-0.44l-0.2,-1.33l-2.3,-1.77l-1.08,-0.11l-0.72,-0.48l-0.21,-1.52l-0.76,-1.75l-0.99,-0.84ZM566.29,597.74l2.42,1.76l1.97,-0.61l1.78,0.08l1.08,-0.48l1.36,0.21l-0.26,1.68l0.89,2.12l2.0,2.83l2.18,1.56l8.13,3.52l1.17,0.24l-0.7,2.23l-0.43,0.68l-2.13,0.49l-8.2,-1.7l-1.39,0.36l-2.05,1.08l-2.41,-0.34l-3.36,0.65l-1.2,2.31l-2.24,2.35l-6.6,3.07l-4.12,3.79l-1.85,2.19l-0.86,0.44l0.53,-1.21l-0.05,-1.78l2.42,-1.92l3.65,-1.57l1.14,-1.45l-0.33,-0.64l-9.04,0.23l-0.6,-1.27l0.72,-0.29l3.05,-3.37l0.35,-0.85l-0.35,-1.64l0.02,-2.02l2.54,-1.54l0.82,-0.16l0.6,-1.01l-0.57,-3.48l-2.46,-1.76l-1.08,-0.32l0.07,-0.39l2.46,-0.84l1.18,-2.08l3.64,-0.45l1.8,-1.09l2.99,-0.52l1.32,0.97ZM547.36,627.54l-2.69,0.43l-0.35,-0.18l0.51,-0.51l2.02,-0.59l0.51,0.85Z", "name": "Turkey"}, "LI": {"path": "M324.98,513.14l0.02,-1.41l0.15,-0.43l0.74,1.46l-0.19,0.45l-0.72,-0.06Z", "name": "Liechtenstein"}, "LV": {"path": "M538.64,313.27l3.54,1.99l1.98,0.57l1.08,0.9l2.52,0.56l0.49,0.96l3.61,3.59l2.41,1.22l1.17,0.26l5.64,-1.51l2.97,1.35l4.18,0.48l0.5,1.59l3.77,2.5l0.01,1.64l-0.89,1.1l-0.61,1.56l-0.11,1.54l-0.95,2.5l0.51,0.58l2.08,-0.43l0.37,0.17l0.31,0.4l0.24,1.72l1.27,1.73l0.34,1.03l1.17,0.94l1.3,5.23l-0.59,1.84l-1.51,0.28l-1.91,1.14l-3.42,3.12l-0.81,2.05l-7.02,-0.58l-1.55,0.46l-1.71,1.9l-2.95,0.71l-2.36,-0.64l-1.52,-0.83l-2.67,-2.79l-5.79,-4.01l-1.15,-0.51l-6.81,-1.3l-1.59,-2.23l-0.53,-1.35l-1.1,-0.49l-2.14,0.57l-3.01,1.85l-4.66,0.37l-4.19,-1.24l-8.33,-0.72l-1.96,0.8l-1.07,-1.05l-1.25,-0.31l-1.54,0.36l-2.45,0.04l-6.9,-0.6l-5.94,1.81l-7.71,4.36l-0.35,-2.96l0.22,-7.19l0.51,-3.43l2.4,-2.01l1.32,-1.7l0.8,-2.31l0.72,-3.66l3.51,-4.66l2.8,-0.51l7.96,-2.38l1.22,2.37l6.51,5.2l2.2,4.67l4.88,2.3l4.08,-0.69l4.89,-3.23l1.54,-1.77l0.28,-1.57l-0.54,-6.24l-0.82,-2.71l0.2,-1.21l10.29,-3.78l1.63,1.26l0.73,-0.15l0.24,-0.8Z", "name": "Latvia"}, "EE": {"path": "M525.88,315.96l1.81,-4.11l0.33,-3.0l0.83,-0.92l-0.26,-1.25l-2.11,-0.9l-0.93,0.07l-1.54,1.85l-1.37,0.39l-1.33,-0.75l-3.15,-1.02l-0.72,-1.22l-0.33,-1.61l-1.67,-1.33l-0.63,-1.42l0.21,-0.83l1.41,-0.67l0.61,-0.79l-0.35,-0.63l-2.02,0.06l-0.86,-2.22l1.01,-1.49l-0.57,-0.94l0.62,-1.45l-0.25,-1.46l3.53,-1.43l4.02,-0.33l0.36,-0.5l-0.28,-1.13l1.37,-0.12l2.65,-1.85l2.77,0.3l3.92,-1.31l7.6,0.02l1.28,-0.85l-0.01,-1.45l3.44,0.02l8.98,1.61l2.19,0.01l2.98,1.6l1.75,0.46l4.97,0.02l7.52,0.73l1.76,-1.19l1.19,1.24l0.06,0.34l-0.8,0.25l-0.7,0.83l-0.88,0.08l-0.74,0.46l-2.01,4.62l-1.0,1.16l-1.85,-0.45l-3.14,0.26l-2.71,0.88l-1.96,1.68l-0.01,1.85l2.52,3.06l1.06,3.79l1.27,1.16l1.32,1.87l0.64,1.7l2.35,4.14l0.34,1.32l1.4,1.23l-3.14,1.13l-0.66,1.41l-1.28,1.23l-0.65,2.48l-1.76,-0.23l-3.09,-1.39l-1.03,0.03l-4.84,1.48l-0.81,-0.22l-2.12,-1.05l-3.52,-3.5l-0.79,-1.2l-2.57,-0.57l-0.91,-0.82l-2.12,-0.63l-3.1,-1.88l-0.9,-0.23l-0.43,0.19l-0.22,0.83l-1.91,-1.28l-2.69,1.15l-6.12,1.9l-1.25,0.77ZM511.87,302.56l-0.76,0.14l-2.16,-1.14l0.85,-0.75l1.88,0.49l0.18,1.27ZM492.62,308.14l1.2,-0.99l0.33,-0.87l-1.39,-2.14l1.13,-0.04l1.0,0.59l1.86,-0.79l0.72,0.23l0.47,-0.18l0.75,-1.29l2.76,-0.86l1.92,0.58l1.76,-0.47l1.78,0.29l4.31,2.35l-2.28,0.37l-1.11,1.14l-0.83,0.23l-3.35,2.53l-2.9,-0.1l-1.98,0.46l-1.39,1.11l-0.69,2.29l-0.93,1.53l-0.87,0.51l-0.69,0.06l-0.04,-0.64l2.7,-3.11l-0.23,-0.59l-1.05,-0.32l-2.98,-1.88ZM506.44,297.03l-1.11,0.89l-0.64,-0.61l-0.66,0.02l-1.35,2.08l-1.32,0.31l-0.56,-0.26l0.03,-0.74l-1.12,-2.38l-1.4,-0.64l-2.38,-0.32l4.36,-0.48l1.83,-2.15l0.62,-0.09l0.4,0.14l0.6,1.28l2.33,0.44l0.83,1.22l0.26,1.2l-0.72,0.09Z", "name": "Estonia"}, "LT": {"path": "M483.98,366.01l-0.39,-1.12l0.47,-2.2l-2.37,-6.77l-0.19,-4.6l7.93,-4.5l5.72,-1.74l6.78,0.6l2.52,-0.04l1.38,-0.35l1.04,0.25l1.27,1.12l1.22,-0.19l0.91,-0.62l8.18,0.71l4.27,1.25l4.85,-0.4l3.11,-1.88l1.75,-0.52l0.53,0.16l0.53,1.3l1.94,2.55l6.95,1.34l0.97,0.45l5.66,3.93l2.72,2.83l1.69,0.92l2.31,0.65l-0.33,1.84l-1.47,3.86l0.12,0.41l0.74,0.56l3.28,0.4l-1.47,1.08l-0.6,1.26l-4.12,-0.12l-0.74,0.49l-0.95,2.15l-0.97,0.67l-1.72,0.29l-1.62,0.68l-1.1,1.7l-0.79,2.16l0.04,2.82l-1.38,1.93l-1.03,2.49l0.51,0.92l1.76,0.29l0.47,0.48l0.08,1.37l-2.02,0.25l-0.64,-0.28l0.32,-0.84l-0.29,-0.93l-0.72,-0.7l-0.47,-0.03l-1.13,0.71l-1.24,0.04l-1.41,0.69l-0.99,1.14l-0.7,0.32l-2.57,-0.13l-0.73,0.71l-0.6,2.36l-1.95,-0.05l-3.91,1.55l-1.77,-1.04l-4.3,0.27l-1.89,0.43l-3.0,-0.41l0.02,-2.29l-0.39,-1.31l-1.24,-1.23l-2.8,-1.57l-1.61,-0.43l-0.45,-0.8l-1.71,-0.82l-1.06,-0.13l-0.74,0.5l-0.85,-1.98l0.06,-1.18l1.96,-5.07l-0.06,-0.83l-1.32,-1.32l-1.44,-0.78l-1.1,-1.77l-6.64,-0.08l-2.62,-0.68l-4.29,-1.77l-2.12,-1.43l-2.02,0.1Z", "name": "Lithuania"}, "LU": {"path": "M278.58,460.49l-0.02,1.53l0.46,1.19l0.9,1.04l1.7,1.44l2.06,0.7l-0.04,1.05l-1.43,1.94l-0.47,2.13l-1.8,-0.59l-2.33,0.93l-2.45,-1.15l1.0,-2.16l-2.03,-2.82l0.23,-1.64l1.61,-2.81l1.29,-1.3l1.16,0.19l0.17,0.33Z", "name": "Luxembourg"}, "AT": {"path": "M326.56,513.24l0.13,-0.58l-1.06,-2.67l1.05,-2.02l0.09,-1.66l1.32,-0.27l0.2,-0.84l3.49,1.6l0.5,1.42l1.54,0.43l-0.16,1.16l0.45,0.42l1.89,-0.63l0.89,-1.0l0.56,-1.07l0.32,-1.89l2.67,-0.0l2.55,0.45l1.56,1.96l1.22,0.23l3.45,-0.54l1.49,-1.13l4.19,-1.59l6.31,-0.62l0.56,-0.68l-0.02,-0.91l1.71,0.39l1.72,0.89l2.71,-0.54l0.93,0.41l0.03,1.0l0.54,0.69l2.21,1.17l0.81,-0.01l0.6,-0.84l0.29,-2.74l-0.54,-1.0l-1.44,-0.25l0.66,-1.24l-0.01,-1.43l-2.62,-3.33l0.61,-1.03l3.5,-1.9l3.24,-0.97l0.81,-0.58l0.62,-0.8l0.73,-2.89l2.33,0.93l1.08,-0.42l0.94,-0.96l0.25,-2.75l1.81,1.07l1.04,1.68l1.98,0.43l2.41,0.04l1.64,-0.85l2.7,0.44l0.45,-0.33l0.19,-1.16l1.34,-1.54l1.19,0.04l0.39,-0.27l0.74,-3.73l0.73,0.04l1.42,0.9l1.99,-0.47l5.15,1.95l1.69,-0.05l3.21,1.91l4.24,0.28l1.59,-1.06l5.11,1.61l0.79,1.59l-1.13,2.45l0.03,1.29l1.48,3.33l1.49,2.65l0.58,0.5l-0.55,0.63l-0.13,0.94l-0.66,1.21l0.37,2.0l-3.34,0.39l-2.63,-1.21l-0.78,0.17l-1.67,1.19l-0.17,0.52l0.4,0.53l2.62,0.76l0.36,0.9l-0.61,1.27l-2.5,1.01l0.22,2.14l-0.57,1.05l0.29,1.33l0.71,0.37l-0.38,1.52l-1.55,0.13l-1.07,0.52l-3.01,2.23l-0.95,1.05l-0.06,1.64l-2.43,-0.52l-1.82,0.22l-2.61,1.16l-3.0,-0.22l-4.41,0.63l-0.86,0.49l-1.18,1.41l-2.57,1.55l-9.63,-1.84l-4.6,-0.75l-4.37,-0.3l-9.27,-1.69l-1.1,-0.46l-3.07,-3.85l-0.22,-0.59l0.9,-1.44l-0.7,-0.65l-5.52,1.62l-3.28,-0.2l-4.0,0.41l-1.66,0.8l-1.47,2.35l-1.02,0.32l-2.04,-0.36l-1.13,-0.95l-2.82,-0.17l-0.56,-1.62l-1.1,-0.55l-3.06,2.23l-3.12,-1.32l-0.64,-1.3l-3.07,-0.86Z", "name": "Austria"}, "RO": {"path": "M476.64,535.62l-1.61,-2.14l-2.97,-1.77l-1.3,-1.89l2.99,-0.64l1.59,0.53l1.44,-0.77l0.67,-1.16l0.81,-0.18l2.68,0.29l1.42,-0.78l0.52,-0.55l0.45,-1.28l1.09,-0.68l-0.15,-1.22l0.78,-1.77l2.37,-1.65l0.06,-1.56l2.13,-2.96l0.14,-1.37l1.69,-1.68l1.11,-2.79l1.64,-1.48l0.18,-2.0l1.41,-1.03l2.32,-2.59l2.53,-0.74l1.8,0.04l3.69,-3.16l2.28,-0.96l1.16,-1.36l0.58,0.03l2.92,1.64l3.46,-0.04l4.48,0.97l0.86,-0.12l1.63,0.64l4.1,-0.7l1.11,0.24l4.49,3.71l2.52,-0.49l1.41,-1.38l3.86,-1.46l9.41,-1.41l1.83,-2.26l0.38,-1.45l5.18,-0.96l2.32,0.84l0.99,0.89l2.29,3.33l2.5,5.51l1.56,1.55l2.19,3.58l2.09,1.96l1.18,1.95l2.93,2.32l2.2,5.58l-0.22,2.16l0.27,1.0l-1.66,5.19l-0.28,2.89l0.8,5.34l-1.04,0.72l0.01,0.55l1.84,2.47l1.42,1.74l1.94,1.02l4.28,1.01l0.85,-0.41l-0.23,-0.85l1.39,0.33l1.88,-0.54l2.59,-1.35l2.27,-0.26l2.06,0.76l1.64,1.61l-0.91,4.48l-0.93,2.03l-5.83,1.21l-0.37,-2.15l0.51,-0.66l-0.24,-0.64l-1.85,-0.24l-1.32,1.35l0.37,1.95l-0.96,1.47l-0.08,1.37l-0.53,1.28l0.45,0.45l0.39,-0.06l-2.26,2.64l-0.78,1.51l0.18,5.11l-0.96,3.65l-2.41,-0.04l-4.23,-1.23l-2.16,-2.63l-0.42,-0.14l-1.85,0.48l-0.84,-0.66l-3.32,-0.39l-4.72,-2.43l-8.13,1.39l-3.75,1.28l-3.9,2.3l-1.59,1.74l-1.69,0.86l-2.46,0.65l-4.48,-0.25l-9.84,-1.78l-2.85,0.5l-3.66,-0.38l-5.66,-1.11l-4.19,-0.34l-4.07,0.63l-0.45,-0.32l0.03,-0.95l2.02,-1.54l0.02,-1.12l-4.46,-2.72l-0.15,-0.7l-1.44,-0.93l-0.99,-1.35l0.08,-0.66l0.56,-0.68l2.38,-0.47l0.2,-0.47l-0.33,-0.8l-3.35,-1.74l-1.99,0.5l-2.12,1.94l-1.09,0.23l-0.9,-1.21l-1.59,-0.77l-3.62,-0.71l-0.58,-0.76l-1.0,-0.58l-2.02,-0.57l1.83,-0.2l0.48,-0.55l-0.18,-0.85l-2.12,-0.96l0.61,-0.23l0.99,-1.51l0.07,-1.02l-0.98,-0.87l-2.71,-0.8l-1.0,-0.8l-1.73,-0.54l-3.05,-2.42l-0.11,-4.44l-0.37,-0.46l-0.8,0.27Z", "name": "Romania"}, "EG": {"path": "M609.87,762.03l-0.4,0.47l0.36,0.35l1.86,0.2l4.18,-0.88l0.68,-0.86l0.41,-1.22l1.34,0.21l4.57,1.95l1.25,0.02l3.65,-1.22l0.28,0.16l-0.58,0.2l-0.2,0.94l-1.36,1.74l0.15,0.61l3.15,1.07l1.14,1.73l0.46,0.19l1.62,-0.52l1.02,-1.22l-0.36,-0.98l3.2,2.53l1.24,0.57l6.91,-1.41l0.75,1.03l0.42,0.13l2.43,-0.68l3.94,-0.0l3.28,-0.79l3.67,-1.82l3.73,10.29l0.56,2.28l1.74,3.76l3.23,10.3l-2.19,3.09l-1.61,7.52l-2.3,5.85l-0.63,4.98l-7.3,0.0l-2.91,-3.58l-2.45,-2.02l-2.2,-2.52l-0.57,-1.74l0.0,-1.27l-1.02,-3.01l-0.79,-1.47l-2.74,-3.1l-1.98,-3.4l-1.01,-4.1l-1.1,-2.6l-0.57,-0.19l-1.25,0.72l-0.01,1.35l-1.04,1.46l-0.66,1.75l0.5,1.71l2.32,2.28l0.41,0.85l0.5,1.97l-0.08,2.74l0.46,1.22l1.67,2.04l1.59,3.31l1.67,1.79l2.45,3.46l2.38,2.37l-112.97,0.0l-0.01,-17.03l-1.55,-5.75l-0.85,-4.71l-1.33,-4.48l2.32,-3.72l1.16,-3.39l0.16,-1.61l-1.3,-4.23l-0.32,-3.87l3.51,-4.31l1.07,1.6l2.12,0.31l6.98,-1.6l18.18,3.6l3.99,2.48l1.2,0.33l2.7,-0.05l1.96,1.45l7.35,0.7l3.87,1.57l2.22,1.27l1.56,0.45l2.89,-0.56l2.11,-0.94l6.77,-4.46l1.48,-0.52l2.32,0.1l2.52,-2.99l2.07,-0.2ZM628.36,761.36l0.23,0.13l0.28,0.29l-0.51,-0.42Z", "name": "Egypt"}, "PL": {"path": "M388.82,391.65l2.24,0.2l4.47,-1.73l7.73,-2.25l8.25,-2.11l3.89,-0.68l5.14,-4.93l4.3,-0.78l5.14,-2.5l7.81,-1.62l3.25,-0.36l3.11,-0.04l2.2,0.99l-0.57,-0.04l-0.39,0.57l2.04,4.34l1.16,1.6l2.4,1.27l1.99,0.42l5.96,-0.69l2.68,-1.3l8.1,0.66l26.53,1.14l7.63,0.18l1.39,-0.84l1.75,0.49l1.01,1.2l3.11,1.14l2.16,1.67l0.33,1.04l-0.04,2.27l1.64,6.65l2.59,6.1l1.31,4.4l0.39,3.76l-0.18,1.9l-0.61,0.58l-4.87,2.03l-1.0,0.68l-2.88,3.32l-0.47,1.1l0.51,0.98l3.5,1.57l1.84,1.18l0.6,0.91l-0.02,1.06l-0.57,1.62l0.2,1.31l-1.02,1.69l-0.08,2.01l1.6,3.04l0.13,2.59l2.66,3.25l1.67,3.34l1.47,1.21l-1.1,0.52l-0.48,0.6l1.51,3.27l-0.05,1.28l-1.46,1.98l-3.56,0.67l-4.08,3.59l-5.07,4.89l-5.27,6.39l1.05,4.5l-0.35,2.22l1.95,1.75l-0.24,0.4l-2.87,-0.93l-1.5,-0.09l-5.92,-2.16l-0.66,-1.44l-1.17,-0.92l-3.6,-1.28l-3.94,-0.3l-3.66,0.18l-1.34,1.46l-1.49,0.35l-1.83,-0.95l-1.53,-0.38l-3.51,0.1l-3.0,1.33l-0.84,0.92l-0.53,1.22l-1.56,-0.57l-1.81,0.42l0.34,-0.9l-0.2,-1.86l-0.8,-0.59l-1.17,-0.23l-2.68,-3.39l-0.49,0.01l-2.67,1.6l-1.25,1.79l-1.9,0.05l-0.36,-1.49l-1.44,-0.45l-0.45,-1.76l-2.79,-2.46l-0.56,-2.25l-0.76,-0.46l-2.27,-0.48l-0.66,0.22l-3.68,-2.08l-0.89,0.68l-1.67,0.27l-1.96,-2.02l-0.77,-0.32l-0.17,-0.17l1.21,-0.48l0.56,-0.84l-0.17,-1.46l-0.42,-0.42l-2.29,0.71l-1.7,0.16l-3.57,-2.17l-3.73,-0.88l-0.39,0.17l-0.17,0.62l1.62,2.71l-1.84,0.81l-1.61,1.27l-0.79,0.19l-3.92,-4.51l-1.55,-0.77l0.71,-0.73l1.08,-0.38l0.91,-1.37l-0.16,-0.72l-1.83,-1.3l-3.84,0.66l-0.82,-0.97l-2.85,-1.21l-5.01,-1.25l-0.91,-1.11l-0.5,-1.57l-3.63,-1.01l-0.61,0.61l0.01,1.78l-1.34,0.36l1.82,-3.65l0.72,-3.12l-1.56,-3.89l-2.47,-1.15l0.28,-1.67l-1.8,-3.5l0.94,-1.3l1.05,-3.19l-0.67,-0.85l0.02,-1.7l-0.34,-0.77l-0.97,-0.65l-0.68,-1.21l0.8,-3.26l-1.53,-2.24l-3.49,-2.48l-1.53,-1.58l0.1,-0.7l0.63,-0.77l1.41,-0.89l1.02,-1.45l0.65,-1.92l0.03,-1.69l-1.56,-5.01l-0.4,-2.5l3.7,1.43l0.56,-0.46l-0.4,-1.21l0.07,-2.12l-0.31,-0.36l-4.43,-0.86l-0.11,-0.47ZM448.78,377.06l0.62,0.32l-0.19,-0.07l-0.43,-0.25Z", "name": "Poland"}, "LY": {"path": "M352.28,736.51l1.65,0.75l2.05,0.37l6.36,3.56l6.46,0.88l7.16,-1.7l3.37,1.34l4.08,0.5l4.27,1.22l4.89,3.01l8.86,1.78l1.1,1.07l1.17,2.15l0.07,2.85l1.81,4.74l3.01,3.64l1.77,1.01l3.94,1.44l8.99,0.76l7.63,1.97l6.45,2.27l1.66,1.15l3.19,1.09l6.5,5.38l3.61,1.86l2.66,0.4l2.5,-0.36l4.04,-1.87l1.72,-1.14l4.14,-4.72l1.38,-2.5l0.57,-1.79l-0.12,-1.89l-0.52,-1.66l-1.16,-1.71l-0.76,-2.08l-0.46,-3.8l0.61,-2.61l0.74,-1.56l1.18,-1.61l3.32,-3.14l3.34,-2.22l5.87,-2.89l3.38,-0.03l1.52,-0.33l2.91,-2.08l0.96,-0.07l1.66,0.51l4.65,-0.14l11.92,4.4l0.47,2.26l-0.14,2.11l2.62,1.84l6.88,0.82l4.57,2.25l4.74,0.19l2.76,-0.29l2.53,0.46l0.86,0.4l0.91,0.95l1.52,3.09l-3.92,4.91l0.34,4.11l1.3,4.23l-0.16,1.35l-1.1,3.18l-2.4,4.04l3.75,15.06l0.0,16.92l-203.8,0.0l-0.63,-7.82l0.36,-6.03l-0.51,-3.13l-2.26,-6.85l-4.29,-6.8l7.67,-3.9l4.42,-5.99l0.54,-1.22l0.04,-1.35l-1.9,-7.71l2.02,-3.07l2.73,-0.78l0.97,-1.07l0.88,-1.85l2.05,-1.28l0.8,-0.93l9.29,-5.15l0.42,-0.9l0.01,-0.96l-1.08,-1.87l0.07,-3.7l0.56,-3.73Z", "name": "Libya"}, "-99": {"path": "M640.16,706.11l1.44,-0.49l0.63,-1.5l0.18,-1.4l4.59,0.67l4.13,-0.2l6.23,-1.86l1.81,-1.12l3.09,-1.32l-6.88,4.52l-0.62,1.84l0.66,1.39l-1.1,-0.15l-0.89,0.62l-1.5,0.43l-1.88,-0.3l-0.56,0.28l-0.14,-1.08l-1.09,-1.05l-2.7,-0.2l-3.88,1.29l-1.53,-0.37Z", "name": "N. Cyprus"}, "CH": {"path": "M320.32,503.5l0.93,1.21l2.73,1.44l1.42,0.09l0.68,0.53l-1.86,4.75l-0.08,1.49l0.52,0.93l1.73,0.08l2.8,0.77l0.53,1.22l3.54,1.5l1.01,-0.27l2.11,-1.92l0.51,0.2l0.41,1.32l-0.74,3.43l0.56,0.96l-0.02,0.64l-1.64,-0.23l-1.29,-0.99l-1.55,0.38l-0.6,1.17l-0.22,1.86l0.55,0.62l0.74,2.51l-0.69,0.02l-1.59,-2.16l-0.9,-0.09l-3.29,1.2l-1.2,-0.13l-0.52,-0.58l-0.68,-2.13l-0.42,-0.32l-1.84,-0.17l-0.8,0.69l-0.12,3.08l-3.33,4.56l-0.07,0.81l0.58,1.67l-0.72,0.36l-0.75,-1.35l-1.21,-1.09l0.49,-0.81l-0.08,-0.63l-2.58,-0.79l-2.32,-2.15l-0.24,-2.99l-0.6,-0.57l-0.93,0.09l-1.91,1.78l-1.9,1.25l-0.22,0.68l0.55,1.27l-1.71,2.33l-2.5,1.44l-3.29,-0.92l-3.01,1.12l-2.55,0.51l-0.83,-0.33l-1.25,-1.79l-2.34,-2.36l0.54,-1.66l-0.64,-1.73l0.1,-0.55l-0.58,-0.62l-2.43,-0.37l-2.1,0.11l-1.58,0.66l-1.5,1.41l0.49,1.29l-0.73,0.73l-1.4,0.71l-1.05,0.03l-0.01,-0.52l1.68,-1.25l0.38,-1.73l-0.81,-1.03l1.23,-2.7l3.3,-2.41l0.66,-3.29l2.8,-1.32l3.98,-4.25l0.71,-1.15l-0.34,-0.8l-0.94,-0.37l0.69,-0.76l1.0,-0.54l0.9,-0.01l0.97,0.98l2.09,-0.03l1.04,-0.38l1.17,-1.65l1.37,-0.65l1.08,0.36l3.1,0.1l2.31,-0.21l1.45,-0.53l3.47,0.18l1.83,-0.89l0.01,-0.53l-0.38,-0.39l-1.79,-0.1l0.3,-0.51l1.54,-0.64l2.09,1.29l1.18,-0.13l0.95,0.88l3.85,-0.25Z", "name": "Switzerland"}, "GR": {"path": "M572.83,693.59l-0.79,0.26l-0.27,-0.39l0.51,-1.56l-0.52,-1.53l2.47,-2.51l3.69,-1.26l-1.12,2.79l-1.0,1.2l0.08,0.93l-1.45,0.33l-1.59,1.75ZM572.72,683.64l0.3,-0.19l-0.05,0.46l-0.26,-0.27ZM562.23,680.49l2.44,-1.19l0.78,0.05l-1.92,1.05l-1.31,0.09ZM563.43,698.44l0.89,2.16l-0.83,0.63l0.1,-1.01l-0.52,-1.14l0.37,-0.63ZM556.67,665.86l1.58,-0.77l0.97,-0.02l2.63,0.58l0.06,0.28l-2.4,0.93l-1.62,-0.93l-1.22,-0.07ZM561.19,677.08l0.54,0.48l-0.03,0.04l-0.63,0.1l0.12,-0.62ZM553.23,640.86l-0.05,1.13l1.82,1.52l0.64,1.18l-0.8,-0.3l-0.49,0.49l0.43,0.99l-0.37,0.12l-3.88,-0.79l-0.36,-0.44l1.98,-1.69l-0.34,-0.63l-1.6,0.18l-1.23,1.37l-1.92,-0.59l-0.59,-0.58l0.65,-1.01l1.36,0.04l0.99,-0.34l1.05,-0.45l0.25,-0.65l1.92,-0.12l0.56,0.56ZM468.86,635.88l0.8,0.1l0.84,-0.47l0.47,-0.56l0.3,-1.23l0.8,-0.02l0.42,-0.51l-0.08,-0.84l-0.89,-1.73l1.18,-1.04l2.5,-0.46l0.86,-0.63l2.04,-5.23l1.84,-0.75l0.87,-1.26l0.46,-1.74l-1.01,-1.95l0.07,-0.75l4.51,-0.26l1.17,-0.64l2.44,0.55l2.7,-1.28l2.12,-2.57l0.71,-0.31l2.56,-0.43l4.2,0.63l3.18,-0.98l0.81,-2.46l4.87,0.17l1.31,-1.02l5.29,-0.03l3.3,-1.1l1.87,-0.11l0.72,-1.05l4.18,0.07l1.53,-0.49l1.01,1.67l2.49,1.47l1.25,-0.53l1.81,0.43l3.69,1.97l7.18,-1.39l1.97,0.27l2.95,-1.23l0.46,-1.18l-0.61,-2.88l-0.57,-0.89l0.35,-0.54l1.03,-0.24l2.67,0.72l2.17,1.52l0.5,2.83l-0.19,0.47l-0.81,0.19l-2.78,1.68l-0.26,1.9l0.38,2.25l-3.15,3.72l-0.55,0.18l-0.34,-0.49l-2.24,-1.25l-4.81,-0.7l-2.28,-0.87l-1.1,0.12l-2.16,-0.96l-1.44,0.48l-2.75,1.7l-1.32,-0.16l-1.58,-1.01l-1.46,-0.22l-1.38,0.65l-1.97,1.99l-1.87,0.91l-1.79,-0.37l-2.48,0.01l-0.39,0.31l-0.22,1.44l1.67,1.98l-0.49,1.12l0.47,1.01l0.97,0.38l-1.37,-0.1l-1.29,0.61l-0.32,1.0l1.52,1.65l1.87,1.37l0.37,1.18l-0.35,0.48l-1.18,-0.7l-2.26,-3.15l-3.47,-0.8l-0.39,0.14l-0.6,1.06l0.63,1.7l0.61,0.86l2.44,1.6l-2.92,-0.93l-0.79,-1.39l-0.43,-2.26l-5.48,-2.86l-0.45,-1.07l0.86,-1.57l-0.43,-0.54l-1.68,0.27l-2.63,1.63l0.16,2.07l-0.97,3.9l0.31,1.48l3.34,3.89l1.1,2.67l0.86,1.13l1.73,1.19l1.71,2.06l0.7,1.04l0.44,1.48l-1.16,0.88l-0.56,0.03l0.43,-1.37l-0.31,-1.06l-2.29,-1.16l-1.37,0.42l-1.12,0.76l-0.14,0.5l1.35,2.35l0.34,1.2l0.45,0.29l-2.35,1.25l-2.75,0.18l-0.61,0.48l0.16,0.67l1.59,0.3l1.19,0.76l3.26,0.9l1.74,1.2l1.37,0.09l1.7,2.14l2.56,0.54l1.7,2.19l2.01,0.42l1.63,0.73l0.65,1.85l0.5,5.04l-0.07,1.48l-0.27,0.28l-0.29,0.01l-1.2,-1.48l-4.0,-3.63l-1.32,-0.49l-1.27,0.69l-3.1,0.54l-1.91,0.86l-0.41,0.62l0.17,0.49l1.3,1.11l0.04,1.25l0.68,1.5l1.08,0.59l1.64,0.17l1.16,1.6l-3.97,1.5l-0.47,-0.26l-0.24,-1.31l-2.12,-1.2l-1.23,-0.26l-0.95,-0.77l-0.53,0.03l-0.67,0.67l0.43,2.7l1.21,1.71l2.79,6.7l0.16,1.11l-0.37,2.25l1.29,2.29l-1.47,-1.01l-1.96,-2.37l-0.69,-1.49l-1.16,-0.35l-1.89,0.44l-1.62,3.28l-0.04,1.39l-0.21,-0.11l-0.53,-0.43l-0.06,-2.97l-1.96,-2.81l-0.93,-0.41l-1.11,-1.87l-0.41,-0.16l-1.04,0.23l-0.97,0.71l-0.56,3.34l-1.67,-1.57l-2.02,-3.25l-0.05,-1.59l1.53,-1.91l-0.24,-1.36l-1.56,-2.52l-2.1,-1.55l-1.09,-0.44l-0.63,-1.66l-2.02,-1.46l2.41,-2.01l1.21,-2.48l1.73,0.55l1.48,-0.16l2.34,-2.39l1.5,0.09l3.85,2.04l4.27,1.21l2.03,1.0l1.29,1.07l1.7,0.38l0.46,-0.42l-0.23,-1.23l2.56,-0.15l0.74,-0.53l0.42,-1.05l-0.47,-0.67l-1.03,-0.49l-1.47,-0.29l-0.73,0.18l-1.18,-0.46l-5.54,-3.18l-0.57,0.13l-0.43,0.73l-0.7,0.36l-1.11,0.06l-3.71,-0.92l-2.14,0.71l-4.24,0.68l-1.88,-2.53l-0.6,0.34l-0.26,1.46l-1.28,0.35l-0.68,-0.45l-1.66,-4.24l-1.61,-1.92l-1.24,-0.53l-0.08,-0.76l0.07,-0.5l1.17,-0.16l2.36,0.85l0.88,-0.23l0.71,-0.78l-0.49,-1.82l-2.97,-0.34l-1.94,0.42l-0.66,-0.31l-3.29,-3.43l-2.27,-1.18l-1.42,-3.34l-1.01,-1.26ZM520.05,623.97l1.33,-0.04l2.3,1.21l1.04,1.36l-1.4,-1.3l-3.26,-1.24ZM552.69,684.22l-0.15,0.18l-0.36,-0.26l0.41,0.1l0.11,-0.02ZM553.58,683.62l0.03,-0.08l0.05,0.06l-0.07,0.03ZM548.5,668.67l0.95,-0.85l2.0,-0.19l-0.72,0.46l-2.23,0.57ZM517.64,698.89l0.47,1.17l1.82,0.46l1.71,-0.13l0.86,-0.88l0.55,-0.01l0.13,0.28l-0.96,0.59l0.02,0.55l1.04,0.63l0.84,-0.04l0.27,0.97l0.84,0.59l1.91,-0.04l3.69,-0.89l3.65,0.22l1.49,0.97l2.57,0.11l2.39,0.5l3.39,-0.62l-0.05,2.82l0.84,0.58l0.89,-0.12l0.87,-0.75l1.68,-0.51l1.83,0.0l1.35,-1.09l-0.21,1.45l-0.45,1.56l-0.8,0.3l-4.5,-0.1l-13.85,1.38l-0.4,-0.13l-0.14,-1.43l-0.43,-0.64l-3.48,-1.22l-7.91,-1.34l-2.54,0.18l-1.22,-0.27l-0.31,-0.42l-0.17,-1.69l0.27,-1.64l0.87,0.49l0.43,-0.08l0.58,-0.56l0.16,-1.18ZM546.98,657.64l0.83,-0.47l0.56,-1.18l-0.51,-1.11l-1.36,-1.35l-0.04,-0.53l1.74,-0.34l1.56,0.89l0.07,3.17l-0.61,0.53l-0.14,0.76l-0.95,0.65l-1.15,-1.02ZM543.3,622.98l-0.87,0.24l-0.94,-0.73l0.76,-0.25l1.05,0.74ZM541.67,677.54l-0.82,0.4l-0.9,-1.58l1.84,-1.63l0.35,0.34l-0.04,1.56l-0.42,0.91ZM540.58,686.4l0.09,0.29l-0.33,0.42l0.18,-0.35l0.05,-0.37ZM539.91,670.41l-0.74,0.06l0.03,-0.53l1.07,0.27l-0.36,0.21ZM535.7,630.46l1.88,-0.07l0.57,0.64l0.49,0.09l1.51,-1.03l-0.9,1.57l-0.18,1.09l-0.59,-0.12l-0.12,-0.88l-0.43,-0.38l-0.69,0.27l-0.36,0.76l-1.05,-0.22l-0.14,-1.72ZM539.48,682.06l-0.68,-0.65l-0.17,-0.27l0.96,0.71l-0.1,0.21ZM537.9,676.19l-0.77,0.85l-0.65,-0.29l0.4,-0.8l0.94,-0.5l0.09,0.74ZM535.78,667.62l1.65,0.25l0.14,0.17l-0.25,0.5l-0.45,-0.08l-1.09,-0.84ZM534.05,665.46l-0.12,0.31l-1.78,-1.57l-1.08,-1.14l-0.1,-0.51l0.58,-0.25l0.74,1.01l1.24,0.26l0.51,1.9ZM531.1,619.94l-1.25,0.41l-1.41,-0.87l0.01,-0.29l1.17,-1.42l0.97,0.08l0.69,0.95l-0.17,1.13ZM530.55,677.44l0.32,0.58l-0.13,0.1l-0.14,-0.26l-0.05,-0.41ZM527.82,646.84l0.51,0.29l0.25,0.92l-0.86,-0.53l0.1,-0.68ZM529.05,648.51l0.31,0.27l-0.26,0.07l-0.04,-0.34ZM506.57,648.07l3.08,-1.79l1.96,-0.47l1.2,1.04l0.73,1.64l0.92,0.78l4.77,2.0l2.99,0.27l1.17,1.85l-0.19,1.12l1.21,3.89l1.43,1.15l2.66,0.25l-0.01,1.43l-0.63,0.53l-1.01,-0.67l-0.75,-0.06l-1.88,-1.44l-0.34,-1.37l-2.27,-3.04l-3.75,-0.18l-1.21,-0.55l-0.6,-1.79l-4.9,-3.9l-3.13,-1.2l-1.45,0.5ZM526.08,681.87l0.47,0.25l-0.55,0.09l0.08,-0.33ZM527.2,682.01l0.36,-0.4l0.35,-0.09l0.0,0.38l-0.72,0.11ZM527.8,675.11l-0.52,-0.06l0.35,-0.53l0.24,0.11l-0.07,0.48ZM526.82,671.42l-0.28,-0.62l0.23,-0.28l0.32,0.46l-0.27,0.43ZM525.55,668.08l-0.29,0.25l0.39,-1.19l0.31,-0.03l-0.41,0.98ZM517.4,644.21l-0.6,-0.11l-0.2,-0.36l0.79,0.47ZM513.82,662.81l0.26,-0.51l0.33,0.09l-0.09,0.46l-0.5,-0.04ZM506.84,687.57l1.47,1.52l-0.51,0.97l-0.83,-0.27l-0.27,-0.47l0.14,-1.75ZM478.67,665.05l0.48,0.52l-1.16,0.88l-1.25,-0.99l-0.97,-1.4l0.5,-0.59l0.61,0.8l1.24,0.33l0.56,0.47ZM472.09,658.33l0.7,-1.67l0.81,0.42l0.52,-0.22l0.61,-1.26l0.25,1.94l1.11,0.64l1.09,1.41l-0.07,0.54l-1.85,-0.68l-0.97,0.24l-0.29,-1.09l-0.71,-0.87l-0.52,0.0l-0.69,0.6ZM475.93,654.68l0.08,0.08l-0.0,0.17l-0.08,-0.26ZM474.85,651.83l0.45,-1.92l0.83,-0.95l0.06,2.56l-0.21,0.26l-1.14,0.06ZM465.8,638.46l-0.15,-0.1l-1.04,-1.97l-2.07,-2.4l2.13,-0.65l0.9,0.56l-1.09,1.25l0.72,1.12l0.59,2.17Z", "name": "Greece"}, "RU": {"path": "M570.87,313.83l1.43,0.47l1.39,1.78l1.34,0.66l1.83,0.02l1.0,-1.42l-1.01,-2.64l-1.75,-1.83l-1.78,-0.92l-3.38,0.01l-0.29,-1.23l0.24,-0.8l2.93,-2.82l0.33,-0.92l-0.98,-8.5l-0.88,-1.41l0.98,-1.16l1.86,-4.41l1.59,-0.49l0.55,-0.74l1.26,-0.69l-0.24,-1.11l-1.43,-1.46l0.6,-1.35l-0.65,-3.34l0.42,-0.81l0.57,-0.06l1.12,1.2l2.03,0.6l1.21,-0.84l0.54,-1.72l0.56,-0.46l1.07,0.55l1.95,0.23l2.87,-0.46l2.71,-3.42l6.87,0.87l6.1,1.65l0.89,-0.77l0.29,-1.23l-0.19,-0.42l-2.6,-1.38l-1.43,-1.91l-2.04,-1.51l-2.27,-0.21l-2.74,0.52l-3.9,-0.3l-3.37,-2.77l-2.3,-0.91l-1.57,-2.16l0.84,0.47l0.58,-0.26l0.39,-2.49l-2.06,-1.74l-4.83,2.13l-3.8,0.52l7.26,-6.49l3.43,-2.16l1.07,-1.17l6.96,-4.74l3.25,-3.22l2.69,-2.13l11.83,-12.09l5.01,-4.12l3.4,-3.31l1.38,-1.87l3.44,-6.93l-0.01,-0.97l-0.42,-0.8l-2.34,-2.4l-2.18,-3.04l-2.82,-1.99l-7.5,-4.33l-5.46,-4.61l2.72,-1.21l3.99,-4.71l0.38,-1.46l-0.17,-2.72l-0.38,-0.89l-1.51,-1.2l-3.7,-1.76l-1.54,-3.22l-0.01,-0.49l1.82,-2.02l-0.21,-2.19l-0.75,-0.87l-3.83,-0.84l-0.98,-0.8l-1.23,-2.51l0.18,-1.22l2.39,-1.4l0.44,-1.18l-0.26,-1.49l-2.69,-0.77l1.34,-1.72l0.27,-3.16l1.19,-2.03l-0.08,-0.5l-1.02,-0.9l4.59,-0.92l0.39,-1.34l-0.21,-1.44l-2.56,-6.98l-3.14,-4.15l-2.8,-5.77l-2.33,-3.72l-2.67,-3.44l-0.31,-0.83l0.25,-1.56l2.06,-2.8l4.42,-5.18l5.0,-5.14l0.73,-3.16l-0.28,-0.7l-2.1,-1.49l-3.98,-4.02l-2.61,-3.2l-8.75,-2.93l-2.79,-6.72l0.1,-0.96l3.64,-5.42l0.41,-1.27l-0.18,-0.86l-1.04,-0.69l-3.45,-0.31l9.0,-3.31l0.82,-0.57l0.66,-0.76l2.29,-4.6l8.2,-2.29l1.33,-1.03l1.08,-1.72l0.48,-2.01l-0.34,-0.96l5.47,2.43l2.48,0.12l1.08,-0.25l0.77,-0.81l0.37,-1.19l-0.59,-3.8l1.82,0.26l5.42,1.9l1.54,-0.18l1.8,-0.72l1.58,-2.18l0.98,-0.31l1.48,0.49l0.45,-0.15l0.48,-1.01l-0.7,-2.16l5.04,1.88l2.43,1.53l5.01,1.29l0.69,0.55l-0.14,1.84l-0.82,0.45l-2.03,-0.09l-8.13,-1.55l-1.15,1.0l-0.01,0.6l1.05,0.93l2.13,0.95l0.58,1.64l0.41,0.27l3.45,-0.24l3.29,0.67l1.42,-0.18l-0.88,1.4l0.08,0.55l0.89,0.44l3.72,-1.43l1.59,-0.36l0.6,0.25l0.09,0.86l-0.58,1.41l-0.09,1.2l-1.07,2.55l-1.8,0.91l-0.74,1.6l0.43,0.15l2.6,-0.7l1.47,-0.8l2.68,-3.84l0.61,-0.4l7.23,-0.07l8.52,2.02l2.04,0.17l2.32,-0.23l1.51,-1.05l7.55,1.96l10.25,4.46l15.01,7.34l8.41,6.45l1.17,1.5l3.07,0.79l0.85,-0.48l1.45,0.4l10.1,5.94l3.44,0.31l0.41,-0.54l-0.6,-1.54l7.59,7.3l1.96,0.98l5.8,1.73l1.23,5.96l0.98,1.39l0.0,2.6l1.91,1.45l1.12,0.21l-0.05,1.63l-1.04,4.63l-1.11,1.9l-8.96,8.53l-5.59,3.26l-10.95,3.75l-8.54,1.4l-3.42,0.1l-6.68,-0.69l-3.62,-0.75l-4.47,-2.12l-4.28,-1.09l-2.98,-0.48l-5.34,-0.2l-11.58,-2.1l-1.96,-0.72l-7.27,-4.11l-3.2,1.12l-1.46,0.18l-0.77,-0.94l0.53,-0.72l-0.24,-0.58l-4.13,-1.18l-3.42,-0.09l-4.01,-1.75l-1.59,0.43l-4.37,-1.76l-1.92,-1.4l-1.89,-2.33l0.92,-1.16l-0.19,-0.68l-7.25,-1.51l-6.83,-0.2l-0.4,0.29l0.18,0.46l1.19,0.72l3.04,0.42l3.72,2.28l-0.44,1.72l0.17,0.43l5.17,3.72l0.29,0.74l4.17,0.93l0.44,1.28l-0.47,0.94l0.67,1.15l5.48,1.85l-0.52,0.8l-1.44,0.78l-1.53,0.38l-0.3,0.36l0.24,0.4l0.93,0.34l1.97,-0.12l7.28,2.12l3.8,2.13l3.88,3.89l1.2,1.83l-0.12,1.88l-2.15,5.67l-0.9,1.09l-1.82,1.32l-0.1,0.55l3.57,5.01l1.76,3.93l0.38,3.97l1.24,0.96l-0.89,1.1l0.15,3.2l2.34,2.85l3.6,1.82l2.16,0.34l2.78,-0.65l1.94,0.86l4.56,3.11l2.06,3.28l0.94,0.78l8.4,2.09l5.46,2.01l1.19,0.01l2.56,-1.69l4.64,-1.31l1.39,-1.66l-0.02,-1.7l-1.16,-2.59l-0.48,-2.67l-2.93,-1.7l-4.4,0.47l-1.78,-0.09l-1.31,-0.61l-1.88,-1.7l-3.65,-4.26l-1.98,-1.45l-0.57,-0.81l-0.62,-1.12l0.06,-1.49l1.43,-0.01l1.8,-1.14l1.41,-4.08l3.1,-0.42l5.12,1.85l6.46,5.01l1.55,0.59l3.93,-0.02l0.42,0.59l1.34,0.79l7.01,1.73l6.92,3.12l2.77,-0.11l1.55,-2.62l2.63,-1.63l1.82,-0.27l2.69,0.62l0.88,-0.63l0.09,-0.41l-0.94,-2.58l-1.3,-2.3l-1.94,-1.52l-4.58,-6.2l-0.62,-2.02l0.82,-3.03l6.85,-3.4l2.55,-2.09l2.37,-2.62l1.0,-0.49l4.11,-0.76l5.49,-2.34l4.13,-3.05l4.13,-4.68l1.56,-1.1l1.19,0.1l1.76,0.69l2.2,1.39l2.77,0.25l5.71,-0.1l4.17,2.06l1.11,1.24l-1.2,1.5l-0.2,1.33l0.57,0.4l2.45,-0.74l1.29,0.32l3.45,2.95l0.63,-0.2l0.57,-2.39l-0.63,-2.77l1.6,-3.71l1.3,-1.7l2.33,-4.3l-0.65,-3.03l-0.11,-3.29l-0.41,-1.65l-1.66,-2.3l-2.94,-1.55l-2.91,-0.5l-0.81,-1.24l0.16,-1.54l0.8,-2.46l2.44,-5.35l2.56,-7.53l-0.26,-6.2l-0.66,-2.0l-10.32,-6.58l-0.67,-0.91l1.25,-0.06l7.85,3.09l1.79,0.17l12.18,-0.85l5.9,0.73l4.89,1.52l3.54,4.34l7.01,7.38l0.08,2.31l-3.17,0.52l-3.47,0.13l-8.91,1.48l-7.99,6.48l-0.63,1.92l0.69,1.65l2.75,1.54l5.6,2.22l2.51,4.37l1.93,2.37l1.51,0.92l4.23,0.24l2.87,0.92l0.74,-0.39l1.85,-0.15l10.9,-2.37l2.25,-1.08l0.94,-1.88l0.79,-5.21l1.88,-4.09l-0.4,-2.84l10.14,-2.46l2.36,0.31l0.41,-0.21l0.58,-1.57l-2.2,-2.98l0.22,-0.14l2.59,0.9l2.98,-0.41l10.5,-4.52l4.11,-2.58l2.47,-1.02l3.83,-2.31l1.8,-0.72l3.25,-0.32l3.49,-0.92l3.83,-1.74l4.65,-1.33l0.0,343.83l-5.0,3.15l-2.79,0.22l-0.91,-0.3l-0.4,-1.62l-1.6,-1.18l-5.16,-1.54l-7.64,7.94l-4.24,1.65l-1.51,1.17l-4.49,0.95l-1.08,1.15l-1.3,2.99l-6.75,4.33l-2.52,-0.17l-0.24,0.56l0.52,1.05l0.47,3.49l1.89,5.87l-0.94,1.21l-2.08,0.92l-2.09,0.76l-1.14,-0.44l-1.98,-1.88l-4.5,-5.53l-1.99,-1.74l-1.54,-0.7l-1.71,0.24l-2.52,2.45l-0.46,1.16l0.01,2.68l-0.53,0.85l-3.43,2.59l-1.52,2.95l-1.19,5.85l0.75,1.37l2.21,1.8l0.14,0.67l-0.82,1.69l-1.51,1.24l-2.03,2.86l-1.32,4.14l0.88,3.27l2.6,1.54l2.02,0.68l0.7,0.77l0.68,1.68l-0.31,3.18l1.51,2.74l1.32,0.99l2.86,-1.0l8.28,0.98l0.64,0.52l5.19,6.62l5.41,9.18l-0.07,0.47l-0.6,0.23l-1.3,-0.08l-2.32,-0.94l-0.95,0.22l-0.68,0.58l-0.24,0.79l0.58,1.74l1.09,0.82l8.3,3.97l-1.17,0.12l-0.85,1.64l-3.46,1.42l-1.75,0.26l-0.28,0.4l0.06,1.05l0.72,1.78l-1.59,-0.69l-1.52,0.0l-3.26,2.71l-1.24,0.64l-4.37,1.23l-1.93,-0.31l-0.69,0.5l-0.24,0.7l-1.63,-1.24l-0.63,0.14l-0.13,0.55l0.77,1.23l0.06,1.03l-0.46,1.05l-1.11,0.78l-0.29,2.07l-0.51,1.21l-3.19,5.2l-0.32,1.09l-0.53,-0.63l-0.7,0.13l-0.55,1.41l-2.69,2.07l-0.66,1.85l0.07,1.95l0.52,0.69l3.73,1.36l2.74,2.45l0.98,1.4l1.61,5.23l0.45,3.69l0.36,0.35l0.44,-0.38l-0.44,2.79l0.31,2.69l-0.61,3.26l0.95,1.19l1.42,1.04l0.91,1.38l0.35,2.27l1.29,1.12l3.45,4.19l4.07,6.46l2.36,1.67l-2.22,3.58l-1.16,0.84l-3.41,1.53l-2.54,3.83l-0.73,0.17l-3.54,-0.46l-3.27,-1.25l-0.71,-2.14l-0.93,-1.11l-1.79,-1.16l-3.7,-3.75l-1.09,-0.3l-1.36,0.45l-0.47,-1.11l-1.36,-0.31l-2.91,-1.58l-3.5,-0.75l-1.44,-1.19l-2.67,-1.46l1.22,-4.06l-0.37,-0.73l-2.15,-0.75l-2.89,0.08l-2.55,-2.35l-4.21,-1.29l-1.21,1.86l-1.44,-1.49l-2.09,-0.29l-2.56,0.78l-4.99,2.2l-1.57,-0.07l-0.84,-0.44l0.74,-1.27l-0.02,-0.68l-0.38,-0.45l-3.09,-1.62l-6.25,-2.33l-1.05,-0.86l-0.31,-0.83l-3.17,-1.3l-2.67,0.21l-2.07,-1.13l-1.96,-0.06l-3.09,0.61l-6.19,-0.47l-2.91,-1.82l-3.84,-0.73l-5.84,-2.61l-1.9,0.32l-5.11,-0.93l-1.09,0.42l-1.26,1.88l-5.83,-4.81l-2.57,-2.83l-8.28,-6.48l-7.27,-2.21l-4.41,-4.59l-2.32,0.5l-2.62,-0.52l-1.77,-1.42l-0.9,-1.9l-1.27,-1.31l-3.6,-1.66l-3.83,-0.92l-0.2,-0.36l3.1,-1.0l1.03,-0.69l-0.05,-0.69l-2.45,-1.0l1.22,-0.52l3.0,1.97l1.61,0.58l1.01,-0.66l5.07,-1.09l0.64,-1.13l0.01,-1.14l-0.83,-0.39l0.02,-0.79l0.7,-1.37l2.37,-2.55l1.2,-3.3l0.78,-0.55l0.38,0.24l0.1,1.27l0.32,0.31l0.41,-0.18l1.33,-2.52l3.97,0.07l0.24,-0.67l-2.44,-2.6l-3.21,-2.58l-1.55,0.09l-0.65,-0.3l-1.32,-1.99l-0.39,-1.18l2.34,0.25l3.36,-1.37l3.63,0.63l0.44,-0.46l-0.69,-2.27l4.52,-1.44l4.36,-1.98l2.18,-0.55l0.33,-1.4l-0.68,-1.65l-1.0,-1.39l-2.33,-0.06l-1.52,1.68l-3.32,0.51l-0.54,-0.04l1.79,-0.88l0.38,-0.89l-0.41,-0.19l-2.5,0.39l-1.4,1.14l-3.13,1.23l-0.09,-0.81l0.81,-0.93l0.26,-0.87l-1.06,-0.72l0.71,-1.43l0.38,-2.46l0.91,-0.72l1.92,-0.23l1.84,-0.8l1.15,-0.92l1.32,-2.0l0.85,-0.25l6.59,0.37l4.7,-0.19l0.87,-0.89l0.05,-1.5l1.42,-3.39l0.99,-1.16l0.05,-0.83l-1.48,-0.71l0.56,-0.88l-0.75,-3.24l-1.15,-0.75l-1.32,-0.29l0.66,-2.06l0.97,-0.98l1.32,0.21l1.24,-0.24l0.55,-0.79l-0.46,-0.75l-3.05,-1.04l-0.67,-1.1l2.55,-0.9l2.44,-2.38l0.59,-0.98l0.29,-2.27l-0.93,-1.24l0.0,-0.89l0.48,-1.04l-0.19,-0.6l-1.1,-0.62l-2.1,0.5l-1.11,-0.07l-4.22,-2.69l-2.18,-0.27l-1.68,-1.95l-2.29,0.57l-1.31,-0.1l-3.55,-2.2l-2.76,-0.26l-2.75,-1.57l-0.96,0.15l-0.52,0.67l-0.27,1.26l-1.02,0.25l-4.43,-3.2l-1.26,-1.76l-0.43,-1.51l-2.37,-2.21l-1.25,-0.09l-2.82,1.16l-5.06,1.07l-1.8,1.38l-1.54,-1.19l-1.77,-0.29l-0.86,0.24l-2.57,-2.23l-3.27,-0.48l-2.82,1.54l-0.78,-0.28l-0.55,-1.12l-0.87,-0.5l-0.93,-1.26l-0.22,-1.05l0.59,-1.13l0.05,-1.0l-1.71,-4.08l0.2,-1.4l-0.59,-0.56l-1.82,-0.2l-1.28,-2.53l-1.34,-0.09l-3.09,0.57l-3.48,-1.19l-3.31,-0.13l0.6,-0.53l0.05,-0.87l-0.67,-0.61l-0.33,-3.21l-1.12,-1.87l3.23,-0.64l0.55,-0.61l0.0,-0.97l-3.92,-3.8l-1.29,-3.11l-1.31,-1.82l-1.46,-1.24l-1.22,-0.58l-3.97,0.16l-2.31,-0.36l-1.88,0.24l-3.41,1.53l-1.13,0.06l-3.96,-1.0l-1.1,0.01l-1.26,0.77l-1.12,2.87l-1.95,1.02l-1.83,0.07l-2.57,-0.94l-1.01,-2.05l-1.46,-1.55l0.1,-3.65l0.34,-0.73l-1.14,-1.49l-0.07,-0.9l0.58,-0.74l-0.03,-0.72l-3.96,-4.55l1.74,-2.86l3.22,-0.09l0.87,0.25l1.6,1.49l4.17,0.24l3.89,-2.22l0.66,-1.14l2.95,-1.12l0.33,-0.34l-0.01,-1.77l-0.42,-0.68l-2.85,-1.77l-0.46,-0.97l0.32,-0.71l-0.24,-1.09l-3.51,-1.67l-5.53,-0.36l0.81,-2.03l0.17,-1.22l-0.27,-0.89l-0.58,-0.55l-5.16,-2.56l-1.32,-1.67l-0.7,-1.81l-0.87,-1.23l-1.36,-0.72l0.98,-1.81l-0.1,-0.74l-4.72,-2.93l0.42,-2.0l2.05,-2.77l-0.32,-1.87l-1.9,-2.6l0.05,-0.6l1.12,-1.46l0.08,-3.3l-0.53,-0.83l-2.18,-0.5l-1.25,-0.82l-2.4,-2.33l-3.18,-1.13l-4.11,0.02l-2.57,1.41l-1.63,0.4l-1.8,1.13l-1.34,-1.48l0.57,-1.78l-0.08,-0.77l-0.47,-0.67l-4.05,-1.61l-2.03,0.38l-1.98,1.08l-0.45,-0.15l-1.32,-1.91l-1.12,-0.71l-2.41,0.01l-1.23,0.67l-1.72,-1.42l0.66,-2.19l-1.34,-5.48l-1.33,-1.21l-0.23,-0.85l-1.3,-1.81l-0.13,-1.47l-0.53,-0.78l-0.98,-0.41l-1.57,0.36l0.75,-1.97l0.11,-1.54l0.56,-1.41l0.95,-1.24l0.0,-2.12l-0.62,-0.74l-3.35,-2.1l-0.53,-1.63l-1.92,-0.42l0.56,-2.1l1.17,-1.07l0.68,-1.41l2.69,-0.77l0.62,-0.66l-0.15,-0.75l-1.29,-1.03l-0.25,-0.99ZM839.77,569.8l0.52,-1.77l0.2,-0.15l-0.05,0.27l-0.67,1.65ZM899.6,16.61l-2.0,-0.34l-2.83,-1.88l-1.01,-1.83l-1.09,-4.31l0.19,-2.63l1.79,-3.28l2.86,-1.69l0.94,-0.24l1.14,0.26l0.0,15.94ZM876.14,73.02l0.21,2.01l-0.66,0.74l-0.24,0.08l-0.33,-1.19l-0.64,-0.65l-0.52,-0.04l-2.34,1.72l-1.18,1.96l-2.78,2.6l-9.54,2.71l-3.15,0.22l-2.87,-1.58l-1.59,-3.11l-0.47,-2.2l0.54,-5.26l1.18,-1.69l2.86,-2.1l2.82,-1.37l1.38,-0.33l3.54,-0.05l12.57,5.98l1.2,1.55ZM845.18,538.87l0.05,0.13l-0.04,-0.11l-0.0,-0.02ZM773.82,130.4l-2.37,-0.89l-0.14,-0.5l1.66,0.08l0.85,1.31ZM680.69,164.88l0.44,1.89l-0.38,0.81l0.1,0.76l-0.3,0.19l-1.11,-1.48l-0.96,-0.18l-0.66,-0.6l-0.26,-0.83l0.78,0.0l1.48,-0.81l0.85,0.25ZM462.42,381.37l1.54,-1.19l1.4,-1.73l1.15,-2.18l0.41,-3.11l1.51,-0.56l4.02,0.06l1.67,-0.82l1.32,-1.22l-0.78,0.82l0.13,0.64l1.12,0.5l1.36,0.19l1.61,0.71l1.47,0.13l2.74,-0.62l0.3,-0.33l0.62,-5.86l1.56,-0.18l2.23,1.46l4.3,1.78l2.74,0.72l6.55,0.09l0.88,1.63l2.48,1.71l-1.92,5.56l-0.04,1.46l0.9,2.13l-41.29,-1.79Z", "name": "Russia"}, "IQ": {"path": "M769.91,675.97l1.17,-0.32l2.43,-1.88l1.62,-1.8l2.14,0.7l2.18,-0.64l5.65,1.89l2.23,0.28l2.17,0.06l2.52,-1.4l1.11,0.16l0.83,0.64l0.18,0.58l0.15,3.05l0.46,0.58l0.73,0.22l4.54,-3.07l1.44,0.14l0.7,1.33l1.11,4.09l1.9,1.66l0.44,3.45l0.92,1.14l1.3,0.24l0.34,0.47l1.87,5.47l1.7,0.13l0.93,0.43l1.05,0.7l1.02,1.36l0.91,0.37l2.36,-0.19l2.95,0.22l1.02,0.52l-3.02,1.16l-0.94,2.4l0.1,1.03l1.81,2.35l0.53,1.79l-0.2,0.76l-2.83,1.51l-3.29,3.52l-0.49,3.31l-1.56,-0.11l-0.45,0.37l-0.83,2.43l1.39,3.18l-0.16,0.8l-1.75,2.72l0.01,0.42l1.1,0.79l3.52,4.81l1.93,-0.05l-0.15,1.37l0.29,0.52l1.3,0.3l0.44,0.68l1.64,2.7l-0.87,2.07l0.18,1.76l0.37,0.47l3.71,0.52l2.55,1.41l7.44,5.52l2.38,-0.03l0.92,0.6l1.86,4.01l1.15,1.05l3.08,4.2l-1.97,5.7l-0.02,6.07l0.38,0.4l4.1,0.17l0.06,7.42l1.89,1.01l1.11,1.43l1.41,0.53l0.78,1.13l0.01,1.25l0.51,1.15l0.94,0.8l-1.53,-0.15l-2.99,-1.26l-1.09,-0.01l-1.4,0.7l-3.84,-1.51l-4.69,0.24l-1.57,0.59l-1.64,1.31l-2.86,6.32l-1.82,2.77l-3.1,3.57l-2.18,0.44l-22.08,-1.91l-25.0,-19.18l-10.65,-8.75l-23.1,-12.86l-15.84,-2.68l1.37,-1.24l0.11,-0.44l-0.61,-1.61l-0.45,-0.25l-2.45,0.58l-0.56,-1.75l0.64,-0.19l0.27,-0.49l-3.76,-12.97l25.61,-14.41l3.27,-0.82l0.88,-0.74l2.94,-5.45l0.29,-7.95l0.42,-2.08l1.45,-3.37l-0.04,-2.77l-1.42,-3.99l0.21,-2.94l0.44,-1.63l1.46,-1.83l5.1,-1.34l4.02,-3.57l3.6,-3.65l0.22,-0.71Z", "name": "Iraq"}, "IS": {"path": "M0.4,178.74l0.0,-1.19l0.28,0.28l-0.28,0.91ZM0.4,176.09l0.0,-19.93l2.4,-1.1l1.7,-0.3l3.0,0.56l1.13,0.59l0.69,1.09l0.47,0.16l1.25,-0.35l0.48,0.46l0.02,0.45l-0.66,1.81l-1.49,0.63l-0.34,0.8l1.16,1.47l0.98,0.15l-0.05,0.56l-1.32,0.87l0.08,0.68l2.26,1.05l0.04,1.17l-0.86,0.89l-1.6,0.06l-1.18,0.49l-0.2,0.53l0.29,1.5l-0.28,1.01l-1.25,1.61l-2.28,1.39l-2.02,-0.19l-1.14,-0.44l-0.54,0.41l0.11,1.26l-0.87,0.65ZM0.4,155.26l0.0,-3.68l0.83,-0.08l0.79,2.01l-1.63,1.75Z", "name": "Iceland"}, "AL": {"path": "M458.49,624.1l0.68,0.32l0.52,-0.18l0.25,-0.48l-0.24,-1.33l-1.36,-2.97l1.67,-4.37l-0.07,-2.75l0.32,-2.07l-0.52,-3.06l0.7,-2.04l1.06,-1.29l0.08,-2.58l-1.64,-1.44l-1.53,-0.24l0.23,-2.81l0.98,0.15l0.61,-0.73l-1.53,-3.1l4.14,-5.38l0.14,1.72l0.8,0.94l1.32,-0.11l2.49,-1.0l2.19,3.21l2.39,1.18l1.42,1.52l0.76,3.92l-1.02,3.37l0.14,2.01l-0.9,1.2l0.57,2.03l-0.01,2.05l1.13,2.43l1.16,1.07l0.79,2.18l0.74,0.47l2.31,-0.02l0.26,0.53l-0.07,1.35l0.98,2.2l-0.97,1.82l-2.02,0.9l-1.22,2.5l-0.81,2.73l-0.5,0.4l-2.65,0.53l-1.34,1.13l-0.18,0.98l0.92,1.95l-0.95,0.1l-0.49,1.55l-0.64,0.55l-2.3,-0.88l-0.5,-2.33l-1.56,-2.79l-5.08,-2.79l-1.08,-1.11l-0.61,-1.17Z", "name": "Albania"}, "IT": {"path": "M306.09,527.3l1.78,-1.15l1.79,-1.7l0.38,-0.01l0.0,2.35l0.39,0.92l2.51,2.32l2.26,0.58l-0.51,0.84l0.07,0.5l1.36,1.23l0.36,1.05l1.03,0.61l0.95,-0.26l0.54,-0.68l-0.54,-2.46l3.31,-4.51l0.17,-3.16l0.27,-0.16l1.28,0.23l0.67,1.99l0.92,0.96l1.59,0.19l2.14,-0.87l1.7,-0.27l1.26,1.93l0.98,0.35l0.84,-0.3l0.31,-0.66l-0.48,-1.86l-0.93,-1.88l0.56,-1.69l1.03,-0.25l1.07,0.92l1.23,0.3l1.39,-0.33l0.12,-1.32l-0.53,-0.86l0.59,-2.75l2.77,0.16l0.85,0.81l1.18,0.42l2.31,-0.03l0.73,-0.56l1.37,-2.23l1.33,-0.6l3.77,-0.37l3.33,0.19l5.13,-1.58l-0.68,0.99l0.28,1.2l3.39,4.2l1.31,0.54l9.34,1.7l4.37,0.3l2.39,0.5l-0.11,0.38l-3.71,2.45l-0.42,1.14l0.72,1.27l1.07,-0.01l1.62,0.59l-1.84,1.75l-0.19,0.73l0.54,0.98l1.22,0.01l-0.54,1.93l0.36,0.78l-1.47,0.98l-3.63,-0.93l-2.36,2.23l-1.64,0.43l-1.99,1.14l-3.29,1.28l0.8,-1.07l-1.15,-0.24l-1.93,0.95l-1.23,0.99l-0.67,3.48l0.91,0.9l1.39,2.72l1.66,1.19l-0.65,1.62l-0.77,0.56l-0.88,-0.49l-0.92,0.33l-0.41,1.83l0.76,5.03l1.32,3.61l1.28,1.54l2.76,2.31l2.98,1.26l5.22,3.86l2.9,1.25l0.66,0.58l1.7,2.91l1.49,3.4l1.62,5.37l1.23,2.78l2.38,3.05l4.88,4.3l4.4,3.12l4.29,2.0l3.26,0.34l7.53,-0.42l2.39,0.6l0.24,0.97l-0.38,0.67l-3.17,2.21l-0.18,2.38l1.61,1.29l7.3,3.28l7.46,2.74l2.27,1.36l2.76,2.2l6.42,2.94l1.11,1.44l3.91,3.08l1.7,2.28l0.3,1.64l-1.71,4.1l-1.3,-0.38l-1.78,-1.25l-3.15,-5.61l-5.21,-0.55l-1.02,-0.38l-1.67,-0.84l-0.59,-1.34l-0.79,-0.46l-2.01,-0.17l-1.64,0.95l-3.65,5.31l-1.89,4.43l-0.14,1.92l1.31,2.14l3.01,0.95l2.28,1.48l1.42,1.46l0.11,3.71l0.65,2.09l-0.74,0.9l-1.94,-0.28l-2.65,0.79l-2.0,1.48l-0.94,1.69l0.2,3.42l-0.33,1.13l-3.54,2.52l-1.87,2.56l-1.09,2.11l-4.06,0.04l-0.87,-1.22l-0.03,-1.98l0.65,-1.15l1.75,-0.82l1.12,-2.84l-0.3,-2.11l0.54,-0.75l0.52,-0.55l2.9,-0.7l0.32,-0.37l0.18,-2.87l-1.43,-1.55l-1.14,-5.2l-2.27,-4.3l-1.22,-3.84l-0.98,-1.97l-1.82,-1.22l-3.78,-0.25l-4.53,-2.63l-0.17,-0.69l0.75,-1.36l-1.08,-2.88l-1.07,-1.38l-1.28,-0.67l-4.63,0.8l0.88,-1.13l-0.46,-1.0l-1.89,-0.99l-2.75,-0.23l-0.43,0.22l-0.03,-0.73l-2.54,-4.18l-1.92,-1.87l-1.09,-0.32l-1.45,0.34l-4.14,-0.9l-2.16,0.68l-0.35,-0.2l-0.31,-0.6l-2.37,-1.74l-2.98,-1.01l-5.67,-5.48l-1.75,-2.07l-3.65,-2.33l-2.36,-3.39l-1.96,-1.27l-2.74,-0.98l-2.13,0.48l0.88,-0.72l-0.33,-1.49l-3.11,-3.33l-1.85,-1.11l-1.4,-2.23l-2.36,-0.46l0.05,-3.7l-0.99,-2.75l-1.72,-2.36l-1.03,-5.61l-0.93,-1.74l-1.9,-1.2l-4.34,-1.37l-5.93,-3.59l-1.39,-0.12l-3.64,-1.41l-2.23,-0.24l-3.22,1.38l-3.51,3.48l-2.85,3.59l-0.94,0.63l-3.6,1.2l-2.77,0.5l-0.11,-1.04l2.19,-2.65l0.39,-0.9l-0.55,-1.68l-0.96,-0.28l-3.0,0.66l-0.58,-0.14l-4.65,-2.3l-0.8,-0.82l-0.26,-0.71l0.2,-0.75l-0.61,-1.26l1.41,-2.42l1.0,-0.77l-0.46,-2.17l-0.92,-0.77l-1.87,-0.41l-0.68,-0.51l-0.19,-0.82l-1.23,-2.0l0.54,-0.27l2.16,0.07l1.81,-1.29l1.33,-0.43l1.23,-2.95l-0.1,-0.39l-1.86,-1.65l-1.78,-2.84l-1.02,-0.7l-0.03,-1.21l2.62,-1.64l1.52,0.64l2.74,-0.55l2.79,-1.08l3.49,0.9l2.81,-1.61l1.89,-2.54l0.07,-0.89l-0.5,-0.93ZM363.7,565.89l-0.02,0.45l0.8,0.86l1.1,-0.35l0.42,-1.12l-0.15,-0.61l-0.45,-0.3l-1.11,0.28l-0.6,0.79ZM381.53,535.83l1.58,1.4l0.32,0.85l-0.4,0.08l0.05,-0.55l-1.55,-1.79ZM406.78,657.96l-1.42,2.53l-3.31,4.45l-1.83,5.1l0.22,2.17l1.34,1.24l-0.41,0.3l-0.08,0.57l1.49,1.71l0.07,0.48l-0.01,0.44l-2.03,1.92l-0.54,1.74l0.13,1.16l-2.53,-0.51l-1.6,0.18l-3.49,-1.28l-1.84,-2.71l-3.08,-2.07l-3.35,-0.01l-7.22,-3.81l-2.58,-2.04l-1.81,-0.46l-1.69,-1.02l-2.3,0.05l-1.38,-0.37l-1.44,-1.1l-1.11,-2.08l1.41,-3.39l1.55,-0.85l0.7,-0.79l1.23,1.47l1.07,0.59l2.11,-0.82l0.29,-0.86l1.15,-0.77l1.61,-0.02l0.59,0.12l0.56,0.87l1.46,0.38l2.5,1.56l1.64,0.37l3.57,-0.93l3.16,0.37l3.01,-0.45l1.89,-0.64l2.03,-1.27l4.48,0.21l0.95,-0.35l0.59,-0.61l1.54,-0.09l2.06,-1.12l1.03,0.08l-0.37,0.35ZM384.19,618.41l0.02,-0.05l0.31,0.09l-0.18,0.04l-0.14,-0.08ZM358.21,680.29l0.48,0.16l0.18,0.38l-0.64,-0.31l-0.02,-0.23ZM336.9,584.52l-0.16,0.87l-0.71,-0.33l-2.4,0.32l-0.12,-0.29l2.89,-0.24l0.5,-0.33ZM307.75,616.0l0.86,0.72l2.19,0.38l3.33,-1.01l1.79,-0.98l2.33,-2.51l1.52,-0.57l1.25,-1.66l0.82,0.82l0.84,0.09l1.28,0.67l1.77,1.99l-0.54,1.02l0.07,0.46l1.66,1.73l1.62,4.9l-2.18,3.78l0.86,3.94l-1.21,10.49l-0.69,2.77l-0.7,0.28l-2.82,-1.16l-1.72,0.25l-1.03,-0.57l-0.63,0.27l-0.44,3.02l-0.67,1.12l-0.99,0.69l-0.91,0.04l-1.96,-0.27l-0.55,-0.46l-2.32,-3.69l-0.25,-4.18l0.64,-1.3l0.09,-2.37l0.53,0.16l0.66,-0.55l0.1,-1.65l-0.78,-1.21l-1.15,-0.39l0.02,-1.42l0.64,-0.73l0.21,-0.85l0.02,-2.69l-0.87,-1.14l-0.82,-2.44l-2.12,-2.31l-0.11,-1.75l0.39,-1.75ZM309.77,644.67l0.71,0.34l-0.33,0.67l-0.36,-0.48l-0.02,-0.53ZM308.32,612.92l0.1,-0.18l0.14,-0.07l-0.06,0.1l-0.19,0.16Z", "name": "Italy"}, "GG": {"path": "M161.17,471.95l0.51,-0.24l-0.15,0.36l-0.36,-0.11Z", "name": "Guernsey"}, "CZ": {"path": "M360.26,457.39l1.19,1.01l0.6,1.08l0.65,0.07l2.33,-2.93l1.17,-0.69l2.88,-0.65l2.52,0.38l1.09,-1.48l2.01,-0.32l0.92,-1.17l1.6,-0.76l0.75,0.3l0.81,-0.32l1.06,-1.52l1.95,-0.22l2.67,-0.8l6.37,-2.45l0.37,-0.51l-0.15,-0.48l-1.0,-0.65l-0.25,-0.73l2.97,0.56l0.95,1.47l0.08,1.06l1.75,0.8l0.83,-0.18l0.54,-0.61l2.25,-0.51l0.25,-0.32l0.04,-1.86l2.94,0.83l0.28,1.28l1.19,1.39l5.16,1.32l2.81,1.21l0.78,0.97l3.92,-0.66l0.89,0.52l0.57,0.52l-0.41,0.79l-1.8,1.04l-0.5,1.03l0.46,0.7l1.32,0.49l2.02,2.0l1.45,2.2l0.85,0.53l0.79,0.04l4.41,-2.77l-0.02,-0.68l-1.44,-2.27l3.1,0.77l3.73,2.22l1.99,-0.18l1.8,-0.62l-0.09,1.16l-1.49,0.59l-0.24,0.49l0.61,0.9l0.8,0.34l2.0,2.05l0.71,0.26l1.72,-0.47l0.64,-0.55l0.67,0.66l2.73,1.36l0.82,-0.21l2.07,0.44l0.44,0.29l0.4,2.01l2.89,2.63l0.27,1.23l-2.96,0.35l-2.54,1.84l-0.69,0.93l-2.64,1.32l-0.88,1.57l-0.32,1.96l-2.18,1.01l-2.08,1.92l-1.71,0.77l-1.83,0.23l-3.89,-0.57l-0.97,0.38l-1.15,1.21l-1.27,2.45l-0.71,-1.29l-2.26,-0.52l-2.32,-1.09l-1.21,-0.03l-1.45,1.01l-3.91,-0.26l-3.07,-1.87l-1.85,0.01l-5.23,-1.96l-1.92,0.46l-1.3,-0.84l-1.15,-0.1l-0.71,0.65l-0.56,3.35l-1.36,0.07l-1.59,1.81l-0.23,1.07l-2.49,-0.4l-0.95,0.24l-0.75,0.6l-2.22,-0.04l-1.68,-0.37l-0.85,-1.54l-2.34,-1.31l-3.62,-3.34l-1.57,-0.02l-1.9,-2.36l-2.01,-1.08l-3.04,-3.02l-1.53,-0.08l-1.62,-1.36l-2.41,-3.9l-1.35,-1.5l1.34,-1.87l0.16,-1.15l-0.82,-1.14l-2.45,-1.54l-0.83,-0.87l-1.54,-3.16Z", "name": "Czech Rep."}, "CY": {"path": "M638.64,705.94l1.16,0.89l1.95,0.45l3.68,-1.29l2.54,0.16l0.67,0.66l0.1,1.37l0.4,0.41l0.95,-0.52l2.07,0.25l2.53,-1.09l1.62,0.44l0.2,0.42l-4.21,0.2l-2.73,2.59l-1.27,0.8l-4.76,1.16l-0.65,0.68l-0.17,0.86l-0.37,-0.04l-0.44,-0.88l-0.64,-0.39l-2.49,0.12l-3.1,-1.14l-1.67,-3.23l-0.14,-1.24l0.94,0.23l2.25,-1.62l1.59,-0.25Z", "name": "Cyprus"}, "IM": {"path": "M132.24,388.26l0.75,-2.11l1.12,-0.81l1.38,-1.96l1.15,-0.38l0.45,1.96l-0.91,1.44l-2.48,2.13l-1.47,-0.27Z", "name": "Isle of Man"}, "GB": {"path": "M113.96,338.69l0.76,-0.5l2.21,-0.36l1.99,-1.42l-0.04,-0.68l-1.32,-0.72l1.38,-0.78l1.96,-2.74l0.47,-2.7l-1.5,-2.39l-1.71,-0.79l-0.08,-1.23l3.03,-1.74l-0.26,-0.39l-1.21,-0.45l-0.73,-1.5l0.65,-2.05l1.0,-1.76l3.29,0.06l0.77,-0.52l1.74,0.44l0.45,-0.58l-3.36,-3.49l0.78,-1.43l0.07,-1.57l4.31,-0.43l0.23,-0.54l-1.06,-2.23l0.29,-2.53l0.56,-0.77l0.99,-0.34l1.4,0.28l1.48,1.26l2.8,-1.1l1.06,1.04l3.28,-0.87l9.91,-1.18l2.63,-0.65l2.44,0.26l-0.8,1.82l-0.05,2.13l-1.23,1.57l-10.63,7.27l-0.65,2.19l0.34,0.47l1.91,0.38l-2.8,2.5l-0.76,1.94l0.39,0.55l3.68,-0.45l6.27,-2.1l1.36,-0.03l3.53,0.74l2.45,-0.39l8.27,0.22l2.28,-0.41l1.34,0.44l1.16,1.15l1.11,2.31l-3.19,4.11l-0.97,3.09l-2.28,4.56l-2.22,2.52l-2.22,3.23l-2.32,1.42l-3.73,0.66l-3.51,1.63l-0.28,0.45l0.41,0.33l1.52,-0.05l1.56,-0.44l2.58,-0.15l2.76,1.33l-0.19,0.79l-1.05,0.82l-2.98,0.24l-2.66,2.16l-2.31,0.93l-4.34,-0.66l-1.23,-0.59l-0.51,0.14l0.07,0.52l1.15,0.99l1.42,0.59l7.65,1.24l3.03,-1.41l3.04,-0.02l5.97,2.31l4.23,4.34l2.32,1.88l3.11,10.18l1.77,4.74l0.84,1.38l1.25,1.09l6.44,2.77l4.05,4.17l3.43,2.71l-0.61,0.48l-0.7,1.43l0.53,1.56l3.18,4.99l-1.41,-0.05l-2.85,-1.73l-2.54,0.37l-2.69,-0.14l-0.39,0.36l0.31,0.43l2.37,0.55l2.55,0.05l5.56,4.03l1.86,2.35l1.07,3.0l-0.66,1.22l-3.4,3.22l0.1,0.61l3.39,1.82l1.62,-0.4l2.3,-2.51l1.81,-0.17l4.72,0.34l4.26,1.15l3.6,2.48l0.73,1.26l0.39,3.59l-2.05,6.21l-2.28,2.13l-1.08,0.57l-1.17,-0.2l-0.37,0.34l0.56,2.12l-0.93,0.6l-1.03,0.28l-2.15,-0.35l-2.75,1.41l0.05,0.73l1.83,0.67l0.25,0.48l-0.38,1.04l-1.05,0.51l-3.93,0.66l-1.21,0.67l-0.17,0.49l0.47,0.24l1.3,-0.31l0.71,0.22l0.53,0.99l0.71,0.48l2.88,0.53l6.79,-0.18l-0.22,2.8l-0.29,0.32l-4.27,1.9l-1.27,2.12l-2.49,-0.05l-1.13,0.82l-6.31,2.15l-5.54,-0.91l-3.4,0.08l-4.47,0.79l-4.58,-1.39l-2.07,-0.23l-1.73,-0.69l-0.47,0.14l0.01,0.49l0.8,0.98l-1.99,1.05l-4.6,0.55l-2.19,-0.18l-0.41,0.53l0.75,1.52l-0.44,0.12l-4.19,-0.6l-0.73,0.12l-0.59,0.52l-1.26,-0.25l-3.18,-1.6l-1.68,-0.3l-1.51,0.11l-5.7,1.65l-1.16,1.64l-1.29,3.9l-1.15,1.29l-1.24,0.15l-5.47,-2.89l-1.51,0.6l-2.84,0.32l-3.11,0.94l-3.89,2.36l-1.47,2.11l-1.08,0.22l-1.33,-1.05l-1.5,-0.38l-2.58,0.83l-0.13,-0.76l0.96,-0.96l3.14,-0.92l2.75,-2.29l1.87,-2.16l1.56,-0.78l0.4,-0.8l3.82,-3.56l0.77,-3.42l3.09,-1.03l1.41,-2.78l4.4,-0.65l3.11,0.04l3.18,0.57l3.46,-0.2l1.38,-0.88l2.16,-2.8l3.93,-3.65l2.13,-2.38l0.01,-0.52l-0.51,-0.1l-1.44,0.82l-2.72,2.03l-3.22,0.78l-4.1,2.61l-3.44,-0.4l-2.62,-2.19l-1.93,-1.02l-3.91,0.43l1.53,-1.32l-0.33,-0.33l-2.45,-0.4l-1.58,-1.07l-3.01,0.07l-3.99,1.96l-3.21,-1.78l-0.02,-1.23l-0.45,-0.96l-0.53,-0.33l0.67,-0.79l1.19,-0.77l2.83,-0.84l6.67,-2.8l2.32,-1.5l1.06,-1.03l1.33,-2.69l0.92,-1.17l-0.2,-0.63l-0.75,-0.24l-0.29,-0.65l0.5,-1.83l-1.03,-2.09l0.2,-1.56l-0.4,-0.48l-3.5,0.34l-3.14,1.52l-0.8,0.1l0.49,-0.83l3.18,-2.28l1.77,-2.32l2.07,-1.33l4.52,-1.59l1.65,0.17l4.19,-0.89l2.99,1.55l0.45,-0.06l0.11,-0.44l-0.79,-2.12l0.75,-0.33l1.96,2.14l0.94,0.25l1.55,-0.32l0.31,-0.32l-0.78,-0.79l-1.61,-0.37l-0.67,-0.62l-1.19,-2.12l0.06,-1.14l1.75,-2.59l-0.2,-0.62l-1.19,-0.59l0.05,-1.98l1.74,-1.15l0.72,-3.51l-0.69,-1.04l-1.82,0.15l-2.03,0.77l-1.98,-1.77l-3.26,-4.33l-0.27,-1.6l1.64,-3.73l2.53,-2.38l3.04,-0.85l0.29,-0.39l-0.29,-0.39l-5.49,-0.22l-1.65,0.31l-1.57,1.06l-1.72,0.45l-2.24,1.6l-2.18,0.01l-1.0,-1.04l-0.84,-0.18l-3.46,1.62l-3.89,-1.59l-0.98,0.57l-0.72,1.99l-1.08,-0.89l-1.34,-1.73l-0.45,-2.0l0.37,-0.24l0.61,0.34l0.56,-0.2l1.21,-3.01l3.27,-5.07l0.68,-1.8l-0.1,-1.0l-0.6,-1.02l-2.2,-1.88l0.25,-3.01l0.63,-0.99l2.88,0.03l0.39,-0.31l-0.22,-0.45l-3.27,-1.98l0.55,-1.71l-0.12,-0.45l-0.46,-0.04l-1.81,2.55l-2.04,0.67l-0.54,0.96l-1.03,0.34l0.28,-2.24l0.57,-0.88l2.39,-2.19l0.05,-0.53l-0.52,-0.11l-1.22,0.72l-2.72,2.09l-1.84,1.98l-0.11,1.04l0.59,2.29l-0.16,0.98l-2.29,7.14l-0.67,0.9l-1.13,-0.06l-0.3,-0.72l1.15,-4.25l2.4,-3.65l-0.54,-0.36l-1.04,0.13l0.17,-4.37l0.74,-1.57l0.27,-2.18l1.89,-4.93l0.89,-0.94l0.21,-1.12l1.66,-2.66l-0.05,-0.45l-0.94,0.08l-5.72,4.12l-2.59,-0.52l-0.82,-0.71l-0.4,-1.5l-0.37,-0.3l-1.51,-0.14ZM185.23,257.4l-0.57,2.18l-0.53,-0.03l-0.06,-1.73l0.74,-0.02l0.42,-0.4ZM181.84,263.06l-0.93,-1.45l0.79,-1.92l0.62,0.04l0.08,0.26l-0.75,0.66l0.18,2.41ZM175.48,263.77l0.8,-0.37l1.06,-1.31l0.86,-0.15l0.22,2.56l0.58,0.28l0.4,-0.21l1.17,1.26l0.91,-0.16l-1.6,5.88l-0.26,2.05l-0.62,0.77l-0.43,1.39l-0.23,-0.2l1.01,-3.9l-0.25,-1.08l-0.77,-0.9l-1.95,0.21l-0.43,-0.99l-1.48,-0.05l-0.32,-0.39l2.03,-0.14l1.62,-0.82l0.19,-0.49l-1.01,-2.76l-1.52,-0.49ZM176.06,450.33l1.54,-0.47l0.94,-0.65l2.53,0.99l-0.75,0.49l-0.48,0.82l-0.59,0.15l-0.6,0.0l-2.6,-1.33ZM161.65,288.97l-0.68,0.01l0.29,-0.43l0.71,-0.23l0.87,0.07l-1.19,0.59ZM155.52,287.6l0.37,-0.11l1.33,1.02l-1.5,-0.66l-0.2,-0.25ZM157.96,289.51l1.02,0.29l-0.03,0.18l-0.74,0.32l-0.25,-0.78ZM154.57,293.13l-0.26,0.62l0.38,0.54l3.28,0.45l0.39,0.27l-0.24,0.55l-0.56,0.19l-1.92,-0.95l-2.24,0.39l-0.45,-0.22l-0.26,-1.19l-0.58,-0.1l-0.79,0.43l0.01,-1.32l0.41,-1.08l0.57,-0.18l1.09,0.13l1.3,0.68l0.27,0.34l-0.41,0.45ZM156.3,298.56l-0.02,-0.02l-0.47,-0.75l0.7,-0.11l-0.2,0.87ZM152.48,297.94l-0.45,-0.01l-1.04,-1.0l-0.33,-0.85l1.05,0.14l0.77,1.71ZM139.15,402.89l0.66,0.42l0.9,0.03l-3.54,2.21l-0.41,-0.53l-0.84,-0.13l-0.91,-1.28l-0.16,-1.92l1.09,-0.46l1.73,0.03l1.49,1.64ZM126.81,362.52l-1.32,0.01l-1.07,-0.48l-0.74,-2.34l0.77,-1.35l0.64,-0.11l0.96,0.74l0.71,1.66l0.05,1.87ZM89.64,377.21l2.06,-0.03l2.54,-1.08l1.47,-2.17l0.71,-2.42l2.02,-1.34l0.58,0.54l1.33,0.1l1.07,-0.74l1.03,-1.76l3.17,-0.18l3.03,-0.89l1.24,-0.01l3.2,0.46l1.08,1.18l0.71,2.2l1.58,2.13l2.0,1.81l0.06,0.77l-2.04,1.18l-0.22,1.17l0.55,0.37l1.77,-0.56l1.9,0.16l0.59,0.65l0.71,2.04l-0.07,0.41l-0.62,-0.98l-1.49,-0.75l-0.51,0.48l0.32,1.28l-0.13,1.73l0.21,0.38l0.95,0.23l-0.41,1.14l-3.0,0.79l-1.45,2.64l-0.91,0.58l-3.72,-0.8l-1.47,0.62l-2.99,0.05l0.16,-1.49l-0.39,-0.7l-1.83,-0.6l-0.68,-0.91l-0.33,-1.22l-2.04,-1.57l-0.85,0.07l-2.1,2.01l0.44,1.34l-2.24,1.85l-3.2,-0.35l-1.07,-0.82l-2.16,-0.48l-0.53,-1.29l-3.24,-2.76l1.06,-0.79l3.34,-1.08l0.67,-0.52l0.24,-0.59l-0.22,-0.47l-1.93,-1.02ZM107.25,322.58l2.76,-0.68l0.52,-1.27l0.92,0.27l0.97,1.14l0.26,1.42l-0.24,1.95l0.61,2.1l1.01,0.62l2.54,0.39l2.3,-0.1l0.21,0.31l-3.16,2.98l-0.73,0.23l-0.24,-2.65l-0.48,-0.35l-2.96,0.32l-0.61,-0.28l-1.79,-2.49l-3.03,-0.66l-0.76,-0.83l-0.17,-0.38l0.46,-0.56l0.82,0.18l0.99,-0.58l-0.18,-1.09ZM115.15,355.7l-0.57,-0.07l-0.11,-1.03l1.95,-1.32l-0.03,-0.72l-0.51,-0.21l0.28,-0.48l1.95,-1.22l-2.96,5.05ZM117.67,345.53l-5.05,1.0l-1.53,-0.08l1.83,-0.73l0.62,-2.57l-0.21,-0.45l-2.18,-1.11l0.09,-0.39l2.25,-0.74l1.95,2.0l2.41,0.81l-0.19,2.26ZM108.88,357.59l0.29,-1.38l0.53,-0.67l0.58,-0.27l0.79,0.24l1.94,-1.18l0.86,3.47l-0.29,0.84l-2.15,0.87l0.34,-0.95l-0.39,-0.98l0.18,-0.71l-0.36,-0.57l-0.93,0.13l-1.38,1.15ZM101.24,313.58l0.69,-0.49l-0.15,-0.72l-1.04,-0.51l-0.13,-0.81l0.1,-0.64l0.69,-0.72l1.74,0.86l2.01,-0.12l0.46,-0.5l-0.77,-1.86l6.85,-3.74l0.24,2.18l-1.59,3.17l-0.74,0.23l-0.53,0.78l-1.74,0.9l-0.21,0.45l0.38,0.31l1.47,0.02l-0.0,0.7l-1.99,1.51l-1.51,0.67l-1.42,1.51l-0.92,0.18l-1.2,1.33l-0.95,-0.75l2.61,-1.89l0.17,-0.55l-2.55,-1.49ZM110.97,333.63l-0.49,0.1l-0.68,-0.67l0.84,-0.35l0.46,0.45l-0.13,0.47ZM107.25,340.41l0.28,-0.27l0.09,-0.02l-0.03,0.04l-0.34,0.26ZM94.96,321.31l0.35,-0.38l1.03,0.14l2.35,-0.64l1.01,0.72l-0.88,1.32l-1.56,-0.01l-2.3,-1.16ZM97.75,330.67l-1.08,-0.23l-0.4,-1.03l0.09,-3.19l1.14,0.03l0.25,4.41ZM94.61,333.73l0.68,-0.43l0.37,0.2l-0.96,0.26l-0.09,-0.03Z", "name": "United Kingdom"}, "NL": {"path": "M253.59,437.43l-2.97,-1.02l-2.62,0.56l-1.62,-0.68l-1.47,-0.1l-1.42,-1.16l0.85,-0.48l2.54,-0.12l1.8,0.37l3.39,2.09l2.12,-0.24l0.2,-0.64l-0.47,-0.58l-2.47,-1.11l1.43,-0.15l0.27,-0.65l-0.68,-1.16l-2.31,-2.26l1.63,-2.95l1.7,-1.21l3.78,-4.65l1.1,-2.5l1.57,-6.67l1.03,-2.07l1.57,0.51l2.02,-0.83l0.61,2.01l1.67,1.87l-0.05,0.7l-2.39,1.05l0.04,3.12l-0.71,1.48l0.08,0.43l0.54,0.48l6.51,1.6l4.06,-3.19l1.17,-1.37l-0.04,-1.42l-0.47,-1.01l-2.62,-0.56l-0.29,-0.33l0.01,-1.58l0.57,-0.88l-0.05,-0.97l-0.42,-0.31l-1.44,0.1l-1.37,-0.36l-0.26,-2.86l-0.66,-0.7l1.23,-2.18l1.06,-0.92l4.53,-1.92l2.48,-0.57l10.0,-0.62l2.06,2.06l2.83,0.79l-0.08,4.82l-1.86,4.58l-0.24,1.67l-3.47,0.08l-0.9,0.62l0.09,0.93l-0.34,0.85l0.87,1.38l1.41,0.52l1.7,-0.01l0.65,0.85l-0.19,1.84l-0.5,0.96l-3.48,2.4l-0.14,0.97l1.13,1.12l-0.6,0.76l-2.86,0.97l-1.43,-0.0l-0.68,0.49l-2.7,-0.95l-2.27,0.9l-0.97,0.89l0.08,0.97l1.83,2.21l0.1,0.74l1.31,1.87l0.06,0.56l-0.41,1.55l-1.26,2.49l0.11,0.92l0.53,0.33l-2.23,1.63l-0.78,-0.07l-0.53,0.48l0.1,0.74l0.47,0.55l1.53,0.63l0.41,0.58l-0.61,2.27l-2.94,-0.14l-0.55,-0.2l-0.58,-0.96l1.23,-1.32l0.21,-1.07l0.9,-1.7l0.16,-0.82l-0.5,-0.82l-2.66,-0.92l-1.81,-1.56l-2.38,0.42l-1.15,-0.3l-1.39,-1.09l-0.5,-1.76l-0.54,-0.52l-0.49,0.01l-1.1,1.02l-1.05,0.07l-0.27,-0.73l-0.84,-0.78l-0.46,0.02l-1.54,1.17l-1.75,-0.93l-1.73,0.91l0.02,1.19l-1.77,-0.51ZM266.73,419.97l4.64,-2.99l1.49,-0.51l0.91,0.08l0.98,0.62l-0.3,0.84l-3.91,2.86l-0.85,0.06l-2.96,-0.97ZM261.97,407.06l-1.02,0.99l-0.51,-0.25l0.29,-0.71l1.25,-1.06l-0.0,1.03ZM252.8,438.41l-2.05,1.53l-1.75,0.66l-0.79,-0.07l-2.0,-1.12l-1.46,-0.21l-1.89,0.74l-0.5,-0.59l-0.29,-1.11l2.7,-0.27l3.98,0.8l1.77,-0.7l1.2,0.56l1.08,-0.22ZM246.76,431.92l0.8,-0.2l1.99,0.12l1.26,0.97l-1.02,0.24l-1.64,-1.11l-1.39,-0.02Z", "name": "Netherlands"}, "AD": {"path": "M219.01,589.34l-1.45,0.73l-1.49,0.29l-0.26,-1.45l0.13,-0.56l0.71,-0.55l2.52,0.57l0.23,0.3l-0.38,0.67Z", "name": "Andorra"}, "IE": {"path": "M90.89,378.81l-3.74,1.39l-1.45,1.19l0.42,1.29l3.08,2.4l0.64,1.39l2.29,0.51l1.07,0.82l3.68,0.38l2.78,-2.26l0.09,-0.46l-0.49,-0.95l1.7,-1.62l0.3,0.02l1.51,1.24l0.25,1.06l0.9,1.22l1.92,0.73l-0.18,1.5l0.56,0.74l3.31,-0.04l1.44,-0.63l0.9,0.09l0.42,0.48l-0.42,0.31l-1.28,-0.03l-0.65,0.73l-0.03,0.85l0.37,1.23l0.72,0.86l0.98,3.58l0.72,1.21l0.15,3.21l-0.29,0.63l1.44,5.05l0.23,2.85l-1.88,3.39l-0.67,3.57l-1.65,2.44l-1.46,0.93l-0.11,0.65l1.47,1.41l-0.98,0.51l-1.52,0.23l-1.77,-0.43l-1.26,0.04l-1.48,0.84l-1.01,-1.55l-0.81,1.62l-0.81,0.37l-1.8,-0.09l-4.3,0.86l-1.41,1.95l-3.3,1.02l-1.16,1.29l-1.3,0.66l-0.96,0.18l-1.89,-1.33l-1.79,-0.0l-0.38,0.32l0.85,0.97l-0.0,1.56l-1.6,0.5l-1.42,0.95l-1.89,0.26l-1.2,0.95l-6.41,1.53l-2.25,-0.55l-4.24,0.91l1.2,-1.54l2.33,-1.17l0.24,-0.3l-0.24,-0.64l-0.89,-0.15l-4.32,0.76l-2.08,0.72l3.75,-2.46l0.67,-0.73l1.96,-0.87l0.21,-0.5l-0.49,-0.25l-6.49,1.84l-1.48,-0.2l-0.69,-0.54l-1.02,0.19l-0.29,-0.71l1.77,-1.7l1.09,-0.77l2.7,-1.08l0.66,-0.93l-0.19,-0.58l-0.79,-0.28l-5.39,0.07l0.29,-0.66l1.81,-1.08l0.94,-0.17l2.66,0.8l2.24,-0.23l0.34,-0.28l-0.13,-0.43l-0.8,-0.65l-0.15,-1.36l-0.44,-0.48l1.55,-0.82l1.69,-1.42l7.68,-1.31l3.72,-1.07l0.29,-0.38l-0.28,-0.39l-1.81,-0.57l-0.84,-0.73l-0.56,0.03l-1.42,1.55l-0.92,0.54l-2.82,0.31l-2.44,-0.63l-2.93,1.34l4.73,-3.84l0.96,-1.34l0.03,-0.41l-0.67,-0.88l1.86,-2.33l0.63,-0.41l3.33,-0.7l1.03,-0.9l-0.13,-0.67l-2.91,-0.82l-5.03,0.23l-0.66,-0.44l-0.24,-0.84l-0.5,-0.44l-2.92,0.12l0.68,-0.6l-0.2,-0.69l-3.69,-0.25l0.42,-0.62l-0.05,-0.58l-0.65,-0.76l4.96,-0.86l0.35,-0.37l-0.29,-0.42l-2.28,-0.83l0.06,-0.78l1.9,-0.9l2.21,-0.43l0.31,-0.49l-0.01,-1.2l-0.35,-0.48l-2.28,-0.21l-1.79,0.38l0.68,-2.03l-0.0,-1.79l-0.53,-0.33l-0.58,0.2l-0.57,-1.72l-0.49,-0.19l-1.0,0.37l0.02,-0.42l0.33,-0.58l0.58,-0.24l2.28,0.12l1.54,-0.59l2.01,-0.14l3.2,0.18l2.2,1.59l1.01,-0.26l1.2,-1.11l5.47,1.04l0.81,-0.19l0.26,-0.48l-0.31,-1.16l-0.59,-0.71l1.72,-1.42l3.26,-1.22l1.44,-2.62l-0.38,-0.63l-4.28,0.58l-3.56,-1.15l1.06,-0.91l1.46,-0.4l0.38,-0.61l1.96,-1.47l-0.31,-1.74l0.19,-0.79l0.94,-0.8l0.56,-1.44l3.44,-0.89l2.63,-0.09l0.63,0.24l0.54,-0.43l-0.11,-0.78l0.77,-0.09l1.01,1.4l0.13,0.65l-0.89,1.03l-0.02,0.6l0.31,0.29l-0.67,0.73l-0.03,0.5l0.48,0.14l2.51,-1.47l0.1,-1.18l-0.63,-1.96l0.14,-0.75l0.6,-0.48l2.01,-0.31l0.26,-0.64l-0.46,-0.62l4.0,2.13l-5.2,3.61l-1.07,2.91l-1.25,1.9l-2.3,0.96l-1.79,-0.12l-0.73,0.44l-0.03,0.88l1.97,1.2ZM58.58,390.24l-0.12,-0.01l0.03,-0.02l0.09,0.03ZM59.81,390.39l1.03,0.02l0.27,0.15l0.07,0.94l-1.37,-1.11Z", "name": "Ireland"}, "ES": {"path": "M254.04,632.3l-3.94,-1.74l-1.35,-0.22l-0.04,-0.91l2.42,-0.17l2.05,0.62l1.1,1.67l-0.24,0.75ZM238.42,633.32l0.24,0.47l1.3,0.53l1.55,-0.43l0.59,0.12l0.47,0.17l0.11,0.64l-2.84,4.75l-2.01,1.18l-3.5,-1.26l-0.53,-1.7l-0.91,-0.82l-1.18,-0.19l-1.55,1.01l-0.31,-0.47l-1.13,-0.56l0.01,-0.32l5.41,-3.72l1.56,-0.82l3.06,-0.88l-0.05,0.57l0.37,0.41l-0.66,1.31ZM92.06,569.39l1.24,0.54l1.33,-0.16l1.25,0.64l1.99,1.73l2.72,0.67l2.32,-0.51l11.02,-0.15l3.16,-0.8l2.44,1.01l4.7,0.48l2.86,0.85l7.95,1.43l2.93,0.01l5.68,-1.37l1.65,0.32l2.21,-0.66l0.92,0.12l1.48,0.98l5.04,1.32l1.61,-1.14l0.81,-0.2l3.51,0.66l3.74,1.41l1.98,0.1l2.78,-0.38l2.23,-0.92l0.61,1.08l0.69,0.42l3.89,0.99l-0.15,1.08l-0.77,1.27l0.05,0.44l0.81,0.66l1.08,0.03l0.59,-0.74l0.3,0.36l4.78,1.81l2.21,0.15l2.36,2.24l1.74,0.09l2.28,-0.43l3.46,2.21l3.36,-0.44l0.82,0.42l5.1,0.05l0.52,-0.55l0.4,-1.99l8.51,2.44l0.9,1.31l0.03,2.1l0.64,0.81l1.32,-0.09l2.19,-0.97l2.73,1.13l1.03,1.2l0.88,0.03l2.1,-1.03l6.04,1.29l0.84,-1.12l2.55,-0.78l0.93,-0.16l3.01,0.58l1.08,1.68l-1.81,0.71l-0.22,1.53l1.19,1.45l0.12,2.0l-3.1,2.69l-9.36,4.85l-3.06,2.87l-6.91,1.47l-7.23,2.16l-4.46,3.93l0.14,0.7l1.0,0.28l0.97,0.99l-1.93,1.07l-1.87,0.41l-3.13,4.72l-5.94,7.08l-3.43,5.7l-0.07,1.95l1.73,5.72l1.03,1.55l1.35,1.24l2.56,1.08l0.41,0.67l-3.15,2.44l-4.43,2.35l-1.98,1.93l-0.48,1.83l-1.34,0.98l-0.48,2.46l-1.79,3.56l-0.11,0.91l1.16,1.29l-0.26,0.21l-2.08,0.34l-5.26,0.16l-4.45,2.78l-2.27,2.58l-1.89,4.41l-2.23,2.52l-0.74,0.35l-1.6,-1.09l-1.99,-0.18l-2.05,0.39l-1.14,0.95l-1.39,0.45l-1.51,-0.42l-3.39,-0.24l-1.6,0.06l-2.22,0.71l-1.95,-0.48l-3.37,-0.25l-7.44,0.61l-1.11,0.41l-3.08,2.86l-3.53,0.09l-3.2,1.21l-1.0,0.94l-1.34,2.13l-0.35,1.21l-0.96,-0.07l-0.5,1.29l-1.82,0.61l-2.32,-0.9l-2.02,-1.42l-1.1,-0.16l-2.35,-3.46l-0.56,-2.6l-1.61,-0.8l-0.28,-1.07l1.01,-1.65l1.59,-1.37l-0.41,-0.31l-1.41,0.08l-0.96,0.94l-1.11,-1.58l-5.05,-3.55l0.19,-1.23l-0.7,-0.22l-1.27,1.12l-2.7,-0.15l-2.76,0.4l-1.22,-5.84l0.75,-2.07l2.03,-2.76l1.34,-1.45l2.35,-0.79l0.9,-2.3l-0.45,-0.59l-1.76,0.15l-2.97,-4.03l0.8,-3.78l3.1,-2.95l0.63,-1.46l0.03,-1.41l-0.83,-0.95l-1.59,-0.4l-1.69,-3.01l-0.39,-1.95l-1.57,-1.32l-0.92,-1.48l5.19,-0.2l1.22,-0.59l0.9,-1.43l0.9,-2.28l0.23,-1.44l-0.4,-0.91l-1.43,-1.44l0.17,-0.44l2.06,-1.45l0.76,-1.07l-0.54,-1.44l0.45,-3.47l-0.24,-1.98l-0.33,-1.74l-0.89,-1.95l1.97,-1.35l1.13,-1.68l1.61,-1.38l2.16,-1.14l1.61,-1.33l1.17,-1.66l-0.43,-1.18l-1.01,-0.82l-1.24,-0.43l-1.88,-0.09l-0.11,-3.05l-0.36,-0.8l-0.88,-0.56l-1.06,0.12l-1.76,-0.47l-0.6,0.3l-2.06,-0.08l-1.77,-0.47l-0.81,0.53l-0.24,0.98l-2.33,0.85l-1.37,-0.03l-2.54,-0.85l-3.23,0.12l-2.87,1.11l-0.62,-1.01l1.22,-2.06l-1.12,-1.87l-1.06,-0.33l-4.56,1.4l-2.58,1.82l-0.72,0.16l-0.18,-2.32l2.52,-2.6l-0.12,-0.66l-1.4,-0.22l1.06,-1.44l-0.13,-0.55l-0.91,-0.75l-0.01,-2.73l-0.53,-0.28l-2.47,0.81l-0.02,-0.66l1.44,-2.26l-0.32,-0.5l-1.45,-0.24l-1.05,-0.76l-1.33,-1.66l0.7,-2.84l1.99,-1.02l1.91,-1.47l2.77,0.27l1.74,-0.34l2.56,-1.02l1.67,-1.08l-0.05,-0.95l-0.41,-0.69l0.23,-0.35l3.26,-1.81l2.09,-0.23l1.93,-0.88ZM215.68,646.86l-0.59,0.91l-1.81,-0.41l0.26,-0.64l0.7,-0.46l0.03,-0.65l0.46,-0.57l2.59,-0.57l0.4,0.32l0.08,0.41l-1.53,1.47l-0.58,0.19ZM215.76,650.29l0.42,0.46l-0.55,0.0l0.12,-0.46ZM10.49,799.23l-0.91,0.89l-0.44,-0.15l0.76,-2.17l3.26,-1.23l0.83,-1.22l-0.52,2.63l-2.98,1.26ZM1.51,811.6l2.36,-1.45l3.21,-7.29l0.46,-0.35l0.91,0.01l0.27,0.45l-0.01,1.41l-0.47,2.51l-0.8,2.08l-3.46,1.17l-1.83,1.6l-0.64,-0.13Z", "name": "Spain"}, "ME": {"path": "M446.17,589.02l1.19,-0.97l0.28,-0.68l-0.09,-0.72l-1.0,-1.61l-0.28,-2.92l0.33,-0.4l1.75,-0.24l0.34,-0.4l-0.02,-1.54l0.64,-1.55l2.2,-1.75l0.74,0.07l0.92,0.94l0.98,-0.46l0.08,-1.33l-1.22,-2.13l0.13,-0.28l1.2,0.35l1.26,-0.26l0.56,1.35l2.57,1.71l2.74,2.81l2.41,1.12l2.14,0.45l5.14,2.95l0.06,0.52l-1.49,0.4l-0.45,0.68l-1.62,-0.06l-0.66,0.62l0.72,1.91l-0.19,0.92l-3.36,1.16l-0.38,-0.46l-0.16,-1.84l-0.88,-0.44l-0.81,0.44l-3.96,5.48l-0.67,0.29l-2.57,-0.2l-0.31,0.65l1.59,1.94l1.69,0.84l-0.04,2.91l-1.44,-0.88l-0.9,-1.82l-3.09,-3.07l-3.52,-2.1l0.23,-0.58l-0.34,-0.59l-1.52,0.19l-0.92,-1.42Z", "name": "Montenegro"}, "MD": {"path": "M557.32,492.49l2.3,-1.33l5.13,0.23l1.53,-1.02l1.05,0.19l1.71,-0.95l3.49,0.95l0.98,0.89l2.02,0.78l0.72,1.12l1.08,0.35l1.68,-0.01l0.39,0.23l-0.18,0.59l0.23,0.62l1.14,0.03l0.57,0.96l0.6,-0.0l0.78,-0.88l2.88,0.47l1.15,1.98l0.95,0.93l0.99,0.32l1.65,-0.6l0.82,1.24l0.21,1.73l-0.32,1.86l-0.84,2.16l0.18,1.06l0.34,0.58l2.43,1.47l0.73,0.86l1.97,0.87l-0.38,2.88l0.67,0.87l0.19,1.51l2.11,1.48l2.08,0.9l0.74,1.52l-0.07,3.42l2.43,1.71l-0.33,0.31l-2.9,0.38l-0.99,-1.27l-0.81,-0.32l-1.41,0.81l-2.02,-0.91l-1.01,0.26l-0.87,-0.4l-0.6,0.12l-0.62,1.14l-0.1,-1.81l-0.5,-0.51l-0.54,-0.05l-2.77,1.21l-0.63,0.95l0.04,1.05l0.21,1.4l0.76,1.71l-0.7,1.95l-1.19,1.08l-1.44,0.68l-0.35,1.64l-3.14,3.05l0.03,2.48l-2.33,0.21l-1.08,0.59l-1.37,-1.88l0.96,-0.86l-0.81,-5.48l0.26,-2.72l1.68,-5.25l-0.27,-1.13l0.22,-2.18l-2.29,-5.92l-3.04,-2.49l-1.16,-1.93l-2.06,-1.92l-2.22,-3.63l-1.52,-1.5l-2.47,-5.44l-2.4,-3.49l-1.17,-1.03l-1.54,-0.77l-1.63,-0.15Z", "name": "Moldova"}, "SY": {"path": "M688.58,715.55l1.05,-1.15l-0.02,-0.54l-0.85,-0.79l-1.19,-0.32l-0.77,0.7l-3.37,0.05l-1.09,-4.51l0.03,-1.63l0.7,-2.46l-0.54,-3.2l-1.83,-2.35l0.95,-4.01l0.54,-0.78l3.38,1.25l0.95,-1.76l2.03,-1.2l0.35,-2.44l1.08,-0.58l2.14,-0.21l0.34,-0.34l0.03,-0.68l-1.35,-2.89l0.77,-3.61l0.59,-1.27l3.45,0.62l0.6,0.84l1.34,0.85l4.98,0.14l10.3,-4.01l3.17,0.57l3.24,2.24l1.17,0.4l8.17,0.19l4.49,-0.89l4.49,-1.37l9.31,-4.22l3.29,-0.17l5.23,0.59l7.48,-1.35l2.34,-0.77l1.79,-1.38l1.15,0.83l0.5,2.24l-3.51,3.56l-3.92,3.48l-5.11,1.35l-1.75,2.23l-0.47,1.77l-0.22,3.11l1.45,4.17l0.02,2.43l-1.41,3.24l-0.45,2.21l-0.29,7.92l-2.74,5.07l-0.58,0.53l-3.32,0.85l-25.93,14.59l-26.35,15.86l-5.76,-0.99l-2.04,-1.6l-2.14,-0.6l-1.38,-1.96l-0.84,-0.71l-1.22,-0.32l1.56,-2.74l-0.55,-2.18l0.5,-0.94l-0.93,-2.78l0.39,-1.37l2.24,-2.38l-0.11,-0.56l-1.05,-0.91l0.27,-0.75l1.48,-1.32l3.25,0.08l0.54,-0.28l0.11,-0.6l-1.13,-0.94l0.89,-1.07l1.43,-0.74l1.78,-2.59l-1.07,-3.53l-0.79,-0.7l-1.29,-0.53Z", "name": "Syria"}, "TN": {"path": "M307.74,684.93l2.01,-1.55l1.07,-2.02l2.03,-1.09l0.2,-0.37l-0.22,-1.31l3.07,-0.89l4.22,-3.01l7.26,-2.23l1.49,0.34l-0.57,1.45l0.63,1.19l0.6,0.12l0.89,-0.72l-0.1,-1.06l2.33,0.05l1.17,0.56l-0.09,2.42l1.91,2.69l-0.46,1.09l0.2,0.52l1.61,0.77l1.82,-0.95l0.78,-1.37l2.61,-0.81l2.42,-1.94l0.9,-0.13l0.78,2.46l-0.74,0.43l-1.21,1.53l-2.26,3.83l-2.01,1.09l-1.66,1.55l-0.6,1.18l-0.19,1.36l0.44,2.44l1.22,2.34l1.33,1.35l1.38,0.5l2.76,1.97l0.54,4.43l0.95,1.42l-3.28,5.24l-2.33,3.1l-2.06,2.0l-5.65,4.06l-0.84,1.22l-0.35,1.24l0.16,1.41l1.49,3.14l2.07,1.97l2.34,1.1l3.01,-0.35l0.18,2.26l0.41,0.33l2.45,-0.3l0.86,-1.25l1.23,0.69l0.84,2.78l1.37,0.98l-0.54,0.42l0.07,0.66l1.93,0.64l0.91,-0.2l1.02,0.47l-0.59,4.01l-0.07,3.89l1.09,1.89l0.02,0.58l-0.32,0.69l-9.08,4.95l-0.8,0.93l-2.17,1.36l-0.98,2.0l-0.8,0.87l-2.17,0.44l-0.67,0.46l-1.59,2.14l-0.64,1.5l1.73,6.43l0.17,2.32l-0.49,1.11l-4.25,5.77l-4.56,2.08l-6.37,-27.15l-0.45,-0.6l-9.14,-6.49l-0.39,-2.21l-1.26,-3.48l-1.38,-2.03l-0.66,-0.65l-2.67,-1.25l-1.79,-1.28l-3.1,-8.44l0.17,-3.55l3.04,-2.5l1.28,-2.41l3.79,-2.31l1.05,-1.39l0.76,-1.5l0.87,-5.24l1.08,-1.79l-0.99,-3.33l0.01,-3.87l-0.96,-2.29l1.36,-8.77l-0.69,-1.49l-1.2,-0.63ZM347.9,712.06l0.6,-0.51l-0.01,0.19l-0.59,0.31ZM344.37,727.35l-1.12,0.49l-1.48,-0.57l0.19,-1.69l1.96,-0.06l1.27,1.1l-0.82,0.72Z", "name": "Tunisia"}, "MA": {"path": "M30.01,812.59l4.18,-1.13l5.87,-2.65l1.71,-1.08l4.75,-4.89l8.04,-5.17l3.97,-4.75l6.19,-8.54l1.1,-2.4l0.59,-3.61l-0.4,-1.58l-1.69,-2.43l-1.08,-0.65l-0.22,-0.82l0.57,-1.93l0.32,-8.52l1.76,-4.17l4.46,-5.7l0.84,-2.4l0.55,-4.87l5.42,-5.14l4.34,-4.99l2.81,-1.81l10.0,-4.03l5.65,-2.89l3.43,-2.22l2.0,-2.55l5.45,-9.82l5.77,-15.36l3.91,-0.64l2.98,-1.5l0.72,0.19l-0.38,0.51l0.05,1.92l1.2,2.08l2.05,2.31l3.73,2.92l2.91,1.17l4.04,0.69l4.83,-1.25l2.58,-0.02l1.25,-0.49l1.38,0.75l2.65,0.25l2.66,-0.42l2.08,-1.25l0.82,-0.9l0.15,0.85l1.49,2.81l3.12,0.43l2.85,-0.16l2.48,0.27l0.39,1.04l0.8,0.9l4.47,3.3l-0.7,2.2l1.5,1.89l-0.75,1.72l1.13,2.87l0.19,2.72l-0.28,3.25l1.1,3.25l-0.61,3.85l0.73,2.05l1.0,1.67l0.54,2.89l0.86,1.53l4.61,3.56l0.44,0.9l-2.25,1.97l-0.29,1.23l0.47,2.08l-16.17,-0.47l-5.66,0.83l-1.23,0.75l-1.05,2.92l-5.55,1.89l-2.13,0.25l-1.37,-0.19l-1.83,0.61l-0.52,1.76l0.81,3.01l-0.53,2.73l0.29,0.47l2.47,1.45l-0.02,0.64l-0.4,0.4l-4.29,0.74l-4.53,3.17l-6.11,2.16l-2.61,1.31l-3.0,4.55l-1.49,1.54l-2.01,1.45l-7.39,1.83l-2.84,0.3l-3.75,-0.09l-0.47,0.41l-0.26,2.15l-0.86,0.99l-7.23,-0.64l-1.44,0.74l-3.29,2.63l-2.8,0.69l-13.3,9.41l-0.37,1.61l-0.0,8.73l-48.32,0.0Z", "name": "Morocco"}, "AX": {"path": "M473.44,272.85l0.15,-0.05l0.84,0.08l0.31,0.31l-0.62,0.06l-0.68,-0.41ZM466.69,267.18l1.25,-0.06l2.01,1.49l-0.63,0.99l-0.79,-0.15l-1.25,0.46l-0.31,1.73l-2.69,0.2l-0.49,-0.23l-0.9,-2.44l0.11,-0.4l0.54,-0.21l0.06,1.04l0.47,0.37l0.84,-0.15l0.32,-0.29l0.34,-1.72l-1.05,-1.11l0.25,-0.39l0.48,-0.17l0.58,0.75l0.84,0.28ZM461.9,270.08l-0.55,0.17l-0.39,0.42l0.16,-1.31l0.49,-0.02l0.28,0.74Z", "name": "Aland"}, "RS": {"path": "M452.45,533.14l1.41,-0.57l0.68,-0.79l0.8,0.43l1.93,-0.29l2.06,-1.11l1.45,-1.49l0.91,-0.19l3.1,0.39l1.26,-0.26l3.52,0.55l2.01,2.54l2.9,1.71l1.75,2.28l0.78,-0.01l-0.05,3.72l0.4,0.78l3.18,2.51l1.75,0.56l1.1,0.84l2.7,0.79l0.59,0.54l-0.89,1.5l-0.59,0.16l-0.38,0.58l0.52,0.87l1.88,0.81l-2.09,0.34l-0.26,0.39l0.32,0.95l2.16,0.6l1.55,1.33l1.5,0.52l2.22,0.24l1.43,0.69l1.25,1.38l1.65,-0.41l1.95,-1.85l1.75,-0.44l2.72,1.5l-2.07,0.47l-0.94,1.17l-0.06,1.13l0.49,0.96l1.71,1.18l0.39,0.86l-0.82,0.68l-0.41,1.88l-2.37,1.2l-0.77,2.48l0.04,1.45l1.83,4.55l0.75,1.06l2.94,1.72l1.29,1.71l1.37,0.92l-0.36,1.06l-3.07,3.34l-1.91,0.1l-1.49,0.81l-0.37,0.83l0.32,0.92l-0.37,2.03l0.49,1.4l0.78,0.91l-1.33,2.11l-0.79,0.18l-1.59,-0.67l-2.38,0.83l-2.12,-0.25l-2.26,0.89l-1.99,0.33l-0.41,-0.94l1.19,-0.88l1.62,-3.36l0.31,-1.02l-0.21,-0.67l-4.64,-1.26l-0.05,-1.36l-2.12,-1.27l-0.24,-0.7l-2.28,-2.26l-2.82,-1.32l-0.6,-1.42l-1.02,-0.04l-2.04,1.13l-0.19,0.7l0.51,1.44l-0.26,0.47l-2.07,1.44l-0.22,0.82l0.25,0.56l-1.01,0.29l-0.25,-0.85l-0.97,-0.7l-4.42,-2.41l-2.27,-0.5l-2.24,-1.04l-2.63,-2.73l-2.59,-1.73l-0.26,-0.89l0.64,-0.66l1.1,-0.11l1.31,0.51l0.77,-0.71l0.28,-1.06l-0.17,-1.2l-3.13,-4.0l3.68,-0.06l0.68,-0.49l0.14,-0.84l-3.44,-3.31l-2.76,-1.62l0.3,-2.92l1.91,-2.86l0.89,-2.97l-0.3,-0.61l-1.61,-0.6l-1.79,0.3l0.22,-0.98l-0.44,-2.37l0.55,-0.15l0.3,-0.53l0.62,0.27l2.5,-0.09l0.48,-0.45l0.05,-0.62l-1.26,-1.31l-3.08,-1.11l-1.0,-0.88l0.03,-0.83l0.71,-1.15l-1.87,-1.28l0.32,-1.03l-1.29,-2.78l0.59,-0.56l0.11,-0.78Z", "name": "Serbia"}, "GE": {"path": "M784.54,611.83l-0.76,-1.01l-2.62,-0.36l-0.55,-0.47l0.19,-0.88l-0.3,-0.31l-3.3,-2.6l-1.11,-0.43l-0.39,-0.99l-0.78,-0.5l-2.24,0.05l-0.68,0.47l-1.14,1.7l-3.31,-0.73l-3.88,-0.15l-1.48,0.99l-3.47,-1.13l2.28,-2.71l0.8,-1.96l0.06,-2.48l-1.37,-3.02l-2.42,-8.45l-1.12,-1.42l-3.79,-1.43l-0.96,-1.69l-3.05,-2.18l-5.09,-1.37l-6.22,-4.3l1.14,-1.72l0.67,-0.21l4.88,0.93l1.79,-0.33l5.79,2.58l3.71,0.68l3.13,1.9l6.35,0.48l3.16,-0.62l1.75,0.06l2.12,1.14l2.57,-0.23l2.81,1.14l0.22,0.73l1.3,1.05l6.33,2.37l2.95,1.55l-0.57,1.05l-0.08,1.0l1.35,0.87l1.91,0.11l7.5,-2.98l1.65,0.2l1.55,1.79l0.68,-0.05l1.02,-2.02l3.72,1.25l2.66,2.4l2.91,-0.1l1.16,0.27l0.67,0.41l-1.2,3.69l0.22,0.96l2.81,1.55l1.54,1.25l3.5,0.76l2.55,1.31l-1.38,1.69l-1.56,0.55l-0.27,0.7l0.09,1.35l0.97,0.62l0.74,1.51l4.2,2.62l0.57,0.72l-0.54,1.72l-1.1,1.01l-0.83,0.24l-3.72,-2.0l-2.09,0.44l-3.02,-0.87l-1.04,-0.78l0.19,-0.56l-0.24,-0.51l-5.94,-1.82l-1.18,0.5l-3.17,2.29l-2.14,0.28l-0.35,0.38l0.09,0.4l-4.29,0.31l-3.36,-0.35l-5.9,1.33l-4.31,0.3Z", "name": "Georgia"}, "MK": {"path": "M474.73,600.43l1.84,0.11l0.77,-0.95l0.41,-2.59l3.6,-1.54l0.89,-0.05l1.45,1.15l0.65,0.06l0.91,-1.54l0.63,-0.43l3.04,-0.35l3.83,-1.29l2.05,0.27l2.47,-0.84l1.15,0.64l3.2,3.37l3.36,1.73l1.43,3.49l0.79,0.71l-0.73,1.84l-0.29,3.94l-1.61,0.11l-0.61,0.4l-0.51,2.18l-2.81,0.86l-4.12,-0.64l-2.65,0.45l-1.15,0.53l-1.97,2.45l-2.56,1.2l-2.24,-0.57l-1.23,0.65l-4.43,0.26l-0.63,-0.82l-2.8,-0.25l-0.69,-2.04l-1.23,-1.16l-1.01,-2.21l0.03,-1.94l-0.54,-1.92l0.88,-0.93l-0.14,-2.11l0.57,-2.22Z", "name": "Macedonia"}, "_0": {"path": "M468.27,588.8l0.23,-1.37l-0.65,-1.57l1.63,0.09l0.64,-0.79l3.47,-1.07l0.27,-0.76l-0.2,-0.76l1.92,-1.27l0.5,-0.84l0.09,-0.77l-0.53,-1.12l1.94,-0.92l0.57,1.37l2.88,1.35l2.08,2.07l0.36,0.86l2.01,1.18l-0.14,1.06l0.28,0.43l4.61,1.19l-1.88,4.11l-1.1,0.71l-0.15,0.66l0.36,0.88l-1.96,0.42l-0.92,0.68l-0.55,1.19l-1.39,-1.12l-1.4,-0.04l-3.95,1.66l-0.58,1.06l-0.11,1.91l-0.39,0.51l-1.14,-0.15l0.02,-2.13l-1.26,-3.52l-1.98,-1.52l-1.4,-0.49l-2.18,-3.22Z", "name": "Kosovo"}, "SK": {"path": "M500.77,479.11l-1.87,2.96l-1.25,3.22l-2.01,1.99l-0.31,2.95l-4.92,0.82l-2.04,-2.5l-1.79,-1.11l-5.18,0.8l-2.74,-0.69l-3.02,-0.07l-2.16,0.4l-2.33,4.1l-5.07,2.52l-0.54,0.2l-3.78,-1.55l-1.02,0.28l-1.32,1.71l-2.51,0.6l-4.72,0.38l-1.81,0.92l-0.78,1.39l0.31,1.5l-0.48,0.75l-7.62,0.4l-5.11,-0.11l-1.61,-0.64l-4.24,-3.08l-2.48,-0.39l-0.57,-0.39l-2.93,-5.85l-0.03,-0.76l1.02,-1.78l0.6,-2.24l1.91,-2.7l0.52,-0.25l3.98,0.55l2.05,-0.28l1.8,-0.81l2.23,-2.01l1.68,-0.56l0.65,-0.61l0.43,-2.18l0.57,-1.15l2.66,-1.33l0.77,-1.01l2.28,-1.67l3.08,-0.34l1.14,0.17l0.33,1.5l0.41,0.33l2.45,-0.07l1.61,-2.02l2.35,-1.35l2.39,3.22l1.74,0.5l0.15,1.44l-0.41,1.13l0.26,0.48l0.62,0.21l1.69,-0.45l1.76,0.64l0.5,-0.22l0.65,-1.5l0.65,-0.68l2.54,-1.15l3.34,-0.11l1.37,0.34l1.03,0.74l2.12,0.22l1.03,-0.55l0.93,-1.21l3.46,-0.19l3.82,0.29l3.33,1.17l0.91,0.68l0.88,1.68l6.66,2.34Z", "name": "Slovakia"}, "MT": {"path": "M392.86,695.09l-1.11,0.1l-0.87,-0.59l-0.01,-0.91l0.71,0.18l1.27,1.23ZM389.04,692.13l0.21,-0.04l0.18,0.07l-0.23,0.07l-0.16,-0.09Z", "name": "Malta"}, "SI": {"path": "M403.55,537.43l-0.58,0.35l-0.27,0.83l0.66,1.7l-0.87,0.28l-1.64,-0.15l-2.27,-0.83l-1.45,0.51l-0.51,-0.13l-1.81,-1.47l-0.69,-1.19l-0.57,-0.36l-0.96,0.41l-1.35,2.21l-0.59,0.31l-3.71,0.06l-1.44,-0.5l-1.46,1.32l-3.29,-0.75l1.3,-1.09l1.84,-0.21l0.49,-0.85l-0.67,-1.21l-1.48,-1.36l-1.86,-0.9l0.48,-2.39l-0.56,-0.5l-1.19,-0.12l1.78,-1.87l0.27,-0.99l-2.22,-1.02l-1.0,-0.0l0.01,-1.09l3.6,-2.33l0.41,-0.89l11.42,1.93l2.8,-1.68l1.79,-1.78l4.24,-0.61l3.12,0.21l2.64,-1.17l1.66,-0.2l2.52,0.56l0.72,-0.63l0.04,-1.7l0.63,-0.57l0.61,-0.25l2.29,0.09l0.53,2.01l0.65,0.7l0.07,0.9l1.15,1.32l-1.92,-0.14l-1.21,0.94l0.08,1.7l-2.19,0.06l-1.02,1.18l-0.8,0.41l-4.2,1.44l-0.66,1.31l0.16,0.75l0.85,0.93l-0.17,2.79l-4.88,2.01l-0.16,0.91l0.87,0.78Z", "name": "Slovenia"}, "SM": {"path": "M364.94,566.32l-0.44,-0.16l0.66,-0.49l0.03,0.12l-0.25,0.53Z", "name": "San Marino"}, "SA": {"path": "M801.29,795.83l22.3,1.94l2.42,-0.47l11.93,1.54l1.07,2.01l0.82,3.04l1.28,1.55l10.51,-0.0l2.36,5.77l1.07,1.38l-182.09,0.0l-1.93,-1.27l-4.77,-0.63l-1.07,0.62l2.14,-5.61l0.28,-3.21l1.97,-8.93l14.03,2.34l0.86,-0.15l5.68,-4.42l3.13,-5.01l0.56,-0.41l9.76,-1.98l2.48,-5.01l4.37,-2.43l0.11,-0.62l-6.78,-7.56l-6.58,-6.75l26.47,-7.36l2.49,-1.91l16.32,2.74l22.97,12.79l10.58,8.7l25.26,19.32Z", "name": "Saudi Arabia"}, "UA": {"path": "M498.0,491.01l-0.48,-1.02l-1.33,-0.03l0.12,-2.21l2.03,-2.04l1.28,-3.28l1.97,-3.28l3.26,0.94l0.74,-0.39l0.29,-0.58l-0.19,-0.78l-1.79,-1.47l0.38,-2.03l-1.1,-4.12l0.67,-1.03l4.44,-5.13l5.0,-4.82l4.04,-3.54l3.4,-0.56l1.92,-2.52l0.04,-1.69l-0.66,-1.88l-0.81,-1.03l1.47,-0.7l0.01,-0.92l-1.58,-1.38l-1.64,-3.3l-2.62,-3.2l0.21,-1.47l-0.93,-2.1l-0.01,-1.45l0.96,-0.36l1.05,0.07l2.34,0.92l2.54,-1.53l2.07,-1.98l1.02,-1.59l6.69,-0.55l2.72,-0.57l11.49,0.31l11.46,2.58l4.83,0.31l2.07,2.73l4.29,0.01l0.86,0.38l-0.14,1.19l0.77,0.66l0.82,-0.23l1.34,-1.78l2.03,0.55l0.94,-0.09l1.34,-0.76l5.34,1.07l0.77,1.59l1.25,0.46l1.86,-1.96l1.65,-0.54l1.52,-0.99l0.7,0.66l1.68,3.01l0.73,0.64l3.14,-0.84l8.01,-0.78l1.77,1.25l0.48,1.44l1.57,0.92l1.44,0.22l1.62,-2.14l-0.44,-2.15l-0.87,-2.05l0.63,-1.52l1.11,-2.21l1.14,-1.4l2.98,-2.67l1.15,-0.48l2.04,0.41l1.64,-0.95l2.97,-0.05l2.73,0.15l2.68,0.97l2.06,-0.07l2.35,-1.21l1.22,-2.99l0.71,-0.45l4.96,0.99l1.41,-0.1l3.31,-1.5l1.76,-0.22l2.23,0.36l3.78,-0.19l2.3,1.56l1.21,1.65l1.4,3.29l3.74,3.5l-0.11,0.61l-3.31,0.63l-0.34,0.35l-0.02,0.88l1.11,1.58l0.4,3.4l0.62,0.53l-0.81,1.11l0.12,0.5l0.5,0.29l3.41,0.12l3.04,1.16l4.62,-0.55l1.24,2.49l0.76,0.36l1.35,0.04l-0.19,1.29l0.94,2.75l0.76,1.25l-0.65,2.08l0.27,1.27l1.11,1.57l0.8,0.42l0.78,1.34l1.47,0.36l2.76,-1.54l2.86,0.47l2.5,2.22l1.1,-0.21l1.55,0.25l0.81,0.78l1.22,0.44l1.88,-1.44l4.95,-1.04l2.8,-1.15l0.83,0.08l2.0,1.97l0.34,1.37l1.42,1.96l4.68,3.37l1.87,-0.43l0.48,-1.59l0.61,-0.26l2.66,1.55l2.58,0.2l3.76,2.26l1.64,0.09l1.77,-0.59l1.55,1.86l2.31,0.35l4.2,2.68l1.5,0.14l2.03,-0.5l0.42,0.22l-0.38,2.27l0.93,1.25l0.02,0.88l-0.71,1.67l-2.33,2.27l-1.74,0.48l-0.99,0.5l-0.2,0.47l0.33,0.98l0.8,0.9l3.07,1.14l-2.65,0.06l-1.31,1.36l-0.82,2.6l0.3,0.5l2.33,0.72l0.65,2.73l-0.56,1.13l0.37,0.56l1.14,0.33l-0.98,1.31l-1.48,3.52l0.0,1.35l-0.38,0.48l-4.47,0.18l-6.62,-0.37l-1.19,0.33l-1.58,2.23l-0.97,0.76l-1.65,0.7l-2.07,0.29l-1.24,1.08l-0.43,2.63l-0.72,1.43l0.07,0.65l0.94,0.53l-1.0,1.31l0.1,1.33l-4.75,-0.22l-3.92,0.37l-2.88,2.69l-1.6,0.01l-2.39,0.73l-1.65,0.94l-1.64,1.66l-1.38,-0.74l-1.76,0.02l-1.92,0.57l-2.0,1.22l-1.01,0.2l-2.39,-0.34l-2.68,0.72l-5.91,4.19l-0.84,1.25l-0.06,-0.98l-0.83,-1.19l-0.64,-0.01l-2.18,2.84l-2.85,1.3l-0.28,2.37l0.89,3.43l1.61,3.05l3.21,4.28l1.57,1.61l1.22,0.7l1.53,0.14l2.77,-1.33l0.98,-0.18l2.35,0.49l1.17,-0.93l1.12,-0.43l1.51,-0.06l3.31,0.89l-1.49,2.39l-0.7,2.56l-1.95,0.58l-2.39,-0.07l-2.35,0.4l-2.61,-1.59l-1.46,-0.29l-1.49,0.35l-1.71,2.08l-2.67,1.33l-0.94,1.49l-2.44,-0.32l-2.41,0.27l-3.45,1.46l-2.66,3.12l-2.7,1.84l-2.09,0.57l-1.95,-0.18l-1.25,-0.53l-2.53,-1.82l1.01,-1.83l1.11,-3.79l-0.15,-1.47l-0.78,-2.15l-2.2,-1.51l-1.95,0.2l-0.86,-0.34l-3.79,-2.62l-2.11,-0.17l-2.05,0.49l-0.9,-0.75l8.18,-5.53l1.9,-0.29l2.57,-1.26l2.69,-1.84l0.16,-0.43l-0.38,-1.45l-0.61,-1.16l-0.44,-0.2l-2.11,0.61l-3.2,-1.95l-3.46,0.86l-2.0,-0.12l-4.22,0.79l-5.89,-2.97l-1.5,-0.45l-1.23,0.06l-0.17,-0.17l0.25,-0.11l2.24,-0.47l0.37,-0.66l-0.06,-0.73l-0.3,-0.35l-2.07,-0.55l-1.91,-0.16l-1.14,-0.62l9.71,1.35l2.89,-2.05l0.45,-0.95l-0.45,-0.17l-2.94,0.84l-2.89,-0.52l-1.01,-0.69l-0.86,-1.03l-0.34,-1.11l0.24,-1.24l-0.37,-2.3l-1.35,-2.94l-1.18,-1.12l-0.51,-0.02l-0.12,0.49l2.03,4.81l-0.14,3.33l-0.31,0.96l-0.98,0.24l-2.85,-0.46l0.34,-1.53l-0.17,-0.42l-0.46,0.01l-0.99,0.76l-1.19,1.74l-0.91,0.22l-2.55,-0.19l-4.61,1.23l-2.15,5.05l-1.91,2.65l-3.9,3.97l-4.2,1.88l-0.95,0.3l-1.74,-0.36l-1.2,0.75l-0.41,0.86l-0.01,1.39l0.97,1.2l0.62,3.61l-1.51,-1.32l-2.4,-0.84l-2.58,0.32l-2.62,1.36l-1.64,0.47l-1.56,-0.31l-0.55,0.61l0.02,0.59l-3.79,-0.88l-1.69,-0.86l-1.11,-1.36l0.85,-0.48l2.63,-0.36l0.43,-1.31l-0.26,-1.45l3.08,-2.97l0.2,-1.43l1.39,-0.67l1.45,-1.41l0.77,-2.4l-0.82,-1.85l-0.2,-2.07l0.28,-0.4l2.58,-1.04l0.09,2.09l0.34,0.39l0.95,-0.28l0.59,-0.99l0.99,0.29l0.82,-0.29l2.19,0.94l1.42,-0.79l1.78,1.6l3.15,-0.45l1.01,-0.9l-0.07,-0.59l-2.61,-1.83l0.21,-3.08l-0.93,-1.89l-4.08,-2.23l-0.11,-1.3l-0.67,-0.88l0.48,-2.46l-0.27,-0.75l-2.1,-0.98l-0.72,-0.85l-2.53,-1.77l-0.12,-0.51l0.82,-2.14l0.35,-2.1l-0.29,-2.08l-1.12,-1.56l-0.78,-0.17l-1.42,0.65l-1.15,-0.89l-1.49,-2.29l-3.32,-0.54l-0.93,0.8l-0.37,-0.7l-0.98,-0.21l-0.04,-0.93l-0.76,-0.44l-2.59,-0.27l-0.22,-0.69l-0.56,-0.44l-1.12,-0.28l-1.93,-1.43l-3.99,-1.06l-1.85,1.0l-1.08,-0.18l-1.37,0.99l-5.23,-0.22l-2.8,1.61l-0.37,0.61l-4.05,0.91l-0.67,1.79l-1.38,1.87l-9.38,1.41l-3.99,1.51l-1.37,1.35l-2.08,0.42l-4.13,-3.55l-1.48,-0.38l-4.16,0.69l-1.51,-0.63l-0.93,0.12l-4.47,-0.97l-3.47,0.03l-2.68,-1.57l-1.03,-0.1l-1.43,1.47l-2.08,0.84l0.02,-1.1l-1.22,-1.43l-1.5,-0.07l-1.1,-0.44l-0.93,-1.27l-2.26,-0.88l-0.94,-1.63Z", "name": "Ukraine"}, "SE": {"path": "M365.99,347.48l2.3,0.87l1.42,-0.61l0.14,-0.52l-1.75,-2.9l2.48,-0.3l0.9,-1.54l-0.49,-1.96l-2.38,-1.12l-1.88,-2.96l-2.08,-1.66l-3.59,-6.1l-1.32,-4.23l-0.51,-0.26l-0.86,0.28l-0.98,-4.46l-1.97,-1.0l-0.41,-4.75l-0.3,-0.35l-1.93,-0.51l-1.22,-2.07l-0.43,-4.59l-1.37,-0.8l-0.88,0.07l0.29,-1.67l-0.86,-7.71l-0.81,-2.41l0.49,-1.42l0.99,-0.13l1.05,0.84l1.08,2.44l1.23,0.55l1.65,-0.68l1.12,-2.02l1.19,-5.7l-1.56,-5.81l2.04,-2.12l1.28,-3.24l0.58,-0.43l2.52,-0.49l1.72,-1.15l2.65,-2.85l0.49,-4.19l0.98,-2.96l-0.5,-2.21l-3.2,-7.01l-0.24,-1.94l1.97,-0.63l2.88,-0.11l0.56,-0.36l1.77,-3.51l0.73,-2.75l-1.76,-2.26l-2.22,-2.01l-1.56,-0.71l-4.23,-2.88l1.8,-9.07l0.16,-2.55l-2.55,-6.51l0.33,-2.72l-0.41,-4.03l1.37,-1.57l0.05,-0.47l-2.85,-5.96l2.75,-4.1l-0.39,-2.31l6.45,-7.27l1.66,-1.2l2.56,-1.06l2.84,-0.52l10.15,1.32l0.91,-0.69l0.87,-1.25l1.05,-1.69l0.15,-2.07l-0.38,-2.84l-0.59,-1.74l-5.54,-2.57l6.01,-7.62l5.0,-8.0l0.94,-7.62l1.16,-3.35l-1.16,-7.17l6.37,-0.83l4.57,-1.91l1.56,-1.27l-0.64,-4.29l1.67,-1.3l4.42,-4.9l7.13,-6.69l0.39,-2.55l-1.05,-2.3l-3.0,-3.8l0.7,-1.43l3.43,-1.04l1.77,-1.7l2.83,-6.34l5.13,-3.07l1.95,-1.6l7.79,3.14l0.47,-0.13l2.83,-3.94l0.73,-1.62l-0.2,-7.54l1.64,-0.55l0.9,-0.15l5.21,1.44l3.87,0.18l11.01,3.05l1.69,0.08l3.69,-2.86l-0.1,-0.68l-2.96,-1.22l1.86,-1.21l2.41,-3.64l0.39,-2.24l-0.15,-1.32l-2.41,-2.48l5.81,-0.32l3.48,1.27l0.41,1.76l3.53,1.82l3.19,2.42l0.7,0.87l7.15,3.98l2.75,1.04l2.31,0.34l5.62,1.69l0.91,0.52l3.18,2.47l1.11,2.73l1.96,0.38l2.07,2.53l2.08,1.38l-1.82,1.6l-0.02,4.21l0.55,1.9l-1.01,2.1l-0.15,1.45l0.57,0.59l3.26,0.52l0.47,1.83l-1.41,1.1l-0.54,0.92l0.17,2.66l0.56,1.56l3.56,4.31l0.53,1.22l-1.21,2.31l-0.38,2.91l-1.21,1.48l-0.85,0.53l-0.43,1.07l-0.12,1.59l0.35,2.85l0.77,1.59l2.15,1.03l1.83,3.39l1.27,3.65l-3.0,0.43l-2.88,-1.0l-1.28,0.49l-5.01,0.43l-1.55,1.09l-2.26,-1.04l-2.3,-1.85l-0.51,0.01l-1.64,1.38l-0.76,0.19l-1.06,-1.24l-1.23,-0.12l-1.65,2.67l-0.35,3.08l-1.94,-0.25l-0.44,0.48l0.14,0.6l0.53,0.47l-2.89,0.43l-0.18,0.93l0.46,0.62l-0.61,0.63l-4.4,0.46l-0.55,0.67l-0.09,0.87l0.29,0.61l0.76,0.46l0.08,0.6l-1.87,-1.4l-0.49,0.08l-0.3,0.57l1.84,2.46l0.35,1.44l-1.92,2.37l-3.1,2.99l-0.84,1.58l0.1,0.49l1.81,1.74l1.54,3.9l1.61,1.71l-0.59,1.43l-2.78,1.72l-3.31,2.75l-3.42,6.62l-1.03,0.8l-2.97,1.11l-1.22,1.15l-2.17,1.25l-4.04,1.18l-1.79,1.55l-0.81,1.53l-0.53,0.07l-2.03,-1.05l-0.54,0.31l-0.16,1.14l-1.24,-0.74l-0.51,0.08l-0.96,1.15l-0.66,1.65l-2.52,2.16l-2.77,-0.4l-0.7,0.56l0.41,0.71l-2.59,0.41l-0.39,0.27l-0.94,2.25l-2.29,0.6l-0.72,0.96l0.32,0.59l2.05,0.13l-0.3,1.29l-2.73,0.93l-1.06,1.24l-0.7,-0.02l0.17,-0.42l-0.38,-0.55l-1.68,0.04l-0.49,-0.9l-0.6,-0.13l-0.37,0.29l0.07,1.31l1.01,2.2l-0.78,1.02l-0.03,0.58l1.47,0.79l-0.87,0.37l-1.41,1.48l-1.41,0.03l-1.13,1.05l-0.71,-0.0l-2.16,-1.18l-0.52,0.21l-0.53,1.85l0.78,2.11l2.2,1.98l-1.11,1.3l-1.84,6.28l0.9,3.42l-2.79,-0.75l-0.53,0.45l0.23,1.25l-1.12,1.82l0.44,2.38l-0.33,1.49l0.78,1.46l-0.42,0.9l0.53,6.72l0.99,2.75l-0.36,2.21l1.62,1.58l3.12,0.25l0.84,1.75l0.4,0.25l1.24,-0.12l2.49,-0.95l0.7,1.43l2.08,2.14l1.34,1.02l1.94,0.48l1.88,1.5l-0.11,2.19l1.01,0.75l2.4,0.77l1.86,2.63l0.72,2.14l-0.21,1.12l-3.27,1.95l-1.93,1.86l-3.29,1.82l-0.78,0.74l-0.61,0.26l-0.88,-0.13l-2.7,1.42l-0.19,0.48l0.54,0.87l2.07,0.26l1.22,-0.32l0.88,-0.73l1.45,-0.01l1.59,-0.76l0.43,0.17l0.48,0.84l-2.57,0.82l-0.54,2.14l-1.03,1.23l-2.46,0.91l-3.55,2.1l-1.05,-0.11l-1.25,0.94l-2.83,1.13l-1.56,1.58l-3.24,1.35l-1.66,1.09l-8.82,-0.19l-1.54,0.56l-0.25,0.42l2.6,0.99l1.39,-0.17l3.99,0.51l1.35,1.35l-3.08,0.88l-0.3,0.52l1.51,4.13l-0.88,1.13l-0.06,4.41l-1.32,0.35l-0.56,1.97l0.4,1.19l0.25,3.76l0.62,1.3l-0.25,1.16l-2.12,3.38l0.05,1.5l0.64,2.27l-2.36,6.76l-1.76,2.25l-0.93,1.77l-2.07,5.3l-1.98,1.63l-2.7,-1.1l-1.67,0.06l-2.41,0.6l-3.72,-0.4l-3.82,0.25l-0.92,0.53l-0.18,0.46l0.43,1.51l-0.79,0.15l-1.55,-0.48l-2.19,1.42l-1.9,1.7l-0.71,1.14l-0.17,2.37l1.76,3.55l-1.99,2.17l-4.88,-0.6l-6.48,1.53l-5.27,-1.1l0.53,-1.06l0.42,-5.19l-0.52,-1.24l-1.43,-1.41l-3.24,-4.82l-1.03,-2.15ZM455.37,314.89l-0.44,1.16l-0.16,-0.02l-0.35,-0.49l0.95,-1.01l0.98,0.04l-0.99,0.33ZM453.63,316.87l-0.69,0.4l-0.58,1.21l-1.89,1.0l-0.31,4.35l1.22,1.47l-1.22,0.69l-1.15,2.24l-2.02,0.82l-0.98,0.77l-1.3,1.6l-0.6,1.99l-1.6,0.85l1.52,-2.4l-0.04,-0.53l-0.96,-0.91l-1.29,-2.49l0.57,-1.33l-0.21,-4.02l3.53,-3.78l1.69,-1.36l2.26,-0.59l0.99,0.53l0.56,-0.21l0.42,-1.14l0.49,-0.18l1.6,1.02ZM447.84,284.05l0.09,-0.33l0.59,-0.21l-0.46,0.3l-0.23,0.24ZM445.2,293.07l0.11,-0.28l0.27,-0.3l-0.35,0.57l-0.02,0.01ZM419.58,346.71l-0.65,0.71l-0.31,-0.98l0.14,-4.76l2.85,-5.73l1.39,-0.62l3.63,-8.04l0.2,-0.26l0.38,0.11l-0.59,0.73l0.06,1.24l-2.27,4.26l-0.62,2.76l-0.83,0.77l-3.36,9.84Z", "name": "Sweden"}, "IL": {"path": "M663.37,759.89l2.58,-4.47l1.71,-4.56l1.59,-6.27l2.46,-6.83l3.98,0.09l1.29,-0.9l0.49,-1.81l0.95,0.09l2.54,-1.98l-0.11,1.2l0.9,2.08l-0.48,0.82l0.55,2.07l-1.56,2.88l-2.22,0.79l-0.69,0.76l-0.33,3.49l-1.31,-0.65l-0.67,-0.93l-2.72,-0.41l-1.89,1.3l-1.49,4.53l0.43,3.82l-0.36,1.51l0.55,0.34l1.08,-0.28l1.47,0.67l-1.92,1.03l-1.21,1.12l-1.16,3.23l0.09,0.66l0.79,0.56l2.62,-0.22l4.23,-1.73l-0.6,3.27l0.49,1.55l-4.0,10.48l-0.02,4.21l-0.98,2.41l-1.26,6.15l-0.43,0.53l-3.08,-9.9l-1.74,-3.77l-0.55,-2.24l-3.22,-8.87l1.2,-1.08l0.15,-1.17l2.26,-2.32l0.09,-0.55l-0.52,-0.66Z", "name": "Israel"}}, "height": 812.9890777806123, "projection": {"type": "mill", "centralMeridian": 11.5}, "width": 900.0});
jQ183.fn.vectorMap('addMap', 'mexico', {"width":"1000","height":"680","paths":{"MX-CM":{"name":"Campeche","path":"m825.92 519.79c-1.02 0.90 -1.74 1.19 -2.76 2.02c-1.19 0.97 -1.28 1.27 -2.76 1.35c-1.39 0.08 -3.34 1.14 -4.46 1.80c-0.60 0.35 -0.86 1.16 -1.06 1.80c-0.37 1.18 7.38 -1.37 7.87 -1.80c1.26 -1.12 2.66 -0.74 3.83 -2.25c0.37 -0.48 0.57 -2.02 -0.64 -2.92zm-18.92 -49.22c-0.08 -0.37 0.00 -0.81 -0.21 -1.12c-0.08 -0.12 -0.30 0.08 -0.43 0.00c-0.12 -0.08 -0.11 -0.33 -0.21 -0.22l-0.21 0.22l0.00 0.67c0.00 0.09 -0.37 -0.06 -0.43 0.45c-0.02 0.23 0.07 0.72 0.00 0.90c-0.14 0.38 -0.98 0.03 -0.64 0.67c0.15 0.28 0.52 0.32 0.64 0.45c0.18 0.19 -0.19 0.31 0.43 0.22c0.14 -0.02 0.08 -0.17 0.21 -0.22c0.29 -0.11 0.85 0.11 0.85 -0.22l0.00 -0.22l0.21 0.00c0.21 0.00 0.21 -0.35 -0.21 -1.57l0.00 0.00zm-12.97 -26.30l0.64 -1.12c0.19 -0.34 -0.27 -0.22 -0.43 -0.22c-0.35 0.00 -0.71 0.02 -1.06 0.00c-0.60 -0.04 0.26 -0.74 -0.21 -0.45c-0.07 0.04 -0.40 0.61 -0.43 0.67c-0.01 0.04 -0.01 0.65 0.00 0.67c0.07 0.13 0.07 0.22 0.21 0.22l0.21 0.00c0.26 0.00 -0.19 0.31 0.43 0.22c0.46 -0.06 -0.04 -0.06 0.64 0.00l0.00 0.00zm107.67 107.78l0.00 -58.16l-16.05 -18.65l-0.63 -11.32l-2.52 0.67l-1.57 2.33l-2.83 -3.66l-1.57 0.00l-0.63 -6.33l-11.02 0.67l0.00 -4.66l-4.09 -0.33l-2.52 0.00l-0.63 -11.65l-2.03 -0.10c-2.24 6.17 -2.72 15.36 -2.72 19.50c0.00 3.07 3.47 6.91 3.20 11.96c-0.14 2.60 -3.56 8.74 -4.67 11.44c-3.57 8.71 -0.11 13.94 -6.88 19.76c-3.79 3.26 -12.17 13.90 -16.72 14.30c0.47 1.33 0.15 1.82 1.23 1.82c0.93 0.00 1.88 -0.52 2.46 -0.52c0.52 0.00 0.53 1.43 0.74 1.82c0.61 1.14 5.20 0.78 6.39 0.78c-2.58 0.00 -6.90 0.11 -4.92 4.42c0.03 0.06 1.23 0.00 2.21 0.00c1.84 0.00 -2.36 0.47 -2.70 0.52c-0.96 0.13 -2.02 4.18 -3.93 3.38c-4.62 -1.92 -2.50 4.99 -6.64 4.42c-0.44 -0.06 -1.88 -1.48 -2.95 -0.78c-1.08 0.71 -0.74 3.64 -1.72 3.64l-2.95 0.00c-1.82 0.00 -1.38 0.24 -1.48 -1.56c-0.05 -0.87 -0.38 -0.72 0.98 -0.78c0.01 0.00 1.64 0.17 1.23 -0.52c-0.38 -0.64 -0.98 -0.91 -0.98 -1.82c0.00 -2.62 -1.13 0.89 -1.97 -0.52c-1.62 -2.74 -2.22 1.13 -3.93 0.00c-0.74 -0.49 -0.01 -0.05 -1.23 -0.52c-0.25 -0.10 -0.97 -1.27 -1.23 -1.30c-1.32 -0.16 -1.17 0.52 -1.72 1.30c-0.50 0.09 -2.55 0.53 -3.20 0.26c-0.81 -0.34 -1.13 -0.52 -0.25 -0.78c0.41 -0.12 1.27 0.00 1.72 0.00c0.49 0.00 1.47 0.30 1.23 -0.52c-0.16 -0.56 -0.44 -0.93 -0.49 -1.56c-0.05 -0.58 -0.08 -0.55 0.25 -0.78c1.88 0.00 3.54 -0.10 5.16 0.52c0.78 0.30 1.54 -0.78 2.70 -0.78c0.59 0.00 1.29 -0.71 0.74 -1.30c-0.54 -0.57 -3.48 -0.48 -4.43 -1.30c-1.78 -1.53 -4.84 0.74 -6.39 1.56c-1.05 0.55 -3.64 0.07 -4.92 0.52c-1.56 0.55 -2.65 0.25 -3.72 0.59l-0.01 1.58l2.94 0.83l0.00 3.21l1.74 -0.23c0.21 0.44 0.34 0.86 0.43 1.35c0.07 0.41 1.68 0.23 2.13 0.23l0.64 0.00c0.45 0.00 1.58 -1.13 1.70 -0.45c0.20 1.05 0.64 0.03 1.28 0.45c0.30 0.20 -0.30 0.22 0.43 0.22l1.06 0.00l0.00 8.33c1.54 0.13 0.86 4.28 1.92 4.28c1.08 0.00 1.57 0.14 2.13 -0.45c0.53 -0.56 3.51 1.74 4.26 2.03c0.31 0.12 1.64 -0.13 1.92 0.23c0.77 1.00 -1.02 2.03 0.85 2.03c0.87 0.00 3.74 -0.01 4.26 0.68c0.95 1.26 2.37 1.35 4.05 1.35l0.00 -8.36l3.19 0.03c1.41 0.01 2.36 1.09 3.83 1.58c2.48 0.82 2.55 -0.86 4.90 1.13c1.95 1.65 6.42 -0.44 8.88 1.91l0.03 4.79c19.70 -0.12 36.59 -1.25 56.04 -2.69z"},"MX-CP":{"name":"Chiapas","path":"m745.94 627.54c-0.05 -0.84 -0.10 -1.68 -0.14 -2.54c-0.07 -1.50 0.68 -1.38 0.68 -2.51c0.00 -1.93 -0.45 -1.66 1.36 -1.79c0.68 -0.05 0.34 -2.12 0.34 -2.87l0.00 -3.58c0.00 -2.28 -1.96 -2.39 -4.41 -2.51l7.46 -24.37c0.86 -0.30 1.65 -0.36 2.15 -0.91c0.48 -0.53 -0.72 -1.50 0.27 -2.55c0.88 -0.93 3.30 0.09 3.75 -1.13c0.14 -0.40 0.21 -0.79 0.25 -1.09c0.89 -2.04 2.53 1.37 2.79 -2.84c0.10 -1.58 1.39 -1.03 1.66 -1.75c0.59 -1.59 0.89 -2.70 1.29 -4.48c0.34 -1.54 0.62 -0.85 1.29 -1.56c0.88 -0.93 -0.29 -1.53 1.10 -2.73c0.35 -0.30 0.98 -0.57 1.29 -0.97c1.15 -1.50 1.04 -3.70 -1.29 -3.70l-0.18 -3.50l1.11 -4.09c1.44 -0.65 1.38 0.45 1.84 -0.78c0.17 -0.45 0.88 -0.24 1.11 -0.39c0.48 -0.32 1.13 -0.10 1.84 -0.19c0.42 -0.06 0.02 -0.78 0.74 -0.78c0.66 0.00 2.47 0.93 1.29 1.56c-0.22 0.12 -1.02 -0.27 -0.74 0.39c0.43 0.99 0.46 0.26 1.11 0.97c0.18 0.20 0.41 0.97 0.55 0.97c0.52 0.00 0.98 -0.39 1.66 -0.39c0.89 0.00 0.55 0.68 0.55 1.56c0.00 0.61 0.37 0.92 0.00 1.56c-0.43 0.73 1.49 0.75 1.66 0.78l0.00 7.01c0.54 0.00 1.47 0.78 1.47 1.36c0.00 1.57 -0.45 1.75 1.29 1.75c0.87 0.00 1.71 -0.19 2.58 -0.19c2.51 0.00 0.93 0.09 2.03 1.36c0.21 0.24 0.54 0.10 0.37 0.39c-0.22 0.37 -1.28 2.44 -0.18 2.14c0.32 -0.09 1.62 -0.11 1.66 0.19c0.09 0.76 -0.91 0.84 -0.37 1.17c1.20 0.73 0.66 0.78 2.39 0.78c0.11 -0.36 0.42 -0.13 0.55 -0.58c0.08 -0.29 0.25 -0.65 0.18 -1.17c-0.06 -0.50 -0.12 0.11 -0.18 -0.39c-0.08 -0.63 0.57 -1.86 1.10 -2.14c0.18 -0.10 0.42 -0.11 0.55 -0.39c0.16 -0.33 0.08 -2.07 0.18 -2.53c0.63 0.00 2.76 -0.01 2.76 -0.78c0.00 -1.35 0.65 -1.15 1.66 -1.56c2.04 -0.83 3.56 0.36 4.60 -2.34c0.62 -1.61 -1.01 -2.53 1.47 -2.53c0.82 0.00 -0.97 0.95 0.18 -0.58c0.50 -0.67 1.61 -0.65 2.03 -1.17c0.86 -1.09 3.31 -1.89 3.31 -2.92c0.00 -1.15 -0.01 -1.00 1.11 -1.36c0.81 -0.28 1.84 0.00 1.84 -1.36c0.00 -1.56 0.87 -4.27 1.66 -1.56c0.21 0.72 0.55 0.06 0.55 1.17c0.00 1.57 1.25 1.05 1.29 0.39c0.07 -1.07 0.07 -0.78 1.11 -0.78c1.09 0.00 1.19 0.45 2.21 0.78c0.40 0.13 1.00 0.19 1.10 0.58c0.20 0.74 -0.01 1.32 0.37 1.95c0.43 0.73 -0.12 1.08 -0.18 1.95c0.32 0.25 0.37 0.76 0.55 0.78c0.55 0.05 0.53 0.05 0.92 0.39c0.93 0.80 0.48 0.32 1.47 0.19c1.34 -0.16 0.91 0.01 1.11 1.17c0.19 1.08 0.55 -0.55 0.55 0.97c0.00 1.43 1.15 0.27 1.29 1.56c0.10 0.91 -0.92 1.42 -0.37 2.14c0.28 0.36 0.25 1.14 0.00 1.36c-0.59 0.51 -1.32 0.47 -0.55 0.97c0.23 0.15 0.18 0.76 0.18 1.17c-0.58 0.21 0.00 0.94 0.74 0.58c0.44 -0.21 0.72 -0.39 1.66 -0.39c1.45 0.00 0.96 1.17 1.84 1.17c0.35 0.00 2.33 -0.49 2.39 0.00c0.09 0.71 0.31 2.65 1.10 0.97c0.44 -0.92 0.40 -0.75 0.74 -0.39c0.26 0.27 0.92 0.24 0.92 0.78c0.00 1.42 -0.74 0.48 -0.74 1.95c0.00 0.61 -0.22 1.43 -0.18 1.75c0.07 0.56 1.46 -0.20 1.81 0.52l-0.94 0.02c0.41 0.86 0.49 0.97 1.26 1.41c0.19 0.11 0.09 0.08 0.29 0.15c0.74 0.28 0.17 0.41 0.58 1.08c0.26 0.43 0.62 0.77 1.02 0.77c0.43 0.00 0.95 -0.07 1.17 0.15c0.31 0.32 1.02 0.29 1.02 0.93c0.20 0.68 0.14 1.00 0.73 1.23c1.16 0.45 1.75 -0.23 1.75 1.08c0.00 1.45 1.16 0.92 1.31 2.47c0.07 0.72 4.45 -0.76 3.36 0.93c-0.27 0.42 -0.52 -0.25 -0.44 0.77c0.07 0.83 1.03 2.31 1.75 2.31c0.63 0.00 1.11 -0.46 1.90 -0.46c0.00 2.62 0.58 2.31 2.77 2.31c2.79 0.00 6.42 3.07 6.57 5.71c0.04 0.81 0.88 2.99 1.31 3.09c2.16 0.47 1.38 4.32 3.79 3.55c1.45 -0.38 1.91 -0.97 3.21 0.46c0.34 0.37 0.61 0.81 1.02 1.08c0.22 0.14 1.25 -0.31 1.75 -0.31l0.00 1.85c0.00 1.13 -1.06 0.19 -1.17 1.08c-0.16 1.29 -1.15 2.01 -0.88 3.40c0.20 1.03 0.66 5.89 1.46 6.17l-42.62 2.01l-15.91 33.02l4.96 4.32c0.00 4.78 -2.19 7.65 -2.19 12.19c0.00 2.12 -0.58 2.91 -0.58 4.94c0.00 2.12 -1.01 2.99 -1.83 4.04c-4.41 -3.78 -7.92 -7.13 -8.57 -8.13c-7.88 -12.09 -21.10 -18.76 -31.51 -29.06c-4.83 -4.78 -13.39 -7.31 -18.61 -12.07c-1.52 -1.39 -3.85 -2.00 -6.25 -2.57z"},"MX-TB":{"name":"Tabasco","path":"m740.82 548.48l1.32 2.61c0.00 1.34 0.27 2.38 0.27 3.68c0.00 1.77 0.52 0.66 1.07 1.70c0.23 0.43 -1.60 2.42 -0.54 3.96c0.24 0.35 2.71 -0.30 3.21 0.00c1.61 0.96 -0.93 1.57 2.14 2.83c1.30 1.03 1.69 3.00 3.48 3.11c1.67 0.10 4.18 1.19 3.75 2.83c-0.50 1.91 2.11 1.73 2.41 2.55c0.03 0.07 0.54 4.92 -0.27 5.38c-1.42 0.80 0.02 2.47 -0.02 4.57c0.89 -2.04 2.53 1.37 2.79 -2.84c0.10 -1.58 1.39 -1.03 1.66 -1.75c0.59 -1.59 0.89 -2.70 1.29 -4.48c0.34 -1.54 0.62 -0.85 1.29 -1.56c0.88 -0.93 -0.29 -1.53 1.10 -2.73c0.35 -0.30 0.98 -0.57 1.29 -0.97c1.15 -1.50 1.04 -3.70 -1.29 -3.70l-0.18 -3.50l1.11 -4.09c1.44 -0.65 1.38 0.45 1.84 -0.78c0.17 -0.45 0.88 -0.24 1.11 -0.39c0.48 -0.32 1.13 -0.10 1.84 -0.19c0.42 -0.06 0.02 -0.78 0.74 -0.78c0.66 0.00 2.47 0.93 1.29 1.56c-0.22 0.12 -1.02 -0.27 -0.74 0.39c0.43 0.99 0.46 0.26 1.11 0.97c0.18 0.20 0.41 0.97 0.55 0.97c0.52 0.00 0.98 -0.39 1.66 -0.39c0.89 0.00 0.55 0.68 0.55 1.56c0.00 0.61 0.37 0.92 0.00 1.56c-0.43 0.73 1.49 0.75 1.66 0.78l0.00 7.01c0.54 0.00 1.47 0.78 1.47 1.36c0.00 1.57 -0.45 1.75 1.29 1.75c0.87 0.00 1.71 -0.19 2.58 -0.19c2.51 0.00 0.93 0.09 2.03 1.36c0.21 0.24 0.54 0.10 0.37 0.39c-0.22 0.37 -1.28 2.44 -0.18 2.14c0.32 -0.09 1.62 -0.11 1.66 0.19c0.09 0.76 -0.91 0.84 -0.37 1.17c1.20 0.73 0.66 0.78 2.39 0.78c0.11 -0.36 0.42 -0.13 0.55 -0.58c0.08 -0.29 0.25 -0.65 0.18 -1.17c-0.06 -0.50 -0.12 0.11 -0.18 -0.39c-0.08 -0.63 0.57 -1.86 1.10 -2.14c0.18 -0.10 0.42 -0.11 0.55 -0.39c0.16 -0.33 0.08 -2.07 0.18 -2.53c0.63 0.00 2.76 -0.01 2.76 -0.78c0.00 -1.35 0.65 -1.15 1.66 -1.56c2.04 -0.83 3.56 0.36 4.60 -2.34c0.62 -1.61 -1.01 -2.53 1.47 -2.53c0.82 0.00 -0.97 0.95 0.18 -0.58c0.50 -0.67 1.61 -0.65 2.03 -1.17c0.86 -1.09 3.31 -1.89 3.31 -2.92c0.00 -1.15 -0.01 -1.00 1.11 -1.36c0.81 -0.28 1.84 0.00 1.84 -1.36c0.00 -1.56 0.87 -4.27 1.66 -1.56c0.21 0.72 0.55 0.06 0.55 1.17c0.00 1.57 1.25 1.05 1.29 0.39c0.07 -1.07 0.07 -0.78 1.11 -0.78c1.09 0.00 1.19 0.45 2.21 0.78c0.40 0.13 1.00 0.19 1.10 0.58c0.20 0.74 -0.01 1.32 0.37 1.95c0.43 0.73 -0.12 1.08 -0.18 1.95c0.32 0.25 0.37 0.76 0.55 0.78c0.55 0.05 0.53 0.05 0.92 0.39c0.93 0.80 0.48 0.32 1.47 0.19c1.34 -0.16 0.91 0.01 1.11 1.17c0.19 1.08 0.55 -0.55 0.55 0.97c0.00 1.43 1.15 0.27 1.29 1.56c0.10 0.91 -0.92 1.42 -0.37 2.14c0.28 0.36 0.25 1.14 0.00 1.36c-0.59 0.51 -1.32 0.47 -0.55 0.97c0.23 0.15 0.18 0.76 0.18 1.17c-0.58 0.21 0.00 0.94 0.74 0.58c0.44 -0.21 0.72 -0.39 1.66 -0.39c1.45 0.00 0.96 1.17 1.84 1.17c0.35 0.00 2.33 -0.49 2.39 0.00c0.09 0.71 0.31 2.65 1.10 0.97c0.44 -0.92 0.40 -0.75 0.74 -0.39c0.26 0.27 0.92 0.24 0.92 0.78c0.00 1.42 -0.74 0.48 -0.74 1.95c0.00 0.61 -0.22 1.43 -0.18 1.75c0.07 0.56 1.46 -0.20 1.78 0.52l11.51 -0.25l-0.09 -7.74l-0.19 -19.67c-2.46 -2.34 -6.93 -0.25 -8.88 -1.91c-2.35 -1.99 -2.42 -0.31 -4.90 -1.13c-1.47 -0.49 -2.42 -1.56 -3.83 -1.58l-3.19 -0.03l0.00 8.36c-1.68 0.00 -3.10 -0.09 -4.05 -1.35c-0.52 -0.69 -3.39 -0.68 -4.26 -0.68c-1.88 0.00 -0.08 -1.02 -0.85 -2.03c-0.28 -0.36 -1.61 -0.11 -1.92 -0.23c-0.75 -0.29 -3.73 -2.58 -4.26 -2.03c-0.56 0.59 -1.05 0.45 -2.13 0.45c-1.06 0.00 -0.38 -4.14 -1.92 -4.28l0.00 -8.33l-1.06 0.00c-0.73 0.00 -0.13 -0.03 -0.43 -0.22c-0.64 -0.42 -1.08 0.60 -1.28 -0.45c-0.13 -0.68 -1.25 0.45 -1.70 0.45l-0.64 0.00c-0.45 0.00 -2.06 0.18 -2.13 -0.23c-0.08 -0.49 -0.22 -0.91 -0.43 -1.35l-1.74 0.23l0.00 -3.21l-2.94 -0.83l0.00 -1.58c-0.47 0.15 -0.93 0.44 -1.44 0.97c-1.97 0.69 -3.32 1.45 -4.92 2.34c-1.14 0.64 -1.92 0.47 -2.95 1.56c-2.17 2.30 -5.30 5.07 -8.36 5.20c-0.87 0.04 -1.56 0.24 -1.48 1.30c0.11 1.37 -0.89 4.43 -2.70 3.12c-2.17 -1.57 2.43 -3.12 1.23 -3.12c-0.86 0.00 -2.36 0.36 -2.46 0.26c-0.68 -0.72 -2.66 -0.78 -3.93 -0.78c-2.28 0.00 -6.22 0.02 -7.38 1.30c-3.59 3.99 -10.97 2.12 -13.52 6.50c-0.09 0.16 -2.20 0.69 -2.46 0.78c-0.76 0.27 -1.36 0.64 -1.91 1.03z"},"MX-OA":{"name":"Oaxaca","path":"m591.99 621.57c0.15 -0.05 0.34 -0.10 0.63 -0.15c0.73 -0.12 0.06 -0.52 1.33 -0.56c2.60 -0.10 3.91 1.27 6.40 0.28c0.00 -0.40 -0.06 -1.10 0.00 -1.41c0.14 -0.77 0.94 -0.39 1.07 -0.56c0.26 -0.36 0.59 -1.42 0.53 -1.97c-0.11 -0.97 -1.07 -1.95 -1.07 -2.82c0.00 -1.52 0.69 -1.13 2.13 -1.13c0.59 0.00 0.65 -0.06 0.80 0.56c0.15 0.60 1.55 0.28 2.13 0.28c1.45 0.00 0.78 -4.48 3.20 -5.07c2.64 -0.64 1.60 -7.33 1.60 -9.86c0.00 -1.74 1.58 -2.50 3.20 -2.82c-0.17 -0.55 -0.94 -0.11 -1.33 -0.56c-1.17 -1.37 -1.51 -0.59 -2.93 -0.85c-1.60 -0.29 -1.07 -0.13 -1.07 -1.69c0.00 -1.00 -0.58 -0.33 -1.07 -0.85c-0.86 -0.91 -1.28 0.08 -2.66 -0.85c-0.80 -0.53 -0.87 -1.56 -1.07 -2.54l0.27 -7.61c0.53 -0.19 0.76 -1.27 0.53 -1.97c-0.64 -1.96 -1.07 -0.97 -3.20 -1.41c-2.06 -0.43 0.54 -2.54 -1.87 -2.54c-0.65 0.00 -1.60 -1.09 -1.60 -1.41c0.00 -0.39 0.36 -0.37 0.53 -0.85c0.57 -1.56 -2.14 -2.28 -0.53 -3.66c0.27 -0.23 1.02 -0.20 1.07 -0.56c0.16 -1.28 0.49 -1.70 0.53 -2.54c0.01 -0.11 0.01 -0.21 0.02 -0.31c0.66 -0.09 1.29 -0.85 2.02 -0.75c0.39 0.05 6.07 2.18 5.13 0.18c-0.68 -1.43 1.31 -1.87 2.22 -2.71c0.41 -0.38 2.15 -0.35 3.25 0.18c0.55 0.27 1.09 -0.95 1.88 -0.36c5.32 3.97 3.81 -0.90 6.50 -0.90c0.51 0.00 1.03 0.09 1.54 0.00c0.11 -0.02 0.08 -0.11 0.17 -0.18c0.11 -0.09 0.14 -0.22 0.17 -0.36c0.11 -0.43 0.12 0.06 0.17 -0.36c0.08 -0.62 0.00 -0.08 0.17 -0.36c0.21 -0.36 -0.19 -0.88 -0.51 -0.90c-0.20 -0.02 -0.65 -0.04 -0.86 0.00c-0.39 0.07 -0.42 0.07 -0.51 0.36c-0.08 0.23 -0.04 0.34 -0.17 0.54c-0.06 0.10 -0.07 0.12 -0.17 0.18c-0.25 0.15 -0.18 0.23 -0.51 0.18c-0.29 -0.04 -0.17 -0.24 -0.17 -0.54c0.00 -0.91 0.40 -1.21 -0.17 -1.81c-0.72 -0.76 -2.56 -0.93 -2.91 -1.63c-0.57 -1.12 0.01 -1.75 0.34 -2.53c0.28 -0.66 0.31 -1.66 0.86 -1.81c0.98 -0.27 1.23 -0.82 1.33 -1.70c0.05 -0.38 3.51 -0.65 4.65 -0.65l0.00 1.99c0.00 0.85 -0.21 2.13 0.68 2.35c1.33 0.33 2.58 1.42 3.08 2.71c0.07 0.17 -0.08 0.56 0.00 0.72c0.06 0.13 1.06 2.03 1.06 2.03c1.03 0.14 2.77 0.29 2.77 -0.87c0.00 -1.00 0.45 -1.95 1.57 -1.95c2.13 -0.95 1.85 -2.24 4.11 -2.24c1.08 0.00 2.21 -1.41 3.42 -0.36c1.54 1.33 3.33 -0.17 4.41 -0.43c1.87 -0.46 1.01 -2.13 3.08 -2.13c1.03 -0.22 1.62 0.10 2.67 -0.18c1.69 -0.44 0.62 -2.84 1.61 -3.15c0.59 -0.19 -0.28 -1.71 0.10 -1.92c0.79 -0.42 1.88 -0.38 1.87 -1.45c0.72 -0.31 1.59 -1.04 1.60 -1.46c0.06 -1.63 -0.20 -3.42 0.20 -4.99c0.40 -1.53 0.08 -2.27 -1.02 -2.97c-0.78 -0.49 -0.24 -1.31 -0.14 -2.10l2.53 0.00l7.79 7.53c0.48 0.51 0.78 1.86 1.16 2.46c0.22 0.34 0.72 0.16 0.96 0.65c0.14 0.29 -0.06 1.40 0.00 1.74c0.12 0.63 2.60 1.40 2.60 2.39c0.00 1.43 0.72 1.83 0.89 2.97c0.18 1.21 1.31 0.10 1.37 1.38c0.06 0.02 0.59 0.83 0.89 1.01c0.71 0.44 2.40 -0.24 3.28 0.43c0.71 0.54 2.12 0.41 2.80 -0.14c0.98 -0.80 1.48 -0.48 2.39 -1.01c0.58 -0.34 1.58 -0.88 2.19 0.00c0.40 0.57 1.78 3.65 1.78 3.98c0.00 1.86 0.68 1.42 0.68 3.04c0.00 0.48 0.14 0.77 0.14 1.30c-1.25 0.66 0.29 1.84 -2.05 2.24c-1.32 0.23 0.64 3.11 -0.82 3.76c-3.41 1.52 3.50 4.03 4.03 5.35c0.76 1.89 2.18 2.99 4.17 2.75c2.18 -0.27 1.06 0.52 2.80 0.80c0.62 -0.49 0.75 -1.27 1.64 -1.52c0.99 -0.28 0.38 -1.57 1.02 -2.24c0.05 -0.06 1.32 -0.25 1.71 -0.58c0.37 -0.31 1.32 -1.80 1.71 -1.95c1.66 -0.63 0.37 -2.75 2.12 -3.11c0.70 -0.14 1.38 -0.00 1.98 -0.36c2.29 -1.37 1.93 3.45 1.64 4.63c-0.33 1.33 -1.30 0.59 -2.34 0.98c0.00 1.77 2.21 1.27 3.73 1.43c0.72 0.08 0.68 2.44 0.34 3.58c-0.44 1.47 1.09 3.44 1.36 2.51c0.06 -0.23 0.11 -0.36 0.34 -0.36c0.23 0.00 0.40 0.13 0.34 0.36c-0.08 0.28 -0.59 0.60 -0.34 0.72c0.41 0.19 0.91 -0.05 1.36 0.00c0.55 0.07 0.01 -0.08 0.34 0.72c0.37 0.89 3.99 0.99 5.08 1.06l0.39 5.87l34.20 -0.83l-7.46 24.38c2.44 0.12 4.41 0.23 4.41 2.51l0.00 3.58c0.00 0.75 0.34 2.82 -0.34 2.87c-1.80 0.13 -1.36 -0.13 -1.36 1.79c0.00 1.13 -0.75 1.01 -0.68 2.51c0.04 0.86 0.09 1.70 0.13 2.54c-2.75 -0.64 -5.60 -1.22 -7.49 -2.80c-3.49 -0.31 -6.96 -2.73 -10.15 -1.12c-0.71 0.36 -5.68 0.37 -6.34 -0.22c-1.38 -1.23 2.59 -0.88 2.75 -0.89c0.34 -0.04 2.48 -2.40 2.75 -2.68c1.26 -1.33 -0.49 -3.95 -2.33 -2.01c-0.84 0.89 -0.35 0.33 -1.69 0.45c-1.05 0.09 -0.61 2.11 -1.69 2.91c-0.94 0.69 0.09 0.98 -1.90 -0.89c1.04 -0.37 0.42 -1.12 0.42 -2.24c0.00 -0.20 0.02 -1.10 0.00 -1.12c-0.57 -0.58 -1.46 0.25 -1.90 -0.45c-0.31 -0.48 0.09 -0.91 -1.27 -0.22c-0.13 0.06 -0.10 0.13 -0.21 0.22c-1.01 0.90 -0.59 0.62 -0.21 1.79c0.37 1.13 -0.44 1.54 -1.06 0.89c-0.32 -0.34 -1.47 -0.25 -2.11 -0.22c-0.51 0.02 -1.41 0.37 -1.69 0.67c-0.90 0.95 0.62 0.58 1.69 0.67c1.12 0.09 0.42 -0.22 0.42 0.45c0.00 1.49 5.43 1.54 6.77 2.01c0.00 0.76 -2.69 0.89 -3.38 0.89c-1.50 0.00 -2.54 -0.64 -3.81 -0.89c-1.80 -0.37 -3.30 0.46 -5.07 0.89c-1.50 0.37 -1.06 1.24 -1.27 3.13c-0.04 0.35 -1.14 0.89 -1.45 1.20c-4.40 4.84 -12.88 7.71 -20.34 9.80c-1.83 0.51 -2.87 3.12 -6.29 4.09c-5.34 1.52 -12.28 3.94 -15.72 3.94c-9.24 0.00 -15.37 -5.40 -23.95 -7.21c-6.46 -0.41 -12.62 -0.45 -13.00 0.27c-1.79 3.35 -6.15 -4.80 -9.91 -5.99c-3.09 -0.98 -18.29 -5.46 -20.47 -7.49c-0.95 -0.88 -2.42 -2.33 -4.03 -3.80z"},"MX-GR":{"name":"Guerrero","path":"m476.21 566.62c-0.07 -0.12 -0.16 -0.22 -0.27 -0.31c-1.12 -0.86 -0.87 -0.68 -1.75 -1.96c-0.84 -1.22 -0.36 -3.65 0.10 -5.11c0.54 -1.70 2.12 -1.20 3.59 -1.20c0.67 0.00 2.37 -2.42 3.49 -2.72c0.58 -0.15 4.52 0.42 4.52 -0.98c0.00 -0.57 -0.87 -1.33 -1.23 -1.63c-0.54 -0.46 -0.51 -1.70 -0.51 -2.50c0.00 -1.54 -0.41 -3.37 -0.41 -4.68c0.00 -0.65 0.46 -0.85 0.62 -1.41c0.21 -0.76 0.13 -1.80 0.00 -2.61c-0.13 0.00 1.61 0.31 2.16 0.33c0.75 0.02 1.51 0.03 2.26 0.00c0.65 -0.02 1.44 -0.96 1.75 -0.76c0.92 0.61 1.90 1.24 3.18 1.52c0.00 1.06 1.45 2.83 2.57 2.83c1.00 0.00 4.44 -0.03 4.83 -0.87c0.59 -1.28 9.46 -1.19 10.99 -1.09c0.18 0.48 1.55 3.20 1.64 3.26c0.74 0.49 2.41 -0.32 3.29 -0.44c0.34 -0.05 0.68 -0.76 1.44 -0.76c2.11 0.00 1.85 0.04 2.46 1.63c0.74 1.91 2.47 1.93 4.21 3.15c0.85 0.00 0.71 -4.18 0.51 -4.35c-1.05 -0.89 -1.19 -0.40 -2.57 -1.30c-1.83 -1.20 -1.95 -1.15 -1.95 -3.26c0.00 -1.46 -0.82 -1.20 -1.13 -2.39c-0.10 -0.40 0.71 -2.25 0.28 -2.51c-1.68 -0.51 -2.41 -3.99 0.12 -3.79c0.61 0.05 2.20 1.17 2.68 0.44c0.65 -0.98 -0.35 -1.20 1.23 -1.20c1.22 0.00 0.22 -1.29 1.56 -1.60c-0.10 0.47 -0.19 0.89 -0.15 1.63c0.18 3.15 2.53 1.01 3.67 1.77c0.49 0.32 -0.81 0.28 -0.83 0.71c-0.12 1.95 1.33 0.94 2.34 0.53c0.45 -0.18 1.59 0.24 1.17 0.88c-0.35 0.53 -1.54 0.44 -1.67 0.71c-0.41 0.88 -0.17 3.08 -0.17 4.06c0.00 0.79 3.39 0.59 2.50 2.47c-0.22 0.47 -1.67 0.86 -1.17 1.76c0.94 1.69 1.22 1.11 2.34 2.29c0.82 0.87 0.75 2.53 2.17 3.18c2.00 0.98 0.57 -0.85 1.34 -1.41c0.96 -0.71 2.78 -0.29 3.34 -1.24c0.74 -1.25 -1.14 -2.71 1.00 -3.53c1.99 -0.77 0.94 -0.61 1.84 -2.12c0.63 -1.06 -0.03 -1.69 1.67 -0.35c1.40 1.09 2.02 1.66 2.50 -0.18c0.39 -1.47 5.10 -1.40 6.51 -1.59l0.00 -2.82c0.00 -1.51 3.09 0.64 2.50 -1.94c-0.11 -0.48 -0.62 -2.70 0.33 -2.47c2.05 0.50 0.78 0.35 2.00 1.06c0.09 0.05 -0.09 1.27 0.67 1.76c0.94 0.61 2.33 1.76 3.50 1.76c0.24 0.68 0.23 1.31 0.53 2.00c0.59 1.38 1.91 0.65 2.42 1.90c0.06 0.14 0.42 1.21 0.47 1.24c0.45 0.26 -0.56 1.01 -0.31 1.49c0.84 1.59 0.35 0.99 3.27 0.99c0.00 1.78 1.31 0.99 2.73 0.99c0.60 0.00 0.41 0.38 0.86 0.41c1.04 0.08 1.36 0.19 2.18 0.66c0.07 0.04 0.17 0.18 0.23 0.25c0.26 0.24 0.20 0.26 0.39 0.58c0.18 0.30 0.92 -0.20 1.17 -0.17c0.09 0.01 0.11 1.40 0.16 1.65c0.14 -0.04 0.27 -0.07 0.42 -0.09c-0.06 0.17 -0.12 0.35 -0.14 0.53c-0.06 0.55 0.17 1.51 0.00 1.99c-0.59 1.61 2.51 -0.02 1.54 1.63c-0.86 1.45 1.47 0.52 1.54 1.09c0.03 0.23 2.20 0.94 2.91 2.35c0.24 0.48 -0.26 2.65 -0.17 2.71c0.81 0.59 2.81 -0.46 3.59 0.36c0.00 0.88 -0.05 1.83 0.00 2.71c0.02 0.34 0.72 0.18 1.03 0.18c1.24 0.00 -0.04 1.27 1.54 1.27c0.78 0.00 1.86 0.45 2.74 0.00c0.13 -0.07 -0.18 -0.90 0.17 -1.08c0.72 -0.37 0.56 -0.54 1.37 -0.54c1.61 2.05 1.33 -0.54 2.74 -0.54c1.92 0.00 0.97 2.78 2.05 3.98c0.31 0.34 0.61 0.43 0.89 0.39c-0.01 0.10 -0.01 0.20 -0.02 0.31c-0.05 0.83 -0.38 1.25 -0.53 2.54c-0.04 0.36 -0.80 0.33 -1.07 0.56c-1.61 1.38 1.10 2.10 0.53 3.66c-0.17 0.47 -0.53 0.46 -0.53 0.85c0.00 0.32 0.95 1.41 1.60 1.41c2.41 0.00 -0.20 2.10 1.87 2.54c2.12 0.44 2.56 -0.55 3.20 1.41c0.23 0.70 -0.00 1.79 -0.53 1.97l-0.27 7.61c0.20 0.98 0.27 2.00 1.07 2.54c1.38 0.92 1.81 -0.06 2.66 0.85c0.49 0.52 1.07 -0.15 1.07 0.85c0.00 1.56 -0.53 1.40 1.07 1.69c1.42 0.25 1.76 -0.53 2.93 0.85c0.39 0.46 1.16 0.01 1.33 0.56c-1.62 0.32 -3.20 1.08 -3.20 2.82c0.00 2.53 1.04 9.22 -1.60 9.86c-2.41 0.59 -1.74 5.07 -3.20 5.07c-0.59 0.00 -1.98 0.31 -2.13 -0.28c-0.15 -0.62 -0.21 -0.56 -0.80 -0.56c-1.44 0.00 -2.13 -0.39 -2.13 1.13c0.00 0.87 0.96 1.85 1.07 2.82c0.06 0.55 -0.28 1.61 -0.53 1.97c-0.12 0.18 -0.92 -0.21 -1.07 0.56c-0.06 0.31 0.00 1.01 0.00 1.41c-2.49 0.99 -3.80 -0.38 -6.40 -0.28c-1.27 0.05 -0.60 0.45 -1.33 0.56c-0.28 0.04 -0.48 0.09 -0.63 0.14c-2.56 -2.35 -5.49 -4.75 -7.30 -5.04l-7.60 -1.23c-0.30 -0.05 -0.07 -2.02 -1.16 -1.50c-0.95 0.46 -10.99 -1.77 -16.35 -1.77c-2.64 0.00 -3.22 -1.12 -5.02 -2.31c-3.87 -2.56 -5.78 -4.05 -9.91 -5.44c-8.53 -2.87 -16.45 -8.71 -28.20 -9.12c-2.93 -0.10 -12.46 -10.88 -18.28 -12.93c-8.39 -2.95 -10.16 -15.21 -16.68 -17.03c-2.22 0.00 -3.92 0.69 -5.28 1.43z"},"MX-VE":{"name":"Veracruz","path":"m635.05 436.73c-0.13 -0.01 -0.10 -0.22 -0.16 -0.34c-0.05 -0.10 -0.09 -0.09 -0.16 -0.17c-0.16 -0.18 -0.07 -0.45 -0.16 -0.68c-0.05 -0.12 -0.25 -0.06 -0.32 -0.17c-0.07 -0.11 -0.13 -0.21 -0.16 -0.34c-0.06 -0.23 0.14 -0.25 0.16 -0.51c0.04 -0.43 0.00 -0.91 0.00 -1.36c0.00 -0.11 -0.10 -0.30 0.00 -0.34c0.25 -0.09 0.98 -0.04 1.28 0.00c0.31 0.04 0.25 0.06 0.32 0.34c0.10 0.40 0.13 -0.05 0.16 0.34c0.02 0.38 0.00 0.81 0.00 1.19c0.00 0.52 0.04 0.39 -0.48 1.36c0.02 0.35 -0.35 0.50 -0.48 0.68zm-11.88 -5.09l-0.16 0.00l0.00 -0.17l-0.16 0.00c-0.13 0.00 -0.15 -0.20 -0.16 -0.34c-0.02 -0.29 -0.10 -0.64 0.16 -0.68c0.47 -0.06 0.17 0.07 0.32 0.17c0.09 0.06 0.21 0.00 0.32 0.00c0.59 0.00 0.08 0.10 0.48 0.34c0.09 0.06 0.25 -0.08 0.32 0.00c0.17 0.18 -0.08 0.31 0.00 0.85c-0.36 -0.18 -0.75 -0.11 -1.12 -0.17zm128.06 155.72l-34.20 0.83l-0.39 -5.87c-1.09 -0.07 -4.71 -0.17 -5.08 -1.06c-0.33 -0.79 0.21 -0.65 -0.34 -0.72c-0.45 -0.05 -0.94 0.19 -1.36 0.00c-0.25 -0.11 0.26 -0.44 0.34 -0.72c0.07 -0.23 -0.11 -0.36 -0.34 -0.36c-0.23 0.00 -0.27 0.13 -0.34 0.36c-0.26 0.93 -1.79 -1.04 -1.36 -2.51c0.34 -1.14 0.38 -3.51 -0.34 -3.58c-1.52 -0.17 -3.73 0.33 -3.73 -1.43c1.04 -0.39 2.02 0.35 2.34 -0.98c0.29 -1.18 0.65 -6.00 -1.64 -4.63c-0.60 0.36 -1.28 0.22 -1.98 0.36c-1.75 0.36 -0.45 2.48 -2.12 3.11c-0.39 0.15 -1.34 1.64 -1.71 1.95c-0.39 0.33 -1.66 0.52 -1.71 0.58c-0.64 0.68 -0.03 1.96 -1.02 2.24c-0.89 0.25 -1.02 1.03 -1.64 1.52c-1.74 -0.28 -0.62 -1.06 -2.80 -0.80c-1.98 0.24 -3.41 -0.86 -4.17 -2.75c-0.53 -1.32 -7.44 -3.84 -4.03 -5.35c1.46 -0.65 -0.50 -3.53 0.82 -3.76c2.34 -0.41 0.80 -1.58 2.05 -2.24c0.00 -0.54 -0.14 -0.82 -0.14 -1.30c0.00 -1.62 -0.68 -1.18 -0.68 -3.04c0.00 -0.33 -1.38 -3.41 -1.78 -3.98c-0.61 -0.88 -1.60 -0.34 -2.19 0.00c-0.92 0.54 -1.41 0.21 -2.39 1.01c-0.68 0.56 -2.09 0.69 -2.80 0.14c-0.88 -0.67 -2.57 0.01 -3.28 -0.43c-0.30 -0.19 -0.83 -1.00 -0.89 -1.01c-0.06 -1.27 -1.18 -0.17 -1.37 -1.38c-0.17 -1.14 -0.89 -1.53 -0.89 -2.97c0.00 -0.98 -2.48 -1.76 -2.60 -2.39c-0.06 -0.34 0.14 -1.45 0.00 -1.74c-0.24 -0.49 -0.74 -0.31 -0.96 -0.65c-0.38 -0.60 -0.68 -1.95 -1.16 -2.46l-7.79 -7.53l-2.53 0.00c-0.11 0.79 -0.65 1.61 0.14 2.10c1.10 0.69 1.42 1.44 1.02 2.97c-0.41 1.57 -0.14 3.36 -0.20 4.99c-0.02 0.42 -0.88 1.15 -1.60 1.46c-0.78 -0.27 -1.06 -0.51 -1.19 -1.44c-0.04 -0.30 0.04 -0.61 0.00 -0.90c-0.11 -0.92 -0.33 0.60 -0.34 0.72c-0.02 0.23 -0.66 0.43 -0.68 0.36c-0.31 -0.71 0.09 -1.07 -0.34 -1.63c-0.41 -0.53 -0.06 -1.08 -1.03 -1.08c-1.32 0.00 -0.80 -0.05 -1.20 -0.72c-0.48 -0.81 -1.51 -0.83 -2.57 -0.72c-0.48 0.05 -1.95 0.31 -2.05 0.72c-1.10 1.68 -0.25 1.09 -2.22 1.45c-0.47 0.09 0.28 1.91 -0.86 1.08c-1.06 -0.76 -0.68 -2.39 -0.68 -3.62c0.00 -0.23 0.03 -0.50 0.00 -0.72c-0.08 -0.62 -0.46 0.52 -1.03 0.18c-0.57 -0.34 0.30 -2.35 -1.03 -2.35c-0.55 0.00 -1.03 0.05 -1.54 0.18c-0.86 0.22 -0.45 0.54 -1.37 0.54c0.00 -0.85 0.13 -0.68 -0.17 -0.90c-0.23 -0.17 -0.28 -0.30 -0.34 -0.54c-0.10 -0.41 -0.77 -0.91 -1.20 -1.08c-0.50 -0.21 -0.51 -3.85 -0.51 -4.70c1.20 0.00 1.54 0.28 1.54 -1.09c0.00 -0.66 -0.36 -1.04 0.17 -1.45c0.25 -0.19 0.67 -0.34 0.86 -0.36c0.06 -0.01 0.49 0.03 0.51 0.00c0.02 -0.02 0.18 -0.63 0.17 -0.72c-0.03 -0.27 -0.35 -0.46 -0.68 -0.54c-0.95 -1.08 -1.19 -2.44 -0.68 -3.98c0.29 -0.88 1.88 0.20 1.88 -1.08c0.00 -0.51 -0.32 -0.63 -0.34 -0.90c-0.08 -1.20 0.44 -0.84 1.37 -0.90c0.53 -0.03 -0.19 -1.52 0.34 -1.63c3.09 -0.60 2.13 1.63 4.79 1.63c-0.04 -0.78 -0.06 -1.26 -0.34 -1.99c-0.32 -0.84 -0.23 -1.03 0.17 -1.45l0.17 -0.18c0.46 -0.49 0.60 -0.21 0.85 -0.90c0.16 -0.44 0.00 -1.67 0.00 -2.17c0.00 -0.60 -0.41 -0.30 -0.51 -0.72c-0.12 -0.50 -0.17 -0.85 -0.17 -1.45c-1.35 0.11 -0.34 0.27 -1.54 0.72c-0.64 0.24 -1.32 0.18 -2.05 0.18l-1.37 0.00l-1.88 0.00l-0.34 -1.99l-4.45 -0.72c-0.13 -0.59 -0.17 -0.74 -0.17 -1.27c0.00 -0.27 -0.07 -0.66 0.00 -0.90c0.04 -0.14 0.05 -0.05 0.00 -0.18c-0.05 -0.13 -0.03 -0.36 -0.17 -0.36l-0.17 0.00l0.00 -0.18c0.00 -0.33 -1.36 0.00 -1.71 0.00c0.00 -2.24 -0.25 -2.89 0.34 -4.52c0.22 -0.59 -1.28 -0.98 0.17 -1.27c1.97 -0.38 3.08 1.12 3.08 -1.63c0.00 -2.11 -0.83 -3.20 0.17 -5.06c0.68 -1.28 0.17 -1.12 0.34 -2.71c0.06 -0.52 1.02 -1.50 1.54 -1.81c0.45 -0.27 0.60 -2.96 0.86 -3.44c0.11 -0.21 1.22 -0.27 1.71 -0.90c0.52 -0.68 0.51 -0.81 0.51 -1.99c-2.22 -1.00 -1.27 -0.36 -2.57 -1.99c-0.40 -0.50 -3.90 0.39 -4.62 -0.36c-0.55 -0.59 -0.33 -1.28 -1.37 -1.63c-1.15 -0.38 -2.46 1.67 -2.57 2.53c-0.18 1.50 0.72 1.18 -1.20 1.45c-0.53 0.07 -0.39 1.43 -0.86 1.81c-0.64 0.52 -0.75 -1.99 -1.88 -1.99c-0.30 0.00 -2.03 0.15 -2.05 -0.18c-0.11 -1.75 -0.50 -1.09 -2.39 -1.09c-1.09 -1.87 1.29 -0.94 0.86 -1.99c-0.14 -0.34 -0.25 -0.81 -0.34 -0.90c-0.85 -0.87 -1.03 -0.06 -1.03 -1.63c0.00 -2.11 -2.04 -7.98 2.22 -4.52c0.67 0.55 1.89 2.01 2.91 1.27c0.08 -0.05 0.01 -2.00 0.51 -2.53c0.37 -0.39 1.54 -1.07 1.54 -1.63l0.00 -1.27c0.00 -0.53 -0.97 -0.51 -1.37 -0.54c-1.32 -0.10 -3.57 -0.11 -4.62 -0.90c-1.01 -0.77 -1.37 -0.72 -1.37 -1.99c1.63 -1.72 0.77 -1.44 0.51 -3.26c-0.13 -0.92 0.37 -3.74 -0.17 -4.34c-0.29 -0.33 -2.85 -0.49 -3.25 -0.36c-1.02 0.34 -1.26 1.49 -1.71 2.53c-0.23 0.55 -1.20 1.91 -1.20 2.53c0.00 0.94 0.51 0.88 0.51 2.17c0.00 1.06 -0.61 2.99 -1.20 3.62c-0.23 0.24 -0.99 0.32 -1.75 0.38c-0.02 -0.06 -0.03 -0.11 -0.03 -0.16c-0.06 -0.58 -0.22 -0.28 -0.44 -0.47c-0.41 -0.35 0.13 -0.30 -0.66 -0.47c-0.10 -0.02 -0.78 -0.42 -0.88 -0.70c-1.14 -3.25 -4.28 2.13 -5.51 3.73c-1.62 2.12 -4.92 1.81 -6.17 3.96c-0.46 0.79 -0.86 1.23 -1.32 2.10c-0.26 0.49 -2.35 -0.19 -3.09 -0.23c-0.63 -0.04 -0.44 -2.44 -0.44 -3.26c0.00 -1.80 -0.62 -2.26 -0.05 -3.40c0.72 -1.47 0.85 -1.02 1.59 -1.50c0.63 -0.40 1.34 -2.12 1.76 -2.80c1.40 -1.25 2.42 -0.80 2.42 -1.63l0.00 -0.93l-1.98 0.00c-1.12 0.00 -0.93 0.14 -1.54 0.93c-0.52 0.68 -1.46 0.47 -2.42 0.47c-0.75 0.00 -0.60 -0.33 -0.66 -1.17c0.64 -0.23 0.49 -1.36 1.32 -1.63c0.98 -0.32 2.08 -0.10 2.87 -0.93c0.50 -0.53 0.20 -1.33 0.66 -1.86c0.53 -0.61 1.27 -0.47 2.43 -0.47c1.50 0.00 0.22 2.25 0.22 2.33c0.00 0.80 1.10 0.29 1.10 1.17c0.00 0.38 -0.15 0.43 0.22 0.47c0.23 0.02 1.09 0.01 1.10 0.00c0.08 -0.16 0.31 -2.00 0.44 -2.33c-0.22 0.00 1.10 0.24 1.10 -1.63c0.00 -1.43 -0.42 -2.09 0.27 -2.85c0.99 -1.08 1.63 -2.89 2.14 -3.83c0.67 -1.25 -1.51 -8.78 -4.40 -4.97c-0.49 0.65 -2.12 0.00 -2.43 0.00c-0.41 0.00 -1.87 -0.21 -2.31 -0.51c-0.62 -0.43 0.18 -1.49 -2.22 -3.23l1.01 -4.88l-1.71 -0.10l-0.86 -4.20l-1.28 0.00c-0.64 0.00 -0.54 0.18 -0.57 -0.45c-0.03 -0.86 -0.14 -1.13 -0.14 -1.95c0.00 -0.45 -0.22 -0.29 -0.28 -0.45c-0.17 -0.46 -0.15 -1.02 -0.28 -1.50c-0.10 -0.36 -0.28 -0.91 -0.28 -1.20l4.84 -2.56l-0.14 -2.11c-0.41 -1.94 -1.14 -1.33 -2.84 -1.80c-0.24 -0.07 1.07 -0.02 1.28 -0.75c0.95 -3.25 -0.18 -4.90 2.42 -6.92c1.47 -1.14 3.41 -8.12 0.71 -8.12c-1.47 0.00 -4.46 -0.42 -4.84 -1.80c-0.08 -0.29 -0.12 -0.62 -0.13 -1.00c1.28 -4.70 3.89 -0.01 5.91 -2.15c0.37 -0.39 1.21 -0.04 1.29 -0.76c0.17 -1.56 1.38 -1.88 2.87 -1.83c4.59 0.15 2.59 6.20 7.62 6.70c0.51 0.05 2.55 0.84 4.70 1.44c-0.66 -0.00 -3.02 -0.00 -2.26 -0.00l0.16 0.00l0.00 0.17c0.00 0.51 0.95 0.21 1.42 0.33c0.45 0.12 0.95 0.15 0.95 0.67l0.00 0.17c0.00 0.19 1.15 0.31 1.26 0.33c0.00 5.07 2.36 7.79 4.42 11.69c0.92 1.74 2.90 5.23 4.42 6.18c2.23 1.39 4.86 2.03 5.21 5.01c0.67 2.14 -0.32 5.60 -0.32 7.35c0.00 1.12 -0.04 1.54 -0.32 2.17c-0.22 0.50 1.41 2.67 0.79 2.84c-2.51 0.68 -2.68 -2.98 -2.68 -4.68c0.00 -2.27 0.32 -3.73 0.32 -6.01c0.00 -1.33 -1.90 -0.30 -1.90 -1.84c0.00 -1.04 -1.75 -2.56 -2.84 -3.01c-2.12 -0.85 -2.12 -2.28 -2.84 -4.17c-0.76 -1.98 1.39 -2.09 -1.89 -2.67c0.00 3.66 1.14 3.73 1.85 6.16c0.66 2.25 1.27 7.10 3.71 7.28c1.57 0.12 1.15 3.97 1.85 5.04c1.40 2.13 2.43 4.65 3.44 7.00c0.88 2.05 -0.74 2.24 2.12 4.76c1.02 4.29 8.58 17.35 11.13 19.61c5.57 4.94 16.86 17.25 20.22 26.16c2.97 7.86 3.42 16.83 7.34 17.54c2.06 0.37 5.91 5.30 7.68 7.00c5.53 5.31 -3.04 6.14 8.21 9.97c1.90 2.51 3.38 1.82 7.13 1.82c5.59 0.00 9.81 -0.52 15.49 0.26c1.28 0.18 4.40 4.68 4.43 4.68c5.64 0.00 4.43 -0.68 7.13 4.16c1.37 2.45 3.52 2.08 4.18 3.90c1.29 3.56 2.41 7.91 7.13 6.76c0.00 -1.54 5.40 -0.48 7.13 -1.04c1.68 -0.54 2.59 -1.51 3.74 -2.34l1.33 2.60c0.00 1.34 0.27 2.38 0.27 3.68c0.00 1.77 0.52 0.66 1.07 1.70c0.23 0.43 -1.60 2.42 -0.54 3.96c0.24 0.35 2.71 -0.30 3.21 0.00c1.61 0.96 -0.93 1.57 2.14 2.83c1.30 1.03 1.69 3.00 3.48 3.11c1.67 0.10 4.18 1.19 3.75 2.83c-0.50 1.91 2.11 1.73 2.41 2.55c0.03 0.07 0.54 4.92 -0.27 5.38c-1.69 0.95 0.65 3.12 -0.27 5.66c-0.44 1.22 -2.87 0.20 -3.75 1.13c-0.99 1.04 0.21 2.02 -0.27 2.55c-0.50 0.55 -1.29 0.61 -2.15 0.91z"},"MX-PU":{"name":"Puebla","path":"m577.77 549.16c0.32 -0.06 0.62 -0.10 0.98 -0.15c0.43 -0.06 0.41 -0.67 0.62 -0.99c0.05 -0.08 0.34 -0.64 0.39 -0.74c0.21 -0.47 -0.14 -0.47 0.39 -0.50c0.24 -0.01 0.47 -0.05 0.70 -0.08c0.18 -0.59 2.42 -0.33 2.42 -1.32c0.00 -1.49 -0.08 -1.67 1.32 -1.90c0.56 -0.09 1.45 -0.42 1.25 0.16c-0.31 0.90 0.71 0.14 1.09 0.41c0.37 0.27 -0.35 0.58 0.55 0.58c0.56 0.00 0.85 0.30 1.09 0.66c0.59 0.86 0.05 0.37 1.09 0.16c0.19 -2.07 0.43 -1.95 -0.70 -3.88c-1.00 -1.72 1.03 -3.86 -1.48 -3.96c-0.80 -0.03 0.53 -2.99 0.39 -3.14c-0.21 -0.23 -0.69 0.10 -0.62 -0.50c0.14 -1.29 1.51 -2.17 1.25 -3.14c-0.23 -0.85 1.16 -0.77 1.95 -1.32l0.00 -5.09l0.20 -0.23l0.33 -2.29l-0.67 -0.53c-0.21 -0.17 -0.44 0.29 -0.50 -0.18c-0.05 -0.35 0.08 0.00 0.17 -0.35c0.10 -0.41 0.17 -0.58 0.17 -1.06c0.00 -0.35 -0.17 -0.85 0.17 -0.88c0.32 -0.03 0.48 0.15 0.50 -0.18c0.01 -0.23 0.11 -0.50 0.00 -0.71c-0.07 -0.12 -0.25 -0.07 -0.33 -0.18c-0.12 -0.16 -0.36 -0.75 0.00 -0.88c0.27 -0.62 0.64 -1.22 0.50 -1.94c-0.02 -0.09 -0.29 -0.68 -0.33 -0.71c-0.05 -0.03 -0.43 0.00 -0.50 0.00c-0.80 -0.02 -2.80 -0.18 -2.00 -0.18l0.17 0.00c0.27 0.00 -0.22 -0.18 0.33 -0.18l0.67 0.00l0.48 -6.31l2.30 0.08l3.35 2.61l1.40 4.26l3.70 2.45l1.53 2.17c0.94 0.00 1.50 -0.41 1.50 0.50c0.00 0.35 0.07 0.47 0.08 0.75c0.04 0.81 0.68 -0.14 0.87 0.75c0.15 0.70 -0.14 0.73 0.63 0.76c0.54 0.02 0.77 -0.10 1.19 -0.17c0.52 -0.08 0.63 -0.37 0.63 -0.92l0.08 -0.42c0.03 -0.15 0.68 -0.44 0.79 -0.59l3.88 -3.77c0.48 0.04 0.87 0.82 0.79 1.17c-0.11 0.53 1.11 0.35 1.50 0.42c0.51 0.09 0.69 0.14 0.71 -0.42c0.05 -1.35 1.98 0.68 1.98 -1.59c0.00 -3.41 0.50 -2.52 3.25 -2.52c1.29 0.00 2.06 0.25 3.33 0.25c1.36 0.00 1.03 -0.70 1.66 -0.92c-0.05 -0.11 -3.35 -2.81 -3.09 -2.52c0.61 0.68 -1.23 -0.12 -1.82 -0.34c-1.43 -0.52 -0.29 -1.93 -0.87 -2.43c-0.60 -0.52 -1.78 -1.19 -2.53 -1.26c-1.66 -0.15 -0.90 -2.58 -2.38 -3.02c-0.56 -0.17 -1.32 0.35 -1.50 -0.17c-0.26 -0.73 0.24 -1.92 -0.32 -2.52l-4.51 -1.34c-0.05 1.01 -0.28 0.96 -1.11 1.09c-0.25 0.04 0.14 0.57 -0.32 0.34c-0.79 -0.40 -1.16 -0.86 -2.06 -1.09l-0.93 -0.62c0.79 -1.58 -0.98 -2.74 -1.75 -3.65c-1.09 -1.31 -0.71 -3.24 0.44 -3.96c2.53 -1.58 2.71 -6.32 4.63 -8.86c0.90 -1.19 0.22 -0.94 -0.88 -2.10c-0.90 0.00 -0.12 -0.79 -1.32 -0.93c-0.49 -0.06 0.10 -1.82 -0.88 -1.17c-0.96 0.63 0.14 2.05 -1.98 1.86c-1.03 -0.09 -1.85 -0.68 -1.32 -2.10c0.55 -1.48 3.05 -0.67 4.19 -0.93c0.71 -0.16 1.90 -2.54 2.20 -3.26c0.25 -0.58 0.54 -2.24 0.88 -2.33c1.78 -0.50 1.32 0.23 2.42 -1.63c0.00 -0.84 0.47 -1.39 0.47 -2.17c0.77 -0.06 1.52 -0.14 1.75 -0.38c0.59 -0.63 1.20 -2.56 1.20 -3.62c0.00 -1.29 -0.51 -1.23 -0.51 -2.17c0.00 -0.62 0.96 -1.99 1.20 -2.53c0.45 -1.04 0.69 -2.19 1.71 -2.53c0.40 -0.13 2.96 0.04 3.25 0.36c0.54 0.60 0.04 3.42 0.17 4.34c0.26 1.82 1.12 1.53 -0.51 3.26c0.00 1.27 0.36 1.22 1.37 1.99c1.04 0.79 3.30 0.81 4.62 0.90c0.40 0.03 1.37 0.01 1.37 0.54l0.00 1.27c0.00 0.56 -1.17 1.23 -1.54 1.63c-0.50 0.53 -0.44 2.48 -0.51 2.53c-1.02 0.74 -2.23 -0.72 -2.91 -1.27c-4.26 -3.46 -2.22 2.41 -2.22 4.52c0.00 1.56 0.18 0.76 1.03 1.63c0.10 0.10 0.20 0.56 0.34 0.90c0.43 1.05 -1.94 0.12 -0.86 1.99c1.90 0.00 2.28 -0.67 2.39 1.09c0.02 0.34 1.75 0.18 2.05 0.18c1.13 0.00 1.24 2.51 1.88 1.99c0.46 -0.38 0.32 -1.73 0.86 -1.81c1.92 -0.26 1.01 0.05 1.20 -1.45c0.11 -0.87 1.42 -2.91 2.57 -2.53c1.04 0.34 0.81 1.04 1.37 1.63c0.71 0.76 4.22 -0.14 4.62 0.36c1.30 1.63 0.35 0.99 2.57 1.99c0.00 1.18 0.01 1.31 -0.51 1.99c-0.49 0.63 -1.60 0.69 -1.71 0.90c-0.25 0.48 -0.40 3.16 -0.86 3.44c-0.52 0.31 -1.48 1.28 -1.54 1.81c-0.17 1.59 0.34 1.43 -0.34 2.71c-1.00 1.87 -0.17 2.96 -0.17 5.06c0.00 2.75 -1.11 1.24 -3.08 1.63c-1.45 0.28 0.04 0.67 -0.17 1.27c-0.59 1.63 -0.34 2.29 -0.34 4.52c0.35 0.00 1.71 -0.33 1.71 0.00l0.00 0.18l0.17 0.00c0.14 0.00 0.12 0.23 0.17 0.36c0.05 0.13 0.04 0.04 0.00 0.18c-0.07 0.25 0.00 0.63 0.00 0.90c0.00 0.52 0.04 0.67 0.17 1.27l4.45 0.72l0.34 1.99l1.88 0.00l1.37 0.00c0.73 0.00 1.41 0.06 2.05 -0.18c1.20 -0.45 0.19 -0.61 1.54 -0.72c0.00 0.59 0.05 0.95 0.17 1.45c0.10 0.43 0.51 0.12 0.51 0.72c0.00 0.50 0.16 1.73 0.00 2.17c-0.25 0.69 -0.39 0.41 -0.85 0.90l-0.17 0.18c-0.40 0.42 -0.49 0.61 -0.17 1.45c0.28 0.73 0.30 1.21 0.34 1.99c-2.66 0.00 -1.69 -2.23 -4.79 -1.63c-0.53 0.10 0.18 1.59 -0.34 1.63c-0.93 0.06 -1.45 -0.30 -1.37 0.90c0.02 0.28 0.34 0.39 0.34 0.90c0.00 1.28 -1.59 0.21 -1.88 1.08c-0.50 1.54 -0.26 2.89 0.68 3.98c0.33 0.09 0.65 0.27 0.68 0.54c0.01 0.10 -0.15 0.70 -0.17 0.72c-0.03 0.03 -0.45 -0.01 -0.51 0.00c-0.18 0.02 -0.61 0.17 -0.86 0.36c-0.54 0.41 -0.17 0.79 -0.17 1.45c0.00 1.36 -0.34 1.09 -1.54 1.09c0.00 0.85 0.02 4.49 0.51 4.70c0.42 0.18 1.10 0.68 1.20 1.08c0.06 0.24 0.11 0.37 0.34 0.54c0.31 0.22 0.17 0.06 0.17 0.90c0.91 0.00 0.51 -0.33 1.37 -0.54c0.50 -0.13 0.99 -0.18 1.54 -0.18c1.33 0.00 0.46 2.01 1.03 2.35c0.57 0.34 0.95 -0.80 1.03 -0.18c0.03 0.22 0.00 0.50 0.00 0.72c0.00 1.22 -0.37 2.85 0.68 3.62c1.14 0.82 0.38 -1.00 0.86 -1.08c1.98 -0.36 1.12 0.24 2.22 -1.45c0.10 -0.41 1.57 -0.68 2.05 -0.72c1.06 -0.10 2.09 -0.08 2.57 0.72c0.40 0.67 -0.12 0.72 1.20 0.72c0.96 0.00 0.62 0.55 1.03 1.08c0.43 0.56 0.03 0.92 0.34 1.63c0.03 0.06 0.66 -0.13 0.68 -0.36c0.01 -0.12 0.23 -1.64 0.34 -0.72c0.04 0.29 -0.04 0.61 0.00 0.90c0.13 0.93 0.41 1.17 1.20 1.45c0.00 1.07 -1.09 1.03 -1.88 1.45c-0.38 0.20 0.48 1.73 -0.10 1.92c-0.99 0.31 0.08 2.70 -1.61 3.15c-1.05 0.28 -1.64 -0.04 -2.67 0.18c-2.06 0.00 -1.21 1.67 -3.08 2.13c-1.08 0.27 -2.88 1.76 -4.41 0.43c-1.21 -1.05 -2.34 0.36 -3.42 0.36c-2.25 0.00 -1.97 1.29 -4.11 2.24c-1.12 0.00 -1.57 0.95 -1.57 1.95c0.00 1.16 -1.74 1.01 -2.77 0.87c0.00 0.00 -1.00 -1.90 -1.06 -2.03c-0.08 -0.16 0.07 -0.55 0.00 -0.72c-0.50 -1.29 -1.74 -2.39 -3.08 -2.71c-0.89 -0.22 -0.68 -1.50 -0.68 -2.35l0.00 -1.99c-1.15 0.00 -4.61 0.27 -4.65 0.65c-0.11 0.88 -0.35 1.43 -1.33 1.70c-0.55 0.15 -0.58 1.15 -0.86 1.81c-0.33 0.78 -0.91 1.41 -0.34 2.53c0.35 0.69 2.19 0.87 2.91 1.63c0.57 0.60 0.17 0.90 0.17 1.81c0.00 0.30 -0.12 0.50 0.17 0.54c0.34 0.05 0.26 -0.03 0.51 -0.18c0.10 -0.06 0.11 -0.08 0.17 -0.18c0.13 -0.20 0.09 -0.32 0.17 -0.54c0.10 -0.29 0.13 -0.29 0.51 -0.36c0.21 -0.04 0.66 -0.02 0.86 0.00c0.32 0.03 0.73 0.54 0.51 0.90c-0.17 0.29 -0.10 -0.25 -0.17 0.36c-0.05 0.42 -0.07 -0.07 -0.17 0.36c-0.03 0.14 -0.06 0.27 -0.17 0.36c-0.09 0.07 -0.06 0.16 -0.17 0.18c-0.51 0.09 -1.03 0.00 -1.54 0.00c-2.69 0.00 -1.18 4.87 -6.50 0.90c-0.79 -0.59 -1.33 0.63 -1.88 0.36c-1.10 -0.53 -2.84 -0.56 -3.25 -0.18c-0.92 0.84 -2.90 1.28 -2.22 2.71c0.94 2.00 -4.74 -0.13 -5.13 -0.18c-1.05 -0.14 -1.89 1.49 -2.91 0.36c-1.09 -1.20 -0.13 -3.98 -2.05 -3.98c-1.41 0.00 -1.12 2.59 -2.74 0.54c-0.81 0.00 -0.65 0.17 -1.37 0.54c-0.35 0.18 -0.04 1.02 -0.17 1.08c-0.88 0.45 -1.95 0.00 -2.74 0.00c-1.58 0.00 -0.30 -1.27 -1.54 -1.27c-0.31 0.00 -1.01 0.16 -1.03 -0.18c-0.05 -0.88 0.00 -1.83 0.00 -2.71c-0.78 -0.82 -2.78 0.23 -3.59 -0.36c-0.09 -0.06 0.41 -2.23 0.17 -2.71c-0.71 -1.41 -2.88 -2.12 -2.91 -2.35c-0.07 -0.56 -2.39 0.36 -1.54 -1.09c0.97 -1.65 -2.12 -0.02 -1.54 -1.63c0.17 -0.48 -0.06 -1.44 0.00 -1.99c0.02 -0.19 0.06 -0.36 0.14 -0.53z"},"MX-TL":{"name":"Tlaxcala","path":"m589.78 507.66l2.30 0.08l3.35 2.61l1.40 4.26l3.70 2.45l1.53 2.17c0.94 0.00 1.50 -0.41 1.50 0.50c0.00 0.35 0.07 0.47 0.08 0.75c0.04 0.81 0.68 -0.14 0.87 0.75c0.15 0.70 -0.14 0.73 0.63 0.76c0.54 0.02 0.77 -0.10 1.19 -0.17c0.52 -0.08 0.63 -0.37 0.63 -0.92l0.08 -0.42c0.03 -0.15 0.68 -0.44 0.79 -0.59l3.88 -3.77c0.48 0.04 0.87 0.82 0.79 1.17c-0.11 0.53 1.11 0.35 1.50 0.42c0.51 0.09 0.69 0.14 0.71 -0.42c0.05 -1.35 1.98 0.68 1.98 -1.59c0.00 -3.41 0.50 -2.52 3.25 -2.52c1.29 0.00 2.06 0.25 3.33 0.25c1.36 0.00 1.03 -0.70 1.66 -0.92c-0.05 -0.11 -3.35 -2.81 -3.09 -2.52c0.61 0.68 -1.23 -0.12 -1.82 -0.34c-1.43 -0.52 -0.29 -1.93 -0.87 -2.43c-0.60 -0.52 -1.78 -1.19 -2.53 -1.26c-1.66 -0.15 -0.90 -2.58 -2.38 -3.02c-0.56 -0.17 -1.32 0.35 -1.50 -0.17c-0.26 -0.73 0.24 -1.92 -0.32 -2.52l-4.51 -1.34c-0.05 1.01 -0.28 0.96 -1.11 1.09c-0.25 0.04 0.14 0.57 -0.32 0.34c-0.79 -0.40 -1.16 -0.86 -2.06 -1.09l-0.93 -0.62c-0.07 0.10 -0.13 0.20 -0.21 0.31c-1.33 -0.47 -3.15 -0.90 -3.31 0.93c-0.03 0.37 -0.63 0.48 -0.88 0.70c-0.02 0.02 -1.17 2.30 -1.32 0.47c-0.10 -1.20 -0.69 0.07 -1.10 0.23c-0.37 0.15 -0.65 -0.07 -0.88 0.23c-0.16 0.20 -0.77 1.04 -1.10 1.17c-0.80 0.29 -2.61 0.00 -3.55 -0.03c-0.28 0.32 -0.60 0.46 -0.84 0.72c-0.16 0.16 -0.16 0.51 -0.50 0.53c-0.62 0.04 -1.26 -0.05 -1.34 0.53c-0.08 0.67 -0.25 1.07 -0.17 1.94c0.04 0.43 1.24 0.78 1.50 0.88l-0.02 0.40z"},"MX-MR":{"name":"Morelos","path":"m563.26 537.26c0.25 0.68 0.23 1.31 0.53 2.00c0.59 1.38 1.91 0.65 2.42 1.90c0.06 0.14 0.42 1.21 0.47 1.24c0.45 0.26 -0.56 1.01 -0.31 1.49c0.84 1.59 0.35 0.99 3.27 0.99c0.00 1.78 1.31 0.99 2.73 0.99c0.60 0.00 0.41 0.38 0.86 0.41c1.04 0.08 1.36 0.19 2.18 0.66c0.07 0.04 0.17 0.18 0.23 0.25c0.26 0.24 0.20 0.26 0.39 0.58c0.18 0.30 0.92 -0.20 1.17 -0.17c0.09 0.01 0.11 1.40 0.16 1.65c0.45 -0.12 0.89 -0.18 1.40 -0.25c0.43 -0.06 0.41 -0.67 0.62 -0.99c0.05 -0.08 0.34 -0.64 0.39 -0.74c0.21 -0.47 -0.14 -0.47 0.39 -0.50c0.24 -0.01 0.47 -0.05 0.70 -0.08c0.18 -0.59 2.42 -0.33 2.42 -1.32c0.00 -1.49 -0.08 -1.67 1.32 -1.90c0.56 -0.09 1.45 -0.42 1.25 0.16c-0.31 0.90 0.71 0.14 1.09 0.41c0.37 0.27 -0.35 0.58 0.55 0.58c0.56 0.00 0.85 0.30 1.09 0.66c0.59 0.86 0.05 0.37 1.09 0.16c0.19 -2.07 0.43 -1.95 -0.70 -3.88c-1.00 -1.72 1.03 -3.86 -1.48 -3.96c-0.80 -0.03 0.53 -2.99 0.39 -3.14c-0.21 -0.23 -0.69 0.10 -0.62 -0.50c0.14 -1.29 1.51 -2.17 1.25 -3.14c-0.23 -0.85 1.16 -0.77 1.95 -1.32l0.10 -5.20l-2.07 2.35l-3.00 0.18l-2.50 -2.47l-0.83 -2.12l-1.29 -0.02l-0.35 0.79l-0.42 -0.37l-1.61 0.15l-1.40 1.03l-1.40 -1.11l-4.62 -0.29l-2.48 -1.92l-0.12 5.80c0.00 0.59 -0.04 0.61 0.33 1.06c0.11 0.13 0.53 0.85 0.33 1.06c-0.22 0.24 -0.18 -0.21 -0.33 0.18c-0.15 0.40 -0.67 0.63 -0.67 1.06l0.00 0.18c0.00 0.14 -0.20 -0.18 -0.33 -0.18l-0.50 0.00l-1.00 -0.53l-3.00 2.65l-0.00 5.47z"},"MX-DF":{"name":"Mexico City (also known as the Federal District)","path":"m568.56 520.52l0.05 -1.87c-0.39 -0.23 -1.14 -0.54 -1.17 -0.88c-0.04 -0.41 0.27 -0.96 0.17 -1.24c-0.16 -0.43 -0.95 0.15 -1.34 -0.18c-0.30 -0.25 -0.33 -0.46 -0.33 -0.88c0.00 -0.39 -0.18 -1.73 0.17 -1.76c0.13 -0.01 0.93 0.07 1.00 0.00c0.09 -0.10 0.04 -0.93 0.17 -1.06c0.02 -0.02 0.46 -0.00 0.50 0.00c1.04 0.08 0.08 -0.03 0.67 0.18l3.28 -3.63l-1.03 -0.27l0.33 -2.09l1.59 0.09l-0.14 -1.72l0.79 -3.07l1.50 1.41l-1.17 2.62l2.84 0.91l0.67 1.94l-0.17 1.76l3.84 2.29l-0.17 3.35l1.17 1.10l-1.17 0.49l0.22 4.21l-0.35 0.79l-0.42 -0.37l-1.61 0.15l-1.40 1.03l-1.40 -1.11l-4.62 -0.29l-2.48 -1.92z"},"MX-HI":{"name":"Hidalgo","path":"m592.98 436.63l1.71 0.10l-1.01 4.88c2.40 1.73 1.61 2.80 2.22 3.23c0.44 0.31 1.91 0.51 2.31 0.51c0.30 0.00 1.93 0.65 2.43 0.00c2.88 -3.81 5.07 3.73 4.40 4.97c-0.51 0.94 -1.15 2.75 -2.14 3.83c-0.69 0.75 -0.27 1.41 -0.27 2.85c0.00 1.88 -1.32 1.63 -1.10 1.63c-0.13 0.33 -0.36 2.17 -0.44 2.33c-0.01 0.01 -0.87 0.02 -1.10 0.00c-0.37 -0.04 -0.22 -0.09 -0.22 -0.47c0.00 -0.87 -1.10 -0.37 -1.10 -1.17c0.00 -0.08 1.28 -2.33 -0.22 -2.33c-1.15 0.00 -1.90 -0.15 -2.43 0.47c-0.46 0.54 -0.16 1.34 -0.66 1.86c-0.79 0.83 -1.89 0.61 -2.87 0.93c-0.83 0.28 -0.68 1.41 -1.32 1.63c0.07 0.83 -0.09 1.17 0.66 1.17c0.96 0.00 1.91 0.21 2.42 -0.47c0.61 -0.79 0.43 -0.93 1.54 -0.93l1.98 0.00l0.00 0.93c0.00 0.83 -1.03 0.38 -2.42 1.63c-0.43 0.68 -1.13 2.39 -1.76 2.80c-0.75 0.48 -0.87 0.03 -1.59 1.50c-0.56 1.14 0.05 1.59 0.05 3.40c0.00 0.82 -0.19 3.22 0.44 3.26c0.74 0.05 2.82 0.72 3.09 0.23c0.46 -0.87 0.86 -1.31 1.32 -2.10c1.25 -2.15 4.55 -1.85 6.17 -3.96c1.23 -1.60 4.37 -6.98 5.51 -3.73c0.10 0.28 0.78 0.68 0.88 0.70c0.79 0.17 0.25 0.11 0.66 0.47c0.22 0.19 0.38 -0.11 0.44 0.47c0.09 0.87 -0.44 1.43 -0.44 2.33c-1.10 1.86 -0.64 1.13 -2.42 1.63c-0.34 0.10 -0.64 1.75 -0.88 2.33c-0.31 0.73 -1.49 3.10 -2.20 3.26c-1.14 0.26 -3.64 -0.55 -4.19 0.93c-0.53 1.42 0.30 2.01 1.32 2.10c2.12 0.19 1.02 -1.23 1.98 -1.86c0.98 -0.65 0.39 1.11 0.88 1.17c1.20 0.15 0.42 0.93 1.32 0.93c1.10 1.16 1.78 0.91 0.88 2.10c-1.92 2.53 -2.10 7.28 -4.63 8.86c-1.16 0.72 -1.53 2.66 -0.44 3.96c0.82 0.98 2.78 2.22 1.54 3.96c-1.33 -0.47 -3.15 -0.90 -3.31 0.93c-0.03 0.37 -0.63 0.48 -0.88 0.70c-0.02 0.02 -1.17 2.30 -1.32 0.47c-0.10 -1.20 -0.69 0.07 -1.10 0.23c-0.37 0.15 -0.65 -0.07 -0.88 0.23c-0.16 0.20 -0.77 1.04 -1.10 1.17c-0.80 0.29 -2.61 0.00 -3.53 0.00c0.00 -0.82 0.18 -1.76 -0.44 -2.10c-0.82 -0.45 -2.15 0.13 -3.09 -0.23c-0.17 -0.06 0.09 -0.34 0.22 -0.47c0.44 -0.41 0.75 -0.00 1.10 -0.47c0.42 -0.56 1.20 -0.53 1.54 -1.17c0.04 -0.08 0.64 -0.90 0.44 -1.17c-0.21 -0.27 -0.58 -0.28 -0.66 -0.70c-0.07 -0.37 -0.12 -0.82 -0.22 -1.17c-0.19 -0.67 -0.31 -1.95 -0.66 -2.10c-0.43 -0.18 -1.87 -0.12 -1.98 0.23c-2.56 -0.18 -0.93 0.00 -5.07 0.00c-1.58 0.00 -1.22 0.57 -1.76 0.70c-0.25 0.06 -3.61 4.24 -3.31 1.40c0.06 -0.58 -0.75 -1.13 -0.66 -1.86c0.05 -0.40 1.03 -0.16 1.32 -0.47c0.56 -0.59 1.54 -1.12 1.54 -2.33c0.00 -1.96 -4.02 -0.80 -3.53 -1.63c0.50 -0.85 -1.98 0.42 -1.98 0.47c-0.13 1.08 0.70 -0.02 -0.22 1.40c-0.44 0.68 -0.89 4.66 -1.54 4.66c-1.08 0.00 -2.03 0.14 -3.09 0.23c-0.64 0.06 -0.98 0.42 -1.32 1.17c-0.26 0.57 -1.13 -0.01 -1.32 0.23c-0.29 0.37 -0.66 2.64 -0.66 0.70c0.00 -1.17 -2.14 -4.17 -2.87 -4.43c-1.97 -1.22 -0.12 -1.37 0.00 -2.33c0.26 -2.10 0.63 -1.47 -0.88 -2.10c-0.43 -0.18 -1.09 -4.18 -1.54 -4.66c-0.35 -0.37 -1.95 -2.09 -1.98 -2.10c-1.22 -0.34 -4.08 1.27 -4.63 0.70c-0.31 -0.33 -0.12 -1.35 -0.88 -1.40c-1.86 -0.12 -1.80 -1.53 -3.27 -2.67l0.60 -9.64c0.76 0.37 2.75 0.84 3.35 0.00c0.83 -1.15 -0.65 -0.57 0.75 -0.99c0.94 -0.28 2.49 -0.39 2.61 -1.38c0.07 -0.54 1.67 0.27 2.05 -0.79c0.67 -1.84 1.86 -0.79 1.86 -3.15c0.00 -0.98 -1.62 -7.82 1.12 -6.50c0.92 0.44 2.42 -0.36 2.42 -1.58c0.00 -1.68 1.03 -0.81 1.30 -1.97l0.19 -0.99c0.06 -0.30 -2.00 -0.89 -2.05 -1.38c-0.08 -0.80 0.19 -1.25 0.19 -1.97c0.00 -1.95 -0.16 -1.48 1.68 -1.38c1.53 0.08 1.87 0.50 2.80 0.79c0.73 0.23 1.31 0.61 1.68 -0.39c0.40 -1.11 2.38 -0.83 3.54 -0.99c0.65 -0.09 1.20 -1.92 1.63 -1.92l-0.27 -2.81c0.28 -0.51 1.42 -2.03 2.13 -1.60c0.96 0.59 1.13 1.35 2.28 1.50c0.21 0.03 0.33 1.67 0.43 1.95c0.16 0.47 1.62 1.05 2.28 1.05c1.18 0.00 3.47 0.95 4.41 0.45c0.33 -0.18 0.65 -0.69 0.85 -0.90c0.03 -0.03 0.11 -0.24 0.14 -0.30c0.11 -0.20 0.41 -0.24 0.57 -0.45c0.18 -0.23 0.45 -0.67 0.71 -0.75c0.25 -0.08 1.14 -0.48 1.14 -0.75c-0.06 -0.87 -0.22 -1.05 -1.00 -1.05c-0.24 0.00 -0.54 -0.00 -0.71 -0.15c-0.30 -0.25 -0.40 -0.15 -0.85 -0.30c-0.28 -0.10 -0.57 -0.62 -0.57 -0.90c0.00 -0.60 -0.14 -1.05 -0.14 -1.65l6.12 -1.51z"},"MX-MX":{"name":"Estado de Mexico","path":"m591.15 502.66c-0.25 0.35 -0.60 0.46 -0.84 0.72c-0.16 0.16 -0.16 0.51 -0.50 0.53c-0.62 0.04 -1.26 -0.05 -1.34 0.53c-0.08 0.67 -0.25 1.07 -0.17 1.94c0.04 0.43 1.24 0.78 1.50 0.88l-0.50 6.71l-0.67 0.00c-0.56 0.00 -0.06 0.18 -0.33 0.18l-0.17 0.00c-0.80 0.00 1.20 0.16 2.00 0.18c0.07 0.00 0.45 -0.03 0.50 0.00c0.04 0.03 0.32 0.61 0.33 0.71c0.14 0.72 -0.23 1.32 -0.50 1.94c-0.36 0.13 -0.12 0.72 0.00 0.88c0.08 0.11 0.27 0.05 0.33 0.18c0.11 0.20 0.01 0.47 0.00 0.71c-0.02 0.33 -0.18 0.15 -0.50 0.18c-0.34 0.03 -0.17 0.53 -0.17 0.88c0.00 0.48 -0.07 0.65 -0.17 1.06c-0.09 0.36 -0.22 0.01 -0.17 0.35c0.07 0.47 0.29 0.01 0.50 0.18l0.67 0.53l-0.33 2.29l-2.17 2.47l-3.00 0.18l-2.50 -2.47l-0.83 -2.12l-1.33 0.00l-0.17 -4.24l1.17 -0.49l-1.17 -1.10l0.17 -3.35l-3.84 -2.29l0.17 -1.76l-0.67 -1.94l-2.84 -0.91l1.17 -2.62l-1.50 -1.41l-0.79 3.07l0.14 1.72l-1.59 -0.09l-0.33 2.09l1.03 0.27l-3.28 3.63c-0.59 -0.21 0.38 -0.10 -0.67 -0.18c-0.04 -0.00 -0.49 -0.02 -0.50 0.00c-0.13 0.13 -0.07 0.96 -0.17 1.06c-0.07 0.07 -0.88 -0.01 -1.00 0.00c-0.35 0.04 -0.17 1.38 -0.17 1.76c0.00 0.42 0.04 0.63 0.33 0.88c0.39 0.33 1.18 -0.25 1.34 0.18c0.10 0.28 -0.21 0.82 -0.17 1.24c0.03 0.35 0.78 0.65 1.17 0.88l-0.18 7.67c0.00 0.59 -0.04 0.61 0.33 1.06c0.11 0.13 0.53 0.85 0.33 1.06c-0.22 0.24 -0.18 -0.21 -0.33 0.18c-0.15 0.40 -0.67 0.63 -0.67 1.06l0.00 0.18c0.00 0.14 -0.20 -0.18 -0.33 -0.18l-0.50 0.00l-1.00 -0.53l-3.00 2.65l0.00 5.47c-1.17 0.00 -2.57 -1.15 -3.51 -1.76c-0.76 -0.49 -0.58 -1.72 -0.67 -1.76c-1.23 -0.71 0.04 -0.56 -2.00 -1.06c-0.96 -0.23 -0.44 1.99 -0.33 2.47c0.58 2.58 -2.50 0.43 -2.50 1.94l0.00 2.82c-1.41 0.19 -6.12 0.12 -6.51 1.59c-0.48 1.84 -1.11 1.27 -2.50 0.18c-1.70 -1.33 -1.04 -0.71 -1.67 0.35c-0.89 1.51 0.16 1.35 -1.84 2.12c-2.15 0.82 -0.26 2.28 -1.00 3.53c-0.56 0.94 -2.38 0.53 -3.34 1.24c-0.76 0.56 0.67 2.39 -1.34 1.41c-1.42 -0.64 -1.35 -2.31 -2.17 -3.18c-1.12 -1.18 -1.39 -0.60 -2.34 -2.29c-0.51 -0.91 0.95 -1.29 1.17 -1.76c0.89 -1.88 -2.50 -1.68 -2.50 -2.47c0.00 -0.98 -0.24 -3.18 0.17 -4.06c0.12 -0.27 1.32 -0.17 1.67 -0.71c0.42 -0.64 -0.72 -1.07 -1.17 -0.88c-1.01 0.41 -2.46 1.42 -2.34 -0.53c0.03 -0.43 1.32 -0.38 0.83 -0.71c-1.14 -0.75 -3.49 1.38 -3.67 -1.77c-0.04 -0.74 0.05 -1.19 0.24 -1.66l6.98 -8.70c3.69 -1.30 2.05 -4.08 2.05 -7.18c0.00 -0.75 2.98 -4.13 4.11 -4.24c2.18 -0.22 1.13 -4.13 0.72 -4.02c-1.85 0.47 -0.76 0.17 -1.33 -1.41c-0.49 -1.35 -2.66 -0.58 -1.54 -2.83c0.65 -1.31 0.09 -1.52 2.05 -1.52c1.99 0.00 2.05 -1.01 2.05 -2.94c0.00 -1.93 2.16 -1.34 2.16 -3.70c-0.28 -1.18 -2.12 -1.36 -2.26 -2.50c-0.02 -0.17 -0.16 -1.11 -0.19 -1.83c1.95 0.05 1.06 -0.05 1.99 -1.33c0.30 -0.42 0.47 -0.30 0.75 -0.59c0.67 -0.71 0.33 0.60 1.30 -0.20c0.80 -0.65 0.16 -0.69 1.49 -0.79c0.51 -0.04 0.37 -1.28 0.37 -1.77c0.00 -1.56 -1.72 -0.94 -0.75 -1.97c0.12 -0.13 0.43 -1.66 0.56 -1.97c0.15 -0.35 -0.64 -1.25 0.00 -0.99c0.16 0.07 1.12 0.39 1.12 0.00c0.00 -0.22 -1.01 -0.99 0.19 -0.99c0.81 0.00 1.29 0.20 2.01 0.19c1.47 1.15 1.41 2.55 3.27 2.67c0.76 0.05 0.57 1.07 0.88 1.40c0.54 0.58 3.41 -1.04 4.63 -0.70c0.04 0.01 1.64 1.73 1.98 2.10c0.45 0.48 1.11 4.48 1.54 4.66c1.51 0.63 1.14 -0.00 0.88 2.10c-0.12 0.96 -1.97 1.12 0.00 2.33c0.72 0.25 2.87 3.26 2.87 4.43c0.00 1.94 0.38 -0.33 0.66 -0.70c0.19 -0.25 1.06 0.34 1.32 -0.23c0.34 -0.75 0.69 -1.11 1.32 -1.17c1.05 -0.10 2.00 -0.23 3.09 -0.23c0.66 0.00 1.11 -3.99 1.54 -4.66c0.92 -1.42 0.09 -0.32 0.22 -1.40c0.01 -0.05 2.48 -1.31 1.98 -0.47c-0.49 0.83 3.53 -0.33 3.53 1.63c0.00 1.21 -0.98 1.74 -1.54 2.33c-0.29 0.31 -1.27 0.07 -1.32 0.47c-0.09 0.74 0.72 1.29 0.66 1.86c-0.31 2.84 3.06 -1.34 3.31 -1.40c0.55 -0.13 0.18 -0.70 1.76 -0.70c4.14 0.00 2.51 -0.18 5.07 0.00c0.11 -0.35 1.55 -0.41 1.98 -0.23c0.35 0.15 0.47 1.43 0.66 2.10c0.10 0.35 0.15 0.80 0.22 1.17c0.08 0.42 0.45 0.43 0.66 0.70c0.20 0.26 -0.40 1.08 -0.44 1.17c-0.34 0.63 -1.12 0.61 -1.54 1.17c-0.35 0.46 -0.66 0.05 -1.10 0.47c-0.13 0.12 -0.39 0.40 -0.22 0.47c0.94 0.36 2.27 -0.22 3.09 0.23c0.62 0.34 0.41 1.25 0.41 2.07z"},"MX-BS":{"name":"Baja California Sur","path":"m102.62 179.81l-0.00 0.00c-0.28 0.03 -0.56 0.07 -0.84 0.12c-1.63 0.30 -1.08 1.91 -2.30 2.05c-0.72 0.09 -2.90 -1.47 -3.89 -1.68c0.67 0.90 2.42 4.09 3.36 4.48c0.16 -0.29 0.29 -0.46 0.35 -0.75c0.67 -0.18 0.83 -1.12 1.59 -1.12c3.08 0.00 0.35 3.96 0.35 5.60c0.92 0.00 0.80 -0.09 1.59 -0.37c0.16 0.67 0.53 1.51 0.71 2.24c0.29 -0.08 0.30 -0.13 0.53 -0.37c0.28 -0.88 0.38 -0.64 0.53 -1.12c1.05 0.00 1.10 0.59 1.41 1.49c0.22 0.62 1.35 0.37 1.94 0.37c0.00 0.89 0.19 1.68 -0.88 1.68l-1.41 0.00c-0.69 0.00 -0.81 0.28 -1.41 0.37l0.00 0.37l-1.94 0.00c0.00 -1.01 -0.88 -1.77 -0.88 -2.80c-0.55 -0.15 -1.08 -1.06 -1.59 -1.12c-0.67 -0.08 -1.44 0.00 -2.12 0.00c-0.08 -0.73 -0.53 -1.09 -0.53 -1.68l0.00 -1.49c-0.82 -0.60 -0.45 -0.56 -1.06 -0.56c-0.09 0.27 -0.73 0.49 -0.88 1.12c-1.38 0.36 -0.73 2.43 -2.65 2.43c-1.35 0.00 -1.83 -0.38 -2.83 -0.56c-0.15 -0.63 -1.32 -0.74 -1.59 -1.31c-0.48 0.00 -1.79 -0.66 -1.94 -1.31c-1.25 -0.22 -1.63 -1.49 -3.89 -1.49c-2.17 0.00 -3.75 -0.75 -5.65 -0.75c-0.22 -0.69 -2.28 -0.88 -2.47 -1.49c-0.78 0.00 -1.75 -0.19 -2.65 -0.19l0.00 0.56c0.31 0.11 0.88 0.38 0.88 0.93c0.24 0.08 0.28 0.25 0.35 0.56l0.71 0.00c2.89 1.34 4.42 2.46 4.42 5.98c2.20 0.00 5.30 -0.49 5.30 2.05c0.00 7.94 8.30 4.38 8.30 13.26c0.00 4.19 0.84 5.04 4.95 5.04c3.00 0.00 1.16 2.36 3.00 2.61c0.73 0.10 2.65 -2.18 2.65 0.19c0.00 2.91 2.65 1.35 2.65 4.30c0.00 2.49 4.96 0.37 6.01 0.37c1.89 0.89 -0.67 4.86 1.77 4.86c0.36 1.14 1.77 0.61 1.94 2.24c0.04 0.41 1.85 2.71 2.12 2.80c0.00 0.68 0.35 0.72 0.35 1.31c0.80 0.00 1.14 0.46 1.94 0.37c0.61 -0.07 0.58 -0.95 1.06 -1.12c0.00 -0.62 0.53 -1.33 0.53 -2.05c0.59 -0.16 1.94 -0.56 2.47 -0.56c0.09 -0.39 0.36 -0.47 0.71 -0.56c0.00 -0.71 0.31 -0.56 0.88 -0.56c0.23 0.96 0.35 2.75 0.35 3.74c1.58 0.00 2.87 0.19 4.24 0.19c0.00 -0.74 0.18 -1.41 0.18 -2.24l0.71 0.00c0.12 0.37 1.06 0.93 1.59 0.93c0.00 -0.68 0.58 -2.28 -0.35 -2.61l0.00 -2.99c0.27 -0.10 0.18 0.01 0.18 -0.37c0.22 -0.08 0.28 -0.14 0.35 -0.37l0.71 0.00c0.00 1.70 -0.29 4.32 0.35 5.60c0.46 0.93 0.91 1.59 0.18 2.43c-0.36 0.41 -1.41 2.18 -1.59 2.24c0.00 4.31 1.13 1.68 2.65 1.68c2.70 0.00 0.74 2.72 2.12 3.92c2.86 2.50 3.75 2.68 5.48 5.98c0.31 0.60 1.69 1.54 2.30 2.05c0.74 0.63 0.34 4.95 3.00 3.55c6.92 -3.65 7.23 5.13 9.27 8.17l-0.54 0.00l0.00 -0.19l-0.18 0.00c-0.38 0.00 -0.04 -0.38 -0.36 -0.57c-0.21 -0.13 -0.76 0.00 -0.54 0.38c0.09 0.15 0.26 0.41 0.54 0.57c0.26 0.15 0.36 -0.17 0.36 0.19l0.00 0.38c0.00 0.13 0.06 0.19 0.18 0.19l0.18 0.00l0.00 0.19c0.00 0.25 0.40 0.33 0.90 0.38c-0.10 -0.31 -0.26 -0.45 -0.36 -0.76l-0.18 -0.57l0.00 -0.19c0.41 0.61 0.89 0.98 1.50 0.98c0.00 4.53 2.49 6.37 4.06 9.53c1.05 2.10 0.35 5.38 0.35 7.84c0.00 2.58 0.63 6.27 -1.06 7.84c-0.75 0.71 -1.42 4.04 -1.77 5.04c-0.85 2.49 0.71 3.40 0.71 5.42c0.00 2.81 -1.89 2.90 -0.71 6.35c0.85 2.49 -0.61 3.65 1.41 5.79c3.66 -5.16 -0.15 0.93 4.24 0.93c0.00 -1.77 0.88 0.68 0.88 1.49l-0.35 0.00l-0.18 0.19c0.00 2.77 2.65 1.09 2.65 4.67c1.11 0.00 0.28 -1.34 0.18 -1.87l0.71 0.00c0.00 0.73 0.35 1.13 0.35 1.87c0.84 0.30 1.13 2.24 2.83 2.24c0.13 -0.55 0.41 -0.56 0.53 -0.93c0.61 0.00 1.07 0.19 1.59 0.19c0.00 1.55 0.89 4.86 2.47 4.86c0.89 3.78 10.25 7.84 10.25 8.22c3.06 1.08 9.78 10.46 12.54 10.46c0.12 0.65 0.85 2.09 1.41 2.24c0.00 4.93 8.13 8.17 8.13 8.78c1.43 0.00 5.12 0.57 5.12 2.24c1.23 0.43 3.00 7.20 3.00 8.22c1.30 0.46 1.77 1.84 1.77 3.55c-0.63 0.22 1.49 6.40 0.71 7.28c-0.98 1.11 -0.63 3.85 0.35 4.11c0.12 0.51 0.43 0.96 0.53 1.49l0.35 0.00c0.00 9.86 10.67 -1.61 12.37 -2.05l0.00 -0.37c0.93 0.00 1.18 -0.93 2.12 -0.93c0.14 -0.60 0.97 -0.74 1.24 -1.31c5.17 -9.11 7.83 -5.26 2.90 -17.97c-0.61 -1.58 -4.10 -1.80 -4.84 -5.75c-0.47 -2.49 -0.44 -3.17 -2.47 -4.67c-1.52 -1.12 -2.70 -2.77 -2.83 -3.92c-0.33 -3.01 -3.33 -1.79 -5.12 -7.47c-2.56 -2.25 -4.55 -1.64 -5.12 -6.35c-0.09 -0.77 -1.22 -0.45 -1.94 -0.56c-3.40 -0.53 -2.77 0.46 -2.12 0.93c1.37 1.01 1.98 3.66 -0.18 3.92c-0.71 0.09 -0.53 0.81 -0.53 1.49c0.00 2.55 1.45 0.30 2.30 0.75c0.72 0.38 -1.77 3.70 -2.47 3.36c-2.49 -1.20 -1.47 -3.35 -2.12 -5.42c-6.48 -4.00 -8.57 -14.31 -9.60 -14.31c-3.31 0.00 3.90 -7.45 1.73 -11.58c-1.87 -3.57 -3.27 -6.02 -5.76 -9.45c-4.20 -5.77 -0.02 -13.72 -6.34 -17.06c-2.57 -1.36 -3.77 -10.41 -5.19 -12.80c-2.59 -4.39 4.79 -8.84 1.15 -7.92c-2.33 0.58 -3.10 -14.16 -5.76 -16.45c-0.95 -0.82 -2.62 -5.59 -3.46 -7.01c-0.97 -1.63 -5.38 -5.50 -5.48 -5.79c-1.11 -0.54 -2.31 -1.73 -2.31 0.00c0.00 2.67 0.21 1.93 1.73 3.05c2.41 1.77 -2.84 5.84 2.31 6.40c3.38 0.37 3.50 4.27 0.00 3.96c-1.77 -0.16 -2.68 -2.84 -3.75 -4.27c-1.03 -1.39 -2.88 -0.89 -2.88 -3.35c0.00 -0.86 -0.24 -2.42 0.29 -3.05c0.94 -1.13 0.65 -2.97 0.00 -3.96c-1.32 -2.00 -1.73 -1.21 -1.73 -4.27c-0.52 -2.38 -3.60 -4.29 -5.19 -6.70c-1.07 -1.63 -2.48 -12.63 -4.03 -12.80c-9.92 -1.08 -9.06 -11.39 -10.73 -18.51l-44.39 -3.49l0.00 0.00zm129.22 154.48c-0.43 0.00 -4.20 -0.55 -3.75 -1.51c1.11 -2.35 -1.10 -2.92 -2.32 -3.97c-0.51 -0.44 0.00 -4.46 0.00 -5.29c0.00 -0.42 -0.15 -0.90 0.36 -0.95c2.04 -0.20 2.05 1.73 2.68 3.21c0.27 0.64 0.85 0.72 1.25 2.08c0.46 1.56 0.28 2.82 1.61 3.03c0.46 0.07 0.36 0.58 0.36 1.13c0.00 1.26 -0.12 0.85 -0.18 2.27l0.00 0.00zm-16.78 -11.53c0.14 -0.62 0.18 -0.65 0.18 -1.13c0.00 -0.46 0.49 -0.51 0.89 -0.76c0.36 -0.21 0.18 -0.98 0.18 -1.51c0.00 -0.65 0.22 -0.66 0.36 -1.32c0.06 -0.27 -0.28 -0.52 -0.18 -0.95c0.07 -0.30 1.33 -0.42 0.71 -0.19c-1.12 0.41 -1.05 -0.61 -1.43 -0.76c-0.67 -0.26 -0.61 0.25 -0.71 -0.57c-0.06 -0.50 -1.29 -1.32 -1.96 -1.32c-1.13 0.00 -0.71 0.83 -0.71 1.89c0.00 0.35 0.04 0.36 0.18 0.57c0.22 0.35 0.22 1.26 0.18 1.89c-0.05 0.78 -0.30 0.62 -0.36 1.51c-0.01 0.21 0.11 0.53 0.18 0.57c0.45 0.26 0.66 0.01 0.71 0.38c0.16 1.12 1.02 1.32 1.79 1.70l0.00 0.00zm-11.73 -24.61c0.46 0.74 0.88 0.79 1.49 1.15c0.02 0.01 0.65 2.06 0.68 2.15c0.30 0.94 2.08 1.52 0.54 2.44c-0.40 0.24 -0.81 1.42 -0.81 2.01c0.00 0.37 0.12 2.32 0.27 2.30c1.08 -0.14 1.24 -1.52 1.36 -2.44c0.05 -0.41 1.24 -1.00 1.63 -1.15c1.35 -0.53 0.95 -2.04 0.95 -3.59c0.00 -0.70 -0.61 -0.85 -0.68 -1.87c-0.08 -1.23 0.43 -1.80 -1.08 -2.01c-1.66 -0.23 -1.95 -0.77 -3.12 -2.15c-1.56 -1.84 -2.89 0.47 -1.22 3.16l0.00 0.00zm1.49 -6.89c-0.12 0.05 -0.93 0.45 -1.22 0.29c-0.02 -0.01 -0.94 -0.97 -1.08 -1.15c-0.38 -0.47 0.26 -1.28 0.14 -1.58c-0.15 -0.36 -0.67 0.06 -0.95 -0.43c-0.04 -0.07 -0.22 -0.25 -0.14 -0.57c0.10 -0.38 2.25 -1.01 2.71 -1.01c0.44 0.00 0.11 1.45 0.27 1.58c0.37 0.29 0.83 -0.10 1.08 0.57c0.13 0.35 -0.24 0.93 -0.41 1.15c-0.06 0.07 -0.18 0.06 -0.14 0.14c0.18 0.35 -0.15 0.49 -0.27 1.01l0.00 0.00zm-3.12 -18.53c-0.19 0.59 -0.50 1.29 -0.95 1.44c-0.27 0.09 -0.93 0.53 -0.95 0.72c-0.03 0.34 -0.02 0.46 0.14 0.72c0.24 0.41 -0.39 0.24 0.14 0.43c0.60 0.21 1.22 -0.46 1.22 0.43c0.00 0.67 -0.08 0.71 0.41 1.15c0.19 0.17 0.14 0.49 0.27 0.57c0.41 0.27 1.08 -0.26 1.08 -0.57c0.00 -0.49 -0.42 -1.24 -0.14 -1.72c0.07 -0.11 0.27 -0.98 0.14 -1.29c-0.17 -0.40 -0.50 -0.66 -0.68 -1.01c-0.29 -0.56 -0.39 -0.27 -0.68 -0.86l0.00 0.00zm-6.24 -0.43c-0.57 -0.33 -0.65 -0.72 -1.22 -0.72c-0.58 0.00 -0.89 -0.10 -1.22 0.29c-0.24 0.28 -0.39 0.96 -0.41 1.29c-0.02 0.32 -0.08 1.41 0.27 1.44c0.55 0.04 0.62 0.04 1.08 0.14c0.66 0.14 -0.15 0.97 0.95 1.15c0.64 0.10 0.91 0.11 0.95 -0.57c0.03 -0.56 0.34 -1.05 0.27 -1.87c-0.04 -0.51 -0.36 -0.10 -0.54 -0.43c-0.19 -0.34 -0.21 -0.15 -0.14 -0.72l0.00 0.00zm-4.88 -2.87c-0.40 -1.83 0.71 -1.10 2.17 -1.44c0.82 -0.19 0.19 -2.26 0.54 -3.02c0.20 -0.42 0.48 -0.27 0.68 -0.57c0.67 -1.03 1.05 -2.55 0.27 -3.73c-0.34 -0.52 0.17 -0.67 -0.68 -0.72c-1.94 -0.12 -1.73 -0.53 -1.90 1.58c-0.08 1.04 -1.15 1.66 -1.22 2.58c-0.07 0.95 -0.18 1.56 -0.27 2.30c-0.02 0.15 -0.35 0.60 -0.41 0.72c-0.31 0.61 -0.53 4.15 0.81 2.30l0.00 0.00zm-14.44 51.95c-0.04 -0.45 -0.08 -0.98 -0.58 -1.15c-0.42 -0.14 -0.66 -0.23 -1.08 -0.23l-1.66 0.00c-0.75 0.00 -0.40 0.41 -0.22 0.76c0.26 0.49 -0.12 0.18 0.36 0.38c0.11 0.05 0.94 0.45 0.94 0.46c0.04 0.53 1.07 0.52 1.59 0.53c0.96 0.03 0.79 0.13 0.65 -0.76zm-6.70 -6.41c0.00 -0.55 0.17 -1.32 -0.29 -1.68c-0.08 -0.06 -0.13 -0.04 -0.22 -0.08c-0.43 -0.21 -0.34 0.85 -0.36 1.07c-0.00 0.05 -0.04 0.04 -0.07 0.08c-0.13 0.11 0.00 0.14 -0.14 0.15c-0.31 0.03 0.10 0.23 -0.22 0.23l-0.07 0.00c-0.32 0.00 0.05 1.07 0.43 1.07c0.31 0.00 0.40 0.18 0.58 -0.08c0.18 -0.27 0.14 -0.44 0.36 -0.76l0.00 0.00zm-10.93 -23.12c0.00 3.52 -3.98 15.97 1.24 16.48c0.83 0.08 -0.19 0.17 -0.19 1.41c0.00 4.42 4.75 2.15 5.32 4.32c0.64 2.44 6.56 2.70 6.56 8.24c-0.58 0.00 -2.61 -0.57 -2.38 -1.21c0.34 -0.94 -0.19 -1.05 -0.95 -1.31c-1.08 -0.36 -1.04 -1.96 -1.81 -2.61c-0.47 -0.40 -2.07 -1.15 -2.76 -1.41c-1.15 -0.43 -1.89 -0.41 -2.95 -1.31c-0.43 -0.36 -2.73 -2.24 -2.95 -2.91c-0.22 -0.08 -0.88 -0.23 -1.05 -0.40c-0.28 -0.29 0.72 -0.60 0.67 -1.11c-0.04 -0.35 -0.39 -0.41 -0.48 -0.80c-0.15 -0.67 -0.29 -1.20 -0.48 -1.91c-0.22 -0.84 -0.81 -1.13 -0.86 -1.91c-0.04 -0.68 0.24 -0.94 -0.57 -0.70c-0.25 0.07 -0.40 0.15 -0.67 0.10c-0.38 -0.08 -0.40 -0.35 -1.14 -0.50c-1.17 -0.67 -0.10 -1.36 0.48 -2.01c1.31 -1.47 1.27 -4.49 2.09 -6.43c0.48 -1.13 1.39 -3.73 2.85 -4.02l0.00 0.00z"},"MX-BN":{"name":"Baja California","path":"m142.87 153.91c-0.34 0.08 -0.69 0.32 -1.03 0.22c-0.13 -0.04 -0.13 -0.09 -0.21 -0.22c-0.07 -0.12 0.10 -0.33 0.00 -0.43c-0.10 -0.10 -0.29 0.08 -0.41 0.00c-0.12 -0.08 -0.20 -0.07 -0.20 -0.22l0.00 -0.22l-0.20 -0.22l-0.21 0.00l0.00 -0.22c0.00 -0.28 -0.35 0.10 -0.41 -0.43c-0.04 -0.37 -0.08 -0.84 0.21 -1.08c0.23 -0.19 0.46 -0.39 0.82 0.00c0.13 0.14 0.39 0.52 0.41 0.65c0.02 0.12 -0.02 1.08 0.00 1.08l0.62 0.00c0.14 0.00 0.33 -0.12 0.41 0.00c0.08 0.12 0.00 1.33 0.20 1.08l0.00 0.00zm12.92 6.72l-0.21 1.08l-2.46 0.00c-0.58 0.00 -0.71 -0.17 -0.82 0.22c-0.07 0.25 -0.19 0.42 -0.41 0.00c-0.16 -0.31 -0.01 -0.18 -0.20 -0.43c-0.04 -0.05 -0.21 -0.54 -0.21 -0.65c0.00 -0.70 0.73 -0.23 1.03 -0.87c0.26 -0.54 -0.10 -1.44 0.21 -1.95c0.03 -0.04 0.95 -0.64 1.03 -0.65c0.24 -0.03 0.59 0.00 0.82 0.00c0.14 0.00 0.29 -0.08 0.41 0.00c0.09 0.06 0.38 0.29 0.62 0.43c0.56 0.33 -0.13 -0.27 0.82 0.22c0.13 0.07 0.20 1.01 0.20 1.08c0.00 0.52 -0.35 0.04 -0.62 0.22c-0.26 0.17 -0.20 0.83 -0.20 1.30l0.00 0.00zm-6.77 3.04l-0.62 1.52c-2.06 0.00 -2.01 -0.01 -3.08 -1.95c-0.40 -0.72 -0.36 -0.95 -0.41 -1.73c-0.00 -0.07 -0.96 -0.85 -1.03 -0.87c-0.54 -0.17 -1.14 -0.67 -1.23 -1.52c-0.04 -0.38 -0.66 -1.69 -0.41 -1.95c0.41 -0.44 2.07 0.60 2.87 0.65c1.35 0.08 0.14 1.15 1.03 1.52c0.36 0.15 0.75 0.01 1.03 0.22c0.19 0.14 0.04 0.48 0.21 0.65c0.52 0.55 0.92 -0.01 1.03 1.08c0.08 0.82 0.34 0.65 1.03 0.87c0.13 0.04 -0.19 0.07 -0.21 0.22c-0.07 0.56 0.13 0.83 -0.20 1.30l0.00 0.00zm-11.08 -18.43l0.21 1.52c-0.98 -0.07 -2.12 -0.22 -3.08 -0.43c-0.98 -0.22 -0.61 -1.65 -0.82 -2.39c-0.10 -0.34 -0.51 -1.12 -0.62 -1.30c-0.15 -0.26 -0.31 -1.20 -0.41 -1.52c-0.45 -1.40 -0.88 -0.74 -1.85 -1.95c-0.36 -0.46 -0.59 -1.56 -1.03 -2.17c-0.64 -0.68 -1.15 -1.26 -1.64 -1.95c-1.04 -1.45 -1.51 -3.01 -2.87 -4.55c-0.59 -0.67 -0.09 -3.37 0.00 -4.12c0.19 -1.54 0.49 -1.48 2.05 -1.08c0.08 0.02 1.42 -0.06 1.44 0.00l0.21 0.65c0.47 1.49 1.56 2.72 1.85 3.69c0.26 0.87 1.11 0.80 1.23 2.17c0.08 0.91 0.00 1.90 0.00 2.82c0.75 0.07 1.95 0.76 2.46 0.22c0.11 -0.12 0.60 -0.87 0.82 -0.87c0.35 0.00 0.08 -0.50 0.41 0.22c0.55 1.19 0.12 2.49 0.20 4.34c0.06 1.32 0.51 0.71 0.00 1.95c-0.59 1.43 0.26 4.77 1.44 4.77l0.00 0.00zm-64.32 32.23c-1.05 0.00 -2.18 0.50 -2.18 -0.41l0.00 -0.14c0.00 -0.15 -0.47 -0.27 -0.51 -0.41c-0.03 -0.11 -0.44 -1.03 -0.64 -1.22c-0.34 -0.32 -0.53 -0.22 -0.90 -0.27c-0.43 -0.06 0.27 -0.24 -0.26 -0.54c-0.35 -0.20 -1.11 -0.14 -1.54 -0.14c-0.53 0.00 -2.13 -0.40 -1.15 -0.81c0.73 -0.30 2.82 -0.67 3.33 -1.62c0.59 -1.11 0.90 -3.38 0.90 -4.74c0.00 -0.43 -0.18 -2.55 0.13 -2.84c0.89 -0.85 1.54 -2.51 2.82 0.00c0.58 1.14 -0.02 1.76 1.28 2.71c0.86 0.62 0.40 4.41 0.00 5.28c-0.69 1.51 -0.90 2.62 -1.28 5.14l0.00 0.00zm-11.78 -10.42l0.64 -0.27c-0.06 0.09 -0.47 1.23 -0.90 0.95c-0.07 -0.05 -0.11 -0.25 -0.13 -0.41c-0.05 -0.57 -0.43 -0.17 -0.90 -0.27l-0.64 -0.14l-0.77 -0.54c-0.41 -0.29 -0.51 0.12 -0.51 -0.54c0.00 -0.80 0.60 -0.90 1.28 -0.81c0.26 0.03 0.28 0.28 0.51 0.41c0.48 0.26 0.81 -0.40 1.15 0.14c0.17 0.28 0.15 1.12 0.26 1.49l0.00 0.00zm-31.13 -162.56l70.28 0.02l-0.00 3.46c0.00 0.66 0.62 1.98 0.00 1.98l-0.47 0.00c-0.87 0.00 -0.87 0.25 -0.93 0.99c-0.05 0.61 0.00 1.35 -0.00 1.93c-0.66 0.06 -1.42 -0.01 -2.33 -0.01c-0.19 0.00 -4.59 3.55 -5.41 4.08c-0.63 0.41 -0.82 1.04 -1.29 1.91c-0.41 0.76 -0.64 1.51 -1.03 2.18c-1.39 2.34 2.53 2.68 2.32 4.63c-0.16 1.49 -1.06 1.37 -0.52 3.27c0.28 0.99 0.10 4.18 0.30 6.42c-0.72 -0.65 -1.52 -1.30 -2.48 -2.01c-1.07 -0.79 0.00 -0.83 0.00 1.52c0.00 1.10 1.30 1.58 1.73 2.13c0.53 0.69 -0.46 3.26 0.58 3.96c1.27 0.86 3.75 -1.37 3.75 1.22c0.00 1.05 -0.58 5.13 -0.58 2.44c0.00 -1.48 2.38 0.28 3.16 0.60l-0.11 -0.20c-0.98 0.47 -1.56 0.37 -0.75 -1.01c0.21 -0.35 0.29 -0.69 0.29 -1.01c-0.14 -0.41 -0.32 -0.82 -0.54 -1.21c-1.12 -1.13 -3.44 -0.99 -1.76 2.22c0.44 0.84 1.66 1.18 2.91 1.28l-0.03 -0.05c-1.37 4.34 -5.47 4.59 -5.47 12.48c0.00 3.46 -1.42 11.00 1.15 13.71c0.69 0.73 2.31 -3.50 2.31 -0.61c0.00 13.36 0.58 16.22 0.58 28.34c0.00 2.00 3.34 1.65 2.59 2.13c-5.55 3.61 0.58 4.15 0.58 7.01c0.00 4.91 2.76 -2.03 2.88 -0.61c0.21 2.40 -0.84 3.37 -0.58 5.79c0.25 2.32 3.65 0.20 5.19 1.83c1.44 1.53 3.03 3.05 4.90 4.27c2.65 1.72 8.72 12.34 12.10 15.54c0.00 7.89 4.03 4.69 4.03 6.40c0.00 3.25 -4.61 3.05 -2.02 5.79c4.06 4.29 -1.22 -2.58 3.17 0.00c2.30 1.35 3.17 8.26 3.17 6.09c0.00 -2.68 3.46 -0.21 3.46 5.79c0.00 7.71 7.78 7.73 7.78 10.66c0.00 3.15 0.57 7.30 2.02 9.75c0.63 1.06 1.05 2.33 1.38 3.73l-44.39 -3.49c0.59 -0.06 1.17 -0.07 1.81 -0.07l0.00 -2.99l0.18 -0.19l0.35 0.00c0.10 -0.41 0.66 -0.56 1.06 -0.56c0.30 -1.27 0.53 -1.92 0.53 -3.36c-0.90 0.00 -1.22 0.18 -1.77 0.37c0.00 0.37 0.03 0.26 -0.18 0.56c-0.40 -0.31 -0.57 -1.01 -0.88 -1.12l0.00 -1.68l0.35 0.00c0.13 -0.42 0.74 -0.66 0.88 -1.12c0.64 0.00 0.69 -0.60 1.24 -0.75c0.00 -0.82 -0.19 -2.24 0.88 -2.24c0.29 -0.92 0.85 0.09 1.24 -1.87c0.00 -2.27 -1.94 -3.60 -1.94 -5.60c0.00 -3.82 -1.88 -2.27 -3.53 -3.36c-1.32 -0.87 -0.36 -2.43 -1.24 -3.36c-1.31 -1.39 -3.36 0.03 -3.36 -4.11c0.00 -3.23 -5.12 -1.36 -5.12 -5.04c0.00 -5.42 -7.24 -7.31 -7.24 -13.07c-1.04 0.00 -1.25 -1.87 -2.65 -1.87c-1.39 0.00 -2.17 -0.31 -3.53 -0.56c-1.90 0.00 -2.03 -1.59 -2.83 -1.87c0.00 -0.37 0.12 -0.64 -0.18 -0.75c0.00 -0.85 -2.60 -2.34 -3.18 -2.43c-0.11 -0.34 -2.35 -1.89 -2.83 -2.05c0.00 -0.73 0.15 -0.38 -0.35 -0.56l0.00 -0.75c-0.22 -0.08 -0.28 -0.14 -0.35 -0.37c-1.97 0.00 -1.11 -3.55 -2.83 -3.55c-0.45 -1.42 -1.99 -1.47 -2.83 -0.37c-3.71 -0.78 -0.35 -4.72 -0.35 -5.79c-1.91 -0.40 -0.02 -3.16 -1.24 -3.74c-1.13 -0.53 -2.46 -0.37 -3.71 -0.37c-0.07 -0.31 -0.12 -0.48 -0.35 -0.56l0.00 -2.24l0.71 0.00c0.45 -1.41 1.55 -3.60 1.77 -5.60c0.28 -2.56 -1.48 -2.58 -1.24 -4.86c0.25 -2.33 0.28 -1.73 -1.24 -3.18c-1.00 0.00 -0.53 -0.14 -0.53 -1.12c0.00 -1.27 -0.65 -0.64 -0.88 -1.87c0.00 0.92 0.64 2.80 -0.71 2.80c-1.10 0.00 0.26 -2.10 -1.06 -2.99c-0.83 -0.56 -1.06 -1.15 -1.06 -2.05c0.00 -1.50 0.35 -1.25 1.41 -2.05c2.48 -1.89 -0.78 -1.39 -0.88 -2.61c-0.13 -1.50 -0.13 -1.58 0.88 -2.24c1.16 -0.75 0.29 -3.05 -0.35 -3.74c-0.97 -1.02 -2.09 -1.21 -3.00 -2.61c-0.57 -0.88 -0.28 -2.10 -1.24 -2.99c-0.74 -0.69 -3.36 -0.07 -3.36 -1.12c0.00 -0.69 0.29 -0.12 0.53 -0.37c0.23 -0.24 0.31 -2.42 0.35 -3.18c0.00 -0.10 0.18 -0.30 0.18 -0.56c0.00 -0.48 0.05 -1.02 0.00 -1.49c-0.09 -0.93 -0.53 -1.46 -0.53 -2.61c0.00 -2.31 -2.65 -2.65 -2.65 -4.67c0.00 -1.26 -0.07 -2.56 -1.24 -3.17c0.00 -1.19 -2.74 -2.35 -3.00 -3.18c-0.94 0.00 -1.60 -1.25 -2.30 -1.49c0.00 -3.00 2.12 -2.84 2.12 -3.74c-0.62 -0.16 -0.85 -0.37 -1.59 -0.37c0.00 -0.65 0.50 -1.83 0.00 -2.43c-0.85 -1.02 -2.17 -0.99 -2.47 -2.61c-0.84 -0.22 -1.59 -1.18 -1.94 -1.31l0.00 -1.12c0.66 -0.52 1.93 0.13 2.47 0.56l0.00 0.37c0.34 0.12 0.01 0.07 0.35 0.19l0.00 0.37l1.59 0.00l0.18 0.19c0.08 0.34 0.03 0.29 0.35 0.37c0.06 0.24 0.12 0.32 0.18 0.56l1.06 0.00c0.22 -0.71 0.71 -0.78 0.71 -1.87c0.00 -0.54 0.12 -1.26 -0.18 -1.68c-1.24 0.00 -2.31 -0.87 -3.36 -1.31l0.00 -3.55l-0.53 0.00c-0.21 0.30 -0.18 0.19 -0.18 0.56l-0.18 0.19l-1.77 0.00c0.00 -1.34 0.18 -2.42 0.18 -3.74c-0.46 -0.24 -0.71 -0.72 -0.71 -1.31c-1.92 -0.41 -1.77 -2.28 -1.77 -3.92c0.00 -1.23 -0.35 -2.53 -0.35 -3.55l-0.35 -0.19c-0.57 0.00 -0.85 -0.01 -1.41 -0.19c-0.28 0.22 -0.18 0.19 -0.53 0.19c-0.31 0.33 -0.44 0.47 -0.88 0.56c-0.40 -0.70 -0.19 -1.40 0.18 -2.05c0.39 -0.69 0.53 -1.40 0.53 -2.24l0.35 -0.19l0.00 -0.56c-0.46 -0.39 -1.18 -0.62 -1.41 -1.12l-0.18 -0.19c-0.35 0.00 -0.25 0.04 -0.53 -0.19l0.00 -4.11l0.35 -0.37l0.53 0.00l0.18 -0.37c0.34 -0.12 0.01 -0.07 0.35 -0.19c0.05 -0.22 0.09 -0.42 0.13 -0.64z"},"MX-SO":{"name":"Sonora","path":"m163.79 159.76c-0.05 0.93 0.29 1.77 -0.82 1.52c-1.03 -0.23 -0.94 -1.13 -1.03 -1.95c-0.03 -0.26 -0.93 -1.23 -1.23 -1.52c-0.99 -0.94 -0.19 -1.45 -2.26 -1.73c-0.27 -0.04 -0.55 0.00 -0.82 0.00c-1.04 0.00 -0.21 -1.62 -1.03 -1.73c-0.87 -0.12 -0.87 0.42 -1.03 -0.65c-0.17 -1.18 -0.75 -0.53 0.62 -1.52c0.79 -0.57 2.26 -0.10 2.26 -1.52c-0.77 -1.40 -0.43 -0.90 -0.82 -2.39c-0.35 -1.31 0.18 -1.00 0.62 -1.73c0.33 -0.55 -0.74 -3.00 -0.21 -3.90c0.64 -1.08 5.95 -2.10 5.95 0.65c0.00 1.23 -0.02 2.36 0.20 3.47c0.08 0.42 0.83 1.31 1.03 1.52c0.43 0.45 -0.10 1.70 0.00 2.60c0.09 0.79 0.21 1.52 -0.41 2.17c-1.19 1.26 0.35 1.86 0.00 2.82c-0.32 0.89 -0.82 -0.09 -0.82 1.08c0.00 0.66 -0.21 1.38 -0.21 2.82l0.00 0.00zm-64.19 -146.89l107.51 53.40l65.75 3.86l0.73 25.07c1.97 0.00 4.07 -0.73 4.68 1.16c0.29 0.89 -0.12 2.52 0.00 3.49c0.09 0.70 0.83 0.49 0.83 1.46c0.00 2.94 0.55 5.95 0.55 9.03c0.00 1.06 -2.71 16.31 -0.55 16.31c0.32 1.07 -0.94 9.31 -1.93 9.90c-0.88 0.52 -0.45 2.13 -0.83 2.91c-0.31 0.65 -1.88 1.10 -1.93 2.04c-0.08 1.43 1.61 3.79 -0.83 3.79c-1.89 0.00 0.00 9.94 0.00 11.07c0.00 6.55 3.86 1.54 3.86 7.57c2.55 3.55 2.75 4.38 2.75 8.45c0.00 2.27 0.28 3.58 0.28 5.82c0.00 2.32 -0.60 2.59 -2.75 2.33c-1.54 -0.19 -4.62 -0.82 -5.23 1.16c-1.04 3.37 -8.79 -2.77 -11.02 1.17c2.07 3.89 2.26 11.29 5.78 13.40c1.46 0.87 0.24 3.27 1.10 3.79c2.89 1.72 3.86 0.34 3.86 5.24c0.00 2.37 3.89 8.51 1.93 11.07c-0.40 0.52 -1.68 5.80 -0.83 6.70c2.17 2.30 0.43 -0.18 1.65 3.79l2.26 1.56l-5.26 12.99l-7.60 4.33l0.00 2.47l-7.60 3.09l-3.65 -1.05c-0.35 -1.55 -3.28 -7.74 -4.59 -8.80c-0.52 -0.42 -1.56 -2.62 -2.02 -2.13c-2.67 2.82 2.90 1.56 -2.02 -1.52c-1.92 -1.21 -1.86 2.62 -2.88 2.74c-0.85 0.10 -2.94 -0.99 -3.67 -1.46c-5.19 -3.38 1.88 -5.22 -2.67 -7.68c-3.24 -1.75 -3.21 -8.88 -5.76 -8.53c-2.10 0.29 -2.73 0.79 -5.76 -1.52c-1.29 -0.98 -4.84 -3.91 -6.10 -5.06c-2.56 -2.33 -1.06 -6.44 -2.83 -10.17c-3.55 -7.46 3.29 -3.08 -1.73 -6.40c-1.62 -1.07 0.73 -4.20 1.73 -4.57c2.30 -0.84 -0.99 -0.11 -4.32 -3.05c-0.48 0.51 -10.66 -9.85 -4.32 -0.30c6.02 -1.62 -8.55 1.02 -14.70 -11.88c-0.60 -1.27 -2.63 -2.69 -3.17 -3.96c-2.22 -5.23 -8.93 -2.20 -8.93 -9.45c0.00 -4.06 -5.52 -3.46 -4.32 -5.48c2.89 -4.88 0.02 -3.35 -1.44 -3.35c-1.69 0.00 -5.71 -8.36 -6.34 -10.05c-1.36 -3.66 2.41 -10.05 -2.31 -10.05c-1.25 0.00 -4.32 0.68 -4.32 -0.30c0.00 -6.85 1.00 -2.53 1.15 -2.44c0.00 -7.59 -2.83 -9.64 -6.05 -16.45c-2.77 -5.85 -6.33 -16.83 -6.05 -21.33c0.27 -4.43 -5.48 -8.84 -5.48 -12.19c0.00 -7.22 2.88 -11.59 2.88 -17.67c0.00 -6.84 -17.58 -1.24 -17.58 -9.14c0.00 -6.94 -3.06 -5.17 -6.63 -9.14c-5.19 -5.77 -0.80 11.92 -9.22 3.66c0.00 -3.46 -2.70 -0.94 -4.32 -2.13c-1.45 -1.06 -4.73 -4.08 -6.05 -6.09c-1.35 -2.05 -2.22 0.83 -2.88 0.91c-0.62 0.08 -1.56 0.14 -2.50 0.07l-0.04 -0.36c2.01 -1.07 5.31 -4.28 1.96 -4.28c-0.96 0.00 -0.22 1.15 -0.58 1.52c-1.81 1.91 -3.88 -2.83 -4.32 -3.35c-1.10 -1.32 -2.06 -2.38 -3.26 -3.46c-0.22 -2.27 -0.04 -5.46 -0.32 -6.44c-0.54 -1.90 0.35 -1.78 0.52 -3.27c0.21 -1.95 -3.70 -2.29 -2.32 -4.63c0.39 -0.66 0.62 -1.42 1.03 -2.18c0.46 -0.87 0.66 -1.49 1.29 -1.91c0.81 -0.53 5.21 -4.08 5.41 -4.08c0.92 0.00 1.68 0.10 2.34 0.03z"},"MX-CH":{"name":"Chihuahua","path":"m272.86 70.13l0.73 25.07c1.97 0.00 4.07 -0.73 4.68 1.16c0.29 0.89 -0.12 2.52 0.00 3.49c0.09 0.70 0.83 0.49 0.83 1.46c0.00 2.94 0.55 5.95 0.55 9.03c0.00 1.06 -2.71 16.31 -0.55 16.31c0.32 1.07 -0.94 9.31 -1.93 9.90c-0.88 0.52 -0.45 2.13 -0.83 2.91c-0.31 0.65 -1.88 1.10 -1.93 2.04c-0.08 1.43 1.61 3.79 -0.83 3.79c-1.89 0.00 0.00 9.94 0.00 11.07c0.00 6.55 3.86 1.54 3.86 7.57c2.55 3.55 2.75 4.38 2.75 8.45c0.00 2.27 0.28 3.58 0.28 5.82c0.00 2.32 -0.60 2.59 -2.75 2.33c-1.54 -0.19 -4.62 -0.82 -5.23 1.16c-1.04 3.37 -8.79 -2.77 -11.02 1.17c2.07 3.89 2.26 11.29 5.78 13.40c1.46 0.87 0.24 3.27 1.10 3.79c2.89 1.72 3.86 0.34 3.86 5.24c0.00 2.37 3.89 8.51 1.93 11.07c-0.40 0.52 -1.68 5.80 -0.83 6.70c2.17 2.30 0.43 -0.18 1.65 3.79l2.22 1.55l1.11 -0.44l8.59 -0.04c-0.06 1.08 -0.22 2.32 -0.54 3.06c-0.57 1.32 2.46 2.45 3.25 2.68c0.45 0.13 0.90 0.32 1.27 0.57c1.49 1.03 -0.68 0.44 1.08 0.96c0.80 0.23 0.72 1.25 0.72 2.30c0.00 0.68 -0.36 1.72 -0.18 1.91c0.57 0.60 -0.45 0.54 -0.72 0.77c-0.17 0.14 -0.15 1.20 -0.36 1.34c-0.44 0.29 -1.15 -0.16 -0.90 0.96c0.17 0.80 1.97 0.13 2.53 0.57l0.54 10.53l5.06 7.47l6.70 0.00c0.67 1.75 3.76 -0.62 4.15 1.15c0.54 2.43 1.47 1.24 3.25 1.53c0.41 0.07 0.13 2.54 0.18 3.06c0.03 0.28 1.07 2.69 1.27 3.06c1.26 2.38 0.85 2.14 2.71 1.91c1.88 -0.23 1.10 3.26 3.25 3.26l0.90 1.15l0.00 0.57c0.00 0.37 0.88 0.15 0.90 0.57c0.02 0.33 -0.04 2.84 0.00 2.87c0.20 0.14 0.72 -0.25 0.72 0.00l0.00 0.19c0.00 0.56 0.36 -0.10 0.36 0.77c1.47 0.56 1.87 1.00 3.25 1.15c1.13 0.12 1.53 1.72 2.35 1.72c3.55 0.00 -0.09 2.36 2.89 0.28c9.06 -6.30 4.39 -4.11 6.33 -13.50c0.61 -2.93 2.53 -1.37 2.53 -5.36c0.00 -5.07 2.76 -8.66 5.60 -11.68c1.89 -2.00 -0.86 -7.85 2.17 -9.19c1.88 -0.83 1.97 -0.66 2.71 -2.30c0.60 -1.33 2.53 -2.15 2.53 -3.45c5.15 -1.64 1.59 1.58 4.52 1.72c4.15 0.20 5.44 4.89 7.96 5.94c1.47 0.62 0.80 -0.17 1.63 -0.77c1.62 -1.17 1.59 2.26 1.99 2.68c0.17 0.18 2.47 1.31 3.07 1.34c2.72 0.13 9.04 7.85 9.04 4.79c0.00 -1.71 -0.70 -2.76 0.54 -3.83c0.43 -0.37 1.34 0.44 1.45 0.77c0.73 2.25 1.52 1.81 3.44 0.57c1.54 -0.99 2.27 -0.86 4.16 -1.53c2.44 1.12 3.09 1.00 3.98 3.06c0.65 1.51 2.81 3.36 4.52 3.26c2.65 -0.16 1.18 -4.85 2.17 -6.70c0.14 -0.27 1.38 -1.16 1.63 -1.34c0.23 -0.17 1.36 -1.24 1.45 -1.53l6.68 -5.39l14.47 1.39l-6.14 -45.45l17.51 -37.08c-1.59 -1.08 -2.72 -3.44 -4.23 -4.19c-1.30 -0.64 -1.54 -0.77 -3.09 -0.93c-4.07 -0.44 -4.82 -3.46 -7.73 -6.30c-8.08 0.00 -7.35 -4.74 -14.13 -7.24c-2.65 -0.98 -8.41 -10.12 -9.05 -13.77c-0.85 -4.81 0.51 -8.97 -2.21 -13.07c-0.47 -0.99 -0.51 -2.10 -1.55 -2.10l-0.22 0.00c-1.27 0.00 -1.32 -1.99 -1.77 -2.57c-0.29 -0.37 -0.28 -0.31 -0.44 -0.70c-1.07 -2.55 0.04 -4.91 -1.99 -6.30c-1.10 -0.75 0.09 -1.33 -2.21 -2.10c-1.54 -4.88 -4.13 -8.58 -9.49 -10.27c-7.66 -2.42 -7.44 -8.70 -13.91 -11.44c-2.46 -1.04 -6.76 -9.13 -8.83 -10.97c-2.62 -2.33 -4.29 -5.24 -6.40 -7.47c-2.67 -2.82 -4.09 -2.63 -7.10 -5.39l-50.02 -1.98l-1.87 17.30l-18.39 -1.09z"},"MX-CA":{"name":"Coahuila","path":"m426.11 243.25l10.41 4.98l1.68 5.82l2.40 5.32l-3.11 3.55c0.00 1.42 0.43 4.53 -0.72 5.32c-0.84 0.58 -0.85 -0.09 -0.72 1.27c0.04 0.44 0.19 0.21 0.24 1.01c0.02 0.35 0.03 0.74 0.24 1.01c0.33 0.42 0.76 0.57 1.20 1.27c0.39 2.92 0.97 6.65 -0.24 9.12c-0.33 0.67 -0.90 1.85 -1.44 2.53c-0.61 0.77 -1.56 0.15 -1.92 1.27c0.00 0.61 0.22 0.71 0.48 1.27c0.29 0.62 -0.05 3.47 0.48 3.55c0.81 0.11 0.96 -0.34 1.20 0.76c0.07 0.33 0.62 0.61 -0.24 0.76c-0.66 0.12 -1.20 0.16 -1.92 0.25c-0.76 0.10 -0.48 1.64 -0.48 2.53c-2.19 8.11 2.87 1.60 2.87 6.33c0.00 4.34 2.59 8.35 5.99 10.38c1.10 0.66 5.41 0.77 5.51 1.01c0.88 2.04 1.80 3.55 4.31 3.55l1.44 -1.01c0.23 -0.16 0.40 -0.79 0.48 -1.27l1.68 -5.57l2.36 -2.99l1.24 -1.57l6.95 2.79l-0.24 -4.05l7.19 -0.51l11.02 3.55l4.07 5.82l1.68 -1.01l2.87 0.00l0.24 4.81l6.23 -1.27c0.00 1.82 1.40 2.31 2.40 1.27c0.64 -0.68 1.82 -0.56 3.11 -0.51c3.59 0.15 0.41 1.38 1.44 3.55c0.16 0.35 1.63 1.27 1.92 1.27c1.03 0.00 1.92 4.27 4.55 2.53c0.95 -0.63 5.12 1.29 6.23 1.52c-0.22 -0.53 -0.49 -1.27 -0.72 -1.52c-0.11 -0.12 -0.22 -0.09 -0.24 -0.25c-0.06 -0.50 -0.02 -1.29 0.00 -1.77c0.04 -0.99 0.25 -0.91 0.48 -1.77c0.02 -0.08 -0.03 -0.74 0.00 -0.76c0.43 -0.24 1.42 -0.02 0.72 -0.76l-0.24 -0.25c-0.60 -0.63 0.37 -1.01 -0.48 -1.01l-2.16 -2.53l2.16 -5.82l-1.92 0.25l-0.24 -4.81l6.23 -6.33c1.36 0.66 1.08 0.84 1.68 2.03c0.52 1.03 1.03 -0.07 2.16 0.00c1.51 0.09 1.56 0.20 2.39 1.27c0.76 0.98 3.61 0.41 4.31 -0.51c0.75 -0.97 3.06 0.42 3.59 -1.27c-1.56 -0.14 -1.48 -0.40 -1.68 -2.03c-0.24 -1.93 -1.97 -0.76 -3.35 -0.76c-1.19 0.00 -1.00 -0.62 -1.68 -1.27c-0.38 -0.37 -2.03 -0.51 -2.87 -0.51c-0.19 -0.45 -0.41 -1.15 -0.72 -1.52c-0.30 -0.36 -0.68 -0.71 -0.72 -1.01c-0.10 -0.83 -0.72 -0.84 -0.72 -2.03l0.00 -1.27c0.00 -0.53 0.17 -1.12 -0.24 -1.27c-1.56 -1.32 -1.55 -1.01 -3.59 -1.01c-2.43 0.00 -0.07 -2.20 -0.24 -3.04c-0.09 -0.48 -3.07 0.67 -3.59 -0.25c-0.30 -0.53 -0.66 -3.01 -1.20 -3.29c-0.73 -0.38 -2.28 -0.03 -2.16 -1.01c0.06 -0.48 0.72 -0.39 0.72 -1.27c0.00 -0.46 -0.17 -2.21 0.00 -2.53c0.36 -0.68 1.68 -0.97 1.68 -2.03c-0.87 -0.21 -1.73 -0.38 -2.64 -0.25c-0.28 0.04 -0.44 0.61 -0.48 0.00c-0.03 -0.58 0.00 -1.19 0.00 -1.77c0.00 -0.17 -0.08 -0.36 0.00 -0.51c0.08 -0.14 0.15 -0.12 0.24 -0.25c0.17 -0.25 0.59 -0.50 0.72 -0.76c0.36 -0.75 -0.57 -0.51 -0.96 -0.51l-8.86 -11.14l13.89 -13.93c0.42 0.76 1.21 1.69 0.96 2.53c-0.51 1.74 0.06 1.52 1.44 1.52c0.21 0.00 1.12 -0.21 1.20 -0.25c0.33 -0.19 -0.52 -3.50 0.72 -4.30c0.68 -0.44 1.09 -0.42 1.92 -0.51c0.75 -0.08 0.48 -1.14 0.48 -1.77l0.00 -8.10l-5.51 -2.79c-0.48 3.77 0.00 0.20 0.00 1.52c0.00 0.29 -0.63 0.33 -0.96 0.51c-0.43 0.23 -1.07 1.03 -1.44 1.52c-0.76 1.03 -0.56 1.76 -0.72 0.25c-0.06 -0.59 -0.48 -0.39 -0.48 -0.51l0.00 -0.76l-0.24 0.00c-0.62 0.00 -0.31 -1.38 0.24 -1.77c0.36 -0.25 0.90 -0.46 0.96 -1.01c0.14 -1.28 0.00 -2.75 0.00 -4.05c1.53 -0.23 3.31 -0.30 4.79 -0.76c0.14 -0.04 0.23 -0.70 0.24 -1.01c0.07 -1.52 0.58 -0.72 1.20 -2.03c0.56 -1.18 0.33 -1.40 1.92 -1.52c0.79 -0.06 3.46 -0.60 3.59 -1.01c0.88 -2.96 0.48 -6.51 0.48 -9.62l6.23 -4.30l0.48 1.01c0.29 0.61 0.24 -0.19 0.24 0.51l0.00 0.25l0.72 0.00c0.12 0.00 0.34 0.31 0.72 0.51c0.30 0.16 2.21 1.01 2.40 1.27c0.70 0.96 0.57 1.05 1.44 2.03c0.26 0.29 0.40 0.50 0.48 0.76l2.93 -4.10c-1.23 -1.59 -2.06 -3.65 -2.06 -6.66c0.00 -1.32 -10.88 -14.23 -12.14 -18.68c-2.06 -7.26 -7.75 -11.71 -11.04 -17.98c-1.40 -2.67 -0.61 -7.41 -2.87 -9.10c-0.87 -0.66 -5.85 -5.14 -5.96 -6.54c-0.64 -0.90 -2.86 -1.14 -4.27 -2.05l0.03 -0.15c-0.08 -0.77 -2.58 -0.13 -3.10 -0.20c-0.98 -0.15 -0.53 -0.55 -0.97 -0.75c-0.66 -0.31 -4.98 0.66 -5.16 0.34c-0.21 -0.38 0.34 -2.58 0.39 -3.21c0.04 -0.58 1.46 -1.34 1.03 -1.84c-0.50 -0.59 -0.90 0.10 -0.90 -1.16c0.00 -0.71 -0.41 -2.33 0.32 -2.32c0.73 0.01 2.12 3.72 2.26 4.44c0.99 0.63 1.94 0.18 2.90 0.89c0.10 0.07 0.19 -0.00 0.26 -0.13c-1.12 -1.27 -1.85 -2.92 -2.95 -4.35c-2.85 -3.72 -6.50 -5.98 -11.70 -4.67c-4.15 1.04 -4.31 -1.63 -6.85 -1.63c-3.30 0.00 -6.52 0.20 -10.38 0.00c-1.53 -0.27 -1.23 -1.31 -3.09 -1.17c-0.88 0.07 -0.95 0.58 -1.33 0.70c-0.77 0.24 -1.56 0.98 -1.99 1.87c-0.29 0.61 -5.85 2.38 -6.62 2.57c-1.55 0.38 -1.28 3.30 -1.77 4.44c-0.60 1.40 -2.20 0.61 -3.09 1.63c-0.36 0.41 -0.99 2.46 -1.10 2.57c-1.74 1.72 -0.52 8.29 0.00 10.74c0.00 0.36 0.15 0.44 -0.22 0.47c-0.44 0.03 -0.88 -0.02 -1.32 0.00c-1.04 0.04 -1.08 0.07 -1.99 0.47c-0.65 0.28 -1.20 0.73 -1.77 1.17c-1.47 0.00 -1.53 3.51 -2.21 4.67c-0.93 1.61 -5.63 1.07 -7.29 0.23c-0.15 -0.07 -0.29 -0.16 -0.41 -0.25l-17.51 37.08l6.13 45.44z"},"MX-TM":{"name":"Tamaulipas","path":"m547.86 209.12l-3.99 4.26c0.99 0.37 2.28 0.48 2.28 1.52c0.00 1.59 2.35 1.53 3.31 1.53c0.98 0.00 0.70 0.83 0.41 1.31c-0.61 1.04 -0.26 2.51 -0.41 3.93c-0.04 0.34 -1.10 0.80 -1.03 1.09c0.31 1.38 1.78 1.09 3.10 1.09c-0.11 0.61 -0.72 2.78 -0.41 3.49c0.16 0.37 0.61 0.53 0.83 0.87c0.46 0.74 -0.06 1.43 1.03 1.53c1.16 0.10 0.07 1.05 -0.41 1.09c-1.76 0.17 -1.43 0.80 -1.65 2.62c-0.07 0.58 -0.12 0.03 -0.41 0.22c-0.49 0.32 -0.41 1.95 -0.41 2.84l5.16 0.22l-1.86 7.21l4.34 0.00l2.89 4.81l-1.65 5.90l9.30 5.68l0.00 6.35l0.62 0.20l0.62 0.00l0.62 0.22c0.92 0.32 0.86 0.81 1.65 1.09c-1.03 -5.65 1.60 -3.02 2.89 0.22c0.06 0.15 2.84 0.85 2.89 0.44c0.21 -1.74 -0.17 -1.31 2.07 -1.31c0.89 0.00 0.88 0.50 1.03 0.22c0.34 -0.63 0.57 -1.38 1.45 -1.09c0.75 0.25 2.00 -0.01 2.69 0.44c1.58 1.02 1.05 0.87 3.10 0.87l0.00 18.13l4.98 0.00c-0.10 0.43 -0.52 1.59 -0.02 1.75c0.16 0.05 0.40 0.45 0.21 0.66c-0.06 0.06 -0.51 0.11 -0.62 0.22c-0.12 0.13 -0.11 0.26 -0.41 0.44c-0.14 0.08 -0.41 0.14 -0.41 0.44l0.00 0.66l-0.21 0.00c-0.14 0.00 0.07 0.31 0.00 0.44c-0.03 0.05 -0.13 0.58 -0.21 0.66c-0.01 0.01 -0.60 0.01 -0.62 0.00c-0.16 -0.10 -0.18 -0.86 -0.21 -0.87c-0.14 -0.10 -1.33 0.00 -1.65 0.00l-12.19 12.23l-2.89 0.00c0.00 -0.62 0.07 -1.72 0.00 -2.40c-0.06 -0.54 -0.53 -0.15 -0.62 0.22c-0.08 0.33 -0.16 0.51 -0.21 1.09c-0.16 1.76 -2.27 0.77 -2.27 2.40c0.00 0.71 0.15 0.60 -0.41 0.66c-0.58 0.06 -0.49 0.64 -0.62 1.09c-0.14 0.49 -1.48 0.22 -2.07 0.22c0.00 1.19 -0.42 1.95 0.62 2.18c0.89 0.20 -0.45 -0.28 0.41 -0.22c0.93 0.07 1.19 0.69 1.86 1.09c0.33 0.20 0.62 -0.35 0.83 0.22c0.22 0.60 -0.51 0.43 -0.62 0.66c-0.30 0.61 0.24 1.66 0.00 1.75c-1.02 0.36 -2.48 -0.54 -2.48 0.87c0.00 1.75 -3.57 1.78 -3.72 0.00c-0.08 -1.04 -0.02 -1.51 -0.83 -0.66c-0.36 0.38 0.05 1.59 -0.41 1.75c0.00 0.10 0.14 1.97 0.00 1.97l-0.21 0.00c-1.08 0.00 0.31 -0.28 -0.41 0.87c-0.03 0.05 -1.45 0.43 -1.45 0.22l0.00 -0.22c0.00 -0.23 -0.49 -1.36 -0.62 -0.66c-0.14 0.75 -0.20 0.24 -0.62 0.87c-0.05 0.07 -0.17 0.39 -0.21 0.44c-0.10 0.10 -0.15 0.09 -0.21 0.22c-0.15 0.33 -0.38 0.64 -0.41 0.87c-0.06 0.45 -0.06 0.97 -0.41 1.09l-5.58 0.00l-0.21 5.90l2.89 2.62l0.62 13.76l4.34 4.37c-0.18 0.63 -0.31 0.95 -0.41 1.53c-0.03 0.18 -0.12 0.41 -0.21 0.66c-0.23 0.62 -1.19 0.94 -1.86 1.09c-0.56 0.13 -0.75 -0.24 -0.83 0.44c-0.05 0.45 0.15 0.31 -0.21 0.44l-9.50 0.00c-2.10 3.08 -1.65 7.88 -1.65 11.79c0.00 4.42 -1.75 1.25 -4.34 1.75c-2.82 0.54 -0.13 6.51 -3.33 7.31l-0.01 1.91c0.00 0.39 0.64 0.51 1.01 0.61c1.09 0.29 0.86 -0.11 0.86 1.37c0.00 1.33 -0.12 1.07 1.15 1.07l1.87 0.00c0.00 1.70 0.07 1.73 -1.01 2.44c-0.48 0.31 -1.03 0.58 -1.44 0.76c-1.51 0.66 -1.01 0.15 -1.01 2.28c0.00 0.97 -0.25 3.02 0.00 3.81c0.17 0.55 1.70 -1.34 1.72 -1.37c0.40 -0.42 0.82 2.00 0.57 2.44c-0.08 0.15 -0.69 0.15 -0.86 0.15c-0.93 0.00 -0.27 1.51 0.14 1.83c0.20 0.15 0.73 -0.37 1.01 -0.46c1.39 -0.45 3.19 -0.30 4.89 -0.30c1.46 0.00 1.13 0.24 1.44 1.52c0.00 0.70 -0.14 1.32 -0.14 1.98c0.00 0.99 -0.42 1.72 0.72 1.67c1.09 -0.04 1.57 -0.45 2.16 -0.76c1.02 -0.54 0.39 0.06 1.01 0.30c1.37 0.54 1.46 -1.37 2.44 -1.07c1.79 0.56 2.73 1.84 4.46 2.13c0.96 0.16 0.00 -2.70 0.00 -3.20c0.00 -1.80 1.80 -1.10 2.16 -0.15c0.66 1.13 1.70 2.89 2.87 3.50c0.57 0.30 3.21 -0.40 3.31 0.15c0.11 0.67 0.15 1.01 0.00 1.67c-0.05 0.23 -0.14 0.42 -0.14 0.76c0.00 1.02 -0.17 0.87 0.86 0.91c1.08 0.05 0.40 0.45 0.29 0.91c-0.09 0.35 -0.31 3.00 -0.43 3.05c1.23 0.90 5.34 -1.04 7.62 -0.91c0.46 0.02 1.74 0.41 1.87 0.76c1.06 2.82 -0.40 1.22 2.16 1.22c0.79 0.00 4.61 0.90 5.17 -0.15c0.40 -0.75 0.43 -1.67 1.44 -1.67c2.74 0.00 2.60 1.49 4.17 1.67c1.26 -4.68 3.87 0.01 5.89 -2.13c0.37 -0.39 1.21 -0.04 1.29 -0.76c0.17 -1.56 1.38 -1.88 2.87 -1.83c4.59 0.15 2.59 6.20 7.62 6.70c0.51 0.05 2.55 0.84 4.59 1.44l0.00 0.00l0.22 0.00l0.47 0.00c0.43 0.00 0.95 0.51 1.11 -0.17c-0.83 -2.89 1.14 -2.24 -1.92 -4.04c-1.21 -0.71 -0.73 -5.64 -0.85 -7.82c-0.12 -2.14 -0.36 -3.34 0.43 -5.41c0.63 -1.66 3.63 -13.01 1.99 -14.74c0.00 -0.82 -0.21 -2.66 0.00 -3.46c0.12 -0.46 0.52 -2.19 0.14 -2.56c-0.45 -0.43 -1.15 0.03 -1.42 -0.30c-0.42 -0.51 0.71 -0.98 0.71 -1.65c0.00 -3.31 0.57 -6.29 0.57 -9.62c0.00 -0.76 -0.42 -2.92 -1.00 -3.16c-0.45 -0.19 -0.34 -0.53 -0.28 -1.20c0.09 -1.05 -0.78 -0.60 -0.57 -0.60c-1.35 0.00 -1.08 0.06 -1.14 0.00c-0.54 -0.58 1.39 -0.65 0.14 -0.75c-1.06 -0.08 -1.89 0.39 -1.56 -1.20c0.11 -0.54 0.15 0.00 -0.14 -0.30c-0.05 -0.05 -0.02 -0.74 0.00 -0.75c0.56 -0.28 1.26 0.28 1.56 0.30c0.24 0.02 0.59 -0.77 0.85 -0.90c0.78 -0.39 0.95 0.03 1.56 0.45c1.17 0.79 0.28 -2.70 0.28 -3.16c-0.62 -0.22 -0.55 -0.13 -0.28 -0.75c0.29 -0.69 0.28 -0.58 0.28 -1.20c0.00 -0.97 -1.99 0.56 -1.99 -0.90c0.00 -0.49 0.04 -1.02 0.00 -1.50c-0.04 -0.41 -0.30 0.03 -0.43 -0.15c-0.36 -0.50 0.65 -0.42 0.85 -0.45c0.63 -0.09 0.54 -1.45 0.43 -1.96c-0.16 -0.72 0.02 -1.00 0.57 -1.20c0.27 -0.10 0.71 -0.23 0.71 -0.60c0.00 -1.48 0.11 -1.46 -0.71 -2.56c-1.00 -1.33 -0.17 -2.27 -0.43 -2.71c-0.74 -1.25 -0.11 -5.63 -2.42 -3.76c-0.56 0.45 -1.10 -0.02 -1.14 -0.60c-0.08 -1.38 -1.72 0.62 -1.00 -1.05c0.27 -0.62 0.35 -3.01 0.71 -3.01c2.14 0.00 1.90 2.44 2.42 4.36c0.02 0.07 0.26 -0.57 0.28 -0.60c0.61 -1.03 -0.76 -1.45 0.57 -2.86c3.18 0.33 0.60 3.27 0.91 4.48c0.35 1.33 0.46 1.50 0.60 2.94c0.03 0.30 0.20 0.30 0.20 0.84c0.00 1.67 0.79 1.02 0.79 2.31c0.00 2.59 0.67 6.49 0.99 1.68c0.18 -2.61 -1.39 -4.19 -1.39 -7.14c0.00 -0.84 0.73 -0.47 0.99 -1.47c0.75 -2.82 -0.50 -5.17 0.80 -7.35c0.15 -0.25 0.79 -2.95 0.79 -3.36c0.00 -1.37 -0.58 -1.92 -1.79 -1.05c-0.52 0.38 -0.67 4.43 -0.80 5.46c-0.13 1.05 -1.39 0.36 -1.39 -1.26c0.00 -2.72 1.39 -1.82 1.39 -3.99c0.00 -0.52 -1.13 -1.38 0.40 -1.68c0.69 -0.14 1.39 -0.82 1.39 -1.68c-0.80 -0.05 -1.07 0.29 -1.19 -0.42c-0.05 -0.26 -0.15 -0.75 -0.20 -0.21c-0.01 0.14 0.03 1.24 0.00 1.26c-0.36 0.32 -0.63 0.05 -0.79 -0.42c-0.17 -0.48 -0.60 -1.55 -0.40 -2.10c0.33 -0.90 0.63 -0.97 1.39 -1.05c1.19 -0.12 1.09 -0.40 0.99 -1.68c-0.05 -0.73 -0.41 -0.34 -0.99 -0.42c-0.30 -0.04 -0.27 -0.21 -0.80 -0.21c-0.47 0.00 -0.58 -0.15 -0.79 0.21c-0.31 0.52 -0.58 0.72 -1.39 0.84c-1.10 0.16 -0.50 -0.26 -0.40 -0.42c0.21 -0.36 -0.29 -0.67 0.20 -0.84c0.33 -0.16 0.64 -0.33 0.99 -0.42c0.36 -0.10 0.31 -0.03 0.40 -0.42c0.03 -0.14 0.14 -0.54 0.20 -0.63c0.36 -0.56 0.71 -0.86 0.99 -1.47c0.14 -0.29 0.21 -0.59 0.40 -0.84c0.85 -1.14 1.22 -1.05 0.00 -1.05c-0.92 0.00 -1.86 0.03 -2.78 0.00c-0.47 -0.02 -0.09 -0.93 0.00 -1.05c0.26 -0.34 0.80 -0.21 1.19 -0.21c1.46 0.00 1.39 0.38 1.39 -0.84c0.00 -1.51 0.15 -0.40 1.19 -1.05c0.01 -0.01 0.00 -0.58 0.00 -0.63c0.00 -0.41 0.14 -0.59 -0.20 -0.63c-0.42 -0.05 -0.97 -0.03 -1.39 0.00c-0.56 0.04 0.14 1.20 -0.40 0.63c-0.26 -0.27 -0.26 -0.41 -0.40 -0.63c-2.09 -3.31 -0.60 -0.14 -0.60 -1.26c0.00 -0.36 -0.49 -0.21 -0.80 -0.21c-0.73 0.00 -0.11 0.25 -0.60 0.42c0.18 -0.36 0.47 -0.66 0.60 -1.05c0.07 -0.20 -0.18 -0.55 0.00 -0.63c0.46 -0.21 1.15 0.75 1.39 0.00c0.15 -0.45 -0.20 -0.73 -0.20 -1.26c0.00 -0.97 0.22 -1.05 0.99 -1.05c0.31 0.00 1.16 -0.11 1.39 0.00c0.41 0.19 0.49 0.89 0.60 1.26c0.27 0.94 0.34 0.85 0.99 1.05c0.39 0.12 0.00 0.53 0.00 1.05c0.05 0.02 1.02 0.80 1.19 0.21c0.20 -0.70 -0.71 -1.47 0.20 -1.47c0.40 0.00 1.78 0.15 1.99 0.00c0.11 -0.08 0.00 -0.28 0.00 -0.42c0.00 -0.42 0.13 -0.86 0.00 -1.26c-0.03 -0.11 -0.55 0.22 -0.60 -0.42c-0.11 -1.45 1.74 -0.40 2.19 0.21c0.24 0.33 -0.81 1.57 -0.99 1.68c-0.23 0.14 -0.40 0.46 -0.40 0.84c0.00 0.52 0.20 0.42 0.20 1.05c-0.07 1.31 -0.27 4.43 -0.99 5.04c-0.53 0.45 -0.40 1.08 -0.40 1.89c0.00 1.36 -1.20 3.13 -1.99 4.20c-0.68 0.92 -0.40 5.32 -0.40 6.93c0.92 -0.97 1.14 -1.14 0.40 -2.10c-0.21 -0.27 0.19 -0.72 0.20 -0.84c0.06 -0.63 -0.24 -2.18 0.00 -2.73c0.30 -0.71 0.97 -1.73 1.39 -2.52c0.54 -1.01 0.97 -1.23 1.59 -2.10c2.51 -3.22 5.17 -11.52 5.17 -14.08c0.00 -6.88 5.56 -9.55 5.56 -15.76c0.00 -2.25 -0.02 -4.19 -0.11 -5.93c-2.19 0.34 -4.74 1.37 -5.30 2.33c-0.65 1.12 -2.50 -0.06 -3.09 0.70c-2.15 2.75 -4.31 1.34 -5.96 -1.17c-2.00 -3.03 -7.65 -2.20 -11.48 -2.33c-2.03 0.00 -4.51 0.61 -5.96 0.70c-4.07 0.26 -3.57 -1.02 -6.40 -3.74c-0.80 -0.77 -3.80 0.13 -4.20 -0.93c-1.01 -2.71 -0.40 -1.19 -2.43 -2.33c-2.50 -1.40 -4.13 -3.61 -7.51 -3.27c-2.46 -0.29 -6.34 -1.77 -9.31 -3.74c-0.07 0.15 -0.29 0.07 -0.80 0.09c-1.72 0.05 -2.19 -2.23 -3.77 -2.83c-0.76 -0.29 -0.63 -1.48 -0.75 -2.25c-0.33 -2.01 -2.33 0.48 -2.33 -1.74c0.30 0.00 1.23 -0.76 1.23 -1.23c0.00 -1.50 -0.75 -1.10 -0.75 -2.54c0.00 -0.54 -0.80 -1.31 -1.37 -1.31c-0.96 0.00 -0.04 1.14 -1.30 0.87c-1.30 -0.28 0.11 -1.39 0.14 -2.11c0.06 -1.25 -0.58 -0.36 -0.89 -1.60c-0.20 -0.77 0.19 -1.28 -0.27 -2.03c-0.55 -0.89 -0.82 -1.78 -0.89 -2.98c-1.18 -4.87 -2.62 -11.68 -2.99 -17.44c-1.19 -3.79 -4.42 -5.34 -7.29 -7.41z"},"MX-NL":{"name":"Nuevo León","path":"m547.86 209.12c-1.56 -1.03 -2.84 -2.55 -3.02 -2.73l-2.93 4.10c-0.08 -0.26 -0.22 -0.46 -0.48 -0.76c-0.86 -0.98 -0.74 -1.06 -1.44 -2.03c-0.18 -0.25 -2.10 -1.11 -2.40 -1.27c-0.38 -0.20 -0.60 -0.51 -0.72 -0.51l-0.72 0.00l0.00 -0.25c0.00 -0.70 0.05 0.10 -0.24 -0.51l-0.48 -1.01l-6.23 4.30c0.00 3.12 0.41 6.66 -0.48 9.62c-0.13 0.41 -2.80 0.95 -3.59 1.01c-1.59 0.12 -1.36 0.34 -1.92 1.52c-0.62 1.31 -1.13 0.50 -1.20 2.03c-0.01 0.32 -0.10 0.97 -0.24 1.01c-1.48 0.46 -3.26 0.53 -4.79 0.76c0.00 1.30 0.14 2.77 0.00 4.05c-0.06 0.55 -0.60 0.76 -0.96 1.01c-0.55 0.39 -0.86 1.77 -0.24 1.77l0.24 0.00l0.00 0.76c0.00 0.12 0.42 -0.08 0.48 0.51c0.16 1.51 -0.04 0.77 0.72 -0.25c0.36 -0.49 1.01 -1.29 1.44 -1.52c0.33 -0.17 0.96 -0.22 0.96 -0.51c0.00 -1.32 -0.48 2.25 0.00 -1.52l5.51 2.79l0.00 8.10c0.00 0.63 0.27 1.69 -0.48 1.77c-0.83 0.09 -1.24 0.06 -1.92 0.51c-1.24 0.81 -0.38 4.12 -0.72 4.30c-0.08 0.04 -0.99 0.25 -1.20 0.25c-1.38 0.00 -1.95 0.22 -1.44 -1.52c0.25 -0.84 -0.54 -1.78 -0.96 -2.53l-13.89 13.93l8.86 11.14c0.39 0.00 1.31 -0.25 0.96 0.51c-0.12 0.26 -0.55 0.51 -0.72 0.76c-0.09 0.14 -0.15 0.11 -0.24 0.25c-0.08 0.14 0.00 0.34 0.00 0.51c0.00 0.58 -0.03 1.19 0.00 1.77c0.04 0.61 0.20 0.04 0.48 0.00c0.91 -0.12 1.76 0.04 2.64 0.25c0.00 1.06 -1.32 1.35 -1.68 2.03c-0.17 0.32 0.00 2.07 0.00 2.53c0.00 0.87 -0.66 0.79 -0.72 1.27c-0.12 0.98 1.43 0.63 2.16 1.01c0.54 0.29 0.90 2.77 1.20 3.29c0.52 0.92 3.50 -0.22 3.59 0.25c0.17 0.84 -2.19 3.04 0.24 3.04c2.04 0.00 2.03 -0.31 3.59 1.01c0.41 0.14 0.24 0.74 0.24 1.27l0.00 1.27c0.00 1.19 0.62 1.19 0.72 2.03c0.04 0.30 0.41 0.65 0.72 1.01c0.31 0.37 0.52 1.07 0.72 1.52c0.84 0.00 2.49 0.14 2.87 0.51c0.68 0.65 0.49 1.27 1.68 1.27c1.38 0.00 3.12 -1.17 3.35 0.76c0.20 1.62 0.12 1.89 1.68 2.03c-0.53 1.69 -2.85 0.29 -3.59 1.27c-0.71 0.92 -3.55 1.48 -4.31 0.51c-0.83 -1.07 -0.88 -1.17 -2.39 -1.27c-1.13 -0.07 -1.64 1.03 -2.16 0.00c-0.60 -1.19 -0.32 -1.36 -1.68 -2.03l-6.23 6.33l0.24 4.81l1.92 -0.25l-2.16 5.82l2.16 2.53c0.85 0.00 -0.12 0.38 0.48 1.01l0.24 0.25c0.70 0.74 -0.29 0.52 -0.72 0.76c-0.03 0.02 0.02 0.68 0.00 0.76c-0.23 0.86 -0.44 0.78 -0.48 1.77c-0.02 0.48 -0.06 1.27 0.00 1.77c0.02 0.17 0.13 0.13 0.24 0.25c0.23 0.25 0.50 0.98 0.70 1.51l0.57 0.69c0.00 0.48 0.93 1.09 1.45 1.31c0.47 0.20 0.64 1.75 1.03 1.75c0.25 0.00 0.97 -0.72 1.45 0.00c0.17 0.27 -0.29 0.31 -0.21 0.66c0.15 0.61 0.80 0.90 1.03 1.31c0.07 0.13 0.03 1.23 0.00 1.53c-0.08 0.75 -0.57 0.48 -0.62 0.87c-0.08 0.62 0.00 1.34 0.00 1.97c0.00 1.10 -0.16 0.57 0.41 0.87c1.20 1.59 0.19 2.06 1.86 2.18c0.31 0.02 0.32 0.78 0.21 1.09c-0.44 1.20 -0.41 2.32 -0.41 3.93c0.00 3.09 0.57 4.64 1.24 6.99c0.71 2.49 1.45 -0.40 1.45 3.49c0.00 1.77 0.33 1.50 1.65 1.97c0.12 0.39 1.21 1.50 0.62 2.40c-0.19 0.30 -3.70 -0.68 -4.13 -0.22c-0.04 0.04 -0.21 7.01 -0.21 7.43c0.00 3.88 1.45 0.82 1.45 2.62c0.00 1.65 -1.37 3.74 -1.03 5.46c0.28 1.41 4.33 0.09 3.72 1.53c-0.34 0.81 -0.72 -0.41 -0.62 1.09c0.05 0.83 3.70 -0.10 4.13 -0.22c-0.72 -0.25 0.09 -5.39 0.21 -5.46c1.86 -1.13 1.20 2.40 3.10 2.40c4.43 0.00 1.11 -6.85 4.13 -7.43c2.59 -0.50 4.34 2.67 4.34 -1.75c0.00 -3.92 -0.45 -8.72 1.65 -11.79l9.50 0.00c0.36 -0.13 0.16 0.01 0.21 -0.44c0.07 -0.68 0.27 -0.31 0.83 -0.44c0.67 -0.16 1.63 -0.47 1.86 -1.09c0.09 -0.25 0.18 -0.48 0.21 -0.66c0.10 -0.58 0.24 -0.90 0.41 -1.53l-4.34 -4.37l-0.62 -13.76l-2.89 -2.62l0.21 -5.90l5.58 0.00c0.36 -0.13 0.35 -0.64 0.41 -1.09c0.03 -0.24 0.26 -0.55 0.41 -0.87c0.06 -0.13 0.11 -0.12 0.21 -0.22c0.04 -0.04 0.16 -0.37 0.21 -0.44c0.42 -0.64 0.48 -0.13 0.62 -0.87c0.13 -0.70 0.62 0.43 0.62 0.66l0.00 0.22c0.00 0.21 1.41 -0.17 1.45 -0.22c0.73 -1.15 -0.67 -0.87 0.41 -0.87l0.21 0.00c0.14 0.00 0.00 -1.87 0.00 -1.97c0.46 -0.16 0.06 -1.37 0.41 -1.75c0.81 -0.85 0.74 -0.39 0.83 0.66c0.14 1.78 3.72 1.75 3.72 0.00c0.00 -1.42 1.46 -0.51 2.48 -0.87c0.24 -0.08 -0.30 -1.14 0.00 -1.75c0.11 -0.23 0.84 -0.05 0.62 -0.66c-0.21 -0.57 -0.50 -0.02 -0.83 -0.22c-0.67 -0.40 -0.93 -1.02 -1.86 -1.09c-0.87 -0.06 0.48 0.41 -0.41 0.22c-1.04 -0.23 -0.62 -0.99 -0.62 -2.18c0.59 0.00 1.93 0.27 2.07 -0.22c0.13 -0.46 0.04 -1.04 0.62 -1.09c0.56 -0.05 0.41 0.06 0.41 -0.66c0.00 -1.63 2.12 -0.64 2.27 -2.40c0.05 -0.58 0.13 -0.76 0.21 -1.09c0.09 -0.37 0.56 -0.76 0.62 -0.22c0.07 0.68 0.00 1.79 0.00 2.40l2.89 0.00l12.19 -12.23c0.32 0.00 1.52 -0.10 1.65 0.00c0.03 0.02 0.05 0.77 0.21 0.87c0.02 0.01 0.61 0.01 0.62 0.00c0.08 -0.08 0.17 -0.60 0.21 -0.66c0.07 -0.12 -0.14 -0.44 0.00 -0.44l0.21 0.00l0.00 -0.66c0.00 -0.29 0.28 -0.36 0.41 -0.44c0.30 -0.18 0.29 -0.31 0.41 -0.44c0.11 -0.11 0.56 -0.16 0.62 -0.22c0.19 -0.21 -0.04 -0.60 -0.21 -0.66c-0.51 -0.16 -0.08 -1.31 0.02 -1.75l-4.98 0.00l0.00 -18.13c-2.05 0.00 -1.52 0.14 -3.10 -0.87c-0.69 -0.44 -1.93 -0.19 -2.69 -0.44c-0.87 -0.29 -1.11 0.46 -1.45 1.09c-0.15 0.28 -0.15 -0.22 -1.03 -0.22c-2.24 0.00 -1.85 -0.43 -2.07 1.31c-0.05 0.41 -2.83 -0.29 -2.89 -0.44c-1.30 -3.24 -3.93 -5.86 -2.89 -0.22c-0.79 -0.28 -0.74 -0.77 -1.65 -1.09l-0.62 -0.22l-0.62 0.00l-0.62 -0.20l0.00 -6.35l-9.30 -5.68l1.65 -5.90l-2.89 -4.81l-4.34 0.00l1.86 -7.21l-5.16 -0.22c0.00 -0.89 -0.08 -2.52 0.41 -2.84c0.29 -0.19 0.34 0.36 0.41 -0.22c0.22 -1.82 -0.11 -2.45 1.65 -2.62c0.48 -0.05 1.57 -0.99 0.41 -1.09c-1.09 -0.10 -0.58 -0.79 -1.03 -1.53c-0.21 -0.34 -0.67 -0.50 -0.83 -0.87c-0.30 -0.71 0.30 -2.89 0.41 -3.49c-1.32 0.00 -2.78 0.29 -3.10 -1.09c-0.07 -0.29 1.00 -0.75 1.03 -1.09c0.15 -1.42 -0.20 -2.89 0.41 -3.93c0.29 -0.48 0.57 -1.31 -0.41 -1.31c-0.95 0.00 -3.31 0.06 -3.31 -1.53c0.00 -1.04 -1.29 -1.15 -2.28 -1.52l3.99 -4.26z"},"MX-SI":{"name":"Sinaloa","path":"m306.51 332.41c-0.52 0.04 -0.98 -0.31 -1.36 -0.65c-0.10 -0.46 -0.56 -0.80 -0.50 -1.29c0.05 -0.42 -0.18 -0.83 -0.50 -1.05c-0.25 -0.31 -0.73 -0.65 -1.11 -0.52c-0.23 0.32 -0.40 0.90 -0.04 1.19c0.31 0.26 0.51 0.79 1.00 0.58c0.42 -0.09 0.84 0.04 1.25 0.08c0.60 -0.05 0.32 0.80 0.70 1.06c0.28 0.09 0.39 0.37 0.56 0.59zm-53.40 -82.18c0.04 0.17 0.05 0.29 0.02 0.33c0.00 2.27 -0.33 2.13 1.73 2.13c3.24 0.00 1.44 1.99 1.44 3.66c0.00 1.45 1.31 3.53 2.02 4.88c0.29 0.55 -3.50 0.08 -3.75 -2.44c-0.10 -1.06 0.34 -2.86 -0.29 -3.66c-1.65 -2.10 -2.02 -1.38 -2.02 0.91c0.00 1.26 -1.08 1.22 -1.73 1.83c-1.94 1.81 -0.47 3.66 -2.31 4.88c-1.07 0.71 -2.12 0.11 -3.17 1.22c-1.55 1.64 -1.25 5.17 0.86 3.35c1.10 -0.95 0.33 2.24 0.00 2.74c-0.37 0.56 -1.60 0.96 -2.31 1.52c1.10 0.87 1.70 0.66 2.59 1.67c1.42 1.60 -3.65 1.81 -0.70 4.17c0.85 0.68 2.38 1.17 2.55 -0.25c0.09 -0.77 1.31 1.58 1.86 1.72c4.05 1.05 8.17 4.89 11.83 6.62c1.71 0.81 1.15 2.57 3.02 2.70c0.86 0.06 -1.39 -3.64 -1.39 -4.91c0.00 -4.17 2.97 0.53 3.48 1.72c1.73 4.03 -1.85 6.13 4.18 6.13c1.89 0.00 5.31 2.30 5.80 3.43c0.75 1.74 0.22 4.25 2.09 4.91c3.40 0.83 -0.61 -1.89 -0.46 -2.94c0.61 -4.24 1.73 -1.64 3.02 0.74c0.48 0.88 1.57 5.32 2.09 5.40c1.62 0.24 -1.07 2.30 0.70 4.17c0.30 0.32 1.39 2.19 1.39 2.21c0.49 1.68 1.81 2.69 3.02 4.42c2.05 2.92 6.80 3.89 7.43 7.36c0.31 1.72 3.62 7.11 5.10 7.11c2.58 -2.91 -1.68 -4.41 1.39 -7.36c1.30 -1.25 3.90 6.55 3.94 6.87c1.06 7.82 5.53 4.20 7.89 7.61c2.23 3.22 0.70 8.94 6.03 9.81c3.34 0.54 4.73 16.19 12.07 18.89c5.55 2.04 2.21 4.63 5.34 7.61c3.40 3.23 4.37 4.27 7.19 7.85c0.34 2.14 0.68 1.98 1.16 3.19c0.53 1.31 2.62 2.62 3.71 2.70c1.62 0.12 0.95 0.42 1.62 1.47c0.44 0.67 -0.03 -0.40 0.23 1.47c0.10 0.72 2.76 3.53 3.25 5.40c0.50 1.91 1.86 1.47 1.86 4.17c0.00 0.94 0.00 2.80 0.23 3.68c0.06 0.25 3.25 0.87 3.25 -0.49c0.00 -3.42 -0.93 -6.42 -0.93 -10.30c0.00 -2.12 -0.62 -3.93 1.86 -2.45c1.29 0.77 1.32 3.30 1.05 6.06c0.86 -0.02 1.72 0.03 2.03 0.42c0.78 0.95 1.43 1.77 2.82 1.82c3.27 0.13 1.09 -3.55 0.94 -5.31c-0.04 -0.51 -1.82 -0.92 -1.72 -1.99c0.13 -1.56 0.41 -4.02 1.10 -5.31c0.60 -1.12 -1.39 -5.47 0.94 -5.47c0.78 0.00 2.68 -1.36 3.14 -2.16c-0.39 -0.83 -0.57 -1.13 -0.63 -2.16c-0.02 -0.44 -0.03 -0.50 -0.47 -0.50c-1.06 0.00 -1.83 -0.66 -2.98 -0.66c-0.94 0.00 -1.10 -0.16 -1.10 0.83c0.00 0.29 -1.23 0.85 -1.57 0.66c-0.39 -0.22 0.05 -1.84 -0.16 -1.99c-0.36 -0.26 -0.87 0.26 -0.94 -0.33c-0.04 -0.36 0.00 -0.79 0.00 -1.16c0.00 -2.37 0.18 -2.16 2.35 -2.16c0.00 -0.66 -5.03 -0.40 -5.33 -1.99c-0.14 -0.75 -1.04 -0.93 -0.63 -2.49c0.44 -1.68 1.53 -4.51 -0.78 -5.47c-0.44 -0.18 -0.29 -1.15 -0.31 -1.66c-0.05 -1.07 -0.45 -0.01 -1.10 -0.99c-0.18 -0.27 -1.25 -1.36 -1.57 -0.50c-0.28 0.75 -0.47 0.75 -0.47 1.66c0.00 2.10 -0.79 -0.67 -1.25 -1.33c0.00 -3.23 0.73 -7.53 -0.31 -9.28c-0.84 -1.41 6.06 -2.21 1.88 -3.65c-2.48 -0.86 -3.61 -7.23 -3.61 -9.95c0.00 -2.55 -7.11 -3.74 -7.68 -6.47c-1.01 0.64 -0.28 1.51 -1.57 1.82c-0.85 0.21 -1.72 -0.02 -1.72 0.99c0.00 0.23 0.01 1.15 0.00 1.16c-0.38 0.21 -1.04 0.41 -1.41 0.66c-0.04 0.03 0.05 0.98 0.00 0.83c-0.43 -1.36 -0.54 -0.79 -1.88 -0.83c-0.40 -0.01 -1.31 -0.10 -1.41 -0.50c-0.32 -1.29 -0.07 -0.99 -1.41 -0.99c-0.65 0.00 -1.43 -0.53 -1.73 -1.16c-0.42 -0.89 0.00 -5.07 0.00 -6.13c0.00 -1.32 -0.88 -0.30 -1.41 -0.17c-0.90 0.23 -0.80 -1.61 -0.63 -2.16c0.70 -2.24 -1.57 -2.12 -1.57 -3.15c0.00 -1.19 -0.84 -2.81 -0.94 -4.31c-0.05 -0.81 -1.08 -0.46 -1.41 -0.83c-0.89 -0.98 -1.90 0.23 -2.20 -2.16c-0.21 -1.67 -2.67 -1.80 -2.67 -3.32c0.00 -1.19 -2.10 -0.99 -3.14 -0.99c-1.82 0.00 -1.57 -2.26 -1.57 -3.81l0.00 -7.13l-1.25 0.00c-1.36 0.00 -0.77 0.08 -2.45 -1.03c0.00 -3.27 0.58 -1.13 2.43 -2.99c1.85 -1.87 -1.16 -4.96 -0.40 -7.27c0.65 -2.01 2.01 -1.20 4.05 -1.28c1.08 -0.05 1.81 -0.32 2.40 -0.72c0.02 -0.81 -0.34 -0.15 -0.34 -0.71l0.00 -0.19c0.00 -0.25 -0.52 0.14 -0.72 0.00c-0.04 -0.03 0.02 -2.54 0.00 -2.87c-0.02 -0.42 -0.90 -0.20 -0.90 -0.57l0.00 -0.57l-0.90 -1.15c-2.16 0.00 -1.37 -3.49 -3.25 -3.26c-1.86 0.23 -1.45 0.47 -2.71 -1.91c-0.20 -0.37 -1.24 -2.78 -1.27 -3.06c-0.05 -0.52 0.22 -3.00 -0.18 -3.06c-1.79 -0.29 -2.71 0.90 -3.25 -1.53c-0.39 -1.77 -3.48 0.60 -4.15 -1.15l-6.70 0.00l-5.06 -7.47l-0.54 -10.53c-0.56 -0.44 -2.36 0.22 -2.53 -0.57c-0.25 -1.12 0.47 -0.67 0.90 -0.96c0.21 -0.14 0.20 -1.20 0.36 -1.34c0.27 -0.22 1.29 -0.16 0.72 -0.77c-0.18 -0.19 0.18 -1.24 0.18 -1.91c0.00 -1.05 0.07 -2.06 -0.72 -2.30c-1.76 -0.52 0.40 0.07 -1.08 -0.96c-0.37 -0.25 -0.81 -0.44 -1.27 -0.57c-0.80 -0.24 -3.82 -1.36 -3.25 -2.68c0.32 -0.75 0.49 -1.99 0.54 -3.06l-8.59 0.04l-1.11 0.44l-5.22 12.99l-7.60 4.33l0.00 2.47l-7.60 3.09l-3.65 -1.05z"},"MX-DU":{"name":"Durango","path":"m371.59 376.03c0.19 0.10 0.34 0.26 0.39 0.46c0.15 0.68 0.90 1.50 0.63 2.23c-0.30 0.84 -0.49 0.23 -0.21 1.12l10.55 0.00l0.00 2.90c0.00 0.70 -0.16 0.74 0.21 0.89c0.99 0.42 0.10 0.40 0.42 1.34c0.25 0.71 3.73 1.99 2.11 3.35c-1.25 1.05 -5.55 -0.30 -5.28 2.45c0.17 1.72 0.97 1.34 2.32 1.34c1.61 0.00 1.90 0.00 1.90 1.79c-0.45 1.22 -0.71 1.27 -0.63 2.45c0.05 0.77 2.13 -0.08 2.32 -0.45c0.45 -0.85 1.88 -0.64 2.11 -1.34c0.10 -0.29 0.00 -1.03 0.00 -1.34c0.00 -0.44 0.13 -1.76 0.42 -1.79c0.60 -0.06 1.51 -0.11 1.69 0.45c0.00 2.66 0.23 4.07 2.53 4.24c0.80 0.06 -0.11 4.46 2.74 4.46l9.71 -0.01c-0.00 -1.26 -0.01 -2.34 -0.01 -3.61l0.00 -2.48c0.00 -0.70 0.68 -0.57 1.11 -0.91c1.16 -0.94 -0.40 -4.94 0.74 -5.75c0.87 -0.61 1.06 -0.53 1.85 -0.91c1.00 -0.48 1.90 0.37 2.72 -0.78c0.00 -0.30 -0.12 -3.12 0.00 -3.26c0.77 -0.89 -1.61 -0.12 -1.61 -1.70c0.00 -0.76 0.12 -1.36 0.12 -2.22c0.00 -0.95 -1.11 -1.47 -1.11 -1.70c0.00 -2.95 -0.82 -4.44 2.59 -4.44c0.00 -1.52 -0.52 -2.49 0.49 -3.40c0.98 -0.88 -0.38 -4.72 1.11 -5.48c0.52 -0.27 1.10 -1.33 1.48 -1.83c1.25 -1.62 3.29 -0.72 4.32 -3.66c0.43 -1.22 2.84 -1.61 2.84 -3.00c0.00 -1.32 -0.62 -2.12 -0.62 -3.26c0.00 -0.81 0.12 -1.62 0.12 -2.35c0.00 -1.59 -0.99 -2.31 -0.99 -4.05c0.00 -1.14 0.37 -2.29 0.37 -3.53c1.41 -0.37 2.60 -0.57 2.96 -2.09c0.37 -1.53 0.08 -1.57 1.98 -1.57c0.80 0.00 3.46 -0.25 3.46 -1.31c0.00 -2.36 0.15 -1.90 0.86 -3.26c0.32 -0.61 0.30 -1.14 0.74 -1.57c0.13 -0.12 2.19 -0.67 2.59 -0.78c2.88 -0.82 0.68 -5.16 2.72 -5.88c1.01 0.92 2.75 0.92 3.83 1.70c0.69 0.50 1.95 1.14 2.72 1.31c0.68 0.15 0.88 -0.07 1.36 -0.26c1.34 -0.53 1.41 -0.60 1.48 -2.22c0.08 -1.92 6.20 0.62 7.29 1.31c1.85 1.65 0.42 2.22 3.09 2.22c1.43 0.00 1.27 -0.05 2.35 0.91c2.05 1.83 1.06 -0.99 1.61 -1.96c0.66 -1.17 3.83 -0.52 5.06 -1.31c0.82 -1.01 0.12 -3.21 0.12 -4.57c0.00 -1.20 -1.74 -4.05 -2.72 -4.05c-1.05 0.00 0.62 -1.38 0.62 -2.61c0.00 -1.40 -0.76 -6.73 -1.23 -6.79c-2.25 -0.27 -3.07 -2.46 -3.67 -4.24l-2.39 2.99l-1.68 5.57c-0.07 0.47 -0.25 1.11 -0.48 1.27l-1.44 1.01c-2.51 0.00 -3.43 -1.50 -4.31 -3.55c-0.10 -0.24 -4.41 -0.35 -5.51 -1.01c-3.40 -2.03 -5.99 -6.05 -5.99 -10.38c0.00 -4.73 -5.07 1.78 -2.87 -6.33c0.00 -0.89 -0.28 -2.43 0.48 -2.53c0.71 -0.10 1.26 -0.14 1.92 -0.25c0.86 -0.15 0.31 -0.43 0.24 -0.76c-0.24 -1.10 -0.38 -0.65 -1.20 -0.76c-0.52 -0.07 -0.19 -2.93 -0.48 -3.55c-0.26 -0.55 -0.48 -0.65 -0.48 -1.27c0.35 -1.12 1.31 -0.50 1.92 -1.27c0.54 -0.68 1.11 -1.86 1.44 -2.53c1.21 -2.46 0.63 -6.20 0.24 -9.12c-0.44 -0.69 -0.87 -0.85 -1.20 -1.27c-0.21 -0.27 -0.22 -0.66 -0.24 -1.01c-0.05 -0.81 -0.20 -0.57 -0.24 -1.01c-0.13 -1.36 -0.12 -0.69 0.72 -1.27c1.15 -0.79 0.72 -3.90 0.72 -5.32l3.11 -3.55l-2.40 -5.32l-1.68 -5.82l-10.41 -4.98l-14.46 -1.39l-6.68 5.39c-0.09 0.29 -1.22 1.37 -1.45 1.53c-0.25 0.19 -1.48 1.07 -1.63 1.34c-0.99 1.86 0.48 6.54 -2.17 6.70c-1.71 0.10 -3.87 -1.74 -4.52 -3.26c-0.89 -2.07 -1.54 -1.95 -3.98 -3.06c-1.89 0.67 -2.62 0.54 -4.16 1.53c-1.91 1.24 -2.71 1.68 -3.44 -0.57c-0.10 -0.32 -1.02 -1.14 -1.45 -0.77c-1.24 1.07 -0.54 2.12 -0.54 3.83c0.00 3.07 -6.32 -4.66 -9.04 -4.79c-0.61 -0.03 -2.90 -1.16 -3.07 -1.34c-0.40 -0.42 -0.37 -3.86 -1.99 -2.68c-0.83 0.60 -0.15 1.38 -1.63 0.77c-2.51 -1.05 -3.80 -5.74 -7.96 -5.94c-2.93 -0.14 0.63 -3.36 -4.52 -1.72c0.00 1.29 -1.93 2.12 -2.53 3.45c-0.74 1.64 -0.83 1.47 -2.71 2.30c-3.03 1.34 -0.28 7.19 -2.17 9.19c-2.85 3.02 -5.60 6.61 -5.60 11.68c0.00 3.99 -1.93 2.43 -2.53 5.36c-1.94 9.39 2.73 7.20 -6.33 13.50c-2.99 2.08 0.66 -0.28 -2.89 -0.28c-0.82 0.00 -1.22 -1.60 -2.35 -1.72c-1.38 -0.15 -1.78 -0.59 -3.27 -1.20c-0.59 0.40 -1.32 0.68 -2.40 0.72c-2.04 0.09 -3.39 -0.72 -4.05 1.28c-0.76 2.32 2.25 5.40 0.40 7.27c-1.84 1.87 -2.43 -0.28 -2.43 2.99c1.68 1.11 1.09 1.03 2.45 1.03l1.25 0.00l0.00 7.13c0.00 1.56 -0.25 3.81 1.57 3.81c1.04 0.00 3.14 -0.20 3.14 0.99c0.00 1.52 2.46 1.64 2.67 3.32c0.29 2.38 1.31 1.17 2.20 2.16c0.34 0.37 1.36 0.02 1.41 0.83c0.10 1.50 0.94 3.12 0.94 4.31c0.00 1.03 2.27 0.91 1.57 3.15c-0.17 0.54 -0.27 2.38 0.63 2.16c0.53 -0.13 1.41 -1.15 1.41 0.17c0.00 1.07 -0.42 5.24 0.00 6.13c0.30 0.63 1.07 1.16 1.73 1.16c1.34 0.00 1.09 -0.29 1.41 0.99c0.10 0.40 1.01 0.49 1.41 0.50c1.34 0.04 1.46 -0.53 1.88 0.83c0.05 0.15 -0.04 -0.80 0.00 -0.83c0.37 -0.25 1.03 -0.45 1.41 -0.66c0.01 -0.01 0.00 -0.93 0.00 -1.16c0.00 -1.01 0.88 -0.79 1.72 -0.99c1.29 -0.32 0.55 -1.18 1.57 -1.82c0.57 2.72 7.68 3.92 7.68 6.47c0.00 2.71 1.12 9.09 3.61 9.95c4.17 1.44 -2.72 2.23 -1.88 3.65c1.04 1.76 0.31 6.05 0.31 9.28c0.46 0.65 1.25 3.43 1.25 1.33c0.00 -0.91 0.19 -0.91 0.47 -1.66c0.32 -0.87 1.39 0.23 1.57 0.50c0.65 0.99 1.05 -0.08 1.10 0.99c0.02 0.51 -0.12 1.48 0.31 1.66c2.31 0.96 1.22 3.80 0.78 5.47c-0.41 1.56 0.49 1.74 0.63 2.49c0.30 1.59 5.33 1.33 5.33 1.99c-2.17 0.00 -2.35 -0.21 -2.35 2.16c0.00 0.37 -0.04 0.80 0.00 1.16c0.07 0.59 0.58 0.07 0.94 0.33c0.21 0.15 -0.24 1.77 0.16 1.99c0.33 0.19 1.57 -0.37 1.57 -0.66c0.00 -0.99 0.16 -0.83 1.10 -0.83c1.15 0.00 1.92 0.66 2.98 0.66c0.44 0.00 0.45 0.06 0.47 0.50c0.06 1.02 0.24 1.23 0.63 2.06z"},"MX-NA":{"name":"Nayarit","path":"m343.28 441.18c-0.12 0.47 -0.33 1.09 -0.86 1.14c-0.54 -0.04 -1.21 -0.21 -1.64 0.24c-0.15 0.60 -0.95 0.21 -0.55 -0.28c0.28 -0.46 0.13 -1.36 -0.54 -1.03c-0.45 0.20 -1.12 0.44 -1.43 -0.13c-0.18 -0.17 -0.36 -0.69 0.08 -0.54c0.48 -0.16 1.32 -0.46 1.20 -1.12c-0.15 -0.41 0.07 -0.73 0.40 -0.82c0.27 -0.39 0.84 -0.76 1.25 -0.38c0.29 0.46 0.00 1.26 0.59 1.56c0.39 0.47 1.02 0.61 1.45 1.00c0.06 0.11 0.08 0.24 0.05 0.36zm-8.88 -8.52c0.81 0.00 2.89 -0.39 2.89 0.66c0.00 0.85 -0.08 0.72 0.21 1.09c0.48 0.63 -0.16 0.22 0.62 0.22l0.62 0.00c0.74 0.00 1.13 -0.25 1.03 0.66c-0.09 0.81 -0.28 0.43 -0.83 0.66c-0.13 0.05 -0.07 0.19 -0.21 0.22c-0.20 0.04 -0.25 0.08 -0.41 0.22c-0.11 0.09 -0.11 0.12 -0.21 0.22c-0.14 0.15 -1.12 0.50 -1.45 0.66c-0.17 0.54 -0.63 0.32 -0.83 0.66c-0.10 0.17 0.11 1.55 -0.41 1.31c-0.36 -0.17 -1.45 -1.58 -1.45 -1.97c0.00 -2.16 0.59 -1.20 -1.03 -1.09c-1.76 0.11 -2.18 -0.16 -1.45 -1.53c0.51 -0.96 -0.96 -3.16 -2.27 -2.62c-2.35 0.96 -2.27 -2.58 -2.27 -4.37c0.00 -2.23 5.33 -2.76 5.99 -1.75c0.20 0.31 0.38 1.67 0.41 1.97c0.06 0.47 0.00 1.05 0.00 1.53c0.00 1.19 0.68 -0.31 1.45 -0.44c1.06 -0.18 0.65 0.38 0.21 0.44c-1.07 0.13 -1.03 1.28 -0.62 3.28l0.00 0.00zm18.59 -10.27c0.31 -0.43 0.75 -0.80 0.83 -1.36c0.04 -0.37 0.04 -0.75 -0.02 -1.12c-0.14 -0.24 -0.44 -0.17 -0.66 -0.14c-0.30 0.04 -0.66 -0.11 -0.92 0.12c-0.28 0.12 -0.19 0.48 -0.05 0.66c0.01 0.25 -0.07 0.56 0.14 0.74c0.32 0.28 0.49 0.72 0.68 1.11zm-26.24 2.18c0.55 -0.06 1.10 -0.31 1.66 -0.20c0.32 -0.17 0.28 -0.59 0.36 -0.90c0.09 -0.33 0.25 -0.81 -0.07 -1.06c-0.32 -0.17 -0.33 -0.68 -0.70 -0.76c-0.31 -0.15 -0.59 -0.48 -0.97 -0.37c-0.34 0.07 -0.71 0.30 -0.84 0.65c-0.09 0.34 0.19 0.61 0.16 0.95c0.03 0.41 0.08 0.82 0.22 1.21c0.05 0.16 0.11 0.33 0.17 0.49zm35.58 -30.46c0.86 -0.02 1.72 0.03 2.03 0.42c0.78 0.95 1.43 1.77 2.82 1.82c3.27 0.13 1.09 -3.55 0.94 -5.31c-0.04 -0.51 -1.82 -0.92 -1.72 -1.99c0.13 -1.56 0.41 -4.02 1.10 -5.31c0.60 -1.12 -1.39 -5.47 0.94 -5.47c0.78 0.00 2.68 -1.36 3.14 -2.21c0.20 0.05 0.34 0.21 0.39 0.41c0.15 0.68 0.90 1.50 0.63 2.23c-0.30 0.84 -0.49 0.23 -0.21 1.12l10.55 0.00l0.00 2.90c0.00 0.70 -0.16 0.74 0.21 0.89c0.99 0.42 0.10 0.40 0.42 1.34c0.25 0.71 3.73 1.99 2.11 3.35c-1.25 1.05 -5.55 -0.30 -5.28 2.45c0.17 1.72 0.97 1.34 2.32 1.34c1.61 0.00 1.90 0.00 1.90 1.79c-0.45 1.22 -0.71 1.27 -0.63 2.45c0.05 0.77 2.13 -0.08 2.32 -0.45c0.45 -0.85 1.88 -0.64 2.11 -1.34c0.10 -0.29 0.00 -1.03 0.00 -1.34c0.00 -0.44 0.13 -1.76 0.42 -1.79c0.60 -0.06 1.51 -0.11 1.69 0.45c0.00 2.66 0.23 4.07 2.53 4.24c0.80 0.06 -0.11 4.46 2.74 4.46l9.71 0.00c-0.04 0.75 -0.21 2.83 -0.42 3.57c-0.04 0.15 -0.79 0.23 -0.84 0.67c-0.16 1.30 0.09 1.47 -0.63 2.45c-0.34 0.47 -0.21 1.17 -0.21 1.79c0.00 1.14 -1.27 0.38 -1.27 2.01c0.00 1.45 0.13 3.38 -0.21 4.46c2.08 1.01 2.37 -0.34 4.22 -0.22c0.08 0.00 1.58 0.34 2.11 0.45c1.10 0.21 1.81 2.75 0.84 3.57c-1.05 0.89 -0.56 4.83 1.90 3.57c0.76 -0.39 1.78 -0.25 2.74 0.45c0.85 0.62 0.25 1.56 1.90 1.56c0.38 1.99 -0.07 1.15 1.06 2.01c0.94 0.72 -0.51 5.93 0.21 6.69c0.03 0.03 0.56 -0.01 0.63 0.00c0.17 0.02 0.26 0.19 0.42 0.22c4.61 0.89 1.69 2.76 1.69 6.03c0.00 2.02 -0.01 3.16 -1.27 4.24c-1.21 1.04 -1.95 -1.69 -3.38 -0.89c-0.09 0.05 -0.21 0.42 -0.21 0.67c0.00 1.42 -0.84 1.10 -1.06 2.45c-0.72 -0.18 -1.01 -0.22 -1.69 -0.22c-0.34 0.00 -0.72 0.03 -1.06 0.00c-0.77 -0.07 -0.15 0.07 -0.63 -0.45c-0.12 -0.13 -0.25 -0.20 -0.42 -0.22c-0.59 -0.07 -0.23 0.18 -0.63 0.22c-0.74 0.08 -1.57 0.00 -2.32 0.00l0.00 8.93l-3.59 3.79l2.53 3.35l0.42 6.25c-0.66 -1.16 -0.39 -1.45 -0.63 -2.68c-0.29 -1.45 -2.04 -0.70 -2.74 -2.01c-0.32 -0.59 -0.77 -2.14 -1.27 -2.90c-0.80 -1.23 -6.17 -2.55 -6.33 -4.02c-0.20 -1.87 -1.23 -1.79 -2.95 -1.79c-0.40 0.00 -0.74 -1.59 -0.84 -2.01c-1.86 -0.87 -6.86 -1.86 -7.39 0.89c-0.56 2.92 -3.02 0.58 -4.43 1.79c-1.12 0.96 -2.24 0.90 -2.95 2.23c-0.79 1.49 -3.62 1.61 -4.01 3.35c-0.29 1.29 -0.36 2.02 -0.82 2.77c-0.26 -0.58 -0.80 -0.94 -1.90 -0.99c-1.80 -0.07 -3.55 -0.25 -5.34 -0.25c0.21 -2.94 2.47 -3.81 3.02 -5.40c1.03 -2.98 5.40 -3.10 6.03 -5.64c0.86 -3.42 -1.94 -6.50 -0.70 -10.30c1.10 -3.36 1.74 -5.35 -1.62 -7.85c-1.20 -0.89 -3.85 -7.54 -5.80 -7.85c-1.65 -0.26 -5.01 -8.51 -5.10 -10.06c-0.20 -1.06 -0.52 -0.82 -0.46 -1.96c0.04 -0.85 0.64 -1.49 0.70 -1.96c0.16 -1.29 -1.39 -4.27 -1.39 -5.89c0.00 -0.53 -0.22 -2.21 0.23 -2.21c1.40 0.00 0.30 0.06 0.70 0.74c0.56 0.95 0.93 2.49 0.93 3.93c0.00 2.01 -0.08 1.27 0.93 2.21c0.45 0.42 0.40 2.78 0.00 2.94c-1.59 0.66 0.16 1.32 0.23 1.23c0.64 -0.85 1.06 -1.31 1.86 -1.72c1.11 -0.57 0.55 0.55 0.70 0.98c0.08 0.22 0.69 0.72 0.70 0.74c0.86 1.45 1.50 0.98 3.02 -0.25c0.00 -2.39 -3.51 -1.54 -5.34 -3.68c-0.73 -0.85 -1.20 -6.69 -1.62 -7.85c-0.50 -1.39 0.26 -5.08 0.58 -8.42z"},"MX-SL":{"name":"San Luis Potosí","path":"m495.68 422.76c3.92 1.11 9.08 0.48 13.50 1.05c3.65 0.47 10.64 6.73 12.97 9.68c2.28 2.87 10.41 -6.12 12.66 -6.92c1.74 0.43 3.33 0.48 3.56 2.56c0.32 2.97 4.46 3.76 6.54 4.66c0.94 0.41 1.73 0.45 2.99 0.45c1.33 0.00 1.79 0.45 2.99 0.45l2.28 -4.06l2.28 0.00l4.84 5.86c0.59 -1.33 1.67 -1.01 2.56 -1.95c0.22 -0.23 1.62 -0.56 1.71 -0.90c0.16 -0.63 0.57 -1.12 0.57 -1.80c0.00 -2.99 3.98 0.53 3.98 -2.11c0.00 -1.07 0.42 -1.64 1.14 -2.41c0.58 -0.61 2.65 0.15 1.71 0.15c0.35 1.10 0.28 2.01 0.28 3.16c0.00 0.80 -0.10 0.80 0.57 0.90c0.85 0.13 0.49 3.43 0.14 4.06c-0.41 0.74 -0.43 1.20 -0.43 2.26c0.00 1.98 1.73 2.41 2.70 4.21c0.28 -0.56 1.42 -2.09 2.13 -1.65c0.96 0.59 1.13 1.35 2.28 1.50c0.21 0.03 0.33 1.67 0.43 1.95c0.16 0.47 1.62 1.05 2.28 1.05c1.18 0.00 3.47 0.95 4.41 0.45c0.33 -0.18 0.65 -0.69 0.85 -0.90c0.03 -0.03 0.11 -0.24 0.14 -0.30c0.11 -0.20 0.41 -0.24 0.57 -0.45c0.18 -0.23 0.45 -0.67 0.71 -0.75c0.25 -0.08 1.14 -0.48 1.14 -0.75c-0.06 -0.87 -0.22 -1.05 -1.00 -1.05c-0.24 0.00 -0.54 -0.00 -0.71 -0.15c-0.30 -0.25 -0.40 -0.15 -0.85 -0.30c-0.28 -0.10 -0.57 -0.62 -0.57 -0.90c0.00 -0.60 -0.14 -1.05 -0.14 -1.65l6.12 -1.50l-0.85 -4.21l-1.28 0.00c-0.64 0.00 -0.54 0.18 -0.57 -0.45c-0.03 -0.86 -0.14 -1.13 -0.14 -1.95c0.00 -0.45 -0.22 -0.29 -0.28 -0.45c-0.17 -0.46 -0.15 -1.02 -0.28 -1.50c-0.10 -0.36 -0.28 -0.91 -0.28 -1.20l4.84 -2.56l-0.14 -2.11c-0.41 -1.94 -1.14 -1.33 -2.84 -1.80c-0.24 -0.07 1.07 -0.02 1.28 -0.75c0.95 -3.25 -0.18 -4.90 2.42 -6.92c1.47 -1.14 3.41 -8.12 0.71 -8.12c-1.47 0.00 -4.46 -0.42 -4.84 -1.80c-0.08 -0.29 -0.12 -0.62 -0.13 -1.00c-1.55 -0.20 -1.41 -1.69 -4.15 -1.69c-1.01 0.00 -1.04 0.92 -1.44 1.67c-0.56 1.05 -4.39 0.15 -5.17 0.15c-2.55 0.00 -1.10 1.60 -2.16 -1.22c-0.13 -0.35 -1.41 -0.74 -1.87 -0.76c-2.28 -0.12 -6.39 1.81 -7.62 0.91c0.12 -0.04 0.34 -2.69 0.43 -3.05c0.11 -0.47 0.79 -0.86 -0.29 -0.91c-1.03 -0.05 -0.86 0.11 -0.86 -0.91c0.00 -0.34 0.09 -0.53 0.14 -0.76c0.15 -0.66 0.11 -1.00 0.00 -1.67c-0.09 -0.55 -2.74 0.14 -3.31 -0.15c-1.17 -0.61 -2.22 -2.38 -2.87 -3.50c-0.36 -0.95 -2.16 -1.65 -2.16 0.15c0.00 0.50 0.96 3.36 0.00 3.20c-1.72 -0.29 -2.67 -1.57 -4.46 -2.13c-0.99 -0.31 -1.07 1.61 -2.44 1.07c-0.62 -0.24 0.02 -0.84 -1.01 -0.30c-0.59 0.31 -1.07 0.72 -2.16 0.76c-1.13 0.04 -0.72 -0.68 -0.72 -1.67c0.00 -0.66 0.14 -1.28 0.14 -1.98c-0.30 -1.28 0.02 -1.52 -1.44 -1.52c-1.70 0.00 -3.50 -0.15 -4.89 0.30c-0.27 0.09 -0.81 0.61 -1.01 0.46c-0.41 -0.31 -1.08 -1.83 -0.14 -1.83c0.17 0.00 0.78 -0.00 0.86 -0.15c0.24 -0.44 -0.18 -2.85 -0.57 -2.44c-0.02 0.03 -1.55 1.92 -1.72 1.37c-0.25 -0.78 0.00 -2.83 0.00 -3.81c0.00 -2.13 -0.50 -1.62 1.01 -2.28c0.41 -0.18 0.96 -0.45 1.44 -0.76c1.08 -0.70 1.01 -0.74 1.01 -2.44l-1.87 0.00c-1.27 0.00 -1.15 0.27 -1.15 -1.07c0.00 -1.48 0.23 -1.08 -0.86 -1.37c-0.37 -0.10 -1.01 -0.22 -1.01 -0.61l0.01 -1.91c-0.23 0.08 -0.50 0.12 -0.81 0.12c-1.90 0.00 -1.24 -3.53 -3.10 -2.40c-0.12 0.07 -0.92 5.21 -0.21 5.46c-0.43 0.12 -4.08 1.05 -4.13 0.22c-0.10 -1.50 0.28 -0.28 0.62 -1.09c0.61 -1.43 -3.44 -0.12 -3.72 -1.53c-0.34 -1.72 1.03 -3.81 1.03 -5.46c0.00 -1.80 -1.45 1.26 -1.45 -2.62c0.00 -0.42 0.17 -7.38 0.21 -7.43c0.44 -0.46 3.94 0.52 4.13 0.22c0.59 -0.90 -0.50 -2.01 -0.62 -2.40c-1.32 -0.47 -1.65 -0.20 -1.65 -1.97c0.00 -3.90 -0.73 -1.00 -1.45 -3.49c-0.67 -2.35 -1.24 -3.90 -1.24 -6.99c0.00 -1.61 -0.02 -2.73 0.41 -3.93c0.11 -0.31 0.11 -1.07 -0.21 -1.09c-1.67 -0.12 -0.66 -0.59 -1.86 -2.18c-0.58 -0.31 -0.41 0.23 -0.41 -0.87c0.00 -0.63 -0.08 -1.35 0.00 -1.97c0.05 -0.39 0.54 -0.12 0.62 -0.87c0.03 -0.30 0.07 -1.40 0.00 -1.53c-0.23 -0.41 -0.88 -0.70 -1.03 -1.31c-0.09 -0.34 0.38 -0.39 0.21 -0.66c-0.47 -0.72 -1.19 0.00 -1.45 0.00c-0.39 0.00 -0.56 -1.55 -1.03 -1.75c-0.51 -0.22 -1.45 -0.83 -1.45 -1.31l-0.59 -0.70l-0.93 -0.26l-8.47 15.23l-1.69 0.00c-0.88 0.00 -0.89 -0.57 -2.12 -0.45c-1.09 0.10 -0.07 0.30 -0.42 0.90c-0.42 0.72 -0.85 0.17 -0.42 0.90c0.15 0.25 0.39 0.15 0.42 0.45c0.05 0.41 0.00 0.92 0.00 1.34c0.00 1.04 -0.33 1.97 0.42 2.24l-18.22 18.36c-2.54 -2.24 -1.97 -2.20 -2.12 -2.24c-2.99 -0.79 -0.47 0.32 -1.27 0.90c-0.78 0.56 -2.43 -0.61 -2.54 1.34c-0.08 1.32 -0.85 2.41 -0.85 3.73c-1.56 -0.04 -4.19 1.88 -6.35 1.57c-2.49 -1.85 -5.14 -4.43 -5.14 -1.81c0.00 0.62 -1.20 15.79 2.17 19.35c1.06 1.12 2.86 2.14 4.24 3.14c1.61 1.16 1.62 5.40 4.23 5.40c3.50 0.00 4.37 0.77 6.36 2.07c2.26 1.48 1.13 1.49 3.39 1.49c1.76 0.00 3.18 0.62 3.39 -1.34c0.05 -0.49 0.05 -2.05 0.42 -2.24c2.25 -1.15 0.25 -0.32 1.27 -0.90c3.26 -1.84 0.21 0.90 1.27 -0.90c0.15 -0.25 0.22 -0.24 0.42 -0.45c0.10 -0.11 0.64 -0.39 0.85 -0.45c0.72 -0.20 0.86 -0.45 1.69 -0.45c3.13 0.28 1.93 1.16 2.12 4.48c0.07 1.30 0.85 2.31 0.85 4.48c0.00 1.96 -2.12 1.79 -2.12 4.48c0.00 3.77 1.65 5.96 0.85 9.85c-0.26 1.27 -2.31 3.09 -2.97 4.48c-0.42 0.89 -1.24 3.46 -2.17 4.66z"},"MX-QE":{"name":"Queretaro","path":"m540.74 489.48c-0.05 -0.55 -0.10 -1.05 -0.02 -1.15c0.09 -0.10 0.92 -2.16 0.92 -2.17c0.08 -1.22 -1.24 -0.31 -1.34 -1.41c-0.03 -0.39 -1.34 -0.42 -1.54 -0.54c-0.06 -0.04 -0.39 -1.03 -0.62 -1.20c-0.56 -0.41 -1.60 -0.49 -2.16 -1.09c-0.50 -0.52 -0.76 -1.62 -1.13 -2.50c-0.34 0.05 -0.63 0.26 -0.84 0.58c-0.64 -1.11 -1.35 -2.45 -1.37 -2.72c-0.03 -0.36 0.16 -1.13 -0.19 -1.18c-0.70 -0.10 -2.99 0.31 -3.35 0.00c-0.34 -0.28 0.26 -3.82 0.00 -4.53c-0.31 -0.86 -0.23 -4.69 -0.75 -4.73c-0.61 -0.05 -1.86 0.34 -1.86 -0.39c0.00 -3.26 4.72 -2.73 -0.19 -2.96c-2.47 -0.11 -1.54 -3.46 0.00 -4.53c1.03 -0.72 2.00 -2.86 2.61 -4.34c0.66 0.70 1.08 1.97 2.42 1.97c1.64 0.00 3.66 0.47 4.10 -1.18c0.37 -1.42 -1.57 -2.17 0.93 -2.17c0.57 0.00 0.41 0.46 0.37 0.59c-0.44 1.46 0.96 1.04 1.86 0.99c0.31 -0.02 1.17 -1.08 1.30 0.00c0.06 0.45 1.23 0.26 1.30 -0.39c0.22 -2.00 0.16 -1.77 2.24 -1.77l-0.56 -7.88c0.23 -0.16 1.79 -0.78 1.68 -0.20c-0.21 1.05 -0.19 0.93 1.12 0.99c1.47 0.06 0.35 -2.05 2.61 -0.99c0.80 0.37 1.35 0.28 0.93 0.99c-0.47 0.80 0.43 0.99 0.93 0.99c0.95 0.00 0.82 -0.01 1.49 -0.59c0.94 -0.82 1.32 -1.29 1.86 -2.36c0.15 -0.31 2.28 -0.52 2.61 -0.59c-0.14 -0.44 -0.14 0.05 -0.37 -0.20c-0.03 -0.03 0.01 -0.52 0.00 -0.59c-0.02 -0.13 -0.12 -0.09 -0.19 -0.20c-0.07 -0.11 0.04 -0.27 0.00 -0.39c-0.10 -0.28 -0.29 -0.30 -0.37 -0.39c-0.28 -0.30 0.05 -0.34 -0.56 -0.39c-0.79 -0.08 -0.56 0.06 -1.49 -0.39l-1.12 0.99l-1.22 -6.71l2.34 -4.08l2.28 0.00l4.84 5.86c0.59 -1.33 1.67 -1.01 2.56 -1.95c0.22 -0.23 1.62 -0.56 1.71 -0.90c0.16 -0.63 0.57 -1.12 0.57 -1.80c0.00 -2.99 3.98 0.53 3.98 -2.11c0.00 -1.07 0.42 -1.64 1.14 -2.41c0.58 -0.61 2.65 0.15 1.71 0.15c0.35 1.10 0.28 2.01 0.28 3.16c0.00 0.80 -0.10 0.80 0.57 0.90c0.85 0.13 0.49 3.43 0.14 4.06c-0.41 0.74 -0.43 1.20 -0.43 2.26c0.00 1.98 1.73 2.41 2.71 4.16l0.27 2.81c-0.43 0.00 -0.98 1.83 -1.63 1.92c-1.16 0.16 -3.14 -0.13 -3.54 0.99c-0.36 1.00 -0.95 0.63 -1.68 0.39c-0.92 -0.29 -1.26 -0.71 -2.80 -0.79c-1.84 -0.10 -1.68 -0.57 -1.68 1.38c0.00 0.72 -0.26 1.17 -0.19 1.97c0.05 0.49 2.11 1.08 2.05 1.38l-0.19 0.99c-0.27 1.16 -1.30 0.29 -1.30 1.97c0.00 1.21 -1.51 2.02 -2.42 1.58c-2.74 -1.32 -1.12 5.52 -1.12 6.50c0.00 2.36 -1.19 1.31 -1.86 3.15c-0.38 1.05 -1.98 0.25 -2.05 0.79c-0.12 0.99 -1.67 1.10 -2.61 1.38c-1.40 0.42 0.08 -0.17 -0.75 0.99c-0.61 0.84 -2.59 0.37 -3.35 0.00l-0.56 9.66c-0.76 0.00 -1.24 -0.20 -2.05 -0.20c-1.19 0.00 -0.19 0.76 -0.19 0.99c0.00 0.39 -0.96 0.07 -1.12 0.00c-0.64 -0.26 0.15 0.63 0.00 0.99c-0.13 0.31 -0.44 1.84 -0.56 1.97c-0.97 1.03 0.75 0.41 0.75 1.97c0.00 0.50 0.14 1.74 -0.37 1.77c-1.33 0.10 -0.69 0.13 -1.49 0.79c-0.98 0.80 -0.63 -0.51 -1.30 0.20c-0.27 0.29 -0.44 0.17 -0.75 0.59c-0.93 1.27 -0.07 1.36 -1.98 1.37z"},"MX-ZA":{"name":"Zacatecas","path":"m495.68 422.81l-8.14 -7.77l-3.83 0.00l-0.69 -0.52c-0.13 -1.71 0.38 -1.87 -1.27 -2.24c-0.44 -0.10 -0.79 2.13 -1.69 0.45c-0.14 -0.26 0.04 -0.60 0.00 -0.90c-0.10 -0.80 -0.86 -0.22 -1.27 -1.34c-0.36 -0.99 1.51 -4.03 0.42 -4.03l-0.42 0.00c-1.00 0.00 -1.32 -1.67 -2.12 -1.79c-2.47 -0.39 -1.87 -1.09 -3.39 -2.69c-0.97 -1.02 -2.48 -1.16 -2.97 -2.69c-1.46 0.52 -3.81 0.37 -3.81 1.79c0.00 3.16 0.49 3.58 -2.54 3.58c-6.96 0.00 -5.51 -0.04 -5.51 5.38c0.00 1.00 -0.77 1.11 -1.69 1.79c-0.57 0.42 -1.69 3.24 -1.69 4.48c0.00 1.73 -1.08 1.10 -1.27 2.69c-0.60 4.86 -0.11 6.12 3.26 6.99c-0.12 0.36 -2.13 0.04 -2.45 0.05c0.16 0.67 0.22 1.80 0.26 2.36c0.04 0.61 -0.26 0.85 -0.26 1.53c0.00 1.30 1.15 1.35 1.71 2.09c0.30 0.39 0.66 1.23 1.32 0.84c0.42 -0.25 0.47 -0.01 1.05 0.42l0.13 6.41c-1.82 0.00 -2.31 0.70 -3.69 0.70c-0.29 0.00 -1.25 1.50 -1.71 1.81c-1.03 0.68 -1.90 -0.89 -2.11 1.25c-0.06 0.65 -0.00 2.43 -1.05 1.67c-0.44 -0.32 0.65 -1.11 -0.66 -1.11c-1.47 0.00 -2.76 -0.02 -4.22 -0.28l0.26 6.96l-5.27 0.70c-0.46 0.12 -0.03 0.26 -0.66 0.42c-0.42 0.10 -0.80 0.13 -1.19 0.28c-0.19 0.07 -1.14 0.48 -1.19 0.56c-0.23 0.39 -0.14 0.28 -0.79 0.28c-0.44 0.00 -0.59 0.11 -0.79 -0.28c-0.33 -0.63 -0.59 -0.58 -0.92 -0.97c-0.17 -0.21 -0.27 -0.97 -0.39 -1.25c-0.32 -0.75 -0.43 -1.23 -0.79 -2.09c0.00 -0.94 -2.11 -1.08 -2.90 -0.97c-0.63 0.09 -0.14 1.11 -1.19 1.39c-0.22 0.06 -1.03 0.67 -1.19 0.14c-0.22 -0.75 -0.13 -1.58 -0.13 -2.37c0.00 -1.84 0.13 -1.80 -1.45 -1.11c-1.84 0.80 0.13 -1.95 -0.92 -2.65c-0.27 -0.18 -0.76 -0.87 -0.92 -1.25c-0.26 -0.63 -0.24 -0.88 -0.92 -0.98c-0.67 -0.09 -0.48 0.01 -0.53 -0.97c0.00 -1.28 -0.23 -2.37 1.19 -2.37c1.47 0.00 -0.25 1.11 1.71 1.11c0.90 0.00 1.05 0.17 1.58 -0.42c0.91 -1.00 1.45 0.75 1.45 -1.67c0.00 -0.92 -1.59 0.13 -2.24 -0.14c-0.32 -0.13 -1.38 -1.35 -1.98 -0.56c-0.16 0.20 -0.37 0.67 -0.53 0.84c-0.08 0.08 -0.53 0.04 -0.53 -0.14c0.00 -0.39 1.02 -0.29 0.53 -1.11c-0.60 -1.01 0.37 -1.74 0.92 -1.81c0.49 -0.06 0.56 -1.19 0.66 -1.67c1.25 -0.44 2.10 -0.70 3.43 -0.70c0.41 0.00 0.80 -0.99 1.05 -1.53c0.18 -0.38 -0.17 -1.28 0.00 -1.67c0.06 -0.15 1.00 -1.88 0.66 -2.09c-0.90 -0.55 -2.52 -0.51 -1.58 -1.95c-0.53 0.00 -0.46 -0.70 0.53 -0.70c0.71 0.00 1.34 -0.10 1.84 -0.28c0.86 -0.31 0.39 -2.27 1.98 -2.51c1.09 -0.16 1.47 -0.61 1.71 -1.39c0.34 -1.08 1.50 -0.36 1.98 -1.11c0.38 -0.60 0.23 -0.66 1.05 -0.97c0.84 -0.32 0.48 0.20 1.32 0.28c1.27 -0.36 2.99 -0.38 3.95 -1.39c0.03 -0.04 0.00 -1.19 0.00 -1.25c0.00 -1.50 -0.05 -0.93 -1.19 -1.53c-0.42 -0.22 0.22 -0.96 0.00 -1.39c-0.32 -0.64 -0.20 -1.46 0.26 -1.95c0.39 -0.42 0.48 -1.66 0.53 -2.37c0.00 -1.30 -0.40 -1.70 -0.40 -2.93c0.00 -0.85 -0.65 -0.95 -1.32 -1.39c-0.93 -0.62 -0.64 -0.49 -0.92 -1.25c-0.16 -0.43 -0.28 -0.16 -0.66 -0.42c-0.97 -0.67 -0.01 -0.56 -1.45 -0.56c-0.41 0.58 -1.51 1.06 -1.84 1.67c-0.22 0.39 -0.79 0.79 -0.79 0.84c-0.09 1.39 -0.60 2.14 -0.13 3.20c0.22 0.51 0.62 0.47 0.79 0.98c0.10 0.30 -1.13 1.32 -1.45 1.53c-0.20 0.13 -1.18 -0.14 -1.32 0.00c-0.30 0.32 0.00 1.40 -0.13 1.81c-0.32 0.97 -0.28 -0.83 -0.66 1.25l-8.43 -0.14c-0.78 -2.47 0.93 -0.47 1.32 -2.23c0.38 -1.72 0.57 -3.02 1.45 -4.04c0.03 -0.03 0.36 -1.07 0.66 -1.25c0.58 -0.35 0.39 -2.14 0.66 -2.79c0.30 -0.72 0.71 -0.36 0.92 -1.11c0.40 -1.41 -0.53 -0.24 -0.53 -1.53c0.00 -1.35 -1.05 0.24 -1.05 -1.11c0.00 -1.96 0.00 -1.95 -1.58 -1.95l-3.95 0.00l-3.56 15.04l-1.32 -12.81c0.00 -0.57 0.26 -0.60 0.26 -1.25c0.00 -0.32 -0.13 -2.00 0.13 -2.09c0.65 -0.22 3.69 0.00 3.82 -0.14c0.84 -0.89 -0.67 -1.60 1.05 -2.23c0.40 -0.15 0.39 -0.28 -0.13 -0.28c-1.02 0.00 -0.66 -1.76 -0.66 -2.65l-6.32 -0.56c-1.20 -0.32 -2.63 1.54 -1.71 2.51c0.76 0.80 1.28 1.45 1.19 2.65c-0.02 0.29 -0.23 0.27 -0.26 0.56c-0.06 0.52 -0.17 0.04 -0.26 0.42c-0.09 0.37 0.53 0.55 0.79 0.70c0.26 0.28 0.21 3.41 0.13 4.04c-0.09 0.75 -1.58 0.46 -1.58 1.39c0.00 1.18 -0.21 1.09 -1.19 1.53c-1.59 0.73 -0.89 -0.60 -1.19 -1.39c-0.52 -1.37 -0.79 -0.89 -0.53 -2.37c0.00 -0.43 -0.36 -0.40 -0.66 -0.84c-0.09 -0.13 -0.12 -0.95 -0.13 -1.11c-0.04 -0.84 -0.81 -0.89 -1.58 -0.70c-0.87 0.22 -0.92 1.66 -0.92 2.79c0.00 1.78 -1.07 0.69 -1.71 1.53c-0.13 0.17 -0.14 0.61 -0.26 0.70c-0.06 0.04 -0.51 0.03 -0.88 0.02l0.04 -0.54c-0.00 -1.25 -0.01 -2.33 -0.01 -3.60l0.00 -2.48c0.00 -0.70 0.68 -0.57 1.11 -0.91c1.16 -0.94 -0.40 -4.94 0.74 -5.75c0.87 -0.61 1.06 -0.53 1.85 -0.91c1.00 -0.48 1.90 0.37 2.72 -0.78c0.00 -0.30 -0.12 -3.12 0.00 -3.26c0.77 -0.89 -1.61 -0.12 -1.61 -1.70c0.00 -0.76 0.12 -1.36 0.12 -2.22c0.00 -0.95 -1.11 -1.47 -1.11 -1.70c0.00 -2.95 -0.82 -4.44 2.59 -4.44c0.00 -1.52 -0.52 -2.49 0.49 -3.40c0.98 -0.88 -0.38 -4.72 1.11 -5.48c0.52 -0.27 1.10 -1.33 1.48 -1.83c1.25 -1.62 3.29 -0.72 4.32 -3.66c0.43 -1.22 2.84 -1.61 2.84 -3.00c0.00 -1.32 -0.62 -2.12 -0.62 -3.26c0.00 -0.81 0.12 -1.62 0.12 -2.35c0.00 -1.59 -0.99 -2.31 -0.99 -4.05c0.00 -1.14 0.37 -2.29 0.37 -3.53c1.41 -0.37 2.60 -0.57 2.96 -2.09c0.37 -1.53 0.08 -1.57 1.98 -1.57c0.80 0.00 3.46 -0.25 3.46 -1.31c0.00 -2.36 0.15 -1.90 0.86 -3.26c0.32 -0.61 0.30 -1.14 0.74 -1.57c0.13 -0.12 2.19 -0.67 2.59 -0.78c2.88 -0.82 0.68 -5.16 2.72 -5.88c1.01 0.92 2.75 0.92 3.83 1.70c0.69 0.50 1.95 1.14 2.72 1.31c0.68 0.15 0.88 -0.07 1.36 -0.26c1.34 -0.53 1.41 -0.60 1.48 -2.22c0.08 -1.92 6.20 0.62 7.29 1.31c1.85 1.65 0.42 2.22 3.09 2.22c1.43 0.00 1.27 -0.05 2.35 0.91c2.05 1.83 1.06 -0.99 1.61 -1.96c0.66 -1.17 3.83 -0.52 5.06 -1.31c0.82 -1.01 0.12 -3.21 0.12 -4.57c0.00 -1.20 -1.74 -4.05 -2.72 -4.05c-1.05 0.00 0.62 -1.38 0.62 -2.61c0.00 -1.40 -0.76 -6.73 -1.23 -6.79c-2.25 -0.27 -3.07 -2.46 -3.67 -4.24l1.21 -1.57l6.95 2.79l-0.24 -4.05l7.19 -0.51l11.02 3.55l4.07 5.82l1.68 -1.01l2.87 0.00l0.24 4.81l6.23 -1.27c0.00 1.82 1.40 2.31 2.40 1.27c0.64 -0.68 1.82 -0.56 3.11 -0.51c3.59 0.15 0.41 1.38 1.44 3.55c0.16 0.35 1.63 1.27 1.92 1.27c1.03 0.00 1.92 4.27 4.55 2.53c0.77 -0.51 3.62 0.64 5.27 1.23l-8.48 15.23l-1.69 0.00c-0.88 0.00 -0.89 -0.57 -2.12 -0.45c-1.09 0.10 -0.07 0.30 -0.42 0.90c-0.42 0.72 -0.85 0.17 -0.42 0.90c0.15 0.25 0.39 0.15 0.42 0.45c0.05 0.41 0.00 0.92 0.00 1.34c0.00 1.04 -0.33 1.97 0.42 2.24l-18.22 18.36c-2.54 -2.24 -1.97 -2.20 -2.12 -2.24c-2.99 -0.79 -0.47 0.32 -1.27 0.90c-0.78 0.56 -2.43 -0.61 -2.54 1.34c-0.08 1.32 -0.85 2.41 -0.85 3.73c-1.56 -0.04 -4.19 1.88 -6.35 1.57c-2.49 -1.85 -5.14 -4.43 -5.14 -1.81c0.00 0.62 -1.20 15.79 2.17 19.35c1.06 1.12 2.86 2.14 4.24 3.14c1.61 1.16 1.62 5.40 4.23 5.40c3.50 0.00 4.37 0.77 6.36 2.07c2.26 1.48 1.13 1.49 3.39 1.49c1.76 0.00 3.18 0.62 3.39 -1.34c0.05 -0.49 0.05 -2.05 0.42 -2.24c2.25 -1.15 0.25 -0.32 1.27 -0.90c3.26 -1.84 0.21 0.90 1.27 -0.90c0.15 -0.25 0.22 -0.24 0.42 -0.45c0.10 -0.11 0.64 -0.39 0.85 -0.45c0.72 -0.20 0.86 -0.45 1.69 -0.45c3.13 0.28 1.93 1.16 2.12 4.48c0.07 1.30 0.85 2.31 0.85 4.48c0.00 1.96 -2.12 1.79 -2.12 4.48c0.00 3.77 1.65 5.96 0.85 9.85c-0.26 1.27 -2.31 3.09 -2.97 4.48c-0.42 0.89 -1.24 3.51 -2.17 4.70z"},"MX-AG":{"name":"Aguascalientes","path":"m483.71 415.03c-0.36 0.13 -0.85 3.38 -1.05 4.18c-0.56 2.29 -1.01 2.40 -2.77 3.48l-7.64 4.74c-2.75 1.71 0.32 3.70 -5.01 2.65c-0.83 0.00 -0.97 -1.08 -1.19 -1.67c-0.10 -0.28 -2.22 -1.26 -2.77 -1.39c-0.74 -0.19 -0.39 -0.55 -0.79 -0.98c-0.67 -0.70 -2.65 0.63 -3.16 -0.84c-0.12 -0.33 0.19 -0.73 -0.26 -0.84c-0.07 -0.02 -0.91 0.35 -1.32 0.42c-1.14 0.19 -0.42 0.45 -0.69 1.16c-3.40 -0.82 -3.89 -2.09 -3.29 -6.94c0.20 -1.59 1.27 -0.96 1.27 -2.69c0.00 -1.24 1.12 -4.06 1.69 -4.48c0.92 -0.68 1.69 -0.79 1.69 -1.79c0.00 -5.42 -1.45 -5.38 5.51 -5.38c3.03 0.00 2.54 -0.43 2.54 -3.58c0.00 -1.42 2.35 -1.28 3.81 -1.79c0.48 1.53 2.00 1.67 2.97 2.69c1.51 1.60 0.92 2.30 3.39 2.69c0.80 0.13 1.12 1.79 2.12 1.79l0.42 0.00c1.09 0.00 -0.78 3.04 -0.42 4.03c0.41 1.13 1.17 0.55 1.27 1.34c0.04 0.30 -0.14 0.64 0.00 0.90c0.90 1.69 1.26 -0.55 1.69 -0.45c1.65 0.37 1.14 0.53 1.27 2.24l0.69 0.52z"},"MX-GT":{"name":"Guanajuato","path":"m477.39 476.46c0.00 -3.73 0.28 -4.41 1.59 -7.11c0.34 -0.70 0.58 -0.19 0.79 -0.56c1.31 -2.26 1.67 -1.30 0.13 -3.90c-0.19 -0.31 0.31 -1.30 0.13 -1.39c-2.31 -1.19 -2.77 1.16 -2.77 -1.95c1.75 0.00 1.60 -3.95 2.11 -5.15c0.94 -2.23 3.80 -3.74 5.40 -5.43c2.01 -2.12 3.08 -7.43 5.01 -8.50c2.73 -1.51 1.74 -3.45 3.16 -5.85c-1.78 -0.47 -0.39 -2.85 -0.39 -4.18c0.00 -1.52 0.47 -2.84 0.92 -4.18c0.23 -0.69 0.83 -1.05 0.92 -2.09c0.10 -1.11 0.31 -2.87 1.30 -3.38c3.91 1.07 9.08 0.44 13.49 1.01c3.65 0.47 10.64 6.73 12.97 9.68c2.28 2.87 10.41 -6.12 12.66 -6.92c1.74 0.43 3.33 0.48 3.56 2.56c0.32 2.97 4.46 3.76 6.54 4.66c0.94 0.41 1.73 0.45 2.99 0.45c1.33 0.00 1.79 0.45 2.96 0.47l1.19 6.71l1.12 -0.99c0.93 0.45 0.70 0.32 1.49 0.39c0.61 0.06 0.28 0.10 0.56 0.39c0.09 0.09 0.27 0.12 0.37 0.39c0.04 0.12 -0.07 0.28 0.00 0.39c0.07 0.11 0.17 0.07 0.19 0.20c0.01 0.07 -0.03 0.56 0.00 0.59c0.24 0.25 0.23 -0.25 0.37 0.20c-0.32 0.07 -2.45 0.28 -2.61 0.59c-0.54 1.08 -0.92 1.54 -1.86 2.36c-0.67 0.59 -0.54 0.59 -1.49 0.59c-0.50 0.00 -1.41 -0.18 -0.93 -0.99c0.42 -0.70 -0.13 -0.61 -0.93 -0.99c-2.26 -1.06 -1.13 1.05 -2.61 0.99c-1.31 -0.06 -1.33 0.06 -1.12 -0.99c0.12 -0.58 -1.45 0.03 -1.68 0.20l0.56 7.88c-2.07 0.00 -2.02 -0.23 -2.24 1.77c-0.07 0.66 -1.25 0.84 -1.30 0.39c-0.13 -1.08 -1.00 -0.02 -1.30 0.00c-0.91 0.06 -2.30 0.47 -1.86 -0.99c0.04 -0.13 0.20 -0.59 -0.37 -0.59c-2.50 0.00 -0.56 0.75 -0.93 2.17c-0.44 1.66 -2.46 1.18 -4.10 1.18c-1.34 0.00 -1.76 -1.27 -2.42 -1.97c-0.61 1.47 -1.58 3.62 -2.61 4.34c-1.54 1.07 -2.47 4.42 0.00 4.53c4.91 0.22 0.19 -0.30 0.19 2.96c0.00 0.74 1.26 0.34 1.86 0.39c0.52 0.04 0.43 3.87 0.75 4.73c0.26 0.72 -0.34 4.25 0.00 4.53c0.37 0.31 2.66 -0.10 3.35 0.00c0.35 0.05 0.16 0.82 0.19 1.18c0.02 0.27 0.75 1.61 1.39 2.72c-0.26 0.37 -0.41 0.93 -0.41 1.48c0.00 0.85 -0.75 1.74 -0.72 2.07c0.14 1.27 0.29 0.76 -0.72 1.41c-0.34 0.22 0.89 2.36 1.13 2.61c1.60 1.69 -1.30 1.12 -1.64 2.07c-0.33 0.92 0.38 0.69 -0.62 1.41c-0.25 0.18 -0.28 0.38 -0.62 0.44c-0.67 0.10 -1.50 0.01 -2.05 0.33c-0.18 -0.56 -2.49 -0.33 -3.08 -0.33c-0.76 0.00 -1.57 0.55 -2.26 0.65c-0.43 0.06 -0.15 0.38 -0.62 0.54c-0.76 0.26 -0.41 0.54 -1.33 0.54c-1.19 0.00 -2.13 -1.09 -3.08 -1.09c-1.70 0.00 -2.36 -0.10 -3.29 -1.31c-0.54 -0.71 -1.29 0.11 -1.75 -0.76c-0.68 -1.31 -0.38 -1.54 -0.82 -2.94c-0.62 -1.96 -2.96 -1.17 -4.72 -0.76c-0.71 0.00 -0.40 0.40 -0.82 0.87c-0.21 0.23 -0.59 0.66 -0.72 0.87c-0.11 0.19 -0.33 0.56 -0.41 0.76c-0.59 1.37 -2.57 1.43 -3.80 0.54c-0.11 -0.08 -1.30 -0.18 -1.44 -0.22c-0.42 -0.11 -0.82 -1.39 -0.82 -1.96c0.00 -1.70 -0.13 -0.70 -0.72 -1.52c-0.31 -0.43 -0.20 -0.99 -0.20 -1.52c0.00 -0.73 2.66 -0.41 1.23 -2.61c-0.48 -0.74 -1.52 -3.49 -1.85 -3.59c-2.05 -0.60 -7.63 1.00 -7.91 3.37c-0.16 1.36 -3.76 0.98 -5.13 0.98c-5.11 0.00 -1.58 -4.42 -5.03 -5.55c-1.14 -0.37 -1.65 -0.20 -2.45 -0.34z"},"MX-JA":{"name":"Jalisco","path":"m372.01 463.62c0.35 0.77 0.19 1.92 0.19 3.19c0.00 1.80 -0.32 3.06 -1.62 3.68c-1.85 0.88 -5.48 -0.19 -6.26 0.25c-1.45 0.81 -2.09 -0.69 -3.71 0.98c-1.06 1.09 -0.11 2.21 -2.09 2.21c0.88 5.89 1.43 8.18 3.94 13.49c0.54 1.13 2.15 7.10 2.55 7.36c5.97 3.85 10.40 5.78 12.30 11.29c2.72 7.87 9.10 10.25 15.43 12.82c0.16 -0.14 0.28 -0.22 0.34 -0.22c1.46 0.00 3.92 -1.71 5.01 -2.79c2.65 -2.62 7.74 -0.92 10.80 -2.37c3.38 -1.60 0.34 -3.95 3.43 -5.43c1.52 -0.40 1.00 0.48 2.11 0.70c1.43 0.28 1.50 -0.79 2.24 0.84c0.46 1.02 2.69 -0.02 3.43 0.84c0.25 0.29 0.00 1.09 0.26 1.25c1.28 0.80 2.30 -2.02 2.50 -2.65c0.63 -2.01 1.89 -0.31 3.43 -1.81c2.06 -0.73 1.14 3.80 2.90 4.04c1.07 0.15 0.61 1.59 1.32 1.67c0.34 0.04 1.85 -0.19 2.11 0.14c0.47 0.60 -1.00 0.39 -1.19 0.42c-0.88 0.15 -1.00 3.84 -0.66 4.60c0.17 0.39 0.91 0.21 0.53 1.39c-0.12 0.36 -1.85 0.46 -2.37 0.84c-0.09 0.07 1.19 3.16 1.19 4.46c0.00 1.81 1.05 0.29 1.05 1.81c0.00 0.39 0.04 0.46 0.13 0.97c0.01 -0.03 3.67 0.74 4.61 0.00c0.68 -0.54 1.12 -2.02 2.11 -1.39c1.61 1.03 0.84 0.49 1.71 0.14c1.46 -0.59 1.45 1.24 1.45 2.23c0.00 2.49 2.04 1.29 2.37 -0.42c0.41 -2.12 0.75 -2.14 2.50 -2.92c1.04 -0.47 1.16 -1.46 1.32 -2.65c0.18 -0.77 0.39 -1.37 0.79 -1.95c0.38 -0.54 3.20 0.17 3.82 -0.28c0.33 -0.24 0.43 -0.87 0.53 -1.39c1.30 -0.14 0.89 -0.98 2.50 -0.98c1.40 0.00 0.14 1.25 1.32 1.39c3.05 0.38 1.40 -0.50 2.24 -1.39c0.67 -0.71 0.67 -1.62 1.19 -2.92c0.39 -1.00 0.51 -1.06 0.92 -1.53c0.63 -0.72 0.55 -0.90 0.79 -1.81c0.20 -0.78 0.35 -1.06 0.53 -1.81c0.38 -0.13 0.26 -2.15 0.26 -2.65c0.00 -1.31 -1.79 -0.63 -2.77 -0.84c-2.79 -0.58 -0.92 3.01 -3.43 1.81c-0.55 -0.26 0.07 -1.62 -0.53 -1.81c-1.73 -0.55 -0.34 -2.90 -1.71 -3.20c-1.34 -0.29 -1.26 -0.09 -1.05 -1.53c0.18 -1.25 0.35 -2.84 0.13 -4.32c-0.53 -0.19 0.23 -0.53 0.26 -0.56c0.30 -0.22 0.96 -0.16 1.45 -0.28c0.98 -0.23 1.84 0.01 1.84 -1.25c0.00 -0.91 -0.27 -1.80 -0.66 -2.79c-0.77 -0.27 -1.86 -0.42 -2.90 -0.42c-1.38 0.00 -2.06 -1.77 -3.43 -1.39c-0.49 0.14 -1.92 0.20 -2.11 0.70c-0.11 0.28 -0.00 1.22 -0.53 1.25c-1.87 0.13 0.11 -1.26 -2.11 -1.11c-0.53 0.03 0.04 0.99 -0.66 -0.28l3.03 -7.66c1.07 -0.85 0.15 -1.11 2.24 -1.11c1.02 0.00 1.39 -0.42 1.84 -0.42c0.86 0.00 0.37 0.48 0.79 0.70c1.56 0.79 2.23 1.42 4.08 1.25c1.05 -0.09 0.83 -0.91 1.32 -1.67c0.18 -0.28 0.99 -0.37 1.05 -0.56c0.18 -0.49 0.09 -0.84 0.79 -0.84l1.45 0.00c0.19 -0.62 0.85 -0.99 0.92 -2.09c0.06 -0.86 1.62 -1.91 2.11 -2.23c0.39 -0.25 0.25 0.61 0.40 0.84c0.50 0.77 2.68 0.10 3.16 0.00c0.31 -0.06 4.11 -0.75 4.22 -0.70c0.16 0.08 -0.27 1.34 0.26 1.39c1.03 0.10 2.28 -1.09 2.63 -1.81c0.43 -0.87 2.21 -0.01 3.03 0.14c0.00 -3.73 0.28 -4.41 1.58 -7.10c0.34 -0.70 0.58 -0.19 0.79 -0.56c1.31 -2.26 1.67 -1.30 0.13 -3.90c-0.19 -0.31 0.31 -1.30 0.13 -1.39c-2.31 -1.19 -2.77 1.16 -2.77 -1.95c1.75 0.00 1.60 -3.95 2.11 -5.15c0.94 -2.23 3.80 -3.74 5.40 -5.43c2.01 -2.12 3.08 -7.43 5.01 -8.50c2.73 -1.51 1.74 -3.45 3.16 -5.85c-1.78 -0.47 -0.39 -2.85 -0.39 -4.18c0.00 -1.52 0.47 -2.84 0.92 -4.18c0.23 -0.69 0.83 -1.05 0.92 -2.09c0.10 -1.11 0.31 -2.87 1.32 -3.34l-8.17 -7.80l-3.82 0.00c-0.36 0.13 -0.86 3.38 -1.05 4.18c-0.56 2.29 -1.01 2.40 -2.77 3.48l-7.64 4.74c-2.75 1.71 0.32 3.70 -5.01 2.65c-0.83 0.00 -0.97 -1.08 -1.19 -1.67c-0.10 -0.28 -2.22 -1.26 -2.77 -1.39c-0.74 -0.19 -0.39 -0.55 -0.79 -0.98c-0.67 -0.70 -2.65 0.63 -3.16 -0.84c-0.12 -0.33 0.19 -0.73 -0.26 -0.84c-0.07 -0.02 -0.91 0.35 -1.32 0.42c-1.14 0.19 -0.42 0.45 -0.66 1.11c-0.18 0.51 -1.98 0.14 -2.50 0.14c0.16 0.68 0.23 1.80 0.26 2.37c0.04 0.61 -0.26 0.85 -0.26 1.53c0.00 1.30 1.15 1.35 1.71 2.09c0.30 0.39 0.66 1.23 1.32 0.84c0.42 -0.25 0.47 -0.01 1.05 0.42l0.13 6.41c-1.82 0.00 -2.31 0.70 -3.69 0.70c-0.29 0.00 -1.25 1.50 -1.71 1.81c-1.03 0.68 -1.90 -0.89 -2.11 1.25c-0.06 0.65 -0.00 2.43 -1.05 1.67c-0.44 -0.32 0.65 -1.11 -0.66 -1.11c-1.47 0.00 -2.76 -0.02 -4.22 -0.28l0.26 6.96l-5.27 0.70c-0.46 0.12 -0.03 0.26 -0.66 0.42c-0.42 0.10 -0.80 0.13 -1.19 0.28c-0.19 0.07 -1.14 0.48 -1.19 0.56c-0.23 0.39 -0.14 0.28 -0.79 0.28c-0.44 0.00 -0.59 0.11 -0.79 -0.28c-0.33 -0.63 -0.59 -0.58 -0.92 -0.97c-0.17 -0.21 -0.27 -0.97 -0.39 -1.25c-0.32 -0.75 -0.43 -1.23 -0.79 -2.09c0.00 -0.94 -2.11 -1.08 -2.90 -0.97c-0.63 0.09 -0.14 1.11 -1.19 1.39c-0.22 0.06 -1.03 0.67 -1.19 0.14c-0.22 -0.75 -0.13 -1.58 -0.13 -2.37c0.00 -1.84 0.13 -1.80 -1.45 -1.11c-1.84 0.80 0.13 -1.95 -0.92 -2.65c-0.27 -0.18 -0.76 -0.87 -0.92 -1.25c-0.26 -0.63 -0.24 -0.88 -0.92 -0.98c-0.67 -0.09 -0.48 0.01 -0.53 -0.97c0.00 -1.28 -0.23 -2.37 1.19 -2.37c1.47 0.00 -0.25 1.11 1.71 1.11c0.90 0.00 1.05 0.17 1.58 -0.42c0.91 -1.00 1.45 0.75 1.45 -1.67c0.00 -0.92 -1.59 0.13 -2.24 -0.14c-0.32 -0.13 -1.38 -1.35 -1.98 -0.56c-0.16 0.20 -0.37 0.67 -0.53 0.84c-0.08 0.08 -0.53 0.04 -0.53 -0.14c0.00 -0.39 1.02 -0.29 0.53 -1.11c-0.60 -1.01 0.37 -1.74 0.92 -1.81c0.49 -0.06 0.56 -1.19 0.66 -1.67c1.25 -0.44 2.10 -0.70 3.43 -0.70c0.41 0.00 0.80 -0.99 1.05 -1.53c0.18 -0.38 -0.17 -1.28 0.00 -1.67c0.06 -0.15 1.00 -1.88 0.66 -2.09c-0.90 -0.55 -2.52 -0.51 -1.58 -1.95c-0.53 0.00 -0.46 -0.70 0.53 -0.70c0.71 0.00 1.34 -0.10 1.84 -0.28c0.86 -0.31 0.39 -2.27 1.98 -2.51c1.09 -0.16 1.47 -0.61 1.71 -1.39c0.34 -1.08 1.50 -0.36 1.98 -1.11c0.38 -0.60 0.23 -0.66 1.05 -0.97c0.84 -0.32 0.48 0.20 1.32 0.28c1.27 -0.36 2.99 -0.38 3.95 -1.39c0.03 -0.04 0.00 -1.19 0.00 -1.25c0.00 -1.50 -0.05 -0.93 -1.19 -1.53c-0.42 -0.22 0.22 -0.96 0.00 -1.39c-0.32 -0.64 -0.20 -1.46 0.26 -1.95c0.39 -0.42 0.48 -1.66 0.53 -2.37c0.00 -1.30 -0.40 -1.70 -0.40 -2.93c0.00 -0.85 -0.65 -0.95 -1.32 -1.39c-0.93 -0.62 -0.64 -0.49 -0.92 -1.25c-0.16 -0.43 -0.28 -0.16 -0.66 -0.42c-0.97 -0.67 -0.01 -0.56 -1.45 -0.56c-0.41 0.58 -1.51 1.06 -1.84 1.67c-0.22 0.39 -0.79 0.79 -0.79 0.84c-0.09 1.39 -0.60 2.14 -0.13 3.20c0.22 0.51 0.62 0.47 0.79 0.98c0.10 0.30 -1.13 1.32 -1.45 1.53c-0.20 0.13 -1.18 -0.14 -1.32 0.00c-0.30 0.32 0.00 1.40 -0.13 1.81c-0.32 0.97 -0.28 -0.83 -0.66 1.25l-8.43 -0.14c-0.78 -2.47 0.93 -0.47 1.32 -2.23c0.38 -1.72 0.57 -3.02 1.45 -4.04c0.03 -0.03 0.36 -1.07 0.66 -1.25c0.58 -0.35 0.39 -2.14 0.66 -2.79c0.30 -0.72 0.71 -0.36 0.92 -1.11c0.40 -1.41 -0.53 -0.24 -0.53 -1.53c0.00 -1.35 -1.05 0.24 -1.05 -1.11c0.00 -1.96 0.00 -1.95 -1.58 -1.95l-3.95 0.00l-3.56 15.04l-1.32 -12.81c0.00 -0.57 0.26 -0.60 0.26 -1.25c0.00 -0.32 -0.13 -2.00 0.13 -2.09c0.65 -0.22 3.69 0.00 3.82 -0.14c0.84 -0.89 -0.67 -1.60 1.05 -2.23c0.40 -0.15 0.39 -0.28 -0.13 -0.28c-1.02 0.00 -0.66 -1.76 -0.66 -2.65l-6.32 -0.56c-1.20 -0.32 -2.63 1.54 -1.71 2.51c0.76 0.80 1.28 1.45 1.19 2.65c-0.02 0.29 -0.23 0.27 -0.26 0.56c-0.06 0.52 -0.17 0.04 -0.26 0.42c-0.09 0.37 0.53 0.55 0.79 0.70c0.26 0.28 0.21 3.41 0.13 4.04c-0.09 0.75 -1.58 0.46 -1.58 1.39c0.00 1.18 -0.21 1.09 -1.19 1.53c-1.59 0.73 -0.89 -0.60 -1.19 -1.39c-0.52 -1.37 -0.79 -0.89 -0.53 -2.37c0.00 -0.43 -0.36 -0.40 -0.66 -0.84c-0.09 -0.13 -0.12 -0.95 -0.13 -1.11c-0.04 -0.84 -0.81 -0.89 -1.58 -0.70c-0.87 0.22 -0.92 1.66 -0.92 2.79c0.00 1.78 -1.07 0.69 -1.71 1.53c-0.13 0.17 -0.14 0.61 -0.26 0.70c-0.06 0.04 -0.56 0.03 -0.90 0.00c-0.04 0.92 -0.18 2.45 -0.36 3.06c-0.04 0.15 -0.79 0.23 -0.84 0.67c-0.16 1.30 0.09 1.47 -0.63 2.45c-0.34 0.47 -0.21 1.17 -0.21 1.79c0.00 1.14 -1.27 0.38 -1.27 2.01c0.00 1.45 0.13 3.38 -0.21 4.46c2.08 1.01 2.37 -0.34 4.22 -0.22c0.08 0.00 1.58 0.34 2.11 0.45c1.10 0.21 1.81 2.75 0.84 3.57c-1.05 0.89 -0.56 4.83 1.90 3.57c0.76 -0.39 1.78 -0.25 2.74 0.45c0.85 0.62 0.25 1.56 1.90 1.56c0.38 1.99 -0.07 1.15 1.06 2.01c0.94 0.72 -0.51 5.93 0.21 6.69c0.03 0.03 0.56 -0.01 0.63 0.00c0.17 0.02 0.26 0.19 0.42 0.22c4.61 0.89 1.69 2.76 1.69 6.03c0.00 2.02 -0.01 3.16 -1.27 4.24c-1.21 1.04 -1.95 -1.69 -3.38 -0.89c-0.09 0.05 -0.21 0.42 -0.21 0.67c0.00 1.42 -0.84 1.10 -1.06 2.45c-0.72 -0.18 -1.01 -0.22 -1.69 -0.22c-0.34 0.00 -0.72 0.03 -1.06 0.00c-0.77 -0.07 -0.15 0.07 -0.63 -0.45c-0.12 -0.13 -0.25 -0.20 -0.42 -0.22c-0.59 -0.07 -0.23 0.18 -0.63 0.22c-0.74 0.08 -1.57 0.00 -2.32 0.00l0.00 8.93l-3.59 3.79l2.53 3.35l0.42 6.25c-0.66 -1.16 -0.39 -1.45 -0.63 -2.68c-0.29 -1.45 -2.04 -0.70 -2.74 -2.01c-0.32 -0.59 -0.77 -2.14 -1.27 -2.90c-0.80 -1.23 -6.17 -2.55 -6.33 -4.02c-0.20 -1.87 -1.23 -1.79 -2.95 -1.79c-0.40 0.00 -0.74 -1.59 -0.84 -2.01c-1.86 -0.87 -6.86 -1.86 -7.39 0.89c-0.56 2.92 -3.02 0.58 -4.43 1.79c-1.12 0.96 -2.24 0.90 -2.95 2.23c-0.79 1.49 -3.62 1.61 -4.01 3.35c-0.29 1.29 -0.36 2.01 -0.82 2.77z"},"MX-MC":{"name":"Michoacán","path":"m432.23 527.72c-0.00 0.25 -0.02 0.49 -0.13 0.67c-0.43 0.73 -0.84 0.63 -1.25 1.76c-0.31 0.84 -1.37 0.24 -1.88 0.66c-1.99 1.69 -6.25 1.40 -6.46 4.85c-0.10 1.58 -0.41 0.26 -1.04 1.32c-0.11 0.19 -0.22 0.45 -0.31 0.75c4.05 2.80 3.85 10.50 8.35 13.22c7.44 4.49 16.83 7.01 26.22 9.81c4.70 1.40 13.36 7.25 16.94 7.61c0.83 0.08 1.93 -0.87 3.55 -1.76c-0.07 -0.12 -0.16 -0.22 -0.28 -0.31c-1.12 -0.86 -0.87 -0.68 -1.75 -1.96c-0.84 -1.22 -0.36 -3.65 0.10 -5.11c0.54 -1.70 2.12 -1.20 3.59 -1.20c0.67 0.00 2.37 -2.42 3.49 -2.72c0.58 -0.15 4.52 0.42 4.52 -0.98c0.00 -0.57 -0.87 -1.33 -1.23 -1.63c-0.54 -0.46 -0.51 -1.70 -0.51 -2.50c0.00 -1.54 -0.41 -3.37 -0.41 -4.68c0.00 -0.65 0.46 -0.85 0.62 -1.41c0.21 -0.76 0.13 -1.80 0.00 -2.61c-0.13 0.00 1.61 0.31 2.16 0.33c0.75 0.02 1.51 0.03 2.26 0.00c0.65 -0.02 1.44 -0.96 1.75 -0.76c0.92 0.61 1.90 1.24 3.18 1.52c0.00 1.06 1.45 2.83 2.57 2.83c1.00 0.00 4.44 -0.03 4.83 -0.87c0.59 -1.28 9.46 -1.19 10.99 -1.09c0.18 0.48 1.55 3.20 1.64 3.26c0.74 0.49 2.41 -0.32 3.29 -0.44c0.34 -0.05 0.68 -0.76 1.44 -0.76c2.11 0.00 1.85 0.04 2.46 1.63c0.74 1.91 2.47 1.93 4.21 3.15c0.85 0.00 0.71 -4.18 0.51 -4.35c-1.05 -0.89 -1.19 -0.40 -2.57 -1.30c-1.83 -1.20 -1.95 -1.15 -1.95 -3.26c0.00 -1.46 -0.82 -1.20 -1.13 -2.39c-0.10 -0.40 0.71 -2.25 0.28 -2.51c-1.68 -0.51 -2.41 -3.99 0.12 -3.79c0.61 0.05 2.20 1.17 2.68 0.44c0.65 -0.98 -0.35 -1.20 1.23 -1.20c1.27 0.00 0.03 -1.40 1.65 -1.63l6.98 -8.70c3.69 -1.30 2.05 -4.08 2.05 -7.18c0.00 -0.75 2.98 -4.13 4.11 -4.24c2.18 -0.22 1.13 -4.13 0.72 -4.02c-1.85 0.47 -0.76 0.17 -1.33 -1.41c-0.49 -1.35 -2.66 -0.58 -1.54 -2.83c0.65 -1.31 0.09 -1.52 2.05 -1.52c1.99 0.00 2.05 -1.01 2.05 -2.94c0.00 -1.93 2.16 -1.34 2.16 -3.70c-0.28 -1.18 -2.12 -1.36 -2.26 -2.50c-0.03 -0.28 -0.41 -2.70 -0.20 -2.94c0.09 -0.10 0.92 -2.16 0.92 -2.17c0.08 -1.22 -1.24 -0.31 -1.34 -1.41c-0.03 -0.39 -1.34 -0.42 -1.54 -0.54c-0.06 -0.04 -0.39 -1.03 -0.62 -1.20c-0.56 -0.41 -1.60 -0.49 -2.16 -1.09c-0.50 -0.52 -0.76 -1.62 -1.13 -2.50c-0.80 0.12 -1.23 1.10 -1.23 2.07c0.00 0.85 -0.75 1.74 -0.72 2.07c0.14 1.27 0.29 0.76 -0.72 1.41c-0.34 0.22 0.89 2.36 1.13 2.61c1.60 1.69 -1.30 1.12 -1.64 2.07c-0.33 0.92 0.38 0.69 -0.62 1.41c-0.25 0.18 -0.28 0.38 -0.62 0.44c-0.67 0.10 -1.50 0.01 -2.05 0.33c-0.18 -0.56 -2.49 -0.33 -3.08 -0.33c-0.76 0.00 -1.57 0.55 -2.26 0.65c-0.43 0.06 -0.15 0.38 -0.62 0.54c-0.76 0.26 -0.41 0.54 -1.33 0.54c-1.19 0.00 -2.13 -1.09 -3.08 -1.09c-1.70 0.00 -2.36 -0.10 -3.29 -1.31c-0.54 -0.71 -1.29 0.11 -1.75 -0.76c-0.68 -1.31 -0.38 -1.54 -0.82 -2.94c-0.62 -1.96 -2.96 -1.17 -4.72 -0.76c-0.71 0.00 -0.40 0.40 -0.82 0.87c-0.21 0.23 -0.59 0.66 -0.72 0.87c-0.11 0.19 -0.33 0.56 -0.41 0.76c-0.59 1.37 -2.57 1.43 -3.80 0.54c-0.11 -0.08 -1.30 -0.18 -1.44 -0.22c-0.42 -0.11 -0.82 -1.39 -0.82 -1.96c0.00 -1.70 -0.13 -0.70 -0.72 -1.52c-0.31 -0.43 -0.20 -0.99 -0.20 -1.52c0.00 -0.73 2.66 -0.41 1.23 -2.61c-0.48 -0.74 -1.52 -3.49 -1.85 -3.59c-2.05 -0.60 -7.63 1.00 -7.91 3.37c-0.16 1.36 -3.76 0.98 -5.13 0.98c-5.11 0.00 -1.58 -4.42 -5.03 -5.55c-1.14 -0.37 -1.65 -0.20 -2.45 -0.34c-0.81 -0.15 -2.59 -1.01 -3.03 -0.14c-0.36 0.72 -1.60 1.91 -2.63 1.81c-0.54 -0.05 -0.10 -1.31 -0.26 -1.39c-0.10 -0.05 -3.90 0.63 -4.22 0.70c-0.48 0.10 -2.66 0.77 -3.16 0.00c-0.15 -0.22 -0.01 -1.09 -0.40 -0.84c-0.49 0.32 -2.05 1.37 -2.11 2.23c-0.07 1.10 -0.73 1.47 -0.92 2.09l-1.45 0.00c-0.70 0.00 -0.61 0.35 -0.79 0.84c-0.07 0.18 -0.87 0.28 -1.05 0.56c-0.49 0.76 -0.27 1.58 -1.32 1.67c-1.85 0.16 -2.52 -0.47 -4.08 -1.25c-0.42 -0.21 0.07 -0.70 -0.79 -0.70c-0.45 0.00 -0.82 0.42 -1.84 0.42c-2.08 0.00 -1.17 0.26 -2.24 1.11l-3.03 7.66c0.70 1.26 0.13 0.31 0.66 0.28c2.21 -0.14 0.23 1.24 2.11 1.11c0.52 -0.04 0.42 -0.97 0.53 -1.25c0.18 -0.49 1.61 -0.56 2.11 -0.70c1.37 -0.38 2.04 1.39 3.43 1.39c1.04 0.00 2.12 0.15 2.90 0.42c0.39 0.99 0.66 1.88 0.66 2.79c0.00 1.27 -0.86 1.02 -1.84 1.25c-0.49 0.11 -1.15 0.06 -1.45 0.28c-0.03 0.02 -0.79 0.37 -0.26 0.56c0.22 1.48 0.04 3.07 -0.13 4.32c-0.20 1.44 -0.29 1.24 1.05 1.53c1.38 0.30 -0.02 2.66 1.71 3.20c0.59 0.19 -0.02 1.55 0.53 1.81c2.50 1.20 0.64 -2.39 3.43 -1.81c0.98 0.20 2.77 -0.48 2.77 0.84c0.00 0.49 0.12 2.51 -0.26 2.65c-0.18 0.76 -0.33 1.04 -0.53 1.81c-0.24 0.91 -0.16 1.09 -0.79 1.81c-0.41 0.48 -0.53 0.54 -0.92 1.53c-0.52 1.30 -0.52 2.22 -1.19 2.92c-0.84 0.89 0.81 1.78 -2.24 1.39c-1.17 -0.15 0.08 -1.39 -1.32 -1.39c-1.61 0.00 -1.21 0.84 -2.50 0.98c-0.09 0.52 -0.20 1.16 -0.53 1.39c-0.62 0.45 -3.44 -0.26 -3.82 0.28c-0.40 0.58 -0.61 1.18 -0.79 1.95c-0.15 1.18 -0.28 2.18 -1.32 2.65c-1.76 0.78 -2.09 0.80 -2.50 2.92c-0.33 1.71 -2.37 2.91 -2.37 0.42c0.00 -0.99 0.01 -2.82 -1.45 -2.23c-0.87 0.35 -0.10 0.89 -1.71 -0.14c-0.99 -0.63 -1.43 0.86 -2.11 1.39c-0.64 0.50 -2.51 0.31 -3.66 0.15z"},"MX-CL":{"name":"Colima","path":"m188.77 507.84c-0.74 0.36 -1.43 0.81 -2.23 0.94c-0.44 0.07 -0.95 0.23 -1.34 0.00c-0.48 -0.29 -0.13 -0.66 0.45 -1.41c0.08 -0.10 0.37 -1.28 0.45 -1.42c0.13 -0.22 1.13 -1.30 1.34 -1.41c0.27 -0.14 0.60 -0.04 0.89 0.00c0.74 0.10 0.45 0.15 0.45 0.94c0.00 1.23 0.18 2.17 0.00 2.36l0.00 0.00zm-4.46 20.28c-0.74 0.18 -1.47 0.42 -2.23 0.47c-1.30 0.09 -1.34 0.27 -1.34 -0.94c0.00 -0.89 0.38 -1.89 -0.45 -1.89l-1.34 0.00l0.00 -0.47l-0.45 0.00l0.00 -0.47l0.00 -0.47l0.45 0.00l0.00 -0.47l0.45 0.00l0.45 0.00l0.00 -0.47l0.45 0.00c0.42 0.00 0.65 -0.58 0.89 -0.94c0.48 -0.73 0.58 -0.47 1.78 -0.47c0.75 0.00 0.80 -0.31 0.89 0.47c0.11 0.94 -0.77 3.30 0.00 3.30l0.45 0.00l0.00 0.47c0.00 0.93 0.22 0.65 0.00 1.89l0.00 0.00zm-37.03 -9.43c-1.61 -1.42 -2.01 -1.01 -1.78 -2.83c0.08 -0.63 -0.27 -0.47 0.45 -0.94c0.25 -0.17 0.68 -0.22 0.89 0.00l0.45 0.47l0.45 0.00c0.30 0.00 0.00 0.63 0.00 0.94c0.00 0.94 0.09 0.67 -0.45 2.36zm-89.67 13.21c1.76 -1.55 1.87 -0.75 1.78 -2.36c-0.04 -0.69 -0.00 -3.77 -0.89 -2.83l-0.45 0.47c-0.25 0.27 -0.36 0.58 -0.45 0.94c-0.21 0.87 -0.50 0.36 -1.34 0.47c-0.21 0.03 -0.80 0.37 -0.89 0.47c-0.03 0.03 -0.41 0.91 -0.45 0.94l0.00 0.00l0.00 0.47l0.45 0.00l0.45 0.47c0.72 0.76 0.52 0.47 1.78 0.94l0.00 0.00zm335.13 -13.02c0.16 -0.14 0.27 -0.22 0.34 -0.22c1.46 0.00 3.92 -1.71 5.01 -2.79c2.65 -2.62 7.74 -0.92 10.80 -2.37c3.38 -1.60 0.34 -3.95 3.43 -5.43c1.52 -0.40 1.00 0.48 2.11 0.70c1.43 0.28 1.50 -0.79 2.24 0.84c0.46 1.02 2.69 -0.02 3.43 0.84c0.25 0.29 0.00 1.09 0.26 1.25c1.28 0.80 2.30 -2.02 2.50 -2.65c0.63 -2.01 1.89 -0.31 3.43 -1.81c2.06 -0.73 1.14 3.80 2.90 4.04c1.07 0.15 0.61 1.59 1.32 1.67c0.34 0.04 1.85 -0.19 2.11 0.14c0.47 0.60 -1.00 0.39 -1.19 0.42c-0.88 0.15 -1.00 3.84 -0.66 4.60c0.17 0.39 0.91 0.21 0.53 1.39c-0.12 0.36 -1.85 0.46 -2.37 0.84c-0.09 0.07 1.19 3.16 1.19 4.46c0.00 1.81 1.05 0.29 1.05 1.81c0.00 0.39 0.04 0.48 0.13 0.97c0.00 0.01 0.39 0.06 0.95 0.15c0.00 0.26 -0.02 0.49 -0.13 0.67c-0.43 0.73 -0.84 0.63 -1.25 1.76c-0.31 0.84 -1.37 0.24 -1.88 0.66c-1.99 1.69 -6.25 1.40 -6.46 4.85c-0.10 1.58 -0.41 0.26 -1.04 1.32c-0.11 0.19 -0.22 0.45 -0.31 0.75c-0.48 -0.33 -1.01 -0.59 -1.62 -0.77c-4.54 -1.32 -1.94 -3.90 -4.41 -5.89c-1.99 -1.60 -9.72 -1.52 -9.98 -3.93c-3.11 -4.38 -7.74 -6.38 -12.41 -8.28z"},"MX-QR":{"name":"Quintana Roo","path":"m901.70 552.05c0.37 -0.03 4.65 -0.30 5.02 -0.33l-0.75 -6.37c0.03 0.00 2.24 -1.28 2.76 -1.46c1.48 -0.50 3.33 -0.27 4.89 -0.27c3.28 0.00 1.96 -1.72 4.01 -2.26c2.97 -0.79 4.03 -8.78 3.89 -11.95c-0.07 -1.67 2.10 -1.21 2.88 -2.79c1.97 -3.99 3.19 -3.13 6.26 -3.06c0.57 -1.71 4.13 -3.15 4.13 -3.80c0.00 -2.27 2.36 0.29 0.78 -3.83c-0.89 -2.32 2.76 -1.48 2.59 -3.55c-0.00 -0.03 -1.66 -3.55 -0.52 -3.55c2.12 0.00 5.15 4.95 3.10 7.11c-1.35 1.43 -2.26 3.51 -1.29 6.02c1.69 4.35 8.35 3.66 6.51 10.24l0.48 0.24c3.71 0.44 1.12 -3.77 2.08 -7.34c0.88 -3.27 0.78 -7.07 1.44 -10.48c0.29 -1.53 -0.75 -4.95 0.80 -5.58c1.82 -0.73 3.84 -14.08 3.84 -17.07c0.00 -2.72 -1.18 -1.46 -2.24 -0.34c-0.81 0.85 -2.75 1.78 -1.28 1.18c3.91 -1.57 -5.38 -1.46 -1.12 -2.53c1.09 -0.27 0.31 -2.71 1.92 -3.72c1.44 -0.90 5.10 -1.74 6.07 -3.38c0.49 -0.83 -0.59 -2.00 -0.32 -3.21c0.57 -2.54 -4.54 0.11 -4.63 0.17c-2.01 1.20 -0.77 0.37 -1.44 2.70c-0.37 1.31 -3.24 -0.34 -1.28 -1.69c1.23 -0.84 -0.81 -1.35 -1.76 -1.35c-0.99 0.00 0.52 -4.65 1.44 -5.41c0.94 -0.78 3.04 -0.23 3.04 -1.69c0.00 -2.21 2.24 -1.99 2.24 -5.24c0.00 -2.29 -1.60 -3.26 -1.60 -5.91c0.00 -10.59 6.28 -10.40 9.75 -19.43c1.22 -3.17 6.42 -5.51 6.55 -9.46c0.19 -5.57 3.80 -11.85 1.20 -16.31c-0.66 -1.13 -2.51 -3.75 -3.76 -6.33c-0.99 -2.04 -5.57 -5.41 -6.23 -5.41c-1.27 4.24 -6.20 5.49 -12.58 5.63l-0.26 9.05l-2.52 0.00l-0.31 6.33l7.55 -0.67l2.20 0.00l0.00 3.33l-6.61 0.00l-3.15 9.32l2.83 0.00l-0.31 6.99l-4.41 0.67l0.00 4.99l1.89 0.00l0.00 2.00l-5.35 -0.67l0.00 -2.33l-1.89 0.33l-3.78 3.66l0.63 3.00l-8.50 0.33l0.00 2.33l-6.61 0.00l0.00 3.66l-4.41 0.00l0.63 4.00l-19.16 21.88l4.68 5.43l-0.00 58.16zm72.88 -111.91c-0.07 1.20 -1.23 1.02 -2.20 1.10c-1.29 0.11 -1.64 1.10 -2.89 1.10c-0.75 0.00 -2.14 0.19 -3.13 0.25c-0.14 0.01 -0.07 2.15 -0.35 2.57c-0.46 0.69 -0.42 2.28 -0.35 3.31c0.13 1.69 2.13 2.86 2.20 3.68c0.22 2.52 1.84 0.76 2.31 -0.12c0.65 -1.22 0.34 -3.05 1.04 -3.80c1.00 -1.06 0.37 -1.39 1.97 -2.33c0.71 -0.42 0.71 -2.08 0.93 -2.82c0.24 -0.85 1.76 -1.23 0.46 -2.94l0.00 0.00zm-1.27 -25.01l-0.58 -0.25c-0.88 -0.31 -0.26 0.07 -0.46 -0.61c-0.05 -0.16 -0.16 -0.22 -0.23 -0.37c-0.15 -0.29 -0.26 -0.36 -0.35 -0.74c-0.04 -0.16 0.10 -0.36 0.00 -0.49c-0.27 -0.34 -0.34 0.19 -0.46 -0.24c-0.18 -0.63 -0.83 -0.04 -0.69 0.61c0.03 0.14 0.30 0.44 0.35 0.49c0.27 0.27 0.30 0.74 0.35 1.10c0.01 0.05 0.27 0.60 0.35 0.61c0.39 0.05 0.77 0.07 1.16 0.12c0.33 0.04 0.50 0.07 0.58 -0.25l0.00 0.00zm-3.01 -7.23l0.69 0.37c0.00 0.24 -0.03 1.06 -0.23 1.10c-0.15 0.03 -0.31 -0.01 -0.46 0.00c-0.69 0.03 -0.81 0.43 -0.81 -0.37c0.00 -0.60 0.06 -0.36 -0.23 -0.61c-0.06 -0.05 -0.06 -0.07 -0.12 -0.12c-0.32 -0.34 -0.12 -0.41 -0.12 -0.98l0.00 -0.86c0.00 -0.70 0.05 -0.50 0.46 -0.37c0.24 0.08 0.12 0.57 0.12 0.86c0.00 0.36 -0.01 0.53 0.23 0.74c0.14 0.12 0.22 0.24 0.46 0.24l0.00 0.00zm-21.68 0.18l0.03 -1.06c2.32 -0.13 4.33 -0.81 6.66 -1.42c1.36 -0.36 3.61 -1.91 4.26 -0.13l0.00 0.00c-2.21 0.45 -2.87 1.63 -4.76 1.99c-2.03 0.39 -4.06 0.56 -6.19 0.62z"},"MX-YU":{"name":"Yucatan","path":"m948.62 408.07l0.03 -1.06c-0.28 0.03 -0.57 0.04 -0.86 0.04c-0.76 0.00 -2.64 -0.28 -3.26 0.13c-1.39 0.92 0.12 0.93 1.50 0.93c0.88 0.00 1.74 -0.02 2.59 -0.04zm-51.59 80.40l19.16 -21.88l-0.63 -4.00l4.41 0.00l0.00 -3.66l6.61 0.00l0.00 -2.33l8.50 -0.33l-0.63 -3.00l3.78 -3.66l1.89 -0.33l0.00 2.33l5.35 0.67l0.00 -2.00l-1.89 0.00l0.00 -4.99l4.41 -0.67l0.31 -6.99l-2.83 0.00l3.15 -9.32l6.61 0.00l0.00 -3.33l-2.20 0.00l-7.55 0.67l0.31 -6.33l2.52 0.00l0.26 -9.05c-12.54 0.27 -30.70 -3.78 -37.64 2.12c-8.68 7.38 -17.35 7.75 -28.51 11.27c-13.33 4.21 -12.82 1.87 -21.58 11.13c-2.36 0.37 -4.03 2.80 -5.21 6.08l2.03 0.10l0.63 11.65l2.52 0.00l4.09 0.33l0.00 4.66l11.02 -0.67l0.63 6.33l1.57 0.00l2.83 3.66l1.57 -2.33l2.52 -0.67l0.63 11.32l11.37 13.22zm-20.76 -104.00c-0.11 0.45 -0.32 0.82 -0.72 0.93c-0.53 0.15 -0.61 -0.60 -0.72 -1.13c0.44 0.10 0.86 0.17 1.02 0.19c0.17 0.02 0.31 0.02 0.42 0.01zm-2.21 -0.39c-0.18 0.14 -0.45 0.28 -0.89 0.38c-0.72 0.17 -3.90 0.16 -4.16 -0.31c-0.25 -0.46 1.49 -2.13 0.30 -2.51c-0.30 -0.09 -1.04 -1.84 -0.89 -2.20c0.21 -0.50 1.01 -0.64 1.19 -0.94c0.15 -0.26 -0.05 -1.50 0.00 -1.88c0.07 -0.55 2.23 -1.74 2.97 -1.26c0.19 0.13 0.42 0.63 0.64 1.13c-0.40 -0.08 -1.13 0.07 -1.53 0.12c-0.53 0.06 -1.00 0.43 -1.19 0.94c-0.27 0.73 0.29 0.76 -0.30 1.26c-0.19 0.16 -0.24 0.38 -0.30 0.63c-0.15 0.60 -0.60 1.25 0.00 1.88c0.06 0.07 0.45 0.29 0.59 0.31c1.08 0.15 0.47 0.23 0.89 0.94c0.09 0.15 0.54 0.31 0.89 0.31c0.19 0.00 0.74 -0.06 0.89 0.00c0.37 0.15 0.01 0.65 0.30 0.94c0.07 0.07 0.30 0.16 0.59 0.24l0.00 0.00zm-0.59 -7.02l0.04 0.09c-0.05 -0.03 -0.06 -0.06 -0.04 -0.09zm1.51 0.89c0.37 0.08 0.71 0.15 0.86 0.23c0.71 0.39 1.74 -0.61 2.08 0.31c0.54 1.46 -0.74 1.29 -0.89 1.57c-0.66 1.23 0.51 1.46 -0.05 2.27l-0.84 -1.96c-0.08 -1.03 -0.02 -1.28 -0.59 -1.88c-0.17 -0.18 -0.36 -0.37 -0.56 -0.54l0.00 0.00z"}}});
/*
 * JV Map Component JS
 */

;(function(MXMAP, $, window, document, undefined) {
    var resizeTimer;
    
    $(document).ready(function($) {
        
        
        $(".jvmap-cmp").each(function() {
            var mapCmp = $(this),
                mapOpts = mapCmp.data("jvmaptype") ? mapCmp.data("jvmaptype").split("|") : null;
            
            if(mapOpts === null && mapCmp.closest(".jvmap-passport-agencies").length) {
                mapOpts = ["PassportStates", "us_territories"];
                mapCmp.empty();
            }
            
            if(mapOpts) {
                $.getJSON("/etc/designs/travel/TSGglobal_libs/jvmapdata/" + mapOpts[0] + ".json", function(data) {
                    
                    var args = {
                        backgroundColor: "#F1F1F1",
                        onRegionTipShow: function(e, tip, code){
                            if(code === 'PS'){
                                e.preventDefault();
                            }
                        },
                        series: {
                            regions: [{
                                values: {
                                    'PS': '#999999'
                                },
                                attribute: 'fill'
                            }]
                        },
                        regionStyle: {
                            initial: {
                                fill:"#7D9ED6", 
                                stroke: "#4A6BA3",
                                "stroke-width": 0.5,
                                "stroke-opacity": 1
                            },
                            hover: {
                                fill:"#4166A7"
                            }
                        }, 
                        zoomMax: 30,
                        zoomMin: 1.6,
                        onRegionClick: function(event, code){  
                            var countryIndex = $.map(data, function(d){return d["mc_name"];}).indexOf(code);
                            
                            if(countryIndex > -1){
                               var url = data[countryIndex].url,
                                countryCode = data[countryIndex].mc_name; 
                                if(code === countryCode) {
                                    window.location.href = url;
                                }
                            }
                        }, 
                        markerStyle:{
                            initial:{
                                fill: "#ffffff",
                                stroke: "#000000",
                                r: 4
                            }
                        }
                    },
                    isIe8 = $("html.ie8").length > 0;

                    if(mapOpts.length > 1) {
                        var mapFile = mapOpts[1] === "us_aea_en" ? "us_territories" : mapOpts[1];
                        args.map = mapFile;
                    }
                    
                    if(mapOpts[1] === "us_territories") {
                        args.focusOn = {
                            x: 0.5,
                            y: 0.5,
                            scale: 1.6
                        };
                        args.regionStyle = {
                            initial: {
                                fill:"#7D9ED6", 
                                stroke: "#4A6BA3",
                                "stroke-width": 1.5,
                                "stroke-opacity": 1
                            },
                            hover: {
                                fill:"#4166A7"
                            }
                        };
                    }
                    if(mapOpts[1] === "mexico") {
                        if(isIe8) {
                            args.regionStyle = {
                                initial: {
                                    fill:"#7D9ED6", 
                                    stroke: "#4A6BA3",
                                    "stroke-width": 1,
                                    "stroke-opacity": 1
                                },
                                hover: {
                                    fill:"#4166A7"
                                }
                            };
                            args.focusOn = {
                                x: 0,
                                y: 0,
                                scale: 0.95
                            };
                            args.zoomMin = 0.95;
                            args.markers = data.markers; 
                            args.onMarkerClick = function(event, index) {
                                event.preventDefault();
                            };
                            args.markerStyle = {
                                initial:{
                                    fill: "#ffffff",
                                    r: 4
                                },
                                hover:{
                                    cursor: 'default'
                                }
                            };
                            args.onRegionClick = function(event, code) {
                                MXMAP.mexicoAlertPopup(code);
                                console.log('code', code);
                            };
                        } else {
                        
                            args.focusOn = {
                                x: 0,
                                y: 0,
                                scale: 0.95
                            };

                            args.regionStyle = {
                                initial: {
                                    fill:"#7D9ED6", 
                                    stroke: "#4A6BA3",
                                    "stroke-width": 2.5,
                                    "stroke-opacity": 1
                                },
                                hover: {
                                    fill:"#4166A7"
                                }
                            };
                            args.zoomMin = 0.95;
                            args.markers = data.markers; 
                            args.onMarkerClick = function(event, index) {
                                event.preventDefault();
                            };
                            args.markerStyle = {
                                initial:{
                                    fill: "#ffffff",
                                    r: 4
                                },
                                hover:{
                                    cursor: 'default'
                                }
                            };
                            args.onRegionClick = function(event, code) {
                                MXMAP.mexicoAlertPopup(code);
                                console.log('code', code);
                            };
                        }
                    }
                    
                    if(mapOpts[1] === "world") {
                        if(isIe8) {
                            args.regionStyle = {
                                initial: {
                                    fill:"#7D9ED6", 
                                    stroke: "#4A6BA3",
                                    "stroke-width": 1,
                                    "stroke-opacity": 1
                                },
                                hover: {
                                    fill:"#4166A7"
                                }
                            };
                        }
                        
                        args.focusOn = {
                            x: 0.5,
                            y: 0,
                            scale: 1.6
                        };
                    }                    
                    
                    if(mapOpts[0] === "PassportStates") {
                        args.markers = data.markers;
                        args.onMarkerClick = function(event, index) {
                            window.open(data.markers[index].url);
                            var selectedVal = data.markers[index].value;
                            $("#select_agency option[value='" + selectedVal + "']").prop("selected", true);
                        };
                        args.onRegionClick = function(event, code) {
                            event.preventDefault();
                        };
                        args.backgroundColor = "#fff8aa";
                        $("#exp_agency_processing").click(function() {
                            var isIe8 = $("html.ie8").length > 0;
                            
                            if(isIe8) {
                                mapCmp.empty();
                                
                                setTimeout(function() {                                
                                    mapCmp.vectorMap(args); 
                                }, 500);
                            } else if(!$(".jvectormap-container").length) {
                                mapCmp.vectorMap(args); 
                            } else {
                                mapCmp.vectorMap("get", "mapObject").setFocus({
                                    x: 0.5,
                                    y: 0.5,
                                    scale: 1.6
                                });                               
                            }
                        });

                    } else {
                        mapCmp.vectorMap(args);
                    }
                    
                });
            }
            
        });
        
        // Resize Colorbox when resizing window or changing mobile device orientation
        jQuery(window).resize(resizeColorBox);
        jQuery(window).on("orientationchange", function(e) {
            resizeColorBox();
        });        
    });
    
    MXMAP.mexicoAlertPopup = function(code) {
        var warningForPopup = jQuery('.mexico-travel-warning div.' + code).html();

        jQuery.colorbox({
            inline: true,
            href: jQuery("#mexico_state_hook").html(),
            width: "90%",
            maxWidth: "90%",
            height: "90%",
            maxHeight: "90%",
            className: "mexico-warning-pop",
            onComplete: function() { 
                $(".cancel_btn, #cboxClose, #cboxOverlay").click(function(){
                    jQuery('#mexico_state_dialog div.warning').html("");
                    jQuery('#mexico_state_dialog div.consular').html("");
                    jQuery.colorbox.close();
                });
            }
        });        
        jQuery('#mexico_state_dialog div.warning').append(warningForPopup);
        jQuery('.expandos div.' + code).each(function(){
           var  consulate = jQuery(this).html();
           jQuery('#mexico_state_dialog div.consular').append(consulate);
        });
    };
    
    function resizeColorBox() {
        if (resizeTimer) clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            if (jQuery('#cboxOverlay').is(':visible')) {
                jQuery.colorbox.resize({width:'90%', height:'90%'});
            }
        }, 300);
    }   
    
}(window.MXMAP = window.MXMAP || {}, jQ183, window, document));

/*
 * Emergency Alert Component JS
 */





;(function($, window, document, undefined) {
    var emergencyAlert;
    
    $(document).ready(function() {
        
        emergencyAlert = $("#international_emergency");

        if(emergencyAlert.length) {            
            window.travelStateGov = window.travelStateGov || {};
            travelStateGov.internationEmergency = {
                drawerHeight: "380",
                open: false,
                getOpen: function() {
                    return this.open;
                },
                setOpen: function(bol_open) {
                    this.open = bol_open;
                    return this.open;
                },
                _openDrawer: function(){
                    $("#hidden_emergency_content").animate({height: this.drawerHeight + "px"});
                    this.setOpen(true);
                },
                _closeDrawer: function() {
                    $("#hidden_emergency_content").animate({height:"0px"}, function(){travelStateGov.internationEmergency._resetDrawer();});
                    this.setOpen(false);
                },
                _resetDrawer: function() {
                    $("#crisis_bar_events_wrapper li", "#international_emergency").removeClass("selected");
                    $("#crisis_slide_container").css("left", "0px");
                    $("#hidden_emergency_content").hide();
                },
                init: function() { 
                    var ulWidth = 0;
                    
                    $("#crisis_bar_events_wrapper > ul > li").each(function() {
                        ulWidth += $(this).width();
                    });
                    
                    $("#crisis_bar_events_wrapper > ul").css("width", ulWidth + "px");
                    
                    if(ulWidth > $("#crisis_bar_events_wrapper").width()) {
                        $("#internal_crisis_bar .next.control").addClass("show");
                        $("#crisis_bar #crisis_bar_events_wrapper").addClass("overflow");
                    }
                    
                    $('#crisis_bar_events_wrapper ul li').keydown(function (e) {
                       if (e.keyCode  === 13){
                        e.preventDefault();
                        $("#hidden_emergency_content").show();
                        $(this).addClass("selected").siblings().removeClass("selected");
                        //if(!($(this).parent().hasClass("selected"))) {
                            var crisisTabSelected = $(this).parent(),
                                crisisEventsWrapper = $("#crisis_bar_events_wrapper ul li"),
                                crissTabCurrent = $("#crisis_bar_events_wrapper ul li.selected"),
                                crisisTabCurrentIndex = crisisEventsWrapper.hasClass("selected") ? crissTabCurrent.index() : 0, 
                                crisisTabSelectedIndex = crisisTabSelected.index(),
                                crisisSlideContainer = $("#crisis_slide_container"),
                                crisisSlideWidth = $(".slides").width(),
                                crisisSlideNumberToSlide = crisisTabCurrentIndex - crisisTabSelectedIndex,
                                animateTo = crisisSlideWidth * crisisSlideNumberToSlide;

                            travelStateGov.internationEmergency._openDrawer();
                            crisisTabSelected.addClass("selected").siblings().removeClass("selected");
                            crisisSlideContainer.animate({left: "+=" + animateTo + "px" });
                            $(".crisis_close a").focus();
                        //}
                       }
                    });
                    $("#crisis_bar_events_wrapper ul li a").click(function(e) {
                        e.preventDefault();
                        $("#hidden_emergency_content").show();
                        if(!($(this).parent().hasClass("selected"))) {
                            var crisisTabSelected = $(this).parent(),
                                crisisEventsWrapper = $("#crisis_bar_events_wrapper ul li"),
                                crissTabCurrent = $("#crisis_bar_events_wrapper ul li.selected"),
                                crisisTabCurrentIndex = crisisEventsWrapper.hasClass("selected") ? crissTabCurrent.index() : 0, 
                                crisisTabSelectedIndex = crisisTabSelected.index(),
                                crisisSlideContainer = $("#crisis_slide_container"),
                                crisisSlideWidth = $(".slides").width(),
                                crisisSlideNumberToSlide = crisisTabCurrentIndex - crisisTabSelectedIndex,
                                animateTo = crisisSlideWidth * crisisSlideNumberToSlide;

                            travelStateGov.internationEmergency._openDrawer();
                            crisisTabSelected.addClass("selected").siblings().removeClass("selected");
                            crisisSlideContainer.animate({left: "+=" + animateTo + "px" });
                            $(".crisis_close a").focus();
                        }
                    });
                    
                    $("#internal_crisis_bar .control").click(function(e) {
                        var control = $(this),
                            controlNext = $("#internal_crisis_bar .control.next"),
                            controlPrev = $("#internal_crisis_bar .control.prev"),
                            ulElm = $("#crisis_bar_events_wrapper > ul"),
                            ulWidth = ulElm.width(),
                            ulOffsetLeft = ulElm.position().left,
                            parentWidth = ulElm.parent().width(),
                            nextOffset = ulWidth - parentWidth + ulOffsetLeft,
                            ulOffsetLeftAbs, animateTo;
                        
                        e.preventDefault();
                        
                        if(control.hasClass("prev")) {
                            ulOffsetLeftAbs = Math.abs(ulOffsetLeft);
                            animateTo = ulOffsetLeftAbs > parentWidth ? ulOffsetLeft + parentWidth : 0;
                            ulElm.filter(":not(:animated)").animate({left: animateTo + "px"}, 500);
                        } else {
                            animateTo = nextOffset > parentWidth ? ulOffsetLeft - parentWidth : ulOffsetLeft - nextOffset;
                            ulElm.filter(":not(:animated)").animate({left: animateTo + "px"}, 500);
                        }
                        
                        if(ulWidth === parentWidth - animateTo) {
                            controlNext.removeClass("show");
                        } else {
                            controlNext.addClass("show");
                        }
                        
                        if(animateTo === 0) {
                            controlPrev.removeClass("show");
                        } else {
                            controlPrev.addClass("show");
                        }
                        
                        console.log(ulWidth, ulOffsetLeft, parentWidth, nextOffset, animateTo);
                    });
                    
                    $("#international_emergency #hidden_emergency_content .control").click(function(e) {
                        var control = $(this),
                            crisisSlideContainer = $("#crisis_slide_container"),
                            crissTabCurrent = $("#crisis_bar_events_wrapper ul li.selected"),
                            crisisTabCurrentIndex = crissTabCurrent.index(),
                            crisisSlideWidth = $(".slides").width(),
                            crisisTabElms = $("#crisis_bar_events_wrapper ul li"),
                            crisisTabTotal = crisisTabElms.length,
                            crisisTabSelectedIndex, crisisSlideNumberToSlide, animateTo;
                        
                        e.preventDefault();
                        
                        if(control.hasClass("prev")) {
                            crisisTabSelectedIndex = crisisTabCurrentIndex === 0 ? crisisTabTotal - 1 : crisisTabCurrentIndex - 1;                         
                            crisisSlideNumberToSlide = crisisTabCurrentIndex - crisisTabSelectedIndex;
                        } else {
                            crisisTabSelectedIndex = crisisTabCurrentIndex + 1 === crisisTabTotal ? 0 : crisisTabCurrentIndex + 1;    
                            crisisSlideNumberToSlide = crisisTabCurrentIndex - crisisTabSelectedIndex;
                        }
                        
                        animateTo = crisisSlideWidth * crisisSlideNumberToSlide;
                        crisisTabElms.eq(crisisTabSelectedIndex).addClass("selected").siblings().removeClass("selected");
                        crisisSlideContainer.animate({left: "+=" + animateTo + "px" });
                    });

                    $(".crisis_close").click(function(e) {          
                        e.preventDefault();                       
                        travelStateGov.internationEmergency._closeDrawer();
                    });
                    $('#crisis_bar_events_wrapper ul li').focus(function(){

                        crisisTabElms = $(this);
                        crisisTabElms.css('background', '#cfcfcf');
                    }); 
                    
                    $('#crisis_bar_events_wrapper ul li').focusout(function(){

                        crisisTabElms = $(this);
                        crisisTabElms.removeAttr('style');
                    });
                    $('#crisis_bar_events_wrapper ul li').hover(function(){
                        
                        crisisTabElms = $(this);
                        crisisTabElms.css('background', '#cfcfcf');
                        },function() {
                            crisisTabElms.removeAttr('style');
                    });                               
                    $('crisis_close').keydown(function (e) {
                       if (e.keyCode  === 13){
                           $('.crisis_close').trigger('click');
                       }
                    });
                    
                    $(".summary", emergencyAlert).each(function() {
                        var summary = $(this),
                            textCount = summary.text().length,
                            MAX_CHARS = 280;
                            
                        if(textCount > MAX_CHARS) {
                            summary.html("");
                        }
                    });
                }   
            };
            travelStateGov.internationEmergency.init();
        }
    });    
}(jQuery, window, document));

jQuery(document).ready(function($) {
    $(".table-data tr:first").addClass("data-header");
    $(".data-header td").attr("scope","col");
    
    $(".highlightrows").closest("div").addClass("highlightrows");
    $(".altgrey").closest("div").addClass("altgrey");
    $(".altpink").closest("div").addClass("altpink");
    $(".altblue").closest("div").addClass("altblue");
    $(".headgreen").closest("div").addClass("headgreen");
    $(".headblue").closest("div").addClass("headblue");
    $(".headlight").closest("div").addClass("headlight");
    $(".headgold").closest("div").addClass("headgold");
    
    $("#searchTableData").keyup(function() {
        if(this.value.length > 0){
            var rows = $(".table-data table").find("tr:not(.data-header)").hide();
            var data = this.value.split(" ");
            $.each(data, function(i, v) {
                var c = v.toLowerCase().replace(/\b[a-z]/g, function(letter) {
                    return letter.toUpperCase();
                });
                var u = v.toUpperCase();
                rows.filter(":contains('" + v + "'),:contains('" + c + "'),:contains('" + u + "')").show();
            });
        }else{
            $(".table-data table").find("tr:not(.data-header)").show();
        }
    }); 
    
    $('.table-data th, .table-data .data-header td').each(function(col) {
        $(this).click(function() {
            if ($(this).is('.asc')) {
                $(this).removeClass('asc');
                $(this).addClass('desc selected');
                sortOrder = -1;
            } else {
                $(this).addClass('asc selected');
                $(this).removeClass('desc');
                sortOrder = 1;
            }
            $(this).siblings().removeClass('asc selected');
            $(this).siblings().removeClass('desc selected');
            var arrData = $('.table-data table').find('tbody > tr:not(.data-header):has(td)').get();

            arrData.sort(function(a, b) {
                var val1 = $(a).children('td').eq(col).text().toUpperCase();
                var val2 = $(b).children('td').eq(col).text().toUpperCase();
                if ($.isNumeric(val1) && $.isNumeric(val2))
                    return sortOrder == 1 ? val1 - val2 : val2 - val1;
                else
                    return (val1 < val2) ? -sortOrder : (val1 > val2) ? sortOrder : 0;
            });
            $.each(arrData, function(index, row) {
                $('.table-data tbody').append(row);
            });
        });
    });
    
    function exportTableToCSV($table, filename) {
    
        var $rows = $table.find('tr:has(td),tr:has(th)'),    
            // Temporary delimiter characters unlikely to be typed by keyboard
            // This is to avoid accidentally splitting the actual contents
            tmpColDelim = String.fromCharCode(11), // vertical tab character
            tmpRowDelim = String.fromCharCode(0), // null character
    
            // actual delimiter characters for CSV format
            colDelim = '","',
            rowDelim = '"\r\n"',
    
            // Grab text from table into CSV formatted string
            csv = '"' + $rows.map(function (i, row) {
                var $row = $(row), $cols = $row.find('td,th');
    
                return $cols.map(function (j, col) {
                    var $col = $(col), text = $col.text();
    
                    return text.replace(/"/g, '""'); // escape double quotes
    
                }).get().join(tmpColDelim);
    
            }).get().join(tmpRowDelim)
                .split(tmpRowDelim).join(rowDelim)
                .split(tmpColDelim).join(colDelim) + '"',
    
            // Data URI
            csvData = 'data:application/csv;charset=utf-8,' + encodeURIComponent(csv);            
        	if (window.navigator.msSaveBlob) { // IE 10+
        		//alert('IE' + csv);
        		window.navigator.msSaveOrOpenBlob(new Blob([csv], {type: "text/plain;charset=utf-8;"}), "csvname.csv")
        	} 
        	else {
        		$(this).attr({ 'download': filename, 'href': csvData, 'target': '_blank' }); 
        	}
    }
    
    $("#btnExport").click(function (e) {          
        if (window.navigator.msSaveBlob) { // IE 10+
            //alert('IE' + csv);
            exportTableToCSV.apply(this, [$('.table-data table'), 'export.csv']);
        } else {
            window.open('data:application/vnd.ms-excel,' + encodeURIComponent($('.table-data').html()));
            e.preventDefault();            
        }
    });
});
/*
 * Collapsible Flowchart Menu Component JS
 */

;(function($, window, document, undefined) {
        
    $(document).ready(function() {
        var flowchartMenu = $(".collapsible-flowchart-menu");
        
        if(flowchartMenu.length) {
        
            var $view = $(window), //window works in ie and ff
                $track_height = $("#content").height(),
                $menu = $(".collapsible-flowchart", flowchartMenu).addClass("menu-absolute"),
                originalMenuTop = $menu.offset().top,
                scrollMenu = debounce(function() {
                    var viewTop = $view.scrollTop(); //current position in the document

                    if ((viewTop > originalMenuTop) && (viewTop < ($track_height + originalMenuTop) - $menu.height()) && !$menu.is(".menu-fixed")) { 
                        if($menu.is(".menu-absolute")) {
                            $menu.removeClass("menu-absolute").addClass("menu-fixed");
                        } else if($menu.is(".menu-absolute-bottom")) {
                            $menu.removeClass("menu-absolute-bottom").addClass("menu-fixed");
                        }
                    } else if ((viewTop <= originalMenuTop) && $menu.is(".menu-fixed")) {
                        $menu.removeClass("menu-fixed").addClass("menu-absolute");
                    } else if ((viewTop >= ($track_height + originalMenuTop) - $menu.height()) && $menu.is(".menu-fixed")) {
                        $menu.removeClass("menu-fixed").addClass("menu-absolute-bottom");
                    }
                }, 10);

            $("li > a", flowchartMenu).filter(function() {
                    return this.href.indexOf(window.location.pathname) !== -1;
            }).addClass("active")
                .closest(".collapse").addClass("in")
                .siblings(".collapse").addClass("in")
                .closest("ul").find('[data-toggle="collapse"]').addClass("expanded").removeClass("closed").attr("title", "Close");
            
            $(".flow-rail").css({height: $track_height, position: "relative"});

            $view.scroll(scrollMenu);
        }
    });
    
    function debounce(func, wait, immediate) {
	var timeout;
	return function() {
            var context = this, args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
	};
    };
    
}(jQuery, window, document));
/*
 * Collapsible Flowchart Component JS
 */

;(function($, window, document, undefined) {
        
    $(document).ready(function() {
        var flowchart = $(".collapsible-flowchart");
        
        $("[data-toggle='collapse']", flowchart).click(function(e) {
            var toggleLink = $(this),
                target = "." + toggleLink[0].hash.replace("#", "");        
            
            e.preventDefault();
            
            toggleLink.toggleClass("expanded").toggleClass("closed").attr("title", function() {
                if(toggleLink.attr("title") === "Close"){
                    return "Expand";
                } else {
                    return "Close";
                }
            });
            $(target, flowchart).toggleClass("in");
            $(target, flowchart).find("li.collapse").toggleClass("in");
	});  
    });
    
}(jQuery, window, document));
/*
 * Alert Type Info Component JS
 */

;(function($, window, document, undefined) {
        
    $(document).ready(function() {
        var alertBody = $("body.alertspage .content"),
            alertSettings = $("body.alertspage .eaa-settings"),
            summaryData = alertSettings.data("summary"),
            summaryLength = $(summaryData).text().length,
            MAX_CHARS = 280;
        
        if(alertBody.length && alertSettings.length && MAX_CHARS < summaryLength) {
            alertBody.prepend("<p class=\"error\">Banner Summary text exceeds the 280 character limit.</p>");
        }
    });    
}(jQuery, window, document));
;(function($, window, document, undefined) {
    var TSG = window.TSG || {};
    
    TSG.DEATHQ = {        
        getStats: function(path, offset, mode, dateArray) {
           
            if(TSG.DEATHQ.validateReport(dateArray)) {
                
                //if start or end not specified default to first page
                if(offset === null) {
                    offset = 0;
                }
                
                //build query path by adding selectors based on form elements
                var startDate = $('#yr').val() + "-" +  $('#mth').val() + "-01",
                    endDate = $('#yr2').val() + "-" +  $('#mth2').val() + "-" + new Date($('#yr2').val(), $('#mth2').val(), 0).getDate(),
                    country = $('#country').val();                
                
                
                //clean up$('#dqueryResult').empty(); existing results (if any...)
                $('#dqueryResult').empty();

                $.get( path + ".queryresult.html", { startDate: startDate, endDate: endDate, country: country, offset:offset, pageSize:25 } )
                    .done(function( data ) {
                        $('#dqueryResult').append(data);

                        $("div.pagination a.page").click(function(event) {
                            event.preventDefault();

                            var offset = $(this).attr('href').split('#')[1];
                            if( !$(this).hasClass('disabled') && !$(this).hasClass('current')) {
                                TSG.DEATHQ.getStats(path, offset, 1, dateArray);
                            }
                        });

                        if(mode === 2) {
                            var csvPath = path + ".export.csv?startDate=" + startDate + "&endDate=" + endDate + "&country=" + country + "&offset=0&pageSize=0";
                            $("#downloadCSV").attr("src", csvPath);
                        }     
                    });                              
            }
        },
        validateReport: function(dateArray) {
            if ( (document.dreport.mth.selectedIndex === 0) && (document.dreport.yr.selectedIndex === 0) 
                && (document.dreport.mth2.selectedIndex === 0) && (document.dreport.yr2.selectedIndex === 0) ) {
                alert ("Please select dates!");
                return false;
            }
            if (document.dreport.mth.selectedIndex === 0) {
                alert ("Please select a starting month!");
                return false;
            }
            if (document.dreport.yr.selectedIndex === 0) {
                alert ("Please select a starting Year!");
                return false;
            }
            if (document.dreport.mth2.selectedIndex === 0) {
                alert ("Please select an ending month!");
                return false;
            }
            if (document.dreport.yr2.selectedIndex === 0) {
                alert ("Please select an ending Year!");
                return false;
            }
            if ((document.dreport.mth.selectedIndex > document.dreport.mth2.selectedIndex)
                    && (document.dreport.yr.value === document.dreport.yr2.value)) {
                alert ("Starting date must be before ending date.");
                return false;
            }
            if ( $("#yr").val() === dateArray[2] && document.dreport.mth.selectedIndex < parseInt(dateArray[1], 10) ) {
                alert ("Please select a date starting on or after " + dateArray[0] + " " + dateArray[2] + ".");
                return false;
            }
            if ( $("#yr2").val() === dateArray[5] && document.dreport.mth2.selectedIndex > parseInt(dateArray[4], 10) ) {
                alert ("Please select a date ending on or before " + dateArray[3] + " " + dateArray[5] + ".");
                return false;
            }
            if (document.dreport.yr2.selectedIndex < document.dreport.yr.selectedIndex) {
                alert ("Starting date must be before ending date.");
                return false;
            }
            if ( (document.dreport.mth.selectedIndex > document.dreport.mth2.selectedIndex) &&
                    (document.dreport.yr.selectedIndex === document.dreport.yr2.selectedIndex) ) {
                alert ("Starting date must be before ending date.");
                return false;
            }
            return true;
        }
    };
    
    $(document).ready(function() {
        
        var dreportContainer = $(".dreportContainer"),
             resourcepath, dateArray;
        
        if(dreportContainer.length) {
            resourcepath = dreportContainer.data("resourcepath");
            dateArray = dreportContainer.data("daterange").split("|");            
            
            $("#cmdSearch").click(function(event) {
                event.preventDefault();
                TSG.DEATHQ.getStats(resourcepath, 0, 1, dateArray);
            });

            $("#cmdExport").click(function(event) {
                event.preventDefault();
                TSG.DEATHQ.getStats(resourcepath, 0, 2, dateArray);
            });       
        }
        
    });
    
}(jQuery, window, document));
/*
 * Email and Print Component JS
 */

;(function($, window, document, undefined) {
    var recaptchaElm = "";
    
    $(document).ready(function() {
        
        $(".printIcon").click(function(e) {
            e.preventDefault();
            window.print();		
	});
        
        $(".email-link2").click(function(e) {
            e.preventDefault();
            emailModal();            
        });
        
        $("#email-link-form").submit(function(e) {
            e.preventDefault();
            sendEmailForm();
        });
    });
    
    function emailModal(){
        var popID = $(".email-window"),
                popMargTop, popMargLeft;
        
        if( typeof Recaptcha !== "undefined" && $("#email-captcha-image").length > 0 ) {
            recaptchaElm = Recaptcha.element;
            Recaptcha.destroy();
            
            Recaptcha.create(
                TSG.captchaPublicKey,
                "email-captcha-image",
                {theme: "white"}
            );
        }
        
        if( $("body > .email-window").length < 1 ) {
            popID.detach().appendTo("body");
        }
        
        $("#windowtitle").html(document.title);
        $("#windowurl").html("<a href=\"" + document.location.href + "\">" + document.location.href + "</a>");
        $("input[name='Subject']").focus(function() {
            $(this).select();
        });
        
        $("input[name='Subject']").attr("value","Travel.State.Gov: " + document.title);
                
        popID.fadeIn().css({"width":500})
                .prepend("<a href=\"#\" class=\"close\"><img src=\"/etc/designs/travel/images_global/close_pop.png\" class=\"btn_close\" title=\"Close Window\" alt=\"Close\" /></a>");
        
        popMargTop = (popID.height() + 80) / 2;
        popMargLeft = (popID.width() + 80) / 2;
        
        popID.css({"margin-top":-popMargTop,"margin-left":-popMargLeft});
        
        $("body").append("<div id=\"fade\"></div>");
        $("#fade").css({"filter":"alpha(opacity=80)"}).fadeIn();
        $("body").on("click", ".email-window a.close, #fade, .email-window .close-email-window", function() {
            $("#fade, .email-window").fadeOut(function() {
                $("#fade, a.close").remove();
                $(".email-share-wrap").show();                        
                $(".captcha-error").hide();
                $(".success-wrap").hide();
                
                if( typeof Recaptcha !== "undefined" ) {
                    Recaptcha.destroy();

                    if(recaptchaElm !== "") {
                        Recaptcha.create(
                            TSG.captchaPublicKey,
                            recaptchaElm,
                            {theme: "white"}
                        );
                    }   
                }
            });            
            
            return false;
        });
        $(".form-input").each(function(index) {
            $(this).val($(this).attr("title"));
            $(this).focusin(function() {
                if( $(this).val() === $(this).attr("title") ) {
                    $(this).val("");
                }
            });
            $(this).focusout(function() {
                if( $(this).val() === "" ) {
                    $(this).val($(this).attr("title"));
                }
            });
        });
        $("#windowurl a").focus();
    }
    
    function sendEmailForm() {
	var Subject = "",
            docTitle = document.title,
            toEmails = $("input[name='Email']").val();
        $(".submit-email-share").prop("disabled", true);
        
	validateEmailForm($("input[name='UEmail']"), "uemail");
	if ( (validateEmailForm($("input[name='Email']"), "email") === true) && (validateEmailForm($("input[name='UEmail']"), "uemail") === true) ) {
            if ( $("input[name='Subject']").val() !== "" ) {
                Subject = escape($("input[name='Subject']").val());
            } else {
                Subject = escape($("input[name='Subject']").attr("title"));
            }

            var data = "Email=" + toEmails +
                "&User=" + $("input[name='UEmail']").val() +
                "&Subject=" + Subject +
                "&isChecked=" + $("input[name='Copy']").is(":checked") +
                "&URL=" + encodeURIComponent(document.location.href) +
                "&recaptcha_challenge_field=" + $("input[name='recaptcha_challenge_field']").val() + 
                "&recaptcha_response_field=" + $("input[name='recaptcha_response_field']").val() + 
                "&isEmailForm=true";

            $.ajax({
                type: "POST",
                url: "/bin/EmailService",
                data: data,
                success: function(data) {
                    if(data === "01" || data === "012") {                    
                        $(".email-share-wrap").hide();                        
                        $(".captcha-error").hide();
                        $(".success-wrap strong").text(docTitle);
                        $(".success-wrap strong").text(document.location.href);
                        $(".success-wrap .email-list").text(toEmails);
                        $(".success-wrap").show();
                        $(".submit-email-share").prop("disabled", false);
                        if( typeof Recaptcha !== "undefined" ) {
                            Recaptcha.reload();
                        }
                    } else {
                        if( typeof Recaptcha !== "undefined" ) {
                            Recaptcha.reload();
                            $(".captcha-error").show();
                            $(".submit-email-share").prop("disabled", false);
                        }                        
                    }
                }
            });
	}
    }

    function validateEmailForm(Email, type) {
	var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/,
            error = true;
        
	if (type === "email") {
            var arrEmail = Email.val().replace(" ","").split(",",3);
            var len=arrEmail.length;
            for(var i=0; i<len; i++) {
                if(reg.test(arrEmail[i]) === false) {
                    error = false;
                }
            }
	} else if (type === "uemail") {
            if (reg.test(Email.val()) === false) {
                error = false;
            }
	}

        if(error === false) {
            Email.css({
                background: "yellow", 
                border: "3px red solid"
            });
            $("#err_" + type).html("Please enter a valid email address.");
            $("#err_" + type).css({
                color: "#FF0000", 
                marginLeft: "5em",  
                display:"inline"
            });
            $(".submit-email-share").prop("disabled", false);
            return false;
        } else {
            Email.css({
                background: "white", 
                border: "1px solid #999"
            });
            
            $("#err_" + type).css({
                display:"none"
            });
            
            return true;
        }
    }
    
}(jQuery, window, document));
/*
 * Website Issues Component JS
 */

;(function($, window, document, undefined) {

    $(document).ready(function() {
        var issuesFormWrap = $("#website_issues_form");
        
        if(issuesFormWrap.length) {
            var reqFieldError = $("<div id=\"error_container\"><p id=\"issueListError\"><span class=\"required\">Fields marked with a \"*\" are required.</span></p></div>"),
                errorWrapper = $("#contactus_form_error_msg", issuesFormWrap),
                searchInputs = $(".search-wrap", issuesFormWrap),
                brokenLinkInputs = $(".broken-link-wrap", issuesFormWrap),
                questionInputs = $(".text-questions", issuesFormWrap);
            
            
            if( typeof Recaptcha !== "undefined" && $("#captchaImage", issuesFormWrap).length > 0 ) {
                Recaptcha.create(
                    TSG.captchaPublicKey,
                    "captchaImage",
                    {theme: "white"}
                );
            }

            if( !$(".cq-wcm-edit").length && !$(".cq-wcm-design").length ) {
                $("#successSection", issuesFormWrap).hide();
                $("#errorSection", issuesFormWrap).hide();
                $("#captchaInvalidMessage", issuesFormWrap).hide();
                $("#errorListSection", issuesFormWrap).val("");
            }

            $("input[name='rbCategory']", issuesFormWrap).change(function() {
                if($(this).val() === "BrokenLink") {
                    brokenLinkInputs.show();
                    searchInputs.hide();
                    questionInputs.show();
                    $("#txtBrokenLink").val($("#txtBrokenLink").prop("title"));
                    $("#txtContainingPage").val($("#txtContainingPage").prop("title"));
                    $("#txtDescription").val($("#txtDescription").prop("title"));
                } else {
                    brokenLinkInputs.hide();
                }
            });

            $("input[name='rbCategory']", issuesFormWrap).change(function() {
                if($(this).val() === "Search") {
                    searchInputs.show();
                    $("#txtDescription").val($("#txtDescription").prop("title"));
                    questionInputs.hide();
                    $("#txtSearchTerms").val($("#txtSearchTerms").prop("title"));
                    $("#txtExpectedResults").val($("#txtExpectedResults").prop("title"));
                    $("#txtActualResults").val($("#txtActualResults").prop("title"));
                } else {
                    searchInputs.hide();
                    questionInputs.show();
                }
            });        

            $("#btnReset", issuesFormWrap).click(function(e) {
                e.preventDefault();
                window.location.reload();
            });        

            $("#website_issues", issuesFormWrap).submit(function(e) {
                e.preventDefault();

                var thisForm = $(this),
                    bLSelected = $("#BrokenLink").is(":checked"),
                    sLSelected = $("#Search").is(":checked"),
                    bLInputs = $("#txtBrokenLink, #txtContainingPage"),
                    bLInputBrokenLink = $("#txtBrokenLink"),
                    bLInputtContainingPage = $("#txtContainingPage"),
                    thisSearchInputs = $("#txtSearchTerms, #txtExpectedResults, #txtActualResults"),
                    thisTextName = $("#txtName"),
                    thisTextEmail = $("#txtEmail"),
                    sInputSearchTerms = $("#txtSearchTerms"),
                    sInputExpectedResults = $("#txtExpectedResults"),
                    sInputActualResults = $("#txtActualResults"),
                    textareaValue = $("#txtDescription"),
                    issues_error = false,
                    formData = thisForm.serialize();

                if( ! $("input[name='rbCategory']", thisForm).is(":checked") ) {
                    issues_error = true;
                }    

                if( textareaValue.length === 0 || textareaValue.val() === textareaValue.prop("title") ) {
                    if(sLSelected){
                        issues_error = false;}
                    else{                    
                        issues_error = true;
                    }
                }

                if( thisTextName.val().length === 0 || thisTextName.val() === thisTextName.prop("title") ) {
                    issues_error = true;
                }

                if( thisTextEmail.val().length === 0 || thisTextEmail.val() === thisTextEmail.prop("title") ) {
                    issues_error = true;
                }

                if( bLSelected && bLInputs.val().length > 0 ) {
                    if(bLInputBrokenLink.val() === bLInputBrokenLink.prop("title")){ 
                    issues_error = true;}
                    if(bLInputtContainingPage.val() === bLInputtContainingPage.prop("title")){ 
                    issues_error = true;}
                }

                if( sLSelected && thisSearchInputs.val().length > 0 ) {
                    if(sInputSearchTerms.val() === thisSearchInputs.prop("title")){
                        issues_error = true;}
                    if(sInputExpectedResults.val() === sInputExpectedResults.prop("title")){
                        issues_error = true;}
                    if(sInputActualResults.val() === sInputActualResults.prop("title")){
                        issues_error = true;}
                }           

                if(issues_error) {
                    errorWrapper.empty().append(reqFieldError).addClass("showErrorBanner");
                    $("body").scrollTop(errorWrapper.offset().top);
                    return;               
                }

                $("#errorSection").hide();  
                $("#successSection").hide();
                $("#captchaInvalidMessage").hide();
                $("#errorListSection").val("");

                $.ajax({
                    type: "POST",
                    url: thisForm.attr("action"),
                    data: formData,
                    success: function(result) {
                        if( typeof Recaptcha !== "undefined" ) {
                            Recaptcha.reload();
                        }
                        
                        if(result.status === 1) {
                            $("#successSection").show();
                            $("#formSection").hide();
                            $("#errorSection").hide();     
                        } else {                        
                            $("#successSection").hide();
                            $("#errorSection").show();                      

                            if(result.captchaInvalid === 1) {
                                $("#captchaInvalidMessage").show();      
                                $("#errorSection").hide();
                            }
                        }
                    },
                    fail: function(){
                        $("#successSection").hide();
                        $("#errorSection").show();
                    }
                });
            });
        }
    });
    
}(jQuery, window, document));
/*
 * Website Issues Component JS
 */

;(function($, window, document, undefined) {

    $(document).ready(function() {
        var surveyFormWrap = $("#customersurvey_issues_form");
        
        if(surveyFormWrap.length) {
            var reqFieldError = $("<div id=\"error_container\"><p id=\"issueListError\"><span class=\"required\">Fields marked with a \"*\" are required.</span></p></div>"),
                errorWrapper = $("#contactus_form_error_msg", surveyFormWrap),
                acceptanceFacilityNationalPassportInformationCenterInputs = $("#locationAcceptanceFacilityNationalPassportInformationCenter", surveyFormWrap),
                contactInputs = $("#feedback_contact", surveyFormWrap);
                otherInput = $("#txtOther", surveyFormWrap);
            
            if( typeof Recaptcha !== "undefined" && $("#captchaImage", surveyFormWrap).length > 0 ) {
                Recaptcha.create(
                    TSG.captchaPublicKey,
                    "captchaImage",
                    {theme: "white"}
                );
            }

            if( !$(".cq-wcm-edit").length && !$(".cq-wcm-design").length ) {
                $("#successSection", surveyFormWrap).hide();
                $("#errorSection", surveyFormWrap).hide();
                $("#captchaInvalidMessage", surveyFormWrap).hide();
                $("#errorListSection", surveyFormWrap).val("");
            }
            
            $("input[name='rbAreaOfService']", surveyFormWrap).change(function() {

                //console.log($("#Other").is(':checked'));
                    if($("#Other").is(':checked')) {
                        otherInput.show();
                    } else {
                        otherInput.hide();
                    }
            });

            $("input[name='rbServiceReceived']", surveyFormWrap).change(function() {
                if($(this).val() === "Acceptance Facility" || $(this).val() === "U.S. Passport Agency") {
                    acceptanceFacilityNationalPassportInformationCenterInputs.show();
                } else {
                    acceptanceFacilityNationalPassportInformationCenterInputs.hide();
                }
            });   

            $("input[name='rbContactMe']", surveyFormWrap).change(function() {
                if($(this).val() === "Yes") {
                    contactInputs.show();
                    $("#txtName").val($("#txtName").prop("title"));
                    $("#txtPhone").val($("#txtPhone").prop("title"));
                    $("#txtEmail").val($("#txtEmail").prop("title"));
                } else {
                    contactInputs.hide();
                }
            });     

            $("#btnSubmit", surveyFormWrap).click(function() {
                $(".submit-form").prop('disabled', true);
                $(".clear-form").prop('disabled', true);
            });  
            
            $("#btnReset", surveyFormWrap).click(function(e) {
                e.preventDefault();
                window.location.reload();
            });        

            $("#customersurvey_issues", surveyFormWrap).submit(function(e) {
                e.preventDefault();

                var thisForm = $(this),
                    complimentSelected = $("#Compliment").is(":checked"),
                    complaintSelected = $("#Complaint").is(":checked"),
                    applicationProcessSelected = $("#ApplicationProcess").is(":checked"),
                    passportFeesSelected = $("#PassportFees").is(":checked"),
                    informationReceivedSelected = $("#InformationReceived").is(":checked"),
                    customerServiceSelected = $("#CustomerService").is(":checked"),
                    otherSelected = $("#Other").is(":checked"),
                    serviceReceivedInputOther = $("#txtOther"),
                    acceptanceFacilitySelected = $("#AcceptanceFacility").is(":checked"),
                    usPassportAgencySelected = $("#USPassportAgency").is(":checked"),
                    byMailSelected = $("#ByMail").is(":checked"),
                    travelStateGovSelected = $("#TravelStateGov").is(":checked"),
                    nationalPassportInformationCenterSelected = $("#NationalPassportInformationCenter").is(":checked"),
                    serviceReceivedInputOther = $("#txtOther"),
                    thisServiceReceivedComment = $("#txtServiceReceivedComment"),
                    textareaValue = $("#txtDescription"),
                    contactMeYesSelected = $("#contactMeYes").is(":checked"),
                    contactMeNoSelected = $("#contactMeNo").is(":checked"),
                    thisTextName = $("#txtName"),
                    thisTextPhone = $("#txtPhone"),
                    thisTextEmail = $("#txtEmail"),
                    emailRegEx = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/,
                    phoneRegEx = /^[\d]{3}-[\d]{3}-[\d]{4}$/,
                    issues_error = false,
                    formData = thisForm.serialize();
                    
                pageErrors = "Page Has Errors: ";
                
                if( ! $("input[name='rbFeedBackType']", thisForm).is(":checked") ) {
                    issues_error = true;
                    pageErrors = pageErrors +"rbFeedBackType";

                }    

                if( ! $("input[name='rbAreaOfService']", thisForm).is(":checked") ) {
                    issues_error = true;
                    pageErrors = pageErrors +"rbAreaOfService";
                }    

                if( ! $("input[name='rbServiceReceived']", thisForm).is(":checked") ) {
                    issues_error = true;
                    pageErrors = pageErrors +"rbServiceReceived";
                }    

                if( ! $("input[name='rbContactMe']", thisForm).is(":checked") ) {
                    issues_error = true;
                    pageErrors = pageErrors +"rbContactMe";
                }
                
                if( contactMeYesSelected ) {
                    
                    //console.log("contactMeYesSelected");
                    
                   /** 
                    if( thisTextName.val().length === 0 || thisTextName.val() === thisTextName.prop("title") ) {
                        issues_error = true; 
                    }
                     **/
                    hasPhoneDefaultValueChanged = thisTextPhone.val().length === 0 || thisTextPhone.val() === thisTextPhone.prop("title");
                    hasEmailDefaultValueChanged = thisTextEmail.val().length === 0 || thisTextEmail.val() === thisTextEmail.prop("title");
                    //console.log("hasPhoneDefaultValueChanged" + hasPhoneDefaultValueChanged);
                    //console.log("hasEmailDefaultValueChanged" + hasEmailDefaultValueChanged);
                    
                    if( hasPhoneDefaultValueChanged && hasEmailDefaultValueChanged) {
                        issues_error = true;
                    }
                    
                    if( !hasEmailDefaultValueChanged && !emailRegEx.test(thisTextEmail.val())) {
                        issues_error = true;
                    }
                }
/**
                if( otherSelected) {
                    //console.log("otherSelected");
                    if(serviceReceivedInputOther.val() === serviceReceivedInputOther.prop("title")){ 
                    issues_error = true;}
                    console.log(serviceReceivedInputOther.val());
                }   
**/
                if( (acceptanceFacilitySelected || usPassportAgencySelected)) {
                    //console.log("thisServiceReceivedComment");
                    if(thisServiceReceivedComment.val() === thisServiceReceivedComment.prop("title")){ 
                    issues_error = true;
                    pageErrors = pageErrors +"thisServiceReceivedComment";
                    //console.log(thisServiceReceivedComment.val());
                    };
                }       

                if(issues_error) {
                    //console.log(pageErrors);
                    errorWrapper.empty().append(reqFieldError).addClass("showErrorBanner");
                    $(".submit-form").prop('disabled', false);
                    $(".clear-form").prop('disabled', false);
                    $("body,html").scrollTop(errorWrapper.offset().top);
                    return;               
                }

                $("#errorSection").hide();  
                $("#successSection").hide();
                $("#captchaInvalidMessage").hide();
                $("#errorListSection").val("");

                $.ajax({
                    type: "POST",
                    url: thisForm.attr("action"),
                    data: formData,
                    success: function(result) {
                        //console.log("Success: " +result.status);
                        if( typeof Recaptcha !== "undefined" ) {
                            Recaptcha.reload();
                        }

                        if(result.status === 1) {
                            $("#successSection").show();
                            $("#formSection").hide();
                            $("#errorSection").hide();
                            $(".pageVersion").hide(); 
                            $(".pageFooter").hide(); 
                        } else {                        
                            $("#successSection").hide();
                            $("#errorSection").show();                      

                            if(result.captchaInvalid === 1) {
                                $("#captchaInvalidMessage").show();      
                                $("#errorSection").hide();
                            }
                        }
                    },
                    fail: function(){
                        //console.log("Failed: " +result.status);
                        $("#successSection").hide();
                        $("#errorSection").show();    
                    }
                });
            });
        }
    });
    
}(jQuery, window, document));
/*
 * Google minisearch Component JS
 */

;(function($, window, document, undefined) {
    var conAccess = false,
        siaAccess = false,
        searchQuery = "",
        searchWrap;
//console.log(siaAccess);
    $(document).ready(function() {        
        searchWrap = $("#search_content");
        searchQuery = searchWrap.attr("data-search-input") || "";
        
//console.log(searchQuery);
        if($(searchWrap).length) {
            $.ajax({
                type: "GET",
                url: "/content/sia.html",
                success: function(data, textStatus, xhr) {
                    if(xhr.status === 200) {
                        siaAccess = true;
                    }
                },
                error: function() {
                    //console.log("siaAccess error");        
                },
                complete: function(xhr, textStatus) {
                    $.ajax({
                        type: "GET",
                        url: "/content/travel/en/congressional-liaison.html",
                        success: function(data, textStatus, xhr2) {
                            if(xhr2.status === 200) {
                                conAccess = true;
                            }                     
                        },
                        error: function() {
                            //console.log("conAccess error");       
                        },
                        complete: function(xhr, textStatus) {
                            $.ajax({
                                type: "POST",
                                url: "/bin/googlemini/search",
                                data: {
                                    q: searchQuery === "null" ? searchWrap.attr("data-query-string") : searchQuery,
                                    siaAccess: siaAccess,
                                    conAccess: conAccess,
                                    isPagination: searchQuery === "null",
                                    isAA: searchWrap.data("is-aa"),
                                    isSA: searchWrap.data("is-sa")
                                },
                                dataType: "html",
                                success: function(data) {
                                    searchWrap.append(data);
                                }
                            });
                        }
                    });
                }
            });
        }
    });
    
}(jQuery, window, document));
/* Modernizr 2.0.6 (Custom Build) | MIT & BSD
 * Contains: fontface | backgroundsize | borderimage | borderradius | boxshadow | flexbox | hsla | multiplebgs | opacity | rgba | textshadow | cssanimations | csscolumns | generatedcontent | cssgradients | cssreflections | csstransforms | csstransforms3d | csstransitions | applicationcache | canvas | canvastext | draganddrop | hashchange | history | audio | video | indexeddb | input | inputtypes | localstorage | postmessage | sessionstorage | websockets | websqldatabase | webworkers | geolocation | inlinesvg | smil | svg | svgclippaths | touch | webgl | iepp | cssclasses | teststyles | testprop | testallprops | hasevent | prefixes | domprefixes | load
 */
;window.Modernizr=function(a,b,c){function H(){e.input=function(a){for(var b=0,c=a.length;b<c;b++)t[a[b]]=a[b]in l;return t}("autocomplete autofocus list placeholder max min multiple pattern required step".split(" ")),e.inputtypes=function(a){for(var d=0,e,f,h,i=a.length;d<i;d++)l.setAttribute("type",f=a[d]),e=l.type!=="text",e&&(l.value=m,l.style.cssText="position:absolute;visibility:hidden;",/^range$/.test(f)&&l.style.WebkitAppearance!==c?(g.appendChild(l),h=b.defaultView,e=h.getComputedStyle&&h.getComputedStyle(l,null).WebkitAppearance!=="textfield"&&l.offsetHeight!==0,g.removeChild(l)):/^(search|tel)$/.test(f)||(/^(url|email)$/.test(f)?e=l.checkValidity&&l.checkValidity()===!1:/^color$/.test(f)?(g.appendChild(l),g.offsetWidth,e=l.value!=m,g.removeChild(l)):e=l.value!=m)),s[a[d]]=!!e;return s}("search tel url email datetime date month week time datetime-local number range color".split(" "))}function F(a,b){var c=a.charAt(0).toUpperCase()+a.substr(1),d=(a+" "+p.join(c+" ")+c).split(" ");return E(d,b)}function E(a,b){for(var d in a)if(k[a[d]]!==c)return b=="pfx"?a[d]:!0;return!1}function D(a,b){return!!~(""+a).indexOf(b)}function C(a,b){return typeof a===b}function B(a,b){return A(o.join(a+";")+(b||""))}function A(a){k.cssText=a}var d="2.0.6",e={},f=!0,g=b.documentElement,h=b.head||b.getElementsByTagName("head")[0],i="modernizr",j=b.createElement(i),k=j.style,l=b.createElement("input"),m=":)",n=Object.prototype.toString,o=" -webkit- -moz- -o- -ms- -khtml- ".split(" "),p="Webkit Moz O ms Khtml".split(" "),q={svg:"http://www.w3.org/2000/svg"},r={},s={},t={},u=[],v=function(a,c,d,e){var f,h,j,k=b.createElement("div");if(parseInt(d,10))while(d--)j=b.createElement("div"),j.id=e?e[d]:i+(d+1),k.appendChild(j);f=["&shy;","<style>",a,"</style>"].join(""),k.id=i,k.innerHTML+=f,g.appendChild(k),h=c(k,a),k.parentNode.removeChild(k);return!!h},w=function(){function d(d,e){e=e||b.createElement(a[d]||"div"),d="on"+d;var f=d in e;f||(e.setAttribute||(e=b.createElement("div")),e.setAttribute&&e.removeAttribute&&(e.setAttribute(d,""),f=C(e[d],"function"),C(e[d],c)||(e[d]=c),e.removeAttribute(d))),e=null;return f}var a={select:"input",change:"input",submit:"form",reset:"form",error:"img",load:"img",abort:"img"};return d}(),x,y={}.hasOwnProperty,z;!C(y,c)&&!C(y.call,c)?z=function(a,b){return y.call(a,b)}:z=function(a,b){return b in a&&C(a.constructor.prototype[b],c)};var G=function(c,d){var f=c.join(""),g=d.length;v(f,function(c,d){var f=b.styleSheets[b.styleSheets.length-1],h=f.cssRules&&f.cssRules[0]?f.cssRules[0].cssText:f.cssText||"",i=c.childNodes,j={};while(g--)j[i[g].id]=i[g];e.touch="ontouchstart"in a||j.touch.offsetTop===9,e.csstransforms3d=j.csstransforms3d.offsetLeft===9,e.generatedcontent=j.generatedcontent.offsetHeight>=1,e.fontface=/src/i.test(h)&&h.indexOf(d.split(" ")[0])===0},g,d)}(['@font-face {font-family:"font";src:url("https://")}',["@media (",o.join("touch-enabled),("),i,")","{#touch{top:9px;position:absolute}}"].join(""),["@media (",o.join("transform-3d),("),i,")","{#csstransforms3d{left:9px;position:absolute}}"].join(""),['#generatedcontent:after{content:"',m,'";visibility:hidden}'].join("")],["fontface","touch","csstransforms3d","generatedcontent"]);r.flexbox=function(){function c(a,b,c,d){a.style.cssText=o.join(b+":"+c+";")+(d||"")}function a(a,b,c,d){b+=":",a.style.cssText=(b+o.join(c+";"+b)).slice(0,-b.length)+(d||"")}var d=b.createElement("div"),e=b.createElement("div");a(d,"display","box","width:42px;padding:0;"),c(e,"box-flex","1","width:10px;"),d.appendChild(e),g.appendChild(d);var f=e.offsetWidth===42;d.removeChild(e),g.removeChild(d);return f},r.canvas=function(){var a=b.createElement("canvas");return!!a.getContext&&!!a.getContext("2d")},r.canvastext=function(){return!!e.canvas&&!!C(b.createElement("canvas").getContext("2d").fillText,"function")},r.webgl=function(){return!!a.WebGLRenderingContext},r.touch=function(){return e.touch},r.geolocation=function(){return!!navigator.geolocation},r.postmessage=function(){return!!a.postMessage},r.websqldatabase=function(){var b=!!a.openDatabase;return b},r.indexedDB=function(){for(var b=-1,c=p.length;++b<c;)if(a[p[b].toLowerCase()+"IndexedDB"])return!0;return!!a.indexedDB},r.hashchange=function(){return w("hashchange",a)&&(b.documentMode===c||b.documentMode>7)},r.history=function(){return!!a.history&&!!history.pushState},r.draganddrop=function(){return w("dragstart")&&w("drop")},r.websockets=function(){for(var b=-1,c=p.length;++b<c;)if(a[p[b]+"WebSocket"])return!0;return"WebSocket"in a},r.rgba=function(){A("background-color:rgba(150,255,150,.5)");return D(k.backgroundColor,"rgba")},r.hsla=function(){A("background-color:hsla(120,40%,100%,.5)");return D(k.backgroundColor,"rgba")||D(k.backgroundColor,"hsla")},r.multiplebgs=function(){A("background:url(https://),url(https://),red url(https://)");return/(url\s*\(.*?){3}/.test(k.background)},r.backgroundsize=function(){return F("backgroundSize")},r.borderimage=function(){return F("borderImage")},r.borderradius=function(){return F("borderRadius")},r.boxshadow=function(){return F("boxShadow")},r.textshadow=function(){return b.createElement("div").style.textShadow===""},r.opacity=function(){B("opacity:.55");return/^0.55$/.test(k.opacity)},r.cssanimations=function(){return F("animationName")},r.csscolumns=function(){return F("columnCount")},r.cssgradients=function(){var a="background-image:",b="gradient(linear,left top,right bottom,from(#9f9),to(white));",c="linear-gradient(left top,#9f9, white);";A((a+o.join(b+a)+o.join(c+a)).slice(0,-a.length));return D(k.backgroundImage,"gradient")},r.cssreflections=function(){return F("boxReflect")},r.csstransforms=function(){return!!E(["transformProperty","WebkitTransform","MozTransform","OTransform","msTransform"])},r.csstransforms3d=function(){var a=!!E(["perspectiveProperty","WebkitPerspective","MozPerspective","OPerspective","msPerspective"]);a&&"webkitPerspective"in g.style&&(a=e.csstransforms3d);return a},r.csstransitions=function(){return F("transitionProperty")},r.fontface=function(){return e.fontface},r.generatedcontent=function(){return e.generatedcontent},r.video=function(){var a=b.createElement("video"),c=!1;try{if(c=!!a.canPlayType){c=new Boolean(c),c.ogg=a.canPlayType('video/ogg; codecs="theora"');var d='video/mp4; codecs="avc1.42E01E';c.h264=a.canPlayType(d+'"')||a.canPlayType(d+', mp4a.40.2"'),c.webm=a.canPlayType('video/webm; codecs="vp8, vorbis"')}}catch(e){}return c},r.audio=function(){var a=b.createElement("audio"),c=!1;try{if(c=!!a.canPlayType)c=new Boolean(c),c.ogg=a.canPlayType('audio/ogg; codecs="vorbis"'),c.mp3=a.canPlayType("audio/mpeg;"),c.wav=a.canPlayType('audio/wav; codecs="1"'),c.m4a=a.canPlayType("audio/x-m4a;")||a.canPlayType("audio/aac;")}catch(d){}return c},r.localstorage=function(){try{return!!localStorage.getItem}catch(a){return!1}},r.sessionstorage=function(){try{return!!sessionStorage.getItem}catch(a){return!1}},r.webworkers=function(){return!!a.Worker},r.applicationcache=function(){return!!a.applicationCache},r.svg=function(){return!!b.createElementNS&&!!b.createElementNS(q.svg,"svg").createSVGRect},r.inlinesvg=function(){var a=b.createElement("div");a.innerHTML="<svg/>";return(a.firstChild&&a.firstChild.namespaceURI)==q.svg},r.smil=function(){return!!b.createElementNS&&/SVG/.test(n.call(b.createElementNS(q.svg,"animate")))},r.svgclippaths=function(){return!!b.createElementNS&&/SVG/.test(n.call(b.createElementNS(q.svg,"clipPath")))};for(var I in r)z(r,I)&&(x=I.toLowerCase(),e[x]=r[I](),u.push((e[x]?"":"no-")+x));e.input||H(),A(""),j=l=null,a.attachEvent&&function(){var a=b.createElement("div");a.innerHTML="<elem></elem>";return a.childNodes.length!==1}()&&function(a,b){function s(a){var b=-1;while(++b<g)a.createElement(f[b])}a.iepp=a.iepp||{};var d=a.iepp,e=d.html5elements||"abbr|article|aside|audio|canvas|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",f=e.split("|"),g=f.length,h=new RegExp("(^|\\s)("+e+")","gi"),i=new RegExp("<(/*)("+e+")","gi"),j=/^\s*[\{\}]\s*$/,k=new RegExp("(^|[^\\n]*?\\s)("+e+")([^\\n]*)({[\\n\\w\\W]*?})","gi"),l=b.createDocumentFragment(),m=b.documentElement,n=m.firstChild,o=b.createElement("body"),p=b.createElement("style"),q=/print|all/,r;d.getCSS=function(a,b){if(a+""===c)return"";var e=-1,f=a.length,g,h=[];while(++e<f){g=a[e];if(g.disabled)continue;b=g.media||b,q.test(b)&&h.push(d.getCSS(g.imports,b),g.cssText),b="all"}return h.join("")},d.parseCSS=function(a){var b=[],c;while((c=k.exec(a))!=null)b.push(((j.exec(c[1])?"\n":c[1])+c[2]+c[3]).replace(h,"$1.iepp_$2")+c[4]);return b.join("\n")},d.writeHTML=function(){var a=-1;r=r||b.body;while(++a<g){var c=b.getElementsByTagName(f[a]),d=c.length,e=-1;while(++e<d)c[e].className.indexOf("iepp_")<0&&(c[e].className+=" iepp_"+f[a])}l.appendChild(r),m.appendChild(o),o.className=r.className,o.id=r.id,o.innerHTML=r.innerHTML.replace(i,"<$1font")},d._beforePrint=function(){p.styleSheet.cssText=d.parseCSS(d.getCSS(b.styleSheets,"all")),d.writeHTML()},d.restoreHTML=function(){o.innerHTML="",m.removeChild(o),m.appendChild(r)},d._afterPrint=function(){d.restoreHTML(),p.styleSheet.cssText=""},s(b),s(l);d.disablePP||(n.insertBefore(p,n.firstChild),p.media="print",p.className="iepp-printshim",a.attachEvent("onbeforeprint",d._beforePrint),a.attachEvent("onafterprint",d._afterPrint))}(a,b),e._version=d,e._prefixes=o,e._domPrefixes=p,e.hasEvent=w,e.testProp=function(a){return E([a])},e.testAllProps=F,e.testStyles=v,g.className=g.className.replace(/\bno-js\b/,"")+(f?" js "+u.join(" "):"");return e}(this,this.document),function(a,b,c){function k(a){return!a||a=="loaded"||a=="complete"}function j(){var a=1,b=-1;while(p.length- ++b)if(p[b].s&&!(a=p[b].r))break;a&&g()}function i(a){var c=b.createElement("script"),d;c.src=a.s,c.onreadystatechange=c.onload=function(){!d&&k(c.readyState)&&(d=1,j(),c.onload=c.onreadystatechange=null)},m(function(){d||(d=1,j())},H.errorTimeout),a.e?c.onload():n.parentNode.insertBefore(c,n)}function h(a){var c=b.createElement("link"),d;c.href=a.s,c.rel="stylesheet",c.type="text/css";if(!a.e&&(w||r)){var e=function(a){m(function(){if(!d)try{a.sheet.cssRules.length?(d=1,j()):e(a)}catch(b){b.code==1e3||b.message=="security"||b.message=="denied"?(d=1,m(function(){j()},0)):e(a)}},0)};e(c)}else c.onload=function(){d||(d=1,m(function(){j()},0))},a.e&&c.onload();m(function(){d||(d=1,j())},H.errorTimeout),!a.e&&n.parentNode.insertBefore(c,n)}function g(){var a=p.shift();q=1,a?a.t?m(function(){a.t=="c"?h(a):i(a)},0):(a(),j()):q=0}function f(a,c,d,e,f,h){function i(){!o&&k(l.readyState)&&(r.r=o=1,!q&&j(),l.onload=l.onreadystatechange=null,m(function(){u.removeChild(l)},0))}var l=b.createElement(a),o=0,r={t:d,s:c,e:h};l.src=l.data=c,!s&&(l.style.display="none"),l.width=l.height="0",a!="object"&&(l.type=d),l.onload=l.onreadystatechange=i,a=="img"?l.onerror=i:a=="script"&&(l.onerror=function(){r.e=r.r=1,g()}),p.splice(e,0,r),u.insertBefore(l,s?null:n),m(function(){o||(u.removeChild(l),r.r=r.e=o=1,j())},H.errorTimeout)}function e(a,b,c){var d=b=="c"?z:y;q=0,b=b||"j",C(a)?f(d,a,b,this.i++,l,c):(p.splice(this.i++,0,a),p.length==1&&g());return this}function d(){var a=H;a.loader={load:e,i:0};return a}var l=b.documentElement,m=a.setTimeout,n=b.getElementsByTagName("script")[0],o={}.toString,p=[],q=0,r="MozAppearance"in l.style,s=r&&!!b.createRange().compareNode,t=r&&!s,u=s?l:n.parentNode,v=a.opera&&o.call(a.opera)=="[object Opera]",w="webkitAppearance"in l.style,x=w&&"async"in b.createElement("script"),y=r?"object":v||x?"img":"script",z=w?"img":y,A=Array.isArray||function(a){return o.call(a)=="[object Array]"},B=function(a){return Object(a)===a},C=function(a){return typeof a=="string"},D=function(a){return o.call(a)=="[object Function]"},E=[],F={},G,H;H=function(a){function f(a){var b=a.split("!"),c=E.length,d=b.pop(),e=b.length,f={url:d,origUrl:d,prefixes:b},g,h;for(h=0;h<e;h++)g=F[b[h]],g&&(f=g(f));for(h=0;h<c;h++)f=E[h](f);return f}function e(a,b,e,g,h){var i=f(a),j=i.autoCallback;if(!i.bypass){b&&(b=D(b)?b:b[a]||b[g]||b[a.split("/").pop().split("?")[0]]);if(i.instead)return i.instead(a,b,e,g,h);e.load(i.url,i.forceCSS||!i.forceJS&&/css$/.test(i.url)?"c":c,i.noexec),(D(b)||D(j))&&e.load(function(){d(),b&&b(i.origUrl,h,g),j&&j(i.origUrl,h,g)})}}function b(a,b){function c(a){if(C(a))e(a,h,b,0,d);else if(B(a))for(i in a)a.hasOwnProperty(i)&&e(a[i],h,b,i,d)}var d=!!a.test,f=d?a.yep:a.nope,g=a.load||a.both,h=a.callback,i;c(f),c(g),a.complete&&b.load(a.complete)}var g,h,i=this.yepnope.loader;if(C(a))e(a,0,i,0);else if(A(a))for(g=0;g<a.length;g++)h=a[g],C(h)?e(h,0,i,0):A(h)?H(h):B(h)&&b(h,i);else B(a)&&b(a,i)},H.addPrefix=function(a,b){F[a]=b},H.addFilter=function(a){E.push(a)},H.errorTimeout=1e4,b.readyState==null&&b.addEventListener&&(b.readyState="loading",b.addEventListener("DOMContentLoaded",G=function(){b.removeEventListener("DOMContentLoaded",G,0),b.readyState="complete"},0)),a.yepnope=d()}(this,this.document),Modernizr.load=function(){yepnope.apply(window,[].slice.call(arguments,0))};
/**
 * jQuery.ScrollTo - Easy element scrolling using jQuery.
 * Copyright (c) 2007-2009 Ariel Flesler - aflesler(at)gmail(dot)com | http://flesler.blogspot.com
 * Dual licensed under MIT and GPL.
 * Date: 5/25/2009
 * @author Ariel Flesler
 * @version 1.4.2
 *
 * http://flesler.blogspot.com/2007/10/jqueryscrollto.html
 */
;(function(d){var k=d.scrollTo=function(a,i,e){d(window).scrollTo(a,i,e)};k.defaults={axis:'xy',duration:parseFloat(d.fn.jquery)>=1.3?0:1};k.window=function(a){return d(window)._scrollable()};d.fn._scrollable=function(){return this.map(function(){var a=this,i=!a.nodeName||d.inArray(a.nodeName.toLowerCase(),['iframe','#document','html','body'])!=-1;if(!i)return a;var e=(a.contentWindow||a).document||a.ownerDocument||a;return d.browser.safari||e.compatMode=='BackCompat'?e.body:e.documentElement})};d.fn.scrollTo=function(n,j,b){if(typeof j=='object'){b=j;j=0}if(typeof b=='function')b={onAfter:b};if(n=='max')n=9e9;b=d.extend({},k.defaults,b);j=j||b.speed||b.duration;b.queue=b.queue&&b.axis.length>1;if(b.queue)j/=2;b.offset=p(b.offset);b.over=p(b.over);return this._scrollable().each(function(){var q=this,r=d(q),f=n,s,g={},u=r.is('html,body');switch(typeof f){case'number':case'string':if(/^([+-]=)?\d+(\.\d+)?(px|%)?$/.test(f)){f=p(f);break}f=d(f,this);case'object':if(f.is||f.style)s=(f=d(f)).offset()}d.each(b.axis.split(''),function(a,i){var e=i=='x'?'Left':'Top',h=e.toLowerCase(),c='scroll'+e,l=q[c],m=k.max(q,i);if(s){g[c]=s[h]+(u?0:l-r.offset()[h]);if(b.margin){g[c]-=parseInt(f.css('margin'+e))||0;g[c]-=parseInt(f.css('border'+e+'Width'))||0}g[c]+=b.offset[h]||0;if(b.over[h])g[c]+=f[i=='x'?'width':'height']()*b.over[h]}else{var o=f[h];g[c]=o.slice&&o.slice(-1)=='%'?parseFloat(o)/100*m:o}if(/^\d+$/.test(g[c]))g[c]=g[c]<=0?0:Math.min(g[c],m);if(!a&&b.queue){if(l!=g[c])t(b.onAfterFirst);delete g[c]}});t(b.onAfter);function t(a){r.animate(g,j,b.easing,a&&function(){a.call(this,n,b)})}}).end()};k.max=function(a,i){var e=i=='x'?'Width':'Height',h='scroll'+e;if(!d(a).is('html,body'))return a[h]-d(a)[e.toLowerCase()]();var c='client'+e,l=a.ownerDocument.documentElement,m=a.ownerDocument.body;return Math.max(l[h],m[h])-Math.min(l[c],m[c])};function p(a){return typeof a=='object'?a:{top:a,left:a}}})(jQuery);
/*
 * File:        jquery.dataTables.min.js
 * Version:     1.9.1
 * Author:      Allan Jardine (www.sprymedia.co.uk)
 * Info:        www.datatables.net
 * 
 * Copyright 2008-2012 Allan Jardine, all rights reserved.
 *
 * This source file is free software, under either the GPL v2 license or a
 * BSD style license, available at:
 *   http://datatables.net/license_gpl2
 *   http://datatables.net/license_bsd
 * 
 * This source file is distributed in the hope that it will be useful, but 
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY 
 * or FITNESS FOR A PARTICULAR PURPOSE. See the license files for details.
 */
(function(h,V,l,m){var j=function(e){function o(a,b){var c=j.defaults.columns,d=a.aoColumns.length,c=h.extend({},j.models.oColumn,c,{sSortingClass:a.oClasses.sSortable,sSortingClassJUI:a.oClasses.sSortJUI,nTh:b?b:l.createElement("th"),sTitle:c.sTitle?c.sTitle:b?b.innerHTML:"",aDataSort:c.aDataSort?c.aDataSort:[d],mDataProp:c.mDataProp?c.oDefaults:d});a.aoColumns.push(c);if(a.aoPreSearchCols[d]===m||null===a.aoPreSearchCols[d])a.aoPreSearchCols[d]=h.extend({},j.models.oSearch);else{c=a.aoPreSearchCols[d];
if(c.bRegex===m)c.bRegex=!0;if(c.bSmart===m)c.bSmart=!0;if(c.bCaseInsensitive===m)c.bCaseInsensitive=!0}s(a,d,null)}function s(a,b,c){b=a.aoColumns[b];if(c!==m&&null!==c){if(c.sType!==m)b.sType=c.sType,b._bAutoType=!1;h.extend(b,c);p(b,c,"sWidth","sWidthOrig");if(c.iDataSort!==m)b.aDataSort=[c.iDataSort];p(b,c,"aDataSort")}b.fnGetData=W(b.mDataProp);b.fnSetData=ta(b.mDataProp);if(!a.oFeatures.bSort)b.bSortable=!1;if(!b.bSortable||-1==h.inArray("asc",b.asSorting)&&-1==h.inArray("desc",b.asSorting))b.sSortingClass=
a.oClasses.sSortableNone,b.sSortingClassJUI="";else if(b.bSortable||-1==h.inArray("asc",b.asSorting)&&-1==h.inArray("desc",b.asSorting))b.sSortingClass=a.oClasses.sSortable,b.sSortingClassJUI=a.oClasses.sSortJUI;else if(-1!=h.inArray("asc",b.asSorting)&&-1==h.inArray("desc",b.asSorting))b.sSortingClass=a.oClasses.sSortableAsc,b.sSortingClassJUI=a.oClasses.sSortJUIAscAllowed;else if(-1==h.inArray("asc",b.asSorting)&&-1!=h.inArray("desc",b.asSorting))b.sSortingClass=a.oClasses.sSortableDesc,b.sSortingClassJUI=
a.oClasses.sSortJUIDescAllowed}function k(a){if(!1===a.oFeatures.bAutoWidth)return!1;ba(a);for(var b=0,c=a.aoColumns.length;b<c;b++)a.aoColumns[b].nTh.style.width=a.aoColumns[b].sWidth}function x(a,b){for(var c=-1,d=0;d<a.aoColumns.length;d++)if(!0===a.aoColumns[d].bVisible&&c++,c==b)return d;return null}function r(a,b){for(var c=-1,d=0;d<a.aoColumns.length;d++)if(!0===a.aoColumns[d].bVisible&&c++,d==b)return!0===a.aoColumns[d].bVisible?c:null;return null}function v(a){for(var b=0,c=0;c<a.aoColumns.length;c++)!0===
a.aoColumns[c].bVisible&&b++;return b}function A(a){for(var b=j.ext.aTypes,c=b.length,d=0;d<c;d++){var f=b[d](a);if(null!==f)return f}return"string"}function E(a,b){for(var c=b.split(","),d=[],f=0,g=a.aoColumns.length;f<g;f++)for(var i=0;i<g;i++)if(a.aoColumns[f].sName==c[i]){d.push(i);break}return d}function y(a){for(var b="",c=0,d=a.aoColumns.length;c<d;c++)b+=a.aoColumns[c].sName+",";return b.length==d?"":b.slice(0,-1)}function J(a,b,c,d){var f,g,i,e,u;if(b)for(f=b.length-1;0<=f;f--){var n=b[f].aTargets;
h.isArray(n)||F(a,1,"aTargets must be an array of targets, not a "+typeof n);for(g=0,i=n.length;g<i;g++)if("number"===typeof n[g]&&0<=n[g]){for(;a.aoColumns.length<=n[g];)o(a);d(n[g],b[f])}else if("number"===typeof n[g]&&0>n[g])d(a.aoColumns.length+n[g],b[f]);else if("string"===typeof n[g])for(e=0,u=a.aoColumns.length;e<u;e++)("_all"==n[g]||h(a.aoColumns[e].nTh).hasClass(n[g]))&&d(e,b[f])}if(c)for(f=0,a=c.length;f<a;f++)d(f,c[f])}function H(a,b){var c;c=h.isArray(b)?b.slice():h.extend(!0,{},b);var d=
a.aoData.length,f=h.extend(!0,{},j.models.oRow);f._aData=c;a.aoData.push(f);for(var g,f=0,i=a.aoColumns.length;f<i;f++)if(c=a.aoColumns[f],"function"===typeof c.fnRender&&c.bUseRendered&&null!==c.mDataProp?I(a,d,f,R(a,d,f)):I(a,d,f,w(a,d,f)),c._bAutoType&&"string"!=c.sType&&(g=w(a,d,f,"type"),null!==g&&""!==g))if(g=A(g),null===c.sType)c.sType=g;else if(c.sType!=g&&"html"!=c.sType)c.sType="string";a.aiDisplayMaster.push(d);a.oFeatures.bDeferRender||ca(a,d);return d}function ua(a){var b,c,d,f,g,i,e,
u,n;if(a.bDeferLoading||null===a.sAjaxSource){e=a.nTBody.childNodes;for(b=0,c=e.length;b<c;b++)if("TR"==e[b].nodeName.toUpperCase()){u=a.aoData.length;e[b]._DT_RowIndex=u;a.aoData.push(h.extend(!0,{},j.models.oRow,{nTr:e[b]}));a.aiDisplayMaster.push(u);i=e[b].childNodes;g=0;for(d=0,f=i.length;d<f;d++)if(n=i[d].nodeName.toUpperCase(),"TD"==n||"TH"==n)I(a,u,g,h.trim(i[d].innerHTML)),g++}}e=S(a);i=[];for(b=0,c=e.length;b<c;b++)for(d=0,f=e[b].childNodes.length;d<f;d++)g=e[b].childNodes[d],n=g.nodeName.toUpperCase(),
("TD"==n||"TH"==n)&&i.push(g);for(f=0,e=a.aoColumns.length;f<e;f++){n=a.aoColumns[f];if(null===n.sTitle)n.sTitle=n.nTh.innerHTML;g=n._bAutoType;u="function"===typeof n.fnRender;var o=null!==n.sClass,k=n.bVisible,m,s;if(g||u||o||!k)for(b=0,c=a.aoData.length;b<c;b++){d=a.aoData[b];m=i[b*e+f];if(g&&"string"!=n.sType&&(s=w(a,b,f,"type"),""!==s))if(s=A(s),null===n.sType)n.sType=s;else if(n.sType!=s&&"html"!=n.sType)n.sType="string";if("function"===typeof n.mDataProp)m.innerHTML=w(a,b,f,"display");if(u)s=
R(a,b,f),m.innerHTML=s,n.bUseRendered&&I(a,b,f,s);o&&(m.className+=" "+n.sClass);k?d._anHidden[f]=null:(d._anHidden[f]=m,m.parentNode.removeChild(m));n.fnCreatedCell&&n.fnCreatedCell.call(a.oInstance,m,w(a,b,f,"display"),d._aData,b,f)}}if(0!==a.aoRowCreatedCallback.length)for(b=0,c=a.aoData.length;b<c;b++)d=a.aoData[b],D(a,"aoRowCreatedCallback",null,[d.nTr,d._aData,b])}function K(a,b){return b._DT_RowIndex!==m?b._DT_RowIndex:null}function da(a,b,c){for(var b=L(a,b),d=0,a=a.aoColumns.length;d<a;d++)if(b[d]===
c)return d;return-1}function X(a,b,c){for(var d=[],f=0,g=a.aoColumns.length;f<g;f++)d.push(w(a,b,f,c));return d}function w(a,b,c,d){var f=a.aoColumns[c];if((c=f.fnGetData(a.aoData[b]._aData,d))===m){if(a.iDrawError!=a.iDraw&&null===f.sDefaultContent)F(a,0,"Requested unknown parameter "+("function"==typeof f.mDataProp?"{mDataprop function}":"'"+f.mDataProp+"'")+" from the data source for row "+b),a.iDrawError=a.iDraw;return f.sDefaultContent}if(null===c&&null!==f.sDefaultContent)c=f.sDefaultContent;
else if("function"===typeof c)return c();return"display"==d&&null===c?"":c}function I(a,b,c,d){a.aoColumns[c].fnSetData(a.aoData[b]._aData,d)}function W(a){if(null===a)return function(){return null};if("function"===typeof a)return function(b,d){return a(b,d)};if("string"===typeof a&&-1!=a.indexOf(".")){var b=a.split(".");return function(a){for(var d=0,f=b.length;d<f;d++)if(a=a[b[d]],a===m)return m;return a}}return function(b){return b[a]}}function ta(a){if(null===a)return function(){};if("function"===
typeof a)return function(b,d){a(b,"set",d)};if("string"===typeof a&&-1!=a.indexOf(".")){var b=a.split(".");return function(a,d){for(var f=0,g=b.length-1;f<g;f++)if(a=a[b[f]],a===m)return;a[b[b.length-1]]=d}}return function(b,d){b[a]=d}}function Y(a){for(var b=[],c=a.aoData.length,d=0;d<c;d++)b.push(a.aoData[d]._aData);return b}function ea(a){a.aoData.splice(0,a.aoData.length);a.aiDisplayMaster.splice(0,a.aiDisplayMaster.length);a.aiDisplay.splice(0,a.aiDisplay.length);B(a)}function fa(a,b){for(var c=
-1,d=0,f=a.length;d<f;d++)a[d]==b?c=d:a[d]>b&&a[d]--; -1!=c&&a.splice(c,1)}function R(a,b,c){var d=a.aoColumns[c];return d.fnRender({iDataRow:b,iDataColumn:c,oSettings:a,aData:a.aoData[b]._aData,mDataProp:d.mDataProp},w(a,b,c,"display"))}function ca(a,b){var c=a.aoData[b],d;if(null===c.nTr){c.nTr=l.createElement("tr");c.nTr._DT_RowIndex=b;if(c._aData.DT_RowId)c.nTr.id=c._aData.DT_RowId;c._aData.DT_RowClass&&h(c.nTr).addClass(c._aData.DT_RowClass);for(var f=0,g=a.aoColumns.length;f<g;f++){var i=a.aoColumns[f];
d=l.createElement(i.sCellType);d.innerHTML="function"===typeof i.fnRender&&(!i.bUseRendered||null===i.mDataProp)?R(a,b,f):w(a,b,f,"display");if(null!==i.sClass)d.className=i.sClass;i.bVisible?(c.nTr.appendChild(d),c._anHidden[f]=null):c._anHidden[f]=d;i.fnCreatedCell&&i.fnCreatedCell.call(a.oInstance,d,w(a,b,f,"display"),c._aData,b,f)}D(a,"aoRowCreatedCallback",null,[c.nTr,c._aData,b])}}function va(a){var b,c,d;if(0!==a.nTHead.getElementsByTagName("th").length)for(b=0,d=a.aoColumns.length;b<d;b++){if(c=
a.aoColumns[b].nTh,c.setAttribute("role","columnheader"),a.aoColumns[b].bSortable&&(c.setAttribute("tabindex",a.iTabIndex),c.setAttribute("aria-controls",a.sTableId)),null!==a.aoColumns[b].sClass&&h(c).addClass(a.aoColumns[b].sClass),a.aoColumns[b].sTitle!=c.innerHTML)c.innerHTML=a.aoColumns[b].sTitle}else{var f=l.createElement("tr");for(b=0,d=a.aoColumns.length;b<d;b++)c=a.aoColumns[b].nTh,c.innerHTML=a.aoColumns[b].sTitle,c.setAttribute("tabindex","0"),null!==a.aoColumns[b].sClass&&h(c).addClass(a.aoColumns[b].sClass),
f.appendChild(c);h(a.nTHead).html("")[0].appendChild(f);T(a.aoHeader,a.nTHead)}h(a.nTHead).children("tr").attr("role","row");if(a.bJUI)for(b=0,d=a.aoColumns.length;b<d;b++){c=a.aoColumns[b].nTh;f=l.createElement("div");f.className=a.oClasses.sSortJUIWrapper;h(c).contents().appendTo(f);var g=l.createElement("span");g.className=a.oClasses.sSortIcon;f.appendChild(g);c.appendChild(f)}if(a.oFeatures.bSort)for(b=0;b<a.aoColumns.length;b++)!1!==a.aoColumns[b].bSortable?ga(a,a.aoColumns[b].nTh,b):h(a.aoColumns[b].nTh).addClass(a.oClasses.sSortableNone);
""!==a.oClasses.sFooterTH&&h(a.nTFoot).children("tr").children("th").addClass(a.oClasses.sFooterTH);if(null!==a.nTFoot){c=O(a,null,a.aoFooter);for(b=0,d=a.aoColumns.length;b<d;b++)if(c[b])a.aoColumns[b].nTf=c[b],a.aoColumns[b].sClass&&h(c[b]).addClass(a.aoColumns[b].sClass)}}function U(a,b,c){var d,f,g,i=[],e=[],h=a.aoColumns.length,n;c===m&&(c=!1);for(d=0,f=b.length;d<f;d++){i[d]=b[d].slice();i[d].nTr=b[d].nTr;for(g=h-1;0<=g;g--)!a.aoColumns[g].bVisible&&!c&&i[d].splice(g,1);e.push([])}for(d=0,f=
i.length;d<f;d++){if(a=i[d].nTr)for(;g=a.firstChild;)a.removeChild(g);for(g=0,b=i[d].length;g<b;g++)if(n=h=1,e[d][g]===m){a.appendChild(i[d][g].cell);for(e[d][g]=1;i[d+h]!==m&&i[d][g].cell==i[d+h][g].cell;)e[d+h][g]=1,h++;for(;i[d][g+n]!==m&&i[d][g].cell==i[d][g+n].cell;){for(c=0;c<h;c++)e[d+c][g+n]=1;n++}i[d][g].cell.rowSpan=h;i[d][g].cell.colSpan=n}}}function z(a){var b,c,d=[],f=0,g=a.asStripeClasses.length;b=a.aoOpenRows.length;c=D(a,"aoPreDrawCallback","preDraw",[a]);if(-1!==h.inArray(!1,c))G(a,
!1);else{a.bDrawing=!0;if(a.iInitDisplayStart!==m&&-1!=a.iInitDisplayStart)a._iDisplayStart=a.oFeatures.bServerSide?a.iInitDisplayStart:a.iInitDisplayStart>=a.fnRecordsDisplay()?0:a.iInitDisplayStart,a.iInitDisplayStart=-1,B(a);if(a.bDeferLoading)a.bDeferLoading=!1,a.iDraw++;else if(a.oFeatures.bServerSide){if(!a.bDestroying&&!wa(a))return}else a.iDraw++;if(0!==a.aiDisplay.length){var i=a._iDisplayStart;c=a._iDisplayEnd;if(a.oFeatures.bServerSide)i=0,c=a.aoData.length;for(;i<c;i++){var e=a.aoData[a.aiDisplay[i]];
null===e.nTr&&ca(a,a.aiDisplay[i]);var j=e.nTr;if(0!==g){var n=a.asStripeClasses[f%g];if(e._sRowStripe!=n)h(j).removeClass(e._sRowStripe).addClass(n),e._sRowStripe=n}D(a,"aoRowCallback",null,[j,a.aoData[a.aiDisplay[i]]._aData,f,i]);d.push(j);f++;if(0!==b)for(e=0;e<b;e++)if(j==a.aoOpenRows[e].nParent){d.push(a.aoOpenRows[e].nTr);break}}}else{d[0]=l.createElement("tr");if(a.asStripeClasses[0])d[0].className=a.asStripeClasses[0];b=a.oLanguage;g=b.sZeroRecords;if(1==a.iDraw&&null!==a.sAjaxSource&&!a.oFeatures.bServerSide)g=
b.sLoadingRecords;else if(b.sEmptyTable&&0===a.fnRecordsTotal())g=b.sEmptyTable;b=l.createElement("td");b.setAttribute("valign","top");b.colSpan=v(a);b.className=a.oClasses.sRowEmpty;b.innerHTML=ha(a,g);d[f].appendChild(b)}D(a,"aoHeaderCallback","header",[h(a.nTHead).children("tr")[0],Y(a),a._iDisplayStart,a.fnDisplayEnd(),a.aiDisplay]);D(a,"aoFooterCallback","footer",[h(a.nTFoot).children("tr")[0],Y(a),a._iDisplayStart,a.fnDisplayEnd(),a.aiDisplay]);f=l.createDocumentFragment();b=l.createDocumentFragment();
if(a.nTBody){g=a.nTBody.parentNode;b.appendChild(a.nTBody);if(!a.oScroll.bInfinite||!a._bInitComplete||a.bSorted||a.bFiltered)for(;b=a.nTBody.firstChild;)a.nTBody.removeChild(b);for(b=0,c=d.length;b<c;b++)f.appendChild(d[b]);a.nTBody.appendChild(f);null!==g&&g.appendChild(a.nTBody)}D(a,"aoDrawCallback","draw",[a]);a.bSorted=!1;a.bFiltered=!1;a.bDrawing=!1;a.oFeatures.bServerSide&&(G(a,!1),a._bInitComplete||Z(a))}}function $(a){a.oFeatures.bSort?P(a,a.oPreviousSearch):a.oFeatures.bFilter?M(a,a.oPreviousSearch):
(B(a),z(a))}function xa(a){var b=h("<div></div>")[0];a.nTable.parentNode.insertBefore(b,a.nTable);a.nTableWrapper=h('<div id="'+a.sTableId+'_wrapper" class="'+a.oClasses.sWrapper+'" role="grid"></div>')[0];a.nTableReinsertBefore=a.nTable.nextSibling;for(var c=a.nTableWrapper,d=a.sDom.split(""),f,g,i,e,u,n,o,k=0;k<d.length;k++){g=0;i=d[k];if("<"==i){e=h("<div></div>")[0];u=d[k+1];if("'"==u||'"'==u){n="";for(o=2;d[k+o]!=u;)n+=d[k+o],o++;"H"==n?n="fg-toolbar ui-toolbar ui-widget-header ui-corner-tl ui-corner-tr ui-helper-clearfix":
"F"==n&&(n="fg-toolbar ui-toolbar ui-widget-header ui-corner-bl ui-corner-br ui-helper-clearfix");-1!=n.indexOf(".")?(u=n.split("."),e.id=u[0].substr(1,u[0].length-1),e.className=u[1]):"#"==n.charAt(0)?e.id=n.substr(1,n.length-1):e.className=n;k+=o}c.appendChild(e);c=e}else if(">"==i)c=c.parentNode;else if("l"==i&&a.oFeatures.bPaginate&&a.oFeatures.bLengthChange)f=ya(a),g=1;else if("f"==i&&a.oFeatures.bFilter)f=za(a),g=1;else if("r"==i&&a.oFeatures.bProcessing)f=Aa(a),g=1;else if("t"==i)f=Ba(a),g=
1;else if("i"==i&&a.oFeatures.bInfo)f=Ca(a),g=1;else if("p"==i&&a.oFeatures.bPaginate)f=Da(a),g=1;else if(0!==j.ext.aoFeatures.length){e=j.ext.aoFeatures;o=0;for(u=e.length;o<u;o++)if(i==e[o].cFeature){(f=e[o].fnInit(a))&&(g=1);break}}1==g&&null!==f&&("object"!==typeof a.aanFeatures[i]&&(a.aanFeatures[i]=[]),a.aanFeatures[i].push(f),c.appendChild(f))}b.parentNode.replaceChild(a.nTableWrapper,b)}function T(a,b){var c=h(b).children("tr"),d,f,g,i,e,j,n,o;a.splice(0,a.length);for(f=0,j=c.length;f<j;f++)a.push([]);
for(f=0,j=c.length;f<j;f++)for(g=0,n=c[f].childNodes.length;g<n;g++)if(d=c[f].childNodes[g],"TD"==d.nodeName.toUpperCase()||"TH"==d.nodeName.toUpperCase()){var k=1*d.getAttribute("colspan"),m=1*d.getAttribute("rowspan"),k=!k||0===k||1===k?1:k,m=!m||0===m||1===m?1:m;for(i=0;a[f][i];)i++;o=i;for(e=0;e<k;e++)for(i=0;i<m;i++)a[f+i][o+e]={cell:d,unique:1==k?!0:!1},a[f+i].nTr=c[f]}}function O(a,b,c){var d=[];if(!c)c=a.aoHeader,b&&(c=[],T(c,b));for(var b=0,f=c.length;b<f;b++)for(var g=0,i=c[b].length;g<
i;g++)if(c[b][g].unique&&(!d[g]||!a.bSortCellsTop))d[g]=c[b][g].cell;return d}function wa(a){if(a.bAjaxDataGet){a.iDraw++;G(a,!0);var b=Ea(a);ia(a,b);a.fnServerData.call(a.oInstance,a.sAjaxSource,b,function(b){Fa(a,b)},a);return!1}return!0}function Ea(a){var b=a.aoColumns.length,c=[],d,f,g,i;c.push({name:"sEcho",value:a.iDraw});c.push({name:"iColumns",value:b});c.push({name:"sColumns",value:y(a)});c.push({name:"iDisplayStart",value:a._iDisplayStart});c.push({name:"iDisplayLength",value:!1!==a.oFeatures.bPaginate?
a._iDisplayLength:-1});for(g=0;g<b;g++)d=a.aoColumns[g].mDataProp,c.push({name:"mDataProp_"+g,value:"function"===typeof d?"function":d});if(!1!==a.oFeatures.bFilter){c.push({name:"sSearch",value:a.oPreviousSearch.sSearch});c.push({name:"bRegex",value:a.oPreviousSearch.bRegex});for(g=0;g<b;g++)c.push({name:"sSearch_"+g,value:a.aoPreSearchCols[g].sSearch}),c.push({name:"bRegex_"+g,value:a.aoPreSearchCols[g].bRegex}),c.push({name:"bSearchable_"+g,value:a.aoColumns[g].bSearchable})}if(!1!==a.oFeatures.bSort){var e=
0;d=null!==a.aaSortingFixed?a.aaSortingFixed.concat(a.aaSorting):a.aaSorting.slice();for(g=0;g<d.length;g++){f=a.aoColumns[d[g][0]].aDataSort;for(i=0;i<f.length;i++)c.push({name:"iSortCol_"+e,value:f[i]}),c.push({name:"sSortDir_"+e,value:d[g][1]}),e++}c.push({name:"iSortingCols",value:e});for(g=0;g<b;g++)c.push({name:"bSortable_"+g,value:a.aoColumns[g].bSortable})}return c}function ia(a,b){D(a,"aoServerParams","serverParams",[b])}function Fa(a,b){if(b.sEcho!==m){if(1*b.sEcho<a.iDraw)return;a.iDraw=
1*b.sEcho}(!a.oScroll.bInfinite||a.oScroll.bInfinite&&(a.bSorted||a.bFiltered))&&ea(a);a._iRecordsTotal=parseInt(b.iTotalRecords,10);a._iRecordsDisplay=parseInt(b.iTotalDisplayRecords,10);var c=y(a),c=b.sColumns!==m&&""!==c&&b.sColumns!=c,d;c&&(d=E(a,b.sColumns));for(var f=W(a.sAjaxDataProp)(b),g=0,i=f.length;g<i;g++)if(c){for(var e=[],h=0,n=a.aoColumns.length;h<n;h++)e.push(f[g][d[h]]);H(a,e)}else H(a,f[g]);a.aiDisplay=a.aiDisplayMaster.slice();a.bAjaxDataGet=!1;z(a);a.bAjaxDataGet=!0;G(a,!1)}function za(a){var b=
a.oPreviousSearch,c=a.oLanguage.sSearch,c=-1!==c.indexOf("_INPUT_")?c.replace("_INPUT_",'<input type="text" />'):""===c?'<input type="text" />':c+' <input type="text" />',d=l.createElement("div");d.className=a.oClasses.sFilter;d.innerHTML="<label>"+c+"</label>";if(!a.aanFeatures.f)d.id=a.sTableId+"_filter";c=h('input[type="text"]',d);d._DT_Input=c[0];c.val(b.sSearch.replace('"',"&quot;"));c.bind("keyup.DT",function(){for(var c=a.aanFeatures.f,d=""===this.value?"":this.value,i=0,e=c.length;i<e;i++)c[i]!=
h(this).parents("div.dataTables_filter")[0]&&h(c[i]._DT_Input).val(d);d!=b.sSearch&&M(a,{sSearch:d,bRegex:b.bRegex,bSmart:b.bSmart,bCaseInsensitive:b.bCaseInsensitive})});c.attr("aria-controls",a.sTableId).bind("keypress.DT",function(a){if(13==a.keyCode)return!1});return d}function M(a,b,c){var d=a.oPreviousSearch,f=a.aoPreSearchCols,g=function(a){d.sSearch=a.sSearch;d.bRegex=a.bRegex;d.bSmart=a.bSmart;d.bCaseInsensitive=a.bCaseInsensitive};if(a.oFeatures.bServerSide)g(b);else{Ga(a,b.sSearch,c,b.bRegex,
b.bSmart,b.bCaseInsensitive);g(b);for(b=0;b<a.aoPreSearchCols.length;b++)Ha(a,f[b].sSearch,b,f[b].bRegex,f[b].bSmart,f[b].bCaseInsensitive);Ia(a)}a.bFiltered=!0;h(a.oInstance).trigger("filter",a);a._iDisplayStart=0;B(a);z(a);ja(a,0)}function Ia(a){for(var b=j.ext.afnFiltering,c=0,d=b.length;c<d;c++)for(var f=0,g=0,i=a.aiDisplay.length;g<i;g++){var e=a.aiDisplay[g-f];b[c](a,X(a,e,"filter"),e)||(a.aiDisplay.splice(g-f,1),f++)}}function Ha(a,b,c,d,f,g){if(""!==b)for(var i=0,b=ka(b,d,f,g),d=a.aiDisplay.length-
1;0<=d;d--)f=la(w(a,a.aiDisplay[d],c,"filter"),a.aoColumns[c].sType),b.test(f)||(a.aiDisplay.splice(d,1),i++)}function Ga(a,b,c,d,f,g){d=ka(b,d,f,g);f=a.oPreviousSearch;c||(c=0);0!==j.ext.afnFiltering.length&&(c=1);if(0>=b.length)a.aiDisplay.splice(0,a.aiDisplay.length),a.aiDisplay=a.aiDisplayMaster.slice();else if(a.aiDisplay.length==a.aiDisplayMaster.length||f.sSearch.length>b.length||1==c||0!==b.indexOf(f.sSearch)){a.aiDisplay.splice(0,a.aiDisplay.length);ja(a,1);for(b=0;b<a.aiDisplayMaster.length;b++)d.test(a.asDataSearch[b])&&
a.aiDisplay.push(a.aiDisplayMaster[b])}else for(b=c=0;b<a.asDataSearch.length;b++)d.test(a.asDataSearch[b])||(a.aiDisplay.splice(b-c,1),c++)}function ja(a,b){if(!a.oFeatures.bServerSide){a.asDataSearch.splice(0,a.asDataSearch.length);for(var c=b&&1===b?a.aiDisplayMaster:a.aiDisplay,d=0,f=c.length;d<f;d++)a.asDataSearch[d]=ma(a,X(a,c[d],"filter"))}}function ma(a,b){var c="";if(a.__nTmpFilter===m)a.__nTmpFilter=l.createElement("div");for(var d=a.__nTmpFilter,f=0,g=a.aoColumns.length;f<g;f++)a.aoColumns[f].bSearchable&&
(c+=la(b[f],a.aoColumns[f].sType)+"  ");if(-1!==c.indexOf("&"))d.innerHTML=c,c=d.textContent?d.textContent:d.innerText,c=c.replace(/\n/g," ").replace(/\r/g,"");return c}function ka(a,b,c,d){if(c)return a=b?a.split(" "):na(a).split(" "),a="^(?=.*?"+a.join(")(?=.*?")+").*$",RegExp(a,d?"i":"");a=b?a:na(a);return RegExp(a,d?"i":"")}function la(a,b){return"function"===typeof j.ext.ofnSearch[b]?j.ext.ofnSearch[b](a):null===a?"":"html"==b?a.replace(/[\r\n]/g," ").replace(/<.*?>/g,""):"string"===typeof a?
a.replace(/[\r\n]/g," "):a}function na(a){return a.replace(RegExp("(\\/|\\.|\\*|\\+|\\?|\\||\\(|\\)|\\[|\\]|\\{|\\}|\\\\|\\$|\\^)","g"),"\\$1")}function Ca(a){var b=l.createElement("div");b.className=a.oClasses.sInfo;if(!a.aanFeatures.i)a.aoDrawCallback.push({fn:Ja,sName:"information"}),b.id=a.sTableId+"_info";a.nTable.setAttribute("aria-describedby",a.sTableId+"_info");return b}function Ja(a){if(a.oFeatures.bInfo&&0!==a.aanFeatures.i.length){var b=a.oLanguage,c=a._iDisplayStart+1,d=a.fnDisplayEnd(),
f=a.fnRecordsTotal(),g=a.fnRecordsDisplay(),i;i=0===g&&g==f?b.sInfoEmpty:0===g?b.sInfoEmpty+" "+b.sInfoFiltered:g==f?b.sInfo:b.sInfo+" "+b.sInfoFiltered;i+=b.sInfoPostFix;i=ha(a,i);null!==b.fnInfoCallback&&(i=b.fnInfoCallback.call(a.oInstance,a,c,d,f,g,i));a=a.aanFeatures.i;b=0;for(c=a.length;b<c;b++)h(a[b]).html(i)}}function ha(a,b){var c=a.fnFormatNumber(a._iDisplayStart+1),d=a.fnDisplayEnd(),d=a.fnFormatNumber(d),f=a.fnRecordsDisplay(),f=a.fnFormatNumber(f),g=a.fnRecordsTotal(),g=a.fnFormatNumber(g);
a.oScroll.bInfinite&&(c=a.fnFormatNumber(1));return b.replace("_START_",c).replace("_END_",d).replace("_TOTAL_",f).replace("_MAX_",g)}function aa(a){var b,c,d=a.iInitDisplayStart;if(!1===a.bInitialised)setTimeout(function(){aa(a)},200);else{xa(a);va(a);U(a,a.aoHeader);a.nTFoot&&U(a,a.aoFooter);G(a,!0);a.oFeatures.bAutoWidth&&ba(a);for(b=0,c=a.aoColumns.length;b<c;b++)if(null!==a.aoColumns[b].sWidth)a.aoColumns[b].nTh.style.width=q(a.aoColumns[b].sWidth);a.oFeatures.bSort?P(a):a.oFeatures.bFilter?
M(a,a.oPreviousSearch):(a.aiDisplay=a.aiDisplayMaster.slice(),B(a),z(a));null!==a.sAjaxSource&&!a.oFeatures.bServerSide?(c=[],ia(a,c),a.fnServerData.call(a.oInstance,a.sAjaxSource,c,function(c){var g=""!==a.sAjaxDataProp?W(a.sAjaxDataProp)(c):c;for(b=0;b<g.length;b++)H(a,g[b]);a.iInitDisplayStart=d;a.oFeatures.bSort?P(a):(a.aiDisplay=a.aiDisplayMaster.slice(),B(a),z(a));G(a,!1);Z(a,c)},a)):a.oFeatures.bServerSide||(G(a,!1),Z(a))}}function Z(a,b){a._bInitComplete=!0;D(a,"aoInitComplete","init",[a,
b])}function oa(a){var b=j.defaults.oLanguage;!a.sEmptyTable&&a.sZeroRecords&&"No data available in table"===b.sEmptyTable&&p(a,a,"sZeroRecords","sEmptyTable");!a.sLoadingRecords&&a.sZeroRecords&&"Loading..."===b.sLoadingRecords&&p(a,a,"sZeroRecords","sLoadingRecords")}function ya(a){if(a.oScroll.bInfinite)return null;var b='<select size="1" '+('name="'+a.sTableId+'_length"')+">",c,d,f=a.aLengthMenu;if(2==f.length&&"object"===typeof f[0]&&"object"===typeof f[1])for(c=0,d=f[0].length;c<d;c++)b+='<option value="'+
f[0][c]+'">'+f[1][c]+"</option>";else for(c=0,d=f.length;c<d;c++)b+='<option value="'+f[c]+'">'+f[c]+"</option>";b+="</select>";f=l.createElement("div");if(!a.aanFeatures.l)f.id=a.sTableId+"_length";f.className=a.oClasses.sLength;f.innerHTML="<label>"+a.oLanguage.sLengthMenu.replace("_MENU_",b)+"</label>";h('select option[value="'+a._iDisplayLength+'"]',f).attr("selected",!0);h("select",f).bind("change.DT",function(){var b=h(this).val(),f=a.aanFeatures.l;for(c=0,d=f.length;c<d;c++)f[c]!=this.parentNode&&
h("select",f[c]).val(b);a._iDisplayLength=parseInt(b,10);B(a);if(a.fnDisplayEnd()==a.fnRecordsDisplay()&&(a._iDisplayStart=a.fnDisplayEnd()-a._iDisplayLength,0>a._iDisplayStart))a._iDisplayStart=0;if(-1==a._iDisplayLength)a._iDisplayStart=0;z(a)});h("select",f).attr("aria-controls",a.sTableId);return f}function B(a){a._iDisplayEnd=!1===a.oFeatures.bPaginate?a.aiDisplay.length:a._iDisplayStart+a._iDisplayLength>a.aiDisplay.length||-1==a._iDisplayLength?a.aiDisplay.length:a._iDisplayStart+a._iDisplayLength}
function Da(a){if(a.oScroll.bInfinite)return null;var b=l.createElement("div");b.className=a.oClasses.sPaging+a.sPaginationType;j.ext.oPagination[a.sPaginationType].fnInit(a,b,function(a){B(a);z(a)});a.aanFeatures.p||a.aoDrawCallback.push({fn:function(a){j.ext.oPagination[a.sPaginationType].fnUpdate(a,function(a){B(a);z(a)})},sName:"pagination"});return b}function pa(a,b){var c=a._iDisplayStart;if("number"===typeof b){if(a._iDisplayStart=b*a._iDisplayLength,a._iDisplayStart>a.fnRecordsDisplay())a._iDisplayStart=
0}else if("first"==b)a._iDisplayStart=0;else if("previous"==b){if(a._iDisplayStart=0<=a._iDisplayLength?a._iDisplayStart-a._iDisplayLength:0,0>a._iDisplayStart)a._iDisplayStart=0}else if("next"==b)0<=a._iDisplayLength?a._iDisplayStart+a._iDisplayLength<a.fnRecordsDisplay()&&(a._iDisplayStart+=a._iDisplayLength):a._iDisplayStart=0;else if("last"==b)if(0<=a._iDisplayLength){var d=parseInt((a.fnRecordsDisplay()-1)/a._iDisplayLength,10)+1;a._iDisplayStart=(d-1)*a._iDisplayLength}else a._iDisplayStart=
0;else F(a,0,"Unknown paging action: "+b);h(a.oInstance).trigger("page",a);return c!=a._iDisplayStart}function Aa(a){var b=l.createElement("div");if(!a.aanFeatures.r)b.id=a.sTableId+"_processing";b.innerHTML=a.oLanguage.sProcessing;b.className=a.oClasses.sProcessing;a.nTable.parentNode.insertBefore(b,a.nTable);return b}function G(a,b){if(a.oFeatures.bProcessing)for(var c=a.aanFeatures.r,d=0,f=c.length;d<f;d++)c[d].style.visibility=b?"visible":"hidden";h(a.oInstance).trigger("processing",[a,b])}function Ba(a){if(""===
a.oScroll.sX&&""===a.oScroll.sY)return a.nTable;var b=l.createElement("div"),c=l.createElement("div"),d=l.createElement("div"),f=l.createElement("div"),g=l.createElement("div"),i=l.createElement("div"),e=a.nTable.cloneNode(!1),j=a.nTable.cloneNode(!1),n=a.nTable.getElementsByTagName("thead")[0],o=0===a.nTable.getElementsByTagName("tfoot").length?null:a.nTable.getElementsByTagName("tfoot")[0],k=a.oClasses;c.appendChild(d);g.appendChild(i);f.appendChild(a.nTable);b.appendChild(c);b.appendChild(f);d.appendChild(e);
e.appendChild(n);null!==o&&(b.appendChild(g),i.appendChild(j),j.appendChild(o));b.className=k.sScrollWrapper;c.className=k.sScrollHead;d.className=k.sScrollHeadInner;f.className=k.sScrollBody;g.className=k.sScrollFoot;i.className=k.sScrollFootInner;if(a.oScroll.bAutoCss)c.style.overflow="hidden",c.style.position="relative",g.style.overflow="hidden",f.style.overflow="auto";c.style.border="0";c.style.width="100%";g.style.border="0";d.style.width=""!==a.oScroll.sXInner?a.oScroll.sXInner:"100%";e.removeAttribute("id");
e.style.marginLeft="0";a.nTable.style.marginLeft="0";if(null!==o)j.removeAttribute("id"),j.style.marginLeft="0";d=h(a.nTable).children("caption");0<d.length&&(d=d[0],"top"===d._captionSide?e.appendChild(d):"bottom"===d._captionSide&&o&&j.appendChild(d));if(""!==a.oScroll.sX){c.style.width=q(a.oScroll.sX);f.style.width=q(a.oScroll.sX);if(null!==o)g.style.width=q(a.oScroll.sX);h(f).scroll(function(){c.scrollLeft=this.scrollLeft;if(null!==o)g.scrollLeft=this.scrollLeft})}if(""!==a.oScroll.sY)f.style.height=
q(a.oScroll.sY);a.aoDrawCallback.push({fn:Ka,sName:"scrolling"});a.oScroll.bInfinite&&h(f).scroll(function(){!a.bDrawing&&0!==h(this).scrollTop()&&h(this).scrollTop()+h(this).height()>h(a.nTable).height()-a.oScroll.iLoadGap&&a.fnDisplayEnd()<a.fnRecordsDisplay()&&(pa(a,"next"),B(a),z(a))});a.nScrollHead=c;a.nScrollFoot=g;return b}function Ka(a){var b=a.nScrollHead.getElementsByTagName("div")[0],c=b.getElementsByTagName("table")[0],d=a.nTable.parentNode,f,g,i,e,j,n,o,k,m=[],s=null!==a.nTFoot?a.nScrollFoot.getElementsByTagName("div")[0]:
null,p=null!==a.nTFoot?s.getElementsByTagName("table")[0]:null,l=h.browser.msie&&7>=h.browser.version;h(a.nTable).children("thead, tfoot").remove();i=h(a.nTHead).clone()[0];a.nTable.insertBefore(i,a.nTable.childNodes[0]);null!==a.nTFoot&&(j=h(a.nTFoot).clone()[0],a.nTable.insertBefore(j,a.nTable.childNodes[1]));if(""===a.oScroll.sX)d.style.width="100%",b.parentNode.style.width="100%";var r=O(a,i);for(f=0,g=r.length;f<g;f++)o=x(a,f),r[f].style.width=a.aoColumns[o].sWidth;null!==a.nTFoot&&N(function(a){a.style.width=
""},j.getElementsByTagName("tr"));if(a.oScroll.bCollapse&&""!==a.oScroll.sY)d.style.height=d.offsetHeight+a.nTHead.offsetHeight+"px";f=h(a.nTable).outerWidth();if(""===a.oScroll.sX){if(a.nTable.style.width="100%",l&&(h("tbody",d).height()>d.offsetHeight||"scroll"==h(d).css("overflow-y")))a.nTable.style.width=q(h(a.nTable).outerWidth()-a.oScroll.iBarWidth)}else if(""!==a.oScroll.sXInner)a.nTable.style.width=q(a.oScroll.sXInner);else if(f==h(d).width()&&h(d).height()<h(a.nTable).height()){if(a.nTable.style.width=
q(f-a.oScroll.iBarWidth),h(a.nTable).outerWidth()>f-a.oScroll.iBarWidth)a.nTable.style.width=q(f)}else a.nTable.style.width=q(f);f=h(a.nTable).outerWidth();g=a.nTHead.getElementsByTagName("tr");i=i.getElementsByTagName("tr");N(function(a,b){n=a.style;n.paddingTop="0";n.paddingBottom="0";n.borderTopWidth="0";n.borderBottomWidth="0";n.height=0;k=h(a).width();b.style.width=q(k);m.push(k)},i,g);h(i).height(0);null!==a.nTFoot&&(e=j.getElementsByTagName("tr"),j=a.nTFoot.getElementsByTagName("tr"),N(function(a,
b){n=a.style;n.paddingTop="0";n.paddingBottom="0";n.borderTopWidth="0";n.borderBottomWidth="0";n.height=0;k=h(a).width();b.style.width=q(k);m.push(k)},e,j),h(e).height(0));N(function(a){a.innerHTML="";a.style.width=q(m.shift())},i);null!==a.nTFoot&&N(function(a){a.innerHTML="";a.style.width=q(m.shift())},e);if(h(a.nTable).outerWidth()<f){e=d.scrollHeight>d.offsetHeight||"scroll"==h(d).css("overflow-y")?f+a.oScroll.iBarWidth:f;if(l&&(d.scrollHeight>d.offsetHeight||"scroll"==h(d).css("overflow-y")))a.nTable.style.width=
q(e-a.oScroll.iBarWidth);d.style.width=q(e);b.parentNode.style.width=q(e);if(null!==a.nTFoot)s.parentNode.style.width=q(e);""===a.oScroll.sX?F(a,1,"The table cannot fit into the current element which will cause column misalignment. The table has been drawn at its minimum possible width."):""!==a.oScroll.sXInner&&F(a,1,"The table cannot fit into the current element which will cause column misalignment. Increase the sScrollXInner value or remove it to allow automatic calculation")}else if(d.style.width=
q("100%"),b.parentNode.style.width=q("100%"),null!==a.nTFoot)s.parentNode.style.width=q("100%");if(""===a.oScroll.sY&&l)d.style.height=q(a.nTable.offsetHeight+a.oScroll.iBarWidth);if(""!==a.oScroll.sY&&a.oScroll.bCollapse&&(d.style.height=q(a.oScroll.sY),l=""!==a.oScroll.sX&&a.nTable.offsetWidth>d.offsetWidth?a.oScroll.iBarWidth:0,a.nTable.offsetHeight<d.offsetHeight))d.style.height=q(a.nTable.offsetHeight+l);l=h(a.nTable).outerWidth();c.style.width=q(l);b.style.width=q(l);c=h(a.nTable).height()>
d.clientHeight||"scroll"==h(d).css("overflow-y");b.style.paddingRight=c?a.oScroll.iBarWidth+"px":"0px";if(null!==a.nTFoot)p.style.width=q(l),s.style.width=q(l),s.style.paddingRight=c?a.oScroll.iBarWidth+"px":"0px";h(d).scroll();if(a.bSorted||a.bFiltered)d.scrollTop=0}function N(a,b,c){for(var d=0,f=b.length;d<f;d++)for(var g=0,i=b[d].childNodes.length;g<i;g++)1==b[d].childNodes[g].nodeType&&(c?a(b[d].childNodes[g],c[d].childNodes[g]):a(b[d].childNodes[g]))}function La(a,b){if(!a||null===a||""===a)return 0;
b||(b=l.getElementsByTagName("body")[0]);var c,d=l.createElement("div");d.style.width=q(a);b.appendChild(d);c=d.offsetWidth;b.removeChild(d);return c}function ba(a){var b=0,c,d=0,f=a.aoColumns.length,g,i=h("th",a.nTHead),e=a.nTable.getAttribute("width");for(g=0;g<f;g++)if(a.aoColumns[g].bVisible&&(d++,null!==a.aoColumns[g].sWidth)){c=La(a.aoColumns[g].sWidthOrig,a.nTable.parentNode);if(null!==c)a.aoColumns[g].sWidth=q(c);b++}if(f==i.length&&0===b&&d==f&&""===a.oScroll.sX&&""===a.oScroll.sY)for(g=
0;g<a.aoColumns.length;g++){if(c=h(i[g]).width(),null!==c)a.aoColumns[g].sWidth=q(c)}else{b=a.nTable.cloneNode(!1);g=a.nTHead.cloneNode(!0);d=l.createElement("tbody");c=l.createElement("tr");b.removeAttribute("id");b.appendChild(g);null!==a.nTFoot&&(b.appendChild(a.nTFoot.cloneNode(!0)),N(function(a){a.style.width=""},b.getElementsByTagName("tr")));b.appendChild(d);d.appendChild(c);d=h("thead th",b);0===d.length&&(d=h("tbody tr:eq(0)>td",b));i=O(a,g);for(g=d=0;g<f;g++){var j=a.aoColumns[g];j.bVisible&&
null!==j.sWidthOrig&&""!==j.sWidthOrig?i[g-d].style.width=q(j.sWidthOrig):j.bVisible?i[g-d].style.width="":d++}for(g=0;g<f;g++)a.aoColumns[g].bVisible&&(d=Ma(a,g),null!==d&&(d=d.cloneNode(!0),""!==a.aoColumns[g].sContentPadding&&(d.innerHTML+=a.aoColumns[g].sContentPadding),c.appendChild(d)));f=a.nTable.parentNode;f.appendChild(b);if(""!==a.oScroll.sX&&""!==a.oScroll.sXInner)b.style.width=q(a.oScroll.sXInner);else if(""!==a.oScroll.sX){if(b.style.width="",h(b).width()<f.offsetWidth)b.style.width=
q(f.offsetWidth)}else if(""!==a.oScroll.sY)b.style.width=q(f.offsetWidth);else if(e)b.style.width=q(e);b.style.visibility="hidden";Na(a,b);f=h("tbody tr:eq(0)",b).children();0===f.length&&(f=O(a,h("thead",b)[0]));if(""!==a.oScroll.sX){for(g=d=c=0;g<a.aoColumns.length;g++)a.aoColumns[g].bVisible&&(c=null===a.aoColumns[g].sWidthOrig?c+h(f[d]).outerWidth():c+(parseInt(a.aoColumns[g].sWidth.replace("px",""),10)+(h(f[d]).outerWidth()-h(f[d]).width())),d++);b.style.width=q(c);a.nTable.style.width=q(c)}for(g=
d=0;g<a.aoColumns.length;g++)if(a.aoColumns[g].bVisible){c=h(f[d]).width();if(null!==c&&0<c)a.aoColumns[g].sWidth=q(c);d++}f=h(b).css("width");a.nTable.style.width=-1!==f.indexOf("%")?f:q(h(b).outerWidth());b.parentNode.removeChild(b)}if(e)a.nTable.style.width=q(e)}function Na(a,b){if(""===a.oScroll.sX&&""!==a.oScroll.sY)h(b).width(),b.style.width=q(h(b).outerWidth()-a.oScroll.iBarWidth);else if(""!==a.oScroll.sX)b.style.width=q(h(b).outerWidth())}function Ma(a,b){var c=Oa(a,b);if(0>c)return null;
if(null===a.aoData[c].nTr){var d=l.createElement("td");d.innerHTML=w(a,c,b,"");return d}return L(a,c)[b]}function Oa(a,b){for(var c=-1,d=-1,f=0;f<a.aoData.length;f++){var g=w(a,f,b,"display")+"",g=g.replace(/<.*?>/g,"");if(g.length>c)c=g.length,d=f}return d}function q(a){if(null===a)return"0px";if("number"==typeof a)return 0>a?"0px":a+"px";var b=a.charCodeAt(a.length-1);return 48>b||57<b?a:a+"px"}function Pa(){var a=l.createElement("p"),b=a.style;b.width="100%";b.height="200px";b.padding="0px";var c=
l.createElement("div"),b=c.style;b.position="absolute";b.top="0px";b.left="0px";b.visibility="hidden";b.width="200px";b.height="150px";b.padding="0px";b.overflow="hidden";c.appendChild(a);l.body.appendChild(c);b=a.offsetWidth;c.style.overflow="scroll";a=a.offsetWidth;if(b==a)a=c.clientWidth;l.body.removeChild(c);return b-a}function P(a,b){var c,d,f,g,i,e,o=[],n=[],k=j.ext.oSort,s=a.aoData,l=a.aoColumns,p=a.oLanguage.oAria;if(!a.oFeatures.bServerSide&&(0!==a.aaSorting.length||null!==a.aaSortingFixed)){o=
null!==a.aaSortingFixed?a.aaSortingFixed.concat(a.aaSorting):a.aaSorting.slice();for(c=0;c<o.length;c++)if(d=o[c][0],f=r(a,d),g=a.aoColumns[d].sSortDataType,j.ext.afnSortData[g])if(i=j.ext.afnSortData[g].call(a.oInstance,a,d,f),i.length===s.length)for(f=0,g=s.length;f<g;f++)I(a,f,d,i[f]);else F(a,0,"Returned data sort array (col "+d+") is the wrong length");for(c=0,d=a.aiDisplayMaster.length;c<d;c++)n[a.aiDisplayMaster[c]]=c;var q=o.length,x;for(c=0,d=s.length;c<d;c++)for(f=0;f<q;f++){x=l[o[f][0]].aDataSort;
for(i=0,e=x.length;i<e;i++)g=l[x[i]].sType,g=k[(g?g:"string")+"-pre"],s[c]._aSortData[x[i]]=g?g(w(a,c,x[i],"sort")):w(a,c,x[i],"sort")}a.aiDisplayMaster.sort(function(a,b){var c,d,f,g,i;for(c=0;c<q;c++){i=l[o[c][0]].aDataSort;for(d=0,f=i.length;d<f;d++)if(g=l[i[d]].sType,g=k[(g?g:"string")+"-"+o[c][1]](s[a]._aSortData[i[d]],s[b]._aSortData[i[d]]),0!==g)return g}return k["numeric-asc"](n[a],n[b])})}(b===m||b)&&!a.oFeatures.bDeferRender&&Q(a);for(c=0,d=a.aoColumns.length;c<d;c++)g=l[c].sTitle.replace(/<.*?>/g,
""),f=l[c].nTh,f.removeAttribute("aria-sort"),f.removeAttribute("aria-label"),l[c].bSortable?0<o.length&&o[0][0]==c?(f.setAttribute("aria-sort","asc"==o[0][1]?"ascending":"descending"),f.setAttribute("aria-label",g+("asc"==(l[c].asSorting[o[0][2]+1]?l[c].asSorting[o[0][2]+1]:l[c].asSorting[0])?p.sSortAscending:p.sSortDescending))):f.setAttribute("aria-label",g+("asc"==l[c].asSorting[0]?p.sSortAscending:p.sSortDescending)):f.setAttribute("aria-label",g);a.bSorted=!0;h(a.oInstance).trigger("sort",a);
a.oFeatures.bFilter?M(a,a.oPreviousSearch,1):(a.aiDisplay=a.aiDisplayMaster.slice(),a._iDisplayStart=0,B(a),z(a))}function ga(a,b,c,d){Qa(b,{},function(b){if(!1!==a.aoColumns[c].bSortable){var g=function(){var d,g;if(b.shiftKey){for(var e=!1,h=0;h<a.aaSorting.length;h++)if(a.aaSorting[h][0]==c){e=!0;d=a.aaSorting[h][0];g=a.aaSorting[h][2]+1;a.aoColumns[d].asSorting[g]?(a.aaSorting[h][1]=a.aoColumns[d].asSorting[g],a.aaSorting[h][2]=g):a.aaSorting.splice(h,1);break}!1===e&&a.aaSorting.push([c,a.aoColumns[c].asSorting[0],
0])}else 1==a.aaSorting.length&&a.aaSorting[0][0]==c?(d=a.aaSorting[0][0],g=a.aaSorting[0][2]+1,a.aoColumns[d].asSorting[g]||(g=0),a.aaSorting[0][1]=a.aoColumns[d].asSorting[g],a.aaSorting[0][2]=g):(a.aaSorting.splice(0,a.aaSorting.length),a.aaSorting.push([c,a.aoColumns[c].asSorting[0],0]));P(a)};a.oFeatures.bProcessing?(G(a,!0),setTimeout(function(){g();a.oFeatures.bServerSide||G(a,!1)},0)):g();"function"==typeof d&&d(a)}})}function Q(a){var b,c,d,f,g,e=a.aoColumns.length,j=a.oClasses;for(b=0;b<
e;b++)a.aoColumns[b].bSortable&&h(a.aoColumns[b].nTh).removeClass(j.sSortAsc+" "+j.sSortDesc+" "+a.aoColumns[b].sSortingClass);f=null!==a.aaSortingFixed?a.aaSortingFixed.concat(a.aaSorting):a.aaSorting.slice();for(b=0;b<a.aoColumns.length;b++)if(a.aoColumns[b].bSortable){g=a.aoColumns[b].sSortingClass;d=-1;for(c=0;c<f.length;c++)if(f[c][0]==b){g="asc"==f[c][1]?j.sSortAsc:j.sSortDesc;d=c;break}h(a.aoColumns[b].nTh).addClass(g);a.bJUI&&(c=h("span."+j.sSortIcon,a.aoColumns[b].nTh),c.removeClass(j.sSortJUIAsc+
" "+j.sSortJUIDesc+" "+j.sSortJUI+" "+j.sSortJUIAscAllowed+" "+j.sSortJUIDescAllowed),c.addClass(-1==d?a.aoColumns[b].sSortingClassJUI:"asc"==f[d][1]?j.sSortJUIAsc:j.sSortJUIDesc))}else h(a.aoColumns[b].nTh).addClass(a.aoColumns[b].sSortingClass);g=j.sSortColumn;if(a.oFeatures.bSort&&a.oFeatures.bSortClasses){d=L(a);if(a.oFeatures.bDeferRender)h(d).removeClass(g+"1 "+g+"2 "+g+"3");else if(d.length>=e)for(b=0;b<e;b++)if(-1!=d[b].className.indexOf(g+"1"))for(c=0,a=d.length/e;c<a;c++)d[e*c+b].className=
h.trim(d[e*c+b].className.replace(g+"1",""));else if(-1!=d[b].className.indexOf(g+"2"))for(c=0,a=d.length/e;c<a;c++)d[e*c+b].className=h.trim(d[e*c+b].className.replace(g+"2",""));else if(-1!=d[b].className.indexOf(g+"3"))for(c=0,a=d.length/e;c<a;c++)d[e*c+b].className=h.trim(d[e*c+b].className.replace(" "+g+"3",""));var j=1,o;for(b=0;b<f.length;b++){o=parseInt(f[b][0],10);for(c=0,a=d.length/e;c<a;c++)d[e*c+o].className+=" "+g+j;3>j&&j++}}}function qa(a){if(a.oFeatures.bStateSave&&!a.bDestroying){var b,
c;b=a.oScroll.bInfinite;var d={iCreate:(new Date).getTime(),iStart:b?0:a._iDisplayStart,iEnd:b?a._iDisplayLength:a._iDisplayEnd,iLength:a._iDisplayLength,aaSorting:h.extend(!0,[],a.aaSorting),oSearch:h.extend(!0,{},a.oPreviousSearch),aoSearchCols:h.extend(!0,[],a.aoPreSearchCols),abVisCols:[]};for(b=0,c=a.aoColumns.length;b<c;b++)d.abVisCols.push(a.aoColumns[b].bVisible);D(a,"aoStateSaveParams","stateSaveParams",[a,d]);a.fnStateSave.call(a.oInstance,a,d)}}function Ra(a,b){if(a.oFeatures.bStateSave){var c=
a.fnStateLoad.call(a.oInstance,a);if(c){var d=D(a,"aoStateLoadParams","stateLoadParams",[a,c]);if(-1===h.inArray(!1,d)){a.oLoadedState=h.extend(!0,{},c);a._iDisplayStart=c.iStart;a.iInitDisplayStart=c.iStart;a._iDisplayEnd=c.iEnd;a._iDisplayLength=c.iLength;a.aaSorting=c.aaSorting.slice();a.saved_aaSorting=c.aaSorting.slice();h.extend(a.oPreviousSearch,c.oSearch);h.extend(!0,a.aoPreSearchCols,c.aoSearchCols);b.saved_aoColumns=[];for(d=0;d<c.abVisCols.length;d++)b.saved_aoColumns[d]={},b.saved_aoColumns[d].bVisible=
c.abVisCols[d];D(a,"aoStateLoaded","stateLoaded",[a,c])}}}}function Sa(a){for(var b=V.location.pathname.split("/"),a=a+"_"+b[b.length-1].replace(/[\/:]/g,"").toLowerCase()+"=",b=l.cookie.split(";"),c=0;c<b.length;c++){for(var d=b[c];" "==d.charAt(0);)d=d.substring(1,d.length);if(0===d.indexOf(a))return decodeURIComponent(d.substring(a.length,d.length))}return null}function t(a){for(var b=0;b<j.settings.length;b++)if(j.settings[b].nTable===a)return j.settings[b];return null}function S(a){for(var b=
[],a=a.aoData,c=0,d=a.length;c<d;c++)null!==a[c].nTr&&b.push(a[c].nTr);return b}function L(a,b){var c=[],d,f,g,e,h,j;f=0;var o=a.aoData.length;b!==m&&(f=b,o=b+1);for(g=f;g<o;g++)if(j=a.aoData[g],null!==j.nTr){f=[];for(e=0,h=j.nTr.childNodes.length;e<h;e++)d=j.nTr.childNodes[e].nodeName.toLowerCase(),("td"==d||"th"==d)&&f.push(j.nTr.childNodes[e]);d=0;for(e=0,h=a.aoColumns.length;e<h;e++)a.aoColumns[e].bVisible?c.push(f[e-d]):(c.push(j._anHidden[e]),d++)}return c}function F(a,b,c){a=null===a?"DataTables warning: "+
c:"DataTables warning (table id = '"+a.sTableId+"'): "+c;if(0===b)if("alert"==j.ext.sErrMode)alert(a);else throw Error(a);else V.console&&console.log&&console.log(a)}function p(a,b,c,d){d===m&&(d=c);b[c]!==m&&(a[d]=b[c])}function Ta(a,b){for(var c in b)b.hasOwnProperty(c)&&("object"===typeof e[c]&&!1===h.isArray(b[c])?h.extend(!0,a[c],b[c]):a[c]=b[c]);return a}function Qa(a,b,c){h(a).bind("click.DT",b,function(b){a.blur();c(b)}).bind("keypress.DT",b,function(a){13===a.which&&c(a)}).bind("selectstart.DT",
function(){return!1})}function C(a,b,c,d){c&&a[b].push({fn:c,sName:d})}function D(a,b,c,d){for(var b=a[b],f=[],g=b.length-1;0<=g;g--)f.push(b[g].fn.apply(a.oInstance,d));null!==c&&h(a.oInstance).trigger(c,d);return f}function Ua(a){return function(){var b=[t(this[j.ext.iApiIndex])].concat(Array.prototype.slice.call(arguments));return j.ext.oApi[a].apply(this,b)}}var Va=V.JSON?JSON.stringify:function(a){var b=typeof a;if("object"!==b||null===a)return"string"===b&&(a='"'+a+'"'),a+"";var c,d,f=[],g=
h.isArray(a);for(c in a)d=a[c],b=typeof d,"string"===b?d='"'+d+'"':"object"===b&&null!==d&&(d=Va(d)),f.push((g?"":'"'+c+'":')+d);return(g?"[":"{")+f+(g?"]":"}")};this.$=function(a,b){var c,d,f=[],g=t(this[j.ext.iApiIndex]);b||(b={});b=h.extend({},{filter:"none",order:"current",page:"all"},b);if("current"==b.page)for(c=g._iDisplayStart,d=g.fnDisplayEnd();c<d;c++)f.push(g.aoData[g.aiDisplay[c]].nTr);else if("current"==b.order&&"none"==b.filter)for(c=0,d=g.aiDisplayMaster.length;c<d;c++)f.push(g.aoData[g.aiDisplayMaster[c]].nTr);
else if("current"==b.order&&"applied"==b.filter)for(c=0,d=g.aiDisplay.length;c<d;c++)f.push(g.aoData[g.aiDisplay[c]].nTr);else if("original"==b.order&&"none"==b.filter)for(c=0,d=g.aoData.length;c<d;c++)f.push(g.aoData[c].nTr);else if("original"==b.order&&"applied"==b.filter)for(c=0,d=g.aoData.length;c<d;c++)-1!==h.inArray(c,g.aiDisplay)&&f.push(g.aoData[c].nTr);else F(g,1,"Unknown selection options");d=h(f);c=d.filter(a);d=d.find(a);return h([].concat(h.makeArray(c),h.makeArray(d)))};this._=function(a,
b){var c=[],d,f,g=this.$(a,b);for(d=0,f=g.length;d<f;d++)c.push(this.fnGetData(g[d]));return c};this.fnAddData=function(a,b){if(0===a.length)return[];var c=[],d,f=t(this[j.ext.iApiIndex]);if("object"===typeof a[0]&&null!==a[0])for(var g=0;g<a.length;g++){d=H(f,a[g]);if(-1==d)return c;c.push(d)}else{d=H(f,a);if(-1==d)return c;c.push(d)}f.aiDisplay=f.aiDisplayMaster.slice();(b===m||b)&&$(f);return c};this.fnAdjustColumnSizing=function(a){var b=t(this[j.ext.iApiIndex]);k(b);a===m||a?this.fnDraw(!1):
(""!==b.oScroll.sX||""!==b.oScroll.sY)&&this.oApi._fnScrollDraw(b)};this.fnClearTable=function(a){var b=t(this[j.ext.iApiIndex]);ea(b);(a===m||a)&&z(b)};this.fnClose=function(a){for(var b=t(this[j.ext.iApiIndex]),c=0;c<b.aoOpenRows.length;c++)if(b.aoOpenRows[c].nParent==a)return(a=b.aoOpenRows[c].nTr.parentNode)&&a.removeChild(b.aoOpenRows[c].nTr),b.aoOpenRows.splice(c,1),0;return 1};this.fnDeleteRow=function(a,b,c){var d=t(this[j.ext.iApiIndex]),f,g,a="object"===typeof a?K(d,a):a,e=d.aoData.splice(a,
1);for(f=0,g=d.aoData.length;f<g;f++)if(null!==d.aoData[f].nTr)d.aoData[f].nTr._DT_RowIndex=f;f=h.inArray(a,d.aiDisplay);d.asDataSearch.splice(f,1);fa(d.aiDisplayMaster,a);fa(d.aiDisplay,a);"function"===typeof b&&b.call(this,d,e);if(d._iDisplayStart>=d.aiDisplay.length&&(d._iDisplayStart-=d._iDisplayLength,0>d._iDisplayStart))d._iDisplayStart=0;if(c===m||c)B(d),z(d);return e};this.fnDestroy=function(a){var b=t(this[j.ext.iApiIndex]),c=b.nTableWrapper.parentNode,d=b.nTBody,f,g,a=a===m?!1:!0;b.bDestroying=
!0;D(b,"aoDestroyCallback","destroy",[b]);for(f=0,g=b.aoColumns.length;f<g;f++)!1===b.aoColumns[f].bVisible&&this.fnSetColumnVis(f,!0);h(b.nTableWrapper).find("*").andSelf().unbind(".DT");h("tbody>tr>td."+b.oClasses.sRowEmpty,b.nTable).parent().remove();b.nTable!=b.nTHead.parentNode&&(h(b.nTable).children("thead").remove(),b.nTable.appendChild(b.nTHead));b.nTFoot&&b.nTable!=b.nTFoot.parentNode&&(h(b.nTable).children("tfoot").remove(),b.nTable.appendChild(b.nTFoot));b.nTable.parentNode.removeChild(b.nTable);
h(b.nTableWrapper).remove();b.aaSorting=[];b.aaSortingFixed=[];Q(b);h(S(b)).removeClass(b.asStripeClasses.join(" "));h("th, td",b.nTHead).removeClass([b.oClasses.sSortable,b.oClasses.sSortableAsc,b.oClasses.sSortableDesc,b.oClasses.sSortableNone].join(" "));b.bJUI&&(h("th span."+b.oClasses.sSortIcon+", td span."+b.oClasses.sSortIcon,b.nTHead).remove(),h("th, td",b.nTHead).each(function(){var a=h("div."+b.oClasses.sSortJUIWrapper,this),c=a.contents();h(this).append(c);a.remove()}));!a&&b.nTableReinsertBefore?
c.insertBefore(b.nTable,b.nTableReinsertBefore):a||c.appendChild(b.nTable);for(f=0,g=b.aoData.length;f<g;f++)null!==b.aoData[f].nTr&&d.appendChild(b.aoData[f].nTr);if(!0===b.oFeatures.bAutoWidth)b.nTable.style.width=q(b.sDestroyWidth);h(d).children("tr:even").addClass(b.asDestroyStripes[0]);h(d).children("tr:odd").addClass(b.asDestroyStripes[1]);for(f=0,g=j.settings.length;f<g;f++)j.settings[f]==b&&j.settings.splice(f,1);b=null};this.fnDraw=function(a){var b=t(this[j.ext.iApiIndex]);!1===a?(B(b),
z(b)):$(b)};this.fnFilter=function(a,b,c,d,f,g){var e=t(this[j.ext.iApiIndex]);if(e.oFeatures.bFilter){if(c===m||null===c)c=!1;if(d===m||null===d)d=!0;if(f===m||null===f)f=!0;if(g===m||null===g)g=!0;if(b===m||null===b){if(M(e,{sSearch:a+"",bRegex:c,bSmart:d,bCaseInsensitive:g},1),f&&e.aanFeatures.f){b=e.aanFeatures.f;c=0;for(d=b.length;c<d;c++)h(b[c]._DT_Input).val(a)}}else h.extend(e.aoPreSearchCols[b],{sSearch:a+"",bRegex:c,bSmart:d,bCaseInsensitive:g}),M(e,e.oPreviousSearch,1)}};this.fnGetData=
function(a,b){var c=t(this[j.ext.iApiIndex]);if(a!==m){var d=a;if("object"===typeof a){var f=a.nodeName.toLowerCase();"tr"===f?d=K(c,a):"td"===f&&(d=K(c,a.parentNode),b=da(c,d,a))}return b!==m?w(c,d,b,""):c.aoData[d]!==m?c.aoData[d]._aData:null}return Y(c)};this.fnGetNodes=function(a){var b=t(this[j.ext.iApiIndex]);return a!==m?b.aoData[a]!==m?b.aoData[a].nTr:null:S(b)};this.fnGetPosition=function(a){var b=t(this[j.ext.iApiIndex]),c=a.nodeName.toUpperCase();if("TR"==c)return K(b,a);return"TD"==c||
"TH"==c?(c=K(b,a.parentNode),a=da(b,c,a),[c,r(b,a),a]):null};this.fnIsOpen=function(a){for(var b=t(this[j.ext.iApiIndex]),c=0;c<b.aoOpenRows.length;c++)if(b.aoOpenRows[c].nParent==a)return!0;return!1};this.fnOpen=function(a,b,c){var d=t(this[j.ext.iApiIndex]),f=S(d);if(-1!==h.inArray(a,f)){this.fnClose(a);var f=l.createElement("tr"),g=l.createElement("td");f.appendChild(g);g.className=c;g.colSpan=v(d);"string"===typeof b?g.innerHTML=b:h(g).html(b);b=h("tr",d.nTBody);-1!=h.inArray(a,b)&&h(f).insertAfter(a);
d.aoOpenRows.push({nTr:f,nParent:a});return f}};this.fnPageChange=function(a,b){var c=t(this[j.ext.iApiIndex]);pa(c,a);B(c);(b===m||b)&&z(c)};this.fnSetColumnVis=function(a,b,c){var d=t(this[j.ext.iApiIndex]),f,g,e=d.aoColumns,h=d.aoData,o,n;if(e[a].bVisible!=b){if(b){for(f=g=0;f<a;f++)e[f].bVisible&&g++;n=g>=v(d);if(!n)for(f=a;f<e.length;f++)if(e[f].bVisible){o=f;break}for(f=0,g=h.length;f<g;f++)null!==h[f].nTr&&(n?h[f].nTr.appendChild(h[f]._anHidden[a]):h[f].nTr.insertBefore(h[f]._anHidden[a],L(d,
f)[o]))}else for(f=0,g=h.length;f<g;f++)null!==h[f].nTr&&(o=L(d,f)[a],h[f]._anHidden[a]=o,o.parentNode.removeChild(o));e[a].bVisible=b;U(d,d.aoHeader);d.nTFoot&&U(d,d.aoFooter);for(f=0,g=d.aoOpenRows.length;f<g;f++)d.aoOpenRows[f].nTr.colSpan=v(d);if(c===m||c)k(d),z(d);qa(d)}};this.fnSettings=function(){return t(this[j.ext.iApiIndex])};this.fnSort=function(a){var b=t(this[j.ext.iApiIndex]);b.aaSorting=a;P(b)};this.fnSortListener=function(a,b,c){ga(t(this[j.ext.iApiIndex]),a,b,c)};this.fnUpdate=function(a,
b,c,d,f){var e=t(this[j.ext.iApiIndex]),b="object"===typeof b?K(e,b):b;if(e.__fnUpdateDeep===m&&h.isArray(a)&&"object"===typeof a){e.aoData[b]._aData=a.slice();e.__fnUpdateDeep=!0;for(c=0;c<e.aoColumns.length;c++)this.fnUpdate(w(e,b,c),b,c,!1,!1);e.__fnUpdateDeep=m}else if(e.__fnUpdateDeep===m&&null!==a&&"object"===typeof a){e.aoData[b]._aData=h.extend(!0,{},a);e.__fnUpdateDeep=!0;for(c=0;c<e.aoColumns.length;c++)this.fnUpdate(w(e,b,c),b,c,!1,!1);e.__fnUpdateDeep=m}else{I(e,b,c,a);var a=w(e,b,c,"display"),
i=e.aoColumns[c];null!==i.fnRender&&(a=R(e,b,c),i.bUseRendered&&I(e,b,c,a));if(null!==e.aoData[b].nTr)L(e,b)[c].innerHTML=a}c=h.inArray(b,e.aiDisplay);e.asDataSearch[c]=ma(e,X(e,b,"filter"));(f===m||f)&&k(e);(d===m||d)&&$(e);return 0};this.fnVersionCheck=j.ext.fnVersionCheck;this.oApi={_fnExternApiFunc:Ua,_fnInitialise:aa,_fnInitComplete:Z,_fnLanguageCompat:oa,_fnAddColumn:o,_fnColumnOptions:s,_fnAddData:H,_fnCreateTr:ca,_fnGatherData:ua,_fnBuildHead:va,_fnDrawHead:U,_fnDraw:z,_fnReDraw:$,_fnAjaxUpdate:wa,
_fnAjaxParameters:Ea,_fnAjaxUpdateDraw:Fa,_fnServerParams:ia,_fnAddOptionsHtml:xa,_fnFeatureHtmlTable:Ba,_fnScrollDraw:Ka,_fnAdjustColumnSizing:k,_fnFeatureHtmlFilter:za,_fnFilterComplete:M,_fnFilterCustom:Ia,_fnFilterColumn:Ha,_fnFilter:Ga,_fnBuildSearchArray:ja,_fnBuildSearchRow:ma,_fnFilterCreateSearch:ka,_fnDataToSearch:la,_fnSort:P,_fnSortAttachListener:ga,_fnSortingClasses:Q,_fnFeatureHtmlPaginate:Da,_fnPageChange:pa,_fnFeatureHtmlInfo:Ca,_fnUpdateInfo:Ja,_fnFeatureHtmlLength:ya,_fnFeatureHtmlProcessing:Aa,
_fnProcessingDisplay:G,_fnVisibleToColumnIndex:x,_fnColumnIndexToVisible:r,_fnNodeToDataIndex:K,_fnVisbleColumns:v,_fnCalculateEnd:B,_fnConvertToWidth:La,_fnCalculateColumnWidths:ba,_fnScrollingWidthAdjust:Na,_fnGetWidestNode:Ma,_fnGetMaxLenString:Oa,_fnStringToCss:q,_fnDetectType:A,_fnSettingsFromNode:t,_fnGetDataMaster:Y,_fnGetTrNodes:S,_fnGetTdNodes:L,_fnEscapeRegex:na,_fnDeleteIndex:fa,_fnReOrderIndex:E,_fnColumnOrdering:y,_fnLog:F,_fnClearTable:ea,_fnSaveState:qa,_fnLoadState:Ra,_fnCreateCookie:function(a,
b,c,d,e){var g=new Date;g.setTime(g.getTime()+1E3*c);var c=V.location.pathname.split("/"),a=a+"_"+c.pop().replace(/[\/:]/g,"").toLowerCase(),i;null!==e?(i="function"===typeof h.parseJSON?h.parseJSON(b):eval("("+b+")"),b=e(a,i,g.toGMTString(),c.join("/")+"/")):b=a+"="+encodeURIComponent(b)+"; expires="+g.toGMTString()+"; path="+c.join("/")+"/";e="";g=9999999999999;if(4096<(null!==Sa(a)?l.cookie.length:b.length+l.cookie.length)+10){for(var a=l.cookie.split(";"),j=0,o=a.length;j<o;j++)if(-1!=a[j].indexOf(d)){var k=
a[j].split("=");try{i=eval("("+decodeURIComponent(k[1])+")")}catch(m){continue}if(i.iCreate&&i.iCreate<g)e=k[0],g=i.iCreate}if(""!==e)l.cookie=e+"=; expires=Thu, 01-Jan-1970 00:00:01 GMT; path="+c.join("/")+"/"}l.cookie=b},_fnReadCookie:Sa,_fnDetectHeader:T,_fnGetUniqueThs:O,_fnScrollBarWidth:Pa,_fnApplyToChildren:N,_fnMap:p,_fnGetRowData:X,_fnGetCellData:w,_fnSetCellData:I,_fnGetObjectDataFn:W,_fnSetObjectDataFn:ta,_fnApplyColumnDefs:J,_fnBindAction:Qa,_fnExtend:Ta,_fnCallbackReg:C,_fnCallbackFire:D,
_fnJsonString:Va,_fnRender:R,_fnNodeToColumnIndex:da,_fnInfoMacros:ha};h.extend(j.ext.oApi,this.oApi);for(var ra in j.ext.oApi)ra&&(this[ra]=Ua(ra));var sa=this;return this.each(function(){var a=0,b,c,d;c=this.getAttribute("id");var f=!1,g=!1;if("table"!=this.nodeName.toLowerCase())F(null,0,"Attempted to initialise DataTables on a node which is not a table: "+this.nodeName);else{for(a=0,b=j.settings.length;a<b;a++){if(j.settings[a].nTable==this){if(e===m||e.bRetrieve)return j.settings[a].oInstance;
if(e.bDestroy){j.settings[a].oInstance.fnDestroy();break}else{F(j.settings[a],0,"Cannot reinitialise DataTable.\n\nTo retrieve the DataTables object for this table, pass no arguments or see the docs for bRetrieve and bDestroy");return}}if(j.settings[a].sTableId==this.id){j.settings.splice(a,1);break}}if(null===c||""===c)this.id=c="DataTables_Table_"+j.ext._oExternConfig.iNextUnique++;var i=h.extend(!0,{},j.models.oSettings,{nTable:this,oApi:sa.oApi,oInit:e,sDestroyWidth:h(this).width(),sInstance:c,
sTableId:c});j.settings.push(i);i.oInstance=1===sa.length?sa:h(this).dataTable();e||(e={});e.oLanguage&&oa(e.oLanguage);e=Ta(h.extend(!0,{},j.defaults),e);p(i.oFeatures,e,"bPaginate");p(i.oFeatures,e,"bLengthChange");p(i.oFeatures,e,"bFilter");p(i.oFeatures,e,"bSort");p(i.oFeatures,e,"bInfo");p(i.oFeatures,e,"bProcessing");p(i.oFeatures,e,"bAutoWidth");p(i.oFeatures,e,"bSortClasses");p(i.oFeatures,e,"bServerSide");p(i.oFeatures,e,"bDeferRender");p(i.oScroll,e,"sScrollX","sX");p(i.oScroll,e,"sScrollXInner",
"sXInner");p(i.oScroll,e,"sScrollY","sY");p(i.oScroll,e,"bScrollCollapse","bCollapse");p(i.oScroll,e,"bScrollInfinite","bInfinite");p(i.oScroll,e,"iScrollLoadGap","iLoadGap");p(i.oScroll,e,"bScrollAutoCss","bAutoCss");p(i,e,"asStripeClasses");p(i,e,"asStripClasses","asStripeClasses");p(i,e,"fnServerData");p(i,e,"fnFormatNumber");p(i,e,"sServerMethod");p(i,e,"aaSorting");p(i,e,"aaSortingFixed");p(i,e,"aLengthMenu");p(i,e,"sPaginationType");p(i,e,"sAjaxSource");p(i,e,"sAjaxDataProp");p(i,e,"iCookieDuration");
p(i,e,"sCookiePrefix");p(i,e,"sDom");p(i,e,"bSortCellsTop");p(i,e,"iTabIndex");p(i,e,"oSearch","oPreviousSearch");p(i,e,"aoSearchCols","aoPreSearchCols");p(i,e,"iDisplayLength","_iDisplayLength");p(i,e,"bJQueryUI","bJUI");p(i,e,"fnCookieCallback");p(i,e,"fnStateLoad");p(i,e,"fnStateSave");p(i.oLanguage,e,"fnInfoCallback");C(i,"aoDrawCallback",e.fnDrawCallback,"user");C(i,"aoServerParams",e.fnServerParams,"user");C(i,"aoStateSaveParams",e.fnStateSaveParams,"user");C(i,"aoStateLoadParams",e.fnStateLoadParams,
"user");C(i,"aoStateLoaded",e.fnStateLoaded,"user");C(i,"aoRowCallback",e.fnRowCallback,"user");C(i,"aoRowCreatedCallback",e.fnCreatedRow,"user");C(i,"aoHeaderCallback",e.fnHeaderCallback,"user");C(i,"aoFooterCallback",e.fnFooterCallback,"user");C(i,"aoInitComplete",e.fnInitComplete,"user");C(i,"aoPreDrawCallback",e.fnPreDrawCallback,"user");i.oFeatures.bServerSide&&i.oFeatures.bSort&&i.oFeatures.bSortClasses?C(i,"aoDrawCallback",Q,"server_side_sort_classes"):i.oFeatures.bDeferRender&&C(i,"aoDrawCallback",
Q,"defer_sort_classes");if(e.bJQueryUI){if(h.extend(i.oClasses,j.ext.oJUIClasses),e.sDom===j.defaults.sDom&&"lfrtip"===j.defaults.sDom)i.sDom='<"H"lfr>t<"F"ip>'}else h.extend(i.oClasses,j.ext.oStdClasses);h(this).addClass(i.oClasses.sTable);if(""!==i.oScroll.sX||""!==i.oScroll.sY)i.oScroll.iBarWidth=Pa();if(i.iInitDisplayStart===m)i.iInitDisplayStart=e.iDisplayStart,i._iDisplayStart=e.iDisplayStart;if(e.bStateSave)i.oFeatures.bStateSave=!0,Ra(i,e),C(i,"aoDrawCallback",qa,"state_save");if(null!==e.iDeferLoading)i.bDeferLoading=
!0,a=h.isArray(e.iDeferLoading),i._iRecordsDisplay=a?e.iDeferLoading[0]:e.iDeferLoading,i._iRecordsTotal=a?e.iDeferLoading[1]:e.iDeferLoading;null!==e.aaData&&(g=!0);""!==e.oLanguage.sUrl?(i.oLanguage.sUrl=e.oLanguage.sUrl,h.getJSON(i.oLanguage.sUrl,null,function(a){oa(a);h.extend(!0,i.oLanguage,e.oLanguage,a);aa(i)}),f=!0):h.extend(!0,i.oLanguage,e.oLanguage);if(null===e.asStripeClasses)i.asStripeClasses=[i.oClasses.sStripeOdd,i.oClasses.sStripeEven];c=!1;d=h(this).children("tbody").children("tr");
for(a=0,b=i.asStripeClasses.length;a<b;a++)if(d.filter(":lt(2)").hasClass(i.asStripeClasses[a])){c=!0;break}if(c)i.asDestroyStripes=["",""],h(d[0]).hasClass(i.oClasses.sStripeOdd)&&(i.asDestroyStripes[0]+=i.oClasses.sStripeOdd+" "),h(d[0]).hasClass(i.oClasses.sStripeEven)&&(i.asDestroyStripes[0]+=i.oClasses.sStripeEven),h(d[1]).hasClass(i.oClasses.sStripeOdd)&&(i.asDestroyStripes[1]+=i.oClasses.sStripeOdd+" "),h(d[1]).hasClass(i.oClasses.sStripeEven)&&(i.asDestroyStripes[1]+=i.oClasses.sStripeEven),
d.removeClass(i.asStripeClasses.join(" "));c=[];a=this.getElementsByTagName("thead");0!==a.length&&(T(i.aoHeader,a[0]),c=O(i));if(null===e.aoColumns){d=[];for(a=0,b=c.length;a<b;a++)d.push(null)}else d=e.aoColumns;for(a=0,b=d.length;a<b;a++){if(e.saved_aoColumns!==m&&e.saved_aoColumns.length==b)null===d[a]&&(d[a]={}),d[a].bVisible=e.saved_aoColumns[a].bVisible;o(i,c?c[a]:null)}J(i,e.aoColumnDefs,d,function(a,b){s(i,a,b)});for(a=0,b=i.aaSorting.length;a<b;a++){i.aaSorting[a][0]>=i.aoColumns.length&&
(i.aaSorting[a][0]=0);var k=i.aoColumns[i.aaSorting[a][0]];i.aaSorting[a][2]===m&&(i.aaSorting[a][2]=0);e.aaSorting===m&&i.saved_aaSorting===m&&(i.aaSorting[a][1]=k.asSorting[0]);for(c=0,d=k.asSorting.length;c<d;c++)if(i.aaSorting[a][1]==k.asSorting[c]){i.aaSorting[a][2]=c;break}}Q(i);a=h(this).children("caption").each(function(){this._captionSide=h(this).css("caption-side")});b=h(this).children("thead");0===b.length&&(b=[l.createElement("thead")],this.appendChild(b[0]));i.nTHead=b[0];b=h(this).children("tbody");
0===b.length&&(b=[l.createElement("tbody")],this.appendChild(b[0]));i.nTBody=b[0];i.nTBody.setAttribute("role","alert");i.nTBody.setAttribute("aria-live","polite");i.nTBody.setAttribute("aria-relevant","all");b=h(this).children("tfoot");if(0===b.length&&0<a.length&&(""!==i.oScroll.sX||""!==i.oScroll.sY))b=[l.createElement("tfoot")],this.appendChild(b[0]);if(0<b.length)i.nTFoot=b[0],T(i.aoFooter,i.nTFoot);if(g)for(a=0;a<e.aaData.length;a++)H(i,e.aaData[a]);else ua(i);i.aiDisplay=i.aiDisplayMaster.slice();
i.bInitialised=!0;!1===f&&aa(i)}})};j.fnVersionCheck=function(e){for(var h=function(e,h){for(;e.length<h;)e+="0";return e},m=j.ext.sVersion.split("."),e=e.split("."),k="",l="",r=0,v=e.length;r<v;r++)k+=h(m[r],3),l+=h(e[r],3);return parseInt(k,10)>=parseInt(l,10)};j.fnIsDataTable=function(e){for(var h=j.settings,m=0;m<h.length;m++)if(h[m].nTable===e||h[m].nScrollHead===e||h[m].nScrollFoot===e)return!0;return!1};j.fnTables=function(e){var o=[];jQuery.each(j.settings,function(j,k){(!e||!0===e&&h(k.nTable).is(":visible"))&&
o.push(k.nTable)});return o};j.version="1.9.1";j.settings=[];j.models={};j.models.ext={afnFiltering:[],afnSortData:[],aoFeatures:[],aTypes:[],fnVersionCheck:j.fnVersionCheck,iApiIndex:0,ofnSearch:{},oApi:{},oStdClasses:{},oJUIClasses:{},oPagination:{},oSort:{},sVersion:j.version,sErrMode:"alert",_oExternConfig:{iNextUnique:0}};j.models.oSearch={bCaseInsensitive:!0,sSearch:"",bRegex:!1,bSmart:!0};j.models.oRow={nTr:null,_aData:[],_aSortData:[],_anHidden:[],_sRowStripe:""};j.models.oColumn={aDataSort:null,
asSorting:null,bSearchable:null,bSortable:null,bUseRendered:null,bVisible:null,_bAutoType:!0,fnCreatedCell:null,fnGetData:null,fnRender:null,fnSetData:null,mDataProp:null,nTh:null,nTf:null,sClass:null,sContentPadding:null,sDefaultContent:null,sName:null,sSortDataType:"std",sSortingClass:null,sSortingClassJUI:null,sTitle:null,sType:null,sWidth:null,sWidthOrig:null};j.defaults={aaData:null,aaSorting:[[0,"asc"]],aaSortingFixed:null,aLengthMenu:[10,25,50,100],aoColumns:null,aoColumnDefs:null,aoSearchCols:[],
asStripeClasses:null,bAutoWidth:!0,bDeferRender:!1,bDestroy:!1,bFilter:!0,bInfo:!0,bJQueryUI:!1,bLengthChange:!0,bPaginate:!0,bProcessing:!1,bRetrieve:!1,bScrollAutoCss:!0,bScrollCollapse:!1,bScrollInfinite:!1,bServerSide:!1,bSort:!0,bSortCellsTop:!1,bSortClasses:!0,bStateSave:!1,fnCookieCallback:null,fnCreatedRow:null,fnDrawCallback:null,fnFooterCallback:null,fnFormatNumber:function(e){if(1E3>e)return e;for(var h=e+"",e=h.split(""),j="",h=h.length,k=0;k<h;k++)0===k%3&&0!==k&&(j=this.oLanguage.sInfoThousands+
j),j=e[h-k-1]+j;return j},fnHeaderCallback:null,fnInfoCallback:null,fnInitComplete:null,fnPreDrawCallback:null,fnRowCallback:null,fnServerData:function(e,j,m,k){k.jqXHR=h.ajax({url:e,data:j,success:function(e){h(k.oInstance).trigger("xhr",k);m(e)},dataType:"json",cache:!1,type:k.sServerMethod,error:function(e,h){"parsererror"==h&&k.oApi._fnLog(k,0,"DataTables warning: JSON data from server could not be parsed. This is caused by a JSON formatting error.")}})},fnServerParams:null,fnStateLoad:function(e){var e=
this.oApi._fnReadCookie(e.sCookiePrefix+e.sInstance),j;try{j="function"===typeof h.parseJSON?h.parseJSON(e):eval("("+e+")")}catch(m){j=null}return j},fnStateLoadParams:null,fnStateLoaded:null,fnStateSave:function(e,h){this.oApi._fnCreateCookie(e.sCookiePrefix+e.sInstance,this.oApi._fnJsonString(h),e.iCookieDuration,e.sCookiePrefix,e.fnCookieCallback)},fnStateSaveParams:null,iCookieDuration:7200,iDeferLoading:null,iDisplayLength:10,iDisplayStart:0,iScrollLoadGap:100,iTabIndex:1,oLanguage:{oAria:{sSortAscending:": activate to sort column ascending",
sSortDescending:": activate to sort column descending"},oPaginate:{sFirst:"First",sLast:"Last",sNext:"Next",sPrevious:"Previous"},sEmptyTable:"No data available in table",sInfo:"Showing _START_ to _END_ of _TOTAL_ entries",sInfoEmpty:"Showing 0 to 0 of 0 entries",sInfoFiltered:"(filtered from _MAX_ total entries)",sInfoPostFix:"",sInfoThousands:",",sLengthMenu:"Show _MENU_ entries",sLoadingRecords:"Loading...",sProcessing:"Processing...",sSearch:"Search:",sUrl:"",sZeroRecords:"No matching records found"},
oSearch:h.extend({},j.models.oSearch),sAjaxDataProp:"aaData",sAjaxSource:null,sCookiePrefix:"SpryMedia_DataTables_",sDom:"lfrtip",sPaginationType:"two_button",sScrollX:"",sScrollXInner:"",sScrollY:"",sServerMethod:"GET"};j.defaults.columns={aDataSort:null,asSorting:["asc","desc"],bSearchable:!0,bSortable:!0,bUseRendered:!0,bVisible:!0,fnCreatedCell:null,fnRender:null,iDataSort:-1,mDataProp:null,sCellType:"td",sClass:"",sContentPadding:"",sDefaultContent:null,sName:"",sSortDataType:"std",sTitle:null,
sType:null,sWidth:null};j.models.oSettings={oFeatures:{bAutoWidth:null,bDeferRender:null,bFilter:null,bInfo:null,bLengthChange:null,bPaginate:null,bProcessing:null,bServerSide:null,bSort:null,bSortClasses:null,bStateSave:null},oScroll:{bAutoCss:null,bCollapse:null,bInfinite:null,iBarWidth:0,iLoadGap:null,sX:null,sXInner:null,sY:null},oLanguage:{fnInfoCallback:null},aanFeatures:[],aoData:[],aiDisplay:[],aiDisplayMaster:[],aoColumns:[],aoHeader:[],aoFooter:[],asDataSearch:[],oPreviousSearch:{},aoPreSearchCols:[],
aaSorting:null,aaSortingFixed:null,asStripeClasses:null,asDestroyStripes:[],sDestroyWidth:0,aoRowCallback:[],aoHeaderCallback:[],aoFooterCallback:[],aoDrawCallback:[],aoRowCreatedCallback:[],aoPreDrawCallback:[],aoInitComplete:[],aoStateSaveParams:[],aoStateLoadParams:[],aoStateLoaded:[],sTableId:"",nTable:null,nTHead:null,nTFoot:null,nTBody:null,nTableWrapper:null,bDeferLoading:!1,bInitialised:!1,aoOpenRows:[],sDom:null,sPaginationType:"two_button",iCookieDuration:0,sCookiePrefix:"",fnCookieCallback:null,
aoStateSave:[],aoStateLoad:[],oLoadedState:null,sAjaxSource:null,sAjaxDataProp:null,bAjaxDataGet:!0,jqXHR:null,fnServerData:null,aoServerParams:[],sServerMethod:null,fnFormatNumber:null,aLengthMenu:null,iDraw:0,bDrawing:!1,iDrawError:-1,_iDisplayLength:10,_iDisplayStart:0,_iDisplayEnd:10,_iRecordsTotal:0,_iRecordsDisplay:0,bJUI:null,oClasses:{},bFiltered:!1,bSorted:!1,bSortCellsTop:null,oInit:null,aoDestroyCallback:[],fnRecordsTotal:function(){return this.oFeatures.bServerSide?parseInt(this._iRecordsTotal,
10):this.aiDisplayMaster.length},fnRecordsDisplay:function(){return this.oFeatures.bServerSide?parseInt(this._iRecordsDisplay,10):this.aiDisplay.length},fnDisplayEnd:function(){return this.oFeatures.bServerSide?!1===this.oFeatures.bPaginate||-1==this._iDisplayLength?this._iDisplayStart+this.aiDisplay.length:Math.min(this._iDisplayStart+this._iDisplayLength,this._iRecordsDisplay):this._iDisplayEnd},oInstance:null,sInstance:null,iTabIndex:1,nScrollHead:null,nScrollFoot:null};j.ext=h.extend(!0,{},j.models.ext);
h.extend(j.ext.oStdClasses,{sTable:"dataTable",sPagePrevEnabled:"paginate_enabled_previous",sPagePrevDisabled:"paginate_disabled_previous",sPageNextEnabled:"paginate_enabled_next",sPageNextDisabled:"paginate_disabled_next",sPageJUINext:"",sPageJUIPrev:"",sPageButton:"paginate_button",sPageButtonActive:"paginate_active",sPageButtonStaticDisabled:"paginate_button paginate_button_disabled",sPageFirst:"first",sPagePrevious:"previous",sPageNext:"next",sPageLast:"last",sStripeOdd:"odd",sStripeEven:"even",
sRowEmpty:"dataTables_empty",sWrapper:"dataTables_wrapper",sFilter:"dataTables_filter",sInfo:"dataTables_info",sPaging:"dataTables_paginate paging_",sLength:"dataTables_length",sProcessing:"dataTables_processing",sSortAsc:"sorting_asc",sSortDesc:"sorting_desc",sSortable:"sorting",sSortableAsc:"sorting_asc_disabled",sSortableDesc:"sorting_desc_disabled",sSortableNone:"sorting_disabled",sSortColumn:"sorting_",sSortJUIAsc:"",sSortJUIDesc:"",sSortJUI:"",sSortJUIAscAllowed:"",sSortJUIDescAllowed:"",sSortJUIWrapper:"",
sSortIcon:"",sScrollWrapper:"dataTables_scroll",sScrollHead:"dataTables_scrollHead",sScrollHeadInner:"dataTables_scrollHeadInner",sScrollBody:"dataTables_scrollBody",sScrollFoot:"dataTables_scrollFoot",sScrollFootInner:"dataTables_scrollFootInner",sFooterTH:""});h.extend(j.ext.oJUIClasses,j.ext.oStdClasses,{sPagePrevEnabled:"fg-button ui-button ui-state-default ui-corner-left",sPagePrevDisabled:"fg-button ui-button ui-state-default ui-corner-left ui-state-disabled",sPageNextEnabled:"fg-button ui-button ui-state-default ui-corner-right",
sPageNextDisabled:"fg-button ui-button ui-state-default ui-corner-right ui-state-disabled",sPageJUINext:"ui-icon ui-icon-circle-arrow-e",sPageJUIPrev:"ui-icon ui-icon-circle-arrow-w",sPageButton:"fg-button ui-button ui-state-default",sPageButtonActive:"fg-button ui-button ui-state-default ui-state-disabled",sPageButtonStaticDisabled:"fg-button ui-button ui-state-default ui-state-disabled",sPageFirst:"first ui-corner-tl ui-corner-bl",sPageLast:"last ui-corner-tr ui-corner-br",sPaging:"dataTables_paginate fg-buttonset ui-buttonset fg-buttonset-multi ui-buttonset-multi paging_",
sSortAsc:"ui-state-default",sSortDesc:"ui-state-default",sSortable:"ui-state-default",sSortableAsc:"ui-state-default",sSortableDesc:"ui-state-default",sSortableNone:"ui-state-default",sSortJUIAsc:"css_right ui-icon ui-icon-triangle-1-n",sSortJUIDesc:"css_right ui-icon ui-icon-triangle-1-s",sSortJUI:"css_right ui-icon ui-icon-carat-2-n-s",sSortJUIAscAllowed:"css_right ui-icon ui-icon-carat-1-n",sSortJUIDescAllowed:"css_right ui-icon ui-icon-carat-1-s",sSortJUIWrapper:"DataTables_sort_wrapper",sSortIcon:"DataTables_sort_icon",
sScrollHead:"dataTables_scrollHead ui-state-default",sScrollFoot:"dataTables_scrollFoot ui-state-default",sFooterTH:"ui-state-default"});h.extend(j.ext.oPagination,{two_button:{fnInit:function(e,j,m){var k=e.oLanguage.oPaginate,l=function(h){e.oApi._fnPageChange(e,h.data.action)&&m(e)},k=!e.bJUI?'<a class="'+e.oClasses.sPagePrevDisabled+'" tabindex="'+e.iTabIndex+'" role="button">'+k.sPrevious+'</a><a class="'+e.oClasses.sPageNextDisabled+'" tabindex="'+e.iTabIndex+'" role="button">'+k.sNext+"</a>":
'<a class="'+e.oClasses.sPagePrevDisabled+'" tabindex="'+e.iTabIndex+'" role="button"><span class="'+e.oClasses.sPageJUIPrev+'"></span></a><a class="'+e.oClasses.sPageNextDisabled+'" tabindex="'+e.iTabIndex+'" role="button"><span class="'+e.oClasses.sPageJUINext+'"></span></a>';h(j).append(k);var r=h("a",j),k=r[0],r=r[1];e.oApi._fnBindAction(k,{action:"previous"},l);e.oApi._fnBindAction(r,{action:"next"},l);if(!e.aanFeatures.p)j.id=e.sTableId+"_paginate",k.id=e.sTableId+"_previous",r.id=e.sTableId+
"_next",k.setAttribute("aria-controls",e.sTableId),r.setAttribute("aria-controls",e.sTableId)},fnUpdate:function(e){if(e.aanFeatures.p)for(var h=e.oClasses,j=e.aanFeatures.p,k=0,m=j.length;k<m;k++)if(0!==j[k].childNodes.length)j[k].childNodes[0].className=0===e._iDisplayStart?h.sPagePrevDisabled:h.sPagePrevEnabled,j[k].childNodes[1].className=e.fnDisplayEnd()==e.fnRecordsDisplay()?h.sPageNextDisabled:h.sPageNextEnabled}},iFullNumbersShowPages:5,full_numbers:{fnInit:function(e,j,m){var k=e.oLanguage.oPaginate,
l=e.oClasses,r=function(h){e.oApi._fnPageChange(e,h.data.action)&&m(e)};h(j).append('<a  tabindex="'+e.iTabIndex+'" class="'+l.sPageButton+" "+l.sPageFirst+'">'+k.sFirst+'</a><a  tabindex="'+e.iTabIndex+'" class="'+l.sPageButton+" "+l.sPagePrevious+'">'+k.sPrevious+'</a><span></span><a tabindex="'+e.iTabIndex+'" class="'+l.sPageButton+" "+l.sPageNext+'">'+k.sNext+'</a><a tabindex="'+e.iTabIndex+'" class="'+l.sPageButton+" "+l.sPageLast+'">'+k.sLast+"</a>");var v=h("a",j),k=v[0],l=v[1],A=v[2],v=v[3];
e.oApi._fnBindAction(k,{action:"first"},r);e.oApi._fnBindAction(l,{action:"previous"},r);e.oApi._fnBindAction(A,{action:"next"},r);e.oApi._fnBindAction(v,{action:"last"},r);if(!e.aanFeatures.p)j.id=e.sTableId+"_paginate",k.id=e.sTableId+"_first",l.id=e.sTableId+"_previous",A.id=e.sTableId+"_next",v.id=e.sTableId+"_last"},fnUpdate:function(e,m){if(e.aanFeatures.p){var l=j.ext.oPagination.iFullNumbersShowPages,k=Math.floor(l/2),x=Math.ceil(e.fnRecordsDisplay()/e._iDisplayLength),r=Math.ceil(e._iDisplayStart/
e._iDisplayLength)+1,v="",A,E=e.oClasses,y,J=e.aanFeatures.p,H=function(h){e.oApi._fnBindAction(this,{page:h+A-1},function(h){e.oApi._fnPageChange(e,h.data.page);m(e);h.preventDefault()})};-1===e._iDisplayLength?r=k=A=1:x<l?(A=1,k=x):r<=k?(A=1,k=l):r>=x-k?(A=x-l+1,k=x):(A=r-Math.ceil(l/2)+1,k=A+l-1);for(l=A;l<=k;l++)v+=r!==l?'<a tabindex="'+e.iTabIndex+'" class="'+E.sPageButton+'">'+e.fnFormatNumber(l)+"</a>":'<a tabindex="'+e.iTabIndex+'" class="'+E.sPageButtonActive+'">'+e.fnFormatNumber(l)+"</a>";
for(l=0,k=J.length;l<k;l++)0!==J[l].childNodes.length&&(h("span:eq(0)",J[l]).html(v).children("a").each(H),y=J[l].getElementsByTagName("a"),y=[y[0],y[1],y[y.length-2],y[y.length-1]],h(y).removeClass(E.sPageButton+" "+E.sPageButtonActive+" "+E.sPageButtonStaticDisabled),h([y[0],y[1]]).addClass(1==r?E.sPageButtonStaticDisabled:E.sPageButton),h([y[2],y[3]]).addClass(0===x||r===x||-1===e._iDisplayLength?E.sPageButtonStaticDisabled:E.sPageButton))}}}});h.extend(j.ext.oSort,{"string-pre":function(e){"string"!=
typeof e&&(e=null!==e&&e.toString?e.toString():"");return e.toLowerCase()},"string-asc":function(e,h){return e<h?-1:e>h?1:0},"string-desc":function(e,h){return e<h?1:e>h?-1:0},"html-pre":function(e){return e.replace(/<.*?>/g,"").toLowerCase()},"html-asc":function(e,h){return e<h?-1:e>h?1:0},"html-desc":function(e,h){return e<h?1:e>h?-1:0},"date-pre":function(e){e=Date.parse(e);if(isNaN(e)||""===e)e=Date.parse("01/01/1970 00:00:00");return e},"date-asc":function(e,h){return e-h},"date-desc":function(e,
h){return h-e},"numeric-pre":function(e){return"-"==e||""===e?0:1*e},"numeric-asc":function(e,h){return e-h},"numeric-desc":function(e,h){return h-e}});h.extend(j.ext.aTypes,[function(e){if("number"===typeof e)return"numeric";if("string"!==typeof e)return null;var h,j=!1;h=e.charAt(0);if(-1=="0123456789-".indexOf(h))return null;for(var k=1;k<e.length;k++){h=e.charAt(k);if(-1=="0123456789.".indexOf(h))return null;if("."==h){if(j)return null;j=!0}}return"numeric"},function(e){var h=Date.parse(e);return null!==
h&&!isNaN(h)||"string"===typeof e&&0===e.length?"date":null},function(e){return"string"===typeof e&&-1!=e.indexOf("<")&&-1!=e.indexOf(">")?"html":null}]);h.fn.DataTable=j;h.fn.dataTable=j;h.fn.dataTableSettings=j.settings;h.fn.dataTableExt=j.ext})(jQuery,window,document,void 0);
/*
  Columnize Plugin for jQuery
  Version: v0.10

  Copyright (C) 2008-2010 by Lutz Issler

  Systemantics GmbH
  Am Lavenstein 3
  52064 Aachen
  GERMANY

  Web:    www.systemantics.net
  Email:  hello@systemantics.net

  This plugin is distributed under the terms of the
  GNU Lesser General Public license. The license can be obtained
  from http://www.gnu.org/licenses/lgpl.html.

*/

(function() {
	var cloneEls = new Object();
	var numColsById = new Object();
	var uniqueId = 0;

	function _layoutElement(elDOM, settings, balance) {
		// Some semi-global variables
		var colHeight;
		var colWidth;
		var col;
		var currentColEl;
		var cols = new Array();
		var colNum = 0;
		var colSet = 0;

		var el = jQuery(elDOM);

		// Save numCols property for this element
		// (needed for pagination)
		numColsById[elDOM.id] = settings.columns;

		// Remove child nodes
		el.empty();

		// Macro function (with side effects)
		function _newColumn() {
			colNum++;

			// Add a new column
			col = document.createElement("DIV");
			col.className = settings.column;
			el.append(col);
			currentColEl = col;
			colWidth = jQuery(col).width();
			cols.push(col);

			// Add the same subnode nesting to the new column
			// as there was in the old column
			for (var j=0; j<subnodes.length; j++) {
				newEl = subnodes[j].cloneNode(false);
				if (j==0 || innerContinued) {
					jQuery(newEl).addClass(settings.continued);
				}
				currentColEl.appendChild(newEl);
				currentColEl = newEl;
			}
		}

		// Returns the margin-bottom CSS property of a certain node
		function _getMarginBottom(currentColEl) {
			var marginBottom = parseInt(jQuery(currentColEl).css("marginBottom"));
			if (marginBottom.toString()=='NaN'){
				marginBottom = 0;
			}
			var currentColElParents = jQuery(currentColEl).parents();
			for (var j=0; j<currentColElParents.length; j++) {
				if (currentColElParents[j]==elDOM) {
					break;
				}
				var curMarginBottom = parseInt(jQuery(currentColElParents[j]).css("marginBottom"));
				if (curMarginBottom.toString()!='NaN'){
					marginBottom = Math.max(marginBottom, curMarginBottom);
				}
			}
			return marginBottom;
		}

		// Advance to next sibling on el or a parent level
		function _skipToNextNode() {
			while (currentEl && currentColEl && !currentEl.nextSibling) {
				currentEl = currentEl.parentNode;
				currentColEl = currentColEl.parentNode;
				var node = subnodes.pop();
				// Hack: delete the previously saved HREF
				if (node=="A") {
					href = null;
				}
			}
			if (currentEl) {
				currentEl = currentEl.nextSibling;
			}
		}

		// Take the height from the element to be layouted
		var maxHeight = settings.height
			? settings.height
			: parseInt(el.css("maxHeight"));
		if (balance || isNaN(maxHeight) || maxHeight==0) {
			// We are asked to balance the col lengths
			// or cannot get the column length from the container,
			// so chose a height that will produce >numCols< columns
			col = document.createElement("DIV");
			col.className = settings.column;
			jQuery(col).append(jQuery(cloneEls[elDOM.id]).html());
			el.append(col);
			var lineHeight = parseInt(el.css("lineHeight"));
			if (!lineHeight) {
				// Assume a line height of 120%
				lineHeight = Math.ceil(parseInt(el.css("fontSize"))*1.2);
			}
			colHeight = Math.ceil(jQuery(col).height()/settings.columns);
			if (colHeight%lineHeight>0) {
				colHeight += lineHeight;
			}
			elDOM.removeChild(col);
			if (maxHeight>0 && colHeight>maxHeight) {
				// Balance only to max-height
				colHeight = maxHeight;
			}
		} else {
			colHeight = maxHeight;
		}

		// Take the minimum height into account
		var minHeight = settings.minHeight
			? settings.minHeight
			: parseInt(el.css("minHeight"));
		if (minHeight) {
			colHeight = Math.max(colHeight, minHeight);
		}

		// Start with first child of the initial node
		var currentEl = cloneEls[elDOM.id].children(":first")[0];
		var subnodes = new Array();
		var href = null;
		var lastNodeType = 0;
		_newColumn();
		if (colHeight==0 || colWidth==0) {
			// We cannot continue with zero height or width
			return false;
		}
		while (currentEl) {
			if (currentEl.nodeType==1) {
				// An element node
				var newEl;
				var $currentEl = jQuery(currentEl);
				if ($currentEl.hasClass("dontSplit")
					|| $currentEl.is(settings.dontsplit)) {
					// Don't split this node. Instead, clone it completely
					var newEl = currentEl.cloneNode(true);
					currentColEl.appendChild(newEl);
					if (col.offsetHeight>colHeight) {
						// The column gets too long, start a new colum
						_newColumn();
					}
					_skipToNextNode();
				} else {
					// Clone the node and append it to the current column
					var newEl = currentEl.cloneNode(false);
					currentColEl.appendChild(newEl);
					if (col.offsetHeight-_getMarginBottom(currentColEl)>colHeight) {
						// The column gets too long, start a new colum
						currentColEl.removeChild(newEl);
						var toBeInsertedEl = newEl;
						_newColumn();
						currentColEl.appendChild(toBeInsertedEl);
						newEl = toBeInsertedEl;
					}
					if (currentEl.firstChild) {
						subnodes.push(currentEl.cloneNode(false));
						currentColEl = newEl;
						currentEl = currentEl.firstChild;
					} else {
						_skipToNextNode();
					}
				}
				lastNodeType = 1;
			} else if (currentEl.nodeType==3) {
				// A text node
				var newEl = document.createTextNode("");
				currentColEl.appendChild(newEl);
				// Determine the current bottom margin
				var marginBottom = _getMarginBottom(currentColEl);
				// Append word by word
				var words = currentEl.data.split(" ");
				for (var i=0; i<words.length; i++) {
					if (lastNodeType==3) {
						newEl.appendData(" ");
					}
					newEl.appendData(words[i]);
					currentColEl.removeChild(newEl);
					currentColEl.appendChild(newEl);
					if (col.offsetHeight-marginBottom>colHeight) {
						// el column is full
						// Remove the last word
						newEl.data = newEl.data.substr(0, newEl.data.length-words[i].length-1);

						// Remove the last node if empty
						var innerContinued;
						if (jQuery(currentColEl).text()=="") {
							jQuery(currentColEl).remove();
							innerContinued = false;
						} else {
							innerContinued = true;
						}

						// Start a new column
						_newColumn();

						// Add a text node at the bottom level
						// in order to continue the column
						newEl = document.createTextNode(words[i]);
						currentColEl.appendChild(newEl);
					}
					lastNodeType = 3;
				}
				_skipToNextNode();
				lastNodeType = 0;
			} else {
				// Any other node (comments, for instance)
				_skipToNextNode();
				lastNodeType = currentEl.nodeType;
			}
		}
		return cols;
	};

	jQuery.fn.columnize = function(settings) {
		settings = jQuery.extend({
			column: "column",
			continued: "continued",
			columns: 2,
			balance: true,
			height: false,
			minHeight: false,
			cache: true,
			dontsplit: ""
		}, settings);
		this.each(function () {
			var jthis = jQuery(this);

			var id = this.id;
			if (!id) {
				// Get a new id
				id = "jcols_"+uniqueId;
				this.id = id;
				uniqueId++;
			}

			if (!cloneEls[this.id] || !settings.cache) {
				cloneEls[this.id] = jthis.clone(true);
			}

			// Layout the columns
			var cols = _layoutElement(this, settings, settings.balance);
			if (!cols) {
				// Layout failed, restore the object's contents
				jthis.append(cloneEls[this.id].children().clone(true));
			}
		});
		return this;
	}
})();

/*!
	Colorbox v1.4.33 - 2013-10-31
	jQuery lightbox and modal window plugin
	(c) 2013 Jack Moore - http://www.jacklmoore.com/colorbox
	license: http://www.opensource.org/licenses/mit-license.php
*/
(function ($, document, window) {
	var
	// Default settings object.
	// See http://jacklmoore.com/colorbox for details.
	defaults = {
		// data sources
		html: false,
		photo: false,
		iframe: false,
		inline: false,

		// behavior and appearance
		transition: "elastic",
		speed: 300,
		fadeOut: 300,
		width: false,
		initialWidth: "600",
		innerWidth: false,
		maxWidth: false,
		height: false,
		initialHeight: "450",
		innerHeight: false,
		maxHeight: false,
		scalePhotos: true,
		scrolling: true,
		href: false,
		title: false,
		rel: false,
		opacity: 0.9,
		preloading: true,
		className: false,
		overlayClose: true,
		escKey: true,
		arrowKey: true,
		top: false,
		bottom: false,
		left: false,
		right: false,
		fixed: false,
		data: undefined,
		closeButton: true,
		fastIframe: true,
		open: false,
		reposition: true,
		loop: true,
		slideshow: false,
		slideshowAuto: true,
		slideshowSpeed: 2500,
		slideshowStart: "start slideshow",
		slideshowStop: "stop slideshow",
		photoRegex: /\.(gif|png|jp(e|g|eg)|bmp|ico|webp)((#|\?).*)?$/i,

		// alternate image paths for high-res displays
		retinaImage: false,
		retinaUrl: false,
		retinaSuffix: '@2x.$1',

		// internationalization
		current: "image {current} of {total}",
		previous: "previous",
		next: "next",
		close: "close",
		xhrError: "This content failed to load.",
		imgError: "This image failed to load.",

		// accessbility
		returnFocus: true,
		trapFocus: true,

		// callbacks
		onOpen: false,
		onLoad: false,
		onComplete: false,
		onCleanup: false,
		onClosed: false
	},
	
	// Abstracting the HTML and event identifiers for easy rebranding
	colorbox = 'colorbox',
	prefix = 'cbox',
	boxElement = prefix + 'Element',
	
	// Events
	event_open = prefix + '_open',
	event_load = prefix + '_load',
	event_complete = prefix + '_complete',
	event_cleanup = prefix + '_cleanup',
	event_closed = prefix + '_closed',
	event_purge = prefix + '_purge',

	// Cached jQuery Object Variables
	$overlay,
	$box,
	$wrap,
	$content,
	$topBorder,
	$leftBorder,
	$rightBorder,
	$bottomBorder,
	$related,
	$window,
	$loaded,
	$loadingBay,
	$loadingOverlay,
	$title,
	$current,
	$slideshow,
	$next,
	$prev,
	$close,
	$groupControls,
	$events = $('<a/>'), // $([]) would be prefered, but there is an issue with jQuery 1.4.2
	
	// Variables for cached values or use across multiple functions
	settings,
	interfaceHeight,
	interfaceWidth,
	loadedHeight,
	loadedWidth,
	element,
	index,
	photo,
	open,
	active,
	closing,
	loadingTimer,
	publicMethod,
	div = "div",
	className,
	requests = 0,
	previousCSS = {},
	init;

	// ****************
	// HELPER FUNCTIONS
	// ****************
	
	// Convenience function for creating new jQuery objects
	function $tag(tag, id, css) {
		var element = document.createElement(tag);

		if (id) {
			element.id = prefix + id;
		}

		if (css) {
			element.style.cssText = css;
		}

		return $(element);
	}
	
	// Get the window height using innerHeight when available to avoid an issue with iOS
	// http://bugs.jquery.com/ticket/6724
	function winheight() {
		return window.innerHeight ? window.innerHeight : $(window).height();
	}

	// Determine the next and previous members in a group.
	function getIndex(increment) {
		var
		max = $related.length,
		newIndex = (index + increment) % max;
		
		return (newIndex < 0) ? max + newIndex : newIndex;
	}

	// Convert '%' and 'px' values to integers
	function setSize(size, dimension) {
		return Math.round((/%/.test(size) ? ((dimension === 'x' ? $window.width() : winheight()) / 100) : 1) * parseInt(size, 10));
	}
	
	// Checks an href to see if it is a photo.
	// There is a force photo option (photo: true) for hrefs that cannot be matched by the regex.
	function isImage(settings, url) {
		return settings.photo || settings.photoRegex.test(url);
	}

	function retinaUrl(settings, url) {
		return settings.retinaUrl && window.devicePixelRatio > 1 ? url.replace(settings.photoRegex, settings.retinaSuffix) : url;
	}

	function trapFocus(e) {
		if ('contains' in $box[0] && !$box[0].contains(e.target)) {
			e.stopPropagation();
			$box.focus();
		}
	}

	// Assigns function results to their respective properties
	function makeSettings() {
		var i,
			data = $.data(element, colorbox);
		
		if (data == null) {
			settings = $.extend({}, defaults);
			if (console && console.log) {
				console.log('Error: cboxElement missing settings object');
			}
		} else {
			settings = $.extend({}, data);
		}
		
		for (i in settings) {
			if ($.isFunction(settings[i]) && i.slice(0, 2) !== 'on') { // checks to make sure the function isn't one of the callbacks, they will be handled at the appropriate time.
				settings[i] = settings[i].call(element);
			}
		}
		
		settings.rel = settings.rel || element.rel || $(element).data('rel') || 'nofollow';
		settings.href = settings.href || $(element).attr('href');
		settings.title = settings.title || element.title;
		
		if (typeof settings.href === "string") {
			settings.href = $.trim(settings.href);
		}
	}

	function trigger(event, callback) {
		// for external use
		$(document).trigger(event);

		// for internal use
		$events.triggerHandler(event);

		if ($.isFunction(callback)) {
			callback.call(element);
		}
	}


	var slideshow = (function(){
		var active,
			className = prefix + "Slideshow_",
			click = "click." + prefix,
			timeOut;

		function clear () {
			clearTimeout(timeOut);
		}

		function set() {
			if (settings.loop || $related[index + 1]) {
				clear();
				timeOut = setTimeout(publicMethod.next, settings.slideshowSpeed);
			}
		}

		function start() {
			$slideshow
				.html(settings.slideshowStop)
				.unbind(click)
				.one(click, stop);

			$events
				.bind(event_complete, set)
				.bind(event_load, clear);

			$box.removeClass(className + "off").addClass(className + "on");
		}

		function stop() {
			clear();
			
			$events
				.unbind(event_complete, set)
				.unbind(event_load, clear);

			$slideshow
				.html(settings.slideshowStart)
				.unbind(click)
				.one(click, function () {
					publicMethod.next();
					start();
				});

			$box.removeClass(className + "on").addClass(className + "off");
		}

		function reset() {
			active = false;
			$slideshow.hide();
			clear();
			$events
				.unbind(event_complete, set)
				.unbind(event_load, clear);
			$box.removeClass(className + "off " + className + "on");
		}

		return function(){
			if (active) {
				if (!settings.slideshow) {
					$events.unbind(event_cleanup, reset);
					reset();
				}
			} else {
				if (settings.slideshow && $related[1]) {
					active = true;
					$events.one(event_cleanup, reset);
					if (settings.slideshowAuto) {
						start();
					} else {
						stop();
					}
					$slideshow.show();
				}
			}
		};

	}());


	function launch(target) {
		if (!closing) {
			
			element = target;
			
			makeSettings();
			
			$related = $(element);
			
			index = 0;
			
			if (settings.rel !== 'nofollow') {
				$related = $('.' + boxElement).filter(function () {
					var data = $.data(this, colorbox),
						relRelated;

					if (data) {
						relRelated =  $(this).data('rel') || data.rel || this.rel;
					}
					
					return (relRelated === settings.rel);
				});
				index = $related.index(element);
				
				// Check direct calls to Colorbox.
				if (index === -1) {
					$related = $related.add(element);
					index = $related.length - 1;
				}
			}
			
			$overlay.css({
				opacity: parseFloat(settings.opacity),
				cursor: settings.overlayClose ? "pointer" : "auto",
				visibility: 'visible'
			}).show();
			

			if (className) {
				$box.add($overlay).removeClass(className);
			}
			if (settings.className) {
				$box.add($overlay).addClass(settings.className);
			}
			className = settings.className;

			if (settings.closeButton) {
				$close.html(settings.close).appendTo($content);
			} else {
				$close.appendTo('<div/>');
			}

			if (!open) {
				open = active = true; // Prevents the page-change action from queuing up if the visitor holds down the left or right keys.
				
				// Show colorbox so the sizes can be calculated in older versions of jQuery
				$box.css({visibility:'hidden', display:'block'});
				
				$loaded = $tag(div, 'LoadedContent', 'width:0; height:0; overflow:hidden');
				$content.css({width:'', height:''}).append($loaded);

				// Cache values needed for size calculations
				interfaceHeight = $topBorder.height() + $bottomBorder.height() + $content.outerHeight(true) - $content.height();
				interfaceWidth = $leftBorder.width() + $rightBorder.width() + $content.outerWidth(true) - $content.width();
				loadedHeight = $loaded.outerHeight(true);
				loadedWidth = $loaded.outerWidth(true);

				// Opens inital empty Colorbox prior to content being loaded.
				settings.w = setSize(settings.initialWidth, 'x');
				settings.h = setSize(settings.initialHeight, 'y');
				$loaded.css({width:'', height:settings.h});
				publicMethod.position();

				trigger(event_open, settings.onOpen);
				
				$groupControls.add($title).hide();

				$box.focus();
				
				if (settings.trapFocus) {
					// Confine focus to the modal
					// Uses event capturing that is not supported in IE8-
					if (document.addEventListener) {

						document.addEventListener('focus', trapFocus, true);
						
						$events.one(event_closed, function () {
							document.removeEventListener('focus', trapFocus, true);
						});
					}
				}

				// Return focus on closing
				if (settings.returnFocus) {
					$events.one(event_closed, function () {
						$(element).focus();
					});
				}
			}
			load();
		}
	}

	// Colorbox's markup needs to be added to the DOM prior to being called
	// so that the browser will go ahead and load the CSS background images.
	function appendHTML() {
		if (!$box && document.body) {
			init = false;
			$window = $(window);
			$box = $tag(div).attr({
				id: colorbox,
				'class': $.support.opacity === false ? prefix + 'IE' : '', // class for optional IE8 & lower targeted CSS.
				role: 'dialog',
				tabindex: '-1'
			}).hide();
			$overlay = $tag(div, "Overlay").hide();
			$loadingOverlay = $([$tag(div, "LoadingOverlay")[0],$tag(div, "LoadingGraphic")[0]]);
			$wrap = $tag(div, "Wrapper");
			$content = $tag(div, "Content").append(
				$title = $tag(div, "Title"),
				$current = $tag(div, "Current"),
				$prev = $('<button type="button"/>').attr({id:prefix+'Previous'}),
				$next = $('<button type="button"/>').attr({id:prefix+'Next'}),
				$slideshow = $tag('button', "Slideshow"),
				$loadingOverlay
			);

			$close = $('<button type="button"/>').attr({id:prefix+'Close'});
			
			$wrap.append( // The 3x3 Grid that makes up Colorbox
				$tag(div).append(
					$tag(div, "TopLeft"),
					$topBorder = $tag(div, "TopCenter"),
					$tag(div, "TopRight")
				),
				$tag(div, false, 'clear:left').append(
					$leftBorder = $tag(div, "MiddleLeft"),
					$content,
					$rightBorder = $tag(div, "MiddleRight")
				),
				$tag(div, false, 'clear:left').append(
					$tag(div, "BottomLeft"),
					$bottomBorder = $tag(div, "BottomCenter"),
					$tag(div, "BottomRight")
				)
			).find('div div').css({'float': 'left'});
			
			$loadingBay = $tag(div, false, 'position:absolute; width:9999px; visibility:hidden; display:none; max-width:none;');
			
			$groupControls = $next.add($prev).add($current).add($slideshow);

			$(document.body).append($overlay, $box.append($wrap, $loadingBay));
		}
	}

	// Add Colorbox's event bindings
	function addBindings() {
		function clickHandler(e) {
			// ignore non-left-mouse-clicks and clicks modified with ctrl / command, shift, or alt.
			// See: http://jacklmoore.com/notes/click-events/
			if (!(e.which > 1 || e.shiftKey || e.altKey || e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				launch(this);
			}
		}

		if ($box) {
			if (!init) {
				init = true;

				// Anonymous functions here keep the public method from being cached, thereby allowing them to be redefined on the fly.
				$next.click(function () {
					publicMethod.next();
				});
				$prev.click(function () {
					publicMethod.prev();
				});
				$close.click(function () {
					publicMethod.close();
				});
				$overlay.click(function () {
					if (settings.overlayClose) {
						publicMethod.close();
					}
				});
				
				// Key Bindings
				$(document).bind('keydown.' + prefix, function (e) {
					var key = e.keyCode;
					if (open && settings.escKey && key === 27) {
						e.preventDefault();
						publicMethod.close();
					}
					if (open && settings.arrowKey && $related[1] && !e.altKey) {
						if (key === 37) {
							e.preventDefault();
							$prev.click();
						} else if (key === 39) {
							e.preventDefault();
							$next.click();
						}
					}
				});

				if ($.isFunction($.fn.on)) {
					// For jQuery 1.7+
					$(document).on('click.'+prefix, '.'+boxElement, clickHandler);
				} else {
					// For jQuery 1.3.x -> 1.6.x
					// This code is never reached in jQuery 1.9, so do not contact me about 'live' being removed.
					// This is not here for jQuery 1.9, it's here for legacy users.
					$('.'+boxElement).live('click.'+prefix, clickHandler);
				}
			}
			return true;
		}
		return false;
	}

	// Don't do anything if Colorbox already exists.
	if ($.colorbox) {
		return;
	}

	// Append the HTML when the DOM loads
	$(appendHTML);


	// ****************
	// PUBLIC FUNCTIONS
	// Usage format: $.colorbox.close();
	// Usage from within an iframe: parent.jQuery.colorbox.close();
	// ****************
	
	publicMethod = $.fn[colorbox] = $[colorbox] = function (options, callback) {
		var $this = this;
		
		options = options || {};
		
		appendHTML();

		if (addBindings()) {
			if ($.isFunction($this)) { // assume a call to $.colorbox
				$this = $('<a/>');
				options.open = true;
			} else if (!$this[0]) { // colorbox being applied to empty collection
				return $this;
			}
			
			if (callback) {
				options.onComplete = callback;
			}
			
			$this.each(function () {
				$.data(this, colorbox, $.extend({}, $.data(this, colorbox) || defaults, options));
			}).addClass(boxElement);
			
			if (($.isFunction(options.open) && options.open.call($this)) || options.open) {
				launch($this[0]);
			}
		}
		
		return $this;
	};

	publicMethod.position = function (speed, loadedCallback) {
		var
		css,
		top = 0,
		left = 0,
		offset = $box.offset(),
		scrollTop,
		scrollLeft;
		
		$window.unbind('resize.' + prefix);

		// remove the modal so that it doesn't influence the document width/height
		$box.css({top: -9e4, left: -9e4});

		scrollTop = $window.scrollTop();
		scrollLeft = $window.scrollLeft();

		if (settings.fixed) {
			offset.top -= scrollTop;
			offset.left -= scrollLeft;
			$box.css({position: 'fixed'});
		} else {
			top = scrollTop;
			left = scrollLeft;
			$box.css({position: 'absolute'});
		}

		// keeps the top and left positions within the browser's viewport.
		if (settings.right !== false) {
			left += Math.max($window.width() - settings.w - loadedWidth - interfaceWidth - setSize(settings.right, 'x'), 0);
		} else if (settings.left !== false) {
			left += setSize(settings.left, 'x');
		} else {
			left += Math.round(Math.max($window.width() - settings.w - loadedWidth - interfaceWidth, 0) / 2);
		}
		
		if (settings.bottom !== false) {
			top += Math.max(winheight() - settings.h - loadedHeight - interfaceHeight - setSize(settings.bottom, 'y'), 0);
		} else if (settings.top !== false) {
			top += setSize(settings.top, 'y');
		} else {
			top += Math.round(Math.max(winheight() - settings.h - loadedHeight - interfaceHeight, 0) / 2);
		}

		$box.css({top: offset.top, left: offset.left, visibility:'visible'});
		
		// this gives the wrapper plenty of breathing room so it's floated contents can move around smoothly,
		// but it has to be shrank down around the size of div#colorbox when it's done.  If not,
		// it can invoke an obscure IE bug when using iframes.
		$wrap[0].style.width = $wrap[0].style.height = "9999px";
		
		function modalDimensions() {
			$topBorder[0].style.width = $bottomBorder[0].style.width = $content[0].style.width = (parseInt($box[0].style.width,10) - interfaceWidth)+'px';
			$content[0].style.height = $leftBorder[0].style.height = $rightBorder[0].style.height = (parseInt($box[0].style.height,10) - interfaceHeight)+'px';
		}

		css = {width: settings.w + loadedWidth + interfaceWidth, height: settings.h + loadedHeight + interfaceHeight, top: top, left: left};

		// setting the speed to 0 if the content hasn't changed size or position
		if (speed) {
			var tempSpeed = 0;
			$.each(css, function(i){
				if (css[i] !== previousCSS[i]) {
					tempSpeed = speed;
					return;
				}
			});
			speed = tempSpeed;
		}

		previousCSS = css;

		if (!speed) {
			$box.css(css);
		}

		$box.dequeue().animate(css, {
			duration: speed || 0,
			complete: function () {
				modalDimensions();
				
				active = false;
				
				// shrink the wrapper down to exactly the size of colorbox to avoid a bug in IE's iframe implementation.
				$wrap[0].style.width = (settings.w + loadedWidth + interfaceWidth) + "px";
				$wrap[0].style.height = (settings.h + loadedHeight + interfaceHeight) + "px";
				
				if (settings.reposition) {
					setTimeout(function () {  // small delay before binding onresize due to an IE8 bug.
						$window.bind('resize.' + prefix, publicMethod.position);
					}, 1);
				}

				if (loadedCallback) {
					loadedCallback();
				}
			},
			step: modalDimensions
		});
	};

	publicMethod.resize = function (options) {
		var scrolltop;
		
		if (open) {
			options = options || {};
			
			if (options.width) {
				settings.w = setSize(options.width, 'x') - loadedWidth - interfaceWidth;
			}

			if (options.innerWidth) {
				settings.w = setSize(options.innerWidth, 'x');
			}

			$loaded.css({width: settings.w});
			
			if (options.height) {
				settings.h = setSize(options.height, 'y') - loadedHeight - interfaceHeight;
			}

			if (options.innerHeight) {
				settings.h = setSize(options.innerHeight, 'y');
			}

			if (!options.innerHeight && !options.height) {
				scrolltop = $loaded.scrollTop();
				$loaded.css({height: "auto"});
				settings.h = $loaded.height();
			}

			$loaded.css({height: settings.h});

			if(scrolltop) {
				$loaded.scrollTop(scrolltop);
			}
			
			publicMethod.position(settings.transition === "none" ? 0 : settings.speed);
		}
	};

	publicMethod.prep = function (object) {
		if (!open) {
			return;
		}
		
		var callback, speed = settings.transition === "none" ? 0 : settings.speed;

		$loaded.empty().remove(); // Using empty first may prevent some IE7 issues.

		$loaded = $tag(div, 'LoadedContent').append(object);
		
		function getWidth() {
			settings.w = settings.w || $loaded.width();
			settings.w = settings.mw && settings.mw < settings.w ? settings.mw : settings.w;
			return settings.w;
		}
		function getHeight() {
			settings.h = settings.h || $loaded.height();
			settings.h = settings.mh && settings.mh < settings.h ? settings.mh : settings.h;
			return settings.h;
		}
		
		$loaded.hide()
		.appendTo($loadingBay.show())// content has to be appended to the DOM for accurate size calculations.
		.css({width: getWidth(), overflow: settings.scrolling ? 'auto' : 'hidden'})
		.css({height: getHeight()})// sets the height independently from the width in case the new width influences the value of height.
		.prependTo($content);
		
		$loadingBay.hide();
		
		// floating the IMG removes the bottom line-height and fixed a problem where IE miscalculates the width of the parent element as 100% of the document width.
		
		$(photo).css({'float': 'none'});

		callback = function () {
			var total = $related.length,
				iframe,
				frameBorder = 'frameBorder',
				allowTransparency = 'allowTransparency',
				complete;
			
			if (!open) {
				return;
			}
			
			function removeFilter() { // Needed for IE7 & IE8 in versions of jQuery prior to 1.7.2
				if ($.support.opacity === false) {
					$box[0].style.removeAttribute('filter');
				}
			}
			
			complete = function () {
				clearTimeout(loadingTimer);
				$loadingOverlay.hide();
				trigger(event_complete, settings.onComplete);
			};

			
			$title.html(settings.title).add($loaded).show();
			
			if (total > 1) { // handle grouping
				if (typeof settings.current === "string") {
					$current.html(settings.current.replace('{current}', index + 1).replace('{total}', total)).show();
				}
				
				$next[(settings.loop || index < total - 1) ? "show" : "hide"]().html(settings.next);
				$prev[(settings.loop || index) ? "show" : "hide"]().html(settings.previous);
				
				slideshow();
				
				// Preloads images within a rel group
				if (settings.preloading) {
					$.each([getIndex(-1), getIndex(1)], function(){
						var src,
							img,
							i = $related[this],
							data = $.data(i, colorbox);

						if (data && data.href) {
							src = data.href;
							if ($.isFunction(src)) {
								src = src.call(i);
							}
						} else {
							src = $(i).attr('href');
						}

						if (src && isImage(data, src)) {
							src = retinaUrl(data, src);
							img = document.createElement('img');
							img.src = src;
						}
					});
				}
			} else {
				$groupControls.hide();
			}
			
			if (settings.iframe) {
				iframe = $tag('iframe')[0];
				
				if (frameBorder in iframe) {
					iframe[frameBorder] = 0;
				}
				
				if (allowTransparency in iframe) {
					iframe[allowTransparency] = "true";
				}

				if (!settings.scrolling) {
					iframe.scrolling = "no";
				}
				
				$(iframe)
					.attr({
						src: settings.href,
						name: (new Date()).getTime(), // give the iframe a unique name to prevent caching
						'class': prefix + 'Iframe',
						allowFullScreen : true, // allow HTML5 video to go fullscreen
						webkitAllowFullScreen : true,
						mozallowfullscreen : true
					})
					.one('load', complete)
					.appendTo($loaded);
				
				$events.one(event_purge, function () {
					iframe.src = "//about:blank";
				});

				if (settings.fastIframe) {
					$(iframe).trigger('load');
				}
			} else {
				complete();
			}
			
			if (settings.transition === 'fade') {
				$box.fadeTo(speed, 1, removeFilter);
			} else {
				removeFilter();
			}
		};
		
		if (settings.transition === 'fade') {
			$box.fadeTo(speed, 0, function () {
				publicMethod.position(0, callback);
			});
		} else {
			publicMethod.position(speed, callback);
		}
	};

	function load () {
		var href, setResize, prep = publicMethod.prep, $inline, request = ++requests;
		
		active = true;
		
		photo = false;
		
		element = $related[index];
		
		makeSettings();
		
		trigger(event_purge);
		
		trigger(event_load, settings.onLoad);
		
		settings.h = settings.height ?
				setSize(settings.height, 'y') - loadedHeight - interfaceHeight :
				settings.innerHeight && setSize(settings.innerHeight, 'y');
		
		settings.w = settings.width ?
				setSize(settings.width, 'x') - loadedWidth - interfaceWidth :
				settings.innerWidth && setSize(settings.innerWidth, 'x');
		
		// Sets the minimum dimensions for use in image scaling
		settings.mw = settings.w;
		settings.mh = settings.h;
		
		// Re-evaluate the minimum width and height based on maxWidth and maxHeight values.
		// If the width or height exceed the maxWidth or maxHeight, use the maximum values instead.
		if (settings.maxWidth) {
			settings.mw = setSize(settings.maxWidth, 'x') - loadedWidth - interfaceWidth;
			settings.mw = settings.w && settings.w < settings.mw ? settings.w : settings.mw;
		}
		if (settings.maxHeight) {
			settings.mh = setSize(settings.maxHeight, 'y') - loadedHeight - interfaceHeight;
			settings.mh = settings.h && settings.h < settings.mh ? settings.h : settings.mh;
		}
		
		href = settings.href;
		
		loadingTimer = setTimeout(function () {
			$loadingOverlay.show();
		}, 100);
		
		if (settings.inline) {
			// Inserts an empty placeholder where inline content is being pulled from.
			// An event is bound to put inline content back when Colorbox closes or loads new content.
			$inline = $tag(div).hide().insertBefore($(href)[0]);

			$events.one(event_purge, function () {
				$inline.replaceWith($loaded.children());
			});

			prep($(href));
		} else if (settings.iframe) {
			// IFrame element won't be added to the DOM until it is ready to be displayed,
			// to avoid problems with DOM-ready JS that might be trying to run in that iframe.
			prep(" ");
		} else if (settings.html) {
			prep(settings.html);
		} else if (isImage(settings, href)) {

			href = retinaUrl(settings, href);

			photo = document.createElement('img');

			$(photo)
			.addClass(prefix + 'Photo')
			.bind('error',function () {
				settings.title = false;
				prep($tag(div, 'Error').html(settings.imgError));
			})
			.one('load', function () {
				var percent;

				if (request !== requests) {
					return;
				}

				$.each(['alt', 'longdesc', 'aria-describedby'], function(i,val){
					var attr = $(element).attr(val) || $(element).attr('data-'+val);
					if (attr) {
						photo.setAttribute(val, attr);
					}
				});

				if (settings.retinaImage && window.devicePixelRatio > 1) {
					photo.height = photo.height / window.devicePixelRatio;
					photo.width = photo.width / window.devicePixelRatio;
				}

				if (settings.scalePhotos) {
					setResize = function () {
						photo.height -= photo.height * percent;
						photo.width -= photo.width * percent;
					};
					if (settings.mw && photo.width > settings.mw) {
						percent = (photo.width - settings.mw) / photo.width;
						setResize();
					}
					if (settings.mh && photo.height > settings.mh) {
						percent = (photo.height - settings.mh) / photo.height;
						setResize();
					}
				}
				
				if (settings.h) {
					photo.style.marginTop = Math.max(settings.mh - photo.height, 0) / 2 + 'px';
				}
				
				if ($related[1] && (settings.loop || $related[index + 1])) {
					photo.style.cursor = 'pointer';
					photo.onclick = function () {
						publicMethod.next();
					};
				}

				photo.style.width = photo.width + 'px';
				photo.style.height = photo.height + 'px';

				setTimeout(function () { // A pause because Chrome will sometimes report a 0 by 0 size otherwise.
					prep(photo);
				}, 1);
			});
			
			setTimeout(function () { // A pause because Opera 10.6+ will sometimes not run the onload function otherwise.
				photo.src = href;
			}, 1);
		} else if (href) {
			$loadingBay.load(href, settings.data, function (data, status) {
				if (request === requests) {
					prep(status === 'error' ? $tag(div, 'Error').html(settings.xhrError) : $(this).contents());
				}
			});
		}
	}
		
	// Navigates to the next page/image in a set.
	publicMethod.next = function () {
		if (!active && $related[1] && (settings.loop || $related[index + 1])) {
			index = getIndex(1);
			launch($related[index]);
		}
	};
	
	publicMethod.prev = function () {
		if (!active && $related[1] && (settings.loop || index)) {
			index = getIndex(-1);
			launch($related[index]);
		}
	};

	// Note: to use this within an iframe use the following format: parent.jQuery.colorbox.close();
	publicMethod.close = function () {
		if (open && !closing) {
			
			closing = true;
			
			open = false;
			
			trigger(event_cleanup, settings.onCleanup);
			
			$window.unbind('.' + prefix);
			
			$overlay.fadeTo(settings.fadeOut || 0, 0);
			
			//$box.stop().fadeTo(settings.fadeOut || 0, 0, function () {
                        $box.fadeTo(settings.fadeOut || 0, 0, function () {
			
				$box.add($overlay).css({'opacity': 1, cursor: 'auto'}).hide();
				
				trigger(event_purge);
				
				$loaded.empty().remove(); // Using empty first may prevent some IE7 issues.
				
				setTimeout(function () {
					closing = false;
					trigger(event_closed, settings.onClosed);
				}, 1);
			});
		}
	};

	// Removes changes Colorbox made to the document, but does not remove the plugin.
	publicMethod.remove = function () {
		if (!$box) { return; }

		$box.stop();
		$.colorbox.close();
		$box.stop().remove();
		$overlay.remove();
		closing = false;
		$box = null;
		$('.' + boxElement)
			.removeData(colorbox)
			.removeClass(boxElement);

		$(document).unbind('click.'+prefix);
	};

	// A method for fetching the current element Colorbox is referencing.
	// returns a jQuery object.
	publicMethod.element = function () {
		return $(element);
	};

	publicMethod.settings = defaults;

}(jQuery, document, window));

/**
 * jQuery Roundabout - v2.4.2
 * http://fredhq.com/projects/roundabout
 *
 * Moves list-items of enabled ordered and unordered lists long
 * a chosen path. Includes the default "lazySusan" path, that
 * moves items long a spinning turntable.
 *
 * Terms of Use // jQuery Roundabout
 *
 * Open source under the BSD license
 *
 * Copyright (c) 2011-2012, Fred LeBlanc
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *   - Redistributions of source code must retain the above copyright
 *     notice, this list of conditions and the following disclaimer.
 *   - Redistributions in binary form must reproduce the above
 *     copyright notice, this list of conditions and the following
 *     disclaimer in the documentation and/or other materials provided
 *     with the distribution.
 *   - Neither the name of the author nor the names of its contributors
 *     may be used to endorse or promote products derived from this
 *     software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */
(function($) {
	"use strict";
	
	var defaults, internalData, methods;

	// add default shape
	$.extend({
		roundaboutShapes: {
			def: "lazySusan",
			lazySusan: function (r, a, t) {
				return {
					x: Math.sin(r + a),
					y: (Math.sin(r + 3 * Math.PI / 2 + a) / 8) * t,
					z: (Math.cos(r + a) + 1) / 2,
					scale: (Math.sin(r + Math.PI / 2 + a) / 2) + 0.5
				};
			}
		}
	});

	defaults = {
		bearing: 0.0,
		tilt: 0.0,
		minZ: 100,
		maxZ: 280,
		minOpacity: 0.4,
		maxOpacity: 1.0,
		minScale: 0.4,
		maxScale: 1.0,
		duration: 600,
		btnNext: ".next",
		btnNextCallback: function() {},
		btnPrev: ".prev",
		btnPrevCallback: function() {},
		btnToggleAutoplay: null,
		btnStartAutoplay: null,
		btnStopAutoplay: null,
		easing: "swing",
		clickToFocus: true,
		clickToFocusCallback: function() {},
		focusBearing: 0.0,
		shape: "lazySusan",
		debug: false,
		childSelector: "li",
		startingChild: null,
		reflect: false,
		floatComparisonThreshold: 0.001,
		autoplay: false,
		autoplayDuration: 1000,
		autoplayPauseOnHover: false,
		autoplayCallback: function() {},
		autoplayInitialDelay: 0,
		enableDrag: false,
		dropDuration: 600,
		dropEasing: "swing",
		dropAnimateTo: "nearest",
		dropCallback: function() {},
		dragAxis: "x",
		dragFactor: 4,
		triggerFocusEvents: true,
		triggerBlurEvents: true,
		responsive: false
	};

	internalData = {
		autoplayInterval: null,
		autoplayIsRunning: false,
		autoplayStartTimeout: null,
		animating: false,
		childInFocus: -1,
		touchMoveStartPosition: null,
		stopAnimation: false,
		lastAnimationStep: false
	};

	methods = {

		// starters
		// -----------------------------------------------------------------------

		// init
		// starts up roundabout
		init: function(options, callback, relayout) {
			var settings,
			    now = (new Date()).getTime();

			options   = (typeof options === "object") ? options : {};
			callback  = ($.isFunction(callback)) ? callback : function() {};
			callback  = ($.isFunction(options)) ? options : callback;
			settings  = $.extend({}, defaults, options, internalData);

			return this
				.each(function() {
					// make options
					var self = $(this),
					    childCount = self.children(settings.childSelector).length,
					    period = 360.0 / childCount,
					    startingChild = (settings.startingChild && settings.startingChild > (childCount - 1)) ? (childCount - 1) : settings.startingChild,
					    startBearing = (settings.startingChild === null) ? settings.bearing : 360 - (startingChild * period),
					    holderCSSPosition = (self.css("position") !== "static") ? self.css("position") : "relative";

					self
						.css({  // starting styles
							padding:   0,
							position:  holderCSSPosition
						})
						.addClass("roundabout-holder")
						.data(  // starting options
							"roundabout",
							$.extend(
								{},
								settings,
								{
									startingChild: startingChild,
									bearing: startBearing,
									oppositeOfFocusBearing: methods.normalize.apply(null, [settings.focusBearing - 180]),
									dragBearing: startBearing,
									period: period
								}
							)
						);

					// unbind any events that we set if we're relaying out
					if (relayout) {
						self
							.unbind(".roundabout")
							.children(settings.childSelector)
								.unbind(".roundabout");
					} else {
						// bind responsive action
						if (settings.responsive) {
							$(window).bind("resize", function() {
								methods.stopAutoplay.apply(self);
								methods.relayoutChildren.apply(self);
							});
						}
					}

					// bind click-to-focus
					if (settings.clickToFocus) {
						self
							.children(settings.childSelector)
							.each(function(i) {
								$(this)
									.bind("click.roundabout", function() {
										var degrees = methods.getPlacement.apply(self, [i]);

										if (!methods.isInFocus.apply(self, [degrees])) {
											methods.stopAnimation.apply($(this));
											if (!self.data("roundabout").animating) {
												methods.animateBearingToFocus.apply(self, [degrees, self.data("roundabout").clickToFocusCallback]);
											}
											return false;
										}
									});
							});
					}

					// bind next buttons
					if (settings.btnNext) {
						$(settings.btnNext)
							.bind("click.roundabout", function() {
								if (!self.data("roundabout").animating) {
									methods.animateToNextChild.apply(self, [self.data("roundabout").btnNextCallback]);
								}
								return false;
							});
					}

					// bind previous buttons
					if (settings.btnPrev) {
						$(settings.btnPrev)
							.bind("click.roundabout", function() {
								methods.animateToPreviousChild.apply(self, [self.data("roundabout").btnPrevCallback]);
								return false;
							});
					}

					// bind toggle autoplay buttons
					if (settings.btnToggleAutoplay) {
						$(settings.btnToggleAutoplay)
							.bind("click.roundabout", function() {
								methods.toggleAutoplay.apply(self);
								return false;
							});
					}

					// bind start autoplay buttons
					if (settings.btnStartAutoplay) {
						$(settings.btnStartAutoplay)
							.bind("click.roundabout", function() {
								methods.startAutoplay.apply(self);
								return false;
							});
					}

					// bind stop autoplay buttons
					if (settings.btnStopAutoplay) {
						$(settings.btnStopAutoplay)
							.bind("click.roundabout", function() {
								methods.stopAutoplay.apply(self);
								return false;
							});
					}

					// autoplay pause on hover
					if (settings.autoplayPauseOnHover) {
						self
							.bind("mouseenter.roundabout.autoplay", function() {
								methods.stopAutoplay.apply(self, [true]);
							})
							.bind("mouseleave.roundabout.autoplay", function() {
								methods.startAutoplay.apply(self);
							});
					}

					// drag and drop
					if (settings.enableDrag) {
						// on screen
						if (!$.isFunction(self.drag)) {
							if (settings.debug) {
								alert("You do not have the drag plugin loaded.");
							}
						} else if (!$.isFunction(self.drop)) {
							if (settings.debug) {
								alert("You do not have the drop plugin loaded.");
							}
						} else {
							self
								.drag(function(e, properties) {
									var data = self.data("roundabout"),
									    delta = (data.dragAxis.toLowerCase() === "x") ? "deltaX" : "deltaY";
									methods.stopAnimation.apply(self);
									methods.setBearing.apply(self, [data.dragBearing + properties[delta] / data.dragFactor]);
								})
								.drop(function(e) {
									var data = self.data("roundabout"),
									    method = methods.getAnimateToMethod(data.dropAnimateTo);
									methods.allowAnimation.apply(self);
									methods[method].apply(self, [data.dropDuration, data.dropEasing, data.dropCallback]);
									data.dragBearing = data.period * methods.getNearestChild.apply(self);
								});
						}

						// on mobile
						self
							.each(function() {
								var element = $(this).get(0),
								    data = $(this).data("roundabout"),
								    page = (data.dragAxis.toLowerCase() === "x") ? "pageX" : "pageY",
								    method = methods.getAnimateToMethod(data.dropAnimateTo);

								// some versions of IE don't like this
								if (element.addEventListener) {
									element.addEventListener("touchstart", function(e) {
										data.touchMoveStartPosition = e.touches[0][page];
									}, false);

									element.addEventListener("touchmove", function(e) {
										var delta = (e.touches[0][page] - data.touchMoveStartPosition) / data.dragFactor;
										e.preventDefault();
										methods.stopAnimation.apply($(this));
										methods.setBearing.apply($(this), [data.dragBearing + delta]);
									}, false);

									element.addEventListener("touchend", function(e) {
										e.preventDefault();
										methods.allowAnimation.apply($(this));
										method = methods.getAnimateToMethod(data.dropAnimateTo);
										methods[method].apply($(this), [data.dropDuration, data.dropEasing, data.dropCallback]);
										data.dragBearing = data.period * methods.getNearestChild.apply($(this));
									}, false);
								}
							});
					}

					// start children
					methods.initChildren.apply(self, [callback, relayout]);
				});
		},


		// initChildren
		// applys settings to child elements, starts roundabout
		initChildren: function(callback, relayout) {
			var self = $(this),
			    data = self.data("roundabout");

			callback = callback || function() {};
			
			self.children(data.childSelector).each(function(i) {
				var startWidth, startHeight, startFontSize,
				    degrees = methods.getPlacement.apply(self, [i]);

				// on relayout, grab these values from current data
				if (relayout && $(this).data("roundabout")) {
					startWidth = $(this).data("roundabout").startWidth;
					startHeight = $(this).data("roundabout").startHeight;
					startFontSize = $(this).data("roundabout").startFontSize;
				}

				// apply classes and css first
				$(this)
					.addClass("roundabout-moveable-item")
					.css("position", "absolute");

				// now measure
				$(this)
					.data(
						"roundabout",
						{
							startWidth: startWidth || $(this).width(),
							startHeight: startHeight || $(this).height(),
							startFontSize: startFontSize || parseInt($(this).css("font-size"), 10),
							degrees: degrees,
							backDegrees: methods.normalize.apply(null, [degrees - 180]),
							childNumber: i,
							currentScale: 1,
							parent: self
						}
					);
			});

			methods.updateChildren.apply(self);

			// start autoplay if necessary
			if (data.autoplay) {
				data.autoplayStartTimeout = setTimeout(function() {
					methods.startAutoplay.apply(self);
				}, data.autoplayInitialDelay);
			}

			self.trigger('ready');
			callback.apply(self);
			return self;
		},



		// positioning
		// -----------------------------------------------------------------------

		// updateChildren
		// move children elements into their proper locations
		updateChildren: function() {
			return this
				.each(function() {
					var self = $(this),
					    data = self.data("roundabout"),
					    inFocus = -1,
					    info = {
							bearing: data.bearing,
							tilt: data.tilt,
							stage: {
								width: Math.floor($(this).width() * 0.9),
								height: Math.floor($(this).height() * 0.9)
							},
							animating: data.animating,
							inFocus: data.childInFocus,
							focusBearingRadian: methods.degToRad.apply(null, [data.focusBearing]),
							shape: $.roundaboutShapes[data.shape] || $.roundaboutShapes[$.roundaboutShapes.def]
					    };

					// calculations
					info.midStage = {
						width: info.stage.width / 2,
						height: info.stage.height / 2
					};

					info.nudge = {
						width: info.midStage.width + (info.stage.width * 0.05),
						height: info.midStage.height + (info.stage.height * 0.05)
					};

					info.zValues = {
						min: data.minZ,
						max: data.maxZ,
						diff: data.maxZ - data.minZ
					};

					info.opacity = {
						min: data.minOpacity,
						max: data.maxOpacity,
						diff: data.maxOpacity - data.minOpacity
					};

					info.scale = {
						min: data.minScale,
						max: data.maxScale,
						diff: data.maxScale - data.minScale
					};

					// update child positions
					self.children(data.childSelector)
						.each(function(i) {
							if (methods.updateChild.apply(self, [$(this), info, i, function() { $(this).trigger('ready'); }]) && (!info.animating || data.lastAnimationStep)) {
								inFocus = i;
								$(this).addClass("roundabout-in-focus");
							} else {
								$(this).removeClass("roundabout-in-focus");
							}
						});

					if (inFocus !== info.inFocus) {
						// blur old child
						if (data.triggerBlurEvents) {
							self.children(data.childSelector)
								.eq(info.inFocus)
									.trigger("blur");
						}

						data.childInFocus = inFocus;

						if (data.triggerFocusEvents && inFocus !== -1) {
							// focus new child
							self.children(data.childSelector)
								.eq(inFocus)
									.trigger("focus");
						}
					}

					self.trigger("childrenUpdated");
				});
		},


		// updateChild
		// repositions a child element into its new position
		updateChild: function(childElement, info, childPos, callback) {
			var factors,
			    self = this,
			    child = $(childElement),
			    data = child.data("roundabout"),
			    out = [],
			    rad = methods.degToRad.apply(null, [(360.0 - data.degrees) + info.bearing]);

			callback = callback || function() {};

			// adjust radians to be between 0 and Math.PI * 2
			rad = methods.normalizeRad.apply(null, [rad]);

			// get factors from shape
			factors = info.shape(rad, info.focusBearingRadian, info.tilt);

			// correct
			factors.scale = (factors.scale > 1) ? 1 : factors.scale;
			factors.adjustedScale = (info.scale.min + (info.scale.diff * factors.scale)).toFixed(4);
			factors.width = (factors.adjustedScale * data.startWidth).toFixed(4);
			factors.height = (factors.adjustedScale * data.startHeight).toFixed(4);

			// update item
			child
				.css({
					left: ((factors.x * info.midStage.width + info.nudge.width) - factors.width / 2.0).toFixed(0) + "px",
					top: ((factors.y * info.midStage.height + info.nudge.height) - factors.height / 2.0).toFixed(0) + "px",
					width: factors.width + "px",
					height: factors.height + "px",
					opacity: (info.opacity.min + (info.opacity.diff * factors.scale)).toFixed(2),
					zIndex: Math.round(info.zValues.min + (info.zValues.diff * factors.z)),
					fontSize: (factors.adjustedScale * data.startFontSize).toFixed(1) + "px"
				});
			data.currentScale = factors.adjustedScale;

			// for debugging purposes
			if (self.data("roundabout").debug) {
				out.push("<div style=\"font-weight: normal; font-size: 10px; padding: 2px; width: " + child.css("width") + "; background-color: #ffc;\">");
				out.push("<strong style=\"font-size: 12px; white-space: nowrap;\">Child " + childPos + "</strong><br />");
				out.push("<strong>left:</strong> " + child.css("left") + "<br />");
				out.push("<strong>top:</strong> " + child.css("top") + "<br />");
				out.push("<strong>width:</strong> " + child.css("width") + "<br />");
				out.push("<strong>opacity:</strong> " + child.css("opacity") + "<br />");
				out.push("<strong>height:</strong> " + child.css("height") + "<br />");
				out.push("<strong>z-index:</strong> " + child.css("z-index") + "<br />");
				out.push("<strong>font-size:</strong> " + child.css("font-size") + "<br />");
				out.push("<strong>scale:</strong> " + child.data("roundabout").currentScale);
				out.push("</div>");

				child.html(out.join(""));
			}

			// trigger event
			child.trigger("reposition");
			
			// callback
			callback.apply(self);

			return methods.isInFocus.apply(self, [data.degrees]);
		},



		// manipulation
		// -----------------------------------------------------------------------

		// setBearing
		// changes the bearing of the roundabout
		setBearing: function(bearing, callback) {
			callback = callback || function() {};
			bearing = methods.normalize.apply(null, [bearing]);

			this
				.each(function() {
					var diff, lowerValue, higherValue,
					    self = $(this),
					    data = self.data("roundabout"),
					    oldBearing = data.bearing;

					// set bearing
					data.bearing = bearing;
					self.trigger("bearingSet");
					methods.updateChildren.apply(self);

					// not animating? we're done here
					diff = Math.abs(oldBearing - bearing);
					if (!data.animating || diff > 180) {
						return;
					}

					// check to see if any of the children went through the back
					diff = Math.abs(oldBearing - bearing);
					self.children(data.childSelector).each(function(i) {
						var eventType;

						if (methods.isChildBackDegreesBetween.apply($(this), [bearing, oldBearing])) {
							eventType = (oldBearing > bearing) ? "Clockwise" : "Counterclockwise";
							$(this).trigger("move" + eventType + "ThroughBack");
						}
					});
				});

			// call callback if one was given
			callback.apply(this);
			return this;
		},


		// adjustBearing
		// change the bearing of the roundabout by a given degree
		adjustBearing: function(delta, callback) {
			callback = callback || function() {};
			if (delta === 0) {
				return this;
			}

			this
				.each(function() {
					methods.setBearing.apply($(this), [$(this).data("roundabout").bearing + delta]);
				});

			callback.apply(this);
			return this;
		},


		// setTilt
		// changes the tilt of the roundabout
		setTilt: function(tilt, callback) {
			callback = callback || function() {};

			this
				.each(function() {
					$(this).data("roundabout").tilt = tilt;
					methods.updateChildren.apply($(this));
				});

			// call callback if one was given
			callback.apply(this);
			return this;
		},


		// adjustTilt
		// changes the tilt of the roundabout
		adjustTilt: function(delta, callback) {
			callback = callback || function() {};

			this
				.each(function() {
					methods.setTilt.apply($(this), [$(this).data("roundabout").tilt + delta]);
				});

			callback.apply(this);
			return this;
		},



		// animation
		// -----------------------------------------------------------------------

		// animateToBearing
		// animates the roundabout to a given bearing, all animations come through here
		animateToBearing: function(bearing, duration, easing, passedData, callback) {
			var now = (new Date()).getTime();

			callback = callback || function() {};

			// find callback function in arguments
			if ($.isFunction(passedData)) {
				callback = passedData;
				passedData = null;
			} else if ($.isFunction(easing)) {
				callback = easing;
				easing = null;
			} else if ($.isFunction(duration)) {
				callback = duration;
				duration = null;
			}

			this
				.each(function() {
					var timer, easingFn, newBearing,
					    self = $(this),
					    data = self.data("roundabout"),
					    thisDuration = (!duration) ? data.duration : duration,
					    thisEasingType = (easing) ? easing : data.easing || "swing";

					// is this your first time?
					if (!passedData) {
						passedData = {
							timerStart: now,
							start: data.bearing,
							totalTime: thisDuration
						};
					}

					// update the timer
					timer = now - passedData.timerStart;

					if (data.stopAnimation) {
						methods.allowAnimation.apply(self);
						data.animating = false;
						return;
					}

					// we need to animate more
					if (timer < thisDuration) {
						if (!data.animating) {
							self.trigger("animationStart");
						}

						data.animating = true;

						if (typeof $.easing.def === "string") {
							easingFn = $.easing[thisEasingType] || $.easing[$.easing.def];
							newBearing = easingFn(null, timer, passedData.start, bearing - passedData.start, passedData.totalTime);
						} else {
							newBearing = $.easing[thisEasingType]((timer / passedData.totalTime), timer, passedData.start, bearing - passedData.start, passedData.totalTime);
						}

						// fixes issue #24, animation changed as of jQuery 1.7.2
						// also addresses issue #29, using easing breaks "linear"
						if (methods.compareVersions.apply(null, [$().jquery, "1.7.2"]) >= 0 && !($.easing["easeOutBack"])) {
							newBearing = passedData.start + ((bearing - passedData.start) * newBearing);
						}

						newBearing = methods.normalize.apply(null, [newBearing]);
						data.dragBearing = newBearing;

						methods.setBearing.apply(self, [newBearing, function() {
							setTimeout(function() {  // done with a timeout so that each step is displayed
								methods.animateToBearing.apply(self, [bearing, thisDuration, thisEasingType, passedData, callback]);
							}, 0);
						}]);

					// we're done animating
					} else {
						data.lastAnimationStep = true;

						bearing = methods.normalize.apply(null, [bearing]);
						methods.setBearing.apply(self, [bearing, function() {
							self.trigger("animationEnd");
						}]);
						data.animating = false;
						data.lastAnimationStep = false;
						data.dragBearing = bearing;

						callback.apply(self);
					}
				});

			return this;
		},


		// animateToNearbyChild
		// animates roundabout to a nearby child
		animateToNearbyChild: function(passedArgs, which) {
			var duration = passedArgs[0],
			    easing = passedArgs[1],
			    callback = passedArgs[2] || function() {};

			// find callback
			if ($.isFunction(easing)) {
				callback = easing;
				easing = null;
			} else if ($.isFunction(duration)) {
				callback = duration;
				duration = null;
			}

			return this
				.each(function() {
					var j, range,
					    self = $(this),
					    data = self.data("roundabout"),
					    bearing = (!data.reflect) ? data.bearing % 360 : data.bearing,
					    length = self.children(data.childSelector).length;

					if (!data.animating) {
						// reflecting, not moving to previous || not reflecting, moving to next
						if ((data.reflect && which === "previous") || (!data.reflect && which === "next")) {
							// slightly adjust for rounding issues
							bearing = (Math.abs(bearing) < data.floatComparisonThreshold) ? 360 : bearing;

							// clockwise
							for (j = 0; j < length; j += 1) {
								range = {
									lower: (data.period * j),
									upper: (data.period * (j + 1))
								};
								range.upper = (j === length - 1) ? 360 : range.upper;

								if (bearing <= Math.ceil(range.upper) && bearing >= Math.floor(range.lower)) {
									if (length === 2 && bearing === 360) {
										methods.animateToDelta.apply(self, [-180, duration, easing, callback]);
									} else {
										methods.animateBearingToFocus.apply(self, [range.lower, duration, easing, callback]);
									}
									break;
								}
							}
						} else {
							// slightly adjust for rounding issues
							bearing = (Math.abs(bearing) < data.floatComparisonThreshold || 360 - Math.abs(bearing) < data.floatComparisonThreshold) ? 0 : bearing;

							// counterclockwise
							for (j = length - 1; j >= 0; j -= 1) {
								range = {
									lower: data.period * j,
									upper: data.period * (j + 1)
								};
								range.upper = (j === length - 1) ? 360 : range.upper;

								if (bearing >= Math.floor(range.lower) && bearing < Math.ceil(range.upper)) {
									if (length === 2 && bearing === 360) {
										methods.animateToDelta.apply(self, [180, duration, easing, callback]);
									} else {
										methods.animateBearingToFocus.apply(self, [range.upper, duration, easing, callback]);
									}
									break;
								}
							}
						}
					}
				});
		},


		// animateToNearestChild
		// animates roundabout to the nearest child
		animateToNearestChild: function(duration, easing, callback) {
			callback = callback || function() {};

			// find callback
			if ($.isFunction(easing)) {
				callback = easing;
				easing = null;
			} else if ($.isFunction(duration)) {
				callback = duration;
				duration = null;
			}

			return this
				.each(function() {
					var nearest = methods.getNearestChild.apply($(this));
					methods.animateToChild.apply($(this), [nearest, duration, easing, callback]);
				});
		},


		// animateToChild
		// animates roundabout to a given child position
		animateToChild: function(childPosition, duration, easing, callback) {
			callback = callback || function() {};

			// find callback
			if ($.isFunction(easing)) {
				callback = easing;
				easing = null;
			} else if ($.isFunction(duration)) {
				callback = duration;
				duration = null;
			}

			return this
				.each(function() {
					var child,
					    self = $(this),
					    data = self.data("roundabout");

					if (data.childInFocus !== childPosition && !data.animating) {
						child = self.children(data.childSelector).eq(childPosition);
						methods.animateBearingToFocus.apply(self, [child.data("roundabout").degrees, duration, easing, callback]);
					}
				});
		},


		// animateToNextChild
		// animates roundabout to the next child
		animateToNextChild: function(duration, easing, callback) {
			return methods.animateToNearbyChild.apply(this, [arguments, "next"]);
		},


		// animateToPreviousChild
		// animates roundabout to the preious child
		animateToPreviousChild: function(duration, easing, callback) {
			return methods.animateToNearbyChild.apply(this, [arguments, "previous"]);
		},


		// animateToDelta
		// animates roundabout to a given delta (in degrees)
		animateToDelta: function(degrees, duration, easing, callback) {
			callback = callback || function() {};

			// find callback
			if ($.isFunction(easing)) {
				callback = easing;
				easing = null;
			} else if ($.isFunction(duration)) {
				callback = duration;
				duration = null;
			}

			return this
				.each(function() {
					var delta = $(this).data("roundabout").bearing + degrees;
					methods.animateToBearing.apply($(this), [delta, duration, easing, callback]);
				});
		},


		// animateBearingToFocus
		// animates roundabout to bring a given angle into focus
		animateBearingToFocus: function(degrees, duration, easing, callback) {
			callback = callback || function() {};

			// find callback
			if ($.isFunction(easing)) {
				callback = easing;
				easing = null;
			} else if ($.isFunction(duration)) {
				callback = duration;
				duration = null;
			}

			return this
				.each(function() {
					var delta = $(this).data("roundabout").bearing - degrees;
					delta = (Math.abs(360 - delta) < Math.abs(delta)) ? 360 - delta : -delta;
					delta = (delta > 180) ? -(360 - delta) : delta;

					if (delta !== 0) {
						methods.animateToDelta.apply($(this), [delta, duration, easing, callback]);
					}
				});
		},


		// stopAnimation
		// if an animation is currently in progress, stop it
		stopAnimation: function() {
			return this
				.each(function() {
					$(this).data("roundabout").stopAnimation = true;
				});
		},


		// allowAnimation
		// clears the stop-animation hold placed by stopAnimation
		allowAnimation: function() {
			return this
				.each(function() {
					$(this).data("roundabout").stopAnimation = false;
				});
		},



		// autoplay
		// -----------------------------------------------------------------------

		// startAutoplay
		// starts autoplaying this roundabout
		startAutoplay: function(callback) {
			return this
				.each(function() {
					var self = $(this),
					    data = self.data("roundabout");

					callback = callback || data.autoplayCallback || function() {};

					clearInterval(data.autoplayInterval);
					data.autoplayInterval = setInterval(function() {
						methods.animateToNextChild.apply(self, [callback]);
					}, data.autoplayDuration);
					data.autoplayIsRunning = true;
					
					self.trigger("autoplayStart");
				});
		},


		// stopAutoplay
		// stops autoplaying this roundabout
		stopAutoplay: function(keepAutoplayBindings) {
			return this
				.each(function() {
					clearInterval($(this).data("roundabout").autoplayInterval);
					$(this).data("roundabout").autoplayInterval = null;
					$(this).data("roundabout").autoplayIsRunning = false;
					
					// this will prevent autoplayPauseOnHover from restarting autoplay
					if (!keepAutoplayBindings) {
						$(this).unbind(".autoplay");
					}
					
					$(this).trigger("autoplayStop");
				});
		},
		
		
		// toggleAutoplay
		// toggles autoplay pause/resume
		toggleAutoplay: function(callback) {
			return this
				.each(function() {
					var self = $(this),
					    data = self.data("roundabout");

					callback = callback || data.autoplayCallback || function() {};

					if (!methods.isAutoplaying.apply($(this))) {
						methods.startAutoplay.apply($(this), [callback]);
					} else {
						methods.stopAutoplay.apply($(this), [callback]);
					}
				});
		},


		// isAutoplaying
		// is this roundabout currently autoplaying?
		isAutoplaying: function() {
			return (this.data("roundabout").autoplayIsRunning);
		},


		// changeAutoplayDuration
		// stops the autoplay, changes the duration, restarts autoplay
		changeAutoplayDuration: function(duration) {
			return this
				.each(function() {
					var self = $(this),
					    data = self.data("roundabout");

					data.autoplayDuration = duration;

					if (methods.isAutoplaying.apply(self)) {
						methods.stopAutoplay.apply(self);
						setTimeout(function() {
							methods.startAutoplay.apply(self);
						}, 10);
					}
				});
		},



		// helpers
		// -----------------------------------------------------------------------

		// normalize
		// regulates degrees to be >= 0.0 and < 360
		normalize: function(degrees) {
			var inRange = degrees % 360.0;
			return (inRange < 0) ? 360 + inRange : inRange;
		},


		// normalizeRad
		// regulates radians to be >= 0 and < Math.PI * 2
		normalizeRad: function(radians) {
			while (radians < 0) {
				radians += (Math.PI * 2);
			}

			while (radians > (Math.PI * 2)) {
				radians -= (Math.PI * 2);
			}

			return radians;
		},


		// isChildBackDegreesBetween
		// checks that a given child's backDegrees is between two values
		isChildBackDegreesBetween: function(value1, value2) {
			var backDegrees = $(this).data("roundabout").backDegrees;

			if (value1 > value2) {
				return (backDegrees >= value2 && backDegrees < value1);
			} else {
				return (backDegrees < value2 && backDegrees >= value1);
			}
		},


		// getAnimateToMethod
		// takes a user-entered option and maps it to an animation method
		getAnimateToMethod: function(effect) {
			effect = effect.toLowerCase();

			if (effect === "next") {
				return "animateToNextChild";
			} else if (effect === "previous") {
				return "animateToPreviousChild";
			}

			// default selection
			return "animateToNearestChild";
		},
		
		
		// relayoutChildren
		// lays out children again with new contextual information
		relayoutChildren: function() {
			return this
				.each(function() {
					var self = $(this),
					    settings = $.extend({}, self.data("roundabout"));

					settings.startingChild = self.data("roundabout").childInFocus;
					methods.init.apply(self, [settings, null, true]);
				});
		},


		// getNearestChild
		// gets the nearest child from the current bearing
		getNearestChild: function() {
			var self = $(this),
			    data = self.data("roundabout"),
			    length = self.children(data.childSelector).length;

			if (!data.reflect) {
				return ((length) - (Math.round(data.bearing / data.period) % length)) % length;
			} else {
				return (Math.round(data.bearing / data.period) % length);
			}
		},


		// degToRad
		// converts degrees to radians
		degToRad: function(degrees) {
			return methods.normalize.apply(null, [degrees]) * Math.PI / 180.0;
		},


		// getPlacement
		// returns the starting degree for a given child
		getPlacement: function(child) {
			var data = this.data("roundabout");
			return (!data.reflect) ? 360.0 - (data.period * child) : data.period * child;
		},


		// isInFocus
		// is this roundabout currently in focus?
		isInFocus: function(degrees) {
			var diff,
			    self = this,
			    data = self.data("roundabout"),
			    bearing = methods.normalize.apply(null, [data.bearing]);

			degrees = methods.normalize.apply(null, [degrees]);
			diff = Math.abs(bearing - degrees);

			// this calculation gives a bit of room for javascript float rounding
			// errors, it looks on both 0deg and 360deg ends of the spectrum
			return (diff <= data.floatComparisonThreshold || diff >= 360 - data.floatComparisonThreshold);
		},
		
		
		// getChildInFocus
		// returns the current child in focus, or false if none are in focus
		getChildInFocus: function() {
			var data = $(this).data("roundabout");
			
			return (data.childInFocus > -1) ? data.childInFocus : false;
		},


		// compareVersions
		// compares a given version string with another
		compareVersions: function(baseVersion, compareVersion) {
			var i,
			    base = baseVersion.split(/\./i),
			    compare = compareVersion.split(/\./i),
			    maxVersionSegmentLength = (base.length > compare.length) ? base.length : compare.length;

			for (i = 0; i <= maxVersionSegmentLength; i++) {
				if (base[i] && !compare[i] && parseInt(base[i], 10) !== 0) {
					// base is higher
					return 1;
				} else if (compare[i] && !base[i] && parseInt(compare[i], 10) !== 0) {
					// compare is higher
					return -1;
				} else if (base[i] === compare[i]) {
					// these are the same, next
					continue;
				}

				if (base[i] && compare[i]) {
					if (parseInt(base[i], 10) > parseInt(compare[i], 10)) {
						// base is higher
						return 1;
					} else {
						// compare is higher
						return -1;
					}
				}
			}

			// nothing was triggered, versions are the same
			return 0;
		}
	};


	// start the plugin
	$.fn.roundabout = function(method) {
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === "object" || $.isFunction(method) || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error("Method " + method + " does not exist for jQuery.roundabout.");
		}
	};
})(jQuery);
/**
* hoverIntent r6 // 2011.02.26 // jQuery 1.5.1+
* <http://cherne.net/brian/resources/jquery.hoverIntent.html>
* 
* @param  f  onMouseOver function || An object with configuration options
* @param  g  onMouseOut function  || Nothing (use configuration options object)
* @author    Brian Cherne brian(at)cherne(dot)net
*/
(function($){jQuery.fn.hoverIntent=function(f,g){var cfg={sensitivity:7,interval:100,timeout:0};cfg=jQuery.extend(cfg,g?{over:f,out:g}:f);var cX,cY,pX,pY;var track=function(ev){cX=ev.pageX;cY=ev.pageY};var compare=function(ev,ob){ob.hoverIntent_t=clearTimeout(ob.hoverIntent_t);if((Math.abs(pX-cX)+Math.abs(pY-cY))<cfg.sensitivity){jQuery(ob).unbind("mousemove",track);ob.hoverIntent_s=1;return cfg.over.apply(ob,[ev])}else{pX=cX;pY=cY;ob.hoverIntent_t=setTimeout(function(){compare(ev,ob)},cfg.interval)}};var delay=function(ev,ob){ob.hoverIntent_t=clearTimeout(ob.hoverIntent_t);ob.hoverIntent_s=0;return cfg.out.apply(ob,[ev])};var handleHover=function(e){var ev=jQuery.extend({},e);var ob=this;if(ob.hoverIntent_t){ob.hoverIntent_t=clearTimeout(ob.hoverIntent_t)}if(e.type=="mouseenter"){pX=ev.pageX;pY=ev.pageY;jQuery(ob).bind("mousemove",track);if(ob.hoverIntent_s!=1){ob.hoverIntent_t=setTimeout(function(){compare(ev,ob)},cfg.interval)}}else{jQuery(ob).unbind("mousemove",track);if(ob.hoverIntent_s==1){ob.hoverIntent_t=setTimeout(function(){delay(ev,ob)},cfg.timeout)}}};return this.bind('mouseenter',handleHover).bind('mouseleave',handleHover)}})(jQuery);
/*! jCarousel - v0.3.1 - 2014-04-26
* http://sorgalla.com/jcarousel
* Copyright (c) 2014 Jan Sorgalla; Licensed MIT */
/* START Twitter Widget JS */
window.twttr = (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0],
        t = window.twttr || {};
    if (d.getElementById(id)) return t;
    js = d.createElement(s);
    js.id = id;
    js.src = "https://platform.twitter.com/widgets.js";
    fjs.parentNode.insertBefore(js, fjs);

    t._e = [];
    t.ready = function(f) {
      t._e.push(f);
    };

    return t;
}(document, "script", "twitter-wjs"));
/* END Twitter Widget JS */
/*  
 * global.js - Needs more refactoring 
 */
;(function($, window, document, undefined) {

    //indexOf array method implementation if not method of that type is found
    $(document).ready(function() {
     /* Initialize Colorbox */
        $('a.gallery').colorbox();
     /* Initialize Slot Machine variables */
        var slides = $("#feature_viewport > ul > li");
        $('#feature_viewport li:last-child').addClass("last");
        jQuery.fn.exists = function(){return this.length>0;};
        
        if (!Array.prototype.indexOf) {
            Array.prototype.indexOf = function (searchElement /*, fromIndex */ ) {
                "use strict";
                if (this === null) {
                    throw new TypeError();
                }
                var t = Object(this);
                var len = t.length >>> 0;
                if (len === 0) {
                    return -1;
                }
                var n = 0;
                if (arguments.length > 1) {
                    n = Number(arguments[1]);
                    if (n !== n) { // shortcut for verifying if it's NaN
                        n = 0;
                    } else if (n !== 0 && n != Infinity && n != -Infinity) {
                        n = (n > 0 || -1) * Math.floor(Math.abs(n));
                    }
                }
                if (n >= len) {
                    return -1;
                }
                var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
                for (; k < len; k++) {
                    if (k in t && t[k] === searchElement) {
                        return k;
                    }
                }
                return -1;
            };
        }   
        
       $("#feature_viewport ul > li:last-child a:last").keydown("focusout", function (e) {
            $("#feature_menu li.selecte").removeClass("selected");

                if (e.which === 9 && e.shiftKey) {
                      // do nothing
                } else if (e.which === 9) {     
                   if($("#main_landing").exists()){
                        $("#your_us_passport_container").focus();
                    } else if ($("#emergency_section").exists()){
                        $("#emergency_section").focus();
                    } else if($("#main").exists()){
                        $("#autocomplete_AbductionStates_container").focus();     
                    } else if($("#main_no_rail").exists()){
                        $("#main_no_rail").focus();            
                    } else {        
                        $("#main_footer_links").focus();
                    }
            };
        });    
    
            
        $("#lower_footer p ").keydown("focusout", function (e) {
            if (e.which === 9 && e.shiftKey) {
                $("#lower_footer li:last-child").find("a:first").focus();
            } else if (e.which === 9) {
                $("#top_link_bar").focus();
            }
        });
        
       $("#feature_menu li:first-child").focusin(function (e) {
           if (e.which === 9) {
            	$("#feature_menu").removeClass("selected");
            	$(this).addClass("selected");
           }
        });

        $("#feature_menu li").on("keydown", function (e) {

           var $prev, $next, $current = $("#feature_menu li.selected");
           if (e.which === 9 && e.shiftKey) {
                $prev = $current.prev("li");
                if ($prev.length) {
                    e.preventDefault();
                    $current.removeClass("selected");
                    $prev.addClass("selected");
                    $prev.focus();   
                    $prev.trigger("click");
                } 
            } else if (e.which === 9) {
                $next = $current.next("li");
                if ($next.length) {
                    e.preventDefault();
                    $current.removeClass("selected");
                    $next.addClass("selected"); 
                    $next.focus();   
                    $next.trigger("click");
                } else {
                    if($("#main_landing").exists()){
                        $("#your_us_passport_container").focus();
                    } else if ($("#emergency_section").exists()){
                        $("#emergency_section").focus();
                    } else if($("#main").exists()){
                        $("#autocomplete_AbductionStates_container").focus();     
                    } else if($("#main_no_rail").exists()){
                        $("#main_no_rail").focus();            
                    } else {        
                        $("#main_footer_links").focus();
                    }  
                }
            }
        });
        
        // Feature Slider Component
        if( !$("#feature_box_shadow").hasClass("authorEnv") ) {
            //not in authoring environment
            var selected_index = 0;
            var arrow = $('#arrow_indicator');
            var default_menu_item = $('#feature_menu li:first-child');
            
            $('#feature_viewport li').each(function(){
                $(this).hide();
            });
            $('#feature_viewport li:first-child').show();

            $("#feature_menu li:first-child").addClass("selected");
            
            // calculation is the difference between the selected item's height and the arrow's height, divided by two
            arrow.css("top", (default_menu_item.outerHeight()  - arrow.outerHeight())/2 + "px");
            arrow.show();
            var menu_items = $('#feature_menu li');
            var height_accumalator = 0;
            var menu_item_heights = $.map(menu_items, function(menu_item){
                height_accumalator = height_accumalator + $(menu_item).outerHeight();
                return height_accumalator;
            });

            // add 0 to the beginning of array
            menu_item_heights.unshift(0);
            menu_items.keydown(function(e) {
                var code = (e.keyCode ? e.keyCode : e.which),
                    selected_item = $(this),
                    index = selected_item.index();

                if (code === 13) { //Enter key press on 
                    e.preventDefault();
                    if(selected_index === index) {
                        menu_items.removeClass("selected");
                        selected_item.addClass("selected");
                        slides.eq(index).find('a:first').focus();
                        return false;
                    }

                    selected_index = index;
                    menu_items.removeClass("selected");
                    selected_item.addClass("selected");
                    //animate arrow slider
                    arrow.clearQueue().animate({top : menu_item_heights[index] + (selected_item.outerHeight()  - arrow.outerHeight())/2 }, 500); 

                    slides.each(function() {
                        $(this).hide();  
                    });

                    slides.eq(index).show().focus();
                }
            });
            menu_items.click(function(e) {
                
                var selected_item = $(this),
                    index = selected_item.index();
                
                e.preventDefault();
                                
                if(selected_index === index) {
                    return false;
                }
                
                selected_index = index;
                menu_items.removeClass("selected");
                selected_item.addClass("selected");

                //animate arrow slider
                arrow.clearQueue().animate({top : menu_item_heights[index] + (selected_item.outerHeight()  - arrow.outerHeight())/2 }, 500); 
                
                slides.each(function() {
                    $(this).hide();  
                });
                  
                slides.eq(index).show().focus();
            });
            
            $("#feature_viewport li#slide-1 a").each(function () { 
                $(this).attr('tabindex', 2); 
            });
            $("#feature_viewport li#slide-2 a").each(function () { 
                $(this).attr('tabindex', 4); 
            });
            $("#feature_viewport li#slide-3 a").each(function () { 
                $(this).attr('tabindex', 6); 
            });
            if(("#feature_viewport li#slide-4").length){
                $("#feature_viewport li#slide-4 a").each(function () { 
                    $(this).attr('tabindex', 8); 
                });
            }
            if(("#feature_viewport li#slide-5").length){
                $("#feature_viewport li#slide-5 a").each(function () { 
                    $(this).attr('tabindex', 10); 
                });
            }
            if(("#feature_viewport li#slide-6").length){
                $("#feature_viewport li#slide-6 a").each(function () { 
                    $(this).attr('tabindex', 12); 
                });
            }
            
            
            
//            $("#feature_viewport li").keypress(function(e) {
//                var code = (e.keyCode ? e.keyCode : e.which);            
//                if (code === 13) {
//                    e.preventDefault();
//                    document.location = $(this).find("a").attr('href');
//
//                }
//            });

            
            
        } else {
            //In Authoring Environment

            var menu_items = $("#feature_menu li");
            var slides = $("#feature_viewport > ul > li");

            //make sure selected slow shows up on page load
            slides.eq($("#feature_menu li.selected").index()).addClass("selected");


            menu_items.click(function(e){
                var index = $(this).index();
                if(!$(this).hasClass("selected")){
                    //not selected
                    slides
                        .removeClass("selected")
                        .eq(index)
                        .addClass("selected");
                    menu_items
                        .removeClass("selected");
                    $(this).addClass("selected");       
                }else{
                    //selected
                }
            });

        }
    
        var datesToUpdate = $(".update_date", "body.processing-times");

        var getCurrentDate = function(){
            var weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            var month = ["January","February","March","April","May","June","July","August","September","October","November","December"];

            var currentDate = new Date();

            var dayOfWeek = weekday[currentDate.getDay()];
            var month = month[currentDate.getMonth()];
            var dayOfMonth = currentDate.getDate();
            var year = currentDate.getFullYear();


            // Thursday August 9, 2012
            output = dayOfWeek + ", " + month + " " + dayOfMonth + ", " + year;

            return output;
        };
        if(datesToUpdate.length > 0){
            var currentDate = getCurrentDate();
            datesToUpdate.each(function(i){
                var thisDate = $(this);
                thisDate.text(currentDate);
            });
        }
        /*******************************
        Class in Body Updates for Mega Menu Categories
        *******************************/           
        if($("body#passports .breadcrumb").is(':contains("Your Passports"),:contains("News"),:contains("Información en español")')){
            $('body#passports').addClass("passports");
	};          
        if($("body#passports .breadcrumb").is(':contains("While Abroad")')){
            $('body#passports').addClass("abroad");
	};             
        if($("body#passports .breadcrumb").is(':contains("Before You Go")')){
            $('body#passports').addClass("go");
	};              
        if($("body#passports .breadcrumb").is(':contains("Emergencies Abroad")')){
            $('body#passports').addClass("emergencies");
	};                 
        if($("body#passports .breadcrumb").is(':contains("Alerts and Warnings")')){
            $('body#passports').addClass("country");
	};     
        if($("body#travel .breadcrumb").is(':contains("U.S. Citizens Abroad")')){
            $('body#travel').addClass("us-citizens-abroad");
	};        
        if($("body#travel .breadcrumb").is(':contains("U.S. Visas")')){
            $('body#travel').addClass("us-visas");
	};       
        if($("body#travel.reference-materials .breadcrumb").is(':contains("Visas")')){
            $('body#travel').addClass("visas-information");
	};  
        if($("body#travel .breadcrumb").is(':contains("Information for Visas")')){
            $('body#travel').addClass("visas");
	};
        if($("body.site-sia .breadcrumb").is(':contains("Special Issuance Passport"),:contains("Status Checks")')){
            $('body.site-sia').addClass("category1");
	};
        if($("body.site-sia .breadcrumb").is(':contains("Pre-Travel"),:contains("Post-Departure")')){
            $('body.site-sia').addClass("category2");
	};
        if($("body.site-sia .breadcrumb").is(':contains("Contact Us"),:contains("Emergencies"),:contains("Asked Questions"),:contains("Stolen Passports")')){
            $('body.site-sia').addClass("category5");
	};
        
        /*******************************
        Mobile Friendly Button and Passport Wizard Display
        *******************************/    
        $('button.btn-mobile').click(function () {
            $('html').toggleClass('no-scroll');
            $('#passport_wizard').toggleClass('mobile-friendly');
            $('button.btn-mobile').toggleClass('mobile-friendly');
            $('html, body').scrollTo('button.btn-mobile');
            $('.fees #passport_wizard').toggleClass('greyOut'); 
        });
                        
        var windowWidth = $(window).width();        
	if(windowWidth < 768){
            $('#processing_method input').change(function () {
                $('html, body').scrollTo('#delivery_method', {offset: {left:-45}});
                });
            }    
            
        $('.info-button').click(function () {
            $('.info-box').toggleClass('info-show');
            });
                        
        $('.info-button').keydown(function(e){
            if(e.keyCode === 13 || e.keyCode === 8){
                $('.info-box').toggleClass('info-show');
            }
        });
            
        /* Is Mobile */    
        var isMobile = {
            Android: function() {
                return navigator.userAgent.match(/Android/i);
            },
            BlackBerry: function() {
                return navigator.userAgent.match(/BlackBerry/i);
            },
            BlackBerry10: function() {
                return navigator.userAgent.match(/BB10/i);
            },
            iOS: function() {
                return navigator.userAgent.match(/iPhone|iPad|iPod/i);
            },
            Opera: function() {
                return navigator.userAgent.match(/Opera Mini/i);
            },
            Windows: function() {
                return navigator.userAgent.match(/IEMobile/i);
            },
            any: function() {
                return (isMobile.Android() || isMobile.BlackBerry() || isMobile.BlackBerry10() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
            }
        };
        
        if(isMobile.any()) {
        


