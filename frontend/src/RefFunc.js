import React, { forwardRef } from "react";
import DateFnsUtils from "@date-io/date-fns";
import {KeyboardDatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import TextField from "@material-ui/core/TextField";
const Input = (props, ref) =>{
    return(
        <TextField ref={ref} {...props} />
    )
}

export default forwardRef(Input);