class Dp{
    /**
     * 
       calenderOption: {
                    display: monthOnly/yearOnly/monthYear/dayOnly/dayMonth,
                    displayTimeFormat: false/24/12
                    interval:false/custom
                }
      }

     */

    constructor(options){
        this.options = options;
        this.init();
        this.domReference.addEventListener("click",this.showCal.bind(this));
        this.setDate();

    }
    
    init(){
        this.setDateAndMonths();
        this.setCalenderConfig();
        this.setCurrentCalenderInfo();
        this.setSelected();
        this.initiateDom();
        this.render();
    }
    setDateAndMonths(){
        this.monthNames = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
        this.dayNames = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thurshday", "Friday", "Saturday" ];
    }

    setCalenderConfig(){
        this.type = this.options.type;
        this.theme = this.options.theme;
        this.calenderOption = this.options.calenderOption;
        this.domReference = this.options.target;
    }

    setCurrentCalenderInfo(){
        if(!this.options.hasOwnProperty('date')){
            this.currentCalenderInfo = this.getBasic();
        }else{
            this.currentCalenderInfo = this.getBasic(this.options.date);
        }
    }

    initiateDom(){
        //gatherElementsDOMs
        this.timeDom = this.getNewTimeUi();
        this.monthDom = this.getNewMonthUi();
        this.dateDom = this.getNewDateUi();
        this.yearDom = this.getNewYearUi();
        this.calenderDom = this.getCalenderDom();
    }

    setSelected(){
        this.selected = {
            year:this.currentCalenderInfo.year,
            month:this.currentCalenderInfo.month,
            day:this.currentCalenderInfo.day,
            hour:this.currentCalenderInfo.hour,
            minute:this.currentCalenderInfo.minutes
        }
        
        if(this.selected.hour >= 12){
            this.calenderOption.displayTimeFormat = 24;
        }
    }

    getCalenderDom(){
        var calenderUi = '';
        const display = this.calenderOption.hasOwnProperty('display') ? this.calenderOption.display : '';

        switch(display){
            case "monthYear":
                calenderUi = document.createElement("div");
                calenderUi.classList.add("ical");
                calenderUi.appendChild(this.monthDom);
                calenderUi.appendChild(this.yearDom);
                break;
            case "yearMonth":
                calenderUi = document.createElement("div");
                calenderUi.classList.add("ical");
                calenderUi.appendChild(this.yearDom);
                calenderUi.appendChild(this.monthDom);
                break;
            case "dayMonth":
                calenderUi = document.createElement("div");
                calenderUi.classList.add("ical");
                calenderUi.appendChild(this.dateDom);
                calenderUi.appendChild(this.monthDom);
                break;
            case "monthDay":
                calenderUi = document.createElement("div");
                calenderUi.classList.add("ical");
                calenderUi.appendChild(this.monthDom);
                calenderUi.appendChild(this.dateDom);
                break;
            case "monthOnly":
                calenderUi = document.createElement("div");
                calenderUi.classList.add("ical");
                calenderUi.appendChild(this.monthDom);
                break;
            case "yearOnly":
                calenderUi = document.createElement("div");
                calenderUi.classList.add("ical");
                calenderUi.appendChild(this.yearDom);
                break;
            case "dayOnly":
                calenderUi = document.createElement("div");
                calenderUi.classList.add("ical");
                calenderUi.appendChild(this.dateDom);
                break;
            case "timeOnly":
                calenderUi = document.createElement("div");
                calenderUi.classList.add("ical");
                calenderUi.appendChild(this.timeDom);
                break;
            default:
                calenderUi = `<div class="ical">${this.yearUi + this.monthUi + this.dateUi + this.timeUi}</div>`;
                calenderUi = document.createElement("div");
                calenderUi.classList.add("ical");
                calenderUi.appendChild(this.yearDom);
                calenderUi.appendChild(this.monthDom);
                calenderUi.appendChild(this.dateDom);
                calenderUi.appendChild(this.timeDom);
                break;
        }

        return calenderUi;
    }

