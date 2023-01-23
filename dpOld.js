class Dp{
    /**
       calenderOption: {
                    display: monthOnly/yearOnly/monthYear/dayOnly/dayMonth,
                    displayTimeFormat: false/24/12
                    interval:false/custom
                }
      }
     */

    
    constructor(options){
        this.type = options.type;
        this.theme = options.theme;
        this.calenderOption = options.calenderOption;
        this.domReference = options.target;
        this.monthNames = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
        this.dayNames = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thurshday", "Friday", "Saturday" ]

        this.currentCalenderInfo = this.getBasic();

        if(!options.hasOwnProperty('selected')){
            this.selected = {
                year:this.currentCalenderInfo.year,
                month:this.currentCalenderInfo.month,
                day:this.currentCalenderInfo.day,
                hour:this.currentCalenderInfo.hour,
                minute:this.currentCalenderInfo.minutes
            }
        }else{
            this.selected = options.selected;
        }

        //UIs
        this.timeUi = this.getTimeUi();
        this.monthUi = this.getMonthUi();
        this.dateUi = this.getDateUi();
        this.yearUi = this.getYearUi();
        this.calenderUi = this.getCalender();

    }

    getCalender(){
        var calenderUi = '';
        const display = this.calenderOption.hasOwnProperty('display') ? this.calenderOption.display : '';
        switch(display){
            case "monthYear":
                calenderUi = `<div class="ical">${this.monthUi + this.yearUi}</div>`;
                break;
            case "yearMonth":
                calenderUi = `<div class="ical">${this.yearUi + this.monthUi}</div>`;
                break;
            case "dayMonth":
                calenderUi = `<div class="ical">${this.dateUi + this.monthUi }</div>`;
                break;
            case "monthDay":
                calenderUi = `<div class="ical">${this.monthUi + this.dateUi }</div>`;
                break;
            case "monthOnly":
                calenderUi = `<div class="ical">${this.monthUi}</div>`;
                break;
            case "yearOnly":
                calenderUi = `<div class="ical">${this.yearUi}</div>`;
                break;
            case "dayOnly":
                calenderUi = `<div class="ical">${this.dateUi}</div>`;
                break;
            case "timeOnly":
                calenderUi = `<div class="ical">${this.timeUi}</div>`;
                break;
            default:
                calenderUi = `<div class="ical">${this.yearUi + this.monthUi + this.dateUi + this.timeUi}</div>`;
                break;
        }

        return calenderUi;
    }

    render(){
        var cal = document.createElement('div');
        cal.classList.add("cal-wrapper");
        cal.innerHTML = this.calenderUi;
        document.body.appendChild(cal);
    }

    getMonthUi(){
        let monthTemplate = `<div class="select-wrapper">
                                    <div class="upper-shadow"></div>
                                    <select size="3" class="cal-dropdown month">`;
        var selected = '';

        for(var monthIndex =  0; monthIndex <= 11; monthIndex++){
            if(monthIndex === this.selected.month + 1){
                selected = "selected";
            }
            monthTemplate += `<option onmouseover="${this.function2.bind(this, monthIndex)}" ${selected} value="${+monthIndex + +1}">
                                ${this.monthNames[monthIndex]}
                              </option>`;
        }
        monthTemplate += `</select>
                            <div class="lower-shadow"></div>
                        </div>`;
        return monthTemplate;
    }

    function2 = (mindex) => {
        console.log(this.monthNames[mindex]);
    }
    getYearUi(){
        var selected = '';
        let yearTemplate = `<div class="select-wrapper">
                            <div class="upper-shadow"></div>
                            <select size="3" class="cal-dropdown year">`;
        for(var yearCount = 1970; yearCount <= 2070; yearCount++){
            if(yearCount === this.selected.year){
                selected = "selected";
            }
            yearTemplate += `<option ${selected} value="${yearCount}">${yearCount}</option>`;
        }
        yearTemplate += `</select>
                            <div class="lower-shadow"></div>
                        </div>`;
        return yearTemplate;
    }

    getDateUi(){
        const {year,month} = this.selected;
        const totalNumberOfDays = this.getDaysInMonth(year,month);

        let dayTemplate = `<div class="select-wrapper">
                            <div class="upper-shadow"></div>
                            <select size="3" class="cal-dropdown day">`;
        for(var dayCount = 0; dayCount <= totalNumberOfDays; dayCount++){
            dayTemplate += `<option value="${('0' + dayCount).slice(-2)}">${('0' + dayCount).slice(-2)}</option>`;
        }
        dayTemplate += `</select>
                            <div class="lower-shadow"></div>
                        </div>`;
        return dayTemplate;
    }

    getTimeUi(){
        let timeUiDiv = '';
        let hmtemplate = {};
        switch(this.calenderOption.displayTimeFormat){
            case 12:
                hmtemplate = this.getHourMinute(11); //0-11
                let ampmTemplate = `<select size="2" class="cal-dropdown ampm">
                                        <option value="">AM</option>
                                        <option value="">PM</option>
                                    </select>`;

                timeUiDiv = `<div class="cal-time">
                                    ${hmtemplate.hourTemplate + hmtemplate.minuteTemplate + ampmTemplate}
                                </div>`
                break;
            case 24:
                hmtemplate = this.getHourMinute(23); //0-23
                timeUiDiv = `<div class="cal-time">
                                    ${hmtemplate.hourTemplate + hmtemplate.minuteTemplate}
                              </div>`
                break;
            case false:
                timeUiDiv = '';
        }

        return timeUiDiv;
    }


    getHourMinute(maxHour){
        let hourTemplate = `<div class="select-wrapper">
                                <div class="upper-shadow"></div>
                                <select size="3" class="cal-dropdown hours">`;

        let minuteTemplate = `<div class="select-wrapper">
                                <div class="upper-shadow"></div>
                                <select size="3" class="cal-dropdown minutes">`;

        for(var hour = 0;hour <= maxHour; hour++){
            hourTemplate += `<option value="${('0' + hour).slice(-2)}">${('0' + hour).slice(-2)}</option>`;
        }
        hourTemplate += `</select>
                         <div class="lower-shadow"></div>
                        </div>`;

        for(var minute = 0;minute <= 59; minute++){
            minuteTemplate += `<option value="${('0' + minute).slice(-2)}">${('0' + minute).slice(-2)}</option>`;
        }
        minuteTemplate += `</select>
                            <div class="lower-shadow"></div>
                           </div>`;

        return{
            hourTemplate:hourTemplate,
            minuteTemplate:minuteTemplate
        }
    }

    setDate(){

    }

    getDaysInMonth(year,month){
        return new Date(year, month + 1, 0).getDate();
    }

    getBasic(year=false,month=false,date=false){
        var date = new Date;
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

        console.log(this.monthNames[month]);

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

}


const options = {
    type:"basic",
    theme:"dark",
    calenderOption:{
        displayTimeFormat: 12,
        interval:15
    }
}

const calIns = new Dp(options);
calIns.render();

const selectInputs = document.getElementsByClassName("cal-dropdown");
/*
for(var i = 0; i <= selectInputs.length - 1; i++){
    selectInputs[i].addEventListener('wheel', function(e) {
        if (this.hasFocus) {
            return;
        }
        if (e.deltaY < 0) {
            this.selectedIndex = Math.max(this.selectedIndex - 1, 0);
        }
        if (e.deltaY > 0) {
            this.selectedIndex = Math.min(this.selectedIndex + 1, this.length);
        }
    });
}
*/