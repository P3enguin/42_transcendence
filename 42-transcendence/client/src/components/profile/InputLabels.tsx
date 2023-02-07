import * as React from 'react';

function InputLabels(
    {_id, _labelValue,_value, disabled,_type= "text"}:{_id:string,_labelValue?:string,_value?:string,disabled?:boolean,_type?:string}
    ) {
    return (<>
                <label htmlFor={_id}>{_labelValue}</label>
                <input id={_id} type={_type} value={_value} disabled={disabled} ></input>
             </>
        );
}

export default InputLabels;