    getNewMonthUi(){
        let wrapper = document.createElement("div");
        wrapper.classList.add("select-wrapper", "dsp");
        let uppershadow = document.createElement("div");
        uppershadow.classList.add("upper-shadow");
        wrapper.appendChild(uppershadow);
        let monthdropdown = document.createElement("select");
        monthdropdown.classList.add("cal-dropdown", "month");
        monthdropdown.size = 3;
        this.appendBlankOption(monthdropdown);

        for(var monthIndex =  0; monthIndex <= 11; monthIndex++){
            let month_item = document.createElement("option");
            month_item.value = monthIndex;
            month_item.innerHTML = `${this.monthNames[monthIndex]}`;

            if(this.selected.month == monthIndex + 1){
                month_item.selected = "selected";
            }

            month_item.addEventListener("mouseover",this.monthMouseOver.bind(this,monthIndex,month_item));
            monthdropdown.appendChild(month_item);
        }

        this.appendBlankOption(monthdropdown);
        wrapper.appendChild(monthdropdown);
        let lowershadow = document.createElement("div");
        lowershadow.classList.add("lower-shadow");
        wrapper.appendChild(lowershadow);
        return wrapper;
    }


    setMonthName(index){
        console.log(this.monthNames[index]);
    }

    getNewYearUi(){
        let wrapper = document.createElement("div");
        wrapper.classList.add("select-wrapper");
        let uppershadow = document.createElement("div");
        uppershadow.classList.add("upper-shadow");
        wrapper.appendChild(uppershadow);

        let yeardropdown = document.createElement("select");
        yeardropdown.size = 3;
        yeardropdown.classList.add("cal-dropdown", "year");
        this.appendBlankOption(yeardropdown);
        for(var yearCount = 1970; yearCount <= 2070; yearCount++){
            let year_item = document.createElement("option");
            year_item.value = yearCount;
            year_item.innerHTML = yearCount;
            if(this.selected.year == yearCount){
                year_item.selected = "selected";
            }
            year_item.addEventListener("mouseover",this.yearMouseOver.bind(this,yearCount,year_item));
            yeardropdown.appendChild(year_item);
        }
        this.appendBlankOption(yeardropdown);
        wrapper.appendChild(yeardropdown);
        let lowershadow = document.createElement("div");
        lowershadow.classList.add("lower-shadow");
        wrapper.appendChild(lowershadow);
        return wrapper;

    }

    appendBlankOption(target){
        let option = document.createElement("option");
        option.value = "";
        option.innerHTML = "";
        target.appendChild(option);
    }


    getNewDateUi(){
        const {year,month} = this.selected;
        const totalNumberOfDays = this.getDaysInMonth(year,month);

        let wrapper = document.createElement("div");
        wrapper.classList.add("select-wrapper");
        let uppershadow = document.createElement("div");
        uppershadow.classList.add("upper-shadow");
        wrapper.appendChild(uppershadow);

        let daydropdown = document.createElement("select");
        daydropdown.classList.add("cal-dropdown", "day");
        daydropdown.size = 3;

        let dayEmpty = document.createElement("p");
        dayEmpty.innerHTML = "&nbsp;";
        dayEmpty.style.height = "25px";

        let dayEmptyBtm = document.createElement("p");
        dayEmptyBtm.innerHTML = "&nbsp;";
        dayEmptyBtm.style.height = "25px";

        daydropdown.appendChild(dayEmpty);
        this.appendBlankOption(daydropdown);
        for(var dayCount = 1; dayCount <= totalNumberOfDays; dayCount++){
            let day_item = document.createElement("option");
            let theday = ('0' + dayCount).slice(-2);
            day_item.innerHTML = `${theday}`;
            day_item.value = theday;
            if(this.selected.day == theday){
                day_item.selected = "selected";
            }
            day_item.addEventListener("mouseover",this.dayMouseOver.bind(this,theday,day_item));
            daydropdown.appendChild(day_item);
        }
        this.appendBlankOption(daydropdown);
        daydropdown.appendChild(dayEmptyBtm);

        wrapper.appendChild(daydropdown);
        let lowershadow = document.createElement("div");
        lowershadow.classList.add("lower-shadow");
        wrapper.appendChild(lowershadow);
        return wrapper;
    }

