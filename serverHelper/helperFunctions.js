import { differenceInCalendarDays } from "date-fns";

export const checkNumberInString = (value) => {
    const stringArray = value.split("");

    for (var i = 0; i < stringArray.length; i++) {
        if (Number(stringArray[i]) || Number(stringArray[i]) === 0) {
            return false;
        }
    }
    return true;
};

export const splitRegistrationNumber = (registrationNumber) => {
    let num1 = registrationNumber.slice(0, 2).toUpperCase();
    let num2 = registrationNumber.slice(2, 4);
    let num3;
    let num4;

    if (checkNumberInString(registrationNumber.slice(4, 7))) {
        num3 = registrationNumber.slice(4, 7).toUpperCase();
        num4 = registrationNumber.slice(7, registrationNumber.length);
    } else if (checkNumberInString(registrationNumber.slice(4, 6))) {
        num3 = registrationNumber.slice(4, 6).toUpperCase();
        num4 = registrationNumber.slice(6, registrationNumber.length);
    } else if (checkNumberInString(registrationNumber.slice(4, 5))) {
        num3 = registrationNumber.slice(4, 5).toUpperCase();
        num4 = registrationNumber.slice(5, registrationNumber.length);
    }

    const response = {
        num1,
        num2,
        num3,
        num4,
    };

    return response;
};

export const errorResponse = (message) => {
    return {
        error: true,
        message: message,
    };
};

export const DateToTataAigDateConverterHandler = (date, addYears, addDays) => {
    let year, month, day, convertedDate;
    year = new Date(date).getFullYear();
    month = new Date(date).getMonth() + 1;
    day = new Date(date).getDate();
    if (month.toString().length === 1) {
        month = `0${month}`;
    }
    if (day.toString().length === 1) {
        day = `0${day}`;
    }
    if (addYears) {
        year = Number(year) + addYears;
        if (year.toString().length === 1) {
            year = `0${year}`;
        }
    }
    if (addDays) {
        day = Number(day) + addDays;
        if (day.toString().length === 1) {
            day = `0${day}`;
        }
    }
    convertedDate = `${year}${month}${day}`;
    return convertedDate;
};

export const TataAigDateToDateConverterHandler = (date) => {
    let year = date.slice(0, 4)
    let month = date.slice(4, 6)
    let day = date.slice(6, 8)

    return `${year}/${month}/${day}`;
}

export const TataAigDateModifierHandler = (date, addYears, addDays) => {
    let year, month, day, convertedDate;
    year = Number(date.toString().slice(0, 4));
    month = Number(date.toString().slice(4, 6));
    day = Number(date.toString().slice(6, 8));
    if (month.toString().length === 1) {
        month = `0${month}`;
    }
    if (day.toString().length === 1) {
        day = `0${day}`;
    }
    if (addYears) {
        year = Number(year) + addYears;
        if (year.toString().length === 1) {
            year = `0${year}`;
        }
    }
    if (addDays) {
        day = Number(day) + addDays;
        if (day.toString().length === 1) {
            day = `0${day}`;
        }
    }
    convertedDate = `${year}${month}${day}`;
    return convertedDate;
};

export const SuccessResponse = (data) => {
    return { status: 200, message: "Success", data: data };
}

export const ErrorResponse = (message) => {
    return { status: 400, message: "Error", message: message };
}

export const getNextDay = (dateValue) => {
    let nextDay = new Date(dateValue);
    nextDay.setDate(nextDay.getDate() + 1);
    return nextDay;
}

export const getNextYear = (dateValue) => {
    let nextDay = new Date(dateValue);
    nextDay.setFullYear(nextDay.getFullYear() + 1);
    return nextDay;
}

export const getPrevDay = (dateValue) => {
    let nextDay = new Date(dateValue);
    nextDay.setDate(nextDay.getDate() - 1);
    return nextDay;
}

export const getFutureDay = (dateValue, days, years) => {
    let nextDay = new Date(dateValue);
    if (years && Number(years) > 0) {
        nextDay.setFullYear(nextDay.getFullYear() + Number(years));
    }
    if (days && Number(days) > 0) {
        nextDay.setDate(nextDay.getDate() + Number(days));
    }
    return nextDay;
}

export const getPreviousDay = (dateValue, days, years) => {
    let nextDay = new Date(dateValue);
    if (years && Number(years) > 0) {
        nextDay.setFullYear(nextDay.getFullYear() - Number(years));
    }
    if (days && Number(days) > 0) {
        nextDay.setDate(nextDay.getDate() - Number(days));
    }
    return nextDay;
}

export const getStartAndEndPolicyDate = (client) => {

    let start_date = ""
    let end_date = ""

    let planType = client.c_plan.split('-');
    let third_party_tenure = planType[1];
    let own_damage_tenure = planType[3];
    let policy_tenure = 0;

    if (client.c_plan === "TP-1-OD-0") {
        policy_tenure = 1
    } else if (client.c_plan === "TP-0-OD-1") {
        policy_tenure = 1
    } else if (third_party_tenure > 0 && own_damage_tenure > 0) {
        policy_tenure = own_damage_tenure
    }

    let startDateSpace = 1;
    let endDateSpace = 0

    if (client.c_rollover) {
        if (client.c_prev_policy_expire_date) {
            let differenceDays = differenceInCalendarDays(new Date(client.c_prev_policy_expire_date), new Date())
            if (differenceDays > 0) {
                start_date = getFutureDay(new Date(client.c_prev_policy_expire_date), startDateSpace)
                end_date = getFutureDay(new Date(client.c_prev_policy_expire_date), endDateSpace, policy_tenure)
            } else {
                start_date = getFutureDay(new Date(), startDateSpace)
                end_date = getFutureDay(new Date(), endDateSpace, policy_tenure)
            }
        } else {
            start_date = getFutureDay(new Date(), startDateSpace)
            end_date = getFutureDay(new Date(), endDateSpace, policy_tenure)
        }
    } else {
        start_date = getFutureDay(new Date(), startDateSpace)
        end_date = getFutureDay(new Date(), endDateSpace, policy_tenure)
    }

    // console.log({
    //     start_date: new Date(start_date).toLocaleDateString(),
    //     end_date: new Date(end_date).toLocaleDateString()
    // })

    return {
        start_date: start_date,
        end_date: end_date
    }
}