    getNewTimeUi(){
        var hmtemplate = {};

        switch(this.calenderOption.displayTimeFormat){
            case 12:
                hmtemplate = this.getHourMinuteNew(11); //0-11

                let wrapper = document.createElement("div");
                wrapper.classList.add("select-wrapper");
                let uppershadow = document.createElement("div");
                uppershadow.classList.add("upper-shadow");
                wrapper.appendChild(uppershadow);

                let ampmdropdown = document.createElement("select");
                ampmdropdown.classList.add("cal-dropdown", "ampm");
                ampmdropdown.size = 3;
                this.appendBlankOption(ampmdropdown);

                let am = document.createElement("option");
                am.innerHTML = "AM";
                am.value = "AM";
                am.addEventListener("mouseover",this.setAmPm.bind(this,"AM",am));
                ampmdropdown.appendChild(am);

                let pm = document.createElement("option");
                pm.innerHTML = "PM";
                pm.value = "PM";
                pm.addEventListener("mouseover",this.setAmPm.bind(this,"PM",pm));
                ampmdropdown.appendChild(pm);

                if(this.selected.hour >= 12 ){
                    pm.selected = "selected";
                }else{
                    am.selected = "selected";
                }

                this.appendBlankOption(ampmdropdown);

                var calTime = document.createElement("div");
                calTime.classList.add("cal-time");
                calTime.appendChild(hmtemplate.hourTemplate);
                calTime.appendChild(hmtemplate.minuteTemplate);
                calTime.appendChild(ampmdropdown);

                break;
            case 24:
                hmtemplate = this.getHourMinuteNew(23); //0-23
                var calTime = document.createElement("div");
                calTime.classList.add("cal-time");
                calTime.appendChild(hmtemplate.hourTemplate);
                calTime.appendChild(hmtemplate.minuteTemplate);
                break;
            case false:
                var calTime = document.createElement("div");
                calTime.style.display = "none";
                break;
        }

        return calTime;

    }

    setAmPm(data,option){
        console.log(data);
    }

    getHourMinuteNew(maxHour){

        var hourTemplate = document.createElement("div");
        hourTemplate.classList.add("select-wrapper");

        let uppershadowHour = document.createElement("div");
        uppershadowHour.classList.add("upper-shadow");

        hourTemplate.appendChild(uppershadowHour);

        let hourdropdown = document.createElement("select");
        hourdropdown.classList.add("cal-dropdown", "hour");
        hourdropdown.size = 3;

        this.appendBlankOption(hourdropdown);
        for(var hour = 0;hour <= maxHour; hour++){
            let hour_item = document.createElement("option");
            let theHour = ('0' + hour).slice(-2);
            hour_item.innerHTML = theHour;
            hour_item.value = theHour;

            if(this.selected.hour == theHour){
                hour_item.selected = "selected";
            }
            if(hour == 0){
                if(this.selected.hour == 12){
                    hour_item.selected = "selected";
                }
            }

            hour_item.addEventListener("mouseover",this.hourMouseOver.bind(this,theHour,hour_item));
            hourdropdown.appendChild(hour_item);
        }

        this.appendBlankOption(hourdropdown);
        hourTemplate.appendChild(hourdropdown);

        let lowershadowHour = document.createElement("div");
        lowershadowHour.classList.add("lower-shadow");
        hourTemplate.appendChild(lowershadowHour);


        var minuteTemplate = document.createElement("div");
        minuteTemplate.classList.add("select-wrapper");

        let uppershadowminute = document.createElement("div");
        uppershadowminute.classList.add("upper-shadow");
        minuteTemplate.appendChild(uppershadowminute);


        let minutedropdown = document.createElement("select");
        minutedropdown.classList.add("cal-dropdown", "hour");
        minutedropdown.size = 3;
        this.appendBlankOption(minutedropdown);

        for(var minute = 0;minute <= 59; minute++){
            let minute_item = document.createElement("option");
            let theMinute = ('0' + minute).slice(-2);
            minute_item.innerHTML = theMinute;
            minute_item.value = theMinute;
            if(this.selected.minute == theMinute){
                minute_item.selected = "selected";
            }
            if(minute == 0){
                if(this.selected.minute == 0){
                    minute_item.selected = "selected";
                }
            }
            minute_item.addEventListener("mouseover",this.minuteMouseOver.bind(this,theMinute,minute_item));
            minutedropdown.appendChild(minute_item);
        }
        this.appendBlankOption(minutedropdown);
        minuteTemplate.appendChild(minutedropdown);
        let lowershadowMinute = document.createElement("div");
        lowershadowMinute.classList.add("lower-shadow");
        minuteTemplate.appendChild(lowershadowMinute);

        return{
            hourTemplate:hourTemplate,
            minuteTemplate:minuteTemplate
        }
    }

    setDate(){
        var ampm = "AM";
        if(this.selected.hour >= 12){
            ampm = "PM";
        }
        this.domReference.value = `${
                                    this.selected.year + "-" + 
                                    (this.selected.month+1) + "-" + 
                                    this.selected.day + " " +
                                    this.selected.hour + ":" +
                                    this.selected.minute
                                }`;  
    }

    getDaysInMonth(year,month){
        return new Date(year, month + 1, 0).getDate();
    }

    getBasic(epoch = false){
        var date = epoch ? new Date(epoch * 1000) : new Date;
        var seconds = date.getSeconds();
        var minutes = date.getMinutes();
        var hour = date.getHours();
        var year = date.getFullYear();
        var month = date.getMonth(); // beware: January = 0; February = 1, etc.
        var day = date.getDate();
        var dayOfWeek = date.getDay(); // Sunday = 0, Monday = 1, etc.
        var milliSeconds = date.getMilliseconds();
        var days_in_months = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        if( (new Date(year, 1, 29)).getDate() == 29 ) days_in_months[1] = 29;

        var currentCalender = {
            seconds:seconds,
            minutes:minutes,
            hour:hour,
            year:year,
            month:month,
            monthName:this.monthNames[month],
            day:day,
            dayName:this.dayNames[dayOfWeek],
            dayOfWeek:dayOfWeek,
            milliSeconds:milliSeconds,
            daysInMonths:days_in_months
        }
        return currentCalender;
    }

    render(){
        const elements = document.getElementsByClassName("cal-wrapper");
        while(elements.length > 0){
            elements[0].parentNode.removeChild(elements[0]);
        }
        var cal = document.createElement('div');
        //cal.classList.add("cal-wrapper"); 
        cal.id="cal";
        cal.appendChild(this.calenderDom);
        let buttons = document.createElement("div");
        buttons.classList.add('action');

        let setButton = document.createElement("button");
        setButton.addEventListener("click",this.setDateAndHide.bind(this));
        setButton.innerText = "Set";
        setButton.classList.add("setbtn");


        let cancelButton = document.createElement("button");
        cancelButton.addEventListener("click",this.hideCal.bind(this));
        cancelButton.innerText = "Cancel";
        cancelButton.classList.add("cancelBtn");

        buttons.appendChild(cancelButton);
        buttons.appendChild(setButton);
        
        cal.appendChild(buttons);
        document.body.appendChild(cal);
    }

    showCal(){
        this.init();
        if(!(document.getElementById("cal").classList.contains("show"))){
            document.getElementById("cal").classList.add("show");
        }
    }
    hideCal(){
        document.getElementById("cal").classList.remove("show");
    }
    setDateAndHide(){
        this.setDate();
        this.hideCal();
    }

    // Mouse Over */


    minuteMouseOver(minute,option){
        this.setSelectedOnmouseOver("minute",minute,option);
    }
    hourMouseOver(hour,option){
        this.setSelectedOnmouseOver("hour",hour,option);
    }
    dayMouseOver(day,option){
        this.setSelectedOnmouseOver("day",day,option);
    }

    monthMouseOver(month,option){
        this.setSelectedOnmouseOver("month",month,option);
    }

    yearMouseOver(year,option){
        this.setSelectedOnmouseOver("year",year,option);
    }

    setSelectedOnmouseOver(selectedProperty,value,domElement){
        domElement.selected = value;
        this.selected[selectedProperty] = value;
        this.setDate();
    }   

    setMin(timestamp){

    }
    setMax(timestamp){

    }
}
